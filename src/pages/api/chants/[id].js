import {
  parseChantIdFromRequest,
  getChantHtml,
  getChantJson,
} from "../../../lib/shared";

const handler = async (req, res) => {
  const [chantId, ext] = parseChantIdFromRequest(req);
  if (chantId) {
    if (ext === "html") {
      const html = await getChantHtml(chantId);
      if (html) {
        res.status(200).send(html);
        return;
      }
    } else if (ext === "json") {
      const json = await getChantJson(chantId);
      if (json) {
        res.status(200).json(json);
        return;
      }
    }
  }
  res.status(404).send("Not found");
};

export default handler;
