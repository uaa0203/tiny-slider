(function ($) {

    // -----------------------------------------------------------------------------------------------------------------

    var defaultSettings = {

        // -------------------------------------------------------------------------------------------------------------

        // Parameters.

        wrapperClass: 'ts-wrapper',
        bulletClass: 'ts-bullet',
        arrowsClass: 'ts-arrows',
        arrowLeftClass: 'ts-arrow-left',
        arrowRightClass: 'ts-arrow-right',

        effect: 'ken-burns',

        effectDuration: 2000,
        transitionDuration: 500,

        width: '100%',
        height: '425px',

        startSlide: 0, // Number of start slide or 'random'. First slide has index 0.

        autoPlay: true,
        navigation: true,
        pagination: true,

        // -------------------------------------------------------------------------------------------------------------

        // Callbacks.

        onInit: function () {
        },
        onDestroy: function () {
        },
        onSlideChange: function (direction) {
            // direction = 'direct' || 'reverse'
        }

        // -------------------------------------------------------------------------------------------------------------

    };
    var settings;

    // -----------------------------------------------------------------------------------------------------------------

    // Public plugin methods.
    var methods = {

        // -------------------------------------------------------------------------------------------------------------

        destroy: function () {
            return this.each(function () {
                var $this = $(this);
                $this.unwrap('.' + settings.wrapperClass);

                settings.onDestroy.apply($this);
            });
        },

        // -------------------------------------------------------------------------------------------------------------

        showNext: function () {
            return this.each(function () {
                var $this = $(this);
                var slides = $this.find('li');
                var curSlide = slides.index($('.ts-slide-active'));
                var nextSlide = curSlide + 1;
                if ($this.data.slidesCount - 1 < nextSlide) {
                    nextSlide = 0;
                }

                methods.showSlide.apply($this, [nextSlide]);
            });
        },

        // -------------------------------------------------------------------------------------------------------------

        showPrev: function () {
            return this.each(function () {
                var $this = $(this);
                var slides = $this.find('li');
                var curSlide = slides.index($('.ts-slide-active'));
                var prevSlide = curSlide - 1;
                if (prevSlide < 0) {
                    prevSlide = $this.data.slidesCount - 1;
                }

                methods.showSlide.apply($this, [prevSlide]);
            });
        },

        // -------------------------------------------------------------------------------------------------------------

        showSlide: function (num) {
            return this.each(function () {
                var $this = $(this);
                var slides = $this.find('li');
                var curSlide = slides.index($('.ts-slide-active'));
                var direction = 'direct';

                if (num < 0) {
                    num = 0;
                }
                if (num > $this.slidesCount - 1) {
                    num = this.slidesCount - 1;
                }

                if (num < curSlide) {
                    direction = 'reverse';
                }

                if (num != curSlide) {
                    slides.eq(curSlide).removeClass('ts-slide-active');
                    slides.eq(num).addClass('ts-slide-active');

                    settings.onSlideChange.apply($this, [direction]);
                }
            });
        }

        // -------------------------------------------------------------------------------------------------------------

    };

    // -----------------------------------------------------------------------------------------------------------------

    /**
     * Internal methods for plugin needs.
     */
    var privateMethods = {

        // -------------------------------------------------------------------------------------------------------------

        /**
         * Plugin initialization.
         * @param options Init params.
         */
        init: function (options) {
            settings = $.extend({}, defaultSettings, options);

            return this.each(function () {
                var $this = $(this);
                $this.wrap('<div class="' + settings.wrapperClass + '"></div>');

                var parent = $this.parent('.' + settings.wrapperClass);
                var slides = $this.find('li');
                $this.data.slidesCount = slides.length;
                var startSlide = settings.startSlide;

                parent.css({
                    width: settings.width,
                    height: settings.height
                });

                if (settings.startSlide == 'random') {
                    startSlide = Math.floor(Math.random() * $this.data.slidesCount) + 1;
                }

                if (startSlide > $this.data.slidesCount) {
                    startSlide = $this.data.slidesCount;
                } else if (startSlide < 1) {
                    startSlide = 1;
                }

                startSlide--;

                // slides.not(':eq(' + startSlide + ')').addClass('ts-slide-hidden');
                slides.eq(startSlide).addClass('ts-slide-active');

                if (settings.autoPlay) {
                    privateMethods.addTimer.apply($this);
                }

                settings.onInit.apply($this);
            });
        },

        // -------------------------------------------------------------------------------------------------------------

        addTimer: function () {
            var $this = this;

            this.data.timerID = window.setInterval(function () {
                methods.showNext.apply($this);
            }, settings.effectDuration);
        },

        // -------------------------------------------------------------------------------------------------------------

        removeTimer: function () {
            clearInterval(this.data.timerID);
        }

        // -------------------------------------------------------------------------------------------------------------

    };

    // -----------------------------------------------------------------------------------------------------------------

    $.fn.tinySlider = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else {
            if (typeof method === 'object' || !method) {
                return privateMethods.init.apply(this, arguments);
            } else {
                $.error('Method ' + method + ' does not exists in jQuery.tinySlider');
            }
        }
    };

    // -----------------------------------------------------------------------------------------------------------------

})(jQuery);