/// <reference path="./ImageMediaComponent.ts" />
'use strict';
App.WikiaMapComponent = App.ImageMediaComponent.extend({
    classNames: ['wikia-map'],
    url: null,
    title: null,
    imageSrc: null,
    id: null,
    templateName: 'components/wikia-map',
    caption: Em.computed.alias('title'),
    didInsertElement: function () {
        var _this = this;
        //handle click with jquery because the 'normal' way to handle events doesn't work.
        this.$().click(function () {
            var url = _this.get('url'), id = _this.get('id'), title = _this.get('title');
            if (url) {
                Em.Logger.debug('Handling map with id:', id, 'and title:', title);
                M.track({
                    action: M.trackActions.click,
                    category: 'map'
                });
                _this.sendAction('click', 'map', {
                    title: title,
                    url: url,
                    id: id
                });
            }
        });
    }
});
