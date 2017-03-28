window.Avatar = function(){
    var
    self              = {},
    imgSize           = 480,
    uiRadius          = 0.395,
    radToDeg          = 180 / Math.PI,
    degToRad          = Math.PI / 180,
    isMobile          = /iphone|ipod|ipad|android|mobile/i.test(navigator.userAgent),
    normalizeAngle    = function(a){a = a < 0 ? 360 + a : a; return Math.abs(a > 360 ? 0 : a);},
    getRandomKey      = function(o, range){var k = Object.keys(o); return range || k.length ? k[k.length > 1 ? Math.floor(Math.random() * (range && range < k.length ? range : k.length)) : 0] : null;},
    activateElement   = function(el, s){el = typeof(el) === 'string' ? document.querySelector(el) : el; el && el.classList[s ? 'add' : 'remove']('active');},
    notification      = function(html, holder){
        var div = document.createElement('DIV');
        div.className = 'a-notification';
        div.innerHTML = '<p>' + html + '</p>';
        (holder || document.body).appendChild(div);
        window.setTimeout(function(){div.classList.add('active');}, 100);
        window.setTimeout(function(){(holder || document.body).removeChild(div)}, 5000);
    },
    passiveEventsOptions = true;
    try{window.addEventListener('test', null, Object.defineProperty({}, 'passive', {get:function(){
        passiveEventsOptions = {passive:true};
    }}));}catch(e){};    
    
    var
    storage = (function(){
        var o = this;
        o.is = Boolean(window['localStorage']) || false;
        o.save = function(key, value, saveEmpty){
            if(!o.is){return false;};
            try{
                if(value || saveEmpty){
                    localStorage.setItem(key, JSON.stringify(value));
                }else{
                    localStorage.removeItem(key);
                };
            }catch(e){
                // 5 MB quota
            };
            return o;
        };
        o.load = function(key){
            if(!o.is){return null;};
            var str = localStorage.getItem(key);
            if(str){
                try{
                    var data = JSON.parse(str);
                    return data;
                }catch(e){
                    return undefined;
                };
            }else{
                return undefined;
            };
        };
        o.delete = function(key){
            if(!o.is){return null;};
            localStorage.removeItem(key);
            return o;
        };
        o.clear = function(list){
            if(!o.is){return null;};
            list ? list.forEach(list, function(key){o.delete(key);}) : localStorage.clear();
            return o;
        };
        o.list = function(){
            var i, list = [];
            if(!o.is){return list;};
            for(i = 0; i < localStorage.length; i++){list.push(localStorage.key(i));};
            return list;
        };
        return o;
    }).call({}),

    classOptions = function(){
        var
        o             = {},
        _holder       = null,
        _class        = '',
        _position     = null,
        _angle        = null,
        _arcAngle     = 360,
        _snapAngle    = 1,
        _allOptions   = {},
        _stringify    = '',
        _onActive     = null,
        _onSet        = null,
        _cssPreffix   = '',
        _audio        = null,  

        removeOptions = function(){
            o.forOptions(function(option){option.element.parentElement.removeChild(option.element);});
            _allOptions = {};
            _snapAngle  = 1;
            _position   = null;
            _angle      = null;
            _arcAngle   = 360;
        },
        addOption = function(angle, value){
            var data, el = document.createElement('LI'), pos = Math.round(angle / o.snapAngle);
            el.dataset.angle = angle;
            el.dataset.position = pos;
            el.dataset.value = value;
            el.className = ['option', _class].join(' ');
            el.style.height = uiRadius + 'em';
            el.style.transform = el.style.webkitTransform = el.style.msTransform = 'rotateZ(' + angle + 'deg)';
            data = {angle:angle, position:pos, value:value, element:el};
            _allOptions[angle] = data;
            _holder.insertBefore(el, _holder.firstChild);
            return data;
        };

        o.init = function(params){
            //{selector:'', list:[], onActive:null, onSet:null, cssClass:'', arcAngle:360, audion:'', cssPreffix:''}
            _class      = params.cssClass || '';
            _onActive   = params.onActive;
            _onSet      = params.onSet;
            _cssPreffix = params.cssPreffix;
            _holder     = document.querySelector(params.selector);
            if(params.audio){
                _audio = document.createElement('audio');
                _audio.src = params.audio;
            };

            if(!_holder){return 0;};

            var onClick = function(evt){
                if(evt.target.parentElement == _holder && typeof(evt.target.dataset.angle) != 'undefined'){
                    o.currentAngle = evt.target.dataset.angle;
                    evt.target.classList.add('tap');
                    window.setTimeout(function(){evt.target.classList.remove('tap');}, 500);
                    evt.stopPropagation();
                    //evt.preventDefault();
                    return false;
                };
            };
            _holder.classList.add(_cssPreffix + 'options-holder');
            _holder.addEventListener(isMobile ? 'touchstart' : 'mousedown', onClick, passiveEventsOptions);
            if(params.list && params.list.length){o.setOptions(params.list || []);};
            return o;
        };
        o.forOptions = function(callback){
            if(typeof(callback) != 'function'){return;};
            for(var key in _allOptions){if(callback(_allOptions[key])){return;};};
            return o;
        };
        o.setOptions = function(list, newArcAngle){
            var str = JSON.stringify(list), a = (newArcAngle != undefined ? newArcAngle : _arcAngle) || 360;
            if(_stringify == str && _arcAngle == a){return o;};
            removeOptions();
            _stringify = str;
            _arcAngle = a;
            _snapAngle = normalizeAngle(_arcAngle / list.length);
            for(var i = 0, l = list.length; i < l; i++){addOption(o.snapAngle * i, list[i]);};
            typeof(_onSet) === 'function' && _onSet.call(o);
            return o;
        };
        o.tick = function(){
            if(_audio){
                _audio.pause();
                window.setTimeout(function(){_audio.paused && _audio.play();}, 150);
            };
            return o;
        };
        o.rotate = function(angle){
            _holder.style.transform = _holder.style.webkitTransform = _holder.style.msTransform = 'rotateZ(' + angle + 'deg)';
            return o;
        };
        Object.defineProperty(o, 'count', {
            get: function(){return Object.keys(_allOptions).length;}
        });
        Object.defineProperty(o, 'snapAngle', {
            get: function(){return _snapAngle || 1;}
        });
        Object.defineProperty(o, 'currentOption', {
            get: function(){return _allOptions[_angle] || null;}
        });
        Object.defineProperty(o, 'currentAngle', {
            get: function(){return _angle || 0;},
            set: function(val){
                val = normalizeAngle(val);
                if(val === _angle){return;};
                _position = Math.round(val / o.snapAngle);
                var a = o.currentPosition * o.snapAngle;
                if(_angle !== a){
                    _angle = a;
                    o.forOptions(function(option){activateElement(option.element, false);});
                    if(o.currentOption){
                        activateElement(o.currentOption.element, true);
                        typeof(_onActive) === 'function' && _onActive.call(o, o.currentOption);
                        o.tick();
                    };
                };
            }
        });
        Object.defineProperty(o, 'currentPosition', {
            get: function(){return _position || 0;},
            set: function(val){
                if(val === _position || o.snapAngle * val > 360 || o.snapAngle * val < 0){return;};
                o.currentAngle = o.snapAngle * val;
            }
        });
        return o;
    },
    classCursor = function(){
        var
        o             = {},
        _holder       = null,
        _cursor       = null,
        _onSnap       = null,
        _onRollback   = null,
        _onRotate     = null,
        _radius       = 0,
        _position     = null,
        _angle        = null,
        _snapAngle    = 1,
        _snapDistance = uiRadius / 24,
        _data         = null,
        _cssPreffix   = '',

        getAngleByVector = function(x0, y0, x1, y1){
            return normalizeAngle(Math.atan2(x1 - x0, y1 - y0) * radToDeg * -1);
        },
        getNextAngle = function(a, sda){
            return normalizeAngle(sda ? Math.round(a / sda) * sda : a);
        },
        getDistanceByAngle = function(d1, d2, a){
            return Math.sqrt(Math.pow(d1, 2) + Math.pow(d2, 2) - 2 * d1 * d2 * Math.cos(a * degToRad)); //https://en.wikipedia.org/wiki/Law_of_cosines
        },
        setRotation = function(angle){
            _cursor.style.transform = _cursor.style.webkitTransform = _cursor.style.msTransform = 'rotateZ(' + angle + 'deg)';
            typeof(_onRotate) === 'function' && _onRotate.call(o, angle);
            return angle;
        },
        getEvent = function(evt){
            return evt.touches && evt.touches.length ? evt.touches[0] : evt;
        },
        onStart = function(evt){
            if(_data){return;};
            var rect = _holder.parentElement.getBoundingClientRect();
            _data = {y1:rect.top + rect.height / 2, y2:rect.top + rect.height};
            _data.x1 = _data.x2 = rect.left + rect.width / 2;
            _cursor.classList.add('tap');
        },
        onMove = function(evt){
            if(!_data){return;};
            _data.moved = true;
            var a, d, ra, e = getEvent(evt);
            _data.x2 = e.clientX;
            _data.y2 = e.clientY;
            ra = setRotation(getAngleByVector(_data.x1, _data.y1, _data.x2, _data.y2));
            a = getNextAngle(ra, o.snapAngle);
            d = getDistanceByAngle(_radius, _radius, a - ra);
            d < _snapDistance && (o.currentAngle = a);
            evt.stopPropagation();
            //evt.preventDefault();
            return false;
        },
        onEnd = function(evt){
            _cursor.classList.remove('tap');
            if(!_data || !_data.moved){
                _data = null;    
                return;
            };
            o.currentAngle = getAngleByVector(_data.x1, _data.y1, _data.x2, _data.y2);
            _data = null;
        };

        o.init = function(params){
            //params:{selector:'', snapAngle:0, currentAngle:0, currentPosition:0, onSnap:null, onRotate:null, onRollback:null, cssPreffix:''}
            _snapAngle  = params.snapAngle || 1;
            _onSnap     = params.onSnap;
            _onRotate   = params.onRotate;
            _onRollback = params.onRollback;
            _cssPreffix = params.cssPreffix;
            _holder     = document.querySelector(params.selector);

            if(!_holder){return false;};

            _holder.classList.add(_cssPreffix + 'cursor-holder');
            _radius = uiRadius;
            _cursor = document.createElement('LI');
            _cursor.className = 'cursor';
            _cursor.style.height = _radius + 'em';
            _cursor.addEventListener(isMobile ? 'touchstart' : 'mousedown', onStart, passiveEventsOptions);
            document.addEventListener(isMobile ? 'touchmove' : 'mousemove', onMove, passiveEventsOptions);
            document.addEventListener(isMobile ? 'touchend' : 'mouseup', onEnd, true);
            _holder.appendChild(_cursor);
            if(typeof(params.currentPosition) != 'undefined'){
                o.currentPosition = params.currentPosition;
            }else{
                o.currentAngle = params.currentAngle || 0;
            };
            return o;
        };
        Object.defineProperty(o, 'snapAngle', {
            get: function(){return _snapAngle || 1;},
            set: function(val){
                val = normalizeAngle(val);
                if(val == _snapAngle){return;};
                _snapAngle = val;
            }
        });
        Object.defineProperty(o, 'currentPosition', {
            get: function(){return _position || 0;},
            set: function(val){
                if(val === _position || o.snapAngle * val > 360 || o.snapAngle * val < 0){return;};
                o.currentAngle = o.snapAngle * val;
            }
        });
        Object.defineProperty(o, 'currentAngle', {
            get: function(){return _angle || 0;},
            set: function(val){
                val = normalizeAngle(val);
                if(val === _angle){return;};
                _position = Math.round(val / o.snapAngle);
                var a = _position * o.snapAngle;
                setRotation(a);
                if(_angle !== a){
                    typeof(_onSnap) === 'function' && _onSnap.call(o, a, _position);
                }else{
                    typeof(_onRollback) === 'function' && _onRollback.call(o, a, _position);
                };
                _angle = a;
            }
        });
        return o;
    };

    var
    _data              = null,
    _schema            = null,
    _defaultSchema     = {
        gender         : 'female',
        race           : ['european'],
        hair           : ['alena', '#000000'],
        eyebrows       : ['alena', '#000000'],
        eyes           : ['alena'],
        clothes        : ['3', '#ff35b1'],
        mouth          : ['alena'],
        ears           : ['2', 'european'],
        nose           : ['alena', 'european'],
        face           : ['1', 'european']
    },
    _schemaStringify   = null,
    _category          = null,
    _uiOptions         = classOptions(),
    _uiColors          = classOptions(),
    _uiCursor          = classCursor(),

    _rootEl            = null,
    _id                = 'the-avatar-generator',
    _cssPreffix        = 'a-',
    _rootSel           = '.' + _cssPreffix + 'root',
    _categoryButtonSel = '.' + _cssPreffix + 'interface-category',
    _downloadLayerSel  = '.' + _cssPreffix + 'download',
    _editorSel         = '.' + _cssPreffix + 'editor',
    _interfaceSel      = '.' + _cssPreffix + 'interface',
    _moreSel           = '.' + _cssPreffix + 'more',
    _logoSel           = '.' + _cssPreffix + 'logo',
    _menuSel           = '.' + _cssPreffix + 'interface-menu',
    
    _imgSrc            = 'img/',
    _assetsUrl         = _imgSrc + 'assets/',
    _emptyImage        = _imgSrc + 'empty.png',
    _shadowImage       = _imgSrc + 'bg.png',
    _emptyCategory     = 'none',    
    _emptyOptionValue  = 'none',
    _canvas            = null,      
    _context           = null,

    _getFullSelector = function(sel){
        return '#' +  _id + ' ' + sel;
    },
    _getValuesFor = function(g, c){
        if(!self.data){return [];};
        for(var d in self.dependentCategories){
            if(c == d){return _getArtsFor(g, self.dependentCategories[d][0]);};
        };
        var list = self.data.gender[g][c] || [];
        if(typeof(list) != 'object'){return [];};
        return Object.keys(list);
    },
    _getValues = function(c){
        if(!self.schema){return [];};
        return _getValuesFor(self.schema.gender, c);
    },
    _getArtsFor = function(g, c, v, onlyWebColors){
        if(!self.data || !self.data.gender[g][c]){return [];};
        v = v || Object.keys(self.data.gender[g][c])[0];
        var colors = [], list = self.data.gender[g][c][v] || [];
        if(typeof(list) != 'object'){return colors;};
        for(var key in list){!onlyWebColors ? colors.push(key) : (key.charAt(0) == '#' && colors.push(key));};
        return colors;
    },
    _getArts = function(c, v){
        if(!self.schema){return [];};
        return _getArtsFor(self.schema.gender, c, v, true);
    },
    _activateButton = function(el){
        if(!el || el.disabled || el.classList.contains('active') || !el.classList.contains(_cssPreffix + 'button')){return;};
        if(/.*(group\d+).*/.test(el.className)){
            var i, g = el.className.replace(/.*(group\d+).*/g, '$1'), l = document.body.querySelectorAll('.' + _cssPreffix + 'button.' + g), n = l.length;
            for(i = 0; i < n; i++){activateElement(l[i], false);};
        }else{
            window.setTimeout(function(){activateElement(el, false);}, 300);
        };
        activateElement(el, true);
    },
    _categoryChanged = function(){
        var
        el, a = 0,
        sel = _interfaceSel.replace(/^[\.#]/, ''),
        regExp = new RegExp(sel + '-(hair|eyebrows|eyes|mouth|mustache|beard|nose|ears|race|clothes|background|accessories)');
        _uiOptions.setOptions(_getValues(self.category)).forOptions(function(o){
            if(self.schema[self.category]){
                if(o.value == self.schema[self.category][0]){
                    a = o.angle;
                    return true;
                };
            }else if(o.value == _emptyOptionValue){
                a = o.angle;
                return true;
            };
        });
        _uiCursor.snapAngle = _uiOptions.snapAngle;
        _uiOptions.currentAngle = a;
        _activateButton(_rootEl.querySelector(_interfaceSel + ' ' + _interfaceSel + '-' + self.category));
        el = _rootEl.querySelector(_categoryButtonSel);
        el.className = el.className.replace(regExp, '');
        el.classList.add(sel + '-' + self.category);
        activateElement(_interfaceSel, false);
    },
    _genderChanged = function(){
        var g, el;
        _activateButton(_rootEl.querySelector(_interfaceSel + '-' + self.schema.gender));
        for(g in self.uniqueCategories){
            self.uniqueCategories[g].forEach(function(c){
                el = _rootEl.querySelector(_interfaceSel + '-' + c);
                if(el){
                    el.disabled = g != self.schema.gender;
                };
            });
        };
    };

    self.categories          = [];
    self.allCategories       = {};
    self.uniqueCategories    = {};
    self.dependentCategories = {race: ['face', 'nose', 'ears']};
    self.skipRenderFor       = ['race', 'gender'];

    Object.defineProperty(self, 'data', {
        get: function(){return _data;},
        set: function(val){
            _data = val;
            var list = Object.keys(_data.gender);
            self.allCategories = list.reduce(function(o, v, i){o[v] = Object.keys(_data.gender[v]); return o;}, {});
            self.uniqueCategories = {};
            self.categories = [];
            for(var k in self.allCategories){
                self.uniqueCategories[k] = [];
                for(var u, c, i = 0; i < self.allCategories[k].length; i++){
                    u = false; c = self.allCategories[k][i];
                    if(self.categories.indexOf(c) < 0){
                        i < self.categories.length ? self.categories.splice(i, 0, c) : self.categories.push(c);
                    };
                    for(var k0 in self.allCategories){
                        if(k == k0){continue;};
                        if(self.allCategories[k0].indexOf(c) < 0){
                            u = true; break;
                        };
                    };
                    u && self.uniqueCategories[k].push(c);
                };
            };
            self.categories.reverse();
            _defaultSchema = _defaultSchema || self.randomSchema(true, 1);
        }
    });
    Object.defineProperty(self, 'schema', {
        get: function(){return _schema;},
        set: function(val){
            var assets, str = JSON.stringify(val);
            if(str == _schemaStringify){return;};
            assets = self.schemaToAssets(val);
            if(!assets){return;};
            _schemaStringify = str;
            _schema = JSON.parse(_schemaStringify);
            self.categories.forEach(function(c){
                var el = _rootEl.querySelector(_editorSel + '-' + c);
                el && (el.style.backgroundImage = ['url(', assets[c] ? _assetsUrl + assets[c] : _emptyImage, ')'].join(''));
            });
            if(self.allCategories[_schema.gender].indexOf(_category) < 0 && Object.keys(self.dependentCategories).indexOf(_category) < 0){
                _category = self.allCategories[_schema.gender][0];
                _categoryChanged();
            };
            if(_rootEl){
                var e = document.createEvent('Events');
                e.initEvent('onchange', true, true);
                e.avatar = self;
                _rootEl.dispatchEvent(e);
            };
        }
    });
    Object.defineProperty(self, 'gender', {
        get: function(){return _schema.gender;},
        set: function(val){
            if(val == _schema.gender){return;};
            var newSchema = JSON.parse(_schemaStringify);
            newSchema.gender = val;
            self.schema = newSchema;
            _genderChanged();
            _categoryChanged();
        }
    });
    Object.defineProperty(self, 'category', {
        get: function(){return _category;},
        set: function(val){
            if(val == _category || (self.allCategories[_schema.gender].indexOf(val) < 0 && Object.keys(self.dependentCategories).indexOf(val) < 0)){return;};
            _category = val;
            _categoryChanged();
        }
    });

    self.randomSchema = function(justGenerate, randomRange){
        var newSchema = {}, dependents = {},
        stackProperty = function(stack, obj, dep){
            var key = getRandomKey(obj, randomRange);
            if(!key){return stack;};
            if(dep && stack.length == dep.keyIndex){
                if(dependents[dep.dependet]){
                    key = dependents[dep.dependet];
                }else{
                    dependents[dep.dependet] = key;
                };
            };
            stack.push(key);
            return typeof(obj[key]) == 'object' ? stackProperty(stack, obj[key], dep) : stack;
        },
        setProperty = function(property, dep){
            var key, sex = self.data.gender[newSchema.gender];
            if(sex[property]){
                key = getRandomKey(sex[property], randomRange);
                if(!key){return;};
                if(typeof(sex[property][key]) == 'object'){
                    newSchema[property] = stackProperty([key], sex[property][key], dep);
                }else{
                    newSchema[property] = [key];
                };
            }else{
                newSchema[property] = [_emptyCategory];
            };
        };
        newSchema.gender = getRandomKey(self.data.gender, randomRange);
        for(var i = 0, n; i < self.categories.length; i++){
            n = false;
            for(var d in self.dependentCategories){
                if(self.dependentCategories[d].indexOf(self.categories[i]) >= 0){
                    setProperty(self.categories[i], {keyIndex:1, dependet:d});
                    n = true;
                    break;
                };
            };
            if(n){continue;};
            setProperty(self.categories[i]);
        };
        for(var d in self.dependentCategories){newSchema[d] = dependents[d];};
        if(!justGenerate){
            self.schema = newSchema;
            _genderChanged();
            _categoryChanged();
        };
        return newSchema;
    };
    self.schemaToAssets = function(s){
        var value, key, dependsList, dependsRegExp, result = {}, sex = self.data.gender[s.gender];
        if(!sex){return false;};
        for(key in s){
            if(self.skipRenderFor.indexOf(key) >= 0){continue;};
            value = sex[key];
            if(!value){continue;};
            for(var k, i = 0; i < s[key].length; i++){
                k = s[key][i];
                if(value[k] || value[k] == ''){
                    value = value[k];
                }else{
                    if(value && typeof(value) == 'object'){
                        value = value[Object.keys(value)[0]];
                    }else if(typeof(value) != 'string' || value == undefined){
                        return false;
                    };
                };
            };
            if(typeof(value) == 'object'){value = value[[Object.keys(value)[0]]];};
            if(typeof(value) != 'string'){return false;};
            for(var d in self.dependentCategories){
                dependsList = _getArtsFor(s.gender, self.dependentCategories[d][0]);
                dependsRegExp = new RegExp('\\b' + dependsList.join('|') + '\\b');
                value = value.replace(dependsRegExp, s[d]);
            };
            result[key] = value;
        };
        return result;
    };
    self.setSchemaProperty = function(property, value){
        var newSchema = JSON.parse(JSON.stringify(self.schema));
        for(var d in self.dependentCategories){
            if(property == d){
                var i, key, depends = _getArtsFor(newSchema.gender, self.dependentCategories[d][0]);
                for(key in newSchema){
                    for(var i = 0; i < newSchema[key].length; i++){
                        if(depends.indexOf(newSchema[key][i]) >= 0){
                            newSchema[key][i] = value[0] || value;
                        };
                    };
                };
                break;
            };
        };
        newSchema[property] = value;
        self.schema = newSchema;
    };
    self.detectCategoryByPoint = function(x, y, size, s, callback){
        s = s || self.schema;
        var i, found, result = self.schemaToAssets(s);
        if(!result){return false;};
        if(!_canvas){
            _canvas = document.createElement('canvas');
            _context = _canvas.getContext('2d');
        }
        _canvas.width = size;
        _canvas.height = size;
        _context.clearRect(0, 0, _canvas.width, _canvas.height);
        var drawImage = function(src, category, index){
            var img = new Image();
            img.crossorigin = '';
            img.onload = function(){
                if(found){return;} 
                _context.drawImage(img, 0, 0, size, size);
                if(_context.getImageData(x, y, 1, 1).data[3] > 50){
                    typeof(callback) === 'function' && callback(category === 'face' ? 'race' : category);
                    found = true;
                    return;
                }
                index == 0 && typeof(callback) === 'function' && callback(null);
            };
            img.src = src;
        };
        for(i = self.categories.length - 1; i >= 0; i--){
            if(found){return;}
            if(result[self.categories[i]] && result[self.categories[i]] != _emptyCategory){
                drawImage(_assetsUrl + result[self.categories[i]], self.categories[i], i);
            };
        };
    };
    self.drawSchema = function(s, callback){
        s = s || self.schema;
        var i, counter = 0, images = [], result = self.schemaToAssets(s);
        if(!result){
            return false;
        }else{
            storage.save(_id + ' avatarSchema', s, true);    
        };
        if(!_canvas){
            _canvas = document.createElement('canvas');
            _context = _canvas.getContext('2d');
        }
        _canvas.width = imgSize;
        _canvas.height = imgSize;
        _context.clearRect(0, 0, _canvas.width, _canvas.height);
        var addImage = function(src){
            var img = new Image(); images.push(img);
            img.crossorigin = ''; //start Chrome width --allow-file-access-from-files
            img.onload = function(){
                counter++;
                if(counter >= images.length){
                    for(var i = 0; i < images.length; i++){
                        _context.drawImage(images[i], 0, 0);
                    };
                    if(typeof(callback) !== 'function'){return;};
                    callback(_canvas);
                };
            };
            img.src = src;
        };
        for(i = 0; i < self.categories.length; i++){
            if(result[self.categories[i]] && result[self.categories[i]] != _emptyCategory){
                addImage(_assetsUrl + result[self.categories[i]]);
            };
            self.categories[i] == 'background' && addImage(_shadowImage);
        };
    };
    self.getDataUrl = function(callback){
        self.drawSchema(self.schema, function(c){
            typeof(callback) === 'function' && callback(c.toDataURL());
        });
    };
    self.init = function(data, options){
        options     = options || {};
        _id         = options.id || _id;
        _rootEl     = document.querySelector(options.selector || _rootSel);
        
        var
        interfaceEl = _rootEl.querySelector(_interfaceSel),
        downloadEl  = _rootEl.querySelector(_downloadLayerSel),
        moreEl      = _rootEl.querySelector(_moreSel),
        logoEl      = _rootEl.querySelector(_logoSel),
        menuEl      = _rootEl.querySelector(_menuSel),

        addColors = function(list, angle){
            var a = 0, arc = list.length * 12;
            _uiColors.setOptions(list, arc);
            rotateColors(angle || 0);
            if(self.schema[self.category] && self.schema[self.category].length > 1){
                _uiColors.forOptions(function(o){
                    if(self.schema[self.category] && o.value == self.schema[self.category][1]){
                        a = o.angle;
                        return true;
                    };
                });
            };
            _uiColors.currentAngle = a;
        },
        rotateColors = function(angle){
            var arc = Math.max(_uiColors.count - 1, 0) * 12;
            _uiColors.rotate(angle + (180 - arc / 2));
        },
        onClick = function(evt){
            if(!evt.target.classList.contains(_cssPreffix + 'button')){return;};
            evt.target.classList.add('interact');
            window.setTimeout(function(){evt.target.classList.remove('interact');}, 500);
            switch(evt.target.dataset.action){
                case 'hair'       :
                case 'eyebrows'   :
                case 'eyes'       :
                case 'mouth'      :
                case 'mustache'   : 
                case 'beard'      : 
                case 'nose'       : 
                case 'ears'       : 
                case 'race'       : 
                case 'clothes'    : 
                case 'background' : 
                case 'accessories':
                    self.category = evt.target.dataset.action;
                break;
                case 'female'     :
                case 'male'       :
                    self.gender = evt.target.dataset.action;
                break;
                case 'random'     : 
                    self.randomSchema();
                break;
                case 'category'   :
                    activateElement(_interfaceSel, true);
                break;
                case 'download'   :
                    return;
                break;
                case 'save'       :
                    self.drawSchema(self.schema, function(c){
                        var dataUrl = c.toDataURL(), el = _rootEl.querySelector(_interfaceSel + '-download');
                        if(window.cordova && window.cordova.base64ToGallery){
                            el.href = 'javascript:void(0)';
                            el.removeAttribute('download');
                            el.onclick = function(){self.saveToAlbum(dataUrl);}
                        }else if(/edge|msie|trident/i.test(window.navigator.userAgent)){
                            el.href = 'javascript:void(0)';
                            el.onclick = function(){
                                var win = window.open('', '_blank');
                                win.document.writeln('<img src="' + dataUrl + '" />');
                            };
                        }else{
                            el.href = dataUrl;
                            el.download = 'avatar.png';
                            el.target = '_blank';
                            el.onclick = function(){notification('The download will start within second.', _rootEl);}
                        };
                        window.setTimeout(function(){activateElement(downloadEl, true);}, 100);
                    });
                break;
            };
            if(evt.target.nodeName == 'A' && evt.target.href){
                if(window.cordova){
                    window.open(evt.target.href, '_system');
                }else{
                    return;
                };
            };
            evt.stopPropagation();
            //evt.preventDefault();
            return false;
        },
        onDeactivate = function(evt){
            var el = evt.currentTarget;
            window.setTimeout(function(){activateElement(el, false);}, downloadEl == el ? 500 : 100);
        };
        
        var eName = isMobile ? 'touchstart' : 'mousedown';
        document.addEventListener(eName, onClick, passiveEventsOptions);
        interfaceEl.addEventListener(eName, onDeactivate, passiveEventsOptions);
        downloadEl.addEventListener(eName, onDeactivate, passiveEventsOptions);
        moreEl.addEventListener('click', onDeactivate, true);
        
        _rootEl.id = _id;
        if(options.showLogo){
            logoEl.style.display = 'block'
        };
        if(options.showMenu){
            menuEl.style.display = 'block'
        };
        if(options.imgSrc){
            _imgSrc       = options.imgSrc || 'img/';
            _assetsUrl    = _imgSrc + 'assets/';
            _emptyImage   = _imgSrc + 'empty.png';
            _shadowImage  = _imgSrc + 'bg.png';
        };
        if(options.autoDetectCategory){
            _rootEl.querySelector(_editorSel + ' > ol').addEventListener('click', function(e){
                self.detectCategoryByPoint(e.offsetX, e.offsetY, e.target.clientWidth, self.schema, function(c){
                    c && (self.category = c);
                });
            })
        };
        
        _uiColors.init({
            onActive:function(option){
                option && self.setSchemaProperty(self.category, [self.schema[self.category][0], option.value]);
            },
            onSet:function(){
                _uiColors.forOptions(function(option){
                    option.element.style.color = option.value;
                })
            },
            selector   : _getFullSelector(_editorSel + '-colors'),
            cssClass   : 'color',
            cssPreffix : _cssPreffix,
            audio      : _imgSrc + 'option.wav'
        });
        _uiOptions.init({
            onActive:function(option){
                _uiCursor.currentAngle = option.angle;
                addColors(_getArts(self.category, option.value), option.angle);
                var value = [option.value];
                self.schema[self.category] && typeof(self.schema[self.category]) != 'string' && self.schema[self.category].length > 1 && value.push(self.schema[self.category][1]);
                self.setSchemaProperty(self.category, value);
            },
            selector   : _getFullSelector(_editorSel + '-options'),
            cssPreffix : _cssPreffix,
            audio      : _imgSrc + 'option.wav'
        });
        _uiCursor.init({
            onSnap:function(angle, position){
                _uiOptions.currentAngle = angle;
            },
            onRollback:function(angle, position){
                rotateColors(angle);
            },
            onRotate:function(angle){
                rotateColors(angle);
            },
            selector   : _getFullSelector(_editorSel + '-options'),
            cssPreffix : _cssPreffix
        });

        self.data = data;
        self.schema = options.schema || storage.load(_id + ' avatarSchema') || _defaultSchema;
        _genderChanged();
        _categoryChanged();
        return self;
    };
    self.saveToAlbum = function(dataUrl){
        if(window.cordova && window.cordova.base64ToGallery){
            var save = function(){
                window.cordova.base64ToGallery(
                    dataUrl,
                    'avatar_',
                    function(){notification('Avatar has been saved into album.');},
                    function(){notification('Save. Something went wrong.');}
                )
            };
            if(/android/i.test(navigator.userAgent) && window.cordova.plugins && window.cordova.plugins.diagnostic){
                window.cordova.plugins.diagnostic.requestRuntimePermission(
                    function(granted){granted ? save() : notification('Permission not granted for the requested operation.');},
                    function(){notification('Permission. Something went wrong.');},
                    window.cordova.plugins.diagnostic.runtimePermission.WRITE_EXTERNAL_STORAGE
                );
            }else{
                save();
            };
        };
    };
    self.more = function(){
        activateElement(_moreSel, true);
    };
    return self;
};
Avatar.contactMe = function(element){
    var mail = ['oleksiy.nesterov', '+', [].join.apply(['avatar', 'gmail'], ['@']), '.com'].join('');
    if(element && !window.cordova){
       element.innerHTML = mail; 
    }else{
        window.open('mailto:' + mail, window.cordova ? '_system' : '_blank');
    };
};

(Avatar()).init(window.AvatarData, {
    showLogo:true,
    showMenu:true,
    autoDetectCategory:true
});