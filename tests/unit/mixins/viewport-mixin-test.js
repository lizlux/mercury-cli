import Ember from 'ember';
import ViewportMixinMixin from '../../../mixins/viewport-mixin';
import { module, test } from 'qunit';

module('Unit | Mixin | viewport mixin');

// Replace this with your real tests.
test('it works', function(assert) {
  var ViewportMixinObject = Ember.Object.extend(ViewportMixinMixin);
  var subject = ViewportMixinObject.create();
  assert.ok(subject);
});
