import {
  assert,
  describe,
  test,
  clearStore,
  afterAll,
  beforeEach,
} from "matchstick-as/assembly/index";
import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import { mockERC6551AccountCreatedEvent } from "./utils";
import { hatIdToHex } from "../src/utils";
import { handleErc6551AccountCreated } from "../src/erc6551Registry";
import { handleTxExecuted } from "../src/hatsAccount1ofN";
import { HATS_ACCOUNT_1_OF_N_IMPLEMENTATION } from "../src/constants";

const hat =
  "1779356480031942226448022995743295624460051531887677783752838276448256";
const hatsAccount = "0x6556877BCce8648AC9813a5C581d7FF4c427Fd69".toLowerCase();

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
  });
});
