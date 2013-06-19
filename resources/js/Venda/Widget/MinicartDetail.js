/**
 * @fileoverview Venda.Widget.MinicartDetail - Create an inpage popup of the minicart.
 *
 * The information displayed in the popup div is pulled from a hidden element of type 'Minicart Detail'.
 * Minicart Detail uses a carts template.
 *
 * @author Donatas Cereska <dcereska@venda.com>
 */
Venda.namespace('Widget.MinicartDetail');

/**
 * Stub function is used to support JSDoc.
 * @class Venda.Widget.MinicartDetail
 * @constructor
 */
Venda.Widget.MinicartDetail = function () {};

/**
 * Create minicartDetail functionality once the DOM is loaded
 */
jQuery(function () {
	if (jQuery('.minicart').length)
		Venda.Widget.MinicartDetail.Create();
});

/**
 * Create a new minicartDetail object
 */
Venda.Widget.MinicartDetail.Create = function () {
	
	Venda.Widget.MinicartDetail.settings = {
		
		enable : false,
		
		topPad : 140,
		leftPad : 174,
		
		fade : true,
		scroll : true,
		openDuration : 0.4,
		visibleTime : 8,
		
		highlight : true,
		highlightColor : "#95E85F",
		highlightOpacity : 0.4,
		highlightDuration : 4,
		
		header : true,
		closeButton : true,
		draggable : false,
		
		showOnHover : false,
		closeOnOusideClick : true
		
	};
	
	Venda.Widget.MinicartDetail.trackingProdAddUrl = '';
	Venda.Widget.MinicartDetail.trackingProdAddEnable = true;
	
	if (Venda.Widget.MinicartDetail.settings.enable === true) {
		if (Venda.Widget.MinicartDetail.settings.showOnHover === false) {
			jQuery(".showminicart").click(function (e) {
				Venda.Widget.MinicartDetail.InterceptCartLink(e);
			});
		} else {
			jQuery(".showminicart").click(function (e) {
				e.preventDefault();
			});
			jQuery(".showminicart").mouseover(function (e) {
				Venda.Widget.MinicartDetail.InterceptCartLink(e);
			});
		};
		
		Venda.Widget.MinicartDetail.mouseOver = false;
		
		Venda.Widget.MinicartDetail.PopupMinicart();
		
		Venda.Widget.MinicartDetail.CollectCheckbox();
		Venda.Widget.MinicartDetail.GatherAdds();
		
		if (jQuery(".demo").length > 0) {
			Venda.Widget.MinicartDetail.settings.topPad += jQuery(".demo").outerHeight(true);
		};
		if (jQuery(".admin").length > 0) {
			Venda.Widget.MinicartDetail.settings.topPad += jQuery(".admin").outerHeight(true);
		};
	};
	
};

/**
 * Count all of the "Add to basket" checkboxes for multiproduct page
 */
Venda.Widget.MinicartDetail.CollectCheckbox = function () {
	
	jQuery('label.addToCheckBoxLabel').css('display', 'block');
	jQuery('input.addToCheckBox').each(function () {
		jQuery(this).removeAttr("checked");
	});
	jQuery('#checkAllProducts').removeAttr("checked");
	
	switch (jQuery('.attributesForm').attr('id')) {
		
	case 'productdetailMulti':
		jQuery('.buyControlsMulti').prepend('<label>' + jQuery('#attributes-addAllProduct').text() + ' <input type="checkbox" id="checkAllProducts" /></label>');
		jQuery('#checkAllProducts').click(function () {
			if (jQuery(this).attr('checked') == 'checked') {
				jQuery('input.addToCheckBox').attr('checked', 'true');
				jQuery('input.addToCheckBox').each(function () {
					Venda.Widget.MinicartDetail.addCheckbox[jQuery(this).attr('id')] = true;
					jQuery('#itemlist_' + jQuery(this).attr('id')).removeAttr("disabled");
					jQuery('#qtylist_' + jQuery(this).attr('id')).removeAttr("disabled");
				});
			} else {
				jQuery('input.addToCheckBox').removeAttr('checked');
				jQuery('input.addToCheckBox').each(function () {
					Venda.Widget.MinicartDetail.addCheckbox[jQuery(this).attr('id')] = false;
					jQuery('#itemlist_' + jQuery(this).attr('id')).attr('disabled', 'true');
					jQuery('#qtylist_' + jQuery(this).attr('id')).attr('disabled', 'true');
				});
			}
		});
		Venda.Widget.MinicartDetail.addCheckbox = {};
		jQuery('input.addToCheckBox').each(function () {
			Venda.Widget.MinicartDetail.addCheckbox[jQuery(this).attr('id')] = false;
			jQuery('#itemlist_' + jQuery(this).attr('id')).attr('disabled', 'true');
			jQuery('#qtylist_' + jQuery(this).attr('id')).attr('disabled', 'true');
			jQuery(this).click(function () {
				if (jQuery(this).attr("checked") == 'checked') {
					Venda.Widget.MinicartDetail.addCheckbox[jQuery(this).attr('id')] = true;
					jQuery('#itemlist_' + jQuery(this).attr('id')).removeAttr("disabled");
					jQuery('#qtylist_' + jQuery(this).attr('id')).removeAttr("disabled");
				} else {
					Venda.Widget.MinicartDetail.addCheckbox[jQuery(this).attr('id')] = false;
					jQuery('#itemlist_' + jQuery(this).attr('id')).attr('disabled', 'true');
					jQuery('#qtylist_' + jQuery(this).attr('id')).attr('disabled', 'true');
				}
			});
		});
		break;
		
	case 'productdetailSet':
	case 'productset':
		jQuery('.buyControlsMulti').prepend('<label>' + jQuery('#attributes-addAllProduct').text() + ' <input type="checkbox" id="checkAllProducts" /></label>');
		jQuery('#checkAllProducts').click(function () {
			if (jQuery(this).attr('checked') == 'checked') {
				jQuery('input.addToCheckBox').attr('checked', 'true');
				jQuery('input.addToCheckBox').each(function () {
					Venda.Widget.MinicartDetail.addCheckbox[jQuery(this).attr('id')] = true;
					jQuery('#itemlist_' + jQuery(this).attr('id')).removeAttr("disabled");
					jQuery('#qtylist_' + jQuery(this).attr('id')).removeAttr("disabled");
				});
			} else {
				jQuery('input.addToCheckBox').removeAttr('checked');
				jQuery('input.addToCheckBox').each(function () {
					Venda.Widget.MinicartDetail.addCheckbox[jQuery(this).attr('id')] = false;
					jQuery('#itemlist_' + jQuery(this).attr('id')).attr('disabled', 'true');
					jQuery('#qtylist_' + jQuery(this).attr('id')).attr('disabled', 'true');
				});
			}
		});
		Venda.Widget.MinicartDetail.addCheckbox = {};
		jQuery('input.addToCheckBox').each(function () {
			var uID = jQuery(this).closest('.oneProduct').attr('id');
			uID = uID.substr(11);
			Venda.Widget.MinicartDetail.addCheckbox[uID] = false;
			jQuery('#itemlist_' + jQuery(this).attr('id')).attr('disabled', 'true');
			jQuery('#qtylist_' + jQuery(this).attr('id')).attr('disabled', 'true');
			jQuery(this).click(function () {
				if (jQuery(this).attr("checked") == 'checked') {
					Venda.Widget.MinicartDetail.addCheckbox[uID] = true;
					jQuery('#itemlist_' + jQuery(this).attr('id')).removeAttr("disabled");
					jQuery('#qtylist_' + jQuery(this).attr('id')).removeAttr("disabled");
				} else {
					Venda.Widget.MinicartDetail.addCheckbox[uID] = false;
					jQuery('#itemlist_' + jQuery(this).attr('id')).attr('disabled', 'true');
					jQuery('#qtylist_' + jQuery(this).attr('id')).attr('disabled', 'true');
				}
			});
		});
		break;
		
	};
	
	jQuery('input.addToCheckBox').on('click', function () {
		var isTrue = false;
		var isFalse = false;
		for (var key in Venda.Widget.MinicartDetail.addCheckbox) {
			if (Venda.Widget.MinicartDetail.addCheckbox[key] == true) {
				isTrue = true;
			}
			if (Venda.Widget.MinicartDetail.addCheckbox[key] == false) {
				isFalse = true;
				isTrue = false;
			}
		};
		if (isTrue == true && isFalse == false) {
			jQuery('#checkAllProducts').attr('checked', 'true');
		}
		if (isTrue == false && isFalse == true) {
			jQuery('#checkAllProducts').removeAttr("checked");
		}
	});
	
};

/**
 * Validate the product attributes selection
 */
Venda.Widget.MinicartDetail.Validate = function (uID) {
	
	if (Venda.Attributes.productArr.length > 0) {
		switch (jQuery('.attributesForm').attr('id')) {
			
		case 'productdetail':
		case 'quickBuyFast':
		case 'quickBuyDetails':
		case 'productdetailSet':
		case 'productset':
		case 'quickShop':
			for (var i = 0; i < Venda.Attributes.productArr.length; i++) {
				if (uID == Venda.Attributes.productArr[i].attSet.id) {
					if (Venda.Attributes.IsAllSelected(Venda.Attributes.productArr[i].attSet.att1.selected, Venda.Attributes.productArr[i].attSet.att2.selected, Venda.Attributes.productArr[i].attSet.att3.selected, Venda.Attributes.productArr[i].attSet.att4.selected, uID)) {
						if (jQuery("#oneProduct_" + uID + " .qty").val() > 0) {
							
							switch (Venda.Attributes.Get('stockstatus')) {
								
							case "Out of stock":
								alert(jQuery('#attributes-stockOut').text());
								return false;
								break;
								
							case "Not Available":
								alert(jQuery('#attributes-stockNA').text());
								return false;
								break;
								
							default:
								return true;
								
							}
							
						} else {
							alert(jQuery('#attributes-quantity').text());
							jQuery("#oneProduct_" + uID + " .qty").focus().select();
							return false;
						};
					} else {
						alert(jQuery('#attributes-chooseVariant').text());
						return false;
					}
				}
			}
			break;
			
		case 'productdetailMulti':
			for (var i = 0; i < Venda.Attributes.productArr.length; i++) {
				if (uID == Venda.Attributes.productArr[i].attSet.id) {
					for (var key in Venda.Widget.MinicartDetail.addCheckbox) {
						if (Venda.Widget.MinicartDetail.addCheckbox[key] == true) {
							if (jQuery("#oneProduct_" + uID + " #qtylist_" + key).val() > 0) {
								return true;
							} else {
								alert(jQuery('#attributes-quantity').text());
								jQuery("#oneProduct_" + uID + " #qtylist_" + key).focus().select();
								return false;
							}
						}
					}
					//All OK
					return true;
				}
			}
			break;
			
		}
	} else {
		if (jQuery("#oneProduct_" + uID + " .qty").val() > 0) {
			return true;
		} else {
			alert(jQuery('#attributes-quantity').text());
			jQuery("#oneProduct_" + uID + " .qty").focus().select();
			return false;
		}
	}
	
};

/**
 * Gather all Add to basket buttons
 * Find all input buttons that add to basket and add a listener to each one to check if they are clicked
 * Used only by the AJAX minicart which loads without a screen refresh
 */
Venda.Widget.MinicartDetail.GatherAdds = function () {
	
	jQuery(".addproduct, .buynow").click(function (e) {
		
		var formID = jQuery(this).parents('form:first').attr('id');
		
		var addOrBuy = (jQuery(this).hasClass('addproduct')) ? 'add' : 'buy';
		
		if (Venda.Attributes.attsArray.length > 0) {
			
			switch (jQuery('.attributesForm').attr('id')) {
				
			case 'productdetail':
			case 'quickBuyFast':
			case 'quickBuyDetails':
				var uID = jQuery(this).closest('.oneProduct').attr('id');
				uID = uID.substr(11);
				var isValid = Venda.Widget.MinicartDetail.Validate(uID);
				if (isValid) {
					if (addOrBuy == 'add') {
						Venda.Widget.MinicartDetail.AddProduct(formID);
						e.preventDefault();
					}
				} else {
					e.preventDefault();
					return false;
				}
				break;
				
			case 'productdetailMulti':
				var uID = jQuery(this).closest('.oneProduct').attr('id');
				uID = uID.substr(11);
				var anySelected = 0;
				for (var key in Venda.Widget.MinicartDetail.addCheckbox) {
					if (Venda.Widget.MinicartDetail.addCheckbox[key] == true) {
						anySelected++;
					}
				}
				if (anySelected > 0) {
					//for(var key in Venda.Widget.MinicartDetail.addCheckbox) {
					//if(Venda.Widget.MinicartDetail.addCheckbox[key] == true) {
					var isValid = Venda.Widget.MinicartDetail.Validate(uID);
					if (isValid) {
						if (addOrBuy == 'add') {
							Venda.Widget.MinicartDetail.AddProduct(formID);
							e.preventDefault();
						}
					} else {
						e.preventDefault();
						return false;
					}
					//}
					//}
				} else {
					alert(jQuery('#attributes-noneChecked').text());
					e.preventDefault();
					return false;
				}
				break;
				
			case 'productdetailSet':
			case 'productset':
				var anyInvalid = 0;
				var anySelected = 0;
				for (var key in Venda.Widget.MinicartDetail.addCheckbox) {
					if (Venda.Widget.MinicartDetail.addCheckbox[key] == true) {
						anySelected++;
					}
				}
				if (anySelected > 0) {
					jQuery('.oneProduct').each(function () {
						var uID = jQuery(this).attr('id');
						uID = uID.substr(11);
						if (Venda.Widget.MinicartDetail.addCheckbox[uID] == true) {
							var isValid = Venda.Widget.MinicartDetail.Validate(uID);
							if (!isValid) {
								anyInvalid += 1;
							}
						}
					});
					if (anyInvalid == 0) {
						if (addOrBuy == 'add') {
							Venda.Widget.MinicartDetail.AddProduct(formID);
							e.preventDefault();
						}
					} else {
						e.preventDefault();
						return void(0);
					}
				} else {
					alert(jQuery('#attributes-noneChecked').text());
					e.preventDefault();
					return false;
				}
				break;
				
			case 'quickShop':
				jQuery('.oneProduct').each(function () {
					var uID = jQuery(this).attr('id');
					uID = uID.substr(11);
					var isValid = Venda.Widget.MinicartDetail.Validate(uID);
					if (isValid) {
						Venda.Widget.MinicartDetail.AddProduct(formID);
						e.preventDefault();
					} else {
						e.preventDefault();
						return false;
					}
				});
				break;
				
			};
			
		} else {
			
			if (addOrBuy == 'add') {
				var uID = jQuery(this).closest('.oneProduct').attr('id');
				uID = uID.substr(11);
				var isValid = Venda.Widget.MinicartDetail.Validate(uID);
				if (isValid) {
					Venda.Widget.MinicartDetail.AddProduct(formID);
					e.preventDefault();
				} else {
					e.preventDefault();
					return false;
				}
			}
			
		};
		
	});
	
};

/**
 * Initialise minicartdetail panel
 * Creates div containers which will display the minicart contents
 */
Venda.Widget.MinicartDetail.PopupMinicart = function () {
	Venda.Widget.MinicartDetail.popupMinicartObj = new jQuery("#minicartDetailWrapper");
	var dialogOpts = {
		autoOpen : false,
		resizable : false,
		modal : false,
		closeOnEscape : false,
		draggable : Venda.Widget.MinicartDetail.settings.draggable,
		dialogClass : "minicartDetailDialog"
	};
	Venda.Widget.MinicartDetail.popupMinicartObj.dialog(dialogOpts);
	
	if (Venda.Widget.MinicartDetail.settings.header === true) {
		Venda.Widget.MinicartDetail.popupMinicartObj.dialog("option", "title", document.getElementById("tag-headertext").innerHTML);
		if (Venda.Widget.MinicartDetail.settings.closeButton === false) {
			jQuery(".minicartDetailDialog .ui-dialog-titlebar-close").css({
				"display" : "none"
			});
		};
	} else {
		jQuery(".minicartDetailDialog .ui-dialog-titlebar").css({
			"display" : "none"
		});
	};
	
	if (Venda.Widget.MinicartDetail.settings.visibleTime !== 0) {
		jQuery(".minicartDetailDialog").mouseenter(function () {
			Venda.Widget.MinicartDetail.mouseOver = true;
			clearTimeout(Venda.Widget.MinicartDetail.popupTimerId);
		});
		jQuery(".minicartDetailDialog").mouseleave(function () {
			Venda.Widget.MinicartDetail.mouseOver = false;
			Venda.Widget.MinicartDetail.PopupTimer();
		});
	};
	
	if (Venda.Widget.MinicartDetail.settings.closeOnOusideClick === true) {
		jQuery(".showminicart").click(function () {
			return false;
		});
		jQuery(".minicartDetailDialog").click(function (e) {
			e.stopPropagation();
		});
		jQuery(document).click(function () {
			if (Venda.Widget.MinicartDetail.IsAnimInAction("return") === false && Venda.Widget.MinicartDetail.popupMinicartObj.dialog("isOpen") === true) {
				Venda.Widget.MinicartDetail.CloseAnim();
			};
		});
	}
	
};

/**
 * Add to basket form submission
 * Processes and gets a response without reloading the screen: using AJAX
 * This is optional behaviour turned on via the Minicart Popup element
 */
Venda.Widget.MinicartDetail.AddProduct = function (formID) {
	
	var defaultLayout = document.getElementById(formID).layout.value;
	var defaultEx = document.getElementById(formID).ex.value;
	
	// change layout/ex field so that the response loaded in the div shows the relevant message
	document.getElementById(formID).layout.value = 'minicart';
	document.getElementById(formID).ex.value = "co_disp-shopc";
	
	// if there is a curlayout field change the value to minicartDetail
	if (typeof document.getElementById(formID).curlayout != 'undefined') {
		document.getElementById(formID).curlayout.value = 'minicart';
	};
	
	if (Venda.Widget.MinicartDetail.popupMinicartObj.dialog("isOpen") === false) {
		Venda.Widget.MinicartDetail.OpenAnim("addToBasket");
	} else {
		jQuery("#minicartDetailWrapper").html("<div class='loaderBar'></div>");
	}
	
	jQuery.ajax({
		type : "POST",
		url : document.getElementById("tag-codehttp").innerHTML,
		data : jQuery("#" + formID).serialize(),
		success : function (html) {
			jQuery("#addedmsg").css({
				"display" : "none"
			});
			
			jQuery("#minicartDetailWrapper").html(html);
			
			Venda.Widget.MinicartDetail.UpdateMinicart();
			
			Venda.Widget.MinicartDetail.WrapBasket();
			
			var headeHeight = 0;
			if (Venda.Widget.MinicartDetail.settings.header === true) {
				headeHeight = jQuery('.ui-dialog-titlebar').outerHeight();
			}
			var initHeight = jQuery('.minicartDetail').outerHeight() + headeHeight;
			Venda.Widget.MinicartDetail.initHeight = initHeight;
			var attributes = {
				'height' : initHeight + 'px'
			};
			jQuery('.minicartDetailDialog').animate(attributes, 200, function () {
				Venda.Widget.MinicartDetail.HighlightAdded();
				if (Venda.Widget.MinicartDetail.settings.visibleTime !== 0) {
					if(Venda.Widget.MinicartDetail.mouseOver == false) {
						Venda.Widget.MinicartDetail.PopupTimer();
					}
				};
			});
			
			// reset form fields that were set by JS
			document.getElementById(formID).layout.value = defaultLayout;
			document.getElementById(formID).ex.value = defaultEx;
			if (jQuery(".currencyConverter").length) {
				if (jQuery('#tag-currencycode') && jQuery(this).pennies('get')!== null){
						if(jQuery(this).pennies('get') != jQuery('#tag-currencycode').html()) {
							jQuery('#updateTotal').pennies('convert',{to:jQuery(this).pennies('get'),from: jQuery('#tag-currencycode').html()}).delay(1000);
						}
					}
			}
			
			// This code is about the 'product add' tracking : loading the 'trackingProdAdd' template from 'invt' folder
			if (Venda.Widget.MinicartDetail.trackingProdAddEnable == true) {
				if (!document.getElementById('trackingProdAdd')) {
					jQuery("body").append("<div id='trackingProdAdd'></div>");
				}
				//use trackingProdAdd url from input name=buy
				if (typeof document.getElementById(formID).buy != 'undefined') {
					Venda.Widget.MinicartDetail.trackingProdAddUrl = "/invt/" + document.getElementById(formID).buy.value;
					jQuery.ajax({
						url : Venda.Widget.MinicartDetail.trackingProdAddUrl + "&temp=trackingProdAdd&layout=noheaders",
						success : function (html) {
							jQuery("#trackingProdAdd").html(html);
						}
					});
				}
			}
			
		}
	});
	
};

/**
 * Update the top static basket values (Items|Amount)
 */
Venda.Widget.MinicartDetail.UpdateMinicart = function () {

 	jQuery("#updateItems").text(document.getElementById('updatemdItems').innerHTML);
	jQuery("#updateTotal")
		.text(document.getElementById('updatemdTotal').innerHTML)
		.data('price',document.getElementById('updatemdTotal').innerHTML);

	// update 'Item(s)' text to basketDetail
	if(parseInt(document.getElementById('updatemdItems').innerHTML) == 1) {
		jQuery(".updatebdItemsText").text(document.getElementById('tag-itemBD').innerHTML);
	} else {
		jQuery(".updatebdItemsText").text(document.getElementById('tag-itemsBD').innerHTML);
	}
		
	// if VBM tracking is enabled detect add to cart and send addedsku to VBM JS
	var vbmref = document.getElementById('tag-vbmref');
	if (vbmref && vbmref.innerHTML !== "") {
		Venda.Widget.VBM.SaveSearch(vbmref.innerHTML);
	}
	if (document.getElementById('vbm-panel-vbmpd')) {
		Venda.Widget.VBM.populateProductRecs("vbmpd", document.getElementById('tag-vbmref').innerHTML, document.getElementById('tag-vbmhtxt').innerHTML);
	}
	if (document.getElementById('vbm-panel-vbmsrch')) {
		Venda.Widget.VBM.populateProductRecs("vbmsrch", document.getElementById('tag-vbmref').innerHTML, document.getElementById('tag-vbmsrchhtxt').innerHTML);
	}
	
};

/**
 * Highlight Last Added Item
 * Animate the background colour of the item added if element option 'Highlight effect on background colour when item added' is ticked
 */
Venda.Widget.MinicartDetail.HighlightAdded = function () {
	
	if (Venda.Widget.MinicartDetail.settings.highlight === true) {
		
		var attributes;
		
		var attOrNo = (Venda.Attributes.attsArray.length > 0) ? Venda.Attributes.dataObj.atrsku : document.getElementById('tag-addedmsgref').innerHTML;
		
		if (Venda.Widget.MinicartDetail.settings.highlightColor !== "") {
			jQuery("#minicartDetailHighlight_" + attOrNo).css({
				"backgroundColor" : Venda.Widget.MinicartDetail.settings.highlightColor,
				"opacity" : "0"
			});
			
			attributes = {
				"opacity" : Venda.Widget.MinicartDetail.settings.highlightOpacity
			};
			jQuery("#minicartDetailHighlight_" + attOrNo).animate(attributes, (1000), function () {
				var letsDelay = setTimeout(function () {
						
						attributes = {
							"opacity" : "0"
						};
						jQuery("#minicartDetailHighlight_" + attOrNo).animate(attributes, (1000), function () {
							document.getElementById('tag-addedmsgref').innerHTML = "";
						});
						
					}, (Venda.Widget.MinicartDetail.settings.highlightDuration - 2) * 1000);
				
			});
		};
		
	};
};

/**
 * Show minicart
 * Will show/hide generated minicart popup when using click event
 * @param {event} e used to suppress default link behaviour
 */
Venda.Widget.MinicartDetail.InterceptCartLink = function (e) {
	if (Venda.Widget.MinicartDetail.IsAnimInAction("return") === false) {
		if (Venda.Widget.MinicartDetail.popupMinicartObj.dialog("isOpen") == false) {
			Venda.Widget.MinicartDetail.OpenAnim();
		} else {
			Venda.Widget.MinicartDetail.CloseAnim();
		}
	}
	e.preventDefault();
};

/**
 * Wrap the dinamic basket if the are more than 3 products added
 */
Venda.Widget.MinicartDetail.WrapBasket = function () {
	
	if (jQuery("#minicart_products li").length > 3) {
		
		
		var maxHeight = 0;
		var totalItems = jQuery("#minicart_products li").size();
		var perpage = 3;
		var pages = Math.ceil(totalItems/perpage);
		var step = 1;
	
		jQuery('#minicart_products li:lt(4)').each(function () {
			maxHeight += jQuery(this).outerHeight();
		});

		jQuery("#basketHolder").css({
			'overflow' : 'hidden',
			'height' : maxHeight + 'px'
		});
		
		jQuery("#basketWrapper").prepend("<button id='scrollUp' class='basketScroll'>&nbsp;</button>");
		jQuery("#basketWrapper").append("<button id='scrollDown' class='basketScroll'>&#9660;</button>");
		
		var top = 0;
		jQuery("#scrollUp").on("click", function () {
			if (step > 1) {
				step -= 1;
				top += maxHeight;
				jQuery("#minicart_products").animate({
					'margin-top' : top + 'px'
				}, 200, function () { jQuery("#scrollDown").html("&#9660;"); });
			}
			if (step == 1) {
				jQuery("#scrollDown").html("&#9660;");
				jQuery(this).html("&nbsp;");
			}
		});
		jQuery("#scrollDown").on("click", function () {
			if (step < pages) {
				step += 1;
				top -= maxHeight;
				jQuery("#minicart_products").animate({
					'margin-top' : top + 'px'
				}, 200, function () { jQuery("#scrollUp").html("&#9650;"); });
			}
			if (step == pages) {
				jQuery("#scrollUp").html("&#9650;");
				jQuery(this).html("&nbsp;");
			}
		});
		
	};
	
};

/**
 * Open minicart
 * Will show generated minicart popup using required animation techniques
 */
Venda.Widget.MinicartDetail.OpenAnim = function (act) {
	
	Venda.Widget.MinicartDetail.IsAnimInAction(true);
	
	var topPos = Venda.Widget.MinicartDetail.settings.topPad;
	var leftPos = jQuery(window).width() / 2 + Venda.Widget.MinicartDetail.settings.leftPad;
	var topPosAndMargin = topPos - 10;
	var initHeight = 149;
	
	Venda.Widget.MinicartDetail.popupMinicartObj.dialog("option", "position", [leftPos, topPos]);
	
	if (jQuery('#minicartDetail').length > 0) {
		if (act == "addToBasket") {
			jQuery("#minicartDetailWrapper").html("<div class='loaderBar'></div>");
		} else {
			initHeight = Venda.Widget.MinicartDetail.initHeight
		}
	} else {
		jQuery("#minicartDetailWrapper").html("<div class='loaderBar'></div>");
	}
	
	var attributes = {
		'height' : '0px',
		'opacity' : '0'
	};
	
	jQuery('.minicartDetailDialog').css(attributes);
	
	if (Venda.Widget.MinicartDetail.settings.fade === true && Venda.Widget.MinicartDetail.settings.scroll === true) {
		jQuery('.minicartDetailDialog').css({
			'height' : '0px'
		});
		attributes = {
			'height' : initHeight + 'px',
			'opacity' : '1'
		};
	};
	if (Venda.Widget.MinicartDetail.settings.fade === true && Venda.Widget.MinicartDetail.settings.scroll === false) {
		jQuery('.minicartDetailDialog').css({
			'height' : 'auto'
		});
		attributes = {
			'opacity' : '1'
		};
	};
	if (Venda.Widget.MinicartDetail.settings.fade === false && Venda.Widget.MinicartDetail.settings.scroll === true) {
		jQuery('.minicartDetailDialog').css({
			'height' : '0px',
			'opacity' : '1'
		});
		attributes = {
			'height' : initHeight + 'px'
		};
	};
	
	jQuery('.minicartDetailDialog').animate(attributes, (Venda.Widget.MinicartDetail.settings.openDuration * 1000), function () {
		Venda.Widget.MinicartDetail.IsAnimInAction(false);
		if (act != "addToBasket") {
			if (!jQuery('#minicartDetail').length) {
				jQuery('#minicartDetailWrapper').load('/page/home&layout=minicart', function () {
					
					Venda.Widget.MinicartDetail.WrapBasket();
					
					if (jQuery(".minicart_empty").length) {
						jQuery("#minicart_totals, #minicart_links").css({
							"display" : "none"
						});
					};
					
					var headeHeight = 0;
					if (Venda.Widget.MinicartDetail.settings.header === true) {
						headeHeight = jQuery('.ui-dialog-titlebar').outerHeight();
					}
					var initHeight = jQuery('.minicartDetail').outerHeight() + headeHeight;
					Venda.Widget.MinicartDetail.initHeight = initHeight;
					attributes = {
						'height' : initHeight + 'px'
					};
					jQuery('.minicartDetailDialog').animate(attributes, 200, function () {
						if (Venda.Widget.MinicartDetail.settings.visibleTime !== 0) {
							if(Venda.Widget.MinicartDetail.mouseOver == false) {
								Venda.Widget.MinicartDetail.PopupTimer();
							}
						};
					});
				});
			} else {
				if(Venda.Widget.MinicartDetail.mouseOver == false) {
					Venda.Widget.MinicartDetail.PopupTimer();
				}
			}
		}
	});
	
	function SetPos() {
		if (jQuery(window).scrollTop() > topPosAndMargin) {
			topPos = 10;
			jQuery('.minicartDetailDialog').css({
				"position" : "fixed",
				"top" : topPos + "px"
			});
		} else {
			topPos = Venda.Widget.MinicartDetail.settings.topPad - jQuery(window).scrollTop();
			jQuery('.minicartDetailDialog').css({
				"position" : "absolute",
				"top" : topPos + "px"
			});
		}
		Venda.Widget.MinicartDetail.popupMinicartObj.dialog("option", "position", [leftPos, topPos]);
	}
	SetPos();
	
	window.onscroll = function () {
		SetPos()
	};
	
	window.onresize = function () {
		SetPos()
	};
	
	// If you have currency converter include the following line
	if(jQuery(".currencyConverter").length) {
		if (jQuery('#tag-currencycode') && (typeof jQuery().pennies !== 'undefined')){
			jQuery('#minicartDetailWrapper .price').pennies('convert',{to:jQuery(this).pennies('get'),from: jQuery('#tag-currencycode').html()});
		}
	}
	
	Venda.Widget.MinicartDetail.popupMinicartObj.dialog("open");
	
};

/**
 * Close minicart animation
 * Will close generated minicart popup using required animation techniques
 */
Venda.Widget.MinicartDetail.CloseAnim = function () {
	
	if (Venda.Widget.MinicartDetail.settings.fade === false && Venda.Widget.MinicartDetail.settings.scroll === false) {
		Venda.Widget.MinicartDetail.popupMinicartObj.dialog("close");
	} else {
		
		Venda.Widget.MinicartDetail.IsAnimInAction(true);
		
		// if minicart close timer is enabled, first clear the timeout so that anim is less glitchy
		if (Venda.Widget.MinicartDetail.settings.visibleTime != 0) {
			clearTimeout(Venda.Widget.MinicartDetail.popupTimerId);
		};
		
		var attributes = {
			'height' : 'auto',
			'opacity' : '1'
		};
		
		jQuery('.minicartDetailDialog').css(attributes);
		
		if (Venda.Widget.MinicartDetail.settings.fade === false && Venda.Widget.MinicartDetail.settings.scroll === false) {
			Venda.Widget.MinicartDetail.popupMinicartObj.dialog("close");
		};
		if (Venda.Widget.MinicartDetail.settings.fade === true && Venda.Widget.MinicartDetail.settings.scroll === true) {
			attributes = {
				'height' : '0px',
				'opacity' : '0'
			};
		};
		if (Venda.Widget.MinicartDetail.settings.fade === true && Venda.Widget.MinicartDetail.settings.scroll === false) {
			attributes = {
				'opacity' : '0px'
			};
		};
		if (Venda.Widget.MinicartDetail.settings.fade === false && Venda.Widget.MinicartDetail.settings.scroll === true) {
			jQuery('.minicartDetailDialog').css({
				'opacity' : '1'
			});
			attributes = {
				'height' : '0px'
			};
		};
		
		jQuery('.minicartDetailDialog').animate(attributes, (Venda.Widget.MinicartDetail.settings.openDuration * 1000), function () {
			Venda.Widget.MinicartDetail.popupMinicartObj.dialog("close");
			Venda.Widget.MinicartDetail.IsAnimInAction(false);
		});
		
	}
};

/**
 * Check to see if animation is in progress and block interaction until anim is over
 */
Venda.Widget.MinicartDetail.isAnimInActionVal = false;
Venda.Widget.MinicartDetail.IsAnimInAction = function (obj) {
	if (obj === true || obj === false) {
		Venda.Widget.MinicartDetail.isAnimInActionVal = obj;
	}
	if (obj === "return") {
		return Venda.Widget.MinicartDetail.isAnimInActionVal;
	}
}

/**
 * Set minicart close timer
 * Set the amount of visibleTime after which the close cart function is executed
 */
Venda.Widget.MinicartDetail.popupTimerId = 0;
Venda.Widget.MinicartDetail.PopupTimer = function () {
	Venda.Widget.MinicartDetail.popupTimerId = setTimeout('Venda.Widget.MinicartDetail.CloseAnim()', (Venda.Widget.MinicartDetail.settings.visibleTime * 1000));
};

/**
 * Add to basket by passing parameters (without form submittion) i.e. add a product from flash (10CMS)
 * Processes and gets a response without reloading the screen: using AJAX
 * @param {string} invtRef - a parent product ref which need to add to your basket
 * @param {string} qty -  a number of product
 * @param {string} att1 - an attribute 1 value
 * @param {string} att2 - an attribute 2 value
 */
Venda.Widget.MinicartDetail.ParamAddProduct = function (invtRef, qty, att1, att2) {
	
	var requestURL = document.getElementById("tag-codehttp").innerHTML + "?invt=" + invtRef + "&buy=" + invtRef + "&qty=" + qty + "&att1=" + att1 + "&att2=" + att2 + "&ex=co_disp-shopc&mode=add&log=22&layout=minicartDetail&next=&curpage=&bsref=" + document.getElementById("tag-bsref").innerHTML;
	
	jQuery.ajax({
		type : "POST",
		url : requestURL,
		success : function (html) {
			
			jQuery("#minicartDetailWrapper").html(html);
			
			Venda.Widget.MinicartDetail.UpdateMinicart();
			
			if (Venda.Widget.MinicartDetail.popupMinicartObj.dialog("isOpen") == false) {
				Venda.Widget.MinicartDetail.OpenAnim();
			};
			
			Venda.Widget.MinicartDetail.HighlightAdded();
			
			if (Venda.Widget.MinicartDetail.settings.visibleTime != 0) {
				// reset the timer if automatic close is enabled
				clearTimeout(Venda.Widget.MinicartDetail.popupTimerId);
			};
		}
	});
	
};

///// EVENTS /////
/**
 * Intercepts a return within the 'QTY' box and triggers the actions of the 'Add to Basket' button
 */
jQuery("#qtybox #qty").keypress(function (e) {
	if (e.keyCode == 13) {
		jQuery('.addproduct').trigger('click');
	}
	e.preventDefault();
});

/**
 * Buy Now Event
 */
jQuery("#addproductbox .buynow").click(function (e) {
	document.form.ex.value = 'co_wizr-shopcart';
	e.preventDefault();
});

/**
 * Pre-Order non-attribute Event
 */
jQuery("#addproductbox .preorder").click(function (e) {
	document.form.ex.value = 'co_disp-shopc';
	e.preventDefault();
});