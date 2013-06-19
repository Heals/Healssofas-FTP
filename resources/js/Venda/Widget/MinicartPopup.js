/**
 * @fileoverview Venda.Widget.MinicartPopup - Create an inpage popup of the minicart.
 *
 * The information displayed in the popup div is pulled from a hidden element of type 'Minicart Detail'.
 * Minicart Detail uses a carts template.
 * 
 * @requires /venda-support/js/ajax.js
 * @requires /venda-support/js/external/yui/build/utilities/utilities.js
 * @requires /venda-support/js/external/yui/build/container/container-min.js
 * @author Hayley Easton <heaston@venda.com>
 */

//create MinicartPopup namespace
Venda.namespace('Widget.MinicartPopup');

/**
 * Stub function is used to support JSDoc.
 * @class Venda.Widget.MinicartPopup
 * @constructor
 */
Venda.Widget.MinicartPopup = function(){};

/**
 * Create a new minicart object
 * @param {array} 	cartHook specify which anchors will trigger a minicart popup
 * @param {object} 	settings set settings for minicartpopup (constraintoviewport:boolean, visible:boolean, underlay:string, close:boolean, draggable: boolean)
 * @tags {object} 	tags pass venda tags into js functions (invtname:string, redirect:string, ebiz:string, invtref:string)
 */	
Venda.Widget.MinicartPopup.create = function(cartHook, windowsettings, tags) {
	Venda.Widget.MinicartPopup.windowsettings = windowsettings;
	Venda.Widget.MinicartPopup.tags = tags;
	
	if (Venda.Widget.MinicartPopup.windowsettings.mouseover != "1"){
		//register listener for objects in 'ids' array when using click
		YAHOO.util.Event.addListener(cartHook, "click", Venda.Widget.MinicartPopup.interceptCartLink);
	}
	if (Venda.Widget.MinicartPopup.windowsettings.mouseover == "1"){
		//register listener for objects in 'ids' array when using mouseover
		YAHOO.util.Event.addListener(cartHook, "mouseover", Venda.Widget.MinicartPopup.interceptCartLink);
		YAHOO.util.Event.addListener(cartHook, "click", Venda.Widget.MinicartPopup.suppressLink);
		
		//register listener for close button when using mouseover
		YAHOO.util.Event.addListener("minicart-close", "click", Venda.Widget.MinicartPopup.closeAnim);
	}
	
	//window onload events
	YAHOO.util.Event.addListener(window, "load", Venda.Widget.MinicartPopup.popupMinicart);
	
	if (Venda.Widget.MinicartPopup.windowsettings.noreload == "1"){
	// only do this if the option is ticked to show popup without reload
	YAHOO.util.Event.onDOMReady(Venda.Widget.MinicartPopup.gatherAdds);
	Venda.Widget.MinicartPopup.loadingPanel();
	}
};

/**
 * Gather all Add to basket buttons
 * Find all input buttons that add to basket and add a listener to each one to check if they are clicked
 * Used only by the AJAX minicart which loads without a screen refresh
 */
Venda.Widget.MinicartPopup.gatherAdds = function() {
	addtoCartIds = new Array();
	j = 0;
	popupLinks = document.getElementsByTagName("input");
	for (i = 0; i < popupLinks.length; i++) {
		if (popupLinks[i].id.indexOf("addproduct") == 0 && popupLinks[i].id.length > 2) { //ids gathered are input buttons that are prefixed 'addproduct'
			addtoCartIds[j] = popupLinks[i].id;
			j++;
		};
	};
	YAHOO.util.Event.addListener(addtoCartIds, "click", Venda.Widget.MinicartPopup.checkAdd);
};

/**
 * Initialise loading panel
 * Creates a div container which will display a loading message 
 */
Venda.Widget.MinicartPopup.loadingPanel = function () {
	Venda.Widget.MinicartPopup.waitingPanel = new YAHOO.widget.Panel("waiting_panel", { underlay: "shadow", fixedcenter: true, close: false, draggable: false, modal: true, visible: false});  
	Venda.Widget.MinicartPopup.waitingPanel.setBody('<p>'+ Venda.Widget.MinicartPopup.tags.addtoBasketText +'</p><span id="loadPanelImg" class="loadPanelImgExtra"></span>');
	Venda.Widget.MinicartPopup.waitingPanel.render(document.body);
};

/**
 * Add form submit listener after click
 * Allows for the attributes.js to prevent add to basket
 * Makes sure Buy Now button caught by listener 
 */
Venda.Widget.MinicartPopup.checkAdd = function(e) {
	Venda.Widget.MinicartPopup.addtobasket = "clicked";
	var fnCallback = function(e) {
		if (Venda.Widget.MinicartPopup.addtobasket === "clicked"){
			YAHOO.util.Event.stopEvent(e); // suppress form submit
			Venda.Widget.MinicartPopup.addtobasket = "";
			Venda.Widget.MinicartPopup.addProduct(this.id);
		}else{document.form.ex.value='co_wizr-shopcart'};
	};
	YAHOO.util.Event.addListener(this.id+"form", "submit", fnCallback);
};


/**
 * Add to basket form submission
 * Processes and gets a response without reloading the screen: using AJAX
 * This is optional behaviour turned on via the Minicart Popup element
 */
Venda.Widget.MinicartPopup.addProduct = function(formID) {
	// animation variables to send to UpdateMinicart.js
	// if this variable is blank, then no colour animation will occur
	if (Venda.Widget.MinicartPopup.tags.fromcolor != "" && Venda.Widget.MinicartPopup.tags.frombgrcolor == ""){
		var minicartColors = {
	        color: { from: Venda.Widget.MinicartPopup.tags.fromcolor, to: Venda.Widget.MinicartPopup.tags.tocolor }
	    };
	}else if (Venda.Widget.MinicartPopup.tags.fromcolor == "" && Venda.Widget.MinicartPopup.tags.frombgrcolor != ""){
		var minicartColors = {
	        backgroundColor: { from: Venda.Widget.MinicartPopup.tags.frombgrcolor, to: Venda.Widget.MinicartPopup.tags.tobgrcolor }
	    };
	}else if (Venda.Widget.MinicartPopup.tags.fromcolor != "" && Venda.Widget.MinicartPopup.tags.frombgrcolor != ""){
		var minicartColors = {
	        color: { from: Venda.Widget.MinicartPopup.tags.fromcolor, to: Venda.Widget.MinicartPopup.tags.tocolor },
			backgroundColor: { from: Venda.Widget.MinicartPopup.tags.frombgrcolor, to: Venda.Widget.MinicartPopup.tags.tobgrcolor }
	    };
	}else {var minicartColors = "";}
	
	highlightItems = new YAHOO.util.ColorAnim('updateItems', minicartColors, Venda.Widget.MinicartPopup.tags.fromtoduration);
	highlightTotal = new YAHOO.util.ColorAnim('updateTotal', minicartColors, Venda.Widget.MinicartPopup.tags.fromtoduration);

	Venda.Widget.MinicartPopup.waitingPanel.show();
	
	// change layout field so that the response loaded in the div shows the relevant message
	document.getElementById(formID).layout.value = 'cartresponse';
	if(typeof document.getElementById(formID).curlayout != 'undefined'){
		// if there is a curlayout field change the value to cartresponse
		document.getElementById(formID).curlayout.value = 'cartresponse';
	};
	Venda.Widget.MinicartPopup.panelHeight = document.getElementById('popupcart_panel').offsetHeight; // original height of popup before cart updated

	ajaxFunction(Venda.Widget.MinicartPopup.tags.formaction,'addedmsg',formID, function() {
		//leave this as an inserted script as it relies on loaded IDs from invt/addtocart_response
		insertScript('/content/ebiz/'+ Venda.Widget.MinicartPopup.tags.bsref +'/resources/js/Venda/Widget/UpdateMinicart.js','addedmsg');
		// now update and open the minicart, in that order
		ajaxFunction('/page/home&layout=minicart_detail','popupcart', undefined, function() { //we update cartwrapper so that static minicart detail will update
			if (Venda.Widget.MinicartPopup.windowsettings.milliseconds != ""){
				// reset the timer if automatic close is enabled
				clearTimeout(popupTimerId);
			};
			Venda.Widget.MinicartPopup.openAnim();
			Venda.Widget.MinicartPopup.highlightAdded();
			// reset form fields that were set by JS
			document.getElementById(formID).layout.value = '';
			document.getElementById(formID).ex.value = 'co_wizr-shopcart';
			if (typeof Venda.Widget.CurrencyConverter != "undefined" || Venda.Widget.CurrencyConverter) {
				Venda.Widget.CurrencyConverter.GetCookie();
			};
		});
	});
};

/**
 * Initialise minicartdetail panel
 * Creates div containers which will display the minicart contents
 */
Venda.Widget.MinicartPopup.popupMinicart = function() {
	//convert some element settings to boolean values to be used in settings below
	if (Venda.Widget.MinicartPopup.windowsettings.draggable == "1"){
		Venda.Widget.MinicartPopup.windowsettings.draggable = true;
	}else{Venda.Widget.MinicartPopup.windowsettings.draggable = false};
	
	//Instantiate a Panel from script
	minicartPanel = new YAHOO.widget.Panel("popupcart_panel", {
	width : Venda.Widget.MinicartPopup.windowsettings.width+"px",
	constraintoviewport: true,
	visible: false,
	underlay: "none",
	close: false,
	draggable: Venda.Widget.MinicartPopup.windowsettings.draggable} );
	
	//Header will be set if the element has either 'Make popup draggable (will automatically show header)', 'Show Header' or 'Show close button' ticked in the element settings
	if (Venda.Widget.MinicartPopup.windowsettings.draggable == true || Venda.Widget.MinicartPopup.windowsettings.header == "1"){
		minicartPanel.setHeader('<div class="tl"></div>'+ Venda.Widget.MinicartPopup.tags.headertext + '<span id="' + Venda.Widget.MinicartPopup.tags.close +'">&nbsp;</span><div class="tr"></div>');
	};
	if (Venda.Widget.MinicartPopup.windowsettings.draggable == false && Venda.Widget.MinicartPopup.windowsettings.header != "1" && Venda.Widget.MinicartPopup.tags.close != ""){
		minicartPanel.setHeader('<div class="tl"></div><span id="' + Venda.Widget.MinicartPopup.tags.close +'">&nbsp;</span><div class="tr"></div>');
	};
	
	minicartPanel.setBody('<div id="popupcart">'+ document.getElementById('minicart_element').innerHTML +'</div>');
	minicartPanel.render("minicart_detail");
	
	//if an item has been added to the basket and the element configuration allows the minicart to show when 'add to basket' selected
	if (Venda.Widget.MinicartPopup.tags.addedsku != "" && Venda.Widget.MinicartPopup.windowsettings.nopopupadded == ""){
  		Venda.Widget.MinicartPopup.openAnim();
		Venda.Widget.MinicartPopup.highlightAdded();
	};
};

/**
 * Find out how far the screen has been scrolled from the top
 * This value is used to show the minicart relative to the vertical scrollbar rather than from a fixed position from the top of the screen
 */
Venda.Widget.MinicartPopup.scrOfY = function() {
	var scrOfY = 0;
	if( typeof( window.pageYOffset ) == 'number' ) {
		//Netscape compliant
		scrOfY = window.pageYOffset;
	} else if( document.body && document.body.scrollTop ) {
		//DOM compliant
		scrOfY = document.body.scrollTop;
	} else if( document.documentElement && document.documentElement.scrollTop ) {
		//IE6 standards compliant mode
		scrOfY = document.documentElement.scrollTop;
	}
	var topPadValue = Venda.Widget.MinicartPopup.tags.relativeHeightPad;
	var topPad = parseInt(topPadValue); // make sure its a number
	return [ scrOfY + topPad ];
};

/**
 * Highlight Last Added Item
 * Animate the background colour of the item added if element option 'Highlight effect on background colour when item added' is ticked
 */
Venda.Widget.MinicartPopup.highlightAdded = function() {
	if (Venda.Widget.MinicartPopup.windowsettings.highlight == "1"){
		// a class name was added to the sku that was just placed in basket
		// we use class rather than ID because there are 2 versions of the minicart in the code - the actual hidden version and the generated version and IDs must be unique
		if (Venda.Widget.MinicartPopup.windowsettings.noreload == "1"){// no reload version
			var elements = YAHOO.util.Dom.getElementsByClassName('li_' + document.getElementById('tag-addedmsgref').innerHTML, 'li');
		}
		else {// screen reload version
			var elements = YAHOO.util.Dom.getElementsByClassName('li_' + Venda.Widget.MinicartPopup.tags.addedsku, 'li');
		}
		var highlightAnim = new YAHOO.util.ColorAnim(elements, {backgroundColor: { from: Venda.Widget.MinicartPopup.tags.highlightbgrstart, to: Venda.Widget.MinicartPopup.tags.highlightbgrend } }, Venda.Widget.MinicartPopup.tags.highlightduration);
		highlightAnim.animate();
	};
};

/**
 * Show minicart
 * Will show/hide generated minicart popup when using click event
 * @param {event} e used to suppress default link behaviour
 */
Venda.Widget.MinicartPopup.interceptCartLink = function(e) {
	YAHOO.util.Event.preventDefault(e); //suppress default link behaviour
	if (document.getElementById('popupcart_panel_c').style.visibility != 'visible'){
		Venda.Widget.MinicartPopup.openAnim();
	// if the event is click, trigger will close the minicart if open
	}else if (Venda.Widget.MinicartPopup.windowsettings.mouseover != "1"){
		Venda.Widget.MinicartPopup.closeAnim();
	};
};

/**
 * Suppress Hook Links
 * When using mouseover to reveal the minicart, stop the link from being clickable
 * @param {event} e used to suppress default link behaviour
 */
Venda.Widget.MinicartPopup.suppressLink = function(e) {
	YAHOO.util.Event.preventDefault(e); //suppress default link behaviour
};

/**
 * Open minicart
 * Will show generated minicart popup using required animation techniques
 */
Venda.Widget.MinicartPopup.openAnim = function() {
	if (Venda.Widget.MinicartPopup.windowsettings.relativeHeight == "1"){
		// display the minicart popup relative to the scrolled height rather than fixed position
		document.getElementById("minicart_detail").style.top = Venda.Widget.MinicartPopup.scrOfY() + "px";
		document.getElementById("popupcart_panel_c").style.top = ""; //reset the top style which has been set if the popup was dragged
		document.getElementById("popupcart_panel_c").style.left = ""; //reset the left style which has been set if the popup was dragged
	}
	if (Venda.Widget.MinicartPopup.windowsettings.fade == "1" || Venda.Widget.MinicartPopup.windowsettings.scroll == "1"){
		Venda.Widget.MinicartPopup.setVisibility = function() {
			Venda.Widget.MinicartPopup.visibility = false;
		};
		minicartPanel.beforeShowEvent.subscribe(Venda.Widget.MinicartPopup.setVisibility); //only do this if fade or scroll is ticked
	}
	minicartPanel.show();
	Venda.Widget.MinicartPopup.waitingPanel.hide();
	
	YAHOO.util.Dom.setStyle('popupcart_panel', 'height', '');// purge height value before animation
	var popupHeight = document.getElementById('popupcart_panel').offsetHeight+1;
	
	if (Venda.Widget.MinicartPopup.windowsettings.fade == "1" || Venda.Widget.MinicartPopup.windowsettings.scroll == "1"){
		//animation settings according to element configuration
		if (Venda.Widget.MinicartPopup.visibility == false){ // if popup not shown	
			if (Venda.Widget.MinicartPopup.windowsettings.fade == "1" && Venda.Widget.MinicartPopup.windowsettings.scroll == "1"){
				var attributes = {height: { from: 0, to: popupHeight, unit: 'px' },opacity: { from: 0, to: 1 }};
				YAHOO.util.Dom.setStyle('popupcart_panel', 'height', '0');
				YAHOO.util.Dom.setStyle('popupcart_panel', 'opacity', '0');
			};
			if (Venda.Widget.MinicartPopup.windowsettings.fade == "1" && Venda.Widget.MinicartPopup.windowsettings.scroll != "1"){
				var attributes = {opacity: { from: 0, to: 1 }};
				YAHOO.util.Dom.setStyle('popupcart_panel', 'opacity', '0');
			};
			if (Venda.Widget.MinicartPopup.windowsettings.fade != "1" && Venda.Widget.MinicartPopup.windowsettings.scroll == "1"){
				var attributes = {height: { from: 0, to: popupHeight, unit: 'px' }};
				YAHOO.util.Dom.setStyle('popupcart_panel', 'height', '0');
			};
		}else{
			var attributes = {};
		}
		var minicartAnim = new YAHOO.util.Anim('popupcart_panel', attributes, Venda.Widget.MinicartPopup.tags.effectsduration);
		// if required will close minicart after specified amount of milliseconds
		if (Venda.Widget.MinicartPopup.windowsettings.milliseconds != ""){	
			minicartAnim.onComplete.subscribe(Venda.Widget.MinicartPopup.popupTimer);
		};
		minicartAnim.animate();
		Venda.Widget.MinicartPopup.visibility = true;
	};
};


/**
 * Set minicart close timer
 * Set the amount of milliseconds after which the close cart function is executed
 */
popupTimerId = 0; // set this variable so it can be used in subsequent close animation function to clear the timer
Venda.Widget.MinicartPopup.popupTimer = function() {
	popupTimerId = setTimeout('Venda.Widget.MinicartPopup.closeAnim()', Venda.Widget.MinicartPopup.windowsettings.milliseconds);
};

/**
 * Close minicart animation
 * Will close generated minicart popup using required animation techniques
 */
Venda.Widget.MinicartPopup.closeAnim = function() {
	// if minicart close timer is enabled, first clear the timeout so that anim is less glitchy
	if (Venda.Widget.MinicartPopup.windowsettings.milliseconds != ""){
		clearTimeout(popupTimerId);
	};
	if (Venda.Widget.MinicartPopup.windowsettings.fade != "1" && Venda.Widget.MinicartPopup.windowsettings.scroll != "1"){
		Venda.Widget.MinicartPopup.animateClosed();
	};
	if (Venda.Widget.MinicartPopup.windowsettings.fade == "1" || Venda.Widget.MinicartPopup.windowsettings.scroll == "1"){
			//animation settings according to element configuration
			if (Venda.Widget.MinicartPopup.windowsettings.fade == "1" && Venda.Widget.MinicartPopup.windowsettings.scroll == "1"){
				var attributes3 = {height: { to: 0 },opacity: { to: 0 }}
			};
			if (Venda.Widget.MinicartPopup.windowsettings.fade == "1" && Venda.Widget.MinicartPopup.windowsettings.scroll != "1"){
				var attributes3 = {opacity: { to: 0 }}
			};
			if (Venda.Widget.MinicartPopup.windowsettings.fade != "1" && Venda.Widget.MinicartPopup.windowsettings.scroll == "1"){
				var attributes3 = {height: { to: 0 }}
			};
		var minicartAnim3 = new YAHOO.util.Anim('popupcart_panel', attributes3, Venda.Widget.MinicartPopup.tags.effectsduration);
		minicartAnim3.onComplete.subscribe(Venda.Widget.MinicartPopup.animateClosed);
		minicartAnim3.animate();
	};
};

/**
 * Hide minicart popup
 * Used by the above Custom Event onComplete to hide popup when animation closes panel
 */
Venda.Widget.MinicartPopup.animateClosed = function() {
	minicartPanel.hide();
};

/**
 * Add to basket by passing parameters (without form submittion) i.e. add a product from flash (10CMS)
 * Processes and gets a response without reloading the screen: using AJAX
 * @param {string} 	invtRef - a parent product ref which need to add to your basket
 * @param {string} 	qty -  a number of product
 * @param {string} 	att1 - an attribute 1 value
 * @param {string} 	att2 - an attribute 2 value
 */
Venda.Widget.MinicartPopup.paramAddProduct = function(invtRef, qty, att1, att2) {
	if (!Venda.Widget.MinicartPopup.waitingPanel){
		Venda.Widget.MinicartPopup.waitingPanel = new YAHOO.widget.Panel("wait_panel", { underlay: "shadow", fixedcenter: true, close: false, draggable: false, modal: true, visible: false});  
		Venda.Widget.MinicartPopup.waitingPanel.setBody("<span id=\"loadPanelImg\"></span>");
		Venda.Widget.MinicartPopup.waitingPanel.render(document.body);
	}
	Venda.Widget.MinicartPopup.waitingPanel.show();

	// animation variables to send to UpdateMinicart.js
	// if this variable is blank, then no colour animation will occur
	if (Venda.Widget.MinicartPopup.tags.fromcolor != "" && Venda.Widget.MinicartPopup.tags.frombgrcolor == ""){
		var minicartColors = {
	        color: { from: Venda.Widget.MinicartPopup.tags.fromcolor, to: Venda.Widget.MinicartPopup.tags.tocolor }
	    };
	}else if (Venda.Widget.MinicartPopup.tags.fromcolor == "" && Venda.Widget.MinicartPopup.tags.frombgrcolor != ""){
		var minicartColors = {
	        backgroundColor: { from: Venda.Widget.MinicartPopup.tags.frombgrcolor, to: Venda.Widget.MinicartPopup.tags.tobgrcolor }
	    };
	}else if (Venda.Widget.MinicartPopup.tags.fromcolor != "" && Venda.Widget.MinicartPopup.tags.frombgrcolor != ""){
		var minicartColors = {
	        color: { from: Venda.Widget.MinicartPopup.tags.fromcolor, to: Venda.Widget.MinicartPopup.tags.tocolor },
			backgroundColor: { from: Venda.Widget.MinicartPopup.tags.frombgrcolor, to: Venda.Widget.MinicartPopup.tags.tobgrcolor }
	    };
	}else {var minicartColors = "";}
	
	highlightItems = new YAHOO.util.ColorAnim('updateItems', minicartColors, Venda.Widget.MinicartPopup.tags.fromtoduration);
	highlightTotal = new YAHOO.util.ColorAnim('updateTotal', minicartColors, Venda.Widget.MinicartPopup.tags.fromtoduration);

	Venda.Widget.MinicartPopup.waitingPanel.show();
	Venda.Widget.MinicartPopup.panelHeight = document.getElementById('popupcart_panel').offsetHeight; // original height of popup before cart updated

	var requestURL = Venda.Widget.MinicartPopup.tags.formaction+"?invt="+invtRef+"&buy="+invtRef+"&qty="+qty+"&att1="+att1+"&att2="+att2+"&ex=co_disp-shopc&mode=add&log=22&layout=cartresponse&next=&curpage=&bsref="+Venda.Widget.MinicartPopup.tags.bsref;
	ajaxFunction(requestURL, 'addedmsg', undefined, function() {
		if (!Venda.Widget.MinicartPopup.isError('addedmsg')){
			//leave this as an inserted script as it relies on loaded IDs from invt/addtocart_response
			insertScript('/content/ebiz/'+ Venda.Widget.MinicartPopup.tags.bsref +'/resources/js/Venda/Widget/UpdateMinicart.js','addedmsg');
			// now update and open the minicart, in that order
			ajaxFunction('/page/home&layout=minicart_detail','popupcart', undefined, function() { //we update cartwrapper so that static minicart detail will update
				if (Venda.Widget.MinicartPopup.windowsettings.milliseconds != ""){
					// reset the timer if automatic close is enabled
					clearTimeout(popupTimerId);
				};
				Venda.Widget.MinicartPopup.openAnim();
				Venda.Widget.MinicartPopup.highlightAdded();
				if (typeof Venda.Widget.CurrencyConverter != "undefined" || Venda.Widget.CurrencyConverter) {
					Venda.Widget.CurrencyConverter.GetCookie();
				};
			});
			document.getElementById('addedmsg').style.display = "none";
		} else {
			document.getElementById('addedmsg').style.display = "block";
		}
		Venda.Widget.MinicartPopup.waitingPanel.hide();
	});
};

/**
* Finding a system error message
* @returns {Boolean} isFoundError	return true if there is an error message returend from system
* 
*/
Venda.Widget.MinicartPopup.isError = function (id) {
	var str = document.getElementById(id).innerHTML;
	var errMsg = ["There is no inventory number","Please choose a variant of the product"];
	var isFoundError = false;

	for (var each in errMsg) {
		if (typeof errMsg[each] != "function") {
			if (str.search(errMsg[each]) != -1) {
				isFoundError = true;
			}
		}
	}
	return isFoundError;
};
