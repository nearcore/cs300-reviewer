// Runs every "print" and "compile" quiz question through real Java, so the marked
// answers are tested. Usage: JAVA_BIN=/path/to/jdk/bin node scripts/verify-questions.mjs
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const bin = process.env.JAVA_BIN ? process.env.JAVA_BIN + "/" : "";
const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext("var CS300; window.CS300 = {};CS300 = window.CS300;", ctx);
for (const f of ["notes", "flashcards", "questions", "midterm2-notes", "midterm2-practice", "quiz-examples"]) {
  vm.runInContext(readFileSync(join(root, "js/data", f + ".js"), "utf8"), ctx);
}
const D = ctx.window.CS300;
const IMPORTS = "import java.util.*; import java.util.function.*; import java.util.stream.*;\n";

function source(q) {
  const c = q.code;
  if (/static void main/.test(c) || /^(abstract |final )?(class|interface) /m.test(c)) {
    return { text: IMPORTS + c };
  }
  if (q.wrap === "class") return { text: IMPORTS + "class Q {\n" + c + "\n}" };
  return { text: IMPORTS + "class Main { public static void main(String[] args) throws Exception {\n" + c + "\n} }" };
}
const norm = (s) => s.replace(/\s+/g, " ").trim();

let run = 0, bad = 0;
const seen = new Set();
for (const q of D.questions) {
  if (seen.has(q.id)) { console.log("DUPLICATE id", q.id); bad++; }
  seen.add(q.id);
  if (new Set(q.options).size !== q.options.length) { console.log("DUPLICATE option", q.id); bad++; }
  if (!D.topics[q.topic]) { console.log("BAD topic", q.id); bad++; }
  if (q.kind !== "print" && q.kind !== "compile") continue;
  run++;
  const dir = mkdtempSync(join(tmpdir(), "cs300q-"));
  const file = join(dir, "Snippet.java");
  writeFileSync(file, source(q).text);
  const jc = spawnSync(bin + "javac", ["-nowarn", "-d", dir, file], { encoding: "utf8" });
  if (q.kind === "compile") {
    const got = jc.status === 0 ? "ok" : "fail";
    if (got !== q.expect) { console.log(`WRONG ${q.id}: expected ${q.expect}, got ${got}\n${jc.stderr}`); bad++; }
    // a "fail" must fail for the stated reason, so show it for review
    else if (got === "fail" && process.env.SHOW) console.log(q.id, "::", jc.stderr.split("\n")[0].replace(file, ""));
  } else if (jc.status !== 0) {
    console.log(`NO COMPILE ${q.id}\n${jc.stderr}`); bad++;
  } else {
    const before = q.code.split("static void main")[0].match(/class (\w+)/g);
    const main = /static void main/.test(q.code) ? before[before.length - 1].slice(6) : "Main";
    const r = spawnSync(bin + "java", ["-cp", dir, main], { encoding: "utf8" });
    if (q.throws) {
      if (!r.stderr.includes(q.throws)) { console.log(`WRONG ${q.id}: wanted ${q.throws}, stdout=${r.stdout} stderr=${r.stderr.slice(0, 200)}`); bad++; }
    } else {
      const want = norm(q.options[0].replace(/`/g, ""));
      if (norm(r.stdout) !== want) { console.log(`WRONG ${q.id}: marked "${want}", actual "${norm(r.stdout)}" ${r.stderr.slice(0, 150)}`); bad++; }
    }
  }
  rmSync(dir, { recursive: true, force: true });
}
// Examples with "// prints X" comments are run too, and every question needs one.
let exRun = 0;
for (const q of D.questions) {
  const ex = D.examples[q.id];
  if (!ex) { console.log("NO EXAMPLE", q.id); bad++; continue; }
  const wants = [...ex.matchAll(/\/\/ prints (.+)$/gm)].map((m) => m[1].trim());
  if (!wants.length) continue;
  exRun++;
  const dir = mkdtempSync(join(tmpdir(), "cs300e-"));
  const file = join(dir, "Snippet.java");
  writeFileSync(file, source({ code: ex }).text);
  const jc = spawnSync(bin + "javac", ["-nowarn", "-d", dir, file], { encoding: "utf8" });
  if (jc.status !== 0) { console.log(`EXAMPLE NO COMPILE ${q.id}\n${jc.stderr.slice(0, 300)}`); bad++; }
  else {
    const r = spawnSync(bin + "java", ["-cp", dir, "Main"], { encoding: "utf8" });
    if (norm(r.stdout) !== norm(wants.join(" "))) { console.log(`EXAMPLE WRONG ${q.id}: says "${wants.join(" ")}", actual "${norm(r.stdout)}" ${r.stderr.slice(0,120)}`); bad++; }
  }
  rmSync(dir, { recursive: true, force: true });
}
console.log(`Ran ${exRun} examples with stated output`);
for (const k of Object.keys(D.examples)) if (!D.questions.some((q) => q.id === k)) console.log("ORPHAN example", k);
console.log(`${D.questions.length} questions, ${D.flashcards.length} cards, ${D.terms.length} terms, ${D.drills.length} drills`);
console.log(`Ran ${run} code questions through Java: ${bad} problems`);
process.exit(bad ? 1 : 0);
