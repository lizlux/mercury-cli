/// <reference path="../app.ts" />
/// <reference path="../../mercury/modules/Thumbnailer.ts" />
'use strict';
App.WikiaUsersComponent = Em.Component.extend({
    avatarHeight: 100,
    avatarWidth: 100,
    classNameBindings: ['classes'],
    isVisible: Em.computed.notEmpty('users'),
    label: null,
    limit: 5,
    thumbMode: Mercury.Modules.Thumbnailer.mode.fixedAspectRatio,
    trackingEvent: null,
    users: []
});
