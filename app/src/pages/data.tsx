import { useWallet } from "@solana/wallet-adapter-react";
import { Grid, Card, Text } from "@nextui-org/react";
import { Program, ProgramAccount, web3 } from "@coral-xyz/anchor";
import { programId, idl, getProvider } from "../config/web3";
import { Navigate, useNavigate } from "react-router-dom";
import Election from '../components/election';
import { useEffect, useState } from "react";
import { PublicKey } from "@solana/web3.js";


function Data() {
  const [election, setPoll] = useState(null);
  const [data2, setData] = useState<any>([]);
  const [electionKey, setElectionKey] = useState("");
  const [candidates, setCandidate] = useState<any>([]);
  const navigate = useNavigate();

  const wallet = useWallet();

  async function data() {
    const provider = await getProvider(wallet);
    const program = new Program(idl, programId, provider);
    var res;
    if (wallet && provider.wallet.publicKey.toBase58() != null) {
      res = program.account.election.all([
        {
          memcmp: {
            offset: 8,
            bytes: wallet.publicKey!.toBase58(),
          },
        },
      ]).then((res) => {
        setData(res);
        setElectionKey(res[0].publicKey.toString());
        getCandidates(res);
      });
    }
    return res;
  }

  async function getCandidates(response) {
    const provider = await getProvider(wallet);
    const program = new Program(idl, programId, provider);
    let keys: PublicKey[] = [];
    var res;
    for (let i = 0; i < response[0].account.candidates.length; i++) {
      keys.push(new PublicKey(response[0].account.candidates[i]))
    }
    res = program.account.candidate.fetchMultiple(
      keys
    ).then((res) => setCandidate(res));
    return res;
  }


  useEffect(() => {
  }, [data2])

  useEffect(() => {
    if (!wallet.connected && !wallet.connecting) {
      navigate("/");
    }
    data();
  }, [])


  return (
    <Grid.Container gap={6} justify="center">
      {
        data2.map((p: any, i: any) => (
          <Grid xs>
            <Election key={`name`} election={p.account} />
          </Grid>
        ))
      }
    </Grid.Container>
  );
}

export default Data;
