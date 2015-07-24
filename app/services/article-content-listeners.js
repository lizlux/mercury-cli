import Ember from 'ember';

export default Ember.Service.extend({
	initialized: false,
	containers: [],
	articleContentSelector: '.article-content',
	articleContent: {
		width: null
	},
	articleContentElement: null,

	/**
	 * This is a simple getter. It can't be a computed property because Em.Object.create doesn't support them.
	 *
	 * @return {JQuery}
	 */
	getArticleContentElement: function () {
		var articleContentElement = this.get('articleContentElement');
		if (articleContentElement !== null) {
			return articleContentElement;
		} else {
			articleContentElement = $(this.articleContentSelector);
			this.set('articleContentElement', articleContentElement);
			return articleContentElement;
		}
	},

	add: function (container) {
		var articleContentWidth;

		this.containers.push(container);

		if (!this.initialized) {
			Em.$(window).on('resize', () => {
				this.onResize();
			});

			articleContentWidth = this.getArticleContentElement().width();
			this.set('articleContent.width', articleContentWidth);
			container.set('articleContent.width', articleContentWidth);

			this.initialized = true;
		}
	},

	remove: function (container) {
		var index = this.containers.indexOf(container);

		if (index > -1) {
			this.containers.splice(index, 1);
		}
	},

	onResize: function () {
		var containers = this.containers,
			containersCount = containers.length;

		//We set current width on this.articleContent.width so we always keep track of article-content width.
		//Even if components are no longer registered (for example in case of opening/closing infobox).
		this.set('articleContent.width', this.getArticleContentElement().width());

		//If some containers are registered it is enough to update value in one of them
		//because articleContent.width property is shared among all objects which include ArticleContentMixin
		if (containersCount > 0) {
			containers[0].set('articleContent.width', this.get('articleContent.width'));
		}
	}

});
