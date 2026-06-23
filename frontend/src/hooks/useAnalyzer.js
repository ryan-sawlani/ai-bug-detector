import { useState, useCallback } from "react";
import { analyzeCode } from "../services/api";
export const useAnalyzer = () => {
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const analyze = useCallback(async (code, language) => {
    if (!code.trim()) return;
    setLoading(true); setError(null); setResult(null);
    try {
      const data = await analyzeCode(code, language);
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (err) {
      setError(err.message || "Failed to connect to backend. Is the Flask server running?");
    } finally { setLoading(false); }
  }, []);
  const reset = useCallback(() => { setResult(null); setError(null); }, []);
  return { result, loading, error, analyze, reset };
};
