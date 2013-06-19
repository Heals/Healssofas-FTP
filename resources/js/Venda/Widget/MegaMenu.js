/**
* @fileoverview Venda.Widget.Megamenu
 * Megamenu.js provides the functionality required to generate Static and Dynamic menus for the tp navigation
 * Documentation: https://vendadocs.onconfluence.com/x/1YFH
 *
 * @author Juanjo Dominguez <juanjodominguez@venda.com>
*/

//create namespace for MegaMenu
Venda.namespace('Widget.MegaMenu');

Venda.Widget.MegaMenu.mmContainerWidth = function () {
    /* by default it calculates the width for the container UL */
    var newWidth = 0;
    /* edit this value if the right edge is not the container UL's */
    var maxUlWidth = 0;
    if (newWidth > 0) {
        maxUlWidth = newWidth;
    } else {
        maxUlWidth = parseFloat(jQuery("ul#mm_ul").width());
    }
    return maxUlWidth;
};

Venda.Widget.MegaMenu.mmTouch = function (element) {

    var that = element;

    jQuery("ul#mm_ul li .mm_sub:visible").removeClass('mm_liSelected').stop().fadeTo('fast', 0, function () {
            jQuery(this).hide();
        });

    jQuery(".mm_liSelected").removeClass('mm_liSelected');

    jQuery(that).parent().toggleClass("mm_liSelected");

    var checkWidthClass = 0;

    if (jQuery(that).parent().find(".mm_row").length > 0) {
        var classListRow = jQuery(that).parent().find(".mm_sub").attr('class').split(/\s+/);
        jQuery.each(classListRow, function (index, item) {
                itemStr = item.substr((item.length - 6), 6);
                if (itemStr == '_width') {
                    checkWidthClass = parseInt(item);
                }
            });
    } else {
        if (jQuery(that).parent().find(".mm_sub").length > 0) {
            var classListSub = jQuery(that).parent().find(".mm_sub").attr('class').split(/\s+/);
            jQuery.each(classListSub, function (index, item) {
                    itemStr = item.substr((item.length - 6), 6);
                    if (itemStr == '_width') {
                        checkWidthClass = parseInt(item);
                    }
                });
        }
    }

    jQuery(that).parent().find(".mm_sub").stop().fadeTo('fast', 100).show();

    if (checkWidthClass == 0) {
        (function (jQuery) {
                jQuery.fn.calcSubWidth = function () {
                    rowWidth = 0;
                    jQuery(that).parent().find("ul").each(function () {
                            rowWidth += jQuery(this).width();
                        });
                };
            })(jQuery);

        if (jQuery(that).parent().find(".mm_row").length > 0) {
            var biggestRow = 0;
            jQuery(that).parent().find(".mm_row").each(function () {
                    jQuery(this).calcSubWidth();
                    if (rowWidth > biggestRow) {
                        biggestRow = rowWidth;
                    }
                });
            jQuery(that).parent().find(".mm_sub").css({
                    'width' : biggestRow
                });
            offset = jQuery(that).parent().position();
            if ((offset.left + biggestRow) > (Venda.Widget.MegaMenu.mmContainerWidth())) {
                jQuery(that).parent().addClass("mm_left");
            }
            jQuery(that).parent().find(".mm_row:last").css({
                    'margin' : '0',
                    'padding-bottom' : '0',
                    'border-bottom' : 'none'
                });

        } else {
            jQuery(that).parent().calcSubWidth();
            jQuery(that).parent().find(".mm_sub").css({
                    'width' : rowWidth
                });
            offset = jQuery(that).parent().position();
            if ((offset.left + rowWidth) > (Venda.Widget.MegaMenu.mmContainerWidth())) {
                jQuery(that).parent().addClass("mm_left");
            }
        }
    } else {
        /* in case .mm_sub width is set */
        jQuery(that).parent().find(".mm_sub").css({
                'width' : checkWidthClass
            });
        offset = jQuery(that).parent().position();
        if ((offset.left + checkWidthClass) > (Venda.Widget.MegaMenu.mmContainerWidth())) {
            offset.right = Venda.Widget.MegaMenu.mmContainerWidth() - jQuery(that).parent().outerWidth() - offset.left;
            if ((offset.left + jQuery(that).parent().outerWidth()) < checkWidthClass) {
                jQuery(that).parent().find(".mm_sub").css({
                        "right" :  - (offset.right),
                        "left" : "0 !important"
                    });
            } else {
                jQuery(that).parent().addClass("mm_left");
            }
        }
    }

    /* do not show if there is no sub category */
    if (jQuery(that).parent().find(".mm_sub li").length == 0) {
        jQuery(".mm_sub").removeClass('mm_liSelected').stop().fadeTo('fast', 0, function () {
                jQuery(that).parent().hide();
            });
    }
};

Venda.Widget.MegaMenu.mmHover = function () {
    jQuery("ul#mm_ul li .mm_sub:visible").removeClass('mm_liSelected').stop().fadeTo('fast', 0, function () {
            jQuery(this).hide();
        });
    jQuery(this).toggleClass("mm_liSelected");

    var checkWidthClass = 0;

    if (jQuery(this).find(".mm_row").length > 0) {
        var classListRow = jQuery(this).find(".mm_sub").attr('class').split(/\s+/);
        jQuery.each(classListRow, function (index, item) {
                itemStr = item.substr((item.length - 6), 6);
                if (itemStr == '_width') {
                    checkWidthClass = parseInt(item);
                }
            });
    } else {
        if (jQuery(this).find(".mm_sub").length > 0) {
            var classListSub = jQuery(this).find(".mm_sub").attr('class').split(/\s+/);
            jQuery.each(classListSub, function (index, item) {
                    itemStr = item.substr((item.length - 6), 6);
                    if (itemStr == '_width') {
                        checkWidthClass = parseInt(item);
                    }
                });
        }
    }

    jQuery(this).find(".mm_sub").stop().fadeTo('fast', 100).show();

    if (checkWidthClass == 0) {
        (function (jQuery) {
                jQuery.fn.calcSubWidth = function () {
                    rowWidth = 0;
                    jQuery(this).find("ul").each(function () {
                            rowWidth += jQuery(this).width();
                        });
                };
            })(jQuery);

        if (jQuery(this).find(".mm_row").length > 0) {
            var biggestRow = 0;
            jQuery(this).find(".mm_row").each(function () {
                    jQuery(this).calcSubWidth();
                    if (rowWidth > biggestRow) {
                        biggestRow = rowWidth;
                    }
                });
            jQuery(this).find(".mm_sub").css({
                    'width' : biggestRow
                });
            offset = jQuery(this).position();
            if ((offset.left + biggestRow) > (Venda.Widget.MegaMenu.mmContainerWidth())) {
                jQuery(this).addClass("mm_left");
            }
            jQuery(this).find(".mm_row:last").css({
                    'margin' : '0',
                    'padding-bottom' : '0',
                    'border-bottom' : 'none'
                });

        } else {
            jQuery(this).calcSubWidth();
            jQuery(this).find(".mm_sub").css({
                    'width' : rowWidth
                });
            offset = jQuery(this).position();
            if ((offset.left + rowWidth) > (Venda.Widget.MegaMenu.mmContainerWidth())) {
                jQuery(this).addClass("mm_left");
            }
        }
    } else {
        /* in case .mm_sub width is set */
        jQuery(this).find(".mm_sub").css({
                'width' : checkWidthClass
            });
        offset = jQuery(this).position();
        if ((offset.left + checkWidthClass) > (Venda.Widget.MegaMenu.mmContainerWidth())) {
            offset.right = Venda.Widget.MegaMenu.mmContainerWidth() - jQuery(this).outerWidth() - offset.left;
            if ((offset.left + jQuery(this).outerWidth()) < checkWidthClass) {
                jQuery(this).find(".mm_sub").css({
                        "right" :  - (offset.right),
                        "left" : "0 !important"
                    });
            } else {
                jQuery(this).addClass("mm_left");
            }
        }
    }

    if (jQuery.browser.msie && /6.0/.test(navigator.userAgent)) {
        if (jQuery(this).find(".mm_sub").length > 0) {
            var src = 'javascript:false;';
            var height = jQuery(this).find(".mm_sub").outerHeight();
            var width = jQuery(this).find(".mm_sub").outerWidth();
            var offset = jQuery(this).find(".mm_sub").position();

            html = '<iframe class="popupIframe" src="' + src + '" style="-moz-opacity: .10;filter: alpha(opacity=1);height:' + height + 'px;width:' + width + 'px;"></iframe>';
            if (jQuery(this).find('.popupIframe').length == 0) {
                jQuery(this).prepend(html);
            }
            jQuery(this).find('.popupIframe').css({
                    "height" : height,
                    "width" : width
                });
            jQuery(this).find('.popupIframe').css({
                    "right" : offset.right,
                    "left" : offset.left
                });
            jQuery(this).find('.popupIframe').css({
                    "top" : offset.top
                });
        }
    }
    /* do not show if there is no sub category */
    if (jQuery(this).find(".mm_sub li").length == 0) {
        jQuery(".mm_sub").removeClass('mm_liSelected').stop().fadeTo('fast', 0, function () {
                jQuery(this).hide();
            });
    }
};

Venda.Widget.MegaMenu.mmOut = function () {
    jQuery(this).toggleClass("mm_liSelected");
    jQuery(this).find(".mm_sub").stop().fadeTo('fast', 0, function () {
            jQuery(this).hide();
        });
    if (jQuery.browser.msie && /6.0/.test(navigator.userAgent)) {
        if (jQuery('.popupIframe').length > 0) {
            jQuery(this).find('.popupIframe').css({
                    "height" : "0"
                });
        }
    }
};

var config = {
    sensitivity : 20,
    /* number = sensitivity threshold (must be 1 or higher) */
    interval : 200,
    /* number = milliseconds for onMouseOver polling interval */
    over : Venda.Widget.MegaMenu.mmHover,
    /* function = onMouseOver callback (REQUIRED) */
    timeout : 200,
    /* number = milliseconds delay before onMouseOut */
    out : Venda.Widget.MegaMenu.mmOut/* function = onMouseOut callback (REQUIRED) */
};

jQuery(document).ready(function () {
    jQuery("ul#mm_ul li .mm_sub").css({ 'opacity' : '0' });

    if (typeof is_touch_device == 'function' && is_touch_device()) {

        var $navLinksWithChildren = jQuery("ul#mm_ul > li > a").next('.mm_sub').prev('a');

        $navLinksWithChildren.bind({
            click: function(e) {
                e.preventDefault();return false;},
            touchstart: function(e) {
                e.preventDefault();return false;},
            touchend: function(e) {
                if (jQuery(this).parent().hasClass('mm_liSelected')) {
                    window.location = jQuery(this).attr("href");
                }
                else {
                    e.preventDefault();

                    Venda.Widget.MegaMenu.mmTouch(this);return false;
                }
            },
            touchmove: function(e) {
                e.preventDefault();return false;},
            touchcancel: function(e) {
                e.preventDefault();return false;}
        });
    }
    else {

        jQuery("ul#mm_ul > li").hoverIntent(config);

        jQuery("ul#mm_ul li a").focus(function (e) {
        jQuery(this).parent().trigger("mouseover");
        });
        jQuery("ul#mm_ul li a").focusout(function (e) {
        jQuery(this).parent().trigger("mouseout");
        });
    }
});