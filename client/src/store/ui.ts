import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface EmojiOptions {
  isOpen: boolean;
  onClose: () => void;
  onClear: () => void;
  onSelect: (value: any) => void;
}

const initialState = {
  budget: {
    isCurrent: true,
    isExpense: true,
    showBudgetList: false,
    category: {
      showEditPlan: false,
    },
  },
  emoji: {
    isOpen: false,
    onClose: () => {},
    onClear: () => {},
    onSelect: (value: any) => {},
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setIsCurrent(state, action: PayloadAction<boolean>) {
      state.budget.isCurrent = action.payload;
    },
    setIsExpense(state, action: PayloadAction<boolean>) {
      state.budget.isExpense = action.payload;
    },
    showBudgetList(state, action: PayloadAction<boolean>) {
      state.budget.showBudgetList = action.payload;
    },
    showCategoryPlanEditor(
      state,
      action: PayloadAction<{ isExpense: boolean; showEditPlan: boolean }>
    ) {
      const { isExpense, showEditPlan } = action.payload;
      state.budget.isExpense = isExpense;
      state.budget.category.showEditPlan = showEditPlan;
    },
    setEmojiOverlay(state, action: PayloadAction<Partial<EmojiOptions>>) {
      const options = action.payload;
      state.emoji = { ...state.emoji, ...options };
    },
    resetEmojiOverlay(state) {
      state.emoji = initialState.emoji;
    }
  },
});

export const uiActions = uiSlice.actions;
export default uiSlice.reducer;
