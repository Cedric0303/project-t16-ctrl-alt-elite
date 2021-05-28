function formatDatePrevOrders(datetime) {
    var dt = new Date(datetime);
    formatted = "";
    ampm = "";
    month = dt.toLocaleString('en-AU', {month: 'short' });
    day = dt.getDate();
    date = dt.toDateString();
    time = dt.toLocaleTimeString("default", {
        timeZone: "Australia/Melbourne",
        hour: '2-digit', 
        minute:'2-digit',
    
    });

    formatted = time.toUpperCase() + " " + month + " " + day;
    return formatted;
}

