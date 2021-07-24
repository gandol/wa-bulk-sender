import {
    WAConnection,
    MessageType,
    Mimetype,
    ReconnectMode,
} from '@adiwajshing/baileys'
import * as fs from 'fs'
import config from './config'
(async () => {
    const numberList = []
    const versionLatest = await getLatestVersion()
    fs.readFileSync('./number.txt', 'utf-8').split(/\r?\n/).forEach(function (line) {
        numberList.push(line)
    })
    const messageToSend = fs.readFileSync('./message.txt', 'utf-8')

    const conn = new WAConnection()
    conn.version = versionLatest || [2, 2119, 6]
    conn.autoReconnect = ReconnectMode.onConnectionLost
    conn.logger.level = 'warn'
    fs.existsSync('./auth_info.json') && conn.loadAuthInfo('./auth_info.json')
    conn.connectOptions.maxRetries = 10
    await conn.connect()
    const unread = await conn.loadAllUnreadMessages()
    console.log(unread)
    console.log('oh hello ' + conn.user.name + ' (' + conn.user.jid + ')')
    console.log('you have ' + conn.chats.all().length + ' chats & ' + Object.keys(conn.contacts).length + ' contacts')
    console.log('you have ' + unread.length + ' unread messages')

    const authInfo = conn.base64EncodedAuthInfo()
    fs.writeFileSync('./auth_info.json', JSON.stringify(authInfo, null, '\t'))
    conn.on('user-presence-update', json => console.log(json.id + ' presence is ' + json.type))
    conn.on('message-status-update', json => {
    })
    for (let indexNumber = 0; indexNumber < numberList.length; indexNumber++) {
        const recipientNumber = numberList[indexNumber]
        if (config.sendMessageImage) {
            let optionsSend = []
            if (config.sendMessageCaption) {
                optionsSend = {
                    mimetype: Mimetype.jpeg,
                    caption: messageToSend
                }
            } else {
                optionsSend = {
                    mimetype: Mimetype.jpeg,
                }
            }
            const content = fs.readFileSync(config.imageFileName)
            await conn.sendMessage(`${recipientNumber}@s.whatsapp.net`, content, MessageType.image, optionsSend)
            if (config.sendMessageText) {
                await conn.sendMessage(`${recipientNumber}@s.whatsapp.net`, messageToSend, MessageType.text)
            }
        } else if (config.sendMessageVideo) {
            let optionsSend = []
            if (config.sendMessageCaption) {
                optionsSend = {
                    mimetype: Mimetype.mp4,
                    caption: messageToSend
                }
            } else {
                optionsSend = {
                    mimetype: Mimetype.mp4,
                }
            }
            const content = fs.readFileSync(config.videoFileName)
            await conn.sendMessage(`${recipientNumber}@s.whatsapp.net`, content, MessageType.video, optionsSend)
            if (config.sendMessageText) {
                await conn.sendMessage(`${recipientNumber}@s.whatsapp.net`, messageToSend, MessageType.text)
            }
        } else if (config.sendMessageDocument) {
            let optionsSend = {
                mimetype: Mimetype.pdf
            }
            const content = fs.readFileSync(config.docFileName)
            await conn.sendMessage(`${recipientNumber}@s.whatsapp.net`, content, MessageType.document, optionsSend)
            if (config.sendMessageText) {
                await conn.sendMessage(`${recipientNumber}@s.whatsapp.net`, messageToSend, MessageType.text)
            }
        } else if (config.sendMessageContact) {
            const content = fs.readFileSync(config.docFileName)
            await conn.sendMessage(`${recipientNumber}@s.whatsapp.net`, { displayName: config.contactSendAs, vcard: content }, MessageType.contact)
            if (config.sendMessageText) {
                await conn.sendMessage(`${recipientNumber}@s.whatsapp.net`, messageToSend, MessageType.text)
            }
        } else {
            const buttons = [
                { buttonId: 'id1', buttonText: { displayText: 'Button 1' }, type: 1 },
                { buttonId: 'id2', buttonText: { displayText: 'Button 2' }, type: 1 }
            ]

            const buttonMessage = {
                contentText: "Hi it's button message",
                footerText: 'Hello World',
                buttons: buttons,
                headerType: 1
            }

            const sendMsg = await conn.sendMessage(`${recipientNumber}@s.whatsapp.net`, buttonMessage, MessageType.buttonsMessage)
            // await conn.sendMessage(`${recipientNumber}@s.whatsapp.net`, messageToSend, MessageType.text)
        }
        console.log(`Message was sent to ${recipientNumber}`);
        await sleep(config.delaySender * 1000);
    }
    conn.on('close', ({ reason, isReconnecting }) => (
        console.log('oh no got disconnected: ' + reason + ', reconnecting: ' + isReconnecting)
    ))
})()

async function getLatestVersion() {
    try {
        const { data } = await Axios.get("https://web.whatsapp.com/check-update?version=2.2123.8&platform=web")
        const { currentVersion } = data
        const versionArray = currentVersion.split('.')
        return versionArray
    } catch (error) {
        return false
    }
}
const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));