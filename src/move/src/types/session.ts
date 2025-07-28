export interface SessionType {
  location: string;
  stakes: string;
  game: string;
}

export type GameType =
  | 'NL Texas Hold Em'
  | 'Pot Limit Omaha'
  | 'Razz'
  | 'Mixed';
export type StakesType = '1/2' | '1/3' | '2/5' | '5/10' | 'Custom';
export type CurrencyType = '￥' | '$';

export interface NewSession {
  sessionType: SessionType;
  buyIn: number;
  cashOut: number;
  rebuys: number;
  tableExpenses: number;
  startTime: Date;
  endTime: Date;
  notes: string;
  tags: string[];
}

export interface SessionData {
  id: string;
  date: string;
  time: string;
  location: string;
  duration: string;
  profit: number;
  buyin: number;
  cashout: number;
  blinds: string;
  gameType: string;
  notes: string;
  tags: string[];
  startTime: Date;
  endTime: Date;
  rebuys: number;
  tableExpenses: number;
}
