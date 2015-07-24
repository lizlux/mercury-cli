/// <reference path='../app.ts' />
/// <reference path="../../mercury/utils/browser.ts" />
/// <reference path='../../../../typings/headroom/headroom.d.ts' />
'use strict';
App.ApplicationView = Em.View.extend({
    classNameBindings: ['systemClass', 'smartBannerVisible', 'verticalClass'],
    verticalClass: Em.computed(function () {
        var vertical = Em.get(Mercury, 'wiki.vertical');
        return vertical + '-vertical';
    }),
    systemClass: Em.computed(function () {
        var system = Mercury.Utils.Browser.getSystem();
        return system ? 'system-' + system : '';
    }),
    smartBannerVisible: Em.computed.alias('controller.smartBannerVisible'),
    sideNavCollapsed: Em.computed.alias('controller.sideNavCollapsed'),
    userMenuCollapsed: Em.computed.alias('controller.userMenuCollapsed'),
    alertNotifications: Em.computed.alias('controller.alertNotifications'),
    noScroll: Em.computed.alias('controller.noScroll'),
    scrollLocation: null,
    willInsertElement: function () {
        $('#article-preload').remove();
    },
    didInsertElement: function () {
        this.trackFirstContent();
    },
    trackFirstContent: function () {
        M.trackPerf({
            name: 'firstContent',
            type: 'mark'
        });
    },
    /**
     * Necessary because presently, we open external links in new pages, so if we didn't
     * cancel the click event on the current page, then the mouseUp handler would open
     * the external link in a new page _and_ the current page would be set to that external link.
     */
    click: function (event) {
        /**
         * check if the target has a parent that is an anchor
         * We do this for links in the form <a href='...'>Blah <i>Blah</i> Blah</a>,
         * because if the user clicks the part of the link in the <i></i> then
         * target.tagName will register as 'I' and not 'A'.
         */
        var $anchor = Em.$(event.target).closest('a'), target = $anchor.length ? $anchor[0] : event.target, tagName;
        if (target && this.shouldHandleClick(target)) {
            tagName = target.tagName.toLowerCase();
            if (tagName === 'a') {
                this.handleLink(target);
                event.preventDefault();
            }
        }
    },
    sideNavCollapsedObserver: Em.observer('sideNavCollapsed', function () {
        if (this.get('sideNavCollapsed')) {
            this.set('noScroll', false);
        }
        else {
            this.set('noScroll', true);
        }
    }),
    noScrollObserver: Em.observer('noScroll', function () {
        var $body = Em.$('body'), scrollLocation;
        if (this.get('noScroll')) {
            scrollLocation = $body.scrollTop();
            this.set('scrollLocation', scrollLocation);
            $body.css('top', -scrollLocation).addClass('no-scroll');
        }
        else {
            $body.removeClass('no-scroll').css('top', '');
            window.scrollTo(0, this.get('scrollLocation'));
            this.set('scrollLocation', null);
        }
    }),
    /**
     * Determine if we have to apply special logic to the click handler for MediaWiki / UGC content
     */
    shouldHandleClick: function (target) {
        var $target = $(target), isReference = this.targetIsReference(target);
        return ($target.closest('.mw-content').length && !$target.closest('.PDS_Poll').length && !isReference);
    },
    /**
     * Determine if the clicked target is an reference/in references list (in text or at the bottom of article)
     */
    targetIsReference: function (target) {
        var $target = $(target);
        return !!($target.closest('.references').length || $target.parent('.reference').length);
    },
    handleLink: function (target) {
        var controller;
        Em.Logger.debug('Handling link with href:', target.href);
        /**
         * If either the target or the target's parent is an anchor (and thus target == true),
         * then also check if the anchor has an href. If it doesn't we assume there is some other
         * handler for it that deals with it based on ID or something and we just skip it.
         */
        if (target && target.href) {
            /**
             * But if it does have an href, we check that it's not the link to expand the comments
             * If it's _any_ other link than that comments link, we stop its action and
             * pass it up to handleLink
             */
            if (!target.href.match('^' + window.location.origin + '\/a\/.*\/comments$')) {
                controller = this.get('controller');
                controller.send('closeLightbox');
                controller.send('handleLink', target);
            }
        }
    }
});
