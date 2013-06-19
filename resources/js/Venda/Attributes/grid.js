/**
* @fileoverview Venda.Attributes
 * Venda's Attributes functionality incorporates a standardized way of interfacing Attribute Products with the front-end as to make
 * the modification and creation of selection methods easier.
 *
 * This is the grid interface used to display the grid display for two attributes
 *
 * @author Alby Barber <abarber@venda.com>
 * @author Donatas Cereska <DonatasCereska@venda.com>
*/

Venda.Attributes.Grid = function () {
	
	var generateGrid = function(index, uID){
		
		if (Venda.Attributes.productArr[index].attSet["att3"].options.length > 1) { console.warn("Woo there! You can't have more that 2 attributes for a grid interface.");	}
		
		var cols = Venda.Attributes.productArr[index].attSet["att1"].options.length + 1;
		var rows = Venda.Attributes.productArr[index].attSet["att2"].options.length + 1;
		
		if(Venda.Attributes.Settings.gridSwap) {
			var table = jQuery('<table class="grid"><thead><tr><th class="col1">'+ Venda.Attributes.productArr[0].attSet.att1.name +'</th> <th class="col2" colspan="' + Venda.Attributes.productArr[index].attSet["att2"].options.length +'">' + Venda.Attributes.productArr[0].attSet.att2.name + '</th></tr></thead><tbody>');
			for(var c = 0; c < cols; c++)
			{
				var tr = jQuery('<tr>');
				for (var r = 0; r < rows; r++) {
					if(c == 0) {
						if(r == 0) {
							jQuery('<th rowspan="1"></th>').appendTo(tr);
						} else { jQuery('<th class="rowtitleY">' + Venda.Attributes.productArr[index].attSet["att2"].options[r-1] + '</th>').appendTo(tr); }
					} else {
						if(r == 0) {
							if(c != 0)
								jQuery('<th class="rowtitleX">' + Venda.Attributes.productArr[index].attSet["att1"].options[c-1] + '</th>').appendTo(tr);
						} else {
							jQuery('<td class="gridBlock ' + Venda.Attributes.GetAll(Venda.Attributes.productArr[index].attSet.att1.options[c-1], Venda.Attributes.productArr[index].attSet.att2.options[r-1], '', '', 'stockstatus').replace(/ /g,"_") + '" data-attValue1="'+ Venda.Attributes.productArr[index].attSet.att1.options[c-1] +'" data-attValue2="'+ Venda.Attributes.productArr[index].attSet.att2.options[r-1] +'" id="gridBlock_' + uID + '"><div class="gridImage"><span>' + Venda.Attributes.GetAll(Venda.Attributes.productArr[index].attSet.att1.options[c-1], Venda.Attributes.productArr[index].attSet.att2.options[r-1], '', '', 'stockstatus') + '</span></div></td>').appendTo(tr);
						}
					}	
					tr.appendTo(table);
				}
			}
		} else {
			var table = jQuery('<table class="grid"><thead><tr><th class="col1">'+ Venda.Attributes.productArr[0].attSet.att2.name +'</th> <th class="col2" colspan="' + Venda.Attributes.productArr[index].attSet["att1"].options.length +'">' + Venda.Attributes.productArr[0].attSet.att1.name + '</th></tr></thead><tbody>');
			for(var r = 0; r < rows; r++)
			{
				var tr = jQuery('<tr>');
				for (var c = 0; c < cols; c++) {
					if(c == 0) {
						if(r == 0) {
							jQuery('<th rowspan="1"></th>').appendTo(tr);
						} else { jQuery('<th class="rowtitleY">' + Venda.Attributes.productArr[index].attSet["att2"].options[r-1] + '</th>').appendTo(tr);}
					} else {
						if(r == 0) {
							if(c != 0)
								jQuery('<th class="rowtitleX">' + Venda.Attributes.productArr[index].attSet["att1"].options[c-1] + '</th>').appendTo(tr);
						} else {
							jQuery('<td class="gridBlock ' + Venda.Attributes.GetAll(Venda.Attributes.productArr[index].attSet.att1.options[c-1], Venda.Attributes.productArr[index].attSet.att2.options[r-1], '', '', 'stockstatus').replace(/ /g,"_") + '" data-attValue1="'+ Venda.Attributes.productArr[index].attSet.att1.options[c-1] +'" data-attValue2="'+ Venda.Attributes.productArr[index].attSet.att2.options[r-1] +'" id="gridBlock_' + uID + '"><div class="gridImage"><span>' + Venda.Attributes.GetAll(Venda.Attributes.productArr[index].attSet.att1.options[c-1], Venda.Attributes.productArr[index].attSet.att2.options[r-1], '', '', 'stockstatus') + '</span></div></td>').appendTo(tr);
						}
					}	
					tr.appendTo(table);
				}
			}
		}
		jQuery('#oneProduct_' + uID + ' #attributeInputs').html(table);
		
	}

	jQuery(".oneProduct").each(function(index) {
		var uID = this.id.substr(11);
		Venda.Attributes.productArr[index] = new Venda.Attributes.GenerateOptionsJSON(index, uID);
		if(jQuery("#oneProduct_" + uID + " #attributeInputs").length) {
			jQuery("#oneProduct_" + uID + " #attributeInputs").addClass("type_grid");
			if(Venda.Attributes.HowManyAtts(uID) > 0) generateGrid(index, uID);
			Venda.Attributes.PresetAtt(index, uID);
			jQuery('#oneProduct_' + uID + ' #pricerange').text(Venda.Attributes.GetPriceRange(uID));
			jQuery('#oneProduct_' + uID + ' #price').text(Venda.Attributes.GetPriceRange(uID)); 
			Venda.Attributes.updateAttributes(uID);
		}
	});
	
	//ColourSwatch selection
	var singleuID = jQuery(".oneProduct").attr("id").substr(11);
	var urlParam = location.href.split("=")[1];
	if((jQuery(".oneProduct").length === 1) && (urlParam != "")) {
		for(var i = 0; i < Venda.Attributes.storeImgsArr.length; i++) {
			if(Venda.Attributes.storeImgsArr[i].param == urlParam) {
				Venda.Attributes.updateAttributes(singleuID, null, urlParam);
			}
		}
	}
	
}();

jQuery(".gridBlock").click(function() {
 	var uID = this.id.substr(10);
	Venda.Attributes.GridBehaviour(uID, this)
});

Venda.Attributes.GridBehaviour = function(uID, what) {
	// Update the products attribute details
	Venda.Attributes.updateAttributes(uID, what);
	// setSelectedClass is used to add a class to the gridBlock .selected
	jQuery('#oneProduct_' + uID + ' .gridBlock').removeClass("selected");
	jQuery(what).addClass("selected");
}