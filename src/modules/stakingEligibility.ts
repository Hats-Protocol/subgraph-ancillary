import {
  StakingEligibility_JudgeHatChanged,
  StakingEligibility_RecipientHatChanged,
  StakingEligibility_Staked,
  StakingEligibility_UnstakeBegun,
  StakingEligibility_Slashed,
  StakingEligibility_MinStakeChanged,
  StakingEligibility_CooldownPeriodChanged,
  StakingEligibility_Forgiven,
} from "../../generated/templates/StakingEligibility/StakingEligibility";
import {
  StakingEligibility,
  HatAuthority,
  Stake,
  Staking_ForgivenEvent,
  Staking_CooldownPeriodChangedEvent,
  Staking_JudgeHatChangedEvent,
  Staking_MinStakeChangedEvent,
  Staking_RecipientHatChangedEvent,
  Staking_SlashedEvent,
  Staking_StakedEvent,
  Staking_UnstakeBegunEvent,
} from "../../generated/schema";
import { hatIdToHex } from "../utils";
import { BigInt } from "@graphprotocol/graph-ts";
import { createEventID } from "./utils";

export function handleJudgeHatChanged(
  event: StakingEligibility_JudgeHatChanged
): void {
  const stakingEligibility = StakingEligibility.load(
    event.address.toHexString()
  ) as StakingEligibility;

  // check if hat exists, create new object if not
  let judgeHatAuthority = HatAuthority.load(
    hatIdToHex(event.params.newJudgeHat)
  );
  if (judgeHatAuthority == null) {
    judgeHatAuthority = new HatAuthority(hatIdToHex(event.params.newJudgeHat));
  }

  stakingEligibility.judgeHat = hatIdToHex(event.params.newJudgeHat);

  const judgeHatChangedEvent = new Staking_JudgeHatChangedEvent(
    createEventID(event, "JudgeHatChangedEvent")
  );
  judgeHatChangedEvent.module = stakingEligibility.id;
  judgeHatChangedEvent.stakingEligibilityInstance = stakingEligibility.id;
  judgeHatChangedEvent.blockNumber = event.block.number.toI32();
  judgeHatChangedEvent.timestamp = event.block.timestamp;
  judgeHatChangedEvent.transactionID = event.transaction.hash;
  judgeHatChangedEvent.newJudgeHat = hatIdToHex(event.params.newJudgeHat);

  judgeHatChangedEvent.save();
  stakingEligibility.save();
  judgeHatAuthority.save();
}

export function handleRecipientHatChanged(
  event: StakingEligibility_RecipientHatChanged
): void {
  const stakingEligibility = StakingEligibility.load(
    event.address.toHexString()
  ) as StakingEligibility;

  // check if hat exists, create new object if not
  let recipientHatAuthority = HatAuthority.load(
    hatIdToHex(event.params.newRecipientHat)
  );
  if (recipientHatAuthority == null) {
    recipientHatAuthority = new HatAuthority(
      hatIdToHex(event.params.newRecipientHat)
    );
  }

  stakingEligibility.recipientHat = hatIdToHex(event.params.newRecipientHat);

  const recipientHatChangedEvent = new Staking_RecipientHatChangedEvent(
    createEventID(event, "RecipientHatChanged")
  );
  recipientHatChangedEvent.module = stakingEligibility.id;
  recipientHatChangedEvent.stakingEligibilityInstance = stakingEligibility.id;
  recipientHatChangedEvent.blockNumber = event.block.number.toI32();
  recipientHatChangedEvent.timestamp = event.block.timestamp;
  recipientHatChangedEvent.transactionID = event.transaction.hash;
  recipientHatChangedEvent.newRecipientHat = hatIdToHex(
    event.params.newRecipientHat
  );

  recipientHatChangedEvent.save();
  stakingEligibility.save();
  recipientHatAuthority.save();
}

export function handleStaked(event: StakingEligibility_Staked): void {
  const stakingEligibility = StakingEligibility.load(
    event.address.toHexString()
  ) as StakingEligibility;

  let stake = Stake.load(
    getStakeId(event.address.toHexString(), event.params.staker.toHexString())
  );
  if (stake == null) {
    stake = new Stake(
      getStakeId(event.address.toHexString(), event.params.staker.toHexString())
    );
    stake.stakingEligiblity = stakingEligibility.id;
    stake.staker = event.params.staker.toHexString();
    stake.amount = event.params.amount;
    stake.slashed = false;
    stake.cooldownAmount = BigInt.fromI32(0);
    stake.cooldownEndsAt = BigInt.fromI32(0);
  } else {
    const currentStake = stake.amount;
    stake.amount = currentStake.plus(event.params.amount);
  }

  const stakedEvent = new Staking_StakedEvent(
    createEventID(event, "StakedEvent")
  );
  stakedEvent.module = stakingEligibility.id;
  stakedEvent.stakingEligibilityInstance = stakingEligibility.id;
  stakedEvent.blockNumber = event.block.number.toI32();
  stakedEvent.timestamp = event.block.timestamp;
  stakedEvent.transactionID = event.transaction.hash;
  stakedEvent.staker = event.params.staker.toHexString();
  stakedEvent.amount = event.params.amount;

  stakedEvent.save();
  stake.save();
  stakingEligibility.save();
}

export function handleUnstakeBegun(
  event: StakingEligibility_UnstakeBegun
): void {
  const stakingEligibility = StakingEligibility.load(
    event.address.toHexString()
  ) as StakingEligibility;

  let stake = Stake.load(
    getStakeId(event.address.toHexString(), event.params.staker.toHexString())
  ) as Stake;
  stake.cooldownAmount = event.params.amount;
  stake.cooldownEndsAt = event.params.cooldownEnd;
  stake.amount.minus(event.params.amount);

  const unstakeBegunEvent = new Staking_UnstakeBegunEvent(
    createEventID(event, "UnstakeBegun")
  );
  unstakeBegunEvent.module = stakingEligibility.id;
  unstakeBegunEvent.stakingEligibilityInstance = stakingEligibility.id;
  unstakeBegunEvent.blockNumber = event.block.number.toI32();
  unstakeBegunEvent.timestamp = event.block.timestamp;
  unstakeBegunEvent.transactionID = event.transaction.hash;
  unstakeBegunEvent.staker = event.params.staker.toHexString();
  unstakeBegunEvent.amount = event.params.amount;
  unstakeBegunEvent.cooldownEnd = event.params.cooldownEnd;

  unstakeBegunEvent.save();
  stake.save();
  stakingEligibility.save();
}

export function handleSlashed(event: StakingEligibility_Slashed): void {
  const stakingEligibility = StakingEligibility.load(
    event.address.toHexString()
  ) as StakingEligibility;

  let stake = Stake.load(
    getStakeId(event.address.toHexString(), event.params.wearer.toHexString())
  ) as Stake;
  stake.slashed = true;
  stake.amount = BigInt.fromI32(0);
  stake.cooldownAmount = BigInt.fromI32(0);
  stake.cooldownEndsAt = BigInt.fromI32(0);
  stakingEligibility.totalSlashedStakes =
    stakingEligibility.totalSlashedStakes.plus(event.params.amount);

  const slashedEvent = new Staking_SlashedEvent(
    createEventID(event, "Slashed")
  );
  slashedEvent.module = stakingEligibility.id;
  slashedEvent.stakingEligibilityInstance = stakingEligibility.id;
  slashedEvent.blockNumber = event.block.number.toI32();
  slashedEvent.timestamp = event.block.timestamp;
  slashedEvent.transactionID = event.transaction.hash;
  slashedEvent.wearer = event.params.wearer.toHexString();
  slashedEvent.amount = event.params.amount;

  slashedEvent.save();
  stake.save();
  stakingEligibility.save();
}

export function handleMinStakeChanged(
  event: StakingEligibility_MinStakeChanged
): void {
  const stakingEligibility = StakingEligibility.load(
    event.address.toHexString()
  ) as StakingEligibility;

  stakingEligibility.minStake = event.params.newMinStake;

  const minStakeChangedEvent = new Staking_MinStakeChangedEvent(
    createEventID(event, "MinStakeChanged")
  );
  minStakeChangedEvent.module = stakingEligibility.id;
  minStakeChangedEvent.stakingEligibilityInstance = stakingEligibility.id;
  minStakeChangedEvent.blockNumber = event.block.number.toI32();
  minStakeChangedEvent.timestamp = event.block.timestamp;
  minStakeChangedEvent.transactionID = event.transaction.hash;
  minStakeChangedEvent.newMinStake = event.params.newMinStake;

  minStakeChangedEvent.save();
  stakingEligibility.save();
}

export function handleCooldownPeriodChanged(
  event: StakingEligibility_CooldownPeriodChanged
): void {
  const stakingEligibility = StakingEligibility.load(
    event.address.toHexString()
  ) as StakingEligibility;

  stakingEligibility.cooldownPeriod = event.params.newDelay;

  const cooldownPeriodChangedEvent = new Staking_CooldownPeriodChangedEvent(
    createEventID(event, "CooldownPeriodChanged")
  );
  cooldownPeriodChangedEvent.module = stakingEligibility.id;
  cooldownPeriodChangedEvent.stakingEligibilityInstance = stakingEligibility.id;
  cooldownPeriodChangedEvent.blockNumber = event.block.number.toI32();
  cooldownPeriodChangedEvent.timestamp = event.block.timestamp;
  cooldownPeriodChangedEvent.transactionID = event.transaction.hash;
  cooldownPeriodChangedEvent.newDelay = event.params.newDelay;

  cooldownPeriodChangedEvent.save();
  stakingEligibility.save();
}

export function handleForgiven(event: StakingEligibility_Forgiven): void {
  const stakingEligibility = StakingEligibility.load(
    event.address.toHexString()
  ) as StakingEligibility;

  let stake = Stake.load(
    getStakeId(event.address.toHexString(), event.params.staker.toHexString())
  ) as Stake;
  stake.slashed = false;

  stake.save();

  const forgivenEvent = new Staking_ForgivenEvent(
    createEventID(event, "Forgiven")
  );
  forgivenEvent.module = stakingEligibility.id;
  forgivenEvent.stakingEligibilityInstance = stakingEligibility.id;
  forgivenEvent.blockNumber = event.block.number.toI32();
  forgivenEvent.timestamp = event.block.timestamp;
  forgivenEvent.transactionID = event.transaction.hash;
  forgivenEvent.staker = event.params.staker.toHexString();

  forgivenEvent.save();
  stakingEligibility.save();
}

const getStakeId = (module: string, account: string): string => {
  return module + "-" + account;
};
