import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Election } from "../target/types/election";
import { assert, expect } from "chai";

describe("election", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const admin = provider.wallet as anchor.Wallet;
  const voter = provider.wallet as anchor.Wallet;
  const program = anchor.workspace.Election as Program<Election>;

  const keypairElection = anchor.web3.Keypair.generate();
  const ElectionCandidate = anchor.web3.Keypair.generate();
  const ElectionCandidate2 = anchor.web3.Keypair.generate();

  const voterBallot = anchor.web3.Keypair.generate();

  it("Initializes the Election", async () => {
    // Define the arguments.
    const election_title = "Test Election";
    const description = "Election for Unit Tests";

    // Call the initialize function via RPC.
    await program.methods
      .initialize(election_title, description)
      .accounts({
        admin: admin.publicKey,
        election: keypairElection.publicKey,
      })
      .signers([keypairElection])
      .rpc();

    // Fetch the election account.
    const electionAccount = await program.account.election.fetch(
      keypairElection.publicKey
    );

    // Check the election account fields.
    assert.ok(electionAccount.administrator.equals(admin.publicKey));
    assert.strictEqual(electionAccount.title, election_title);
    assert.strictEqual(electionAccount.description, description);
    assert.strictEqual(electionAccount.finished, false);
  });

  it("Adds a Candidate", async () => {
    // Define the arguments.
    const candidate_name = "John Doe";
    const candidate_age = 35;

    // Create a candidate account.
    const candidateAccount = await program.methods
      .addcandidate(candidate_name, candidate_age)
      .accounts({
        admin: admin.publicKey,
        election: keypairElection.publicKey,
        candidate: ElectionCandidate.publicKey,
      })
      .signers([ElectionCandidate])
      .rpc();

    await program.methods
      .addcandidate(candidate_name, candidate_age)
      .accounts({
        admin: admin.publicKey,
        election: keypairElection.publicKey,
        candidate: ElectionCandidate2.publicKey,
      })
      .signers([ElectionCandidate2])
      .rpc();

    const testCandidate = program.account.candidate.fetch(
      ElectionCandidate2.publicKey
    );
    const testElection = await program.account.election.fetch(
      keypairElection.publicKey
    );

    // Check if the candidate has been added.
    assert.equal(
      testElection.candidates[0].toString(),
      ElectionCandidate.publicKey.toString()
    );
    assert.equal(
      testElection.candidates[1].toString(),
      ElectionCandidate2.publicKey.toString()
    );
  });

  it("Initialize ballot", async () => {
    await program.methods
      .initializeballot()
      .accounts({
        election: keypairElection.publicKey,
        voter: voter.publicKey,
        ballotAccount: voterBallot.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([voterBallot])
      .rpc();

    const testBallot = await program.account.ballot.fetch(
      voterBallot.publicKey
    );

    assert.equal(testBallot.initialized, true);

    try {
      program.methods
        .initializeballot()
        .accounts({
          election: keypairElection.publicKey,
          voter: voter.publicKey,
          ballotAccount: voterBallot.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([voterBallot])
        .rpc();
    } catch (err) {
      assert.strictEqual(err.error.errorMessage, 'VoterAlreadyInitialized');
      // assert.strictEqual(err.error.errorCode.number, 6000);
    }
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
