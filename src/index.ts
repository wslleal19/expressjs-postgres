import bodyParser from "body-parser";
import express from "express";
import ffmpeg from "@ffmpeg-installer/ffmpeg";
const qrcode = require('qrcode');
const { Client, NoAuth } = require('whatsapp-web.js');

const app = express();
app.set('view engine', 'ejs');
const port = process.env.PORT || 3331;

const client = new Client({
    authStrategy: new NoAuth(),
    ffmpegPath: ffmpeg.path,
    puppeteer: {
        headless: true,
		args: [
            '--autoplay-policy=user-gesture-required',
            '--disable-background-networking',
            '--disable-background-timer-throttling',
            '--disable-backgrounding-occluded-windows',
            '--disable-breakpad',
            '--disable-client-side-phishing-detection',
            '--disable-component-update',
            '--disable-default-apps',
            '--disable-dev-shm-usage',
            '--disable-domain-reliability',
            '--disable-extensions',
            '--disable-features=AudioServiceOutOfProcess',
            '--disable-gpu',
            '--disable-hang-monitor',
            '--disable-ipc-flooding-protection',
            '--disable-notifications',
            '--disable-offer-store-unmasked-wallet-cards',
            '--disable-popup-blocking',
            '--disable-print-preview',
            '--disable-prompt-on-repost',
            '--disable-renderer-backgrounding',
            // '--disable-setuid-sandbox', // para usuario root
            '--disable-speech-api',
            '--disable-sync',
            '--hide-scrollbars',
            '--ignore-gpu-blacklist',
            '--metrics-recording-only',
            '--mute-audio',
            '--no-default-browser-check',
            '--no-first-run',
            '--no-pings',
            '--no-sandbox',
            '--no-zygote',
            '--password-store=basic',
            '--use-gl=swiftshader',
            '--use-mock-keychain',

        ],
	}
});

// app.use(bodyParser.json());
// app.use(bodyParser.raw({ type: "application/vnd.custom-type" }));
// app.use(bodyParser.text({ type: "text/html" }));

app.get("/", async (req, res) => {
  
  res.send(`Hello, World!`);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.get('/zap', (req, res) => {
    console.log('zap');

    client.on('qr', (qr: any) => {
        console.log('QR RECEIVED');
        qrcode.toDataURL(qr, (err: any, url: any) => {
        let html =  `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Hello!</title>
                <style>
                    .centered{
                        background: #000;
                        width: 100vw;
                        height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                </style>
            </head>
            <body>
                <div class="centered">
                    <img width="300" src="${url}" />
                </div>
            </body>
            </html>
            `
            res.type('html').send(html)
        });
      });
})

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', async (message:any) => {
    if(message.body === '#ping') {
        message.reply('pong');
    }
    if(message.body === '#s'){
        let chat = await message.getChat();
        if (message.hasQuotedMsg) message = await message.getQuotedMessage();
      
        if (message.hasMedia) {
          var media = await message.downloadMedia();
        
          return chat.sendMessage(media, {
            sendMediaAsSticker: true,
            stickerName: "WesleyBot",
            stickerAuthor: "WesleyBot",
          });
        } else {
          return message.reply("Nenhum arquivo detectado!");
        }
    }
});
 

client.initialize();
 