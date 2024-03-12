import {
  assert,
  describe,
  test,
  clearStore,
  afterAll,
  beforeEach,
  dataSourceMock,
} from "matchstick-as";
import { Address, BigInt, log } from "@graphprotocol/graph-ts";
import { mockHatCreatedEvent } from "./utils";
import { handleHatCreated } from "../src/hats";
import { hatIdToHex } from "../src/utils";

const hatId =
  "1779356480031942226448022995743295624460051531887677783752838276448256";
const hatsAccount = "0x6556877BCce8648AC9813a5C581d7FF4c427Fd69".toLowerCase();
const account1: string = "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb";

describe("Hats Tests", () => {
  afterAll(() => {
    clearStore();
  });

  describe("Hats account is created", () => {
    beforeEach(() => {
      dataSourceMock.setNetwork("sepolia");

      const hatCreatedEvent = mockHatCreatedEvent(
        BigInt.fromString(hatId),
        "HAT_DETAILS",
        BigInt.fromI32(3),
        Address.fromString(account1),
        Address.fromString(account1),
        true,
        "IMAGE_URI",
        BigInt.fromI32(11155111),
        Address.fromString("0x0142071D8D24017021F6Bf0D8fC5b7A61B61be29")
      );

      handleHatCreated(hatCreatedEvent);
    });

    test("Test hat authority", () => {
      assert.fieldEquals(
        "HatAuthority",
        hatIdToHex(BigInt.fromString(hatId)),
        "primaryHatsAccount1ofNAddress",
        "0x0142071D8D24017021F6Bf0D8fC5b7A61B61be29".toLowerCase()
      );
    });
  });
});
