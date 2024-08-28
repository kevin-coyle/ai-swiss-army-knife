import fs from "fs";

function listDirectory(options: string) {
  console.log("Listing Directory" + options);
  const { directory } = JSON.parse(options);
  try {
    const files = fs.readdirSync(directory);
    return files;
  } catch (error) {
    return `Error: ${error.message}`;
  }
  return files;
}

export default listDirectory;
