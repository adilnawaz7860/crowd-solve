"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { cn } from "../lib/utils";

export function UserMentionInput({
  value,
  onChange,
  placeholder = "Write a answer...",
  className,
  disabled = false,
  minHeight = 100,
}) {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mentionStart, setMentionStart] = useState(-1);
  const [mentionQuery, setMentionQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const textareaRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Debounced user search
  const searchUsers = useCallback(
    debounce(async (query) => {
      if (!query.trim()) {
        setSuggestions([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      try {
        const res = await fetch(`/api/users/search?q=${query}&limit=8`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data.users || []);
        } else {
          setSuggestions([]);
        }
      } catch (err) {
        console.error("User search failed:", err);
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 300),
    []
  );

  const handleInputChange = (e) => {
    const val = e.target.value;
    const cursor = e.target.selectionStart;
    const textBeforeCursor = val.slice(0, cursor);
    const lastWord = textBeforeCursor.split(/\s/).pop();

    onChange(val);

    if (lastWord?.startsWith("@") && lastWord.length > 1) {
      const query = lastWord.slice(1);
      setMentionStart(cursor - lastWord.length);
      setMentionQuery(query);
      setShowSuggestions(true);
      setSelectedIndex(0);
      searchUsers(query);
    } else {
      setShowSuggestions(false);
      setMentionStart(-1);
      setSuggestions([]);
    }
  };

  const selectSuggestion = (user) => {
    if (mentionStart === -1 || !textareaRef.current) return;

    const before = value.slice(0, mentionStart);
    const after = value.slice(textareaRef.current.selectionStart);
    const mention = `@${user.name || user.email || "Unknown"}`;
    const newValue = before + mention + " " + after;

    onChange(newValue);
    setTimeout(() => {
      const newCursor = mentionStart + mention.length + 1;
      textareaRef.current.setSelectionRange(newCursor, newCursor);
      textareaRef.current.focus();
    }, 0);

    setShowSuggestions(false);
    setMentionStart(-1);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      selectSuggestion(suggestions[selectedIndex]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        !textareaRef.current?.contains(e.target) &&
        !suggestionsRef.current?.contains(e.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          "flex w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        style={{ minHeight: `${minHeight}px` }}
      />

      {showSuggestions && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
        >
          {isSearching ? (
            <div className="flex items-center justify-center py-3">
              <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-current"></div>
            </div>
          ) : suggestions.length === 0 ? (
            <div className="py-3 text-center text-sm text-muted-foreground">
              No users found for "{mentionQuery}"
            </div>
          ) : (
            suggestions.map((user, index) => (
              <button
                key={user.id}
                onClick={() => selectSuggestion(user)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-sm px-2 py-1.5 text-sm",
                  index === selectedIndex
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.image || undefined} />
                  <AvatarFallback>
                    {(user.name || user.email || "U").charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start">
                  <span className="font-medium">{user.name || "Unnamed"}</span>
                  {user.email && (
                    <span className="text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// Simple debounce utility
function debounce(func, delay) {
  let timeout;
  return (query) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(query), delay);
  };
}
