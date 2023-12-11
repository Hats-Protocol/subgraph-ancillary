import { NewTerm } from "../generated/templates/JokeRaceEligibilityDeprecated/JokeRaceEligibilityDeprecated";
import { JokeRaceEligibility } from "../generated/schema";

export function handleNewTerm(event: NewTerm): void {
  const jokeRaceEligibility = JokeRaceEligibility.load(
    event.address.toHexString()
  ) as JokeRaceEligibility;

  jokeRaceEligibility.currentContest = event.params.NewContest.toHexString();
  jokeRaceEligibility.currentTermEnd = event.params.newTermEnd;
  jokeRaceEligibility.currentTopK = event.params.newTopK;
  jokeRaceEligibility.save();
}
