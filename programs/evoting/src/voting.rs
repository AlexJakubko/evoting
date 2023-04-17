use anchor_lang::prelude::*;
use anchor_lang::system_program;

use std::cmp::Ordering;


declare_id!("5HVDsFz47W9RkqogPYdvB6H2ybBeLy2niJ2vMWucbQo4");

#[program]
pub mod voting {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>,voted_candidate:u8, election:Pubkey) -> Result<()> {
        ctx.accounts.accountInfo.init(options)
    }
}

#[account]
pub struct AccountInfo {
    // Size: 1 + 299 + 1604 = 1904
    pub voted_candidate: u8, // 5 ElectionOption array = 4 + (59 * 5) = 299
    pub election: Pubkey, // 50 voters array = 4 + (32 * 50) = 1604
}

impl AccountInfo {
    pub const MAXIMUM_SIZE: usize = 1904;

    pub fn init(&mut self,voted_candidate:u8, election:Pubkey) -> Result<()> {
        require_eq!(self.finished, false, ElectionError::ElectionAlreadyFinished);
        self.voted_candidate = voted_candidate;
        self.election = election.clone();
        Ok(())
    }
}

#[error_code]
pub enum ElectionError {
    ElectionAlreadyFinished,
    ElectionOptionNotFound,
    UserAlreadyVoted,
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = election, space = 8 + Election::MAXIMUM_SIZE)]
    pub data: Account<'info, AccountInfo>,
    #[account(mut)]
    pub voter: Signer<'info>,
    pub system_program: Program<'info, System>,
}
