/**
* @fileoverview Venda.Attributes
 * Venda's Attributes functionality incorporates a standardized way of interfacing Attribute Products with the front-end as to make
 * the modification and creation of selection methods easier.
 *
 * This is the multiAdd1 interface used to display small product images and hide inputs.
 *
 * @author Alby Barber <abarber@venda.com>
*/


Venda.Attributes.ShowImages = function () {
		
	jQuery('#attributeInputs').hide(); 
		
	jQuery(".oneProduct").each(function(index) {
		var uID = this.id.substr(11);
		Venda.Attributes.productArr[index] = new Venda.Attributes.GenerateOptionsJSON(index, uID);

	});
	
	// This function grabs the image swatch of the attributes and puts them against the correct image.
	jQuery('.multiList .prodMulti').each(function(index) {
		
		var currentdata = this.getAttribute('data-atr1');
		for(var i = 0; i < Venda.Attributes.productArr[0].attSet.att1.options.length; i++) {  
			if(Venda.Attributes.storeImgsArr[i].param === currentdata) {  
				var imgSURL	= Venda.Attributes.storeImgsArr[i].images.imgS[0]
				jQuery("img", this).attr('src', imgSURL);	
			}
		}	
	});

}();