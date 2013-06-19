/**
* @fileoverview Venda.Widget.Touch
 * JS for Tablet (or any Touch) Devices.
 *
 * @author Juanjo Dominguez <juanjodominguez@venda.com>
*/

function is_touch_device() {  
  if ("ontouchstart" in document.documentElement)
    return true;
  else
    return false;
};

jQuery(document).ready(function() {
  if(is_touch_device()) {
    jQuery('.quickLinkBox').remove(); }
});