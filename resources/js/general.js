function popup(url,width,height,name){
		if (width == null) width = 400;
		if (height == null) height = 425;
		if (name == null) name = "details";
		var props = "toolbar=no,location=no,status=no,scrollbars=yes,resizable=yes,titlebar=no,menubar=no,width="+width+",height="+height;
		w = window.open(url, name, props);
		if (w) {
		w.focus();
		}
}

function join(seperator, token) {
	newstring = "";
	for (i=0; i < token.length; i++) {
		if (i == 0) {
			newstring = token[i];
		} else {
			newstring = newstring + seperator + token[i];		
		}
	}
	return newstring;
	
}
function newBreadcrumb(id, reserve) {

	if (document.getElementById(id)) {
		var seperator = "&nbsp;&gt;&nbsp;";

		var browser_version = navigator.appName + " " + navigator.appVersion;
		
		var newtoken = new Array();
		var breadcrumb = document.getElementById(id);

		
		if (browser_version.indexOf('MSIE') != -1 && browser_version.indexOf('Mac') != -1 && browser_version.indexOf('5') != -1) {
			seperator = "&gt;";
		}
		if (browser_version.indexOf('Safari') != -1 && browser_version.indexOf('Mac') != -1 ) {
			seperator = "&gt;";
		}				
		
		var temptoken = breadcrumb.innerHTML.split(seperator);
		var a; var b; var token = new Array();
		var newindex = 0;
		for (i=0; i < temptoken.length; i++) {
			a=temptoken[i].indexOf(">");b=temptoken[i].lastIndexOf("<");
			token[i]=temptoken[i].slice(a+1,b); 
			if (token[i].indexOf(reserve)== -1 && token[i] != "" && token[i] != " " && token[i] != " " && token[i] != " " && token[i] != "  ") {
				newtoken[newindex] = temptoken[i]; 
				newindex=newindex+1;
			}
		}		
		newhtml = join(seperator, newtoken);
		breadcrumb.innerHTML = newhtml;
	} 	

}

//#############################################################
//   Start RT 76312	
//#############################################################

//###############################
//   Start  initial variables
//###############################
//	 Most of variables must be array because of Heals can have the multiple shipping addresses.
var oPostArray = new Array();						//		Keep postcode list from page.
var oShipArray = new Array();						//		Keep all ship methods.
var nAddr = 0;												//		Keep number of address
var allShipMethod = -1;									//		Keep number of ship method
var userPostCodeStem = new Array();			//		user's postcode stem matches with postcode format 1 - 5   ex.  W1 
var hasFuritem = new Array();						//		 True = has any furniture item, false = not found
var hasNormitem = new Array();						//		 True = has any normal item, false = not found
var validIndex = new Array();						//		Keep the index of postcode list array.  -1 = Not found means user's postcode stem is invalid. 
var validGTrate = new Array();						//		 Keep the delivery rate for order >= 1000
var validLTrate = new Array();						//		Keep the delivery rate for order < 1000
var prefPostList = new Array();						//		Keep the page ref - See getPrefPostList function in general.js for how to map the first character with the page ref.
var canOrderBoth;											//		Keep 2 values,  1 = can delivery the order >= 1000, 2 = can delivery the order < 1000
var canOrderGTDeliverFurItem = true;			//		true = can delivery the order >= 1000
var canOrderLTDeliverFurItem = true;			//		true = can delivery the order < 1000
var showDeliveryType = new Array();				//		Has 2 values, 1 = furniture, 2 = normal
var nShippingRate = 0;										//	   Use this number to match with the delivery band
var thisShippingName = new Array();				//		Keep the shipping method name ex. shipmethod_0 etc
var hasDefaultShipping = new Array();			//		true = there is a default delivery option of the package.
var resubmitShipID;											//		Keep the venda_pkrfnbr value
var sOrderType = new Array();						//		normonly = there is only the normal item, furonly = there is only the furniture item, mixorder = there are both the normal & furniture items.
var isFurnitureOrder = false;							//		true = entire order has at least one furniture package, false = there is no furniture package in the order.
var ohPackageSub = new Array();					//		Keep the sub total of each package.
var hasOnloadEvent = false;							//		check if there's any addEvent onload in the onload queue or not.
//###############################
//   End  initial variables
//###############################

//###############################
//   Start General functions
//###############################

// addEvent script from http://www.accessify.com/features/tutorials/the-perfect-popup/
function addEvent(elm, evType, fn, useCapture){if(elm.addEventListener){elm.addEventListener(evType, fn, useCapture);return true;}else if (elm.attachEvent){var r = elm.attachEvent('on' + evType, fn);return r;}else{elm['on' + evType] = fn;}}

function trimAll(sString) {
	while (sString.substring(0,1) == ' ') {
		sString = sString.substring(1, sString.length);
	}
	while (sString.substring(sString.length-1, sString.length) == ' ') {
		sString = sString.substring(0,sString.length-1);
	}
	return sString;
}

//   Using for append array data.
function pushArray(oArray, sPost, sGT, sLT) {
	if (oArray.push) {
		oArray.push(new PostCodeRec(sPost, sGT, sLT));
	}
	else {
		oArray[oArray.length] = new PostCodeRec(sPost, sGT, sLT);
	}
}

//###############################
//   End General functions
//###############################

//###############################
//   Start Data Structure
//###############################
function PostCodeRec(sPost, sGT, sLT)
{
  this.postcode = sPost;
  this.GTrate = sGT;
  this.LTrate = sLT;
}

function ShipMethodRec(nShipID, sShipMethod, sShipCheck, sShipName)
{
  this.shipid = nShipID;
  this.shipmethod = sShipMethod;
  this.shipcheck = sShipCheck;
  this.shipname = sShipName;
}

function UserPostRec(upostcode, upvalidtype, uispostvalid)
{
  this.postCode = upostcode;
  this.postValidType = upvalidtype;
  this.isPostValid = uispostvalid;
}
//###############################
//   End Data Structure
//###############################

//###############################
//   Start Mapping postcode
//###############################

function searchLinear(strKeyword, oArray ) {
	var vIndex = 0;												// 		Running index number
	var minArrIndex = 0;									//		Start index
	var maxArrIndex = oArray.length - 1;		  //	   End index
	var sTemp = '';											  //  temp string to keep the string from Array
	var foundS = false;									 //  True = match the keyword, false = not found
	
	vIndex = minArrIndex - 1;							// 	 Start vIndex with -1 
	while ( ( vIndex < maxArrIndex ) && ( !( foundS ) ) ) {
		 vIndex++;
		 sTemp = oArray[vIndex].postcode;
		 foundS = (strKeyword.toUpperCase() == sTemp.toUpperCase());
	}
	
	if (foundS) {
		return(vIndex);		// found postcode by keyword
	}
	else {
		return(-1);			// not found
	}
}

function getPrefPostList(upostcode) {
	var post4chars1 = /[a-b]/i;
	var post4chars2 = /[c-d]/i;
	var post4chars3 = /[e-h]/i;
	var post4chars4 = /[i-l]/i;
	var post4chars5 = /[m-o]/i;
	var post4chars6 = /[p-r]/i;
	var post4chars7 = /[s]/i;
	var post4chars8 = /[t-z]/i;
	
	var post3chars1 = /[a-c]/i;
	var post3chars2 = /[d-g]/i;
	var post3chars3 = /[h-l]/i;
	var post3chars4 = /[m-p]/i;
	var post3chars5 = /[q-s]/i;
	var post3chars6 = /[t-z]/i;
	
	var sfirstchar = upostcode.substring(0,1);
	
	if (upostcode.length == 4) {
		if (post4chars1.test(sfirstchar)) { return "post4chars_1"; }
		if (post4chars2.test(sfirstchar)) { return "post4chars_2"; }
		if (post4chars3.test(sfirstchar)) { return "post4chars_3"; }
		if (post4chars4.test(sfirstchar)) { return "post4chars_4"; }
		if (post4chars5.test(sfirstchar)) { return "post4chars_5"; }
		if (post4chars6.test(sfirstchar)) { return "post4chars_6"; }
		if (post4chars7.test(sfirstchar)) { return "post4chars_7"; }
		if (post4chars8.test(sfirstchar)) { return "post4chars_8"; }
	}
	else if (upostcode.length == 3) {
		if (post3chars1.test(sfirstchar)) { return "post3chars_1"; }
		if (post3chars2.test(sfirstchar)) { return "post3chars_2"; }
		if (post3chars3.test(sfirstchar)) { return "post3chars_3"; }
		if (post3chars4.test(sfirstchar)) { return "post3chars_4"; }
		if (post3chars5.test(sfirstchar)) { return "post3chars_5"; }
		if (post3chars6.test(sfirstchar)) { return "post3chars_6"; }
	}
	else {
		return "post2chars_all";
	}
}
//###############################
//   End Mapping postcode
//###############################

//###############################
//   Start Getting user's postcode stem
//###############################

function getUserPostCodeStem(upostcode) {
	upostcode = trimAll(upostcode);
	var vPostStem = upostcode;
	if (upostcode != '') {
		//    if user post code lenght > 3 = expect a correct formatted postcode
		if (upostcode.length > 3) {
			vPostStem = upostcode.substring(0, upostcode.length-3);
			vPostStem = trimAll(vPostStem);
		}
		else {
			//   postcode is not correct formatted.
			vPostStem = '';
		}
	}
	return vPostStem;
}

function checkPostCodeFormat(upostcode) {
	var postFormat1 = /[a-z][a-z][a-z][a-z]/i;		//  XXXX
	var postFormat2 = /[a-z][a-z][a-z][0-9]/i;	   //  XXX0
	var postFormat3 = /[a-z][a-z][0-9][0-9]/i;	   //  XX00
	var postFormat4 = /[a-z][a-z][0-9]/i;			//  XX0
	var postFormat5 = /[a-z][0-9][0-9]/i;			//  X00
	var postFormat6 = /[a-z][0-9]/i;				  //  X0

	var postValidType = 0;
	if (postFormat1.test(upostcode)) {
		postValidType = 1;
	}
	else if (postFormat2.test(upostcode)) {
		postValidType = 2;
	}
	else if (postFormat3.test(upostcode)) {
		postValidType = 3;
	}
	else if (postFormat4.test(upostcode)) {
		postValidType = 4;
	}
	else if (postFormat5.test(upostcode)) {
		postValidType = 5;
	}
	else if (postFormat6.test(upostcode)) {
		postValidType = 6;
	}
	return postValidType;
}

function checkPostValid(upostvalidtype) {
	if ( (upostvalidtype >= 1) && (upostvalidtype <= 6) ) {
		return true;
	}
	else {
		return false;
	}
}

function cutUnwatedChar(upostcode, ispvalid, pvalidtype) {
	var newUpostcode = upostcode;
	
	if (ispvalid) {
		switch (pvalidtype) { 
		case 1:
		case 2: 
		case 3:
			newUpostcode = upostcode.substring(0, 4);
			break; 
		case 4:
		case 5:
			newUpostcode = upostcode.substring(0, 3);
			break; 
		case 6: 
			newUpostcode = upostcode.substring(0, 2);
			break; 	  
		default : 
			newUpostcode = upostcode;
		}
	}
	return newUpostcode;
}

function getFinalUserPostStem(upostcode) {
	var userFullPostCodeStem = '';
	var userPostValidType = 0;
	var isUserPostValid;
	var finalPostStem = '';
	
	//	Get Full User's postcode stem
	userFullPostCodeStem = getUserPostCodeStem(upostcode);
	
	//	Get the valid type if the full user's postcode stem  matches 0 - 5 valid type
	userPostValidType = checkPostCodeFormat(userFullPostCodeStem);
	
	//	if User's postcode stem mactch 1 - 6, it means the user has a valid postcode stem
	isUserPostValid = checkPostValid(userPostValidType);
	
	//	Cutting unwanted characters from the valid postcode stem
	finalPostStem = cutUnwatedChar(userFullPostCodeStem, isUserPostValid, userPostValidType);
	
	return {userpostcode : finalPostStem , uservalidtype : userPostValidType , userispostvalid : isUserPostValid };
}

//###############################
//   End Getting user's postcode stem
//###############################

//###############################
//   Start Showing the delivery options
//###############################

function checkItemInCart(hasFur, hasNorm) {
	var sTemp = '';
	if ( (hasFur == 'no') && (hasNorm == 'yes') ) {
		//	there is only normal item  
		sTemp = 'normal';
	}
	else if ( (hasFur == 'yes') && (hasNorm == 'yes') ) {
		// 	there are both of normal item and furniture item. 
		sTemp = 'furniture';
	}
	else if ( (hasFur == 'yes') && (hasNorm == 'no') ) {
		//	there is only furniture item
		sTemp = 'furniture';
	}
	return sTemp;
}

function checkFurOrder(hasFur, hasNorm) {
	var sTemp = '';
	if ( (hasFur == 'no') && (hasNorm == 'yes') ) {
		//	there is only normal item  
		sTemp = 'normonly';
	}
	else if ( (hasFur == 'yes') && (hasNorm == 'yes') ) {
		// 	there are both of normal item and furniture item. 
		sTemp = 'mixorder';
	}
	else if ( (hasFur == 'yes') && (hasNorm == 'no') ) {
		//	there is only furniture item
		sTemp = 'furonly';
	}
	return sTemp;
}

function checkCanOrder(nIndex, nGTrate, nLTrate) {
	var canGT = true;
	var canLT= true;
	
	if (nIndex == -1) {
		canGT = false;
		canLT = false;
	}
	else {
		if (nGTrate.toLowerCase() == 'quote') {
			canGT = false;
		}
		if (nLTrate.toLowerCase() == 'quote') {
			canLT = false;
		}
	}
	return { canGT : canGT, canLT : canLT};
}

function showShippingMethod(objTableName, shipid, shipmethod, shipname, shipcheck, tdclass, sURL) {
	var sHTML1 = '';
	var sHTML2 = '';
	var oRow, oCell;
	
	sHTML1 += '<input class=radiobox type=radio name=shipmethod_' + shipid + ' value=' + shipmethod + ' id=' + shipmethod + shipid + ' ' + shipcheck + ' onClick=\'Step2(document.wizform,"confirm","","' +  shipid + '","changerate","","","_self","")\'  class=del_option> ';
	sHTML1 += '<label for=' + shipmethod + shipid + ' class=bold>';
	sHTML1 += shipname.replace("_",".");
	sHTML1 += '</label>';
	
	sHTML2 += '<a class="ship-details" href="#" onclick="popup(\'' + sURL + '?ex=co_disp-view&page=deliveryinformation&bsref=heals&layout=popups\',\'_blank\',\'location=0,toolbar=0,directories=0,status=0,menubar=0,scrollbars=1,resizable=1,width=620,height=600\'); return false;"><strong>delivery information</strong></a>&nbsp;';

    oRow = objTableName.insertRow(-1);
	oRow.className = "grey666";
	if ( (shipmethod =="expressdeliverygbp5_95") || (shipmethod =="saturdaydeliverygbp12_95") ) {
	oRow.className = "grey667";	
	}
	if (invtwunits =="Fragile"){
	jQuery(".grey667").hide();
	}
	oCell = oRow.insertCell(-1);
	oCell.className = tdclass;
	oCell.innerHTML = sHTML1;
	oCell = oRow.insertCell(-1);
	oCell.className = tdclass;
	oCell.align = "right";
	oCell.innerHTML = sHTML2;
}

function getFurnitureDeliveryRate(nrate) {
	var sFur = '';
	switch (nrate) {
		case '0' :
			sFur = 'freedelivery';
			break;
		case '35' :
			sFur = 'furnituredeliverygbp35_00';
			break;
		case '40' :
			sFur = 'furnituredeliverygbp40_00';
			break;
		case '50' :
			sFur = 'healsdeliveryservicegbp50';
			break;
		case '75' :
			sFur = 'furnituredeliverygbp75_00';
			break;
		case '120' :
			sFur = 'furnituredeliverygbp120_0';
			break;
		default :
			sFur = 'healsdeliveryservicegbp50';
	}
	return sFur;
}

function getTDClass(firstitem) {
	if (firstitem) {
		return 'first';
	}
	else { return 'bold'; }
}

//###############################
//   End Showing the delivery options
//###############################

//#############################################################
//   End RT 76312	
//#############################################################

var catbklist =  function(objlink,bkpref,bkicatref,iscategory) {
	var ref_cattree_1 = document.getElementById('ref_cattree_1').innerHTML;
	var ref_cattree_2 = document.getElementById('ref_cattree_2').innerHTML;
	var ref_cattree_3 = document.getElementById('ref_cattree_3').innerHTML;
	var ref_cattree_4 = document.getElementById('ref_cattree_4').innerHTML;
	var ref_cattree_5 = document.getElementById('ref_cattree_5').innerHTML;
	var ref_cattree_6 = document.getElementById('ref_cattree_6').innerHTML;
	var ref_cattree_7 = document.getElementById('ref_cattree_7').innerHTML;
	var bklist = document.getElementById('bklist').innerHTML;
	var prebklist = document.getElementById('prebklist').innerHTML;
	var checkcatparent = document.getElementById('checkcatparent').innerHTML;
	var checkcatstyle = document.getElementById('checkcatstyle').innerHTML;
	var url = new Array();
	var href=objlink.href;
	url = href.split("/icat/");
	prebklist=url[0];
	prebklist=prebklist+'/icat/';
	if (ref_cattree_2 == 'shop') { 
		bklisturl = objlink.href;
	}
	//	incattree -3 = shop means current bklist = bklist=icat,4,shop,diningroom,tableware (example)
	else if (ref_cattree_3 == 'shop') {
		//	if current cat is productlist AND click on categorylist
		if ((checkcatstyle == 'productlist') && (iscategory == 'categorylist')) {
			bklisturl = objlink.href;
		}
		//	if current cat is NOT productlist AND click on categorylist
		else {
			bklisturl = prebklist + bkicatref + '&bklist=icat,5,' + ref_cattree_3 + ',' + ref_cattree_2 + ',' + bkpref + ',' + bkicatref;
		}
	}
	//	incattree -4 = shop means current bklist = bklist=icat,5,shop,diningroom,tableware,heals_house (example)
	else if (ref_cattree_4 == 'shop'){
		//	if current cat is productlist AND click on productlist, so the icat should not be added.
		if ((checkcatstyle == 'productlist') && (iscategory == 'productlist')){
			bklisturl = prebklist + bkicatref + '&bklist=icat,5,' + ref_cattree_4 + ',' + ref_cattree_3 + ',' + bkpref + ',' + bkicatref;
		}
		//	it doesn't matter if current cat is productlist or categorylist, if click on categorylist, so the icat MUST be added 1.
		else {
			bklisturl = prebklist + bkicatref + '&bklist=icat,6,' + ref_cattree_4 + ',' + ref_cattree_3 + ',' + ref_cattree_2 + ',' + bkpref + ',' + bkicatref;
		}
	}
	//	incattree -5 = shop means current bklist = bklist=icat,6,shop,diningroom,tableware,heals_house,healshousearia (example)
	else if (ref_cattree_5 == 'shop') {
		//	if current cat is productlist AND click on productlist, so the icat should not be added.
		if ((checkcatstyle == 'productlist') && (iscategory == 'productlist')) {
			bklisturl = prebklist + bkicatref + '&bklist=icat,6,' + ref_cattree_5 + ',' + ref_cattree_4 + ',' + ref_cattree_3 + ',' + bkpref + ',' + bkicatref;
		}
		//	it doesn't matter if current cat is productlist or categorylist, if click on categorylist, so the icat MUST be added 1.
		else {
			bklisturl = prebklist + bkicatref + '&bklist=icat,7,' + ref_cattree_5 + ',' + ref_cattree_4 + ',' + ref_cattree_3 + ',' + ref_cattree_2 + ',' + bkpref + ',' + bkicatref;
		}
	}
	//	incattree -6 = shop means current bklist = bklist=icat,7,shop,bedroom,bedroomsale,bedroom_furniture_sale,bedroom_sale_ranges,aspenrange (example)
	else if (ref_cattree_6 == 'shop') {
		//	if current cat is productlist AND click on productlist, so the icat should not be added.
		if ((checkcatstyle == 'productlist') && (iscategory == 'productlist')) {
			bklisturl = prebklist + bkicatref + '&bklist=icat,7,' + ref_cattree_6 + ',' + ref_cattree_5 + ',' + ref_cattree_4 + ',' + ref_cattree_3 +',' + bkpref + ',' + bkicatref;
		}
		//	it doesn't matter if current cat is productlist or categorylist, if click on categorylist, so the icat MUST be added 1.
		else {
			bklisturl = prebklist + bkicatref + '&bklist=icat,8,' + ref_cattree_6 + ',' + ref_cattree_5 + ',' + ref_cattree_4 + ',' + ref_cattree_3 + ',' + ref_cattree_2 + ',' + bkpref + ',' + bkicatref;
		}
	}
	else {
		bklisturl = objlink.href;
	}
	location.href = bklisturl;
};

/*************************
existing function javascript above
************************/


//order confirmation and order receipt page - split the email address on the RHN if too long
function splitEmailAdd(usemail) {
	var stringlist = new Array();
	while (usemail.length > 30) {
	   stringlist.push( usemail.slice(0,30));
	   usemail=usemail.substr(30);
	}
	if (usemail.length) {
	  stringlist.push(usemail);
	}
	document.write(stringlist.join( '<br>' ));
}

// Variables for dynamic nav
turnonToggle = 1; //change this to 0 if you don't want to use toggling
// Bullet images
// change path to the desired location
shown = new Image();
shown.src = "/venda-support/images/bulleton.gif";
hidden = new Image();
hidden.src = "/venda-support/images/bulletoff.gif";
//following function to be removed when RT#98865 in stable
function dynamicContent(where,what) {
	// find out what tag the function is called from so the correct value is passed for url
	identifyTag = where.tagName;
	if (identifyTag == "A"){
		ajaxFunction(where+'&layout=noheaders&temp=subcategories',what);
		if (turnonToggle == 1){toggle(where);}
	} else if (identifyTag == "INPUT" || identifyTag == "SELECT") {
		ajaxFunction(where.value,what);
	}
};

//Description: Returns the value of a specified URL parameter 
//Parameters:
//1. currURL = this is the URL which you wish to get the URL parameter value from
//2. urlParam = this is the name of the URL parameter you want to get the value for
//Returns: value for parameter specified urlParam.
function grabURL(currURL,urlParam) {
	//find out a value where is passed from current url
	var url = unescape(currURL);
	var spliter = '&';
	var sField = spliter+urlParam+'=';
	
	if (url.search(sField) == -1) {               
		sField = '?'+urlParam+'=';         
	}
	
	var urlArray = url.split(sField);
	if (urlArray[1]) {
		//get url param value
		var paramArray = urlArray[1].split(spliter);
		return(paramArray[0]);
	}
}



function validateQty(iform){
var iNum = /\D/;
var qty = iform.qty;

    if(iNum.test(qty.value)==true){
        alert("Please enter numbers only");
        return false;
    }
    else if(qty.value < "1"){
        alert("Please enter numbers more than 0."); 
    }
    else{
         iform.submit();
    }		
}	

// This function is used for defaulting the quantity to 1 or to make the quantity positive incase the user enters it wrong by mistake
function qtyValidate(thisBox,item){
  var regExp = /\D/g;
  var nonNum= thisBox.value.match(regExp);

    if(item > 0) {
        if ((nonNum != null) && (nonNum.length > 0) || (thisBox.value == "")) {
             thisBox.value = item;       
        }
    }else{
        if ((nonNum != null) && (nonNum.length > 0) || (thisBox.value == 0)) {
            thisBox.value = 1;        
        }
    }

}  