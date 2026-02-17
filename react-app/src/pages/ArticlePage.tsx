import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { marked } from "marked";
import type { Article, Comment, Profile } from "../types";
import { getArticle, deleteArticle, favoriteArticle, unfavoriteArticle } from "../api/articles";
import { getComments, addComment, deleteComment } from "../api/comments";
import { useAuth } from "../auth/AuthContext";
import ArticleMeta from "../components/ArticleMeta";
import ArticleComment from "../components/ArticleComment";
import FollowButton from "../components/FollowButton";

const DEFAULT_IMAGE = "https://api.realworld.io/images/smiley-cyrus.jpeg";

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [article, setArticle] = useState<Article | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentBody, setCommentBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!slug) return;

    getArticle(slug).then(({ article: a }) => setArticle(a)).catch(() => {});
    getComments(slug).then(({ comments: c }) => setComments(c)).catch(() => {});
  }, [slug]);

  const canModify = user?.username === article?.author.username;

  const handleDeleteArticle = useCallback(async () => {
    if (!article) return;
    setIsDeleting(true);
    try {
      await deleteArticle(article.slug);
      navigate("/");
    } catch {
      setIsDeleting(false);
    }
  }, [article, navigate]);

  const handleToggleFavorite = useCallback(async () => {
    if (!article) return;
    if (!isAuthenticated) {
      navigate("/register");
      return;
    }
    try {
      if (!article.favorited) {
        const { article: updated } = await favoriteArticle(article.slug);
        setArticle(updated);
      } else {
        await unfavoriteArticle(article.slug);
        setArticle((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            favorited: false,
            favoritesCount: prev.favoritesCount - 1,
          };
        });
      }
    } catch {
      // silently fail
    }
  }, [article, isAuthenticated, navigate]);

  const handleToggleFollow = useCallback(
    (updated: Profile) => {
      setArticle((prev) => {
        if (!prev) return prev;
        return { ...prev, author: { ...prev.author, following: updated.following } };
      });
    },
    [],
  );

  const handleAddComment = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!slug || !commentBody.trim()) return;
      setIsSubmitting(true);
      try {
        const { comment } = await addComment(slug, commentBody);
        setComments((prev) => [comment, ...prev]);
        setCommentBody("");
      } catch {
        // silently fail
      } finally {
        setIsSubmitting(false);
      }
    },
    [slug, commentBody],
  );

  const handleDeleteComment = useCallback(
    async (comment: Comment) => {
      if (!slug) return;
      try {
        await deleteComment(slug, comment.id);
        setComments((prev) => prev.filter((c) => c.id !== comment.id));
      } catch {
        // silently fail
      }
    },
    [slug],
  );

  if (!article) {
    return (
      <div className="article-page">
        <div className="container">
          <div className="row">
            <div className="col-md-12">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  const articleHtml = marked(article.body) as string;

  const actionButtons = canModify ? (
    <span>
      <Link
        className="btn btn-sm btn-outline-secondary"
        to={`/editor/${article.slug}`}
        data-testid="article-edit"
      >
        <i className="ion-edit"></i> Edit Article
      </Link>

      <button
        className={`btn btn-sm btn-outline-danger${isDeleting ? " disabled" : ""}`}
        onClick={handleDeleteArticle}
        disabled={isDeleting}
        data-testid="article-delete"
      >
        <i className="ion-trash-a"></i> Delete Article
      </button>
    </span>
  ) : (
    <span>
      <FollowButton profile={article.author} onToggle={handleToggleFollow} />

      <button
        className={`btn btn-sm${article.favorited ? " btn-primary" : " btn-outline-primary"}`}
        onClick={handleToggleFavorite}
        data-testid="article-favorite"
      >
        <i className="ion-heart"></i>
        &nbsp;
        {article.favorited ? "Unfavorite" : "Favorite"} Article
        <span className="counter"> ({article.favoritesCount})</span>
      </button>
    </span>
  );

  return (
    <div className="article-page">
      <div className="banner">
        <div className="container">
          <h1 data-testid="article-title">{article.title}</h1>

          <ArticleMeta article={article}>
            {actionButtons}
          </ArticleMeta>
        </div>
      </div>

      <div className="container page">
        <div className="row article-content">
          <div className="col-md-12">
            <div
              data-testid="article-body"
              dangerouslySetInnerHTML={{ __html: articleHtml }}
            />

            <ul className="tag-list" data-testid="article-tags">
              {article.tagList.map((tag) => (
                <li key={tag} className="tag-default tag-pill tag-outline">
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr />

        <div className="article-actions">
          <ArticleMeta article={article}>
            {actionButtons}
          </ArticleMeta>
        </div>

        <div className="row">
          <div className="col-xs-12 col-md-8 offset-md-2">
            {isAuthenticated ? (
              <form className="card comment-form" onSubmit={handleAddComment}>
                <fieldset disabled={isSubmitting}>
                  <div className="card-block">
                    <textarea
                      className="form-control"
                      placeholder="Write a comment..."
                      rows={3}
                      value={commentBody}
                      onChange={(e) => setCommentBody(e.target.value)}
                      data-testid="comment-form"
                    ></textarea>
                  </div>
                  <div className="card-footer">
                    <img
                      src={user?.image || DEFAULT_IMAGE}
                      className="comment-author-img"
                      alt={user?.username ?? ""}
                    />
                    <button
                      className="btn btn-sm btn-primary"
                      type="submit"
                      data-testid="comment-submit"
                    >
                      Post Comment
                    </button>
                  </div>
                </fieldset>
              </form>
            ) : (
              <p>
                <Link to="/login">Sign in</Link> or{" "}
                <Link to="/register">sign up</Link> to add comments on this
                article.
              </p>
            )}

            {comments.map((comment) => (
              <ArticleComment
                key={comment.id}
                comment={comment}
                onDelete={handleDeleteComment}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
