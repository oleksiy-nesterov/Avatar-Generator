window.Avatar=function(){var a={},C=180/Math.PI,V=Math.PI/180,D=/iphone|ipod|ipad|android|mobile/i.test(navigator.userAgent),t=function(c){c=0>c?360+c:c;return Math.abs(360<c?0:c)},M=function(c,a){var b=Object.keys(c);return a||b.length?b[1<b.length?Math.floor(Math.random()*(a&&a<b.length?a:b.length)):0]:null},r=function(c,a){(c="string"===typeof c?document.querySelector(c):c)&&c.classList[a?"add":"remove"]("active")},E=function(c,a){var b=document.createElement("DIV");b.className="a-notification";
b.innerHTML="<p>"+c+"</p>";(a||document.body).appendChild(b);window.setTimeout(function(){b.classList.add("active")},100);window.setTimeout(function(){(a||document.body).removeChild(b)},5E3)},x=!0;try{window.addEventListener("test",null,Object.defineProperty({},"passive",{get:function(){x={passive:!0}}}))}catch(c){}var Q=function(){var c=this;c.is=!!window.localStorage||!1;c.save=function(a,b,e){if(!c.is)return!1;try{b||e?localStorage.setItem(a,JSON.stringify(b)):localStorage.removeItem(a)}catch(f){}return c};
c.load=function(a){if(!c.is)return null;if(a=localStorage.getItem(a))try{return JSON.parse(a)}catch(b){}};c["delete"]=function(a){if(!c.is)return null;localStorage.removeItem(a);return c};c.clear=function(a){if(!c.is)return null;a?a.forEach(a,function(a){c["delete"](a)}):localStorage.clear();return c};c.list=function(){var a,b=[];if(!c.is)return b;for(a=0;a<localStorage.length;a++)b.push(localStorage.key(a));return b};return c}.call({}),R=function(){var a={},d=null,b="",e=null,f=null,h=360,k=1,p=
{},l="",u=null,q=null,g="",m=null,W=function(){a.forOptions(function(a){a.element.parentElement.removeChild(a.element)});p={};k=1;f=e=null;h=360};a.init=function(e){b=e.cssClass||"";u=e.onActive;q=e.onSet;g=e.cssPreffix;d=document.querySelector(e.selector);e.audio&&(m=document.createElement("audio"),m.src=e.audio);if(!d)return 0;d.classList.add(g+"options-holder");d.addEventListener(D?"touchstart":"mousedown",function(b){if(b.target.parentElement==d&&"undefined"!=typeof b.target.dataset.angle)return a.currentAngle=
b.target.dataset.angle,b.target.classList.add("tap"),window.setTimeout(function(){b.target.classList.remove("tap")},500),b.stopPropagation(),!1},x);e.list&&e.list.length&&a.setOptions(e.list||[]);return a};a.forOptions=function(b){if("function"==typeof b){for(var d in p)if(b(p[d]))return;return a}};a.setOptions=function(g,e){var f=JSON.stringify(g),H=(void 0!=e?e:h)||360;if(l==f&&h==H)return a;W();l=f;h=H;k=t(h/g.length);f=0;for(H=g.length;f<H;f++){var m=a.snapAngle*f,u=g[f],n=void 0,r=document.createElement("LI"),
n=Math.round(m/a.snapAngle);r.dataset.angle=m;r.dataset.position=n;r.dataset.value=u;r.className=["option",b].join(" ");r.style.height="0.395em";r.style.transform=r.style.webkitTransform=r.style.msTransform="rotateZ("+m+"deg)";n={angle:m,position:n,value:u,element:r};p[m]=n;d.insertBefore(r,d.firstChild)}"function"===typeof q&&q.call(a);return a};a.tick=function(){m&&(m.pause(),window.setTimeout(function(){m.paused&&m.play()},150));return a};a.rotate=function(b){d.style.transform=d.style.webkitTransform=
d.style.msTransform="rotateZ("+b+"deg)";return a};Object.defineProperty(a,"count",{get:function(){return Object.keys(p).length}});Object.defineProperty(a,"snapAngle",{get:function(){return k||1}});Object.defineProperty(a,"currentOption",{get:function(){return p[f]||null}});Object.defineProperty(a,"currentAngle",{get:function(){return f||0},set:function(b){b=t(b);b!==f&&(e=Math.round(b/a.snapAngle),b=a.currentPosition*a.snapAngle,f!==b&&(f=b,a.forOptions(function(a){r(a.element,!1)}),a.currentOption&&
(r(a.currentOption.element,!0),"function"===typeof u&&u.call(a,a.currentOption),a.tick())))}});Object.defineProperty(a,"currentPosition",{get:function(){return e||0},set:function(b){b===e||360<a.snapAngle*b||0>a.snapAngle*b||(a.currentAngle=a.snapAngle*b)}});return a},I=null,y=null,N={gender:"female",race:["european"],hair:["alena","#000000"],eyebrows:["alena","#000000"],eyes:["alena"],clothes:["3","#ff35b1"],mouth:["alena"],ears:["2","european"],nose:["alena","european"],face:["1","european"],mustache:["none"],
beard:["none"]},J=null,B=null,F=R(),z=R(),O=function(){var a={},d=null,b=null,e=null,f=null,h=null,k=0,p=null,l=null,u=1,r=.395/24,g=null,m="",q=function(d){b.style.transform=b.style.webkitTransform=b.style.msTransform="rotateZ("+d+"deg)";"function"===typeof h&&h.call(a,d);return d},n=function(a){g||(a=d.parentElement.getBoundingClientRect(),g={y1:a.top+a.height/2,y2:a.top+a.height},g.x1=g.x2=a.left+a.width/2,b.classList.add("tap"))},v=function(b){if(g){g.moved=!0;var d,e;e=b.touches&&b.touches.length?
b.touches[0]:b;g.x2=e.clientX;g.y2=e.clientY;e=q(t(Math.atan2(g.x2-g.x1,g.y2-g.y1)*C*-1));d=a.snapAngle;d=t(d?Math.round(e/d)*d:e);Math.sqrt(Math.pow(k,2)+Math.pow(k,2)-2*k*k*Math.cos((d-e)*V))<r&&(a.currentAngle=d);b.stopPropagation();return!1}},w=function(d){b.classList.remove("tap");g&&g.moved&&(a.currentAngle=t(Math.atan2(g.x2-g.x1,g.y2-g.y1)*C*-1));g=null};a.init=function(g){u=g.snapAngle||1;e=g.onSnap;h=g.onRotate;f=g.onRollback;m=g.cssPreffix;d=document.querySelector(g.selector);if(!d)return!1;
d.classList.add(m+"cursor-holder");k=.395;b=document.createElement("LI");b.className="cursor";b.style.height=k+"em";b.addEventListener(D?"touchstart":"mousedown",n,x);document.addEventListener(D?"touchmove":"mousemove",v,x);document.addEventListener(D?"touchend":"mouseup",w,!0);d.appendChild(b);"undefined"!=typeof g.currentPosition?a.currentPosition=g.currentPosition:a.currentAngle=g.currentAngle||0;return a};Object.defineProperty(a,"snapAngle",{get:function(){return u||1},set:function(a){a=t(a);
a!=u&&(u=a)}});Object.defineProperty(a,"currentPosition",{get:function(){return p||0},set:function(b){b===p||360<a.snapAngle*b||0>a.snapAngle*b||(a.currentAngle=a.snapAngle*b)}});Object.defineProperty(a,"currentAngle",{get:function(){return l||0},set:function(b){b=t(b);b!==l&&(p=Math.round(b/a.snapAngle),b=p*a.snapAngle,q(b),l!==b?"function"===typeof e&&e.call(a,b,p):"function"===typeof f&&f.call(a,b,p),l=b)}});return a}(),q=null,w="the-avatar-generator",v="img/",K=v+"assets/",S=v+"empty.png",T=v+
"bg.png",n=null,A=null,X=function(c,d){if(!a.data)return[];for(var b in a.dependentCategories)if(d==b)return L(c,a.dependentCategories[b][0]);b=a.data.gender[c][d]||[];return"object"!=typeof b?[]:Object.keys(b)},L=function(c,d,b,e){if(!a.data||!a.data.gender[c][d])return[];b=b||Object.keys(a.data.gender[c][d])[0];var f=[];c=a.data.gender[c][d][b]||[];if("object"!=typeof c)return f;for(var h in c)e?"#"==h.charAt(0)&&f.push(h):f.push(h);return f},U=function(a){if(a&&!a.disabled&&!a.classList.contains("active")&&
a.classList.contains("a-button")){if(/.*(group\d+).*/.test(a.className)){var d;d=a.className.replace(/.*(group\d+).*/g,"$1");var b=document.body.querySelectorAll(".a-button."+d),e=b.length;for(d=0;d<e;d++)r(b[d],!1)}else window.setTimeout(function(){r(a,!1)},300);r(a,!0)}},G=function(){var c,d=0,b=".a-interface".replace(/^[\.#]/,""),e=new RegExp(b+"-(hair|eyebrows|eyes|mouth|mustache|beard|nose|ears|race|clothes|background|accessories)");F.setOptions(a.schema?X(a.schema.gender,a.category):[]).forOptions(function(b){if(a.schema[a.category]){if(b.value==
a.schema[a.category][0])return d=b.angle,!0}else if("none"==b.value)return d=b.angle,!0});O.snapAngle=F.snapAngle;F.currentAngle=d;U(q.querySelector(".a-interface .a-interface-"+a.category));c=q.querySelector(".a-interface-category");c.className=c.className.replace(e,"");c.classList.add(b+"-"+a.category);r(".a-interface",!1)},P=function(){var c,d;U(q.querySelector(".a-interface-"+a.schema.gender));for(c in a.uniqueCategories)a.uniqueCategories[c].forEach(function(b){if(d=q.querySelector(".a-interface-"+
b))d.disabled=c!=a.schema.gender})};a.categories=[];a.allCategories={};a.uniqueCategories={};a.dependentCategories={race:["face","nose","ears"]};a.skipRenderFor=["race","gender"];Object.defineProperty(a,"data",{get:function(){return I},set:function(c){I=c;c=Object.keys(I.gender);a.allCategories=c.reduce(function(a,b,d){a[b]=Object.keys(I.gender[b]);return a},{});a.uniqueCategories={};a.categories=[];for(var d in a.allCategories){a.uniqueCategories[d]=[];for(var b,e=0;e<a.allCategories[d].length;e++){c=
!1;b=a.allCategories[d][e];0>a.categories.indexOf(b)&&(e<a.categories.length?a.categories.splice(e,0,b):a.categories.push(b));for(var f in a.allCategories)if(d!=f&&0>a.allCategories[f].indexOf(b)){c=!0;break}c&&a.uniqueCategories[d].push(b)}}a.categories.reverse();N=N||a.randomSchema(!0,1)}});Object.defineProperty(a,"schema",{get:function(){return y},set:function(c){var d,b=JSON.stringify(c);b!=J&&(d=a.schemaToAssets(c))&&(J=b,y=JSON.parse(J),a.categories.forEach(function(a){var b=q.querySelector(".a-editor-"+
a);b&&(b.style.backgroundImage=["url(",d[a]?K+d[a]:S,")"].join(""))}),0>a.allCategories[y.gender].indexOf(B)&&0>Object.keys(a.dependentCategories).indexOf(B)&&(B=a.allCategories[y.gender][0],G()),q&&(c=document.createEvent("Events"),c.initEvent("onchange",!0,!0),c.avatar=a,q.dispatchEvent(c)))}});Object.defineProperty(a,"gender",{get:function(){return y.gender},set:function(c){if(c!=y.gender){var d=JSON.parse(J);d.gender=c;a.schema=d;P();G()}}});Object.defineProperty(a,"category",{get:function(){return B},
set:function(c){c==B||0>a.allCategories[y.gender].indexOf(c)&&0>Object.keys(a.dependentCategories).indexOf(c)||(B=c,G())}});a.randomSchema=function(c,d){var b={},e={},f=function(a,b,c){var m=M(b,d);if(!m)return a;c&&a.length==c.keyIndex&&(e[c.dependet]?m=e[c.dependet]:e[c.dependet]=m);a.push(m);return"object"==typeof b[m]?f(a,b[m],c):a},h=function(c,e){var g,m=a.data.gender[b.gender];m[c]?(g=M(m[c],d))&&(b[c]="object"==typeof m[c][g]?f([g],m[c][g],e):[g]):b[c]=["none"]};b.gender=M(a.data.gender,d);
for(var k=0,p;k<a.categories.length;k++){p=!1;for(var l in a.dependentCategories)if(0<=a.dependentCategories[l].indexOf(a.categories[k])){h(a.categories[k],{keyIndex:1,dependet:l});p=!0;break}p||h(a.categories[k])}for(l in a.dependentCategories)b[l]=e[l];c||(a.schema=b,P(),G());return b};a.schemaToAssets=function(c){var d,b,e,f={},h=a.data.gender[c.gender];if(!h)return!1;for(b in c)if(!(0<=a.skipRenderFor.indexOf(b))&&(d=h[b])){for(var k=0;k<c[b].length;k++)if(e=c[b][k],d[e]||""==d[e])d=d[e];else if(d&&
"object"==typeof d)d=d[Object.keys(d)[0]];else if("string"!=typeof d||void 0==d)return!1;"object"==typeof d&&(d=d[[Object.keys(d)[0]]]);if("string"!=typeof d)return!1;for(var p in a.dependentCategories)e=L(c.gender,a.dependentCategories[p][0]),e=new RegExp("\\b"+e.join("|")+"\\b"),d=d.replace(e,c[p]);f[b]=d}return f};a.setSchemaProperty=function(c,d){var b=JSON.parse(JSON.stringify(a.schema)),e;for(e in a.dependentCategories)if(c==e){var f,h=L(b.gender,a.dependentCategories[e][0]);for(f in b)for(e=
0;e<b[f].length;e++)0<=h.indexOf(b[f][e])&&(b[f][e]=d[0]||d);break}b[c]=d;a.schema=b};a.detectCategoryByPoint=function(c,d,b,e,f){e=e||a.schema;var h=0,k=[],p,l=a.schemaToAssets(e);if(!l)return!1;n||(n=document.createElement("canvas"),A=n.getContext("2d"));n.width=b;n.height=b;A.clearRect(0,0,n.width,n.height);var q=function(a,e,m){var l=new Image;k.push(l);l.crossorigin="";l.onload=function(){h++;p||(A.drawImage(l,0,0,b,b),0<A.getImageData(c,d,1,1).data[3]?("function"===typeof f&&f("face"===e?"race":
e),p=!0):h>=k.length&&"function"===typeof f&&f("background"))};l.src=a};for(e=a.categories.length-1;0<=e&&!p;e--)l[a.categories[e]]&&"none"!=l[a.categories[e]]&&q(K+l[a.categories[e]],a.categories[e],e)};a.drawSchema=function(c,d){c=c||a.schema;var b,e=0,f=[],h=a.schemaToAssets(c);if(h)Q.save(w+" avatarSchema",c,!0);else return!1;n||(n=document.createElement("canvas"),A=n.getContext("2d"));n.width=480;n.height=480;A.clearRect(0,0,n.width,n.height);var k=function(a){var b=new Image;f.push(b);b.crossorigin=
"";b.onload=function(){e++;if(e>=f.length){for(var a=0;a<f.length;a++)A.drawImage(f[a],0,0);"function"===typeof d&&d(n)}};b.src=a};for(b=0;b<a.categories.length;b++)h[a.categories[b]]&&"none"!=h[a.categories[b]]&&k(K+h[a.categories[b]]),"background"==a.categories[b]&&k(T)};a.getDataUrl=function(c){a.drawSchema(a.schema,function(a){"function"===typeof c&&c(a.toDataURL())})};a.init=function(c,d){d=d||{};w=d.id||w;q=document.querySelector(d.selector||".a-root");var b=q.querySelector(".a-interface"),
e=q.querySelector(".a-download"),f=q.querySelector(".a-more"),h=q.querySelector(".a-logo"),k=q.querySelector(".a-interface-menu"),p=function(b,c){var d=0;z.setOptions(b,12*b.length);l(c||0);a.schema[a.category]&&1<a.schema[a.category].length&&z.forOptions(function(b){if(a.schema[a.category]&&b.value==a.schema[a.category][1])return d=b.angle,!0});z.currentAngle=d},l=function(a){z.rotate(a+(180-12*Math.max(z.count-1,0)/2))},n=function(a){var b=a.currentTarget;window.setTimeout(function(){r(b,!1)},e==
b?500:100)},t=D?"touchstart":"mousedown";document.addEventListener(t,function(b){if(b.target.classList.contains("a-button")){b.target.classList.add("interact");window.setTimeout(function(){b.target.classList.remove("interact")},500);switch(b.target.dataset.action){case "hair":case "eyebrows":case "eyes":case "mouth":case "mustache":case "beard":case "nose":case "ears":case "race":case "clothes":case "background":case "accessories":a.category=b.target.dataset.action;break;case "female":case "male":a.gender=
b.target.dataset.action;break;case "random":a.randomSchema();break;case "category":r(".a-interface",!0);break;case "download":return;case "save":a.drawSchema(a.schema,function(b){var c=b.toDataURL();b=q.querySelector(".a-interface-download");window.cordova&&window.cordova.base64ToGallery?(b.href="javascript:void(0)",b.removeAttribute("download"),b.onclick=function(){a.saveToAlbum(c)}):/edge|msie|trident/i.test(window.navigator.userAgent)?(b.href="javascript:void(0)",b.onclick=function(){window.open("",
"_blank").document.writeln('<img src="'+c+'" />')}):(b.href=c,b.download="avatar.png",b.target="_blank",b.onclick=function(){E("The download will start within second.",q)});window.setTimeout(function(){r(e,!0)},100)})}if("A"==b.target.nodeName&&b.target.href)if(window.cordova)window.open(b.target.href,"_system");else return;b.stopPropagation();return!1}},x);b.addEventListener(t,n,x);e.addEventListener(t,n,x);f.addEventListener("click",n,!0);q.id=w;d.showLogo&&(h.style.display="block");d.showMenu&&
(k.style.display="block");d.imgSrc&&(v=d.imgSrc||"img/",K=v+"assets/",S=v+"empty.png",T=v+"bg.png");d.autoDetectCategory&&q.querySelector(".a-editor > ol").addEventListener("click",function(b){a.detectCategoryByPoint(b.offsetX,b.offsetY,b.target.clientWidth,a.schema,function(b){b&&(a.category=b)})});z.init({onActive:function(b){b&&a.setSchemaProperty(a.category,[a.schema[a.category][0],b.value])},onSet:function(){z.forOptions(function(a){a.element.style.color=a.value})},selector:"#"+w+" .a-editor-colors",
cssClass:"color",cssPreffix:"a-",audio:v+"option.wav"});F.init({onActive:function(b){O.currentAngle=b.angle;var c;c=a.schema?L(a.schema.gender,a.category,b.value,!0):[];p(c,b.angle);b=[b.value];a.schema[a.category]&&"string"!=typeof a.schema[a.category]&&1<a.schema[a.category].length&&b.push(a.schema[a.category][1]);a.setSchemaProperty(a.category,b)},selector:"#"+w+" .a-editor-options",cssPreffix:"a-",audio:v+"option.wav"});O.init({onSnap:function(a,b){F.currentAngle=a},onRollback:function(a,b){l(a)},
onRotate:function(a){l(a)},selector:"#"+w+" .a-editor-options",cssPreffix:"a-"});a.data=c;a.schema=d.schema||Q.load(w+" avatarSchema")||N;P();G();return a};a.saveToAlbum=function(a){if(window.cordova&&window.cordova.base64ToGallery){var d=function(){window.cordova.base64ToGallery(a,"avatar_",function(){E("Avatar has been saved into album.")},function(){E("Save. Something went wrong.")})};/android/i.test(navigator.userAgent)&&window.cordova.plugins&&window.cordova.plugins.diagnostic?window.cordova.plugins.diagnostic.requestRuntimePermission(function(a){a?
d():E("Permission not granted for the requested operation.")},function(){E("Permission. Something went wrong.")},window.cordova.plugins.diagnostic.runtimePermission.WRITE_EXTERNAL_STORAGE):d()}};a.more=function(){r(".a-more",!0)};return a};Avatar.contactMe=function(a){var C=["oleksiy.nesterov+",[].join.apply(["avatar","gmail"],["@"]),".com"].join("");a&&!window.cordova?a.innerHTML=C:window.open("mailto:"+C,window.cordova?"_system":"_blank")};
Avatar().init(window.AvatarData,{showLogo:!0,showMenu:!0,autoDetectCategory:!0});
