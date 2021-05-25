function pwMatchErrorDisableButton(buttonid) {
    if (document.getElementById('pwmatcherror').style.display == 'none') {
        document.getElementById(buttonid).disabled = false;
    } else {
        document.getElementById(buttonid).disabled = true;
    }
}

// https://stackoverflow.com/questions/21727317/how-to-check-confirm-password-field-in-form-without-reloading-page/21727518
// https://stackoverflow.com/questions/18640051/check-if-html-form-values-are-empty-using-javascript
function checkform(form) {
    // get all the inputs within the submitted form
    var inputs = form.getElementsByTagName('input');
    for (var i = 0; i < inputs.length; i++) {
        // only validate the inputs that have the required attribute
        if(inputs[i].hasAttribute("required")){
            if (inputs[i].value == "") {
                // found an empty field that is required
                document.getElementById('loginbutton').disabled = true;
                document.getElementById('formnotfill').style.display = 'inline';
                return;
            }
        }
    }
    document.getElementById('formnotfill').style.display = 'none';
    // if it went through all required inputs and all were filled, check if the pws are matching
    pwMatchErrorDisableButton('loginbutton');
}

function check_pass() {
    pwField = document.getElementById('password');
    cpwField = document.getElementById('confirm_password');
    
    // check if both pw fields are not empty
    if ((pwField.value || cpwField.value) != '') {
        if (pwField.value == (cpwField.value) ) {
            // execute if either password fields are not empty and the passwords match
            cpwField.style.border = 'solid';
            cpwField.style.borderColor = 'green';
            cpwField.style.borderWidth = '2px';
            cpwField.style.marginBottom = '10px';
            document.getElementById('pwmatcherror').style.display = 'none';
        } else {
            // execute if either password fields are not empty and the passwords do not match
            cpwField.style.border = 'solid';
            cpwField.style.borderColor = 'red';
            cpwField.style.borderWidth = '2px';
            cpwField.style.marginBottom = '2px';
            document.getElementById('pwmatcherror').style.display = 'inline';
        }
    } else {
        // execute if password fields are empty
        document.getElementById('pwmatcherror').style.display = 'none';
        cpwField.style.border = 'none';
        cpwField.style.marginBottom = '10px';
    }
}