module.exports = {
    /**
  	 * We need to support links like:
  	 * /wiki/Rachel Berry
  	 * /wiki/Rachel  Berry
  	 * /wiki/Rachel__Berry
  	 *
  	 * but we want them to be displayed normalized in URL bar
  	 */
  	normalizeToUnderscore: function (title = '') {
  		return title
  			.replace(/\s/g, '_')
  			.replace(/_+/g, '_');
  	},

  	normalizeToWhitespace: function (title = '') {
  		return title
  			.replace(/_/g, ' ')
  			.replace(/\s+/g, ' ');
  	}
}
