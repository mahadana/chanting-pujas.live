import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import ChantFontStyle from "./ChantFontStyle";

const PageLayout = ({ children }) => (
  <>
    <Head>
      <title>Chanting Server</title>
      <link rel="shortcut icon" href="/favicon.ico" />
    </Head>
    <ChantFontStyle />
    <Container maxWidth="md">
      <Typography variant="h2">
        <Link href="/" passHref>
          <a>
            <Image src="/monk.png" alt="Monk" width={90} height={90} />
          </a>
        </Link>{" "}
        Chanting Server
      </Typography>
      {children}
    </Container>
  </>
);

export default PageLayout;
