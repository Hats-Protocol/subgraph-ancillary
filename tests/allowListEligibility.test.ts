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
import { ALLOWLIST_ELIGIBILITY_IMPLEMENTATION } from "../src/constants";

const ownerHatId =
  "0x0000000100000000000000000000000000000000000000000000000000000000";
const arbitratorHatId =
  "0x0000000100010000000000000000000000000000000000000000000000000000";
const hatId =
  "26960358049567071831564234593151059434471056522609336320533481914368";

const account1 = "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const account2 = "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb";

const allowListInstance = "0xcccccccccccccccccccccccccccccccccccccccc";

describe("Allow List Eligibility Tests", () => {
  afterAll(() => {
    clearStore();
  });

  describe("Allow list eligibility is created", () => {
    beforeEach(() => {
      let mutableArgs: Array<ethereum.Value> = [
        ethereum.Value.fromAddressArray([
          Address.fromString(account1),
          Address.fromString(account2),
        ]),
      ];

      let encodedInitArgs = ethereum.encode(
        ethereum.Value.fromFixedSizedArray(mutableArgs)
      )!;

      const moduleDeployedEvent = mockHatsModuleFactory_ModuleDeployedEvent(
        Address.fromString(ALLOWLIST_ELIGIBILITY_IMPLEMENTATION),
        Address.fromString(allowListInstance),
        BigInt.fromString(hatId),
        Bytes.fromHexString(
          "0x00000001000000000000000000000000000000000000000000000000000000000000000100010000000000000000000000000000000000000000000000000000"
        ),
        encodedInitArgs
      );

      handleModuleDeployed(moduleDeployedEvent);
    });

    test("Test allow list eligibility created", () => {
      assert.entityCount("AllowListEligibility", 1);
      assert.fieldEquals(
        "AllowListEligibility",
        allowListInstance,
        "ownerHat",
        ownerHatId
      );
      assert.fieldEquals(
        "AllowListEligibility",
        allowListInstance,
        "arbitratorHat",
        arbitratorHatId
      );
      assert.fieldEquals(
        "AllowListEligibility",
        allowListInstance,
        "hatId",
        "0x0000000100010001000000000000000000000000000000000000000000000000"
      );
    });
  });
});
