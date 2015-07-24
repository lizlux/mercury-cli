/// <reference path="../app.ts" />
'use strict';
App.AlertNotificationsComponent = Em.Component.extend({
    classNames: ['alert-notifications'],
    alerts: null,
    actions: {
        dismissAlert: function (alert) {
            this.get('alerts').removeObject(alert);
        }
    }
});
