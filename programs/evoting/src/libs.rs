use anchor_lang::prelude::*;
use anchor_lang::prelude::*;
use anchor_lang::system_program;

use std::cmp::Ordering;


declare_id!("5HVDsFz47W9RkqogPYdvB6H2ybBeLy2niJ2vMWucbQo4");

#[program]
pub mod evoting {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, options: Vec<String>) -> Result<()> {
        ctx.accounts.election.init(options)
    }

    pub fn vote(ctx: Context<Vote>, vote_id: u8) -> Result<()> {
        ctx.accounts.election.vote(vote_id, ctx.accounts.voter.key());
        Ok(())
    }

    pub fn transfer_sol_with_cpi(
        ctx: Context<SolSend>, 
        amount: u64
    ) -> Result<()> {

        system_program::transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                system_program::Transfer {
                    from: ctx.accounts.from.to_account_info(),
                    to: ctx.accounts.to.to_account_info(),
                },
            ),
            amount,
        )?;

        Ok(())
    }

    pub fn addDataInto(ctx: Context<AddData>,  data: String ) -> Result<()> {

        system_program::transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                system_program::Transfer {
                    from: ctx.accounts.from.to_account_info(),
                    to: ctx.accounts.to.to_account_info(),
                },
            ),
            amount,
        )?;

        Ok(())
    }


}

#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub struct ElectionOption {
    // Size: 54 + 1 + 4 = 59 bytes
    pub title: String, // up to 50 char. Size: 4 + 50 = 54 bytes
    pub id: u8, // Size: 1 byte
    pub votes: u16, // Size: 4 bytes
}

#[account]
pub struct Election {
    // Size: 1 + 299 + 1604 = 1904
    pub options: Vec<ElectionOption>, // 5 ElectionOption array = 4 + (59 * 5) = 299
    pub voters: Vec<Pubkey>, // 50 voters array = 4 + (32 * 50) = 1604
    pub finished: bool, // bool = 1
}

impl Election {
    pub const MAXIMUM_SIZE: usize = 1904;

    pub fn init(&mut self, options: Vec<String>) -> Result<()> {
        require_eq!(self.finished, false, ElectionError::ElectionAlreadyFinished);
        let mut c = 0;

        self.options = options
            .iter()
            .map(|option| {
                c += 1;

                ElectionOption {
                    title: option.clone(),
                    id: c,
                    votes: 0,
                }
            })
            .collect();
        self.finished = false;
        Ok(())
    }

    pub fn vote(&mut self, vote_id: u8, voter_key: Pubkey) -> Result<()> {
        require_eq!(self.finished, false, ElectionError::ElectionAlreadyFinished);
        require_eq!(
            self.options
                .iter()
                .filter(|option| option.id == vote_id)
                .collect::<Vec<&ElectionOption>>()
                .len(),
            1,
            ElectionError::ElectionOptionNotFound
        );
        require_eq!(
            self.voters
                .iter()
                .filter(|voter| voter.cmp(&&voter_key) == Ordering::Equal)
                .collect::<Vec<&Pubkey>>()
                .len(),
            0,
            ElectionError::UserAlreadyVoted
        );

        self.voters.push(voter_key);
        self.options = self.options
            .iter()
            .map(|option| {
                let mut _option = option.clone();

                if _option.id == vote_id {
                    _option.votes += 1;
                }

                _option
            })
            .collect();
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
    #[account(init, payer = owner, space = 8 + Election::MAXIMUM_SIZE)]
    pub election: Account<'info, Election>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Vote<'info> {
    #[account(mut)]
    pub election: Account<'info, Election>,
    #[account(mut)]
    pub voter: Signer<'info>,
}

#[derive(Accounts)]
pub struct SolSend<'info> {
    #[account(mut)]
    /// CHECK: This is not dangerous because we don't read or write from this account
    pub from: Signer<'info>,
    /// CHECK: This is not dangerous because we don't read or write from this account
    #[account(mut)]
    pub to: AccountInfo<'info>,
    /// CHECK: This is not dangerous because we don't read or write from this account
    pub system_program: Program<'info,System>,
}

#[derive(Accounts)]
pub struct Data<'info> {
    #[account(mut)]
    pub voter: Signer<'info>,
    pub title: String, 
}