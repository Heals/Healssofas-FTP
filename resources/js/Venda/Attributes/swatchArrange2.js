jQuery('body').on('swatchesArranged', '.type_swatch', function(){
	
	jQuery('.swatchTypeGroup').remove();
	
	/**
	 * swatchArrange.js - arranges swatches according to type.
	 * This module assumes that the swatches are list elements within a tag with id="attributeInputs".
	 * 010313 - AJW.
	 */

	var
		swatchElements = $('#attributeInputs #swatchList_att1 li'),
		swatchObject = getSwatchObject(swatchElements);

	addNewTypeLists(swatchObject.types);
	arrangeSwatches(swatchElements, swatchObject);

	/**
	 * Returns a swatch object containing instance and type information
	 * @param  {nodelist} $el           A nodelist of the swatch nodes.
	 * @return {object}   swatchObject  The swatch object
	 */

	function getSwatchObject($el) {
		var swatchObject = { instances: {}, types: {} }, name, type;
		$el.each(function() {
			name = $(this).attr('class').split(' ')[0];
			type = name.split('_').pop().toLowerCase();
			swatchObject.instances[name] = type;
			if(!swatchObject.types[type]){swatchObject.types[type] = 1;}
		});
		return swatchObject;
	}

	/**
	 * Adds the new swatch separators to the DOM under #attributeInputs
	 * with id="swatch-[type]", class="swatchType", and there is a break after the type title.
	 * @param {array} types Array of types.
	 */

	function addNewTypeLists(types) {
		var domInsert;
		for(type in types){
			domInsert = '<ul id="swatch-' + type + '" class="swatchTypeGroup">' + type.toUpperCase() + '</ul>';
			$('#attributeInputs').append(domInsert);
		}
	}

	/**
	 * Moves the elements to the correct new type ul.
	 * @param  {nodelist} $el List of swatch nodes.
	 * @param  {object}   obj The swatch object.
	 */

	function arrangeSwatches($el, obj) {
		var name, type;
		$el.each(function(){
			name = $(this).attr('class').split(' ')[0],
			type = obj.instances[name];
			$(this).appendTo($('#swatch-' + type));
		});
	}

});