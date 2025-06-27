import {useState, useEffect, useCallback} from 'react';
import {SessionData, NewSession} from '../types/session';
import {sessionStorage} from '../services/sessionStorage';

export const useSessions = () => {
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 加载会话数据
  const loadSessions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const loadedSessions = sessionStorage.getSessions();
      setSessions(loadedSessions);
    } catch (err) {
      setError('加载会话数据失败');
      console.error('Load sessions error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 添加新会话
  const addSession = useCallback(async (newSession: NewSession) => {
    try {
      setError(null);
      const savedSession = sessionStorage.saveSession(newSession);
      setSessions(prevSessions => [savedSession, ...prevSessions]);
      return savedSession;
    } catch (err) {
      setError('保存会话数据失败');
      console.error('Save session error:', err);
      throw err;
    }
  }, []);

  // 删除会话
  const deleteSession = useCallback(async (sessionId: string) => {
    try {
      setError(null);
      sessionStorage.deleteSession(sessionId);
      setSessions(prevSessions =>
        prevSessions.filter(session => session.id !== sessionId),
      );
    } catch (err) {
      setError('删除会话数据失败');
      console.error('Delete session error:', err);
      throw err;
    }
  }, []);

  // 更新会话
  const updateSession = useCallback(
    async (sessionId: string, updates: Partial<SessionData>) => {
      try {
        setError(null);
        sessionStorage.updateSession(sessionId, updates);
        setSessions(prevSessions =>
          prevSessions.map(session =>
            session.id === sessionId ? {...session, ...updates} : session,
          ),
        );
      } catch (err) {
        setError('更新会话数据失败');
        console.error('Update session error:', err);
        throw err;
      }
    },
    [],
  );

  // 获取统计数据
  const getStats = useCallback(() => {
    return sessionStorage.getStats();
  }, [sessions]); // 依赖sessions，当sessions变化时重新计算

  // 刷新数据
  const refresh = useCallback(() => {
    loadSessions();
  }, [loadSessions]);

  // 初始化时加载数据
  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  return {
    sessions,
    loading,
    error,
    addSession,
    deleteSession,
    updateSession,
    getStats,
    refresh,
  };
};
