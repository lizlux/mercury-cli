/// <reference path="../app.ts" />
'use strict';
App.CuratedContentEditBlockComponent = Em.Component.extend({
    classNames: ['curated-content-edit-block'],
    tagName: 'section',
    actions: {
        editItem: function (item) {
            this.sendAction('editItem', item);
        },
        openSection: function (item) {
            this.sendAction('openSection', item);
        }
    }
});
