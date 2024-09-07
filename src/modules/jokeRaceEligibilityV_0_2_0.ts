import { NewTerm } from "../../generated/templates/JokeRaceEligibilityV_0_2_0/JokeRaceEligibilityV_0_2_0";
import { JokeRaceEligibility } from "../../generated/schema";

export function handleNewTerm(event: NewTerm): void {
  const jokeRaceEligibility = JokeRaceEligibility.load(
    event.address.toHexString()
  ) as JokeRaceEligibility;

  jokeRaceEligibility.save();
}
