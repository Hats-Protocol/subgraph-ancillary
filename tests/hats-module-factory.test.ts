import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import { HatsModuleFactory_ModuleDeployed } from "../generated/schema"
import { HatsModuleFactory_ModuleDeployed as HatsModuleFactory_ModuleDeployedEvent } from "../generated/HatsModuleFactory/HatsModuleFactory"
import { handleHatsModuleFactory_ModuleDeployed } from "../src/hats-module-factory"
import { createHatsModuleFactory_ModuleDeployedEvent } from "./hats-module-factory-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let implementation = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let instance = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let hatId = BigInt.fromI32(234)
    let otherImmutableArgs = Bytes.fromI32(1234567890)
    let initData = Bytes.fromI32(1234567890)
    let newHatsModuleFactory_ModuleDeployedEvent = createHatsModuleFactory_ModuleDeployedEvent(
      implementation,
      instance,
      hatId,
      otherImmutableArgs,
      initData
    )
    handleHatsModuleFactory_ModuleDeployed(
      newHatsModuleFactory_ModuleDeployedEvent
    )
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("HatsModuleFactory_ModuleDeployed created and stored", () => {
    assert.entityCount("HatsModuleFactory_ModuleDeployed", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "HatsModuleFactory_ModuleDeployed",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "implementation",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "HatsModuleFactory_ModuleDeployed",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "instance",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "HatsModuleFactory_ModuleDeployed",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "hatId",
      "234"
    )
    assert.fieldEquals(
      "HatsModuleFactory_ModuleDeployed",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "otherImmutableArgs",
      "1234567890"
    )
    assert.fieldEquals(
      "HatsModuleFactory_ModuleDeployed",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "initData",
      "1234567890"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
