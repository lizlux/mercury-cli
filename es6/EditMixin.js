/// <reference path="../app.ts" />
/// <reference path="../../baseline/mercury/utils/buildUrl.ts" />
'use strict';
App.EditMixin = Em.Mixin.create({
    getEditToken: function (title) {
        return new Em.RSVP.Promise(function (resolve, reject) {
            Em.$.ajax({
                url: M.buildUrl({ path: '/api.php' }),
                data: {
                    action: 'query',
                    prop: 'info',
                    titles: title,
                    intoken: 'edit',
                    format: 'json'
                },
                dataType: 'json',
                success: function (resp) {
                    var edittoken, pages = Em.get(resp, 'query.pages');
                    if (pages) {
                        // FIXME: MediaWiki API, seriously?
                        edittoken = pages[Object.keys(pages)[0]].edittoken;
                        resolve(edittoken);
                    }
                    else {
                        reject();
                    }
                },
                error: function (err) {
                    reject(err);
                }
            });
        });
    }
});
