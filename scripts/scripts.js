"use strict";
// This came with the bootsnipp template




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








