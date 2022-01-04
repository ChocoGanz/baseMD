const P = require("pino")
const { default: makeWASocket, DisconnectReason, AnyMessageContent, delay, useSingleFileAuthState } = require('@adiwajshing/baileys-md')

const { state, saveState } = useSingleFileAuthState('./auth_info_multi.json')

// start a connection
const startSock = () => {
    
    const sock = makeWASocket({
        logger: P({ level: 'trace' }),
        printQRInTerminal: true,
        auth: state,
        // implement to handle retries
        getMessage: async key => {
            return {
                conversation: 'hello'
            }
        }
    })
    
    sock.ev.on('messages.upsert', async m => {
        console.log(JSON.stringify(m, undefined, 2))
        
        const msg = m.messages[0]
        require('./choco.js')(sock, msg, m)
    })

    sock.ev.on('messages.update', m => console.log(m))
    sock.ev.on('presence.update', m => console.log(m))
    sock.ev.on('chats.update', m => console.log(m))
    sock.ev.on('contacts.update', m => console.log(m))

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update
        if (connection === 'close') {
            console.log('Koneksi terputus....')
            if (lastDisconnect.error?.output?.statusCode === DisconnectReason.loggedOut) console.log('Whatsapp Web Telah Logout.')
            else startSock()
        }
        console.log('connection update', update)
    })
    
    // listen for when the auth credentials is updated
    sock.ev.on('creds.update', saveState)

    return sock
}

startSock()