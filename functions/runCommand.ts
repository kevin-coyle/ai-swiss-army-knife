import util from "util";
import { exec } from "child_process";

async function runCommand(options: string) {
  const { command } = JSON.parse(options);
  console.log("Running Command..." + command);
  const execPromise = util.promisify(exec);
  try {
    const { stdout, stderr } = await execPromise(command);
    return { stdout, stderr };
  } catch (error) {
    return { error: error.message, stderr: error.stderr };
  }
}

export default runCommand;
