import {
  dataSource,
  Address,
  Bytes,
  BigInt,
  crypto,
  ByteArray,
} from "@graphprotocol/graph-ts";
import { HatCreated } from "../generated/Hats/Hats";
import { ERC6551Registry } from "../generated/ERC6551Registry/ERC6551Registry";
import { HatAuthority } from "../generated/schema";
import { hatIdToHex } from "./utils";
import {
  ERC6551_REGISTRY,
  HATS_ACCOUNT_1_OF_N_IMPLEMENTATION,
  HATS,
} from "./constants";
import { log } from "matchstick-as";

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
