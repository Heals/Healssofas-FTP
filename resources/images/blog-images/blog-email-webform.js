function isEmail(emailAddress){
emailAddressValue=emailAddress.value.toLowerCase();
var countryTLDs=/^(ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|ca|cat|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cu|cv|cx|cy|cz|de|dj|dk|dm|do|dz|ec|ee|eg|eh|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sk|sl|sm|sn|so|sr|st|sv|sy|sz|tc|td|tf|tg|th|tj|tk|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|um|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|yu|za|zm|zw)$/;
var gTLDs=/^(aero|asia|biz|cat|com|coop|edu|geo|gov|info|int|jobs|mil|mobi|museum|name|net|org|post|pro|tel|travel)$/;
var basicAddress=/^(.+)@(.+)$/;
var specialChars='\\(\\)><@,;:\\\\\\\"\\.\\[\\]';
var validChars='\[^\\s'+specialChars+'\]';
var validCharset='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzöå0123456789\'-_.+';
var quotedUser='(\"[^\"]*\")';
var atom=validChars+'+';
var word='('+atom+'|'+quotedUser+')';
var validUser=new RegExp('^'+word+'(\.'+word+')*$');
var symDomain=new RegExp('^'+atom+'(\.'+atom+')*$');
var matchArray=emailAddressValue.match(basicAddress);
if(emailAddress.value==''||emailAddress==null){
return true;
}
if(matchArray==null){
alert('The Email address doesn\'t seem to be correct,\nplease check syntax.');
emailAddress.focus();
return false;
}else{
var user=matchArray[1];
var domain=matchArray[2];
for(i=0;i<user.length;i++){
if(validCharset.indexOf(user.charAt(i))==-1){
alert('The Email address contains invalid characters,\nplease check the username.');
emailAddress.focus();
return false;
}
}
for(i=0;i<domain.length;i++){
if(validCharset.indexOf(domain.charAt(i))==-1){
alert('The Email address contains invalid characters,\nplease check the domain.');
emailAddress.focus();
return false;
}
}
if(user.match(validUser)==null){
alert('The Email address doesn\'t seem to be correct,\nplease check the username.');
emailAddress.focus();
return false;
}
var atomPat=new RegExp('^'+atom+'$');
var domArr=domain.split('.');
var len=domArr.length;
for(i=0;i<len;i++){
if(domArr[i].search(atomPat)==-1){
alert('The Email address doesn\'t seem to be correct,\nplease check the domain name.');
emailAddress.focus();
return false;
}
}
if((domArr[domArr.length-1].length==2)&&(domArr[domArr.length-1].search(countryTLDs)==-1)){
alert('The Email address doesn\'t seem to be correct,\nplease check domain suffix.');
emailAddress.focus();
return false;
}
if((domArr[domArr.length-1].length>2)&&(domArr[domArr.length-1].search(gTLDs)==-1)){
alert('The Email address doesn\'t seem to be correct,\nplease check domain suffix.');
emailAddress.focus();
return false;
}
if((domArr[domArr.length-1].length<2)||(domArr[domArr.length-1].length>6)){
alert('The Email address doesn\'t seem to be correct,\nplease check domain suffix.');
emailAddress.focus();
return false;
}
if(len<2){
alert('The Email address doesn\'t seem to be correct,\nplease check missing hostname.');
emailAddress.focus();
return false;
}
}
return true;
}
String.prototype.trim = function() { return this.replace(/^\s*(\b.*\b|)\s*$/, "$1");	}
function mandatoryText(input,fieldName){
if(input.value.trim()==''||input==null){
alert('Please enter your '+fieldName+'.');
input.focus();
return false;
} else {
return true;
}
}
function validForm(){
if(!mandatoryText(document.getElementById('EMAIL_FIELD'), 'Email')) return;
if(!isEmail(document.getElementById('EMAIL_FIELD'))) return;
document.getElementById('emvForm').submit();
}