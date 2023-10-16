export const generalConfig = {
    rpc: 'https://rpc.ankr.com/eth',
    sleepFrom: 200,
    sleepTo: 300,
    maxGas: 15,
    maxAddressTxCount: 100,
    maxTxPerRun: 3,
    shuffleModules: false,
    modules: [
        'zora_bridge',
        'bungee',
        'transfer'
    ]

    // 'base_bridge'
    // 'zora_bridge'
    // 'zk_bridge'
    // 'starknet_bridge'
    // 'bungee'
    // 'mintfun'
    // 'transfer'
}

export const baseBridgeConfig = {
    bridgeFrom: 0.001,
    bridgeTo: 0.0012
}

export const zoraBridgeConfig = {
    bridgeFrom: 0.001,
    bridgeTo: 0.0012
}

export const zkBridgeConfig = {
    bridgeFrom: 0.001,
    bridgeTo: 0.0012
}

export const starknetBridgeConfig = {
    bridgeFrom: 0.0005,
    bridgeTo: 0.0006
}

export const transferConfig = {
    percentSendFrom: 95,
    percentSendTo: 97
}

export const bungeeBridgeConfig = {
    refuelFrom: 0.00001,
    refuelTo: 0.00002
}