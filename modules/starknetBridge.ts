import * as starknet from "starknet"
import { Hex, encodeFunctionData, parseEther } from "viem"
import { getEthWalletClient, getPublicEthClient } from "../utils/ethClient"
import { makeLogger } from "../utils/logger"
import { sleep } from "../utils/common"
import { starknetBridgeAbi } from "../data/abi/starknet-bridge"

export class StarknetBridge {
    privateKey: Hex
    bridgeContractAddress:Hex = '0xae0ee0a63a2ce6baeeffe56e7714fb4efe48d419'
    bridgeContractAddressL2:Hex = '0x073314940630fd6dcda0d772d4c972c4e0a9946bef9dabf4ef84eda8ef542b82'
    logger: any
    wallet: any
    client: any
    starknetAddress: string

    constructor(privateKey:Hex, starknetAddress: string) {
        this.privateKey = privateKey
        this.logger = makeLogger("Starknet bridge")
        this.wallet = getEthWalletClient(privateKey)
        this.client = getPublicEthClient()
        this.starknetAddress = starknetAddress
    }

    async getEstimateL2Fee(amount: bigint) {
        const tmpStarkProvider = new starknet.SequencerProvider({
            baseUrl: starknet.constants.BaseUrl.SN_MAIN,
        })

        const estimatedFee = await tmpStarkProvider.estimateMessageFee({
            from_address: this.bridgeContractAddress,
            to_address: this.bridgeContractAddressL2,
            entry_point_selector: "handle_deposit",
            payload: [
                this.starknetAddress,
                amount.toString(),
                '0'
            ],
        })

        // @ts-ignore
        return estimatedFee.overall_fee
    }

    async bridge(amount: string) {
        let value: bigint = BigInt(parseEther(amount))
        const gasL2 = await this.getEstimateL2Fee(value)

        this.logger.info(`${this.wallet.account.address} | Starknet bridge ${amount} ETH`)
        
        let isSuccess = false
        let retryCount = 1
        
        while (!isSuccess) {
            try {
                const txHash = await this.wallet.writeContract({
                    address: this.bridgeContractAddress,
                    abi: starknetBridgeAbi,
                    functionName: 'deposit',
                    args: [
                        value,
                        BigInt(this.starknetAddress)
                    ],
                    value: BigInt(Number(value)+Number(gasL2))
                })

                isSuccess = true
                
                this.logger.info(`${this.wallet.account.address} | Starknet bridge done: https://etherscan.io/tx/${txHash}`)
            } catch (e) {
                console.log(e)
                this.logger.error(`${this.wallet.account.address} | Starknet bridge error: ${e.shortMessage}`)

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