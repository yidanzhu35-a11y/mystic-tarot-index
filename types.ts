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