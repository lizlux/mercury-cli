/// <reference path="../app.ts" />
'use strict';
/**
 * object that stores visibility state of components
 * and fires onVisible action when a components is becoming visible
 */
App.VisibilityStateManager = Em.Object.create({
    initialized: false,
    components: [],
    /**
     * @desc checks whether an element is inside viewport
     *
     * @param element to be checked
     * @param visibleBottom distance from top of a page to bottom of a viewport
     * @param visibleTop distance from top of a page to top of a viewport
     * @param threshold makes viewport virtually bigger
     * @returns {boolean}
     */
    isVisible: function (element, visibleBottom, visibleTop, threshold) {
        if (threshold === void 0) { threshold = 400; }
        var top = element.offset().top - threshold, bottom = top + element.height() + threshold;
        return visibleBottom >= top && visibleTop <= bottom;
    },
    /**
     * @desc runs a loop over this.components and check if they are visible
     */
    check: function () {
        var components = this.components, i = components.length, component, 
        // in IE10 window.scrollY doesn't work
        // but window.pageYOffset is basically the same
        // https://developer.mozilla.org/en-US/docs/Web/API/window.scrollY
        wTop = window.scrollY || window.pageYOffset, wBottom = wTop + window.innerHeight;
        if (i > 0) {
            while (i--) {
                component = components[i];
                if (component.$() && this.isVisible(component.$(), wBottom, wTop, component.threshold)) {
                    component.send('onVisible');
                    components.splice(i, 1);
                }
            }
        }
        else {
            $(window).off('scroll.isVisible');
            this.initialized = false;
        }
    },
    checkDebounced: function () {
        Em.run.debounce(this, this.check, 50);
    },
    /**
     * @desc adds component to components array and initializes scroll listener
     * @param component
     */
    add: function (component) {
        var _this = this;
        this.components.push(component);
        if (!this.initialized) {
            $(window).on('scroll.isVisible', function () { return _this.checkDebounced(); });
            this.checkDebounced();
            this.initialized = true;
        }
    },
    /**
     * @desc resets state, used in ArticleController on a page change
     */
    reset: function () {
        this.components.length = 0;
        this.initialized = false;
    }
});
