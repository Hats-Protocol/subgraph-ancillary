import {
  NextTermSet,
  TermStarted,
  JokeRaceEligibilityV_0_3_0 as JokeRaceEligibilityV_0_3_0Contract,
} from "../../generated/templates/JokeRaceEligibilityV_0_3_0/JokeRaceEligibilityV_0_3_0";
import {
  JokeRaceEligibility,
  JokeRaceEligibilityTerm,
} from "../../generated/schema";
import { JokeRaceContest as JokeRaceContestContract } from "../../generated/templates/JokeRaceContest/JokeRaceContest";

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
}
