import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { favoriteArticle, unfavoriteArticle } from '../api/articles';

interface FavoriteButtonProps {
  slug: string;
  favorited: boolean;
  favoritesCount: number;
  onToggle: (favorited: boolean) => void;
}

export default function FavoriteButton({ slug, favorited, favoritesCount, onToggle }: FavoriteButtonProps) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleClick = async () => {
    if (submitting) return;

    if (!isAuthenticated) {
      navigate('/register');
      return;
    }

    setSubmitting(true);
    try {
      if (favorited) {
        await unfavoriteArticle(slug);
        onToggle(false);
      } else {
        await favoriteArticle(slug);
        onToggle(true);
      }
    } catch {
      // ignore errors
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <button
      className={`btn btn-sm ${favorited ? 'btn-primary' : 'btn-outline-primary'} ${submitting ? 'disabled' : ''}`}
      onClick={handleClick}
      disabled={submitting}
      data-testid="article-preview-favorite"
    >
      <i className="ion-heart"></i> {favoritesCount}
    </button>
  );
}
