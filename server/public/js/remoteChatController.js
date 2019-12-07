class RemoteChatController {
    constructor() {
    }

    addToChatRoom(socket) {
        socket.on("message", ({senderId, message}) => {
            io.emit("message", ({senderId,message}));
        })
    }
}