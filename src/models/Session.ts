import type {
  Session,
  SessionType,
  GameType,
  StakesType,
  SessionCategory,
} from "../types";

/**
 * Session核心类 - 扑克会话管理
 */
export class SessionManager {
  private sessions: Session[] = [];

  /**
   * 创建新的会话
   */
  createSession(
    sessionData: Omit<Session, "startTime" | "endTime"> & {
      startTime: Date | string;
      endTime: Date | string;
    }
  ): Session {
    const session: Session = {
      ...sessionData,
      startTime:
        typeof sessionData.startTime === "string"
          ? new Date(sessionData.startTime)
          : sessionData.startTime,
      endTime:
        typeof sessionData.endTime === "string"
          ? new Date(sessionData.endTime)
          : sessionData.endTime,
    };

    this.validateSession(session);
    this.sessions.push(session);
    return session;
  }

  /**
   * 验证会话数据
   */
  private validateSession(session: Session): void {
    if (session.startTime >= session.endTime) {
      throw new Error("开始时间必须早于结束时间");
    }

    if (session.buyIn < 0) {
      throw new Error("买入金额不能为负数");
    }

    if (session.cashOut < 0) {
      throw new Error("兑现金额不能为负数");
    }

    if (session.rebuys < 0) {
      throw new Error("重买金额不能为负数");
    }

    if (session.tableExpenses < 0) {
      throw new Error("桌费不能为负数");
    }

    if (!session.sessionType.location.trim()) {
      throw new Error("位置不能为空");
    }

    if (!session.sessionType.game.trim()) {
      throw new Error("游戏类型不能为空");
    }

    if (!session.sessionType.stakes.trim()) {
      throw new Error("筹码类型不能为空");
    }
  }

  /**
   * 计算会话利润
   */
  calculateProfit(session: Session): number {
    return (
      session.cashOut - session.buyIn - session.rebuys - session.tableExpenses
    );
  }

  /**
   * 计算会话时长（小时）
   */
  calculateDuration(session: Session): number {
    const durationMs = session.endTime.getTime() - session.startTime.getTime();
    return durationMs / (1000 * 60 * 60); // 转换为小时
  }

  /**
   * 计算每小时利润
   */
  calculateHourlyProfit(session: Session): number {
    const profit = this.calculateProfit(session);
    const duration = this.calculateDuration(session);
    return duration > 0 ? profit / duration : 0;
  }

  /**
   * 获取所有会话
   */
  getAllSessions(): Session[] {
    return [...this.sessions];
  }

  /**
   * 根据ID获取会话
   */
  getSessionById(id: string): Session | undefined {
    // 这里假设Session有id字段，如果没有，需要添加
    return this.sessions.find((session) => (session as any).id === id);
  }

  /**
   * 更新会话
   */
  updateSession(id: string, updatedSession: Partial<Session>): Session | null {
    const index = this.sessions.findIndex(
      (session) => (session as any).id === id
    );
    if (index === -1) {
      return null;
    }

    const session = { ...this.sessions[index], ...updatedSession };
    this.validateSession(session as Session);
    this.sessions[index] = session as Session;
    return session as Session;
  }

  /**
   * 删除会话
   */
  deleteSession(id: string): boolean {
    const index = this.sessions.findIndex(
      (session) => (session as any).id === id
    );
    if (index === -1) {
      return false;
    }

    this.sessions.splice(index, 1);
    return true;
  }

  /**
   * 获取会话统计信息
   */
  getSessionStats(): {
    totalSessions: number;
    totalProfit: number;
    averageProfit: number;
    totalDuration: number;
    averageHourlyProfit: number;
    winRate: number;
  } {
    if (this.sessions.length === 0) {
      return {
        totalSessions: 0,
        totalProfit: 0,
        averageProfit: 0,
        totalDuration: 0,
        averageHourlyProfit: 0,
        winRate: 0,
      };
    }

    const totalProfit = this.sessions.reduce(
      (sum, session) => sum + this.calculateProfit(session),
      0
    );

    const totalDuration = this.sessions.reduce(
      (sum, session) => sum + this.calculateDuration(session),
      0
    );

    const winningSessions = this.sessions.filter(
      (session) => this.calculateProfit(session) > 0
    ).length;

    return {
      totalSessions: this.sessions.length,
      totalProfit,
      averageProfit: totalProfit / this.sessions.length,
      totalDuration,
      averageHourlyProfit: totalDuration > 0 ? totalProfit / totalDuration : 0,
      winRate: (winningSessions / this.sessions.length) * 100,
    };
  }

  /**
   * 按时间范围筛选会话
   */
  filterSessionsByDateRange(startDate: Date, endDate: Date): Session[] {
    return this.sessions.filter(
      (session) => session.startTime >= startDate && session.endTime <= endDate
    );
  }

  /**
   * 按会话类型筛选
   */
  filterSessionsByType(sessionType: SessionCategory): Session[] {
    return this.sessions.filter(
      (session) => session.sessionType.session === sessionType
    );
  }

  /**
   * 按位置筛选会话
   */
  filterSessionsByLocation(location: string): Session[] {
    return this.sessions.filter((session) =>
      session.sessionType.location
        .toLowerCase()
        .includes(location.toLowerCase())
    );
  }

  /**
   * 按游戏类型筛选会话
   */
  filterSessionsByGame(game: string): Session[] {
    return this.sessions.filter((session) =>
      session.sessionType.game.toLowerCase().includes(game.toLowerCase())
    );
  }

  /**
   * 按标签筛选会话
   */
  filterSessionsByTags(tags: string[]): Session[] {
    return this.sessions.filter(
      (session) =>
        session.tags &&
        tags.some((tag) =>
          session.tags!.some((sessionTag: string) =>
            sessionTag.toLowerCase().includes(tag.toLowerCase())
          )
        )
    );
  }

  /**
   * 获取所有唯一的位置
   */
  getAllLocations(): string[] {
    const locations = this.sessions.map(
      (session) => session.sessionType.location
    );
    return [...new Set(locations)];
  }

  /**
   * 获取所有唯一的游戏类型
   */
  getAllGameTypes(): string[] {
    const gameTypes = this.sessions.map((session) => session.sessionType.game);
    return [...new Set(gameTypes)];
  }

  /**
   * 获取所有唯一的标签
   */
  getAllTags(): string[] {
    const allTags: string[] = [];
    this.sessions.forEach((session) => {
      if (session.tags) {
        allTags.push(...session.tags);
      }
    });
    return [...new Set(allTags)];
  }

  /**
   * 导出会话数据
   */
  exportSessions(): string {
    return JSON.stringify(this.sessions, null, 2);
  }

  /**
   * 导入会话数据
   */
  importSessions(data: string): void {
    try {
      const sessions = JSON.parse(data);
      if (Array.isArray(sessions)) {
        sessions.forEach((session) => {
          this.validateSession(session);
        });
        this.sessions = sessions;
      }
    } catch (error) {
      throw new Error("导入数据格式错误");
    }
  }

  /**
   * 清空所有会话
   */
  clearAllSessions(): void {
    this.sessions = [];
  }
}
