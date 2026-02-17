import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Article, ArticleListConfig } from '../types';
import { listArticles } from '../api/articles';
import ArticlePreview from './ArticlePreview';
import Pagination from './Pagination';

interface ArticleListProps {
  config: ArticleListConfig;
  currentPage: number;
  isFollowingFeed: boolean;
  onPageChange: (page: number) => void;
}

const LIMIT = 10;

export default function ArticleList({ config, currentPage, isFollowingFeed, onPageChange }: ArticleListProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [articlesCount, setArticlesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setArticles([]);

    const queryConfig: ArticleListConfig = {
      ...config,
      filters: {
        ...config.filters,
        limit: LIMIT,
        offset: LIMIT * (currentPage - 1),
      },
    };

    listArticles(queryConfig)
      .then(data => {
        if (cancelled) return;
        setArticles(data.articles);
        setArticlesCount(data.articlesCount);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [config, currentPage]);

  if (loading) {
    return <div className="article-preview">Loading articles...</div>;
  }

  if (articles.length === 0) {
    return (
      <div className="article-preview empty-feed-message">
        {isFollowingFeed ? (
          <>
            Your feed is empty. Follow some users to see their articles here, or check out the{' '}
            <Link to="/">Global Feed</Link>!
          </>
        ) : (
          'No articles are here... yet.'
        )}
      </div>
    );
  }

  return (
    <>
      {articles.map(article => (
        <ArticlePreview key={article.slug} article={article} />
      ))}
      <Pagination
        totalCount={articlesCount}
        currentPage={currentPage}
        limit={LIMIT}
        onPageChange={onPageChange}
      />
    </>
  );
}
