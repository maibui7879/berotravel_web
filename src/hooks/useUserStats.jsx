import { useState, useEffect, useRef } from "react";
import { getMyStats, getUserStatsById } from "../services/userServices/StatServices";

const statsCache = {};

export const useUserStats = (userId = null) => {
  const [stats, setStats] = useState(() => statsCache[userId || "me"] || null);
  const [loading, setLoading] = useState(!stats);
  const [error, setError] = useState(null);
  const isMounted = useRef(true);
    
  const fetchStats = async () => {
    if (statsCache[userId || "me"]) {
      setStats(statsCache[userId || "me"]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = userId ? await getUserStatsById(userId) : await getMyStats();
      statsCache[userId || "me"] = data;
      if (isMounted.current) setStats(data);
    } catch (err) {
      if (isMounted.current) {
        setError(err);
        setStats(null);
      }
    } finally {
      if (isMounted.current) setLoading(false);
    }
  };

  useEffect(() => {
    isMounted.current = true;
    fetchStats();
    return () => {
      isMounted.current = false;
    };
  }, [userId]);

  const refetch = async () => {
    statsCache[userId || "me"] = null; 
    await fetchStats();
  };

  return { stats, loading, error, refetch };
};
