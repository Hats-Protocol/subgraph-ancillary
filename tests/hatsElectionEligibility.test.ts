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
import { HATS_ELECTION_ELIGIBILITY_IMPLEMENTATION } from "../src/constants";

const ballotBoxHatId =
  "0x0000000100000000000000000000000000000000000000000000000000000000";
const adminHatId =
  "0x0000000100010000000000000000000000000000000000000000000000000000";
const hatId =
  "26960358049567071831564234593151059434471056522609336320533481914368";

const account1 = "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const account2 = "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb";

const hatsElectionInstance = "0xcccccccccccccccccccccccccccccccccccccccc";

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

      const moduleDeployedEvent = mockHatsModuleFactory_ModuleDeployedEvent(
        Address.fromString(HATS_ELECTION_ELIGIBILITY_IMPLEMENTATION),
        Address.fromString(hatsElectionInstance),
        BigInt.fromString(hatId),
        Bytes.fromHexString(
          "0x00000001000000000000000000000000000000000000000000000000000000000000000100010000000000000000000000000000000000000000000000000000"
        ),
        encodedInitArgs
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
        adminHatId
      );
    });
  });
});
