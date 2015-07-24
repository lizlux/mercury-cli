import Ember from 'ember';
import MediaComponent from './media-component';

export default Ember.Component.extend({
	ArticleContentListeners: Ember.inject.service('article-content-listeners'),
	layoutName: 'components/article-content',
	article: null,
	articleContent: Em.computed('article', function () {
		return this.get('article');
	}),

	handleTables() {
		var $tables = this.$().find('table:not([class*=infobox], .dirbox)'),
			wrapper;

		if ($tables.length) {
			wrapper = document.createElement('div');
			wrapper.className = 'article-table';

			$tables
				.wrap(wrapper)
				.css('visibility', 'visible');
		}
	},

	replaceMediaPlaceholdersWithMediaComponents: function (model, numberToProcess = -1) {
		var $mediaPlaceholders = this.$('.article-media'),
			index;

		if (numberToProcess < 0 || numberToProcess > $mediaPlaceholders.length) {
			numberToProcess = $mediaPlaceholders.length;
		}

		for (index = 0; index < numberToProcess; index++) {
			let mediaElement = this.createMediaComponent($mediaPlaceholders[index], model);
			$mediaPlaceholders.eq(index).replaceWith(mediaElement);
		}
	},

	createMediaComponent: function (element, model ) {
		var ref = parseInt(element.dataset.ref, 10),
			media = model[ref],
			mediaComponent = this.container.lookup('component:media-component'),
			mediaComponentObj = mediaComponent.newFromMedia(media, {
					ref: ref,
					width: parseInt(element.getAttribute('width'), 10),
					height: parseInt(element.getAttribute('height'), 10),
					imgWidth: element.offsetWidth,
					media: media
			});
		if (mediaComponentObj) {
			var component = this.createChildView(mediaComponentObj).createElement();
			return component.$().attr('data-ref', ref);
		}
		return null;
	},

	/**
	 * @desc handles expanding long tables, code taken from WikiaMobile
	 */
	handleInfoboxes: function (){
		var shortClass = 'short',
			$infoboxes = $('table[class*="infobox"] tbody'),
			body = window.document.body,
			scrollTo = body.scrollIntoViewIfNeeded || body.scrollIntoView;

		if ($infoboxes.length) {
			$infoboxes
				.filter(function () {
					return this.rows.length > 6;
				})
				.addClass(shortClass)
				.append('<tr class=infobox-expand><td colspan=2><svg viewBox="0 0 12 7" class="icon"><use xlink:href="#chevron"></use></svg></td></tr>')
				.on('click', function (event) {
					var $target = $(event.target),
						$this = $(this);

					if (!$target.is('a') && $this.toggleClass(shortClass).hasClass(shortClass)) {
						scrollTo.apply($this.find('.infobox-expand')[0]);
					}
				});
		}
	},

	replaceInfoboxesWithInfoboxComponents: function () {
		this.$('.portable-infobox').map((i, elem) => {
			this.replaceInfoboxWithInfoboxComponent(elem);
		});
	},

	replaceInfoboxWithInfoboxComponent: function (elem) {
		var $infoboxPlaceholder = $(elem),
			infoboxComponent;

		infoboxComponent = this.createChildView(App.PortableInfoboxComponent.create({
			infoboxHTML: elem.innerHTML,
			height: $infoboxPlaceholder.outerHeight()
		}));

		infoboxComponent.createElement();
		$infoboxPlaceholder.replaceWith(infoboxComponent.$());
		//TODO: do it in the nice way
		infoboxComponent.trigger('didInsertElement');
	},

	replaceMapsWithMapComponents: function () {
		this.$('.wikia-interactive-map-thumbnail').map((i, elem) => {
			this.replaceMapWithMapComponent(elem);
		});
	},

	replaceMapWithMapComponent: function (elem) {
		var $mapPlaceholder = $(elem),
			$a = $mapPlaceholder.children('a'),
			$img = $a.children('img'),
			mapComponent = this.createChildView(App.WikiaMapComponent.create({
			url: $a.data('map-url'),
			imageSrc: $img.data('src'),
			id: $a.data('map-id'),
			title: $a.data('map-title'),
			click: 'openLightbox'
		}));

		mapComponent.createElement();
		$mapPlaceholder.replaceWith(mapComponent.$());
		//TODO: do it in the nice way
		mapComponent.trigger('didInsertElement');
	},

	/**
	 * This is a hack to make PollDaddy work (HG-618)
	 * @see http://static.polldaddy.com/p/8791040.js
	 */
	handlePollDaddy: function () {
		var $polls = this.$('script[src*=polldaddy]');

		$polls.each((index, script) => {
			// extract ID from script src
			var idRegEx = /(\d+)\.js$/,
				matches = script.src.match(idRegEx),
				id,
				html,
				init;

			// something is wrong with poll daddy or UCG.
			if (!matches || !matches[1]) {
				Em.Logger.error('Polldaddy script src url not recognized', script.src);
				return;
			}

			id = matches[1];
			init = window['PDV_go' + id];

			if (typeof init !== 'function') {
				Em.Logger.error('Polldaddy code changed', script.src);
				return;
			}

			// avoid PollDaddy's document.write on subsequent article loads
			if (!this.$('#PDI_container' + id).length) {
				html = '<a name="pd_a_' + id + '" style="display: inline; padding: 0px; margin: 0px;"></a>' +
				       '<div class="PDS_Poll" id="PDI_container' + id + '"></div>';
				$(script).after(html);
			}
			init();
		});
	},

	articleContentObserver: Em.observer('articleContent', function () {
		this.rerender();

		Em.run.scheduleOnce('afterRender',this,  () => {
			this.handleTables();
			this.handleInfoboxes();
			this.replaceInfoboxesWithInfoboxComponents();
			this.replaceMapsWithMapComponents();
			this.replaceMediaPlaceholdersWithMediaComponents(this.get('media'), 4);
			this.handlePollDaddy();
			Em.run.later(this, () => this.replaceMediaPlaceholdersWithMediaComponents(this.get('media')), 0);
		});

	}).on('init')

});
