import { getToc } from "../../lib/shared";

const handler = async (req, res) => {
  const toc = await getToc();
  res.status(200).json(toc);
};

export default handler;
