export const generalConfig = {
    sleepFrom: 60,
    sleepTo: 150,
    maxGas: 7,
    maxAddressTxCount: 10,
    maxTxPerRun: 3,
    shuffleModules: false,
    modules: [
        'base_bridge',
        'zora_bridge',
        'zk_bridge',
        'starknet_bridge',
        'transfer',
        'bungee_refuel',
        'mintfun'
    ]
}

export const baseBridgeConfig = {
    bridgeFrom: 0.001,
    bridgeTo: 0.002
}

export const zoraBridgeConfig = {
    bridgeFrom: 0.001,
    bridgeTo: 0.002
}

export const zkBridgeConfig = {
    bridgeFrom: 0.001,
    bridgeTo: 0.002
}

export const starknetBridgeConfig = {
    bridgeFrom: 0.001,
    bridgeTo: 0.002
}

export const transferConfig = {
    percentSendFrom: 85,
    percentSendTo: 90
}

export const bungeeBridgeConfig = {
    refuelFrom: 0.00001,
    refuelTo: 0.00002
}