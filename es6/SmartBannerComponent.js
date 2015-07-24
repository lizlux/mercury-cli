/// <reference path="../app.ts" />
/// <reference path="../../mercury/utils/browser.ts" />
/// <reference path="../../../../typings/jquery.cookie/jquery.cookie.d.ts" />
'use strict';
App.SmartBannerComponent = Em.Component.extend({
    classNames: ['smart-banner'],
    classNameBindings: ['noIcon'],
    options: {
        // Language code for App Store
        appStoreLanguage: 'us',
        // Duration to hide the banner after close button is clicked (0 = always show banner)
        daysHiddenAfterClose: 15,
        // Duration to hide the banner after it is clicked (0 = always show banner)
        daysHiddenAfterView: 30
    },
    day: 86400000,
    isVisible: false,
    appId: Em.computed('config', 'system', function () {
        return this.get('config.appId.' + this.get('system'));
    }),
    appScheme: Em.computed('config', 'system', function () {
        return this.get('config.appScheme.' + this.get('system'));
    }),
    config: Em.computed(function () {
        return Em.getWithDefault(Mercury, 'wiki.smartBanner', {});
    }),
    dbName: Em.computed(function () {
        return Em.get(Mercury, 'wiki.dbName');
    }),
    description: Em.computed.alias('config.description'),
    icon: Em.computed.alias('config.icon'),
    iconStyle: Em.computed('icon', function () {
        return 'background-image: url(%@)'.fmt(this.get('icon'));
    }),
    labelInStore: Em.computed('system', function () {
        return i18n.t('app.smartbanner-store-' + this.get('system'));
    }),
    labelInstall: Em.computed('system', function () {
        return i18n.t('app.smartbanner-install-' + this.get('system'));
    }),
    link: Em.computed('appId', 'dbName', 'system', function () {
        var link, appId = this.get('appId');
        if (this.get('system') === 'android') {
            link = 'https://play.google.com/store/apps/details?id=' + appId + '&referrer=utm_source%3Dwikia%26utm_medium%3Dsmartbanner%26utm_term%3D' + this.get('dbName');
        }
        else {
            link = 'https://itunes.apple.com/' + this.get('options.appStoreLanguage') + '/app/id' + appId;
        }
        return link;
    }),
    noIcon: Em.computed.not('icon'),
    system: Em.computed(function () {
        return Mercury.Utils.Browser.getSystem();
    }),
    title: Em.computed.alias('config.name'),
    actions: {
        close: function () {
            this.setSmartBannerCookie(this.get('options.daysHiddenAfterClose'));
            this.set('isVisible', false);
            this.track(M.trackActions.close);
        },
        view: function () {
            var appScheme = this.get('appScheme');
            this.setSmartBannerCookie(this.get('options.daysHiddenAfterView'));
            if (appScheme) {
                this.tryToOpenApp(appScheme);
            }
            else {
                window.open(this.get('link'), '_blank');
            }
            this.set('isVisible', false);
        }
    },
    click: function (event) {
        var $target = this.$(event.target);
        if (!$target.is('.sb-close')) {
            this.send('view');
        }
    },
    didInsertElement: function () {
        // Check if it's already a standalone web app or running within a webui view of an app (not mobile safari)
        var standalone = Em.get(navigator, 'standalone'), config = this.get('config');
        // Don't show banner if device isn't iOS or Android, website is loaded in app or user dismissed banner
        if (this.get('system') && !standalone && config.name && !config.disabled && $.cookie('sb-closed') !== '1') {
            this.set('isVisible', true);
            this.track(M.trackActions.impression);
        }
        else {
            this.destroy();
        }
    },
    /**
     * Try to open app using custom scheme and if it fails go to fallback function
     *
     * @param {string} appScheme
     */
    tryToOpenApp: function (appScheme) {
        this.track(M.trackActions.open);
        window.document.location.href = appScheme + '://';
        Em.run.later(this, this.fallbackToStore, 300);
    },
    /**
     * Open app store
     */
    fallbackToStore: function () {
        this.track(M.trackActions.install);
        window.open(this.get('link'), '_blank');
    },
    /**
     * Sets sb-closed=1 cookie for given number of days
     *
     * @param {number} days
     */
    setSmartBannerCookie: function (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * this.get('day')));
        $.cookie('sb-closed', 1, {
            expires: date,
            path: '/'
        });
    },
    track: function (action) {
        M.track({
            action: action,
            category: 'smart-banner',
            label: Em.get(Mercury, 'wiki.dbName')
        });
    }
});
