import { Address, BigInt, Bytes, ethereum, log } from "@graphprotocol/graph-ts";
import { TxExecuted } from "../generated/templates/HatsAccount1ofN/HatsAccount1ofN";
import {
  HatsAccount1ofN,
  HatsAccount1ofNTransaction,
} from "../generated/schema";
import { HATS } from "./constants";

export function handleTxExecuted(event: TxExecuted): void {
  const hatsAccount1ofN = HatsAccount1ofN.load(
    event.address.toHexString()
  ) as HatsAccount1ofN;

  // single execution
  if (event.transaction.input.toHexString().slice(0, 10) == "0x51945447") {
    const tx = new HatsAccount1ofNTransaction(
      event.block.number
        .toString()
        .concat("-")
        .concat(event.logIndex.toString())
    );
    tx.hatsAccount = hatsAccount1ofN.id;
    tx.signer = event.params.signer.toHexString();

    // slice method signature and prepend data location offset
    const preparedCallData = Bytes.fromHexString(
      "0x0000000000000000000000000000000000000000000000000000000000000020".concat(
        event.transaction.input.toHexString().slice(10)
      )
    );

    const decodedCallData = ethereum.decode(
      "(address,uint256,bytes,uint8)",
      preparedCallData
    ) as ethereum.Value;
    const decodedCallDataTuple = decodedCallData.toTuple();

    tx.to = decodedCallDataTuple[0].toAddress().toHexString();
    tx.value = decodedCallDataTuple[1].toBigInt();
    tx.callData = decodedCallDataTuple[2].toBytes();
    tx.save();
  }

  // batch execution
  if (event.transaction.input.toHexString().slice(0, 10) == "0x43629a73") {
    //const toParam = ethereum.Value.fromAddress(
    //  Address.fromString("0x3bc1A0Ad72417f2d411118085256fC53CBdDd137")
    //);
    //const valueParam = ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(5));
    //const dataParam = ethereum.Value.fromBytes(Bytes.fromHexString("0x1234"));
    //const operationParam = ethereum.Value.fromI32(1);
    //const arr: Array<ethereum.Value> = [
    //  toParam,
    //  valueParam,
    //  dataParam,
    //  operationParam,
    //];
    //const tuple = changetype<ethereum.Tuple>(arr);
    //const tupleArray = [tuple];
    //const tupleArrayValue = ethereum.Value.fromTupleArray(tupleArray);
    //const encoded = ethereum.encode(tupleArrayValue) as Bytes;
    //log.info("encoded : {}", [encoded.toHexString()]);

    //const decoded = ethereum.decode(
    //  "(address,uint256,bytes,uint8)[]",
    //  encoded
    //) as ethereum.Value;
    //const decodedTupleArray = decoded.toTupleArray<ethereum.Tuple>();
    //const decodedTuple = decodedTupleArray[0];
    //log.info("val 1: {}", [decodedTuple[0].toAddress().toHexString()]);

    const preparedCallData = Bytes.fromHexString(
      event.transaction.input.toHexString().slice(10)
    );

    const decodedCallData = ethereum.decode(
      "(address,uint256,bytes,uint8)[]",
      preparedCallData
    ) as ethereum.Value;
    const decodedTuples = decodedCallData.toTupleArray<ethereum.Tuple>();
    for (let tupleIndex = 0; tupleIndex < decodedTuples.length; tupleIndex++) {
      const tx = new HatsAccount1ofNTransaction(
        event.block.number
          .toString()
          .concat("-")
          .concat(
            event.logIndex.toString().concat("-").concat(tupleIndex.toString())
          )
      );
      tx.hatsAccount = hatsAccount1ofN.id;
      tx.signer = event.params.signer.toHexString();

      const tuple = decodedTuples[tupleIndex];
      tx.to = tuple[0].toAddress().toHexString();
      tx.value = tuple[1].toBigInt();
      tx.callData = tuple[2].toBytes();
      tx.save();
    }
  }

  hatsAccount1ofN.save();
}
