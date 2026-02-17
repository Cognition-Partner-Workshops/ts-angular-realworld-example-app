import { useParams } from "react-router-dom";

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();

  return (
    <div className="article-page" data-testid="article-page">
      <div className="banner">
        <div className="container">
          <h1 data-testid="article-title">{slug}</h1>
          <div data-testid="article-meta" className="article-meta">
            <p>Article meta placeholder</p>
          </div>
        </div>
      </div>

      <div className="container page">
        <div className="row article-content">
          <div className="col-md-12">
            <div data-testid="article-body">
              <p>Article body placeholder for: {slug}</p>
            </div>
            <ul className="tag-list" data-testid="article-tags">
              <li className="tag-default tag-pill tag-outline">placeholder</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
