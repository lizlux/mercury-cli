/// <reference path="../app.ts" />
'use strict';
App.UserModel = Em.Object.extend({
    avatarPath: null,
    name: null,
    userId: null
});
App.UserModel.reopenClass({
    defaultAvatarSize: 100,
    find: function (params) {
        var avatarSize = params.avatarSize || App.UserModel.defaultAvatarSize, model = App.UserModel.create();
        return new Em.RSVP.Promise(function (resolve, reject) {
            Em.$.ajax({
                url: App.get('apiBase') + '/userDetails',
                dataType: 'json',
                data: {
                    ids: params.userId,
                    size: avatarSize
                },
                success: function (result) {
                    if (result.hasOwnProperty('items') && result.items.constructor === Array) {
                        model.setProperties(App.UserModel.getPropertiesFromData(result.items[0]));
                    }
                    resolve(model);
                },
                error: function (result) {
                    if (result.status === 404) {
                        resolve(model);
                    }
                    else {
                        reject($.extend(result, model));
                    }
                }
            });
        });
    },
    getPropertiesFromData: function (userData) {
        return {
            name: userData.name,
            userId: userData.user_id,
            avatarPath: userData.avatar
        };
    }
});
