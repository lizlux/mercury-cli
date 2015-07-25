import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ['wikia-map'],
    url: null,
    title: null,
    imageSrc: null,
    id: null,
    templateName: 'components/wikia-map',
    caption: Ember.computed.alias('title'),
    didInsertElement: function () {
        var _this = this;
        //handle click with jquery because the 'normal' way to handle events doesn't work.
        this.$().click(function () {
            var url = _this.get('url'), id = _this.get('id'), title = _this.get('title');
            if (url) {
                Ember.Logger.debug('Handling map with id:', id, 'and title:', title);
                _this.sendAction('click', 'map', {
                    title: title,
                    url: url,
                    id: id
                });
            }
        });
    }
});
