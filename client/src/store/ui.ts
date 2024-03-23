import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface BudgetOptions {
  isCurrent: boolean;
  isExpense: boolean;
  isIncome: boolean;
  showBudgetList: boolean;
  category: {
    showEditPlan: boolean;
    showSetting: boolean;
    showList: boolean;
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
  hideCancel?: boolean;
  hideChannelButtonOnClose?: boolean;
}
interface EmojiOptions {
  isOpen: boolean;
  onClose: () => void;
  onClear: () => void;
  onSelect: (value: any) => void;
}

interface CategoryAddOptions {
  isOpen: boolean;
  isExpense: boolean;
  onClose?: () => void;
}

interface PaymentOptions {
  isOpen: boolean;
  itemId: string;
  content?: React.ReactNode;
  onComplete?: (itemTitle?: any) => void;
  amount: number;
}

interface AmountOptions {
  isOpen: boolean;
  value: string;
  onConfirm: (value: string) => void;
  onClose?: () => void;
  hash?: string;
}

const initialState: {
  platform: 'android' | 'ios' | undefined;
  budget: BudgetOptions;
  emoji: EmojiOptions;
  modal: ModalOptions;
  payment: PaymentOptions;
  amount: AmountOptions;
  category: { add: CategoryAddOptions };
} = {
  platform: undefined,
  budget: {
    isCurrent: true,
    isExpense: true,
    isIncome: true,
    showBudgetList: false,
    category: {
      showEditPlan: false,
      showSetting: false,
      showList: false,
    },
  },
  emoji: {
    isOpen: false,
    onClose: () => {},
    onClear: () => {},
    onSelect: (value: any) => {},
  },
  category: {
    add: {
      isOpen: false,
      isExpense: false,
      onClose: () => {},
    },
  },
  modal: {
    isOpen: false,
    icon: '',
    title: '',
    description: '',
    confirmMsg: '확인',
    onConfirm: null,
    showReport: false,
    hideCancel: undefined,
  },
  payment: {
    isOpen: false,
    itemId: '',
    amount: 0,
  },
  amount: {
    isOpen: false,
    value: '',
    onConfirm: (value: string) => {},
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
    showBudgetCategorySetting(state, action: PayloadAction<boolean>) {
      state.budget.category.showSetting = action.payload;
    },
    showCategoryList(state, action: PayloadAction<boolean>) {
      state.budget.category.showList = action.payload;
    },
    setEmojiOverlay(state, action: PayloadAction<Partial<EmojiOptions>>) {
      const options = action.payload;
      state.emoji = { ...state.emoji, ...options };
    },
    resetEmojiOverlay(state) {
      state.emoji = initialState.emoji;
    },
    setCategoryAdd(state, action: PayloadAction<Omit<CategoryAddOptions, 'isOpen'>>) {
      state.category.add = { ...action.payload, isOpen: true };
    },
    closeCategoryAdd(state) {
      state.category.add.isOpen = false;
    },
    setPayment(state, action: PayloadAction<Omit<PaymentOptions, 'isOpen'>>) {
      state.payment = { ...action.payload, isOpen: true };
    },
    closePayment(state) {
      state.payment = initialState.payment;
    },
    // NOTE: 숫자 문자열만 허용 (수식 허용 X)
    setAmountOverlay(state, action: PayloadAction<Omit<AmountOptions, 'isOpen'>>) {
      const value = action.payload.value.toString();

      const localeValue =
        value && !value.includes(',') ? (+value).toLocaleString() : value;
      state.amount = { ...action.payload, isOpen: true, value: localeValue };
    },
    setAmountValue(state, action: PayloadAction<string>) {
      state.amount.value = action.payload;
    },
    closeAmountInput(state) {
      state.amount = initialState.amount;
    },
    setPlatform(state, action: PayloadAction<'android' | 'ios' | undefined>) {
      state.platform = action.payload;
    },
  },
});

export const uiActions = uiSlice.actions;
export default uiSlice.reducer;
