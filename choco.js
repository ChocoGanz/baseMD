const 
     { 
          baileys, 
          delay, 
          generateForwardMessageContent, 
          prepareWAMessageMedia,
          generateWAMessageFromContent, 
          relayMessage,
          generateMessageID, 
          downloadContentFromMessage,
          BufferJSON, 
          WA_DEFAULT_EPHEMERAL,
          downloadHistory, 
          WAProto,
          proto, 
          getMessage, 
          generateWAMessageContent
     } = require("@adiwajshing/baileys-md")
const fs = require("fs")
const cheerio = require("cheerio")
const moment = require("moment-timezone")
const { exec, spawn } = require("child_process")
const axios = require('axios')
const fetch = require('node-fetch')
const util = require('util')

const { kyun, clockString, fetchJson, fetchText, jsonformat, randomNomor, sleep, getBuffer, getGroupAdmins, getRandom } = require("./lib/funct")
const { color, bgcolor } = require("./lib/color")

const ownerNumber = ["62882250664733@s.whatsapp.net"]

module.exports = async(sock, msg, m) => {
	try {
		const from = msg.key.remoteJid
		const type = Object.keys(msg.message)[0]
        const content = JSON.stringify(msg.message)
        const chats = (type === 'conversation') ? msg.message.conversation : (type == 'imageMessage') ? msg.message.imageMessage.caption : (type == 'videoMessage') ? msg.message.videoMessage.caption : (type == 'extendedTextMessage') ? msg.message.extendedTextMessage.text : (type == 'buttonsResponseMessage') ? msg.message.buttonsResponseMessage.selectedButtonId : (type == 'listResponseMessage') ? msg.message.listResponseMessage.singleSelectReply.selectedRowId : (type == 'templateButtonReplyMessage') ? msg.message.templateButtonReplyMessage.selectedId : ''
        const prefix = /^[°zZ#$@*+,.?=''():√%!¢£¥€π¤ΠΦ_&><`™©®Δ^βα¦|/\\©^]/.test(chats) ? chats.match(/^[°zZ#$@*+,.?=''():√%¢£¥€π¤ΠΦ_&><!`™©®Δ^βα¦|/\\©^]/gi) : '/'
        const command = chats.replace(prefix, '').trim().split(/ +/).shift().toLowerCase()
	    const args = chats.split(' ')
        const isGroup = msg.key.remoteJid.endsWith('@g.us')
        const isPrivate = msg.key.remoteJid.endsWith('@s.whatsapp.net')
        const sender = isGroup ? (msg.key.participant ? msg.key.participant : msg.participant) : msg.key.remoteJid
        const senderNumber = sender.split("@")[0] 
        const pushname = msg.pushName
        const isCmd = chats.startsWith(prefix)
        const q = chats.slice(command.length + 1, chats.length)
        const body = chats.startsWith(prefix) ? chats : ''
        const botNumber = sock.user.id.split(':')[0] + '@s.whatsapp.net'
        const groupMetadata = isGroup ? await sock.groupMetadata(from) : ''
	    const groupName = isGroup ? groupMetadata.subject : ''
	    const groupId = isGroup ? groupMetadata.id : ''
	    const groupMembers = isGroup ? groupMetadata.participants : ''
	    const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
	    const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
	    const isBotAdmins = groupAdmins.includes(botNumber) || false
	    const isGroupAdmins = groupAdmins.includes(sender) || false
        const isOwner = ownerNumber.includes(sender)        
        const ucapan = "Selamat "+ moment(Date.now()).tz('Asia/Jakarta').locale('id').format('a')
        const times = moment(Date.now()).tz('Asia/Jakarta').locale('id').format('HH:mm:ss')
        const time = moment(Date.now()).tz('Asia/Jakarta').locale('id').format('DD/MM/YY HH:mm:ss z')
        
//=========================================================================================//

       const mess = {
        	wait: "Loading...",
            sukses: "Sukses",
            error: "Maaf kak fitur ini error\n\nKamu bisa melaporkan nya ke owner dengan ketik */report (isi pesan)*",
            invL: "Masukkan link!",
            invQ: "Masukkan query!",
            owner: "Fitur ini khusus owner!",
            group: "Fitur ini hanya bisa di grup!",
            private: "Fitur ini hanya bisa di private chat!",
            admin: "Fitur ini hanya bisa di gunakan oleh admin!",
            botAdmin: "Fitur ini hanya bisa di gunakan ketika bot menjadi admin!"
       }
        
       const reply = (teks) => {
        	return sock.sendMessage(from, { text: teks }, { quoted: msg })
       }
       
       const sendMess = (msg, teks, men, qwt) => {
             return sock.sendMessage(typeof msg == 'object'?msg.key.remoteJid: typeof msg == 'object'? msg.key.remoteJid: msg, { text: teks, mentions: men ? men : [] }, { quoted: qwt ? qwt : msg })
       }
       
       const sendFileFromUrl = async (from, url, caption, msg, men) => {
            let mime = '';
            let res = await axios.head(url)
            mime = res.headers['content-type']
            if (mime.split("/")[1] === "gif") {
                return sock.sendMessage(from, { video: await getBuffer(url), caption: caption, gifPlayback: true, mentions: men ? men : []}, {quoted: msg})
            }
            let type = mime.split("/")[0]+"Message"
            if(mime === "application/pdf"){
                return sock.sendMessage(from, { document: await getBuffer(url), mimetype: 'application/pdf', caption: caption, mentions: men ? men : []}, {quoted: msg })
            }
            if(mime.split("/")[0] === "image"){
                return sock.sendMessage(from, { image: await getBuffer(url), caption: caption, mentions: men ? men : []}, {quoted: msg})
            }
            if(mime.split("/")[0] === "video"){
                return sock.sendMessage(from, { video: await getBuffer(url), caption: caption, mentions: men ? men : []}, {quoted: msg})
            }
            if(mime.split("/")[0] === "audio"){
                return sock.sendMessage(from, { audio: await getBuffer(url), caption: caption, mentions: men ? men : [], mimetype: 'audio'}, {quoted: msg })
            }
        }
        
//=========================================================================================//
        
        const isImage = (type == 'imageMessage')
        const isVideo = (type == 'videoMessage')
        const isAudio = (type == 'audioMessage')
        const isSticker = (type == 'stickerMessage')
        const isQuoted = (type == 'extendedTextMessage')
        
        const isQuotedImage = type === 'extendedTextMessage' && content.includes('imageMessage')
		const isQuotedVideo = type === 'extendedTextMessage' && content.includes('videoMessage')
		const isQuotedAudio = type === 'extendedTextMessage' && content.includes('audioMessage')
		const isQuotedSticker = type === 'extendedTextMessage' && content.includes('stickerMessage')
        
        if (chats) { console.log(color("[ MESSAGE ]  ", "yellow"), color(time), "Pesan: ", color(chats), "||", "Type: ", color(type), "||", "In: ", color(from)) }
        
        switch (command) {
        
        /*
        kalau kamu mau nambah fitur, nambah aja fitur nya di sini
        */
        
        default:
        if (isOwner){
        if (chats.startsWith("> ")){
                try {
                    let evaled = await eval(chats.slice(2))
                    if (typeof evaled !== 'string') evaled = require('util').inspect(evaled)
                    reply(evaled)
                } catch (err) {
                    reply(`${err}`)
               }
         } else if (chats.startsWith('=>')) {
                    function Return(sul) {
                        sat = JSON.stringify(sul, null, 2)
                        bang = util.format(sat)
                            if (sat == undefined) {
                                bang = util.format(sul)
                            }
                            return reply(bang)
                    }
                    try {
                        reply(util.format(eval(`(async () => { return ${q} })()`)))
                    } catch (e) {
                        reply(String(e))
                    }
                } else if (chats.startsWith("$ ")){
                exec(chats.slice(2), (err, stdout) => {
					if (err) return reply(`${err}`)
					if (stdout) reply(`${stdout}`)
				    })
                }
        } else {
        	reply(mess.owner)
        }
        
        }
            } catch (e) {
               console.log(color(e, 'red'))
            }
        }