import { useState, useEffect } from "react";

// Fetch all questions
export function useQuestions(page = 1, limit = 10) {
  const [questions, setQuestions] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchQuestions() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/questions?page=${page}&limit=${limit}`);
      if (!res.ok) throw new Error("Failed to fetch questions");
      const data = await res.json();
      setQuestions(data.questions || []);
      setPagination(data.pagination || null);
    } catch (err) {
      setError(err.message || "Error fetching questions");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit]); // only depend on real values

  return { questions, pagination, loading, error, refetch: fetchQuestions };
}



// Fetch a single question by slug
export function useQuestion(id) {
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchQuestion() {
      try {
        const res = await fetch(`/api/questions/${id}`);
        if (!res.ok) throw new Error("Failed to fetch question");
        const data = await res.json();
        setQuestion(data);
      } catch (err) {
        setError(err.message || "Error fetching question");
      } finally {
        setLoading(false);
      }
    }

    fetchQuestion();
  }, [id]);

  return { question, loading, error };
}


// keep this super simple and let the page handle loading/errors
export async function editQuestion(id, updatedData) {
  const res = await fetch(`/api/questions/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedData),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Failed to update question");
  }

  const data = await res.json();
  return data.question;
}


export function useDeleteQuestion(id) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  async function deleteQuestion() {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch(`/api/questions/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete question");
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Error deleting question");
    } finally {
      setLoading(false);
    }
  }

  return { deleteQuestion, loading, error, success };
}

