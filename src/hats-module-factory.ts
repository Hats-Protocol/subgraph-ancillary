import { HatsModuleFactory_ModuleDeployed as HatsModuleFactory_ModuleDeployedEvent } from "../generated/HatsModuleFactory/HatsModuleFactory"
import { HatsModuleFactory_ModuleDeployed } from "../generated/schema"

export function handleHatsModuleFactory_ModuleDeployed(
  event: HatsModuleFactory_ModuleDeployedEvent
): void {
  let entity = new HatsModuleFactory_ModuleDeployed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.implementation = event.params.implementation
  entity.instance = event.params.instance
  entity.hatId = event.params.hatId
  entity.otherImmutableArgs = event.params.otherImmutableArgs
  entity.initData = event.params.initData

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
