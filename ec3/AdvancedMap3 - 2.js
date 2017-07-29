/**
* ol3+echarts3 迁徙
*
*/
/**
 * ADMap 命名空间
 * @type {Object}
 */
var ADMap={
	_VERSION:1
}

/**
 * Util 工具类
 * @type {Object}
 */
ADMap.Util={};
/**
 * 将源类中不为undefined的属性拷贝到目标类中
 * @param  {function} destination  目标类
 * @param  {function} source 源类
 * @public
 */
ADMap.Util.extend=function (destination, source) {
    destination = destination || {};
    if (source) {
        for (var property in source) {
            var value = source[property];
            if (value !== undefined) {
                destination[property] = value;
            }
        }
    }
    return destination;
}
/**
 * 继承方法，子类会完全继承父类原型中的方法。支持多重继承
 * @param  {function} Child  子类
 * @param  {function} Parent 父类
 * @public
 */
ADMap.Util.inherit = function(C, P) {
   var F = function() {};
   F.prototype = P.prototype;
   C.prototype = new F;

   //用于多重继承
   var i, l, o;
   for(i=2, l=arguments.length; i<l; i++) {
       o = arguments[i];
       if(typeof o === "function") {
           o = o.prototype;
       }
       ADMap.Util.extend(C.prototype, o);
   }
};
/**
 * Event 事件类
 * @type {Object}
 */
ADMap.Event={
	FRONT:0,
	observers:false,
	listeners:{},
	listenerCount:{},
	/**
	 * addListener 注册事件
	 * @param {string} type     事件类型
	 * @param {object} obj      上下文
	 * @param {function} func   监听器
	 * @param {boolean} priority 优先级
	 */
	addListener:function(type,obj,func,priority){
		var listeners=ADMap.Event.listeners[type];
		if(!listeners){
			listeners=[];
			ADMap.Event.listeners[type]=listeners;
			listenerCount[type]=listenerCount[type]++;
		}

		if(!obj){
			obj=this;
		}

		var listener = {obj: obj, func: func};
		if(priority){
			//插入开头
			listeners.splice(ADMap.Event.FRONT,0,listener);
		}else{
			listeners.push(listener);
		}
	},
	removeListener:function(type,func){
		var listeners=ADMap.Event.listeners[type];
		if(listeners){
			for(var i=0;i<listeners.length;i++){
				if(func===listeners[i]){
					listeners.splice(i,1);
				}
			}
		}
	}
};

ADMap.UUID={
	get:function() {
	    var s = [];
	    var hexDigits = "0123456789abcdef";
	    for (var i = 0; i < 36; i++) {
	        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
	    }
	    s[14] = "4";
	    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);

	    s[8] = s[13] = s[18] = s[23] = "-";

	    var uuid = s.join("");
	    return uuid;
	}
}

ADMap.Element={
	/**
	 * 创建绝对定位div
	 * @param id div id
	 * @param style 样式的对象
	 */
	createDiv:function(id,style){
		if(!id){
			return console.error("id不能为空");
		}
		var div=document.createElement('div');
		div.id=id;
		div.style.position='absolute';
		ADMap.Element.modifyDomStyle(div,style);

		return div;
	},
	/**
	 * 修改dom元素的样式相关属性
	 * @param dom
	 * @param style
	 */
	modifyDomStyle:function(dom,style){
		if(style.height){
			dom.style.height=style.height;
		}
		if(style.width){
			dom.style.width=style.width;
		}
		if(style.border){
			dom.style.border=style.border;
		}
		if(style.transition){
			dom.style.transition=style.transition;
		}
		if(style.color){
			dom.style.color=style.color;
		}
		if(style.lineHeight){
			dom.style.lineHeight=style.lineHeight;
		}
		if(style.borderRadius){
			dom.style.borderRadius=style.borderRadius;
		}
		if(style.textAlign){
			dom.style.textAlign=style.textAlign;
		}
		if(style.backgroundColor){
			dom.style.backgroundColor=style.backgroundColor;
		}
		if(style.zIndex){
			dom.style.zIndex=style.zIndex;
		}
		if(style.top){
			dom.style.top=style.top;
		}
		if(style.left){
			dom.style.left=style.left;
		}
	},
	/**
	 * 设置dom元素的绝对位置
	 * @param dom 需要设定位置的dom元素
	 * @param pos top，left数组,number
	 */
	setDomPosition:function(dom,pos){
		dom.style.top=pos[0]+"px";
		dom.style.left=pos[1]+"px";
	},
	/**
	 * 设置dom的内容
	 * @param inner 内容，可为文字，html
	 */
	setDomContent:function(dom,inner){
		dom.innerHTML=inner;
	},
	/**
	 * 在dom后追加元素，不指定id就在body后追加
	 * @param dom
	 * @param id
	 * @returns
	 */
	append:function(dom,id){
		if(typeof dom =="string"){
			if(!id){
				return document.body.innerHTML=dom;
			}
			var target=document.getElementById(id);
			if(target){
				return target.innerHTML=dom;
			}
		}else{
			if(!id){
				return document.body.appendChild(dom);
			}
			var target=document.getElementById(id);
			if(target){
				return target.appendChild(dom);
			}
		}
	},
	getDomStyle:function(dom,attr){
		return dom.style[attr];
	},
	getDomCenter:function(dom,id){
		var outer_h='100%',outer_w='100%',inner_h=0,inner_w=0;
		if(!id){
			outer_h=document.body.offsetHeight;
			outer_w=document.body.offsetWidth;
		}else{
			var outer=document.getElementById(id);
			if(outer){
				outer_h=ADMap.Element.getDomStyle(outer,'height');
				outer_w=ADMap.Element.getDomStyle(outer,'width');
			}else{
				return console.error("未能找到id为"+id+"的元素");
			}
		}

		if(dom){
			inner_h=ADMap.Element.getDomStyle(dom,'height');
			inner_w=ADMap.Element.getDomStyle(dom,'width');
		}else{
			return console.error("未提供dom元素");
		}

		return [(parseInt(outer_h)-parseInt(inner_h))/2,(parseInt(outer_w)-parseInt(inner_w))/2];
	},
};



/**
 * AdvancedLayer
 * @param {object} option map,echart,type
 */
ADMap.BaseLayer=function(option){
	this._map=option.map;
	this._echart=option.echart;
	this._type=option.type;
	this._option=null;
};
ADMap.BaseLayer.prototype.getMap=function(){
	return this._map;
};
ADMap.BaseLayer.prototype.getECharts=function(){
	return this._echart;
};
ADMap.BaseLayer.prototype.getType=function(){
	return this._type;
};
ADMap.BaseLayer.prototype.geoCoord2Pixel = function (geoCoord) {
    return this._map.getPixelFromCoordinate(geoCoord);
};
ADMap.BaseLayer.prototype.pixel2GeoCoord = function (pixel) {
    return this._map.getCoordinateFromPixel(pixel);
};
ADMap.BaseLayer.prototype.setOption=function(option,notMerge){
	this._option=option;
	this._ec.setOption(option,notMerge);
};

/**
* 绑定地图事件的处理方法
*
* @private
*/
AdvancedMap.prototype._bindEvent = function () {
    this._map.on('precompose',this._moveHandler('precompose'));
    this._map.on('moveend', this._moveHandler('moveend'));
    this._map.on('pointerdrag', this._moveHandler('pointerdrag'));

    //occuring before the zoom is triggered.
    this._map.getView().on('change:resolution', this._moveHandler('zoomstart'));

    window.addEventListener("resize", this._ec.resize, false);
};

/**
* 地图移动、如拖拽触发事件
*
* @param {string} type moving | moveend  移动中|移动结束
* @return {Function}
* @private
*/
AdvancedMap.prototype._moveHandler = function (type) {
    var _this = this;
    this['_'+type]=function (e) {
        _this._fireEvent(e);
    };
    return this['_'+type];
};

/**
 * _unbindEvent 接触事件绑定
 * @return {void}
 */
AdvancedMap.prototype._unbindEvent = function () {
    this._map.un('precompose',this['_precompose'])
    this._map.un('moveend', this['_moveend']);
    this._map.un('pointerdrag', this['_pointerdrag']);

    //occuring before the zoom is triggered.
    this._map.getView().un('change:resolution', this._moveHandler('_zoomstart'));
};

ADMap.MigrationLayer.prototype._bindEvent=function(){
	var _this=this;
	this._map.getView().on('change:resolution',function(evt){
		this._echartsContainer.style.visibility="hidden";
	},_this);
	this._map.on('precompose',function(evt){
		var series=new ADMap.Source({
			data:_this._source,
			map:_this._map
		}).migration();

		this.setOption({
			series:series
		});
		this.refresh();
		this._echartsContainer.style.visibility="visible";
	},_this);
	this._map.on('moveend',function(evt){
		var series=new ADMap.Source({
			data:_this._source,
			map:_this._map
		}).migration();

		this.setOption({
			series:series
		});
		this._echartsContainer.style.visibility="visible";
	},_this);
	this._map.on('change:size',function(evt){
		var e=this._echartsContainer.parentNode.parentNode.parentNode;
		this._mapOffset=[-parseInt(e.style.left)||0,-parseInt(e.style.top)||0];
		this._echartsContainer.style.left=this._mapOffset[0]+"px";
		this._echartsContainer.style.top=this._mapOffset[1]+"px";
		setTimeout(function(){
			this._ec.resize();
		},200);
		this._echartsContainer.style.visibility="visible";
	},_this);
};

/**
 * _zoomChanged 标志地图是否缩放
 * @type {Boolean}
 */
ADMap.BaseLayer.prototype._zoomChanged=false;
/**
 * _ismoving 标志地图是否在移动，移动结束为false
 * @type {Boolean}
 */
ADMap.BaseLayer.prototype._ismoving=false;
/**
* 触发事件
*
* @param {stirng}  type 事件类型
* @private
*/
ADMap.BaseLayer.prototype._fireEvent = function (e) {
    this._zoomChanged=false;
    var curZoomLevel=this._map.getView().getZoom();
    if(curZoomLevel!=this._preZoomLevel){
        this._zoomChanged=true;
    }

    var series=new ADMap.Source({
		data:_this._source,
		map:_this._map
	}).migration();

	this.setOption({
		series:series
	});

    var _this=this;
    switch (e.type) {
        case 'precompose':
            //保证只有在地图被移动的时候才执行该刷新方法
            if(_this._zoomChanged){
                return;
            }

            if(!_this._ismoving){
                return;
            }

            this.refresh(false);
            break;
        case 'moveend':
            if(_this._zoomChanged){
                return;
            }

            if(_this._ismoving){
                _this._ismoving=false;
            }

            setTimeout(function(){
                _this.refresh(true);
                _this._echartsContainer.style.display = "block";
            },200);

            break;
        case 'change:resolution':
            this._echartsContainer.style.display = "none";
            this.refresh(false);

            setTimeout(function(){
                _this.refresh(true);
                _this._echartsContainer.style.display = "block";

                if(_this._zoomChanged){
                    _this._preZoomLevel=curZoomLevel;
                    _this._zoomChanged=false;
                }
            },500);
            break;
        case 'pointerdrag':
            if(!this._ismoving){
                this._ismoving=true;
            }
            break;
    }
};
/**
 * refresh 刷新专题图
 * @param  {Boolean} isAnimation 是否开启动画
 * @return {void}
 */
ADMap.BaseLayer.prototype.refresh = function (isAnimation) {
    if(typeof isAnimation == 'undefined'){
        isAnimation=true;
    }

    if (this._ec) {
        var option = this._ec.getOption();
        var component = this._ec.component || {};
        var legend = component.legend;
        var dataRange = component.dataRange;

        if (legend) {
            option.legend.selected = legend.getSelectedMap();
        }

        if (dataRange) {
            option.dataRange.range = dataRange._range;
        }

        if(this._type==AdvancedMap.Type.Migration){
            if(!isAnimation){
                option.animation=false;
                this._pauseLineAnimation(option);
            }else if(isAnimation){
                option.animation=true;
                this._startLineAnimation(option);
            }
        }

        this._ec.clear();
        this.setOption(option,true);
    }
};


ADMap.MigrationLayer=function(option){
	ADMap.BaseLayer.call(this,option);
	// this._map=option.map;
	// this._echart=option.echart;
	// this._type=option.type;
	this._ec=null;
	this._source=option.source;

	var size=this._map.getSize();

	this._echartsContainer=ADMap.Element.createDiv('eccontainer_overlay',{
		height:size[1]+'px',
		width:size[0] + 'px',
		top:'0px',
		left:'0px',
		zIndex:999
	});

	this._mask=ADMap.Element.createDiv('mask_overlay',{
		height:size[1]+'px',
		width:size[0] + 'px',
		top:'0px',
		left:'0px',
		backgroundColor:'rgba(0, 0, 0, 0.4)',
		zIndex:998
	});

    this._map.getViewport().appendChild(this._echartsContainer);
    this._map.getViewport().appendChild(this._mask);
};
ADMap.Util.inherit(ADMap.MigrationLayer,ADMap.BaseLayer);

ADMap.MigrationLayer.prototype.initEChart=function(){
	this._ec=this._echart.init(this._echartsContainer);
	this._bindEvent();
};


ADMap.Source=function(option){
 	this._data=option.data;
 	this._map=option.map;
};

ADMap.Source.prototype.migration=function(){
	var planePath = 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z';
	var _this=this;
	var color = ['#a6c84c', '#ffa022', '#46bee9'];
    var series = [];
	this._data.forEach(function (item, i) {
        series.push({
            name: item[0] + ' Top10',
            type: 'lines',
            zlevel: 1,
            effect: {
                show: true,
                period: 6,
                trailLength: 0.7,
                color: '#fff',
                symbolSize: 3
            },
            lineStyle: {
                normal: {
                    color: color[i],
                    width: 0,
                    curveness: 0.2
                }
            },
            data: _this.migrationFormatter(item[1])
        },
        {
            name: item[0] + ' Top10',
            type: 'map',
            mapType: 'china',
                type: 'lines',
                zlevel: 2,
                effect: {
                    show: true,
                    period: 6,
                    trailLength: 0,
                    symbol: planePath,
                    symbolSize: 15
                },
                lineStyle: {
                    normal: {
                        color: color[i],
                        width: 1,
                        opacity: 0.4,
                        curveness: 0.2
                    }
                },
                data: _this.migrationFormatter(item[1])
            },
        {
            name: item[0] + ' Top10',
            type: 'map',
            mapType: 'china',
            type: 'effectScatter',
            coordinateSystem: 'geo',
            zlevel: 2,
            rippleEffect: {
                brushType: 'stroke'
            },
            label: {
                normal: {
                    show: true,
                    position: 'right',
                    formatter: '{b}'
                }
            },
            symbolSize: function (val) {
                return val[2] / 8;
            },
            itemStyle: {
                normal: {
                    color: color[i]
                }
            },
            data: item[1].map(function (dataItem) {
                return {
                    name: dataItem[1].name,
                    value: _this._map.getPixelFromCoordinate(geoCoordMap[dataItem[1].name]).concat([dataItem[1].value])
                };
            })
        });
    });

	return series;
};
ADMap.Source.prototype.migrationFormatter=function(data){
	var map=this._map;
	var res = [];
    for (var i = 0; i < data.length; i++) {
        var dataItem = data[i];
        var fromCoord = map.getPixelFromCoordinate(geoCoordMap[dataItem[0].name]);
        var toCoord = map.getPixelFromCoordinate(geoCoordMap[dataItem[1].name]);
        if (fromCoord && toCoord) {
            res.push({
                fromName: dataItem[0].name,
                toName: dataItem[1].name,
                coords: [fromCoord, toCoord]
            });
        }
    }
    console.log(res);
    return res;
};
