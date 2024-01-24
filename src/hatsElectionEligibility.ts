import {
  ElectionOpened,
  ElectionCompleted,
  NewTermStarted,
} from "../generated/templates/HatsElectionEligibility/HatsElectionEligibility";
import { HatsElectionEligibility, ElectionTerm } from "../generated/schema";
import { BigInt } from "@graphprotocol/graph-ts";

export function handleElectionOpened(event: ElectionOpened): void {
  const hatsElectionEligibility = HatsElectionEligibility.load(
    event.address.toHexString()
  ) as HatsElectionEligibility;

  const term = new ElectionTerm(
    getElectionTermId(event.address.toHexString(), event.params.nextTermEnd)
  );
  term.hatsElectionEligibility = hatsElectionEligibility.id;
  term.termEnd = event.params.nextTermEnd;
  term.termStartedAt = null;
  term.electionCompletedAt = null;
  term.electedAccounts = null;

  if (hatsElectionEligibility.currentTerm == null) {
    hatsElectionEligibility.currentTerm = term.id;
  }

  hatsElectionEligibility.save();
  term.save();
}

export function handleElectionCompleted(event: ElectionCompleted): void {
  const hatsElectionEligibility = HatsElectionEligibility.load(
    event.address.toHexString()
  ) as HatsElectionEligibility;
  const electionTerm = ElectionTerm.load(
    getElectionTermId(event.address.toHexString(), event.params.termEnd)
  ) as ElectionTerm;

  electionTerm.electionCompletedAt = event.block.timestamp;
  const electedAccounts: string[] = [];
  for (let i = 0; i < event.params.winners.length; i++) {
    electedAccounts.push(event.params.winners[i].toHexString());
  }
  electionTerm.electedAccounts = electedAccounts;

  if (hatsElectionEligibility.currentTerm == electionTerm.id) {
    electionTerm.termStartedAt = event.block.timestamp;
  }

  electionTerm.save();
}

export function handleNewTermStarted(event: NewTermStarted): void {
  const hatsElectionEligibility = HatsElectionEligibility.load(
    event.address.toHexString()
  ) as HatsElectionEligibility;
  const electionTerm = ElectionTerm.load(
    getElectionTermId(event.address.toHexString(), event.params.termEnd)
  ) as ElectionTerm;

  hatsElectionEligibility.currentTerm = electionTerm.id;
  electionTerm.termStartedAt = event.block.timestamp;

  hatsElectionEligibility.save();
  electionTerm.save();
}

function getElectionTermId(moduleAddress: string, termEnd: BigInt): string {
  return moduleAddress + "_" + termEnd.toString();
}
