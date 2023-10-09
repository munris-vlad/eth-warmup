import {formatEther, Hex, parseEther, toHex} from "viem"
import { getEthWalletClient, getPublicEthClient } from "../utils/ethClient"
import { zoraBridgeAbi } from "../data/abi/zora-bridge"
import { makeLogger } from "../utils/logger"
import { sleep } from "../utils/common"

export class ZoraBridge {
    privateKey: Hex
    bridgeContractAddress:Hex = '0x1a0ad011913a150f69f6a19df447a0cfd9551054'
    logger: any
    wallet: any

    constructor(privateKey:Hex) {
        this.privateKey = privateKey
        this.logger = makeLogger("Zora bridge")
        this.wallet = getEthWalletClient(privateKey)
    }

    async bridge(amount: string) {
        const value: bigint = BigInt(parseEther(amount))

        this.logger.info(`${this.wallet.account.address} | Zora bridge ${amount} ETH`)

        let isSuccess = false
        let retryCount = 1
        
        while (!isSuccess) {
            try {
                const txHash = await this.wallet.writeContract({
                    address: this.bridgeContractAddress,
                    abi: zoraBridgeAbi,
                    functionName: 'depositTransaction',
                    args: [
                        this.wallet.account.address, 
                        value.toString(), 
                        BigInt(100000), 
                        false, 
                        '0x'
                    ],
                    value: value
                })
                
                isSuccess = true

                this.logger.info(`${this.wallet.account.address} | Zora bridge done: https://etherscan.io/tx/${txHash}`)
            } catch (e) {
                if (retryCount <= 3) {
                    this.logger.info(`${this.wallet.account.address} | Wait 30 sec and retry bridge ${retryCount}/3`)
                    retryCount++
                    await sleep(30 * 1000)
                } else {
                    isSuccess = true
                    this.logger.info(`${this.wallet.account.address} | Bridge unsuccessful, skip`)
                }
                
                this.logger.error(`${this.wallet.account.address} | Zora bridge error: ${e.shortMessage}`)
            }
        }
    }
}