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
    if (document.getElementById('pwmatcherror').style.display == 'none') {
        document.getElementById('loginbutton').disabled = false;
    } else {
        document.getElementById('loginbutton').disabled = true;
    }
}

function check_pass() {
    if ((document.getElementById('password').value || document.getElementById('confirm_password').value) != '') {
        if (document.getElementById('password').value == (document.getElementById('confirm_password').value) ) {
            // execute if either password fields are not empty and the passwords match
            document.getElementById('confirm_password').style.border = 'solid';
            document.getElementById('confirm_password').style.borderColor = 'green';
            document.getElementById('confirm_password').style.borderWidth = '2px';
            document.getElementById('confirm_password').style.marginBottom = '10px';
            document.getElementById('pwmatcherror').style.display = 'none';
        } else {
            // execute if either password fields are not empty and the passwords do not match
            document.getElementById('confirm_password').style.border = 'solid';
            document.getElementById('confirm_password').style.borderColor = 'red';
            document.getElementById('confirm_password').style.borderWidth = '2px';
            document.getElementById('confirm_password').style.marginBottom = '2px';
            document.getElementById('pwmatcherror').style.display = 'inline';
        }
    } else {
        // execute if password fields are empty
        document.getElementById('pwmatcherror').style.display = 'none';
        document.getElementById('confirm_password').style.border = 'none';
        document.getElementById('confirm_password').style.marginBottom = '10px';
    }
}