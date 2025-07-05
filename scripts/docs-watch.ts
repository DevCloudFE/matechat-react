import { execSync, spawn } from "node:child_process";
import fs, { type WatchEventType } from "node:fs";
import path from "node:path";
import { createSpinner } from "archons";
import chalk from "chalk";

// 路径
const cwd = process.cwd();
const docsDir = path.join(cwd, "docs");
const srcDir = path.join(cwd, "src");
const ignored = [
  "node_modules",
  "dist",
  "build",
  ".git",
  ".vscode",
  ".DS_Store",
];
const greenPrefix = chalk.green("[Docs_DevScript]");

function createArchonsSpinner() {
  const spinner = createSpinner();
  spinner.setTemplate("{prefix:.green} {spinner:.yellow} {msg}");
  spinner.setPrefix("[Docs_DevScript]]");
  return spinner;
}

function buildProject() {
  const spinner = createArchonsSpinner();
  spinner.setMessage("Building project...");
  spinner.enableSteadyTick(100);
  try {
    execSync("pnpm build", { stdio: "inherit" });
    spinner.finishAndClear();
    console.log(`${greenPrefix} Build complete.`);
  } catch (error) {
    spinner.finishAndClear();
    console.error(`${greenPrefix} Build failed.`);
    console.error(error);
  }
}

function createDevServer() {
  let devProcess = spawn("pnpm", ["dev"], {
    cwd: docsDir,
    stdio: "inherit",
    shell: true,
  });

  devProcess.on("error", (err) => {
    console.error(`${greenPrefix} Dev process error:`, err);
  });

  return () => {
    const spinner = createArchonsSpinner();
    spinner.println(`${greenPrefix} Restarting rspress dev server...`);
    devProcess.kill("SIGINT");
    devProcess.on("close", () => {
      devProcess = spawn("pnpm", ["dev"], {
        cwd: docsDir,
        stdio: "inherit",
        shell: true,
      });
      spinner.finishAndClear();
    });
  };
}

function isIgnoredFile(filePath) {
  return ignored.some((dir) => filePath.includes(dir));
}

function watchAndServe() {
  console.clear();
  console.log(`${greenPrefix} Starting dev script...`);

  buildProject();

  const restartDev = createDevServer();

  let lastBuildTime = Date.now();

  fs.watch(srcDir, { recursive: true }, (eventType, filename) => {
    if (!filename || isIgnoredFile(filename)) return;
    if (Date.now() - lastBuildTime < 1000) return;

    console.log(
      `${greenPrefix} File changed: ${chalk.cyan(filename)}, rebuilding...`,
    );
    buildProject();
    restartDev();
    lastBuildTime = Date.now();
  });

  console.log(`${greenPrefix} Watching ${chalk.cyan("src")} for changes...`);
}

watchAndServe();
