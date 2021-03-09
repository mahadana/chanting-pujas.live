import { useRouter } from "next/router";

import ChantEditor from "../../components/ChantEditor";
import PageLayout from "../../components/PageLayout";

const ChanTrainEditPage = () => {
  const router = useRouter();
  const chantId = router.query.id;
  return (
    <PageLayout>
      <div>{chantId && <ChantEditor chantId={chantId} />}</div>
    </PageLayout>
  );
};

export default ChanTrainEditPage;
