import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';


moduleForComponent('portable-infobox', 'Integration | Component | portable infobox', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{portable-infobox}}`);

  assert.equal(this.$().text(), '');

  // Template block usage:
  this.render(hbs`
    {{#portable-infobox}}
      template block text
    {{/portable-infobox}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
