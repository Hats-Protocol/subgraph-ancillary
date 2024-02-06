import { ERC6551AccountCreated } from "../generated/ERC6551Registry/ERC6551Registry";
import { HatsAccount1ofN, HatAuthority } from "../generated/schema";
import { HatsAccount1ofN as HatsAccount1ofNTemplate } from "../generated/templates";
import { HATS_ACCOUNT_1_OF_N_IMPLEMENTATION, HATS } from "./constants";
import { hatIdToHex } from "./utils";

export function handleErc6551AccountCreated(
  event: ERC6551AccountCreated
): void {
  if (
    event.params.implementation.toHexString() ==
      HATS_ACCOUNT_1_OF_N_IMPLEMENTATION &&
    event.params.tokenContract.toHexString() == HATS
  ) {
    HatsAccount1ofNTemplate.create(event.params.account);
    let hatsAccount1ofN = new HatsAccount1ofN(
      event.params.account.toHexString()
    );

    // check if hat authority exists, create new object if not
    let hatAuthority = HatAuthority.load(hatIdToHex(event.params.tokenId));
    if (hatAuthority == null) {
      hatAuthority = new HatAuthority(hatIdToHex(event.params.tokenId));
    }

    hatsAccount1ofN.accountOfHat = hatAuthority.id;

    hatsAccount1ofN.save();
    hatAuthority.save();
  }
}
