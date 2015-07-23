import Ember from 'ember';

export default Ember.Route.extend({
	model(params) {
		let articleTitle = params.articleTitle;
		let url = `api/v1/article/${articleTitle}`;
		debugger;
		return Ember.$.getJSON({
			url: 'http://www.google.com'
		});
	},

	afterModel() {
		//debugger;
	}
});
