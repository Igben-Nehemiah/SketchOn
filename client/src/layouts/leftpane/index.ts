type ItemType = "Triangle" | "Circle" | "Rect" | "Triangle" | "Line";
type LeftPaneItem = {
    name: ItemType;
};

const items: LeftPaneItem[] = [
    {
        name: "Triangle",
    },
    {
        name: "Circle",
    },
    {
        name: "Rect",
    },
    {
        name: "Line",
    },
];

let selectedLeftPaneItem: ItemType;
const leftPane = document.querySelector(".left-pane");

function leftPaneButtonClickHandler(e: Event) {
    removeSelection();
    const btn = e.target as HTMLButtonElement;
    btn.classList.add("selected");
    switch (btn.getAttribute("data-itemType")) {
        case "Triangle":
            selectedLeftPaneItem = "Triangle";
            break;

        default:
            break;
    }
}

function removeSelection() {
    for (let index = 0; index < leftPane!.childElementCount; index++) {
        leftPane?.children[index].classList.remove("selected");
    }
}

function createLeftPane() {
    items.forEach((item) => {
        const btn = document.createElement("button");
        btn.setAttribute("data-itemType", item.name);
        btn.addEventListener("click", leftPaneButtonClickHandler);
        btn.innerHTML = item.name;
        leftPane?.appendChild(btn);
    });
}

export { createLeftPane, selectedLeftPaneItem };
