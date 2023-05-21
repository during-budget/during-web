export const throwError = (error: any) => {
  let message;

  if (error instanceof Error) {
    message = error.message;
  } else {
    message = String(error);
  }

  throw new Error(message);
};

export const getErrorMsg = (error: any) => {
  if (!(error instanceof Error)) {
    return null;
  }

  if (error.cause) {
    return null;
  }

  const message = error.message;
  return message.split('\n');
};
