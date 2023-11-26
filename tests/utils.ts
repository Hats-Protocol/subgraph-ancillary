import {
  Address,
  BigInt,
  ethereum,
  Bytes,
  ByteArray,
  log,
} from "@graphprotocol/graph-ts";
import {
  HatsSignerGateSetup,
  MultiHatsSignerGateSetup,
} from "../generated/HatsSignerGateFactory/HatsSignerGateFactory";
import {
  TargetThresholdSet,
  MinThresholdSet,
  SignerHatsAdded,
} from "../generated/templates/HatsSignerGate/HatsSignerGate";
import { HatAuthorities, HatsSignerGate } from "../generated/schema";
import { newMockEvent, createMockedFunction } from "matchstick-as";

export function mockHatsSignerGateSetupEvent(
  _hatsSignerGate: Address,
  _ownerHatId: BigInt,
  _signersHatId: BigInt,
  _safe: Address,
  _minThreshold: BigInt,
  _targetThreshold: BigInt,
  _maxSigners: BigInt
): HatsSignerGateSetup {
  // prepare event parameters array
  const _hatsSignerGateParam = new ethereum.EventParam(
    "_hatsSignerGate",
    ethereum.Value.fromAddress(_hatsSignerGate)
  );
  const _ownerHatIdParam = new ethereum.EventParam(
    "_ownerHatId",
    ethereum.Value.fromUnsignedBigInt(_ownerHatId)
  );
  const _signersHatIdParam = new ethereum.EventParam(
    "_signersHatId",
    ethereum.Value.fromUnsignedBigInt(_signersHatId)
  );
  const _safeParam = new ethereum.EventParam(
    "_safe",
    ethereum.Value.fromAddress(_safe)
  );
  const _minThresholdParam = new ethereum.EventParam(
    "_minThreshold",
    ethereum.Value.fromUnsignedBigInt(_minThreshold)
  );
  const _targetThresholdParam = new ethereum.EventParam(
    "_targetThreshold",
    ethereum.Value.fromUnsignedBigInt(_targetThreshold)
  );
  const _maxSignersParam = new ethereum.EventParam(
    "_maxSigners",
    ethereum.Value.fromUnsignedBigInt(_maxSigners)
  );

  const parameters = new Array<ethereum.EventParam>();
  parameters.push(_hatsSignerGateParam);
  parameters.push(_ownerHatIdParam);
  parameters.push(_signersHatIdParam);
  parameters.push(_safeParam);
  parameters.push(_minThresholdParam);
  parameters.push(_targetThresholdParam);
  parameters.push(_maxSignersParam);

  // create mocked event
  let mockEvent = newMockEvent();
  let hatsSignerGateSetupEvent = new HatsSignerGateSetup(
    mockEvent.address,
    mockEvent.logIndex,
    mockEvent.transactionLogIndex,
    mockEvent.logType,
    mockEvent.block,
    mockEvent.transaction,
    parameters,
    mockEvent.receipt
  );

  return hatsSignerGateSetupEvent;
}

export function mockMultiHatsSignerGateSetupEvent(
  _hatsSignerGate: Address,
  _ownerHatId: BigInt,
  _signersHatIds: BigInt[],
  _safe: Address,
  _minThreshold: BigInt,
  _targetThreshold: BigInt,
  _maxSigners: BigInt
): MultiHatsSignerGateSetup {
  // prepare event parameters array
  const _hatsSignerGateParam = new ethereum.EventParam(
    "_hatsSignerGate",
    ethereum.Value.fromAddress(_hatsSignerGate)
  );
  const _ownerHatIdParam = new ethereum.EventParam(
    "_ownerHatId",
    ethereum.Value.fromUnsignedBigInt(_ownerHatId)
  );
  const _signersHatIdsParam = new ethereum.EventParam(
    "_signersHatIds",
    ethereum.Value.fromSignedBigIntArray(_signersHatIds)
  );
  const _safeParam = new ethereum.EventParam(
    "_safe",
    ethereum.Value.fromAddress(_safe)
  );
  const _minThresholdParam = new ethereum.EventParam(
    "_minThreshold",
    ethereum.Value.fromUnsignedBigInt(_minThreshold)
  );
  const _targetThresholdParam = new ethereum.EventParam(
    "_targetThreshold",
    ethereum.Value.fromUnsignedBigInt(_targetThreshold)
  );
  const _maxSignersParam = new ethereum.EventParam(
    "_maxSigners",
    ethereum.Value.fromUnsignedBigInt(_maxSigners)
  );

  const parameters = new Array<ethereum.EventParam>();
  parameters.push(_hatsSignerGateParam);
  parameters.push(_ownerHatIdParam);
  parameters.push(_signersHatIdsParam);
  parameters.push(_safeParam);
  parameters.push(_minThresholdParam);
  parameters.push(_targetThresholdParam);
  parameters.push(_maxSignersParam);

  // create mocked event
  let mockEvent = newMockEvent();
  let multiHatsSignerGateSetupEvent = new MultiHatsSignerGateSetup(
    mockEvent.address,
    mockEvent.logIndex,
    mockEvent.transactionLogIndex,
    mockEvent.logType,
    mockEvent.block,
    mockEvent.transaction,
    parameters,
    mockEvent.receipt
  );

  return multiHatsSignerGateSetupEvent;
}

export function mockTargetThresholdSetEvent(
  hsg: Address,
  threshold: BigInt
): TargetThresholdSet {
  // prepare event parameters array
  const thresholdParam = new ethereum.EventParam(
    "threshold",
    ethereum.Value.fromUnsignedBigInt(threshold)
  );

  const parameters = new Array<ethereum.EventParam>();
  parameters.push(thresholdParam);

  // create mocked event
  let mockEvent = newMockEvent();
  let targetThresholdSetEvent = new TargetThresholdSet(
    hsg,
    mockEvent.logIndex,
    mockEvent.transactionLogIndex,
    mockEvent.logType,
    mockEvent.block,
    mockEvent.transaction,
    parameters,
    mockEvent.receipt
  );

  return targetThresholdSetEvent;
}

export function mockMinThresholdSetEvent(
  hsg: Address,
  threshold: BigInt
): MinThresholdSet {
  // prepare event parameters array
  const thresholdParam = new ethereum.EventParam(
    "threshold",
    ethereum.Value.fromUnsignedBigInt(threshold)
  );

  const parameters = new Array<ethereum.EventParam>();
  parameters.push(thresholdParam);

  // create mocked event
  let mockEvent = newMockEvent();
  let minThresholdSetEvent = new MinThresholdSet(
    hsg,
    mockEvent.logIndex,
    mockEvent.transactionLogIndex,
    mockEvent.logType,
    mockEvent.block,
    mockEvent.transaction,
    parameters,
    mockEvent.receipt
  );

  return minThresholdSetEvent;
}

export function mockSignerHatsAddedEvent(
  newSignerHats: BigInt[]
): SignerHatsAdded {
  // prepare event parameters array
  const newSignerHatsParam = new ethereum.EventParam(
    "threshold",
    ethereum.Value.fromUnsignedBigIntArray(newSignerHats)
  );

  const parameters = new Array<ethereum.EventParam>();
  parameters.push(newSignerHatsParam);

  // create mocked event
  let mockEvent = newMockEvent();
  let signerHatsAddedEvent = new SignerHatsAdded(
    mockEvent.address,
    mockEvent.logIndex,
    mockEvent.transactionLogIndex,
    mockEvent.logType,
    mockEvent.block,
    mockEvent.transaction,
    parameters,
    mockEvent.receipt
  );

  return signerHatsAddedEvent;
}
