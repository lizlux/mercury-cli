/// <reference path="../app.ts" />
/// <reference path="./MediaComponent.ts" />
/// <reference path="../mixins/ArticleContentMixin.ts" />
/// <reference path="../mixins/ViewportMixin.ts" />
'use strict';
App.ImageMediaComponent = App.MediaComponent.extend(App.ArticleContentMixin, App.ViewportMixin, {
    smallImageSize: {
        height: 64,
        width: 64
    },
    imageAspectRatio: 16 / 9,
    classNames: ['article-image'],
    classNameBindings: ['hasCaption', 'visible', 'isSmall'],
    layoutName: 'components/image-media',
    imageSrc: Em.computed.oneWay('emptyGif'),
    hasCaption: Em.computed.notEmpty('media.caption'),
    link: Em.computed.alias('media.link'),
    isSmall: Em.computed('media.width', 'media.height', function () {
        var imageWidth = this.get('media.width'), imageHeight = this.get('media.height');
        return !!imageWidth && imageWidth < this.smallImageSize.width || imageHeight < this.smallImageSize.height;
    }),
    /**
     * used to set proper height to img tag before it loads
     * so we have less content jumping around due to lazy loading images
     * @return number
     */
    computedHeight: Em.computed('media.width', 'media.height', 'articleContent.width', function () {
        var pageWidth = this.get('articleContent.width'), imageWidth = this.get('media.width') || pageWidth, imageHeight = this.get('media.height');
        if (pageWidth < imageWidth) {
            return ~~(pageWidth * (imageHeight / imageWidth));
        }
        return imageHeight;
    }),
    /**
     * @desc return the params for getThumbURL for infobox image.
     * In case of very high or very wide images, crop them properly.
     * @return ThumbnailerParams
     */
    infoboxImageParams: Em.computed('media', 'imageAspectRatio', {
        get() {
            var media = this.get('media'), imageAspectRatio = this.get('imageAspectRatio'), maximalWidth = Math.floor(media.height * imageAspectRatio), windowWidth = this.get('viewportDimensions.width');
            //high image- image higher than square. Make it square.
            if (media.height > media.width) {
                return {
                    mode: Mercury.Modules.Thumbnailer.mode.topCropDown,
                    height: windowWidth,
                    width: windowWidth
                };
            }
            //wide image- image wider than 16:9 aspect ratio. Crop it to have 16:9 ratio.
            if (media.width > maximalWidth) {
                return {
                    mode: Mercury.Modules.Thumbnailer.mode.zoomCrop,
                    height: Math.floor(windowWidth / imageAspectRatio),
                    width: windowWidth
                };
            }
            //normal image- size between the 16:9 ratio and square.
            //Compute height with regard to full-screen width of infobox.
            return {
                mode: Mercury.Modules.Thumbnailer.mode.thumbnailDown,
                height: Math.floor(windowWidth * (media.height / media.width)),
                width: windowWidth
            };
        }
    }),
    /**
     * @desc return the thumbURL for media.
     * If media is an icon, use the limited width.
     * If media is an infobox image, use specified thumb params.
     */
    url: Em.computed({
        get() {
            var media = this.get('media'), mode = Mercury.Modules.Thumbnailer.mode.thumbnailDown, height = this.get('computedHeight'), width = this.get('articleContent.width'), infoboxImageParams;
            if (!media) {
                return this.get('imageSrc');
            }
            if (media.context === 'icon') {
                mode = Mercury.Modules.Thumbnailer.mode.scaleToWidth;
                width = this.get('iconWidth');
            }
            else if (media.context === 'infobox') {
                infoboxImageParams = this.get('infoboxImageParams');
                this.set('limitHeight', true);
                mode = infoboxImageParams.mode;
                height = infoboxImageParams.height;
                width = infoboxImageParams.width;
            }
            return this.getThumbURL(media.url, {
                mode: mode,
                height: height,
                width: width
            });
            //if it got here, that means that we don't have an url for this media
            //this might happen for example for read more section images
        },
        set(key, value) {
            return this.getThumbURL(value, {
                mode: Mercury.Modules.Thumbnailer.mode.topCrop,
                height: this.get('computedHeight'),
                width: this.get('articleContent.width')
            });
        }
    }),
    /**
     * @desc style used on img tag to set height of it before we load an image
     * so when image loads, browser don't have to resize it
     */
    style: Em.computed('computedHeight', 'visible', function () {
        return (this.get('visible') ? '' : `height:${this.get('computedHeight')}px;`).htmlSafe();
    }),
    /**
     * load an image and run update function when it is loaded
     */
    load: function () {
        var _this = this;
        var url = this.get('url'), image;
        if (url) {
            image = new Image();
            image.src = url;
            if (image.complete) {
                this.update(image.src);
            }
            else {
                image.addEventListener('load', function () {
                    _this.update(image.src);
                });
            }
        }
    },
    /**
     * updates img with its src and sets media component to visible state
     *
     * @param src string - src for image
     */
    update: function (src) {
        this.setProperties({
            imageSrc: src,
            visible: true
        });
    }
});
