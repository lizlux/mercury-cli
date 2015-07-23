import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['site-head'],
	tagName: 'nav',
	headroom: null,

	options: {
		// keep it consistent with values in _wikia-variables.scss
		smartBannerHeight: {
			android: 66,
			ios: 83
		}
	},

	offset: Ember.computed('smartBannerVisible', function () {
		// if (this.get('smartBannerVisible')) {
		// 	return this.get('options.smartBannerHeight.' + Mercury.Utils.Browser.getSystem());
		// }
		return 0;
	}),

	actions: {
		expandSideNav: function () {
			this.set('sideNavCollapsed', false);
		},
		showUserMenu: function () {
			this.set('userMenuCollapsed', false);
		}
	},

	/**
	 * Observes smartBannerVisible property which is controlled by SmartBannerComponent
	 * and goes through ApplicationController. Reinitializes Headroom when it changes.
	 */
	smartBannerVisibleObserver: Ember.observer('smartBannerVisible', function () {
		var headroom = this.get('headroom');

		headroom.destroy();
		this.initHeadroom();
	}),

	/**
	 * @desc Hide top bar when scrolling down. Uses headroom.js plugin.
	 * Styles in styles/module/wiki/_site-head.scss and styles/state/_animated.scss
	 */
	didInsertElement: function () {
		this.initHeadroom();
	},

	initHeadroom: function () {
		// var headroom = new Headroom(this.get('element'), {
		// 	classes: {
		// 		initial: 'headroom',
		// 		pinned: 'pinned',
		// 		unpinned: 'un-pinned',
		// 		top: 'headroom-top',
		// 		notTop: 'headroom-not-top'
		// 	},
		// 	offset: this.get('offset')
		// });
        //
		// headroom.init();
        //
		// this.set('headroom', headroom);
	}
});
