/// <reference path="../app.ts" />
/// <reference path="../../../../typings/hammerjs/hammerjs" />
/// <reference path="../mixins/ArticleContentMixin.ts" />
/// <reference path="../mixins/LoadingSpinnerMixin.ts" />
'use strict';
App.LightboxImageComponent = Em.Component.extend(App.ArticleContentMixin, App.LoadingSpinnerMixin, {
    classNames: ['lightbox-image', 'lightbox-content-inner'],
    maxZoom: 5,
    lastX: 0,
    lastY: 0,
    lastScale: 1,
    //Easy to port if we find a way to use enum here
    screenAreas: {
        left: 0,
        center: 1,
        right: 2
    },
    isZoomed: Em.computed.gt('scale', 1),
    loadingError: false,
    /**
     * @desc This is performance critical place, we will update property 'manually' by calling notifyPropertyChange
     */
    style: Em.computed(function () {
        var scale = this.get('scale').toFixed(2), x = this.get('newX').toFixed(2), y = this.get('newY').toFixed(2), transform = `transform: scale(${scale}) translate3d(${x}px,${y}px,0);`;
        return ('-webkit-' + transform + transform).htmlSafe();
    }),
    viewportSize: Em.computed(function () {
        return {
            width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
            height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
        };
    }),
    /**
     * @desc calculates current scale for zooming
     */
    scale: Em.computed({
        get() {
            return 1;
        },
        set(key, value) {
            if (value >= 1) {
                return Math.min(this.maxZoom, value);
            }
            return 1;
        }
    }),
    /**
     * @desc property that holds current image
     */
    image: Em.computed(function () {
        return this.$('.current');
    }),
    imageWidth: Em.computed('image', 'scale', function () {
        return this.get('image').width() * this.get('scale');
    }),
    imageHeight: Em.computed('image', 'scale', function () {
        return this.get('image').height() * this.get('scale');
    }),
    /**
     * @desc used to set X boundaries for panning image in media lightbox
     */
    maxX: Em.computed('viewportSize', 'imageWidth', 'scale', function () {
        return Math.abs(this.get('viewportSize.width') - this.get('imageWidth')) / 2 / this.get('scale');
    }),
    /**
     * @desc used to set Y boundaries for panning image in media lightbox
     */
    maxY: Em.computed('viewportSize', 'imageHeight', 'scale', function () {
        return Math.abs(this.get('viewportSize').height - this.get('imageHeight')) / 2 / this.get('scale');
    }),
    /**
     * @desc calculates X for panning with respect to maxX
     */
    newX: Em.computed('viewportSize', 'imageWidth', {
        get() {
            return 0;
        },
        set(key, value) {
            if (this.get('imageWidth') > this.get('viewportSize.width')) {
                return this.limit(value, this.get('maxX'));
            }
            return 0;
        }
    }),
    /**
     * @desc calculates Y for panning with respect to maxY
     */
    newY: Em.computed('viewportSize', 'imageHeight', {
        get() {
            return 0;
        },
        set(key, value) {
            if (this.get('imageHeight') > this.get('viewportSize').height) {
                return this.limit(value, this.get('maxY'));
            }
            return 0;
        }
    }),
    articleContentWidthObserver: Em.observer('articleContent.width', function () {
        this.notifyPropertyChange('viewportSize');
        this.notifyPropertyChange('imageWidth');
        this.notifyPropertyChange('imageHeight');
    }),
    didInsertElement: function () {
        var url = this.get('model.url'), hammerInstance = this.get('_hammerInstance');
        if (url) {
            this.showLoader();
            this.load(url);
        }
        this.resetZoom();
        hammerInstance.get('pinch').set({
            enable: true
        });
        hammerInstance.get('pan').set({
            direction: Hammer.DIRECTION_ALL
        });
    },
    /**
     * @desc Handle click and prevent bubbling
     * if the image is zoomed
     */
    click: function (event) {
        var isZoomed = this.get('isZoomed');
        return isZoomed ? false : true;
    },
    gestures: {
        swipeLeft: function () {
            return this.get('isZoomed') ? false : true;
        },
        swipeRight: function () {
            return this.get('isZoomed') ? false : true;
        },
        pan: function (event) {
            var scale = this.get('scale');
            this.setProperties({
                newX: this.get('lastX') + event.deltaX / scale,
                newY: this.get('lastY') + event.deltaY / scale
            });
            this.notifyPropertyChange('style');
        },
        panEnd: function () {
            this.setProperties({
                lastX: this.get('newX'),
                lastY: this.get('newY')
            });
        },
        doubleTap: function (event) {
            //allow tap-to-zoom everywhere on non-galleries and in the center area for galleries
            if (!this.get('isGallery') || this.getScreenArea(event) === this.screenAreas.center) {
                var scale = this.get('scale') > 1 ? 1 : 3;
                this.setProperties({
                    scale: scale,
                    lastScale: scale
                });
                this.notifyPropertyChange('style');
            }
        },
        pinchMove: function (event) {
            var scale = this.get('scale');
            this.setProperties({
                scale: this.get('lastScale') * event.scale,
                newX: this.get('lastX') + event.deltaX / scale,
                newY: this.get('lastY') + event.deltaY / scale
            });
            this.notifyPropertyChange('style');
        },
        pinchEnd: function (event) {
            this.set('lastScale', this.get('lastScale') * event.scale);
        }
    },
    /**
     * @desc returns limited value for given max ie.
     * value = 5, max = 6, return 5
     * value = 6, max = 3, return 3
     * value = -5, max = -6, return -5
     * value = -6, max = -3, return -3
     */
    limit(value, max) {
        if (value < 0) {
            return Math.max(value, -max);
        }
        else {
            return Math.min(value, max);
        }
    },
    resetZoom: function () {
        this.setProperties({
            scale: 1,
            lastScale: 1,
            newX: 0,
            newY: 0,
            lastX: 0,
            lastY: 0
        });
    },
    /**
     * @desc load an image and run update function when it is loaded
     *
     * @param url string - url of current image
     */
    load: function (url) {
        var _this = this;
        var image = new Image();
        image.src = url;
        if (image.complete) {
            this.update(image.src);
        }
        else {
            image.addEventListener('load', function () {
                _this.update(image.src);
            });
            image.addEventListener('error', function () {
                _this.set('loadingError', true);
            });
        }
    },
    /**
     * @desc updates img with its src and sets media component to visible state
     *
     * @param src string - src for image
     */
    update: function (src) {
        this.setProperties({
            imageSrc: src,
            visible: true
        });
        this.hideLoader();
    },
    /**
     * @desc Checks on which area on the screen an event took place
     * @param {Touch} event
     * @returns {number}
     */
    getScreenArea: function (event) {
        var viewportWidth = this.get('viewportSize.width'), x = event.clientX, thirdPartOfScreen = viewportWidth / 3;
        if (x < thirdPartOfScreen) {
            return this.screenAreas.left;
        }
        else if (x > viewportWidth - thirdPartOfScreen) {
            return this.screenAreas.right;
        }
        else {
            return this.screenAreas.center;
        }
    }
});
