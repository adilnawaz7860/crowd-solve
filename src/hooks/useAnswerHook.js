import { useEffect, useState } from "react";

export function useAnswers(questionId , userId) {
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!questionId) return;

    const fetchAnswers = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/questions/${questionId}/answers`);
        if (!res.ok) throw new Error("Failed to fetch answers");
        const data = await res.json();
        setAnswers(data.answers || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnswers();
  }, [questionId]);

  const createAnswer = async (content , userId) => {
    try {
      const res = await fetch(`/api/questions/${questionId}/answers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content, userId }),
      });
      if (!res.ok) throw new Error("Failed to create answer");
      const newAnswer = await res.json();
      setAnswers((prev) => [newAnswer, ...prev]);
    } catch (err) {
      console.error(err);
    }
  };

  const voteAnswer = async (answerId, type , userId) => {
    try {
      const res = await fetch(`/api/answers/${answerId}/upvote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type , userId }), // 'UPVOTE' or 'DOWNVOTE'
      });

      if (!res.ok) throw new Error("Failed to vote");

      const updated = await res.json();

       setAnswers((prev) =>
      prev.map((ans) =>
        ans._id === answerId
          ? { ...ans, votes: updated.votes } // ✅ update the votes array
          : ans
      )
    );
    } catch (err) {
      console.error(err);
    }
  };

  return {
    answers,
    loading,
    createAnswer,
    voteAnswer,
  };
}
