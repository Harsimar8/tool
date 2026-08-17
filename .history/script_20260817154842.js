/* =========================================
   COLLAPSIBLE SECTIONS
========================================= */

function toggleSection(header) {

    const section = header.parentElement;

    section.classList.toggle("open");

}


/* =========================================
   TERRAIN VALUES
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

}


/* =========================================
   INPUT STEPPER
========================================= */

function changeInput(id, amount) {

    const input = document.getElementById(id);

    let value = Number(input.value);

    value += amount;

    if (value < 0) {
        value = 0;
    }

    input.value = value;

}


/* =========================================
   MASK
========================================= */

function toggleMask(event) {

    /*
       Prevent this click from being treated
       as a click on the section header.
    */

    if (event) {
        event.stopPropagation();
    }


    const button =
        document.getElementById("maskButton");


    const isOn =
        button.dataset.enabled === "true";


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