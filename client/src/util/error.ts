import { ERROR_MESSAGE } from '../constants/error';

export const getErrorMessage = (error: any) => {
  let message;

  if (typeof error === 'string') {
    message = error;
  } else if (error instanceof Error) {
    message = error.message;
  } else {
    return null;
  }

  if (message.includes('NOT_FOUND')) {
    return null;
  } else {
    return ERROR_MESSAGE[message];
  }
};
