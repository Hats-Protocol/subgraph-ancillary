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
import { mockHatsModuleFactory_ModuleDeployedEventV0_7_0 } from "../../utils";
import { handleModuleDeployed } from "../../../src/hatsModuleFactoryV0_7_0";
import { HATS_ELECTION_ELIGIBILITY_V_0_1_0_IMPLEMENTATION } from "../../../src/constants";
import { changeEndianness } from "../../../src/utils";

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

const hatsElectionInstance = "0xcccccccccccccccccccccccccccccccccccccccc";
const hatElectionsWithAdminsFallbackInstance =
  "0xdddddddddddddddddddddddddddddddddddddddd";

describe("Hats Election Eligibility Tests", () => {
  afterAll(() => {
    clearStore();
  });

  describe("Hats election eligibility is created", () => {
    beforeEach(() => {
      let mutableArgs: Array<ethereum.Value> = [
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(10191695)),
      ];

      let encodedInitArgs = ethereum.encode(
        ethereum.Value.fromFixedSizedArray(mutableArgs)
      )!;

      const moduleDeployedEvent =
        mockHatsModuleFactory_ModuleDeployedEventV0_7_0(
          Address.fromString(HATS_ELECTION_ELIGIBILITY_V_0_1_0_IMPLEMENTATION),
          Address.fromString(hatsElectionInstance),
          BigInt.fromString(hatId),
          Bytes.fromHexString(
            "0x00000001000000000000000000000000000000000000000000000000000000000000000100010000000000000000000000000000000000000000000000000000"
          ),
          encodedInitArgs,
          BigInt.fromI32(1)
        );

      handleModuleDeployed(moduleDeployedEvent);
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
    });
  });

  describe("Hats election eligibility with admin fallback is created", () => {
    beforeEach(() => {
      let mutableArgs: Array<ethereum.Value> = [
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(10191695)),
      ];

      let encodedInitArgs = ethereum.encode(
        ethereum.Value.fromFixedSizedArray(mutableArgs)
      )!;

      const moduleDeployedEvent =
        mockHatsModuleFactory_ModuleDeployedEventV0_7_0(
          Address.fromString(HATS_ELECTION_ELIGIBILITY_V_0_1_0_IMPLEMENTATION),
          Address.fromString(hatElectionsWithAdminsFallbackInstance),
          BigInt.fromString(hatIdAdminsFallback),
          Bytes.fromHexString(
            "0x00000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
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
