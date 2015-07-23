import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('articles', { path: '/wiki' }, function () {
    this.route('article', {path: ':articleTitle' });
  });
});

export default Router;
