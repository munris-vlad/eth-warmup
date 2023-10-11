import { Hex, formatGwei } from "viem"
import { getPublicEthClient } from "./ethClient"

export async function getAddressTxCount(address: Hex) {
    const client = getPublicEthClient()
    return await client.getTransactionCount({
        address: address
    })
}