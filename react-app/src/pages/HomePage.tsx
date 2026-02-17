import { useMemo, useState, useCallback } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import type { ArticleListConfig } from '../types';
import ArticleList from '../components/ArticleList';
import TagsSidebar from '../components/TagsSidebar';

export default function HomePage() {
  const { tag: routeTag } = useParams<{ tag?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const feed = searchParams.get('feed');
  const pageParam = searchParams.get('page');
  const currentPage = pageParam ? parseInt(pageParam, 10) : 1;

  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const activeTag = routeTag || selectedTag;

  const isFollowingFeed = feed === 'following' && isAuthenticated;

  const listConfig: ArticleListConfig = useMemo(() => {
    if (activeTag) {
      return { type: 'all', filters: { tag: activeTag } };
    }
    if (isFollowingFeed) {
      return { type: 'feed', filters: {} };
    }
    return { type: 'all', filters: {} };
  }, [activeTag, isFollowingFeed]);

  const handlePageChange = useCallback((page: number) => {
    const params: Record<string, string> = {};
    if (feed) params.feed = feed;
    if (page > 1) params.page = String(page);
    setSearchParams(params);
  }, [feed, setSearchParams]);

  const handleTagClick = useCallback((tag: string) => {
    setSelectedTag(tag);
    setSearchParams({});
  }, [setSearchParams]);

  const handleGlobalFeedClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setSelectedTag(null);
    if (routeTag) {
      navigate('/');
    } else {
      setSearchParams({});
    }
  };

  const handleYourFeedClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setSelectedTag(null);
    if (routeTag) {
      navigate('/?feed=following');
    } else {
      setSearchParams({ feed: 'following' });
    }
  };

  const isGlobalActive = listConfig.type === 'all' && !activeTag;
  const isYourFeedActive = listConfig.type === 'feed';

  return (
    <div className="home-page" data-testid="home-page">
      <div className="banner">
        <div className="container">
          <h1 className="logo-font">conduit</h1>
          <p>A place to share your knowledge.</p>
        </div>
      </div>

      <div className="container page">
        <div className="row">
          <div className="col-md-9">
            <div className="feed-toggle">
              <ul className="nav nav-pills outline-active">
                {isAuthenticated && (
                  <li className="nav-item">
                    <a
                      className={`nav-link${isYourFeedActive ? ' active' : ''}`}
                      href="/?feed=following"
                      onClick={handleYourFeedClick}
                      data-testid="feed-toggle-your"
                    >
                      Your Feed
                    </a>
                  </li>
                )}
                <li className="nav-item">
                  <a
                    className={`nav-link${isGlobalActive ? ' active' : ''}`}
                    href="/"
                    onClick={handleGlobalFeedClick}
                    data-testid="feed-toggle-global"
                  >
                    Global Feed
                  </a>
                </li>
                {activeTag && (
                  <li className="nav-item">
                    <a className="nav-link active" data-testid="feed-toggle-tag">
                      <i className="ion-pound"></i> {activeTag}
                    </a>
                  </li>
                )}
              </ul>
            </div>

            <ArticleList
              config={listConfig}
              currentPage={currentPage}
              isFollowingFeed={isFollowingFeed}
              onPageChange={handlePageChange}
            />
          </div>

          <div className="col-md-3">
            <TagsSidebar onTagClick={handleTagClick} />
          </div>
        </div>
      </div>
    </div>
  );
}
