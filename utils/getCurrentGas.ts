import { formatGwei } from "viem"
import { getPublicEthClient } from "./ethClient"
import { generalConfig } from "../config"
import { makeLogger } from "./logger"
import { sleep } from "./common"

export async function getCurrentGas() {
    const client = getPublicEthClient()
    const gas = await client.getGasPrice()

    return parseFloat(formatGwei(gas))
}

export async function waitGas() {
    const logger = makeLogger("Gas checker")
    let isGoodGas = false
    while (!isGoodGas) {
        const currentGas = await getCurrentGas()
        if (currentGas > generalConfig.maxGas) {
            logger.info(`Ждем газ ${generalConfig.maxGas}. Текущий газ: ${currentGas.toFixed(1)}`)
            await sleep(10 * 1000)
        } else {
            return true
        }
    }
}