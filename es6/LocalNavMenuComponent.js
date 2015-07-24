/// <reference path="../app.ts" />
'use strict';
App.LocalNavMenuComponent = Em.Component.extend(App.TrackClickMixin, {
    tagName: 'ul',
    classNames: ['local-nav-menu'],
    /**
     * Note: this means that the model is stored directly
     * in the Wikia object. We may wish to actually copy it over,
     * or removed the reference in the Wikia object to it so that
     * this component has exclusive access to it.
     */
    model: Em.computed(function () {
        return Mercury.wiki.navData;
    }),
    menuRoot: Em.computed('model', function () {
        return {
            children: this.get('model.navigation.wiki')
        };
    }),
    currentMenuItem: Em.computed.oneWay('menuRoot'),
    parentItem: Em.computed.alias('currentMenuItem.parent'),
    actions: {
        /**
         * @desc Action that changes `currentMenuItem` based on the index of
         * `currentMenuItem`'s children
         * @param index The index of the item to change to
         */
        changeMenuItem: function (index) {
            var curr = this.get('currentMenuItem');
            this.set('currentMenuItem', curr.children[index]);
            M.track({
                action: M.trackActions.click,
                category: 'wiki-nav',
                label: 'header-' + (index + 1)
            });
        },
        collapseSideNav: function () {
            this.set('sideNavCollapsed', true);
        },
        gotoRoot: function () {
            this.set('currentMenuItem', this.get('menuRoot'));
        },
        goBack: function () {
            this.set('currentMenuItem', this.get('parentItem'));
        },
        loadRandomArticle: function () {
            this.trackClick('randomArticle', 'click');
            this.sendAction('loadRandomArticle');
        }
    },
    sideNavCollapsedObserver: Em.observer('sideNavCollapsed', function () {
        if (this.get('sideNavCollapsed')) {
            this.send('gotoRoot');
        }
    }),
    willInsertElement: function () {
        this.injectParentPointersAndIndices();
    },
    /**
     * @desc function which recursively sets the 'parent' property
     * of all of the items in the navData tree. It also sets the index
     * of each item in its parent's `children` array, necessary because
     * of how finicky Ember slightly customized version of Handlebars is.
     *
     * We need this because JSON can store child nav objects,
     * but cannot store references to parent objects.
     */
    injectParentPointersAndIndices: function () {
        // topLevel is almost a NavItem but it has no href or text
        var topLevel = this.get('menuRoot'), children = topLevel.children || [], i, len = children.length;
        for (i = 0; i < len; i++) {
            this.injectParentPointersAndIndicesHelper(topLevel, children[i], i);
        }
    },
    /**
     * Recursive helper for the `injectParentPointersAndIndices` function.
     * @param parent The parent of curr
     * @param curr The object to set the parent of, and then recursively
     * set the parent of all its children, depth-first
     * @param index The index of this item in its parent's children array, because
     * we need it to link to the correct child
     */
    injectParentPointersAndIndicesHelper: function (parent, curr, index) {
        var i, len;
        curr.parent = parent;
        curr.index = index;
        if (!curr.hasOwnProperty('children')) {
            return;
        }
        for (i = 0, len = curr.children.length; i < len; i++) {
            this.injectParentPointersAndIndicesHelper(curr, curr.children[i], i);
        }
    }
});
