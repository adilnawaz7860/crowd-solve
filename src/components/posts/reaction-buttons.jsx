"use client";

import { cn } from "../../lib/utils.js";
import { useAuth } from "../../hooks/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

const REACTION_TYPES = ["UPVOTE"];

const REACTION_ICONS = {
  UPVOTE: faArrowUp,
};

const REACTION_LABELS = {
  UPVOTE: "Upvote",
};

const REACTION_COLORS = {
  UPVOTE: {
    active: "text-blue-500 dark:text-blue-400",
    hover: "hover:text-blue-500 dark:hover:text-blue-400",
  },
};

export function ReactionButtons({ questionId, className }) {
  const { user, setShowSignInDialog } = useAuth();
  const router = useRouter();
  const { reactions, toggleReaction, isToggling } = useReactionsQuery(questionId);

  const handleReactionClick = async (type) => {
    if (!user) {
      setShowSignInDialog(true);
      return;
    }
    toggleReaction(type);
  };

  const handleSignInClick = () => {
    router.push("/auth/login")
  };

  return (
    <>
      <div className={cn("flex items-center gap-1", className)}>
        {REACTION_TYPES.map((type) => {
          const count = reactions.counts[type] ?? 0;
          const isActive = reactions.userReaction === type;
          const icon = REACTION_ICONS[type];
          const label = REACTION_LABELS[type];
          const colors = REACTION_COLORS[type];

          return (
            <button
              key={type}
              onClick={() => handleReactionClick(type)}
              disabled={isToggling}
              className={cn(
                "group flex items-center gap-1.5 rounded-full px-1 py-1.5 text-sm transition-all duration-200",
                "cursor-pointer border border-transparent",
                isToggling && "cursor-not-allowed opacity-50",
                isActive
                  ? colors.active
                  : `text-muted-foreground ${colors.hover}`,
                "disabled:hover:text-muted-foreground disabled:hover:bg-transparent"
              )}
              title={user ? `${label} this post` : "Sign in to react"}
            >
              <FontAwesomeIcon
                icon={icon}
                className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  isToggling && "animate-pulse"
                )}
              />
              {count > 0 && (
                <span
                  className={cn(
                    "text-sm font-medium tabular-nums",
                    isActive ? colors.active : "text-muted-foreground"
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}

        {!user && (
          <button
            onClick={handleSignInClick}
            className="text-muted-foreground hover:text-foreground ml-3 text-xs transition-colors cursor-pointer"
          >
            Sign in to react
          </button>
        )}
      </div>

     
    </>
  );
}
