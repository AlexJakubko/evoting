import { useWallet } from "@solana/wallet-adapter-react";
import { Grid, Card, Text } from "@nextui-org/react";
import { Program, web3 } from "@coral-xyz/anchor";
import { programId, idl, getProvider } from "../config/web3";
import { Navigate } from "react-router-dom";
import Election from '../components/election';


function Data() {
  // const [election, setPoll] = useState(null);
  // const [voted, setVoted] = useState(false);
  // const anchorWallet = useAnchorWallet();
  const wallet = useWallet();

  async function data() {
    const provider = await getProvider(wallet);
    const program = new Program(idl, programId, provider);
    var res = program.account.election.all();
    return res;
  }
  console.log(data());

  // const articles: Accounts[] = [];
  // const subscribe = useCallback(async () => {
  //   const provider = await getProvider(wallet)
  //   const program = new Program(b, programId, provider);
  // const emitter = program.account.election.subscribe(pollPubKey);
  // emitter.on('change', (data) => setPoll(data.options.filter(option => !!option)));

  // const state = await program.account.election.fetch(pollPubKey);
  // const accounts = await provider.connection.getParsedProgramAccounts(
  //   pollPubKey
  // );
  // const data = accounts[1];
  // await console.log(data);
  // console.log(accounts);
  // setVoted(state.voters.find(voter => voter.toString() === provider.wallet.publicKey.toString()));
  // setPoll(data.options.filter(option => !!option));

  // const emitter = program.account.election.subscribe(pollPubKey);
  // emitter.on('change', (data) => setPoll(data.options.filter(option => !!option)));

  // const state = await program.account.election.fetch(pollPubKey);

  // setVoted(state.voters.find(voter => voter.toString() === provider.wallet.publicKey.toString()));
  // setPoll(state.options.filter(option => !!option));
  // }, [strawsollId, wallet]);

  // useEffect(() => {
  //   if (wallet.connected) {
  //     subscribe();
  //   }
  // }, [subscribe, wallet]);

  //   const program = new Program(b, programId, provider);
  //   const pollPubKey = new PublicKey(strawsollId)
  //   const ownerPubKey = new PublicKey("EbiFEte2RBpR8eg4s96Zo4dbHvDBwjTmWCk8RPAtm2jE")
  //   // let ownerPubKey = Keypair.generate();
  // try {
  // console.log(provider.connection.getProgramAccounts(new web3.PublicKey(pollPubKey)));
  // } catch (error) {
  //   console.log(error)
  // }

  const testData = [
    {
      "account": {
        "counted": false,
        "finished": false,
        "name": "Volby",
        "candidates": [
          {
            "title": "",
            "id": 1,
            "votes": 0
          },
          {
            "title": "dasda",
            "id": 2,
            "votes": 0
          }
        ],
      }
    },
  ]
  if (!wallet.connected && !wallet.connecting) {
    return (
      <Navigate to="/" />
    );
  }

  return (
    <Grid.Container gap={6} justify="center">
      {
        testData.map((p, i) => (
          <Grid xs>
            <Election key={`name`} post={p.account} />
          </Grid>
        ))
      }
    </Grid.Container>
  );
}

export default Data;
