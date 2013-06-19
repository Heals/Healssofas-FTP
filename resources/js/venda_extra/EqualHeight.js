/**
 * @fileoverview Venda.Platform.EqualHeight
 *
 * This script provides us with the ability to set the same height for the html element. 
 * Mostly use to format the product within the same row by set the same height for each html element.  
 *
 * Adapted from Aron San's code in RT#66087
 * @requires JQuery		/venda-support/js/external/jquery-1.2.2.js
 * @author arsp <arsp@venda.com> 
 */
 
//create namespace
Venda.namespace('Platform.EqualHeight');

/**
 * Stub function is used to support JSDoc.
 * @class Venda.Platform.EqualHeight
 * @constructor
 */
Venda.Platform.EqualHeight = function(){};

//set jQuery object
Venda.Platform.EqualHeight.jq = jQuery;

/**
 * This function will get the list of html element and class name that need to set height then set height of each element by using function 'set' <br>Example: Code will need to be placed in the template where the function will be used<br><pre>var productInfo = new Array ('li .productname', 'li .brd_featprods', 'li .iconbox', 'li .invtdesc2', 'li .font-red');<br>Venda.Platform.EqualHeight.init(productInfo);</pre>
 * 
 *  @param {Array} elementsToSet - Array that contain html element with class name under html tag e.g. 'li .invtname'
 */
Venda.Platform.EqualHeight.init = function(elementsToSet) {
	var elementsToSetLen = elementsToSet.length;
	Venda.Platform.EqualHeight.jq(document).ready(function(){
		for (var i=0; i < elementsToSetLen; i++) {
			Venda.Platform.EqualHeight.set(elementsToSet[i]);
		}
	});
};

/**
 * This function will find the max height of each class and set the max height to that class
 * @param {Element} each value in Array - the html element and class name to set height
 */
Venda.Platform.EqualHeight.set = function(setClass) {
	var maxHeight = 0;
	Venda.Platform.EqualHeight.jq(setClass).each(function() {
		var curHeight = Venda.Platform.EqualHeight.jq(this).height();
		if (curHeight >= maxHeight) {
			maxHeight = curHeight;
		}
	});
	Venda.Platform.EqualHeight.jq(setClass).css((Venda.Platform.EqualHeight.jq.browser.msie && Venda.Platform.EqualHeight.jq.browser.version < 7 ? '' : 'min-') + 'height', maxHeight + 'px');
};

