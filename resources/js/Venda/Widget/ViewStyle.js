/**
* @fileoverview Venda.Widget.ViewStyle
 * Grid / List / Image View
 * Using the cookie to keep the current style
 * Cookie Name : setView
 * Cookie Value : grid / list / image  [default 'prodsGrid']
 * Cookie Name PerPage : setViewPerPage
 * Cookie PerPage Value : 16 - itemperpage [default '16']
 * Add class name as each the style (iconList, iconGrid, iconImage)
 * @author Arunee Keyourawong (May) <mayk@venda.com>
 * @edited Juanjo Dominguez <jdominguez@venda.com> (change class names to camel case convention, and changed "-on" suffix for "Active")
*/
Venda.namespace("Widget.ViewStyle");
var viewStyleCookieName = "setView";
var cookieNamePerPage = "setViewPerPage";
/**
* Set itemperpage for locayta search
// for solr there is no perpage parameter in the form!
*/
/*jQuery(function() {
	if((Venda.Ebiz.CookieJar.get(cookieNamePerPage)) && (document.formlocaytasearch)){
		document.formlocaytasearch.perpage.value = Venda.Ebiz.CookieJar.get(cookieNamePerPage);
	}
});*/
Venda.Widget.ViewStyle.getUrlParam = function(url,urlParam) {
	var re = new RegExp('[?&]'+urlParam+'=([^&]+)');
	var match = url.match(re);
	return match ? unescape(match[1]) : false;
};
Venda.Widget.ViewStyle.setCookieForViewStyle = function(){
	if(!Venda.Ebiz.CookieJar.get(viewStyleCookieName)){ 
		Venda.Ebiz.CookieJar.put(viewStyleCookieName,"Grid");
	}
	jQuery(".wrapper .viewProduct").click( function() {
		var view =  jQuery(this).html();
		var viewPath = jQuery(this).attr("href");
		var perPage = Venda.Widget.ViewStyle.getUrlParam(viewPath, 'setperpage') ||  Venda.Widget.ViewStyle.getUrlParam(viewPath, 'itemsperpage');
		Venda.Ebiz.CookieJar.put(cookieNamePerPage,perPage);
		Venda.Ebiz.CookieJar.put(viewStyleCookieName,view);
	});
	Venda.Widget.ViewStyle.addClassForViewStyle(viewStyleCookieName);	
};
Venda.Widget.ViewStyle.addClassForViewStyle = function(viewStyleCookieName){
	var getViewCookie = Venda.Ebiz.CookieJar.get(viewStyleCookieName);
	jQuery(".wrapper ul.prods").removeClass('prodsList prodsGrid prodsImage');
	jQuery(".wrapper ul.prods").addClass("prods"+getViewCookie);	
	jQuery(".wrapper .viewProduct").removeClass("iconListActive iconGridActive iconImageActive");
	jQuery(".wrapper .iconView .icon"+getViewCookie).addClass("icon"+getViewCookie+"Active");
	
};
/**
* Display Product Preview
*/
Venda.Widget.ViewStyle.showProductPreview = function(){
var timeoutHandle ="";
	var dialogOpts = {title: '', minHeight:433, width: 330,autoOpen: false, closeOnEscape: true, resizable: false, dialogClass: 'imgView'};
	jQuery("#productPreview").dialog(dialogOpts);
	
jQuery(".prodsImage .image a").mouseover(
	function(e){
	var id = this.id;	 
	var prodName = jQuery("#details-"+id+" h2").html();
	jQuery("#productPreview").dialog("option", "title", prodName);
	jQuery(".productPrice").html(jQuery("#details-"+id+" .price").html());
	jQuery(".productDesc").html(jQuery("#details-"+id+" .invtdesc2").html());
 	jQuery("#productPreview").dialog("open");
	jQuery(".imgView").hide();
	jQuery(".imgView").popupIframe();	
	jQuery(".productPreviewImage img").attr("src",jQuery("#details-"+id+" .imgSource").html());	
	timeoutHandle = setTimeout('jQuery(".imgView").show()',500);
	jQuery(".productPreviewArrow").removeClass("arrowLeft arrowRight arrowTop arrowBottom");			
		var offset=jQuery(this).offset();
		var W=jQuery(window).width();
		var H=jQuery(window).height();
		var w=jQuery(this).width();
		var h=jQuery(this).height();
		var Hw=jQuery(".imgView").width();
		var Hh=jQuery(".imgView").height();
		var left=offset.left;
		var top=offset.top;
		var T=offset.top;		
					
		if((W-left-w) > Hw){
			left=left+w;
			jQuery('.productPreviewArrow').addClass("arrowLeft");
		}else{
			left=left-Hw;
			jQuery('.productPreviewArrow').addClass("arrowRight");
		}
		if(top>Hh){
			top = (top - Hh) + h;
			jQuery('.productPreviewArrow').addClass("arrowBottom");
		}else{
			top=top;
			jQuery('.productPreviewArrow').addClass("arrowTop");
		}
		jQuery(".imgView").css({"left":left,"top":top});
	
 	 }).mouseout(
	 function(e){
		jQuery("#productPreview").dialog("close");
		clearTimeout(timeoutHandle);
		jQuery(".productPreviewImage img").attr("src","");	
	});
 };