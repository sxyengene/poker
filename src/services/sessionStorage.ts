import {MMKV} from 'react-native-mmkv';
import {SessionData, NewSession} from '../types/session';

// 初始化MMKV存储
const storage = new MMKV();

const SESSIONS_KEY = 'poker_sessions';

class SessionStorageService {
  // 获取所有会话
  getSessions(): SessionData[] {
    try {
      const sessionsString = storage.getString(SESSIONS_KEY);
      if (!sessionsString) {
        return [];
      }
      const sessions = JSON.parse(sessionsString) as SessionData[];
      return sessions.map(session => ({
        ...session,
        startTime: new Date(session.startTime),
        endTime: new Date(session.endTime),
      }));
    } catch (error) {
      console.error('读取会话数据失败:', error);
      return [];
    }
  }

  // 保存新会话
  saveSession(newSession: NewSession): SessionData {
    try {
      const sessions = this.getSessions();

      // 计算时长
      const duration = this.calculateDuration(
        newSession.startTime,
        newSession.endTime,
      );

      // 生成新的会话数据
      const sessionData: SessionData = {
        id: Date.now().toString(),
        date: newSession.startTime.toISOString().split('T')[0],
        time: newSession.startTime.toLocaleTimeString('zh-CN', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        location: newSession.sessionType.location,
        duration,
        profit: newSession.cashOut - newSession.buyIn - newSession.rebuys,
        buyin: newSession.buyIn,
        cashout: newSession.cashOut,
        blinds: newSession.sessionType.stakes,
        gameType: newSession.sessionType.game,
        notes: newSession.notes,
        tags: newSession.tags,
        startTime: newSession.startTime,
        endTime: newSession.endTime,
        rebuys: newSession.rebuys,
        tableExpenses: newSession.tableExpenses,
      };

      // 添加到会话列表
      sessions.unshift(sessionData); // 新会话添加到开头

      // 保存到存储
      storage.set(SESSIONS_KEY, JSON.stringify(sessions));

      return sessionData;
    } catch (error) {
      console.error('保存会话数据失败:', error);
      throw error;
    }
  }

  // 删除会话
  deleteSession(sessionId: string): void {
    try {
      const sessions = this.getSessions();
      const filteredSessions = sessions.filter(
        session => session.id !== sessionId,
      );
      storage.set(SESSIONS_KEY, JSON.stringify(filteredSessions));
    } catch (error) {
      console.error('删除会话数据失败:', error);
      throw error;
    }
  }

  // 更新会话
  updateSession(sessionId: string, updates: Partial<SessionData>): void {
    try {
      const sessions = this.getSessions();
      const sessionIndex = sessions.findIndex(
        session => session.id === sessionId,
      );

      if (sessionIndex !== -1) {
        sessions[sessionIndex] = {...sessions[sessionIndex], ...updates};
        storage.set(SESSIONS_KEY, JSON.stringify(sessions));
      }
    } catch (error) {
      console.error('更新会话数据失败:', error);
      throw error;
    }
  }

  // 计算时长
  private calculateDuration(startTime: Date, endTime: Date): string {
    const diffMs = endTime.getTime() - startTime.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${diffHours}h ${diffMinutes}m`;
  }

  // 清除所有数据（用于测试或重置）
  clearAllSessions(): void {
    try {
      storage.delete(SESSIONS_KEY);
    } catch (error) {
      console.error('清除会话数据失败:', error);
      throw error;
    }
  }

  // 获取统计数据
  getStats() {
    const sessions = this.getSessions();
    const totalProfit = sessions.reduce(
      (sum, session) => sum + session.profit,
      0,
    );
    const totalSessions = sessions.length;
    const winRate =
      sessions.length > 0
        ? (sessions.filter(session => session.profit > 0).length /
            sessions.length) *
          100
        : 0;

    return {
      totalProfit,
      totalSessions,
      winRate: Math.round(winRate * 100) / 100,
      averageProfit: totalSessions > 0 ? totalProfit / totalSessions : 0,
    };
  }
}

// 导出单例实例
export const sessionStorage = new SessionStorageService();
