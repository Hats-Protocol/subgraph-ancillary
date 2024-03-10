import { dataSource, Address, Bytes, BigInt } from "@graphprotocol/graph-ts";
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

  let chainId: i32 = 1;
  const chainName = dataSource.network();

  if (chainName == "goerli") {
    chainId = 5;
  } else if (chainName == "mainnet") {
    chainId = 1;
  } else if (chainName == "matic") {
    chainId = 137;
  } else if (chainName == "gnosis") {
    chainId = 100;
  } else if (chainName == "arbitrum-one") {
    chainId = 42161;
  } else if (chainName == "optimism") {
    chainId = 10;
  } else if (chainName == "sepolia") {
    chainId = 11155111;
  } else if (chainName == "base") {
    chainId = 8453;
  } else if (chainName == "celo") {
    chainId = 42220;
  }

  // get the hats account pre computed address for the hat
  let regsitryContract = ERC6551Registry.bind(
    Address.fromString(ERC6551_REGISTRY)
  );
  const hatsAccountAddress = regsitryContract.account(
    Address.fromString(HATS_ACCOUNT_1_OF_N_IMPLEMENTATION),
    Bytes.fromHexString(
      "0x0000000000000000000000000000000000000000000000000000000000000001"
    ),
    BigInt.fromI32(chainId),
    Address.fromString(HATS),
    event.params.id
  );

  hatAuthority.primaryHatsAccount1ofNAddress = hatsAccountAddress.toHexString();
  hatAuthority.save();
}
