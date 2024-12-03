import { Address, BigInt } from "@graphprotocol/graph-ts";
import { ModuleProxyCreation } from "../generated/ModuleProxyFactory/ModuleProxyFactory";
import { HatAuthority, HatsSignerGateV2 } from "../generated/schema";
import { HatsSignerGateV2 as HatsSignerGateV2Template } from "../generated/templates";
import { HatsSignerGateV2 as HatsSignerGateV2Contract } from "../generated/templates/HatsSignerGateV2/HatsSignerGateV2";
import { hatIdToHex } from "./utils";

export function handleModuleProxyCreation(event: ModuleProxyCreation): void {
  HatsSignerGateV2Template.create(event.params.proxy);
  let hsg = new HatsSignerGateV2(event.params.proxy.toHexString());
  const hsgContract = HatsSignerGateV2Contract.bind(event.params.proxy);

  const safe = hsgContract.safe();

  hsg.safe = safe.toHexString();
  hsg.implementation = event.params.masterCopy.toHexString();
  hsg.save();
}
