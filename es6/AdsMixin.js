/// <reference path="../app.ts" />
/// <reference path="../../../../typings/jquery/jquery.d.ts" />
'use strict';
App.AdsMixin = Em.Mixin.create({
    adsData: {
        minZerothSectionLength: 700,
        minPageLength: 2000,
        mobileInContent: 'MOBILE_IN_CONTENT',
        mobilePreFooter: 'MOBILE_PREFOOTER',
        moreInContentAds: {
            // Disable the extra in content ads:
            enabled: false,
            // Only launch the ads on pages longer than:
            minPageLength: 5000,
            // Don't put ads too close to each other. Desired distance between ads + one ad height:
            minOffsetDiffBetweenAds: 1800,
            // Ad height + vertical margin:
            adHeight: 280,
            // Inject at max this many extra slots:
            maxSlots: 3,
            // ... and name them:
            slotNamePrefix: 'MOBILE_IN_CONTENT_EXTRA_'
        }
    },
    adViews: [],
    appendAd: function (adSlotName, place, element) {
        // Keep in mind we always want to pass noAds parameter to the AdSlot component
        // Right now we've got three ad slots and it doesn't make sense to add assertion
        // in willInsertElement hook of the component to check if the parameters is really defined
        var view = this.createChildView(App.AdSlotComponent, {
            name: adSlotName,
            noAds: this.get('noAds')
        });
        view.createElement();
        element[place](view.$());
        this.adViews.push(view);
        view.trigger('didInsertElement');
    },
    clearAdViews: function () {
        var adView;
        while (adView = this.adViews.pop()) {
            adView.destroyElement();
        }
    },
    /**
     * Inject MOBILE_IN_CONTENT_EXTRA_* ads on selected wikis
     */
    injectMoreInContentAds: function () {
        var config = this.adsData.moreInContentAds, minDistanceBetweenAds = config.minOffsetDiffBetweenAds, expectedAdHeight = config.adHeight, slotNamePrefix = config.slotNamePrefix, maxSlots = config.maxSlots, 
        // Sorted list of top positions of ads:
        adPositions = [].concat([0], this.adViews.map(function (adView) {
            return adView.$().offset().top;
        })), 
        // Sorted list of top positions of headers:
        $headers = $('.article-content').find('> h2, > h3'), headerPositions = $headers.map(function () {
            return $(this).offset().top;
        }).get(), goodHeaders = [], adsToInject = 0, prevAdPosition, nextAdPosition, headerPosition, i = 0, headerLen = headerPositions.length, adIndex = 0, adLen = adPositions.length;
        while (i < headerLen && adIndex < adLen && adsToInject < maxSlots) {
            prevAdPosition = adPositions[adIndex];
            nextAdPosition = adPositions[adIndex + 1];
            headerPosition = headerPositions[i];
            if (headerPosition < prevAdPosition + minDistanceBetweenAds) {
                // Header too close to previous ad
                i += 1;
                continue;
            }
            if (!nextAdPosition || nextAdPosition > headerPosition + minDistanceBetweenAds) {
                // Header is located in the safe spot between previous and next ad
                goodHeaders.push($headers.eq(i));
                adsToInject += 1;
                // Use the current header position as the current ad position
                // Subtract the ad height to make the calculations work for the next headers
                adPositions[adIndex] = headerPosition - expectedAdHeight;
                continue;
            }
            // We need to find a header that's below the next ad, thus:
            adIndex += 1;
        }
        for (i = 0; i < adsToInject; i += 1) {
            Em.Logger.info('Injecting an extra in content ad before ' + goodHeaders[i].attr('id'));
            this.appendAd(slotNamePrefix + (i + 1), 'before', goodHeaders[i]);
        }
        if (!adsToInject) {
            Em.Logger.info('The page is long, but no extra in content ads were injected');
        }
    },
    injectAds: function () {
        var $firstSection = this.$('.article-content > h2').first(), $articleBody = this.$('.article-body'), firstSectionTop = ($firstSection.length && $firstSection.offset().top) || 0, articleBodyHeight = $articleBody.height(), showInContent = firstSectionTop > this.adsData.minZerothSectionLength, showPreFooter = !showInContent || articleBodyHeight > this.adsData.minPageLength, showMoreInContentAds = this.adsData.moreInContentAds.enabled && articleBodyHeight > this.adsData.moreInContentAds.minPageLength;
        this.clearAdViews();
        if (showInContent) {
            this.appendAd(this.adsData.mobileInContent, 'before', $firstSection);
        }
        if (showPreFooter) {
            this.appendAd(this.adsData.mobilePreFooter, 'after', $articleBody);
        }
        if (showMoreInContentAds) {
            this.injectMoreInContentAds();
        }
        else if (this.adsData.moreInContentAds.enabled) {
            Em.Logger.info('The page is not long enough for extra in content ads: ' + articleBodyHeight);
        }
    },
    /**
     * @desc Load ads for main page.
     * InContent ad should be displayed below curated content only when it's available.
     * Prefooter ad should be loaded above footer
     * only when trending articles and/or trending videos are loaded.
     */
    injectMainPageAds: function () {
        var $curatedContent = this.$('.curated-content'), $trendingArticles = this.$('.trending-articles'), $trendingVideos = this.$('.trending-videos'), showInContent = $curatedContent.length > 0, showPreFooter = !!($trendingArticles.length || $trendingVideos.length), $showPreFooterAfter;
        this.clearAdViews();
        if (showInContent) {
            this.appendAd(this.adsData.mobileInContent, 'after', $curatedContent);
        }
        if (showPreFooter) {
            $showPreFooterAfter = $trendingVideos.length ? $trendingVideos : $trendingArticles;
            this.appendAd(this.adsData.mobilePreFooter, 'after', $showPreFooterAfter);
        }
    },
    setupAdsContext: function (adsContext) {
        Mercury.Modules.Ads.getInstance().reload(adsContext);
    }
});
