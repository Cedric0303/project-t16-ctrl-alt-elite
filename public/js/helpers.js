var register = function(Handlebars) {

    var helpers = {
        // put all of your helpers inside this object
        listmenu: function (menu) {
            var ret = "<ul>";
            for (var i = 0; i < menu.length; i++) {
                var menu_link =  menu[i].name.replace("_", " ");
                ret = ret + "<li>" +  "<a href=\"/customer/menu/" + 
                menu_link + "\">" + menu[i].name + "</li>"
            }
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
