import { Hex, parseEther } from "viem"
import { getEthWalletClient } from "../utils/ethClient"
import { makeLogger } from "../utils/logger"

export class Transfer {
    privateKey: Hex
    logger: any
    wallet: any

    constructor(privateKey:Hex) {
        this.privateKey = privateKey
        this.logger = makeLogger("Transfer")
        this.wallet = getEthWalletClient(privateKey)
    }

    async bridge(amount: bigint, recipient: Hex) {
        this.logger.info(`${this.wallet.account.address} | Transfer ETH`)
        
        try {
            const txHash = await this.wallet.sendTransaction({ 
                to: recipient,
                value: amount
            })
        
            this.logger.info(`${this.wallet.account.address} | Transfer done: https://etherscan.io/tx/${txHash}`)
        } catch (e) {
            this.logger.error(`${this.wallet.account.address} | Transfer error: ${e.shortMessage}`)
        }
    }
}