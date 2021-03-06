import Ember from 'ember';
import DS from 'ember-data';
import String from '../../utils/string';

export default DS.Model.extend({
	/**
	 * In order to have consistency in input data we are wrapping them into array if they are not
	 */
	init: function () {
		var media = this.get('media');

		if (!Ember.isArray(media)) {
			this.set('media', [media]);
		}
	},

	find: function (id) {
		return this.get('media')[id];
	},

	/**
	 * @param title
	 * @returns {{mediaRef: number, galleryRef: number}}
	 */
	getRefsForLightboxByTitle: function (title) {
		var media = this.get('media'),
			mediaRef = null,
			galleryRef = null,
			findInMedia = function (mediaItem, mediaIndex) {
			if (Ember.isArray(mediaItem)) {
				return (mediaItem).some(findInGallery, {
					mediaIndex: mediaIndex
				});
			} else if (String.normalizeToUnderscore((mediaItem).title) ===
			String.normalizeToUnderscore(title)) {
				mediaRef = mediaIndex;
				return true;
			}
		},
		findInGallery = function (galleryItem, galleryIndex) {
			if (String.normalizeToUnderscore(galleryItem.title) === String.normalizeToUnderscore(title)) {
				mediaRef = this.mediaIndex;
				galleryRef = galleryIndex;
				return true;
			}
			return false;
		};

		if (Ember.isArray(media)) {
			media.some(findInMedia);
		} else {
			Ember.Logger.debug('Media is not an array', media);
		}

		return {
			mediaRef: mediaRef,
			galleryRef: galleryRef
		};
	}

});
