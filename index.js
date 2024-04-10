
const http = require('http');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello, world!\n');
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const WebSocket = require("ws");
const ws = new WebSocket(`${process.env.STREAM_URL_DEV}/${process.env.SYMBOL.toLowerCase()}@ticker`);

const PROFITABILITY = parseFloat(process.env.PROFITABILITY);
let sellPrice = 0;

ws.onmessage = async (event) => {
    console.clear();
    const obj = JSON.parse(event.data);
    console.log(`Symbol: ${obj.s}`);
    console.log(`Ask Price: ${obj.a}`);

    const currentPrice = parseFloat(obj.a);
    if (sellPrice == 0 && currentPrice < 70000 ) {
        console.log('Bom pra Comprar');
        await newOrder("BUY", "0.001");
        sellPrice = currentPrice + (currentPrice * PROFITABILITY);
    } else if (sellPrice !== 0 &&  currentPrice >= 16000) {
        console.log('Bom pra Vender');
        await newOrder("SELL", "0.001");
        sellPrice = 0;
    }
    console.log(`Esperando..`);
    console.log(`SellPrice: ${sellPrice}`);
}

const axios = require('axios');
const crypto = require('crypto');

async function newOrder(side, quantity) {
    const data = {
        symbol: process.env.SYMBOL,
        type: 'MARKET',
        side,
        quantity
    }

    const timestamp = Date.now();
    const recvwindow = 5000;

    const signature = crypto
        .createHmac('sha256', process.env.SECRET_KEY)
        .update(`${new URLSearchParams({ ...data, timestamp, recvwindow })}`)
        .digest('hex');

    const newData = { ...data, timestamp, recvwindow, signature };
    const qs = `${new URLSearchParams(newData)}`;
    try {
        const result = await axios({
            method: 'POST',
            url: `${process.env.API_URL}/v3/order${qs}`,
            headers: { 'X-MBX-APIKEY': process.env.API_KEY }
        });
        console.log(result.data);
    } catch (err) {
        console.error(err);
    }
}

