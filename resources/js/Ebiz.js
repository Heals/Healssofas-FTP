//Declare namespace for ebiz
Venda.namespace("Ebiz");


//taken from page/swapimage_js
var imgTimeout = 0;

function swapImage(obj,target,event) {
	
	var e = window.event || event;

	function execute() { obj.src = target; };
	
	if(obj) {
		if (e.type == "mouseover") {
			imgTimeout = setTimeout(execute, 250);
		} else if (e.type == "mouseout") {
			clearTimeout(imgTimeout);
			execute()}
	}
}


// FROM ./templates/invt/productdetail/productdetail.html
jQuery(function () {
	Venda.Ebiz.initialDialog({
		createDialogList : '.emwbisLink, #tellafriend_link,
		closeDialogList : '#back_link',
		settings : {
			'width' : '500',
			'modal' : true
		}
	});
});

Venda.Ebiz.ExecuteDialogOpen = function() {

	// FROM ./templates/invt/emailinstock/emailinstock.html
	if(document.getElementById('JS-email-in-stock')) {
		jQuery("#emailmebackform").on("submit", function(e) { e.preventDefault(); return doValidate(); return false; });
		jQuery("#bisemail").keypress(function(event) {
			if (event.keyCode == "13") {
				return doValidate();
			}
		});
		
		var isPopup = document.getElementById('dialogContent');
		var attributeSku =  Venda.Ebiz.initialDialog.clickedElement.getAttribute('data-invtref') || Venda.Attributes.Get('atrsku') || document.getElementById("email-when-in-stock-invtref").innerHTML;
		var productName = document.getElementById("email-when-in-stock-invtname").innerHTML;

		if(typeof document.emailmebackform.bisemail != 'undefined'){
			if ((document.emailmebackform.bisemail.value.substring(0,1)=='<') || (document.emailmebackform.bisemail.value.substring(0,4)=='user')) {
				document.emailmebackform.bisemail.value='';
			}
		}

		var doValidate = function(){
			if (document.emailmebackform.bisemail.value == '') {
				alert(document.getElementById("email-when-in-stock-validation").innerHTML);
				document.emailmebackform.bisemail.focus();
				return false;
			}
			var checkEmail = document.emailmebackform.bisemail.value;
			if (!Venda.Ebiz.checkemail(checkEmail)) {
				alert(document.getElementById("email-when-in-stock-validation").innerHTML);
				document.emailmebackform.bisemail.focus();
				return false;
			}

			if(attributeSku != ""){
				document.emailmebackform.invtref.value = attributeSku;
			}
			if(isPopup){ 
				document.emailmebackform.layout.value = 'noheaders';
				jQuery("#emailmebackform").submitForm("#back_link");
			} else {
				document.emailmebackform.submit();
			}
			return;
		};
	}
	// EO FROM ./templates/invt/emailinstock/emailinstock.html
	
	// FROM ./templates/invt/tellafriend/tellafriend.html 
	
	var isPopup = document.getElementById('dialogContent');
	if(document.getElementById('JS-tell-a-friend')) {
		jQuery(".submitTellafriend").click(function(){
				if (document.tellafriendform.fname.value == '') {
					alert(document.getElementById('tell-a-friend-validation-fname').innerHTML);
					document.tellafriendform.fname.focus();
					return false;
				}
				if (document.tellafriendform.name.value == '') {
					alert(document.getElementById('tell-a-friend-validation-name').innerHTML);
					document.tellafriendform.name.focus();
					return false;
				}
				if (document.tellafriendform.email.value == '') {
					alert(document.getElementById('tell-a-friend-validation-email-address').innerHTML);
					document.tellafriendform.email.focus();
					return false;
					function ValidateEmail(inputText)  
{  
var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;  
if(inputText.value.match(mailformat))  
{  
document.form1.text1.focus();  
return true;  
}  
else  
{  
alert("You have entered an invalid email address!");  
document.form1.text1.focus();  
return false;  
}  
}
				}

				var checkEmail = document.tellafriendform.email.value;
					if (!Venda.Ebiz.checkemail(checkEmail)) {
					alert(document.getElementById('tell-a-friend-validation-valid-email-address').innerHTML);
					document.tellafriendform.email.focus();
					return false;
				}
				if (document.tellafriendform.field1.value == '') {
					alert(document.getElementById('tell-a-friend-validation-message').innerHTML);
					document.tellafriendform.field1.focus();
					return false;
				}
				
				if(isPopup){
					document.tellafriendform.layout.value = "noheaders";
					jQuery("#tellafriendform").submitForm("#back_link");
				}
				else { 
					document.tellafriendform.submit();
				}
		});
	}
	// EO FROM ./templates/invt/tellafriend/tellafriend.html 

}

// CHECKOUT.JS
// Links to: /templates/includes/contactDetails/contactDetails.html
/**
 * Split a string so it can be displayed on multiple lines so it does not break display layout - used on order confirmation and order receipt page
 * @param {string} strToSplit string that needs to be split
 * @param {Integer} rowLen length of row which will hold the string
 * @param {string} displayElem the html container which will display the splitted string
 */
Venda.Ebiz.splitString = function (strToSplit, rowLen, dispElem) {
	var stringlist = new Array();
	while (strToSplit.length > rowLen) {
		stringlist.push(strToSplit.slice(0, rowLen));
		strToSplit = strToSplit.substr(rowLen);
	}
	if (strToSplit.length) {
		stringlist.push(strToSplit);
	}
	document.getElementById(dispElem).innerHTML = stringlist.join('<br>');
};

//SEARCH.JS
// Links to: /templates/wizr/wz_orbt-screen/contact_address/contact_address.html
/**
 * A skeleton function for validating user extened fields - needs to be amended by the build team
 * @param {object} frmObj HTML form containing user extended field elements
 */
Venda.Ebiz.validateUserExtendedFields = function (frmObj) {
/*	if (frmObj) {
		if ((frmObj.usxtexample1.checked == false) && (frmObj.usxtexample2.checked == false) && (frmObj.usxtexample3.checked == false)) {
			alert("Please tick at least one checkbox");
			return false;
		}
		return true;
	}
	return false;
};*/

	if(frmObj){
			if(frmObj.usxthowhearus.value==""){
			alert("Please choose : Where did you hear about us?");
			frmObj.usxthowhearus.focus();
			return false;
			}
	
	}
	return true;
	
};

// NOT SURE YET
// Links to: /resources/js/Venda/Widget/RegionLangSwitch.js
// Links to: /resources/js/Venda/Widget/ViewStyle.js
// Links to: /templates/widgets/euRegionLanguage/euRegionLanguage.html
// Links to: /templates/widgets/usRegionLanguage/usRegionLanguage.html
Venda.Ebiz.CookieJar = new CookieJar({
		expires : 3600 * 24 * 7,
		path : '/'
	});

// NOT SURE YET
// Links to: /resources/js/Ebiz.js
// Links to: /resources/js/Venda/Widget/Compare.js
// Links to: /resources/js/Venda/Widget/MegaMenu.js
// Links to: /resources/js/Venda/Widget/QuickBuy.js
// Links to: /resources/js/Venda/Widget/RegionLangSwitch.js
// Links to: /resources/js/Venda/Widget/ViewStyle.js
jQuery.fn.popupIframe = function () {
	if (jQuery.browser.msie && jQuery.browser.version < "7.0") {
		html = '<iframe class="popupIframe" src="' + src + '" style="-moz-opacity: .10;filter: alpha(opacity=1);height:expression(this.parentNode.offsetHeight+\'px\');width:expression(this.parentNode.offsetWidth+\'px\');' + '"></iframe>';
		if (jQuery(this).find('.popupIframe').length == 0) {
			this.prepend(html);
		}
	}
};

// NOT SURE YET
// Links to: /resources/js/Ebiz.js
/**
 * simple popup
 */
Venda.Ebiz.doProtocal = function (url) {
	var protocal = document.location.protocol;
	if (url.indexOf("http:") == 0 && protocal == "https:") {
		url = url.replace("http:", "https:");
	}
	return url;
};

// NOT SURE YET
// Links to: /resources/js/Ebiz.js
// Links to: /templates/icat/productset/productset.html
// Links to: /templates/invt/emailinstock/emailinstock.html
// Links to: /templates/invt/package/package.html
// Links to: /templates/invt/productdetail/productdetail.html
// Links to: /templates/invt/productdetailMulti/productdetailMulti.html
// Links to: /templates/invt/productdetailPackage/productdetailPackage.html
// Links to: /templates/invt/productdetailSet/productdetailSet.html
// Links to: /templates/scat/productreviews/productreviews.html
Venda.Ebiz.initialDialog = function (dialogList) {
	var param = {
		createDialogList : '',
		closeDialogList : '',
		settings : ''
	}
	var options = jQuery.extend(param, dialogList);
	var popupWidth = '500';
	var popupHeight = 'auto';
	var popupClass = '';
	var anchorName = '';
	jQuery(options.createDialogList).click(function () {
		Venda.Ebiz.initialDialog.clickedElement = this;
		if (jQuery(this).attr("rel")) {
			var attrRel = jQuery(this).attr("rel").split(",");
			popupWidth = attrRel[0] || '500';
			popupHeight = attrRel[1] || 'auto';
			popupClass = attrRel[2];
			anchorName = attrRel[3];
		}
		jQuery(this).createDialog('dialogContent', {
			'width' : popupWidth,
			'height' : popupHeight
		}, options.closeDialogList, popupClass, anchorName);
		return false;
	});
};

// NOT SURE YET comes along with "Venda.Ebiz.initialDialog"
// Links to: /resources/js/Ebiz.js
Venda.Ebiz.dialogObject = '';
jQuery.fn.createDialog = function (selector, settings, closePopupId, dialogClassName, anchorName) {
	dialogClassName = dialogClassName + "Dialog";
	var dialogOpts = {
		autoOpen : false,
		closeOnEscape : true,
		resizable : false,
		width : 'auto',
		modal : true,
		dialogClass : dialogClassName,
		close : function () {
			dialogObj.dialog("destroy");
			dialogObj.remove();
		}
	}
	var H = jQuery(window).height();
	divObj = jQuery("<div>").attr("id", selector).appendTo("body");
	dialogObj = jQuery(divObj);
	/* popup object */
	dialogObj.dialog(dialogOpts);
	dialogObj.addClass("loadingImg");
	jQuery(".ui-dialog-titlebar").hide();
	for (var iSetting in settings) {
		dialogObj.dialog("option", iSetting, settings[iSetting]);
	};
	jQuery(".ui-dialog").popupIframe();
	dialogObj.dialog("open");
	
	var url = Venda.Ebiz.doProtocal(jQuery(this).attr("href"));
	dialogObj.load(url + "&layout=noheaders", function () {
		var setHeight = H - dialogObj.height();
		dialogObj.dialog("option", "position", setHeight);
		Venda.Ebiz.closeDialog(closePopupId);
		dialogObj.removeClass("loadingImg");
		jQuery(".ui-dialog-titlebar").show();
		if (anchorName) {
			jQuery(".toggleContent > h3." + anchorName).trigger('click');
		}
		
		Venda.Ebiz.ExecuteDialogOpen();

	});
	Venda.Ebiz.dialogObject = dialogObj;
	jQuery('.ui-widget-overlay').live('click', function () {
		dialogObj.dialog("close");
	});
	return false;
};

// NOT SURE YET
// Links to: /resources/js/Ebiz.js
Venda.Ebiz.closeDialog = function (closePopupId) {
	jQuery(closePopupId).click(function () {
		dialogObj.dialog("close");
		return false;
	});
};

// NOT SURE YET
// Links to: /page/contact/lang/en/1324366415_0.html
// Links to: /templates/invt/emailinstock/emailinstock.html
// Links to: /templates/invt/tellafriend/tellafriend.html
// Links to: /templates/invt/writereview/writereview.html
jQuery.fn.submitForm = function (closePopupId) {
	var obj = jQuery(this);
	obj.submit(function () {
		var URL = obj.attr('action');
		/* get target*/
		var params = obj.find("input, select, textarea").serialize();
		/* get the value from all input type*/
		jQuery.ajax({
			type : "POST",
			url : URL,
			dataType : "html",
			data : params,
			cache : false,
			/* do not cache*/
			error : function () {
				dialogObj.html('Error!');
			},
			success : function (data) {
				dialogObj.html(data);
				Venda.Ebiz.closeDialog(closePopupId);
			}
		});
		return false;
	});
};



// NOT SURE YET
// Links to: /resources/js/Ebiz.js
Venda.Ebiz.findPopUps = function () {
	var popups = document.getElementsByTagName("a");
	for (i = 0; i < popups.length; i++) {
		if (popups[i].rel.indexOf("popup") != -1) {
			// attach popup behaviour
			popups[i].onclick = Venda.Ebiz.doPopUp;
		}
	}
};

// NOT SURE YET
// Links to: /resources/js/Ebiz.js
// Links to: /page/signupforemails/lang/en/1273720905_0.html
// Links to: /templates/invt/emailinstock/emailinstock.html
// Links to: /templates/invt/tellafriend/tellafriend.html
// Links to: /templates/invt/writereview/writereview.html
// Links to: /templates/wizr/wz_orbt-screen/contact_address/contact_address.html
// Links to: /templates/wizr/wz_orzc-screen/singlestep_lookup/contact_address/contact_address.html
// Links to: /templates/wizr/wz_orzc-screen/singlestep_lookup/singlestep_lookup.html
/**
 *  Element - Email newsletter signup / EMWBIS
 */
Venda.Ebiz.checkemail = function (str) {
	var filter = /^\w+[\+\.\w-]*@([\w-]+\.)*\w+[\w-]*\.([a-z]{2,7}|\d+)$/i;
	return (filter.test(str))
};

// NOT SURE YET
// Links to: /templates/widgets/emailSignup/emailSignup.html
Venda.Ebiz.validateEmail = function (mail, msg) {
	if (Venda.Ebiz.checkemail(mail.email.value)) {
		mail.submit();
	} else {
		alert(msg);
		mail.email.focus();
	}
};

Venda.Ebiz.setTrclass = function(){

	var fl = document.getElementsByTagName('tr');
	var a; var sw=0;
	for(a=0;a<fl.length;a++){
		if(fl[a].className=='firstline'){
		    fl[a].className='';
			if(sw==0){sw=1; fl[a].id='firstline';}
			}
		}
};