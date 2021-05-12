function submitForm() {
    document.form.address.value = document.getElementById("vantextdescription").value
    document.form.longitude.value = curPos.long
    document.form.latitude.value = curPos.lat
    document.forms["form"].submit();
}