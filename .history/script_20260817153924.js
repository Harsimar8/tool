/* =========================================
   TERRAIN CONTROL STATE
========================================= */

let radius = 1500;
let power = 2.0;
let maxHeight = 499;


/* =========================================
   RADIUS
========================================= */

function changeRadius(amount) {

    radius += amount;

    if (radius < 100) {
        radius = 100;
    }

    if (radius > 10000) {
        radius = 10000;
    }

    document.getElementById("radiusValue").textContent =
        radius + " m";

    console.log("Radius:", radius);
}


/* =========================================
   POWER
========================================= */

function changePower(amount) {

    power += amount;

    if (power < 0) {
        power = 0;
    }

    if (power > 100) {
        power = 100;
    }

    power = Math.round(power * 10) / 10;

    document.getElementById("powerValue").textContent =
        power.toFixed(1) + " m";

    console.log("Power:", power);
}


/* =========================================
   MAX HEIGHT
========================================= */

function changeMaxHeight(amount) {

    maxHeight += amount;

    if (maxHeight < 0) {
        maxHeight = 0;
    }

    if (maxHeight > 10000) {
        maxHeight = 10000;
    }

    document.getElementById("maxHeightValue").textContent =
        maxHeight + " m";

    console.log("Max height:", maxHeight);
}


/* =========================================
   GENERIC INPUT STEPPER
========================================= */

function changeInput(id, amount) {

    const input = document.getElementById(id);

    let value = Number(input.value);

    value += amount;

    if (value < 0) {
        value = 0;
    }

    input.value = value;

    console.log(id, value);
}


/* =========================================
   MASK
========================================= */

function toggleMask() {

    const button = document.getElementById("maskButton");

    const isOn = button.dataset.enabled === "true";

    if (isOn) {

        button.dataset.enabled = "false";

        button.textContent = "Mask: OFF";

        button.classList.remove("mask-on");

        console.log("Mask OFF");

    } else {

        button.dataset.enabled = "true";

        button.textContent = "Mask: ON";

        button.classList.add("mask-on");

        console.log("Mask ON");
    }
}


/* =========================================
   COLLAPSE PANEL
========================================= */

const collapseBtn =
    document.getElementById("collapseBtn");

const panelContent =
    document.getElementById("panelContent");


collapseBtn.addEventListener("click", () => {

    const collapsed =
        panelContent.style.display === "none";

    if (collapsed) {

        panelContent.style.display = "block";

        collapseBtn.textContent = "−";

    } else {

        panelContent.style.display = "none";

        collapseBtn.textContent = "+";
    }

});


/* =========================================
   BUTTON CLICK HANDLING
========================================= */

document.querySelectorAll(".control-btn").forEach(button => {

    button.addEventListener("click", function () {

        const text = this.innerText.trim();

        console.log("Terrain control:", text);

        /*
         * Later you can connect each button
         * directly to your Cesium functions here.
         *
         * Example:
         *
         * if (text === "Elevation colours") {
         *     enableElevationColours();
         * }
         */

    });

});