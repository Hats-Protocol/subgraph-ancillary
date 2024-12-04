import {
  ThresholdConfigSet,
  SignerHatsAdded,
  OwnerHatSet,
  HSGLocked,
  ClaimableForSet,
  Detached,
  Migrated,
  DelegatecallTargetEnabled,
  Registered,
  ChangedGuard,
  EnabledModule,
  DisabledModule,
} from "../generated/templates/HatsSignerGateV2/HatsSignerGateV2";
import {
  HatsSignerGateV2,
  HatAuthority,
  HatsSignerGateV2_ThresholdConfigSetEvent,
  HatsSignerGateV2_HSGLockedEvent,
  HatsSignerGateV2_ClaimableForSetEvent,
  HatsSignerGateV2_DetachedEvent,
  HatsSignerGateV2_MigratedEvent,
  HatsSignerGateV2_DelegatecallTargetEnabledEvent,
  HatsSignerGateV2_RegisteredEvent,
  HatsSignerGateV2_ChangedGuardEvent,
  HatsSignerGateV2_EnabledModuleEvent,
  HatsSignerGateV2_DisabledModuleEvent,
  HatsSignerGateV2_SignerHatsAddedEvent,
  HatsSignerGateV2_OwnerHatSetEvent,
} from "../generated/schema";
import { hatIdToHex, createEventID } from "./utils";

export function handleThresholdConfigSet(event: ThresholdConfigSet): void {
  let hsg = HatsSignerGateV2.load(event.address.toHexString());
  if (!hsg) {
    hsg = new HatsSignerGateV2(event.address.toHexString());
  }

  const config = event.params.thresholdConfig;
  hsg.minThreshold = config.min;
  hsg.targetThreshold = config.target;
  hsg.thresholdType = config.thresholdType == 0 ? "ABSOLUTE" : "PROPORTIONAL";

  const thresholdConfigSetEvent = new HatsSignerGateV2_ThresholdConfigSetEvent(
    createEventID(event, "ThresholdConfigSet")
  );
  thresholdConfigSetEvent.hsg = hsg.id;
  thresholdConfigSetEvent.blockNumber = event.block.number.toI32();
  thresholdConfigSetEvent.timestamp = event.block.timestamp;
  thresholdConfigSetEvent.transactionID = event.transaction.hash;
  thresholdConfigSetEvent.thresholdType = hsg.thresholdType;
  thresholdConfigSetEvent.minThreshold = config.min;
  thresholdConfigSetEvent.targetThreshold = config.target;

  thresholdConfigSetEvent.save();
  hsg.save();
}

export function handleSignerHatsAdded(event: SignerHatsAdded): void {
  let hsg = HatsSignerGateV2.load(event.address.toHexString());
  if (!hsg) {
    hsg = new HatsSignerGateV2(event.address.toHexString());
  }

  const signerHatsIds: string[] = [];
  for (let i = 0; i < event.params.newSignerHats.length; i++) {
    const signerHatId = hatIdToHex(event.params.newSignerHats[i]);
    let signerHat = HatAuthority.load(signerHatId);
    if (!signerHat) {
      signerHat = new HatAuthority(signerHatId);
      signerHat.save();
    }
    signerHatsIds.push(signerHat.id);
  }

  const signerHatsAddedEvent = new HatsSignerGateV2_SignerHatsAddedEvent(
    createEventID(event, "SignerHatsAdded")
  );
  signerHatsAddedEvent.hsg = hsg.id;
  signerHatsAddedEvent.blockNumber = event.block.number.toI32();
  signerHatsAddedEvent.timestamp = event.block.timestamp;
  signerHatsAddedEvent.transactionID = event.transaction.hash;
  signerHatsAddedEvent.newSignerHats = signerHatsIds;

  signerHatsAddedEvent.save();
  hsg.signerHats = signerHatsIds;
  hsg.save();
}

export function handleOwnerHatSet(event: OwnerHatSet): void {
  let hsg = HatsSignerGateV2.load(event.address.toHexString());
  if (!hsg) {
    hsg = new HatsSignerGateV2(event.address.toHexString());
  }

  const ownerHatId = hatIdToHex(event.params.ownerHat);
  let ownerHat = HatAuthority.load(ownerHatId);
  if (!ownerHat) {
    ownerHat = new HatAuthority(ownerHatId);
    ownerHat.save();
  }

  const ownerHatSetEvent = new HatsSignerGateV2_OwnerHatSetEvent(
    createEventID(event, "OwnerHatSet")
  );
  ownerHatSetEvent.hsg = hsg.id;
  ownerHatSetEvent.blockNumber = event.block.number.toI32();
  ownerHatSetEvent.timestamp = event.block.timestamp;
  ownerHatSetEvent.transactionID = event.transaction.hash;
  ownerHatSetEvent.ownerHat = ownerHatId;

  ownerHatSetEvent.save();
  hsg.ownerHat = ownerHat.id;
  hsg.save();
}

export function handleHSGLocked(event: HSGLocked): void {
  let hsg = HatsSignerGateV2.load(event.address.toHexString());
  if (!hsg) {
    hsg = new HatsSignerGateV2(event.address.toHexString());
  }

  hsg.locked = true;

  const hsgLockedEvent = new HatsSignerGateV2_HSGLockedEvent(
    createEventID(event, "HSGLocked")
  );
  hsgLockedEvent.hsg = hsg.id;
  hsgLockedEvent.blockNumber = event.block.number.toI32();
  hsgLockedEvent.timestamp = event.block.timestamp;
  hsgLockedEvent.transactionID = event.transaction.hash;

  hsgLockedEvent.save();
  hsg.save();
}

export function handleClaimableForSet(event: ClaimableForSet): void {
  let hsg = HatsSignerGateV2.load(event.address.toHexString());
  if (!hsg) {
    hsg = new HatsSignerGateV2(event.address.toHexString());
  }

  const claimableForSetEvent = new HatsSignerGateV2_ClaimableForSetEvent(
    createEventID(event, "ClaimableForSet")
  );
  claimableForSetEvent.hsg = hsg.id;
  claimableForSetEvent.blockNumber = event.block.number.toI32();
  claimableForSetEvent.timestamp = event.block.timestamp;
  claimableForSetEvent.transactionID = event.transaction.hash;
  claimableForSetEvent.claimableFor = event.params.claimableFor;

  claimableForSetEvent.save();
  hsg.claimableFor = event.params.claimableFor;
  hsg.save();
}

export function handleDelegatecallTargetEnabled(
  event: DelegatecallTargetEnabled
): void {
  let hsg = HatsSignerGateV2.load(event.address.toHexString());
  if (!hsg) {
    hsg = new HatsSignerGateV2(event.address.toHexString());
  }

  const delegatecallTargetEnabledEvent =
    new HatsSignerGateV2_DelegatecallTargetEnabledEvent(
      createEventID(event, "DelegatecallTargetEnabled")
    );
  delegatecallTargetEnabledEvent.hsg = hsg.id;
  delegatecallTargetEnabledEvent.blockNumber = event.block.number.toI32();
  delegatecallTargetEnabledEvent.timestamp = event.block.timestamp;
  delegatecallTargetEnabledEvent.transactionID = event.transaction.hash;
  delegatecallTargetEnabledEvent.target = event.params.target.toHexString();
  delegatecallTargetEnabledEvent.enabled = event.params.enabled;

  delegatecallTargetEnabledEvent.save();

  const targets = hsg.enabledDelegatecallTargets || [];
  if (event.params.enabled) {
    targets.push(event.params.target.toHexString());
  } else {
    const index = targets.indexOf(event.params.target.toHexString());
    if (index > -1) {
      targets.splice(index, 1);
    }
  }

  hsg.enabledDelegatecallTargets = targets;
  hsg.save();
}

export function handleChangedGuard(event: ChangedGuard): void {
  let hsg = HatsSignerGateV2.load(event.address.toHexString());
  if (!hsg) {
    hsg = new HatsSignerGateV2(event.address.toHexString());
  }

  const changedGuardEvent = new HatsSignerGateV2_ChangedGuardEvent(
    createEventID(event, "ChangedGuard")
  );
  changedGuardEvent.hsg = hsg.id;
  changedGuardEvent.blockNumber = event.block.number.toI32();
  changedGuardEvent.timestamp = event.block.timestamp;
  changedGuardEvent.transactionID = event.transaction.hash;
  changedGuardEvent.guard = event.params.guard.toHexString();

  changedGuardEvent.save();
  hsg.guard = event.params.guard.toHexString();
  hsg.save();
}

export function handleEnabledModule(event: EnabledModule): void {
  let hsg = HatsSignerGateV2.load(event.address.toHexString());
  if (!hsg) {
    hsg = new HatsSignerGateV2(event.address.toHexString());
  }

  const enabledModuleEvent = new HatsSignerGateV2_EnabledModuleEvent(
    createEventID(event, "EnabledModule")
  );
  enabledModuleEvent.hsg = hsg.id;
  enabledModuleEvent.blockNumber = event.block.number.toI32();
  enabledModuleEvent.timestamp = event.block.timestamp;
  enabledModuleEvent.transactionID = event.transaction.hash;
  enabledModuleEvent.module = event.params.module.toHexString();

  enabledModuleEvent.save();

  const modules = hsg.modules || [];
  modules.push(event.params.module.toHexString());
  hsg.modules = modules;
  hsg.save();
}

export function handleDisabledModule(event: DisabledModule): void {
  let hsg = HatsSignerGateV2.load(event.address.toHexString());
  if (!hsg) {
    hsg = new HatsSignerGateV2(event.address.toHexString());
  }

  const disabledModuleEvent = new HatsSignerGateV2_DisabledModuleEvent(
    createEventID(event, "DisabledModule")
  );
  disabledModuleEvent.hsg = hsg.id;
  disabledModuleEvent.blockNumber = event.block.number.toI32();
  disabledModuleEvent.timestamp = event.block.timestamp;
  disabledModuleEvent.transactionID = event.transaction.hash;
  disabledModuleEvent.module = event.params.module.toHexString();

  disabledModuleEvent.save();

  const modules = hsg.modules || [];
  const index = modules.indexOf(event.params.module.toHexString());
  if (index > -1) {
    modules.splice(index, 1);
  }
  hsg.modules = modules;
  hsg.save();
}

export function handleDetached(event: Detached): void {
  let hsg = HatsSignerGateV2.load(event.address.toHexString());
  if (!hsg) {
    hsg = new HatsSignerGateV2(event.address.toHexString());
  }

  const detachedEvent = new HatsSignerGateV2_DetachedEvent(
    createEventID(event, "Detached")
  );
  detachedEvent.hsg = hsg.id;
  detachedEvent.blockNumber = event.block.number.toI32();
  detachedEvent.timestamp = event.block.timestamp;
  detachedEvent.transactionID = event.transaction.hash;

  detachedEvent.save();
  hsg.save();
}

export function handleMigrated(event: Migrated): void {
  let hsg = HatsSignerGateV2.load(event.address.toHexString());
  if (!hsg) {
    hsg = new HatsSignerGateV2(event.address.toHexString());
  }

  const migratedEvent = new HatsSignerGateV2_MigratedEvent(
    createEventID(event, "Migrated")
  );
  migratedEvent.hsg = hsg.id;
  migratedEvent.blockNumber = event.block.number.toI32();
  migratedEvent.timestamp = event.block.timestamp;
  migratedEvent.transactionID = event.transaction.hash;
  migratedEvent.newHsg = event.params.newHSG.toHexString();

  migratedEvent.save();
  hsg.save();
}

export function handleRegistered(event: Registered): void {
  let hsg = HatsSignerGateV2.load(event.address.toHexString());
  if (!hsg) {
    hsg = new HatsSignerGateV2(event.address.toHexString());
  }

  const registeredEvent = new HatsSignerGateV2_RegisteredEvent(
    createEventID(event, "Registered")
  );
  registeredEvent.hsg = hsg.id;
  registeredEvent.blockNumber = event.block.number.toI32();
  registeredEvent.timestamp = event.block.timestamp;
  registeredEvent.transactionID = event.transaction.hash;
  registeredEvent.hatId = hatIdToHex(event.params.hatId);
  registeredEvent.signer = event.params.signer.toHexString();

  registeredEvent.save();
  hsg.save();
}
