---
id: kraken-exchange
title: Kraken Exchange
sidebar_label: Kraken Exchange
hide_table_of_contents: true
image: /img/og-images/btcpay-kraken.png
---

This flow instantly exchanges a defined percentage of Bitcoin amount from each paid invoice to fiat using [Kraken](https://www.kraken.com/).

It is useful when you have to convert some part of your Bitcoin revenue to fiat to cover business expenses and want to cut the short term volatility risks.

![Kraken Exchange Flow](./assets/kraken-exchange.png)

## Prerequisites

This flow requires the following node to be installed on your Node-RED:

- [node-red-contrib-kraken](https://github.com/redbtc/node-red-contrib-kraken)

## Configuration & Setup

1. Import the Node-RED Flow
2. Open the "Configuration nodes" panel in Node-RED (via tabs on the right panel or `ctrl-g c` shortcut) and configure the config-nodes:
   - **btcpay-api-config** - create a store on your BTCPay Server and pair the node with it ([read more](/docs/configuration))
   - **kraken-api-config** - create Kraken API keys and copy/paste them to the node ([read more](https://github.com/redbtc/node-red-contrib-kraken#configuration))
3. Double-click the initial "/btcpay-ipn" node and [configure it](/docs/handling-ipn) to receive POST notifications from your BTCPay Server
4. Now add the notification URL to the processes that create invoices for you. Calls to BTCPay's Create Invoice API should have the `notificationUrl` property with the URL you specified in the previous step
5. Double-click the "🔨 Volume calc" node and set your formula for calculating the amount of Bitcoin to exchange (by default, the flow calcs 20% of the amount)
6. Double-click the "🔨 Order params" node and change the params of Kraken orders (by default, the flow adds market orders to sell on BTCUSD)
7. Push `Deploy`
8. Done! Now the flow will automatically add an order on Kraken for each paid invoice.

## Node-RED Flow

```json
[
    {
        "id": "b90eb096.32c2f",
        "type": "btcpay-ipn",
        "z": "1cb4cf41.7bd001",
        "client": "9711e4a7.bae348",
        "path": "/btcpay-ipn",
        "name": "",
        "x": 300,
        "y": 220,
        "wires": [
            [
                "c491e699.0bf9e8"
            ]
        ]
    },
    {
        "id": "c491e699.0bf9e8",
        "type": "switch",
        "z": "1cb4cf41.7bd001",
        "name": "check status",
        "property": "payload.status",
        "propertyType": "msg",
        "rules": [
            {
                "t": "eq",
                "v": "confirmed",
                "vt": "str"
            },
            {
                "t": "eq",
                "v": "complete",
                "vt": "str"
            }
        ],
        "checkall": "false",
        "repair": false,
        "outputs": 2,
        "x": 490,
        "y": 220,
        "wires": [
            [
                "4864de49.03da7"
            ],
            [
                "4864de49.03da7"
            ]
        ]
    },
    {
        "id": "b2abd0f9.5e357",
        "type": "change",
        "z": "1cb4cf41.7bd001",
        "name": "🔨 Order params",
        "rules": [
            {
                "t": "set",
                "p": "payload.pair",
                "pt": "msg",
                "to": "BTCUSD",
                "tot": "str"
            },
            {
                "t": "set",
                "p": "payload.type",
                "pt": "msg",
                "to": "sell",
                "tot": "str"
            },
            {
                "t": "set",
                "p": "payload.ordertype",
                "pt": "msg",
                "to": "market",
                "tot": "str"
            },
            {
                "t": "move",
                "p": "volume",
                "pt": "msg",
                "to": "payload.volume",
                "tot": "msg"
            }
        ],
        "action": "",
        "property": "",
        "from": "",
        "to": "",
        "reg": false,
        "x": 710,
        "y": 240,
        "wires": [
            [
                "4c28fe8c.17c1a"
            ]
        ]
    },
    {
        "id": "4c28fe8c.17c1a",
        "type": "kraken-api",
        "z": "1cb4cf41.7bd001",
        "client": "e7d5dfc4.78443",
        "method": "private/AddOrder",
        "name": "",
        "x": 920,
        "y": 220,
        "wires": [
            []
        ]
    },
    {
        "id": "4864de49.03da7",
        "type": "function",
        "z": "1cb4cf41.7bd001",
        "name": "🔨 Volume calc",
        "func": "// order volume = 20% of <btc paid>\nmsg.volume = parseFloat(msg.payload.btcPaid) * 0.2;\n\nif (isNaN(msg.volume)) {\n    throw new Error(\"Got invalid `msg.payload.btcPaid` value\")\n}\n\ndelete msg.payload;\n\nreturn msg;",
        "outputs": 1,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "x": 700,
        "y": 200,
        "wires": [
            [
                "b2abd0f9.5e357"
            ]
        ]
    },
    {
        "id": "9711e4a7.bae348",
        "type": "btcpay-api-config",
        "z": "",
        "name": ""
    },
    {
        "id": "e7d5dfc4.78443",
        "type": "kraken-api-config",
        "z": "",
        "name": "Kraken Client"
    }
]
```
