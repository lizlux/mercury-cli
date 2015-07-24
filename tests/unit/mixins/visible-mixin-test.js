import Ember from 'ember';
import VisibleMixinMixin from '../../../mixins/visible-mixin';
import { module, test } from 'qunit';

module('Unit | Mixin | visible mixin');

// Replace this with your real tests.
test('it works', function(assert) {
  var VisibleMixinObject = Ember.Object.extend(VisibleMixinMixin);
  var subject = VisibleMixinObject.create();
  assert.ok(subject);
});
