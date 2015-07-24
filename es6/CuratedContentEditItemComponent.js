/// <reference path="../app.ts" />
'use strict';
App.CuratedContentEditItemComponent = Em.Component.extend({
    classNames: ['curated-content-edit-item'],
    cropMode: Mercury.Modules.Thumbnailer.mode.topCrop,
    thumbnailer: Mercury.Modules.Thumbnailer,
    imageSize: 100,
    /**
     * Sections have titles, section items have labels and titles - we want to show labels for them
     */
    title: Em.computed('model', function () {
        var model = this.get('model');
        return model.label || model.title;
    }),
    thumbUrl: Em.computed('model', function () {
        var model = this.get('model'), options = {
            width: this.get('imageSize'),
            height: this.get('imageSize'),
            mode: this.get('cropMode')
        }, thumbUrl = '';
        if (!Em.isEmpty(model.image_url)) {
            thumbUrl = this.thumbnailer.getThumbURL(model.image_url, options);
        }
        return thumbUrl;
    }),
    click: function () {
        var model = this.get('model'), action = model.items ? 'openSection' : 'editItem';
        this.sendAction(action, model);
    }
});
