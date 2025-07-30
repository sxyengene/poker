// 重新导出所有类型
export * from "./session";

// 单独导出GameType以确保兼容性
export type { GameType } from "./session";
