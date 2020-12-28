/**
 * 轮播图插件  for  jQuery
 */

(function() {
    // 构造函数保存轮播图数据
    function Swiper(options, wrap) {
        this.width = options.width || 500
        this.height = options.height || 400
        this.domList = options.domList || []
        this.times = options.times || 3000
        this.showSpots = typeof options.showSpots === 'boolean' ? options.showSpots : false
        this.type = options.type || 'fade'
        this.isAuto = typeof options.isAuto === 'boolean' ? options.isAuto : false
        this.changeBtn = options.changeBtn || 'always'
        this.spotsPosition = options.spotsPosition || 'left'
        this.spotStyle = options.spotStyle || {}
        this.selectedColor = options.selectedColor || ''
        this.len = this.domList.length
        this.wrap = wrap
        this.nowIndex = 0
        this.item = null
        this.lock = false
        this.timer = null
    }

    // 写在原型对象是为了减少内存
    Swiper.prototype.init = function() {
        this.createBox()
        this.initStyle()
        this.bindEvent()
        if (this.isAuto) {
            this.autoChange()
        }
    }

    Swiper.prototype.createBox = function() {
        var swiperWrapper = $('<div class="jq-swiper-box"></div>')
        var swiperContent = $('<ul class = "jq-swiper-content"></ul>')
        var swiperSpots = $('<div class="jq-swiper-spots"></div>')
        for (var i = 0; i < this.len; i++) {
            $('<li class="jq-swiper-item"></li>').html(this.domList[i])
                .appendTo(swiperContent)
            $('<span></span>').appendTo(swiperSpots)
        }
        if (this.type === 'animate') {
            $('<li class="jq-swiper-item"></li>').html($(this.domList[0]).clone())
                .appendTo(swiperContent)
        }
        var lbtn = $('<div class="jq-swiper-btn jq-swiper-lbtn">&lt;</div>')
        var rbtn = $('<div class="jq-swiper-btn jq-swiper-rbtn">&gt;</div>')
        swiperWrapper.append(swiperContent)
            .append(swiperSpots)
            .append(lbtn)
            .append(rbtn)
            .addClass('jq-swiper-' + this.type)
            .appendTo(this.wrap)
    }

    Swiper.prototype.initStyle = function() {
        var select = $('.jq-swiper-box', this.wrap).find('.jq-swiper-spots > span')
        var jqItem = $('.jq-swiper-box', this.wrap).find('.jq-swiper-content')
        this.item = jqItem
        $('.jq-swiper-box', this.wrap).css({
            width: this.width,
            height: this.height
        }).find('.jq-swiper-content').css({
            width: this.type === 'animate' ? (this.len + 1) * this.width : this.width,
            height: this.height
        }).find('.jq-swiper-item').css({
            width: this.width,
            height: this.height,
        })

        if (!this.showSpots) {
            $(this.wrap).find('.jq-swiper-box > .jq-swiper-spots').css({
                display: 'none'
            })
        }

        // console.log('111', select.end().find())
        this.changeBtnStyle($(this.wrap).find('.jq-swiper-box'), select.end().find('.jq-swiper-btn'))

        select.eq(this.nowIndex).addClass('jq-swiper-current')

        $('.jq-swiper-box', this.wrap).find('.jq-swiper-spots').css({
            textAlign: this.spotsPosition
        })

        if (JSON.stringify(this.spotStyle) !== '{}') {
            select.css(this.spotStyle)
        }
        if (this.selectedColor) {
            $('.jq-swiper-box', this.wrap).find('.jq-swiper-spots > .jq-swiper-current').css({
                backgroundColor: this.selectedColor
            })
        }
    }

    Swiper.prototype.changeBtnStyle = function(dom, target) {
        switch (this.changeBtn) {
            case 'hide':
                target.css({ display: 'none' })
                break;
            case 'hover':
                target.css({ display: 'none' })
                dom.hover(function() {
                    target.fadeIn()
                }, function() {
                    target.fadeOut()
                })
                break;
        }
    }

    Swiper.prototype.bindEvent = function() {
        var _this = this
        _this.changeAnimate()
        $(this.wrap).find('.jq-swiper-box')
            .mouseenter(function() {
                clearInterval(_this.timer)
            }).mouseleave(function() {
                _this.autoChange()
            })
            .find('.jq-swiper-lbtn')
            .click(function(e) {
                e.preventDefault();
                if (_this.lock) {
                    return
                }
                _this.lock = true
                if (_this.nowIndex === 0) {
                    if (_this.type === 'animate') {
                        $(_this.wrap).find('.jq-swiper-box > .jq-swiper-content').css({
                            left: -(_this.len * _this.width)
                        })
                    }
                    _this.nowIndex = _this.len - 1
                } else {
                    _this.nowIndex--
                }
                _this.changeAnimate()
            }).end().find('.jq-swiper-rbtn')
            .click(function() {
                if (_this.lock) {
                    return
                }
                _this.lock = true
                if (_this.type === 'fade') {
                    if (_this.nowIndex === _this.len - 1) {
                        _this.nowIndex = 0
                    } else {
                        _this.nowIndex++
                    }
                } else if (_this.type === 'animate') {
                    if (_this.nowIndex === _this.len) {
                        $(_this.wrap).find('.jq-swiper-box > .jq-swiper-content').css({
                            left: 0
                        })
                        _this.nowIndex = 1
                    } else {
                        _this.nowIndex++
                    }
                }
                _this.changeAnimate()
            });

        $(this.wrap).find('.jq-swiper-box > .jq-swiper-spots').find('span')
            .click(function(e) {
                _this.nowIndex = $(this).index()
                _this.changeAnimate()
            })
    }

    Swiper.prototype.changeAnimate = function() {
        var _this = this
        if (this.type === 'fade') {
            // console.log(this.item.eq(this.nowIndex))
            this.item.find('.jq-swiper-item').eq(this.nowIndex).fadeIn(function() {
                _this.lock = false
            }).siblings().fadeOut()
        } else if (this.type === 'animate') {
            $(this.wrap).find('.jq-swiper-box > .jq-swiper-content').animate({
                left: -(this.nowIndex * this.width)
            }, function() {
                _this.lock = false
            })
        }
        $(this.wrap).find('.jq-swiper-box > .jq-swiper-spots').find('span')
            .eq(this.nowIndex % this.len).addClass('jq-swiper-current').siblings().removeClass('jq-swiper-current')
    }

    Swiper.prototype.autoChange = function() {
        var _this = this
        this.timer = setInterval(function() {
            $(_this.wrap).find('.jq-swiper-box > .jq-swiper-rbtn').click()
        }, this.times)
    }

    $.fn.extend({
        swiper: function(options) {
            var swiperDemo = new Swiper(options, this)
            swiperDemo.init()
        }
    })
})()