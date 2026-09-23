import React, { createContext, useState, useEffect, useCallback } from 'react';
import progressService from '../services/progressService';
import { useAuth } from '../hooks/useAuth';

export const ProgressContext = createContext(null);

export const ProgressProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [progress, setProgress] = useState({
    overallPercentage: 68,
    completedTopicsCount: 24,
    totalTopicsCount: 35,
    completedQuizzesCount: 18,
    totalQuizzesCount: 22,
    avgQuizScore: 84,
    totalProjects: 6,
    streak: 7,
    hubStats: {
      technical: { total: 9, completed: 6, percentage: 67 },
      skills: { total: 8, completed: 5, percentage: 63 },
      coding: { total: 14, completed: 10, percentage: 71 },
      career: { total: 5, completed: 4, percentage: 80 },
      project: { total: 5, completed: 3, percentage: 60 },
    },
    recentTopics: [],
    completedTopicsList: ['variables-and-data-types', 'programming-basics'],
  });

  const [loading, setLoading] = useState(false);

  const fetchProgress = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const data = await progressService.getProgress();
      if (data) {
        setProgress((prev) => ({
          ...prev,
          ...data,
          completedTopicsList: data.progressList
            ? data.progressList.filter((p) => p.completed).map((p) => p.topicSlug)
            : prev.completedTopicsList,
        }));
      }
    } catch (err) {
      console.warn('[ProgressContext] Could not fetch progress:', err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  const markTopicComplete = async (topicSlug, hubSlug = 'technical') => {
    try {
      if (isAuthenticated) {
        await progressService.updateProgress({
          topicSlug,
          hubSlug,
          completed: true,
        });
      }

      setProgress((prev) => {
        const alreadyCompleted = prev.completedTopicsList?.includes(topicSlug);
        if (alreadyCompleted) return prev;

        const newCompletedList = [...(prev.completedTopicsList || []), topicSlug];
        const newCount = prev.completedTopicsCount + 1;
        const newOverall = Math.min(100, Math.round((newCount / Math.max(1, prev.totalTopicsCount)) * 80));

        const hub = prev.hubStats[hubSlug] || { total: 10, completed: 0, percentage: 0 };
        const updatedHub = {
          ...hub,
          completed: hub.completed + 1,
          percentage: Math.min(100, Math.round(((hub.completed + 1) / Math.max(1, hub.total)) * 100)),
        };

        const updated = {
          ...prev,
          completedTopicsCount: newCount,
          overallPercentage: newOverall,
          completedTopicsList: newCompletedList,
          hubStats: {
            ...prev.hubStats,
            [hubSlug]: updatedHub,
          },
        };
        localStorage.setItem('hub_local_progress', JSON.stringify(updated));
        return updated;
      });
      return true;
    } catch (err) {
      console.error('[ProgressContext] Failed to mark complete:', err);
      return false;
    }
  };

  const submitQuizProgress = async (topicSlug, hubSlug = 'technical', score, total) => {
    try {
      const pct = Math.round((score / total) * 100);
      if (isAuthenticated) {
        await progressService.updateProgress({
          topicSlug,
          hubSlug,
          completed: pct >= 70,
          quizScore: pct,
          quizTotal: total,
        });
      }

      setProgress((prev) => {
        const newCompletedQuizzes = prev.completedQuizzesCount + 1;
        const newAvg = Math.round((prev.avgQuizScore + pct) / 2);
        const updated = {
          ...prev,
          completedQuizzesCount: newCompletedQuizzes,
          avgQuizScore: newAvg,
        };
        localStorage.setItem('hub_local_progress', JSON.stringify(updated));
        return updated;
      });
    } catch (err) {
      console.error('[ProgressContext] Quiz progress update failed:', err);
    }
  };

  return (
    <ProgressContext.Provider
      value={{
        progress,
        loading,
        fetchProgress,
        markTopicComplete,
        submitQuizProgress,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};
