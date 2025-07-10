import { execSync, spawn } from "node:child_process";
import fs, { type WatchEventType } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createSpinner, defineCommand, type ProgressBar, run } from "archons";
import chalk from "chalk";

export interface WatchConfig {
  paths: { path: string; cmd: string }[];
  dev: {
    exec: string;
    options: string[];
  };
}
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const watchMap: Record<string, WatchConfig> = {
  core: {
    paths: [{ path: path.join(__dirname, "../src"), cmd: "pnpm build" }],
    dev: {
      exec: "pnpm",
      options: ["run", "--silent", "preview", "--clearScreen", "false"],
    },
  },
  docs: {
    paths: [{ path: path.join(__dirname, "../src"), cmd: "pnpm build" }],
    dev: {
      exec: "pnpm",
      options: ["run", "--silent", "--filter", "@matechat/react-docs", "dev"],
    },
  },
};
const ignored = [
  "node_modules",
  ".git",
  ".github",
  ".vscode",
  "dist",
  "build",
  "bin",
  ".md",
  ".d.ts",
  "target",
  ".cjs",
  "doc_build",
];

function isIgnored(filename: string, ignored: string[]) {
  for (const pattern of ignored) {
    if (filename.includes(pattern)) {
      return true;
    }
  }
  return false;
}

function tryBuild(cmd: string, msg: string, spinner: ProgressBar) {
  try {
    spinner.setMessage(`${msg}`);
    execSync(cmd, { stdio: "inherit" });
  } catch (e) {
    console.log(e);
    spinner.println("[MateChat] Build failed.");
  }
}

function createArchonsSpinner() {
  const spinner = createSpinner();
  spinner.setTemplate("{prefix:.green} {spinner:.yellow} {msg}");
  spinner.setPrefix("[MateChat]");
  return spinner;
}

export interface WatchOptions {
  coloredPrefix: string;
  options: WatchConfig;
  displayPaths: string;
  ignoredPaths: string[];
}
function watch({
  coloredPrefix,
  options,
  displayPaths,
  ignoredPaths,
}: WatchOptions) {
  let lastBuild = Date.now();

  function createDevProcess() {
    let devProcess = spawn(options.dev.exec, options.dev.options, {
      stdio: "inherit",
      shell: true,
    });
    return () => {
      const spinner = createArchonsSpinner();
      spinner.println(`${coloredPrefix} Restarting dev server...`);
      while (!devProcess.kill("SIGINT"));
      devProcess.on("close", () => {
        devProcess = spawn(options.dev.exec, options.dev.options, {
          stdio: "inherit",
          shell: true,
        });
        devProcess.on("error", (err) => {
          console.error(`${coloredPrefix} Error restarting dev process:`, err);
        });
        spinner.finishAndClear();
      });
    };
  }
  const restartServer = createDevProcess();

  function rebuild(
    command: string,
    eventType: WatchEventType,
    filename: string | null,
  ) {
    if (Date.now() - lastBuild < 1000) {
      return;
    }

    restartServer();

    if (filename && !isIgnored(filename, ignoredPaths)) {
      const spinner = createArchonsSpinner();
      spinner.println(
        `${coloredPrefix} File ${chalk.cyan(
          filename,
        )} was ${eventType}d, rebuilding...`,
      );
      spinner.enableSteadyTick(100);
      if ([".ts", ".tsx", ".css"].some((ext) => filename.endsWith(ext))) {
        tryBuild(command, "Rebuilding...", spinner);
      }
      console.clear();
      spinner.println(`${coloredPrefix} Build complete.\n\n`);
      spinner.println(
        `${coloredPrefix} Watching on ${displayPaths} for changes...`,
      );
      spinner.finishAndClear();
      lastBuild = Date.now();
    }
  }

  for (const { cmd, path } of options.paths) {
    fs.watch(path, { recursive: true }, rebuild.bind(null, cmd));
  }
}

const main = defineCommand({
  meta: {
    name: "watch",
    about: "Watch files and rebuild when changed",
    styled: true,
  },
  options: {
    project: {
      type: "option",
      default: "core",
      short: "p",
      help: "Project to watch",
    },
  },
  callback: async (ctx) => {
    const cwd = process.cwd();
    const project = ctx.args.project as string;
    if (!watchMap[project]) {
      throw new Error(`Project ${project} not found`);
    }

    const displayPaths = watchMap[project].paths
      .map((opts) => chalk.cyan(path.relative(cwd, opts.path)))
      .join(", ");

    const coloredPrefix = chalk.green("[MateChat]");

    const spinner = createArchonsSpinner();
    spinner.enableSteadyTick(100);
    spinner.setMessage("Initial building...");
    for (const { cmd } of watchMap[project].paths) {
      tryBuild(cmd, "Building...", spinner);
    }
    spinner.finishAndClear();
    console.clear();
    console.log(`${coloredPrefix} Build complete.\n`);
    console.log(`${coloredPrefix} Watching on ${displayPaths} for changes...`);

    watch({
      coloredPrefix,
      options: watchMap[project],
      displayPaths,
      ignoredPaths: ignored,
    });
  },
});

run(main);
