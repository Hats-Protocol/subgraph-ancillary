import {
  assert,
  describe,
  test,
  clearStore,
  afterAll,
  beforeEach,
  beforeAll,
  createMockedFunction,
} from "matchstick-as/assembly/index";
import {
  Address,
  BigInt,
  ethereum,
  Bytes,
  log,
  ByteArray,
} from "@graphprotocol/graph-ts";
import { mockHatsModuleFactory_ModuleDeployedEvent } from "./utils";
import { handleModuleDeployed } from "../src/hatsModuleFactory";
import { CHARACTER_SHEETS_LEVEL_ELIGIBILITY_IMPLEMENTATION } from "../src/constants";
import { changeEndianness } from "../src/utils";

const hatId =
  "26960358049567071831564234593151059434471056522609336320533481914368";

const account1 = "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const account2 = "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb";

const characterSheetsLevelEligibilityInstance =
  "0xcccccccccccccccccccccccccccccccccccccccc";

describe("Character Sheets Level Eligibility Tests", () => {
  afterAll(() => {
    clearStore();
  });

  describe("Character sheets level eligibility is created", () => {
    beforeEach(() => {
      let mutableArgs: Array<ethereum.Value> = [
        ethereum.Value.fromUnsignedBigIntArray([BigInt.fromI32(1)]),
        ethereum.Value.fromUnsignedBigIntArray([BigInt.fromI32(2)]),
      ];

      let encodedInitArgs = ethereum.encode(
        ethereum.Value.fromFixedSizedArray(mutableArgs)
      )!;

      const moduleDeployedEvent = mockHatsModuleFactory_ModuleDeployedEvent(
        Address.fromString(CHARACTER_SHEETS_LEVEL_ELIGIBILITY_IMPLEMENTATION),
        Address.fromString(characterSheetsLevelEligibilityInstance),
        BigInt.fromString(hatId),
        Bytes.fromHexString(
          "0x083c4e685f64411747548a5ea090630ab0bf17bf7e029eFCbD96804B7284a9eEb74f2F5aB5F79a7e"
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

    test("Test character sheets level created", () => {
      assert.entityCount("CharacterSheetsLevelEligibility", 1);
      assert.fieldEquals(
        "CharacterSheetsLevelEligibility",
        characterSheetsLevelEligibilityInstance,
        "hatId",
        "0x0000000100010001000000000000000000000000000000000000000000000000"
      );
      assert.fieldEquals(
        "CharacterSheetsLevelEligibility",
        characterSheetsLevelEligibilityInstance,
        "hatAdmins",
        "[0x0000000100000000000000000000000000000000000000000000000000000000, 0x0000000100010000000000000000000000000000000000000000000000000000]"
      );
    });
  });
});
