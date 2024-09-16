import {
  dataSource,
  Address,
  Bytes,
  BigInt,
  crypto,
  ByteArray,
} from "@graphprotocol/graph-ts";
import { HatCreated, WearerStandingChanged } from "../generated/Hats/Hats";
import {
  HatAuthority,
  AgreementEligibility,
  HatsEligibilitiesChain,
} from "../generated/schema";
import { hatIdToHex } from "./utils";
import { AgreementEligibilityV_0_1_0 as AgreementEligibilityV_0_1_0Contract } from "../generated/templates/AgreementEligibilityV_0_1_0/AgreementEligibilityV_0_1_0";
import { AgreementEligibilityV_0_2_0 as AgreementEligibilityV_0_2_0Contract } from "../generated/templates/AgreementEligibilityV_0_2_0/AgreementEligibilityV_0_2_0";
import { AgreementEligibilityV_0_3_0 as AgreementEligibilityV_0_3_0Contract } from "../generated/templates/AgreementEligibilityV_0_3_0/AgreementEligibilityV_0_3_0";
import { HatsEligibilitiesChainV_0_1_0 as HatsEligibilitiesChainV_0_1_0Contract } from "../generated/templates/HatsEligibilitiesChainV_0_1_0/HatsEligibilitiesChainV_0_1_0";
import { HatsEligibilitiesChainV_0_2_0 as HatsEligibilitiesChainV_0_2_0Contract } from "../generated/templates/HatsEligibilitiesChainV_0_2_0/HatsEligibilitiesChainV_0_2_0";
import { Hats as HatsContract } from "../generated/Hats/Hats";

export function handleHatCreated(event: HatCreated): void {
  // create new hat
  let hatAuthority = HatAuthority.load(hatIdToHex(event.params.id));
  if (hatAuthority == null) {
    hatAuthority = new HatAuthority(hatIdToHex(event.params.id));
  }

  let chainId: string =
    "0000000000000000000000000000000000000000000000000000000000000001";
  const chainName = dataSource.network();

  if (chainName == "goerli") {
    chainId =
      "0000000000000000000000000000000000000000000000000000000000000005";
  } else if (chainName == "matic") {
    chainId =
      "0000000000000000000000000000000000000000000000000000000000000089";
  } else if (chainName == "gnosis") {
    chainId =
      "0000000000000000000000000000000000000000000000000000000000000064";
  } else if (chainName == "arbitrum-one") {
    chainId =
      "000000000000000000000000000000000000000000000000000000000000a4b1";
  } else if (chainName == "optimism") {
    chainId =
      "000000000000000000000000000000000000000000000000000000000000000a";
  } else if (chainName == "sepolia") {
    chainId =
      "0000000000000000000000000000000000000000000000000000000000aa36a7";
  } else if (chainName == "base") {
    chainId =
      "0000000000000000000000000000000000000000000000000000000000002105";
  } else if (chainName == "celo") {
    chainId =
      "000000000000000000000000000000000000000000000000000000000000a4ec";
  }

  // calculate hats account address
  const bytecode = `3d60ad80600a3d3981f3363d3d373d3d3d363d73fef83a660b7c10a3edafdcf62deee1fd8a875d295af43d82803e903d91602b57fd5bf30000000000000000000000000000000000000000000000000000000000000001${chainId}0000000000000000000000003bc1a0ad72417f2d411118085256fc53cbddd137${hatIdToHex(
    event.params.id
  ).slice(2)}`;
  const bytecodeHash = crypto.keccak256(ByteArray.fromHexString(bytecode));
  const dataToHash = `ff000000006551c19487814612e58fe068137757580000000000000000000000000000000000000000000000000000000000000001${bytecodeHash
    .toHexString()
    .slice(2)}`;
  const hatsAccountAddress =
    "0x" +
    crypto
      .keccak256(ByteArray.fromHexString(dataToHash))
      .toHexString()
      .slice(26);

  hatAuthority.primaryHatsAccount1ofNAddress = hatsAccountAddress;
  hatAuthority.save();
}

export function handleWearerStandingChanged(
  event: WearerStandingChanged
): void {
  const hatsContract = HatsContract.bind(event.address);
  const hatId = event.params.hatId;
  const wearer = event.params.wearer;

  const eligibilityAddress = hatsContract.getHatEligibilityModule(hatId);

  const agreementEligibility = AgreementEligibility.load(
    eligibilityAddress.toHexString()
  );

  if (agreementEligibility != null) {
    updateStandingInAgreement(
      agreementEligibility,
      eligibilityAddress,
      wearer,
      hatId
    );

    return;
  }

  const chain = HatsEligibilitiesChain.load(eligibilityAddress.toHexString());

  if (chain != null) {
    const modules = chain.moduleAddresses;
    for (let i = 0; i < modules.length; i++) {
      const module = modules[i];
      const agreementEligibility = AgreementEligibility.load(module);

      if (agreementEligibility != null) {
        updateStandingInAgreement(
          agreementEligibility,
          Address.fromString(module),
          wearer,
          hatId
        );
      }
    }
  }
}

function updateStandingInAgreement(
  agreementEligibility: AgreementEligibility,
  moduleAddress: Address,
  wearer: Address,
  hatId: BigInt
): void {
  const agreementV1Contract =
    AgreementEligibilityV_0_1_0Contract.bind(moduleAddress);
  const agreementV2Contract =
    AgreementEligibilityV_0_2_0Contract.bind(moduleAddress);
  const agreementV3Contract =
    AgreementEligibilityV_0_3_0Contract.bind(moduleAddress);

  let standing: boolean = true;
  if (agreementEligibility.version == "0.1.0") {
    const eligibilityRes = agreementV1Contract.getWearerStatus(wearer, hatId);
    standing = eligibilityRes.getStanding();
  } else if (agreementEligibility.version == "0.2.0") {
    const eligibilityRes = agreementV2Contract.getWearerStatus(wearer, hatId);
    standing = eligibilityRes.getStanding();
  } else if (agreementEligibility.version == "0.3.0") {
    const eligibilityRes = agreementV3Contract.getWearerStatus(wearer, hatId);
    standing = eligibilityRes.getStanding();
  }

  const badStandings = agreementEligibility.badStandings;
  const index = badStandings.indexOf(wearer.toHexString());
  if (standing) {
    if (index > -1) {
      badStandings.splice(index, 1);
    }
  } else {
    if (index == -1) {
      badStandings.push(wearer.toHexString());
    }
  }
  agreementEligibility.badStandings = badStandings;
  agreementEligibility.save();
}
