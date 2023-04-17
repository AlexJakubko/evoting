import React, { useContext } from "react";
import { useCallback, useState, useEffect } from "react";
import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import { Program, web3 } from "@coral-xyz/anchor";
import { programId, idl, getProvider } from "../config/web3";
import { Navigate, useLocation } from "react-router-dom";


const { Keypair } = web3;

const solanaWeb3 = require("@solana/web3.js");

function Init() {
  const [election, setPoll] = useState(null);
  const [ballotInit, setBallot] = useState(false);
  const electionPublicKey = useState("pollKey");
  console.log(electionPublicKey);


  //Wallets
  const anchorWallet = useAnchorWallet();
  const wallet = useWallet();

  const subscribe = useCallback(async () => {
    const provider = await getProvider(wallet);
    const program = new Program(idl, programId, provider);
  }, [electionPublicKey, wallet]);

  useEffect(() => {
    if (electionPublicKey && wallet.connected) {
      subscribe();
    }
  }, [subscribe, electionPublicKey, wallet]);

  async function initBallot(electionPublicKey: string) {
    const provider = await getProvider(wallet);
    const program = new Program(idl, programId, provider);
    const ballotKeypair = Keypair.generate();

    try {
      await program.methods
        .initializeballot()
        .accounts({
          voter: provider.wallet.publicKey,
          voterAccount: ballotKeypair.publicKey,
          election: electionPublicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        .signers([ballotKeypair])
        .rpc();

      setBallot(true);
    } catch (error: any) {
      console.log(error.error);
    }
  }

  if (!wallet.connected && !wallet.connecting) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 w-full h-full">
      <div className="mb-10 flex flex-col gap-3">
        <p className="text-lg text-center text-slate-100 font-bold">
          Only one vote allowed per wallet.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => initBallot("FW1soqTHGprmkS8v5oGBa2zj39MGswQCda7Z7RFHCY9T")}
          className="bg-white items-center flex relative w-[500px] h-20 text-lg p-4 rounded-xl outline-none border-2 border-indigo-500"
          style={{ cursor: "pointer" }}
        >
          Tutaj
        </button>
      </div>
    </div>
  );
}

export default Init;
