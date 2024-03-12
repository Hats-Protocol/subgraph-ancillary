import {
  assert,
  describe,
  test,
  clearStore,
  afterAll,
  beforeEach,
  dataSourceMock,
} from "matchstick-as";
import {
  Address,
  BigInt,
  Bytes,
  Value,
  crypto,
  ByteArray,
  log,
} from "@graphprotocol/graph-ts";
import { mockHatCreatedEvent } from "./utils";
import { handleErc6551AccountCreated } from "../src/erc6551Registry";
import { handleHatCreated } from "../src/hats";
import { HATS_ACCOUNT_1_OF_N_IMPLEMENTATION, HATS } from "../src/constants";
import { hatIdToHex } from "../src/utils";

const hatId =
  "1779356480031942226448022995743295624460051531887677783752838276448256";
const hatsAccount = "0x6556877BCce8648AC9813a5C581d7FF4c427Fd69".toLowerCase();
const account1: string = "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb";

const bytecode =
  "3d60ad80600a3d3981f3363d3d373d3d3d363d73fef83a660b7c10a3edafdcf62deee1fd8a875d295af43d82803e903d91602b57fd5bf300000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000aa36a70000000000000000000000003bc1a0ad72417f2d411118085256fc53cbddd1370000004200000000000000000000000000000000000000000000000000000000";

//("0x363d3d373d3d3d363d730xfef83a660b7c10a3edafdcf62deee1fd8a875d295af43d82803e903d91602b57fd5bf3000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000010000000000000000000000000x3bc1a0ad72417f2d411118085256fc53cbddd1370000004200000000000000000000000000000000000000000000000000000000");
//("0x363d3d373d3d3d363d730xfef83a660b7c10a3edafdcf62deee1fd8a875d295af43d82803e903d91602b57fd5bf3000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000010000000000000000000000000x3bc1a0ad72417f2d411118085256fc53cbddd1370000004200000000000000000000000000000000000000000000000000000000");
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

      const bytecodeAgain = ByteArray.fromHexString(bytecode).toHexString();
      log.info("bytecode again: {}", [bytecodeAgain]);
      const bytecodeHash = crypto.keccak256(ByteArray.fromHexString(bytecode));
      log.info("bytecode hash: {}", [bytecodeHash.toHexString()]);

      const dataToHash = `ff000000006551c19487814612e58fe068137757580000000000000000000000000000000000000000000000000000000000000001${bytecodeHash
        .toHexString()
        .slice(2)}`;
      log.info("data to hash: {}", [dataToHash]);
      const accountAddress = crypto.keccak256(
        ByteArray.fromHexString(dataToHash)
      );
      log.info("predicted address: {}", [accountAddress.toHexString()]);
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

//0x363d3d373d3d3d363d7300fef83a660b7c10a3edafdcf62deee1fd8a875d295af43d82803e903d91602b57fd5bf300000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001000000000000000000000000003bc1a0ad72417f2d411118085256fc53cbddd1370000004200000000000000000000000000000000000000000000000000000000
//0x363d3d373d3d3d363d730xfef83a660b7c10a3edafdcf62deee1fd8a875d295af43d82803e903d91602b57fd5bf3000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000010000000000000000000000000x3bc1a0ad72417f2d411118085256fc53cbddd1370000004200000000000000000000000000000000000000000000000000000000
