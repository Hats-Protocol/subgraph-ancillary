import {
  NextTermSet,
  TermStarted,
  JokeRaceEligibilityV_0_3_0 as JokeRaceEligibilityV_0_3_0Contract,
} from "../../generated/templates/JokeRaceEligibilityV_0_3_0/JokeRaceEligibilityV_0_3_0";
import {
  JokeRaceEligibility,
  JokeRaceEligibilityTerm,
  JokeRace_NextTermSetEvent,
  JokeRace_TermStartedEvent,
} from "../../generated/schema";
import { JokeRaceContest as JokeRaceContestContract } from "../../generated/templates/JokeRaceContest/JokeRaceContest";
import { createEventID } from "./utils";

export function handleNextTermSet(event: NextTermSet): void {
  const jokeRaceEligibility = JokeRaceEligibility.load(
    event.address.toHexString()
  ) as JokeRaceEligibility;
  const jokeRaceEligibilityContract = JokeRaceEligibilityV_0_3_0Contract.bind(
    event.address
  );

  if (jokeRaceEligibility.nextTerm == null) {
    const currentTermIndex = jokeRaceEligibilityContract
      .currentTermIndex()
      .toI32();
    const nextTerm = new JokeRaceEligibilityTerm(
      event.address.toHexString() + "-" + (currentTermIndex + 1).toString()
    );
    nextTerm.jokeRaceEligibility = jokeRaceEligibility.id;
    nextTerm.termEndsAt = event.params.newTermEnd;
    nextTerm.termStartedAt = null;
    nextTerm.topK = event.params.newTopK;
    nextTerm.transitionPeriod = event.params.newTransitionPeriod;
    nextTerm.contest = event.params.newContest.toHexString();

    jokeRaceEligibility.nextTerm = nextTerm.id;
    nextTerm.save();
    jokeRaceEligibility.save();
  } else {
    const nextTerm = JokeRaceEligibilityTerm.load(
      jokeRaceEligibility.nextTerm as string
    ) as JokeRaceEligibilityTerm;
    nextTerm.termEndsAt = event.params.newTermEnd;
    nextTerm.topK = event.params.newTopK;
    nextTerm.transitionPeriod = event.params.newTransitionPeriod;
    nextTerm.contest = event.params.newContest.toHexString();

    nextTerm.save();
    jokeRaceEligibility.save();
  }

  const nextTermSetEvent = new JokeRace_NextTermSetEvent(
    createEventID(event, "NextTermSet")
  );
  nextTermSetEvent.module = jokeRaceEligibility.id;
  nextTermSetEvent.jokeRaceEligibilityInstance = jokeRaceEligibility.id;
  nextTermSetEvent.blockNumber = event.block.number.toI32();
  nextTermSetEvent.timestamp = event.block.timestamp;
  nextTermSetEvent.transactionID = event.transaction.hash;
  nextTermSetEvent.newContest = event.params.newContest.toHexString();
  nextTermSetEvent.newTermEnd = event.params.newTermEnd;
  nextTermSetEvent.newTopK = event.params.newTopK;
  nextTermSetEvent.newTransitionPeriod = event.params.newTransitionPeriod;
  nextTermSetEvent.save();
}

export function handleTermStarted(event: TermStarted): void {
  const jokeRaceEligibility = JokeRaceEligibility.load(
    event.address.toHexString()
  ) as JokeRaceEligibility;

  if (jokeRaceEligibility.nextTerm != null) {
    const term = JokeRaceEligibilityTerm.load(
      jokeRaceEligibility.nextTerm as string
    ) as JokeRaceEligibilityTerm;
    const moduleContract = JokeRaceEligibilityV_0_3_0Contract.bind(
      event.address
    );
    const jokeRaceContestContract = JokeRaceContestContract.bind(
      event.params.contest
    );

    term.termStartedAt = event.block.timestamp;

    // get the contest winners
    const candidates = jokeRaceContestContract.getAllProposalAuthors();
    const currentTermIndex = moduleContract.currentTermIndex();
    const winners: string[] = [];
    for (let i = 0; i < candidates.length; i++) {
      const isWinner = moduleContract.eligibleWearersPerTerm(
        candidates[i],
        currentTermIndex
      );
      if (isWinner) {
        winners.push(candidates[i].toHexString());
      }
    }
    term.winners = winners;

    jokeRaceEligibility.currentTerm = term.id;
    jokeRaceEligibility.nextTerm = null;
    jokeRaceEligibility.save();
    term.save();
  }

  const TermStartedEvent = new JokeRace_TermStartedEvent(
    createEventID(event, "TermStarted")
  );
  TermStartedEvent.module = jokeRaceEligibility.id;
  TermStartedEvent.jokeRaceEligibilityInstance = jokeRaceEligibility.id;
  TermStartedEvent.blockNumber = event.block.number.toI32();
  TermStartedEvent.timestamp = event.block.timestamp;
  TermStartedEvent.transactionID = event.transaction.hash;
  TermStartedEvent.contest = event.params.contest.toHexString();
  TermStartedEvent.termEnd = event.params.termEnd;
  TermStartedEvent.topK = event.params.topK;
  TermStartedEvent.transitionPeriod = event.params.transitionPeriod;
  TermStartedEvent.save();
}
