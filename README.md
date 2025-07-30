# Poker4 - 扑克会话管理应用

Poker4 是一个专为扑克玩家设计的会话管理应用，帮助玩家记录和分析他们的扑克游戏数据。

## 功能特性

### 🎯 核心功能

- **会话记录**: 记录每次扑克游戏的详细信息
- **数据统计**: 自动计算利润、胜率、时长等关键指标
- **本地存储**: 所有数据安全存储在本地设备
- **多平台支持**: 基于 uni-app 开发，支持多端运行

### 📊 会话信息记录

- **会话类型**: Cash Game / Tournament
- **位置信息**: 支持自定义位置（家庭游戏、赌场等）
- **游戏类型**: NL Texas Hold Em、Pot Limit Omaha、Razz、Mixed 等
- **筹码级别**: 1/2、1/3、2/5、5/10 等预设选项
- **时间记录**: 开始和结束时间
- **财务数据**: 买入、兑出、重买、桌费等
- **备注标签**: 支持添加备注和多标签

### 📈 数据分析

- **总利润统计**: 实时计算总盈亏
- **胜率分析**: 自动计算获胜会话比例
- **时长统计**: 记录总游戏时长
- **平均收益**: 计算平均每小时收益
- **会话历史**: 查看最近的会话记录

## 技术架构

### 🏗️ 项目结构

```
poker4/
├── src/
│   ├── types/           # 类型定义
│   │   └── session.ts   # Session相关类型
│   ├── models/          # 业务模型
│   │   └── Session.ts   # Session核心类
│   ├── utils/           # 工具类
│   │   └── storage.ts   # 本地存储工具
│   ├── pages/           # 页面组件
│   │   ├── index/       # 主页
│   │   └── new-session/ # 新建会话页面
│   └── examples/        # 使用示例
│       └── session-example.ts
```

### 🛠️ 技术栈

- **框架**: uni-app + Vue 3
- **语言**: TypeScript
- **存储**: uni-app 本地存储 API
- **UI**: 原生组件 + 自定义样式

## 核心类说明

### SessionManager

主要的会话管理类，提供以下功能：

- 创建、更新、删除会话
- 数据验证和错误处理
- 利润计算和统计分析
- 多维度筛选功能
- 数据导入导出

### SessionStorage

本地存储工具类，负责：

- 会话数据的持久化存储
- 数据格式转换和验证
- 统计信息计算
- 筛选和查询功能

## 使用指南

### 1. 新建会话

1. 点击主页的"新建会话"按钮
2. 填写会话类型、位置、游戏类型等基本信息
3. 设置开始和结束时间
4. 输入财务数据（买入、兑出、重买、桌费等）
5. 添加可选的备注和标签
6. 点击"保存会话"完成记录

### 2. 查看统计

主页自动显示：

- 总会话数
- 总利润（正负值用不同颜色显示）
- 胜率百分比
- 最近会话列表

### 3. 数据管理

- 所有数据存储在本地，无需网络连接
- 支持数据导出备份
- 支持数据导入恢复

## 开发说明

### 环境要求

- Node.js 16+
- pnpm (推荐) 或 npm
- HBuilderX 或 VS Code

### 安装依赖

```bash
pnpm install
```

### 开发运行

```bash
# H5开发
pnpm dev:h5

# 微信小程序开发
pnpm dev:mp-weixin

# 其他平台请参考package.json中的scripts
```

### 构建发布

```bash
# H5构建
pnpm build:h5

# 微信小程序构建
pnpm build:mp-weixin
```

## 数据格式

### Session 数据结构

```typescript
interface Session {
  sessionType: {
    session: "Cash Game" | "Tournament";
    location: string;
    game: string;
    stakes: string;
    isTournament: boolean;
  };
  startTime: Date;
  endTime: Date;
  buyIn: number;
  cashOut: number;
  rebuys: number;
  tableExpenses: number;
  notes?: string;
  tags?: string[];
}
```

## 未来计划

### 🚀 即将推出的功能

- [ ] 会话列表页面
- [ ] 会话详情页面
- [ ] 数据筛选和搜索
- [ ] 图表统计分析
- [ ] 数据备份和同步
- [ ] 多语言支持
- [ ] 主题切换

### 🔧 技术改进

- [ ] 性能优化
- [ ] 错误处理完善
- [ ] 单元测试
- [ ] 代码规范检查

## 贡献指南

欢迎提交 Issue 和 Pull Request 来改进这个项目！

### 开发规范

1. 使用 TypeScript 进行类型安全开发
2. 遵循 Vue 3 Composition API 规范
3. 保持代码简洁和可读性
4. 添加必要的注释和文档

## 许可证

MIT License

---

**Poker4** - 让扑克数据管理更简单 🃏
