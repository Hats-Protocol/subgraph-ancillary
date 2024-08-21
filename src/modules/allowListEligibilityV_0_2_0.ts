import {
  AccountAdded,
  AccountsAdded,
  AccountRemoved,
  AccountsRemoved,
  AccountStandingChanged,
  AccountsStandingChanged,
  OwnerHatSet,
  ArbitratorHatSet,
} from "../../generated/templates/AllowListEligibilityV_0_2_0/AllowListEligibilityV_0_2_0";
import {
  AllowListEligibilityData,
  AllowListEligibility,
  Allowlist_AccountAddedEvent,
  Allowlist_AccountsAddedEvent,
  Allowlist_AccountRemovedEvent,
  Allowlist_AccountsRemovedEvent,
  Allowlist_AccountStandingChangedEvent,
  Allowlist_AccountsStandingChangedEvent,
  Allowlist_OwnerHatSetEvent,
  Allowlist_ArbitratorHatSetEvent,
} from "../../generated/schema";
import { Address, BigInt } from "@graphprotocol/graph-ts";
import { hatIdToHex } from "../utils";
import { createEventID } from "./utils";

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

  const allowlistAccountAdded = new Allowlist_AccountAddedEvent(
    createEventID(event, "AccountAdded")
  );
  allowlistAccountAdded.module = allowListEligibility.id;
  allowlistAccountAdded.allowlistEligibilityInstance = allowListEligibility.id;
  allowlistAccountAdded.blockNumber = event.block.number.toI32();
  allowlistAccountAdded.timestamp = event.block.timestamp;
  allowlistAccountAdded.transactionID = event.transaction.hash;
  allowlistAccountAdded.account = event.params.account.toHexString();

  allowlistAccountAdded.save();
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

    const allowlistAccountsAdded = new Allowlist_AccountsAddedEvent(
      createEventID(event, "AccountsAdded")
    );
    allowlistAccountsAdded.module = allowListEligibility.id;
    allowlistAccountsAdded.allowlistEligibilityInstance =
      allowListEligibility.id;
    allowlistAccountsAdded.blockNumber = event.block.number.toI32();
    allowlistAccountsAdded.timestamp = event.block.timestamp;
    allowlistAccountsAdded.transactionID = event.transaction.hash;

    const accounts: string[] = [];
    for (let i = 0; i < event.params.accounts.length; i++) {
      accounts.push(event.params.accounts[i].toHexString());
    }
    allowlistAccountsAdded.accounts = accounts;

    allowlistAccountsAdded.save();
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

  const allowlistAccountRemoved = new Allowlist_AccountRemovedEvent(
    createEventID(event, "AccountRemoved")
  );
  allowlistAccountRemoved.module = allowListEligibility.id;
  allowlistAccountRemoved.allowlistEligibilityInstance =
    allowListEligibility.id;
  allowlistAccountRemoved.blockNumber = event.block.number.toI32();
  allowlistAccountRemoved.timestamp = event.block.timestamp;
  allowlistAccountRemoved.transactionID = event.transaction.hash;
  allowlistAccountRemoved.account = event.params.account.toHexString();

  allowlistAccountRemoved.save();
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

  const allowlistAccountsRemoved = new Allowlist_AccountsRemovedEvent(
    createEventID(event, "AccountsRemoved")
  );
  allowlistAccountsRemoved.module = allowListEligibility.id;
  allowlistAccountsRemoved.allowlistEligibilityInstance =
    allowListEligibility.id;
  allowlistAccountsRemoved.blockNumber = event.block.number.toI32();
  allowlistAccountsRemoved.timestamp = event.block.timestamp;
  allowlistAccountsRemoved.transactionID = event.transaction.hash;

  const accounts: string[] = [];
  for (let i = 0; i < event.params.accounts.length; i++) {
    accounts.push(event.params.accounts[i].toHexString());
  }
  allowlistAccountsRemoved.accounts = accounts;

  allowlistAccountsRemoved.save();
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

  const allowlistAccountStandingChanged =
    new Allowlist_AccountStandingChangedEvent(
      createEventID(event, "AccountStandingChanged")
    );
  allowlistAccountStandingChanged.module = allowListEligibility.id;
  allowlistAccountStandingChanged.allowlistEligibilityInstance =
    allowListEligibility.id;
  allowlistAccountStandingChanged.blockNumber = event.block.number.toI32();
  allowlistAccountStandingChanged.timestamp = event.block.timestamp;
  allowlistAccountStandingChanged.transactionID = event.transaction.hash;
  allowlistAccountStandingChanged.account = event.params.account.toHexString();
  allowlistAccountStandingChanged.standing = event.params.standing;

  allowlistAccountStandingChanged.save();
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

  const allowlistAccountsStandingChanged =
    new Allowlist_AccountsStandingChangedEvent(
      createEventID(event, "AccountsRemoved")
    );
  allowlistAccountsStandingChanged.module = allowListEligibility.id;
  allowlistAccountsStandingChanged.allowlistEligibilityInstance =
    allowListEligibility.id;
  allowlistAccountsStandingChanged.blockNumber = event.block.number.toI32();
  allowlistAccountsStandingChanged.timestamp = event.block.timestamp;
  allowlistAccountsStandingChanged.transactionID = event.transaction.hash;

  const accounts: string[] = [];
  for (let i = 0; i < event.params.accounts.length; i++) {
    accounts.push(event.params.accounts[i].toHexString());
  }
  allowlistAccountsStandingChanged.accounts = accounts;
  allowlistAccountsStandingChanged.standings = event.params.standing;

  allowlistAccountsStandingChanged.save();
  allowListEligibility.save();
}

export function handleOwnerHatSet(event: OwnerHatSet): void {
  const allowListEligibility = AllowListEligibility.load(
    event.address.toHexString()
  ) as AllowListEligibility;

  allowListEligibility.ownerHat = hatIdToHex(event.params.newOwnerHat);

  const allowlistOwnerHatSet = new Allowlist_OwnerHatSetEvent(
    createEventID(event, "OwnerHatSet")
  );
  allowlistOwnerHatSet.module = allowListEligibility.id;
  allowlistOwnerHatSet.allowlistEligibilityInstance = allowListEligibility.id;
  allowlistOwnerHatSet.blockNumber = event.block.number.toI32();
  allowlistOwnerHatSet.timestamp = event.block.timestamp;
  allowlistOwnerHatSet.transactionID = event.transaction.hash;
  allowlistOwnerHatSet.newOwnerHat = allowListEligibility.ownerHat;

  allowlistOwnerHatSet.save();
  allowListEligibility.save();
}

export function handleArbitratorHatSet(event: ArbitratorHatSet): void {
  const allowListEligibility = AllowListEligibility.load(
    event.address.toHexString()
  ) as AllowListEligibility;

  allowListEligibility.arbitratorHat = hatIdToHex(
    event.params.newArbitratorHat
  );

  const allowlistArbitratorHatSet = new Allowlist_ArbitratorHatSetEvent(
    createEventID(event, "ArbitratorHatSet")
  );
  allowlistArbitratorHatSet.module = allowListEligibility.id;
  allowlistArbitratorHatSet.allowlistEligibilityInstance =
    allowListEligibility.id;
  allowlistArbitratorHatSet.blockNumber = event.block.number.toI32();
  allowlistArbitratorHatSet.timestamp = event.block.timestamp;
  allowlistArbitratorHatSet.transactionID = event.transaction.hash;
  allowlistArbitratorHatSet.newArbitratorHat =
    allowListEligibility.arbitratorHat;

  allowlistArbitratorHatSet.save();
  allowListEligibility.save();
}

function getEligibilityDataId(module: Address, address: Address): string {
  return module.toHexString() + "-" + address.toHexString();
}
