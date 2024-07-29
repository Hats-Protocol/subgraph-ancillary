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
} from "../../generated/schema";
import { hatIdToHex } from "../utils";
import { BigInt } from "@graphprotocol/graph-ts";

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
  stakingEligibility.save();
}

export function handleCooldownPeriodChanged(
  event: StakingEligibility_CooldownPeriodChanged
): void {
  const stakingEligibility = StakingEligibility.load(
    event.address.toHexString()
  ) as StakingEligibility;

  stakingEligibility.cooldownPeriod = event.params.newDelay;
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
  stakingEligibility.save();
}

const getStakeId = (module: string, account: string): string => {
  return module + "-" + account;
};
