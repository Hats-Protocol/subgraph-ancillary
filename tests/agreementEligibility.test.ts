import {
  assert,
  describe,
  test,
  clearStore,
  afterAll,
  beforeEach,
  createMockedFunction,
} from "matchstick-as/assembly/index";
import {
  Address,
  BigInt,
  ethereum,
  Bytes,
  ByteArray,
  log,
} from "@graphprotocol/graph-ts";
import { mockHatsModuleFactory_ModuleDeployedEvent } from "./utils";
import { handleModuleDeployed } from "../src/hatsModuleFactory";
import { AGREEMENT_ELIGIBILITY_IMPLEMENTATION } from "../src/constants";
import { changeEndianness } from "../src/utils";
import {
  handleAgreementEligibility_AgreementSet,
  handleAgreementEligibility_AgreementSigned,
  handleAgreementEligibility_HatClaimedWithAgreement,
} from "../src/agreementEligibility";

const immutableArgs =
  "0x000000550001000D000100000000000000000000000000000000000000000000000000550001000D000200000000000000000000000000000000000000000000";
const mutableArgs =
  "0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000003B62616679626569683261357A74736F6F71747837686233326F6179796E786F6569706C617164356C6C636E657A7A6A32737271676D63326B3264610000000000";
const ownerHatId =
  "0x000000550001000d000100000000000000000000000000000000000000000000";
const arbitratorHatId =
  "0x000000550001000d000200000000000000000000000000000000000000000000";
const hatId =
  "26960358049567071831564234593151059434471056522609336320533481914368";

const account1 = "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const account2 = "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb";
const account3 = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";

const agreementInstance = "0xcccccccccccccccccccccccccccccccccccccccc";

const timestamp1 = 1000000;
const timestamp2 = 1000200;

const agreement1 =
  "bafybeih2a5ztsooqtx7hb32oayynxoeiplaqd5llcnezzj2srqgmc2k2da";

describe("Agreement Eligibility Tests", () => {
  afterAll(() => {
    clearStore();
  });

  describe("Agreement eligibility is created", () => {
    beforeEach(() => {
      const moduleDeployedEvent = mockHatsModuleFactory_ModuleDeployedEvent(
        Address.fromString(AGREEMENT_ELIGIBILITY_IMPLEMENTATION),
        Address.fromString(agreementInstance),
        BigInt.fromString(hatId),
        Bytes.fromHexString(immutableArgs),
        Bytes.fromHexString(mutableArgs)
      );

      handleModuleDeployed(moduleDeployedEvent);
    });

    test("Test hats election eligibility created", () => {
      assert.entityCount("AgreementEligibility", 1);
      assert.fieldEquals(
        "AgreementEligibility",
        agreementInstance,
        "ownerHat",
        ownerHatId
      );
      assert.fieldEquals(
        "AgreementEligibility",
        agreementInstance,
        "arbitratorHat",
        arbitratorHatId
      );
      assert.fieldEquals(
        "AgreementEligibility",
        agreementInstance,
        "currentAgreementId",
        "1"
      );
      assert.fieldEquals(
        "AgreementEligibility",
        agreementInstance,
        "currentAgreement",
        "1" + "-" + agreementInstance
      );
    });

    test("Test agreement", () => {
      assert.entityCount("Agreement", 1);
      assert.fieldEquals(
        "Agreement",
        "1" + "-" + agreementInstance,
        "agreementEligibility",
        agreementInstance
      );
      assert.fieldEquals(
        "Agreement",
        "1" + "-" + agreementInstance,
        "agreement",
        agreement1
      );
      assert.fieldEquals(
        "Agreement",
        "1" + "-" + agreementInstance,
        "signers",
        "[]"
      );
      assert.fieldEquals(
        "Agreement",
        "1" + "-" + agreementInstance,
        "graceEndTime",
        "0"
      );
    });
  });
});
