import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const changelogPath = path.resolve(__dirname, "../CHANGELOG.md");
const targetPath = path.resolve(
  __dirname,
  "../docs/docs/zh/guide/other/update-log.md",
);

function syncChangelog() {
  const changelog = fs.readFileSync(changelogPath, "utf-8");

  const content = `# 更新日志

>以下内容自动同步自主项目 \`CHANGELOG.md\`

---

${changelog}
`;

  fs.writeFileSync(targetPath, content, "utf-8");
  console.log("✅ Changelog 已同步到 docs/docs/zh/guide/basic/update-log.md");
}

syncChangelog();
