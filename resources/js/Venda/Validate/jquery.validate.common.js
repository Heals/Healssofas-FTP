Venda.namespace('Validate');

jQuery.validator.setDefaults({
    'errorElement': 'span',
    'errorClass':   'validateError'
});

Venda.Validate.msg = {

                'title'                     : jQuery('#tag-validation_title').text(),
                'fname'                     : jQuery('#tag-validation_fname').text(),
                'lname'                     : jQuery('#tag-validation_lname').text(),
                'number'                    : jQuery('#tag-validation_number').text(),
                'country'                   : jQuery('#tag-validation_country').text(),
                'house_num'                 : jQuery('#tag-validation_house_num').text(),
                'addr1'                     : jQuery('#tag-validation_addr1').text(),
                'city'                      : jQuery('#tag-validation_city').text(),
                'state'                     : jQuery('#tag-validation_state').text(),
                'postcode'                  : jQuery('#tag-validation_postcode').text(),
                'postcode_populate'         : jQuery('#tag-validation_postcode_populate').text(),
                'postcode_dropdown'         : jQuery('#tag-validation_postcode_dropdown').text(),
                'phone'                     : jQuery('#tag-validation_phone').text(),
                'email'                     : jQuery('#tag-validation_email').text(),
                'email_vaild'               : jQuery('#tag-validation_email_vaild').text(),
                'password'                  : jQuery('#tag-validation_password').text(),
                'verify_password_length'    : jQuery('#tag-validation_verify_password_length').text(),
                'confirm_password'          : jQuery('#tag-validation_confirm_password').text(),
                'verify_password_match'     : jQuery('#tag-validation_verify_password_match').text(),
                'credit_card_number'        : jQuery('#tag-validation_credit_card_number').text(),
                'credit_card_name'          : jQuery('#tag-validation_credit_card_name').text(),
                'security_code'             : jQuery('#tag-validation_security_code').text(),
                'security_code_length'      : jQuery('#tag-validation_security_code_length').text(),
                'credit_card_expired'       : jQuery('#tag-validation_credit_card_expired').text(),
                'datenow'                   : jQuery('#tag-validation_datenow').text(),
                'search'                    : jQuery('#tag-validation_search').text(),
                'nametxt'                   : jQuery('#tag-validation_name').text(),
                'message'                   : jQuery('#tag-validation_message').text(),
                'to'                        : jQuery('#tag-validation_to').text(),
                'from'                      : jQuery('#tag-validation_from').text(),
                'max_length'                : jQuery('#tag-validation_maxLength').text(),
                'min_length'                : jQuery('#tag-validation_maxLength').text(),
                'max_value'                 : jQuery('#tag-validation_maxValue').text(),
                'min_value'                 : jQuery('#tag-validation_minValue').text(),
                'rank'                      : jQuery('#tag-validation_rank').text(),
                'review'                    : jQuery('#tag-validation_review').text(),
                'least'                     : jQuery('#tag-validation_least').text(),
                'least_two'                 : jQuery('#tag-validation_least_two').text(),
				'giftcert_code'             : jQuery('#tag-validation_giftcert_code').text(),
				'promo_code'                : jQuery('#tag-validation_promo_code').text()
        }


jQuery.validator.addClassRules("qty", {
	required: true,
	number: true,
	digits: true
});		
// A method that matches vendas app input rules
jQuery.validator.addMethod("vendainput", function(value, element) {

    var regx = new RegExp("^[a-zA-Z\d'. -]+$");

    return regx.test(value);

}, "Field must not contain extended characters");


jQuery.validator.addMethod("cardexpiry", function(value, element) {

    if (Venda.Validate.msg.datenow.split('/')[2] != jQuery(element).val()){
        jQuery("#month").rules("remove", "min");
    }
    else{
        jQuery("#month").rules("add", {
        min:  parseFloat(Venda.Validate.msg.datenow.split('/')[0])
    });
    }

    jQuery('form[name=ordersummaryform]').validate();
    jQuery('#year,#month').trigger('click');

    return true;

}, "cardexpiry rule has failed");


jQuery.validator.addMethod("populatedaddress", function(value, element) {

    if(jQuery('#addr1').val() !== '' || jQuery('select[name=zcdropdown]').is(':visible') || jQuery('#lookupBtn').is(':hidden')){
        return true;
    }
    else {
        return false;
    }

}, "Populate the address");

jQuery.validator.addMethod("customAlert", function(value, element) {

    if (value === ''){

        jQuery('.validationMessage').addClass('active').slideDown('slow');

        return false;

    }else {

        jQuery('.validationMessage').slideUp().removeClass('active');

        return true;
    }

}),'';

/**
* Removes the HTML5 required attribute so jQuery inline validation is used consistently
*/
jQuery(function() {
    jQuery('[required]').removeAttr('required');
    //jQuery('body').prepend("<p class='hide validationMessage error'>validationMessage div</p>");
});