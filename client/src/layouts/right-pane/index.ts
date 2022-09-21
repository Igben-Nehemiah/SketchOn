type RightPaneProperties = {
    strokeStyle: string;
    fillStyle: string;
    lineWidth: number;
};

//
const rightPaneProperties: RightPaneProperties = {
    fillStyle: "#000000",
    strokeStyle: "#000000",
    lineWidth: 1.0,
};

// Events
let rightPaneExpanded: boolean = true;
const collapse = new CustomEvent<{ collapsed: boolean }>("collapse", {
    detail: {
        collapsed: rightPaneExpanded,
    },
    bubbles: true,
    cancelable: true,
    composed: false,
});

const propertiesChange = new CustomEvent<{
    rightPaneProperties: RightPaneProperties;
}>("propertiesChange", {
    detail: {
        rightPaneProperties: rightPaneProperties,
    },
    bubbles: true,
    cancelable: true,
    composed: false,
});

function createRightPane() {
    const rightPane = document.querySelector(".right-pane")!;
    const chatTab = document.querySelector(".chat-tab")!;
    const propertiesTab = document.querySelector(".properties-tab")!;

    // Buttons
    const propertiesBtn = (document.getElementById(
        "properties"
    ) as HTMLButtonElement)!;
    const chatBtn = (document.getElementById("chat") as HTMLButtonElement)!;

    const expandBtn = (document.getElementById("expand") as HTMLButtonElement)!;
    // const collapseBtn = (document.getElementById("collapse") as HTMLButtonElement)!;

    //Color inputs
    const strokeColorInput = (document.getElementById(
        "stroke-color"
    ) as HTMLInputElement)!;
    strokeColorInput.value = rightPaneProperties.strokeStyle;

    const fillColorInput = (document.getElementById(
        "fill-color"
    ) as HTMLInputElement)!;
    fillColorInput.value = rightPaneProperties.fillStyle;

    //Select input
    const lineWidthInput = (document.getElementById(
        "line-width"
    ) as HTMLSelectElement)!;

    attachEventListeners();

    function attachEventListeners() {
        propertiesBtn.addEventListener("click", () => {
            chatTab.classList.toggle("active-tab");
            propertiesTab.classList.toggle("active-tab");

            propertiesBtn.classList.toggle("active");
            chatBtn.classList.toggle("active");
        });

        chatBtn.addEventListener("click", () => {
            chatTab.classList.toggle("active-tab");
            propertiesTab.classList.toggle("active-tab");

            propertiesBtn.classList.toggle("active");
            chatBtn.classList.toggle("active");
        });

        expandBtn.addEventListener("click", () => {
            rightPane.classList.toggle("expand");
            rightPaneExpanded = false;
            expandBtn.dispatchEvent(collapse);
        });

        lineWidthInput.addEventListener("change", (e: Event) => {
            const target = (e.target as HTMLSelectElement)!;
            rightPaneProperties.lineWidth = Number.parseFloat(target.value);
            raiseRightPanePropertiesChanged();
        });

        strokeColorInput.addEventListener("change", (e: Event) => {
            const target = (e.target as HTMLInputElement)!;
            rightPaneProperties.strokeStyle = target.value;
            raiseRightPanePropertiesChanged();
        });

        fillColorInput.addEventListener("change", (e: Event) => {
            const target = (e.target as HTMLInputElement)!;
            rightPaneProperties.fillStyle = target.value;
            raiseRightPanePropertiesChanged();
        });
    }

    function raiseRightPanePropertiesChanged() {
        rightPane.dispatchEvent(propertiesChange);
    }
}

export { createRightPane, rightPaneExpanded };
export type { RightPaneProperties };
