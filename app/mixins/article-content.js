import Ember from 'ember';

export default Ember.Mixin.create({
	ArticleContentListeners: Ember.inject.service('article-content-listeners'),

	//This object is shared among all objects which include this mixin
	articleContent: {
		width: null
	},

	init: function () {
		this._super();

		this.get('ArticleContentListeners').add(this);
	},

	willDestroyElement: function () {
		this._super();

		this.get('ArticleContentListeners').remove(this);
	}
});
