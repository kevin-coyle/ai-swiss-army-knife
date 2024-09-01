function countLetter(options: string): number {
  console.log("Counting Letter" + options);
  const { letter, word } = JSON.parse(options);
  // Make sure word and letter are strings first
  if (typeof word !== "string" || typeof letter !== "string") {
    throw new Error("Both word and letter must be strings");
  }
  return word
    .toLowerCase()
    .split("")
    .filter((char) => char === letter.toLowerCase()).length;
}

export default countLetter;
