import Ember from 'ember';
import ArticleContentMixin from '../../../mixins/article-content';
import { module, test } from 'qunit';

module('Unit | Mixin | article content');

// Replace this with your real tests.
test('it works', function(assert) {
  var ArticleContentObject = Ember.Object.extend(ArticleContentMixin);
  var subject = ArticleContentObject.create();
  assert.ok(subject);
});
