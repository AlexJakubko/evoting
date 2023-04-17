import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Election } from "../target/types/election";
import { expect } from "chai";

describe("election", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const payer = provider.wallet as anchor.Wallet;
  const program = anchor.workspace.Election as Program<Election>;
  const keypair = anchor.web3.Keypair.generate();

  it("Init poll", async () => {
    await program.methods
      .initialize(['Solana', 'Ethereum', 'Bitcoin'])
      .accounts({
        admin: (program.provider as anchor.AnchorProvider).wallet.publicKey,
        election: keypair.publicKey
      })
      .signers([keypair])
      .rpc();

    const state = await program.account
      .election
      .fetch(keypair.publicKey);

    console.log(state.candidates);
    expect(state.candidates).to.eql([
      {
        title: 'Solana',
        id: 1,
        votes: 0
      },
      {
        title: 'Ethereum',
        id: 2,
        votes: 0
      },
      {
        title: 'Bitcoin',
        id: 3,
        votes: 0
      }
    ]);
  });

  it("Vote option", async () => {
    const voterKeypair = anchor.web3.Keypair.generate();
    const voterAccount = anchor.web3.Keypair.generate();

    const transaction_signature = await program.methods
      .vote(1)
      .accounts({
        election: keypair.publicKey,
        voter: voterKeypair.publicKey,
        voterAccount: voterAccount.publicKey,
      })
      .signers([voterKeypair])
      .rpc();

    const state = await program.account
      .election
      .fetch(keypair.publicKey);
    console.log({ state });
  });

  // it("Cannot vote multiple times", async () => {
  //   const voterKeypair = anchor.web3.Keypair.generate();

  //   await program.methods
  //     .vote(1)
  //     .accounts({
  //       election: keypair.publicKey,
  //       voter: voterKeypair.publicKey
  //     })
  //     .signers([voterKeypair])
  //     .rpc();

  //   try {
  //     await program.methods
  //       .vote(1)
  //       .accounts({
  //         election: keypair.publicKey,
  //         voter: voterKeypair.publicKey,

  //       })
  //       .signers([voterKeypair])
  //       .rpc();
  //   } catch (err) {
  //     console.log(err.error.errorCode.code);
  //     expect(err.error.errorCode.code).to.eq('UserAlreadyVoted')
  //   }

    
  //   const state = await program.account
  //     .election
  //     .fetch(keypair.publicKey);
  //   console.log({ state });
  // });

  // it("Transfer between accounts using the system program", async () => {

  //   await getBalances(payer.publicKey, test1Recipient.publicKey, "Beginning");
    
  //   await program.methods.transferSolWithCpi(new anchor.BN(transferAmount))
  //     .accounts({
  //       from: payer.publicKey,
  //       to: test1Recipient.publicKey,
  //       systemProgram: anchor.web3.SystemProgram.programId,
  //     })
  //     .signers([payer.payer])
  //     .rpc();

  //   await getBalances(payer.publicKey, test1Recipient.publicKey, "Resulting");

  // });

  // async function getBalances(
  //   payerPubkey: anchor.web3.PublicKey, 
  //   recipientPubkey: anchor.web3.PublicKey, 
  //   timeframe: string
  // ) {

  //   let payerBalance = await provider.connection.getBalance(payerPubkey);
  //   let recipientBalance = await provider.connection.getBalance(recipientPubkey);
  //   console.log(`${timeframe} balances:`);
  //   console.log(`   Payer: ${payerBalance}`);
  //   console.log(`   Recipient: ${recipientBalance}`);
  // };
}); 