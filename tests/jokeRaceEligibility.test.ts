import {
  assert,
  describe,
  test,
  clearStore,
  afterAll,
  beforeEach,
} from "matchstick-as/assembly/index";
import { Address, BigInt, ethereum, Bytes, log } from "@graphprotocol/graph-ts";
import { mockHatsModuleFactory_ModuleDeployedEvent } from "./utils";
import { hatIdToHex } from "../src/utils";
import { handleModuleDeployed } from "../src/hatsModuleFactory";
import { JOKERACE_ELIGIBILITY_IMPLEMENTATION } from "../src/constants";

const contest1 = "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const contest2 = "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb";
const adminHatId =
  "26959946667150639794667015087019630673637144422540572481103610249216";
const hatId =
  "26959946667150639794667015087019630673637144422540572481103610249216";
const jokeRaceInstance = "0xcccccccccccccccccccccccccccccccccccccccc";
const termEnd = 1701007342;

describe("JokeRace Eligibility Tests", () => {
  afterAll(() => {
    clearStore();
  });

  describe("JokeRace eligibility is created", () => {
    beforeEach(() => {
      let args: Array<ethereum.Value> = [
        ethereum.Value.fromAddress(Address.fromString(contest1)),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromString("1701007342")),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(3)),
      ];

      let encodedInitArgs = ethereum.encode(
        ethereum.Value.fromFixedSizedArray(args)
      )!;

      const moduleDeployedEvent = mockHatsModuleFactory_ModuleDeployedEvent(
        Address.fromString(JOKERACE_ELIGIBILITY_IMPLEMENTATION),
        Address.fromString(jokeRaceInstance),
        BigInt.fromString(hatId),
        Bytes.fromHexString(
          "0x0000000100000000000000000000000000000000000000000000000000000000"
        ),
        encodedInitArgs
      );

      handleModuleDeployed(moduleDeployedEvent);
    });

    test("Test jokerace eligibility created", () => {
      assert.entityCount("JokeRaceEligibility", 1);
      assert.fieldEquals(
        "JokeRaceEligibility",
        jokeRaceInstance,
        "currentContest",
        contest1
      );
      assert.fieldEquals(
        "JokeRaceEligibility",
        jokeRaceInstance,
        "currentTermEnd",
        termEnd.toString()
      );
      assert.fieldEquals(
        "JokeRaceEligibility",
        jokeRaceInstance,
        "currentTopK",
        "3"
      );
      assert.fieldEquals(
        "JokeRaceEligibility",
        jokeRaceInstance,
        "adminHat",
        "0x0000000100000000000000000000000000000000000000000000000000000000"
      );
    });
  });
});
