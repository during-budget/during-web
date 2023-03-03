export const throwError = (error: any) => {
    let message;

    if (error instanceof Error) {
        message = error.message;
    } else {
        message = String(error);
    }

    throw new Error(message);
};
