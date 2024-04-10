/**
 * 1 - MONTORAMENTO
 * 
 * 2- ESTRATÉGIA
 * 
 * 3 - TRADES
 * 
 * 
 */
const http = require('http');
//const dotenv = require('dotenv');
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
//
ws.onmessage = (event) => {
    console.clear();
    const obj = JSON.parse(event.data);
    console.log(`Symbol: ${obj.s}`);
    console.log(`Ask Price: ${obj.a}`);

    const currentPrice = parseFloat(obj.a);
    if (sellPrice == 0 && currentPrice < 70000 ) {
        console.log('Comprar');
        sellPrice = currentPrice + (currentPrice * PROFITABILITY);
        //

    } else if (sellPrice !== 0 &&  currentPrice >= 16000) {
        console.log('Vender');
        sellPrice = 0;
    }
    console.log(`Esperando..`);
    console.log(`SellPrice: ${sellPrice}`);

}