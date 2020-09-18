---
id: telegram-gatekeeper
title: Telegram Gatekeeper
sidebar_label: Telegram Gatekeeper
hide_table_of_contents: true
---

This flow creates a Telegram Gatekeeper bot which lets the user join a channel/group in Telegram, only after making a Bitcoin payment for it.

_Note_: The invite link to channel/group can be replaced with any other link.

![Telegram Gatekeeper Flow](./assets/telegram-gatekeeper.png)

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
2. In the "IPN Handler" section (bottom-left corner) of the tab double-click the initial node and specify URL for receiving POST notifications from BTCPay Server
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
        "id": "b1c965cf.c2bff8",
        "type": "tab",
        "label": "TG - Gatekeeper",
        "disabled": false,
        "info": ""
    },
    {
        "id": "4e9602ab.ac034c",
        "type": "sqlite",
        "z": "b1c965cf.c2bff8",
        "mydb": "d0934ac4.e0be88",
        "sqlquery": "batch",
        "sql": "",
        "name": "Exec query",
        "x": 570,
        "y": 260,
        "wires": [
            []
        ]
    },
    {
        "id": "836d26f8.e10f18",
        "type": "template",
        "z": "b1c965cf.c2bff8",
        "name": "SQL Query = Setup Tables",
        "field": "topic",
        "fieldType": "msg",
        "format": "sql",
        "syntax": "plain",
        "template": "CREATE TABLE IF NOT EXISTS users_invoices (\n    invoice_id TEXT PRIMARY KEY, /* btcpay invoice id */\n    user_id INTEGER NOT NULL, /* telegram user id */\n    msg_id INTEGER NOT NULL, /* id of telegram msg with the invoice */\n    created_at INTEGER NOT NULL, /* creation timestamp */\n    paid INTEGER NOT NULL /* 0 - not paid; 1 - paid */\n);\n\nCREATE INDEX IF NOT EXISTS idx_users_invoices_user_created\n    ON users_invoices (user_id, created_at);\n\nCREATE INDEX IF NOT EXISTS idx_users_invoices_user_paid\n    ON users_invoices (user_id, paid);\n",
        "output": "str",
        "x": 520,
        "y": 220,
        "wires": [
            [
                "4e9602ab.ac034c"
            ]
        ]
    },
    {
        "id": "5ce0b722.db0a98",
        "type": "inject",
        "z": "b1c965cf.c2bff8",
        "name": "Setup App",
        "props": [
            {
                "p": "payload"
            },
            {
                "p": "topic",
                "vt": "str"
            }
        ],
        "repeat": "",
        "crontab": "",
        "once": false,
        "onceDelay": 0.1,
        "topic": "",
        "payload": "",
        "payloadType": "date",
        "x": 200,
        "y": 220,
        "wires": [
            [
                "836d26f8.e10f18"
            ]
        ]
    },
    {
        "id": "1cfb6187.d043ae",
        "type": "inject",
        "z": "b1c965cf.c2bff8",
        "name": "Auto-exec on startup",
        "props": [
            {
                "p": "payload"
            },
            {
                "p": "topic",
                "vt": "str"
            }
        ],
        "repeat": "",
        "crontab": "",
        "once": true,
        "onceDelay": "0",
        "topic": "",
        "payload": "",
        "payloadType": "date",
        "x": 240,
        "y": 180,
        "wires": [
            [
                "dcc49b39.e21688"
            ]
        ]
    },
    {
        "id": "dcc49b39.e21688",
        "type": "change",
        "z": "b1c965cf.c2bff8",
        "name": "🔨 App Settings",
        "rules": [
            {
                "t": "set",
                "p": "price",
                "pt": "flow",
                "to": "0.01",
                "tot": "num"
            },
            {
                "t": "set",
                "p": "currency",
                "pt": "flow",
                "to": "BTC",
                "tot": "str"
            },
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
        "wires": [
            []
        ]
    },
    {
        "id": "c0ee9e01.e11a8",
        "type": "telegram sender",
        "z": "b1c965cf.c2bff8",
        "name": "",
        "bot": "ac4e405.e7abcc",
        "x": 2410,
        "y": 660,
        "wires": [
            []
        ]
    },
    {
        "id": "37eaa8dc.1efc68",
        "type": "function",
        "z": "b1c965cf.c2bff8",
        "name": "keyboard = Buy",
        "func": "var opts = {\n  reply_markup: JSON.stringify({\n    \"inline_keyboard\": [\n        [\n            {\n                \"text\": \"Yes, buy with Bitcoin\",\n                \"callback_data\": \"Buy\"            \n            }\n        ]\n    ]\n  })\n};\nmsg.payload.options = opts;\n\nreturn msg;\n",
        "outputs": "1",
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "x": 500,
        "y": 600,
        "wires": [
            [
                "3439eede.bcfc52"
            ]
        ]
    },
    {
        "id": "234aa9e9.79cc26",
        "type": "function",
        "z": "b1c965cf.c2bff8",
        "name": "keyboard = invoice link",
        "func": "const reply_markup = JSON.stringify({\n    \"inline_keyboard\": [\n        [\n            {\n                \"text\": \"Make Payment\",\n                \"url\": msg.btcpayPayload.url\n            }, \n            {\n                \"text\": \"Expired? Refresh\",\n                \"callback_data\": \"RefreshExpired\"\n            }\n        ]\n    ]\n});\n\nmsg.payload.type = 'editMessageText';\nmsg.payload.options = {\n    chat_id: msg.payload.chatId,\n    reply_markup: reply_markup,\n    message_id: msg.originalMessage.message.message_id\n};\n\nreturn msg;\n",
        "outputs": "1",
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "x": 2440,
        "y": 1020,
        "wires": [
            [
                "dac5fe08.32d83"
            ]
        ]
    },
    {
        "id": "2f4dfc78.aca034",
        "type": "function",
        "z": "b1c965cf.c2bff8",
        "name": "send as alert",
        "func": "msg.payload.options = false;\n\nreturn msg;\n",
        "outputs": "1",
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "x": 730,
        "y": 1140,
        "wires": [
            [
                "b8334051.0e467"
            ]
        ]
    },
    {
        "id": "df06b5a6.24c5a8",
        "type": "function",
        "z": "b1c965cf.c2bff8",
        "name": "keyboard = Join Channel",
        "func": "const reply_markup = JSON.stringify({\n    \"inline_keyboard\": [\n        [\n            {\n                \"text\": \"Join Channel\",\n                \"url\": flow.get(\"tgInviteLink\")\n            }\n        ]\n    ]\n});\n\n\nmsg.payload.type = 'editMessageText';\nmsg.payload.options = {\n    chat_id: msg.payload.chatId,\n    reply_markup: reply_markup,\n    message_id: msg.originalMessage.message.message_id\n};\n\nreturn [ msg ];\n",
        "outputs": "1",
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "x": 730,
        "y": 1260,
        "wires": [
            [
                "b8334051.0e467"
            ]
        ]
    },
    {
        "id": "ad3a06bb.3534e8",
        "type": "template",
        "z": "b1c965cf.c2bff8",
        "name": "content = Wanna buy?",
        "field": "payload.content",
        "fieldType": "msg",
        "format": "handlebars",
        "syntax": "mustache",
        "template": "Access to <b>XChan</b> costs <b>{{flow.price}}</b> {{flow.currency}}.\n\nWant to buy it?",
        "output": "str",
        "x": 480,
        "y": 560,
        "wires": [
            [
                "37eaa8dc.1efc68"
            ]
        ]
    },
    {
        "id": "940f11cc.d328b",
        "type": "template",
        "z": "b1c965cf.c2bff8",
        "name": "content = Invoice",
        "field": "payload.content",
        "fieldType": "msg",
        "format": "handlebars",
        "syntax": "mustache",
        "template": "⚡⚡⚡ Here is your invoice ⚡⚡⚡\n\n<b>Note:</b> it expires after 15 mins.",
        "output": "str",
        "x": 2430,
        "y": 980,
        "wires": [
            [
                "234aa9e9.79cc26"
            ]
        ]
    },
    {
        "id": "af6af72d.108ec8",
        "type": "template",
        "z": "b1c965cf.c2bff8",
        "name": "content = Access Granted",
        "field": "payload.content",
        "fieldType": "msg",
        "format": "handlebars",
        "syntax": "mustache",
        "template": "🔓 Access Granted 🔓",
        "output": "str",
        "x": 690,
        "y": 1100,
        "wires": [
            [
                "2f4dfc78.aca034"
            ]
        ]
    },
    {
        "id": "4ab0dce4.5f9e54",
        "type": "template",
        "z": "b1c965cf.c2bff8",
        "name": "content = Access Granted - Join",
        "field": "payload.content",
        "fieldType": "msg",
        "format": "handlebars",
        "syntax": "mustache",
        "template": "🔓 Access Granted 🔓\n\nNow you can join the channel.",
        "output": "str",
        "x": 710,
        "y": 1220,
        "wires": [
            [
                "df06b5a6.24c5a8"
            ]
        ]
    },
    {
        "id": "1efdd5f7.301baa",
        "type": "switch",
        "z": "b1c965cf.c2bff8",
        "name": "Which callback?",
        "property": "msg.payload.content",
        "propertyType": "msg",
        "rules": [
            {
                "t": "eq",
                "v": "Buy",
                "vt": "str"
            },
            {
                "t": "eq",
                "v": "RefreshExpired",
                "vt": "str"
            },
            {
                "t": "eq",
                "v": "GetAccess",
                "vt": "str"
            }
        ],
        "checkall": "false",
        "repair": false,
        "outputs": 3,
        "x": 420,
        "y": 1060,
        "wires": [
            [
                "6bbc5a46.e09b74"
            ],
            [
                "6bbc5a46.e09b74"
            ],
            [
                "af6af72d.108ec8",
                "4ab0dce4.5f9e54"
            ]
        ]
    },
    {
        "id": "a67cffe4.bd3ca",
        "type": "telegram command",
        "z": "b1c965cf.c2bff8",
        "name": "",
        "command": "/start",
        "bot": "ac4e405.e7abcc",
        "strict": false,
        "hasresponse": false,
        "x": 190,
        "y": 580,
        "wires": [
            [
                "ad3a06bb.3534e8"
            ]
        ]
    },
    {
        "id": "116e6754.ccb3e9",
        "type": "telegram event",
        "z": "b1c965cf.c2bff8",
        "name": "",
        "bot": "ac4e405.e7abcc",
        "event": "callback_query",
        "autoanswer": true,
        "x": 220,
        "y": 1060,
        "wires": [
            [
                "1efdd5f7.301baa"
            ]
        ]
    },
    {
        "id": "f3a04c89.717f1",
        "type": "btcpay-api",
        "z": "b1c965cf.c2bff8",
        "method": "POST",
        "path": "/invoices",
        "client": "9711e4a7.bae348",
        "name": "Create Invoice",
        "x": 1800,
        "y": 1060,
        "wires": [
            [
                "5a08a622.fe2448"
            ]
        ]
    },
    {
        "id": "8b0edd5.f4bdb2",
        "type": "change",
        "z": "b1c965cf.c2bff8",
        "name": "API data",
        "rules": [
            {
                "t": "delete",
                "p": "payload",
                "pt": "msg"
            },
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
        "wires": [
            [
                "f3a04c89.717f1"
            ]
        ]
    },
    {
        "id": "c5c6cc7d.e65a8",
        "type": "sqlite",
        "z": "b1c965cf.c2bff8",
        "mydb": "d0934ac4.e0be88",
        "sqlquery": "prepared",
        "sql": "SELECT * FROM users_invoices WHERE user_id = $uid ORDER BY created_at LIMIT 1;",
        "name": "Get last invoice id for user",
        "x": 970,
        "y": 940,
        "wires": [
            [
                "4ba3194.94332e8"
            ]
        ]
    },
    {
        "id": "4ba3194.94332e8",
        "type": "switch",
        "z": "b1c965cf.c2bff8",
        "name": "Has invoice id?",
        "property": "payload",
        "propertyType": "msg",
        "rules": [
            {
                "t": "nempty"
            },
            {
                "t": "else"
            }
        ],
        "checkall": "false",
        "repair": false,
        "outputs": 2,
        "x": 1240,
        "y": 920,
        "wires": [
            [
                "b9a9e202.f12f7"
            ],
            [
                "8b0edd5.f4bdb2"
            ]
        ],
        "outputLabels": [
            "Yes",
            "No"
        ]
    },
    {
        "id": "5704a92d.996448",
        "type": "change",
        "z": "b1c965cf.c2bff8",
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
        "wires": [
            [
                "c5c6cc7d.e65a8"
            ]
        ]
    },
    {
        "id": "a3343be1.71e0e8",
        "type": "change",
        "z": "b1c965cf.c2bff8",
        "name": "Prepare data",
        "rules": [
            {
                "t": "delete",
                "p": "params",
                "pt": "msg"
            },
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
            {
                "t": "set",
                "p": "params.$time",
                "pt": "msg",
                "to": "",
                "tot": "date"
            }
        ],
        "action": "",
        "property": "",
        "from": "",
        "to": "",
        "reg": false,
        "x": 2070,
        "y": 1060,
        "wires": [
            [
                "ebae6e3f.515f1"
            ]
        ]
    },
    {
        "id": "ebae6e3f.515f1",
        "type": "sqlite",
        "z": "b1c965cf.c2bff8",
        "mydb": "d0934ac4.e0be88",
        "sqlquery": "prepared",
        "sql": "INSERT INTO users_invoices(invoice_id, user_id, msg_id, created_at, paid)\n       VALUES($iid, $uid, $mid, $time, 0);",
        "name": "Save user-invoice",
        "x": 2090,
        "y": 1100,
        "wires": [
            [
                "abdce8c.4187718"
            ]
        ]
    },
    {
        "id": "6bbc5a46.e09b74",
        "type": "change",
        "z": "b1c965cf.c2bff8",
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
        "wires": [
            [
                "5704a92d.996448"
            ]
        ]
    },
    {
        "id": "d34088a6.d2b908",
        "type": "btcpay-api",
        "z": "b1c965cf.c2bff8",
        "method": "GET",
        "path": "",
        "client": "9711e4a7.bae348",
        "name": "Get Invoice Data",
        "x": 1530,
        "y": 840,
        "wires": [
            [
                "5e988c69.850e94"
            ]
        ]
    },
    {
        "id": "b9a9e202.f12f7",
        "type": "change",
        "z": "b1c965cf.c2bff8",
        "name": "API data",
        "rules": [
            {
                "t": "set",
                "p": "path",
                "pt": "msg",
                "to": "\"/invoices/\" & payload[0].invoice_id",
                "tot": "jsonata"
            },
            {
                "t": "delete",
                "p": "payload",
                "pt": "msg"
            }
        ],
        "action": "",
        "property": "",
        "from": "",
        "to": "",
        "reg": false,
        "x": 1500,
        "y": 800,
        "wires": [
            [
                "d34088a6.d2b908"
            ]
        ]
    },
    {
        "id": "5e988c69.850e94",
        "type": "switch",
        "z": "b1c965cf.c2bff8",
        "name": "Got Invoice data?",
        "property": "payload",
        "propertyType": "msg",
        "rules": [
            {
                "t": "hask",
                "v": "status",
                "vt": "str"
            },
            {
                "t": "else"
            }
        ],
        "checkall": "false",
        "repair": false,
        "outputs": 2,
        "x": 1530,
        "y": 920,
        "wires": [
            [
                "e0448a0f.0aeb48"
            ],
            [
                "8b0edd5.f4bdb2"
            ]
        ],
        "outputLabels": [
            "Yes",
            "No"
        ]
    },
    {
        "id": "e0448a0f.0aeb48",
        "type": "switch",
        "z": "b1c965cf.c2bff8",
        "name": "Expired?",
        "property": "payload.status",
        "propertyType": "msg",
        "rules": [
            {
                "t": "neq",
                "v": "expired",
                "vt": "str"
            },
            {
                "t": "else"
            }
        ],
        "checkall": "false",
        "repair": false,
        "outputs": 2,
        "x": 1780,
        "y": 880,
        "wires": [
            [
                "8b9459b6.b69e48"
            ],
            [
                "8b0edd5.f4bdb2"
            ]
        ],
        "outputLabels": [
            "No",
            "Yes"
        ]
    },
    {
        "id": "be5fc001.48d2a",
        "type": "change",
        "z": "b1c965cf.c2bff8",
        "name": "Prepare data",
        "rules": [
            {
                "t": "delete",
                "p": "params",
                "pt": "msg"
            },
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
        "wires": [
            [
                "1c9c9885.f35eb7"
            ]
        ]
    },
    {
        "id": "1c9c9885.f35eb7",
        "type": "sqlite",
        "z": "b1c965cf.c2bff8",
        "mydb": "d0934ac4.e0be88",
        "sqlquery": "prepared",
        "sql": "UPDATE users_invoices SET msg_id = $mid WHERE invoice_id = $iid;",
        "name": "Update msg id for user-invoice",
        "x": 2090,
        "y": 900,
        "wires": [
            [
                "abdce8c.4187718"
            ]
        ]
    },
    {
        "id": "c25fc6c1.773e78",
        "type": "link in",
        "z": "b1c965cf.c2bff8",
        "name": "",
        "links": [
            "2716b7a1.b41af8",
            "ede2a7eb.034408",
            "b8334051.0e467"
        ],
        "x": 2135,
        "y": 660,
        "wires": [
            [
                "c0ee9e01.e11a8"
            ]
        ]
    },
    {
        "id": "dac5fe08.32d83",
        "type": "link out",
        "z": "b1c965cf.c2bff8",
        "name": "",
        "links": [
            "72f1d607.6dbf08"
        ],
        "x": 2655,
        "y": 1000,
        "wires": []
    },
    {
        "id": "ede2a7eb.034408",
        "type": "link out",
        "z": "b1c965cf.c2bff8",
        "name": "",
        "links": [
            "c25fc6c1.773e78"
        ],
        "x": 1955,
        "y": 1360,
        "wires": []
    },
    {
        "id": "a91187c.6223478",
        "type": "function",
        "z": "b1c965cf.c2bff8",
        "name": "keyboard = Get Access",
        "func": "const reply_markup = JSON.stringify({\n    \"inline_keyboard\": [\n        [\n            {\n                \"text\": \"Get Access\",\n                \"callback_data\": \"GetAccess\"            \n            }\n        ]\n    ]\n});\n\nmsg.payload = {\n    chatId: msg.payload[0].user_id,\n    type: \"message\",\n    options: {\n        reply_markup : reply_markup\n    }\n}\n\nreturn msg;\n\n",
        "outputs": "1",
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "x": 1710,
        "y": 1420,
        "wires": [
            [
                "9ac12cfb.cb007"
            ]
        ]
    },
    {
        "id": "9ac12cfb.cb007",
        "type": "template",
        "z": "b1c965cf.c2bff8",
        "name": "content = Thanks for buying",
        "field": "payload.content",
        "fieldType": "msg",
        "format": "handlebars",
        "syntax": "mustache",
        "template": "✔ Thank you for the purchase!",
        "output": "str",
        "x": 1720,
        "y": 1460,
        "wires": [
            [
                "9a7249b9.da31c8"
            ]
        ]
    },
    {
        "id": "b8334051.0e467",
        "type": "link out",
        "z": "b1c965cf.c2bff8",
        "name": "",
        "links": [
            "c25fc6c1.773e78"
        ],
        "x": 975,
        "y": 1180,
        "wires": []
    },
    {
        "id": "d0bb09ad.e1eb58",
        "type": "switch",
        "z": "b1c965cf.c2bff8",
        "name": "check status",
        "property": "btcpayPayload.status",
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
        "x": 650,
        "y": 1440,
        "wires": [
            [
                "3ac2f308.51a85c"
            ],
            [
                "3ac2f308.51a85c"
            ]
        ]
    },
    {
        "id": "34b072de.bf157e",
        "type": "sqlite",
        "z": "b1c965cf.c2bff8",
        "mydb": "d0934ac4.e0be88",
        "sqlquery": "prepared",
        "sql": "SELECT * FROM users_invoices WHERE invoice_id = $iid;",
        "name": "Get user-invoice",
        "x": 1240,
        "y": 1440,
        "wires": [
            [
                "8db4e8d3.f20e68"
            ]
        ]
    },
    {
        "id": "8db4e8d3.f20e68",
        "type": "switch",
        "z": "b1c965cf.c2bff8",
        "name": "Has data?",
        "property": "payload",
        "propertyType": "msg",
        "rules": [
            {
                "t": "nempty"
            },
            {
                "t": "else"
            }
        ],
        "checkall": "false",
        "repair": false,
        "outputs": 2,
        "x": 1450,
        "y": 1420,
        "wires": [
            [
                "a91187c.6223478",
                "3230859b.f52cca"
            ],
            []
        ],
        "outputLabels": [
            "Yes",
            "No"
        ]
    },
    {
        "id": "3ac2f308.51a85c",
        "type": "change",
        "z": "b1c965cf.c2bff8",
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
        "x": 910,
        "y": 1400,
        "wires": [
            [
                "9a17925b.298ce"
            ]
        ]
    },
    {
        "id": "9a17925b.298ce",
        "type": "sqlite",
        "z": "b1c965cf.c2bff8",
        "mydb": "d0934ac4.e0be88",
        "sqlquery": "prepared",
        "sql": "UPDATE users_invoices SET paid = 1 WHERE invoice_id = $iid;",
        "name": "Set paid=1 for user-invoice",
        "x": 960,
        "y": 1440,
        "wires": [
            [
                "34b072de.bf157e"
            ]
        ]
    },
    {
        "id": "ee53609d.1e4fb",
        "type": "debug",
        "z": "b1c965cf.c2bff8",
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
        "id": "e8290f6.7e2dbf",
        "type": "inject",
        "z": "b1c965cf.c2bff8",
        "name": "Get All User-Invoices",
        "props": [
            {
                "p": "payload"
            },
            {
                "p": "topic",
                "vt": "str"
            }
        ],
        "repeat": "",
        "crontab": "",
        "once": false,
        "onceDelay": 0.1,
        "topic": "",
        "payload": "",
        "payloadType": "date",
        "x": 940,
        "y": 180,
        "wires": [
            [
                "41995b43.501d24"
            ]
        ]
    },
    {
        "id": "41995b43.501d24",
        "type": "sqlite",
        "z": "b1c965cf.c2bff8",
        "mydb": "d0934ac4.e0be88",
        "sqlquery": "fixed",
        "sql": "SELECT * FROM users_invoices;",
        "name": "Get data",
        "x": 980,
        "y": 220,
        "wires": [
            [
                "ee53609d.1e4fb"
            ]
        ]
    },
    {
        "id": "abdce8c.4187718",
        "type": "change",
        "z": "b1c965cf.c2bff8",
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
        "wires": [
            [
                "940f11cc.d328b"
            ]
        ]
    },
    {
        "id": "5a08a622.fe2448",
        "type": "change",
        "z": "b1c965cf.c2bff8",
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
        "wires": [
            [
                "a3343be1.71e0e8"
            ]
        ]
    },
    {
        "id": "8b9459b6.b69e48",
        "type": "change",
        "z": "b1c965cf.c2bff8",
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
        "wires": [
            [
                "be5fc001.48d2a"
            ]
        ]
    },
    {
        "id": "74370d4b.e2fd54",
        "type": "change",
        "z": "b1c965cf.c2bff8",
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
        "x": 430,
        "y": 1440,
        "wires": [
            [
                "d0bb09ad.e1eb58"
            ]
        ]
    },
    {
        "id": "3230859b.f52cca",
        "type": "function",
        "z": "b1c965cf.c2bff8",
        "name": "delete message",
        "func": "msg.payload = {\n    chatId: msg.payload[0].user_id,\n    content: msg.payload[0].msg_id,\n    type: 'deleteMessage'\n}\n\nreturn msg;\n\n",
        "outputs": "1",
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "x": 1680,
        "y": 1360,
        "wires": [
            [
                "ede2a7eb.034408"
            ]
        ]
    },
    {
        "id": "59b13840.137688",
        "type": "comment",
        "z": "b1c965cf.c2bff8",
        "name": "IPN Handler",
        "info": "",
        "x": 210,
        "y": 1360,
        "wires": []
    },
    {
        "id": "28308e88.39dd52",
        "type": "change",
        "z": "b1c965cf.c2bff8",
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
        "wires": [
            [
                "c0ee9e01.e11a8"
            ]
        ]
    },
    {
        "id": "72f1d607.6dbf08",
        "type": "link in",
        "z": "b1c965cf.c2bff8",
        "name": "",
        "links": [
            "3439eede.bcfc52",
            "dac5fe08.32d83",
            "9a7249b9.da31c8"
        ],
        "x": 2135,
        "y": 580,
        "wires": [
            [
                "28308e88.39dd52"
            ]
        ]
    },
    {
        "id": "3439eede.bcfc52",
        "type": "link out",
        "z": "b1c965cf.c2bff8",
        "name": "",
        "links": [
            "72f1d607.6dbf08"
        ],
        "x": 735,
        "y": 580,
        "wires": []
    },
    {
        "id": "9a7249b9.da31c8",
        "type": "link out",
        "z": "b1c965cf.c2bff8",
        "name": "",
        "links": [
            "72f1d607.6dbf08"
        ],
        "x": 1955,
        "y": 1440,
        "wires": []
    },
    {
        "id": "6f83a984.213018",
        "type": "comment",
        "z": "b1c965cf.c2bff8",
        "name": "Data management",
        "info": "",
        "x": 930,
        "y": 100,
        "wires": []
    },
    {
        "id": "cf95d274.f8fb8",
        "type": "comment",
        "z": "b1c965cf.c2bff8",
        "name": "App Configuration & Setup",
        "info": "",
        "x": 250,
        "y": 100,
        "wires": []
    },
    {
        "id": "3120b323.3c111c",
        "type": "comment",
        "z": "b1c965cf.c2bff8",
        "name": "Starts Process",
        "info": "",
        "x": 220,
        "y": 500,
        "wires": []
    },
    {
        "id": "e091583c.67fb18",
        "type": "comment",
        "z": "b1c965cf.c2bff8",
        "name": "Button Events",
        "info": "",
        "x": 210,
        "y": 980,
        "wires": []
    },
    {
        "id": "1de04999.85b476",
        "type": "comment",
        "z": "b1c965cf.c2bff8",
        "name": "Shared Sender",
        "info": "",
        "x": 2200,
        "y": 500,
        "wires": []
    },
    {
        "id": "58433a7a.204b34",
        "type": "btcpay-ipn",
        "z": "b1c965cf.c2bff8",
        "client": "9711e4a7.bae348",
        "path": "/btcpay-ipn",
        "name": "",
        "x": 200,
        "y": 1440,
        "wires": [
            [
                "74370d4b.e2fd54"
            ]
        ]
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
    {
        "id": "9711e4a7.bae348",
        "type": "btcpay-api-config",
        "z": "",
        "name": ""
    }
]
```
