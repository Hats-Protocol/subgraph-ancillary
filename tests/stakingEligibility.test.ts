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
import { handleModuleDeployed } from "../src/hatsModuleFactory";
import { STAKING_ELIGIBILITY_IMPLEMENTATION } from "../src/constants";

const judgeHatId =
  "26959946667150639794667015087019630673637144422540572481103610249216";
const recipientHatId =
  "26960358043289970096177553829315270011263390106506980876069447401472";
const hatId =
  "26960358049567071831564234593151059434471056522609336320533481914368";

const account1 = "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const account2 = "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb";

const stakingToken = "0xcccccccccccccccccccccccccccccccccccccccc";

const stakingInstance = "0xcccccccccccccccccccccccccccccccccccccccc";

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
    });
  });
});
