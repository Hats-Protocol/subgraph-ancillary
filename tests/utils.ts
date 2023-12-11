import { Address, BigInt, ethereum, Bytes } from "@graphprotocol/graph-ts";
import {
  HatsSignerGateSetup,
  MultiHatsSignerGateSetup,
} from "../generated/HatsSignerGateFactory/HatsSignerGateFactory";
import { NewTerm } from "../generated/templates/JokeRaceEligibility/JokeRaceEligibility";
import { NewTerm as NewTermDeprecated } from "../generated/templates/JokeRaceEligibilityDeprecated/JokeRaceEligibilityDeprecated";
import { HatsModuleFactory_ModuleDeployed } from "../generated/HatsModuleFactory/HatsModuleFactory";
import {
  TargetThresholdSet,
  MinThresholdSet,
  SignerHatsAdded,
} from "../generated/templates/HatsSignerGate/HatsSignerGate";
import { newMockEvent } from "matchstick-as";

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
  hsg: Address,
  newSignerHats: BigInt[]
): SignerHatsAdded {
  // prepare event parameters array
  const newSignerHatsParam = new ethereum.EventParam(
    "newSignerHats",
    ethereum.Value.fromUnsignedBigIntArray(newSignerHats)
  );

  const parameters = new Array<ethereum.EventParam>();
  parameters.push(newSignerHatsParam);

  // create mocked event
  let mockEvent = newMockEvent();
  let signerHatsAddedEvent = new SignerHatsAdded(
    hsg,
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

export function mockHatsModuleFactory_ModuleDeployedEvent(
  implementation: Address,
  instance: Address,
  hatId: BigInt,
  otherImmutableArgs: Bytes,
  initData: Bytes
): HatsModuleFactory_ModuleDeployed {
  // prepare event parameters array
  const implementationParam = new ethereum.EventParam(
    "implementation",
    ethereum.Value.fromAddress(implementation)
  );
  const instanceParam = new ethereum.EventParam(
    "instance",
    ethereum.Value.fromAddress(instance)
  );
  const hatIdParam = new ethereum.EventParam(
    "hatId",
    ethereum.Value.fromUnsignedBigInt(hatId)
  );
  const otherImmutableArgsParam = new ethereum.EventParam(
    "otherImmutableArgs",
    ethereum.Value.fromBytes(otherImmutableArgs)
  );
  const initDataParam = new ethereum.EventParam(
    "initData",
    ethereum.Value.fromBytes(initData)
  );

  const parameters = new Array<ethereum.EventParam>();
  parameters.push(implementationParam);
  parameters.push(instanceParam);
  parameters.push(hatIdParam);
  parameters.push(otherImmutableArgsParam);
  parameters.push(initDataParam);

  // create mocked event
  const mockEvent = newMockEvent();
  const moduleDeployedEvent = new HatsModuleFactory_ModuleDeployed(
    mockEvent.address,
    mockEvent.logIndex,
    mockEvent.transactionLogIndex,
    mockEvent.logType,
    mockEvent.block,
    mockEvent.transaction,
    parameters,
    mockEvent.receipt
  );

  moduleDeployedEvent.parameters = new Array<ethereum.EventParam>();
  moduleDeployedEvent.parameters.push(implementationParam);
  moduleDeployedEvent.parameters.push(instanceParam);
  moduleDeployedEvent.parameters.push(hatIdParam);
  moduleDeployedEvent.parameters.push(otherImmutableArgsParam);
  moduleDeployedEvent.parameters.push(initDataParam);

  return moduleDeployedEvent;
}

export function mockNewTermEvent(
  jokeraceEligibility: Address,
  NewContest: Address,
  newTermEnd: BigInt,
  newTopK: BigInt
): NewTerm {
  // prepare event parameters array
  const newContestParam = new ethereum.EventParam(
    "NewContest",
    ethereum.Value.fromAddress(NewContest)
  );
  const newTermEndParam = new ethereum.EventParam(
    "newTermEnd",
    ethereum.Value.fromUnsignedBigInt(newTermEnd)
  );
  const newTopKParam = new ethereum.EventParam(
    "newTopK",
    ethereum.Value.fromUnsignedBigInt(newTopK)
  );

  const parameters = new Array<ethereum.EventParam>();
  parameters.push(newContestParam);
  parameters.push(newTopKParam);
  parameters.push(newTermEndParam);

  // create mocked event
  let mockEvent = newMockEvent();
  let newTermEvent = new NewTerm(
    jokeraceEligibility,
    mockEvent.logIndex,
    mockEvent.transactionLogIndex,
    mockEvent.logType,
    mockEvent.block,
    mockEvent.transaction,
    parameters,
    mockEvent.receipt
  );

  return newTermEvent;
}

export function mockNewTermDeprecatedEvent(
  jokeraceEligibility: Address,
  NewContest: Address,
  newTermEnd: BigInt,
  newTopK: BigInt
): NewTermDeprecated {
  // prepare event parameters array
  const newContestParam = new ethereum.EventParam(
    "NewContest",
    ethereum.Value.fromAddress(NewContest)
  );
  const newTermEndParam = new ethereum.EventParam(
    "newTermEnd",
    ethereum.Value.fromUnsignedBigInt(newTermEnd)
  );
  const newTopKParam = new ethereum.EventParam(
    "newTopK",
    ethereum.Value.fromUnsignedBigInt(newTopK)
  );

  const parameters = new Array<ethereum.EventParam>();
  parameters.push(newContestParam);
  parameters.push(newTopKParam);
  parameters.push(newTermEndParam);

  // create mocked event
  let mockEvent = newMockEvent();
  let newTermEvent = new NewTermDeprecated(
    jokeraceEligibility,
    mockEvent.logIndex,
    mockEvent.transactionLogIndex,
    mockEvent.logType,
    mockEvent.block,
    mockEvent.transaction,
    parameters,
    mockEvent.receipt
  );

  return newTermEvent;
}
