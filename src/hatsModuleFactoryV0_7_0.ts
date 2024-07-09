import { BigInt, ethereum, Bytes, log } from "@graphprotocol/graph-ts";
import { HatsModuleFactory_ModuleDeployed } from "../generated/HatsModuleFactoryV0_7_0/HatsModuleFactoryV0_7_0";
import {
  JokeRaceEligibility as JokeRaceEligibilityObject,
  AllowListEligibility as AllowListEligibilityObject,
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
} from "../generated/schema";
import {
  JokeRaceEligibility as JokeRaceEligibilityTemplate,
  JokeRaceEligibilityDeprecated as JokeRaceEligibilityDeprecatedTemplate,
  AllowListEligibility as AllowListEligibilityTemplate,
  HatsElectionEligibility as HatsElectionEligibilityTemplate,
  PassthroughModule as PassthroughModuleTemplate,
  StakingEligibility as StakingEligibilityTemplate,
  SeasonToggle as SeasonToggleTemplate,
  CharacterSheetsLevelEligibility as CharacterSheetsLevelEligibilityTemplate,
  AgreementEligibility as AgreementEligibilityTemplate,
  HatsStakingShaman as HatsStakingShamanTemplate,
  HatsFarcasterDelegator as HatsFarcasterDelegatorTemplate,
} from "../generated/templates";
import {
  JOKERACE_ELIGIBILITY_IMPLEMENTATION,
  JOKERACE_ELIGIBILITY_IMPLEMENTATION_DEPRECATED,
  ALLOWLIST_ELIGIBILITY_IMPLEMENTATION,
  HATS_ELECTION_ELIGIBILITY_IMPLEMENTATION_DEPRECATED,
  HATS_ELECTION_ELIGIBILITY_IMPLEMENTATION,
  PASSTHROUGH_MODULE_IMPLEMENTATION,
  STAKING_ELIGIBILITY_IMPLEMENTATION,
  SEASON_TOGGLE_IMPLEMENTATION,
  CHARACTER_SHEETS_LEVEL_ELIGIBILITY_IMPLEMENTATION,
  AGREEMENT_ELIGIBILITY_IMPLEMENTATION,
  HATS_STAKING_SHAMAN_IMPLEMENTATION,
  HATS_FARCASTER_DELEGATOR_IMPLEMENTATION,
} from "./constants";
import { HatsStakingShaman as HatsStakingShamanContract } from "../generated/templates/HatsStakingShaman/HatsStakingShaman";
import { HatsFarcasterDelegator as HatsFarcasterDelegatorContract } from "../generated/templates/HatsFarcasterDelegator/HatsFarcasterDelegator";
import { hatIdToHex, getLinkedTreeAdmin } from "./utils";

export function handleModuleDeployed(
  event: HatsModuleFactory_ModuleDeployed
): void {
  const implemenatationAddress = event.params.implementation.toHexString();

  if (implemenatationAddress == JOKERACE_ELIGIBILITY_IMPLEMENTATION) {
    JokeRaceEligibilityTemplate.create(event.params.instance);
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
    jokeRaceEligibility.currentContest = contestAddress;
    jokeRaceEligibility.currentTermEnd = termEnd;
    jokeRaceEligibility.currentTopK = topK;
    jokeRaceEligibility.adminHat = adminHat;
    jokeRaceEligibility.save();
  } else if (
    implemenatationAddress == JOKERACE_ELIGIBILITY_IMPLEMENTATION_DEPRECATED
  ) {
    JokeRaceEligibilityDeprecatedTemplate.create(event.params.instance);
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
    jokeRaceEligibility.currentContest = contestAddress;
    jokeRaceEligibility.currentTermEnd = termEnd;
    jokeRaceEligibility.currentTopK = topK;
    jokeRaceEligibility.adminHat = adminHat;
    jokeRaceEligibility.save();
  } else if (implemenatationAddress == ALLOWLIST_ELIGIBILITY_IMPLEMENTATION) {
    AllowListEligibilityTemplate.create(event.params.instance);
    const allowListEligibility = new AllowListEligibilityObject(
      event.params.instance.toHexString()
    );

    let decodedImmutableArgs = (
      ethereum.decode(
        "(uint256, uint256)",
        event.params.otherImmutableArgs
      ) as ethereum.Value
    ).toTuple();

    const ownerHat = decodedImmutableArgs[0].toBigInt();
    // check if hat exists, create new object if not
    let ownerHatAuthority = HatAuthority.load(hatIdToHex(ownerHat));
    if (ownerHatAuthority == null) {
      ownerHatAuthority = new HatAuthority(hatIdToHex(ownerHat));
    }

    const arbitratorHat = decodedImmutableArgs[1].toBigInt();
    // check if hat exists, create new object if not
    let arbitratorHatAuthority = HatAuthority.load(hatIdToHex(arbitratorHat));
    if (arbitratorHatAuthority == null) {
      arbitratorHatAuthority = new HatAuthority(hatIdToHex(arbitratorHat));
    }

    allowListEligibility.hatId = hatIdToHex(event.params.hatId);
    allowListEligibility.ownerHat = hatIdToHex(ownerHat);
    allowListEligibility.arbitratorHat = hatIdToHex(arbitratorHat);
    allowListEligibility.save();
    ownerHatAuthority.save();
    arbitratorHatAuthority.save();
  } else if (
    implemenatationAddress ==
    HATS_ELECTION_ELIGIBILITY_IMPLEMENTATION_DEPRECATED
  ) {
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
    hatsElectionEligibility.save();
    ballotBoxHatAuthority.save();
  } else if (
    implemenatationAddress == HATS_ELECTION_ELIGIBILITY_IMPLEMENTATION
  ) {
    HatsElectionEligibilityTemplate.create(event.params.instance);
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
    passthroughModule.save();
    passthroughHatAuthority.save();
  } else if (implemenatationAddress == STAKING_ELIGIBILITY_IMPLEMENTATION) {
    StakingEligibilityTemplate.create(event.params.instance);
    const stakingEligibility = new StakingEligibilityObject(
      event.params.instance.toHexString()
    );

    let decodedInitArgs = (
      ethereum.decode(
        "(uint248,uint256,uint256,uint256)",
        event.params.initData
      ) as ethereum.Value
    ).toTuple();

    const judgeHat = decodedInitArgs[1].toBigInt();
    // check if hat exists, create new object if not
    let judgeHatAuthority = HatAuthority.load(hatIdToHex(judgeHat));
    if (judgeHatAuthority == null) {
      judgeHatAuthority = new HatAuthority(hatIdToHex(judgeHat));
    }

    const recipientHat = decodedInitArgs[2].toBigInt();
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
    characterSheetsLevelEligibility.save();
  } else if (implemenatationAddress == AGREEMENT_ELIGIBILITY_IMPLEMENTATION) {
    AgreementEligibilityTemplate.create(event.params.instance);
    const agreementEligibility = new AgreementEligibilityObject(
      event.params.instance.toHexString()
    );

    // prepend data location offset to init args
    const preparedInitArgs = Bytes.fromHexString(
      "0x0000000000000000000000000000000000000000000000000000000000000020".concat(
        event.params.initData.toHexString().slice(2)
      )
    );

    // decode the init args and create a new Agreement object
    let decodedInitArgs = (
      ethereum.decode("(string)", preparedInitArgs) as ethereum.Value
    ).toTuple();
    const agreement = decodedInitArgs[0].toString();

    const agreementObject = new Agreement("1" + "-" + agreementEligibility.id);
    agreementObject.agreementEligibility = agreementEligibility.id;
    agreementObject.agreement = agreement;
    agreementObject.signers = [];
    agreementObject.graceEndTime = BigInt.fromI32(0);

    // decode the immutable args
    let decodedImmutableArgs = (
      ethereum.decode(
        "(uint256, uint256)",
        event.params.otherImmutableArgs
      ) as ethereum.Value
    ).toTuple();

    const ownerHat = decodedImmutableArgs[0].toBigInt();
    // check if hat exists, create new object if not
    let ownerHatAuthority = HatAuthority.load(hatIdToHex(ownerHat));
    if (ownerHatAuthority == null) {
      ownerHatAuthority = new HatAuthority(hatIdToHex(ownerHat));
    }

    const arbitratorHat = decodedImmutableArgs[1].toBigInt();
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
