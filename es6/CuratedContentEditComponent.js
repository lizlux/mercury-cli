/// <reference path="../app.ts" />
'use strict';
App.CuratedContentEditComponent = Em.Component.extend({
    classNames: ['curated-content-edit'],
    actions: {
        editItem: function (item) {
            this.sendAction('editItem', item);
        },
        openSection: function (item) {
            this.sendAction('openSection', item);
        }
    }
});
