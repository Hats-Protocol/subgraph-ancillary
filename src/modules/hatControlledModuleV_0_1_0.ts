import {
  WearerStatusSet,
  HatStatusSet,
} from "../../generated/templates/HatControlledModuleV_0_1_0/HatControlledModuleV_0_1_0";
import {
  HatControlledModule,
  HatControlledModuleHatStatus,
  HatControlledModuleWearerStatus,
  HatControlled_HatStatusSet,
  HatControlled_WearerStatusSet,
} from "../../generated/schema";
import { Address, BigInt } from "@graphprotocol/graph-ts";
import { createEventID } from "./utils";
import { hatIdToHex, hatIdToPrettyId } from "../utils";

export function handleWearerStatusSet(event: WearerStatusSet): void {
  const hatControlledModule = HatControlledModule.load(
    event.address.toHexString()
  ) as HatControlledModule;

  const wearerStatusDataId = getWearerStatusDataId(
    event.address,
    event.params.wearer,
    event.params.hatId
  );

  let wearerStatusData =
    HatControlledModuleWearerStatus.load(wearerStatusDataId);
  if (wearerStatusData == null) {
    wearerStatusData = new HatControlledModuleWearerStatus(wearerStatusDataId);
    wearerStatusData.hatControlledModule = hatControlledModule.id;
    wearerStatusData.wearer = event.params.wearer.toHexString();
    wearerStatusData.hatId = hatIdToHex(event.params.hatId);
    wearerStatusData.eligible = event.params.eligible;
    wearerStatusData.standing = event.params.standing;
  } else {
    wearerStatusData.eligible = event.params.eligible;
    wearerStatusData.standing = event.params.standing;
  }
  wearerStatusData.save();

  const wearerStatusSetEvent = new HatControlled_WearerStatusSet(
    createEventID(event, "WearerStatusSet")
  );
  wearerStatusSetEvent.module = hatControlledModule.id;
  wearerStatusSetEvent.hatControlledModuleInstance = hatControlledModule.id;
  wearerStatusSetEvent.blockNumber = event.block.number.toI32();
  wearerStatusSetEvent.timestamp = event.block.timestamp;
  wearerStatusSetEvent.transactionID = event.transaction.hash;
  wearerStatusSetEvent.wearer = event.params.wearer.toHexString();
  wearerStatusSetEvent.hatId = hatIdToHex(event.params.hatId);
  wearerStatusSetEvent.eligible = event.params.eligible;
  wearerStatusSetEvent.standing = event.params.standing;

  wearerStatusSetEvent.save();
  hatControlledModule.save();
}

export function handleHatStatusSet(event: HatStatusSet): void {
  const hatControlledModule = HatControlledModule.load(
    event.address.toHexString()
  ) as HatControlledModule;

  const hatStatusDataId = getHatStatusDataId(event.address, event.params.hatId);

  let hatStatusData = HatControlledModuleHatStatus.load(hatStatusDataId);
  if (hatStatusData == null) {
    hatStatusData = new HatControlledModuleHatStatus(hatStatusDataId);
    hatStatusData.hatControlledModule = hatControlledModule.id;
    hatStatusData.hatId = hatIdToHex(event.params.hatId);
    hatStatusData.active = event.params.active;
  } else {
    hatStatusData.active = event.params.active;
  }
  hatStatusData.save();

  const hatStatusSetEvent = new HatControlled_HatStatusSet(
    createEventID(event, "HatStatusSet")
  );
  hatStatusSetEvent.module = hatControlledModule.id;
  hatStatusSetEvent.hatControlledModuleInstance = hatControlledModule.id;
  hatStatusSetEvent.blockNumber = event.block.number.toI32();
  hatStatusSetEvent.timestamp = event.block.timestamp;
  hatStatusSetEvent.transactionID = event.transaction.hash;
  hatStatusSetEvent.hatId = hatIdToHex(event.params.hatId);
  hatStatusSetEvent.active = event.params.active;

  hatStatusSetEvent.save();
  hatControlledModule.save();
}

function getWearerStatusDataId(
  module: Address,
  address: Address,
  hatId: BigInt
): string {
  return (
    module.toHexString() +
    "-" +
    address.toHexString() +
    "-" +
    hatIdToPrettyId(hatId)
  );
}

function getHatStatusDataId(module: Address, hatId: BigInt): string {
  return module.toHexString() + "-" + hatIdToPrettyId(hatId);
}
