import { ERROR_MESSAGE } from '../constants/error';

export const getErrorMessage = (error: any) => {
  if (!(error instanceof Error)) {
    return null;
  }

  const message = error.message;

  if (message.includes('NOT_FOUND')) {
    return null;
  } else {
    return ERROR_MESSAGE[message];
  }
};
