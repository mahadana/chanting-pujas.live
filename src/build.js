import {
  CHANTS_OUTPUT_PATH,
  TIMING_OUTPUT_PATH,
  getChantData,
  getTimingJsons,
  writeJson,
} from "./lib/shared";

const main = async () => {
  await writeJson(CHANTS_OUTPUT_PATH, await getChantData());
  await writeJson(TIMING_OUTPUT_PATH, await getTimingJsons());
};

if (require.main === module) {
  main().catch(console.error);
}
