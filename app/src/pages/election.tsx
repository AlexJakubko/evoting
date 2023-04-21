import { useCallback, useState, useEffect } from "react";
import { useWallet, useAnchorWallet } from "@solana/wallet-adapter-react";
import { Program, web3 } from "@coral-xyz/anchor";
import { idl, programId, getProvider } from "../config/web3";
import { Navigate, useLocation, useParams } from "react-router-dom";
import { PublicKey } from "@solana/web3.js";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Select, MenuItem, Checkbox } from '@material-ui/core';

const bs58 = require("bs58");
const a = JSON.stringify(idl);
const b = JSON.parse(a);
const { Keypair } = web3;

function Election() {
  const [election, setPoll] = useState(null);
  const [voted, setVoted] = useState(false);
  const [data2, setData] = useState<any>([]);
  const [candidates2, setCandidate2] = useState<any>([]);
  const pollKey = useLocation();

  const anchorWallet = useAnchorWallet();
  const wallet = useWallet();

  console.log(pollKey.state);

  const subscribe = useCallback(async () => {
    const provider = await getProvider(wallet);
    const program = new Program(b, programId, provider);
    const pollPubKey = new PublicKey(pollKey.state);

    const emitter = program.account.election.subscribe(pollPubKey);

    emitter.on("change", (data) =>
      setPoll(data.candidates.filter((candidate: any) => !!candidate))
    );

    const state = await program.account.election.fetch(pollPubKey);

    // console.log(pollPubKey);

    // const owner = await program.account.election.all();
    // console.log(owner);

    // setVoted(state.voters.find(voter => voter.toString() === provider.wallet.publicKey.toString()));

    // setPoll(state.candidates.filter((candidate: any) => !!candidate));
  }, [pollKey.state, wallet]);

  useEffect(() => {
    if (pollKey && wallet.connected) {
      subscribe();
    }
  }, [subscribe, pollKey.state, wallet]);

  async function vote(id: number) {
    const provider = await getProvider(wallet);
    const program = new Program(idl, programId, provider);
    const ballotKeypair = Keypair.generate();
    const pollPubKey = new PublicKey(pollKey.state);

    // /console.log(ballotKeypair);
    // console.log(pollKey);
    try {
      const x = await program.methods
        .vote(id)
        .accounts({
          election: pollPubKey,
          voter: provider.wallet.publicKey,
          voterAccount: ballotKeypair.publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc();

      console.log(x);
      setVoted(true);
    } catch (error) {
      console.log(error);
    }
  }

  // async function vote(id) {

  //   const provider = await getProvider(wallet);
  //   const program = new Program(b, programId, provider);
  //   const pollPubKey = new PublicKey(strawsollId)
  //   const ownerPubKey = new PublicKey("EbiFEte2RBpR8eg4s96Zo4dbHvDBwjTmWCk8RPAtm2jE")
  // let ownerPubKey = Keypair.generate();
  // try {
  //   var transaction = new web3.Transaction().add(
  //     web3.SystemProgram.transfer({
  //       fromPubkey: provider.wallet.publicKey,
  //       toPubkey: ownerPubKey,
  //       lamports: 0.1 * web3.LAMPORTS_PER_SOL
  //     }),
  //   );
  //   let blockhashObj = await provider.connection.getLatestBlockhash();
  //   transaction.recentBlockhash = await blockhashObj.blockhash;
  //   transaction.feePayer = await provider.wallet.publicKey;
  //   const signedTx = await wallet.signTransaction(transaction)
  //   const txId = await provider.connection.sendRawTransaction(signedTx.serialize())
  //   await provider.connection.confirmTransaction(txId)
  //   if(transaction) {
  //     console.log("Txn created successfully");
  //   }
  //   setVoted(true);
  // } catch (error) {
  //   console.log(error)
  // }
  // }\
  async function data() {
    const provider = await getProvider(wallet);
    const program = new Program(idl, programId, provider);
    var res = program.account.election.all([
      {
        memcmp: {
          offset: 8,
          bytes: provider.wallet.publicKey.toBase58(),
        },
      },
    ]).then((res) => setData(res));
    console.log(data2);
    return res;
  }

  async function getCandidates() {
    const provider = await getProvider(wallet);
    const program = new Program(idl, programId, provider);
    let keys: PublicKey[] = [];
    for (let i = 0; i < data2[0].account.candidates.length; i++) {
      keys.push(new PublicKey(data2[0].account.candidates[i]))
    }
    var res = program.account.candidate.fetchMultiple(
      keys
    ).then((res) => setCandidate2(res));
    return res;
  }

  useEffect(() => {
  }, [data2])

  useEffect(() => {
    data();
    getCandidates();
    console.log(data2);
    console.log(candidates);
  }, [])

  const candidates = [
    { id: 1, name: 'Candidate A', age: 32 },
    { id: 2, name: 'Candidate B', age: 32 },
    { id: 3, name: 'Candidate C', age: 32 },
  ];

  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const handleCandidateChange = (event) => {
    setSelectedCandidate(event.target.value);
  };

  const handleVoteClick = () => {
    console.log(`Voted for candidate ${selectedCandidate}`);
    // Add your voting logic here
  };


  if (!wallet.connected && !wallet.connecting) {
    return <Navigate to="/" />;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Kandidát</TableCell>
            <TableCell>Vek</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {candidates.map((candidate) => (
            <TableRow key={candidate.id}>
              <TableCell>{candidate.name}</TableCell>
              <TableCell>{candidate.age}</TableCell>
              <TableCell>
                <Checkbox
                  checked={selectedCandidate === candidate.id}
                  onChange={handleCandidateChange}
                  value={candidate.id}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button variant="contained" color="primary" onClick={handleVoteClick} disabled={!selectedCandidate}>
        Vote
      </Button>
    </TableContainer>
  );
};

export default Election;
