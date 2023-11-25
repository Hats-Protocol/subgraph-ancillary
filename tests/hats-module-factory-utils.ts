import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import { HatsModuleFactory_ModuleDeployed } from "../generated/HatsModuleFactory/HatsModuleFactory"

export function createHatsModuleFactory_ModuleDeployedEvent(
  implementation: Address,
  instance: Address,
  hatId: BigInt,
  otherImmutableArgs: Bytes,
  initData: Bytes
): HatsModuleFactory_ModuleDeployed {
  let hatsModuleFactoryModuleDeployedEvent = changetype<
    HatsModuleFactory_ModuleDeployed
  >(newMockEvent())

  hatsModuleFactoryModuleDeployedEvent.parameters = new Array()

  hatsModuleFactoryModuleDeployedEvent.parameters.push(
    new ethereum.EventParam(
      "implementation",
      ethereum.Value.fromAddress(implementation)
    )
  )
  hatsModuleFactoryModuleDeployedEvent.parameters.push(
    new ethereum.EventParam("instance", ethereum.Value.fromAddress(instance))
  )
  hatsModuleFactoryModuleDeployedEvent.parameters.push(
    new ethereum.EventParam("hatId", ethereum.Value.fromUnsignedBigInt(hatId))
  )
  hatsModuleFactoryModuleDeployedEvent.parameters.push(
    new ethereum.EventParam(
      "otherImmutableArgs",
      ethereum.Value.fromBytes(otherImmutableArgs)
    )
  )
  hatsModuleFactoryModuleDeployedEvent.parameters.push(
    new ethereum.EventParam("initData", ethereum.Value.fromBytes(initData))
  )

  return hatsModuleFactoryModuleDeployedEvent
}
