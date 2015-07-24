/// <reference path="../app.ts" />
'use strict';
App.EditView = Em.View.extend({
    classNames: ['edit-view'],
    init: function () {
        var _this = this;
        this._super();
        Em.run.scheduleOnce('afterRender', this, function () {
            _this.adjustTextareaHeight();
        });
    },
    willInsertElement: function () {
        var _this = this;
        Em.$(window).on('resize.editor', function () {
            _this.adjustTextareaHeight();
        });
    },
    willDestroyElement: function () {
        Em.$(window).off('resize.editor');
    },
    adjustTextareaHeight: function () {
        Em.$('textarea').css('height', Em.$(window).height() - Em.$('.edit-head').outerHeight());
    }
});
