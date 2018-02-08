"use strict";
// This came with the bootsnipp template
var Dashboard = function () {
    var global = {
        tooltipOptions: { placement: "right" },
        menuClass: ".c-menu"
    };

    var menuChangeActive = function menuChangeActive(el) {
        var hasSubmenu = $(el).hasClass("has-submenu");
        $(global.menuClass + " .is-active").removeClass("is-active");
        $(el).addClass("is-active");
        // if (hasSubmenu) {
        // 	$(el).find("ul").slideDown();
        // }
    };

    var sidebarChangeWidth = function sidebarChangeWidth() {
        var $menuItemsTitle = $("li .menu-item__title");

        $("body").toggleClass("sidebar-is-reduced sidebar-is-expanded");
        $(".hamburger-toggle").toggleClass("is-opened");

        if ($("body").hasClass("sidebar-is-expanded")) {
            $('[data-toggle="tooltip"]').tooltip("destroy");
        } else {
            $('[data-toggle="tooltip"]').tooltip(global.tooltipOptions);
        }
    };

    return {
        init: function init() {
            $(".js-hamburger").on("click", sidebarChangeWidth);

            $(".js-menu li").on("click", function (e) {
                menuChangeActive(e.currentTarget);
            });

            $('[data-toggle="tooltip"]').tooltip(global.tooltipOptions);
        }
    };
}();
Dashboard.init();

/* -------------------- *\
    Datepicker
\* -------------------- */
$('input[name="validity_range"]').daterangepicker();


/* -------------------- *\
    Helper Functions
\* -------------------- */

/* Helper Function */
function extendObject ( array, props ) {
    var result = $.map( array, function(el) {
        var newObject = $.extend({}, el, props);
        return newObject;
    });
    return result;
}

function flattenArray (data) {
	return data.reduce(function iter(r, a) {
		if (a === null)            return r; 
		if (Array.isArray(a))      return a.reduce(iter, r); 
        if (typeof a === 'object') return $.map( a, function(key,val) { return key[val] } ).reduce(iter, r);
		return r.concat(a);
	}, []);
}








