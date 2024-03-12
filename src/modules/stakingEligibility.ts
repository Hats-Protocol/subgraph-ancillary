import {
  StakingEligibility_JudgeHatChanged,
  StakingEligibility_RecipientHatChanged,
} from "../../generated/templates/StakingEligibility/StakingEligibility";
import { StakingEligibility, HatAuthority } from "../../generated/schema";
import { hatIdToHex } from "../utils";

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
