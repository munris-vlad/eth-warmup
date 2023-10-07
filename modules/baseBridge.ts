import {formatEther, Hex, parseEther, toHex} from "viem"
import { getEthWalletClient, getPublicEthClient } from "../utils/ethClient"
import { baseBridgeAbi } from "../data/abi/base-bridge"
import { makeLogger } from "../utils/logger"

export class BaseBridge {
    privateKey: Hex
    bridgeContractAddress:Hex = '0x49048044D57e1C92A77f79988d21Fa8fAF74E97e'
    logger: any
    wallet: any

    constructor(privateKey:Hex) {
        this.privateKey = privateKey
        this.logger = makeLogger("Base bridge")
        this.wallet = getEthWalletClient(privateKey)
    }

    async bridge(amount: string) {
        const value: bigint = BigInt(parseEther(amount))

        this.logger.info(`${this.wallet.account.address} | Base bridge ${amount} ETH`)
    
        const args: readonly [
            `0x${string}`,
            bigint,
            bigint,
            boolean,
            `0x${string}`
        ] = [this.wallet.account.address, value, BigInt(100000), false, '0x']
        
        try {
            const txHash = await this.wallet.writeContract({
                address: this.bridgeContractAddress,
                abi: baseBridgeAbi,
                functionName: 'depositTransaction',
                args: args,
                value: value
            })
        
            this.logger.info(`${this.wallet.account.address} | Base bridge done: https://etherscan.io/tx/${txHash}`)
        } catch (e) {
            this.logger.error(`${this.wallet.account.address} | Base bridge error: ${e.shortMessage}`)
        }
    }
}