import { Address, BigInt } from "@graphprotocol/graph-ts";
import { ModuleProxyCreation } from "../generated/ModuleProxyFactory/ModuleProxyFactory";
import { HatAuthority, HatsSignerGateV2 } from "../generated/schema";
import { HatsSignerGateV2 as HatsSignerGateV2Template } from "../generated/templates";
import { HatsSignerGateV2 as HatsSignerGateV2Contract } from "../generated/templates/HatsSignerGateV2/HatsSignerGateV2";
import { hatIdToHex } from "./utils";

export function handleModuleProxyCreation(event: ModuleProxyCreation): void {
  if (
    event.params.masterCopy.toHexString() ==
    "0x61A5182A0958961E5be8Dc4174c9bE9C5EB6f384".toLowerCase()
  ) {
    HatsSignerGateV2Template.create(event.params.proxy);
    let hsg = new HatsSignerGateV2(event.params.proxy.toHexString());
    const hsgContract = HatsSignerGateV2Contract.bind(event.params.proxy);

    const safe = hsgContract.safe();

    hsg.safe = safe.toHexString();
    hsg.implementation = event.params.masterCopy.toHexString();
    hsg.ownerHat = hatIdToHex(BigInt.fromI32(0));
    hsg.signerHats = [];
    hsg.locked = false;
    hsg.claimableFor = false;
    hsg.enabledDelegatecallTargets = [];
    hsg.thresholdType = "ABSOLUTE";
    hsg.minThreshold = BigInt.fromI32(1);
    hsg.targetThreshold = BigInt.fromI32(1);
    hsg.guard = "0x0000000000000000000000000000000000000000";
    hsg.modules = [];
    hsg.save();
  }
}
