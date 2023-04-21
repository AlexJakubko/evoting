import React from "react";
import { useState, useEffect } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Program, web3 } from "@coral-xyz/anchor";
import { programId, idl, getProvider } from "../config/web3";
import { Navigate, useNavigate } from "react-router-dom";
import { PublicKey } from "@solana/web3.js";
import { Button, TextInput, Box, Group, NumberInput, SimpleGrid, Center, Grid, Container } from '@mantine/core';
import Admin from "../components/admin";

const { Keypair } = web3;

function CreatePoll() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const wallet = useWallet();

  const [data2, setData] = useState<any>([]);
  const [candidates, setCandidate] = useState<any>([]);
  const [title, setTitle] = useState('');
  const [describtion, setDescribtion] = useState('');
  const [age, setAge] = useState<number | any>(0);
  const [name, setName] = useState('');

  const [electionKey, setElectionKey] = useState("");
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState(false);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  async function initialize(title: String, description: String) {
    const provider = await getProvider(wallet);
    const a = JSON.stringify(idl);
    const b = JSON.parse(a);

    const program = new Program(b, programId, provider);
    const newElectionKeypair = Keypair.generate();

    setElectionKey(newElectionKeypair.publicKey.toString());

    try {
      const x = await program.methods
        .initialize(title, description)
        .accounts({
          admin: publicKey,
          election: newElectionKeypair.publicKey
        })
        .signers([newElectionKeypair])
        .rpc();

      setLoading(false);
      setCreated(true);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  async function addCandidate(name: String, age: number) {
    const provider = await getProvider(wallet);
    const a = JSON.stringify(idl);
    const b = JSON.parse(a);
    const program = new Program(b, programId, provider);
    const newCandidateKeypair = Keypair.generate();
    const key = new PublicKey(electionKey);
    try {
      const x = await program.methods
        .addcandidate(name, age)
        .accounts({
          admin: publicKey,
          election: key,
          candidate: newCandidateKeypair.publicKey,
        })
        .signers([newCandidateKeypair])
        .rpc();
      console.log(x);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
    data();
  }

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

  const handleChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setTitle(event.target.value);
  };
  const handleChangeDesc = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setDescribtion(event.target.value);
  };
  const handleChangeName = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setName(event.target.value);
  };


  if (created || data2.length) {
    return (
      <Grid>
        {data2[0].account && <Grid.Col span={5}>
          <Admin election={data2[0].account}
            candidates={candidates} />
        </Grid.Col>
        }
        <Grid.Col span={7}>
          <Box maw={300} mx="auto">
            <TextInput label="Pridať kandidáta" placeholder="Meno kandidáta" value={name} onChange={handleChangeName} />
            <NumberInput
              mt="sm"
              label="Vek"
              placeholder="Vek"
              min={18}
              max={99}
              defaultValue={18}
              value={age} onChange={setAge}
            />
            <Group position="center" mt="md">
              <Button color="green" radius="lg" size="md"
                onClick={() => {
                  addCandidate(name, age);
                }}>
                Vytvoriť
              </Button>
            </Group>
          </Box>
        </Grid.Col>
      </Grid>
    );
  }
  else {
    return (
      <SimpleGrid cols={3}>
        <div></div>
        <Center maw={400} h={600} mx="auto">
          <div>
            <Box maw={600} mx="auto">
              <TextInput label="Názov volieb" placeholder="Parlamentné voľby SR" max={50} value={title} onChange={handleChange} />

              <TextInput label="Popis" placeholder="Parlamentné voľby Slovenskej Republiky" max={50} value={describtion} onChange={handleChangeDesc} />

              <Group position="center" mt="md">
                <Button color="green" radius="lg" size="md"
                  onClick={() => {
                    if (loading) return;
                    setLoading(true);
                    initialize(title, describtion);
                  }}>
                  Vytvoriť
                </Button>
              </Group>
            </Box>
          </div >
        </Center>
        <div></div>
      </SimpleGrid>
    );
  }
}

export default CreatePoll;
