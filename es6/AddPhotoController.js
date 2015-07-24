/// <reference path="../app.ts" />
/// <reference path="../../baseline/mercury.d.ts" />
'use strict';
App.AddPhotoController = Em.Controller.extend({
    needs: ['application', 'article'],
    errorCodeMap: {
        'invalidtitle': 'app.add-photo-section-title-error'
    },
    handleAddContentSuccess: function (data) {
        var _this = this;
        var title = this.get('model.title');
        this.transitionToRoute('article', title).then(function () {
            _this.get('controllers.application').addAlert('success', i18n.t('app.add-photo-success'));
        });
        M.track({
            action: M.trackActions.impression,
            category: 'sectionaddphoto',
            label: 'success'
        });
    },
    handleUploadSuccess: function (data) {
        App.AddPhotoModel.addToContent(data.title, this.get('model')).then(this.handleAddContentSuccess.bind(this), this.handleError.bind(this));
    },
    handleError: function (error) {
        var appController = this.get('controllers.application'), errorMsg = this.errorCodeMap[error] || 'app.add-photo-error';
        appController.addAlert('alert', i18n.t(errorMsg));
        appController.hideLoader();
        M.track({
            action: M.trackActions.impression,
            category: 'sectionaddphoto',
            label: error || 'add-photo-error'
        });
    },
    actions: {
        upload: function () {
            this.get('controllers.application').showLoader();
            App.AddPhotoModel.upload(this.get('model')).then(this.handleUploadSuccess.bind(this), this.handleError.bind(this));
            M.track({
                action: M.trackActions.click,
                category: 'sectionaddphoto',
                label: 'upload'
            });
        },
        back: function () {
            this.transitionToRoute('article', this.get('model.title'));
            M.track({
                action: M.trackActions.click,
                category: 'sectionaddphoto',
                label: 'back'
            });
        }
    }
});
