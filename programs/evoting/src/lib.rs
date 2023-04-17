use anchor_lang::prelude::*;

declare_id!("Gn3U9YVqjFmaNnKFBvDX4qaoTum4CBDwJz4KoYH6P4hA");

#[program]
pub mod election {
    use super::*;

    pub fn initialize(
        ctx: Context<Initialize>,
        candidates: Vec<String>,
        election_name: String
    ) -> Result<()> {
        ctx.accounts.election.init(candidates, election_name)
    }

    pub fn addcandidate(ctx: Context<Initialize>, new_candidate_title: String) -> Result<()> {
        let election = &mut ctx.accounts.election;
        require_eq!(election.finished, false, ElectionError::ElectionAlreadyFinished);
        // Get the next available candidate ID
        let next_id = (election.candidates.len() as u8) + 1;

        // Create a new candidate with the next available ID
        let new_candidate = Candidates {
            title: new_candidate_title.clone(),
            id: next_id,
            votes: 0,
        };
        election.candidates.push(new_candidate);
        Ok(())
    }

    pub fn initializeballot(ctx: Context<InitializeBallot>) -> Result<()> {
        let election = &mut ctx.accounts.election;
        let voter_account = &mut ctx.accounts.voter_account;
        require_eq!(voter_account.voted, true, VoterError::VoterAlreadyVoted);
        require_eq!(election.finished, true, ElectionError::ElectionAlreadyFinished);
        require_eq!(election.counted, true, ElectionError::ElectionAreNotCounted);
        voter_account.voted = false;
        voter_account.initialized = true;
        Ok(())
    }

    pub fn vote(ctx: Context<Vote>, candidate_vote_id: u8) -> Result<()> {
        let election = &mut ctx.accounts.election;
        let voter_account = &mut ctx.accounts.voter_account;
        require_eq!(election.finished, false, ElectionError::ElectionAlreadyFinished);
        require_eq!(
            election.candidates
                .iter()
                .filter(|candidate| candidate.id == candidate_vote_id)
                .collect::<Vec<&Candidates>>()
                .len(),
            1,
            ElectionError::ElectionCandidateNotFound
        );
        require_eq!(voter_account.initialized, true, VoterError::NotInitialized);

        let voter = &mut ctx.accounts.voter_account;
        election.candidates = election.candidates
            .iter()
            .map(|candidate| {
                let mut _candidate = candidate.clone();
                if _candidate.id == candidate_vote_id {
                    voter.voted = true;
                    voter.voted_candidate = candidate_vote_id;
                    _candidate.votes += 1;
                }
                _candidate
            })
            .collect();
        Ok(())
    }
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub struct Candidates {
    pub title: String, // up to 50 char. Size: 4 + 50 = 54 bytes
    pub id: u8, //Size 1 byte
    pub votes: u16, // Size: 4 bytes
}

#[account]
pub struct Election {
    // Size: 1 + 1 + 50 + 50 + 904 = 1
    pub candidates: Vec<Candidates>, // Candidates array = 4 + () =
    pub name: String, // up to 50 char.
    pub description: String, // up to 50 char.
    pub finished: bool, // bool = 1
    pub counted: bool, // bool = 1
}

#[account]
pub struct Ballot {
    pub voted_candidate: u8,
    pub voted: bool,
    pub initialized: bool,
}

impl Election {
    pub const MAXIMUM_SIZE: usize = 2000;

    pub fn init(&mut self, ids: Vec<String>, election_name: String) -> Result<()> {
        require_eq!(self.finished, false, ElectionError::ElectionAlreadyFinished);
        let mut c = 0;

        self.candidates = ids
            .iter()
            .map(|id| {
                c += 1;

                Candidates {
                    title: id.clone(),
                    id: c,
                    votes: 0,
                }
            })
            .collect();
        self.name = election_name.clone();
        self.finished = false;
        Ok(())
    }
}

#[error_code]
pub enum ElectionError {
    ElectionAlreadyFinished,
    ElectionCandidateNotFound,
    ElectionAreNotCounted,
}

#[error_code]
pub enum VoterError {
    NotInitialized,
    VoterAlreadyVoted,
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = admin, space = 8 + Election::MAXIMUM_SIZE)]
    pub election: Account<'info, Election>,
    #[account(mut)]
    pub admin: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct InitializeBallot<'info> {
    #[account(mut)]
    pub election: Account<'info, Election>,
    #[account(init, payer = voter, space = 2000)]
    pub voter_account: Account<'info, Ballot>,
    #[account(mut)]
    pub voter: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Vote<'info> {
    #[account(mut)]
    pub election: Account<'info, Election>,
    #[account(mut)]
    pub voter: Signer<'info>,
    // #[account(init, payer=user, space=16, seeds=[&vote_account.key().to_bytes()[..]], bump = vote_account.bump)]
    // #[account(owner = voter_account.key())]
    pub voter_account: Account<'info, Ballot>,
    pub system_program: Program<'info, System>,
}