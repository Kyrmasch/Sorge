!function(e){function t(t){for(var n,r,i=t[0],s=t[1],c=t[2],u=0,d=[];u<i.length;u++)r=i[u],Object.prototype.hasOwnProperty.call(o,r)&&o[r]&&d.push(o[r][0]),o[r]=0;for(n in s)Object.prototype.hasOwnProperty.call(s,n)&&(e[n]=s[n]);for(m&&m(t);d.length;)d.shift()();return l.push.apply(l,c||[]),a()}function a(){for(var e,t=0;t<l.length;t++){for(var a=l[t],n=!0,i=1;i<a.length;i++){var s=a[i];0!==o[s]&&(n=!1)}n&&(l.splice(t--,1),e=r(r.s=a[0]))}return e}var n={},o={0:0},l=[];function r(t){if(n[t])return n[t].exports;var a=n[t]={i:t,l:!1,exports:{}};return e[t].call(a.exports,a,a.exports,r),a.l=!0,a.exports}r.m=e,r.c=n,r.d=function(e,t,a){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:a})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var a=Object.create(null);if(r.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)r.d(a,n,function(t){return e[t]}.bind(null,n));return a},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="/home/user/Sorge/Sorge/Web/Templates/publics";var i=window.webpackJsonp=window.webpackJsonp||[],s=i.push.bind(i);i.push=t,i=i.slice();for(var c=0;c<i.length;c++)t(i[c]);var m=s;l.push([449,1]),a()}({296:function(e,t){},449:function(e,t,a){"use strict";a.r(t);var n=a(0),o=a.n(n),l=a(99),r=a.n(l),i=a(51),s=a(527),c=a(16),m=a(150),u=a.n(m),d=a(7),p=a.n(d),g=a(26),f=a(3),h=a(521),y=a(247),b=a(533),E=a(543),x=a(535),v=a(528),k=a(504),S=a(238),w=a(544),C=u()("https://sorge.ektu.kz"),T=a(107),j=a(540),N=a(4);function O(e){Object(c.g)().culture;var t=Object(c.e)(),a=Object(c.f)(),n=o.a.useState([]),l=p()(n,2),r=l[0],i=l[1],s=o.a.useState("sorge"),m=p()(s,2),u=m[0],d=m[1],g=o.a.useState(0),f=p()(g,2),h=f[0],E=f[1];o.a.useEffect((function(){fetch("/api/get_tabs",{method:"get"}).then((function(e){return e.json()})).then((function(n){i(n.tabs),d(n.system),""==a.pathname.replace("/","")&&t.push("/".concat(n.tabs[0].code)),e.setReady(!0)}))}),[]),o.a.useEffect((function(){if(r.length>0){var e=a.pathname.replace("/",""),t=r.filter((function(t){return t.code==e}));1==t.length&&E(t[0].itemKey)}}),[r]);var x=function(e,a){"api"!=e.props.code?(E(e.props.itemKey),t.push("/".concat(e.props.code))):window.open("https://sorge.ektu.kz/api?url=/api/".concat(u,".json"),"_blank").focus()};return o.a.createElement("header",{style:{width:"100%",height:"54px",borderBottom:"solid 1px #E6EDF3"}},o.a.createElement("div",{className:"header",style:{}},o.a.createElement("div",{className:"ms-Grid",dir:"ltr"},o.a.createElement("div",{class:"ms-Grid-row"},o.a.createElement("div",{class:"ms-Grid-col ms-sm7 ms-md8 ms-lg9"},o.a.createElement(b.a,{horizontal:!0,tokens:{childrenGap:12}},o.a.createElement("div",{className:"logo box noselect"},o.a.createElement(T.a,{iconName:"TFVCLogo",style:{fontSize:"28px",lineHeight:"34px"}}),o.a.createElement("div",{class:"ms-fontSize-24",style:{lineHeight:"30px"}},"Sorge")),o.a.createElement("div",{className:"pipe"},o.a.createElement(v.a,{"aria-label":"Basic Pivot Example",styles:{link:{height:54}},selectedKey:h,onLinkClick:x},r.map((function(e){return o.a.createElement(k.a,{headerText:e.text,code:e.code,itemKey:e.itemKey,onChange:function(t){return x(e.code)},styles:{}})})),o.a.createElement(k.a,{headerText:"Sorge Api",code:"api",itemKey:"swagger",styles:{}}))))),o.a.createElement("div",{class:"ms-Grid-col ms-sm5 ms-md4 ms-lg3",style:{justifyContent:"flex-end",display:"flex"}},o.a.createElement(b.a,{horizontal:!0,tokens:{childrenGap:12},style:{display:"flex",flexDirection:"row",alignItems:"center",height:54}},o.a.createElement(j.a,{size:N.c.size40,text:"Администратор",initialsColor:N.a.lightBlue}),o.a.createElement(y.a,{text:"Выйти",onClick:function(){window.location.href="/api/logout"},allowDisabledFocus:!0,disabled:!1,checked:!1})))))))}Object(g.a)();var P=a(104),D=a.n(P),z=a(105),F=a.n(z),I=a(534),M=a(54),G=a(524),L=a(248),B=a(523),W=a(516),A=a(522),R=a(41),H=a(13),K=a(541);Object(g.a)();var _=Object(f.o)({fonts:{medium:{fontFamily:"Monaco, Menlo, Consolas",fontSize:"25px"}},nameText:{fontWeight:"bold"},exampleRoot:{marginTop:"20px"}}),J={type:M.a.largeHeader,title:"",subText:""},V={main:{maxWidth:450}};function Z(e){var t=o.a.useState(e.table),a=p()(t,2),n=a[0],l=a[1],r=o.a.useState(e.index),i=p()(r,2),s=(i[0],i[1],o.a.useState(e.core)),c=p()(s,2),m=c[0],u=c[1],d=o.a.useState(new W.a({onSelectionChanged:function(){h({selectionDetails:Q()})}})),g=p()(d,2),f=g[0],h=g[1],b=o.a.useState(!0),E=p()(b,2),v=E[0],k=E[1],S=o.a.useState(J),w=p()(S,2),C=w[0],j=w[1],N=o.a.useState([]),O=p()(N,2),P=O[0],z=O[1],M=o.a.useState(!1),Z=p()(M,2),U=Z[0],Y=Z[1],q=o.a.useMemo((function(){return{isBlocking:!0,styles:V,dragOptions:{moveMenuItemText:"Move",closeMenuItemText:"Close",menu:B.a}}}),[!0]),Q=function(){f.getSelectedCount()},X=function(){k(!v)};return o.a.createElement(o.a.Fragment,null,o.a.createElement(I.a,{selection:f},o.a.createElement(A.a,{items:n.rows,compact:!1,columns:n.columns,onColumnHeaderClick:function(t,a){if(!e.core&&a){u(a.fieldName);var n=Object.assign({},e.table);n.rows=F()(e.table.rows),l(n)}},selectionMode:R.b.multiple,getKey:function(e){return e.key},setKey:"multiple",selection:f,selectionPreservedOnEmptyClick:!0,onRenderItemColumn:function(e,t,a){var n=e[a.fieldName],l=!1;return null!=m&&"".concat(a.fieldName)=="".concat(m)&&"-"!=n&&(l=!0),0==l?o.a.createElement("span",null,n):o.a.createElement("b",{className:"core_column",onClick:function(){return function(e){if(e){Y(!0),k(!1),z([]);var t=J;t.title=e,t.subText="",j(t),fetch("/api/wiki_pages",{method:"post",headers:{Accept:"application/json, text/plain, */*","Content-Type":"application/json"},body:JSON.stringify({word:e})}).then((function(e){return e.json()})).then((function(t){var a=J;a.title=e,a.subText=t.info,j(a);var n=t.pages.map((function(e,t){return{key:t,activityDescription:[o.a.createElement("span",{key:1,style:{fontWeight:"bold"}},e),o.a.createElement("span",{key:2})],activityIcon:o.a.createElement(T.a,{iconName:"PageLink"}),isCompact:!0}}));z(n||[]),Y(!1)})).catch((function(e){Y(!1)}))}}(n)}},n)},layoutMode:H.e.justified,isHeaderVisible:!0,enterModalSelectionOnTouch:!0,ariaLabelForSelectionColumn:"Toggle selection",ariaLabelForSelectAllCheckbox:"Toggle selection for all items",checkButtonAriaLabel:"select row",onItemInvoked:function(e){}})),o.a.createElement(G.a,{hidden:v,onDismiss:X,dialogContentProps:C,modalProps:q,styles:{root:{minHeight:50}}},1==U&&o.a.createElement(o.a.Fragment,null,o.a.createElement(x.a,{label:"Поиск ...",styles:{root:{paddingTop:"25px"}}})),P.map((function(e){return o.a.createElement(K.a,D()({},e,{key:e.key,className:_.exampleRoot}))})),o.a.createElement(L.a,null,o.a.createElement(y.a,{onClick:X,text:"Закрыть"}))))}var U=a(106),Y=a.n(U),q=a(537),Q=a(542);Object(g.a)();Object(f.o)({});function X(e){var t=e.toggle,a=o.a.useState(e.hidden),n=p()(a,2),l=n[0],r=(n[1],o.a.useState(e.settings.from||0)),i=p()(r,2),s=i[0],c=i[1],m=o.a.useState(e.settings.to||0),u=p()(m,2),d=u[0],g=u[1],f=o.a.useState(e.settings.merge||!1),E=p()(f,2),x=E[0],v=E[1],k=o.a.useMemo((function(){return{isBlocking:!0,styles:w,dragOptions:{moveMenuItemText:"Move",closeMenuItemText:"Close",menu:B.a}}}),[!0]),S={type:M.a.normal,title:"Настройки для ссылки",subText:""},w={main:{maxWidth:450}},C={iconName:"IncreaseIndentLegacy"},T={spinButtonWrapper:{width:75},labelWrapper:{width:150}};o.a.useEffect((function(){}),[]);var j=o.a.useCallback((function(e,t){void 0!==t&&c(t)}),[]),N=o.a.useCallback((function(e,t){void 0!==t&&g(t)}),[]);return o.a.createElement(o.a.Fragment,null,o.a.createElement(G.a,{hidden:l,onDismiss:t,dialogContentProps:S,modalProps:k},o.a.createElement("div",{style:{minHeight:60}},o.a.createElement(b.a,{tokens:{childrenGap:20}},o.a.createElement(q.a,{label:"Начать с    ",iconProps:C,defaultValue:"0",min:0,max:1e3,step:1,onChange:j,value:s,styles:T}),o.a.createElement(q.a,Y()({label:"Закончить на",iconProps:C,styles:{labelWrapper:{width:150}},defaultValue:"0",min:0,max:1e3,step:1,onChange:N,value:d},"styles",T)),o.a.createElement(Q.a,{label:"Объединить в одну",inlineLabel:!0,styles:{label:{width:150}},onText:"Да",offText:"Нет",checked:x,onChange:function(e,t){v(t)}}))),o.a.createElement(L.a,null,o.a.createElement(y.a,{onClick:function(a){return e.change({from:s,to:d,merge:x}),void t()},text:"Применить"}),o.a.createElement(h.a,{onClick:t,text:"Закрыть"}))))}function $(e){var t=e.yes,a=e.toggle,n=o.a.useMemo((function(){return{isBlocking:!0,styles:r,dragOptions:{moveMenuItemText:"Move",closeMenuItemText:"Close",menu:B.a}}}),[!0]),l={type:M.a.normal,title:e.title,subText:e.subtext},r={main:{maxWidth:450}};return o.a.useEffect((function(){}),[]),o.a.createElement(o.a.Fragment,null,o.a.createElement(G.a,{hidden:!1,onDismiss:a,dialogContentProps:l,modalProps:n},o.a.createElement(L.a,null,o.a.createElement(h.a,{onClick:t,text:"Да"}),o.a.createElement(y.a,{onClick:a,text:"Нет"}))))}Object(g.a)();var ee=a(536),te=Object(f.A)({exampleRoot:{marginTop:"20px"},nameText:{fontWeight:"bold"}}),ae=[{type:"PDF",url:"https://ecsocman.hse.ru/data/2010/05/26/1212617593/Doklad-Pages-001-392-posle-obreza-170x240mm.pdf",title:"ГЕОЭКОНОМИКА И КОНКУРЕНТОСПОСОБНОСТЬ РОССИИ"},{type:"FileHTML",url:"https://aviapoisk.kz/raspisanie/aeroporta/ustkamenogorsk",title:"Расписание вылетов и прилетов Усть-Каменогорска"},{type:"FileHTML",url:"https://www.gks.ru/bgd/regl/b09_47/IssWWW.exe/Stg/2-13.htm",title:"ПРОИЗВОДСТВО МОЛОКА В КРЕСТЬЯНСКИХ (фермерских) ХОЗЯЙСТВАХ"},{type:"FileImage",url:"https://uchet.kz/news/%D0%91%D0%B5%D0%B7%D1%8B%D0%BC%D1%8F%D0%BD%D0%BD%D1%8B%D0%B9hhh.png",title:"Валовый-внутренний продукт"},{type:"FileImage",url:"https://cf.ppt-online.org/files/slide/d/dgbFzC08V4m5usoPBvipOU2ZjRYWLcktDHflaq/slide-1.jpg",title:"Основные технико-экономические показатели"}];function ne(e){var t=e.toggle,a=e.select,n=o.a.useMemo((function(){return{isBlocking:!0,styles:r,dragOptions:{moveMenuItemText:"Move",closeMenuItemText:"Close",menu:B.a}}}),[!0]),l={type:M.a.normal,title:"Примеры",subText:"Ссылки для тестирования парсера"},r={main:{maxWidth:"600px !important"}},i=o.a.useState([]),s=p()(i,2),c=s[0],m=s[1];o.a.useEffect((function(){var e=ae.map((function(e,t){return{key:t+1,activityDescription:[o.a.createElement(ee.a,{key:1,className:te.nameText,onClick:function(){u(e.url)}},e.title)],activityIcon:o.a.createElement(T.a,{iconName:e.type}),comments:[o.a.createElement("span",{key:t+1},e.url),o.a.createElement(ee.a,{key:2,className:te.nameText,onClick:function(){u(e.url)}})],timeStamp:e.type}}));m(e)}),[]);var u=function(e){a(!0,e),t(!1)};return o.a.createElement(o.a.Fragment,null,c.length>0&&o.a.createElement(G.a,{hidden:!1,onDismiss:t,dialogContentProps:l,styles:{main:{maxWidth:"750px !important"}},modalProps:n},o.a.createElement("div",null,c.map((function(e){return o.a.createElement(K.a,D()({},e,{key:e.key,className:te.exampleRoot}))}))),o.a.createElement(L.a,null,o.a.createElement(y.a,{onClick:t,text:"Закрыть"}))))}Object(g.a)();var oe=Object(f.o)({fonts:{medium:{fontFamily:"Monaco, Menlo, Consolas",fontSize:"25px"}},empty:{fontSize:50,height:50,width:50,margin:"0 25px",color:"lightgray"}}),le={data:[],cores:[]};function re(){Object(c.g)().culture,Object(c.e)();var e=o.a.useState(!1),t=p()(e,2),a=t[0],n=t[1],l=o.a.useState(!1),r=p()(l,2),i=r[0],s=r[1],m=o.a.useState(""),u=p()(m,2),d=u[0],g=u[1],f=o.a.useState(!1),T=p()(f,2),j=T[0],N=T[1],P=o.a.useState({from:327,to:328,merge:!1}),D=p()(P,2),z=D[0],F=D[1],I=o.a.useState(null),M=p()(I,2),G=M[0],L=M[1],B=o.a.useState(!1),W=p()(B,2),A=W[0],R=W[1],H=o.a.useState(le),K=p()(H,2),_=K[0],J=K[1],V=o.a.useState([]),U=p()(V,2),Y=U[0],q=U[1],Q=o.a.useState(!1),ee=p()(Q,2),te=ee[0],ae=ee[1];o.a.useEffect((function(){C.on("progress",me)}),[]),o.a.useState((function(){if(window.localStorage.getItem("tables")){var e=window.localStorage.getItem("url")||"",t=JSON.parse(window.localStorage.getItem("tables"));try{var a=JSON.parse(window.localStorage.getItem("guids"));q(a||[])}catch(e){}g(e),J(t||le)}}),[A]),o.a.useEffect((function(){d&&(window.localStorage.setItem("tables",JSON.stringify(_)),window.localStorage.setItem("url",d))}),[_]),o.a.useEffect((function(){Y&&window.localStorage.setItem("guids",JSON.stringify(Y))}),[Y]),o.a.useState((function(){}),[z]);var re,ie,se,ce=function(e,t){e&&g(t)},me=function(e){L(e.description)};return o.a.createElement(o.a.Fragment,null,o.a.createElement(O,{setReady:R}),A&&o.a.createElement("div",{className:"main",style:{bottom:"0px",height:"calc(100% - 56px)",backgroundColor:"#faf9f8",position:"relative"}},o.a.createElement("div",{class:"ms-Grid",dir:"ltr",style:{height:"100%",overflowY:"scroll",overflowX:"auto"}},o.a.createElement("div",{class:"ms-Grid-row",style:{height:"100%"}},o.a.createElement("div",{class:"ms-Grid-col ms-sm2 ms-md2ms-lg2"}),o.a.createElement("div",{class:"ms-Grid-col ms-sm8 ms-md8 ms-lg8",style:{height:"100%",backgroundColor:"#fff"}},o.a.createElement(b.a,{tokens:{childrenGap:10}},o.a.createElement("div",{style:{padding:"0px 32px",height:"100%",marginTop:12}},o.a.createElement("header",{style:{padding:"12px 0px",minHeight:50,boxSizing:"border-box"},className:"row"},o.a.createElement("h1",{className:"h1"},"Парсер"))),o.a.createElement("div",{style:{padding:"12px",boxSizing:"border-box"}},o.a.createElement(b.a,{horizontal:!0,tokens:{childrenGap:10},style:{justifyContent:"center"}},o.a.createElement(E.a,{placeholder:"Поиск таблиц на сайте",styles:{root:{width:600}},iconProps:{iconName:"Link"},onChange:ce,clearButtonProps:{iconProps:{iconName:"Settings"},disabled:(re=d,ie=re.substring(re.lastIndexOf("/")+1).split("."),se=ie[ie.length-1].toLowerCase(),!["pdf"].includes(se))},onClear:function(){N(!0)},value:d}),o.a.createElement(h.a,{disabled:1==te,text:"Найти",onClick:function(e){return n(!0)},allowDisabledFocus:!0,checked:!1}),o.a.createElement(y.a,{disabled:1==te,text:"Пример",onClick:function(e){return s(!0)},allowDisabledFocus:!0,checked:!1})),o.a.createElement(b.a,{tokens:{childrenGap:24},style:{marginTop:24},horizontal:!1},0==_.data.length&&0==te&&o.a.createElement(o.a.Fragment,null,o.a.createElement("div",{style:{display:"flex",justifyContent:"center",marginTop:"150px"}},o.a.createElement(b.a,{tokens:{childrenGap:24},style:{marginTop:24},horizontal:!1},o.a.createElement(S.a,{"aria-label":"Compass",iconName:"ProductRelease",style:oe.empty}),o.a.createElement(w.a,{variant:"medium",nowrap:!0,block:!0,style:{textAlign:"center",color:"lightgray"}},"Нет данных")))),1==te&&o.a.createElement(o.a.Fragment,null,o.a.createElement(x.a,{label:G||"Извелечение данных...",styles:{root:{paddingTop:"25px"}}})),_.data.length>0&&o.a.createElement(v.a,{"aria-label":"Basic Pivot Example",overflowBehavior:"menu",styles:{root:{display:"flex",justifyContent:"center",padding:"0 200px"}}},_.data.map((function(e,t){return o.a.createElement(k.a,{headerText:"Таблица #".concat(t+1)},o.a.createElement("div",null,o.a.createElement(Z,{table:e,index:t,core:_.cores[t]})))}))))))),o.a.createElement("div",{class:"ms-Grid-col ms-sm2 ms-md2 ms-lg2"})))),1==j&&o.a.createElement(X,{settings:z,toggle:N,change:F,hidden:!j}),1==a&&o.a.createElement($,{title:"Sorge",subtext:"Выполнить поиск таблиц?",toggle:n,yes:function(){n(!1),L(null),d&&(ae(!0),J({data:[],cores:[]}),fetch("/api/get_tables",{method:"post",headers:{Accept:"application/json, text/plain, */*","Content-Type":"application/json"},body:JSON.stringify({url:d,settings:z})}).then((function(e){return e.json()})).then((function(e){if(e.result){var t=[];e.result.map((function(e){try{var a=Object.keys(e[0]),n=(a=a.map((function(e){return e.replace(/(\r\n|\n|\r)/gm," ").replace("/"," ")}))).map((function(e,t){return{key:"column".concat(t),name:e,fieldName:e,minWidth:100,maxWidth:200,isRowHeader:!0,isResizable:!0,isSorted:0==t,isSortedDescending:!1,sortAscendingAriaLabel:"Sorted A to Z",sortDescendingAriaLabel:"Sorted Z to A",data:"string",isPadded:!0}})),o=e.map((function(e,t){var n={};n.key=t,e.key=function(e){return this[Object.keys(this)[e]]};for(var o=0;o<a.length;o++){var l=e.key(o);n["".concat(a[o])]=l}return n}));t.push({columns:n,rows:o})}catch(e){console.error(e)}})),J({data:t,cores:e.cores}),q(e.guids),ae(!1)}})).catch((function(e){J({data:[],cores:[]}),ae(!1)})))},hidden:!a}),1==i&&o.a.createElement(ne,{toggle:s,select:ce,hidden:!i}))}var ie=a(531),se=a(545);Object(g.a)();var ce={root:{maxWidth:440,minWidth:320,minHeight:400,marginLeft:"auto",marginRight:"auto",boxShadow:"0 2px 6px rgb(0 0 0 / 20%)",backgroundColor:"#fff",width:"calc(100% - 40px)",marginBottom:"28px",padding:"44px"}};function me(){Object(c.g)().culture;var e=Object(c.e)(),t=o.a.useState(""),a=p()(t,2),n=a[0],l=a[1],r=o.a.useState(!1),i=p()(r,2),s=i[0],m=i[1],u=o.a.useState(""),d=p()(u,2),g=d[0],f=d[1],y=o.a.useState(0),E=p()(y,2),x=E[0],v=(E[1],o.a.useRef(null));o.a.useEffect((function(){}),[x]);var k=function(){fetch("/api/login",{method:"post",headers:{Accept:"application/json, text/plain, */*","Content-Type":"application/json"},body:JSON.stringify({login:"admin",password:n,remember:s})}).then((function(e){switch(e.status){case 200:return e.json();default:return e.text()}})).then((function(t){"string"==typeof t||t instanceof String?f(t):1==t.result&&e.push("/")})).catch((function(e,t){console.log(e,t)}))};return o.a.createElement(o.a.Fragment,null,o.a.createElement("div",{className:"main",ref:v,style:{backgroundColor:"#faf9f8"}},o.a.createElement("div",{className:"middle"},o.a.createElement("div",{className:"outer"},o.a.createElement("div",{style:ce.root,className:"box ms-motion-scaleDownIn login-form"},o.a.createElement(b.a,{tokens:{childrenGap:24}},o.a.createElement(b.a,{tokens:{childrenGap:12},horizontal:!0,style:{color:"grey"}},o.a.createElement(T.a,{iconName:"TFVCLogo",style:{fontSize:"32px"}}),o.a.createElement("div",{class:"ms-fontSize-28",style:{}},"Sorge")),o.a.createElement(b.a,{tokens:{childrenGap:12},horizontal:!0},o.a.createElement(j.a,{secondaryText:"Username: admin",text:"Администратор",size:N.c.size40,initialsColor:N.a.lightBlue})),o.a.createElement(b.a,{tokens:{childrenGap:12}},o.a.createElement("div",{class:"ms-fontSize-24",style:{}},"Введите пароль"),o.a.createElement(ie.a,{type:"password",value:n,onChange:function(e){return l(e.target.value)},canRevealPassword:!0,errorMessage:g,onKeyDown:function(e){13==e.keyCode&&k()},revealPasswordAriaLabel:"Show password"}),o.a.createElement(se.a,{label:"Оставаться в системе",checked:s,onChange:function(e){return m(e.target.value)}})),o.a.createElement(b.a,{horizontal:!0,style:{justifyContent:"flex-end"}},o.a.createElement(h.a,{disabled:!1,text:"Войти",onClick:k,allowDisabledFocus:!0,checked:!1}))))))))}function ue(){Object(c.g)().culture,Object(c.e)();var e=o.a.useState(!1),t=p()(e,2),a=(t[0],t[1]);return o.a.createElement(o.a.Fragment,null,o.a.createElement(O,{setReady:a}),o.a.createElement("div",{className:"main",style:{bottom:"0px",height:"calc(100% - 54px)",backgroundColor:"#faf9f8",position:"relative"}},o.a.createElement("div",{style:{padding:"0px 32px",height:"100%"}},o.a.createElement("header",{style:{padding:"52px 0px",minHeight:136},className:"row"},o.a.createElement("h1",{className:"h1"},"Настройки")))))}var de=a(245),pe=a.n(de),ge=a(532);Object(g.a)();var fe=[{key:"word",name:"Слово",fieldName:"word",minWidth:150,maxWidth:350,isRowHeader:!0,isResizable:!0,isSorted:!1,isSortedDescending:!1,sortAscendingAriaLabel:"Sorted A to Z",sortDescendingAriaLabel:"Sorted Z to A",data:"string",isPadded:!0},{key:"score",name:"Score",fieldName:"score",minWidth:70,maxWidth:90,isResizable:!0,isSorted:!0,isSortedDescending:!1,data:"number",isPadded:!0}];function he(e){var t=e.toggle,a=o.a.useMemo((function(){return{isBlocking:!0,styles:l,dragOptions:{moveMenuItemText:"Move",closeMenuItemText:"Close",menu:B.a}}}),[!0]),n={type:M.a.largeHeader,title:e.title,subText:e.subtext},l={main:{maxWidth:550}},r=o.a.useState(e.words),i=p()(r,2),s=(i[0],i[1],o.a.useState([])),c=p()(s,2),m=c[0],u=c[1],d=o.a.useState(new W.a({onSelectionChanged:function(){h({selectionDetails:E()})}})),g=p()(d,2),f=g[0],h=g[1];o.a.useEffect((function(){var t=e.words.map((function(e,t){var a={};return a.key=t,a.word=e[1],a.score=Math.round(100*(e[0]+Number.EPSILON))/100,a}));u(t.filter((function(e){return e.score>0})).sort(b))}),[]);var b=function(e,t){return e.score<t.score?1:e.score>t.score?-1:0},E=function(){f.getSelectedCount()};return o.a.createElement(o.a.Fragment,null,o.a.createElement(G.a,{hidden:!1,onDismiss:t,dialogContentProps:n,styles:{main:{maxWidth:"750px !important"}},modalProps:a},o.a.createElement(A.a,{items:m,compact:!0,columns:fe,onColumnHeaderClick:function(e,t){},selectionMode:R.b.multiple,getKey:function(e){return e.key},setKey:"multiple",selection:f,selectionPreservedOnEmptyClick:!1,onRenderItemColumn:function(e,t,a){var n=e[a.fieldName];return o.a.createElement("span",null,n)},layoutMode:H.e.justified,isHeaderVisible:!0,enterModalSelectionOnTouch:!0,ariaLabelForSelectionColumn:"Toggle selection",ariaLabelForSelectAllCheckbox:"Toggle selection for all items",checkButtonAriaLabel:"select row",onItemInvoked:function(e){}}),o.a.createElement(L.a,null,o.a.createElement(y.a,{onClick:t,text:"Закрыть"}))))}a(447);var ye=a(525),be=a(161),Ee=a(538),xe=[{key:"russian",text:"Русский",iconProps:{iconName:"LocaleLanguage"},checked:!0},{key:"english",text:"English",iconProps:{iconName:"LocaleLanguage"},disabled:!1},{key:"kazakh",text:"Қазақша",iconProps:{iconName:"LocaleLanguage"},disabled:!1}],ve={physics:!0,autoResize:!0,edges:{color:"#0078d4",font:{size:10},arrows:{to:{enabled:!0,scaleFactor:1,type:"arrow"},from:{enabled:!1,scaleFactor:1,type:"arrow"}}},nodes:{font:{size:14,face:"Verdana"},shape:"dot"},interaction:{hideEdgesOnDrag:!0,tooltipDelay:200,keyboard:!1,navigationButtons:!0}};function ke(){Object(c.g)().culture,Object(c.e)();var e=o.a.useState([{key:"basic",text:"Базовый",iconProps:{iconName:"GitGraph"},checked:!0},{key:"spacy",text:"Spacy",iconProps:{iconName:"GitGraph"},disabled:!1},{key:"knowlegegraph",text:"Bert",iconProps:{iconName:"GitGraph"},disabled:!1}]),t=p()(e,2),a=t[0],n=t[1],l=o.a.useState([{key:"rake",text:"Rake",iconProps:{iconName:"Quantity"},checked:!0},{key:"tfidf",text:"TF iDF",iconProps:{iconName:"Quantity"},disabled:!1}]),r=p()(l,2),i=r[0],s=r[1],m=o.a.useState([{key:"entities",text:"Сущности",iconProps:{iconName:"LookupEntities"},split:!0,onClick:function(){return Q(!0)}},{key:"save",text:"Сохранить",iconProps:{iconName:"Save"},onClick:function(){return se()}}]),u=p()(m,2),d=u[0],g=(u[1],o.a.useState("rake")),f=p()(g,2),y=f[0],E=f[1],v=o.a.useState("russian"),k=p()(v,2),S=k[0],w=k[1],C=o.a.useState(!1),T=p()(C,2),j=T[0],N=T[1],P=o.a.useState(""),D=p()(P,2),z=D[0],I=D[1],M=o.a.useState(!1),G=p()(M,2),L=G[0],B=G[1],W=o.a.useState({nodes:[],edges:[]}),A=p()(W,2),R=A[0],H=A[1],K=o.a.useState([]),_=p()(K,2),J=_[0],V=_[1],Z=o.a.useState(!1),U=p()(Z,2),q=U[0],Q=U[1],X=o.a.useState("basic"),$=p()(X,2),ee=$[0],te=$[1],ae=o.a.useState("build"),ne=p()(ae,2),oe=ne[0],le=ne[1];o.a.useEffect((function(){document.title="Sorge - Концепт карта",fetch("/maps/example",{method:"post",headers:{Accept:"application/json, text/plain, */*","Content-Type":"application/json"}}).then((function(e){return e.json()})).then((function(e){I(e.value)}))}),[]),o.a.useEffect((function(){if(R.nodes.length>0){var e=document.getElementsByClassName("vis-network");e.length>0&&e[0].scrollIntoView()}}),[R]),o.a.useEffect((function(){""!=z&&fetch("/maps/detect",{method:"post",headers:{Accept:"application/json, text/plain, */*","Content-Type":"application/json"},body:JSON.stringify({text:z})}).then((function(e){return e.json()})).then((function(e){w(e.value)}))}),[z]),o.a.useEffect((function(){if(""!=S&&a){var e=F()(a);S==xe[2].key?(e[1].disabled=!0,te("basic")):(delete e[1].disabled,delete e[2].disabled),n(e)}}),[S]),o.a.useEffect((function(){if(""!=ee){var e=i.map((function(e){return"basic"!=ee?e.disabled=!0:delete e.disabled,e}));s(e)}}),[ee]);var re=function(){H({nodes:[],edges:[]}),V([])},se=function(){var e=document.getElementsByTagName("canvas")[0].toDataURL("image/png");window.open("about:blank","image from canvas").document.write("<img src='"+e+"' alt='from canvas'/>")};return o.a.createElement(o.a.Fragment,null,o.a.createElement(O,{setReady:N}),j&&!be.isMobile&&o.a.createElement("div",{className:"main",style:{bottom:"0px",height:"calc(100% - 56px)",backgroundColor:"#faf9f8",position:"relative"}},o.a.createElement("div",{class:"ms-Grid",dir:"ltr",style:{height:"100%",overflowY:"scroll",overflowX:"auto"}},o.a.createElement("div",{class:"ms-Grid-row",style:{height:"100%"}},o.a.createElement("div",{class:"ms-Grid-col ms-sm2 ms-md2ms-lg2"}),o.a.createElement("div",{class:"ms-Grid-col ms-sm8 ms-md8 ms-lg8",style:{minHeight:"100%",backgroundColor:"#fff",height:"max-content"}},o.a.createElement(b.a,{tokens:{childrenGap:10}},o.a.createElement("div",{style:{padding:"0px 32px",height:"100%",marginTop:12}},o.a.createElement("header",{style:{padding:"12px 0px",minHeight:50,boxSizing:"border-box"},className:"row"},o.a.createElement("h1",{className:"h1"},"Концепт карта"))),o.a.createElement("div",{style:Y()({padding:"12px",boxSizing:"border-box"},"padding","0 24px")},o.a.createElement(b.a,{horizontal:!0,tokens:{childrenGap:10},style:{justifyContent:"center"}},o.a.createElement(ie.a,{label:"Текст для обработки",multiline:!0,rows:5,styles:{root:{width:"100%",borderColor:"rgb(107, 148, 184)"},fieldGroup:{borderColor:"rgb(107, 148, 184)"}},required:!0,value:z,readOnly:L,description:"".concat(z.length," символов"),onChange:function(e){return t=e.target.value,void I(t);var t}})),o.a.createElement(b.a,{tokens:{childrenGap:24},style:{marginTop:12},horizontal:!0},o.a.createElement(b.a.Item,null,o.a.createElement(ge.a,{label:"Язык текста",defaultSelectedKey:"russian",selectedKey:S,options:xe,onChange:function(e,t){w(t.key)}})),o.a.createElement(b.a.Item,null,o.a.createElement(ge.a,{label:"Способ построения карты",defaultSelectedKey:"rake",selectedKey:ee,options:a,onChange:function(e,t){te(t.key),"basic"==t.key?le("build"):le("knowlegegraph"),re()}})),o.a.createElement(b.a.Item,null,o.a.createElement(ge.a,{label:"Метод извлечения ключевых слов",defaultSelectedKey:"rake",selectedKey:y,options:i,onChange:function(e,t){E(t.key),re()}}))),o.a.createElement(b.a,{tokens:{childrenGap:24},style:{marginTop:24},horizontal:!0},o.a.createElement(b.a.Item,null,o.a.createElement(h.a,{styles:{root:{width:292}},text:"Построить",onClick:function(){return function(){if(z.length>0&&""!=oe){B(!0),re();var e=z.replace(/\s+/g," ");fetch("/maps/".concat(oe),{method:"post",headers:{Accept:"application/json, text/plain, */*","Content-Type":"application/json"},body:JSON.stringify({text:e,method:y,relation:ee,language:S})}).then((function(e){return e.json()})).then((function(e){e.data&&(H({nodes:e.data.nodes,edges:e.data.edges}),V(e.data.words)),B(!1)})).catch((function(e){B(!1)}))}}()},allowDisabledFocus:!0,disabled:0==z.length||L,checked:!1}))),1==L&&o.a.createElement(o.a.Fragment,null,o.a.createElement(x.a,{label:"Построение...",styles:{root:{paddingTop:"125px"}}})),R.nodes.length>0&&o.a.createElement(o.a.Fragment,null,o.a.createElement(ye.a,{items:d,styles:{root:{marginTop:"24px",paddingLeft:"6px",borderTop:"1px solid rgb(107, 148, 184)",paddingTop:"8px"}}}),o.a.createElement(pe.a,{id:"graph",graph:R,options:ve,style:{height:"600px",backgroundColor:"rgb(243, 242, 241)",margin:"24px 0px",marginTop:"0px",backgroundImage:"linear-gradient(white .4rem, transparent .4rem), linear-gradient(90deg, white .4rem, transparent .4rem)",backgroundSize:"5rem 5rem"}})),1==q&&o.a.createElement(he,{title:"Ключевые слова",subtext:"",words:J,toggle:Q}))))))),j&&be.isMobile&&o.a.createElement(o.a.Fragment,null,o.a.createElement(Ee.a,null,"Недоступен для мобильной версии.")))}function Se(){return o.a.createElement(o.a.Fragment,null,o.a.createElement(c.a,{exact:!0,path:"/",component:re}),o.a.createElement(c.a,{exact:!0,path:"/parser",component:re}),o.a.createElement(c.a,{exact:!0,path:"/login",component:me}),o.a.createElement(c.a,{exact:!0,path:"/maps",component:ke}),o.a.createElement(c.a,{exact:!0,path:"/settings",component:ue}))}var we=document.getElementById("root");r.a.render(o.a.createElement(i.a,null,o.a.createElement(s.a,{applyTo:"body",theme:{palette:{}},style:{height:"100%"}},o.a.createElement(Se,null))),we)}});