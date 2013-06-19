/**
* @fileoverview venda.js: A module for use across all Venda pages, VCP and front end/ACE.
* <p/>
* This module defines a single global symbol named "Venda".
* Venda refers to the top level namespace object used in all Venda javascript
* all utility functions are stored as properties of this namespace
* functions should generally be stored in separate files held in the Venda subdirectory.
*/

//Check that the 'Venda' global object exists, if not then create it.
if (typeof Venda == "undefined" || !Venda) {
    /**
	 * @class The global Venda class.
     * @constructor
	 */
    var Venda = function () { };
}

/**
 * Construct a new namespace object.
 * <p/>
 * Be careful when naming packages. Reserved words may work in some browsers
 * and not others. For instance, the following will fail in Safari:
 *
 * <pre>Venda.namespace("really.long.nested.namespace");</pre>
 *
 * This fails because "long" is a future reserved word in ECMAScript
 *
 * @type object
 * @param {string} Arguments 1-n namespaces to create
 * @returns {object} A reference to the last namespace object created
 * @author <a href="http://developer.yahoo.com/yui/docs/YAHOO.js.html">YUI</a>
 */
Venda.namespace = function() {
    var a=arguments, o=null, i, j, d;
    for (i=0; i<a.length; i=i+1) {
        d=a[i].split(".");
        o=Venda;
		
        // Venda is implied, so it is ignored if it is included
        for (j=(d[0] == "Venda") ? 1 : 0; j<d.length; j=j+1) {
            o[d[j]]=o[d[j]] || {};
            o=o[d[j]];
        }
    }
    return o;
};

//Create name spaces for Venda.Widget
Venda.namespace("Widget");

// Create name spaces for Venda.Platform
Venda.namespace("Platform");