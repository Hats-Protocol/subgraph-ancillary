import {
  StakingEligibility_JudgeHatChanged,
  StakingEligibility_RecipientHatChanged,
} from "../generated/templates/StakingEligibility/StakingEligibility";
import { StakingEligibility } from "../generated/schema";
import { hatIdToHex } from "./utils";

export function handleJudgeHatChanged(
  event: StakingEligibility_JudgeHatChanged
): void {
  const stakingEligibility = StakingEligibility.load(
    event.address.toHexString()
  ) as StakingEligibility;

  stakingEligibility.judgeHat = hatIdToHex(event.params.newJudgeHat);
  stakingEligibility.save();
}

export function handleRecipientHatChanged(
  event: StakingEligibility_RecipientHatChanged
): void {
  const stakingEligibility = StakingEligibility.load(
    event.address.toHexString()
  ) as StakingEligibility;

  stakingEligibility.recipientHat = hatIdToHex(event.params.newRecipientHat);
  stakingEligibility.save();
}
