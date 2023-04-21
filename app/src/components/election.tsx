import { Card, Grid, Text, Button, Row } from "@nextui-org/react";

type Account = {
  election: {
    title: string;
    description: string;
  };
};

export default function Election({ election }: Account) {
  return (
    <Grid.Container gap={6}>
      <Grid sm={12} md={9}>
        <Card >
          <Card.Header>
            <Text b>{election.title}</Text>
          </Card.Header>
          <Card.Divider />
          <Card.Body >
            <Text>
              {election.description}
            </Text>
          </Card.Body>
          <Card.Divider />
          <Card.Footer>
            <Row justify="center">
              <Button size="md">Prihlásenie</Button>
            </Row>
          </Card.Footer>
        </Card>
      </Grid>
    </Grid.Container >
  );
}