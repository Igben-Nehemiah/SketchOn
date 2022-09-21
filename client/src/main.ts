import { createLeftPane } from "./layouts/leftpane";
import {
    createCanvas,
    resizeCanvas,
    setDrawingProperties,
} from "./layouts/canvas";
import {
    createRightPane,
    rightPaneExpanded,
    RightPaneProperties,
} from "./layouts/right-pane";

const main = document.querySelector("main")!;
createCanvas();
createLeftPane();
createRightPane();

main.addEventListener("collapse", (e: Event) => {
    // main.classList.toggle("full-canvas");
    // console.log(e.details);
    var eee = e as CustomEvent<{ collapsed: boolean }>;
    console.log(eee.detail.collapsed);
    resizeCanvas();
});

main.addEventListener("propertiesChange", (e: Event) => {
    console.log("In the main");
    var eee = e as CustomEvent<{ rightPaneProperties: RightPaneProperties }>;
    setDrawingProperties(eee.detail.rightPaneProperties);
});
