import { ethereum } from "@graphprotocol/graph-ts";

export function createEventID(event: ethereum.Event, name: string): string {
  return name
    .concat("-")
    .concat(event.block.number.toString())
    .concat("-")
    .concat(event.logIndex.toString());
}
