import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';


moduleForComponent('linked-gallery-media', 'Integration | Component | linked gallery media', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{linked-gallery-media}}`);

  assert.equal(this.$().text(), '');

  // Template block usage:
  this.render(hbs`
    {{#linked-gallery-media}}
      template block text
    {{/linked-gallery-media}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
