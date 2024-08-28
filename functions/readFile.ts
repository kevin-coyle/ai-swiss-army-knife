import fs from "fs";
import path from "path";

function readFile(options: string) {
  const { fileName } = JSON.parse(options);
  console.log("Reading File..." + fileName);
  const filePath = path.resolve(process.cwd(), fileName);
  // Check if file exists if it doesn't then return a string saying file does not exist'
  if (!fs.existsSync(filePath)) {
    return "File does not exist or is not readable";
  }
  return fs.readFileSync(filePath, "utf8");
}

export default readFile;
