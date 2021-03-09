import { promises as fs } from "fs";
import glob from "glob-promise";
import mkdirp from "mkdirp";
import { dirname, join } from "path";
import { exportTiming } from "./chanting";
import { parseChantingHtml } from "./parse";

export const PROJECT_DIR = process.cwd();
export const CHANTS_DIR = join(PROJECT_DIR, "chants");
export const TIMING_DIR = join(PROJECT_DIR, "timing");
export const TOC_PATH = join(PROJECT_DIR, "toc.json");
export const CHANTS_OUTPUT_PATH = join(PROJECT_DIR, "dist", "chants.json");
export const TIMING_OUTPUT_PATH = join(PROJECT_DIR, "dist", "timing.json");
export const STATIC_DIR = join(PROJECT_DIR, "src", "static");
export const VIEWS_DIR = join(PROJECT_DIR, "src", "views");

export const readFile = async (path) => fs.readFile(path, { encoding: "utf8" });

export const readJson = async (path) => JSON.parse(await readFile(path));

export const writeFile = async (path, text) => {
  await mkdirp(dirname(path));
  await fs.writeFile(path, text, { encoding: "utf8" });
};

export const writeJson = async (path, data) =>
  writeFile(path, JSON.stringify(data, null, 2) + "\n");

export const getChantData = async () => {
  const chantMap = {};
  for (const html of await getChantHtmls()) {
    const chant = parseChantingHtml(html);
    chantMap[chant.id] = chant;
  }

  const toc = await getToc();
  const chants = [];
  toc.forEach((tocVolume) => {
    tocVolume.parts.forEach((tocPart) => {
      tocPart.chants.forEach((tocChant) => {
        const chantId = tocChant.link;
        const chant = chantMap[chantId];
        if (chant) {
          chants.push(chant);
        }
      });
    });
  });

  return { toc, chants };
};

export const getChantHtml = async (chantId) => {
  const path = join(CHANTS_DIR, `${chantId}.html`);
  let html;
  try {
    html = await readFile(path);
  } catch {
    html = null;
  }
  return html;
};

export const getChantHtmls = async () =>
  Promise.all(
    (await glob("**/*.html", { cwd: CHANTS_DIR })).map((path) =>
      (async () => await readFile(join(CHANTS_DIR, path)))()
    )
  );

export const getChantJson = async (chantId) => {
  const path = join(CHANTS_DIR, `${chantId}.html`);
  const html = await readFile(path);
  return parseChantingHtml(html);
};

export const getTimingJson = async (chantId) => {
  const path = join(TIMING_DIR, `${chantId}.json`);
  let timing;
  try {
    timing = await readJson(path);
  } catch {
    timing = true;
  }
  return timing;
};

export const getTimingJsons = async () =>
  await Promise.all(
    (await glob("**/*.json", { cwd: TIMING_DIR })).map((path) =>
      (async () => await readJson(join(TIMING_DIR, path)))()
    )
  );

export const getToc = async () => {
  return await readJson(TOC_PATH);
};

export const setTimingJson = async (chantId, timing) => {
  const path = join(TIMING_DIR, `${chantId}.json`);
  timing = exportTiming({ ...timing, id: chantId });
  await writeJson(path, timing);
};

export const parseChantIdFromRequest = (req) => {
  const id = String(req.query.id);
  const match = id.match(/^(ccb-\d(?:\.\d{1,2}){2,3})\.(json|html)$/);
  return match ? [match[1], match[2]] : [null, null];
};
