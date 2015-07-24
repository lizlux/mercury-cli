/// <reference path="../app.ts" />
///<reference path="CuratedContentEditItemComponent.ts"/>
'use strict';
App.CuratedContentEditSectionComponent = Em.Component.extend({
    cropMode: Mercury.Modules.Thumbnailer.mode.topCrop,
    thumbnailer: Mercury.Modules.Thumbnailer,
    imageSize: 200,
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
    actions: {
        editItem: function (item) {
            this.sendAction('editItem', item);
        },
    }
});
