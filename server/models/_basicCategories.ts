import { Types } from "mongoose";

// 지출 카테고리
const expenseCategories = [
  {
    title: "식비",
    icon: "🍚",
  },
  {
    title: "교통비",
    icon: "🚉",
  },
  {
    title: "생활",
    icon: "🛒",
  },
  {
    title: "쇼핑",
    icon: "🛍️",
  },
  {
    title: "문화/여가",
    icon: "🎬",
  },

  {
    title: "주거/통신",
    icon: "🏠",
  },
  {
    title: "의료/건강",
    icon: "🏥",
  },
  {
    title: "경조사",
    icon: "💌",
  },
];

// 수입 카테고리
const incomeCategories = [
  {
    title: "월급",
    icon: "💰",
  },
  {
    title: "용돈",
    icon: "💵",
  },
  {
    title: "이자",
    icon: "🏦",
  },
  {
    title: "혜택",
    icon: "👍",
  },
  {
    title: "중고",
    icon: "🥕",
  },
];

// 기본 카테고리

const defaultCategories = [
  {
    isExpense: true,
    title: "기타",
    icon: "💸",
  },
  {
    isIncome: true,
    title: "기타",
    icon: "💵",
  },
];

export const basicCategories = [
  // 지출 카테고리
  ...expenseCategories.map((category) => {
    return { _id: new Types.ObjectId(), isExpense: true, ...category };
  }),
  // 수입 카테고리
  ...incomeCategories.map((category) => {
    return { _id: new Types.ObjectId(), isIncome: true, ...category };
  }),
  ,
  // 기본 카테고리
  ...defaultCategories.map((category) => {
    return { _id: new Types.ObjectId(), isDefault: true, ...category };
  }),
];
