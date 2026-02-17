import { Link } from "react-router-dom";
import type { Article } from "../types";
import type { ReactNode } from "react";

const DEFAULT_IMAGE = "https://api.realworld.io/images/smiley-cyrus.jpeg";

interface ArticleMetaProps {
  article: Article;
  children?: ReactNode;
}

export default function ArticleMeta({ article, children }: ArticleMetaProps) {
  const authorImage = article.author.image || DEFAULT_IMAGE;
  const formattedDate = new Date(article.createdAt).toLocaleDateString(
    "en-US",
    { year: "numeric", month: "long", day: "numeric" },
  );

  return (
    <div className="article-meta" data-testid="article-meta">
      <Link to={`/profile/${article.author.username}`}>
        <img src={authorImage} alt={article.author.username} />
      </Link>

      <div className="info">
        <Link
          className="author"
          to={`/profile/${article.author.username}`}
        >
          {article.author.username}
        </Link>
        <span className="date">{formattedDate}</span>
      </div>

      {children}
    </div>
  );
}
