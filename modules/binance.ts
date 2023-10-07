import { binance } from '../config'
import axios from 'axios'
import crypto from 'crypto'

export class Binance {
    binanceEndpoint:string = 'https://api.binance.com/sapi/v1/capital/withdraw/apply'

    async withdraw(amount: string) {
        const timestamp = Date.now()
        const queryString = `timestamp=${timestamp}`
        const signature = crypto.createHmac('sha256', binance.secret).update(`timestamp=${timestamp}`).digest('hex')
        const queryParams = `?${queryString}&signature=${signature}`
        
        axios.post(this.binanceEndpoint+queryParams, {
            coin: 'ETH',
            network: 'Base',
            address: '',
            amount: amount
        }, {
            headers: {
                'X-MBX-APIKEY': binance.key
            }
        })
    }
}