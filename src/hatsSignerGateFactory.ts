import {
  HatsSignerGateSetup,
  MultiHatsSignerGateSetup,
} from "../generated/HatsSignerGateFactory/HatsSignerGateFactory";
import { HatAuthority, HatsSignerGate } from "../generated/schema";
import { HatsSignerGate as HatsSignerGateTemplate } from "../generated/templates";
import { hatIdToHex } from "./utils";

export function handleHatsSignerGateSetup(event: HatsSignerGateSetup): void {
  if (
    event.params._hatsSignerGate.toHexString() ==
    "0x4C0253156aEd0E85aE9f2AeE6C12a9e165B0d03C".toLowerCase()
  ) {
    return;
  }

  HatsSignerGateTemplate.create(event.params._hatsSignerGate);
  let hsg = new HatsSignerGate(event.params._hatsSignerGate.toHexString());

  // check if owner hat exists, create new object if not
  let ownerHat = HatAuthority.load(hatIdToHex(event.params._ownerHatId));
  if (ownerHat == null) {
    ownerHat = new HatAuthority(hatIdToHex(event.params._ownerHatId));
  }

  // check if signer hat exists, create new object if not
  let signerHat = HatAuthority.load(hatIdToHex(event.params._signersHatId));
  if (signerHat == null) {
    signerHat = new HatAuthority(hatIdToHex(event.params._signersHatId));
  }

  hsg.type = "Single";
  hsg.ownerHat = ownerHat.id;
  hsg.signerHats = [signerHat.id];
  hsg.safe = event.params._safe.toHexString();
  hsg.minThreshold = event.params._minThreshold;
  hsg.targetThreshold = event.params._targetThreshold;
  hsg.maxSigners = event.params._maxSigners;

  hsg.save();
  ownerHat.save();
  signerHat.save();
}

export function handleMultiHatsSignerGateSetup(
  event: MultiHatsSignerGateSetup
): void {
  HatsSignerGateTemplate.create(event.params._hatsSignerGate);
  const hsg = new HatsSignerGate(event.params._hatsSignerGate.toHexString());

  // check if owner hat exists, create new object if not
  let ownerHat = HatAuthority.load(hatIdToHex(event.params._ownerHatId));
  if (ownerHat == null) {
    ownerHat = new HatAuthority(hatIdToHex(event.params._ownerHatId));
  }

  // check if signer hats exist, create the ones that does not
  const signerHatsIds: string[] = [];
  for (let i = 0; i < event.params._signersHatIds.length; i++) {
    let signerHat = HatAuthority.load(
      hatIdToHex(event.params._signersHatIds[i])
    );
    if (signerHat == null) {
      signerHat = new HatAuthority(hatIdToHex(event.params._signersHatIds[i]));
    }
    signerHatsIds.push(signerHat.id);
    signerHat.save();
  }

  hsg.type = "Multi";
  hsg.ownerHat = ownerHat.id;
  hsg.signerHats = signerHatsIds;
  hsg.safe = event.params._safe.toHexString();
  hsg.minThreshold = event.params._minThreshold;
  hsg.targetThreshold = event.params._targetThreshold;
  hsg.maxSigners = event.params._maxSigners;

  hsg.save();
  ownerHat.save();
}
