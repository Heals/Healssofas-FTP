/**
 * @fileoverview Venda.Widget.VBM
 * Venda Behavioural Merchandising (VBM) implements Avail functionality into VendaTemplates
 * Requires: jQuery 1.4+
 * Requires elements: #tag-invtref, #tag-basketitems, #tag-useremail, #tag-vbmtc, #tag-searchkeyword
 * Requires search results to be wrapped with class "searchresult" (and a hidden DIV within, with the class "vbmsearchsku" containing the SKU of each search result)
 * Requires VBM results to be wrapped with class "vmbproduct"
 * Requires VBM panel to be #vbm-panel
 * (optional) #tag-vbmmanualrecs DIV should contain a list of SKUs separated by a coma to override manual recommendations (e.g. sku1,sku2,sku3 )
 *
 * @author Juanjo Dominguez <juanjodominguez@venda.com>
 * @version 2.0
 */

Venda.namespace('Widget.VBM');

Venda.Widget.VBM.getFromURLHelper = function( match )
{
   /* Helper function to extract data from the URL */
   var url = window.location.search.substring(1);
   if ( url === '' ) { return ''; }
   var el = ( url.indexOf('&') < 0 ) ? url.split('?') : url.split('&');
   for ( var i = 0, l = el.length; i < l; i++ ) {
      var query = el[i].split('=');
      if ( query[0] === match ) {
         return query[1];
      }
   }
   return '';
};

/* "extraparameters" are exclusively Avail dynamic parameters, rarely used */
Venda.Widget.VBM.getRecommendations = function( where, extraparameters )
{
   /* "banner" is an Avail term for "template", I will use "banner" so the difference between Avail template and Venda template is clear */
   var banner,
       input = '',
       dynamicparameters = (extraparameters) ? extraparameters : '',
       trackingcode = Venda.Widget.VBM.getFromURLHelper('VBMTC'), /* Put the tracking code (if available) into a variable */
       vbmcookie = new CookieJar({ expires: '', path: '/' }),
       /* We will need this regardless of where we are showing VBM recommendations, Emark(true) enables fetch URL to be printed to __avail_log__ DIV for debugging */
       emark = ( document.getElementById('__avail_log__') ) ? new Emark(true) : new Emark();
   /* Different behaviour depending on which area we are showing VBM recommendations: productdetail, search, basket, myaccount */
   switch( where ) {
      case 'productdetail' :
         var currentsku = jQuery('#tag-invtref').text();
         /* add the search term to a hidden input fields, so it gets sent by Form's GET request */
         if( Venda.Widget.VBM.getFromURLHelper('VBMST') != '' )
         {
			jQuery('#VBMSTinput').attr('value', Venda.Widget.VBM.getFromURLHelper('VBMST'));
         }
         /* add the tracking code to a hidden input fields, so it gets sent by Form's GET request */
         if( Venda.Widget.VBM.getFromURLHelper('VBMTC') != '' )
         {
			jQuery('#VBMTCinput').attr('value', Venda.Widget.VBM.getFromURLHelper('VBMTC'));
         }
         /* URL contains tracking code, e.g. VBMTC=2fc4430cf1, if so, logClickedOn happens */
         if( trackingcode !== '' && jQuery('#tag-vbminvtaddedtocart').text() == '' && Venda.Widget.VBM.getFromURLHelper('mode') != 'addmul')
         {
            emark.logClickedOn( currentsku, trackingcode );
         }
         /* if tag-vbminvtaddedtocart has something, it means an item has been added to basket, therefore we call   */
         
		 if( jQuery('#tag-vbminvtaddedtocart').text() != '' || Venda.Widget.VBM.getFromURLHelper('mode') == 'addmul' )
         {
		 
			Venda.Widget.VBM.logAddedToCart(currentsku);
            /* URL contains search query, e.g. VBMST=jacket, if so, saveSearch happens, last condition is true if no AJAX add to basket is present */
            if( Venda.Widget.VBM.getFromURLHelper('VBMST') != '' || Venda.Widget.VBM.getFromURLHelper('VBMSTinput') != '' )
            {
				Venda.Widget.VBM.saveSearch(currentsku);
            }
         }
         banner = 'ProductDetailRecs';
         input = [ 'ProductId:' + currentsku ];
      break;
      case 'search' :
         var currentsearch = jQuery('#tag-searchkeyword').text();
         if ( currentsearch == '*' )
            currentsearch = jQuery('.categoryname').text();
         banner = 'SearchResultRecs';
         input = [ 'Phrase:' + currentsearch ];
      break;
      case 'basket' :
         var currentbasketitems = jQuery('#tag-basketitems').text().split(',');
         currentbasketitems.pop();
         banner = 'ShoppingCartRecs';
         input = [ 'ProductIds:' + currentbasketitems ];
         /* get the SKU of the item that has been removed if it exists */
         removedfromcart = jQuery('#tag-vbmremovedfromcart').text();
         if( removedfromcart != '' )
            Venda.Widget.VBM.logRemovedFromCart( removedfromcart );
      break;
      case 'myaccount' :
         var userid = jQuery('#tag-useremail').text().replace('@','_AT_').replace(/\./g,'_DOT_');
         banner = 'UserRecs';
         input = [ 'UserId:' + userid ];
      break;
   }
   var products = emark.getRecommendations(banner, input, dynamicparameters);
   emark.commit(function()
   {
      var productsToCookie = [],
          manualrecs = jQuery('#tag-vbmmanualrecs').text(),
		  skip = 0;
      if ( manualrecs != '' ) {
         /* hijack the cookie and insert manual recommendations */
         manualrecs = manualrecs.split(',');
         productsToCookie =  productsToCookie.concat(manualrecs);
         for( var i = 0, l = products.values.length; i < l; i++ )
         {
            var found = 'true';
            for( var j = 0, m = manualrecs.length; j < m; j++ )
            {
               if( manualrecs[j] != products.values[i] )
               {
                  found = 'false';
               }
               else
               {
                  found = 'true';
                  break;
               }
            }
            if( found === 'false' ) {
               productsToCookie.push( products.values[i] );
            }
            found = 'true';
         }
      }
      else if ( where === 'search' ) {
         /* check for duplicates, so we don't recommend a product that's being returned as a search result */
         var currentsearchresults = [];
         jQuery('.searchresult .vbmsearchsku').each(function(){
            currentsearchresults.push( jQuery(this).text() );
         });
         for( var i = 0, l = products.values.length; i < l; i++ )
         {
            var found = 'true';
            for( var j = 0, m = currentsearchresults.length; j < m; j++ )
            {
               if( currentsearchresults[j] != products.values[i] )
               {
                  found = 'false';
               }
               else
               {
                  found = 'true';
                  break;
               }
            }
            if( found === 'false' ) {
               productsToCookie.push( products.values[i] );
            }
            found = 'true';
         }
      }
      else {
		if (typeof avaccessories !== "undefined")
		{
			for (var i = 0, l = avaccessories.length; i < l; i++) {
				productsToCookie.push(avaccessories[i]);
			}
			for( var i = 0, l = products.values.length; i < l; i++ )
			{
				var flag = true;
				for (var j = 0, J = avaccessories.length; j < J; j++) {
					if(products.values[i] == avaccessories[j])
						flag = false;
				}
				if(flag)
					productsToCookie.push(products.values[i]);
			}
			skip = avaccessories.length;
		}
		else{
			for( var i = 0, l = products.values.length; i < l; i++ )
			{
				productsToCookie.push(products.values[i]);
			}
		}
		
      }
      vbmcookie.put( 'vbmprods', productsToCookie );
      var vbmlinks = jQuery('.vbmlinks'),
          searchlinks = jQuery('.searchresult'),
          composeurl = '';
      /* if we are on the search result page, we need to attach the search term to every legitimate result obtained */
      if ( where === 'search' )
      {
         var keyword = jQuery('#tag-searchkeyword').text();
         /* icats have the keyword set to *, we don't want to pass that as a search term */
         if ( keyword != '*' )
            Venda.Widget.VBM.attachSearchURL( keyword );
      }
      if ( where === 'search' )
      {
         jQuery('#vbm-panel').load('/page/irecsdisplaysearch').show();
      }
      else
      {
         jQuery('#vbm-panel').load('/page/irecsdisplay').show();
      }
      document.getElementById('tag-vbmtc').innerHTML = products.trackingcode;
      
	  if ( skip > 0 ) {
         Venda.Widget.VBM.attachVBMURL( products.trackingcode, skip);
      }
      else {
         Venda.Widget.VBM.attachVBMURL( products.trackingcode );
      }
	  
   });
};

Venda.Widget.VBM.saveSearch = function( sku )
{
   var searchterm = Venda.Widget.VBM.getFromURLHelper('VBMST') == '' ? Venda.Widget.VBM.getFromURLHelper('VBMSTinput') : Venda.Widget.VBM.getFromURLHelper('VBMST');
   searchterm = decodeURIComponent(searchterm);
   searchterm = unescape(searchterm);

   /*
    * Puts the search term (if available) into a variable
    * if "searchterm" is not on the URL, it means quick-add-to-basket was used, so we need to use the contents of the DIV#tag-searchkeyword
    */
   searchterm = ( searchterm === '' ) ? jQuery('#tag-searchkeyword').text() : searchterm;
   /* if(!emark) block check if saveSearch is being used by itself or if it is part of an existent emark object process, e.g. Venda.Widget.VBM.getRecommendations */
   if (!emark)
   {
      var emark = ( document.getElementById('__avail_log__') ) ? new Emark( true ) : new Emark();
      emark.saveSearch( searchterm, sku );
      emark.commit();
   }
   emark.saveSearch(searchterm, sku);
};

Venda.Widget.VBM.logAddedToCart = function( sku ) {
   var trackingcode = Venda.Widget.VBM.getFromURLHelper('VBMTC');
   /* if the tracking code is not found in URL, it means the user is using quick-add-to-basket, and we need to look for the traking code in the hidden DIV */
   trackingcode = ( trackingcode === '' ) ? jQuery('#tag-vbmtc').text() : trackingcode;
   /* check if emark has already been created by other process, or if it is a stand-alone process */
   if( !emark )
   {
      var emark = ( document.getElementById('__avail_log__') ) ? new Emark( true ) : new Emark();
      emark.logAddedToCart( sku );
      emark.commit();
   }
   else
   {
      emark.logAddedToCart( sku );
   }
};

Venda.Widget.VBM.logRemovedFromCart = function( sku ) {
   if( !emark )
   {
      var emark = ( document.getElementById('__avail_log__') ) ? new Emark( true ) : new Emark();
      emark.logRemovedFromCart( sku );
      emark.commit();
   }
   else
   {
      emar.logRemovedFromCart( sku );
   }
};

Venda.Widget.VBM.logPurchase = function( products, prices ) {
   var userid = jQuery('#tag-vbmuseremail').text().replace(/@/,'_AT_').replace(/\./g,'_DOT_'),
       products = products.split(','),
       prices = prices.split(','),
       orderid = jQuery('#tag-orderid').text(),
       currency = jQuery('#tag-vbmcurrency').text(),
       emark = (document.getElementById('__avail_log__')) ? new Emark( true ) : new Emark();
   products.pop();
   prices.pop();
   emark.logPurchase( userid, products, prices, orderid, currency );
   emark.commit();
};

/**
 * Attaches search term at the end of every product link that is a search result, elements is the class of the A tags that will get the URL attached
 * Checks if it is the only "attachment", and if so it adds ?, otherwise it adds & to concatenate parameters (i.e. bklist being used)
 */
Venda.Widget.VBM.attachSearchURL = function( params )
{
   var items = jQuery('.searchresult a'),
       toAttach = 'VBMST=' + params;
   for (var i = 0, l = items.length; i < l; i++) {
      items[i].href = ( (items[i].href).indexOf('?') < 0 ) ? ( items[i].href + '?' + toAttach ) : ( items[i].href + '&' + toAttach );
   }
};

/**
 * Attaches search term at the end of every product link that is a search result, elements is the class of the A tags that will get the URL attached
 * Checks if it is the only "attachment", and if so it adds ?, otherwise it adds & to concatenate parameters (i.e. bklist being used)
 */
Venda.Widget.VBM.attachVBMURL = function( params, skip )
{
   var timer = timer ? timer : '',
       skip = skip ? skip : 0;
   jQuery('.vbmproduct').each(function( i ) {
      if( i < skip ) {
         jQuery(this).toggleClass('vbmproduct');
      }
   });
   if( jQuery('.vbmproduct').length > 0 )
   {
      items = jQuery('.vbmproduct a');
      var toAttach = 'VBMTC=' + params;
      for ( var i = 0, l = items.length; i < l; i++ ) {
         items[i].href = ( (items[i].href).indexOf('?') < 0 ) ? ( items[i].href + '?' + toAttach ) : ( items[i].href + '&' + toAttach );
      }
      clearTimeout(timer);
   }
   else
   {
      timer = setTimeout('Venda.Widget.VBM.attachVBMURL("' + params + '","' + skip + '")', 500);
   }
};
