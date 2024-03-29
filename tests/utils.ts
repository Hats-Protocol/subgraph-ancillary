import { Address, BigInt, ethereum, Bytes } from "@graphprotocol/graph-ts";
import {
  HatsSignerGateSetup,
  MultiHatsSignerGateSetup,
} from "../generated/HatsSignerGateFactory/HatsSignerGateFactory";
import { HatCreated } from "../generated/Hats/Hats";
import { NewTerm } from "../generated/templates/JokeRaceEligibility/JokeRaceEligibility";
import { NewTerm as NewTermDeprecated } from "../generated/templates/JokeRaceEligibilityDeprecated/JokeRaceEligibilityDeprecated";
import { HatsModuleFactory_ModuleDeployed as HatsModuleFactory_ModuleDeployedV0_6_0 } from "../generated/HatsModuleFactoryV0_6_0/HatsModuleFactoryV0_6_0";
import { HatsModuleFactory_ModuleDeployed as HatsModuleFactory_ModuleDeployedV0_7_0 } from "../generated/HatsModuleFactoryV0_7_0/HatsModuleFactoryV0_7_0";
import { ERC6551AccountCreated } from "../generated/ERC6551Registry/ERC6551Registry";
import { TxExecuted } from "../generated/templates/HatsAccount1ofN/HatsAccount1ofN";
import {
  TargetThresholdSet,
  MinThresholdSet,
  SignerHatsAdded,
} from "../generated/templates/HatsSignerGate/HatsSignerGate";
import {
  StakingEligibility_JudgeHatChanged,
  StakingEligibility_RecipientHatChanged,
} from "../generated/templates/StakingEligibility/StakingEligibility";
import {
  ElectionOpened,
  ElectionCompleted,
  NewTermStarted,
  Recalled,
} from "../generated/templates/HatsElectionEligibility/HatsElectionEligibility";
import {
  AgreementEligibility_HatClaimedWithAgreement,
  AgreementEligibility_AgreementSigned,
  AgreementEligibility_AgreementSet,
} from "../generated/templates/AgreementEligibility/AgreementEligibility";
import { newMockEvent, createMockedFunction } from "matchstick-as";
import {
  ERC6551_REGISTRY,
  HATS,
  HATS_ACCOUNT_1_OF_N_IMPLEMENTATION,
} from "../src/constants";

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

export function mockHatsModuleFactory_ModuleDeployedEventV0_6_0(
  implementation: Address,
  instance: Address,
  hatId: BigInt,
  otherImmutableArgs: Bytes,
  initData: Bytes
): HatsModuleFactory_ModuleDeployedV0_6_0 {
  // prepare event parameters array
  let implementationParam = new ethereum.EventParam(
    "implementation",
    ethereum.Value.fromAddress(implementation)
  );
  let instanceParam = new ethereum.EventParam(
    "instance",
    ethereum.Value.fromAddress(instance)
  );
  let hatIdParam = new ethereum.EventParam(
    "hatId",
    ethereum.Value.fromUnsignedBigInt(hatId)
  );
  let otherImmutableArgsParam = new ethereum.EventParam(
    "otherImmutableArgs",
    ethereum.Value.fromBytes(otherImmutableArgs)
  );
  let initDataParam = new ethereum.EventParam(
    "initData",
    ethereum.Value.fromBytes(initData)
  );

  // create mocked event
  let mockEvent = newMockEvent();
  let moduleDeployedEvent = new HatsModuleFactory_ModuleDeployedV0_6_0(
    mockEvent.address,
    mockEvent.logIndex,
    mockEvent.transactionLogIndex,
    mockEvent.logType,
    mockEvent.block,
    mockEvent.transaction,
    mockEvent.parameters,
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

export function mockHatsModuleFactory_ModuleDeployedEventV0_7_0(
  implementation: Address,
  instance: Address,
  hatId: BigInt,
  otherImmutableArgs: Bytes,
  initData: Bytes,
  saltNonce: BigInt
): HatsModuleFactory_ModuleDeployedV0_7_0 {
  // prepare event parameters array
  let implementationParam = new ethereum.EventParam(
    "implementation",
    ethereum.Value.fromAddress(implementation)
  );
  let instanceParam = new ethereum.EventParam(
    "instance",
    ethereum.Value.fromAddress(instance)
  );
  let hatIdParam = new ethereum.EventParam(
    "hatId",
    ethereum.Value.fromUnsignedBigInt(hatId)
  );
  let otherImmutableArgsParam = new ethereum.EventParam(
    "otherImmutableArgs",
    ethereum.Value.fromBytes(otherImmutableArgs)
  );
  let initDataParam = new ethereum.EventParam(
    "initData",
    ethereum.Value.fromBytes(initData)
  );
  let saltNonceParam = new ethereum.EventParam(
    "saltNonce",
    ethereum.Value.fromUnsignedBigInt(saltNonce)
  );

  // create mocked event
  let mockEvent = newMockEvent();
  let moduleDeployedEvent = new HatsModuleFactory_ModuleDeployedV0_7_0(
    mockEvent.address,
    mockEvent.logIndex,
    mockEvent.transactionLogIndex,
    mockEvent.logType,
    mockEvent.block,
    mockEvent.transaction,
    mockEvent.parameters,
    mockEvent.receipt
  );

  moduleDeployedEvent.parameters = new Array<ethereum.EventParam>();
  moduleDeployedEvent.parameters.push(implementationParam);
  moduleDeployedEvent.parameters.push(instanceParam);
  moduleDeployedEvent.parameters.push(hatIdParam);
  moduleDeployedEvent.parameters.push(otherImmutableArgsParam);
  moduleDeployedEvent.parameters.push(initDataParam);
  moduleDeployedEvent.parameters.push(saltNonceParam);

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

export function mockStakingEligibility_JudgeHatChangedEvent(
  instance: Address,
  newJudgeHat: BigInt
): StakingEligibility_JudgeHatChanged {
  // prepare event parameters array
  const newJudgeHatParam = new ethereum.EventParam(
    "newJudgeHat",
    ethereum.Value.fromUnsignedBigInt(newJudgeHat)
  );

  const parameters = new Array<ethereum.EventParam>();
  parameters.push(newJudgeHatParam);

  // create mocked event
  let mockEvent = newMockEvent();
  let newJudgeHatEvent = new StakingEligibility_JudgeHatChanged(
    instance,
    mockEvent.logIndex,
    mockEvent.transactionLogIndex,
    mockEvent.logType,
    mockEvent.block,
    mockEvent.transaction,
    parameters,
    mockEvent.receipt
  );

  return newJudgeHatEvent;
}

export function mockStakingEligibility_RecipientHatChangedEvent(
  instance: Address,
  newRecipientHat: BigInt
): StakingEligibility_RecipientHatChanged {
  // prepare event parameters array
  const newRecipientHatParam = new ethereum.EventParam(
    "newRecipientHat",
    ethereum.Value.fromUnsignedBigInt(newRecipientHat)
  );

  const parameters = new Array<ethereum.EventParam>();
  parameters.push(newRecipientHatParam);

  // create mocked event
  let mockEvent = newMockEvent();
  let newRecipientHatEvent = new StakingEligibility_RecipientHatChanged(
    instance,
    mockEvent.logIndex,
    mockEvent.transactionLogIndex,
    mockEvent.logType,
    mockEvent.block,
    mockEvent.transaction,
    parameters,
    mockEvent.receipt
  );

  return newRecipientHatEvent;
}

export function mockElectionOpenedEvent(
  instance: Address,
  nextTermEnd: BigInt
): ElectionOpened {
  // prepare event parameters array
  const nextTermEndParam = new ethereum.EventParam(
    "nextTermEnd",
    ethereum.Value.fromUnsignedBigInt(nextTermEnd)
  );

  const parameters = new Array<ethereum.EventParam>();
  parameters.push(nextTermEndParam);

  // create mocked event
  let mockEvent = newMockEvent();
  let newElectionOpened = new ElectionOpened(
    instance,
    mockEvent.logIndex,
    mockEvent.transactionLogIndex,
    mockEvent.logType,
    mockEvent.block,
    mockEvent.transaction,
    parameters,
    mockEvent.receipt
  );

  return newElectionOpened;
}

export function mockElectionCompletedEvent(
  instance: Address,
  termEnd: BigInt,
  winners: Address[],
  timestamp: BigInt
): ElectionCompleted {
  // prepare event parameters array
  const termEndParam = new ethereum.EventParam(
    "termEnd",
    ethereum.Value.fromUnsignedBigInt(termEnd)
  );
  const winnersParam = new ethereum.EventParam(
    "winners",
    ethereum.Value.fromAddressArray(winners)
  );

  const parameters = new Array<ethereum.EventParam>();
  parameters.push(termEndParam);
  parameters.push(winnersParam);

  // create mocked event
  let mockEvent = newMockEvent();
  mockEvent.block.timestamp = timestamp;
  let newElectionCompleted = new ElectionCompleted(
    instance,
    mockEvent.logIndex,
    mockEvent.transactionLogIndex,
    mockEvent.logType,
    mockEvent.block,
    mockEvent.transaction,
    parameters,
    mockEvent.receipt
  );

  return newElectionCompleted;
}

export function mockNewTermStartedEvent(
  instance: Address,
  termEnd: BigInt,
  timestamp: BigInt
): NewTermStarted {
  // prepare event parameters array
  const termEndParam = new ethereum.EventParam(
    "termEnd",
    ethereum.Value.fromUnsignedBigInt(termEnd)
  );

  const parameters = new Array<ethereum.EventParam>();
  parameters.push(termEndParam);

  // create mocked event
  let mockEvent = newMockEvent();
  mockEvent.block.timestamp = timestamp;
  let newNewTermStarted = new NewTermStarted(
    instance,
    mockEvent.logIndex,
    mockEvent.transactionLogIndex,
    mockEvent.logType,
    mockEvent.block,
    mockEvent.transaction,
    parameters,
    mockEvent.receipt
  );

  return newNewTermStarted;
}

export function mockRecalledEvent(
  instance: Address,
  termEnd: BigInt,
  accounts: Address[]
): Recalled {
  // prepare event parameters array
  const termEndParam = new ethereum.EventParam(
    "termEnd",
    ethereum.Value.fromUnsignedBigInt(termEnd)
  );
  const accountsParam = new ethereum.EventParam(
    "accounts",
    ethereum.Value.fromAddressArray(accounts)
  );

  const parameters = new Array<ethereum.EventParam>();
  parameters.push(termEndParam);
  parameters.push(accountsParam);

  // create mocked event
  let mockEvent = newMockEvent();
  let newRecalled = new Recalled(
    instance,
    mockEvent.logIndex,
    mockEvent.transactionLogIndex,
    mockEvent.logType,
    mockEvent.block,
    mockEvent.transaction,
    parameters,
    mockEvent.receipt
  );

  return newRecalled;
}

export function mockERC6551AccountCreatedEvent(
  account: Address,
  implementation: Address,
  salt: Bytes,
  chainId: BigInt,
  tokenContract: Address,
  tokenId: BigInt
): ERC6551AccountCreated {
  // prepare event parameters array
  const accountParam = new ethereum.EventParam(
    "account",
    ethereum.Value.fromAddress(account)
  );
  const implementationParam = new ethereum.EventParam(
    "implementation",
    ethereum.Value.fromAddress(implementation)
  );
  const saltParam = new ethereum.EventParam(
    "salt",
    ethereum.Value.fromBytes(salt)
  );
  const chainIdParam = new ethereum.EventParam(
    "chainId",
    ethereum.Value.fromUnsignedBigInt(chainId)
  );
  const tokenContractParam = new ethereum.EventParam(
    "tokenContract",
    ethereum.Value.fromAddress(tokenContract)
  );
  const tokenIdParam = new ethereum.EventParam(
    "tokenId",
    ethereum.Value.fromUnsignedBigInt(tokenId)
  );

  const parameters = new Array<ethereum.EventParam>();
  parameters.push(accountParam);
  parameters.push(implementationParam);
  parameters.push(saltParam);
  parameters.push(chainIdParam);
  parameters.push(tokenContractParam);
  parameters.push(tokenIdParam);

  // create mocked event
  let mockEvent = newMockEvent();
  let newERC6551AccountCreated = new ERC6551AccountCreated(
    mockEvent.address,
    mockEvent.logIndex,
    mockEvent.transactionLogIndex,
    mockEvent.logType,
    mockEvent.block,
    mockEvent.transaction,
    parameters,
    mockEvent.receipt
  );

  return newERC6551AccountCreated;
}

export function mockTxExecuted(
  hatsAccountAddress: Address,
  signer: Address,
  blockNumber: BigInt,
  logIndex: BigInt,
  data: Bytes
): TxExecuted {
  // prepare event parameters array
  const signerParam = new ethereum.EventParam(
    "signer",
    ethereum.Value.fromAddress(signer)
  );

  const parameters = new Array<ethereum.EventParam>();
  parameters.push(signerParam);

  // create mocked event
  let mockEvent = newMockEvent();
  mockEvent.transaction.input = data;
  mockEvent.block.number = blockNumber;
  let newTxExecuted = new TxExecuted(
    hatsAccountAddress,
    logIndex,
    mockEvent.transactionLogIndex,
    mockEvent.logType,
    mockEvent.block,
    mockEvent.transaction,
    parameters,
    mockEvent.receipt
  );

  return newTxExecuted;
}

export function mockAgreementEligibility_HatClaimedWithAgreementEvent(
  instance: Address,
  claimer: Address,
  hatId: BigInt,
  agreement: string
): AgreementEligibility_HatClaimedWithAgreement {
  // prepare event parameters array
  const claimerParam = new ethereum.EventParam(
    "claimer",
    ethereum.Value.fromAddress(claimer)
  );
  const hatIdParam = new ethereum.EventParam(
    "hatId",
    ethereum.Value.fromUnsignedBigInt(hatId)
  );
  const agreementParam = new ethereum.EventParam(
    "agreement",
    ethereum.Value.fromString(agreement)
  );

  const parameters = new Array<ethereum.EventParam>();
  parameters.push(claimerParam);
  parameters.push(hatIdParam);
  parameters.push(agreementParam);

  // create mocked event
  let mockEvent = newMockEvent();
  let newAgreementEligibility_HatClaimedWithAgreement =
    new AgreementEligibility_HatClaimedWithAgreement(
      instance,
      mockEvent.logIndex,
      mockEvent.transactionLogIndex,
      mockEvent.logType,
      mockEvent.block,
      mockEvent.transaction,
      parameters,
      mockEvent.receipt
    );

  return newAgreementEligibility_HatClaimedWithAgreement;
}

export function mockAgreementEligibility_AgreementSignedEvent(
  instance: Address,
  signer: Address,
  agreement: string
): AgreementEligibility_AgreementSigned {
  // prepare event parameters array
  const signerParam = new ethereum.EventParam(
    "signer",
    ethereum.Value.fromAddress(signer)
  );
  const agreementParam = new ethereum.EventParam(
    "agreement",
    ethereum.Value.fromString(agreement)
  );

  const parameters = new Array<ethereum.EventParam>();
  parameters.push(signerParam);
  parameters.push(agreementParam);

  // create mocked event
  let mockEvent = newMockEvent();
  let newAgreementEligibility_AgreementSigned =
    new AgreementEligibility_AgreementSigned(
      instance,
      mockEvent.logIndex,
      mockEvent.transactionLogIndex,
      mockEvent.logType,
      mockEvent.block,
      mockEvent.transaction,
      parameters,
      mockEvent.receipt
    );

  return newAgreementEligibility_AgreementSigned;
}

export function mockAgreementEligibility_AgreementSetEvent(
  instance: Address,
  currentTimestamp: BigInt,
  agreement: string,
  grace: BigInt
): AgreementEligibility_AgreementSet {
  // prepare event parameters array
  const agreementParam = new ethereum.EventParam(
    "agreement",
    ethereum.Value.fromString(agreement)
  );
  const graceParam = new ethereum.EventParam(
    "grace",
    ethereum.Value.fromUnsignedBigInt(grace)
  );

  const parameters = new Array<ethereum.EventParam>();
  parameters.push(agreementParam);
  parameters.push(graceParam);

  // create mocked event
  let mockEvent = newMockEvent();
  mockEvent.block.timestamp = currentTimestamp;
  let newAgreementEligibility_AgreementSet =
    new AgreementEligibility_AgreementSet(
      instance,
      mockEvent.logIndex,
      mockEvent.transactionLogIndex,
      mockEvent.logType,
      mockEvent.block,
      mockEvent.transaction,
      parameters,
      mockEvent.receipt
    );

  return newAgreementEligibility_AgreementSet;
}

export function mockHatCreatedEvent(
  id: BigInt,
  details: string,
  maxSupply: BigInt,
  eligibility: Address,
  toggle: Address,
  mutable: boolean,
  imageURI: string,
  chainId: BigInt,
  expectedHatsAccountAddress: Address
): HatCreated {
  // prepare event parameters array
  let idParam = new ethereum.EventParam(
    "id",
    ethereum.Value.fromUnsignedBigInt(id)
  );
  let detailsParam = new ethereum.EventParam(
    "details",
    ethereum.Value.fromString(details)
  );
  let maxSupplyParam = new ethereum.EventParam(
    "maxSupply",
    ethereum.Value.fromSignedBigInt(maxSupply)
  );
  let eligibilityParam = new ethereum.EventParam(
    "eligibility",
    ethereum.Value.fromAddress(eligibility)
  );
  let toggleParam = new ethereum.EventParam(
    "toggle",
    ethereum.Value.fromAddress(toggle)
  );
  let mutableParam = new ethereum.EventParam(
    "mutable_",
    ethereum.Value.fromBoolean(mutable)
  );
  let imageUriParam = new ethereum.EventParam(
    "imageURI",
    ethereum.Value.fromString(imageURI)
  );

  const parameters = new Array<ethereum.EventParam>();
  parameters.push(idParam);
  parameters.push(detailsParam);
  parameters.push(maxSupplyParam);
  parameters.push(eligibilityParam);
  parameters.push(toggleParam);
  parameters.push(mutableParam);
  parameters.push(imageUriParam);

  // create mocked event
  let mockEvent = newMockEvent();
  let newHatCreatedEvent = new HatCreated(
    mockEvent.address,
    mockEvent.logIndex,
    mockEvent.transactionLogIndex,
    mockEvent.logType,
    mockEvent.block,
    mockEvent.transaction,
    parameters,
    mockEvent.receipt
  );

  createMockedFunction(
    Address.fromString(ERC6551_REGISTRY),
    "account",
    "account(address,bytes32,uint256,address,uint256):(address)"
  )
    .withArgs([
      ethereum.Value.fromAddress(
        Address.fromString(HATS_ACCOUNT_1_OF_N_IMPLEMENTATION)
      ),
      ethereum.Value.fromFixedBytes(
        Bytes.fromHexString(
          "0x0000000000000000000000000000000000000000000000000000000000000001"
        )
      ),
      ethereum.Value.fromUnsignedBigInt(chainId),
      ethereum.Value.fromAddress(Address.fromString(HATS)),
      ethereum.Value.fromUnsignedBigInt(id),
    ])
    .returns([ethereum.Value.fromAddress(expectedHatsAccountAddress)]);

  return newHatCreatedEvent;
}
