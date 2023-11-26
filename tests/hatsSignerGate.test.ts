import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll,
  beforeEach,
} from "matchstick-as/assembly/index";
import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import {
  mockHatsSignerGateSetupEvent,
  mockMultiHatsSignerGateSetupEvent,
  mockTargetThresholdSetEvent,
  mockMinThresholdSetEvent,
  mockSignerHatsAddedEvent,
} from "./utils";
import { hatIdToHex } from "../src/utils";
import {
  handleHatsSignerGateSetup,
  handleMultiHatsSignerGateSetup,
} from "../src/hatsSignerGateFactory";
import {
  HatsSignerGateSetup,
  MultiHatsSignerGateSetup,
} from "../generated/HatsSignerGateFactory/HatsSignerGateFactory";
import {
  TargetThresholdSet,
  MinThresholdSet,
  SignerHatsAdded,
} from "../generated/templates/HatsSignerGate/HatsSignerGate";
import { HatAuthorities, HatsSignerGate } from "../generated/schema";
import {
  handleTargetThresholdSet,
  handleMinThresholdSet,
} from "../src/hatsSignerGate";

const hatsSignerGateInstance = "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const multiHatsSignerGateInstance =
  "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb";
const safe = "0xcccccccccccccccccccccccccccccccccccccccc";
const ownerHatId =
  "26959946667150639794667015087019630673637144422540572481103610249216";
const signerHatId =
  "26960358043289970096177553829315270011263390106506980876069447401472";

describe("Hats Signer Gate Tests", () => {
  afterAll(() => {
    clearStore();
  });

  describe("Hats signer gate is created", () => {
    beforeEach(() => {
      const hatsSignerGateSetupEvent = mockHatsSignerGateSetupEvent(
        Address.fromString(hatsSignerGateInstance),
        BigInt.fromString(ownerHatId),
        BigInt.fromString(signerHatId),
        Address.fromString(safe),
        BigInt.fromI32(2),
        BigInt.fromI32(3),
        BigInt.fromI32(5)
      );

      handleHatsSignerGateSetup(hatsSignerGateSetupEvent);
    });

    test("Test hats signer gate created", () => {
      assert.entityCount("HatsSignerGate", 1);
      assert.fieldEquals(
        "HatsSignerGate",
        hatsSignerGateInstance,
        "type",
        "Single"
      );
      assert.fieldEquals(
        "HatsSignerGate",
        hatsSignerGateInstance,
        "ownerHat",
        hatIdToHex(BigInt.fromString(ownerHatId))
      );

      assert.fieldEquals(
        "HatsSignerGate",
        hatsSignerGateInstance,
        "signerHats",
        "[0x0000000100010000000000000000000000000000000000000000000000000000]"
      );
      assert.fieldEquals(
        "HatsSignerGate",
        hatsSignerGateInstance,
        "safe",
        safe
      );
      assert.fieldEquals(
        "HatsSignerGate",
        hatsSignerGateInstance,
        "minThreshold",
        "2"
      );
      assert.fieldEquals(
        "HatsSignerGate",
        hatsSignerGateInstance,
        "targetThreshold",
        "3"
      );
      assert.fieldEquals(
        "HatsSignerGate",
        hatsSignerGateInstance,
        "maxSigners",
        "5"
      );
    });

    describe("And target threshold is set", () => {
      beforeEach(() => {
        const targetThresholdSetEvent = mockTargetThresholdSetEvent(
          Address.fromString(hatsSignerGateInstance),
          BigInt.fromI32(4)
        );
        handleTargetThresholdSet(targetThresholdSetEvent);
      });

      test("Test target threshold set", () => {
        assert.fieldEquals(
          "HatsSignerGate",
          hatsSignerGateInstance,
          "targetThreshold",
          "4"
        );
      });

      describe("And min threshold is set", () => {
        beforeEach(() => {
          const minThresholdSetEvent = mockMinThresholdSetEvent(
            Address.fromString(hatsSignerGateInstance),
            BigInt.fromI32(3)
          );
          handleMinThresholdSet(minThresholdSetEvent);
        });

        test("Test target threshold set", () => {
          assert.fieldEquals(
            "HatsSignerGate",
            hatsSignerGateInstance,
            "minThreshold",
            "3"
          );
        });
      });
    });
  });

  describe("Multi hats signer gate is created", () => {
    beforeEach(() => {
      const signers = [
        BigInt.fromString(ownerHatId),
        BigInt.fromString(signerHatId),
      ];
      const multiHatsSignerGateSetupEvent = mockMultiHatsSignerGateSetupEvent(
        Address.fromString(multiHatsSignerGateInstance),
        BigInt.fromString(ownerHatId),
        signers,
        Address.fromString(safe),
        BigInt.fromI32(2),
        BigInt.fromI32(3),
        BigInt.fromI32(5)
      );

      handleMultiHatsSignerGateSetup(multiHatsSignerGateSetupEvent);
    });

    test("Test multi hats signer gate created", () => {
      assert.entityCount("HatsSignerGate", 2);
      assert.fieldEquals(
        "HatsSignerGate",
        multiHatsSignerGateInstance,
        "type",
        "Multi"
      );

      assert.fieldEquals(
        "HatsSignerGate",
        multiHatsSignerGateInstance,
        "ownerHat",
        hatIdToHex(BigInt.fromString(ownerHatId))
      );
      assert.fieldEquals(
        "HatsSignerGate",
        multiHatsSignerGateInstance,
        "signerHats",
        "[0x0000000100000000000000000000000000000000000000000000000000000000, 0x0000000100010000000000000000000000000000000000000000000000000000]"
      );
      assert.fieldEquals(
        "HatsSignerGate",
        multiHatsSignerGateInstance,
        "safe",
        safe
      );
      assert.fieldEquals(
        "HatsSignerGate",
        multiHatsSignerGateInstance,
        "minThreshold",
        "2"
      );
      assert.fieldEquals(
        "HatsSignerGate",
        multiHatsSignerGateInstance,
        "targetThreshold",
        "3"
      );
      assert.fieldEquals(
        "HatsSignerGate",
        multiHatsSignerGateInstance,
        "maxSigners",
        "5"
      );
    });

    describe("And target threshold is set", () => {
      beforeEach(() => {
        const targetThresholdSetEvent = mockTargetThresholdSetEvent(
          Address.fromString(multiHatsSignerGateInstance),
          BigInt.fromI32(4)
        );
        handleTargetThresholdSet(targetThresholdSetEvent);
      });

      test("Test target threshold set", () => {
        assert.fieldEquals(
          "HatsSignerGate",
          multiHatsSignerGateInstance,
          "targetThreshold",
          "4"
        );
      });

      describe("And min threshold is set", () => {
        beforeEach(() => {
          const minThresholdSetEvent = mockMinThresholdSetEvent(
            Address.fromString(multiHatsSignerGateInstance),
            BigInt.fromI32(3)
          );
          handleMinThresholdSet(minThresholdSetEvent);
        });

        test("Test target threshold set", () => {
          assert.fieldEquals(
            "HatsSignerGate",
            multiHatsSignerGateInstance,
            "minThreshold",
            "3"
          );
        });
      });
    });
  });
});
