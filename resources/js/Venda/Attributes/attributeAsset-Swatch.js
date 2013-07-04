/**
* @fileoverview Venda.Attributes
 * Venda's Attributes functionality incorporates a standardized way of interfacing Attribute Products with the front-end as to make
 * the modification and creation of selection methods easier.
 *
 * These are the swatch assets required for intefaces that use swatches
 *
 * @author Alby Barber <abarber@venda.com>
 * @author Donatas Cereska <DonatasCereska@venda.com>
*/

Venda.Attributes.UpdateSwatch = function (attName, uID) {

	for (var i = 0; i < Venda.Attributes.productArr.length; i++) {

		if (Venda.Attributes.productArr[i].attSet.id == uID) {
			var
				swatchList = '',
				att1 = Venda.Attributes.productArr[i].attSet.att1.selected,
				att2 = Venda.Attributes.productArr[i].attSet.att2.selected,
				att3 = Venda.Attributes.productArr[i].attSet.att3.selected,
				att4 = Venda.Attributes.productArr[i].attSet.att4.selected,
				stockstatus, selectName, attOption;

			for (var t = 0; t < Venda.Attributes.productArr[i].attSet[attName].options.length; t++) {
				var attOption = Venda.Attributes.productArr[i].attSet[attName].options[t];
				if (attName == 'att1') {
					stockstatus = Venda.Attributes.GetAll(Venda.Attributes.productArr[i].attSet.att1.options[t], att2, att3, att4, 'stockstatus').replace(/ /g,"_");
				}
				if (attName == 'att2') {
					stockstatus = Venda.Attributes.GetAll(att1, Venda.Attributes.productArr[i].attSet.att2.options[t], att3, att4, 'stockstatus').replace(/ /g,"_");
				}
				if (attName == 'att3') {
					stockstatus = Venda.Attributes.GetAll(att1, att2, Venda.Attributes.productArr[i].attSet.att3.options[t], att4, 'stockstatus').replace(/ /g,"_");
				}
				if (attName == 'att4') {
					stockstatus = Venda.Attributes.GetAll(att1, att2, att3, Venda.Attributes.productArr[i].attSet.att4.options[t], 'stockstatus').replace(/ /g,"_");
				}
				swatchList += '<li onclick="Venda.swatchInfo.init(\''+ (attOption).replace(/ /g,"_") +'\');" class="'+ (attOption).replace(/ /g,"_") + ' attributeSwatch ' + stockstatus + '" id="attributeSwatch_' + uID + '" data-attName="'+ attName +'" data-attValue="'+ attOption + '"><span class="swatchText">' + attOption + '</span></li>';
			}

			selectName = "#oneProduct_" + uID + " #swatchList_" + attName;
			jQuery(selectName).replaceWith("<ul id='swatchList_" + attName + "'>" + swatchList + "</ul>");

		}
	}

};

Venda.Attributes.setSelectedClass = function (uID){
	for(var i = 0; i < Venda.Attributes.productArr.length; i++) {
		if (Venda.Attributes.productArr[i].attSet.id == uID) {
			for (var t = 1; t <= Venda.Attributes.HowManyAtts(uID); t++) {
				var att = 'att' + t;
				
				if (typeof Venda.Attributes.productArr[i].attSet[att].selected=="undefined"){
					return false;
				}
				
				if (Venda.Attributes.productArr[i].attSet[att].selected.length != 0){
					jQuery("#oneProduct_" + uID + " #attributeInputs ." + (Venda.Attributes.productArr[i].attSet[att].selected).replace(/ /g,"_")).addClass("selected");

					if (Venda.Attributes.Settings.useSelectedArrow){
						jQuery("#oneProduct_" + uID + " #attributeInputs .selected").prepend('<div class="selectedArrow-shadow"></div><div class="selectedArrow"></div>');
					}

					if(jQuery("#attributesForm").length > 0) {
						if(document.getElementByClassName("attributesForm").innerHTML == "halfswatch") {
							document.getElementById("hiddenInput_" + att).name = att;
							document.getElementById("hiddenInput_" + att).value = Venda.Attributes.productArr[i].attSet[att].selected;
						}
					if(document.getElementById("attributesForm").innerHTML == "swatch") {
							document.getElementById("hiddenInput_" + att).name = att;
							document.getElementById("hiddenInput_" + att).value = Venda.Attributes.productArr[i].attSet[att].selected;
						}
					}

				}
			}
		}
	}
};