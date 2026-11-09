// Builds dist/artifact.html: the page body as a fragment for publishing as a
// claude.ai Artifact (the host supplies <!doctype>, <html>, <head>, <body>).
// The css/ and js/ folders are published alongside it unchanged.
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const html = readFileSync(join(root, "index.html"), "utf8");

const title = html.match(/<title>[\s\S]*?<\/title>/)[0];
const links = html.match(/<link [^>]*>/g).join("\n");
let body = html.match(/<!-- BODY:START -->([\s\S]*?)<!-- BODY:END -->/)[1].trim();

// The private version adds the code walkthroughs. private/ is gitignored because it
// holds class and lab code, so the public site never loads or contains it.
if (existsSync(join(root, "private", "walkthroughs.js"))) {
  body = body.replace('<script src="js/app.js"></script>', '<script src="private/walkthroughs.js"></script>\n<script src="js/app.js"></script>');
}

mkdirSync(join(root, "dist"), { recursive: true });
writeFileSync(join(root, "dist", "artifact.html"), `${title}\n${links}\n${body}\n`);
console.log("Wrote dist/artifact.html");
