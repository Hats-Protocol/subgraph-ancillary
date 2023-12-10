import { ethereum, log } from "@graphprotocol/graph-ts";
import { HatsModuleFactory_ModuleDeployed } from "../generated/HatsModuleFactory/HatsModuleFactory";
import {
  JokeRaceEligibility as JokeRaceEligibilityObject,
  AllowListEligibility as AllowListEligibilityObject,
  HatsElectionEligibility as HatsElectionEligbilityObject,
} from "../generated/schema";
import {
  JokeRaceEligibility as JokeRaceEligibilityTemplate,
  AllowListEligibility as AllowListEligibilityTemplate,
  HatsElectionEligibility as HatsElectionEligibilityTemplate,
} from "../generated/templates";
import {
  JOKERACE_ELIGIBILITY_IMPLEMENTATION,
  ALLOWLIST_ELIGIBILITY_IMPLEMENTATION,
  HATS_ELECTION_ELIGIBILITY_IMPLEMENTATION,
} from "./constants";
import { hatIdToHex } from "./utils";

export function handleModuleDeployed(
  event: HatsModuleFactory_ModuleDeployed
): void {
  const implemenatationAddrss = event.params.implementation.toHexString();

  if (implemenatationAddrss == JOKERACE_ELIGIBILITY_IMPLEMENTATION) {
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

    const adminHat = decodedImmutableArgs[0].toBigInt();

    jokeRaceEligibility.currentContest = contestAddress;
    jokeRaceEligibility.currentTermEnd = termEnd;
    jokeRaceEligibility.currentTopK = topK;
    jokeRaceEligibility.adminHat = hatIdToHex(adminHat);
    jokeRaceEligibility.save();
  } else if (implemenatationAddrss == ALLOWLIST_ELIGIBILITY_IMPLEMENTATION) {
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
    const arbitratorHat = decodedImmutableArgs[1].toBigInt();

    allowListEligibility.ownerHat = hatIdToHex(ownerHat);
    allowListEligibility.arbitratorHat = hatIdToHex(arbitratorHat);
    allowListEligibility.save();
  } else if (
    implemenatationAddrss == HATS_ELECTION_ELIGIBILITY_IMPLEMENTATION
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
    const adminHat = decodedImmutableArgs[1].toBigInt();

    hatsElectionEligibility.ballotBoxHat = hatIdToHex(ballotBoxHat);
    hatsElectionEligibility.adminHat = hatIdToHex(adminHat);
    hatsElectionEligibility.save();
  }
}
