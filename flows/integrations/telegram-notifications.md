---
id: telegram-notifications
title: Telegram Notifications
sidebar_label: Telegram Notifications
hide_table_of_contents: true
---

This flow will send you notifications about paid invoices using a Telegram bot.

![Telegram Notifications Flow](./assets/telegram-notifications.png)

## Prerequisites

This flow requires the following node to be installed on your Node-RED:

- [node-red-contrib-telegrambot](https://github.com/windkh/node-red-contrib-telegrambot)

## Configuration & Setup

1. Import the Node-RED Flow
2. In the "IPN Handler" section of the flow double-click the initial node and specify URL for receiving POST notifications from BTCPay Server
3. Now add the notification URL to Node-RED flows and/or other servers creating invoices for you. Calls to BTCPay's Create Invoice API should have the `notificationUrl` property with the URL you specified in the previous step
4. Open the "Configuration nodes" panel in Node-RED (via tabs on the right panel or `ctrl-g c` shortcut) and configure the config-nodes:
   - **btcpay-api-config** - create a store on your BTCPay Server and pair the node with it ([read more](https://redbtc.org/docs/configuration/))
   - **telegram bot** - [create a Telegram bot](https://core.telegram.org/bots#6-botfather) and copy/paste the token into the config-node
5. Push `Deploy`
6. Open chat with your Bot and send `/tellmyid` command
7. Copy your id
8. Double-click the "🔨 TG data" node and paste your id into `msg.payload.chatId` property
9. Push `Deploy`
10. Done! Now the bot will send you notifications about paid invoices. You might edit the notification template in the "msgText = Invoice Paid" node.

## Node-RED Flow

```json
[
  {
    "id": "82d06f0.9fd349",
    "type": "template",
    "z": "ee9c9c24.20b96",
    "name": "msgText = Invoice Paid",
    "field": "msgText",
    "fieldType": "msg",
    "format": "handlebars",
    "syntax": "mustache",
    "template": "⚡ Invoice has been paid ⚡\n\nID: <b>{{payload.id}}</b>\nPrice: <b>{{payload.price}}</b>\nCurrency: <b>{{payload.currency}}</b>",
    "output": "str",
    "x": 1030,
    "y": 440,
    "wires": [["180d7108.a3e0cf"]]
  },
  {
    "id": "eb5cc73f.92dc38",
    "type": "http in",
    "z": "ee9c9c24.20b96",
    "name": "",
    "url": "/btcpay-ipn/",
    "method": "post",
    "upload": false,
    "swaggerDoc": "",
    "x": 210,
    "y": 400,
    "wires": [["2b99d4ed.5ea19c"]]
  },
  {
    "id": "b68020ac.2ca1d",
    "type": "http response",
    "z": "ee9c9c24.20b96",
    "name": "http response = ok",
    "statusCode": "",
    "headers": {},
    "x": 730,
    "y": 400,
    "wires": []
  },
  {
    "id": "2b99d4ed.5ea19c",
    "type": "change",
    "z": "ee9c9c24.20b96",
    "name": "Prepare data for API",
    "rules": [
      {
        "t": "set",
        "p": "path",
        "pt": "msg",
        "to": "\"/invoices/\" & payload.id",
        "tot": "jsonata"
      },
      { "t": "delete", "p": "payload", "pt": "msg" }
    ],
    "action": "",
    "property": "",
    "from": "",
    "to": "",
    "reg": false,
    "x": 460,
    "y": 400,
    "wires": [["384d3d4b.70c1d2"]]
  },
  {
    "id": "384d3d4b.70c1d2",
    "type": "btcpay-api",
    "z": "ee9c9c24.20b96",
    "method": "GET",
    "path": "",
    "client": "9711e4a7.bae348",
    "name": "Fetch Invoice",
    "x": 490,
    "y": 440,
    "wires": [["b68020ac.2ca1d", "b6414d4b.7518c"]]
  },
  {
    "id": "b6414d4b.7518c",
    "type": "switch",
    "z": "ee9c9c24.20b96",
    "name": "check status",
    "property": "payload.status",
    "propertyType": "msg",
    "rules": [
      { "t": "eq", "v": "confirmed", "vt": "str" },
      { "t": "eq", "v": "complete", "vt": "str" }
    ],
    "checkall": "false",
    "repair": false,
    "outputs": 2,
    "x": 750,
    "y": 440,
    "wires": [["82d06f0.9fd349"], ["82d06f0.9fd349"]]
  },
  {
    "id": "34bd34b.0a831cc",
    "type": "comment",
    "z": "ee9c9c24.20b96",
    "name": "IPN Handler",
    "info": "",
    "x": 190,
    "y": 320,
    "wires": []
  },
  {
    "id": "9d2463f2.8e9d6",
    "type": "telegram sender",
    "z": "ee9c9c24.20b96",
    "name": "",
    "bot": "ac4e405.e7abcc",
    "x": 1490,
    "y": 580,
    "wires": [[]]
  },
  {
    "id": "180d7108.a3e0cf",
    "type": "change",
    "z": "ee9c9c24.20b96",
    "name": "🔨 TG data",
    "rules": [
      { "t": "delete", "p": "payload", "pt": "msg" },
      {
        "t": "set",
        "p": "payload.chatId",
        "pt": "msg",
        "to": "",
        "tot": "num"
      },
      {
        "t": "set",
        "p": "payload.type",
        "pt": "msg",
        "to": "message",
        "tot": "str"
      },
      {
        "t": "set",
        "p": "payload.options.parse_mode",
        "pt": "msg",
        "to": "HTML",
        "tot": "str"
      },
      {
        "t": "set",
        "p": "payload.content",
        "pt": "msg",
        "to": "msgText",
        "tot": "msg"
      }
    ],
    "action": "",
    "property": "",
    "from": "",
    "to": "",
    "reg": false,
    "x": 1270,
    "y": 440,
    "wires": [["9d2463f2.8e9d6"]]
  },
  {
    "id": "fc8145ba.866768",
    "type": "telegram command",
    "z": "ee9c9c24.20b96",
    "name": "",
    "command": "/tellmyid",
    "bot": "ac4e405.e7abcc",
    "strict": false,
    "hasresponse": false,
    "x": 740,
    "y": 740,
    "wires": [["2683c44e.4967cc"], []]
  },
  {
    "id": "2683c44e.4967cc",
    "type": "template",
    "z": "ee9c9c24.20b96",
    "name": "content = Your Id is ...",
    "field": "payload.content",
    "fieldType": "msg",
    "format": "handlebars",
    "syntax": "mustache",
    "template": "Your id: <b>{{originalMessage.from.id}}</b>\n",
    "output": "str",
    "x": 960,
    "y": 740,
    "wires": [["2302248b.f13e6c"]]
  },
  {
    "id": "2302248b.f13e6c",
    "type": "change",
    "z": "ee9c9c24.20b96",
    "name": "set HTML parse mode",
    "rules": [
      {
        "t": "set",
        "p": "payload.options.parse_mode",
        "pt": "msg",
        "to": "HTML",
        "tot": "str"
      }
    ],
    "action": "",
    "property": "",
    "from": "",
    "to": "",
    "reg": false,
    "x": 1240,
    "y": 740,
    "wires": [["9d2463f2.8e9d6"]]
  },
  {
    "id": "a40977e2.b39058",
    "type": "comment",
    "z": "ee9c9c24.20b96",
    "name": "Helper to get Chat Id",
    "info": "",
    "x": 770,
    "y": 660,
    "wires": []
  },
  { "id": "9711e4a7.bae348", "type": "btcpay-api-config", "z": "", "name": "" },
  {
    "id": "ac4e405.e7abcc",
    "type": "telegram bot",
    "z": "",
    "botname": "Gatekeeper bot",
    "usernames": "",
    "chatids": "",
    "baseapiurl": "",
    "updatemode": "polling",
    "pollinterval": "300",
    "usesocks": false,
    "sockshost": "",
    "socksport": "6667",
    "socksusername": "anonymous",
    "sockspassword": "",
    "bothost": "",
    "localbotport": "8443",
    "publicbotport": "8443",
    "privatekey": "",
    "certificate": "",
    "useselfsignedcertificate": false,
    "sslterminated": false,
    "verboselogging": false
  }
]
```
