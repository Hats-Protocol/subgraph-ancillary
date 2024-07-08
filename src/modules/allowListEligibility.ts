import {
  AccountAdded,
  AccountsAdded,
  AccountRemoved,
  AccountsRemoved,
  AccountStandingChanged,
  AccountsStandingChanged,
} from "../../generated/templates/AllowListEligibility/AllowListEligibility";
import {
  AllowListEligibilityData,
  AllowListEligibility,
} from "../../generated/schema";
import { Address, BigInt } from "@graphprotocol/graph-ts";
import { hatIdToHex } from "../utils";

export function handleAccountAdded(event: AccountAdded): void {
  const allowListEligibility = AllowListEligibility.load(
    event.address.toHexString()
  ) as AllowListEligibility;

  const eligibilityDataId = getEligibilityDataId(
    event.address,
    event.params.account
  );
  let eligibilityData = AllowListEligibilityData.load(eligibilityDataId);
  if (eligibilityData == null) {
    eligibilityData = new AllowListEligibilityData(eligibilityDataId);
    eligibilityData.allowListEligibility = allowListEligibility.id;
    eligibilityData.address = event.params.account.toHexString();
    eligibilityData.eligible = true;
    eligibilityData.badStanding = false;
  } else {
    eligibilityData.eligible = true;
  }

  eligibilityData.save();
  allowListEligibility.save();
}

export function handleAccountsAdded(event: AccountsAdded): void {
  const allowListEligibility = AllowListEligibility.load(
    event.address.toHexString()
  ) as AllowListEligibility;

  for (let i = 0; i < event.params.accounts.length; i++) {
    const eligibilityDataId = getEligibilityDataId(
      event.address,
      event.params.accounts[i]
    );
    let eligibilityData = AllowListEligibilityData.load(eligibilityDataId);
    if (eligibilityData == null) {
      eligibilityData = new AllowListEligibilityData(eligibilityDataId);
      eligibilityData.allowListEligibility = allowListEligibility.id;
      eligibilityData.address = event.params.accounts[i].toHexString();
      eligibilityData.eligible = true;
      eligibilityData.badStanding = false;
    } else {
      eligibilityData.eligible = true;
    }

    eligibilityData.save();
  }

  allowListEligibility.save();
}

export function handleAccountRemoved(event: AccountRemoved): void {
  const allowListEligibility = AllowListEligibility.load(
    event.address.toHexString()
  ) as AllowListEligibility;

  const eligibilityDataId = getEligibilityDataId(
    event.address,
    event.params.account
  );
  let eligibilityData = AllowListEligibilityData.load(eligibilityDataId);
  if (eligibilityData == null) {
    eligibilityData = new AllowListEligibilityData(eligibilityDataId);
    eligibilityData.allowListEligibility = allowListEligibility.id;
    eligibilityData.address = event.params.account.toHexString();
    eligibilityData.eligible = false;
    eligibilityData.badStanding = false;
  } else {
    eligibilityData.eligible = false;
  }

  eligibilityData.save();
  allowListEligibility.save();
}

export function handleAccountsRemoved(event: AccountsRemoved): void {
  const allowListEligibility = AllowListEligibility.load(
    event.address.toHexString()
  ) as AllowListEligibility;

  for (let i = 0; i < event.params.accounts.length; i++) {
    const eligibilityDataId = getEligibilityDataId(
      event.address,
      event.params.accounts[i]
    );
    let eligibilityData = AllowListEligibilityData.load(eligibilityDataId);
    if (eligibilityData == null) {
      eligibilityData = new AllowListEligibilityData(eligibilityDataId);
      eligibilityData.allowListEligibility = allowListEligibility.id;
      eligibilityData.address = event.params.accounts[i].toHexString();
      eligibilityData.eligible = false;
      eligibilityData.badStanding = false;
    } else {
      eligibilityData.eligible = false;
    }

    eligibilityData.save();
  }

  allowListEligibility.save();
}

export function handleAccountStandingChanged(
  event: AccountStandingChanged
): void {
  const allowListEligibility = AllowListEligibility.load(
    event.address.toHexString()
  ) as AllowListEligibility;

  const eligibilityDataId = getEligibilityDataId(
    event.address,
    event.params.account
  );
  let eligibilityData = AllowListEligibilityData.load(eligibilityDataId);
  if (eligibilityData == null) {
    eligibilityData = new AllowListEligibilityData(eligibilityDataId);
    eligibilityData.allowListEligibility = allowListEligibility.id;
    eligibilityData.address = event.params.account.toHexString();
    eligibilityData.eligible = true;
    eligibilityData.badStanding = !event.params.standing;
  } else {
    eligibilityData.badStanding = !event.params.standing;
  }

  eligibilityData.save();
  allowListEligibility.save();
}

export function handleAccountsStandingChanged(
  event: AccountsStandingChanged
): void {
  const allowListEligibility = AllowListEligibility.load(
    event.address.toHexString()
  ) as AllowListEligibility;

  for (let i = 0; i < event.params.accounts.length; i++) {
    const eligibilityDataId = getEligibilityDataId(
      event.address,
      event.params.accounts[i]
    );
    let eligibilityData = AllowListEligibilityData.load(eligibilityDataId);
    if (eligibilityData == null) {
      eligibilityData = new AllowListEligibilityData(eligibilityDataId);
      eligibilityData.allowListEligibility = allowListEligibility.id;
      eligibilityData.address = event.params.accounts[i].toHexString();
      eligibilityData.eligible = true;
      eligibilityData.badStanding = !event.params.standing[i];
    } else {
      eligibilityData.badStanding = !event.params.standing[i];
    }

    eligibilityData.save();
  }

  allowListEligibility.save();
}

function getEligibilityDataId(module: Address, address: Address): string {
  return module.toHexString() + "-" + address.toHexString();
}
