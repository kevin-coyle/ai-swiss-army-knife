function countWords(options: string): number {
  const { text } = JSON.parse(options);
  const words = text.trim().split(/\s+/);
  return words.length;
}
export default countWords;
