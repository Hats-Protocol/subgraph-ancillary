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
import { PASSTHROUGH_MODULE_IMPLEMENTATION } from "../src/constants";

const passthroughHatId =
  "0x0000000100000000000000000000000000000000000000000000000000000000";

const hatId =
  "26960358049567071831564234593151059434471056522609336320533481914368";

const account1 = "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const account2 = "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb";

const passthroughInstance = "0xcccccccccccccccccccccccccccccccccccccccc";

describe("Passthrough Module Tests", () => {
  afterAll(() => {
    clearStore();
  });

  describe("Passthrough module is created", () => {
    beforeEach(() => {
      const moduleDeployedEvent = mockHatsModuleFactory_ModuleDeployedEvent(
        Address.fromString(PASSTHROUGH_MODULE_IMPLEMENTATION),
        Address.fromString(passthroughInstance),
        BigInt.fromString(hatId),
        Bytes.fromHexString(
          "0x0000000100000000000000000000000000000000000000000000000000000000"
        ),
        Bytes.fromHexString("0x")
      );

      handleModuleDeployed(moduleDeployedEvent);
    });

    test("Test passthrough module created", () => {
      assert.entityCount("PassthroughModule", 1);
      assert.fieldEquals(
        "PassthroughModule",
        passthroughInstance,
        "passthroughHat",
        passthroughHatId
      );
      assert.fieldEquals(
        "PassthroughModule",
        passthroughInstance,
        "hatId",
        "0x0000000100010001000000000000000000000000000000000000000000000000"
      );
    });
  });
});
