import {
  MinStakeSet,
  Slashed,
  Staked,
  UnstakeBegun,
  UnstakeCompleted,
  JudgeSet,
} from "../../generated/templates/HatsStakingShaman/HatsStakingShaman";
import { HatsStakingShaman, ShamanStake } from "../../generated/schema";
import { Address, BigInt } from "@graphprotocol/graph-ts";
import { HatsStakingShaman as HatsStakingShamanContract } from "../../generated/templates/HatsStakingShaman/HatsStakingShaman";
import { hatIdToHex } from "../utils";

export function handleMinStakeSet(event: MinStakeSet): void {
  const hatsStakingShaman = HatsStakingShaman.load(
    event.address.toHexString()
  ) as HatsStakingShaman;

  hatsStakingShaman.minStake = event.params.minStake;
  hatsStakingShaman.save();
}

export function handleJudgeSet(event: JudgeSet): void {
  const hatsStakingShaman = HatsStakingShaman.load(
    event.address.toHexString()
  ) as HatsStakingShaman;

  hatsStakingShaman.judgeHat = hatIdToHex(event.params.judge);
  hatsStakingShaman.save();
}

export function handleSlashed(event: Slashed): void {
  const hatsStakingShaman = HatsStakingShaman.load(
    event.address.toHexString()
  ) as HatsStakingShaman;

  const hatsStakingShamanContract = HatsStakingShamanContract.bind(
    event.address
  );

  const stakeId = getStakeId(event.address, event.params.member);
  let shamanStake = ShamanStake.load(stakeId);
  if (shamanStake == null) {
    shamanStake = new ShamanStake(stakeId);
    shamanStake.stakingShaman = hatsStakingShaman.id;
    shamanStake.staker = event.params.member.toHexString();
  }

  const stakeRes = hatsStakingShamanContract.stakes(event.params.member);
  shamanStake.amount = stakeRes.getStakedAmount();
  shamanStake.unstakingAmount = stakeRes.getUnstakingAmount();
  shamanStake.canUnstakeAfter = stakeRes.getCanUnstakeAfter();
  shamanStake.save();
  hatsStakingShaman.save();
}

export function handleStaked(event: Staked): void {
  const hatsStakingShaman = HatsStakingShaman.load(
    event.address.toHexString()
  ) as HatsStakingShaman;

  const hatsStakingShamanContract = HatsStakingShamanContract.bind(
    event.address
  );

  const stakeId = getStakeId(event.address, event.params.member);
  let shamanStake = ShamanStake.load(stakeId);
  if (shamanStake == null) {
    shamanStake = new ShamanStake(stakeId);
    shamanStake.stakingShaman = hatsStakingShaman.id;
    shamanStake.staker = event.params.member.toHexString();
  }

  const stakeRes = hatsStakingShamanContract.stakes(event.params.member);
  shamanStake.amount = stakeRes.getStakedAmount();
  shamanStake.unstakingAmount = stakeRes.getUnstakingAmount();
  shamanStake.canUnstakeAfter = stakeRes.getCanUnstakeAfter();
  shamanStake.save();
  hatsStakingShaman.save();
}

export function handleUnstakeBegun(event: UnstakeBegun): void {
  const hatsStakingShaman = HatsStakingShaman.load(
    event.address.toHexString()
  ) as HatsStakingShaman;

  const hatsStakingShamanContract = HatsStakingShamanContract.bind(
    event.address
  );

  const stakeId = getStakeId(event.address, event.params.member);
  let shamanStake = ShamanStake.load(stakeId);
  if (shamanStake == null) {
    shamanStake = new ShamanStake(stakeId);
    shamanStake.stakingShaman = hatsStakingShaman.id;
    shamanStake.staker = event.params.member.toHexString();
  }

  const stakeRes = hatsStakingShamanContract.stakes(event.params.member);
  shamanStake.amount = stakeRes.getStakedAmount();
  shamanStake.unstakingAmount = stakeRes.getUnstakingAmount();
  shamanStake.canUnstakeAfter = stakeRes.getCanUnstakeAfter();
  shamanStake.save();
  hatsStakingShaman.save();
}

export function handleUnstakeCompleted(event: UnstakeCompleted): void {
  const hatsStakingShaman = HatsStakingShaman.load(
    event.address.toHexString()
  ) as HatsStakingShaman;

  const hatsStakingShamanContract = HatsStakingShamanContract.bind(
    event.address
  );

  const stakeId = getStakeId(event.address, event.params.member);
  let shamanStake = ShamanStake.load(stakeId);
  if (shamanStake == null) {
    shamanStake = new ShamanStake(stakeId);
    shamanStake.stakingShaman = hatsStakingShaman.id;
    shamanStake.staker = event.params.member.toHexString();
  }

  const stakeRes = hatsStakingShamanContract.stakes(event.params.member);
  shamanStake.amount = stakeRes.getStakedAmount();
  shamanStake.unstakingAmount = stakeRes.getUnstakingAmount();
  shamanStake.canUnstakeAfter = stakeRes.getCanUnstakeAfter();
  shamanStake.save();
  hatsStakingShaman.save();
}

function getStakeId(module: Address, staker: Address): string {
  return module.toHexString() + "-" + staker.toHexString();
}
