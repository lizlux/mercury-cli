/// <reference path="../app.ts" />
///<reference path="../mixins/LoadingSpinnerMixin.ts"/>
///<reference path="../mixins/TrackClickMixin.ts"/>
///<reference path="../models/CuratedContentModel.ts"/>
'use strict';
App.CuratedContentComponent = Em.Component.extend(App.LoadingSpinnerMixin, App.TrackClickMixin, {
    classNames: ['curated-content'],
    actions: {
        clickItem: function (item) {
            var itemType = item.type;
            if (itemType) {
                this.trackClick('modular-main-page', `curated-content-item-${itemType}`);
                if (itemType === 'section' || itemType === 'category') {
                    this.sendAction('openCuratedContentItem', item);
                }
            }
            else {
                this.trackClick('modular-main-page', 'curated-content-item-other');
            }
        },
        loadMore: function () {
            var _this = this;
            this.showLoader();
            App.CuratedContentModel.loadMore(this.get('model')).catch(function (reason) {
                _this.controllerFor('application').addAlert('error', i18n.t('app.curated-content-error-load-more-items'));
                Em.Logger.error(reason);
            }).finally(function () {
                _this.hideLoader();
            });
        }
    }
});
