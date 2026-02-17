import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Profile } from "../types";
import { followUser, unfollowUser } from "../api/profiles";
import { useAuth } from "../auth/AuthContext";

interface FollowButtonProps {
  profile: Profile;
  onToggle: (profile: Profile) => void;
}

export default function FollowButton({ profile, onToggle }: FollowButtonProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  async function handleClick() {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setIsSubmitting(true);
    try {
      if (!profile.following) {
        const { profile: updated } = await followUser(profile.username);
        onToggle(updated);
      } else {
        const { profile: updated } = await unfollowUser(profile.username);
        onToggle(updated);
      }
    } catch {
      // silently fail
    } finally {
      setIsSubmitting(false);
    }
  }

  const btnClass = profile.following
    ? "btn btn-sm action-btn btn-secondary"
    : "btn btn-sm action-btn btn-outline-secondary";

  return (
    <button
      className={`${btnClass}${isSubmitting ? " disabled" : ""}`}
      onClick={handleClick}
      disabled={isSubmitting}
      data-testid="article-follow"
    >
      <i className="ion-plus-round"></i>
      &nbsp;
      {profile.following ? "Unfollow" : "Follow"} {profile.username}
    </button>
  );
}
