import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
  useMemo,
} from 'react';
import type {SessionData, NewSession} from '../types/session';
import {sessionStorage} from '../services/sessionStorage';

export interface FilterOptions {
  sessionType: 'All' | 'Cash Game' | 'Tournament';
  location: string[];
  gameType: string[];
  stakes: string[];
  tags: string[];
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
}

interface SessionsContextType {
  sessions: SessionData[];
  filteredSessions: SessionData[];
  allSessions: SessionData[];
  loading: boolean;
  error: string | null;
  filters: FilterOptions;
  availableLocations: string[];
  availableGameTypes: string[];
  availableStakes: string[];
  availableTags: string[];
  addSession: (newSession: NewSession) => Promise<SessionData>;
  deleteSession: (sessionId: string) => Promise<void>;
  updateSession: (
    sessionId: string,
    updates: Partial<SessionData>,
  ) => Promise<void>;
  getStats: () => any;
  refresh: () => Promise<void>;
  applyFilters: (filters: FilterOptions) => void;
  clearFilters: () => void;
}

const SessionsContext = createContext<SessionsContextType | undefined>(
  undefined,
);

interface SessionsProviderProps {
  children: ReactNode;
}

const defaultFilters: FilterOptions = {
  sessionType: 'All',
  location: [],
  gameType: [],
  stakes: [],
  tags: [],
  dateRange: {start: null, end: null},
};

export const SessionsProvider: React.FC<SessionsProviderProps> = ({
  children,
}) => {
  const [allSessions, setAllSessions] = useState<SessionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters);

  // 筛选后的sessions
  const filteredSessions = useMemo(() => {
    let filtered = [...allSessions];

    // Session Type 筛选
    if (filters.sessionType !== 'All') {
      filtered = filtered.filter(
        session =>
          session.gameType === filters.sessionType ||
          (filters.sessionType === 'Cash Game' &&
            session.gameType !== 'Tournament'),
      );
    }

    // Location 筛选
    if (filters.location.length > 0) {
      filtered = filtered.filter(session =>
        filters.location.includes(session.location),
      );
    }

    // Game Type 筛选
    if (filters.gameType.length > 0) {
      filtered = filtered.filter(session =>
        filters.gameType.includes(session.gameType),
      );
    }

    // Stakes 筛选
    if (filters.stakes.length > 0) {
      filtered = filtered.filter(session =>
        filters.stakes.includes(session.blinds),
      );
    }

    // Tags 筛选
    if (filters.tags.length > 0) {
      filtered = filtered.filter(session =>
        session.tags?.some(tag => filters.tags.includes(tag)),
      );
    }

    return filtered;
  }, [allSessions, filters]);

  // 获取可用的筛选选项
  const availableLocations = useMemo(() => {
    return [...new Set(allSessions.map(session => session.location))];
  }, [allSessions]);

  const availableGameTypes = useMemo(() => {
    return [...new Set(allSessions.map(session => session.gameType))];
  }, [allSessions]);

  const availableStakes = useMemo(() => {
    return [...new Set(allSessions.map(session => session.blinds))];
  }, [allSessions]);

  const availableTags = useMemo(() => {
    const allTags = allSessions.flatMap(session => session.tags || []);
    return [...new Set(allTags)];
  }, [allSessions]);

  // 加载会话数据
  const loadSessions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const loadedSessions = sessionStorage.getSessions();
      setAllSessions(loadedSessions);
    } catch (err) {
      setError('加载会话数据失败');
      console.error('Load sessions error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 添加新会话
  const addSession = useCallback(
    async (newSession: NewSession): Promise<SessionData> => {
      try {
        setError(null);
        const savedSession = sessionStorage.saveSession(newSession);
        setAllSessions(prevSessions => [savedSession, ...prevSessions]);
        return savedSession;
      } catch (err) {
        setError('保存会话数据失败');
        console.error('Save session error:', err);
        throw err;
      }
    },
    [],
  );

  // 删除会话
  const deleteSession = useCallback(
    async (sessionId: string): Promise<void> => {
      try {
        setError(null);
        sessionStorage.deleteSession(sessionId);
        setAllSessions(prevSessions =>
          prevSessions.filter(session => session.id !== sessionId),
        );
      } catch (err) {
        setError('删除会话数据失败');
        console.error('Delete session error:', err);
        throw err;
      }
    },
    [],
  );

  // 更新会话
  const updateSession = useCallback(
    async (sessionId: string, updates: Partial<SessionData>): Promise<void> => {
      try {
        setError(null);
        sessionStorage.updateSession(sessionId, updates);
        setAllSessions(prevSessions =>
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
  }, [allSessions]); // 依赖allSessions，当sessions变化时重新计算

  // 应用筛选
  const applyFilters = useCallback((newFilters: FilterOptions) => {
    setFilters(newFilters);
  }, []);

  // 清除筛选
  const clearFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  // 刷新数据
  const refresh = useCallback(async (): Promise<void> => {
    await loadSessions();
  }, [loadSessions]);

  // 初始化时加载数据
  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const value: SessionsContextType = {
    sessions: filteredSessions, // sessions现在指向筛选后的结果
    filteredSessions,
    allSessions,
    loading,
    error,
    filters,
    availableLocations,
    availableGameTypes,
    availableStakes,
    availableTags,
    addSession,
    deleteSession,
    updateSession,
    getStats,
    refresh,
    applyFilters,
    clearFilters,
  };

  return (
    <SessionsContext.Provider value={value}>
      {children}
    </SessionsContext.Provider>
  );
};

export const useSessions = (): SessionsContextType => {
  const context = useContext(SessionsContext);
  if (context === undefined) {
    throw new Error('useSessions must be used within a SessionsProvider');
  }
  return context;
};
