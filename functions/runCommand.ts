import { exec } from "child_process";
import util from "util";

async function runCommand(options: string) {
  const { command } = JSON.parse(options);
  console.log("Running Command: " + command);
  const execPromise = util.promisify(exec);
  const execOptions = { timeout: 60000 }; // Timeout set for 1 minute

  try {
    const { stdout, stderr } = await execPromise(command, execOptions);
    console.log(`Run command: ${command}`);
    console.log(`Command Results: ${stdout}`);
    if (stderr) {
      console.log(`Command Error: ${stderr}`);
    }
    return { stdout, stderr };
  } catch (error: any) {
    if (error.killed) {
      console.error("Command timed out.");
    }
    console.log(
      `Command has failed Error: ${error.message}, stderr: ${error.stderr}, stdout: ${error.stdout}`,
    );

    return { error: error.message, stderr: error.stderr, stdout: error.stdout };
  }
}

export default runCommand;
