import { Hex, parseEther } from "viem"
import { getEthWalletClient, getPublicEthClient } from "../utils/ethClient"
import { zkBridgeAbi } from "../data/abi/zk-bridge"
import { makeLogger } from "../utils/logger"
import { random, sleep } from "../utils/common"

export class ZkBridge {
    privateKey: Hex
    bridgeContractAddress:Hex = '0x32400084C286CF3E17e7B677ea9583e60a000324'
    logger: any
    wallet: any
    client: any

    constructor(privateKey:Hex) {
        this.privateKey = privateKey
        this.logger = makeLogger("Zk bridge")
        this.wallet = getEthWalletClient(privateKey)
        this.client = getPublicEthClient()
    }

    async getBridgeCost(gasPrice: bigint, gasLimit: number) {
        const amountForTx = this.client.readContract({
            address: this.bridgeContractAddress,
            abi: zkBridgeAbi,
            functionName: 'l2TransactionBaseCost',
            args: [
                gasPrice,
                gasLimit,
                800
            ]
        })

        return amountForTx
    }

    async bridge(amount: string) {
        let value: bigint = BigInt(parseEther(amount))
        const gasPrice = await this.client.getGasPrice()
        const gasLimit = random(700000, 1000000)
        const bridgeCost = await this.getBridgeCost(gasPrice, gasLimit)

        value = value + bridgeCost

        this.logger.info(`${this.wallet.account.address} | Zk bridge ${amount} ETH`)
        let isSuccess = false
        let retryCount = 1
        
        while (!isSuccess) {
            try {
                const txHash = await this.wallet.writeContract({
                    address: this.bridgeContractAddress,
                    abi: zkBridgeAbi,
                    functionName: 'requestL2Transaction',
                    args: [
                        this.wallet.account.address,
                        parseEther(amount),
                        '0x',
                        gasLimit,
                        800,
                        [],
                        this.wallet.account.address
                    ],
                    value: value
                })
                
                isSuccess = true

                this.logger.info(`${this.wallet.account.address} | Zk bridge done: https://etherscan.io/tx/${txHash}`)
            } catch (e) {
                this.logger.error(`${this.wallet.account.address} | Zk bridge error: ${e.shortMessage}`)

                if (retryCount <= 3) {
                    this.logger.info(`${this.wallet.account.address} | Wait 30 sec and retry bridge ${retryCount}/3`)
                    retryCount++
                    await sleep(30 * 1000)
                } else {
                    isSuccess = true
                    this.logger.info(`${this.wallet.account.address} | Bridge unsuccessful, skip`)
                }
            }
        }
    }
}