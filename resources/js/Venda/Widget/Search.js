/**
 * @fileoverview Venda.Widget.Search
 * Refinement enhancements
 * AJAX no-reload for search results
 * Requires jQuery and jQueryUI
 * @author Donatas Cereska <dcereska@venda.com> && Hayley Easton <heaston@venda.com>
 */
Venda.namespace("Widget.Search");

Venda.Widget.Search.vars = {
	SOLRParentRef: "",
	refineParams: "",
	firstLoad: 0,
	whatsSelected: null
};

jQuery(function () {

	Venda.Widget.Search.vars.SOLRParentRef = "";
	if (document.getElementById("parentCatRef")) {
		Venda.Widget.Search.vars.SOLRParentRef = "&parentCategoryRef=" + document.getElementById("parentCatRef").innerHTML;
		if(document.getElementById("q*")) { document.getElementById("q*").style.display = 'none'; }
	}
	
	/* UI CLICKABLES */
	if(jQuery('#tag-showviewall').text()==="1"){Venda.Widget.Search.viewAllRefinements();}
	jQuery('.showviewall').css('display','block');jQuery('#collate h3.collateheading').live('click',function(){if(jQuery("#"+this.id+"results").is(':visible')){jQuery("#"+this.id+"results").hide("fast");jQuery(this).css({backgroundPosition:'-1px -537px'});}else{jQuery("#"+this.id+"results").show("fast");jQuery(this).css({backgroundPosition:'-1px -521px'});};});jQuery(".collateresults .filter").keyup(function(){var filter=jQuery(this).val(),count=0;var collateField=this.id;collateField=collateField.replace("filter","")
	jQuery("."+collateField+"collateresult:first div").each(function(){if(jQuery(this).text().search(new RegExp(filter,"i"))<0){jQuery(this).addClass("hide");}else{jQuery(this).removeClass("hide");var result=jQuery(this).find(".facet").text();var reg=new RegExp(filter,"gi");var final_str=result.replace(reg,function(str){return'<span class="highlight">'+str+'</span>'});jQuery(this).find(".facet").html(final_str);count++;}});});
	/* end of UI CLICKABLES */
	
	/* CHECKBOX */
	jQuery(".collateresults input.updatesearch:checkbox").live('change', function () {
		Venda.Widget.Search.scrollToResults();
		if (jQuery(this).is(':checked')) {
			Venda.Widget.Search.UpdateURL(Venda.Widget.Search.EscapeAndFix(jQuery(this).val()), true);
		} else {
			Venda.Widget.Search.DeleteParams(Venda.Widget.Search.EscapeAndFix(jQuery(this).val()));
		}
	});
	/* end of CHECKBOX */
	
	/* SIMPLE A */
	jQuery('.refinelist a.updatesearch').live('click', function (event) {
		Venda.Widget.Search.scrollToResults();
		event.preventDefault();
		Venda.Widget.Search.UpdateURL(Venda.Widget.Search.EscapeAndFix(jQuery(this).attr("rel")), true);
	});
	/* end of SIMPLE A */
	
	/* PAGINATION */
	jQuery('.pagn a.updatesearch, .pagn a.viewProduct').live('click', function (event) {
		Venda.Widget.Search.scrollToResults();
		// the pagination links cannot show individual params to use refineParams, therefore load URL
		event.preventDefault();
		//console.log("click: " + this.href);
		Venda.Widget.Search.pagnLoadFix(this.href);
	});
	/* end of PAGINATION */
	
	/* FORM */
	jQuery(".collatedresult form").live('submit', function (event) {
		event.preventDefault();
		var passedFields = 0;
		jQuery("#" + this.id + ' input:text').each(function () {
			if (jQuery(this).val() === "") {
				//jQuery("#tag-rangevalidate").html();
				return;
			} else {
				passedFields = passedFields + 1;
			}
		});
		if (passedFields > 1) {
			//Venda.Widget.Search.load("/search?" + Venda.Widget.Search.vars.SOLRParentRef + jQuery(this).serialize());
		}
	});
	/* end of FORM */
	
	/* SORT BY */
	jQuery("#sortby, #perpagedpd").live('change', function () {
		Venda.Widget.Search.scrollToResults();
		Venda.Widget.Search.vars.whatsSelected = document.getElementById('sortby').selectedIndex;
		// the sortby dropdown cannot show individual params to use refineParams, therefore load URL
		Venda.Widget.Search.sortLoadFix(this.options[this.selectedIndex].value);
	});
	/* end of SORT BY */
		
	/* REMOVE SEARCH */
	jQuery('.refinelist a.removesearch').live('click', function (event) {
		event.preventDefault();
		if((jQuery(this).attr("rel").split('=')[0] == "q") || (jQuery(this).attr("rel").split('=')[0] == "parentCategoryRef")) { location.href = "http://" + location.host + "/search?q=*"; } else {
			var preParamRemove = jQuery(this).attr("rel").split('=')[0];
			var postParamRemove = escape(jQuery(this).attr("rel").split('=')[1].replace("&amp;", "&").replace(/\s/g, '+'));
			newParams = "&" + preParamRemove + "=" + postParamRemove;
			Venda.Widget.Search.DeleteParams(preParamRemove + "=" + postParamRemove);
		}
	});
	/* end of REMOVE SEARCH */

 	jQuery.history.init(function(hash){
		var currentURL = "http://" + location.host + "/search"
		hash = hash.replace("!", "");
		
        if(hash == "") {
			if(Venda.Widget.Search.vars.firstLoad != 0) {
				Venda.Widget.Search.vars.refineParams = hash;
				if (Venda.Widget.Search.vars.SOLRParentRef == "") { currentURL = currentURL + location.search; } else { currentURL = currentURL + "?q=*" + Venda.Widget.Search.vars.SOLRParentRef; }
				Venda.Widget.Search.load(currentURL + hash, hash);
			}
        } else {
			Venda.Widget.Search.vars.refineParams = hash;
			if (Venda.Widget.Search.vars.SOLRParentRef == "") { currentURL = currentURL + location.search; } else { currentURL = currentURL + "?q=*"; }
			Venda.Widget.Search.load(currentURL + hash, hash);
        }
    },
    { unescape: "&?+=" });

	
	/* EXTRA */
	// refineImage
	Venda.Widget.Search.createClass();
	// refineRangeSlider for price
	Venda.Widget.Search.createSlider();
	// start AJAX reload with mask over results, supporting fast multiple clicks via refineParams
	// if not required, remove as far as 'end AJAX reload' and use non-ajax scripts above
	jQuery('#content-search').ajaxStart(function () {
		jQuery('#loadingsearch').removeClass('hide');
	});
	/* end of EXTRA */
		
});


Venda.Widget.Search.load = function (url, params) {
	//console.log("load: " + url);
	Venda.Widget.Search.vars.firstLoad = 1;
	jQuery('#loadingsearch').removeClass('hide');
	
	if (document.getElementById("parentCatRef")) {
		params = location.search + params;
		url = '?' + params.substr(1);
	}

	jQuery('#content-search').load(url + ' #content-search', function (response, status, xhr) {

		//Required for 'icat gift' pages expand-collapse functionality
		if(typeof ExpandCollapse != 'undefined') { ExpandCollapse(); }
	
		if(Venda.Widget.Search.vars.SOLRParentRef != '') {
			if(document.getElementById("q*")) { document.getElementById("q*").style.display = 'none'; }
		}
		
		var setSortSolr = function() {
			if(Venda.Widget.Search.vars.whatsSelected != null) {
				document.getElementById('sortby').options[Venda.Widget.Search.vars.whatsSelected].selected = 'selected';
			}
		}();

		if (status === "error") {
			//ajax error
			jQuery('#loadingsearch').addClass('hide');
			jQuery("#searchresults #response").html('<h2 class="error">' + jQuery('#tag-error').text() + xhr.status + ' ' + xhr.statusText + '</h2>');
		} else {
			//ajax success - re-run all the JS that is triggered onload/ready - will change per site, this is for showcase
			//if (jQuery('#tag-showviewall').text() === "1") {
				Venda.Widget.Search.viewAllRefinements();
				Venda.Widget.Search.createClass();
				Venda.Widget.Search.createSlider();
			//}
		}
			
	});
};

Venda.Widget.Search.EscapeAndFix = function (newParams) {
	var preParam = newParams.split('=')[0];;
	var postParam = escape(newParams.split('=')[1].replace("&amp;", "&").replace(/\s/g, '+'));
	newParams = preParam + "=" + postParam;
	return newParams;
};

Venda.Widget.Search.UpdateURL = function (newParams, pagnTrue) {
	//console.log("UpdateURL: " + newParams);
	if(newParams.charAt(0) != "&") newParams = "&" + newParams;
	
	var pagn = [-1, -1];
	var perpage = [-1, -1];
	
	var sort1 = [-1, -1, -1, -1];
	var sort2 = [-1, -1, -1, -1];
	
	var price1 = [-1, -1, -1, -1];
	var price2 = [-1, -1, -1, -1];
	
	if(Venda.Widget.Search.vars.refineParams.search("parentCategoryRef") == -1) Venda.Widget.Search.vars.refineParams += Venda.Widget.Search.vars.SOLRParentRef;
	
 	var urlSplitArr = newParams.split("&");
	var fixedURL = "";
	for(var i=0; i < urlSplitArr.length; i++) {
		if((urlSplitArr[i].search("setpagenum") != -1)) pagn[0] = i;
		if((urlSplitArr[i].search("perpage") != -1)) perpage[0] = i;
		
		
		if((sort1[0] == -1)) {
			if((urlSplitArr[i].search("sort") != -1)) { sort1[0] = i; }
		}
		if((sort1[1] == -1)) {
			if((urlSplitArr[i].search("order") != -1)) { sort1[1] = i; }
		}
		if((sort1[2] == -1) && (sort1[0] != -1)) {
			if((urlSplitArr[i].search("sort") != -1)) { sort1[2] = i; }
		}
		if((sort1[3] == -1) && (sort1[1] != -1)) {
			if((urlSplitArr[i].search("order") != -1)) { sort1[3] = i; }
		}

		
		
		if((urlSplitArr[i].search("price_from") != -1)) price1[0] = i;
		if((urlSplitArr[i].search("price_to") != -1)) price1[1] = i;
		if((urlSplitArr[i].search("minprice") != -1)) price1[2] = i;
		if((urlSplitArr[i].search("maxprice") != -1)) price1[3] = i;
	}
	
	var urlSplitArr2 = Venda.Widget.Search.vars.refineParams.split("&");
	var fixedURL2 = "";
	for(var i=0; i < urlSplitArr2.length; i++) {
		if((urlSplitArr2[i].search("setpagenum") != -1)) pagn[1] = i;
		if((urlSplitArr2[i].search("perpage") != -1)) perpage[1] = i;
		
		
		
		if((sort2[0] == -1)) {
			if((urlSplitArr2[i].search("sort") != -1)) { sort2[0] = i; }
		}
		if((sort2[1] == -1)) {
			if((urlSplitArr2[i].search("order") != -1)) { sort2[1] = i; }
		}
		if((sort2[2] == -1) && (sort2[0] != -1)) {
			if((urlSplitArr2[i].search("sort") != -1)) { sort2[2] = i; }
		}
		if((sort2[3] == -1) && (sort2[1] != -1)) {
			if((urlSplitArr2[i].search("order") != -1)) { sort2[3] = i; }
		}
		
		
		
		
		if((urlSplitArr2[i].search("price_from") != -1)) price2[0] = i;
		if((urlSplitArr2[i].search("price_to") != -1)) price2[1] = i;
		if((urlSplitArr2[i].search("minprice") != -1)) price2[2] = i;
		if((urlSplitArr2[i].search("maxprice") != -1)) price2[3] = i;
	}
	
	if((pagn[0] != -1) && (pagn[1] != -1) || (perpage[0] != -1) && (perpage[1] != -1)) {
		urlSplitArr2[pagn[1]] = urlSplitArr[pagn[0]];
		urlSplitArr2[perpage[1]] = urlSplitArr[perpage[0]];
		Venda.Widget.Search.vars.refineParams = "";
		for(var i=0; i < urlSplitArr2.length; i++) {
			if(i != 0) Venda.Widget.Search.vars.refineParams += "&" + urlSplitArr2[i];
		}
	} else {
		if((sort1[0] != -1) && (sort1[1] != -1) && (sort2[0] != -1) && (sort2[1] != -1)) {
			urlSplitArr2[sort2[0]] = urlSplitArr[sort1[0]];
			urlSplitArr2[sort2[1]] = urlSplitArr[sort1[1]];
			urlSplitArr2[sort2[2]] = urlSplitArr[sort1[2]];
			urlSplitArr2[sort2[3]] = urlSplitArr[sort1[3]];
			Venda.Widget.Search.vars.refineParams = "";
			for(var i=0; i < urlSplitArr2.length; i++) {
				if(i != 0) {
					Venda.Widget.Search.vars.refineParams += "&" + urlSplitArr2[i];
				}
			}
		} else {
			if(((price1[0] != -1) && (price1[1] != -1) || (price1[2] != -1) && (price1[3] != -1)) && ((price2[0] != -1) && (price2[1] != -1) || (price2[2] != -1) && (price2[3] != -1))) {
				urlSplitArr2[price2[0]] = urlSplitArr[price1[0]];
				urlSplitArr2[price2[1]] = urlSplitArr[price1[1]];
				urlSplitArr2[price2[2]] = urlSplitArr[price1[2]];
				urlSplitArr2[price2[3]] = urlSplitArr[price1[3]];
				Venda.Widget.Search.vars.refineParams = "";
				for(var i=0; i < urlSplitArr2.length; i++) {
					if(i != 0) {
						Venda.Widget.Search.vars.refineParams += "&" + urlSplitArr2[i];
					}
				}
			} else {
				Venda.Widget.Search.vars.refineParams += newParams
			}
		}
	}
	
	//if pagnTrue ==  true, set pagination to 1 
	var urlStr = location.search + location.hash;
	var isPagn = urlStr.search('setpagenum');
	if((pagnTrue == true) && (isPagn >= 0)) {
		var newPagnStr = '';
		var oldPagn = '';
		var resetPaginationArr = Venda.Widget.Search.vars.refineParams.split('&');
		for(var i = 0; i < resetPaginationArr.length; i++) {
			if(resetPaginationArr[i].search("setpagenum") >= 0) {
				oldPagn = 'setpagenum=' + resetPaginationArr[i].split('=')[1]
			}
		}
		if(oldPagn != '') { newPagnStr = Venda.Widget.Search.vars.refineParams.replace(oldPagn, 'setpagenum=1'); }
		else { oldPagn = Venda.Widget.Search.vars.refineParams; }
		jQuery.history.load("!" + newPagnStr);
	} else {
		jQuery.history.load("!" + Venda.Widget.Search.vars.refineParams);
	}
	
};


Venda.Widget.Search.DeleteParams = function (params) {

	if(params.search("price=") != -1) {
		var urlSplitArr = Venda.Widget.Search.vars.refineParams.split("&");
		for(var i=0; i < urlSplitArr.length; i++) {
			if((urlSplitArr[i].search("price_from") != -1)) urlSplitArr[i] = "";
			if((urlSplitArr[i].search("price_to") != -1)) urlSplitArr[i] = "";
			if((urlSplitArr[i].search("minprice") != -1)) urlSplitArr[i] = "";
			if((urlSplitArr[i].search("maxprice") != -1)) urlSplitArr[i] = "";
		}
		Venda.Widget.Search.vars.refineParams = "";
		for(var i=0; i < urlSplitArr.length; i++) {
			if(i != 0) {
				if(urlSplitArr[i] != "")	Venda.Widget.Search.vars.refineParams += "&" + urlSplitArr[i];
			}
		}
	} else {
		Venda.Widget.Search.vars.refineParams = Venda.Widget.Search.vars.refineParams.replace("&" + params, '');
	}
	jQuery.history.load("!" + Venda.Widget.Search.vars.refineParams);
};

// PAGN
Venda.Widget.Search.pagnLoadFix = function(url) {
	var urlSplitArr = url.split("&");
	var fixedURL = "";
	for(var i=0; i < urlSplitArr.length; i++) {
		if((urlSplitArr[i].search("setpagenum") != -1) || (urlSplitArr[i].search("perpage") != -1)) {
			fixedURL = fixedURL + "&" + urlSplitArr[i];
		}
	}
	//console.log("pagnLoadFixL " + fixedURL);
	Venda.Widget.Search.UpdateURL(fixedURL);
};

// PRICE
Venda.Widget.Search.priceLoadFix = function(url) {
 	var urlSplitArr = url.split("&");
	var fixedURL = "";
	for(var i=0; i < urlSplitArr.length; i++) {
		if((urlSplitArr[i].search("price_from") != -1) || (urlSplitArr[i].search("price_to") != -1) || (urlSplitArr[i].search("minprice") != -1) || (urlSplitArr[i].search("maxprice") != -1)) {
				fixedURL = fixedURL + "&" + urlSplitArr[i];
		}
	}
	Venda.Widget.Search.UpdateURL(fixedURL, true);
};

// SORT
Venda.Widget.Search.sortLoadFix = function(url) {
	var newUrl = url.replace(/^.*\?/,'');
	var urlSplitArr = newUrl.split("&");
	var fixedURL = "";
	for(var i=0; i < urlSplitArr.length; i++) {
		if((urlSplitArr[i].search("sort") != -1) || (urlSplitArr[i].search("order") != -1)) {
				fixedURL = fixedURL + "&" + urlSplitArr[i];
		}
	}
	Venda.Widget.Search.UpdateURL(fixedURL);
};


Venda.Widget.Search.scrollToResults = function () {
	if (!jQuery('a#content:in-viewport').length) {
		jQuery('html, body').animate({
				scrollTop : jQuery("#searchResults").offset().top
			}, 1000);
	}
}; 

Venda.Widget.Search.createSlider = function () {
	// applied to the price field
	var minprice = Math.floor(parseFloat(jQuery("#tag-minprice").text()));
	var maxprice = Math.ceil(parseFloat(jQuery("#tag-maxprice").text()));
	var from = Math.floor(parseFloat(jQuery("#tag-pricefrom").text()));
	var to = Math.ceil(parseFloat(jQuery("#tag-priceto").text()));
	var currency = jQuery("#tag-currsym").text();
	jQuery("#priceslider").slider({
			range : true,
			min : minprice,
			max : maxprice,
			values : [from, to],
			slide : function (event, ui) {
				jQuery("#pricerangevalues").text(currency + ui.values[0] + " - " + currency + ui.values[1]);
			},
			stop : function (event, ui) {
				jQuery("#price_from").val(ui.values[0]);
				jQuery("#price_to").val(ui.values[1]);
				//automatically submit the form - non-ajax reload version
				//document.pricerange.submit();
				//automatically submit the form - ajax reload version
				Venda.Widget.Search.scrollToResults();
				Venda.Widget.Search.priceLoadFix( jQuery("#pricerange").serialize());
			}
		});
	jQuery("#pricerangevalues").text(currency + jQuery("#priceslider").slider("values", 0) + ' - ' + currency + jQuery("#priceslider").slider("values", 1));
};
Venda.Widget.Search.createClass = function () { //to add a valid class using field type and value when no ref available
	jQuery(".refineImage div").each(function () {
			var facet = jQuery(this).attr("title");
			var facetclass = facet.replace(/[^a-zA-Z0-9]+/g, '');
			jQuery(this).addClass(facetclass.toLowerCase());
		});
};
Venda.Widget.Search.viewAllRefinements = function () {
	
	//toggles viewall/viewless refinement options using setting in A/E/D
	jQuery('.showviewall').each(function (index) {
			var terms = jQuery(this).find(".termtext");
			var viewallcount = jQuery("#tag-viewallcount").html();
			if (jQuery(terms).length > viewallcount) {
				jQuery(this).find(".termtext:last-child").after(jQuery("#tag-viewalllink").html());
				jQuery(this).find(".toggleviewall").addClass('toggleviewall' + index);
				jQuery(terms).each(function (index) {
						var indexcount = viewallcount - 1;
						if (index > indexcount) {
							jQuery(this).addClass('exceedsviewcount');
						}
					});
			}
			jQuery(this).find(".exceedsviewcount").wrapAll('<div id="viewall" class="viewall' + index + '" style="display:none"></div>');
			jQuery(".toggleviewall" + index).toggle(function () {
					jQuery(".viewall" + index).show();
					jQuery('.toggleviewall' + index).text(jQuery("#tag-viewlesstext").text());
				}, function () {
					jQuery(".viewall" + index).hide();
					jQuery('.toggleviewall' + index).text(jQuery("#tag-viewalllink").text());
				});
		});
};
 

/* jquery.viewport.js*/
(function($){$.belowthefold=function(element,settings){var fold=$(window).height()+$(window).scrollTop();return fold<=$(element).offset().top-settings.threshold;};$.abovethetop=function(element,settings){var top=$(window).scrollTop();return top>=$(element).offset().top+$(element).height()-settings.threshold;};$.rightofscreen=function(element,settings){var fold=$(window).width()+$(window).scrollLeft();return fold<=$(element).offset().left-settings.threshold;};$.leftofscreen=function(element,settings){var left=$(window).scrollLeft();return left>=$(element).offset().left+$(element).width()-settings.threshold;};$.inviewport=function(element,settings){return!$.rightofscreen(element,settings)&&!$.leftofscreen(element,settings)&&!$.belowthefold(element,settings)&&!$.abovethetop(element,settings);};$.extend($.expr[':'],{"below-the-fold":function(a,i,m){return $.belowthefold(a,{threshold:0});},"above-the-top":function(a,i,m){return $.abovethetop(a,{threshold:0});},"left-of-screen":function(a,i,m){return $.leftofscreen(a,{threshold:0});},"right-of-screen":function(a,i,m){return $.rightofscreen(a,{threshold:0});},"in-viewport":function(a,i,m){return $.inviewport(a,{threshold:0});}});})(jQuery);

/* jQuery history plugin */
(function($){var locationWrapper={put:function(hash,win){(win||window).location.hash=this.encoder(hash);},get:function(win){var hash=((win||window).location.hash).replace(/^#/,'');try{return $.browser.mozilla?hash:decodeURIComponent(hash);}
catch(error){return hash;}},encoder:encodeURIComponent};var iframeWrapper={id:"__jQuery_history",init:function(){var html='<iframe id="'+this.id+'" style="display:none" src="javascript:false;" />';$("body").prepend(html);return this;},_document:function(){return $("#"+this.id)[0].contentWindow.document;},put:function(hash){var doc=this._document();doc.open();doc.close();locationWrapper.put(hash,doc);},get:function(){return locationWrapper.get(this._document());}};function initObjects(options){options=$.extend({unescape:false},options||{});locationWrapper.encoder=encoder(options.unescape);function encoder(unescape_){if(unescape_===true){return function(hash){return hash;};}
if(typeof unescape_=="string"&&(unescape_=partialDecoder(unescape_.split("")))||typeof unescape_=="function"){return function(hash){return unescape_(encodeURIComponent(hash));};}
return encodeURIComponent;}
function partialDecoder(chars){var re=new RegExp($.map(chars,encodeURIComponent).join("|"),"ig");return function(enc){return enc.replace(re,decodeURIComponent);};}}
var implementations={};implementations.base={callback:undefined,type:undefined,check:function(){},load:function(hash){},init:function(callback,options){initObjects(options);self.callback=callback;self._options=options;self._init();},_init:function(){},_options:{}};implementations.timer={_appState:undefined,_init:function(){var current_hash=locationWrapper.get();self._appState=current_hash;self.callback(current_hash);setInterval(self.check,100);},check:function(){var current_hash=locationWrapper.get();if(current_hash!=self._appState){self._appState=current_hash;self.callback(current_hash);}},load:function(hash){if(hash!=self._appState){locationWrapper.put(hash);self._appState=hash;self.callback(hash);}}};implementations.iframeTimer={_appState:undefined,_init:function(){var current_hash=locationWrapper.get();self._appState=current_hash;iframeWrapper.init().put(current_hash);self.callback(current_hash);setInterval(self.check,100);},check:function(){var iframe_hash=iframeWrapper.get(),location_hash=locationWrapper.get();if(location_hash!=iframe_hash){if(location_hash==self._appState){self._appState=iframe_hash;locationWrapper.put(iframe_hash);self.callback(iframe_hash);}else{self._appState=location_hash;iframeWrapper.put(location_hash);self.callback(location_hash);}}},load:function(hash){if(hash!=self._appState){locationWrapper.put(hash);iframeWrapper.put(hash);self._appState=hash;self.callback(hash);}}};implementations.hashchangeEvent={_init:function(){self.callback(locationWrapper.get());$(window).bind('hashchange',self.check);},check:function(){self.callback(locationWrapper.get());},load:function(hash){locationWrapper.put(hash);}};var self=$.extend({},implementations.base);if($.browser.msie&&($.browser.version<8||document.documentMode<8)){self.type='iframeTimer';}else if("onhashchange"in window){self.type='hashchangeEvent';}else{self.type='timer';}
$.extend(self,implementations[self.type]);$.history=self;})(jQuery);
