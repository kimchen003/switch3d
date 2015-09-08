/*
 * Switch3d 1.0.0
 * PC terminal 3D switching carousel
 *
 * http://www.one-pieces-html5.com/Switch3d/
 *
 * Copyright 2015-2020, kim Chen
 * Plagiarism shameful learning without
 * Love front end love Feng Min
 *
 * Released on: September 1, 2015
*/

var Switch3d = function(selector, params){
    'use strict';

    /*=========================
    _this
    ===========================*/
    var _this = this;

    /*=========================
      Default Parameters
      ===========================*/
    var defaults = {
        eventTarget : 'switch', // or 'container'
        defaultIndex : 0,
        amountX : 5,
        // Autoplay
        autoplay : true,
        autoplayStopOnLast : false,
        //Loop mode
        loop : true,
        //source
        img : [],
        controlDirs:'',
        //delay
        cubeDelay : 0.01,
        cubeDelayRandom : false,
        switchDelay : 3000,
        //nav
        prevBtn : ".hd .prev",
        nextBtn : ".hd .next"
    };
    _this.params = $.extend(defaults, params);

    // dom
    _this.id = (new Date()).getTime();
    _this.container = $(selector);
    _this.bd = $(selector).find(".bd").eq(0);
    _this.dirs = ['up','right','down','left'];
    _this.isMoved = false;
    _this.activeIndex = _this.params.defaultIndex || 0;
    _this.centerIndex = 0;
    _this.activeLoaderIndex = 0;
    _this.previousIndex = null;
    _this.velocity = 0;
    _this.snapGrid = [];
    _this.imagesToLoad = [];
    _this.imagesLoaded = 0;
    _this.isAndroid = navigator.userAgent.toLowerCase().indexOf('android') >= 0;
    //Calculation block
    _this.width = _this.container.width();
    _this.height = _this.container.height();
    _this.conArea = _this.width*_this.height;
    _this.cubeSize = _this.width/_this.params.amountX;
    _this.cubeArea =parseInt(_this.cubeSize * _this.cubeSize);
    _this.amountY = parseInt(_this.conArea/_this.cubeArea/_this.params.amountX);
    _this.max = _this.params.amountX * _this.amountY;
    // nav
    _this.prev = _this.container.find(_this.params.prevBtn).eq(0);
    _this.next = _this.container.find(_this.params.nextBtn).eq(0);
    // timer
    _this.timer = [];

    _this.init();

    /*=========================
      Switch3d API
      ===========================*/
    _this._extendSwiperSlide = function  (el) {

    };
}

/*=========================
  build Switch3d
  ===========================*/
Switch3d.prototype = {
    init : function(){
        var _this = this;
        _this.addCube();
        _this.addEventListener();

        if(!_this.autoplay)return;
        _this.autoplay();
    },
    addCube : function(){
        var _this = this;
        var cubeSize = _this.cubeSize;
        var now_imgUrl = _this.params.img[_this.params.defaultIndex];
        var next_imgUrl = _this.params.img[_this.params.defaultIndex+1];

        var cubeStyle = 'style="'
                            +'animation-delay:_delay_s;'
                            +'flex:0 0 '+ _this.cubeSize +'px;'
                            +'height:'+ _this.cubeSize +'px;'
                        +'"';

        var sideStyle = 'style="'
                            +'background:url(_background_);'
                            +'background-position: _bpx_px _bpy_px;'
                            +'transform: rotate(_rotate_deg) rotateY(_rotateY_deg) translateZ(_translateZ_px);'
                            +'width:'+ _this.cubeSize +'px;'
                            +'height:'+ _this.cubeSize +'px;'
                            +'background-size:'+ _this.width +'px '+ _this.height +'px;'
                        +'"';

        for(var i=0;i<_this.max;i++){
            var dir = _this.dirs[parseInt(Math.random()*4,10)];
            var amountX = _this.params.amountX;
            var amountY = _this.amountY;
            var bpx,bpy;

            var bpx = -i%amountX*cubeSize;
            var bpy = -parseInt(i/amountX)*cubeSize;

            var front_sideStyle = sideStyle.replace("_rotate_",0).
                                            replace("_rotateY_",0).
                                            replace("_translateZ_",cubeSize/2).
                                            replace("_background_",now_imgUrl).
                                            replace("_bpy_",bpy).
                                            replace("_bpx_",bpx);

            var right_sideStyle = sideStyle.replace("_rotate_",0).
                                            replace("_rotateY_",90).
                                            replace("_translateZ_",cubeSize/2).
                                            replace("_background_",next_imgUrl).
                                            replace("_bpy_",bpy).
                                            replace("_bpx_",bpx);

            var back_sideStyle = sideStyle.replace("_rotate_",180).
                                           replace("_rotateY_",180).
                                           replace("_translateZ_",cubeSize/2).
                                           replace("_background_",next_imgUrl).
                                           replace("_bpy_",bpy).
                                           replace("_bpx_",bpx);

            var left_sideStyle = sideStyle.replace("_rotate_",0).
                                           replace("_rotateY_",270).
                                           replace("_translateZ_",cubeSize/2).
                                           replace("_background_",next_imgUrl).
                                           replace("_bpy_",bpy).
                                           replace("_bpx_",bpx);

            var top_sideStyle = sideStyle.replace("_rotate_",0).
                                          replace("rotateY(_rotateY_deg)","rotateX(90deg)").
                                          replace("_translateZ_",cubeSize/2).
                                          replace("_background_",next_imgUrl).
                                          replace("_bpy_",bpy).
                                          replace("_bpx_",bpx);

            var bottom_sideStyle = sideStyle.replace("_rotate_",0).
                                             replace("rotateY(_rotateY_deg)","rotateX(-90deg)").
                                             replace("_translateZ_",cubeSize/2).
                                             replace("_background_",next_imgUrl).
                                             replace("_bpy_",bpy).
                                             replace("_bpx_",bpx);

            var delay = _this.params.cubeDelayRandom?Math.random()*_this.max*_this.params.cubeDelay:i*_this.params.cubeDelay;

            _this.bd.append(
                '<div class="cube" '+cubeStyle.replace("_delay_",delay)+'>'
                    +'<div class="side front" '+front_sideStyle+'></div>'
                    +'<div class="side right" '+right_sideStyle+'></div>'
                    +'<div class="side back" '+back_sideStyle+'></div>'
                    +'<div class="side left" '+left_sideStyle+'></div>'
                    +'<div class="side top" '+top_sideStyle+'></div>'
                    +'<div class="side bottom" '+bottom_sideStyle+'></div>'
                +'</div>'
            );
        };
    },
    updateSwitch : function(now,next,_this){
        _this.isMoved = true;
        var cube = _this.container.find(".cube");
        var cubeLength = cube.length;

        var now_imgUrl = "url("+_this.params.img[now]+")";
        var next_imgUrl = "url("+_this.params.img[next]+")";

        _this.container.find(".side").not(".side.front").each(function(i,c){
            $(this).css({"backgroundImage":next_imgUrl})
        });

        _this.container.find(".side.front").each(function(i,c){
            $(this).css({"backgroundImage":now_imgUrl})
        });

        cube.each(function(i,c){
            var that = $(this);
            var index = i;
            var delay = _this.params.cubeDelayRandom?Math.random()*_this.max*_this.params.cubeDelay:i*_this.params.cubeDelay;
            var dir = _this.params.controlDirs!="" ? _this.params.controlDirs : _this.dirs[parseInt(Math.random()*4,10)];

            that.attr("class","cube");
            setTimeout(function(){
                that.addClass("sliding").addClass(dir);
            }, 30);

            if(i>=cubeLength-1){
                $(this).on('webkitAnimationEnd animationend',function(){
                    _this.isMoved = false;
                });
            }

        });

    },
    changeSwitch : function(n,_this){
        if(_this.isMoved)return;

        var nowIndex = _this.activeIndex;
        if(_this.params.loop){

            if(_this.activeIndex + n > _this.params.img.length-1){
                n = 0;
            }else if(_this.activeIndex + n < 0){
                n = _this.params.img.length-1;
            }else{
                n = _this.activeIndex + n
            }

        }else{

           if(_this.activeIndex + n > _this.params.img.length-1){
                n = _this.params.img.length-1;
                return;
            }else if(_this.activeIndex + n < 0){
                n = 0;
                return;
            }else{
                n = _this.activeIndex + n
            }

        }

        _this.activeIndex = n;
        _this.updateSwitch(nowIndex,_this.activeIndex,_this);
    },
    addEventListener : function(){
        var _this = this;

        _this.onPrev();
        _this.onNext();
    },
    onPrev : function(){
        var _this = this;

        _this.prev.on("click",function(){
            _this.changeSwitch(-1,_this);
        });
    },
    onNext : function(){
        var _this = this;

        _this.next.on("click",function(){
            _this.changeSwitch(1,_this);
        });
    },
    autoplay : function(){
        var _this = this;
        setInterval(function(){
            _this.changeSwitch(1,_this);
        },_this.params.switchDelay)
    }
}

/*=========================
  jQuery Plugins
  ===========================*/

!(function ($) {
    'use strict';
    $.fn.Switch3d = function (params) {
        this.each(function (i,c) {
            var that = $(this);
            var s = new Switch3d(that[0], params);
        });
    };
})(window.jQuery);

// component
if (typeof(module) !== 'undefined'){
    module.exports = Switch3d;
}