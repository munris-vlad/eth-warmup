import {formatEther, Hex, parseEther, toHex} from "viem"
import { getEthWalletClient, getPublicEthClient } from "../utils/ethClient"
import { mintfunAbi } from "../data/abi/mintfun"
import { zerionDnaAbi } from "../data/abi/zerion-dna"
import { makeLogger } from "../utils/logger"
import { random } from "../utils/common"

export class Mintfun {
    privateKey: Hex
    randomContract:Hex
    contracts: Array<Hex> = [
        '0xF639B4EbB77DF1ed4b5014C244F60E72B8AdB29b',
        // '0x932261f9Fc8DA46C4a22e31B45c4De60623848bF',
    ]
    logger: any
    wallet: any

    constructor(privateKey:Hex) {
        this.privateKey = privateKey
        this.logger = makeLogger("Mintfun")
        this.wallet = getEthWalletClient(privateKey)
        this.randomContract = this.contracts[random(0, this.contracts.length-1)]
    }

    async mint() {
        this.logger.info(`${this.wallet.account.address} | Mintfun ${this.randomContract}`)
    
        try {
            let txHash

            if (this.randomContract === '0xF639B4EbB77DF1ed4b5014C244F60E72B8AdB29b') {
                txHash = await this.wallet.writeContract({
                    address: this.randomContract,
                    abi: mintfunAbi,
                    functionName: 'mint',
                    args: [1]
                })
            }

            if (this.randomContract === '0x932261f9Fc8DA46C4a22e31B45c4De60623848bF') {
                txHash = await this.wallet.sendTransaction({
                    to: this.randomContract,
                    data: '0x1249c58b'
                })
            }
        
            this.logger.info(`${this.wallet.account.address} | Mintfun done: https://etherscan.io/tx/${txHash}`)
        } catch (e) {
            this.logger.error(`${this.wallet.account.address} | Mintfun error: ${e.shortMessage}`)
        }
    }
}