export const checkNetwork = () => {
  if (!navigator.onLine) {
    throw new Error('NETWORK_NOT_AVAILABLE');
  }
};
