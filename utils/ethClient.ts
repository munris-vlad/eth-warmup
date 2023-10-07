import {
    Chain,
    createPublicClient,
    createWalletClient, defineChain,
    Hex,
    http,
    HttpTransport,
    PrivateKeyAccount, PublicClient,
    WalletClient
} from "viem"
import {privateKeyToAccount} from "viem/accounts"
import {mainnet} from "viem/chains"

function getPublicEthClient(): PublicClient {
    return createPublicClient({ chain: mainnet, transport: http() })
}

function getEthWalletClient(privateKey: Hex): WalletClient<HttpTransport, Chain, PrivateKeyAccount> {
    return createWalletClient({ chain: mainnet, account: privateKeyToAccount(privateKey), transport: http() })
}

export { getPublicEthClient, getEthWalletClient }