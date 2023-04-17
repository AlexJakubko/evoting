import { Card, Grid, Text, Button, Row } from "@nextui-org/react";

type Account = {
  post: {
    name: string;
  };
};

export default function Election({ post }: Account) {
  return (
    <Grid.Container gap={6}>
      <Grid sm={12} md={9}>
        <Card >
          <Card.Header>
            <Text b>{post.name}</Text>
          </Card.Header>
          <Card.Divider />
          <Card.Body >
            <Text>
              Some quick example text to build on the card title and make up the
              bulk of the card's content.
            </Text>
          </Card.Body>
          <Card.Divider />
          <Card.Footer>
            <Row justify="center">
              <Button size="md">Otvorit volby</Button>
            </Row>
          </Card.Footer>
        </Card>
      </Grid>
    </Grid.Container >
  );
}