import Ember from 'ember';

export default Ember.Mixin.create({
	//This object is shared among all objects which include this mixin
	viewportDimensions: {
		height: null,
		width: null
	},
	initiated: false,

	init: function () {
		this._super();
		if (!this.get('initiated')) {
			this.onResize();
			Em.$(window).on('resize', () => {
				this.onResize();
			});
			this.set('initiated', true);
		}
	},

	onResize: function () {
		this.set(
			'viewportDimensions.width',
			Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
		);
		this.set(
			'viewportDimensions.height',
			Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
		);
	}
});
