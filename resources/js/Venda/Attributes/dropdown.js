/**
* @fileoverview Venda.Attributes
 * Venda's Attributes functionality incorporates a standardized way of interfacing Attribute Products with the front-end as to make
 * the modification and creation of selection methods easier.
 *
 * This is the dropdown interface used to display select dropdown boxes for each attribute
 *
 * The files below will be included dynamicly when required:
 * @requires js/Venda/Attributes/attributeAsset-Dropdown.js
 *
 * @author Alby Barber <abarber@venda.com>
 * @author Donatas Cereska <DonatasCereska@venda.com>
*/

Venda.Attributes.DropDown = function () {
	
	jQuery(".oneProduct").each(function(index) {
		var uID = this.id.substr(11);
		Venda.Attributes.productArr[index] = new Venda.Attributes.GenerateOptionsJSON(index, uID);
		if(jQuery("#oneProduct_" + uID + " #attributeInputs").length) {
			jQuery("#oneProduct_" + uID + " #attributeInputs").addClass("type_dropdown");
			for (var t = 1; t <= Venda.Attributes.HowManyAtts(uID); t++) {	Venda.Attributes.generateDropDowns('att' + t, uID); }
			Venda.Attributes.PresetAtt(index, uID);
			jQuery('#oneProduct_' + uID + ' #pricerange').text(Venda.Attributes.GetPriceRange(uID));
			jQuery('#oneProduct_' + uID + ' #price').text(Venda.Attributes.GetPriceRange(uID)); 
			Venda.Attributes.updateAttributes(uID);
		}
	});
	
	// This is getting all the assets that can be loaded after the Onload	
	var url = jQuery("#tag-ebizurl").text() + '/content/ebiz/heals/resources/js/Venda/Attributes/attributeAsset-Dropdown.js';
	jQuery.getScript(url, function(Status){ if (!Status){console.warn('Whoops! attributeAsset-Dropdown.js did not load');} else {
	//All loaded
			
 		//ColourSwatch selection
		var singleuID = jQuery(".oneProduct").attr("id").substr(11);
		var urlParam = location.href.split("=")[1];
		if((jQuery(".oneProduct").length === 1) && (urlParam != "")) {
			for(var i = 0; i < Venda.Attributes.storeImgsArr.length; i++) {
				if(Venda.Attributes.storeImgsArr[i].param == urlParam) {
					document.getElementById('addproductform').elements["att1"].value = urlParam;
					Venda.Attributes.DropdownBehaviour('att1', urlParam, singleuID);
				}
			}
		}
		
	//All loaded
	}
	});
	
}();

// Events
jQuery("select").change(function() {
	var uID = this.id.substr(5);
	var attName = this.name;
	var attValue = this.value;		
	Venda.Attributes.DropdownBehaviour(attName, attValue, uID);
});

Venda.Attributes.DropdownBehaviour = function(attName, attValue, uID) {
	Venda.Attributes.setSelectedJSON(attName,attValue, uID);
	Venda.Attributes.updateAttributes(uID);
	Venda.Attributes.UpdateDD('att2', uID);
}