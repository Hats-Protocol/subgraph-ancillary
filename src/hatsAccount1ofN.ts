import { BigInt, ethereum, log } from "@graphprotocol/graph-ts";
import { TxExecuted } from "../generated/templates/HatsAccount1ofN/HatsAccount1ofN";
import {
  HatsAccount1ofN,
  HatsAccount1ofNTransaction,
} from "../generated/schema";

export function handleTxExecuted(event: TxExecuted): void {
  const hatsAccount1ofN = HatsAccount1ofN.load(
    event.address.toHexString()
  ) as HatsAccount1ofN;

  const tx = new HatsAccount1ofNTransaction(
    event.block.number.toString().concat("-").concat(event.logIndex.toString())
  );
  tx.hatsAccount = hatsAccount1ofN.id;
  tx.signer = event.params.signer.toHexString();

  if (event.transaction.input.toHexString().slice(0, 10) == "0x51945447") {
    tx.value = BigInt.fromI32(1);
  } else if (
    event.transaction.input.toHexString().slice(0, 10) == "0x43629a73"
  ) {
    tx.value = BigInt.fromI32(2);
  }

  tx.save();
  hatsAccount1ofN.save();
}
