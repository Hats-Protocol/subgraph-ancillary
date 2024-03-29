import {
  AgreementEligibility_HatClaimedWithAgreement,
  AgreementEligibility_AgreementSigned,
  AgreementEligibility_AgreementSet,
} from "../../generated/templates/AgreementEligibility/AgreementEligibility";
import { AgreementEligibility, Agreement } from "../../generated/schema";
import { BigInt, log } from "@graphprotocol/graph-ts";

export function handleAgreementEligibility_HatClaimedWithAgreement(
  event: AgreementEligibility_HatClaimedWithAgreement
): void {
  const agreementEligibility = AgreementEligibility.load(
    event.address.toHexString()
  ) as AgreementEligibility;

  const currentAgreementId = agreementEligibility.currentAgreement;
  const agreemet = Agreement.load(currentAgreementId) as Agreement;

  let isNewSigner = true;
  for (let i = 0; i < agreemet.signers.length; i++) {
    if (agreemet.signers[i] == event.params.claimer.toHexString()) {
      isNewSigner = false;
    }
  }

  if (isNewSigner) {
    let newSigners: string[] = [];
    for (let i = 0; i < agreemet.signers.length; i++) {
      newSigners.push(agreemet.signers[i]);
    }
    newSigners.push(event.params.claimer.toHexString());
    agreemet.signers = newSigners;
    agreemet.save();
  }
}

export function handleAgreementEligibility_AgreementSigned(
  event: AgreementEligibility_AgreementSigned
): void {
  const agreementEligibility = AgreementEligibility.load(
    event.address.toHexString()
  ) as AgreementEligibility;

  const currentAgreementId = agreementEligibility.currentAgreement;
  const agreemet = Agreement.load(currentAgreementId) as Agreement;

  let isNewSigner = true;
  for (let i = 0; i < agreemet.signers.length; i++) {
    if (agreemet.signers[i] == event.params.signer.toHexString()) {
      isNewSigner = false;
    }
  }

  if (isNewSigner) {
    let newSigners: string[] = [];
    for (let i = 0; i < agreemet.signers.length; i++) {
      newSigners.push(agreemet.signers[i]);
    }
    newSigners.push(event.params.signer.toHexString());
    agreemet.signers = newSigners;
    agreemet.save();
  }
}

export function handleAgreementEligibility_AgreementSet(
  event: AgreementEligibility_AgreementSet
): void {
  const agreementEligibility = AgreementEligibility.load(
    event.address.toHexString()
  ) as AgreementEligibility;

  // inc the current agreement ID
  agreementEligibility.currentAgreementNumber =
    agreementEligibility.currentAgreementNumber.plus(BigInt.fromI32(1));

  // create new agreement entity
  const newAgreementId =
    agreementEligibility.currentAgreementNumber.toString() +
    "-" +
    event.address.toHexString();
  const newAgreement = new Agreement(newAgreementId);
  newAgreement.agreementEligibility = agreementEligibility.id;
  newAgreement.agreement = event.params.agreement;
  newAgreement.signers = [];
  newAgreement.graceEndTime = event.block.timestamp.plus(event.params.grace);

  // update the agreement eligibility's current agreement
  agreementEligibility.currentAgreement = newAgreement.id;

  newAgreement.save();
  agreementEligibility.save();
}
