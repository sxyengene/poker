import type { Session } from "../types";

/**
 * 统一的模拟数据，确保在任何环境中都使用相同的数据
 */
export class MockData {
  /**
   * 获取预设的模拟会话数据
   */
  static getMockSessions(): Session[] {
    const mockSessions: any[] = [
      // 盈利的现金游戏
      {
        id: "1",
        createdAt: "2024-09-21T02:30:00.000Z",
        sessionType: {
          session: "Cash Game",
          location: "Crown Casino",
          game: "NL Texas Hold Em",
          stakes: "2/5",
          isTournament: false,
        },
        startTime: "2024-09-20T19:00:00.000Z",
        endTime: "2024-09-21T02:30:00.000Z",
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
        id: "2",
        createdAt: "2024-09-19T01:00:00.000Z",
        sessionType: {
          session: "Cash Game",
          location: "Home Game",
          game: "NL Texas Hold Em",
          stakes: "1/2",
          isTournament: false,
        },
        startTime: "2024-09-18T20:00:00.000Z",
        endTime: "2024-09-19T01:00:00.000Z",
        buyIn: 500,
        cashOut: 320,
        rebuys: 200,
        tableExpenses: 30,
        notes:
          "Tough table, got coolooled twice. Need to work on fold discipline.",
        tags: ["Bad Beat", "Learning"],
      },

      // 盈利的锦标赛
      {
        id: "3",
        createdAt: "2024-09-15T21:30:00.000Z",
        sessionType: {
          session: "Tournament",
          location: "Star City Casino",
          game: "Tournament",
          stakes: "150",
          isTournament: true,
        },
        startTime: "2024-09-15T12:00:00.000Z",
        endTime: "2024-09-15T21:30:00.000Z",
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
        id: "4",
        createdAt: "2024-09-12T23:45:00.000Z",
        sessionType: {
          session: "Cash Game",
          location: "The Reef Hotel Casino",
          game: "Pot Limit Omaha",
          stakes: "1/3",
          isTournament: false,
        },
        startTime: "2024-09-12T18:30:00.000Z",
        endTime: "2024-09-12T23:45:00.000Z",
        buyIn: 600,
        cashOut: 920,
        rebuys: 150,
        tableExpenses: 45,
        notes:
          "First time playing PLO live. Took some time to adjust but ended up positive.",
        tags: ["PLO", "New Game", "Learning"],
      },

      // 高额桌现金游戏
      {
        id: "5",
        createdAt: "2024-09-10T18:30:00.000Z",
        sessionType: {
          session: "Cash Game",
          location: "Crown Casino",
          game: "NL Texas Hold Em",
          stakes: "5/10",
          isTournament: false,
        },
        startTime: "2024-09-10T16:00:00.000Z",
        endTime: "2024-09-10T18:30:00.000Z",
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
        id: "6",
        createdAt: "2024-09-09T00:30:00.000Z",
        sessionType: {
          session: "Cash Game",
          location: "PokerStars Online",
          game: "NL Texas Hold Em",
          stakes: "1/2",
          isTournament: false,
        },
        startTime: "2024-09-08T21:00:00.000Z",
        endTime: "2024-09-09T00:30:00.000Z",
        buyIn: 400,
        cashOut: 285,
        rebuys: 100,
        tableExpenses: 0,
        notes: "Online grind session. Variance was not on my side tonight.",
        tags: ["Online", "Grind", "Variance"],
      },

      // 长时间马拉松会话
      {
        id: "7",
        createdAt: "2024-09-06T07:00:00.000Z",
        sessionType: {
          session: "Cash Game",
          location: "Home Game",
          game: "Mixed",
          stakes: "2/5",
          isTournament: false,
        },
        startTime: "2024-09-05T19:00:00.000Z",
        endTime: "2024-09-06T07:00:00.000Z",
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
        id: "8",
        createdAt: "2024-09-03T23:15:00.000Z",
        sessionType: {
          session: "Tournament",
          location: "Local Pub",
          game: "Tournament",
          stakes: "25",
          isTournament: true,
        },
        startTime: "2024-09-03T19:30:00.000Z",
        endTime: "2024-09-03T23:15:00.000Z",
        buyIn: 25,
        cashOut: 0,
        rebuys: 25,
        tableExpenses: 10,
        notes:
          "Busted out before the money. Made a bad call with AK against a tight player.",
        tags: ["Small Stakes", "Bust Out", "Learning"],
      },

      // 最新会话 - 盈利
      {
        id: "9",
        createdAt: "2024-10-10T02:00:00.000Z",
        sessionType: {
          session: "Cash Game",
          location: "Online Poker",
          game: "NL Texas Hold Em",
          stakes: "0.5/1",
          isTournament: false,
        },
        startTime: "2024-10-09T22:00:00.000Z",
        endTime: "2024-10-10T02:00:00.000Z",
        buyIn: 200,
        cashOut: 450,
        rebuys: 100,
        tableExpenses: 15,
        notes:
          "Great session online. Managed to bluff successfully on the river multiple times.",
        tags: ["Online", "Winning", "Bluffs"],
      },

      // 最新会话 - 亏损
      {
        id: "10",
        createdAt: "2024-10-12T01:30:00.000Z",
        sessionType: {
          session: "Tournament",
          location: "Casino Grand",
          game: "Tournament",
          stakes: "200",
          isTournament: true,
        },
        startTime: "2024-10-11T14:00:00.000Z",
        endTime: "2024-10-12T01:30:00.000Z",
        buyIn: 200,
        cashOut: 0,
        rebuys: 100,
        tableExpenses: 30,
        notes:
          "Tough tournament. Made it to the final table but lost all my chips in a bad beat.",
        tags: ["Tournament", "Final Table", "Bad Beat"],
      },
    ];

    // 转换日期字符串为 Date 对象
    return mockSessions.map((session) => ({
      ...session,
      startTime: new Date(session.startTime),
      endTime: new Date(session.endTime),
    })) as Session[];
  }

  /**
   * 获取数据统计摘要
   */
  static getDataSummary(): string {
    const sessions = this.getMockSessions();

    if (sessions.length === 0) {
      return "没有会话数据";
    }

    // 计算总利润
    const totalProfit = sessions.reduce((sum, session) => {
      const profit =
        session.cashOut -
        session.buyIn -
        session.rebuys -
        session.tableExpenses;
      return sum + profit;
    }, 0);

    // 计算胜率
    const winningSessions = sessions.filter((session) => {
      const profit =
        session.cashOut -
        session.buyIn -
        session.rebuys -
        session.tableExpenses;
      return profit > 0;
    }).length;

    const winRate =
      sessions.length > 0 ? (winningSessions / sessions.length) * 100 : 0;

    return `
模拟数据摘要:
- 总会话数: ${sessions.length}
- 总利润: $${totalProfit.toFixed(2)}
- 胜率: ${winRate.toFixed(1)}%
    `.trim();
  }
}
