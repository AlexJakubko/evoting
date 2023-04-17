import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Program, web3 } from "@coral-xyz/anchor";
import { programId, idl, getProvider } from "../config/web3";
import { Navigate, useNavigate } from "react-router-dom";
import React from "react";
import { createStyles, rem, Select, Button, TextInput } from '@mantine/core';

const { Keypair } = web3;

const useStyles = createStyles((theme) => ({
  root: {
    position: 'relative',
  },

  input: {
    height: rem(54),
    paddingTop: rem(18),
  },

  label: {
    position: 'absolute',
    pointerEvents: 'none',
    fontSize: theme.fontSizes.xs,
    paddingLeft: theme.spacing.sm,
    paddingTop: `calc(${theme.spacing.sm} / 2)`,
    zIndex: 1,
  },
})
);

function CreatePoll() {
  const { classes } = useStyles();
  const [pollKey, setPollKey] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState(false);
  const [copied, setCopied] = useState(false);
  const wallet = useWallet();
  const history = useNavigate();


  async function initialize(options: any[]) {
    const provider = await getProvider(wallet);
    const a = JSON.stringify(idl);
    const b = JSON.parse(a);

    const program = new Program(b, programId, provider);

    const newElectionKeypair = Keypair.generate();

    setPollKey(newElectionKeypair.publicKey.toString());
    try {
      await program.methods
        .initialize(options.filter((option) => !!option), "Parlamentne volby")
        .accounts({
          admin: provider.wallet.publicKey,
          election: newElectionKeypair.publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        .signers([newElectionKeypair])
        .rpc();

      setLoading(false);
      setCreated(true);
      // console.log(provider.wallet.publicKey);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  // const handleChange = (e: any, idx: number) => {
  //   setShowError(false);
  //   setOptions((old) => {
  //     old[idx] = e.target.value;

  //     return [...old];
  //   });
  // };

  if (!wallet.connected && !wallet.connecting) {
    return <Navigate to="/" />;
  }

  if (created) {
    return (
      <div className="flex flex-col gap-10 justify-center items-center w-full h-full">
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl text-white font-bold text-center">
            🎉 Your poll was created! 🎉
          </h1>
          <p className="text-lg text-white font-semibold">
            Click in the code bellow to copy it, then send it to whoever you
            want!
          </p>
        </div>
        <div className="flex flex-col gap-4 items-center">
          <button
            className="bg-white px-4 py-2 rounded-lg text-indigo-500 font-semibold text-lg"
            onClick={() => {
              navigator.clipboard.writeText(`${pollKey}`);
              setCopied(true);
            }}
          >
            {pollKey}
          </button>
          {copied && (
            <span className="text-green-700 font-bold">
              Copied to clipboard!
            </span>
          )}
          <button
            className="bg-indigo-500 px-4 py-2 rounded-lg text-white font-semibold text-lg"
            onClick={() => {
              history(`/election`, { state: pollKey });
            }}
          >
            Join Poll
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>

      {/* {!showError ? (
        <div className="h-6" />
      ) : (
        <span className="text-red-600 h-6 w-[800px] font-semibold text-lg">
          São necessárias pelo menos 2 opção não vazias.
        </span>
      )} */}

      <TextInput label="Názov volieb" placeholder="Parlamentné voľby SR" max={50} classNames={classes} value={name} />

      <TextInput label="Popis" placeholder="Parlamentné voľby Slovenskej Republiky" max={50} classNames={classes} />

      <Button color="green" radius="lg" size="md"
        onClick={() => {
          if (loading) return;
          // if (options.filter((opt) => opt.trim()).length < 2) {
          //   setShowError(true);
          //   return;
          // }
          setLoading(true);
          initialize();
        }}>
        Vytvoriť
      </Button>

    </div>
  );
}

export default CreatePoll;
