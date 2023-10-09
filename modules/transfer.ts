import { Hex, parseEther } from "viem"
import { getEthWalletClient } from "../utils/ethClient"
import { makeLogger } from "../utils/logger"
import { sleep } from "../utils/common"

export class Transfer {
    privateKey: Hex
    logger: any
    wallet: any

    constructor(privateKey:Hex) {
        this.privateKey = privateKey
        this.logger = makeLogger("Transfer")
        this.wallet = getEthWalletClient(privateKey)
    }

    async transfer(amount: bigint, recipient: Hex) {
        this.logger.info(`${this.wallet.account.address} | Transfer ETH`)

        let isSuccess = false
        let retryCount = 1
        
        while (!isSuccess) {
            try {
                const txHash = await this.wallet.sendTransaction({ 
                    to: recipient,
                    value: amount
                })
                isSuccess = true
                this.logger.info(`${this.wallet.account.address} | Transfer done: https://etherscan.io/tx/${txHash}`)
            } catch (e) {
                this.logger.error(`${this.wallet.account.address} | Transfer error: ${e.shortMessage}`)

                if (retryCount <= 3) {
                    this.logger.info(`${this.wallet.account.address} | Wait 30 sec and retry transfer ${retryCount}/3`)
                    retryCount++
                    await sleep(30 * 1000)
                } else {
                    isSuccess = true
                    this.logger.info(`${this.wallet.account.address} | transfer unsuccessful, skip`)
                }
            }
        }
    }
}