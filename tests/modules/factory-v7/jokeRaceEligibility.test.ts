import {
  assert,
  describe,
  test,
  clearStore,
  afterAll,
  beforeEach,
  createMockedFunction,
} from "matchstick-as/assembly/index";
import {
  Address,
  BigInt,
  ethereum,
  Bytes,
  ByteArray,
  log,
} from "@graphprotocol/graph-ts";
import {
  mockHatsModuleFactory_ModuleDeployedEventV0_7_0,
  mockNewTermEvent,
} from "../../utils";
import { handleModuleDeployed } from "../../../src/hatsModuleFactoryV0_7_0";
import { JOKERACE_ELIGIBILITY_IMPLEMENTATION } from "../../../src/constants";
import { handleNewTerm } from "../../../src/modules/jokeRaceEligibility";
import { changeEndianness } from "../../../src/utils";

const contest1 = "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const contest2 = "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb";
const adminHatId =
  "26959946667150639794667015087019630673637144422540572481103610249216";
const hatId =
  "26959946667150639794667015087019630673637144422540572481103610249216";
const hatIdAdminsFallback =
  "26960769438260605603848134863118277618512635038780455604427388092416";
const jokeRaceInstance = "0xcccccccccccccccccccccccccccccccccccccccc";
const jokeRaceWithAdminFallbackInstance =
  "0xdddddddddddddddddddddddddddddddddddddddd";
const termEnd = 1701007342;
const newTermEnd = 1701020079;

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

      const moduleDeployedEvent =
        mockHatsModuleFactory_ModuleDeployedEventV0_7_0(
          Address.fromString(JOKERACE_ELIGIBILITY_IMPLEMENTATION),
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
        "[0x0000000100000000000000000000000000000000000000000000000000000000]"
      );
    });

    describe("And a new term is set", () => {
      beforeEach(() => {
        const newTermEvent = mockNewTermEvent(
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

  describe("JokeRace eligibility is created with hat admins fallback", () => {
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
          Address.fromString(JOKERACE_ELIGIBILITY_IMPLEMENTATION),
          Address.fromString(jokeRaceWithAdminFallbackInstance),
          BigInt.fromString(hatIdAdminsFallback),
          Bytes.fromHexString(
            "0x0000000000000000000000000000000000000000000000000000000000000000"
          ),
          encodedInitArgs,
          BigInt.fromI32(1)
        );

      createMockedFunction(
        Address.fromString(
          "0x3bc1A0Ad72417f2d411118085256fC53CBdDd137".toLowerCase()
        ),
        "getTopHatDomain",
        "getTopHatDomain(uint256):(uint32)"
      )
        .withArgs([
          ethereum.Value.fromUnsignedBigInt(
            BigInt.fromByteArray(
              ByteArray.fromHexString(
                changeEndianness(
                  "0x0000000100000000000000000000000000000000000000000000000000000000"
                )
              )
            )
          ),
        ])
        .returns([ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(1))]);

      createMockedFunction(
        Address.fromString(
          "0x3bc1A0Ad72417f2d411118085256fC53CBdDd137".toLowerCase()
        ),
        "linkedTreeAdmins",
        "linkedTreeAdmins(uint32):(uint256)"
      )
        .withArgs([ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(1))])
        .returns([ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(0))]);

      handleModuleDeployed(moduleDeployedEvent);
    });

    test("Test jokerace eligibility created", () => {
      assert.entityCount("JokeRaceEligibility", 2);
      assert.fieldEquals(
        "JokeRaceEligibility",
        jokeRaceWithAdminFallbackInstance,
        "currentContest",
        contest1
      );
      assert.fieldEquals(
        "JokeRaceEligibility",
        jokeRaceWithAdminFallbackInstance,
        "currentTermEnd",
        termEnd.toString()
      );
      assert.fieldEquals(
        "JokeRaceEligibility",
        jokeRaceWithAdminFallbackInstance,
        "currentTopK",
        "3"
      );
      assert.fieldEquals(
        "JokeRaceEligibility",
        jokeRaceWithAdminFallbackInstance,
        "adminHat",
        "[0x0000000100000000000000000000000000000000000000000000000000000000, 0x0000000100020000000000000000000000000000000000000000000000000000]"
      );
      assert.fieldEquals(
        "JokeRaceEligibility",
        jokeRaceWithAdminFallbackInstance,
        "hatId",
        "0x0000000100020003000000000000000000000000000000000000000000000000"
      );
    });
  });
});
