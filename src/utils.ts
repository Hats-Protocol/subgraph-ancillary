import { BigInt } from "@graphprotocol/graph-ts";

export function hatIdToHex(hatId: BigInt): string {
  return (
    "0x" +
    hatId
      .toHexString()
      .slice(2)
      .padStart(64, "0")
  );
}

export function topHatDomainToHatId(domain: BigInt): string {
  let hexDomain = topHatDomainToHex(domain);
  return hexDomain.padEnd(66, "0");
}

export function topHatDomainHexToHatId(domain: string): string {
  return domain.padEnd(66, "0");
}

export function hatIdToPrettyId(hatId: BigInt): string {
  let hexId = hatIdToHex(hatId);
  let prettyId = hexId.substring(0, 10);
  for (let i = 10; i < hexId.length; i += 4) {
    let domainAtLevel = hexId.substring(i, i + 4);
    if (domainAtLevel == "0000") {
      break;
    }
    prettyId += "." + domainAtLevel;
  }
  return prettyId;
}

export function hatIdHexToPrettyId(hatId: string): string {
  let prettyId = hatId.substring(0, 10);
  for (let i = 10; i < hatId.length; i += 4) {
    let domainAtLevel = hatId.substring(i, i + 4);
    if (domainAtLevel == "0000") {
      break;
    }
    prettyId += "." + domainAtLevel;
  }
  return prettyId;
}

export function topHatDomain(hatId: BigInt): string {
  let hatIdHex = hatIdToHex(hatId);
  return hatIdHex.substring(0, 10);
}

export function hexTopHatDomain(hatId: string): string {
  return hatId.substring(0, 10);
}

export function topHatDomainToHex(domain: BigInt): string {
  return (
    "0x" +
    domain
      .toHexString()
      .slice(2)
      .padStart(8, "0")
  );
}

export function changeEndianness(s: string): string {
  const res = new Array<string>();
  res.push("0x");
  let pos = s.length - 2;
  while (pos >= 2) {
    res.push(s.substring(pos, pos + 2));
    pos -= 2;
  }
  return res.join("");
}
