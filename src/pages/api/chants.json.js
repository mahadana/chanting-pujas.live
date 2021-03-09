import { getChantData } from "../../lib/shared";

const handler = async (req, res) => {
  const chantData = await getChantData();
  res.status(200).json(chantData);
};

export default handler;
