import { Hex, formatGwei } from "viem"
import { getPublicEthClient } from "./ethClient"
import { generalConfig } from "../config"
import { makeLogger } from "./logger"
import { sleep } from "./common"

export async function getAddressTxCount(address: Hex) {
    const client = getPublicEthClient()
    return await client.getTransactionCount({
        address: address
    })
}