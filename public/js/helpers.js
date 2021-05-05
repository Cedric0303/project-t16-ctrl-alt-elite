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
            var dt = new Date(datetime);
            formatted = "";
            ampm = ""
            date = dt.toDateString();
            time = dt.toLocaleTimeString("en-AU", {
                timeZone: "Australia/Melbourne",
                hour: '2-digit', 
                minute:'2-digit'
            });

            formatted = date+" at "+time;
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
