import {
  assert,
  describe,
  test,
  clearStore,
  afterAll,
  beforeEach,
} from "matchstick-as/assembly/index";
import { Address, BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import {
  mockHatsModuleFactory_ModuleDeployedEventV0_7_0,
  mockAgreementEligibility_HatClaimedWithAgreementEvent,
  mockAgreementEligibility_AgreementSignedEvent,
  mockAgreementEligibility_AgreementSetEvent,
} from "../../utils";
import { handleModuleDeployed } from "../../../src/hatsModuleFactoryV0_7_0";
import { AGREEMENT_ELIGIBILITY_IMPLEMENTATION } from "../../../src/constants";
import {
  handleAgreementEligibility_AgreementSet,
  handleAgreementEligibility_AgreementSigned,
  handleAgreementEligibility_HatClaimedWithAgreement,
} from "../../../src/modules/agreementEligibility";

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
const grace1 = 3600;

const agreement1 =
  "bafybeih2a5ztsooqtx7hb32oayynxoeiplaqd5llcnezzj2srqgmc2k2da";

const agreement2 =
  "bafybeih2a5ztsooqtx7hb32oayynxoeiplaqd5llcnezzj2srqgmc2k2db";

describe("Agreement Eligibility Tests", () => {
  afterAll(() => {
    clearStore();
  });

  describe("Agreement eligibility is created", () => {
    beforeEach(() => {
      const moduleDeployedEvent =
        mockHatsModuleFactory_ModuleDeployedEventV0_7_0(
          Address.fromString(AGREEMENT_ELIGIBILITY_IMPLEMENTATION),
          Address.fromString(agreementInstance),
          BigInt.fromString(hatId),
          Bytes.fromHexString(immutableArgs),
          Bytes.fromHexString(mutableArgs),
          BigInt.fromI32(1)
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
        "currentAgreementNumber",
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

    describe("And an account is signing and claiming", () => {
      beforeEach(() => {
        const agreementEligibility_HatClaimedWithAgreementEvent =
          mockAgreementEligibility_HatClaimedWithAgreementEvent(
            Address.fromString(agreementInstance),
            Address.fromString(account1),
            BigInt.fromString(hatId),
            agreement1
          );

        handleAgreementEligibility_HatClaimedWithAgreement(
          agreementEligibility_HatClaimedWithAgreementEvent
        );
      });

      test("Test sign and claim", () => {
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
          `[${account1}]`
        );
        assert.fieldEquals(
          "Agreement",
          "1" + "-" + agreementInstance,
          "graceEndTime",
          "0"
        );
      });

      describe("And an account is signing", () => {
        beforeEach(() => {
          const agreementEligibility_AgreementSignedEvent =
            mockAgreementEligibility_AgreementSignedEvent(
              Address.fromString(agreementInstance),
              Address.fromString(account2),
              agreement1
            );

          handleAgreementEligibility_AgreementSigned(
            agreementEligibility_AgreementSignedEvent
          );
        });

        test("Test sign", () => {
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
            "graceEndTime",
            "0"
          );
          assert.fieldEquals(
            "Agreement",
            "1" + "-" + agreementInstance,
            "signers",
            `[${account1}, ${account2}]`
          );
        });

        describe("And a new agreement is set", () => {
          beforeEach(() => {
            const agreementEligibility_AgreementSetEvent =
              mockAgreementEligibility_AgreementSetEvent(
                Address.fromString(agreementInstance),
                BigInt.fromI32(timestamp1),
                agreement2,
                BigInt.fromI32(grace1)
              );

            handleAgreementEligibility_AgreementSet(
              agreementEligibility_AgreementSetEvent
            );
          });

          test("Test agreement eligibility entity", () => {
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
              "currentAgreementNumber",
              "2"
            );
            assert.fieldEquals(
              "AgreementEligibility",
              agreementInstance,
              "currentAgreement",
              "2" + "-" + agreementInstance
            );
          });

          test("Test agreement eligibility entity", () => {
            assert.entityCount("Agreement", 2);
            assert.fieldEquals(
              "Agreement",
              "2" + "-" + agreementInstance,
              "agreementEligibility",
              agreementInstance
            );
            assert.fieldEquals(
              "Agreement",
              "2" + "-" + agreementInstance,
              "agreement",
              agreement2
            );
            assert.fieldEquals(
              "Agreement",
              "2" + "-" + agreementInstance,
              "graceEndTime",
              `${timestamp1 + grace1}`
            );
            assert.fieldEquals(
              "Agreement",
              "2" + "-" + agreementInstance,
              "signers",
              `[]`
            );
          });
        });
      });
    });
  });
});
