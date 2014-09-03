function showDialog() {
    backTarget = document.getElementById("dialogBack");
    backTarget.style.visibility = "visible";

    dialogTarget = document.getElementById("dialog");

    cx = Math.floor((window.innerWidth - 500) / 2);
    cy = Math.floor((window.innerHeight - 500) / 2);
    dialogTarget.style.left = cx + "px";
    dialogTarget.style.top = cy + "px";
    dialogTarget.style.visibility = "visible";
}

function hideDialog() {
    backTarget = document.getElementById("dialogBack");
    backTarget.style.visibility = "hidden";
    dialogTarget = document.getElementById("dialog");
    dialogTarget.style.visibility = "hidden";
}