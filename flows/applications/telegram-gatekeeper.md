---
id: telegram-gatekeeper
title: Telegram Gatekeeper
sidebar_label: Telegram Gatekeeper
hide_table_of_contents: true
---

This flow creates a Telegram Gatekeeper bot which lets the user join a channel/group in Telegram, only after making a Bitcoin payment for it.

_Note_: The invite link to channel/group can be replaced with any other link.

![Invoice Creator Flow](./assets/telegram-gatekeeper.png)

## Process

Here is how the process looks:

1. Bot welcomes the user and offers to buy access to a channel/group
2. User presses "Buy" button
3. Bot sends an invoice message with "Make Payment" and "Expired? Refresh" buttons
4. When User presses "Make Payment" button, a BTCPay invoice opens in the web browser. When User presses "Expired? Refresh" button, a new invoice will be created (if it's really expired).
5. After User completes the payment, Bot sends a "Thank You" message with "Get Access" button
6. User presses the button
7. Bot sends "Access Granted" alert and message
8. User presees "Join Channel" button and the channel opens in Telegram

## Technical Notes

- To keep the chat clean, Bot edits the same message User pushes buttons in, instead of sending new messages on each event.
- When User completes the payment, Bot deletes the "invoice" message and sends the "thank you" message instead of editing. This triggers "New Message" notification in Telegram to move User's attention from Browser to Telegram.
- To prevent excessive generation of invoices on BTCPay Server, Bot stores ids of User's invoices, checks the status of the last one and generates a new invoice only if it has expired.

## Prerequisites

This flow requires the following nodes to be installed on your Node-RED:

- [node-red-node-sqlite](https://flows.nodered.org/node/node-red-node-sqlite)
- [node-red-contrib-telegrambot](https://github.com/windkh/node-red-contrib-telegrambot)

## Configuration & Setup

1. Import the Node-RED Flow - it will add a new tab called "TG - Gatekeeper"
2. In the "IPN Handler" section (bottom-left corner) of the tab double-click the initial node and specify URL of the webhook to get notifications about paid invoices from your BTCPay Server
3. Open the "Configuration nodes" panel in Node-RED (via tabs on the right panel or `ctrl-g c` shortcut) and configure the config-nodes:
   - **btcpay-api-config** - create a store on your BTCPay Server and pair the node with it ([read more](https://redbtc.org/docs/configuration/))
   - **sqlitedb** - set a path to a SQLite DB file where the app will store the data
   - **telegram bot** - [create a Telegram bot](https://core.telegram.org/bots#6-botfather) and copy/paste the token into the config-node
4. In the "App Configuration & Setup" section (top-left corner) of the flow double-click the "🔨 App Settings" node and enter your data:
   - **price** & **currency** - price and currency (used to create invoices on BTCPay Server)
   - **tgInviteLink** - invite link to a telegram group/channel User gets after the purchase
   - **webhookUrl** - URL the IPN handler is running on
5. Push `Deploy`
6. In the "App Configuration & Setup" section (top-left corner) of the flow click the injector buttons of "Auto-exec on startup" and "Setup App" nodes
7. Done! Test the bot and implement your changes :)

## Node-RED Flow

```json
[
  {
    "id": "8feab169.61ec9",
    "type": "tab",
    "label": "TG - Gatekeeper",
    "disabled": false,
    "info": ""
  },
  {
    "id": "ed0922fe.1650e",
    "type": "sqlite",
    "z": "8feab169.61ec9",
    "mydb": "d0934ac4.e0be88",
    "sqlquery": "batch",
    "sql": "",
    "name": "Exec query",
    "x": 570,
    "y": 260,
    "wires": [[]]
  },
  {
    "id": "dc74fbad.092ec8",
    "type": "template",
    "z": "8feab169.61ec9",
    "name": "SQL Query = Setup Tables",
    "field": "topic",
    "fieldType": "msg",
    "format": "sql",
    "syntax": "plain",
    "template": "CREATE TABLE IF NOT EXISTS users_invoices (\n    invoice_id TEXT PRIMARY KEY, /* btcpay invoice id */\n    user_id INTEGER NOT NULL, /* telegram user id */\n    msg_id INTEGER NOT NULL, /* id of telegram msg with the invoice */\n    created_at INTEGER NOT NULL, /* creation timestamp */\n    paid INTEGER NOT NULL /* 0 - not paid; 1 - paid */\n);\n\nCREATE INDEX IF NOT EXISTS idx_users_invoices_user_created\n    ON users_invoices (user_id, created_at);\n\nCREATE INDEX IF NOT EXISTS idx_users_invoices_user_paid\n    ON users_invoices (user_id, paid);\n",
    "output": "str",
    "x": 520,
    "y": 220,
    "wires": [["ed0922fe.1650e"]]
  },
  {
    "id": "75f7d489.9e32cc",
    "type": "inject",
    "z": "8feab169.61ec9",
    "name": "Setup App",
    "props": [{ "p": "payload" }, { "p": "topic", "vt": "str" }],
    "repeat": "",
    "crontab": "",
    "once": false,
    "onceDelay": 0.1,
    "topic": "",
    "payload": "",
    "payloadType": "date",
    "x": 200,
    "y": 220,
    "wires": [["dc74fbad.092ec8"]]
  },
  {
    "id": "639b3b94.cce594",
    "type": "inject",
    "z": "8feab169.61ec9",
    "name": "Auto-exec on startup",
    "props": [{ "p": "payload" }, { "p": "topic", "vt": "str" }],
    "repeat": "",
    "crontab": "",
    "once": true,
    "onceDelay": "0",
    "topic": "",
    "payload": "",
    "payloadType": "date",
    "x": 240,
    "y": 180,
    "wires": [["5f7f5a92.c7fde4"]]
  },
  {
    "id": "5f7f5a92.c7fde4",
    "type": "change",
    "z": "8feab169.61ec9",
    "name": "🔨 App Settings",
    "rules": [
      { "t": "set", "p": "price", "pt": "flow", "to": "0.01", "tot": "num" },
      { "t": "set", "p": "currency", "pt": "flow", "to": "BTC", "tot": "str" },
      {
        "t": "set",
        "p": "tgInviteLink",
        "pt": "flow",
        "to": "https://t.me/joinchat/AAAAA",
        "tot": "str"
      },
      {
        "t": "set",
        "p": "webhookUrl",
        "pt": "flow",
        "to": "https://nodered.yoursite.com/btcpay-ipn/",
        "tot": "str"
      }
    ],
    "action": "",
    "property": "",
    "from": "",
    "to": "",
    "reg": false,
    "x": 480,
    "y": 180,
    "wires": [[]]
  },
  {
    "id": "97331212.7f8f5",
    "type": "telegram sender",
    "z": "8feab169.61ec9",
    "name": "",
    "bot": "ac4e405.e7abcc",
    "x": 2410,
    "y": 660,
    "wires": [[]]
  },
  {
    "id": "95bcdaff.8567d8",
    "type": "function",
    "z": "8feab169.61ec9",
    "name": "keyboard = Buy",
    "func": "var opts = {\n  reply_markup: JSON.stringify({\n    \"inline_keyboard\": [\n        [\n            {\n                \"text\": \"Yes, buy with Bitcoin\",\n                \"callback_data\": \"Buy\"            \n            }\n        ]\n    ]\n  })\n};\nmsg.payload.options = opts;\n\nreturn msg;\n",
    "outputs": "1",
    "noerr": 0,
    "initialize": "",
    "finalize": "",
    "x": 500,
    "y": 600,
    "wires": [["e2b5dd69.a0337"]]
  },
  {
    "id": "ef375571.8749c8",
    "type": "function",
    "z": "8feab169.61ec9",
    "name": "keyboard = invoice link",
    "func": "const reply_markup = JSON.stringify({\n    \"inline_keyboard\": [\n        [\n            {\n                \"text\": \"Make Payment\",\n                \"url\": msg.btcpayPayload.url\n            }, \n            {\n                \"text\": \"Expired? Refresh\",\n                \"callback_data\": \"RefreshExpired\"\n            }\n        ]\n    ]\n});\n\nmsg.payload.type = 'editMessageText';\nmsg.payload.options = {\n    chat_id: msg.payload.chatId,\n    reply_markup: reply_markup,\n    message_id: msg.originalMessage.message.message_id\n};\n\nreturn msg;\n",
    "outputs": "1",
    "noerr": 0,
    "initialize": "",
    "finalize": "",
    "x": 2440,
    "y": 1020,
    "wires": [["f844abd1.265698"]]
  },
  {
    "id": "12c02383.dd932c",
    "type": "function",
    "z": "8feab169.61ec9",
    "name": "send as alert",
    "func": "msg.payload.options = false;\n\nreturn msg;\n",
    "outputs": "1",
    "noerr": 0,
    "initialize": "",
    "finalize": "",
    "x": 730,
    "y": 1140,
    "wires": [["6a5beee.fc5431"]]
  },
  {
    "id": "51e02100.0c658",
    "type": "function",
    "z": "8feab169.61ec9",
    "name": "keyboard = Join Channel",
    "func": "const reply_markup = JSON.stringify({\n    \"inline_keyboard\": [\n        [\n            {\n                \"text\": \"Join Channel\",\n                \"url\": flow.get(\"tgInviteLink\")\n            }\n        ]\n    ]\n});\n\n\nmsg.payload.type = 'editMessageText';\nmsg.payload.options = {\n    chat_id: msg.payload.chatId,\n    reply_markup: reply_markup,\n    message_id: msg.originalMessage.message.message_id\n};\n\nreturn [ msg ];\n",
    "outputs": "1",
    "noerr": 0,
    "initialize": "",
    "finalize": "",
    "x": 730,
    "y": 1260,
    "wires": [["6a5beee.fc5431"]]
  },
  {
    "id": "1dbcabf8.151b04",
    "type": "template",
    "z": "8feab169.61ec9",
    "name": "content = Wanna buy?",
    "field": "payload.content",
    "fieldType": "msg",
    "format": "handlebars",
    "syntax": "mustache",
    "template": "Access to <b>XChan</b> costs <b>{{flow.price}}</b> {{flow.currency}}.\n\nWant to buy it?",
    "output": "str",
    "x": 480,
    "y": 560,
    "wires": [["95bcdaff.8567d8"]]
  },
  {
    "id": "44c6abde.3ac744",
    "type": "template",
    "z": "8feab169.61ec9",
    "name": "content = Invoice",
    "field": "payload.content",
    "fieldType": "msg",
    "format": "handlebars",
    "syntax": "mustache",
    "template": "⚡⚡⚡ Here is your invoice ⚡⚡⚡\n\n<b>Note:</b> it expires after 15 mins.",
    "output": "str",
    "x": 2430,
    "y": 980,
    "wires": [["ef375571.8749c8"]]
  },
  {
    "id": "9f3837b8.acfb68",
    "type": "template",
    "z": "8feab169.61ec9",
    "name": "content = Access Granted",
    "field": "payload.content",
    "fieldType": "msg",
    "format": "handlebars",
    "syntax": "mustache",
    "template": "🔓 Access Granted 🔓",
    "output": "str",
    "x": 690,
    "y": 1100,
    "wires": [["12c02383.dd932c"]]
  },
  {
    "id": "ee7ffba1.871458",
    "type": "template",
    "z": "8feab169.61ec9",
    "name": "content = Access Granted - Join",
    "field": "payload.content",
    "fieldType": "msg",
    "format": "handlebars",
    "syntax": "mustache",
    "template": "🔓 Access Granted 🔓\n\nNow you can join the channel.",
    "output": "str",
    "x": 710,
    "y": 1220,
    "wires": [["51e02100.0c658"]]
  },
  {
    "id": "5e47b85e.a251f8",
    "type": "switch",
    "z": "8feab169.61ec9",
    "name": "Which callback?",
    "property": "msg.payload.content",
    "propertyType": "msg",
    "rules": [
      { "t": "eq", "v": "Buy", "vt": "str" },
      { "t": "eq", "v": "RefreshExpired", "vt": "str" },
      { "t": "eq", "v": "GetAccess", "vt": "str" }
    ],
    "checkall": "false",
    "repair": false,
    "outputs": 3,
    "x": 420,
    "y": 1060,
    "wires": [
      ["2ed045b5.f316da"],
      ["2ed045b5.f316da"],
      ["9f3837b8.acfb68", "ee7ffba1.871458"]
    ]
  },
  {
    "id": "29b21733.ea6768",
    "type": "telegram command",
    "z": "8feab169.61ec9",
    "name": "",
    "command": "/start",
    "bot": "ac4e405.e7abcc",
    "strict": false,
    "hasresponse": false,
    "x": 190,
    "y": 580,
    "wires": [["1dbcabf8.151b04"], []]
  },
  {
    "id": "7013db53.db8f34",
    "type": "telegram event",
    "z": "8feab169.61ec9",
    "name": "",
    "bot": "ac4e405.e7abcc",
    "event": "callback_query",
    "autoanswer": true,
    "x": 220,
    "y": 1060,
    "wires": [["5e47b85e.a251f8"]]
  },
  {
    "id": "d7804750.68eb88",
    "type": "btcpay-api",
    "z": "8feab169.61ec9",
    "method": "POST",
    "path": "/invoices",
    "client": "9711e4a7.bae348",
    "name": "Create Invoice",
    "x": 1800,
    "y": 1060,
    "wires": [["4ed7081c.357138"]]
  },
  {
    "id": "99348239.6736a",
    "type": "change",
    "z": "8feab169.61ec9",
    "name": "API data",
    "rules": [
      { "t": "delete", "p": "payload", "pt": "msg" },
      {
        "t": "set",
        "p": "payload.price",
        "pt": "msg",
        "to": "price",
        "tot": "flow"
      },
      {
        "t": "set",
        "p": "payload.currency",
        "pt": "msg",
        "to": "currency",
        "tot": "flow"
      },
      {
        "t": "set",
        "p": "payload.notificationURL",
        "pt": "msg",
        "to": "webhookUrl",
        "tot": "flow"
      }
    ],
    "action": "",
    "property": "",
    "from": "",
    "to": "",
    "reg": false,
    "x": 1780,
    "y": 1020,
    "wires": [["d7804750.68eb88"]]
  },
  {
    "id": "5ee3ca64.51a6f4",
    "type": "sqlite",
    "z": "8feab169.61ec9",
    "mydb": "d0934ac4.e0be88",
    "sqlquery": "prepared",
    "sql": "SELECT * FROM users_invoices WHERE user_id = $uid ORDER BY created_at LIMIT 1;",
    "name": "Get last invoice id for user",
    "x": 970,
    "y": 940,
    "wires": [["fdd8e283.a86e3"]]
  },
  {
    "id": "fdd8e283.a86e3",
    "type": "switch",
    "z": "8feab169.61ec9",
    "name": "Has invoice id?",
    "property": "payload",
    "propertyType": "msg",
    "rules": [{ "t": "nempty" }, { "t": "else" }],
    "checkall": "false",
    "repair": false,
    "outputs": 2,
    "x": 1240,
    "y": 920,
    "wires": [["3c467d62.6c06d2"], ["99348239.6736a"]],
    "outputLabels": ["Yes", "No"]
  },
  {
    "id": "72cc780e.4aa108",
    "type": "change",
    "z": "8feab169.61ec9",
    "name": "Prepare data",
    "rules": [
      {
        "t": "set",
        "p": "params.$uid",
        "pt": "msg",
        "to": "tgPayload.from.id",
        "tot": "msg"
      }
    ],
    "action": "",
    "property": "",
    "from": "",
    "to": "",
    "reg": false,
    "x": 930,
    "y": 900,
    "wires": [["5ee3ca64.51a6f4"]]
  },
  {
    "id": "887aeadc.b175f8",
    "type": "change",
    "z": "8feab169.61ec9",
    "name": "Prepare data",
    "rules": [
      { "t": "delete", "p": "params", "pt": "msg" },
      {
        "t": "set",
        "p": "params.$iid",
        "pt": "msg",
        "to": "btcpayPayload.id",
        "tot": "msg"
      },
      {
        "t": "set",
        "p": "params.$uid",
        "pt": "msg",
        "to": "originalMessage.from.id",
        "tot": "msg"
      },
      {
        "t": "set",
        "p": "params.$mid",
        "pt": "msg",
        "to": "originalMessage.message.message_id",
        "tot": "msg"
      },
      { "t": "set", "p": "params.$time", "pt": "msg", "to": "", "tot": "date" }
    ],
    "action": "",
    "property": "",
    "from": "",
    "to": "",
    "reg": false,
    "x": 2070,
    "y": 1060,
    "wires": [["5acd4e54.c53b2"]]
  },
  {
    "id": "5acd4e54.c53b2",
    "type": "sqlite",
    "z": "8feab169.61ec9",
    "mydb": "d0934ac4.e0be88",
    "sqlquery": "prepared",
    "sql": "INSERT INTO users_invoices(invoice_id, user_id, msg_id, created_at, paid)\n       VALUES($iid, $uid, $mid, $time, 0);",
    "name": "Save user-invoice",
    "x": 2090,
    "y": 1100,
    "wires": [["ab22d3ea.c821"]]
  },
  {
    "id": "2ed045b5.f316da",
    "type": "change",
    "z": "8feab169.61ec9",
    "name": "payload -> tgPayload",
    "rules": [
      {
        "t": "move",
        "p": "payload",
        "pt": "msg",
        "to": "tgPayload",
        "tot": "msg"
      }
    ],
    "action": "",
    "property": "",
    "from": "",
    "to": "",
    "reg": false,
    "x": 680,
    "y": 920,
    "wires": [["72cc780e.4aa108"]]
  },
  {
    "id": "70780861.c75af8",
    "type": "btcpay-api",
    "z": "8feab169.61ec9",
    "method": "GET",
    "path": "",
    "client": "9711e4a7.bae348",
    "name": "Get Invoice Data",
    "x": 1530,
    "y": 840,
    "wires": [["2ede07e2.5a2d58"]]
  },
  {
    "id": "3c467d62.6c06d2",
    "type": "change",
    "z": "8feab169.61ec9",
    "name": "API data",
    "rules": [
      {
        "t": "set",
        "p": "path",
        "pt": "msg",
        "to": "\"/invoices/\" & payload[0].invoice_id",
        "tot": "jsonata"
      },
      { "t": "delete", "p": "payload", "pt": "msg" }
    ],
    "action": "",
    "property": "",
    "from": "",
    "to": "",
    "reg": false,
    "x": 1500,
    "y": 800,
    "wires": [["70780861.c75af8"]]
  },
  {
    "id": "2ede07e2.5a2d58",
    "type": "switch",
    "z": "8feab169.61ec9",
    "name": "Got Invoice data?",
    "property": "payload",
    "propertyType": "msg",
    "rules": [{ "t": "hask", "v": "status", "vt": "str" }, { "t": "else" }],
    "checkall": "false",
    "repair": false,
    "outputs": 2,
    "x": 1530,
    "y": 920,
    "wires": [["5cbd33c.75eeacc"], ["99348239.6736a"]],
    "outputLabels": ["Yes", "No"]
  },
  {
    "id": "5cbd33c.75eeacc",
    "type": "switch",
    "z": "8feab169.61ec9",
    "name": "Expired?",
    "property": "payload.status",
    "propertyType": "msg",
    "rules": [{ "t": "neq", "v": "expired", "vt": "str" }, { "t": "else" }],
    "checkall": "false",
    "repair": false,
    "outputs": 2,
    "x": 1780,
    "y": 880,
    "wires": [["6f8dfcaa.da8f24"], ["99348239.6736a"]],
    "outputLabels": ["No", "Yes"]
  },
  {
    "id": "d699f9ce.1a02c8",
    "type": "change",
    "z": "8feab169.61ec9",
    "name": "Prepare data",
    "rules": [
      { "t": "delete", "p": "params", "pt": "msg" },
      {
        "t": "set",
        "p": "params.$iid",
        "pt": "msg",
        "to": "btcpayPayload.id",
        "tot": "msg"
      },
      {
        "t": "set",
        "p": "params.$mid",
        "pt": "msg",
        "to": "originalMessage.message.message_id",
        "tot": "msg"
      }
    ],
    "action": "",
    "property": "",
    "from": "",
    "to": "",
    "reg": false,
    "x": 2050,
    "y": 860,
    "wires": [["deeebee7.feae5"]]
  },
  {
    "id": "deeebee7.feae5",
    "type": "sqlite",
    "z": "8feab169.61ec9",
    "mydb": "d0934ac4.e0be88",
    "sqlquery": "prepared",
    "sql": "UPDATE users_invoices SET msg_id = $mid WHERE invoice_id = $iid;",
    "name": "Update msg id for user-invoice",
    "x": 2090,
    "y": 900,
    "wires": [["ab22d3ea.c821"]]
  },
  {
    "id": "f7898537.4dd7f8",
    "type": "link in",
    "z": "8feab169.61ec9",
    "name": "",
    "links": ["2716b7a1.b41af8", "4ed19a18.abc134", "6a5beee.fc5431"],
    "x": 2135,
    "y": 660,
    "wires": [["97331212.7f8f5"]]
  },
  {
    "id": "f844abd1.265698",
    "type": "link out",
    "z": "8feab169.61ec9",
    "name": "",
    "links": ["f681d971.4735f8"],
    "x": 2655,
    "y": 1000,
    "wires": []
  },
  {
    "id": "4ed19a18.abc134",
    "type": "link out",
    "z": "8feab169.61ec9",
    "name": "",
    "links": ["f7898537.4dd7f8"],
    "x": 2295,
    "y": 1400,
    "wires": []
  },
  {
    "id": "ba7eb89.e8cc748",
    "type": "function",
    "z": "8feab169.61ec9",
    "name": "keyboard = Get Access",
    "func": "const reply_markup = JSON.stringify({\n    \"inline_keyboard\": [\n        [\n            {\n                \"text\": \"Get Access\",\n                \"callback_data\": \"GetAccess\"            \n            }\n        ]\n    ]\n});\n\nmsg.payload = {\n    chatId: msg.payload[0].user_id,\n    type: \"message\",\n    options: {\n        reply_markup : reply_markup\n    }\n}\n\nreturn msg;\n\n",
    "outputs": "1",
    "noerr": 0,
    "initialize": "",
    "finalize": "",
    "x": 2050,
    "y": 1460,
    "wires": [["ceff7288.dae0f"]]
  },
  {
    "id": "ceff7288.dae0f",
    "type": "template",
    "z": "8feab169.61ec9",
    "name": "content = Thanks for buying",
    "field": "payload.content",
    "fieldType": "msg",
    "format": "handlebars",
    "syntax": "mustache",
    "template": "✔ Thank you for the purchase!",
    "output": "str",
    "x": 2060,
    "y": 1500,
    "wires": [["c4d5745c.165168"]]
  },
  {
    "id": "6a5beee.fc5431",
    "type": "link out",
    "z": "8feab169.61ec9",
    "name": "",
    "links": ["f7898537.4dd7f8"],
    "x": 975,
    "y": 1180,
    "wires": []
  },
  {
    "id": "41f6a31c.7e216c",
    "type": "http in",
    "z": "8feab169.61ec9",
    "name": "",
    "url": "/btcpay-ipn/",
    "method": "post",
    "upload": false,
    "swaggerDoc": "",
    "x": 230,
    "y": 1440,
    "wires": [["24d1f355.b85dfc"]]
  },
  {
    "id": "85f81068.ddfb3",
    "type": "http response",
    "z": "8feab169.61ec9",
    "name": "http response = ok",
    "statusCode": "",
    "headers": {},
    "x": 750,
    "y": 1440,
    "wires": []
  },
  {
    "id": "24d1f355.b85dfc",
    "type": "change",
    "z": "8feab169.61ec9",
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
    "x": 480,
    "y": 1440,
    "wires": [["29a11a18.40ab16"]]
  },
  {
    "id": "29a11a18.40ab16",
    "type": "btcpay-api",
    "z": "8feab169.61ec9",
    "method": "GET",
    "path": "",
    "client": "9711e4a7.bae348",
    "name": "Fetch Invoice",
    "x": 510,
    "y": 1480,
    "wires": [["85f81068.ddfb3", "af56d909.554b68"]]
  },
  {
    "id": "694ce08c.e71a",
    "type": "switch",
    "z": "8feab169.61ec9",
    "name": "check status",
    "property": "btcpayPayload.status",
    "propertyType": "msg",
    "rules": [
      { "t": "eq", "v": "confirmed", "vt": "str" },
      { "t": "eq", "v": "complete", "vt": "str" }
    ],
    "checkall": "false",
    "repair": false,
    "outputs": 2,
    "x": 990,
    "y": 1480,
    "wires": [["682f8f94.6e306"], ["682f8f94.6e306"]]
  },
  {
    "id": "899aba79.39d068",
    "type": "sqlite",
    "z": "8feab169.61ec9",
    "mydb": "d0934ac4.e0be88",
    "sqlquery": "prepared",
    "sql": "SELECT * FROM users_invoices WHERE invoice_id = $iid;",
    "name": "Get user-invoice",
    "x": 1580,
    "y": 1480,
    "wires": [["90a44066.f5a03"]]
  },
  {
    "id": "90a44066.f5a03",
    "type": "switch",
    "z": "8feab169.61ec9",
    "name": "Has data?",
    "property": "payload",
    "propertyType": "msg",
    "rules": [{ "t": "nempty" }, { "t": "else" }],
    "checkall": "false",
    "repair": false,
    "outputs": 2,
    "x": 1790,
    "y": 1460,
    "wires": [["ba7eb89.e8cc748", "b0246b6f.a82658"], []],
    "outputLabels": ["Yes", "No"]
  },
  {
    "id": "682f8f94.6e306",
    "type": "change",
    "z": "8feab169.61ec9",
    "name": "Prepare data",
    "rules": [
      {
        "t": "set",
        "p": "params.$iid",
        "pt": "msg",
        "to": "btcpayPayload.id",
        "tot": "msg"
      }
    ],
    "action": "",
    "property": "",
    "from": "",
    "to": "",
    "reg": false,
    "x": 1250,
    "y": 1440,
    "wires": [["8d397820.9552a8"]]
  },
  {
    "id": "8d397820.9552a8",
    "type": "sqlite",
    "z": "8feab169.61ec9",
    "mydb": "d0934ac4.e0be88",
    "sqlquery": "prepared",
    "sql": "UPDATE users_invoices SET paid = 1 WHERE invoice_id = $iid;",
    "name": "Set paid=1 for user-invoice",
    "x": 1300,
    "y": 1480,
    "wires": [["899aba79.39d068"]]
  },
  {
    "id": "9b3ca558.b565c8",
    "type": "debug",
    "z": "8feab169.61ec9",
    "name": "Output data",
    "active": true,
    "tosidebar": true,
    "console": false,
    "tostatus": false,
    "complete": "payload",
    "targetType": "msg",
    "statusVal": "",
    "statusType": "auto",
    "x": 970,
    "y": 280,
    "wires": []
  },
  {
    "id": "2f0a667e.8f7e6a",
    "type": "inject",
    "z": "8feab169.61ec9",
    "name": "Get All User-Invoices",
    "props": [{ "p": "payload" }, { "p": "topic", "vt": "str" }],
    "repeat": "",
    "crontab": "",
    "once": false,
    "onceDelay": 0.1,
    "topic": "",
    "payload": "",
    "payloadType": "date",
    "x": 940,
    "y": 180,
    "wires": [["c9c623ba.b469e"]]
  },
  {
    "id": "c9c623ba.b469e",
    "type": "sqlite",
    "z": "8feab169.61ec9",
    "mydb": "d0934ac4.e0be88",
    "sqlquery": "fixed",
    "sql": "SELECT * FROM users_invoices;",
    "name": "Get data",
    "x": 980,
    "y": 220,
    "wires": [["9b3ca558.b565c8"]]
  },
  {
    "id": "ab22d3ea.c821",
    "type": "change",
    "z": "8feab169.61ec9",
    "name": "tgPayload -> payload",
    "rules": [
      {
        "t": "move",
        "p": "tgPayload",
        "pt": "msg",
        "to": "payload",
        "tot": "msg"
      }
    ],
    "action": "",
    "property": "",
    "from": "",
    "to": "",
    "reg": false,
    "x": 2440,
    "y": 940,
    "wires": [["44c6abde.3ac744"]]
  },
  {
    "id": "4ed7081c.357138",
    "type": "change",
    "z": "8feab169.61ec9",
    "name": "payload -> btcpayPayload",
    "rules": [
      {
        "t": "move",
        "p": "payload",
        "pt": "msg",
        "to": "btcpayPayload",
        "tot": "msg"
      }
    ],
    "action": "",
    "property": "",
    "from": "",
    "to": "",
    "reg": false,
    "x": 2070,
    "y": 1020,
    "wires": [["887aeadc.b175f8"]]
  },
  {
    "id": "6f8dfcaa.da8f24",
    "type": "change",
    "z": "8feab169.61ec9",
    "name": "payload -> btcpayPayload",
    "rules": [
      {
        "t": "move",
        "p": "payload",
        "pt": "msg",
        "to": "btcpayPayload",
        "tot": "msg"
      }
    ],
    "action": "",
    "property": "",
    "from": "",
    "to": "",
    "reg": false,
    "x": 2050,
    "y": 820,
    "wires": [["d699f9ce.1a02c8"]]
  },
  {
    "id": "af56d909.554b68",
    "type": "change",
    "z": "8feab169.61ec9",
    "name": "payload -> btcpayPayload",
    "rules": [
      {
        "t": "move",
        "p": "payload",
        "pt": "msg",
        "to": "btcpayPayload",
        "tot": "msg"
      }
    ],
    "action": "",
    "property": "",
    "from": "",
    "to": "",
    "reg": false,
    "x": 770,
    "y": 1480,
    "wires": [["694ce08c.e71a"]]
  },
  {
    "id": "b0246b6f.a82658",
    "type": "function",
    "z": "8feab169.61ec9",
    "name": "delete message",
    "func": "msg.payload = {\n    chatId: msg.payload[0].user_id,\n    content: msg.payload[0].msg_id,\n    type: 'deleteMessage'\n}\n\nreturn msg;\n\n",
    "outputs": "1",
    "noerr": 0,
    "initialize": "",
    "finalize": "",
    "x": 2020,
    "y": 1400,
    "wires": [["4ed19a18.abc134"]]
  },
  {
    "id": "d443b554.b31538",
    "type": "comment",
    "z": "8feab169.61ec9",
    "name": "IPN Handler",
    "info": "",
    "x": 210,
    "y": 1360,
    "wires": []
  },
  {
    "id": "afbe8f90.a7ff4",
    "type": "change",
    "z": "8feab169.61ec9",
    "name": "parse_mode = HTML",
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
    "x": 2400,
    "y": 580,
    "wires": [["97331212.7f8f5"]]
  },
  {
    "id": "f681d971.4735f8",
    "type": "link in",
    "z": "8feab169.61ec9",
    "name": "",
    "links": ["e2b5dd69.a0337", "f844abd1.265698", "c4d5745c.165168"],
    "x": 2135,
    "y": 580,
    "wires": [["afbe8f90.a7ff4"]]
  },
  {
    "id": "e2b5dd69.a0337",
    "type": "link out",
    "z": "8feab169.61ec9",
    "name": "",
    "links": ["f681d971.4735f8"],
    "x": 735,
    "y": 580,
    "wires": []
  },
  {
    "id": "c4d5745c.165168",
    "type": "link out",
    "z": "8feab169.61ec9",
    "name": "",
    "links": ["f681d971.4735f8"],
    "x": 2295,
    "y": 1480,
    "wires": []
  },
  {
    "id": "8bf4517b.3777d",
    "type": "comment",
    "z": "8feab169.61ec9",
    "name": "Data management",
    "info": "",
    "x": 930,
    "y": 100,
    "wires": []
  },
  {
    "id": "52460bc.2498cf4",
    "type": "comment",
    "z": "8feab169.61ec9",
    "name": "App Configuration & Setup",
    "info": "",
    "x": 250,
    "y": 100,
    "wires": []
  },
  {
    "id": "fd077743.a06d88",
    "type": "comment",
    "z": "8feab169.61ec9",
    "name": "Starts Process",
    "info": "",
    "x": 220,
    "y": 500,
    "wires": []
  },
  {
    "id": "aeefdf50.2eb9b",
    "type": "comment",
    "z": "8feab169.61ec9",
    "name": "Button Events",
    "info": "",
    "x": 210,
    "y": 980,
    "wires": []
  },
  {
    "id": "2de02ea2.c70b12",
    "type": "comment",
    "z": "8feab169.61ec9",
    "name": "Shared Sender",
    "info": "",
    "x": 2200,
    "y": 500,
    "wires": []
  },
  {
    "id": "d0934ac4.e0be88",
    "type": "sqlitedb",
    "z": "",
    "db": ":memory:",
    "mode": "RWC"
  },
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
  },
  { "id": "9711e4a7.bae348", "type": "btcpay-api-config", "z": "", "name": "" }
]
```
