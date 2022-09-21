const Collapse = new CustomEvent("collapse", {
    detail: {},
    bubbles: true,
    cancelable: true,
    composed: false,
});

let rightPaneExpanded: boolean;

function createRightPane() {
    const chat = document.querySelector(".chat")!;
    const properties = document.querySelector(".properties")!;
    const rightPane = document.querySelector(".right-pane")!;
    const canvas = (document.querySelector("#canvas") as HTMLCanvasElement)!;
    const propertiesBtn = (document.getElementById(
        "properties"
    ) as HTMLButtonElement)!;

    const expandBtn = (document.getElementById("expand") as HTMLButtonElement)!;

    const chatBtn = (document.getElementById("chat") as HTMLButtonElement)!;

    propertiesBtn.addEventListener("click", () => {
        chat.classList.toggle("active-tab");
        properties.classList.toggle("active-tab");

        propertiesBtn.classList.toggle("active");
        chatBtn.classList.toggle("active");
    });

    chatBtn.addEventListener("click", () => {
        chat.classList.toggle("active-tab");
        properties.classList.toggle("active-tab");

        propertiesBtn.classList.toggle("active");
        chatBtn.classList.toggle("active");
    });

    expandBtn.addEventListener("click", () => {
        rightPane.classList.toggle("expand");
        let t = expandBtn.dispatchEvent(Collapse);
        console.log("T:", t);
        rightPaneExpanded = false;
        canvas?.classList.add("full-canvas");
        canvas.width = 2000;
    });
}

export { createRightPane, rightPaneExpanded };
