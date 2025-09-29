import { SessionStorage } from "./storage";
import type { Session } from "../types";

/**
 * 初始化测试数据
 */
export class InitData {
  /**
   * 创建测试会话数据
   */
  static createTestSessions(): Session[] {
    const testSessions: Omit<Session, "id" | "createdAt">[] = [
      // 盈利的现金游戏
      {
        sessionType: {
          session: "Cash Game",
          location: "Crown Casino",
          game: "NL Texas Hold Em",
          stakes: "2/5",
          isTournament: false,
        },
        startTime: new Date("2024-09-20T19:00:00"),
        endTime: new Date("2024-09-21T02:30:00"),
        buyIn: 1000,
        cashOut: 1850,
        rebuys: 300,
        tableExpenses: 80,
        notes:
          "Great session, caught a fish at the table. Hit a set of kings against AA.",
        tags: ["Lucky", "Weekend", "Late Night"],
      },

      // 亏损的现金游戏
      {
        sessionType: {
          session: "Cash Game",
          location: "Home Game",
          game: "NL Texas Hold Em",
          stakes: "1/2",
          isTournament: false,
        },
        startTime: new Date("2024-09-18T20:00:00"),
        endTime: new Date("2024-09-19T01:00:00"),
        buyIn: 500,
        cashOut: 320,
        rebuys: 200,
        tableExpenses: 30,
        notes:
          "Tough table, got coolered twice. Need to work on fold discipline.",
        tags: ["Bad Beat", "Learning"],
      },

      // 盈利的锦标赛
      {
        sessionType: {
          session: "Tournament",
          location: "Star City Casino",
          game: "Tournament",
          stakes: "150",
          isTournament: true,
        },
        startTime: new Date("2024-09-15T12:00:00"),
        endTime: new Date("2024-09-15T21:30:00"),
        buyIn: 150,
        cashOut: 1200,
        rebuys: 0,
        tableExpenses: 25,
        notes:
          "Finished 3rd out of 128 players. Great deep stack play in the final table.",
        tags: ["Tournament", "Final Table", "Weekend"],
      },

      // PLO 现金游戏
      {
        sessionType: {
          session: "Cash Game",
          location: "The Reef Hotel Casino",
          game: "Pot Limit Omaha",
          stakes: "1/3",
          isTournament: false,
        },
        startTime: new Date("2024-09-12T18:30:00"),
        endTime: new Date("2024-09-12T23:45:00"),
        buyIn: 600,
        cashOut: 920,
        rebuys: 150,
        tableExpenses: 45,
        notes:
          "First time playing PLO live. Took some time to adjust but ended up positive.",
        tags: ["PLO", "New Game", "Learning"],
      },

      // 短时间盈利会话
      {
        sessionType: {
          session: "Cash Game",
          location: "Crown Casino",
          game: "NL Texas Hold Em",
          stakes: "5/10",
          isTournament: false,
        },
        startTime: new Date("2024-09-10T16:00:00"),
        endTime: new Date("2024-09-10T18:30:00"),
        buyIn: 2000,
        cashOut: 3400,
        rebuys: 0,
        tableExpenses: 60,
        notes:
          "Quick session, hit two sets early and left while ahead. High stakes felt good.",
        tags: ["High Stakes", "Quick Win", "Disciplined"],
      },

      // 在线扑克会话
      {
        sessionType: {
          session: "Cash Game",
          location: "PokerStars Online",
          game: "NL Texas Hold Em",
          stakes: "1/2",
          isTournament: false,
        },
        startTime: new Date("2024-09-08T21:00:00"),
        endTime: new Date("2024-09-09T00:30:00"),
        buyIn: 400,
        cashOut: 285,
        rebuys: 100,
        tableExpenses: 0,
        notes: "Online grind session. Variance was not on my side tonight.",
        tags: ["Online", "Grind", "Variance"],
      },

      // 长时间马拉松会话
      {
        sessionType: {
          session: "Cash Game",
          location: "Home Game",
          game: "Mixed",
          stakes: "2/5",
          isTournament: false,
        },
        startTime: new Date("2024-09-05T19:00:00"),
        endTime: new Date("2024-09-06T07:00:00"),
        buyIn: 1000,
        cashOut: 1650,
        rebuys: 400,
        tableExpenses: 100,
        notes:
          "Epic 12-hour session with friends. Played HORSE rotation. Exhausting but fun!",
        tags: ["Marathon", "Mixed Games", "Friends", "HORSE"],
      },

      // 小额锦标赛
      {
        sessionType: {
          session: "Tournament",
          location: "Local Pub",
          game: "Tournament",
          stakes: "25",
          isTournament: true,
        },
        startTime: new Date("2024-09-03T19:30:00"),
        endTime: new Date("2024-09-03T23:15:00"),
        buyIn: 25,
        cashOut: 0,
        rebuys: 25,
        tableExpenses: 10,
        notes:
          "Busted out before the money. Made a bad call with AK against a tight player.",
        tags: ["Small Stakes", "Bust Out", "Learning"],
      },
    ];

    return testSessions as Session[];
  }

  /**
   * 初始化测试数据到存储
   */
  static initializeTestData(): boolean {
    try {
      // 检查是否已经有数据
      const existingSessions = SessionStorage.getAllSessions();

      if (existingSessions.length > 0) {
        console.log("已存在数据，跳过初始化");
        return false;
      }

      // 添加测试数据
      const testSessions = this.createTestSessions();

      let successCount = 0;
      testSessions.forEach((session) => {
        if (SessionStorage.saveSession(session)) {
          successCount++;
        }
      });

      console.log(`成功添加 ${successCount} 个测试会话`);
      return successCount > 0;
    } catch (error) {
      console.error("初始化测试数据失败:", error);
      return false;
    }
  }

  /**
   * 强制重新初始化数据（会清空现有数据）
   */
  static forceReinitialize(): boolean {
    try {
      // 清空现有数据
      SessionStorage.clearAllSessions();

      // 添加测试数据
      return this.initializeTestData();
    } catch (error) {
      console.error("强制重新初始化失败:", error);
      return false;
    }
  }

  /**
   * 获取数据统计摘要
   */
  static getDataSummary(): string {
    const sessions = SessionStorage.getAllSessions();
    const stats = SessionStorage.getSessionStats();

    return `
数据摘要:
- 总会话数: ${stats.totalSessions}
- 总利润: $${stats.totalProfit.toFixed(2)}
- 胜率: ${stats.winRate.toFixed(1)}%
- 平均时薪: $${stats.averageHourlyProfit.toFixed(2)}
- 总游戏时长: ${stats.totalDuration.toFixed(1)} 小时
    `.trim();
  }
}
