import { useCallback, useState, useEffect } from "react";
import { useWallet, useAnchorWallet } from "@solana/wallet-adapter-react";
import { Program, web3 } from "@coral-xyz/anchor";
import { idl, programId, getProvider } from "../config/web3";
import { Navigate, useLocation, useParams } from "react-router-dom";
import { PublicKey } from "@solana/web3.js";

const bs58 = require("bs58");
const a = JSON.stringify(idl);
const b = JSON.parse(a);
const { Keypair } = web3;

function Election() {
  const [election, setPoll] = useState(null);
  const [voted, setVoted] = useState(false);
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
  // }

  if (!wallet.connected && !wallet.connecting) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 w-full h-full">
      <div className="mb-10 flex flex-col gap-3">
        <h1 className="text-5xl text-white font-bold text-center">
          Your time to vote!
        </h1>
        <button
      onClick={() =>  vote(1)}
      className="bg-white items-center flex relative w-[500px] h-20 text-lg p-4 rounded-xl outline-none border-2 border-indigo-500"
      style={{ cursor: "pointer" }}
    >
       Tutaj
    </button>
      </div>
      </div>
  );
}

export default Election;
