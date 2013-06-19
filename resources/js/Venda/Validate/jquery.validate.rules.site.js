// used for non-workflow and my account forms

jQuery(function() {

	jQuery(".emailSignup form").validate({
        rules: {
            email   : {
                required: true,
                email: true
            }
        },
        messages: {
            email   : {
                required    : Venda.Validate.msg.email,
                email       : Venda.Validate.msg.email_vaild
            }
        }
    });


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
        errorPlacement: function(error, element) {
            // hide normal message
           // jQuery('.validationMessage').text(jQuery(error).text());
        }
    });


    jQuery("#contactForm").validate({
        rules: {
            field1   : {
                required: true,
                email: true
            },
            field2   : {
                required: true
            },
            field3   : {
                required: true
            }
        },
        messages: {
            field1   : {
                required    : Venda.Validate.msg.email,
                email       : Venda.Validate.msg.email_vaild
            },
            field2   : {
                    required: Venda.Validate.msg.nametxt,
                    maxlength   : jQuery.format(Venda.Validate.msg.max_length + " {0}")
            },
            field3 : Venda.Validate.msg.message
        }
    });

    jQuery("#giftcertificatesform").validate({
        rules: {
            to      : {
                required: true,
                maxlength: 30
            },
            from    : {
                required: true
            },
            email: {
                required: true,
                email: true
            },
            comment : {
                rangelength: [0, 250]
            },
            amount : {
                required: true,
                number: true,
                range: [jQuery('#tag-invtatrminsubsell').text(), jQuery('#tag-invtatrmaxsubsell').text()]
            }
        },
        messages: {
            to      : {
                    required    : Venda.Validate.msg.to,
                    maxlength   : jQuery.format(Venda.Validate.msg.max_length + " {0}")
            },
            from    : Venda.Validate.msg.nametxt,
            email   : {
                required    : Venda.Validate.msg.email,
                email       : Venda.Validate.msg.email_vaild
            },
            comment : {
                rangelength : jQuery.format(Venda.Validate.msg.least + " {0} " + Venda.Validate.msg.least_two)
            },
            amount  : {
                number      : Venda.Validate.msg.number,
                range       : jQuery.format(Venda.Validate.msg.min_value + " {0} " + Venda.Validate.msg.max_value + " {1}")
            }
        }
    });

	jQuery("#addproductform").validate({
		errorPlacement: function(error, element) {}
	});		
});

jQuery('body').bind('quickview-loaded', function() {
	jQuery("#addproductform").validate({
		errorPlacement: function(error, element) {}
	});	
});

jQuery('body').bind('emailmebackform-loaded', function() {

    jQuery("#emailmebackform").validate({
        rules: {
            bisemail   : {
                required: true,
                email: true
            }
        },
        messages: {
            bisemail   : {
                required    : Venda.Validate.msg.email,
                email       : Venda.Validate.msg.email_vaild
            }
        },
        submitHandler: function() {
            Venda.Ebiz.ExecuteDialogOpen();
        }
    });

});


jQuery('body').bind('writereviewform-loaded', function() {

    jQuery("#writereviewform").validate({
        rules: {
            field1 : {
                required: true,
                maxlength: 150
            },
            from   : {
                required: true,
                email: true
            },
            field2  : {
                required: true,
                number: true
            },
            field6  : {
                required: true
            },
            field3  : {
                required: true
            }
        },
        messages: {
            field1   : {
                    required: Venda.Validate.msg.fname,
                    maxlength   : jQuery.format(Venda.Validate.msg.max_length+" {0}")
            },
            from   : {
                required    : Venda.Validate.msg.email,
                email       : Venda.Validate.msg.email_vaild
            },
            field2   : {
                    required: Venda.Validate.msg.phone
            },
            field6   : Venda.Validate.msg.rank,
            field3   : Venda.Validate.msg.review
        },
        submitHandler: function() {
            Venda.Ebiz.ExecuteDialogOpen();
        }
    });

});


jQuery('body').bind('tellafriendform-loaded', function() {

    jQuery("#tellafriendform").validate({
        rules: {
            fname   : {
                required: true,
                maxlength: 30
            },
            name   : {
                required: true,
                maxlength: 30
            },
            email   : {
                required: true,
                email: true
            },
            field1  : {
                required: true
            }
        },
        messages: {
            fname   : {
                    required: Venda.Validate.msg.fname,
                    maxlength   : jQuery.format(Venda.Validate.msg.max_length + " {0}")
            },
            name   : {
                    required: Venda.Validate.msg.to,
                    maxlength   : jQuery.format(Venda.Validate.msg.max_length + " {0}")
            },
            email   : {
                required    : Venda.Validate.msg.email,
                email       : Venda.Validate.msg.email_vaild
            },
            field1   : Venda.Validate.msg.message
        },
        submitHandler: function() {
            Venda.Ebiz.ExecuteDialogOpen();
        }
    });
});