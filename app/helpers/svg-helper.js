import Ember from 'ember';

/**
 * @desc Helper to generate SVGs in the form:
 * {{svg name viewBox classes}}
 * <svg viewBox="{{viewBox}}" class="{{classes}}">
 * 	<use xlink:href="#{{name}}"></use>
 * </svg>
 *
 * i.e., {{svg "chevron" "0 0 12 7" "icon chevron"}} generates:
 * <svg viewBox="0 0 12 7" class="icon chevron">
 * 	<use xlink:href="#chevron"></use>
 * </svg>
 */
export default Ember.Handlebars.makeBoundHelper(function (name, options) {
	var optionalParams = [
			'class',
			'role',
			'viewBox'
		],
		ret = '<svg';

	optionalParams.forEach(function (param) {
		if (param in options.hash) {
			ret += " " + param + '="' + options.hash[param] + '"';
		}
	});
	ret += '><use xlink:href="#' + name + '"></use></svg>';
	return new Ember.Handlebars.SafeString(ret);
});
