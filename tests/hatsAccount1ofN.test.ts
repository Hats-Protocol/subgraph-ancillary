import {
  assert,
  describe,
  test,
  clearStore,
  afterAll,
  beforeEach,
} from "matchstick-as/assembly/index";
import { Address, BigInt, Bytes, Value } from "@graphprotocol/graph-ts";
import { mockERC6551AccountCreatedEvent, mockTxExecuted } from "./utils";
import { handleErc6551AccountCreated } from "../src/erc6551Registry";
import { handleTxExecuted } from "../src/hatsAccount1ofN";
import { HATS_ACCOUNT_1_OF_N_IMPLEMENTATION, HATS } from "../src/constants";

const hat =
  "1779356480031942226448022995743295624460051531887677783752838276448256";
const hatsAccount = "0x6556877BCce8648AC9813a5C581d7FF4c427Fd69".toLowerCase();
const signer = "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb";

const callDataSingleScenario1 =
  "0x519454470000000000000000000000003bc1a0ad72417f2d411118085256fc53cbddd13700000000000000000000000000000000000000000000000000000000000000050000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000021234000000000000000000000000000000000000000000000000000000000000";

const callDataBatchScenario1 =
  "0x43629a730000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000200000000000000000000000003bc1a0ad72417f2d411118085256fc53cbddd13700000000000000000000000000000000000000000000000000000000000000050000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000021234000000000000000000000000000000000000000000000000000000000000";

const callDataBatchScenario2 =
  "0x43629a7300000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000001000000000000000000000000003bc1a0ad72417f2d411118085256fc53cbddd137000000000000000000000000000000000000000000000000000000000000000500000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000212340000000000000000000000000000000000000000000000000000000000000000000000000000000000003bc1a0ad72417f2d411118085256fc53cbddd13700000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000025678000000000000000000000000000000000000000000000000000000000000";

describe("Hats Account Tests", () => {
  afterAll(() => {
    clearStore();
  });

  describe("Hats account is created", () => {
    beforeEach(() => {
      const erc6551AccountCreatedEvent = mockERC6551AccountCreatedEvent(
        Address.fromString(hatsAccount),
        Address.fromString(HATS_ACCOUNT_1_OF_N_IMPLEMENTATION),
        Bytes.fromHexString("0x11"),
        BigInt.fromI32(11155111),
        Address.fromString("0x3bc1A0Ad72417f2d411118085256fC53CBdDd137"),
        BigInt.fromString(hat)
      );

      handleErc6551AccountCreated(erc6551AccountCreatedEvent);
    });

    test("Test hats account created", () => {
      assert.entityCount("HatsAccount1ofN", 1);
      assert.fieldEquals(
        "HatsAccount1ofN",
        hatsAccount,
        "accountOfHat",
        "0x0000004200000000000000000000000000000000000000000000000000000000"
      );
    });

    describe("And single tx 1 is executed", () => {
      beforeEach(() => {
        const txExecutedEvent = mockTxExecuted(
          Address.fromString(hatsAccount),
          Address.fromString(signer),
          BigInt.fromI32(1),
          BigInt.fromI32(1),
          Bytes.fromHexString(callDataSingleScenario1)
        );

        handleTxExecuted(txExecutedEvent);
      });

      test("Test tx", () => {
        assert.entityCount("HatsAccount1ofNOperation", 1);
        assert.fieldEquals(
          "HatsAccount1ofNOperation",
          "1-1",
          "hatsAccount",
          hatsAccount
        );
        assert.fieldEquals("HatsAccount1ofNOperation", "1-1", "to", HATS);
        assert.fieldEquals("HatsAccount1ofNOperation", "1-1", "value", "5");
        assert.fieldEquals(
          "HatsAccount1ofNOperation",
          "1-1",
          "callData",
          "0x1234"
        );
      });
    });

    describe("And batched tx 1 is executed", () => {
      beforeEach(() => {
        const txExecutedEvent = mockTxExecuted(
          Address.fromString(hatsAccount),
          Address.fromString(signer),
          BigInt.fromI32(2),
          BigInt.fromI32(1),
          Bytes.fromHexString(callDataBatchScenario1)
        );

        handleTxExecuted(txExecutedEvent);
      });

      test("Test tx", () => {
        assert.entityCount("HatsAccount1ofNOperation", 2);
        assert.fieldEquals(
          "HatsAccount1ofNOperation",
          "2-1-0",
          "hatsAccount",
          hatsAccount
        );
        assert.fieldEquals(
          "HatsAccount1ofNOperation",
          "2-1-0",
          "signer",
          signer
        );
        assert.fieldEquals(
          "HatsAccount1ofNOperation",
          "2-1-0",
          "to",
          "0x3bc1a0ad72417f2d411118085256fc53cbddd137"
        );
        assert.fieldEquals("HatsAccount1ofNOperation", "2-1-0", "value", "5");
        assert.fieldEquals(
          "HatsAccount1ofNOperation",
          "2-1-0",
          "callData",
          "0x1234"
        );
      });
    });

    describe("And batched tx 2 is executed", () => {
      beforeEach(() => {
        const txExecutedEvent = mockTxExecuted(
          Address.fromString(hatsAccount),
          Address.fromString(signer),
          BigInt.fromI32(3),
          BigInt.fromI32(1),
          Bytes.fromHexString(callDataBatchScenario2)
        );

        handleTxExecuted(txExecutedEvent);
      });

      test("Test tx 1", () => {
        assert.entityCount("HatsAccount1ofNOperation", 4);
        assert.fieldEquals(
          "HatsAccount1ofNOperation",
          "3-1-0",
          "hatsAccount",
          hatsAccount
        );
        assert.fieldEquals(
          "HatsAccount1ofNOperation",
          "3-1-0",
          "signer",
          signer
        );
        assert.fieldEquals(
          "HatsAccount1ofNOperation",
          "3-1-0",
          "to",
          "0x3bc1a0ad72417f2d411118085256fc53cbddd137"
        );
        assert.fieldEquals("HatsAccount1ofNOperation", "3-1-0", "value", "5");
        assert.fieldEquals(
          "HatsAccount1ofNOperation",
          "3-1-0",
          "callData",
          "0x1234"
        );
      });

      test("Test tx 2", () => {
        assert.entityCount("HatsAccount1ofNOperation", 4);
        assert.fieldEquals(
          "HatsAccount1ofNOperation",
          "3-1-1",
          "hatsAccount",
          hatsAccount
        );
        assert.fieldEquals(
          "HatsAccount1ofNOperation",
          "3-1-1",
          "signer",
          signer
        );
        assert.fieldEquals(
          "HatsAccount1ofNOperation",
          "3-1-1",
          "to",
          "0x3bc1a0ad72417f2d411118085256fc53cbddd137"
        );
        assert.fieldEquals("HatsAccount1ofNOperation", "3-1-1", "value", "6");
        assert.fieldEquals(
          "HatsAccount1ofNOperation",
          "3-1-1",
          "callData",
          "0x5678"
        );
      });
    });
  });
});
