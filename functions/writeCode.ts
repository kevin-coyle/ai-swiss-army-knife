import fs from "fs";
import path from "path";

function writeCode(options: string) {
  const { code, fileName } = JSON.parse(options);
  console.log("Writing Code...");
  console.log(
    `File will be written to: ${path.resolve(process.cwd(), fileName)}`,
  );
  // Write the code to a file
  try {
    fs.writeFileSync(fileName, code);
    console.log(`Successfully wrote to ${fileName}`);
    return `Successfully wrote to ${fileName}`;
  } catch (error) {
    console.error(`Error writing to ${fileName}: ${error.message}`);
    return `Error writing to ${fileName}: ${error.message}`;
  }
}

export default writeCode;
