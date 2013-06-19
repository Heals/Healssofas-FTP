/**
* @fileoverview Venda.Widget.Slider - animated slide functionality.
*
* This widget give us the ability to slide images/divs.
*
* @author Dan Brook <dbrook@venda.com>
* @author Nabi Arshad <narshad@venda.com>
*/

Venda.namespace("Widget.Slider");

/**
 * Sets up the object in preparation for rendering.
 *
 * @constructor
 * @class Transform a list into a slidable view of its items
 * @param Object An object representing the Slider's <tt><a href='#config'>config</a></tt>
 * @requires YAHOO             /venda-support/js/external/yui/build/yahoo/yahoo.js
 * @requires YAHOO.util.Event  /venda-support/js/external/yui/build/event/event.js
 * @requires YAHOO.util.DOM    /venda-support/js/external/yui/build/dom/dom.js
 * @requires YAHOO.util.Motion /venda-support/js/external/yui/build/animation/animation.js
 */
Venda.Widget.Slider = function(config) {
	// Support original calling style.
	if( !( this instanceof Venda.Widget.Slider ) ) {
		return new Venda.Widget.Slider({
			// sliderID,omaxNum,odisplayCount,oslideAmtNum,slideLeft,slideRight,duration
			sliderID:      arguments[0],
			maxNum:        arguments[1],
			displayCount:  arguments[2],
			slideAmtNum:   arguments[3],
			slideLeft:     arguments[4],
			slideRight:    arguments[5],
			duration:      arguments[6]
		});
	}

	this.config      = config;
	this.scrollPos = 1;
	this.sliding     = false;
};

Venda.Widget.Slider.prototype = {
	/**
	 * The configuration object as passed into the constructor.
	 * <p/>
	 * It <strong>must</strong> have following properties:
	 * <dl>
	 *  <dt>sliderID</dt>
	 *  <dd>An element id (or object) representing the list of items in the Slider</dd>
	 *  <dt>maxNum</dt>
	 *  <dd>This will be the value for maxNum</dd>
	 *  <dt>displayCount</dt>
	 *  <dd>How many items to display at a time</dd>
	 *  <dt>slideAmtNum</dt>
	 *  <dd>The amount of scroll items</dd>
	 *  <dt>slideLeft</dt>
	 *  <dd>An element id (or object) representing the button to slide left</dd>
	 *  <dt>slideRight</dt>
	 *  <dd>An element id (or object) representing the button to slide right</dd>
	 *  <dt>duration</dt>
	 *  <dd>The length of time of the slide animation e.g the smaller the number the quicker the animation</dd>
	 *  <dt>easing</dt>
	 *  <dd>The easing method, defaults to easeOut. See YAHOO.util.Easing for more info</dd>
	 * </dl>
	 * <em>NB - A <code>Count</code> is a dynamic number updated for each slide. An <code>Amt</code> is a static number.</em>
	 */

	config: {},
	/**
	 * The current scoll position.
	 * @type Number
	 */
	scrollPos: null,
	/**
	 * Indicate whether the sliding animation is taking place
	 * @type Boolean
	 */
	sliding: null,

	/**
	 * The element containing the slider.
	 * @type HTMLElement
	 */
	slider: null,

	/*
	 * The current (or most recent) event e.g a mouse event from moving the
	 * slider.
	 * @type Event
	 */
	currentEvent: null,

	/**
	 * The event triggered when sliding begins.
	 * @type YAHOO.util.CustomEvent
	 */
	onStart: null,
	/**
	 * The event triggered when sliding is complete.
	 * @type YAHOO.util.CustomEvent
	 */
	onComplete: null,
	/**
	 * The event triggered when sliding left.
	 * @type YAHOO.util.CustomEvent
	 */
	onSlideLeft: null,
	/**
	 * The event triggered when sliding right.
	 * @type YAHOO.util.CustomEvent
	 */
	onSlideRight: null,

	/**
	 * Set up the slider functionality.
	 */
	init: function() {
		this.slider = YAHOO.util.Dom.get(this.config.sliderID);
		YAHOO.util.Event.on(this.config.slideLeft,  'click', this._getSlideHandler('slideLeft'),  {}, this);
		YAHOO.util.Event.on(this.config.slideRight, 'click', this._getSlideHandler('slideRight'), {}, this);

		YAHOO.util.Dom.get(this.config.slideRight).style.visibility
			= this.itemCount() > this.config.displayCount ? 'visible' : 'hidden';

		this.onStart      = new YAHOO.util.CustomEvent('start',      this);
		this.onComplete   = new YAHOO.util.CustomEvent('complete',   this);
		this.onSlideLeft  = new YAHOO.util.CustomEvent('slideleft',  this);
		this.onSlideRight = new YAHOO.util.CustomEvent('slideright', this);

		this.onComplete.subscribe(this._slideComplete, {}, this);
	},

	/**
	 * Return slider element items as a HTMLCollection.
	 * @returns A HTMLCollection
	 */
	sliderItems: function() {
		return this.slider.getElementsByTagName('li');
	},

	/**
	 * Return the number of items in the slider.
	 * @returns A Number
	 */
	itemCount: function() {
		return this.sliderItems().length;
	},

	/**
	 * Move the slider in a given direction, 'right' or 'left'.
	 * @param dir The direction to move the slider in. Defaults to 'right'.
	 * @param amt The number of times to move the slider. Defaults to 1.
	 */
	slide: function(dir, amt) {
		var realdir = dir && dir.toLowerCase() == 'left' ? 'Left' : 'Right';
		this.onComplete.subscribe(this._slideN, {
			amt: amt !== undefined ? amt : 1,
			dir: realdir
		}, this);
		this.onComplete.fire();
	},

	/**
	 * Move the slider's position N times
	 * @private
	 */
	_slideN: function(type, events, obj) {
		if(obj.amt >= 1) {
			this._doSlide('slide' + obj.dir)
			obj.amt--;
		} else {
			this.onComplete.unsubscribe(this._slideN, this);
		}
	},

	/**
	 * Provide the appropriate slide handler given a direction
	 * @param method A string which can either be slideLeft or slideRight.
	 * @returns A Function.
	 * @private
	 */
	_getSlideHandler: function(method) {
		var self = this;
		return function(evt) {
			YAHOO.util.Event.stopEvent(evt);
			self.currentEvent = evt;

			self._doSlide(method);
		};
	},

	/**
	 * Calculate the amount of items to slide by.
	 * @returns The amount to slide by.
	 * @private
	 */
	_amountToSlide: function() {
		var remainder	    = this.itemCount() % this.config.displayCount;
		var amountToSlideBy = remainder == 0 ? this.config.displayCount: remainder;
		return this.sliderItems()[0].clientWidth * (this.config.slideAmtNum || amountToSlideBy);
	},

	/**
	 * Calculate whether the slide view is at the last element
	 * @returns A Boolean.
	 * @private
	 */
	_atStart: function() {
		return this.scrollPos <= 1;
	},

	/**
	 * Calculate whether the slide view is at the last element
	 * @returns A Boolean.
	 * @private
	 */
	_atEnd: function() {
		var stepAmount = this.config.slideAmtNum
					   ? this.scrollPos * this.config.slideAmtNum + this.config.displayCount
					   : this.scrollPos * this.config.displayCount;
		return stepAmount > this.itemCount()
		    || stepAmount > this.config.maxNum;
	},

	/**
	 * Provide necessary information to slide left. If the view can slide to
	 * the left then an Object is returned otherwise False is returned.
	 * @returns False or an Object
	 * @private
	 */
	_slideLeft: function(atStart, atEnd) {
		if(this._atStart()) {
			return;
		} else {
			this.scrollPos--;
			return { points: { by: [this._amountToSlide(), 0] } };
		}
	},

	/**
	 * Provide necessary information to slide right. If the view can slide to
	 * the right then an Object is returned otherwise False is returned.
	 * @returns False or an Object
	 * @private
	 */
	_slideRight: function(atStart, atEnd) {
		if(this._atEnd()) {
			return;
		} else {
			this.scrollPos++;
			return { points: { by: [-this._amountToSlide(), 0] } };
		}
	},

	/**
	 * If the slide view can move do so.
	 * @private
	 */
	_doSlide: function(method) {
		if(this.sliding)
			return;

		var attrs = this['_' + method]();

		if(attrs) {
			this.onStart.fire(attrs);
			this['onS' + method.substr(1)].fire(attrs);

			this._slide(attrs);
		}
	},

	/**
	 * Perform the sliding animation.
	 * @private
	 */
	_slide: function(attributes) {
		var anim = new YAHOO.util.Motion(
			this.slider, attributes, this.config.duration,
			this.config.easing || YAHOO.util.Easing.easeOut
		);
		anim.onComplete.subscribe(
			function() { this.onComplete.fire() },
			attributes,
			this
		);
		anim.animate();

		this.sliding = true;
	},

	/**
	 * Update the slider's buttons as appropriate e.g don't show the slide
	 * left button if the view is at the first item.
	 * @private
	 */
	_slideComplete: function() {
		YAHOO.util.Dom.setStyle(this.config.slideLeft,  'visibility', this._atStart() ? 'hidden' : '');
		YAHOO.util.Dom.setStyle(this.config.slideRight, 'visibility', this._atEnd()   ? 'hidden' : '');
		this.sliding = false;
	}
};