use anchor_lang::prelude::*;

declare_id!("Gn3U9YVqjFmaNnKFBvDX4qaoTum4CBDwJz4KoYH6P4hA");

#[program]
pub mod election {
    use super::*;

    pub fn initialize(
        ctx: Context<Initialize>,
        election_title: String,
        description: String
    ) -> Result<()> {
        let election = &mut ctx.accounts.election;
        let admin: &Signer = &ctx.accounts.admin;
        require_eq!(election.finished, false, ElectionError::ElectionAlreadyFinished);
        election.administrator = *admin.key;
        election.title = election_title.clone();
        election.description = description.clone();
        election.finished = false;
        Ok(())
    }

    pub fn addcandidate(
        ctx: Context<AddCandidate>,
        candidate_name: String,
        candidate_age: u8
    ) -> Result<()> {
        let election = &mut ctx.accounts.election;
        let new_candidate = &mut ctx.accounts.candidate;
        require_eq!(
            election.candidates
                .iter()
                .filter(|candidate| candidate.key() == new_candidate.key())
                .collect::<Vec<&Pubkey>>()
                .len(),
            0,
            ElectionError::ElectionCandidateAlreadyExist
        );
        require_eq!(election.finished, false, ElectionError::ElectionAlreadyFinished);
        require_eq!(election.started, false, ElectionError::ElectionNotStarted);
        election.candidates.push(new_candidate.key());
        new_candidate.name = candidate_name.clone();
        new_candidate.age = candidate_age;
        new_candidate.votes = 0;
        Ok(())
    }

    pub fn initializeballot(ctx: Context<InitializeBallot>) -> Result<()> {
        let election = &mut ctx.accounts.election;
        let ballot_account = &mut ctx.accounts.ballot_account;
        require_eq!(ballot_account.initialized, true, ElectionError::VoterAlreadyInitialized);
        require_eq!(ballot_account.voted, false, ElectionError::VoterAlreadyVoted);
        require_eq!(election.finished, false, ElectionError::ElectionAlreadyFinished);
        ballot_account.voted = false;
        ballot_account.initialized = true;
        Ok(())
    }

    pub fn vote(ctx: Context<Vote>) -> Result<()> {
        let election = &mut ctx.accounts.election;
        let ballot_account = &mut ctx.accounts.ballot_account;
        let candidate = &mut ctx.accounts.candidate;
        require_eq!(election.finished, false, ElectionError::ElectionAlreadyFinished);
        require_eq!(ballot_account.initialized, true, ElectionError::NotInitialized);
        candidate.votes += 1;
        ballot_account.voted = true;
        Ok(())
    }
}

#[account]
pub struct Candidate {
    //Size: 1 + 1 + 4 + 50 + 8 = 64 bytes
    pub name: String, // up to 50 char = 50 bytes
    pub age: u8, // 1 byte
    pub votes: u16, // 4 bytes
}

#[account]
pub struct Election {
    // Size: 1 + 1 + 54 + 54 + 32 + 964 + 8 = 1038 bytes
    pub title: String, // up to 50 char + 4 = 54 byte
    pub administrator: Pubkey, // 32 bytes
    pub candidates: Vec<Pubkey>, // 32 * 30 + 4 = 964 candidates bytes
    pub description: String, // up to 50 char + 4 = 54 byte
    pub finished: bool, // 1 byte
    pub started: bool, // 1 byte
}

#[account]
pub struct Ballot {
    // Size: 1 + 1 + 32 + 8 = 42 bytes
    pub candidate: Pubkey, // 32 bytes
    pub voted: bool, // 1 byte
    pub initialized: bool, // 1 byte
}

impl Election {
    pub const MAXIMUM_SIZE: usize = 1038;
}

#[error_code]
pub enum ElectionError {
    ElectionAlreadyFinished,
    ElectionCandidateNotFound,
    ElectionCandidateAlreadyExist,
    ElectionNotStarted,
    NotInitialized,
    VoterAlreadyVoted,
    VoterAlreadyInitialized,
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = admin, space = Election::MAXIMUM_SIZE)]
    pub election: Account<'info, Election>,
    #[account(mut)]
    pub admin: Signer<'info>,
    pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct AddCandidate<'info> {
    #[account(mut)]
    pub election: Account<'info, Election>,
    #[account(init, payer = admin, space = Election::MAXIMUM_SIZE + 56 + 8)]
    pub candidate: Account<'info, Candidate>,
    #[account(mut)]
    pub admin: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct InitializeBallot<'info> {
    #[account(mut)]
    pub election: Account<'info, Election>,
    #[account(init, payer = voter, space = Election::MAXIMUM_SIZE + 34)]
    pub ballot_account: Account<'info, Ballot>,
    #[account(mut)]
    pub voter: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Vote<'info> {
    #[account(mut)]
    pub election: Account<'info, Election>,
    #[account(mut)]
    pub candidate: Account<'info, Candidate>,
    #[account(mut)]
    pub voter: Signer<'info>,
    #[account(
        init,
        payer = voter,
        owner = ballot_account.key(),
        space = Election::MAXIMUM_SIZE + 3
    )]
    pub ballot_account: Account<'info, Ballot>,
    pub system_program: Program<'info, System>,
}