/**
 * Original author : Lalit Patel
 * Website: http://www.lalit.org/lab/jsoncookies
 * License: Creative Commons Attribution-ShareAlike 2.5
 *          http://creativecommons.org/licenses/by-sa/2.5/
 */

function CookieJar(options) {
  this.initialize(options);
}

CookieJar.prototype = {
	options: {},

	/**
	 * Initializes the cookie jar with the options.
	 */
	initialize: function(options) {
		this.options = {
			expires: 3600, // seconds (1 hr)
			path:    '',   // cookie path
			domain:  '',   // cookie domain
			secure:  ''	   // secure ?
		};

		for(var prop in options || {})
		  this.options[prop] = options[prop];

		if (this.options.expires != '') {
			var date = new Date();
			date.setTime(date.getTime() + (this.options.expires * 1000));
			this.options.expires = '; expires=' + date.toGMTString();
		}
		
		if (this.options.path != '')
			this.options.path = '; path=' + escape(this.options.path);
		
		if (this.options.domain != '')
			this.options.domain = '; domain=' + escape(this.options.domain);
		
		if (this.options.secure == 'secure')
			this.options.secure = '; secure';
		else
			this.options.secure = '';
	},

	/**
	 * Adds a name values pair.
	 */
	put: function(name, value) {
		var cookie = this.options;
		switch(typeof value) {
			case 'undefined':
			case 'function' :
			case 'unknown'  : return false;
			case 'boolean'  : 
			case 'string'   : 
			case 'number'   : value = String(value.toString());
		}
		var cookie_str = name + "=" + escape(value);
		try {
			document.cookie = cookie_str + cookie.expires + cookie.path + cookie.domain + cookie.secure;
		} catch (e) {
			return false;
		}
		return true;
	},

	/**
	 * Removes a particular cookie (name value pair) form the Cookie Jar.
	 */
	remove: function(name) {
		var cookie = this.options;
		try {
			var date = new Date();
			date.setTime(date.getTime() - (3600 * 1000));
			var expires = '; expires=' + date.toGMTString();
			document.cookie = name + "=" + expires + cookie.path + cookie.domain + cookie.secure;
		} catch (e) {
			return false;
		}
		return true;
	},

	/**
	 * Return a particular cookie by name;
	 */
	get: function(name) {
		var cookies = document.cookie.match(name + '=(.*?)(;|$)');
		if (cookies)
			return unescape(cookies[1]);
		else
			return null;
	},

	/**
	 * Empties the Cookie Jar. Deletes all the cookies.
	 */
	empty: function() {
		var keys = this.getKeys();
		var size = keys.length;
		for(var i = 0; i < size; i++)
			this.remove(keys[i]);
	},

	/**
	 * Returns all cookies as a single object
	 */
	getPack: function() {
		var pack = {};
		var keys = this.getKeys();
		var size = keys.length;
		for(var i = 0; i < size; i++)
			pack[keys[i]] = this.get(keys[i]);
		return pack;
	},

	keyRe: /[^=; ]+(?=\=)/g,

	/**
	 * Returns all keys.
	 */
	getKeys: function() {
		var keys  = [];
		var str   = document.cookie;
		while((match = this.keyRe.exec(str)) != undefined)
		 	keys.push(match[0].replace(/^\s*|\s*$/g, ''));
		return keys;
	}
};