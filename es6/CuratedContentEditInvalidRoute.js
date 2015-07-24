/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />
'use strict';
App.CuratedContentEditInvalidRoute = Em.Route.extend({
    /**
     * When user tries to load invalid path under /main/edit/* we redirect to /main/edit
     */
    beforeModel: function () {
        this.transitionTo('curatedContentEdit');
    }
});
