import {
  assert,
  describe,
  test,
  clearStore,
  afterAll,
  beforeEach,
} from "matchstick-as/assembly/index";
import { Address, BigInt, ethereum, Bytes, log } from "@graphprotocol/graph-ts";
import {
  mockHatsModuleFactory_ModuleDeployedEventV0_7_0,
  mockNewTermDeprecatedEvent,
} from "../../utils";
import { handleModuleDeployed } from "../../../src/hatsModuleFactoryV0_7_0";
import { JOKERACE_ELIGIBILITY_V_0_1_0_IMPLEMENTATION } from "../../../src/constants";
import { handleNewTerm } from "../../../src/modules/jokeRaceEligibilityV_0_1_0";

const contest1 = "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const contest2 = "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb";
const adminHatId =
  "26959946667150639794667015087019630673637144422540572481103610249216";
const hatId =
  "26959946667150639794667015087019630673637144422540572481103610249216";
const jokeRaceInstance = "0xcccccccccccccccccccccccccccccccccccccccc";
const termEnd = 1701007342;
const newTermEnd = 1701020079;

describe("Deprecated JokeRace Eligibility Tests", () => {
  afterAll(() => {
    clearStore();
  });

  describe("Deprecated JokeRace eligibility is created", () => {
    beforeEach(() => {
      let args: Array<ethereum.Value> = [
        ethereum.Value.fromAddress(Address.fromString(contest1)),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromString("1701007342")),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(3)),
      ];

      let encodedInitArgs = ethereum.encode(
        ethereum.Value.fromFixedSizedArray(args)
      )!;

      const moduleDeployedEvent =
        mockHatsModuleFactory_ModuleDeployedEventV0_7_0(
          Address.fromString(JOKERACE_ELIGIBILITY_V_0_1_0_IMPLEMENTATION),
          Address.fromString(jokeRaceInstance),
          BigInt.fromString(hatId),
          Bytes.fromHexString(
            "0x0000000100000000000000000000000000000000000000000000000000000000"
          ),
          encodedInitArgs,
          BigInt.fromI32(1)
        );

      handleModuleDeployed(moduleDeployedEvent);
    });

    test("Test deprecated jokerace eligibility created", () => {
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
        "[0x0000000100000000000000000000000000000000000000000000000000000000]"
      );
    });

    describe("And a new term is set", () => {
      beforeEach(() => {
        const newTermEvent = mockNewTermDeprecatedEvent(
          Address.fromString(jokeRaceInstance),
          Address.fromString(contest2),
          BigInt.fromI32(newTermEnd),
          BigInt.fromI32(5)
        );

        handleNewTerm(newTermEvent);
      });

      test("Test new term set", () => {
        assert.fieldEquals(
          "JokeRaceEligibility",
          jokeRaceInstance,
          "currentContest",
          contest2
        );
        assert.fieldEquals(
          "JokeRaceEligibility",
          jokeRaceInstance,
          "currentTermEnd",
          newTermEnd.toString()
        );
        assert.fieldEquals(
          "JokeRaceEligibility",
          jokeRaceInstance,
          "currentTopK",
          "5"
        );
        assert.fieldEquals(
          "JokeRaceEligibility",
          jokeRaceInstance,
          "adminHat",
          "[0x0000000100000000000000000000000000000000000000000000000000000000]"
        );
        assert.fieldEquals(
          "JokeRaceEligibility",
          jokeRaceInstance,
          "hatId",
          "0x0000000100000000000000000000000000000000000000000000000000000000"
        );
      });
    });
  });
});
