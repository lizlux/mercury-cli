import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'mercury-cli/tests/helpers/start-app';

var application;

module('Acceptance | article', {
  beforeEach: function() {
    application = startApp();
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('visiting /article', function(assert) {
  visit('/wiki/foo');

  andThen(function() {
    assert.equal(currentURL(), '/wiki/foo');
  });
});
