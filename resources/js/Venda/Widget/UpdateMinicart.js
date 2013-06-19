/**
 * @fileoverview Venda.Widget.UpdateMinicart - Highlight minicart totals when items added to basket.
 *
 * This file works with template/main/cartresponse which is loaded when an item is added to basket via an AJAX form submission.
 * This file is only loaded when an add to cart form is processed via AJAX. When the conditions are met, the totals in the standard minicart will update.
 * 
 * @requires /venda-support/js/Venda/Widget/MinicartPopup.js
 * @author Hayley Easton <heaston@venda.com>
 */

//create UpdateMinicart namespace
Venda.namespace('Widget.UpdateMinicart');

/**
 * Stub function is used to support JSDoc.
 * @class Venda.Widget.UpdateMinicart
 * @constructor
 */
Venda.Widget.UpdateMinicart = function(){};
 
var itemsPage = document.getElementById('tag-itemspage').innerHTML;
var totalPage = document.getElementById('tag-totalpage').innerHTML;
//update minicart figures
ajaxFunction(itemsPage,'updateItems', undefined, function() {
	highlightItems.animate();
});
ajaxFunction(totalPage,'updateTotal', undefined, function() {
	highlightTotal.animate();
	if (typeof Venda.Widget.CurrencyConverter != "undefined" || Venda.Widget.CurrencyConverter) {
		Venda.Widget.CurrencyConverter.GetCookie();
	};
});

if (typeof clickedID != "undefined"){
	var buttonID = document.getElementById(clickedID);
	if(buttonID){
		buttonID.src = originalsrc; // put the original add to basket image back
	}
}