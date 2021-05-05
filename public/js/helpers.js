var register = function(Handlebars) {

    var helpers = {
        // put all of your helpers inside this object
        removeunderscore: function (input) {
            var newinput = input.replace("_", " ");
            return newinput;
        },
        toFixed2: function (input) {
            var newinput = input.toFixed(2);
            return newinput;
        },
        // https://stackoverflow.com/questions/10645994/how-to-format-a-utc-date-as-a-yyyy-mm-dd-hhmmss-string-using-nodejs
        formatDate: function (datetime) {
            formatted = "";
            ampm = ""
            date = datetime.toDateString();
            if (datetime.getHours() > 12) {
                ampm = "PM";
            } else {
                ampm = "AM";
            }
            if (ampm == "PM") {
                time = datetime.getHours() - 12;
            }
            formatted = date+" at "+time+":"+datetime.getMinutes()+" "+ampm;
            return formatted;
        },
        // https://stackoverflow.com/questions/10232574/handlebars-js-parse-object-instead-of-object-object
        json: function (context) {
            return JSON.stringify(context);
        }
    };

    if (Handlebars && typeof Handlebars.registerHelper === "function") {
        // register helpers
        for (var prop in helpers) {
            Handlebars.registerHelper(prop, helpers[prop]);
        }
    } else {
        // just return helpers object if we can't register helpers here
        return helpers;
    }

};

module.exports.register = register;
module.exports.helpers = register(null);
