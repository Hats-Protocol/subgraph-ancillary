import { BigInt, ethereum, Bytes, log } from "@graphprotocol/graph-ts";
import { HatsModuleFactory_ModuleDeployed } from "../generated/HatsModuleFactoryV0_7_0/HatsModuleFactoryV0_7_0";
import {
  JokeRaceEligibility as JokeRaceEligibilityObject,
  AllowListEligibility as AllowListEligibilityObject,
  JokeRaceEligibilityTerm,
  HatsElectionEligibility as HatsElectionEligbilityObject,
  PassthroughModule as PassthroughModuleObject,
  StakingEligibility as StakingEligibilityObject,
  SeasonToggle as SeasonToggleObject,
  CharacterSheetsLevelEligibility as CharacterSheetsLevelEligibilityObject,
  AgreementEligibility as AgreementEligibilityObject,
  Agreement,
  HatAuthority,
  HatsStakingShaman as HatsStakingShamanObject,
  ShamanStake,
  HatsFarcasterDelegator as HatsFarcasterDelegatorObject,
  Erc20Eligibility as Erc20EligibilityObject,
  Erc721Eligibility as Erc721EligibilityObject,
  Erc1155Eligibility as Erc1155EligibilityObject,
  HatWearingEligibility as HatWearingEligibilityObject,
  GitcoinPassportEligibility as GitcoinPassportEligibilityObject,
  CoLinksEligibility as CoLinksEligibilityObject,
  HatsEligibilitiesChain as HatsEligibilitiesChainObject,
  EligibilitiesRuleset as EligibilitiesRulesetObject,
  HatControlledModule as HatControlledModuleObject,
  PublicLockV14Eligibility as PublicLockV14EligibilityObject,
} from "../generated/schema";
import {
  JokeRaceEligibilityV_0_2_0 as JokeRaceEligibilityV_0_2_0Template,
  JokeRaceEligibilityV_0_1_0 as JokeRaceEligibilityV_0_1_0Template,
  JokeRaceEligibilityV_0_3_0 as JokeRaceEligibilityV_0_3_0Template,
  AllowListEligibilityV_0_1_0 as AllowListEligibilityV_0_1_0Template,
  AllowListEligibilityV_0_2_0 as AllowListEligibilityV_0_2_0Template,
  AllowListEligibilityV_0_3_0 as AllowListEligibilityV_0_3_0Template,
  HatsElectionEligibilityV_0_1_0 as HatsElectionEligibilityV_0_1_0Template,
  HatsElectionEligibilityV_0_2_0 as HatsElectionEligibilityV_0_2_0Template,
  PassthroughModule as PassthroughModuleTemplate,
  StakingEligibility as StakingEligibilityTemplate,
  SeasonToggle as SeasonToggleTemplate,
  CharacterSheetsLevelEligibility as CharacterSheetsLevelEligibilityTemplate,
  AgreementEligibilityV_0_1_0 as AgreementEligibilityV_0_1_0Template,
  AgreementEligibilityV_0_2_0 as AgreementEligibilityV_0_2_0Template,
  AgreementEligibilityV_0_3_0 as AgreementEligibilityV_0_3_0Template,
  AgreementEligibilityV_0_4_0 as AgreementEligibilityV_0_4_0Template,
  HatsStakingShaman as HatsStakingShamanTemplate,
  HatsFarcasterDelegator as HatsFarcasterDelegatorTemplate,
  Erc20Eligibility as Erc20EligibilityTemplate,
  Erc721Eligibility as Erc721EligibilityTemplate,
  Erc1155Eligibility as Erc1155EligibilityTemplate,
  HatWearingEligibility as HatWearingEligibilityTemplate,
  GitcoinPassportEligibility as GitcoinPassportEligibilityTemplate,
  CoLinksEligibility as CoLinksEligibilityTemplate,
  HatControlledModuleV_0_1_0 as HatControlledModuleV_0_1_0Template,
  PublicLockV14EligibilityV_0_1_2 as PublicLockV14EligibilityV_0_1_2Template,
} from "../generated/templates";
import {
  JOKERACE_ELIGIBILITY_V_0_2_0_IMPLEMENTATION,
  JOKERACE_ELIGIBILITY_V_0_1_0_IMPLEMENTATION,
  JOKERACE_ELIGIBILITY_V_0_3_0_IMPLEMENTATION,
  ALLOWLIST_ELIGIBILITY_V_0_1_0_IMPLEMENTATION,
  ALLOWLIST_ELIGIBILITY_V_0_2_0_IMPLEMENTATION,
  ALLOWLIST_ELIGIBILITY_V_0_3_0_IMPLEMENTATION,
  HATS_ELECTION_ELIGIBILITY_V_0_1_0_IMPLEMENTATION,
  HATS_ELECTION_ELIGIBILITY_V_0_2_0_IMPLEMENTATION,
  PASSTHROUGH_MODULE_IMPLEMENTATION,
  STAKING_ELIGIBILITY_IMPLEMENTATION,
  SEASON_TOGGLE_IMPLEMENTATION,
  CHARACTER_SHEETS_LEVEL_ELIGIBILITY_IMPLEMENTATION,
  AGREEMENT_ELIGIBILITY_V_0_1_0_IMPLEMENTATION,
  AGREEMENT_ELIGIBILITY_V_0_2_0_IMPLEMENTATION,
  AGREEMENT_ELIGIBILITY_V_0_3_0_IMPLEMENTATION,
  AGREEMENT_ELIGIBILITY_V_0_4_0_IMPLEMENTATION,
  HATS_STAKING_SHAMAN_IMPLEMENTATION,
  HATS_FARCASTER_DELEGATOR_IMPLEMENTATION,
  ERC20_ELIGIBILITY_IMPLEMENTATION,
  ERC721_ELIGIBILITY_IMPLEMENTATION,
  ERC1155_ELIGIBILITY_IMPLEMENTATION,
  HAT_WEARING_ELIGIBILITY_IMPLEMENTATION,
  GITCOIN_PASSPORT_ELIGIBILITY_IMPLEMENTATION,
  COLINKS_ELIGIBILITY_IMPLEMENTATION,
  HATS_ELIGIBILITIES_CHAIN_V_0_1_0_IMPLEMENTATION,
  HATS_ELIGIBILITIES_CHAIN_V_0_2_0_IMPLEMENTATION,
  HAT_CONTROLLED_MODULE_V_0_1_0_IMPLEMENTATION,
  PUBLIC_LOCK_V14_ELIGIBILITY_V_0_1_2_IMPLEMENTATION,
} from "./constants";
import { HatsStakingShaman as HatsStakingShamanContract } from "../generated/templates/HatsStakingShaman/HatsStakingShaman";
import { HatsFarcasterDelegator as HatsFarcasterDelegatorContract } from "../generated/templates/HatsFarcasterDelegator/HatsFarcasterDelegator";
import {
  ChangeRecipientHatCall,
  StakingEligibility as StakingEligibilityContract,
} from "../generated/templates/StakingEligibility/StakingEligibility";
import { Erc20Eligibility as Erc20EligibilityContract } from "../generated/templates/Erc20Eligibility/Erc20Eligibility";
import { Erc721Eligibility as Erc721EligibilityContract } from "../generated/templates/Erc721Eligibility/Erc721Eligibility";
import { Erc1155Eligibility as Erc1155EligibilityContract } from "../generated/templates/Erc1155Eligibility/Erc1155Eligibility";
import { HatWearingEligibility as HatWearingEligibilityContract } from "../generated/templates/HatWearingEligibility/HatWearingEligibility";
import { GitcoinPassportEligibility as GitcoinPassportEligibilityContract } from "../generated/templates/GitcoinPassportEligibility/GitcoinPassportEligibility";
import { CoLinksEligibility as CoLinksEligibilityContract } from "../generated/templates/CoLinksEligibility/CoLinksEligibility";
import { AgreementEligibilityV_0_1_0 as AgreementEligibilityV_0_1_0Contract } from "../generated/templates/AgreementEligibilityV_0_1_0/AgreementEligibilityV_0_1_0";
import { AgreementEligibilityV_0_2_0 as AgreementEligibilityV_0_2_0Contract } from "../generated/templates/AgreementEligibilityV_0_2_0/AgreementEligibilityV_0_2_0";
import { AgreementEligibilityV_0_3_0 as AgreementEligibilityV_0_3_0Contract } from "../generated/templates/AgreementEligibilityV_0_3_0/AgreementEligibilityV_0_3_0";
import { AgreementEligibilityV_0_4_0 as AgreementEligibilityV_0_4_0Contract } from "../generated/templates/AgreementEligibilityV_0_4_0/AgreementEligibilityV_0_4_0";
import { AllowListEligibilityV_0_1_0 as AllowlistEligibilityV_0_1_0Contract } from "../generated/templates/AllowListEligibilityV_0_1_0/AllowListEligibilityV_0_1_0";
import { AllowListEligibilityV_0_2_0 as AllowlistEligibilityV_0_2_0Contract } from "../generated/templates/AllowListEligibilityV_0_2_0/AllowListEligibilityV_0_2_0";
import { AllowListEligibilityV_0_3_0 as AllowlistEligibilityV_0_3_0Contract } from "../generated/templates/AllowListEligibilityV_0_3_0/AllowListEligibilityV_0_3_0";
import { JokeRaceEligibilityV_0_3_0 as JokeRaceEligibilityV_0_3_0Contract } from "../generated/templates/JokeRaceEligibilityV_0_3_0/JokeRaceEligibilityV_0_3_0";
import { HatsEligibilitiesChainV_0_1_0 as HatsEligibilitiesChainV_0_1_0Contract } from "../generated/templates/HatsEligibilitiesChainV_0_1_0/HatsEligibilitiesChainV_0_1_0";
import { HatsEligibilitiesChainV_0_2_0 as HatsEligibilitiesChainV_0_2_0Contract } from "../generated/templates/HatsEligibilitiesChainV_0_2_0/HatsEligibilitiesChainV_0_2_0";
import { HatControlledModuleV_0_1_0 as HatControlledModuleV_0_1_0Contract } from "../generated/templates/HatControlledModuleV_0_1_0/HatControlledModuleV_0_1_0";
import { PublicLockV14EligibilityV_0_1_2 as PublicLockV14EligibilityV_0_1_2Contract } from "../generated/templates/PublicLockV14EligibilityV_0_1_2/PublicLockV14EligibilityV_0_1_2";
import { hatIdToHex, getLinkedTreeAdmin } from "./utils";

export function handleModuleDeployed(
  event: HatsModuleFactory_ModuleDeployed
): void {
  const implemenatationAddress = event.params.implementation.toHexString();

  if (implemenatationAddress == JOKERACE_ELIGIBILITY_V_0_3_0_IMPLEMENTATION) {
    JokeRaceEligibilityV_0_3_0Template.create(event.params.instance);
    const jokeRaceEligibility = new JokeRaceEligibilityObject(
      event.params.instance.toHexString()
    );

    const jokeRaceEligibilityContract = JokeRaceEligibilityV_0_3_0Contract.bind(
      event.params.instance
    );

    const adminHatInput = jokeRaceEligibilityContract.ADMIN_HAT();
    const hatId = hatIdToHex(event.params.hatId);

    let adminHat: string[] = [];

    if (adminHatInput != BigInt.fromI32(0)) {
      adminHat.push(hatIdToHex(adminHatInput));
      // check if hat exists, create new object if not
      let adminHatAuthority = HatAuthority.load(hatIdToHex(adminHatInput));
      if (adminHatAuthority == null) {
        adminHatAuthority = new HatAuthority(hatIdToHex(adminHatInput));
        adminHatAuthority.save();
      }
    } else {
      // admin hats fallback
      adminHat = getAllAdmins(hatId);
    }

    const nextTermDetails = jokeRaceEligibilityContract.terms(
      BigInt.fromI32(1)
    );
    const nextTerm = new JokeRaceEligibilityTerm(
      event.params.instance.toHexString() + "-" + "1"
    );
    nextTerm.jokeRaceEligibility = jokeRaceEligibility.id;
    nextTerm.termEndsAt = nextTermDetails.getTermEnd();
    nextTerm.topK = nextTermDetails.getTopK();
    nextTerm.transitionPeriod = nextTermDetails.getTransitionPeriod();
    nextTerm.contest = nextTermDetails.getContest().toHexString();

    jokeRaceEligibility.hatId = hatId;
    jokeRaceEligibility.adminHat = adminHat;
    jokeRaceEligibility.nextTerm = nextTerm.id;
    jokeRaceEligibility.version = "0.3.0";
    nextTerm.save();
    jokeRaceEligibility.save();
  } else if (
    implemenatationAddress == JOKERACE_ELIGIBILITY_V_0_2_0_IMPLEMENTATION
  ) {
    JokeRaceEligibilityV_0_2_0Template.create(event.params.instance);
    const jokeRaceEligibility = new JokeRaceEligibilityObject(
      event.params.instance.toHexString()
    );

    let decodedInitArgs = (
      ethereum.decode(
        "(address,uint256,uint256)",
        event.params.initData
      ) as ethereum.Value
    ).toTuple();

    const contestAddress = decodedInitArgs[0].toAddress().toHexString();
    const termEnd = decodedInitArgs[1].toBigInt();
    const topK = decodedInitArgs[2].toBigInt();

    let decodedImmutableArgs = (
      ethereum.decode(
        "(uint256)",
        event.params.otherImmutableArgs
      ) as ethereum.Value
    ).toTuple();

    const adminHatInput = decodedImmutableArgs[0].toBigInt();
    const hatId = hatIdToHex(event.params.hatId);

    let adminHat: string[] = [];

    if (adminHatInput != BigInt.fromI32(0)) {
      adminHat.push(hatIdToHex(adminHatInput));
      // check if hat exists, create new object if not
      let adminHatAuthority = HatAuthority.load(hatIdToHex(adminHatInput));
      if (adminHatAuthority == null) {
        adminHatAuthority = new HatAuthority(hatIdToHex(adminHatInput));
        adminHatAuthority.save();
      }
    } else {
      // admin hats fallback
      adminHat = getAllAdmins(hatId);
    }

    jokeRaceEligibility.hatId = hatId;
    jokeRaceEligibility.adminHat = adminHat;
    jokeRaceEligibility.version = "0.2.0";
    jokeRaceEligibility.save();
  } else if (
    implemenatationAddress == JOKERACE_ELIGIBILITY_V_0_1_0_IMPLEMENTATION
  ) {
    JokeRaceEligibilityV_0_1_0Template.create(event.params.instance);
    const jokeRaceEligibility = new JokeRaceEligibilityObject(
      event.params.instance.toHexString()
    );

    let decodedInitArgs = (
      ethereum.decode(
        "(address,uint256,uint256)",
        event.params.initData
      ) as ethereum.Value
    ).toTuple();

    const contestAddress = decodedInitArgs[0].toAddress().toHexString();
    const termEnd = decodedInitArgs[1].toBigInt();
    const topK = decodedInitArgs[2].toBigInt();

    let decodedImmutableArgs = (
      ethereum.decode(
        "(uint256)",
        event.params.otherImmutableArgs
      ) as ethereum.Value
    ).toTuple();

    const adminHatInput = decodedImmutableArgs[0].toBigInt();
    const hatId = hatIdToHex(event.params.hatId);

    let adminHat: string[] = [];

    if (adminHatInput != BigInt.fromI32(0)) {
      adminHat.push(hatIdToHex(adminHatInput));
      // check if hat exists, create new object if not
      let adminHatAuthority = HatAuthority.load(hatIdToHex(adminHatInput));
      if (adminHatAuthority == null) {
        adminHatAuthority = new HatAuthority(hatIdToHex(adminHatInput));
        adminHatAuthority.save();
      }
    } else {
      // admin hats fallback
      adminHat = getAllAdmins(hatId);
    }

    jokeRaceEligibility.hatId = hatId;
    jokeRaceEligibility.adminHat = adminHat;
    jokeRaceEligibility.version = "0.1.0";
    jokeRaceEligibility.save();
  } else if (
    implemenatationAddress == ALLOWLIST_ELIGIBILITY_V_0_1_0_IMPLEMENTATION
  ) {
    AllowListEligibilityV_0_1_0Template.create(event.params.instance);
    const allowListEligibility = new AllowListEligibilityObject(
      event.params.instance.toHexString()
    );

    const allowListEligibilityContract =
      AllowlistEligibilityV_0_1_0Contract.bind(event.params.instance);

    const ownerHat = allowListEligibilityContract.OWNER_HAT();
    // check if hat exists, create new object if not
    let ownerHatAuthority = HatAuthority.load(hatIdToHex(ownerHat));
    if (ownerHatAuthority == null) {
      ownerHatAuthority = new HatAuthority(hatIdToHex(ownerHat));
    }

    const arbitratorHat = allowListEligibilityContract.ARBITRATOR_HAT();
    // check if hat exists, create new object if not
    let arbitratorHatAuthority = HatAuthority.load(hatIdToHex(arbitratorHat));
    if (arbitratorHatAuthority == null) {
      arbitratorHatAuthority = new HatAuthority(hatIdToHex(arbitratorHat));
    }

    allowListEligibility.hatId = hatIdToHex(event.params.hatId);
    allowListEligibility.ownerHat = hatIdToHex(ownerHat);
    allowListEligibility.arbitratorHat = hatIdToHex(arbitratorHat);
    allowListEligibility.version = "0.1.0";
    allowListEligibility.save();
    ownerHatAuthority.save();
    arbitratorHatAuthority.save();
  } else if (
    implemenatationAddress == ALLOWLIST_ELIGIBILITY_V_0_2_0_IMPLEMENTATION
  ) {
    AllowListEligibilityV_0_2_0Template.create(event.params.instance);
    const allowListEligibility = new AllowListEligibilityObject(
      event.params.instance.toHexString()
    );

    const allowListEligibilityContract =
      AllowlistEligibilityV_0_2_0Contract.bind(event.params.instance);

    const ownerHat = allowListEligibilityContract.ownerHat();
    // check if hat exists, create new object if not
    let ownerHatAuthority = HatAuthority.load(hatIdToHex(ownerHat));
    if (ownerHatAuthority == null) {
      ownerHatAuthority = new HatAuthority(hatIdToHex(ownerHat));
    }

    const arbitratorHat = allowListEligibilityContract.arbitratorHat();
    // check if hat exists, create new object if not
    let arbitratorHatAuthority = HatAuthority.load(hatIdToHex(arbitratorHat));
    if (arbitratorHatAuthority == null) {
      arbitratorHatAuthority = new HatAuthority(hatIdToHex(arbitratorHat));
    }

    allowListEligibility.hatId = hatIdToHex(event.params.hatId);
    allowListEligibility.ownerHat = hatIdToHex(ownerHat);
    allowListEligibility.arbitratorHat = hatIdToHex(arbitratorHat);
    allowListEligibility.version = "0.2.0";
    allowListEligibility.save();
    ownerHatAuthority.save();
    arbitratorHatAuthority.save();
  } else if (
    implemenatationAddress == ALLOWLIST_ELIGIBILITY_V_0_3_0_IMPLEMENTATION
  ) {
    AllowListEligibilityV_0_3_0Template.create(event.params.instance);
    const allowListEligibility = new AllowListEligibilityObject(
      event.params.instance.toHexString()
    );

    const allowListEligibilityContract =
      AllowlistEligibilityV_0_3_0Contract.bind(event.params.instance);

    const ownerHat = allowListEligibilityContract.ownerHat();
    // check if hat exists, create new object if not
    let ownerHatAuthority = HatAuthority.load(hatIdToHex(ownerHat));
    if (ownerHatAuthority == null) {
      ownerHatAuthority = new HatAuthority(hatIdToHex(ownerHat));
    }

    const arbitratorHat = allowListEligibilityContract.arbitratorHat();
    // check if hat exists, create new object if not
    let arbitratorHatAuthority = HatAuthority.load(hatIdToHex(arbitratorHat));
    if (arbitratorHatAuthority == null) {
      arbitratorHatAuthority = new HatAuthority(hatIdToHex(arbitratorHat));
    }

    allowListEligibility.hatId = hatIdToHex(event.params.hatId);
    allowListEligibility.ownerHat = hatIdToHex(ownerHat);
    allowListEligibility.arbitratorHat = hatIdToHex(arbitratorHat);
    allowListEligibility.version = "0.3.0";
    allowListEligibility.save();
    ownerHatAuthority.save();
    arbitratorHatAuthority.save();
  } else if (
    implemenatationAddress == HATS_ELECTION_ELIGIBILITY_V_0_1_0_IMPLEMENTATION
  ) {
    HatsElectionEligibilityV_0_1_0Template.create(event.params.instance);
    const hatsElectionEligibility = new HatsElectionEligbilityObject(
      event.params.instance.toHexString()
    );

    let decodedImmutableArgs = (
      ethereum.decode(
        "(uint256, uint256)",
        event.params.otherImmutableArgs
      ) as ethereum.Value
    ).toTuple();

    const ballotBoxHat = decodedImmutableArgs[0].toBigInt();
    // check if hat exists, create new object if not
    let ballotBoxHatAuthority = HatAuthority.load(hatIdToHex(ballotBoxHat));
    if (ballotBoxHatAuthority == null) {
      ballotBoxHatAuthority = new HatAuthority(hatIdToHex(ballotBoxHat));
    }

    const adminHatInput = decodedImmutableArgs[1].toBigInt();
    const hatId = hatIdToHex(event.params.hatId);

    let adminHat: string[] = [];

    if (adminHatInput != BigInt.fromI32(0)) {
      adminHat.push(hatIdToHex(adminHatInput));
      // check if hat exists, create new object if not
      let adminHatAuthority = HatAuthority.load(hatIdToHex(adminHatInput));
      if (adminHatAuthority == null) {
        adminHatAuthority = new HatAuthority(hatIdToHex(adminHatInput));
        adminHatAuthority.save();
      }
    } else {
      // admin hats fallback
      adminHat = getAllAdmins(hatId);
    }

    hatsElectionEligibility.hatId = hatId;
    hatsElectionEligibility.ballotBoxHat = hatIdToHex(ballotBoxHat);
    hatsElectionEligibility.adminHat = adminHat;
    hatsElectionEligibility.version = "0.1.0";
    hatsElectionEligibility.save();
    ballotBoxHatAuthority.save();
  } else if (
    implemenatationAddress == HATS_ELECTION_ELIGIBILITY_V_0_2_0_IMPLEMENTATION
  ) {
    HatsElectionEligibilityV_0_2_0Template.create(event.params.instance);
    const hatsElectionEligibility = new HatsElectionEligbilityObject(
      event.params.instance.toHexString()
    );

    let decodedImmutableArgs = (
      ethereum.decode(
        "(uint256, uint256)",
        event.params.otherImmutableArgs
      ) as ethereum.Value
    ).toTuple();

    const ballotBoxHat = decodedImmutableArgs[0].toBigInt();
    // check if hat exists, create new object if not
    let ballotBoxHatAuthority = HatAuthority.load(hatIdToHex(ballotBoxHat));
    if (ballotBoxHatAuthority == null) {
      ballotBoxHatAuthority = new HatAuthority(hatIdToHex(ballotBoxHat));
    }

    const adminHatInput = decodedImmutableArgs[1].toBigInt();
    const hatId = hatIdToHex(event.params.hatId);

    let adminHat: string[] = [];

    if (adminHatInput != BigInt.fromI32(0)) {
      adminHat.push(hatIdToHex(adminHatInput));
      // check if hat exists, create new object if not
      let adminHatAuthority = HatAuthority.load(hatIdToHex(adminHatInput));
      if (adminHatAuthority == null) {
        adminHatAuthority = new HatAuthority(hatIdToHex(adminHatInput));
        adminHatAuthority.save();
      }
    } else {
      // admin hats fallback
      adminHat = getAllAdmins(hatId);
    }

    hatsElectionEligibility.hatId = hatId;
    hatsElectionEligibility.ballotBoxHat = hatIdToHex(ballotBoxHat);
    hatsElectionEligibility.adminHat = adminHat;
    hatsElectionEligibility.currentTerm = null;
    hatsElectionEligibility.version = "0.2.0";
    hatsElectionEligibility.save();
    ballotBoxHatAuthority.save();
  } else if (implemenatationAddress == PASSTHROUGH_MODULE_IMPLEMENTATION) {
    PassthroughModuleTemplate.create(event.params.instance);
    const passthroughModule = new PassthroughModuleObject(
      event.params.instance.toHexString()
    );

    let decodedImmutableArgs = (
      ethereum.decode(
        "(uint256)",
        event.params.otherImmutableArgs
      ) as ethereum.Value
    ).toTuple();

    const passthroughHat = decodedImmutableArgs[0].toBigInt();
    // check if hat exists, create new object if not
    let passthroughHatAuthority = HatAuthority.load(hatIdToHex(passthroughHat));
    if (passthroughHatAuthority == null) {
      passthroughHatAuthority = new HatAuthority(hatIdToHex(passthroughHat));
    }

    passthroughModule.hatId = hatIdToHex(event.params.hatId);
    passthroughModule.passthroughHat = hatIdToHex(passthroughHat);
    passthroughModule.version = "0.1.0";
    passthroughModule.save();
    passthroughHatAuthority.save();
  } else if (implemenatationAddress == STAKING_ELIGIBILITY_IMPLEMENTATION) {
    StakingEligibilityTemplate.create(event.params.instance);
    const stakingEligibility = new StakingEligibilityObject(
      event.params.instance.toHexString()
    );
    const stakingEligibilityContract = StakingEligibilityContract.bind(
      event.params.instance
    );

    const token = stakingEligibilityContract.TOKEN();
    const minStake = stakingEligibilityContract.minStake();
    const cooldownBuffer = stakingEligibilityContract.cooldownPeriod();
    const judgeHat = stakingEligibilityContract.judgeHat();
    // check if hat exists, create new object if not
    let judgeHatAuthority = HatAuthority.load(hatIdToHex(judgeHat));
    if (judgeHatAuthority == null) {
      judgeHatAuthority = new HatAuthority(hatIdToHex(judgeHat));
    }

    const recipientHat = stakingEligibilityContract.recipientHat();
    // check if hat exists, create new object if not
    let recipientHatAuthority = HatAuthority.load(hatIdToHex(recipientHat));
    if (recipientHatAuthority == null) {
      recipientHatAuthority = new HatAuthority(hatIdToHex(recipientHat));
    }

    const hatId = hatIdToHex(event.params.hatId);
    const hatAdmins = getAllAdmins(hatId);

    stakingEligibility.hatAdmins = hatAdmins;
    stakingEligibility.hatId = hatId;
    stakingEligibility.judgeHat = hatIdToHex(judgeHat);
    stakingEligibility.recipientHat = hatIdToHex(recipientHat);
    stakingEligibility.minStake = minStake;
    stakingEligibility.cooldownPeriod = cooldownBuffer;
    stakingEligibility.totalSlashedStakes = BigInt.fromI32(0);
    stakingEligibility.token = token.toHexString();
    stakingEligibility.version = "0.1.0";
    stakingEligibility.save();
    judgeHatAuthority.save();
    recipientHatAuthority.save();
  } else if (implemenatationAddress == SEASON_TOGGLE_IMPLEMENTATION) {
    SeasonToggleTemplate.create(event.params.instance);
    const seasonToggle = new SeasonToggleObject(
      event.params.instance.toHexString()
    );

    const hatId = hatIdToHex(event.params.hatId);
    const hatAdmins = getAllAdmins(hatId);

    seasonToggle.hatAdmins = hatAdmins;
    seasonToggle.hatId = hatId;
    seasonToggle.version = "0.1.0";
    seasonToggle.save();
  } else if (
    implemenatationAddress == CHARACTER_SHEETS_LEVEL_ELIGIBILITY_IMPLEMENTATION
  ) {
    CharacterSheetsLevelEligibilityTemplate.create(event.params.instance);
    const characterSheetsLevelEligibility =
      new CharacterSheetsLevelEligibilityObject(
        event.params.instance.toHexString()
      );

    const hatId = hatIdToHex(event.params.hatId);
    const hatAdmins = getAllAdmins(hatId);

    characterSheetsLevelEligibility.hatAdmins = hatAdmins;
    characterSheetsLevelEligibility.hatId = hatId;
    characterSheetsLevelEligibility.version = "0.1.0";
    characterSheetsLevelEligibility.save();
  } else if (
    implemenatationAddress == AGREEMENT_ELIGIBILITY_V_0_1_0_IMPLEMENTATION
  ) {
    AgreementEligibilityV_0_1_0Template.create(event.params.instance);
    const agreementEligibility = new AgreementEligibilityObject(
      event.params.instance.toHexString()
    );

    const agreementEligibilityContract =
      AgreementEligibilityV_0_1_0Contract.bind(event.params.instance);
    const agreement = agreementEligibilityContract.currentAgreement();

    const agreementObject = new Agreement("1" + "-" + agreementEligibility.id);
    agreementObject.agreementEligibility = agreementEligibility.id;
    agreementObject.agreement = agreement;
    agreementObject.signers = [];
    agreementObject.graceEndTime = BigInt.fromI32(0);

    const ownerHat = agreementEligibilityContract.OWNER_HAT();
    // check if hat exists, create new object if not
    let ownerHatAuthority = HatAuthority.load(hatIdToHex(ownerHat));
    if (ownerHatAuthority == null) {
      ownerHatAuthority = new HatAuthority(hatIdToHex(ownerHat));
    }

    const arbitratorHat = agreementEligibilityContract.ARBITRATOR_HAT();
    // check if hat exists, create new object if not
    let arbitratorHatAuthority = HatAuthority.load(hatIdToHex(arbitratorHat));
    if (arbitratorHatAuthority == null) {
      arbitratorHatAuthority = new HatAuthority(hatIdToHex(arbitratorHat));
    }

    const hatId = hatIdToHex(event.params.hatId);

    agreementEligibility.hatId = hatId;
    agreementEligibility.ownerHat = hatIdToHex(ownerHat);
    agreementEligibility.arbitratorHat = hatIdToHex(arbitratorHat);
    agreementEligibility.currentAgreement = agreementObject.id;
    agreementEligibility.currentAgreementNumber = BigInt.fromI32(1);
    agreementEligibility.badStandings = [];
    agreementEligibility.version = "0.1.0";

    agreementEligibility.save();
    ownerHatAuthority.save();
    arbitratorHatAuthority.save();
    agreementObject.save();
  } else if (
    implemenatationAddress == AGREEMENT_ELIGIBILITY_V_0_2_0_IMPLEMENTATION
  ) {
    AgreementEligibilityV_0_2_0Template.create(event.params.instance);
    const agreementEligibility = new AgreementEligibilityObject(
      event.params.instance.toHexString()
    );

    const agreementEligibilityContract =
      AgreementEligibilityV_0_2_0Contract.bind(event.params.instance);

    const agreement = agreementEligibilityContract.currentAgreement();

    const agreementObject = new Agreement("1" + "-" + agreementEligibility.id);
    agreementObject.agreementEligibility = agreementEligibility.id;
    agreementObject.agreement = agreement;
    agreementObject.signers = [];
    agreementObject.graceEndTime = BigInt.fromI32(0);

    const ownerHat = agreementEligibilityContract.ownerHat();
    // check if hat exists, create new object if not
    let ownerHatAuthority = HatAuthority.load(hatIdToHex(ownerHat));
    if (ownerHatAuthority == null) {
      ownerHatAuthority = new HatAuthority(hatIdToHex(ownerHat));
    }

    const arbitratorHat = agreementEligibilityContract.arbitratorHat();
    // check if hat exists, create new object if not
    let arbitratorHatAuthority = HatAuthority.load(hatIdToHex(arbitratorHat));
    if (arbitratorHatAuthority == null) {
      arbitratorHatAuthority = new HatAuthority(hatIdToHex(arbitratorHat));
    }

    const hatId = hatIdToHex(event.params.hatId);

    agreementEligibility.hatId = hatId;
    agreementEligibility.ownerHat = hatIdToHex(ownerHat);
    agreementEligibility.arbitratorHat = hatIdToHex(arbitratorHat);
    agreementEligibility.currentAgreement = agreementObject.id;
    agreementEligibility.currentAgreementNumber = BigInt.fromI32(1);
    agreementEligibility.badStandings = [];
    agreementEligibility.version = "0.2.0";

    agreementEligibility.save();
    ownerHatAuthority.save();
    arbitratorHatAuthority.save();
    agreementObject.save();
  } else if (
    implemenatationAddress == AGREEMENT_ELIGIBILITY_V_0_3_0_IMPLEMENTATION
  ) {
    AgreementEligibilityV_0_3_0Template.create(event.params.instance);
    const agreementEligibility = new AgreementEligibilityObject(
      event.params.instance.toHexString()
    );

    const agreementEligibilityContract =
      AgreementEligibilityV_0_3_0Contract.bind(event.params.instance);

    const agreement = agreementEligibilityContract.currentAgreement();

    const agreementObject = new Agreement("1" + "-" + agreementEligibility.id);
    agreementObject.agreementEligibility = agreementEligibility.id;
    agreementObject.agreement = agreement;
    agreementObject.signers = [];
    agreementObject.graceEndTime = BigInt.fromI32(0);

    const ownerHat = agreementEligibilityContract.ownerHat();
    // check if hat exists, create new object if not
    let ownerHatAuthority = HatAuthority.load(hatIdToHex(ownerHat));
    if (ownerHatAuthority == null) {
      ownerHatAuthority = new HatAuthority(hatIdToHex(ownerHat));
    }

    const arbitratorHat = agreementEligibilityContract.arbitratorHat();
    // check if hat exists, create new object if not
    let arbitratorHatAuthority = HatAuthority.load(hatIdToHex(arbitratorHat));
    if (arbitratorHatAuthority == null) {
      arbitratorHatAuthority = new HatAuthority(hatIdToHex(arbitratorHat));
    }

    const hatId = hatIdToHex(event.params.hatId);

    agreementEligibility.hatId = hatId;
    agreementEligibility.ownerHat = hatIdToHex(ownerHat);
    agreementEligibility.arbitratorHat = hatIdToHex(arbitratorHat);
    agreementEligibility.currentAgreement = agreementObject.id;
    agreementEligibility.currentAgreementNumber = BigInt.fromI32(1);
    agreementEligibility.badStandings = [];
    agreementEligibility.version = "0.3.0";

    agreementEligibility.save();
    ownerHatAuthority.save();
    arbitratorHatAuthority.save();
    agreementObject.save();
  } else if (
    implemenatationAddress == AGREEMENT_ELIGIBILITY_V_0_4_0_IMPLEMENTATION
  ) {
    AgreementEligibilityV_0_4_0Template.create(event.params.instance);
    const agreementEligibility = new AgreementEligibilityObject(
      event.params.instance.toHexString()
    );

    const agreementEligibilityContract =
      AgreementEligibilityV_0_4_0Contract.bind(event.params.instance);

    const agreement = agreementEligibilityContract.currentAgreement();

    const agreementObject = new Agreement("1" + "-" + agreementEligibility.id);
    agreementObject.agreementEligibility = agreementEligibility.id;
    agreementObject.agreement = agreement;
    agreementObject.signers = [];
    agreementObject.graceEndTime = BigInt.fromI32(0);

    const ownerHat = agreementEligibilityContract.ownerHat();
    // check if hat exists, create new object if not
    let ownerHatAuthority = HatAuthority.load(hatIdToHex(ownerHat));
    if (ownerHatAuthority == null) {
      ownerHatAuthority = new HatAuthority(hatIdToHex(ownerHat));
    }

    const arbitratorHat = agreementEligibilityContract.arbitratorHat();
    // check if hat exists, create new object if not
    let arbitratorHatAuthority = HatAuthority.load(hatIdToHex(arbitratorHat));
    if (arbitratorHatAuthority == null) {
      arbitratorHatAuthority = new HatAuthority(hatIdToHex(arbitratorHat));
    }

    const hatId = hatIdToHex(event.params.hatId);

    agreementEligibility.hatId = hatId;
    agreementEligibility.ownerHat = hatIdToHex(ownerHat);
    agreementEligibility.arbitratorHat = hatIdToHex(arbitratorHat);
    agreementEligibility.currentAgreement = agreementObject.id;
    agreementEligibility.currentAgreementNumber = BigInt.fromI32(1);
    agreementEligibility.badStandings = [];
    agreementEligibility.version = "0.4.0";

    agreementEligibility.save();
    ownerHatAuthority.save();
    arbitratorHatAuthority.save();
    agreementObject.save();
  } else if (implemenatationAddress == HATS_STAKING_SHAMAN_IMPLEMENTATION) {
    HatsStakingShamanTemplate.create(event.params.instance);
    const hatsStakingShaman = new HatsStakingShamanObject(
      event.params.instance.toHexString()
    );
    const hatsStakingShamanContract = HatsStakingShamanContract.bind(
      event.params.instance
    );

    const cooldownBuffer = hatsStakingShamanContract.cooldownBuffer();
    const judgeHat = hatsStakingShamanContract.judge();
    const minStake = hatsStakingShamanContract.minStake();
    const baal = hatsStakingShamanContract.BAAL();
    const stakingProxyImpl = hatsStakingShamanContract.STAKING_PROXY_IMPL();
    const sharesToken = hatsStakingShamanContract.SHARES_TOKEN();
    const hatId = hatIdToHex(event.params.hatId);

    // check if hat exists, create new object if not
    let judgeHatAuthority = HatAuthority.load(hatIdToHex(judgeHat));
    if (judgeHatAuthority == null) {
      judgeHatAuthority = new HatAuthority(hatIdToHex(judgeHat));
      judgeHatAuthority.save();
    }

    hatsStakingShaman.hatId = hatId;
    hatsStakingShaman.judgeHat = hatIdToHex(judgeHat);
    hatsStakingShaman.coolDownBuffer = cooldownBuffer;
    hatsStakingShaman.minStake = minStake;
    hatsStakingShaman.baal = baal.toHexString();
    hatsStakingShaman.stakingProxyImpl = stakingProxyImpl.toHexString();
    hatsStakingShaman.sharesToken = sharesToken.toHexString();
    hatsStakingShaman.save();
  } else if (
    implemenatationAddress == HATS_FARCASTER_DELEGATOR_IMPLEMENTATION
  ) {
    HatsFarcasterDelegatorTemplate.create(event.params.instance);
    const hatsFarcasterDelegator = new HatsFarcasterDelegatorObject(
      event.params.instance.toHexString()
    );
    const hatsFarcasterDelegatorContract = HatsFarcasterDelegatorContract.bind(
      event.params.instance
    );

    const ownerHat = hatsFarcasterDelegatorContract.ownerHat();
    const casterHat = event.params.hatId;

    let ownerHatAuthority = HatAuthority.load(hatIdToHex(ownerHat));
    if (ownerHatAuthority == null) {
      ownerHatAuthority = new HatAuthority(hatIdToHex(ownerHat));
      ownerHatAuthority.save();
    }

    let casterHatAuthority = HatAuthority.load(hatIdToHex(casterHat));
    if (casterHatAuthority == null) {
      casterHatAuthority = new HatAuthority(hatIdToHex(casterHat));
      casterHatAuthority.save();
    }

    hatsFarcasterDelegator.caster = hatIdToHex(casterHat);
    hatsFarcasterDelegator.owner = hatIdToHex(ownerHat);
    hatsFarcasterDelegator.save();
  } else if (implemenatationAddress == ERC20_ELIGIBILITY_IMPLEMENTATION) {
    Erc20EligibilityTemplate.create(event.params.instance);
    const erc20Eligibility = new Erc20EligibilityObject(
      event.params.instance.toHexString()
    );
    const erc20EligibilityContract = Erc20EligibilityContract.bind(
      event.params.instance
    );

    const token = erc20EligibilityContract.ERC20_TOKEN_ADDRESS();
    const minBalance = erc20EligibilityContract.MIN_BALANCE();
    const hatId = erc20EligibilityContract.hatId();

    erc20Eligibility.token = token.toHexString();
    erc20Eligibility.minBalance = minBalance;
    erc20Eligibility.hatId = hatIdToHex(hatId);
    erc20Eligibility.version = "0.1.0";
    erc20Eligibility.save();
  } else if (implemenatationAddress == ERC721_ELIGIBILITY_IMPLEMENTATION) {
    Erc721EligibilityTemplate.create(event.params.instance);
    const erc721Eligibility = new Erc721EligibilityObject(
      event.params.instance.toHexString()
    );
    const erc721EligibilityContract = Erc721EligibilityContract.bind(
      event.params.instance
    );

    const token = erc721EligibilityContract.ERC721_TOKEN_ADDRESS();
    const minBalance = erc721EligibilityContract.MIN_BALANCE();
    const hatId = erc721EligibilityContract.hatId();

    erc721Eligibility.token = token.toHexString();
    erc721Eligibility.minBalance = minBalance;
    erc721Eligibility.hatId = hatIdToHex(hatId);
    erc721Eligibility.version = "0.1.0";
    erc721Eligibility.save();
  } else if (implemenatationAddress == ERC1155_ELIGIBILITY_IMPLEMENTATION) {
    Erc1155EligibilityTemplate.create(event.params.instance);
    const erc1155Eligibility = new Erc1155EligibilityObject(
      event.params.instance.toHexString()
    );
    const erc1155EligibilityContract = Erc1155EligibilityContract.bind(
      event.params.instance
    );

    const token = erc1155EligibilityContract.TOKEN_ADDRESS();
    const hatId = erc1155EligibilityContract.hatId();
    const numTokens = erc1155EligibilityContract.ARRAY_LENGTH();
    const tokenIds = erc1155EligibilityContract.TOKEN_IDS();
    const minBalances = erc1155EligibilityContract.MIN_BALANCES();

    erc1155Eligibility.contractAddress = token.toHexString();
    erc1155Eligibility.hatId = hatIdToHex(hatId);
    erc1155Eligibility.tokens = tokenIds.slice(0, numTokens.toI32());
    erc1155Eligibility.minBalances = minBalances.slice(0, numTokens.toI32());
    erc1155Eligibility.version = "0.1.0";
    erc1155Eligibility.save();
  } else if (implemenatationAddress == HAT_WEARING_ELIGIBILITY_IMPLEMENTATION) {
    HatWearingEligibilityTemplate.create(event.params.instance);
    const hatWearingEligibility = new HatWearingEligibilityObject(
      event.params.instance.toHexString()
    );
    const hatWearingEligibilityContract = HatWearingEligibilityContract.bind(
      event.params.instance
    );

    const hatId = hatWearingEligibilityContract.hatId();
    const criterionHat = hatWearingEligibilityContract.CRITERION_HAT();

    hatWearingEligibility.hatId = hatIdToHex(hatId);
    hatWearingEligibility.criterionHat = hatIdToHex(criterionHat);
    hatWearingEligibility.version = "0.1.0";
    hatWearingEligibility.save();
  } else if (
    implemenatationAddress == GITCOIN_PASSPORT_ELIGIBILITY_IMPLEMENTATION
  ) {
    GitcoinPassportEligibilityTemplate.create(event.params.instance);
    const gitcoinPassportEligibility = new GitcoinPassportEligibilityObject(
      event.params.instance.toHexString()
    );
    const gitcoinPassportEligibilityContract =
      GitcoinPassportEligibilityContract.bind(event.params.instance);

    const hatId = gitcoinPassportEligibilityContract.hatId();
    const decoder = gitcoinPassportEligibilityContract.gitcoinPassportDecoder();
    const scoreCriterion = gitcoinPassportEligibilityContract.scoreCriterion();

    gitcoinPassportEligibility.hatId = hatIdToHex(hatId);
    gitcoinPassportEligibility.decoder = decoder.toHexString();
    gitcoinPassportEligibility.scoreCriterion = scoreCriterion;
    gitcoinPassportEligibility.version = "0.1.0";
    gitcoinPassportEligibility.save();
  } else if (implemenatationAddress == COLINKS_ELIGIBILITY_IMPLEMENTATION) {
    CoLinksEligibilityTemplate.create(event.params.instance);
    const coLinksEligibility = new CoLinksEligibilityObject(
      event.params.instance.toHexString()
    );
    const coLinksEligibilityContract = CoLinksEligibilityContract.bind(
      event.params.instance
    );

    const hatId = coLinksEligibilityContract.hatId();
    const threshold = coLinksEligibilityContract.THRESHOLD();

    coLinksEligibility.hatId = hatIdToHex(hatId);
    coLinksEligibility.threshold = threshold;
    coLinksEligibility.version = "0.1.0";
    coLinksEligibility.save();
  } else if (
    implemenatationAddress == HATS_ELIGIBILITIES_CHAIN_V_0_1_0_IMPLEMENTATION
  ) {
    const hatsEligibilitiesChain = new HatsEligibilitiesChainObject(
      event.params.instance.toHexString()
    );

    const hatsEligibilitiesContract =
      HatsEligibilitiesChainV_0_1_0Contract.bind(event.params.instance);

    const hatId = hatsEligibilitiesContract.hatId();
    const numRulesets = hatsEligibilitiesContract.NUM_CONJUNCTION_CLAUSES();
    const rulesetsLengths =
      hatsEligibilitiesContract.CONJUNCTION_CLAUSE_LENGTHS();
    const modules = hatsEligibilitiesContract.MODULES();

    const moduleAddresses = modules.map<string>((module) =>
      module.toHexString()
    );

    let modulesIndex = 0;
    for (let i = 0; i < numRulesets.toI32(); i++) {
      const ruleset = new EligibilitiesRulesetObject(
        hatsEligibilitiesChain.id + "-" + i.toString()
      );
      ruleset.eligibilitiesChain = hatsEligibilitiesChain.id;

      const rulesetLength = rulesetsLengths[i].toI32();
      const rulesetModules = moduleAddresses.slice(
        modulesIndex,
        modulesIndex + rulesetLength
      );
      ruleset.modules = rulesetModules;
      ruleset.save();
      modulesIndex += rulesetLength;
    }

    hatsEligibilitiesChain.hatId = hatIdToHex(hatId);
    hatsEligibilitiesChain.version = "0.1.0";
    hatsEligibilitiesChain.moduleAddresses = moduleAddresses;
    hatsEligibilitiesChain.numRulesets = numRulesets;
    hatsEligibilitiesChain.save();
  } else if (
    implemenatationAddress == HATS_ELIGIBILITIES_CHAIN_V_0_2_0_IMPLEMENTATION
  ) {
    const hatsEligibilitiesChain = new HatsEligibilitiesChainObject(
      event.params.instance.toHexString()
    );

    const hatsEligibilitiesContract =
      HatsEligibilitiesChainV_0_2_0Contract.bind(event.params.instance);

    const hatId = hatsEligibilitiesContract.hatId();
    const numRulesets = hatsEligibilitiesContract.NUM_CONJUNCTION_CLAUSES();
    const rulesetsLengths =
      hatsEligibilitiesContract.CONJUNCTION_CLAUSE_LENGTHS();
    const modules = hatsEligibilitiesContract.MODULES();

    const moduleAddresses = modules.map<string>((module) =>
      module.toHexString()
    );

    let modulesIndex = 0;
    for (let i = 0; i < numRulesets.toI32(); i++) {
      const ruleset = new EligibilitiesRulesetObject(
        hatsEligibilitiesChain.id + "-" + i.toString()
      );
      ruleset.eligibilitiesChain = hatsEligibilitiesChain.id;

      const rulesetLength = rulesetsLengths[i].toI32();
      const rulesetModules = moduleAddresses.slice(
        modulesIndex,
        modulesIndex + rulesetLength
      );
      ruleset.modules = rulesetModules;
      ruleset.save();
      modulesIndex += rulesetLength;
    }

    hatsEligibilitiesChain.hatId = hatIdToHex(hatId);
    hatsEligibilitiesChain.version = "0.2.0";
    hatsEligibilitiesChain.moduleAddresses = moduleAddresses;
    hatsEligibilitiesChain.numRulesets = numRulesets;
    hatsEligibilitiesChain.save();
  } else if (
    implemenatationAddress == HAT_CONTROLLED_MODULE_V_0_1_0_IMPLEMENTATION
  ) {
    HatControlledModuleV_0_1_0Template.create(event.params.instance);
    const hatControlledModule = new HatControlledModuleObject(
      event.params.instance.toHexString()
    );
    const hatControlledModuleContract = HatControlledModuleV_0_1_0Contract.bind(
      event.params.instance
    );

    const hatId = hatControlledModuleContract.hatId();
    const controllerHatId = hatControlledModuleContract.CONTROLLER_HAT();

    hatControlledModule.hatId = hatIdToHex(hatId);
    hatControlledModule.controllerHatId = hatIdToHex(controllerHatId);
    hatControlledModule.version = "0.1.0";
    hatControlledModule.save();
  } else if (
    implemenatationAddress == PUBLIC_LOCK_V14_ELIGIBILITY_V_0_1_2_IMPLEMENTATION
  ) {
    PublicLockV14EligibilityV_0_1_2Template.create(event.params.instance);
    const publicLockModule = new PublicLockV14EligibilityObject(
      event.params.instance.toHexString()
    );
    const publicLockModuleContract =
      PublicLockV14EligibilityV_0_1_2Contract.bind(event.params.instance);

    const hatId = publicLockModuleContract.hatId();
    const lock = publicLockModuleContract.lock();
    const referrer = publicLockModuleContract.REFERRER();
    const referrerFeePercentage =
      publicLockModuleContract.referrerFeePercentage();

    publicLockModule.hatId = hatIdToHex(hatId);
    publicLockModule.lock = lock.toHexString();
    publicLockModule.referrer = referrer.toHexString();
    publicLockModule.referrerFeePercentage = referrerFeePercentage;
    publicLockModule.version = "0.1.2";
    publicLockModule.save();
  }
}

function getAllAdmins(hatId: string): string[] {
  let admins: string[] = [];

  let reachedTippyTop = false;
  let getAdminsOfHat = hatId;
  while (!reachedTippyTop) {
    const localTopHat = getAdminsOfHat.substring(0, 10).padEnd(66, "0");
    const isLocalTopHat = getAdminsOfHat == localTopHat ? true : false;
    const linkedAdminHat = getLinkedTreeAdmin(localTopHat);

    if (!isLocalTopHat) {
      const localAdmins = getLocalHatAdmins(getAdminsOfHat);
      admins = admins.concat(localAdmins);
    }

    getAdminsOfHat = linkedAdminHat;

    if (
      linkedAdminHat ==
      "0x0000000000000000000000000000000000000000000000000000000000000000"
    ) {
      reachedTippyTop = true;
    }
  }

  return admins;
}

function getLocalHatAdmins(hatId: string): string[] {
  const admins: string[] = [];
  for (let i = 10; i < hatId.length; i += 4) {
    let currentHatId = hatId.substring(0, i).padEnd(66, "0");
    if (currentHatId == hatId) {
      break;
    }
    admins.push(currentHatId);

    // check if HatAuthority entity exists, create if not
    let hatAuthority = HatAuthority.load(currentHatId);
    if (hatAuthority == null) {
      hatAuthority = new HatAuthority(currentHatId);
      hatAuthority.save();
    }
  }

  return admins;
}
