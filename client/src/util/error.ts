import { ERROR_MESSAGE } from '../constants/error';

export const getErrorMessage = (error: any) => {
  if (!(error instanceof Error)) {
    return null;
  }

  const message = error.message;

  if (message.includes('NOT_FOUND')) {
    return 'NOT_FOUND';
  } else {
    return ERROR_MESSAGE[message];
  }
};
