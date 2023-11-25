import {
  TargetThresholdSet,
  MinThresholdSet,
  SignerHatsAdded,
} from "../generated/templates/HatsSignerGate/HatsSignerGate";
import { HatAuthorities, HatsSignerGate } from "../generated/schema";
import { hatIdToHex } from "./utils";

export function handleTargetThresholdSet(event: TargetThresholdSet): void {
  const hsg = HatsSignerGate.load(
    event.address.toHexString()
  ) as HatsSignerGate;
  hsg.targetThreshold = event.params.threshold;
  hsg.save();
}

export function handleMinThresholdSet(event: MinThresholdSet): void {
  let hsg = HatsSignerGate.load(event.address.toHexString()) as HatsSignerGate;
  hsg.minThreshold = event.params.threshold;
  hsg.save();
}

export function handleSignerHatsAdded(event: SignerHatsAdded): void {
  let hsg = HatsSignerGate.load(event.address.toHexString()) as HatsSignerGate;
  const currentSigners = hsg.signerHats;
  for (let i = 0; i < event.params.newSignerHats.length; i++) {
    const newSignerId = hatIdToHex(event.params.newSignerHats[i]);
    let hat = HatAuthorities.load(newSignerId);
    if (hat == null) {
      hat = new HatAuthorities(newSignerId);
      hat.save();
    }
    currentSigners.push(hat.id);
  }
  hsg.signerHats = currentSigners;
  hsg.save();
}
