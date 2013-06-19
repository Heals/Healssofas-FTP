// Used for checkout and my account.

jQuery(function() {

    jQuery("#formsolrsearch").validate({
        rules: {
            q   : {
                required: true
            }
        },
        messages: {
            q   : {
                required    : Venda.Validate.msg.search
            }
        },
        errorPlacement: function(error, element) {}
    });

	 jQuery('form[name=multipledeliveryaddressesform]').validate({
	   errorPlacement: function(error, element) {}
	 });

	 jQuery('form[name=shopcartform]').validate({
	   errorPlacement: function(error, element) {}
	 });
    jQuery("form[name=ordersummaryform-giftcert]").validate({
        rules: {
            giftcode   : {
                required: true
            }
        },
        messages: {
            giftcode : Venda.Validate.msg.giftcert_code
        }
    });
    jQuery("form[name=promotionform]").validate({
        rules: {
            vcode   : {
                required: true
            }
        },
        messages: {
            vcode : Venda.Validate.msg.promo_code
        },
		submitHandler: function() {
			Venda.Ebiz.checkVoucherForm();
		}
    });
    jQuery("#existingcustomer").validate({
        rules: {
            email   : {
                required: true,
                email: true
            },
            password : {
                required: true
            }
        },
        messages: {
            email   : {
                required    : Venda.Validate.msg.email,
                email       : Venda.Validate.msg.email_vaild
            },
            password: Venda.Validate.msg.password
        }
    });

    jQuery("#reminderform").validate({
        rules: {
            usemail : {
                required: true,
                email: true
            }
        },
        messages: {
            usemail : {
                required    : Venda.Validate.msg.email,
                email       : Venda.Validate.msg.email_vaild
            }
        }
    });

    jQuery("#dtsform").validate({
        rules: {
            fname   : {
                required: true,
                maxlength: 30
            },
            lname   : {
                required: true,
                maxlength: 30            }
        },
        messages: {
            fname   : {
                    required: Venda.Validate.msg.fname
            },
            lname   : {
                    required: Venda.Validate.msg.lname
            }
        }
    });

    jQuery('form[name=billingaddressaddform],#tlusermyform form,form[name=addressbookform],form[name=billingaddresseditform],form[name=deliveryaddressaddform],form[name=deliveryaddresseditform]').validate({
        rules: {
            title   : {
                required: true
            },
            fname   : {
                required: true,
                maxlength: 30
            },
            lname   : {
                required: true,
                maxlength: 30
            },
            cntrylist   : {
                required: true
            },
            num : {
                required: true
            },
            addr1   : {
                required: true
            },
            city    : {
                required: true
            },
            state   : {
                required: true
            },
            zipc    : {
                required: true,
                populatedaddress: true
            },
            zcdropdown : {
                required: true
            },
            phone   : {
                required: true,
                number: true,
				maxlength: 20
            },
            usemail : {
                required: true,
                email: true
            },
            uspswd  : {
                required: true,
                minlength: 5,
                maxlength: 10
            },
            uspswd2 : {
                required: true,
                minlength: 5,
                maxlength: 10,
                equalTo: "#uspswd"
            }

        },
        messages: {
            title   : {
                    required: Venda.Validate.msg.title
            },
            fname   : {
                    required: Venda.Validate.msg.fname
            },
            lname   : {
                    required: Venda.Validate.msg.lname
            },
            cntrylist   : {
                    required: Venda.Validate.msg.country
            },
            addr1   : {
                    required: Venda.Validate.msg.addr1
            },
            city    : {
                    required: Venda.Validate.msg.city
            },
            state : {
                    required: Venda.Validate.msg.state
            },
            zipc    : {
                    required: Venda.Validate.msg.postcode,
                    populatedaddress: Venda.Validate.msg.postcode_populate
            },
            zcdropdown    : {
                    required: Venda.Validate.msg.postcode_dropdown
            },
            phone   : {
                    required: Venda.Validate.msg.phone
            },
            usemail : {
                    required: Venda.Validate.msg.email
            },
            uspswd  : {
                    required: Venda.Validate.msg.password,
                    minlength: Venda.Validate.msg.verify_password_minlength,
                    maxlength: Venda.Validate.msg.verify_password_maxlength
            },
            uspswd2 : {
                    required: Venda.Validate.msg.confirm_password,
                    equalTo: Venda.Validate.msg.verify_password_match
            }
        }
    });

    if (jQuery('form[name=ordersummaryform]').length > 0 ){

        Venda.Validate.paytypes();

        jQuery('input[name=ohpaytype]').click(function() {
            Venda.Validate.paytypes();
        });
    }

});


Venda.Validate.paytypes = function(){

    if (jQuery('#creditcard').is(':checked') === true){

        jQuery('form[name=ordersummaryform]').validate({
            rules: {
                ohccnum : {
                    required: true
                },
                ohccname : {
                    required: true,
					vendainput: true
                },
                month : {
                    required: true,
                    min:  parseFloat(Venda.Validate.msg.datenow.split('/')[0])
                },
                year : {
                    required: true,
                    cardexpiry: true
                },
                ohcccsc : {
                    required: true,
                    number: true,
                    rangelength: [3, 4]
                }
            },
            messages: {
                ohccnum : {
                    required    : Venda.Validate.msg.credit_card_number
                },
                ohccname: Venda.Validate.msg.credit_card_name,
                month : {
                    min: Venda.Validate.msg.credit_card_expired
                },
                year: {
                    cardexpiry: Venda.Validate.msg.credit_card_expired
                },
                ohcccsc : {
                    required    : Venda.Validate.msg.security_code,
                    rangelength : Venda.Validate.msg.security_code_length
                }
            }
        });

        jQuery('form[name=ordersummaryform]').validate().currentForm = jQuery('form[name=ordersummaryform]')[0];
    }
    else {
        var validatedform = jQuery('form[name=ordersummaryform]').validate();
        validatedform.resetForm();
        validatedform.currentForm = '';
    }

}