import { getTimingJsons } from "../../lib/shared";

const handler = async (req, res) => {
  const toc = await getTimingJsons();
  res.status(200).json(toc);
};

export default handler;
