/* =====================================================
   TERRAIN STATE
===================================================== */

let radius = 1500;
let power = 2.0;
let maxHeight = 499;
let statusTimer;


/* =====================================================
   SECTION DROPDOWNS
===================================================== */

function toggleSection(header) {
    header.closest(".control-section").classList.toggle("open");
}


/* =====================================================
   SELECTION
===================================================== */

function selectOption(button, name) {

    const section = button.closest(".control-section");
    const selected = button.classList.contains("selected");

    section.querySelectorAll(".tool-button.selected")
        .forEach(btn => btn.classList.remove("selected"));

    // Clicking the already-selected button = deselect
    if (selected) {
        hideNotification();
        setStatus(name + " deselected");
        return;
    }

    button.classList.add("selected");

    showNotification(name);
    setStatus(name + " selected");
}


/* =====================================================
   BRUSH MODE
===================================================== */


function selectBrushMode(button) {

    const selected = button.classList.contains("selected");

    document
        .querySelectorAll(".mode-button")
        .forEach(btn => btn.classList.remove("selected"));

    if (selected) {
        hideNotification();
        setStatus(button.innerText.trim() + " deselected");
        return;
    }

    button.classList.add("selected");

    const name = button.innerText.trim();

    showNotification(name);
    setStatus(name + " selected");
}


/* =====================================================
   TERRAIN TOOL
===================================================== */

function activateTool(button) {

    const name = button.innerText.trim();

    selectOption(button, name);
}


/* =====================================================
   VALUE CONTROLS
===================================================== */

function changeRadius(amount) {

    radius = clamp(radius + amount, 100, 10000);

    update("radiusValue", radius + " m");

    setStatus("Brush radius: " + radius + " m");
}


function changePower(amount) {

    power = clamp(power + amount, 0, 100);
    power = Math.round(power * 10) / 10;

    update("powerValue", power.toFixed(1) + " m");

    setStatus("Brush power: " + power.toFixed(1) + " m");
}


function changeMaxHeight(amount) {

    maxHeight = clamp(maxHeight + amount, 0, 10000);

    update("maxHeightValue", maxHeight + " m");

    setStatus("Maximum height: " + maxHeight + " m");
}


function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}


function update(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
}


/* =====================================================
   INPUT STEPPERS
===================================================== */

function changeInput(id, amount) {

    const input = document.getElementById(id);

    if (!input) return;

    input.value = Math.max(0, Number(input.value) + amount);

    setStatus(
        input.id + ": " + input.value
    );
}


/* =====================================================
   MASK
===================================================== */

function toggleMask(event) {

    if (event) event.stopPropagation();

    const button = document.getElementById("maskButton");

    const enabled =
        button.dataset.enabled === "true";

    button.dataset.enabled = String(!enabled);

    button.textContent =
        `Mask: ${enabled ? "OFF" : "ON"}`;

    button.classList.toggle(
        "mask-on",
        !enabled
    );

    showNotification(
        `Terrain Mask ${enabled ? "OFF" : "ON"}`
    );

    setStatus(
        `Terrain mask ${enabled ? "disabled" : "enabled"}`
    );
}


/* =====================================================
   UNDO / REDO / RESET
===================================================== */

function performAction(action) {

    showNotification(action);

    setStatus(
        action === "Undo"
            ? "Undo terrain change"
            : action === "Redo"
                ? "Redo terrain change"
                : "Terrain reset"
    );
}


/* =====================================================
   ORBAT SYMBOL PICKER
===================================================== */

const symbolVariants = {

    Radar: [
        {
            name: "Ground Surveillance / Target Acquisition",
            type: "Land",
            image: "symbols/radar/ground.png"
        },

        {
            name: "Sea-Based X-Band Radar",
            type: "Sea",
            image: "symbols/radar/sea-x-band."
        },

        {
            name: "Ground Track Signal Early Warning",
            type: "Land / EW",
            image: "symbols/radar/ground-early-warning.svg"
        },

        {
            name: "Ground Track Signal Fire Control",
            type: "Land / Fire Control",
            image: "symbols/radar/ground-fire-control.png"
        }
    ],

    SAM: [
        {
            name: "SHORAD",
            icon: "▣"
        },
        {
            name: "MRAD",
            icon: "▣"
        },
        {
            name: "LRAD",
            icon: "▣"
        },
        {
            name: "TELAR",
            icon: "▣"
        }
    ],

    Missile: [
        {
            name: "Surface-to-Air",
            icon: "◆"
        },
        {
            name: "Surface-to-Surface",
            icon: "◆"
        },
        {
            name: "Air-to-Air",
            icon: "◆"
        },
        {
            name: "Air-to-Surface",
            icon: "◆"
        }
    ],

    Tank: [
        {
            name: "Main Battle Tank",
            icon: "▰"
        },
        {
            name: "Light Tank",
            icon: "▰"
        },
        {
            name: "Heavy Tank",
            icon: "▰"
        }
    ],

    Artillery: [
        {
            name: "Self-Propelled",
            icon: "◈"
        },
        {
            name: "Towed",
            icon: "◈"
        },
        {
            name: "Rocket Artillery",
            icon: "◈"
        }
    ],

    Fighter: [
        {
            name: "Air Superiority",
            icon: "✈"
        },
        {
            name: "Multirole",
            icon: "✈"
        },
        {
            name: "Interceptor",
            icon: "✈"
        }
    ],

    Bomber: [
        {
            name: "Strategic",
            icon: "✈"
        },
        {
            name: "Tactical",
            icon: "✈"
        }
    ],

    "Attack Aircraft": [
        {
            name: "Ground Attack",
            icon: "✈"
        },
        {
            name: "Close Air Support",
            icon: "✈"
        },
        {
            name: "Strike",
            icon: "✈"
        }
    ],

    AWACS: [
        {
            name: "AEW&C",
            icon: "◉"
        }
    ]

};


let activeSymbolCategory = null;
let selectedOrbatSymbol = null;


/* =====================================================
   OPEN SYMBOL PICKER
===================================================== */

function openSymbolPicker(event, category) {

    event.stopPropagation();

    const picker = document.getElementById("symbolPicker");
    const title = document.getElementById("symbolPickerTitle");
    const grid = document.getElementById("symbolPickerGrid");

    if (!picker || !title || !grid) return;


    /*
       Clicking the same category again
       closes the picker.
    */

    if (
        activeSymbolCategory === category &&
        picker.classList.contains("show")
    ) {

        closeSymbolPicker();

        return;
    }


    activeSymbolCategory = category;


    title.textContent = category.toUpperCase();


    grid.innerHTML = "";


    const variants = symbolVariants[category] || [];


    variants.forEach(variant => {

        const button = document.createElement("button");

        button.className = "symbol-subtype";


        /*
           If this is currently selected,
           restore the selected appearance.
        */

        if (
            selectedOrbatSymbol &&
            selectedOrbatSymbol.category === category &&
            selectedOrbatSymbol.variant === variant.name
        ) {

            button.classList.add("selected");
        }


        button.innerHTML = `
    <span class="symbol-subtype-icon">
        <img src="${variant.image}" alt="${variant.name}">
    </span>

    <span class="symbol-subtype-name">
        ${variant.name}
    </span>

    <span class="symbol-subtype-type">
        ${variant.type || ""}
    </span>
`;

        button.onclick = function (e) {

            e.stopPropagation();

            selectOrbatSymbol(
                category,
                variant.name,
                button
            );

        };


        grid.appendChild(button);

    });


    /*
       Position popup next to the clicked button.
    */

    const buttonRect =
        event.currentTarget.getBoundingClientRect();


    let left =
        buttonRect.right + 10;


    let top =
        buttonRect.top;


    /*
       Keep popup inside the screen.
    */

    const popupWidth = 330;
    const popupHeight = 300;


    if (
        left + popupWidth >
        window.innerWidth - 10
    ) {

        left =
            buttonRect.left -
            popupWidth -
            10;
    }


    if (
        top + popupHeight >
        window.innerHeight - 10
    ) {

        top =
            window.innerHeight -
            popupHeight -
            10;
    }


    top = Math.max(10, top);
    left = Math.max(10, left);


    picker.style.left = left + "px";
    picker.style.top = top + "px";


    picker.classList.add("show");


    /*
       Highlight the main category.
    */

    document
        .querySelectorAll(".symbol-main-button")
        .forEach(btn => {

            btn.classList.toggle(
                "selected",
                btn.dataset.symbol === category
            );

        });

}


/* =====================================================
   SELECT OR DESELECT ORBAT SYMBOL
===================================================== */

function selectOrbatSymbol(category, variant, button) {


    /*
       Clicking the currently selected
       variant = deselect.
    */

    if (
        selectedOrbatSymbol &&
        selectedOrbatSymbol.category === category &&
        selectedOrbatSymbol.variant === variant
    ) {

        selectedOrbatSymbol = null;

        button.classList.remove("selected");

        showNotification(
            category + " deselected"
        );

        setStatus(
            category + " deselected"
        );

        return;
    }


    /*
       New selection.
    */

    selectedOrbatSymbol = {

        category: category,

        variant: variant

    };


    /*
       Remove selection from
       all subtype buttons.
    */

    document
        .querySelectorAll(".symbol-subtype")
        .forEach(btn => {

            btn.classList.remove("selected");

        });


    button.classList.add("selected");


    showNotification(
        variant + " " + category
    );


    setStatus(
        variant + " " + category + " selected"
    );


    console.log(
        "ORBAT SYMBOL SELECTED:",
        selectedOrbatSymbol
    );

}


/* =====================================================
   CLOSE SYMBOL PICKER
===================================================== */

function closeSymbolPicker() {

    const picker =
        document.getElementById("symbolPicker");

    if (!picker) return;


    picker.classList.remove("show");


    activeSymbolCategory = null;


    /*
       Remove category highlight.
    */

    document
        .querySelectorAll(".symbol-main-button")
        .forEach(btn => {

            btn.classList.remove("selected");

        });

}


/* =====================================================
   CLICK OUTSIDE POPUP = CLOSE
===================================================== */

document.addEventListener("click", event => {

    const picker =
        document.getElementById("symbolPicker");


    if (!picker) return;


    if (
        picker.classList.contains("show") &&
        !picker.contains(event.target) &&
        !event.target.closest(".symbol-main-button")
    ) {

        closeSymbolPicker();

    }

});


/* =====================================================
   CENTER NOTIFICATION
===================================================== */

function hideNotification() {
    const notification =
        document.getElementById("toolNotification");

    if (notification) {
        notification.classList.remove("show");
    }
}


function showNotification(name) {

    const notification =
        document.getElementById("toolNotification");

    const text =
        document.getElementById("notificationText");

    if (!notification || !text) return;

    text.textContent = name;

    notification.classList.add("show");

    clearTimeout(statusTimer);

    statusTimer = setTimeout(() => {
        notification.classList.remove("show");
    }, 1500);
}


/* =====================================================
   STATUS BAR
===================================================== */

function setStatus(message) {

    const status =
        document.getElementById("statusText");

    if (!status) return;

    status.textContent = message;

    clearTimeout(statusTimer);

    statusTimer = setTimeout(() => {
        status.textContent =
            "Terrain editor ready";
    }, 2500);
}


/* =====================================================
   PANEL RESIZE
===================================================== */

const panel = document.querySelector(".terrain-panel");

let resizing = false;
let startX = 0;
let startY = 0;
let startWidth = 0;
let startHeight = 0;

const MIN_WIDTH = 320;
const MAX_WIDTH = 650;

const MIN_HEIGHT = 350;

function isResizeCorner(event) {

    const rect = panel.getBoundingClientRect();

    return (
        event.clientX >= rect.right - 22 &&
        event.clientY >= rect.bottom - 22
    );
}

panel.addEventListener("pointerdown", event => {

    if (!isResizeCorner(event)) return;

    resizing = true;

    startX = event.clientX;
    startY = event.clientY;

    startWidth = panel.offsetWidth;
    startHeight = panel.offsetHeight;

    panel.classList.add("resizing");

    panel.setPointerCapture(event.pointerId);

    event.preventDefault();
});

panel.addEventListener("pointermove", event => {

    if (!resizing) return;

    const width =
        Math.min(
            MAX_WIDTH,
            Math.max(
                MIN_WIDTH,
                startWidth + event.clientX - startX
            )
        );

    const height =
        Math.min(
            window.innerHeight * 0.9,
            Math.max(
                MIN_HEIGHT,
                startHeight + event.clientY - startY
            )
        );

    panel.style.width = width + "px";
    panel.style.height = height + "px";
});

panel.addEventListener("pointerup", () => {

    if (!resizing) return;

    resizing = false;

    panel.classList.remove("resizing");
});

panel.addEventListener("pointercancel", () => {

    resizing = false;

    panel.classList.remove("resizing");
});