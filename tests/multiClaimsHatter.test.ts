import { Address, BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import {
  beforeEach,
  describe,
  test,
  assert,
  logStore,
  beforeAll,
} from "matchstick-as/assembly/index";
import { handleModuleDeployed } from "../src/hatsModuleFactory";
import {
  handleHatClaimabilitySet,
  handleHatsClaimabilitySet,
} from "../src/multiClaimsHatter";
import {
  mockHatsModuleFactory_ModuleDeployedEvent,
  mockHatClaimabilitySetEvent,
  mockHatsClaimabilityEditedEvent,
} from "./utils";
import { MULTI_CLAIMS_HATTER_IMPLEMENTATION } from "../src/constants";

const address1: string = "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const claimsHatter1: string = "0xdddddddddddddddddddddddddddddddddddddddd";
const hatId1 =
  "26960358043289970096177553829315270011263390106506980876069447401472";
const hatId2 =
  "26960358049567071831564234593151059434471056522609336320533481914368";
const hatId3 =
  "26960358049567167612535538711204706831160253416933312491728618389504";

describe("basic test", () => {
  describe("And a MutliClaimsHatter is created without initial hats, and wears 0x00000001.0001", () => {
    beforeEach(() => {
      let multiClaimsHatterCreatedEvent =
        mockHatsModuleFactory_ModuleDeployedEvent(
          Address.fromString(MULTI_CLAIMS_HATTER_IMPLEMENTATION),
          Address.fromString(claimsHatter1),
          BigInt.fromString(hatId1),
          Bytes.fromHexString(""),
          Bytes.fromHexString("")
        );
      handleModuleDeployed(multiClaimsHatterCreatedEvent);
    });

    test("Test created claims hatter", () => {
      assert.fieldEquals("ClaimsHatter", claimsHatter1, "claimableHats", "[]");
      assert.fieldEquals(
        "ClaimsHatter",
        claimsHatter1,
        "claimableForHats",
        "[]"
      );
    });

    describe("And hats 0x00000001.0001.0001, 0x00000001.0001.0001.0001 are registered", () => {
      beforeEach(() => {
        let hatClaimabilityEditedEvent1 = mockHatClaimabilitySetEvent(
          Address.fromString(claimsHatter1),
          hatId2,
          1
        );
        handleHatClaimabilitySet(hatClaimabilityEditedEvent1);

        let hatClaimabilityEditedEvent2 = mockHatClaimabilitySetEvent(
          Address.fromString(claimsHatter1),
          hatId3,
          2
        );
        handleHatClaimabilitySet(hatClaimabilityEditedEvent2);
      });

      test("Test hats registered", () => {
        assert.fieldEquals(
          "ClaimsHatter",
          claimsHatter1,
          "claimableHats",
          "[0x0000000100010001000000000000000000000000000000000000000000000000, 0x0000000100010001000100000000000000000000000000000000000000000000]"
        );
        assert.fieldEquals(
          "ClaimsHatter",
          claimsHatter1,
          "claimableForHats",
          "[0x0000000100010001000100000000000000000000000000000000000000000000]"
        );
      });

      describe("And hat 0x00000001.0001.0001 is unregistered", () => {
        beforeEach(() => {
          let hatUnregisteredEvent = mockHatClaimabilitySetEvent(
            Address.fromString(claimsHatter1),
            hatId2,
            0
          );
          handleHatClaimabilitySet(hatUnregisteredEvent);
        });

        test("Test hats registered", () => {
          assert.fieldEquals(
            "ClaimsHatter",
            claimsHatter1,
            "claimableHats",
            "[0x0000000100010001000100000000000000000000000000000000000000000000]"
          );
          assert.fieldEquals(
            "ClaimsHatter",
            claimsHatter1,
            "claimableForHats",
            "[0x0000000100010001000100000000000000000000000000000000000000000000]"
          );
        });
      });
    });
  });

  describe("And a MutliClaimsHatter is created with initial hats, and wears 0x00000001.0001", () => {
    beforeEach(() => {
      let multiClaimsHatterCreatedEvent =
        mockHatsModuleFactory_ModuleDeployedEvent(
          Address.fromString(MULTI_CLAIMS_HATTER_IMPLEMENTATION),
          Address.fromString(claimsHatter1),
          BigInt.fromString(hatId1),
          Bytes.fromHexString(""),
          Bytes.fromHexString("")
        );
      handleModuleDeployed(multiClaimsHatterCreatedEvent);

      const initialClaimableHats: string[] = [hatId2, hatId3];
      const initialClaimabilityTypes: i32[] = [1, 2];
      let hatsClaimabilityEditedEvent = mockHatsClaimabilityEditedEvent(
        Address.fromString(claimsHatter1),
        initialClaimableHats,
        initialClaimabilityTypes
      );
      handleHatsClaimabilitySet(hatsClaimabilityEditedEvent);
    });

    test("Test created claims hatter", () => {
      assert.fieldEquals(
        "ClaimsHatter",
        claimsHatter1,
        "claimableHats",
        "[0x0000000100010001000000000000000000000000000000000000000000000000, 0x0000000100010001000100000000000000000000000000000000000000000000]"
      );
      assert.fieldEquals(
        "ClaimsHatter",
        claimsHatter1,
        "claimableForHats",
        "[0x0000000100010001000100000000000000000000000000000000000000000000]"
      );
    });
  });
});
