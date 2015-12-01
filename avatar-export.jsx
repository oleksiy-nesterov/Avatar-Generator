var STOP_BY_USER = false;

var console = {
    log: function(v, c){
        c && console.clear();
        $.writeln(v);
    },
    clear: function(){
        if(app.name == 'ExtendScript Toolkit'){
            app.clc();
        }else{
            var toolkit = BridgeTalk.getSpecifier('estoolkit');
            if(toolkit){
                var b = new BridgeTalk;
                b.target = toolkit; b.body = 'app.clc()'; b.send();
            };
        };
    }
};
var savePNG = function(file, doc){
    var o = new ExportOptionsSaveForWeb;
    o.format = SaveDocumentType.PNG
    o.PNG8 = false; 
    o.transparency = true; 
    o.interlaced = false; 
    o.quality = 100;
    o.includeProfile = false;
    doc.exportDocument(File(file), ExportType.SAVEFORWEB, o);
    //doc.saveAs(File(file), new PNGSaveOptions(), true, Extension.LOWERCASE);
    //console.log('savePNG: ' + f);
};
var saveTXT = function(file, str){
    var f = new File(file);
    f.lineFeed = '\n';
    f.encoding = 'UTF16';
    f.open('w');
    f.write('\uFEFF'); // Unicode marker
    f.write(str);
    f.close();
    //console.log('saveTXT: ' + f);
};
var trimKey = function(str){
    return str.replace(/^\s+|\s+$/g, '').replace(/\s/g, '_').replace(/[^a-z0-9_#\-]/ig, '');
};
var forEachLayers = function(root, callback, stack, counter){
    stack = stack || [];
    counter = counter || [0];
    var i, s;
    for(i = 0; i < root.layers.length; i++){
        if(STOP_BY_USER){return;};
        s = stack.slice(); s.push(root.layers[i].name);
        switch(root.layers[i].typename){
            case 'LayerSet':
                forEachLayers(root.layers[i], callback, s, counter);
            break;
            case 'ArtLayer':
                counter[0]++;
                if(callback(root.layers[i], s, counter[0])){return;};
            break;
        };
    };
};
var forEachArray = function(arr, callback){
    for(var i = 0, l = arr.length - 1; i <= l; i++){
        if(STOP_BY_USER){return;};
        if(callback(i, arr[i], i > 0 ? arr[i - 1] : null, i < l ? arr[i + 1] : null)){return;};
    };
};
var forEachObject = function(obj, callback){
    for(var k in obj){
        if(STOP_BY_USER){return;};
        if(callback(k, obj[k], Object.prototype.toString.call(obj[k]) === '[object Array]' ? 'array' : typeof(obj[k]))){return;};
    };
};
var findAssets = function(root, callback, dependentLayers, stack, counter, prefix){
    /*
    x-content         Для створення групи яка буде комбінуватися з усіма сусідськими artLayer
    x-content-invert  Для створення групи яка буде комбінуватися з усіма сусідськими artLayer,
                      але ієрархія параметра "stack" буде зворотньою
    x-group           Для створення групи без врахування її назви і вкладеності, ніби то внутрішній
                      контент був винесений за межі групи на рівеннь вверх 
    x-layer           Завжди пропускається, всілякі допоміжні слої
    */
    
    stack = stack || [];
    counter = counter || [0];
    dependentLayers = dependentLayers || [];
    var i, s, d, xContent, xContentInvert;
    try{xContent = root.layers.getByName('x-content');}catch(e){};
    try{xContentInvert = root.layers.getByName('x-content-invert');}catch(e){};
    if(xContent || xContentInvert){
        for(i = 0; i < root.layerSets.length; i++){
            if(STOP_BY_USER){return;};
            if(root.layerSets[i].name == 'x-content' || root.layerSets[i].name == 'x-content-invert'){continue;};
            if(root.layerSets[i].name == 'x-group'){
                s = stack;
            }else{
                s = stack.slice();
                s.push(trimKey(root.layerSets[i].name));
            };
            findAssets(root.layerSets[i], callback, dependentLayers, s, counter, prefix);
        };
        for(i = 0; i < root.artLayers.length; i++){
            if(STOP_BY_USER){return;};
            d = dependentLayers.slice(); d.push(root.artLayers[i]);
            root.artLayers[i].visible = false;
            if(xContentInvert){   
                s = stack.slice();
                s.push(trimKey(root.artLayers[i].name));
                xContent && findAssets(xContent, callback, d, s, counter, prefix);
            };
            if(xContentInvert){
                s = stack.slice();
                findAssets(xContentInvert, callback, d, s, counter, trimKey(root.artLayers[i].name));
            };
        };
    }else{
        for(i = 0; i < root.layers.length; i++){
            if(STOP_BY_USER){return;};
            s = stack.slice();
            s.push(trimKey(root.layers[i].name));
            if(root.layers[i].name == 'x-layer'){
                root.layers[i].visible = false;
            }else{
                switch(root.layers[i].typename){
                    case 'LayerSet':
                        findAssets(root.layers[i], callback, dependentLayers, s, counter, prefix);
                    break;
                    case 'ArtLayer':
                        counter[0]++;
                        root.layers[i].visible = false;
                        prefix && s.push(prefix);
                        if(callback(root.layers[i], dependentLayers, s, counter[0])){return;};
                    break;
                };
            };
        };
    };
};
var extendObjectByStack = function(dest, stack, value){
    var obj = dest;
    forEachArray(stack, function(i, item, prev, next){
        if(!next){
            obj[item] = value;
        }else{
            if(typeof(obj[item]) == 'undefined'){
                obj[item] = {};
            };
            obj = obj[item];
        };
    });
};
var objectToJS = function(obj){
    var whiteSpace = '    ';
    var brackets = {object:{s:'{', e:'}'}, array:{s:'[', e:']'}, string:"'"};
    var call = function(o, oLevel){
        var oType = Object.prototype.toString.call(o) === '[object Array]' ? 'array' : typeof(o);
        switch(oType){
            case 'array':            
            case 'object':
                var list = [], space = Array(oLevel).join(whiteSpace), oSpace = space + whiteSpace, oContent = brackets[oType].s + '\n';
                forEachObject(o, function(k, v, t){
                    list.push(oSpace + (oType != 'array' ? brackets.string + k + brackets.string + ': ' : '') + call(v, oLevel + 1));
                });
                oContent += list.join(',\n') + '\n' + space + brackets[oType].e;
                return oContent;
            break;
            case 'string': return [brackets.string, o.replace(new RegExp(brackets.string, 'g'), '\\' + brackets.string), brackets.string].join('');
            default: return o;
        };
    };
    return call(obj, 1);
};
var showProgress = function(onClose){
    var d = new Window([
        'palette{',
        '   text:"Avatar assets generator",',
        '   preferredSize:[350, 60],',
        '   resizeable:false,',
        '   orientation:"column",',
        '   alignChildren:"fill",',
        '   bar:Group{',
        '       orientation:"row",',
        '       progress:Progressbar{preferredSize:[300, 16]},',
        '       cancel:Button{text:"Cancel"}',
        '   },',
        '   log:Panel{',
        '       orientation:"column",',
        '       alignChildren:"fill",',
        '       message:StaticText{',
        '           text:"Initialisation, please wait ...",',
        '           properties:{multiline:true}',
        '       }',
        '   }',
        '}'
    ].join('\n'));
    d.bar.cancel.onClick = function(){d.close();};
    d.onClose = function(){return onClose();};
    d.center();
    d.show();
    return d;
};
var initProgress = function(d, value, maxValue){
    d.bar.progress.value = value || 0;
    d.bar.progress.maxvalue = maxValue || 100;
    return d;
};
var updateProgress = function(d, value, log){
	d.bar.progress.value = value;
	if(log){d.log.message.text = log;};
    d.update();
    return d;
};
    
if(documents.length > 0){
    var script = {fullCollection:[], saveCollection:[], data:{}};
    script.doc = app.activeDocument;
    script.clone = script.doc.duplicate(script.doc.name + ' (export assets)');
    script.path = script.doc.path + '/';
    script.savepath = script.path + 'www/img/assets/';
    script.emptyAsset = 'none';
    script.progress = showProgress(function(){
        if(script.exit){return;};
        STOP_BY_USER = confirm('Are you sure?');
        return STOP_BY_USER;
    });
    script.saveAll = function(arr){
        app.refresh();
        findAssets(script.clone, function(layer, dependentLayers, stack, i){
            updateProgress(script.progress, 0, ['(', i + 1, ') found asset:', stack.join('/')].join(' '));
            script.saveCollection.push({
                layer:layer,
                stack:stack,
                dependents:dependentLayers
            });
        });
        var f, p, d, count = script.saveCollection.length;        
        initProgress(script.progress, 0, count);
        //app.refresh();
        //console.log('\n\\_/*\\_ СЛАВА УКРАЇНІ _/*\\_/\n');
        d = new Folder(script.savepath); !d.exists && d.create();
        forEachArray(arr || script.saveCollection, function(i, item, prev, next){
            if(prev){
                prev.layer.visible = false;
                forEachArray(prev.dependents, function(i, l){l.visible = false;});
            };
            item.layer.visible = true;
            forEachArray(item.dependents, function(i, l){l.visible = true;});
            f = item.stack[item.stack.length - 1] == script.emptyAsset ? '' : item.stack.join('-').replace(/#/g, '') + '.png';                
            extendObjectByStack(script.data, item.stack, f);
            //app.refresh();
            f && savePNG(script.savepath + f, script.clone);
            updateProgress(script.progress, i + 1, ['(', i + 1, '/', count, ') save asset:', f ? f : 'empty asset'].join(' '));
        });
        !STOP_BY_USER && saveTXT(script.path + 'avatar-data.js', 'window.AvatarData = ' + objectToJS(script.data));
        //console.log('\n\\_/*\\_ ГЕРОЯМ СЛАВА _/*\\_/\n');
    };
    script.saveAll();
    app.beep();
    script.clone && script.clone.close(SaveOptions.DONOTSAVECHANGES);
}else{
    alert('You should open .psd in Photoshop to work!', 'Sorry');
};