import { Address, BigInt } from "@graphprotocol/graph-ts";
import {
  HatsSignerGateSetup,
  MultiHatsSignerGateSetup,
} from "../generated/HatsSignerGateFactory/HatsSignerGateFactory";
import { HatAuthority, HatsSignerGate } from "../generated/schema";
import {
  HatsSignerGate as HatsSignerGateTemplate,
  MultiHatsSignerGate as MultiHatsSignerGateTemplate,
} from "../generated/templates";
import { hatIdToHex } from "./utils";

export function handleHatsSignerGateSetup(event: HatsSignerGateSetup): void {
  if (
    event.params._hatsSignerGate.toHexString() ==
      "0x4C0253156aEd0E85aE9f2AeE6C12a9e165B0d03C".toLowerCase() ||
    event.params._hatsSignerGate.toHexString() ==
      "0x96e555618D872cC66C3538eEDe515C53b9d91D76".toLowerCase()
  ) {
    return;
  }

  // patch for including instances that were deployed in a deprecated factory
  if (
    event.params._hatsSignerGate.toHexString().toLowerCase() ==
      "0x54a8D7DE1e6C89a164bF73b8414980fD78714935".toLowerCase() &&
    event.block.number == BigInt.fromString("14164262")
  ) {
    // recreate hsg 0xad2d50e0259f31c1d9f9D1430d0ff9Ea8305c85C from Base
    createHsg(
      Address.fromString(
        "0xad2d50e0259f31c1d9f9D1430d0ff9Ea8305c85C".toLowerCase()
      ),
      BigInt.fromString(
        "377439664716248287426848749960570468768546267599534423130416380641280"
      ),
      BigInt.fromString(
        "377439664722525389162235430724406258191753934015636778574880415154176"
      ),
      Address.fromString(
        "0x18542245cA523DFF96AF766047fE9423E0BED3C0".toLowerCase()
      ),
      BigInt.fromI32(3),
      BigInt.fromI32(5),
      BigInt.fromI32(7)
    );
  } else if (
    event.params._hatsSignerGate.toHexString().toLowerCase() ==
      "0x5688187d29c9cd15805a3d261151D992a70bf9E6".toLowerCase() &&
    event.block.number == BigInt.fromString("56717312")
  ) {
    // recreate hsg 0x7Ca9A1C8b90C2Bf67580f2c1ECA3B81024F27843 from Polygon
    createHsg(
      Address.fromString(
        "0x7Ca9A1C8b90C2Bf67580f2c1ECA3B81024F27843".toLowerCase()
      ),
      BigInt.fromString(
        "1078398278062164922088191142223080866283112022585589307639110247120896"
      ),
      BigInt.fromString(
        "1078398278068442023823577822986916655706319689001691663083574281633792"
      ),
      Address.fromString(
        "0x18542245cA523DFF96AF766047fE9423E0BED3C0".toLowerCase()
      ),
      BigInt.fromI32(3),
      BigInt.fromI32(5),
      BigInt.fromI32(7)
    );
  }

  createHsg(
    event.params._hatsSignerGate,
    event.params._ownerHatId,
    event.params._signersHatId,
    event.params._safe,
    event.params._minThreshold,
    event.params._targetThreshold,
    event.params._maxSigners
  );
}

export function handleMultiHatsSignerGateSetup(
  event: MultiHatsSignerGateSetup
): void {
  MultiHatsSignerGateTemplate.create(event.params._hatsSignerGate);
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

function createHsg(
  hsgAddress: Address,
  ownerHatId: BigInt,
  signersHatId: BigInt,
  safaAddress: Address,
  minThreshold: BigInt,
  targetThreshold: BigInt,
  maxSigners: BigInt
): void {
  HatsSignerGateTemplate.create(hsgAddress);
  let hsg = new HatsSignerGate(hsgAddress.toHexString());

  // check if owner hat exists, create new object if not
  let ownerHat = HatAuthority.load(hatIdToHex(ownerHatId));
  if (ownerHat == null) {
    ownerHat = new HatAuthority(hatIdToHex(ownerHatId));
  }

  // check if signer hat exists, create new object if not
  let signerHat = HatAuthority.load(hatIdToHex(signersHatId));
  if (signerHat == null) {
    signerHat = new HatAuthority(hatIdToHex(signersHatId));
  }

  hsg.type = "Single";
  hsg.ownerHat = ownerHat.id;
  hsg.signerHats = [signerHat.id];
  hsg.safe = safaAddress.toHexString();
  hsg.minThreshold = minThreshold;
  hsg.targetThreshold = targetThreshold;
  hsg.maxSigners = maxSigners;

  hsg.save();
  ownerHat.save();
  signerHat.save();
}
