import { Box, Card, CardContent, Grid, TableBody, TableHead, Table, TableCell, TableRow } from "@material-ui/core";

type Account = {
  title: string;
  description: string;
};

type Candidate = {
  name: string;
  age: number;
};


export default function Admin({ election, candidates }: { election: Account; candidates: Candidate[] }) {
  return (
    <Card style={{ maxWidth: 600 }}>
      <Box display="flex" flexDirection="row">
        <Grid container spacing={2}>
          <Grid item xs={6}>
            {election.title}
          </Grid>
          <Grid item xs={6}>
            {election.description}
          </Grid>
        </Grid>
      </Box>
      <CardContent>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Meno kandidáta</TableCell>
              <TableCell>Vek kandidáta</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {candidates.map((candidate) => (
              <TableRow key={candidate.name}>
                <TableCell>{candidate.name}</TableCell>
                <TableCell>{candidate.age}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

