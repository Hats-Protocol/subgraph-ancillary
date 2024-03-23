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
  log,
  ByteArray,
} from "@graphprotocol/graph-ts";
import { mockHatsModuleFactory_ModuleDeployedEventV0_6_0 } from "../../utils";
import { handleModuleDeployed } from "../../../src/hatsModuleFactoryV0_6_0";
import { SEASON_TOGGLE_IMPLEMENTATION } from "../../../src/constants";
import { changeEndianness } from "../../../src/utils";

const hatId =
  "26960358049567071831564234593151059434471056522609336320533481914368";

const account1 = "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const account2 = "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb";

const seasonToggleInstance = "0xcccccccccccccccccccccccccccccccccccccccc";

describe("Season Toggle Tests", () => {
  afterAll(() => {
    clearStore();
  });

  describe("Season toggle is created", () => {
    beforeEach(() => {
      let mutableArgs: Array<ethereum.Value> = [
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(2592000)),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(5000)),
      ];

      let encodedInitArgs = ethereum.encode(
        ethereum.Value.fromFixedSizedArray(mutableArgs)
      )!;

      const moduleDeployedEvent =
        mockHatsModuleFactory_ModuleDeployedEventV0_6_0(
          Address.fromString(SEASON_TOGGLE_IMPLEMENTATION),
          Address.fromString(seasonToggleInstance),
          BigInt.fromString(hatId),
          Bytes.fromHexString(""),
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

    test("Test season toggle created", () => {
      assert.entityCount("SeasonToggle", 1);
      assert.fieldEquals(
        "SeasonToggle",
        seasonToggleInstance,
        "hatId",
        "0x0000000100010001000000000000000000000000000000000000000000000000"
      );
      assert.fieldEquals(
        "SeasonToggle",
        seasonToggleInstance,
        "hatAdmins",
        "[0x0000000100000000000000000000000000000000000000000000000000000000, 0x0000000100010000000000000000000000000000000000000000000000000000]"
      );
    });
  });
});
