import {
  AgreementEligibility_HatClaimedWithAgreement,
  AgreementEligibility_AgreementSigned,
  AgreementEligibility_AgreementSet,
  AgreementEligibility_OwnerHatSet,
  AgreementEligibility_ArbitratorHatSet,
  AgreementEligibility_Forgiven,
  AgreementEligibility_Forgiven1,
  AgreementEligibility_Revoked,
  AgreementEligibility_Revoked1,
} from "../../generated/templates/AgreementEligibilityV_0_4_0/AgreementEligibilityV_0_4_0";
import {
  AgreementEligibility,
  Agreement,
  Agreement_AgreementSetEvent,
  Agreement_AgreementSignedEvent,
  Agreement_ArbitratorHatSetEvent,
  Agreement_HatClaimedWithAgreementEvent,
  Agreement_OwnerHatSetEvent,
  Agreement_RevokedSingleEvent,
  Agreement_RevokedMultipleEvent,
  Agreement_ForgivenSingleEvent,
  Agreement_ForgivenMultipleEvent,
} from "../../generated/schema";
import { Address, BigInt, log } from "@graphprotocol/graph-ts";
import { hatIdToHex } from "../utils";
import { createEventID } from "./utils";

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

  const hatClaimedWithAgreementEvent =
    new Agreement_HatClaimedWithAgreementEvent(
      createEventID(event, "HatClaimedWithAgreement")
    );
  hatClaimedWithAgreementEvent.module = agreementEligibility.id;
  hatClaimedWithAgreementEvent.agreementEligibilityInstance =
    agreementEligibility.id;
  hatClaimedWithAgreementEvent.blockNumber = event.block.number.toI32();
  hatClaimedWithAgreementEvent.timestamp = event.block.timestamp;
  hatClaimedWithAgreementEvent.transactionID = event.transaction.hash;
  hatClaimedWithAgreementEvent.claimer = event.params.claimer.toHexString();
  hatClaimedWithAgreementEvent.hatId = hatIdToHex(event.params.hatId);
  hatClaimedWithAgreementEvent.agreement = event.params.agreement;
  hatClaimedWithAgreementEvent.save();
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

  const agreementSignedEvent = new Agreement_AgreementSignedEvent(
    createEventID(event, "AgreementSigned")
  );
  agreementSignedEvent.module = agreementEligibility.id;
  agreementSignedEvent.agreementEligibilityInstance = agreementEligibility.id;
  agreementSignedEvent.blockNumber = event.block.number.toI32();
  agreementSignedEvent.timestamp = event.block.timestamp;
  agreementSignedEvent.transactionID = event.transaction.hash;
  agreementSignedEvent.signer = event.params.signer.toHexString();
  agreementSignedEvent.agreement = event.params.agreement;
  agreementSignedEvent.save();
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

  const agreementSetEvent = new Agreement_AgreementSetEvent(
    createEventID(event, "AgreementSet")
  );
  agreementSetEvent.module = agreementEligibility.id;
  agreementSetEvent.agreementEligibilityInstance = agreementEligibility.id;
  agreementSetEvent.blockNumber = event.block.number.toI32();
  agreementSetEvent.timestamp = event.block.timestamp;
  agreementSetEvent.transactionID = event.transaction.hash;
  agreementSetEvent.grace = event.params.grace;
  agreementSetEvent.agreement = event.params.agreement;

  agreementSetEvent.save();
  newAgreement.save();
  agreementEligibility.save();
}

export function handleAgreementEligibility_OwnerHatSet(
  event: AgreementEligibility_OwnerHatSet
): void {
  const agreementEligibility = AgreementEligibility.load(
    event.address.toHexString()
  ) as AgreementEligibility;

  const ownerHatSetEvent = new Agreement_OwnerHatSetEvent(
    createEventID(event, "OwnerHatSet")
  );
  ownerHatSetEvent.module = agreementEligibility.id;
  ownerHatSetEvent.agreementEligibilityInstance = agreementEligibility.id;
  ownerHatSetEvent.blockNumber = event.block.number.toI32();
  ownerHatSetEvent.timestamp = event.block.timestamp;
  ownerHatSetEvent.transactionID = event.transaction.hash;
  ownerHatSetEvent.newOwnerHat = hatIdToHex(event.params.newOwnerHat);

  ownerHatSetEvent.save();
  agreementEligibility.ownerHat = hatIdToHex(event.params.newOwnerHat);
  agreementEligibility.save();
}

export function handleAgreementEligibility_ArbitratorHatSet(
  event: AgreementEligibility_ArbitratorHatSet
): void {
  const agreementEligibility = AgreementEligibility.load(
    event.address.toHexString()
  ) as AgreementEligibility;

  agreementEligibility.arbitratorHat = hatIdToHex(
    event.params.newArbitratorHat
  );

  const arbitratorHatSetEvent = new Agreement_ArbitratorHatSetEvent(
    createEventID(event, "ArbitratorHatSet")
  );
  arbitratorHatSetEvent.module = agreementEligibility.id;
  arbitratorHatSetEvent.agreementEligibilityInstance = agreementEligibility.id;
  arbitratorHatSetEvent.blockNumber = event.block.number.toI32();
  arbitratorHatSetEvent.timestamp = event.block.timestamp;
  arbitratorHatSetEvent.transactionID = event.transaction.hash;
  arbitratorHatSetEvent.newArbitratorHat = hatIdToHex(
    event.params.newArbitratorHat
  );

  arbitratorHatSetEvent.save();
  agreementEligibility.save();
}

export function handleAgreementEligibility_Revoked(
  event: AgreementEligibility_Revoked
): void {
  const agreementEligibility = AgreementEligibility.load(
    event.address.toHexString()
  ) as AgreementEligibility;

  const badStandings = agreementEligibility.badStandings;
  const index = badStandings.indexOf(event.params.wearer.toHexString());
  if (index == -1) {
    badStandings.push(event.params.wearer.toHexString());
  }
  agreementEligibility.badStandings = badStandings;

  const revokedEvent = new Agreement_RevokedSingleEvent(
    createEventID(event, "RevokedSingle")
  );
  revokedEvent.module = agreementEligibility.id;
  revokedEvent.agreementEligibilityInstance = agreementEligibility.id;
  revokedEvent.blockNumber = event.block.number.toI32();
  revokedEvent.timestamp = event.block.timestamp;
  revokedEvent.transactionID = event.transaction.hash;
  revokedEvent.wearer = event.params.wearer.toHexString();

  revokedEvent.save();
  agreementEligibility.save();
}

export function handleAgreementEligibility_Forgiven(
  event: AgreementEligibility_Forgiven
): void {
  const agreementEligibility = AgreementEligibility.load(
    event.address.toHexString()
  ) as AgreementEligibility;

  const badStandings = agreementEligibility.badStandings;
  const index = badStandings.indexOf(event.params.wearer.toHexString());
  if (index > -1) {
    badStandings.splice(index, 1);
  }
  agreementEligibility.badStandings = badStandings;

  const forgivenEvent = new Agreement_ForgivenSingleEvent(
    createEventID(event, "ForgivenSingle")
  );
  forgivenEvent.module = agreementEligibility.id;
  forgivenEvent.agreementEligibilityInstance = agreementEligibility.id;
  forgivenEvent.blockNumber = event.block.number.toI32();
  forgivenEvent.timestamp = event.block.timestamp;
  forgivenEvent.transactionID = event.transaction.hash;
  forgivenEvent.wearer = event.params.wearer.toHexString();

  forgivenEvent.save();
  agreementEligibility.save();
}

export function handleBatchedAgreementEligibility_Revoked(
  event: AgreementEligibility_Revoked1
): void {
  const agreementEligibility = AgreementEligibility.load(
    event.address.toHexString()
  ) as AgreementEligibility;

  const badStandings = agreementEligibility.badStandings;
  for (let i = 0; i < event.params.wearers.length; i++) {
    const index = badStandings.indexOf(event.params.wearers[i].toHexString());
    if (index == -1) {
      badStandings.push(event.params.wearers[i].toHexString());
    }
  }
  agreementEligibility.badStandings = badStandings;

  const revokedEvent = new Agreement_RevokedMultipleEvent(
    createEventID(event, "RevokedMultiple")
  );
  revokedEvent.module = agreementEligibility.id;
  revokedEvent.agreementEligibilityInstance = agreementEligibility.id;
  revokedEvent.blockNumber = event.block.number.toI32();
  revokedEvent.timestamp = event.block.timestamp;
  revokedEvent.transactionID = event.transaction.hash;
  const wearers: string[] = [];
  for (let i = 0; i < event.params.wearers.length; i++) {
    wearers.push(event.params.wearers[i].toHexString());
  }
  revokedEvent.wearers = wearers;

  revokedEvent.save();
  agreementEligibility.save();
}

export function handleBatchedAgreementEligibility_Forgiven(
  event: AgreementEligibility_Forgiven1
): void {
  const agreementEligibility = AgreementEligibility.load(
    event.address.toHexString()
  ) as AgreementEligibility;

  const badStandings = agreementEligibility.badStandings;
  for (let i = 0; i < event.params.wearers.length; i++) {
    const index = badStandings.indexOf(event.params.wearers[i].toHexString());
    if (index > -1) {
      badStandings.splice(index, 1);
    }
  }
  agreementEligibility.badStandings = badStandings;

  const forgivenEvent = new Agreement_ForgivenMultipleEvent(
    createEventID(event, "ForgivenMultiple")
  );
  forgivenEvent.module = agreementEligibility.id;
  forgivenEvent.agreementEligibilityInstance = agreementEligibility.id;
  forgivenEvent.blockNumber = event.block.number.toI32();
  forgivenEvent.timestamp = event.block.timestamp;
  forgivenEvent.transactionID = event.transaction.hash;
  const wearers: string[] = [];
  for (let i = 0; i < event.params.wearers.length; i++) {
    wearers.push(event.params.wearers[i].toHexString());
  }
  forgivenEvent.wearers = wearers;

  forgivenEvent.save();
  agreementEligibility.save();
}
