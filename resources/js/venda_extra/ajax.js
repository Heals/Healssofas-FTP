// YUI Ajax, files required: yahoo-min.js, event-min.js, connection-min.js
ajaxFunction = function(url,whichDiv,formID,fnAfterLoading) {
var div = document.getElementById(whichDiv);

var AjaxObject = {
	handleSuccess:function(o){
		// Success handler
		div.innerHTML = o.responseText;
		// for customisable script to run after successful request
		if (fnAfterLoading!=undefined) {
			this.processResult(o); 
		}
	},
	handleFailure:function(o){
		// Failure handler
		div.innerHTML = "<p>Unable to load requested page : " + o.statusText + "</p>";
	},
	processResult:fnAfterLoading,
	startRequest:function() {
		if(formID != undefined){
			//if you supply a form ID the data with be sent as a POST transaction
			//setForm automatically harvests HTML form data
			var formObject = document.getElementById(formID);
			YAHOO.util.Connect.setForm(formObject);
			YAHOO.util.Connect.asyncRequest('POST', url, callback);
			YAHOO.util.Connect.resetFormState();
		}
		else {
		YAHOO.util.Connect.asyncRequest('GET', url, callback);
		}
	}
};

var callback =
{
	success:AjaxObject.handleSuccess,
	failure:AjaxObject.handleFailure,
	scope: AjaxObject
};

AjaxObject.startRequest();

};

/* use with ajaxFunction to load script */
insertScript = function(whichScript,whichDiv) {
	if (document.createElement) {
		var oScript = document.createElement("script");
		oScript.type = "text/javascript";
		oScript.src = whichScript;
		document.getElementById(whichDiv).appendChild(oScript);
	}
};