import {
  AgreementEligibility_HatClaimedWithAgreement,
  AgreementEligibility_AgreementSigned,
  AgreementEligibility_AgreementSet,
} from "../generated/templates/AgreementEligibility/AgreementEligibility";
import { AgreementEligibility, Agreement } from "../generated/schema";
import { BigInt } from "@graphprotocol/graph-ts";

export function handleAgreementEligibility_HatClaimedWithAgreement(
  event: AgreementEligibility_HatClaimedWithAgreement
): void {
  const agreementEligibility = AgreementEligibility.load(
    event.address.toHexString()
  ) as AgreementEligibility;

  const currentAgreementId = agreementEligibility.currentAgreement;
  const agreemet = Agreement.load(currentAgreementId) as Agreement;
  const currentSigners = agreemet.signers;
  currentSigners.push(event.params.claimer.toHexString());
  agreemet.signers = currentSigners;
  agreemet.save();
  agreementEligibility.save();
}

export function handleAgreementEligibility_AgreementSigned(
  event: AgreementEligibility_AgreementSigned
): void {
  const agreementEligibility = AgreementEligibility.load(
    event.address.toHexString()
  ) as AgreementEligibility;

  const currentAgreementId = agreementEligibility.currentAgreement;
  const agreemet = Agreement.load(currentAgreementId) as Agreement;
  const currentSigners = agreemet.signers;
  currentSigners.push(event.params.signer.toHexString());
  agreemet.signers = currentSigners;
  agreemet.save();
  agreementEligibility.save();
}

export function handleAgreementEligibility_AgreementSet(
  event: AgreementEligibility_AgreementSet
): void {
  const agreementEligibility = AgreementEligibility.load(
    event.address.toHexString()
  ) as AgreementEligibility;

  const newAgreementId =
    agreementEligibility.currentAgreementId.toString() +
    "-" +
    event.address.toHexString();
  const newAgreement = new Agreement(newAgreementId);
  newAgreement.agreementEligibility = agreementEligibility.id;
  newAgreement.agreement = event.params.agreement;
  newAgreement.signers = [];
  newAgreement.graceEndTime = event.block.timestamp.plus(event.params.grace);
  newAgreement.save();
}
