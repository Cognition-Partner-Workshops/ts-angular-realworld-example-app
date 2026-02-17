import { Link } from "react-router-dom";
import type { Article } from "../types";
import type { ReactNode } from "react";
import { defaultImage } from "../utils/defaultImage";

interface ArticleMetaProps {
  article: Article;
  children?: ReactNode;
}

export default function ArticleMeta({ article, children }: ArticleMetaProps) {
  const authorImage = defaultImage(article.author.image);
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
