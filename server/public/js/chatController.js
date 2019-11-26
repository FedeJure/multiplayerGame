class Chat {
  constructor(scene) {
    this.scene = scene;
    this.isOpen = false;
    this.chatHtmlObject = document.getElementById("chat");

    console.log(scene.input)
    const self = this;

    document.addEventListener('keydown', function(event) {
        if (event.code == "Enter") {
            self.openClose();
        }
    });
  }

  openClose() {
    this.isOpen = !this.isOpen;
    this.chatHtmlObject.hidden = !this.isOpen;
    this.isOpen
      ? this.scene.input.keyboard.disableGlobalCapture()
      : this.scene.input.keyboard.enableGlobalCapture();
  }
}
