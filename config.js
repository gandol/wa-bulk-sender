const config = {
    sendMessageImage: false, //set true if want to send image
    sendMessageVideo: false,//set true if want to send video
    sendMessageContact: false,//set trus if want to send contact
    sendMessageDocument: false, //set true if you want send document
    sendMessageCaption: false, //set true if you want to send caption for image and vide
    sendMessageText: true,//set true if want to send text after send image,video,document or contact,but this is not the caption
    contactSendAs: "Gandol Contact", // send contas as this name
    contactFilenName: "contact.csv", // path for the contact file
    imageFileName: "./file/img.jpeg", // path for the image
    videoFileName: "./file/big.mp4", // path for the video
    docFileName: "./file/invoice.pdf", // path for the document
    delaySender: 3 // delay after message was sent
}
module.exports = config