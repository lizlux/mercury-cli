/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />
'use strict';
App.CuratedContentEditIndexRoute = Em.Route.extend({
    model: function () {
        return App.CuratedContentEditModel.find();
    },
    renderTemplate: function () {
        this.render('curated-content-edit');
    },
});
