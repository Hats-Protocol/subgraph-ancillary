import {
  ElectionOpened,
  ElectionCompleted,
  NewTermStarted,
  Recalled,
} from "../../generated/templates/HatsElectionEligibility/HatsElectionEligibility";
import {
  HatsElectionEligibility,
  ElectionTerm,
  Election_ElectionCompletedEvent,
  Election_ElectionOpenedEvent,
  Election_NewTermStartedEvent,
  Election_RecalledEvent,
} from "../../generated/schema";
import { BigInt } from "@graphprotocol/graph-ts";
import { createEventID } from "./utils";

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

  const electionOpenedEvent = new Election_ElectionOpenedEvent(
    createEventID(event, "ElectionOpened")
  );
  electionOpenedEvent.module = hatsElectionEligibility.id;
  electionOpenedEvent.electionEligibilityInstance = hatsElectionEligibility.id;
  electionOpenedEvent.blockNumber = event.block.number.toI32();
  electionOpenedEvent.timestamp = event.block.timestamp;
  electionOpenedEvent.transactionID = event.transaction.hash;
  electionOpenedEvent.nextTermEnd = event.params.nextTermEnd;

  electionOpenedEvent.save();
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

  const electionCompletedEvent = new Election_ElectionCompletedEvent(
    createEventID(event, "ElectionCompleted")
  );
  electionCompletedEvent.module = hatsElectionEligibility.id;
  electionCompletedEvent.electionEligibilityInstance =
    hatsElectionEligibility.id;
  electionCompletedEvent.blockNumber = event.block.number.toI32();
  electionCompletedEvent.timestamp = event.block.timestamp;
  electionCompletedEvent.transactionID = event.transaction.hash;
  electionCompletedEvent.termEnd = event.params.termEnd;
  const winners: string[] = [];
  for (let i = 0; i < event.params.winners.length; i++) {
    winners.push(event.params.winners[i].toHexString());
  }
  electionCompletedEvent.winners = winners;

  electionCompletedEvent.save();
  hatsElectionEligibility.save();
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

  const newTermStarteddEvent = new Election_NewTermStartedEvent(
    createEventID(event, "NewTermStarted")
  );
  newTermStarteddEvent.module = hatsElectionEligibility.id;
  newTermStarteddEvent.electionEligibilityInstance = hatsElectionEligibility.id;
  newTermStarteddEvent.blockNumber = event.block.number.toI32();
  newTermStarteddEvent.timestamp = event.block.timestamp;
  newTermStarteddEvent.transactionID = event.transaction.hash;
  newTermStarteddEvent.termEnd = event.params.termEnd;

  newTermStarteddEvent.save();
  hatsElectionEligibility.save();
  electionTerm.save();
}

function getElectionTermId(moduleAddress: string, termEnd: BigInt): string {
  return moduleAddress + "_" + termEnd.toString();
}
