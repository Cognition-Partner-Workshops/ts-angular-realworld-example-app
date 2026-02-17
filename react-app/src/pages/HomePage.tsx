export default function HomePage() {
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
                <li className="nav-item">
                  <a
                    className="nav-link active"
                    href="/"
                    data-testid="feed-toggle-global"
                  >
                    Global Feed
                  </a>
                </li>
              </ul>
            </div>
            <div data-testid="article-preview" className="article-preview">
              <p>Loading articles...</p>
            </div>
          </div>

          <div className="col-md-3">
            <div className="sidebar" data-testid="tags-sidebar">
              <p>Popular Tags</p>
              <div className="tag-list">
                <span className="tag-pill tag-default" data-testid="tag-pill">
                  Loading tags...
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
