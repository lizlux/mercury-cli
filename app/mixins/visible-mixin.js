import Ember from 'ember';

export default Ember.Mixin.create({
	visibilityStateManager: Ember.inject.service('visibility-state-manager'),

	init: function () {
		this._super();

		this.get('visibilityStateManager').add(this);
	}
});
