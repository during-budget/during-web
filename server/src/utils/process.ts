export const exit = (message: string) => {
  console.log(`🚫 ${message}; Process will exit`);
  process.exit(1);
};
