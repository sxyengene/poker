import type { Session } from "../types";
import { MockData } from "./mock-data";

/**
 * 本地存储工具类
 */
export class SessionStorage {
  private static readonly STORAGE_KEY = "poker_sessions";
  // 添加一个标志来控制是否使用模拟数据
  private static useMockData = false;

  /**
   * 设置是否使用模拟数据
   */
  static setUseMockData(useMock: boolean): void {
    this.useMockData = useMock;
  }

  /**
   * 获取所有会话
   */
  static getAllSessions(): Session[] {
    // 如果设置为使用模拟数据，则返回模拟数据
    if (this.useMockData) {
      return MockData.getMockSessions();
    }

    try {
      const sessions = uni.getStorageSync(this.STORAGE_KEY);
      if (!sessions || !Array.isArray(sessions)) {
        return [];
      }
      return sessions.map((session: any) => ({
        ...session,
        startTime: new Date(session.startTime),
        endTime: new Date(session.endTime),
      }));
    } catch (error) {
      console.error("获取会话数据失败:", error);
      return [];
    }
  }

  /**
   * 保存会话
   */
  static saveSession(session: Omit<Session, "id" | "createdAt">): boolean {
    // 如果使用模拟数据，不实际保存
    if (this.useMockData) {
      console.log("使用模拟数据模式，不保存会话");
      return true;
    }

    try {
      const sessions = this.getAllSessions();
      const newSession = {
        ...session,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };

      sessions.push(newSession);
      uni.setStorageSync(this.STORAGE_KEY, sessions);
      return true;
    } catch (error) {
      console.error("保存会话失败:", error);
      return false;
    }
  }

  /**
   * 更新会话
   */
  static updateSession(id: string, updatedSession: Partial<Session>): boolean {
    // 如果使用模拟数据，不实际更新
    if (this.useMockData) {
      console.log("使用模拟数据模式，不更新会话");
      return true;
    }

    try {
      const sessions = this.getAllSessions();
      const index = sessions.findIndex((session) => (session as any).id === id);

      if (index === -1) {
        return false;
      }

      sessions[index] = { ...sessions[index], ...updatedSession };
      uni.setStorageSync(this.STORAGE_KEY, sessions);
      return true;
    } catch (error) {
      console.error("更新会话失败:", error);
      return false;
    }
  }

  /**
   * 删除会话
   */
  static deleteSession(id: string): boolean {
    // 如果使用模拟数据，不实际删除
    if (this.useMockData) {
      console.log("使用模拟数据模式，不删除会话");
      return true;
    }

    try {
      const sessions = this.getAllSessions();
      const filteredSessions = sessions.filter(
        (session) => (session as any).id !== id
      );

      if (filteredSessions.length === sessions.length) {
        return false; // 没有找到要删除的会话
      }

      uni.setStorageSync(this.STORAGE_KEY, filteredSessions);
      return true;
    } catch (error) {
      console.error("删除会话失败:", error);
      return false;
    }
  }

  /**
   * 根据ID获取会话
   */
  static getSessionById(id: string): Session | null {
    try {
      const sessions = this.getAllSessions();
      const session = sessions.find((session) => (session as any).id === id);
      return session || null;
    } catch (error) {
      console.error("获取会话详情失败:", error);
      return null;
    }
  }

  /**
   * 清空所有会话
   */
  static clearAllSessions(): boolean {
    // 如果使用模拟数据，不实际清空
    if (this.useMockData) {
      console.log("使用模拟数据模式，不清空会话");
      return true;
    }

    try {
      uni.removeStorageSync(this.STORAGE_KEY);
      return true;
    } catch (error) {
      console.error("清空会话失败:", error);
      return false;
    }
  }

  /**
   * 导出会话数据
   */
  static exportSessions(): string {
    try {
      const sessions = this.getAllSessions();
      return JSON.stringify(sessions, null, 2);
    } catch (error) {
      console.error("导出会话数据失败:", error);
      return "[]";
    }
  }

  /**
   * 导入会话数据
   */
  static importSessions(data: string): boolean {
    // 如果使用模拟数据，不实际导入
    if (this.useMockData) {
      console.log("使用模拟数据模式，不导入会话");
      return true;
    }

    try {
      const sessions = JSON.parse(data);
      if (Array.isArray(sessions)) {
        // 验证数据格式
        const validSessions = sessions.filter((session) => {
          return (
            session.sessionType &&
            session.startTime &&
            session.endTime &&
            typeof session.buyIn === "number" &&
            typeof session.cashOut === "number"
          );
        });

        uni.setStorageSync(this.STORAGE_KEY, validSessions);
        return true;
      }
      return false;
    } catch (error) {
      console.error("导入会话数据失败:", error);
      return false;
    }
  }

  /**
   * 获取会话统计信息
   */
  static getSessionStats(): {
    totalSessions: number;
    totalProfit: number;
    averageProfit: number;
    totalDuration: number;
    averageHourlyProfit: number;
    winRate: number;
  } {
    const sessions = this.getAllSessions();

    if (!sessions || sessions.length === 0) {
      return {
        totalSessions: 0,
        totalProfit: 0,
        averageProfit: 0,
        totalDuration: 0,
        averageHourlyProfit: 0,
        winRate: 0,
      };
    }

    const totalProfit = sessions.reduce((sum, session) => {
      const profit =
        session.cashOut -
        session.buyIn -
        (session.rebuys || 0) -
        (session.tableExpenses || 0);
      return sum + profit;
    }, 0);

    const totalDuration = sessions.reduce((sum, session) => {
      const durationMs =
        session.endTime.getTime() - session.startTime.getTime();
      return sum + durationMs / (1000 * 60 * 60); // 转换为小时
    }, 0);

    const winningSessions = sessions.filter((session) => {
      const profit =
        session.cashOut -
        session.buyIn -
        (session.rebuys || 0) -
        (session.tableExpenses || 0);
      return profit > 0;
    }).length;

    return {
      totalSessions: sessions.length,
      totalProfit,
      averageProfit: totalProfit / sessions.length,
      totalDuration,
      averageHourlyProfit: totalDuration > 0 ? totalProfit / totalDuration : 0,
      winRate: (winningSessions / sessions.length) * 100,
    };
  }

  /**
   * 按时间范围筛选会话
   */
  static filterSessionsByDateRange(startDate: Date, endDate: Date): Session[] {
    const sessions = this.getAllSessions();
    return sessions.filter(
      (session) => session.startTime >= startDate && session.endTime <= endDate
    );
  }

  /**
   * 按会话类型筛选
   */
  static filterSessionsByType(sessionType: string): Session[] {
    const sessions = this.getAllSessions();
    return sessions.filter(
      (session) => session.sessionType.session === sessionType
    );
  }

  /**
   * 按位置筛选会话
   */
  static filterSessionsByLocation(location: string): Session[] {
    const sessions = this.getAllSessions();
    return sessions.filter((session) =>
      session.sessionType.location
        .toLowerCase()
        .includes(location.toLowerCase())
    );
  }

  /**
   * 按游戏类型筛选会话
   */
  static filterSessionsByGame(game: string): Session[] {
    const sessions = this.getAllSessions();
    return sessions.filter((session) =>
      session.sessionType.game.toLowerCase().includes(game.toLowerCase())
    );
  }

  /**
   * 按标签筛选会话
   */
  static filterSessionsByTags(tags: string[]): Session[] {
    const sessions = this.getAllSessions();
    return sessions.filter(
      (session) =>
        session.tags &&
        tags.some((tag) =>
          session.tags!.some((sessionTag) =>
            sessionTag.toLowerCase().includes(tag.toLowerCase())
          )
        )
    );
  }

  /**
   * 获取所有唯一的位置
   */
  static getAllLocations(): string[] {
    const sessions = this.getAllSessions();
    const locations = sessions.map((session) => session.sessionType.location);
    return [...new Set(locations)];
  }

  /**
   * 获取所有唯一的游戏类型
   */
  static getAllGameTypes(): string[] {
    const sessions = this.getAllSessions();
    const gameTypes = sessions.map((session) => session.sessionType.game);
    return [...new Set(gameTypes)];
  }

  /**
   * 获取所有唯一的标签
   */
  static getAllTags(): string[] {
    const sessions = this.getAllSessions();
    const allTags: string[] = [];
    sessions.forEach((session) => {
      if (session.tags) {
        allTags.push(...session.tags);
      }
    });
    return [...new Set(allTags)];
  }

  // 添加视图模式的存储方法
  private static readonly VIEW_MODE_KEY = "poker_view_mode";

  /**
   * 保存视图模式
   */
  static saveViewMode(mode: "compact" | "standard"): void {
    try {
      uni.setStorageSync(this.VIEW_MODE_KEY, mode);
    } catch (error) {
      console.error("保存视图模式失败:", error);
    }
  }

  /**
   * 获取视图模式
   */
  static getViewMode(): "compact" | "standard" {
    try {
      const mode = uni.getStorageSync(this.VIEW_MODE_KEY);
      return mode === "compact" || mode === "standard" ? mode : "standard";
    } catch (error) {
      console.error("获取视图模式失败:", error);
      return "standard";
    }
  }
}
