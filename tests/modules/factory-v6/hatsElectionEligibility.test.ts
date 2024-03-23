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
  mockHatsModuleFactory_ModuleDeployedEventV0_6_0,
  mockElectionCompletedEvent,
  mockElectionOpenedEvent,
  mockNewTermStartedEvent,
  mockRecalledEvent,
} from "../../utils";
import { handleModuleDeployed } from "../../../src/hatsModuleFactoryV0_6_0";
import { HATS_ELECTION_ELIGIBILITY_IMPLEMENTATION } from "../../../src/constants";
import { changeEndianness } from "../../../src/utils";
import {
  handleElectionCompleted,
  handleElectionOpened,
  handleNewTermStarted,
  handleRecalled,
} from "../../../src/modules/hatsElectionEligibility";

const ballotBoxHatId =
  "0x0000000100000000000000000000000000000000000000000000000000000000";
const adminHatId =
  "0x0000000100010000000000000000000000000000000000000000000000000000";
const hatId =
  "26960358049567071831564234593151059434471056522609336320533481914368";
const hatIdAdminsFallback =
  "26960769438260605603848134863118277618512635038780455604427388092416";

const account1 = "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const account2 = "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb";
const account3 = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";

const hatsElectionInstance = "0xcccccccccccccccccccccccccccccccccccccccc";
const hatElectionsWithAdminsFallbackInstance =
  "0xdddddddddddddddddddddddddddddddddddddddd";

const timestamp1 = 1000000;
const timestamp2 = 1000200;

describe("Hats Election Eligibility Tests", () => {
  afterAll(() => {
    clearStore();
  });

  describe("Hats election eligibility is created", () => {
    beforeEach(() => {
      let mutableArgs: Array<ethereum.Value> = [
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(timestamp1)),
      ];

      let encodedInitArgs = ethereum.encode(
        ethereum.Value.fromFixedSizedArray(mutableArgs)
      )!;

      const moduleDeployedEvent =
        mockHatsModuleFactory_ModuleDeployedEventV0_6_0(
          Address.fromString(HATS_ELECTION_ELIGIBILITY_IMPLEMENTATION),
          Address.fromString(hatsElectionInstance),
          BigInt.fromString(hatId),
          Bytes.fromHexString(
            "0x00000001000000000000000000000000000000000000000000000000000000000000000100010000000000000000000000000000000000000000000000000000"
          ),
          encodedInitArgs
        );

      handleModuleDeployed(moduleDeployedEvent);

      const electionOpenedEvent = mockElectionOpenedEvent(
        Address.fromString(hatsElectionInstance),
        BigInt.fromI32(timestamp1)
      );

      handleElectionOpened(electionOpenedEvent);
    });

    test("Test hats election eligibility created", () => {
      assert.entityCount("HatsElectionEligibility", 1);
      assert.fieldEquals(
        "HatsElectionEligibility",
        hatsElectionInstance,
        "ballotBoxHat",
        ballotBoxHatId
      );
      assert.fieldEquals(
        "HatsElectionEligibility",
        hatsElectionInstance,
        "adminHat",
        "[0x0000000100010000000000000000000000000000000000000000000000000000]"
      );
      assert.fieldEquals(
        "HatsElectionEligibility",
        hatsElectionInstance,
        "hatId",
        "0x0000000100010001000000000000000000000000000000000000000000000000"
      );
      assert.fieldEquals(
        "HatsElectionEligibility",
        hatsElectionInstance,
        "currentTerm",
        hatsElectionInstance + "_" + timestamp1.toString()
      );
    });

    test("Test term", () => {
      assert.entityCount("ElectionTerm", 1);
      assert.fieldEquals(
        "ElectionTerm",
        hatsElectionInstance + "_" + timestamp1.toString(),
        "termEnd",
        timestamp1.toString()
      );
      assert.fieldEquals(
        "ElectionTerm",
        hatsElectionInstance + "_" + timestamp1.toString(),
        "electionCompletedAt",
        "null"
      );
      assert.fieldEquals(
        "ElectionTerm",
        hatsElectionInstance + "_" + timestamp1.toString(),
        "termStartedAt",
        "null"
      );
      assert.fieldEquals(
        "ElectionTerm",
        hatsElectionInstance + "_" + timestamp1.toString(),
        "electedAccounts",
        "null"
      );
    });

    describe("And the election is completed", () => {
      beforeEach(() => {
        const electionCompletedEvent = mockElectionCompletedEvent(
          Address.fromString(hatsElectionInstance),
          BigInt.fromI32(timestamp1),
          [Address.fromString(account1), Address.fromString(account2)],
          BigInt.fromI32(timestamp1 + 100)
        );

        handleElectionCompleted(electionCompletedEvent);
      });

      test("Test election completed", () => {
        assert.fieldEquals(
          "HatsElectionEligibility",
          hatsElectionInstance,
          "currentTerm",
          hatsElectionInstance + "_" + timestamp1.toString()
        );
        assert.fieldEquals(
          "ElectionTerm",
          hatsElectionInstance + "_" + timestamp1.toString(),
          "termEnd",
          timestamp1.toString()
        );
        assert.fieldEquals(
          "ElectionTerm",
          hatsElectionInstance + "_" + timestamp1.toString(),
          "termStartedAt",
          (timestamp1 + 100).toString()
        );
        assert.fieldEquals(
          "ElectionTerm",
          hatsElectionInstance + "_" + timestamp1.toString(),
          "electionCompletedAt",
          (timestamp1 + 100).toString()
        );
        assert.fieldEquals(
          "ElectionTerm",
          hatsElectionInstance + "_" + timestamp1.toString(),
          "electedAccounts",
          `[${account1}, ${account2}]`
        );
        assert.fieldEquals(
          "ElectionTerm",
          hatsElectionInstance + "_" + timestamp1.toString(),
          "hatsElectionEligibility",
          hatsElectionInstance
        );
      });

      describe("And an elected account is recalled", () => {
        beforeEach(() => {
          const recalledEvent = mockRecalledEvent(
            Address.fromString(hatsElectionInstance),
            BigInt.fromI32(timestamp1),
            [Address.fromString(account2)]
          );

          handleRecalled(recalledEvent);
        });

        test("Test account was recalled", () => {
          assert.fieldEquals(
            "HatsElectionEligibility",
            hatsElectionInstance,
            "currentTerm",
            hatsElectionInstance + "_" + timestamp1.toString()
          );
          assert.fieldEquals(
            "ElectionTerm",
            hatsElectionInstance + "_" + timestamp1.toString(),
            "termEnd",
            timestamp1.toString()
          );
          assert.fieldEquals(
            "ElectionTerm",
            hatsElectionInstance + "_" + timestamp1.toString(),
            "termStartedAt",
            (timestamp1 + 100).toString()
          );
          assert.fieldEquals(
            "ElectionTerm",
            hatsElectionInstance + "_" + timestamp1.toString(),
            "electionCompletedAt",
            (timestamp1 + 100).toString()
          );
          assert.fieldEquals(
            "ElectionTerm",
            hatsElectionInstance + "_" + timestamp1.toString(),
            "electedAccounts",
            `[${account1}]`
          );
          assert.fieldEquals(
            "ElectionTerm",
            hatsElectionInstance + "_" + timestamp1.toString(),
            "hatsElectionEligibility",
            hatsElectionInstance
          );
        });
      });

      describe("And next term is created", () => {
        beforeEach(() => {
          const electionOpenedEvent = mockElectionOpenedEvent(
            Address.fromString(hatsElectionInstance),
            BigInt.fromI32(timestamp2)
          );

          handleElectionOpened(electionOpenedEvent);
        });

        test("Test next term", () => {
          assert.fieldEquals(
            "HatsElectionEligibility",
            hatsElectionInstance,
            "currentTerm",
            hatsElectionInstance + "_" + timestamp1.toString()
          );
          assert.fieldEquals(
            "ElectionTerm",
            hatsElectionInstance + "_" + timestamp2.toString(),
            "termEnd",
            timestamp2.toString()
          );
          assert.fieldEquals(
            "ElectionTerm",
            hatsElectionInstance + "_" + timestamp2.toString(),
            "termStartedAt",
            "null"
          );
          assert.fieldEquals(
            "ElectionTerm",
            hatsElectionInstance + "_" + timestamp2.toString(),
            "electionCompletedAt",
            "null"
          );
          assert.fieldEquals(
            "ElectionTerm",
            hatsElectionInstance + "_" + timestamp2.toString(),
            "electedAccounts",
            "null"
          );
          assert.fieldEquals(
            "ElectionTerm",
            hatsElectionInstance + "_" + timestamp2.toString(),
            "hatsElectionEligibility",
            hatsElectionInstance
          );
        });

        describe("And the next term election is completed", () => {
          beforeEach(() => {
            const electionCompletedEvent = mockElectionCompletedEvent(
              Address.fromString(hatsElectionInstance),
              BigInt.fromI32(timestamp2),
              [Address.fromString(account3)],
              BigInt.fromI32(timestamp2 + 100)
            );

            handleElectionCompleted(electionCompletedEvent);
          });

          test("Test next term results", () => {
            assert.fieldEquals(
              "HatsElectionEligibility",
              hatsElectionInstance,
              "currentTerm",
              hatsElectionInstance + "_" + timestamp1.toString()
            );
            assert.fieldEquals(
              "ElectionTerm",
              hatsElectionInstance + "_" + timestamp2.toString(),
              "termEnd",
              timestamp2.toString()
            );
            assert.fieldEquals(
              "ElectionTerm",
              hatsElectionInstance + "_" + timestamp2.toString(),
              "termStartedAt",
              "null"
            );
            assert.fieldEquals(
              "ElectionTerm",
              hatsElectionInstance + "_" + timestamp2.toString(),
              "electionCompletedAt",
              (timestamp2 + 100).toString()
            );
            assert.fieldEquals(
              "ElectionTerm",
              hatsElectionInstance + "_" + timestamp2.toString(),
              "electedAccounts",
              `[${account3}]`
            );
            assert.fieldEquals(
              "ElectionTerm",
              hatsElectionInstance + "_" + timestamp2.toString(),
              "hatsElectionEligibility",
              hatsElectionInstance
            );
          });

          describe("And the next term starts", () => {
            beforeEach(() => {
              const newTermStartedEvent = mockNewTermStartedEvent(
                Address.fromString(hatsElectionInstance),
                BigInt.fromI32(timestamp2),
                BigInt.fromI32(timestamp2 + 200)
              );

              handleNewTermStarted(newTermStartedEvent);
            });

            test("Test new term started", () => {
              assert.fieldEquals(
                "HatsElectionEligibility",
                hatsElectionInstance,
                "currentTerm",
                hatsElectionInstance + "_" + timestamp2.toString()
              );
              assert.fieldEquals(
                "ElectionTerm",
                hatsElectionInstance + "_" + timestamp2.toString(),
                "termEnd",
                timestamp2.toString()
              );
              assert.fieldEquals(
                "ElectionTerm",
                hatsElectionInstance + "_" + timestamp2.toString(),
                "termStartedAt",
                (timestamp2 + 200).toString()
              );
              assert.fieldEquals(
                "ElectionTerm",
                hatsElectionInstance + "_" + timestamp2.toString(),
                "electionCompletedAt",
                (timestamp2 + 100).toString()
              );
              assert.fieldEquals(
                "ElectionTerm",
                hatsElectionInstance + "_" + timestamp2.toString(),
                "electedAccounts",
                `[${account3}]`
              );
              assert.fieldEquals(
                "ElectionTerm",
                hatsElectionInstance + "_" + timestamp2.toString(),
                "hatsElectionEligibility",
                hatsElectionInstance
              );
            });
          });
        });
      });
    });
  });

  describe("Hats election eligibility with admin fallback is created", () => {
    beforeEach(() => {
      let mutableArgs: Array<ethereum.Value> = [
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(timestamp1)),
      ];

      let encodedInitArgs = ethereum.encode(
        ethereum.Value.fromFixedSizedArray(mutableArgs)
      )!;

      const moduleDeployedEvent =
        mockHatsModuleFactory_ModuleDeployedEventV0_6_0(
          Address.fromString(HATS_ELECTION_ELIGIBILITY_IMPLEMENTATION),
          Address.fromString(hatElectionsWithAdminsFallbackInstance),
          BigInt.fromString(hatIdAdminsFallback),
          Bytes.fromHexString(
            "0x00000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
          ),
          encodedInitArgs
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

    test("Test hats election eligibility created", () => {
      assert.entityCount("HatsElectionEligibility", 2);
      assert.fieldEquals(
        "HatsElectionEligibility",
        hatElectionsWithAdminsFallbackInstance,
        "ballotBoxHat",
        ballotBoxHatId
      );
      assert.fieldEquals(
        "HatsElectionEligibility",
        hatElectionsWithAdminsFallbackInstance,
        "adminHat",
        "[0x0000000100000000000000000000000000000000000000000000000000000000, 0x0000000100020000000000000000000000000000000000000000000000000000]"
      );
      assert.fieldEquals(
        "HatsElectionEligibility",
        hatElectionsWithAdminsFallbackInstance,
        "hatId",
        "0x0000000100020003000000000000000000000000000000000000000000000000"
      );
    });
  });
});
