import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface BudgetOptions {
  isCurrent: boolean;
  isExpense: boolean;
  isIncome: boolean;
  showBudgetList: boolean;
  category: {
    showEditPlan: boolean;
  };
}
export interface ModalOptions {
  isOpen: boolean;
  icon: string;
  title: string;
  description: string;
  confirmMsg: string;
  onConfirm: (() => void) | null;
  showReport: boolean;
}
interface EmojiOptions {
  isOpen: boolean;
  onClose: () => void;
  onClear: () => void;
  onSelect: (value: any) => void;
}

const initialState: {
  budget: BudgetOptions;
  emoji: EmojiOptions;
  modal: ModalOptions;
} = {
  budget: {
    isCurrent: true,
    isExpense: true,
    isIncome: true,
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
  modal: {
    isOpen: false,
    icon: '',
    title: '',
    description: '',
    confirmMsg: '확인',
    onConfirm: null,
    showReport: false,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    showModal(state, action: PayloadAction<Partial<ModalOptions>>) {
      const options = action.payload;
      state.modal = { ...initialState.modal, ...options, isOpen: true };
    },
    showErrorModal(state, action: PayloadAction<Partial<ModalOptions> | undefined>) {
      const options = action.payload;
      state.modal = {
        ...initialState.modal,
        title: '문제가 발생했습니다',
        description: '잠시 후 다시 시도해주세요',
        isOpen: true,
        showReport: true,
        ...options,
      };
    },
    closeModal(state) {
      state.modal.isOpen = false;
    },
    setIsCurrent(state, action: PayloadAction<boolean>) {
      state.budget.isCurrent = action.payload;
    },
    setIsExpense(state, action: PayloadAction<boolean>) {
      state.budget.isExpense = action.payload;
    },
    setIsIncome(state, action: PayloadAction<boolean>) {
      state.budget.isIncome = action.payload;
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
    },
  },
});

export const uiActions = uiSlice.actions;
export default uiSlice.reducer;
