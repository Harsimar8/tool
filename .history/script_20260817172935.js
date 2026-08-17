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

    button.classList.toggle("selected");

    if (button.classList.contains("selected")) {
        showNotification(name);
        setStatus(name + " selected");
    } else {
        setStatus(name + " deselected");
    }
}


/* =====================================================
   BRUSH MODE
===================================================== */

function selectBrushMode(button) {

    document
        .querySelectorAll(".mode-button")
        .forEach(btn => btn.classList.remove("selected"));

    button.classList.add("selected");

    const name = button.innerText.trim();

    showNotification(name);
    setStatus(name);
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
   SYMBOLS
===================================================== */

let selectedSymbol = null;


function selectSymbol(button, name) {

    document
        .querySelectorAll(".symbol-button")
        .forEach(btn => btn.classList.remove("selected"));

    button.classList.add("selected");

    selectedSymbol = name;

    showNotification(name);
    setStatus(name + " selected");
}


/* =====================================================
   CENTER NOTIFICATION
===================================================== */

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