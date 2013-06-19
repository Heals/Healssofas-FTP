//Declare namespace for sitewide
Venda.namespace("sitewide");

/**
* To show view all/view less toggle
* @param {object} targetId HTML id will be used for show/hide toggle
*/
Venda.sitewide.toggle = function (targetId){
	var target = document.getElementById(targetId);
	if (target.style.display == "none"){
		target.style.display = "";
	} else {
		target.style.display = "none";
	}
};

/**
* To change view all/view less text
* @param {object} swapId HTML id containing a current text
*/
Venda.sitewide.swapText = function (swapId){
	var linktarget = document.getElementById(swapId);
	var viewall = document.getElementById("tag-refineviewall").innerHTML;
	var viewless = document.getElementById("tag-refineviewless").innerHTML;
	
	if (linktarget.innerHTML == viewall){
		linktarget.innerHTML = viewless;
	} else {
		linktarget.innerHTML = viewall;
	}
};

//Below 2 Functions to limit text input - used in gift wrap screen
function TrackCount(fieldObj,countFieldName,maxChars){
	var countField = eval("fieldObj.form."+countFieldName);
	var diff = maxChars - fieldObj.value.length;
	
	// Need to check & enforce limit here also in case user pastes data
	if (diff < 0){
	  fieldObj.value = fieldObj.value.substring(0,maxChars);
	  diff = maxChars - fieldObj.value.length;
	}
	countField.value = diff;
};
function LimitText(fieldObj,maxChars){
	var result = true;
	if (fieldObj.value.length >= maxChars) {
		result = false;
		alert('Please limit the text ' + maxChars+ ' characters.');	
	}
	if (window.event)
	window.event.returnValue = result;
	return result;
};

//store locator validation
function checkPostcode(formObj,fieldObj,textMsg) {
	var formObj = "document." + formObj;
	var formObjField = formObj + "." + fieldObj + ".value";
	formObjField = eval(formObjField);
	if ((formObjField == textMsg) || (formObjField == "")) {
		alert("Please enter the full postcode.");
		return false;
	}
	else {
		formObj = eval(formObj)
		formObj.submit();
	}
};

//Element - Email newsletter signup / EMWBIS
function checkemail(str) {
	var filter =/^\w+[\+\.\w-]*@([\w-]+\.)*\w+[\w-]*\.([a-z]{2,7}|\d+)$/i;
	return (filter.test(str))
};

function validateEmail(mail,msg) {
	if (checkemail(mail.email.value)) {
		mail.submit();
	} else {
		alert(msg);
		mail.email.focus();
	}
};

function openNav(openicat,openicat2){
	if (typeof activateNav != 'undefined'){
		// default toggle if turnonToggle does not exist
		if (typeof turnonToggle === 'undefined') { var turnonToggle = 1; }
		// show first level subcategories
		if (openicat != "") {
			if (turnonToggle == 1) {
				showOrHide(1,openicat);
			}
			// show second level subcategories
			if (openicat2 != "") {
				if (turnonToggle == 1) {
					showOrHide(1,openicat2);
				}
			}
		}
	}
};

// addEvent script from http://www.accessify.com/features/tutorials/the-perfect-popup/
function addEvent(elm, evType, fn, useCapture){if(elm.addEventListener){elm.addEventListener(evType, fn, useCapture);return true;}else if (elm.attachEvent){var r = elm.attachEvent('on' + evType, fn);return r;}else{elm['on' + evType] = fn;}};

// erase recently viewed items cookie when user logs out
function eraseCookieIfLoggedOut(cookieName) {
	var urlParam = '';
	var loggedout = 4;
	urlStr = document.location.href.split('&');
	for (i=0; i<urlStr.length; i++) {
		var t = urlStr[i].split('=');
		if (t[0] == "log")	{
			urlParam = t[1];
		}
	}
	if (urlParam==loggedout) {
		//erase the cookie cookieName
		new CookieJar({path: '/'}).remove(cookieName);
	}
	return  urlParam;
};

addEvent(window, 'load', function() { eraseCookieIfLoggedOut("RVI") }, false);

// show element
  	 function showHidden(id,frameRef){
  	         if (frameRef) {
  	         //show in specified frame. Frame must have same parent
  	         var doc = parent.frames[frameRef].document;
  	         } else {
  	         //show in current frame
  	         var doc = document;
  	         }
  	         var ele = doc.getElementById(id);
  	         if (ele){
  	         ele.style.visibility = "visible";
  	         ele.style.display = "inline";
  	         }
  	 };
  	 //hide element
  	 function hideThis(id){
  	         var ele = document.getElementById(id);
  	         if (ele){
  	         ele.style.visibility = "hidden";
  	         ele.style.display = "none";
  	         }
  	 };