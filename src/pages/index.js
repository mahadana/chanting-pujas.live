import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import ChantToc from "../components/ChantToc";
import PageLayout from "../components/PageLayout";

const loadToc = async () => {
  const response = await fetch("/toc.json", { cache: "no-cache" });
  return await response.json();
};

const ChanTrainEditPage = () => {
  const router = useRouter();
  const [toc, setToc] = useState();

  const onOpen = ({ chantIndex, link }) => {
    if (chantIndex >= 0) {
      router.push(`/edit/${link}`);
    }
  };

  useEffect(() => {
    if (!toc) {
      loadToc().then(setToc).catch(console.error);
    }
  }, []);

  return (
    <PageLayout>
      {toc && <ChantToc fullToc onOpen={onOpen} toc={toc} />}
    </PageLayout>
  );
};

export default ChanTrainEditPage;
