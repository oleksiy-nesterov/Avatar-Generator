window.Avatar = (function(){
    var
    self              = this,
    radToDeg          = 180 / Math.PI,
    degToRad          = Math.PI / 180,
    normalizeAngle    = function(a){a = a < 0 ? 360 + a : a; return Math.abs(a >= 360 ? 0 : a);},
    getRandomKey      = function(o, range){var k = Object.keys(o); return range || k.length ? k[k.length > 1 ? Math.floor(Math.random() * (range && range < k.length ? range : k.length)) : 0] : null;},
    activateElement   = function(el, s){el = typeof(el) == 'string' ? document.getElementById(el) : el; el && el.classList[s ? 'add' : 'remove']('active');},
    
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
        o             = this,
        _id           = (Math.random() / new Date().getTime()).toString(36).substring(10, 25),
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
            el.style.height = parseInt(window.getComputedStyle(_holder.parentElement, null).getPropertyValue('height'), 10) / 2 + 'px';
            el.style.transform = el.style.webkitTransform = el.style.msTransform = 'rotateZ(' + angle + 'deg)';
            data = {angle:angle, position:pos, value:value, element:el};
            _allOptions[angle] = data;
            _holder.appendChild(el);
            return data;
        };
        
        o.init = function(params){
            //{selector:'', list:[], onActive:null, onSet:null, cssClass:'', arcAngle:360, audion:''}
            _class    = params.cssClass || '';
            _audio    = AudioFX.supported.wav && AudioFX(params.audio || 'img/option.wav');
            _onActive = params.onActive;
            _onSet    = params.onSet;
            _holder   = document.querySelector(params.selector);
            
            if(!_holder){return 0;};
            
            var onClick = function(evt){
                if(evt.target.parentElement == _holder && typeof(evt.target.dataset.angle) != 'undefined'){
                    o.currentAngle = evt.target.dataset.angle;
                    evt.stopPropagation();
                    evt.preventDefault();
                    return false;
                };
            };
            _holder.addEventListener('touchstart', onClick);
            _holder.addEventListener('mousedown', onClick);
            if(params.list && params.list.length){setOptions(params.list || []);};
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
            typeof(_onSet) == 'function' && _onSet.call(o);
            return o;
        };
        o.tick = function(){
            if(_audio){_audio.stop(); _audio.play();};
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
                        typeof(_onActive) == 'function' && _onActive.call(o, o.currentOption);
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
        o             = this,
        _id           = (Math.random() / new Date().getTime()).toString(36).substring(10, 25),
        _holder       = null,
        _cursor       = null,
        _onSnap       = null,
        _onRollback   = null,
        _onRotate     = null,
        _radius       = 0,
        _position     = null,
        _angle        = null,
        _snapAngle    = 1,
        _snapDistance = 10,
        _data         = null,
        
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
            typeof(_onRotate) == 'function' && _onRotate.call(o, angle);
            return angle;
        },
        getEvent = function(evt){
            return evt.touches && evt.touches.length ? evt.touches[0] : evt;
        },
        onStart = function(evt){
            if(_data){return;};
            var e = getEvent(evt), rect = _holder.parentElement.getBoundingClientRect();
            _data = {y1:rect.top + rect.height / 2, y2:rect.top + rect.height};
            _data.x1 = _data.x2 = rect.left + rect.width / 2;
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
            evt.preventDefault();
            return false;            
        },
        onEnd = function(evt){
            if(!_data || !_data.moved){return;};
            o.currentAngle = getAngleByVector(_data.x1, _data.y1, _data.x2, _data.y2);
            _data = null;
        };
        
        o.init = function(params){
            //params:{selector:'', snapAngle:0, currentAngle:0, currentPosition:0, onSnap:null, onRotate:null, onRollback:null}
            _snapAngle  = params.snapAngle || 1;
            _onSnap     = params.onSnap;
            _onRotate   = params.onRotate;
            _onRollback = params.onRollback;
            _holder     = document.querySelector(params.selector);
            
            if(!_holder){return false;};
            
            _holder.classList.add('cursor-holder');
            _radius = parseInt(window.getComputedStyle(_holder.parentElement, null).getPropertyValue('height'), 10) / 2;
            _cursor = document.createElement('LI');
            _cursor.id = 'cursor-' + _id;
            _cursor.className = 'cursor';
            _cursor.style.height = _radius + 'px';
            _cursor.addEventListener('touchstart', onStart, true);
            _cursor.addEventListener('mousedown', onStart, true);
            document.addEventListener('touchmove', onMove, true);
            document.addEventListener('mousemove', onMove, true);
            document.addEventListener('touchend', onEnd, true);
            document.addEventListener('mouseup', onEnd, true);
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
                    typeof(_onSnap) == 'function' && _onSnap.call(o, a, _position);
                }else{
                    typeof(_onRollback) == 'function' && _onRollback.call(o, a, _position);
                };
                _angle = a;
            }
        });
        return o;
    };
    
    var
    _data              = null;
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
    _uiOptions         = new classOptions(),
    _uiColors          = new classOptions(),
    _uiCursor          = new classCursor(),
    _categoryButtonId  = 'category',
    _downloadLayerId   = 'download',
    _editorId          = 'editor',
    _interfaceId       = 'interface',
    _moreId            = 'more',
    _emptyCategory     = 'none',
    _assetsUrl         = 'img/assets/',
    _emptyImage        = 'img/empty.png',
    _shadowImage       = 'img/bg.png',
    _emptyOptionValue  = 'none',
    
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
        for(key in list){!onlyWebColors ? colors.push(key) : (key.charAt(0) == '#' && colors.push(key));};
        return colors;
    },
    _getArts = function(c, v){
        if(!self.schema){return [];};
        return _getArtsFor(self.schema.gender, c, v, true);
    },
    _activateButton = function(el){
        if(!el || el.disabled || el.classList.contains('active') || !el.classList.contains('button')){return;};
        if(/.*(group\d+).*/.test(el.className)){
            var i, g = el.className.replace(/.*(group\d+).*/g, '$1'), l = document.body.querySelectorAll('.button.' + g), n = l.length;
            for(i = 0; i < n; i++){activateElement(l[i], false);};
        }else{
            window.setTimeout(function(){activateElement(el, false);}, 300);
        };
        activateElement(el, true);
    },
    _categoryChanged = function(){
        var el, c, i = 0, a = 0, checkRegExp = new RegExp('^' + _interfaceId + '-');
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
        _activateButton(document.getElementById(_interfaceId + '-' + self.category));
        el = document.getElementById(_categoryButtonId);
        if(el){
            while(i < el.classList.length){c = el.classList.item(i); checkRegExp.test(c) ? el.classList.remove(c) : i++;};
            el.classList.add(_interfaceId + '-' + self.category);
        };
        activateElement(_interfaceId, false);
    },
    _genderChanged = function(){
        var g, el;
        _activateButton(document.getElementById(_interfaceId + '-' + self.schema.gender));
        for(g in self.uniqueCategories){
            self.uniqueCategories[g].forEach(function(c){
                el = document.getElementById(_interfaceId + '-' + c);
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
            var el, key, assets, str = JSON.stringify(val);
            if(str == _schemaStringify){return;};
            assets = self.schemaToAssets(val);
            if(!assets){return;};
            _schemaStringify = str;
            _schema = JSON.parse(_schemaStringify);
            self.categories.forEach(function(c){
                var el = document.getElementById(_editorId + '-' + c);
                el && (el.style.backgroundImage = ['url(', assets[c] ? _assetsUrl + assets[c] : _emptyImage, ')'].join(''));
            });
            if(self.allCategories[_schema.gender].indexOf(_category) < 0 && Object.keys(self.dependentCategories).indexOf(_category) < 0){
                _category = self.allCategories[_schema.gender][0];
                _categoryChanged();
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
    self.drawSchema = function(s, callback){
        s = s || self.schema;
        var result = self.schemaToAssets(s); if(!result){return false;};
        storage.save('avatarSchema', s, true)
        var x, c = document.createElement('canvas'); c.width = 480; c.height = 480;
        x = c.getContext('2d');
        var counter = 0, images = [];
        var addImage = function(src){
            var img = new Image(); images.push(img);
            img.crossorigin = ''; //start Chrome width --allow-file-access-from-files
            img.onload = function(){
                counter++;
                if(counter >= images.length){
                    for(var i = 0; i < images.length; i++){x.drawImage(images[i], 0, 0);};
                    if(typeof(callback) != 'function'){return;};
                    callback(c);
                };
            };
            img.src = src;
        };
        for(var i = 0; i < self.categories.length; i++){
            if(result[self.categories[i]] && result[self.categories[i]] != _emptyCategory){
                addImage(_assetsUrl + result[self.categories[i]]);    
            };
            self.categories[i] == 'background' && addImage(_shadowImage);
        };
    };
    self.init = function(data, schema){
        var
        interface = document.getElementById(_interfaceId),
        download = document.getElementById(_downloadLayerId),
        more = document.getElementById(_moreId),
        addColors = function(list, angle){
            var a = 0; arc = list.length * 12;
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
            if(!evt.target.classList.contains('button')){return;};
            evt.target.classList.add('interact');
            window.setTimeout(function(){evt.target.classList.remove('interact');}, 500);
            switch(evt.target.id){
                case 'interface-hair'        : self.category = 'hair'; break;
                case 'interface-eyebrows'    : self.category = 'eyebrows'; break;
                case 'interface-eyes'        : self.category = 'eyes'; break;
                case 'interface-mouth'       : self.category = 'mouth'; break;
                case 'interface-mustache'    : self.category = 'mustache'; break;
                case 'interface-beard'       : self.category = 'beard'; break;
                case 'interface-nose'        : self.category = 'nose'; break;
                case 'interface-ears'        : self.category = 'ears'; break;
                case 'interface-race'        : self.category = 'race'; break;
                case 'interface-clothes'     : self.category = 'clothes'; break;
                case 'interface-background'  : self.category = 'background'; break;
                case 'interface-accessories' : self.category = 'accessories'; break;
                case 'interface-female'      : self.gender = 'female'; break;
                case 'interface-male'        : self.gender = 'male'; break;
                case 'interface-random'      : self.randomSchema(); break;
                case 'interface-save'        : self.drawSchema(self.schema, function(c){var el = document.getElementById(_interfaceId + '-download'); el.href = c.toDataURL(); el.download = 'avatar.png'; activateElement(_downloadLayerId, true);}); break;
                case 'category'              : activateElement(_interfaceId, true); break;
            };
            if(evt.target.id == 'interface-download'){return;};
            //if(evt.target.nodeName == 'A' && evt.target.href){window.open(evt.target.href, '_blank');};
            evt.stopPropagation();
            evt.preventDefault();
            return false;
        },
        onDeactivate = function(evt){
            var el = evt.currentTarget;
            window.setTimeout(function(){activateElement(el, false);}, download == el ? 500 : 100);
        };
        document.addEventListener('touchstart', onClick, true);
        document.addEventListener('mousedown', onClick, true);
        interface.addEventListener('touchstart', onDeactivate, true);
        interface.addEventListener('mousedown', onDeactivate, true);
        more.addEventListener('touchstart', onDeactivate, true);
        more.addEventListener('mousedown', onDeactivate, true);        
        download.addEventListener('touchstart', onDeactivate, true);
        download.addEventListener('mousedown', onDeactivate, true);
        
        _uiColors.init({
            onActive:function(option){
                option && self.setSchemaProperty(self.category, [self.schema[self.category][0], option.value]);
            },
            onSet:function(){
                _uiColors.forOptions(function(option){
                    option.element.style.backgroundColor = option.value;    
                })
            },            
            selector:'#' + _editorId + '-colors', cssClass:'color'
        });
        _uiOptions.init({
            onActive:function(option){
                _uiCursor.currentAngle = option.angle;
                addColors(_getArts(self.category, option.value), option.angle);
                var value = [option.value];
                self.schema[self.category] && typeof(self.schema[self.category]) != 'string' && self.schema[self.category].length > 1 && value.push(self.schema[self.category][1]);
                self.setSchemaProperty(self.category, value);
            },
            selector:'#' + _editorId + '-options'
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
            selector:'#' + _editorId + '-options'
        });     
        
        self.data = data;
        self.schema = schema || storage.load('avatarSchema') || _defaultSchema;
        _genderChanged();
        _categoryChanged();
        return self;
    };
    self.contactMe = function(){
        window.open([
            ['mailto', 'oleksiy'].join(':'), '.nesterov+',
            ['avatar', 'gmail'].join('@'), '.com'
        ].join(''), '_blank');
    };
    self.moreApps = function(){
        activateElement('more', true);
    };
    return self;
}).call({}).init(window.AvatarData);