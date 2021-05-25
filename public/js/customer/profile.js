// get all relevant elements
editNameform = document.getElementById('updatename');
editNameButton = document.getElementById('editName');
editPwform = document.getElementById('updatepw');
editPwButton = document.getElementById('editPw');
saveNameButton = document.getElementById('saveName');
nameFields = document.getElementsByClassName('profileEditField')
// change style of edit button
function editButton(state) {
    if (state == "edit") {
        editNameButton.style.color = "#4980df";
        editNameButton.innerHTML = "Edit"
    } else if (state == "cancel") {
        editNameButton.style.color = "#d83200";
        editNameButton.innerHTML = "Cancel"
    }
}
// change style of change pw button
function pwButton(state) {
    if (state == "change") {
        editPwButton.style.color = "#4980df";
        editPwButton.innerHTML = "Change Password"
        editPwButton.style.marginTop = "10vh";
    } else if (state == "cancel") {
        editPwButton.style.color = "#d83200";
        editPwButton.innerHTML = "Cancel"
        editPwButton.style.marginTop = "1vh";
    }
}

// expand/collapse edit name form
function toggleNameEdit() {
    editPwform.style.display = "none";
    pwButton("change");
    if (editNameform.style.display == "inline") {
        editNameform.style.display = "none";
        editButton("edit");
    } else {
        editNameform.style.display = "inline";
        editButton("cancel");
    }
}

// expand/collapse change pw form
function togglePwEdit() {
    editNameform.style.display = "none";
    editButton("edit");
    if (editPwform.style.display == "inline") {
        editPwform.style.display = "none";
        pwButton("change");
    } else {
        editPwform.style.display = "inline";
        pwButton("cancel");
    }
}

function nameChanged() {
    fieldInputs = ""
    for (var i=0; i<nameFields.length; i++) {
        fieldInputs += nameFields[i].value.trim()
    }
    if (fieldInputs != "") {
        saveNameButton.disabled = false;
    } else {
        saveNameButton.disabled = true;
    }
}
editNameButton.addEventListener("click", toggleNameEdit);
editPwButton.addEventListener("click", togglePwEdit);