/// <reference path="../app.ts" />
/// <reference path="../../mercury/utils/track.ts" />
'use strict';
App.TrackClickMixin = Em.Mixin.create({
    trackClick: function (category, label, isNonInteractive) {
        if (label === void 0) { label = ''; }
        if (isNonInteractive === void 0) { isNonInteractive = true; }
        M.track({
            action: M.trackActions.click,
            category: category,
            label: label,
            isNonInteractive: isNonInteractive
        });
    },
    actions: {
        trackClick: function (category, label, isNonInteractive) {
            if (label === void 0) { label = ''; }
            if (isNonInteractive === void 0) { isNonInteractive = true; }
            this.trackClick(category, label, isNonInteractive);
        }
    }
});
