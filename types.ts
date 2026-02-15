export enum CardCategory {
  MAJOR = '大阿卡纳',
  WANDS = '权杖',
  CUPS = '圣杯',
  SWORDS = '宝剑',
  PENTACLES = '星币',
}

export interface Interpretation {
  love: string[];
  career: string[];
  wealth: string[];
  growth: string[];
}

export interface TarotCard {
  id: number;
  name: string;
  nameEn: string; // For image seeding or extra info
  category: CardCategory;
  summary: string;
  interpretations: Interpretation;
  image: string;
}

export type TabType = 'love' | 'career' | 'wealth' | 'growth';

// 筛选状态类型
export type FilterType = CardCategory | 'ALL' | 'FAVORITES';

// 笔记类型
export type Notes = Record<number, string>;

// 牌阵中的单张牌
export interface SpreadCard {
  id: string; // 唯一标识
  cardId: number; // 对应的塔罗牌id
  isReversed: boolean; // 是否逆位
  positionMeaning: string; // 位置含义（比如"现状"、"障碍"等）
}

// 牌阵记录
export interface SpreadRecord {
  id: string;
  question: string; // 当事人的问题
  date: string; // 占卜日期（ISO格式）
  clientName: string; // 当事人称呼
  cards: SpreadCard[]; // 牌阵中的牌
  interpretation: string; // 完整解读
  summary: string; // 总结复盘
  createdAt: string; // 创建时间
  updatedAt: string; // 更新时间
}

// 牌阵记录集合
export type SpreadRecords = SpreadRecord[];