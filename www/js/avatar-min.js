window.Avatar=function(){var a=this,B=180/Math.PI,E=Math.PI/180,x=/iphone|ipod|ipad|android|mobile/i.test(navigator.userAgent),t=function(c){c=0>c?360+c:c;return Math.abs(360<c?0:c)},A=function(c,a){var b=Object.keys(c);return a||b.length?b[1<b.length?Math.floor(Math.random()*(a&&a<b.length?a:b.length)):0]:null},p=function(c,a){(c="string"==typeof c?document.getElementById(c):c)&&c.classList[a?"add":"remove"]("active")},u=function(c){var a=document.createElement("DIV");a.className="notification";
a.innerHTML=c;document.body.appendChild(a);window.setTimeout(function(){a.classList.add("active")},100);window.setTimeout(function(){document.body.removeChild(a)},5E3)},v=!0;try{window.addEventListener("test",null,Object.defineProperty({},"passive",{get:function(){v={passive:!0}}}))}catch(c){}storage=function(){var c=this;c.is=!!window.localStorage||!1;c.save=function(a,b,e){if(!c.is)return!1;try{b||e?localStorage.setItem(a,JSON.stringify(b)):localStorage.removeItem(a)}catch(f){}return c};c.load=
function(a){if(!c.is)return null;if(a=localStorage.getItem(a))try{return JSON.parse(a)}catch(b){}};c["delete"]=function(a){if(!c.is)return null;localStorage.removeItem(a);return c};c.clear=function(a){if(!c.is)return null;a?a.forEach(a,function(a){c["delete"](a)}):localStorage.clear();return c};c.list=function(){var a,b=[];if(!c.is)return b;for(a=0;a<localStorage.length;a++)b.push(localStorage.key(a));return b};return c}.call({});classOptions=function(){var a=this;(Math.random()/(new Date).getTime()).toString(36).substring(10,
25);var d=null,b="",e=null,f=null,m=360,k=1,g={},l="",n=null,r=null,h=function(){a.forOptions(function(a){a.element.parentElement.removeChild(a.element)});g={};k=1;f=e=null;m=360};a.init=function(e){b=e.cssClass||"";_audio=AudioFX.supported.wav&&AudioFX(e.audio||"img/option.wav");n=e.onActive;r=e.onSet;d=document.querySelector(e.selector);if(!d)return 0;d.addEventListener(x?"touchstart":"mousedown",function(b){if(b.target.parentElement==d&&"undefined"!=typeof b.target.dataset.angle)return a.currentAngle=
b.target.dataset.angle,b.target.classList.add("tap"),window.setTimeout(function(){b.target.classList.remove("tap")},500),b.stopPropagation(),!1},v);e.list&&e.list.length&&setOptions(e.list||[]);return a};a.forOptions=function(b){if("function"==typeof b){for(var d in g)if(b(g[d]))return;return a}};a.setOptions=function(e,n){var f=JSON.stringify(e),p=(void 0!=n?n:m)||360;if(l==f&&m==p)return a;h();l=f;m=p;k=t(m/e.length);f=0;for(p=e.length;f<p;f++){var y=a.snapAngle*f,D=e[f],z=void 0,q=document.createElement("LI"),
z=Math.round(y/a.snapAngle);q.dataset.angle=y;q.dataset.position=z;q.dataset.value=D;q.className=["option",b].join(" ");q.style.height=parseInt(window.getComputedStyle(d.parentElement,null).getPropertyValue("height"),10)/2+"px";q.style.transform=q.style.webkitTransform=q.style.msTransform="rotateZ("+y+"deg)";z={angle:y,position:z,value:D,element:q};g[y]=z;d.appendChild(q)}"function"==typeof r&&r.call(a);return a};a.tick=function(){_audio&&_audio.play();return a};a.rotate=function(b){d.style.transform=
d.style.webkitTransform=d.style.msTransform="rotateZ("+b+"deg)";return a};Object.defineProperty(a,"count",{get:function(){return Object.keys(g).length}});Object.defineProperty(a,"snapAngle",{get:function(){return k||1}});Object.defineProperty(a,"currentOption",{get:function(){return g[f]||null}});Object.defineProperty(a,"currentAngle",{get:function(){return f||0},set:function(b){b=t(b);b!==f&&(e=Math.round(b/a.snapAngle),b=a.currentPosition*a.snapAngle,f!==b&&(f=b,a.forOptions(function(a){p(a.element,
!1)}),a.currentOption&&(p(a.currentOption.element,!0),"function"==typeof n&&n.call(a,a.currentOption),a.tick())))}});Object.defineProperty(a,"currentPosition",{get:function(){return e||0},set:function(b){b===e||360<a.snapAngle*b||0>a.snapAngle*b||(a.currentAngle=a.snapAngle*b)}});return a};classCursor=function(){var a=this,d=(Math.random()/(new Date).getTime()).toString(36).substring(10,25),b=null,e=null,f=null,m=null,k=null,g=0,l=null,n=null,r=1,h=null,C=function(b){e.style.transform=e.style.webkitTransform=
e.style.msTransform="rotateZ("+b+"deg)";"function"==typeof k&&k.call(a,b);return b},p=function(a){h||(a=b.parentElement.getBoundingClientRect(),h={y1:a.top+a.height/2,y2:a.top+a.height},h.x1=h.x2=a.left+a.width/2,e.classList.add("tap"))},u=function(b){if(h){h.moved=!0;var d,e;e=b.touches&&b.touches.length?b.touches[0]:b;h.x2=e.clientX;h.y2=e.clientY;e=C(t(Math.atan2(h.x2-h.x1,h.y2-h.y1)*B*-1));d=a.snapAngle;d=t(d?Math.round(e/d)*d:e);10>Math.sqrt(Math.pow(g,2)+Math.pow(g,2)-2*g*g*Math.cos((d-e)*E))&&
(a.currentAngle=d);b.stopPropagation();return!1}},w=function(b){h&&h.moved&&(a.currentAngle=t(Math.atan2(h.x2-h.x1,h.y2-h.y1)*B*-1),h=null,e.classList.remove("tap"))};a.init=function(n){r=n.snapAngle||1;f=n.onSnap;k=n.onRotate;m=n.onRollback;b=document.querySelector(n.selector);if(!b)return!1;b.classList.add("cursor-holder");g=parseInt(window.getComputedStyle(b.parentElement,null).getPropertyValue("height"),10)/2;e=document.createElement("LI");e.id="cursor-"+d;e.className="cursor";e.style.height=
g+"px";e.addEventListener(x?"touchstart":"mousedown",p,v);document.addEventListener(x?"touchmove":"mousemove",u,v);document.addEventListener(x?"touchend":"mouseup",w,!0);b.appendChild(e);"undefined"!=typeof n.currentPosition?a.currentPosition=n.currentPosition:a.currentAngle=n.currentAngle||0;return a};Object.defineProperty(a,"snapAngle",{get:function(){return r||1},set:function(a){a=t(a);a!=r&&(r=a)}});Object.defineProperty(a,"currentPosition",{get:function(){return l||0},set:function(b){b===l||
360<a.snapAngle*b||0>a.snapAngle*b||(a.currentAngle=a.snapAngle*b)}});Object.defineProperty(a,"currentAngle",{get:function(){return n||0},set:function(b){b=t(b);b!==n&&(l=Math.round(b/a.snapAngle),b=l*a.snapAngle,C(b),n!==b?"function"==typeof f&&f.call(a,b,l):"function"==typeof m&&m.call(a,b,l),n=b)}});return a};var w=null;_schema=null;_defaultSchema={gender:"female",race:["european"],hair:["alena","#000000"],eyebrows:["alena","#000000"],eyes:["alena"],clothes:["3","#ff35b1"],mouth:["alena"],ears:["2",
"european"],nose:["alena","european"],face:["1","european"]};_category=_schemaStringify=null;_uiOptions=new classOptions;_uiColors=new classOptions;_uiCursor=new classCursor;_categoryButtonId="category";_downloadLayerId="download";_editorId="editor";_interfaceId="interface";_moreId="more";_emptyCategory="none";_assetsUrl="img/assets/";_emptyImage="img/empty.png";_shadowImage="img/bg.png";_emptyOptionValue="none";_getValuesFor=function(c,d){if(!a.data)return[];for(var b in a.dependentCategories)if(d==
b)return _getArtsFor(c,a.dependentCategories[b][0]);b=a.data.gender[c][d]||[];return"object"!=typeof b?[]:Object.keys(b)};_getValues=function(c){return a.schema?_getValuesFor(a.schema.gender,c):[]};_getArtsFor=function(c,d,b,e){if(!a.data||!a.data.gender[c][d])return[];b=b||Object.keys(a.data.gender[c][d])[0];var f=[];c=a.data.gender[c][d][b]||[];if("object"!=typeof c)return f;for(key in c)e?"#"==key.charAt(0)&&f.push(key):f.push(key);return f};_getArts=function(c,d){return a.schema?_getArtsFor(a.schema.gender,
c,d,!0):[]};_activateButton=function(a){if(a&&!a.disabled&&!a.classList.contains("active")&&a.classList.contains("button")){if(/.*(group\d+).*/.test(a.className)){var d;d=a.className.replace(/.*(group\d+).*/g,"$1");var b=document.body.querySelectorAll(".button."+d),e=b.length;for(d=0;d<e;d++)p(b[d],!1)}else window.setTimeout(function(){p(a,!1)},300);p(a,!0)}};_categoryChanged=function(){var c,d,b=0,e=0,f=new RegExp("^"+_interfaceId+"-");_uiOptions.setOptions(_getValues(a.category)).forOptions(function(b){if(a.schema[a.category]){if(b.value==
a.schema[a.category][0])return e=b.angle,!0}else if(b.value==_emptyOptionValue)return e=b.angle,!0});_uiCursor.snapAngle=_uiOptions.snapAngle;_uiOptions.currentAngle=e;_activateButton(document.getElementById(_interfaceId+"-"+a.category));if(c=document.getElementById(_categoryButtonId)){for(;b<c.classList.length;)d=c.classList.item(b),f.test(d)?c.classList.remove(d):b++;c.classList.add(_interfaceId+"-"+a.category)}p(_interfaceId,!1)};_genderChanged=function(){var c,d;_activateButton(document.getElementById(_interfaceId+
"-"+a.schema.gender));for(c in a.uniqueCategories)a.uniqueCategories[c].forEach(function(b){if(d=document.getElementById(_interfaceId+"-"+b))d.disabled=c!=a.schema.gender})};a.categories=[];a.allCategories={};a.uniqueCategories={};a.dependentCategories={race:["face","nose","ears"]};a.skipRenderFor=["race","gender"];Object.defineProperty(a,"data",{get:function(){return w},set:function(c){w=c;c=Object.keys(w.gender);a.allCategories=c.reduce(function(a,b,c){a[b]=Object.keys(w.gender[b]);return a},{});
a.uniqueCategories={};a.categories=[];for(var d in a.allCategories){a.uniqueCategories[d]=[];for(var b,e=0;e<a.allCategories[d].length;e++){c=!1;b=a.allCategories[d][e];0>a.categories.indexOf(b)&&(e<a.categories.length?a.categories.splice(e,0,b):a.categories.push(b));for(var f in a.allCategories)if(d!=f&&0>a.allCategories[f].indexOf(b)){c=!0;break}c&&a.uniqueCategories[d].push(b)}}a.categories.reverse();_defaultSchema=_defaultSchema||a.randomSchema(!0,1)}});Object.defineProperty(a,"schema",{get:function(){return _schema},
set:function(c){var d,b=JSON.stringify(c);b!=_schemaStringify&&(d=a.schemaToAssets(c))&&(_schemaStringify=b,_schema=JSON.parse(_schemaStringify),a.categories.forEach(function(a){var b=document.getElementById(_editorId+"-"+a);b&&(b.style.backgroundImage=["url(",d[a]?_assetsUrl+d[a]:_emptyImage,")"].join(""))}),0>a.allCategories[_schema.gender].indexOf(_category)&&0>Object.keys(a.dependentCategories).indexOf(_category)&&(_category=a.allCategories[_schema.gender][0],_categoryChanged()))}});Object.defineProperty(a,
"gender",{get:function(){return _schema.gender},set:function(c){if(c!=_schema.gender){var d=JSON.parse(_schemaStringify);d.gender=c;a.schema=d;_genderChanged();_categoryChanged()}}});Object.defineProperty(a,"category",{get:function(){return _category},set:function(c){c==_category||0>a.allCategories[_schema.gender].indexOf(c)&&0>Object.keys(a.dependentCategories).indexOf(c)||(_category=c,_categoryChanged())}});a.randomSchema=function(c,d){var b={},e={},f=function(a,b,c){var g=A(b,d);if(!g)return a;
c&&a.length==c.keyIndex&&(e[c.dependet]?g=e[c.dependet]:e[c.dependet]=g);a.push(g);return"object"==typeof b[g]?f(a,b[g],c):a},m=function(c,e){var h,g=a.data.gender[b.gender];g[c]?(h=A(g[c],d))&&(b[c]="object"==typeof g[c][h]?f([h],g[c][h],e):[h]):b[c]=[_emptyCategory]};b.gender=A(a.data.gender,d);for(var k=0,g;k<a.categories.length;k++){g=!1;for(var l in a.dependentCategories)if(0<=a.dependentCategories[l].indexOf(a.categories[k])){m(a.categories[k],{keyIndex:1,dependet:l});g=!0;break}g||m(a.categories[k])}for(l in a.dependentCategories)b[l]=
e[l];c||(a.schema=b,_genderChanged(),_categoryChanged());return b};a.schemaToAssets=function(c){var d,b,e,f={},m=a.data.gender[c.gender];if(!m)return!1;for(b in c)if(!(0<=a.skipRenderFor.indexOf(b))&&(d=m[b])){for(var k=0;k<c[b].length;k++)if(e=c[b][k],d[e]||""==d[e])d=d[e];else if(d&&"object"==typeof d)d=d[Object.keys(d)[0]];else if("string"!=typeof d||void 0==d)return!1;"object"==typeof d&&(d=d[[Object.keys(d)[0]]]);if("string"!=typeof d)return!1;for(var g in a.dependentCategories)e=_getArtsFor(c.gender,
a.dependentCategories[g][0]),e=new RegExp("\\b"+e.join("|")+"\\b"),d=d.replace(e,c[g]);f[b]=d}return f};a.setSchemaProperty=function(c,d){var b=JSON.parse(JSON.stringify(a.schema)),e;for(e in a.dependentCategories)if(c==e){var f,m=_getArtsFor(b.gender,a.dependentCategories[e][0]);for(f in b)for(e=0;e<b[f].length;e++)0<=m.indexOf(b[f][e])&&(b[f][e]=d[0]||d);break}b[c]=d;a.schema=b};a.drawSchema=function(c,d){c=c||a.schema;var b=a.schemaToAssets(c);if(!b)return!1;storage.save("avatarSchema",c,!0);var e,
f=document.createElement("canvas");f.width=480;f.height=480;e=f.getContext("2d");for(var m=0,k=[],g=function(a){var b=new Image;k.push(b);b.crossorigin="";b.onload=function(){m++;if(m>=k.length){for(var a=0;a<k.length;a++)e.drawImage(k[a],0,0);"function"==typeof d&&d(f)}};b.src=a},l=0;l<a.categories.length;l++)b[a.categories[l]]&&b[a.categories[l]]!=_emptyCategory&&g(_assetsUrl+b[a.categories[l]]),"background"==a.categories[l]&&g(_shadowImage)};a.init=function(c,d){var b=document.getElementById(_interfaceId),
e=document.getElementById(_downloadLayerId),f=document.getElementById(_moreId),m=function(b,c){var d=0;arc=12*b.length;_uiColors.setOptions(b,arc);k(c||0);a.schema[a.category]&&1<a.schema[a.category].length&&_uiColors.forOptions(function(b){if(a.schema[a.category]&&b.value==a.schema[a.category][1])return d=b.angle,!0});_uiColors.currentAngle=d},k=function(a){_uiColors.rotate(a+(180-12*Math.max(_uiColors.count-1,0)/2))},g=function(a){var b=a.currentTarget;window.setTimeout(function(){p(b,!1)},e==b?
500:100)},l=x?"touchstart":"mousedown";document.addEventListener(l,function(b){if(b.target.classList.contains("button")){b.target.classList.add("interact");window.setTimeout(function(){b.target.classList.remove("interact")},500);switch(b.target.id){case "interface-hair":a.category="hair";break;case "interface-eyebrows":a.category="eyebrows";break;case "interface-eyes":a.category="eyes";break;case "interface-mouth":a.category="mouth";break;case "interface-mustache":a.category="mustache";break;case "interface-beard":a.category=
"beard";break;case "interface-nose":a.category="nose";break;case "interface-ears":a.category="ears";break;case "interface-race":a.category="race";break;case "interface-clothes":a.category="clothes";break;case "interface-background":a.category="background";break;case "interface-accessories":a.category="accessories";break;case "interface-female":a.gender="female";break;case "interface-male":a.gender="male";break;case "interface-random":a.randomSchema();break;case "category":p(_interfaceId,!0);break;
case "interface-save":a.drawSchema(a.schema,function(a){var b=a.toDataURL();a=document.getElementById(_interfaceId+"-download");window.cordova&&window.cordova.base64ToGallery?(a.href="javascript:void(0)",a.removeAttribute("download"),a.onclick=function(){Avatar.saveToAlbum(b)}):(a.href=b,a.download="avatar.png",a.onclick=function(){u("The download will start within second.")});window.setTimeout(function(){p(_downloadLayerId,!0)},100)})}if("interface-download"!=b.target.id){if("A"==b.target.nodeName&&
b.target.href)if(window.cordova)window.open(b.target.href,"_system");else return;b.stopPropagation();return!1}}},v);b.addEventListener(l,g,v);e.addEventListener(l,g,v);f.addEventListener("click",g,!0);_uiColors.init({onActive:function(b){b&&a.setSchemaProperty(a.category,[a.schema[a.category][0],b.value])},onSet:function(){_uiColors.forOptions(function(a){a.element.style.color=a.value})},selector:"#"+_editorId+"-colors",cssClass:"color"});_uiOptions.init({onActive:function(b){_uiCursor.currentAngle=
b.angle;m(_getArts(a.category,b.value),b.angle);b=[b.value];a.schema[a.category]&&"string"!=typeof a.schema[a.category]&&1<a.schema[a.category].length&&b.push(a.schema[a.category][1]);a.setSchemaProperty(a.category,b)},selector:"#"+_editorId+"-options"});_uiCursor.init({onSnap:function(a,b){_uiOptions.currentAngle=a},onRollback:function(a,b){k(a)},onRotate:function(a){k(a)},selector:"#"+_editorId+"-options"});a.data=c;a.schema=d||storage.load("avatarSchema")||_defaultSchema;_genderChanged();_categoryChanged();
return a};a.saveToAlbum=function(a){if(window.cordova&&window.cordova.base64ToGallery){var d=function(){window.cordova.base64ToGallery(a,"avatar_",function(){u("Avatar has been saved into album.")},function(){u("Save. Something went wrong.")})};/android/i.test(navigator.userAgent)&&window.cordova.plugins&&window.cordova.plugins.diagnostic?window.cordova.plugins.diagnostic.requestRuntimePermission(function(a){a?d():u("Permission not granted for the requested operation.")},function(){u("Permission. Something went wrong.")},
window.cordova.plugins.diagnostic.runtimePermission.WRITE_EXTERNAL_STORAGE):d()}};a.contactMe=function(a){var d=["oleksiy.nesterov+",[].join.apply(["avatar","gmail"],["@"]),".com"].join("");a&&!window.cordova?a.innerHTML=d:window.open("mailto:"+d,window.cordova?"_system":"_blank")};a.moreApps=function(){p("more",!0)};return a}.call({}).init(window.AvatarData);
