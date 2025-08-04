import { SessionManager } from "../models/Session";
import type { Session } from "../types";
import { EXAMPLE_SESSION } from "../types";

/**
 * SessionManager使用示例
 */
export class SessionExample {
  private sessionManager: SessionManager;

  constructor() {
    this.sessionManager = new SessionManager();
  }

  /**
   * 创建示例会话
   */
  createExampleSessions(): void {
    // 创建第一个会话 - 现金游戏
    const cashGameSession = this.sessionManager.createSession({
      sessionType: {
        session: "Cash Game",
        location: "Home Game",
        game: "NL Texas Hold Em",
        stakes: "1/2",
        isTournament: false,
      },
      startTime: "2025-06-24T06:40:00",
      endTime: "2025-06-24T11:40:00",
      buyIn: 500,
      cashOut: 1200,
      rebuys: 200,
      tableExpenses: 50,
      notes: "VIP table with aggressive players",
      tags: ["Weekend", "High Stakes"],
    });

    console.log("创建现金游戏会话:", cashGameSession);

    // 创建第二个会话 - 锦标赛
    const tournamentSession = this.sessionManager.createSession({
      sessionType: {
        session: "Tournament",
        location: "Casino Royal",
        game: "Tournament",
        stakes: "100",
        isTournament: true,
      },
      startTime: "2025-06-25T14:00:00",
      endTime: "2025-06-25T22:00:00",
      buyIn: 100,
      cashOut: 800,
      rebuys: 50,
      tableExpenses: 20,
      notes: "Deep stack tournament, finished 3rd",
      tags: ["Tournament", "Deep Stack"],
    });

    console.log("创建锦标赛会话:", tournamentSession);

    // 创建第三个会话 - 亏损的现金游戏
    const losingSession = this.sessionManager.createSession({
      sessionType: {
        session: "Cash Game",
        location: "Online Poker",
        game: "Pot Limit Omaha",
        stakes: "2/5",
        isTournament: false,
      },
      startTime: "2025-06-26T20:00:00",
      endTime: "2025-06-27T02:00:00",
      buyIn: 1000,
      cashOut: 600,
      rebuys: 300,
      tableExpenses: 30,
      notes: "Bad run, lost big pot with AA",
      tags: ["Online", "Bad Run"],
    });

    console.log("创建亏损会话:", losingSession);
  }

  /**
   * 显示会话统计信息
   */
  showSessionStats(): void {
    const stats = this.sessionManager.getSessionStats();

    console.log("=== 会话统计信息 ===");
    console.log(`总会话数: ${stats.totalSessions}`);
    console.log(`总利润: $${stats.totalProfit}`);
    console.log(`平均利润: $${stats.averageProfit.toFixed(2)}`);
    console.log(`总时长: ${stats.totalDuration.toFixed(2)} 小时`);
    console.log(`平均每小时利润: $${stats.averageHourlyProfit.toFixed(2)}`);
    console.log(`胜率: ${stats.winRate.toFixed(1)}%`);
  }

  /**
   * 显示所有会话详情
   */
  showAllSessions(): void {
    const sessions = this.sessionManager.getAllSessions();

    console.log("=== 所有会话详情 ===");
    sessions.forEach((session, index) => {
      const profit = this.sessionManager.calculateProfit(session);
      const duration = this.sessionManager.calculateDuration(session);
      const hourlyProfit = this.sessionManager.calculateHourlyProfit(session);

      console.log(`\n会话 ${index + 1}:`);
      console.log(`  类型: ${session.sessionType.session}`);
      console.log(`  位置: ${session.sessionType.location}`);
      console.log(`  游戏: ${session.sessionType.game}`);
      console.log(`  筹码: ${session.sessionType.stakes}`);
      console.log(`  开始时间: ${session.startTime.toLocaleString()}`);
      console.log(`  结束时间: ${session.endTime.toLocaleString()}`);
      console.log(`  时长: ${duration.toFixed(2)} 小时`);
      console.log(`  买入: $${session.buyIn}`);
      console.log(`  兑出: $${session.cashOut}`);
      console.log(`  重买: $${session.rebuys}`);
      console.log(`  桌费: $${session.tableExpenses}`);
      console.log(`  利润: $${profit}`);
      console.log(`  每小时利润: $${hourlyProfit.toFixed(2)}`);
      console.log(`  备注: ${session.notes || "无"}`);
      console.log(`  标签: ${session.tags?.join(", ") || "无"}`);
    });
  }

  /**
   * 演示筛选功能
   */
  demonstrateFiltering(): void {
    console.log("\n=== 筛选功能演示 ===");

    // 按会话类型筛选
    const cashGames = this.sessionManager.filterSessionsByType("Cash Game");
    console.log(`现金游戏会话数: ${cashGames.length}`);

    const tournaments = this.sessionManager.filterSessionsByType("Tournament");
    console.log(`锦标赛会话数: ${tournaments.length}`);

    // 按位置筛选
    const homeGames = this.sessionManager.filterSessionsByLocation("Home");
    console.log(`家庭游戏会话数: ${homeGames.length}`);

    // 按游戏类型筛选
    const holdEmGames = this.sessionManager.filterSessionsByGame("Hold Em");
    console.log(`德州扑克会话数: ${holdEmGames.length}`);

    // 按标签筛选
    const weekendGames = this.sessionManager.filterSessionsByTags(["Weekend"]);
    console.log(`周末游戏会话数: ${weekendGames.length}`);

    // 按时间范围筛选
    const startDate = new Date("2025-06-24T00:00:00");
    const endDate = new Date("2025-06-25T23:59:59");
    const dateRangeSessions = this.sessionManager.filterSessionsByDateRange(
      startDate,
      endDate
    );
    console.log(`6月24-25日会话数: ${dateRangeSessions.length}`);
  }

  /**
   * 演示数据导出和导入
   */
  demonstrateExportImport(): void {
    console.log("\n=== 数据导出导入演示 ===");

    // 导出数据
    const exportedData = this.sessionManager.exportSessions();
    console.log("导出的数据长度:", exportedData.length);

    // 创建新的管理器并导入数据
    const newSessionManager = new SessionManager();
    newSessionManager.importSessions(exportedData);

    console.log("导入后的会话数:", newSessionManager.getAllSessions().length);
  }

  /**
   * 运行完整示例
   */
  runCompleteExample(): void {
    console.log("开始SessionManager示例演示...\n");

    // 创建示例会话
    this.createExampleSessions();

    // 显示统计信息
    this.showSessionStats();

    // 显示所有会话
    this.showAllSessions();

    // 演示筛选功能
    this.demonstrateFiltering();

    // 演示导出导入
    this.demonstrateExportImport();

    console.log("\n示例演示完成！");
  }
}

// 如果直接运行此文件，执行示例
if (typeof window === "undefined") {
  const example = new SessionExample();
  example.runCompleteExample();
}
