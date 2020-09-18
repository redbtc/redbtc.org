(window.webpackJsonp=window.webpackJsonp||[]).push([[15],{112:function(e,n,t){"use strict";t.r(n),n.default=t.p+"assets/images/telegram-notifications-1c85b7c7194229b4ad6fcf68630b50fb.png"},72:function(e,n,t){"use strict";t.r(n),t.d(n,"frontMatter",(function(){return r})),t.d(n,"metadata",(function(){return s})),t.d(n,"rightToc",(function(){return c})),t.d(n,"default",(function(){return p}));var a=t(2),o=t(6),i=(t(0),t(77)),r={id:"telegram-notifications",title:"Telegram Notifications",sidebar_label:"Telegram Notifications",hide_table_of_contents:!0},s={unversionedId:"integrations/telegram-notifications",id:"integrations/telegram-notifications",isDocsHomePage:!1,title:"Telegram Notifications",description:"This flow will send you notifications about paid invoices using a Telegram bot.",source:"@site/flows/integrations/telegram-notifications.md",slug:"/integrations/telegram-notifications",permalink:"/flows/integrations/telegram-notifications",editUrl:"https://github.com/redbtc/redbtc.org/edit/master/flows/integrations/telegram-notifications.md",version:"current",lastUpdatedBy:"Alex Kaul",lastUpdatedAt:1600431858,sidebar_label:"Telegram Notifications",sidebar:"flows",previous:{title:"Handling Instant Payment Notifications",permalink:"/flows/starters/ipn-handler"},next:{title:"Telegram Gatekeeper",permalink:"/flows/applications/telegram-gatekeeper"}},c=[{value:"Prerequisites",id:"prerequisites",children:[]},{value:"Configuration &amp; Setup",id:"configuration--setup",children:[]},{value:"Node-RED Flow",id:"node-red-flow",children:[]}],l={rightToc:c};function p(e){var n=e.components,r=Object(o.a)(e,["components"]);return Object(i.b)("wrapper",Object(a.a)({},l,r,{components:n,mdxType:"MDXLayout"}),Object(i.b)("p",null,"This flow will send you notifications about paid invoices using a Telegram bot."),Object(i.b)("p",null,Object(i.b)("img",{alt:"Telegram Notifications Flow",src:t(112).default})),Object(i.b)("h2",{id:"prerequisites"},"Prerequisites"),Object(i.b)("p",null,"This flow requires the following node to be installed on your Node-RED:"),Object(i.b)("ul",null,Object(i.b)("li",{parentName:"ul"},Object(i.b)("a",Object(a.a)({parentName:"li"},{href:"https://github.com/windkh/node-red-contrib-telegrambot"}),"node-red-contrib-telegrambot"))),Object(i.b)("h2",{id:"configuration--setup"},"Configuration & Setup"),Object(i.b)("ol",null,Object(i.b)("li",{parentName:"ol"},"Import the Node-RED Flow"),Object(i.b)("li",{parentName:"ol"},'In the "IPN Handler" section of the flow double-click the initial node and specify URL for receiving POST notifications from BTCPay Server'),Object(i.b)("li",{parentName:"ol"},"Now add the notification URL to Node-RED flows and/or other servers creating invoices for you. Calls to BTCPay's Create Invoice API should have the ",Object(i.b)("inlineCode",{parentName:"li"},"notificationUrl")," property with the URL you specified in the previous step"),Object(i.b)("li",{parentName:"ol"},'Open the "Configuration nodes" panel in Node-RED (via tabs on the right panel or ',Object(i.b)("inlineCode",{parentName:"li"},"ctrl-g c")," shortcut) and configure the config-nodes:",Object(i.b)("ul",{parentName:"li"},Object(i.b)("li",{parentName:"ul"},Object(i.b)("strong",{parentName:"li"},"btcpay-api-config")," - create a store on your BTCPay Server and pair the node with it (",Object(i.b)("a",Object(a.a)({parentName:"li"},{href:"https://redbtc.org/docs/configuration/"}),"read more"),")"),Object(i.b)("li",{parentName:"ul"},Object(i.b)("strong",{parentName:"li"},"telegram bot")," - ",Object(i.b)("a",Object(a.a)({parentName:"li"},{href:"https://core.telegram.org/bots#6-botfather"}),"create a Telegram bot")," and copy/paste the token into the config-node"))),Object(i.b)("li",{parentName:"ol"},"Push ",Object(i.b)("inlineCode",{parentName:"li"},"Deploy")),Object(i.b)("li",{parentName:"ol"},"Open chat with your Bot and send ",Object(i.b)("inlineCode",{parentName:"li"},"/tellmyid")," command"),Object(i.b)("li",{parentName:"ol"},"Copy your id"),Object(i.b)("li",{parentName:"ol"},'Double-click the "\ud83d\udd28 TG data" node and paste your id into ',Object(i.b)("inlineCode",{parentName:"li"},"msg.payload.chatId")," property"),Object(i.b)("li",{parentName:"ol"},"Push ",Object(i.b)("inlineCode",{parentName:"li"},"Deploy")),Object(i.b)("li",{parentName:"ol"},'Done! Now the bot will send you notifications about paid invoices. You might edit the notification template in the "msgText = Invoice Paid" node.')),Object(i.b)("h2",{id:"node-red-flow"},"Node-RED Flow"),Object(i.b)("pre",null,Object(i.b)("code",Object(a.a)({parentName:"pre"},{className:"language-json"}),'[\n    {\n        "id": "3672a5c4.72a55a",\n        "type": "template",\n        "z": "a6bcf03.19cf21",\n        "name": "msgText = Invoice Paid",\n        "field": "msgText",\n        "fieldType": "msg",\n        "format": "handlebars",\n        "syntax": "mustache",\n        "template": "\u26a1 Invoice has been paid \u26a1\\n\\nID: <b>{{payload.id}}</b>\\nPrice: <b>{{payload.price}}</b>\\nCurrency: <b>{{payload.currency}}</b>",\n        "output": "str",\n        "x": 610,\n        "y": 280,\n        "wires": [\n            [\n                "3fbbd85a.275e18"\n            ]\n        ]\n    },\n    {\n        "id": "3fa0ab35.9e56e4",\n        "type": "switch",\n        "z": "a6bcf03.19cf21",\n        "name": "check status",\n        "property": "payload.status",\n        "propertyType": "msg",\n        "rules": [\n            {\n                "t": "eq",\n                "v": "confirmed",\n                "vt": "str"\n            },\n            {\n                "t": "eq",\n                "v": "complete",\n                "vt": "str"\n            }\n        ],\n        "checkall": "false",\n        "repair": false,\n        "outputs": 2,\n        "x": 330,\n        "y": 280,\n        "wires": [\n            [\n                "3672a5c4.72a55a"\n            ],\n            [\n                "3672a5c4.72a55a"\n            ]\n        ]\n    },\n    {\n        "id": "6f9ec567.3cb2bc",\n        "type": "comment",\n        "z": "a6bcf03.19cf21",\n        "name": "IPN Handler",\n        "info": "",\n        "x": 150,\n        "y": 200,\n        "wires": []\n    },\n    {\n        "id": "7c969859.d52578",\n        "type": "telegram sender",\n        "z": "a6bcf03.19cf21",\n        "name": "",\n        "bot": "ac4e405.e7abcc",\n        "x": 1070,\n        "y": 420,\n        "wires": [\n            []\n        ]\n    },\n    {\n        "id": "3fbbd85a.275e18",\n        "type": "change",\n        "z": "a6bcf03.19cf21",\n        "name": "\ud83d\udd28 TG data",\n        "rules": [\n            {\n                "t": "delete",\n                "p": "payload",\n                "pt": "msg"\n            },\n            {\n                "t": "set",\n                "p": "payload.chatId",\n                "pt": "msg",\n                "to": "",\n                "tot": "num"\n            },\n            {\n                "t": "set",\n                "p": "payload.type",\n                "pt": "msg",\n                "to": "message",\n                "tot": "str"\n            },\n            {\n                "t": "set",\n                "p": "payload.options.parse_mode",\n                "pt": "msg",\n                "to": "HTML",\n                "tot": "str"\n            },\n            {\n                "t": "set",\n                "p": "payload.content",\n                "pt": "msg",\n                "to": "msgText",\n                "tot": "msg"\n            }\n        ],\n        "action": "",\n        "property": "",\n        "from": "",\n        "to": "",\n        "reg": false,\n        "x": 850,\n        "y": 280,\n        "wires": [\n            [\n                "7c969859.d52578"\n            ]\n        ]\n    },\n    {\n        "id": "5e246e3a.b3fad",\n        "type": "telegram command",\n        "z": "a6bcf03.19cf21",\n        "name": "",\n        "command": "/tellmyid",\n        "bot": "ac4e405.e7abcc",\n        "strict": false,\n        "hasresponse": false,\n        "x": 320,\n        "y": 580,\n        "wires": [\n            [\n                "173ee6ee.2b81b9"\n            ],\n            []\n        ]\n    },\n    {\n        "id": "173ee6ee.2b81b9",\n        "type": "template",\n        "z": "a6bcf03.19cf21",\n        "name": "content = Your Id is ...",\n        "field": "payload.content",\n        "fieldType": "msg",\n        "format": "handlebars",\n        "syntax": "mustache",\n        "template": "Your id: <b>{{originalMessage.from.id}}</b>\\n",\n        "output": "str",\n        "x": 540,\n        "y": 580,\n        "wires": [\n            [\n                "b808886.28c9278"\n            ]\n        ]\n    },\n    {\n        "id": "b808886.28c9278",\n        "type": "change",\n        "z": "a6bcf03.19cf21",\n        "name": "set HTML parse mode",\n        "rules": [\n            {\n                "t": "set",\n                "p": "payload.options.parse_mode",\n                "pt": "msg",\n                "to": "HTML",\n                "tot": "str"\n            }\n        ],\n        "action": "",\n        "property": "",\n        "from": "",\n        "to": "",\n        "reg": false,\n        "x": 820,\n        "y": 580,\n        "wires": [\n            [\n                "7c969859.d52578"\n            ]\n        ]\n    },\n    {\n        "id": "7ca838c0.b009a8",\n        "type": "comment",\n        "z": "a6bcf03.19cf21",\n        "name": "Helper to get Chat Id",\n        "info": "",\n        "x": 350,\n        "y": 500,\n        "wires": []\n    },\n    {\n        "id": "489d1a85.86dc34",\n        "type": "btcpay-ipn",\n        "z": "a6bcf03.19cf21",\n        "client": "9711e4a7.bae348",\n        "path": "/btcpay-ipn",\n        "name": "",\n        "x": 140,\n        "y": 280,\n        "wires": [\n            [\n                "3fa0ab35.9e56e4"\n            ]\n        ]\n    },\n    {\n        "id": "ac4e405.e7abcc",\n        "type": "telegram bot",\n        "z": "",\n        "botname": "Gatekeeper bot",\n        "usernames": "",\n        "chatids": "",\n        "baseapiurl": "",\n        "updatemode": "polling",\n        "pollinterval": "300",\n        "usesocks": false,\n        "sockshost": "",\n        "socksport": "6667",\n        "socksusername": "anonymous",\n        "sockspassword": "",\n        "bothost": "",\n        "localbotport": "8443",\n        "publicbotport": "8443",\n        "privatekey": "",\n        "certificate": "",\n        "useselfsignedcertificate": false,\n        "sslterminated": false,\n        "verboselogging": false\n    },\n    {\n        "id": "9711e4a7.bae348",\n        "type": "btcpay-api-config",\n        "z": "",\n        "name": ""\n    }\n]\n')))}p.isMDXComponent=!0}}]);