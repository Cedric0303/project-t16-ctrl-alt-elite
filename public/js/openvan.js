function submitForm() {
    document.form.longitude.value = curPos.long;
    document.form.latitude.value = curPos.lat;
    document.forms["form"].submit();
}