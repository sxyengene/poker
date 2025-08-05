// Session相关的类型定义

// 游戏类型
export type GameType =
  | "NL Texas Hold Em" // 图4选项
  | "Pot Limit Omaha" // 图4选项
  | "Razz" // 图4选项
  | "Mixed" // 图4选项
  | "Tournament" // 图2选项
  | string; // 支持自定义（图4的"Add Game"）

// 筹码类型
export type StakesType =
  | "1/2" // 图3选项
  | "1/3" // 图3选项
  | "2/5" // 图3选项
  | "5/10" // 图3选项
  | string; // 支持自定义输入

// 会话类型
export type SessionCategory = "Cash Game" | "Tournament";

// 会话类型配置
export type SessionType = {
  session: SessionCategory; // 根据图2明确选项类型
  location: string; // 支持新增位置（图1的"Add New Location"）
  game: string; // 包含扑克类型（图4的"NL Texas Hold Em"等）和比赛类型（图2的"Tournament"）
  stakes: string; // 支持预设选项（图3的"1/2"等）和自定义值
  isTournament: boolean; // 区分常规游戏和锦标赛
};

// 完整的会话对象结构
export interface Session {
  id?: string; // 会话唯一标识
  createdAt?: string; // 创建时间
  sessionType: SessionType;
  startTime: Date; // 格式: "Jun 24,2025 06:40" → new Date("2025-06-24T06:40")
  endTime: Date;
  buyIn: number; // 买入金额（带美元符号输入框）
  cashOut: number; // 兑现金额（必填项）
  rebuys: number; // 包含"Rebuys/Top Offs"（图1）和"Rebuys/Add-ons"（图4）
  tableExpenses: number; // 桌费（包含抽水和小费）
  notes?: string; // 可选备注
  tags?: string[]; // 支持多标签（图1的标签输入框）
}

// 预设的游戏类型选项
export const GAME_TYPES: GameType[] = [
  "NL Texas Hold Em",
  "Pot Limit Omaha",
  "Razz",
  "Mixed",
  "Tournament",
];

// 预设的筹码类型选项
export const STAKES_TYPES: StakesType[] = ["1/2", "1/3", "2/5", "5/10"];

// 预设的会话类型选项
export const SESSION_CATEGORIES: SessionCategory[] = [
  "Cash Game",
  "Tournament",
];

// 示例会话数据
export const EXAMPLE_SESSION: Session = {
  sessionType: {
    session: "Cash Game",
    location: "Home Game",
    game: "NL Texas Hold Em",
    stakes: "1/2",
    isTournament: false,
  },
  startTime: new Date("2025-06-24T06:40"),
  endTime: new Date("2025-06-24T11:40"),
  buyIn: 500,
  cashOut: 1200,
  rebuys: 200,
  tableExpenses: 50,
  notes: "VIP table with aggressive players",
  tags: ["Weekend", "High Stakes"],
};
