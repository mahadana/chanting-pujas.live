import {
  parseChantIdFromRequest,
  getTimingJson,
  setTimingJson,
} from "../../../lib/shared";

const handler = async (req, res) => {
  const [chantId, ext] = parseChantIdFromRequest(req);
  if (chantId && ext === "json") {
    if (req.method === "POST") {
      await setTimingJson(chantId, req.body);
      res.status(200).json(true);
    } else {
      res.status(200).json(await getTimingJson(chantId));
    }
  } else {
    res.status(404).send("Not found");
  }
};

export default handler;
