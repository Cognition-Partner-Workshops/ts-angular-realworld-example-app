import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getTags } from '../api/tags';

interface TagsSidebarProps {
  onTagClick?: (tag: string) => void;
}

export default function TagsSidebar({ onTagClick }: TagsSidebarProps) {
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTags()
      .then(data => {
        setTags(data.tags);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="sidebar" data-testid="tags-sidebar">
      <p>Popular Tags</p>
      <div className="tag-list">
        {loading && <span>Loading tags...</span>}
        {!loading && tags.length === 0 && <span>No tags are here... yet.</span>}
        {tags.map(tag => (
          <Link
            key={tag}
            to={`/tag/${tag}`}
            className="tag-default tag-pill"
            data-testid="tag-pill"
            onClick={e => {
              if (onTagClick) {
                e.preventDefault();
                onTagClick(tag);
              }
            }}
          >
            {tag}
          </Link>
        ))}
      </div>
    </div>
  );
}
