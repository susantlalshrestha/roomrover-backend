export default (n: number) => {
  const max = Math.pow(10, n) - 1;
  const min = Math.pow(10, n - 1);

  return Math.floor(Math.random() * (max - min + 1)) + min;
};
