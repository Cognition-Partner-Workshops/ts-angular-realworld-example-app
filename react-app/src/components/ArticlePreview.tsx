import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Article } from '../types';
import FavoriteButton from './FavoriteButton';

interface ArticlePreviewProps {
  article: Article;
}

export default function ArticlePreview({ article: initialArticle }: ArticlePreviewProps) {
  const [article, setArticle] = useState(initialArticle);

  const handleToggleFavorite = (favorited: boolean) => {
    setArticle(prev => ({
      ...prev,
      favorited,
      favoritesCount: favorited ? prev.favoritesCount + 1 : prev.favoritesCount - 1,
    }));
  };

  const dateStr = new Date(article.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="article-preview" data-testid="article-preview">
      <div className="article-meta">
        <Link to={`/profile/${article.author.username}`} data-testid="article-preview-author">
          <img src={article.author.image || 'https://api.realworld.io/images/smiley-cyrus.jpeg'} alt={article.author.username} />
        </Link>
        <div className="info">
          <Link to={`/profile/${article.author.username}`} className="author" data-testid="article-preview-author">
            {article.author.username}
          </Link>
          <span className="date" data-testid="article-preview-date">{dateStr}</span>
        </div>
        <div className="pull-xs-right">
          <FavoriteButton
            slug={article.slug}
            favorited={article.favorited}
            favoritesCount={article.favoritesCount}
            onToggle={handleToggleFavorite}
          />
        </div>
      </div>

      <Link to={`/article/${article.slug}`} className="preview-link">
        <h1 data-testid="article-preview-title">{article.title}</h1>
        <p data-testid="article-preview-description">{article.description}</p>
        <span>Read more...</span>
        <ul className="tag-list">
          {article.tagList.map(tag => (
            <li key={tag} className="tag-default tag-pill tag-outline">
              {tag}
            </li>
          ))}
        </ul>
      </Link>
    </div>
  );
}
