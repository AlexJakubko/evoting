import { Grid, rem, Container } from "@mantine/core";
import Candidate from "../components/candidate";

function Candidates() {
  return (
    // <Grid xs>
    <Container size="xl" px="xl">
      <Grid justify="space-around">
        <Grid.Col span={3} style={{ minHeight: rem(100) }}>
          <Candidate></Candidate>
        </Grid.Col>
        <Grid.Col span={3} style={{ minHeight: rem(100) }}>
          <Candidate></Candidate>
        </Grid.Col>
        <Grid.Col span={3}>
          <Candidate></Candidate>
        </Grid.Col>
      </Grid>
    </Container>
    // </Grid>
  );
}

export default Candidates;
