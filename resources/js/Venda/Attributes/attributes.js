/**
* @fileoverview Venda.Attributes
 * Venda's Attributes functionality incorporates a standardized way of interfacing Attribute Products with the front-end as to make
 * the modification and creation of selection methods easier.
 *
 * The files below will be included dynamicly when required:
 * @requires js/Venda/Attributes/attributeAsset-Dropdown.js
 * @requires js/Venda/Attributes/attributeAsset-Swatch.js
 * @requires js/Venda/Attributes/dropdown.js
 * @requires js/Venda/Attributes/grid.js
 * @requires js/Venda/Attributes/halfswatch.js
 * @requires js/Venda/Attributes/multiAdd2.js
 * @requires js/Venda/Attributes/swatch.js
 *
 * @author Alby Barber <abarber@venda.com>
 * @author Donatas Cereska <DonatasCereska@venda.com>
*/

Venda.namespace('Attributes');
Venda.Attributes = function () {};

/**
* Declares global vars
*/
Venda.Attributes.dataObj = {"atronhand": "","stockstatus": "","stockstatus": "","atrreleaseyr": "","atrmsrp": "","atrsku": "","atrwas": "","atrsell": "","atrsuplsku": "","atrreleasemn": "","atretayr": "","atrreleasedy": "","atretady": "","atretamn": "","atrpublish": "","atrcost": "", "invtuuid": ""};
Venda.Attributes.firstObj 		= 	[];
Venda.Attributes.attsArray 		= 	[];
Venda.Attributes.SwatchURL 		= 	[];
Venda.Attributes.productArr 	= 	[];

/**
* Runs when the page is ready
* Sets the page up and loads in the set interface type e.g. swatch if there is no type set it will default to dropdown.
*/
jQuery(function() {
	Venda.Attributes.Initialize();
});

Venda.Attributes.Initialize = function() {

	//Venda.Attributes.initViewLargeImagePopup();

	if(Venda.Attributes.attsArray.length > 0) {
		Venda.Attributes.Declare();

		var hiddenInputs  = '<input type="hidden" value="" id="hiddenInput_att1"><input type="hidden" value="" id="hiddenInput_att2"><input type="hidden" value="" id="hiddenInput_att3"><input type="hidden" value="" id="hiddenInput_att4">';
		jQuery('#addproductform').append(hiddenInputs);

		var attributesUI = jQuery(".js-attributesForm").text();
		switch(attributesUI) {
			case "dropdown":
			case "halfswatch":
			case "swatch":
			case "grid":
			case "multiAdd1":
			case "multiAdd2":
			break;
			default:
			attributesUI = 'dropdown';
		}

		var url = jQuery("#tag-ebizurl").text() + '/content/ebiz/' + jQuery("#tag-ebizref").text() + '/resources/js/Venda/Attributes/' + attributesUI + '.js';
        jQuery.getScript(url, function(Status){ if (!Status){console.warn('Whoops! Your interface type script did not load');} });
		if(jQuery("#OutOfStockThreshold").text() > Venda.Attributes.Settings.lowStockThreshold) alert("Error: OutOfStockThreshold is higher than lowStockThreshold");
	};

	jQuery('.js-oneProduct').css({"background":"none"});
	jQuery('.js-oneProductContent').fadeIn('slow');
}

/**
* Sets default values for attributes, these values can be changed base
* on your needs
*/
Venda.Attributes.Declare = function() {
	Venda.Attributes.Settings = {
		lowStockThreshold:			20,
		emailWhenOutOfStock:		false,
		sourceFromAPI:				false,
		priceRangeFormat:			"range",  // "range" = from - to; "from" = from only; "to" = to only;
		preOrderParent:				false,
		gridSwap:					false,
		useSelectedArrow:			true,
		useToolTip:					true,
		sort: 						true,
		hideNotAvailable:			true
	};

};


// Merges two objects into one and stores data within an array
Venda.Attributes.StoreJSON = function(attrObj, attrValObj) {
	for(var prop in attrObj) { if(attrObj[prop] == null) attrObj[prop] = ""; }
	for(var prop in attrValObj) { if(attrValObj[prop] == null) attrValObj[prop] = ""; }
	var newAttrObj = jQuery.extend({}, attrObj);
	Venda.Attributes.firstObj.push(newAttrObj);
	Venda.Attributes.attsJSON = jQuery.extend(attrObj, attrValObj);
	Venda.Attributes.attsArray.push(Venda.Attributes.attsJSON);
};

// Merges two objects into one and stores data within an array
Venda.Attributes.insertUI = function(content) {
	jQuery('#attributeInputs').html(content);
};


// Sets the attributes and returns the values for them in an object literal format
Venda.Attributes.Set = function(att1, att2, att3, att4, uID) {

	var att1 = att1 || "";	var att2 = att2 || "";	var att3 = att3 || "";	var att4 = att4 || "";
  	if (Venda.Attributes.IsAllSelected(att1, att2, att3, att4, uID)) {
		var index = Venda.Attributes.SearchObj(att1, att2, att3, att4, uID);
 		if(typeof index != "undefined") {
			Venda.Attributes.dataObj = {
				"atronhand": Venda.Attributes.attsArray[index].atronhand,
				"stockstatus": Venda.Attributes.StockStatus(Venda.Attributes.attsArray[index].atronhand,index),
				"atrreleaseyr": Venda.Attributes.attsArray[index].atrreleaseyr,
				"atrmsrp": Venda.Attributes.attsArray[index].atrmsrp,
				"atrsku": Venda.Attributes.attsArray[index].atrsku,
				"atrwas": Venda.Attributes.attsArray[index].atrwas,
				"atrsell": Venda.Attributes.attsArray[index].atrsell,
				"atrsuplsku": Venda.Attributes.attsArray[index].atrsuplsku,
				"atrreleasemn": Venda.Attributes.attsArray[index].atrreleasemn,
				"atretayr": Venda.Attributes.attsArray[index].atretayr,
				"atrreleasedy": Venda.Attributes.attsArray[index].atrreleasedy,
				"atretady": Venda.Attributes.attsArray[index].atretady,
				"atretamn": Venda.Attributes.attsArray[index].atretamn,
				"atrpublish": Venda.Attributes.attsArray[index].atrpublish,
				"atrcost": Venda.Attributes.attsArray[index].atrcost
			};

			if(jQuery('.js-attributesForm').attr('id') != 'productdetailMulti') {
				if(document.getElementById("addproductform").itemlist) {
					jQuery("#oneProduct_" + uID + " [name=itemlist]").val(Venda.Attributes.dataObj.atrsku);
				}
			}

		} else {
			for(var p in Venda.Attributes.dataObj) { Venda.Attributes.dataObj[p] = "  "; };
			Venda.Attributes.dataObj.stockstatus = "Not Available";
		}
	} else {

		for(var p in Venda.Attributes.dataObj) { Venda.Attributes.dataObj[p] = "  "; };
		Venda.Attributes.dataObj.stockstatus = "";

		if(jQuery('.js-attributesForm').attr('id') != 'productdetailMulti') {
			if(document.getElementById("addproductform").itemlist) {
				jQuery("#oneProduct_" + uID + " [name=itemlist]").val('');
			}
		}

	}

	Venda.Attributes.drawOutputs(index, uID);
};


// Sets the attributes and returns the values for them in an object literal format
Venda.Attributes.Get = function(what) {
	return Venda.Attributes.dataObj[what];
};

// Compares current number of selections to an existing ones and returns true if number matches
Venda.Attributes.IsAllSelected = function(att1, att2, att3, att4, uID) {
	var att1 = att1 || "";	var att2 = att2 || "";	var att3 = att3 || "";	var att4 = att4 || "";
	var howManySelected = 0;
	if(att1 != "") howManySelected+=1;
	if(att2 != "") howManySelected+=1;
	if(att3 != "") howManySelected+=1;
	if(att4 != "") howManySelected+=1;
	if(howManySelected == Venda.Attributes.HowManyAtts(uID)) return true;
};

// Returns the number of attributes used from JSON data
Venda.Attributes.HowManyAtts = function(uID) {
	for(var i = 0; i < Venda.Attributes.productArr.length; i++) {
		if (Venda.Attributes.productArr[i].attSet.id == uID) {
			var howManyAtts = 0;
			if((Venda.Attributes.productArr[i].attSet.att1.optionValues.length >= 1) && (Venda.Attributes.productArr[i].attSet.att1.optionValues[0] != "")) howManyAtts+=1;
			if((Venda.Attributes.productArr[i].attSet.att2.optionValues.length >= 1) && (Venda.Attributes.productArr[i].attSet.att2.optionValues[0] != "")) howManyAtts+=1;
			if((Venda.Attributes.productArr[i].attSet.att3.optionValues.length >= 1) && (Venda.Attributes.productArr[i].attSet.att3.optionValues[0] != "")) howManyAtts+=1;
			if((Venda.Attributes.productArr[i].attSet.att4.optionValues.length >= 1) && (Venda.Attributes.productArr[i].attSet.att4.optionValues[0] != "")) howManyAtts+=1;
			return howManyAtts;
		}
	}
};

// Checks for stock value and returns the availability status
Venda.Attributes.StockStatus = function(stockAmount,theIndex) {

	var HasEtaDate = Venda.Attributes.HasEtaDate(theIndex);
	var HasReleaseDate = Venda.Attributes.HasReleaseDate(theIndex);

	if(stockAmount > Venda.Attributes.Settings.lowStockThreshold && !HasReleaseDate) return "In stock";
	if(stockAmount > Venda.Attributes.Settings.lowStockThreshold && HasReleaseDate) return "Pre-order";
 	if(stockAmount <= Venda.Attributes.Settings.lowStockThreshold && stockAmount > jQuery("#OutOfStockThreshold").text()) return "Stock is low";
	if(stockAmount <= jQuery("#OutOfStockThreshold").text() && (jQuery("#DoNotBackorder").text() == 1) || (jQuery("#DoNotBackorder").text() != 1 && !HasEtaDate) ) return "Out of stock";

 	if (jQuery('#stockchecking_basket').text() == 1 || jQuery('#stockchecking_orderconfirm').text() == 1){
		if(stockAmount <= jQuery("#OutOfStockThreshold").text() && (jQuery("#DoNotBackorder").text() != 1 && HasEtaDate)) return "Not Available";
	}

	if(stockAmount <= jQuery("#OutOfStockThreshold").text() && (jQuery("#DoNotBackorder").text() != 1 && HasEtaDate)) return "Backorder";

};

// Search for a given value combination within array of objects, returns true if combination matches
Venda.Attributes.SearchObj = function(att1, att2, att3, att4, uID) {
	for(var i=0; i<Venda.Attributes.attsArray.length; i++)
		if (Venda.Attributes.attsArray[i].att1 == att1 && Venda.Attributes.attsArray[i].att2 == att2)
			if(Venda.Attributes.attsArray[i].att3 == att3 && Venda.Attributes.attsArray[i].att4 == att4)
				if(Venda.Attributes.attsArray[i].invtuuid == uID)
					return i;
};

// This function will return a stock status message for all stock with only one specified parameter
Venda.Attributes.GetAll = function(att1, att2, att3, att4, what, uID) {
	var att1 = att1 || "";	var att2 = att2 || "";	var att3 = att3 || "";	var att4 = att4 || "";
	switch(what) {
		case "stockstatus":
			var initOnce = true;
			for(var i=0; i<Venda.Attributes.attsArray.length; i++) {
				var compareObj = {att1: att1, att3: att3, att2: att2, att4: att4, invtuuid: uID};
				var newfirstObj = jQuery.extend({}, Venda.Attributes.firstObj[i]);
				newfirstObj.invtuuid = uID;
 				if(att1 == "") { delete compareObj.att1; delete newfirstObj.att1; }
				if(att2 == "") { delete compareObj.att2; delete newfirstObj.att2; }
				if(att3 == "") { delete compareObj.att3; delete newfirstObj.att3; }
				if(att4 == "") { delete compareObj.att4; delete newfirstObj.att4; }
				if(compareObject(compareObj, newfirstObj)) { if(initOnce) { var totalStock = 0; initOnce = false; }; totalStock += Venda.Attributes.attsArray[i].atronhand; var theIndex = i;}
			};
			if(typeof totalStock != "undefined"){
				return Venda.Attributes.StockStatus(totalStock,theIndex);
			}
			else	return "Not Available";
		break;
	}
};

var compareObject = function(o1, o2){
	for(var p in o1){if(o1[p] !== o2[p]){return false;}}
	for(var p in o2){if(o1[p] !== o2[p]){return false;}}
	return true;
};

Venda.Attributes.GetPriceRange = function(uID) {
		var currsym = jQuery('#tag-currsym').text();
		var priceRangeArr = [];
		for(var i=0; i<Venda.Attributes.attsArray.length; i++) {
			if(Venda.Attributes.attsArray[i].invtuuid == uID) {
				priceRangeArr.push(Venda.Attributes.attsArray[i].atrsell);
			}
		}
		if(Venda.Attributes.Settings.priceRangeFormat == "from") return currsym + Math.min.apply(Math, priceRangeArr);
		if(Venda.Attributes.Settings.priceRangeFormat == "to") return currsym + Math.max.apply(Math, priceRangeArr);
		if((Venda.Attributes.Settings.priceRangeFormat == "range") && (Math.min.apply(Math, priceRangeArr)) != (Math.max.apply(Math, priceRangeArr))) {
			return currsym + Math.min.apply(Math, priceRangeArr) + " - " + currsym + Math.max.apply(Math, priceRangeArr);
		}
		else {
			return currsym + Venda.Attributes.attsArray[0].atrsell;
		}
};

Venda.Attributes.GetCustomData = function(att1, att2, att3, att4, what) {
	var att1 = att1 || "";	var att2 = att2 || "";	var att3 = att3 || "";	var att4 = att4 || "";

	if (Venda.Attributes.IsAllSelected(att1, att2, att3, att4)) {
		var index = Venda.Attributes.SearchObj(att1, att2, att3, att4);
		if(typeof index != "undefined") {

			switch(what) {
				case "savemsrp":
					if(Venda.Attributes.attsArray[index].atrmsrp != "") {
						return Venda.Attributes.attsArray[index].atrmsrp - Venda.Attributes.attsArray[index].atrsell;
					} else { return " "; }
				break;

				case "savewas":
					if(Venda.Attributes.attsArray[index].atrwas != "") {
						return Venda.Attributes.attsArray[index].atrwas - Venda.Attributes.attsArray[index].atrsell;
					} else { return " "; }
				break;

				case "etadate":
					if(Venda.Attributes.HasEtaDate(index)) {
						return Venda.Attributes.attsArray[index].atretady + "/" + Venda.Attributes.attsArray[index].atretamn + "/" + Venda.Attributes.attsArray[index].atretayr;
					} else { return " "; }
				break;

				case "releasedate":
					if(Venda.Attributes.HasReleaseDate(index)) {
						return Venda.Attributes.attsArray[index].atrreleasedy + "/" + Venda.Attributes.attsArray[index].atrreleasemn + "/" + Venda.Attributes.attsArray[index].atrreleaseyr;
					} else { return " "; }
				break;

				case "nofweta":
 					if(Venda.Attributes.HasEtaDate(index)) {
						return Venda.Attributes.TimeTillRelease(Venda.Attributes.attsArray[index].atretady, "0" + parseInt(Venda.Attributes.attsArray[index].atretamn - 1), Venda.Attributes.attsArray[index].atretayr, "weeks");
					} else { return " "; }
				break;

				case "nofwrelease":
 					if(Venda.Attributes.HasReleaseDate(index)) {
						return Venda.Attributes.TimeTillRelease(Venda.Attributes.attsArray[index].atrreleasedy, "0" + parseInt(Venda.Attributes.attsArray[index].atrreleasemn - 1), Venda.Attributes.attsArray[index].atrreleaseyr, "weeks");
					} else { return ""; }
				break;

				case "savepercentmsrp":
					if(Venda.Attributes.attsArray[index].atrmsrp != "") {
						return Math.round(100 - (Venda.Attributes.attsArray[index].atrsell / (Venda.Attributes.attsArray[index].atrmsrp / 100)));
					} else { return " "; }
				break;

				case "savepercentwas":
					if(Venda.Attributes.attsArray[index].atrwas != "") {
						return Math.round(100 - (Venda.Attributes.attsArray[index].atrsell / (Venda.Attributes.attsArray[index].atrwas / 100)));
					} else { return " "; }
				break;
			};

		} else { return " "; };
	} else { return " "; };

};

Venda.Attributes.HasEtaDate = function(index) {
	if(Venda.Attributes.attsArray[index].atretayr != "")
		if(Venda.Attributes.attsArray[index].atretamn != "")
			if(Venda.Attributes.attsArray[index].atretady != "")
				if(Venda.Attributes.TimeTillRelease(Venda.Attributes.attsArray[index].atretady, "0" + parseInt(Venda.Attributes.attsArray[index].atretamn - 1), Venda.Attributes.attsArray[index].atretayr, "exact") >= 0)
					return true;
};

Venda.Attributes.HasReleaseDate = function(index) {
	Venda.Attributes.ReleaseDateParent(index);
	if(Venda.Attributes.attsArray[index].atrreleaseyr != "")
		if(Venda.Attributes.attsArray[index].atrreleasemn != "")
			if(Venda.Attributes.attsArray[index].atrreleasedy != "")
				if(Venda.Attributes.TimeTillRelease(Venda.Attributes.attsArray[index].atrreleasedy, "0" + parseInt(Venda.Attributes.attsArray[index].atrreleasemn - 1), Venda.Attributes.attsArray[index].atrreleaseyr, "exact") >= 0)
					return true;
};

Venda.Attributes.TimeTillRelease = function(dd, mm, yy, what) {
	var oneWeek = 24*60*60*1000*7;
	var firstDate = new Date();
	var secondDate = new Date(yy, mm, dd);
	switch(what) {
		case "weeks":
			var exactTime = (secondDate.getTime() - firstDate.getTime())/(oneWeek);
			if(exactTime>=0) {
				var timeLeft = Math.round((secondDate.getTime() - firstDate.getTime())/(oneWeek));
				if(timeLeft == 0) timeLeft = 1;
			} else { timeLeft = ""; }
		break;
		case "exact":
			var timeLeft = (secondDate.getTime() - firstDate.getTime())/(oneWeek);
		break;
	}
	return timeLeft;
}

Venda.Attributes.ReleaseDateParent = function(index) {
	var parentDate = jQuery('#invtrelease').text();
	if(Venda.Attributes.Settings.preOrderParent && parentDate !== ""){
		var parentDateArr = parentDate.split("-");
		if(Venda.Attributes.TimeTillRelease(parentDateArr[2], "0" + parseInt(parentDateArr[1] - 1), parentDateArr[0], "exact") >= 0) {
			Venda.Attributes.attsArray[index].atrreleasedy = parentDateArr[2];
			Venda.Attributes.attsArray[index].atrreleasemn = parentDateArr[1];
			Venda.Attributes.attsArray[index].atrreleaseyr = parentDateArr[0];
		}
	}
};


/**
* Shows or hides the correct input buttons and feedback based on attribute selection 'stockstatus'
* @param{string} index this is the current array index of the instance of attribute display
* @param{string} uID this is the unique ID for attribute display in the DOM
* @author Alby Barber <abarber@venda.com>
*/
Venda.Attributes.drawOutputs = function(index, uID) {

	// Cache jQuery selector and values
	var addproductID 	 = jQuery('#oneProduct_' + uID + ' #addproductbox'),
		EmwbisID		 = jQuery('#oneProduct_' + uID + ' #emwbis_link'),
		stockFeedbackBox = jQuery('#oneProduct_' + uID + ' .js-stockFeedbackBox'),
		addToBasketLinks = jQuery('#oneProduct_' + uID + ' .js-addproduct, #oneProduct_' + uID + ' .js-buynow'),
		emwbisType		 = jQuery("#emwbisType").text(),
		stockstatus	 	 = Venda.Attributes.Get('stockstatus'),
		stockFeedback	 = stockstatus;

	// Reset the UI.
	EmwbisID.addClass("js-Re-paint-out");
	stockFeedbackBox.removeClass("js-In_stock_box js-Out_of_stock_box");
	addToBasketLinks.css("opacity","1");

	switch(stockstatus) {

		case "In stock":
			stockFeedbackBox.addClass("js-In_stock_box");
			addproductID.addClass("js-Re-paint");

		break;

		case "Stock is low":
			stockFeedbackBox.addClass("js-In_stock_box");
			addproductID.addClass("js-Re-paint");

			var stockFeedback = stockstatus + jQuery('#attributes-only').text() + Venda.Attributes.Get('atronhand') + jQuery('#attributes-left').text();

		break;

		case "Pre-order":
			stockFeedbackBox.addClass("js-In_stock_box js-Pre-order_box");
			addproductID.addClass("js-Re-paint");
			addproductID.val("Pre-order");

			var stockFeedback = jQuery('#attributes-preorder').text() + Venda.Attributes.attsArray[index].atrreleasedy + "/" + Venda.Attributes.attsArray[index].atrreleasemn + "/" + Venda.Attributes.attsArray[index].atrreleaseyr;

		break;

		case "Out of stock":

			stockFeedbackBox.addClass("js-Out_of_stock_box");

				if (emwbisType == 'none'){
					addproductID.addClass("js-Re-paint-out");
					EmwbisID.addClass("js-Re-paint");
				}
				else{
					if (emwbisType == 'etarelease' && Venda.Attributes.HasReleaseDate(index) && Venda.Attributes.HasEtaDate(index)){
						addproductID.addClass("js-Re-paint-out");
						EmwbisID.addClass("js-Re-paint");
					}
					if (emwbisType == 'eta' && Venda.Attributes.HasEtaDate(index)){
						addproductID.addClass("js-Re-paint-out");
						EmwbisID.addClass("js-Re-paint");
					}
					if (emwbisType == 'release' && Venda.Attributes.HasReleaseDate(index)){
						addproductID.addClass("js-Re-paint-out");
						EmwbisID.addClass("js-Re-paint");
					}
					else{
						addproductID.addClass("js-Re-paint");
						addToBasketLinks.css("opacity","0.5");
					}
				}
		break;

		case "Backorder":

			stockFeedbackBox.addClass("js-In_stock_box js-Backorder_box");
			addproductID.addClass("js-Re-paint");
			addproductID.val("Backorder");

			var stockFeedback = jQuery('#attributes-backorder').text() + Venda.Attributes.attsArray[index].atretady + "/" + Venda.Attributes.attsArray[index].atretamn + "/" + Venda.Attributes.attsArray[index].atretayr;

		break;


		default:
			// Not Available
			addproductID.addClass("js-Re-paint");
			addToBasketLinks.css("opacity","0.5");
	}

	jQuery('#oneProduct_' + uID + ' .js-attrFeedback  #stockstatus').hide().text(stockFeedback).addClass("js-Re-paint");
};


// case insensitive, digits to number interpolation
Venda.Attributes.NatSort = function(as, bs){
    var a, b, a1, b1, i= 0, L, rx=  /(\d+)|(\D+)/g, rd=  /\d/;
    if(isFinite(as) && isFinite(bs)) return as - bs;
    a= String(as).toLowerCase();
    b= String(bs).toLowerCase();
    if(a=== b) return 0;
    if(!(rd.test(a) && rd.test(b))) return a> b? 1: -1;
    a= a.match(rx);
    b= b.match(rx);
    L= a.length> b.length? b.length: a.length;
    while(i < L){
        a1= a[i];
        b1= b[i++];
        if(a1!== b1){
            if(isFinite(a1) && isFinite(b1)){
                if(a1.charAt(0)=== "0") a1= "." + a1;
                if(b1.charAt(0)=== "0") b1= "." + b1;
                return a1 - b1;
            }
            else return a1> b1? 1: -1;
        }
    }
    return a.length - b.length;
}



/**
* This is an object that is built up and used for each instance of attribute display and stores the values of
* the attributes and there current states.
* @param{string} index this is the current array index of the instance of attribute display
* @param{string} uID this is the unique ID for attribute display in the DOM
* @return the value of newattributes, this is done for each instance
* @author Alby Barber <abarber@venda.com>
*/
Venda.Attributes.GenerateOptionsJSON = function (index, uID) {

	var attributes = {
		attSet: {
			att1:	{
				name:	'',
				options:	[],
				optionValues:	[],
				selected:	'',
				selectedValue:	'',
				imageRef:	''
			},
			att2:	{
				name:	'',
				options:	[],
				optionValues:	[],
				selected:	'',
				selectedValue:	'',
				imageRef:	''
			},
			att3:	{
				name:	'',
				options:	[],
				optionValues:	[],
				selected:	'',
				selectedValue:	'',
				imageRef:	''
			},
			att4:	{
				name:	'',
				options:	[],
				optionValues:	[],
				selected:	'',
				selectedValue:	'',
				imageRef:	''
			},
			id: ''
		}
	};

	var newattributes = jQuery.extend({}, attributes);

	newattributes.attSet.att1.name = jQuery('#oneProduct_' + uID + ' #attributeNames #att1').text();
	newattributes.attSet.att2.name = jQuery('#oneProduct_' + uID + ' #attributeNames #att2').text();
	newattributes.attSet.att3.name = jQuery('#oneProduct_' + uID + ' #attributeNames #att3').text();
	newattributes.attSet.att4.name = jQuery('#oneProduct_' + uID + ' #attributeNames #att4').text();
	newattributes.attSet.id = uID;

	/**
	* This is a function sorts attribute values in the page and puts them in the attributes object.
	* @param{string} attributeNumber is the specified attribute e.g. att1. This is a value 1-4
	* @param{string} i is an index used to pass the current value from the jQuery each function that passes it.
	* @author Alby Barber <abarber@venda.com>
	*/
 	var checkAndPush = function (attributeNumber,attributeValue ,i) {
		for(var i = 0; i < Venda.Attributes.attsArray.length; i++) {
			if(Venda.Attributes.attsArray[i].invtuuid == uID) {
				if (jQuery.inArray(Venda.Attributes.attsArray[i][attributeNumber], newattributes.attSet[attributeNumber].optionValues) == -1){
					newattributes.attSet[attributeNumber].options.push(Venda.Attributes.attsArray[i][attributeNumber]);
					newattributes.attSet[attributeNumber].optionValues.push(Venda.Attributes.attsArray[i][attributeValue]); // Push on the Values
				}
			}
		}
	};

	jQuery.each(Venda.Attributes.attsArray, function(i, val) {
		for (var j = 1 ;j<=4;j++){
			checkAndPush('att' + j ,'atr' + j , i);
		}
	});

	if (Venda.Attributes.Settings.sort){
	// This sorts by number
		for (var i = 1; i < 4; i++){
			if (attributes.attSet['att' + i].optionValues.length > 1){
                // Test to see if the attribute array contains numbers
                if(/\d/.test(attributes.attSet['att' + i].optionValues)){
                    attributes.attSet['att' + i].optionValues.sort(Venda.Attributes.NatSort);
                    attributes.attSet['att' + i].options.sort(Venda.Attributes.NatSort);
            	}
            }
		}
	}

	return newattributes;
}

/**
* This is a function updates the attribute object with the current attribute value
* @param{string} attName is the current attribute name e.g. att1
* @param{string} attValue is the current attribute value e.g. white
* @param{string} uID is the unique id of the attribute selection area
* @author Alby Barber <abarber@venda.com>
*/
Venda.Attributes.setSelectedJSON = function (attName,attValue, uID){

	for(var i = 0; i < Venda.Attributes.productArr.length; i++) {
		if(Venda.Attributes.productArr[i].attSet.id == uID) {

			if (Venda.Attributes.productArr[i].attSet[attName].selected == attValue){
				Venda.Attributes.productArr[i].attSet[attName].selected = '';
				Venda.Attributes.productArr[i].attSet[attName].selectedValue = '';

			}
			else {
				Venda.Attributes.productArr[i].attSet[attName].selected = attValue;
				Venda.Attributes.productArr[i].attSet[attName].selectedValue = Venda.Attributes.getValueRef(attName,attValue);
			}
		}
	}

	Venda.Attributes.productArr[0].attSet[attName].imageRef = Venda.Attributes.getValueRef(attName,attValue) || '';
};

/**
* This is a function that shows / updates the price
* @param{string} uID this is the unique ID for attribute display in the DOM
* @author Alby Barber <abarber@venda.com>
*/
Venda.Attributes.Price = function (uID){
	if (Venda.Attributes.Get('atrsell') !== "  ")	jQuery('#oneProduct_' + uID + ' #price').hide().text(jQuery('#tag-currsym').text() + Venda.Attributes.Get('atrsell')).addClass("js-Re-paint");
	else	jQuery('#oneProduct_' + uID + ' #price').hide().text(Venda.Attributes.GetPriceRange(uID)).addClass("js-Re-paint");
};

/**
* This is a function that shows / updates the price
* @author Alby Barber <abarber@venda.com>
*/
Venda.Attributes.Paint = function (){
	jQuery(".js-Re-paint-out").hide().removeClass("js-Re-paint-out");
	jQuery(".js-Re-paint").show().removeClass("js-Re-paint");
};

/**
* This is a function updates the selected values stored in the 'Venda.Attributes.productAr' object and displays this on
* the front-end to the user
* @param{string} att1 this is the current selected value for att1
* @param{string} att2 this is the current selected value for att2
* @param{string} att3 this is the current selected value for att3
* @param{string} att4 this is the current selected value for att4
* @param{string} uID this is the unique ID for attribute display in the DOM
* @author Alby Barber <abarber@venda.com>
*/
Venda.Attributes.SelectedValues = function (att1,att2,att3,att4, uID){

	var productselected = jQuery('#attributes-productselected').text(),
		productstatus	= jQuery('#attributes-productstatus').text();


	for(var j = 0; j < Venda.Attributes.productArr.length; j++) {
		if(Venda.Attributes.productArr[j].attSet.id === uID) {

			for(var i = 1; i <= Venda.Attributes.HowManyAtts(uID); i++) {

				var attNumber = 'att'+i;

				if (Venda.Attributes.productArr[j].attSet[attNumber].selected){
					productselected += Venda.Attributes.productArr[j].attSet[attNumber].selected + ', ';
				}
				else{
					productstatus += Venda.Attributes.productArr[j].attSet[attNumber].name + ', ';
				}
			}

			if (productselected == jQuery('#attributes-productselected').text()){
				jQuery('#oneProduct_' + uID + ' .js-attrFeedback #productselected').addClass("js-Re-paint-out");
			}
			else {
				jQuery('#oneProduct_' + uID + ' .js-attrFeedback #productselected').hide().text(productselected.substring(0, productselected.length-2)).addClass("js-Re-paint");
			}
			if (productstatus == jQuery('#attributes-productstatus').text()){
				jQuery('#oneProduct_' + uID + ' .js-attrFeedback #productstatus').addClass("js-Re-paint-out");
			}
			else {
				jQuery('#oneProduct_' + uID + ' .js-attrFeedback #productstatus').hide().text(productstatus.substring(0, productstatus.length-2)).addClass("js-Re-paint");
			}

		}
	}

	// Updating the class for calculated values
};


/**
* This is a function updates the element on the page that has the passed ID
* @param{string} id this is the id of the page element that you want updated
* @param{string} uID this is the unique ID for attribute display in the DOM
* @author Alby Barber <abarber@venda.com>
*/
Venda.Attributes.updateItem = function (id, uID) {
	jQuery('#oneProduct_' + uID + ' .js-attrFeedback  #' + id).hide().text(Venda.Attributes.Get(id)).addClass("js-Re-paint");
};

/**
* This is a function updates price type element on the page that has the passed ID
* @param{string} id this is the id of the page element that you want updated
* @param{string} uID this is the unique ID for attribute display in the DOM
* @author Alby Barber <abarber@venda.com>
*/
Venda.Attributes.updateItemPrice = function (id, uID) {
	var textValue =  '';
	if (Venda.Attributes.Get(id).length > 2) {
		textValue = jQuery('#tag-currsym').text() + Venda.Attributes.Get(id);
		jQuery('#oneProduct_' + uID + ' .js-attrFeedback  #' + id).hide().text(textValue).addClass("js-Re-paint");
	}
};

/**
* This is a function updates calculated type elements on the page that has the passed ID
* @param{string} id this is the id of the page element that you want updated
* @param{string} textValue this is the text or name of the element to be displayed
* @param{string} uID this is the unique ID for attribute display in the DOM
* @author Alby Barber <abarber@venda.com>
*/
Venda.Attributes.updateCalcItem = function (id, textValue, uID){
		jQuery('#oneProduct_' + uID + ' .js-attrFeedback  ' + id).hide().text(textValue).addClass("js-Re-paint");
}

/**
* This is a function updates calculated price type elements on the page that has the passed ID
* @param{string} id this is the id of the page element that you want updated
* @param{string} textValue this is the text or name of the element to be displayed
* @param{string} uID this is the unique ID for attribute display in the DOM
* @author Alby Barber <abarber@venda.com>
*/
Venda.Attributes.updateCalcItemPrice = function (id, textValue, uID){

	var currsym = jQuery('#tag-currsym').text();

	if (textValue.length > 2) {
		textValue = currsym + textValue;
	}

	jQuery('#oneProduct_' + uID + ' .js-attrFeedback  ' + id).hide().text(textValue).addClass("js-Re-paint");
};


///// SWATCH Functions /////
/**
* This is a function generates the swatch interface
* @param{string} attributeNumber is the specified attribute e.g. att1. This is a value 1-4
* @param{string} uID this is the unique ID for attribute display in the DOM
* @author Alby Barber <abarber@venda.com>
*/
Venda.Attributes.generateSwatch = function(attributeNumber, uID){
	for(var i = 0; i < Venda.Attributes.productArr.length; i++) {
		if (Venda.Attributes.productArr[i].attSet.id == uID) {

		var swatchList = '';
		for (var t = 0; t < Venda.Attributes.productArr[i].attSet[attributeNumber].optionValues.length; t++) {
			swatchList += '<li class="js-'+ (Venda.Attributes.productArr[i].attSet[attributeNumber].optionValues[t]).replace(/[' ]/g,"_") +' js-attributeSwatch" id="attributeSwatch_' + uID + '" data-attName="'+ attributeNumber +'" data-attValue="'+ Venda.Attributes.productArr[i].attSet[attributeNumber].optionValues[t] +'"><span class="js-swatchText">' + Venda.Attributes.productArr[i].attSet[attributeNumber].options[t] + '</span></li>';
		}

		var selectName = "#oneProduct_" + uID + " select[name='" + attributeNumber + "']";
		jQuery(selectName).replaceWith("<ul id='swatchList_" + attributeNumber + "'>" + swatchList + "</ul>");

		}
	}
};


/**
* This is a function gets the swatch image and associates on the correct swatch
* @param{string} attributeNumber is the specified attribute e.g. att1. This is a value 1-4
* @param{string} uID this is the unique ID for attribute display in the DOM
* @author Alby Barber <abarber@venda.com>
*/
Venda.Attributes.swatchImage = function(attnumber, uID){
	jQuery('#oneProduct_' + uID + ' #swatchList_'+attnumber+' li').each(function(index) {
		jQuery(this).addClass('js-colourSwatch');

		var swatchdata = this.getAttribute('data-attvalue'),
			swatchname = this.getAttribute('data-attname'),
			imageRef = Venda.Attributes.getValueRef(swatchname,swatchdata);

		if (Venda.Attributes.SwatchURL[imageRef]){
			jQuery(this).css("background-image", "url(" + Venda.Attributes.SwatchURL[imageRef] + ")");
		}
		else {
			jQuery('.js-swatchText',this).css({'text-indent':'0', 'display':'block'});
		}
	});
}

///// DROPDOWN Functions /////
/**
* This is a function generates the dropdown interface
* @param{string} attributeNumber is the specified attribute e.g. att1. This is a value 1-4
* @param{string} uID this is the unique ID for attribute display in the DOM
* @author Alby Barber <abarber@venda.com>
*/
Venda.Attributes.generateDropDowns = function(attributeNumber, uID) {
	var optionDefault = jQuery('#attributes-optionDefault').text();

	for(var i = 0; i < Venda.Attributes.productArr.length; i++) {
		if (Venda.Attributes.productArr[i].attSet.id == uID) {
			var options = '<option value="">'+ optionDefault +'</option>';
			for (var t = 0; t < Venda.Attributes.productArr[i].attSet[attributeNumber].optionValues.length; t++) {
				options += '<option data-attText="' + Venda.Attributes.productArr[i].attSet[attributeNumber].options[t] + '" value="'+ Venda.Attributes.productArr[i].attSet[attributeNumber].optionValues[t] +'">' + Venda.Attributes.productArr[i].attSet[attributeNumber].options[t] + '</option>';
			}
			var selectName = "select[name='" + attributeNumber + "']";
			jQuery("#oneProduct_" + uID + " " + selectName).html(options);
			jQuery("#oneProduct_" + uID + " " + selectName).parent().addClass('js-custom');
		}
	}
	Venda.Ebiz.customSelect();
};

Venda.Attributes.PresetAtt = function(index, uID) {
	var allAttsOne = 0;
	for(var e = 1; e <= Venda.Attributes.HowManyAtts(uID); e++) {
		if(Venda.Attributes.productArr[index].attSet["att" + e].optionValues.length == 1) {
			allAttsOne+=1;
		}
	}
	if(allAttsOne >= Venda.Attributes.HowManyAtts(uID)) {
		for(var o = 1; o <= Venda.Attributes.HowManyAtts(uID); o++) {

		// If there is only one value for an attribute, then pre select it
			//jQuery("select[id='att"+ o +"_" + uID + "'] option[value='" + Venda.Attributes.productArr[index].attSet["att" + o].options[0] + "']").attr('selected', 'selected');
			//Venda.Attributes.setSelectedJSON("att" + o,Venda.Attributes.productArr[index].attSet["att" + o].options[0], uID);

		}
	}
};

///// EVENTS /////
/**
* Shows a tooltip for out of stock elements if the useToolTip config option is 'true'
* This will not work with the product grid
*/
jQuery('.js-Out_of_stock:not(.js-gridBlock, #key li)').live('mouseenter', function(){

	if (Venda.Attributes.Settings.useToolTip){
		var attName 	= this.getAttribute('data-attName');
		var attValue 	= this.getAttribute('data-attValue');
		var thisname	= 'This';
		var uID = this.id.substr(16);

		for(var j = 0; j < Venda.Attributes.productArr.length; j++) {
			if(Venda.Attributes.productArr[j].attSet.id === uID) {
				thisname = Venda.Attributes.productArr[j].attSet[attName].name
			}
		}

		var message 	= thisname + ' ' + attValue + ' ' + jQuery('#attributes-tooltip').text();

		jQuery(this).prepend('<div class="js-toolTip-wrap"><div class="js-toolTip">' + message + '<div class="js-toolTip-shadow"></div><div class="js-toolTip-arrow"></div></div></div>');
		jQuery('.js-toolTip').hide().fadeIn('slow');
	}

});

/**
* Hides a tooltip for out of stock elements if the useToolTip config option is 'true'
* This will not work with the product grid
*/
jQuery('.js-Out_of_stock:not(.js-gridBlock, #key li)').live('mouseleave', function(){

	if (Venda.Attributes.Settings.useToolTip){
		jQuery('.js-toolTip-wrap').remove();
	}
});

/**
* This is a function that updates all the display elements of the attributes display
* This is called once on the page load and whenever the attribute combination is changed .
* @param{string} uID this is the unique ID for attribute display in the DOM
* @param{string} what is the 'this' property of a grid block clicked
* @param{string} param is a property of an attribute passed from a product page swatch.
* @author Alby Barber <abarber@venda.com>, Donatas Cereska <dcereska@venda.com>
*/

Venda.Attributes.updateAttributes = function (uID, what, param) {

	for(var i = 0; i < Venda.Attributes.productArr.length; i++) {
		if (Venda.Attributes.productArr[i].attSet.id == uID) {

			var attributesUI 		= jQuery(".js-attributesForm").text(),
				hiddenInput_att1 	= document.getElementById("hiddenInput_att1"),
				hiddenInput_att2 	= document.getElementById("hiddenInput_att2"),
				hiddenInput_att3 	= document.getElementById("hiddenInput_att3"),
				hiddenInput_att4 	= document.getElementById("hiddenInput_att4");

			switch(attributesUI) {
				case "dropdown":

				break;

				case "halfswatch":
					hiddenInput_att1.name  = "att1";
					hiddenInput_att1.value = Venda.Attributes.productArr[i].attSet['att1'].selectedValue;
				break;

				case "swatch":
					hiddenInput_att1.name  = "att1";
					hiddenInput_att1.value = Venda.Attributes.productArr[i].attSet['att1'].selectedValue;
					hiddenInput_att2.name  = "att2";
					hiddenInput_att2.value = Venda.Attributes.productArr[i].attSet['att2'].selectedValue;
				break;

				case "grid":
					if(what != null) {
						Venda.Attributes.productArr[i].attSet['att1'].selected = what.getAttribute('data-attValue1');
						Venda.Attributes.productArr[i].attSet['att2'].selected = what.getAttribute('data-attValue2');
						Venda.Attributes.productArr[i].attSet['att1'].selectedValue = Venda.Attributes.getValueRef('att1',what.getAttribute('data-attValue1'));
						Venda.Attributes.productArr[i].attSet['att2'].selectedValue = Venda.Attributes.getValueRef('att2',what.getAttribute('data-attValue2'));
					}
					if(param != null) {
						Venda.Attributes.productArr[0].attSet['att1'].selected = param;
					}

					hiddenInput_att1.name  = "att1";
					hiddenInput_att1.value = Venda.Attributes.productArr[i].attSet['att1'].selectedValue;
					hiddenInput_att2.name  = "att2";
					hiddenInput_att2.value = Venda.Attributes.productArr[i].attSet['att2'].selectedValue;

					Venda.Attributes.productArr[0].attSet['att1'].imageRef = Venda.Attributes.getValueRef('att1',Venda.Attributes.productArr[0].attSet['att1'].selected);

				break;
			}

			Venda.Attributes.Set(Venda.Attributes.productArr[i].attSet.att1.selected, Venda.Attributes.productArr[i].attSet.att2.selected, Venda.Attributes.productArr[i].attSet.att3.selected, Venda.Attributes.productArr[i].attSet.att4.selected, uID);

			if (Venda.Attributes.IsAllSelected(Venda.Attributes.productArr[i].attSet.att1.selected, Venda.Attributes.productArr[i].attSet.att2.selected, Venda.Attributes.productArr[i].attSet.att3.selected, Venda.Attributes.productArr[i].attSet.att4.selected, uID)) {

				Venda.Attributes.updateItemPrice('atrmsrp', uID);
				Venda.Attributes.updateItemPrice('atrwas', uID);
				Venda.Attributes.updateItemPrice('atrsell', uID);
				Venda.Attributes.updateItemPrice('atrcost', uID);

				Venda.Attributes.updateItem('atrsku', uID);
				Venda.Attributes.updateItem('atrsuplsku', uID);
				Venda.Attributes.updateItem('atrpublish', uID);
				Venda.Attributes.updateItem('atronhand', uID);
				Venda.Attributes.updateItem('atrreleasedy', uID);
				Venda.Attributes.updateItem('atrreleasemn', uID);
				Venda.Attributes.updateItem('atrreleaseyr', uID);
				Venda.Attributes.updateItem('atretady', uID);
				Venda.Attributes.updateItem('atretamn', uID);
				Venda.Attributes.updateItem('atretayr', uID);

				// Updates all calculated data item values
				Venda.Attributes.updateCalcItem('#savemsrp',Venda.Attributes.GetCustomData(Venda.Attributes.productArr[i].attSet.att1.selected, Venda.Attributes.productArr[i].attSet.att2.selected, Venda.Attributes.productArr[i].attSet.att3.selected, Venda.Attributes.productArr[i].attSet.att4.selected, "savemsrp"), uID);
				Venda.Attributes.updateCalcItem('#savewas',Venda.Attributes.GetCustomData(Venda.Attributes.productArr[i].attSet.att1.selected, Venda.Attributes.productArr[i].attSet.att2.selected, Venda.Attributes.productArr[i].attSet.att3.selected, Venda.Attributes.productArr[i].attSet.att4.selected, "savewas"), uID);
				Venda.Attributes.updateCalcItem('#etadate',Venda.Attributes.GetCustomData(Venda.Attributes.productArr[i].attSet.att1.selected, Venda.Attributes.productArr[i].attSet.att2.selected, Venda.Attributes.productArr[i].attSet.att3.selected, Venda.Attributes.productArr[i].attSet.att4.selected, "etadate"), uID);
				Venda.Attributes.updateCalcItem('#releasedate',Venda.Attributes.GetCustomData(Venda.Attributes.productArr[i].attSet.att1.selected, Venda.Attributes.productArr[i].attSet.att2.selected, Venda.Attributes.productArr[i].attSet.att3.selected, Venda.Attributes.productArr[i].attSet.att4.selected, "releasedate"), uID);
				Venda.Attributes.updateCalcItem('#nofweta',Venda.Attributes.GetCustomData(Venda.Attributes.productArr[i].attSet.att1.selected, Venda.Attributes.productArr[i].attSet.att2.selected, Venda.Attributes.productArr[i].attSet.att3.selected, Venda.Attributes.productArr[i].attSet.att4.selected, "nofweta"), uID);
				Venda.Attributes.updateCalcItem('#nofwrelease',Venda.Attributes.GetCustomData(Venda.Attributes.productArr[i].attSet.att1.selected, Venda.Attributes.productArr[i].attSet.att2.selected, Venda.Attributes.productArr[i].attSet.att3.selected, Venda.Attributes.productArr[i].attSet.att4.selected, "nofwrelease"), uID);
				Venda.Attributes.updateCalcItem('#savepercentmsrp', Venda.Attributes.GetCustomData(Venda.Attributes.productArr[i].attSet.att1.selected, Venda.Attributes.productArr[i].attSet.att2.selected, Venda.Attributes.productArr[i].attSet.att3.selected, Venda.Attributes.productArr[i].attSet.att4.selected, "savepercentmsrp"), uID);
				Venda.Attributes.updateCalcItem('#savepercentwas', Venda.Attributes.GetCustomData(Venda.Attributes.productArr[i].attSet.att1.selected, Venda.Attributes.productArr[i].attSet.att2.selected, Venda.Attributes.productArr[i].attSet.att3.selected, Venda.Attributes.productArr[i].attSet.att4.selected, "savepercentwas"), uID);

				// Update The Price (change between pricerange/price)
				Venda.Attributes.Price(uID);

			}

			// Update selected Feedback display
			Venda.Attributes.SelectedValues(Venda.Attributes.productArr[i].attSet.att1.selected,Venda.Attributes.productArr[i].attSet.att2.selected,Venda.Attributes.productArr[i].attSet.att3.selected,Venda.Attributes.productArr[i].attSet.att4.selected, uID);

			// Show all elements with "js-Re-paint" class
			Venda.Attributes.Paint();

		}
	}

	if((Venda.Attributes.storeImgsArr.length > 0) && (Venda.Attributes.productArr[0].attSet.att1.imageRef != "")) { Venda.Attributes.ImageSwap(Venda.Attributes.productArr[0].attSet.att1.imageRef);
	};

};

/**
* This is a function gets the attribute object value reference
* @param{string} attName is the current attribute name e.g. att1
* @param{string} attValue is the current attribute value e.g. white
* @return{string} The value referance of the attName and attValue
* @author Alby Barber <abarber@venda.com>
*/
Venda.Attributes.getValueRef = function(attName,attValue){
	var atrNumber = 'atr' + attName.replace(/[a-z]/g,'');
	for(var j = 0; j < Venda.Attributes.attsArray.length; j++) {
		if(Venda.Attributes.attsArray[j][attName] == attValue) {
			return Venda.Attributes.attsArray[j][atrNumber];
		}
	}
}


/* PRODUCT IMAGE SWAP */


Venda.Attributes.ImageSwapReset = function() {
	Venda.Attributes.initImgObj = {};
	Venda.Attributes.storeImgsArr = [];
	Venda.Attributes.howManyZoomImgs = 0;
	Venda.Attributes.imgParam = null;
	Venda.Attributes.imgNo = 0;
}

Venda.Attributes.ImageSwapReset();

Venda.Attributes.ViewLargeImg = function(param, imgNo) {
	var popupContentThumbs = "";
	var popupContentImg = "";
	if(param == null) {
		for(var i = 0; i < Venda.Attributes.howManyZoomImgs; i++) {
			popupContentThumbs += "<a href=\"javascript: void(0);\" onclick=\"jQuery('#viewLargeMainImg').attr({'src': '" + Venda.Attributes.initImgObj.images.imgL[i] + "' });\"><img src=\"" + Venda.Attributes.initImgObj.images.imgS[i] + "\"></a>";
		}
		popupContentImg += "<img id=\"viewLargeMainImg\" src='" +  Venda.Attributes.initImgObj.images.imgL[imgNo] + "' />";
	} else {
		for(var i = 0; i < Venda.Attributes.howManyZoomImgs; i++) {
			popupContentThumbs += "<a href=\"javascript: void(0);\" onclick=\"jQuery('#viewLargeMainImg').attr({'src': '" + Venda.Attributes.storeImgsArr[param].images.imgL[i] + "' });\"><img src=\"" + Venda.Attributes.storeImgsArr[param].images.imgS[i] + "\"></a>";
		}
		popupContentImg += "<img id=\"viewLargeMainImg\" src='" +  Venda.Attributes.storeImgsArr[param].images.imgL[imgNo] + "' />";
	}

	jQuery("#vModal .js-modalContent").html('<div class="popupContentImg large-24 columns right">'+popupContentImg+'</div>'+
		'<div class="popupContentThumbs large-24 columns left">'+popupContentThumbs+'</div>');
	jQuery('#vModal').foundation('reveal', 'open');
	jQuery("#vModal").addClass('medium').removeClass('xlarge');
	jQuery('#vModal').on('closed', function () {
		jQuery("#vModal").addClass('xlarge').removeClass('medium');
	});
};


Venda.Attributes.StoreImageSwaps = function(obj) {

	if(obj.param == "") {
		var CloudHTML = "";
		for(var i = 0; i < obj.images.imgS.length; i++) {
			if(obj.images.imgS[i]) Venda.Attributes.howManyZoomImgs+=1;
		}

		for(var i = 0; i < Venda.Attributes.howManyZoomImgs; i++) {
			CloudHTML = jQuery('<a href="#" class="cloudzoom-gallery"></a>');
			CloudHTML.attr('data-cloudzoom', "useZoom: '#zoom1', image: '"+obj.images.imgM[i]+"', zoomImage: '"+obj.images.imgL[i]+"'");
			CloudHTML.html('<img src="'+obj.images.imgS[i]+'">');
			jQuery('#productdetail-altview').append(CloudHTML);
		}

		jQuery("#productdetail-viewlarge").html("<a href='javascript: Venda.Attributes.ViewLargeImg(" + Venda.Attributes.imgParam + ", " + Venda.Attributes.imgNo + ");'>View Large Image</a>");
		Venda.Attributes.initImgObj = obj;
		//jQuery('#productdetail-altview').jqSlider({isTouch: is_touch_device()});

	} else {
		Venda.Attributes.storeImgsArr.push(obj);
	}

};

Venda.Attributes.ImageSwap = function(att) {

	Venda.Attributes.imgNo = 0;
	var obj;

	for(var i = 0; i < Venda.Attributes.storeImgsArr.length; i++) {
		if(Venda.Attributes.storeImgsArr[i].param === att) {
			obj = Venda.Attributes.storeImgsArr[i];
			Venda.Attributes.imgParam = i;
			jQuery('#productdetail-viewlarge').html("<a href='javascript: Venda.Attributes.ViewLargeImg(" + Venda.Attributes.imgParam + ", " + Venda.Attributes.imgNo + ");'>View Large Image</a>");
		}
	}

	if((obj.images.imgM[0] != '') || (obj.images.imgL[0] !='')) {
		var mainImage = jQuery('<img id="zoom1" class="cloudzoom" src="'+obj.images.imgM[0]+'">');
		mainImage.attr('data-cloudzoom', "zoomImage: '"+obj.images.imgL[0]+"'");
		jQuery('#productdetail-image').html(mainImage);
	}

	jQuery("#productdetail-altview").html('');
	for(var i = 0; i < Venda.Attributes.howManyZoomImgs; i++) {
		var thumbImage = jQuery('<a href="#" class="cloudzoom-gallery"></a>');
		thumbImage.attr('data-cloudzoom', "useZoom: '#zoom1', image: '"+obj.images.imgM[i]+"', zoomImage: '"+obj.images.imgL[i]+"'");
		thumbImage.html('<img src="'+obj.images.imgS[i]+'">');
		jQuery('#productdetail-altview').append(thumbImage);
	}

	var options = {
		zoomPosition: 'inside'
	};

	jQuery('#zoom1, .cloudzoom-gallery').CloudZoom(options);
	};