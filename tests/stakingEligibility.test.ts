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
import {
  mockHatsModuleFactory_ModuleDeployedEvent,
  mockStakingEligibility_JudgeHatChangedEvent,
  mockStakingEligibility_RecipientHatChangedEvent,
} from "./utils";
import { handleModuleDeployed } from "../src/hatsModuleFactory";
import {
  handleJudgeHatChanged,
  handleRecipientHatChanged,
} from "../src/modules/stakingEligibility";
import { STAKING_ELIGIBILITY_IMPLEMENTATION } from "../src/constants";
import { changeEndianness } from "../src/utils";

const judgeHatId =
  "26959946667150639794667015087019630673637144422540572481103610249216";
const recipientHatId =
  "26960358043289970096177553829315270011263390106506980876069447401472";

const newJudgeHat =
  "53919893334301279589334030174039261347274288845081144962207220498432";
const newRecipientHat =
  "53920304710440609890844568916334900684900534529047553357173057650688";

const hatId =
  "26960358049567071831564234593151059434471056522609336320533481914368";

const account1 = "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const account2 = "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb";

const stakingToken = "0xcccccccccccccccccccccccccccccccccccccccc";

const stakingInstance = "0xcccccccccccccccccccccccccccccccccccccccc";

const stakingInstanceLinkedAdmins =
  "0xdddddddddddddddddddddddddddddddddddddddd";
const hatIdLinkedAdmins =
  "80880251383868351420898264767190320781745345367690481282740702412800";

describe("Staking Eligibility Tests", () => {
  afterAll(() => {
    clearStore();
  });

  describe("Staking eligibility is created", () => {
    beforeEach(() => {
      let mutableArgs: Array<ethereum.Value> = [
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(10)),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromString(judgeHatId)),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromString(recipientHatId)),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(3600)),
      ];

      let encodedInitArgs = ethereum.encode(
        ethereum.Value.fromFixedSizedArray(mutableArgs)
      )!;

      const moduleDeployedEvent = mockHatsModuleFactory_ModuleDeployedEvent(
        Address.fromString(STAKING_ELIGIBILITY_IMPLEMENTATION),
        Address.fromString(stakingInstance),
        BigInt.fromString(hatId),
        Bytes.fromHexString(stakingToken),
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

    test("Test staking eligibility created", () => {
      assert.entityCount("StakingEligibility", 1);
      assert.fieldEquals(
        "StakingEligibility",
        stakingInstance,
        "judgeHat",
        "0x0000000100000000000000000000000000000000000000000000000000000000"
      );
      assert.fieldEquals(
        "StakingEligibility",
        stakingInstance,
        "recipientHat",
        "0x0000000100010000000000000000000000000000000000000000000000000000"
      );
      assert.fieldEquals(
        "StakingEligibility",
        stakingInstance,
        "hatAdmins",
        "[0x0000000100000000000000000000000000000000000000000000000000000000, 0x0000000100010000000000000000000000000000000000000000000000000000]"
      );
    });
  });

  describe("Judge hat is changed", () => {
    beforeAll(() => {
      const judgeHatChangedEvent = mockStakingEligibility_JudgeHatChangedEvent(
        Address.fromString(stakingInstance),
        BigInt.fromString(newJudgeHat)
      );
      handleJudgeHatChanged(judgeHatChangedEvent);
    });

    test("Test judge hat changed", () => {
      assert.fieldEquals(
        "StakingEligibility",
        stakingInstance,
        "judgeHat",
        "0x0000000200000000000000000000000000000000000000000000000000000000"
      );
    });
  });

  describe("Recipient hat is changed", () => {
    beforeAll(() => {
      const recipientHatChangedEvent =
        mockStakingEligibility_RecipientHatChangedEvent(
          Address.fromString(stakingInstance),
          BigInt.fromString(newRecipientHat)
        );
      handleRecipientHatChanged(recipientHatChangedEvent);
    });

    test("Test recipient hat changed", () => {
      assert.fieldEquals(
        "StakingEligibility",
        stakingInstance,
        "recipientHat",
        "0x0000000200010000000000000000000000000000000000000000000000000000"
      );
      assert.fieldEquals(
        "StakingEligibility",
        stakingInstance,
        "hatId",
        "0x0000000100010001000000000000000000000000000000000000000000000000"
      );
    });
  });

  describe("Staking eligibility with linked admins", () => {
    beforeEach(() => {
      let mutableArgs: Array<ethereum.Value> = [
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(10)),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromString(judgeHatId)),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromString(recipientHatId)),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(3600)),
      ];

      let encodedInitArgs = ethereum.encode(
        ethereum.Value.fromFixedSizedArray(mutableArgs)
      )!;

      const moduleDeployedEvent = mockHatsModuleFactory_ModuleDeployedEvent(
        Address.fromString(STAKING_ELIGIBILITY_IMPLEMENTATION),
        Address.fromString(stakingInstanceLinkedAdmins),
        BigInt.fromString(hatIdLinkedAdmins),
        Bytes.fromHexString(stakingToken),
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
                  "0x0000000300000000000000000000000000000000000000000000000000000000"
                )
              )
            )
          ),
        ])
        .returns([ethereum.Value.fromUnsignedBigInt(BigInt.fromString("3"))]);

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
                  "0x0000000400000000000000000000000000000000000000000000000000000000"
                )
              )
            )
          ),
        ])
        .returns([ethereum.Value.fromUnsignedBigInt(BigInt.fromString("4"))]);

      // tree 3 is linked to hat 4.1.1
      createMockedFunction(
        Address.fromString(
          "0x3bc1A0Ad72417f2d411118085256fC53CBdDd137".toLowerCase()
        ),
        "linkedTreeAdmins",
        "linkedTreeAdmins(uint32):(uint256)"
      )
        .withArgs([ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(3))])
        .returns([
          ethereum.Value.fromUnsignedBigInt(
            BigInt.fromString(
              "107840198051018991215565279854209951455382489790231053763844312662016"
            )
          ),
        ]);

      // tree 4 is not linked
      createMockedFunction(
        Address.fromString(
          "0x3bc1A0Ad72417f2d411118085256fC53CBdDd137".toLowerCase()
        ),
        "linkedTreeAdmins",
        "linkedTreeAdmins(uint32):(uint256)"
      )
        .withArgs([ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(4))])
        .returns([ethereum.Value.fromUnsignedBigInt(BigInt.fromString("0"))]);

      handleModuleDeployed(moduleDeployedEvent);
    });

    test("Test staking eligibility with linked admins hat", () => {
      assert.entityCount("StakingEligibility", 2);
      assert.fieldEquals(
        "StakingEligibility",
        stakingInstanceLinkedAdmins,
        "judgeHat",
        "0x0000000100000000000000000000000000000000000000000000000000000000"
      );
      assert.fieldEquals(
        "StakingEligibility",
        stakingInstanceLinkedAdmins,
        "recipientHat",
        "0x0000000100010000000000000000000000000000000000000000000000000000"
      );
      assert.fieldEquals(
        "StakingEligibility",
        stakingInstanceLinkedAdmins,
        "hatAdmins",
        "[0x0000000300000000000000000000000000000000000000000000000000000000, 0x0000000300010000000000000000000000000000000000000000000000000000, 0x0000000400000000000000000000000000000000000000000000000000000000, 0x0000000400010000000000000000000000000000000000000000000000000000]"
      );
    });
  });
});
