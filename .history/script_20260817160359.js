/* =========================================================
   TERRAIN STATE
========================================================= */

let radius = 1500;

let power = 2.0;

let maxHeight = 499;


/* =========================================================
   SECTION DROPDOWN
========================================================= */

function toggleSection(header) {

    const section =
        header.closest(".control-section");


    section.classList.toggle("open");

}


/* =========================================================
   BRUSH MODE
========================================================= */

function selectBrushMode(button) {

    const buttons =
        document.querySelectorAll(".mode-button");


    buttons.forEach(btn => {

        btn.classList.remove("selected");

    });


    button.classList.add("selected");


    setStatus(
        button.innerText.trim()
    );


    console.log(
        "Brush mode:",
        button.innerText.trim()
    );
}


/* =========================================================
   TOOL BUTTON
========================================================= */

function activateTool(button) {

    /*
     * Don't visually select every tool permanently.
     * This can later be connected directly to Cesium.
     */

    const toolName =
        button.innerText.trim();


    setStatus(toolName);


    console.log(
        "Terrain tool:",
        toolName
    );
}


/* =========================================================
   RADIUS
========================================================= */

function changeRadius(amount) {

    radius += amount;


    if (radius < 100) {

        radius = 100;

    }


    if (radius > 10000) {

        radius = 10000;

    }


    document.getElementById(
        "radiusValue"
    ).textContent = radius + " m";


    setStatus(
        "Brush radius: " + radius + " m"
    );


    console.log(
        "Radius:",
        radius
    );
}


/* =========================================================
   POWER
========================================================= */

function changePower(amount) {

    power += amount;


    if (power < 0) {

        power = 0;

    }


    if (power > 100) {

        power = 100;

    }


    power =
        Math.round(power * 10) / 10;


    document.getElementById(
        "powerValue"
    ).textContent =
        power.toFixed(1) + " m";


    setStatus(
        "Brush power: " +
        power.toFixed(1) +
        " m"
    );


    console.log(
        "Power:",
        power
    );
}


/* =========================================================
   MAX HEIGHT
========================================================= */

function changeMaxHeight(amount) {

    maxHeight += amount;


    if (maxHeight < 0) {

        maxHeight = 0;

    }


    if (maxHeight > 10000) {

        maxHeight = 10000;

    }


    document.getElementById(
        "maxHeightValue"
    ).textContent =
        maxHeight + " m";


    setStatus(
        "Maximum height: " +
        maxHeight +
        " m"
    );


    console.log(
        "Max height:",
        maxHeight
    );
}


/* =========================================================
   INPUT STEPPER
========================================================= */

function changeInput(id, amount) {

    const input =
        document.getElementById(id);


    let value =
        Number(input.value);


    value += amount;


    if (value < 0) {

        value = 0;

    }


    input.value = value;


    setStatus(
        input.id + ": " + value
    );


    console.log(
        input.id,
        value
    );
}


/* =========================================================
   MASK
========================================================= */

function toggleMask(event) {

    /*
     * Prevent the button click from
     * accidentally affecting anything
     * outside the mask control.
     */

    if (event) {

        event.stopPropagation();

    }


    const button =
        document.getElementById(
            "maskButton"
        );


    const enabled =
        button.dataset.enabled === "true";


    if (enabled) {

        button.dataset.enabled = "false";

        button.textContent =
            "Mask: OFF";


        button.classList.remove(
            "mask-on"
        );


        setStatus(
            "Terrain mask disabled"
        );


        console.log(
            "Mask OFF"
        );

    } else {

        button.dataset.enabled = "true";

        button.textContent =
            "Mask: ON";


        button.classList.add(
            "mask-on"
        );


        setStatus(
            "Terrain mask enabled"
        );


        console.log(
            "Mask ON"
        );
    }
}


/* =========================================================
   UNDO / REDO / RESET
========================================================= */

function performAction(action) {

    console.log(
        "Terrain action:",
        action
    );


    if (action === "Undo") {

        setStatus(
            "Undo terrain change"
        );

    }


    if (action === "Redo") {

        setStatus(
            "Redo terrain change"
        );

    }


    if (action === "Reset") {

        setStatus(
            "Terrain reset"
        );

    }


    /*
     * Later connect these directly
     * to your Cesium terrain logic.
     */
}


/* =========================================================
   STATUS
========================================================= */

let statusTimer;


function setStatus(message) {

    const status =
        document.getElementById(
            "statusText"
        );


    if (!status) {

        return;

    }


    status.textContent = message;


    clearTimeout(statusTimer);


    statusTimer = setTimeout(() => {

        status.textContent =
            "Terrain editor ready";

    }, 2500);
}