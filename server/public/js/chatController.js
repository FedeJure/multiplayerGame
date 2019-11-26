const openChatClass = "openChat";
const closeChatClass = "closeChat";

let chatForm = null;

class Chat {
  constructor(scene) {
    this.scene = scene;
    this.isOpen = false;
    this.chatHtmlObject = document.getElementById("chat");
    const self = this;
    document.addEventListener('keydown', function (event) {
      if (event.code == "Enter") {
        self.openClose();
      }
    });
    chatForm = document.getElementById("chatForm");

    socket.on("message", ({ senderId, message }) => {
    })

    chatForm.addEventListener("submit", this.onChatSubmit)
  }

  openClose() {
    this.isOpen = !this.isOpen;
    this.chatHtmlObject.hidden = !this.isOpen;
    this.isOpen
      ? this.openChat()
      : this.closeChat();
  }

  openChat() {
    this.scene.input.keyboard.enabled = false;
    this.scene.input.keyboard.keys.forEach(key => key.reset());
    this.scene.input.keyboard.disableGlobalCapture();
    this.chatHtmlObject.classList.replace(closeChatClass, openChatClass);
    chatForm.children.input.value = ""
    chatForm.children.input.focus();

  }

  closeChat() {
    this.scene.input.keyboard.enabled = true;
    this.scene.input.keyboard.keys.forEach(key => key.reset());
    this.scene.input.keyboard.enableGlobalCapture();
    this.chatHtmlObject.hidden = true;
    chatForm.children.input.blur();
    
    this.chatHtmlObject.classList.replace(openChatClass, closeChatClass);
  }

  onChatSubmit(event) {
    event.preventDefault();
    socket.emit("message", ({ senderId: socket.id, message: chatForm.children.input.value }));
  }
}
