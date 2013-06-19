/**
 * @fileoverview Venda.Platform - A module for use across all the platform (includes VCP and website areas)
 * This will file will contain small universal functions that would be useful throughout the platform. These functions are stored as properteis of the 'platform'  symbol.
 * @author Aron San <asan@venda.com>
 */

/**
 * Stub function is used to support JSDoc.
 * @class Venda.Platform
 * @constructor
 */
Venda.Platform = function(){};

/**
 * Gets the value of a specified URL parameter
 * @param {String} currURL 		this is the URL which you wish to get the URL parameter value from
 * @param {String} urlParam 	this is the name of the URL parameter you want to get the value for
 * @return match 							unescaped value for parameter specified urlParam if true else false
 */
Venda.Platform.getUrlParam = function(url,urlParam) {
	//declare regular expression to be use.
	var re = new RegExp('[?&]'+urlParam+'=([^&]+)');
	var match = url.match(re);
	return match ? unescape(match[1]) : false;
};

/**
 * Produces encoded HTML to be safely displayed on a webpage which mitigates XSS risks.
 * @param {String} 							value to escape
 * @return container.innerHTML 	escaped value
 */
Venda.Platform.escapeHTML = function(strToEscape) {
	var container = document.createElement('span');
	container.appendChild(document.createTextNode(strToEscape));
	return container.innerHTML;
};


/**
 * Given a select box dropdown name and a value will show the divs in arrayToShow
 * and hide the divs in arrays to hide. If not equal to name will do opposite.
 * The function will also blank any existing input text fields and dropdown selects
 * within the divs that are being hidden
 * @param {String} selectBoxName
 * @param {String} selectBoxValue
 * @param {array of strings} arrayToShow
 * @param {array of strings} arrayToHide
 * @param {Integer} rSpeed                Duration of animation in miliseconds
 */
Venda.Platform.SelectBoxToggle = function( selectBoxName, selectBoxValue, arrayToHide, arrayToShow, rSpeed ) {
	var spd = ( typeof rSpeed === "undefined" ) ? 0 : rSpeed;

	var hideFields = function () {
	  if ( this.value == selectBoxValue ) {
		for ( var i=0; i < arrayToHide.length; i++) {
		  jQuery("#"+arrayToHide[i]+" > *").each( function() {
			if( this.type =='text' ){
			  this.value='';
			}
			else if( this.type =='select-one'){
			  jQuery("#"+this.id+" > *").each ( function() {
				if( this.value=='' ){
				  this.selected=true;
				}
			  } );
			}
		  });
		  jQuery("#"+arrayToHide[i]).hide(spd);
		}
		for ( var i=0; i < arrayToShow.length; i++) {
		  jQuery("#"+arrayToShow[i]).show(spd);
		}
	  }
	  else {
		for ( var i=0; i < arrayToShow.length; i++) {
		  jQuery("#"+arrayToShow[i]+" > *").each( function() {
			if( this.type =='text' ){
			  this.value='';
			}
			else if( this.type =='select-one'){
			  jQuery("#"+this.id+" > *").each ( function() {
				if( this.value=='' ){
				  this.selected=true;
				}
			  } );
			}
		  });
		  jQuery("#"+arrayToShow[i]).hide(spd);
		}
		for ( var i=0; i < arrayToHide.length; i++) {
		  jQuery("#"+arrayToHide[i]).show(spd);
		}
	  }
	};

	jQuery("#"+ selectBoxName).each( hideFields ).bind('change', hideFields );
};
