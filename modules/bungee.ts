import { Hex, parseEther } from "viem"
import { getEthWalletClient } from "../utils/ethClient"
import { makeLogger } from "../utils/logger"
import { bungeeAbi } from "../data/abi/bungee"
import { random, sleep } from "../utils/common"

export class BungeeRefuel {
    privateKey: Hex
    bungeeContractAddress:Hex = '0xb584d4be1a5470ca1a8778e9b86c81e165204599'
    logger: any
    wallet: any
    networks: Array<number>
    randomNetwork: number

    constructor(privateKey:Hex) {
        this.privateKey = privateKey
        this.logger = makeLogger("Bungee refuel")
        this.wallet = getEthWalletClient(privateKey)
        this.networks = [
            10,
            56,
            137,
            42161
        ]
        this.randomNetwork = this.networks[random(0, this.networks.length-1)]
    }

    async refuel(amount: string) {
        const value: bigint = BigInt(parseEther(amount))

        this.logger.info(`${this.wallet.account.address} | Bungee refuel ${amount} ETH`)
        
        let isSuccess = false
        let retryCount = 1
        
        while (!isSuccess) {
            try {
                const txHash = await this.wallet.writeContract({
                    address: this.bungeeContractAddress,
                    abi: bungeeAbi,
                    functionName: 'depositNativeToken',
                    args: [
                        this.randomNetwork,
                        this.wallet.account.address,
                    ],
                    value: value
                })
                isSuccess = true
                this.logger.info(`${this.wallet.account.address} | Bungee refuel done: https://etherscan.io/tx/${txHash}`)
            } catch (e) {
                this.logger.error(`${this.wallet.account.address} | Bungee refuel error: ${e.shortMessage}`)

                if (retryCount <= 3) {
                    this.logger.info(`${this.wallet.account.address} | Wait 30 sec and retry bridge ${retryCount}/3`)
                    retryCount++
                    await sleep(30 * 1000)
                } else {
                    isSuccess = true
                    this.logger.info(`${this.wallet.account.address} | bridge unsuccessful, skip`)
                }
            }
        }
    }
}