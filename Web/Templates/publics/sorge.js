!function(e){function t(t){for(var n,r,i=t[0],c=t[1],s=t[2],u=0,d=[];u<i.length;u++)r=i[u],Object.prototype.hasOwnProperty.call(l,r)&&l[r]&&d.push(l[r][0]),l[r]=0;for(n in c)Object.prototype.hasOwnProperty.call(c,n)&&(e[n]=c[n]);for(m&&m(t);d.length;)d.shift()();return o.push.apply(o,s||[]),a()}function a(){for(var e,t=0;t<o.length;t++){for(var a=o[t],n=!0,i=1;i<a.length;i++){var c=a[i];0!==l[c]&&(n=!1)}n&&(o.splice(t--,1),e=r(r.s=a[0]))}return e}var n={},l={0:0},o=[];function r(t){if(n[t])return n[t].exports;var a=n[t]={i:t,l:!1,exports:{}};return e[t].call(a.exports,a,a.exports,r),a.l=!0,a.exports}r.m=e,r.c=n,r.d=function(e,t,a){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:a})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var a=Object.create(null);if(r.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)r.d(a,n,function(t){return e[t]}.bind(null,n));return a},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="/home/user/Sorge/Sorge/Web/Templates/publics";var i=window.webpackJsonp=window.webpackJsonp||[],c=i.push.bind(i);i.push=t,i=i.slice();for(var s=0;s<i.length;s++)t(i[s]);var m=c;o.push([202,1]),a()}({186:function(e,t){},202:function(e,t,a){"use strict";a.r(t);var n=a(0),l=a.n(n),o=a(61),r=a.n(o),i=a(39),c=a(276),s=a(16),m=a(92),u=a.n(m),d=a(9),p=a.n(d),g=a(28),f=a(2),h=a(270),y=a(280),E=a(287),b=a(283),x=a(277),v=a(255),S=a(130),k=a(288),w=u()("https://sorge.ektu.kz"),C=a(140),j=a(68),O=a(274),T=a(4);function N(e){Object(s.g)().culture;var t=Object(s.e)(),a=Object(s.f)(),n=l.a.useState([]),o=p()(n,2),r=o[0],i=o[1],c=l.a.useState(0),m=p()(c,2),u=m[0],d=m[1];l.a.useEffect((function(){fetch("/api/get_tabs",{method:"get"}).then((function(e){return e.json()})).then((function(n){i(n),""==a.pathname.replace("/","")&&t.push("/".concat(n[0].code)),e.setReady(!0)}))}),[]),l.a.useEffect((function(){if(r.length>0){var e=a.pathname.replace("/",""),t=r.filter((function(t){return t.code==e}));1==t.length&&d(t[0].itemKey)}}),[r]);var g=function(e,a){d(e.props.itemKey),t.push("/".concat(e.props.code))};return l.a.createElement("header",{style:{width:"100%",height:"54px",borderBottom:"solid 1px #E6EDF3"}},l.a.createElement("div",{className:"header",style:{}},l.a.createElement("div",{className:"ms-Grid",dir:"ltr"},l.a.createElement("div",{class:"ms-Grid-row"},l.a.createElement("div",{class:"ms-Grid-col ms-sm7 ms-md8 ms-lg9"},l.a.createElement(y.a,{horizontal:!0,tokens:{childrenGap:12}},l.a.createElement("div",{className:"logo box noselect"},l.a.createElement(j.a,{iconName:"TFVCLogo",style:{fontSize:"28px",lineHeight:"34px"}}),l.a.createElement("div",{class:"ms-fontSize-24",style:{lineHeight:"30px"}},"Sorge")),l.a.createElement("div",{className:"pipe"},l.a.createElement(x.a,{"aria-label":"Basic Pivot Example",styles:{link:{height:54}},selectedKey:u,onLinkClick:g},r.map((function(e){return l.a.createElement(v.a,{headerText:e.text,code:e.code,itemKey:e.itemKey,onChange:function(t){return g(e.code)},styles:{}})})))))),l.a.createElement("div",{class:"ms-Grid-col ms-sm5 ms-md4 ms-lg3",style:{justifyContent:"flex-end",display:"flex"}},l.a.createElement(y.a,{horizontal:!0,tokens:{childrenGap:12},style:{display:"flex",flexDirection:"row",alignItems:"center",height:54}},l.a.createElement(O.a,{size:T.c.size40,text:"Администратор",initialsColor:T.a.lightBlue}),l.a.createElement(C.a,{text:"Выйти",onClick:function(){window.location.href="/api/logout"},allowDisabledFocus:!0,disabled:!1,checked:!1})))))))}Object(g.a)();var z=a(136),G=a.n(z),P=a(137),M=a.n(P),F=a(282),I=a(43),D=a(273),L=a(141),B=a(272),A=a(267),W=a(271),H=a(32),R=a(13),_=a(285);Object(g.a)();var J=Object(f.o)({fonts:{medium:{fontFamily:"Monaco, Menlo, Consolas",fontSize:"25px"}},nameText:{fontWeight:"bold"},exampleRoot:{marginTop:"20px"}}),K={type:I.a.largeHeader,title:"",subText:""},V={main:{maxWidth:450}};function X(e){var t=l.a.useState(e.table),a=p()(t,2),n=a[0],o=a[1],r=l.a.useState(e.index),i=p()(r,2),c=(i[0],i[1],l.a.useState(e.core)),s=p()(c,2),m=s[0],u=s[1],d=l.a.useState(new A.a({onSelectionChanged:function(){h({selectionDetails:U()})}})),g=p()(d,2),f=g[0],h=g[1],y=l.a.useState(!0),E=p()(y,2),x=E[0],v=E[1],S=l.a.useState(K),k=p()(S,2),w=k[0],O=k[1],T=l.a.useState([]),N=p()(T,2),z=N[0],P=N[1],I=l.a.useState(!1),X=p()(I,2),Y=X[0],Z=X[1],q=l.a.useMemo((function(){return{isBlocking:!0,styles:V,dragOptions:{moveMenuItemText:"Move",closeMenuItemText:"Close",menu:B.a}}}),[!0]),U=function(){f.getSelectedCount()},Q=function(){v(!x)};return l.a.createElement(l.a.Fragment,null,l.a.createElement(F.a,{selection:f},l.a.createElement(W.a,{items:n.rows,compact:!1,columns:n.columns,onColumnHeaderClick:function(t,a){if(!e.core&&a){u(a.fieldName);var n=Object.assign({},e.table);n.rows=M()(e.table.rows),o(n)}},selectionMode:H.b.multiple,getKey:function(e){return e.key},setKey:"multiple",selection:f,selectionPreservedOnEmptyClick:!0,onRenderItemColumn:function(e,t,a){var n=e[a.fieldName],o=!1;return null!=m&&"".concat(a.fieldName)=="".concat(m)&&"-"!=n&&(o=!0),0==o?l.a.createElement("span",null,n):l.a.createElement("b",{className:"core_column",onClick:function(){return function(e){if(e){Z(!0),v(!1),P([]);var t=K;t.title=e,t.subText="",O(t),fetch("/api/wiki_pages",{method:"post",headers:{Accept:"application/json, text/plain, */*","Content-Type":"application/json"},body:JSON.stringify({word:e})}).then((function(e){return e.json()})).then((function(t){var a=K;a.title=e,a.subText=t.info,O(a);var n=t.pages.map((function(e,t){return{key:t,activityDescription:[l.a.createElement("span",{key:1,style:{fontWeight:"bold"}},e),l.a.createElement("span",{key:2})],activityIcon:l.a.createElement(j.a,{iconName:"PageLink"}),isCompact:!0}}));P(n||[]),Z(!1)})).catch((function(e){Z(!1)}))}}(n)}},n)},layoutMode:R.e.justified,isHeaderVisible:!0,enterModalSelectionOnTouch:!0,ariaLabelForSelectionColumn:"Toggle selection",ariaLabelForSelectAllCheckbox:"Toggle selection for all items",checkButtonAriaLabel:"select row",onItemInvoked:function(e){}})),l.a.createElement(D.a,{hidden:x,onDismiss:Q,dialogContentProps:w,modalProps:q,styles:{root:{minHeight:50}}},1==Y&&l.a.createElement(l.a.Fragment,null,l.a.createElement(b.a,{label:"Поиск ...",styles:{root:{paddingTop:"25px"}}})),z.map((function(e){return l.a.createElement(_.a,G()({},e,{key:e.key,className:J.exampleRoot}))})),l.a.createElement(L.a,null,l.a.createElement(C.a,{onClick:Q,text:"Закрыть"}))))}var Y=a(67),Z=a.n(Y),q=a(284),U=a(286);Object(g.a)();Object(f.o)({});function Q(e){var t=e.toggle,a=l.a.useState(e.hidden),n=p()(a,2),o=n[0],r=(n[1],l.a.useState(e.settings.from||0)),i=p()(r,2),c=i[0],s=i[1],m=l.a.useState(e.settings.to||0),u=p()(m,2),d=u[0],g=u[1],f=l.a.useState(e.settings.merge||!1),E=p()(f,2),b=E[0],x=E[1],v=l.a.useMemo((function(){return{isBlocking:!0,styles:k,dragOptions:{moveMenuItemText:"Move",closeMenuItemText:"Close",menu:B.a}}}),[!0]),S={type:I.a.normal,title:"Настройки для ссылки",subText:""},k={main:{maxWidth:450}},w={iconName:"IncreaseIndentLegacy"},j={spinButtonWrapper:{width:75},labelWrapper:{width:150}};l.a.useEffect((function(){}),[]);var O=l.a.useCallback((function(e,t){void 0!==t&&s(t)}),[]),T=l.a.useCallback((function(e,t){void 0!==t&&g(t)}),[]);return l.a.createElement(l.a.Fragment,null,l.a.createElement(D.a,{hidden:o,onDismiss:t,dialogContentProps:S,modalProps:v},l.a.createElement("div",{style:{minHeight:60}},l.a.createElement(y.a,{tokens:{childrenGap:20}},l.a.createElement(q.a,{label:"Начать с    ",iconProps:w,defaultValue:"0",min:0,max:1e3,step:1,onChange:O,value:c,styles:j}),l.a.createElement(q.a,Z()({label:"Закончить на",iconProps:w,styles:{labelWrapper:{width:150}},defaultValue:"0",min:0,max:1e3,step:1,onChange:T,value:d},"styles",j)),l.a.createElement(U.a,{label:"Объединить в одну",inlineLabel:!0,styles:{label:{width:150}},onText:"Да",offText:"Нет",checked:b,onChange:function(e,t){x(t)}}))),l.a.createElement(L.a,null,l.a.createElement(C.a,{onClick:function(a){return e.change({from:c,to:d,merge:b}),void t()},text:"Применить"}),l.a.createElement(h.a,{onClick:t,text:"Закрыть"}))))}function $(e){var t=e.yes,a=e.toggle,n=l.a.useMemo((function(){return{isBlocking:!0,styles:r,dragOptions:{moveMenuItemText:"Move",closeMenuItemText:"Close",menu:B.a}}}),[!0]),o={type:I.a.normal,title:e.title,subText:e.subtext},r={main:{maxWidth:450}};return l.a.useEffect((function(){}),[]),l.a.createElement(l.a.Fragment,null,l.a.createElement(D.a,{hidden:!1,onDismiss:a,dialogContentProps:o,modalProps:n},l.a.createElement(L.a,null,l.a.createElement(h.a,{onClick:t,text:"Да"}),l.a.createElement(C.a,{onClick:a,text:"Нет"}))))}Object(g.a)(),Object(g.a)();var ee=Object(f.o)({fonts:{medium:{fontFamily:"Monaco, Menlo, Consolas",fontSize:"25px"}},empty:{fontSize:50,height:50,width:50,margin:"0 25px",color:"lightgray"}}),te={data:[],cores:[]};function ae(){Object(s.g)().culture,Object(s.e)();var e=l.a.useState(!1),t=p()(e,2),a=t[0],n=t[1],o=l.a.useState(""),r=p()(o,2),i=r[0],c=r[1],m=l.a.useState(!1),u=p()(m,2),d=u[0],g=u[1],f=l.a.useState({from:327,to:328,merge:!1}),C=p()(f,2),j=C[0],O=C[1],T=l.a.useState(null),z=p()(T,2),G=z[0],P=z[1],M=l.a.useState(!1),F=p()(M,2),I=F[0],D=F[1],L=l.a.useState(te),B=p()(L,2),A=B[0],W=B[1],H=l.a.useState(!1),R=p()(H,2),_=R[0],J=R[1];l.a.useEffect((function(){w.on("progress",Z)}),[]),l.a.useState((function(){if(window.localStorage.getItem("tables")){var e=window.localStorage.getItem("url")||"",t=JSON.parse(window.localStorage.getItem("tables"));c(e),W(t||te)}}),[I]),l.a.useEffect((function(){i&&(window.localStorage.setItem("tables",JSON.stringify(A)),window.localStorage.setItem("url",i))}),[A]),l.a.useState((function(){}),[j]);var K,V,Y,Z=function(e){P(e.description)};return l.a.createElement(l.a.Fragment,null,l.a.createElement(N,{setReady:D}),I&&l.a.createElement("div",{className:"main",style:{bottom:"0px",height:"calc(100% - 56px)",backgroundColor:"#faf9f8",position:"relative"}},l.a.createElement("div",{class:"ms-Grid",dir:"ltr",style:{height:"100%",overflowY:"scroll",overflowX:"auto"}},l.a.createElement("div",{class:"ms-Grid-row",style:{height:"100%"}},l.a.createElement("div",{class:"ms-Grid-col ms-sm2 ms-md2ms-lg2"}),l.a.createElement("div",{class:"ms-Grid-col ms-sm8 ms-md8 ms-lg8",style:{height:"100%",backgroundColor:"#fff"}},l.a.createElement(y.a,{tokens:{childrenGap:10}},l.a.createElement("div",{style:{padding:"0px 32px",height:"100%",marginTop:12}},l.a.createElement("header",{style:{padding:"12px 0px",minHeight:50,boxSizing:"border-box"},className:"row"},l.a.createElement("h1",{className:"h1"},"Парсер"))),l.a.createElement("div",{style:{padding:"12px",boxSizing:"border-box"}},l.a.createElement(y.a,{horizontal:!0,tokens:{childrenGap:10},style:{justifyContent:"center"}},l.a.createElement(E.a,{placeholder:"Поиск таблиц на сайте",styles:{root:{width:600}},iconProps:{iconName:"Link"},onChange:function(e,t){e&&c(t)},clearButtonProps:{iconProps:{iconName:"Settings"},disabled:(K=i,V=K.substring(K.lastIndexOf("/")+1).split("."),Y=V[V.length-1].toLowerCase(),!["pdf"].includes(Y))},onClear:function(){g(!0)},value:i}),l.a.createElement(h.a,{disabled:1==_,text:"Найти",onClick:function(e){return n(!0)},allowDisabledFocus:!0,checked:!1})),l.a.createElement(y.a,{tokens:{childrenGap:24},style:{marginTop:24},horizontal:!1},0==A.data.length&&0==_&&l.a.createElement(l.a.Fragment,null,l.a.createElement("div",{style:{display:"flex",justifyContent:"center",marginTop:"150px"}},l.a.createElement(y.a,{tokens:{childrenGap:24},style:{marginTop:24},horizontal:!1},l.a.createElement(S.a,{"aria-label":"Compass",iconName:"ProductRelease",style:ee.empty}),l.a.createElement(k.a,{variant:"medium",nowrap:!0,block:!0,style:{textAlign:"center",color:"lightgray"}},"Нет данных")))),1==_&&l.a.createElement(l.a.Fragment,null,l.a.createElement(b.a,{label:G||"Извелечение данных...",styles:{root:{paddingTop:"25px"}}})),A.data.length>0&&l.a.createElement(x.a,{"aria-label":"Basic Pivot Example",overflowBehavior:"menu",styles:{root:{display:"flex",justifyContent:"center",padding:"0 200px"}}},A.data.map((function(e,t){return l.a.createElement(v.a,{headerText:"Таблица #".concat(t+1)},l.a.createElement("div",null,l.a.createElement(X,{table:e,index:t,core:A.cores[t]})))}))))))),l.a.createElement("div",{class:"ms-Grid-col ms-sm2 ms-md2 ms-lg2"})))),1==d&&l.a.createElement(Q,{settings:j,toggle:g,change:O,hidden:!d}),1==a&&l.a.createElement($,{title:"Sorge",subtext:"Выполнить поиск таблиц?",toggle:n,yes:function(){n(!1),P(null),i&&(J(!0),W({data:[],cores:[]}),fetch("/api/get_tables",{method:"post",headers:{Accept:"application/json, text/plain, */*","Content-Type":"application/json"},body:JSON.stringify({url:i,settings:j})}).then((function(e){return e.json()})).then((function(e){if(e.result){var t=[];e.result.map((function(e){try{var a=Object.keys(e[0]),n=(a=a.map((function(e){return e.replace(/(\r\n|\n|\r)/gm," ").replace("/"," ")}))).map((function(e,t){return{key:"column".concat(t),name:e,fieldName:e,minWidth:100,maxWidth:200,isRowHeader:!0,isResizable:!0,isSorted:0==t,isSortedDescending:!1,sortAscendingAriaLabel:"Sorted A to Z",sortDescendingAriaLabel:"Sorted Z to A",data:"string",isPadded:!0}})),l=e.map((function(e,t){var n={};n.key=t,e.key=function(e){return this[Object.keys(this)[e]]};for(var l=0;l<a.length;l++){var o=e.key(l);n["".concat(a[l])]=o}return n}));t.push({columns:n,rows:l})}catch(e){console.error(e)}})),W({data:t,cores:e.cores}),J(!1)}})).catch((function(e){W({data:[],cores:[]}),J(!1)})))},hidden:!a}))}var ne=a(279),le=a(289);Object(g.a)();var oe={root:{maxWidth:440,minWidth:320,minHeight:400,marginLeft:"auto",marginRight:"auto",boxShadow:"0 2px 6px rgb(0 0 0 / 20%)",backgroundColor:"#fff",width:"calc(100% - 40px)",marginBottom:"28px",padding:"44px"}};function re(){Object(s.g)().culture;var e=Object(s.e)(),t=l.a.useState(""),a=p()(t,2),n=a[0],o=a[1],r=l.a.useState(!1),i=p()(r,2),c=i[0],m=i[1],u=l.a.useState(""),d=p()(u,2),g=d[0],f=d[1],E=function(){fetch("/api/login",{method:"post",headers:{Accept:"application/json, text/plain, */*","Content-Type":"application/json"},body:JSON.stringify({login:"admin",password:n,remember:c})}).then((function(e){switch(e.status){case 200:return e.json();default:return e.text()}})).then((function(t){"string"==typeof t||t instanceof String?f(t):1==t.result&&e.push("/")})).catch((function(e,t){console.log(e,t)}))};return l.a.createElement(l.a.Fragment,null,l.a.createElement("div",{className:"main",style:{backgroundColor:"#faf9f8"}},l.a.createElement("div",{className:"middle"},l.a.createElement("div",{className:"outer"},l.a.createElement("div",{style:oe.root,className:"box ms-motion-scaleDownIn"},l.a.createElement(y.a,{tokens:{childrenGap:24}},l.a.createElement(y.a,{tokens:{childrenGap:12},horizontal:!0,style:{color:"grey"}},l.a.createElement(j.a,{iconName:"TFVCLogo",style:{fontSize:"32px"}}),l.a.createElement("div",{class:"ms-fontSize-28",style:{}},"Sorge")),l.a.createElement(y.a,{tokens:{childrenGap:12},horizontal:!0},l.a.createElement(O.a,{secondaryText:"Username: admin",text:"Администратор",size:T.c.size40,initialsColor:T.a.lightBlue})),l.a.createElement(y.a,{tokens:{childrenGap:12}},l.a.createElement("div",{class:"ms-fontSize-24",style:{}},"Введите пароль"),l.a.createElement(ne.a,{type:"password",value:n,onChange:function(e){return o(e.target.value)},canRevealPassword:!0,errorMessage:g,onKeyDown:function(e){13==e.keyCode&&E()},revealPasswordAriaLabel:"Show password"}),l.a.createElement(le.a,{label:"Оставаться в системе",checked:c,onChange:function(e){return m(e.target.value)}})),l.a.createElement(y.a,{horizontal:!0,style:{justifyContent:"flex-end"}},l.a.createElement(h.a,{disabled:!1,text:"Войти",onClick:E,allowDisabledFocus:!0,checked:!1}))))))))}function ie(){Object(s.g)().culture,Object(s.e)();var e=l.a.useState(!1),t=p()(e,2),a=(t[0],t[1]);return l.a.createElement(l.a.Fragment,null,l.a.createElement(N,{setReady:a}),l.a.createElement("div",{className:"main",style:{bottom:"0px",height:"calc(100% - 54px)",backgroundColor:"#faf9f8",position:"relative"}},l.a.createElement("div",{style:{padding:"0px 32px",height:"100%"}},l.a.createElement("header",{style:{padding:"52px 0px",minHeight:136},className:"row"},l.a.createElement("h1",{className:"h1"},"Настройки")))))}function ce(){Object(s.g)().culture,Object(s.e)();var e=l.a.useState(!1),t=p()(e,2),a=t[0],n=t[1],o=l.a.useState("Концептуальная карта — это разновидность схемы, где наглядно представлены связи между концепциями и идеями. В большинстве случаев идеи (или «концепты») отображаются в виде блоков или кругов (которые также называют «узлами»). Они располагаются в порядке иерархии и соединяются между собой при помощи линий и стрелок (которые также называют «связями»). Эти линии сопровождаются пометками со связующими словами и фразами, которые поясняют, как именно концепции сопряжены между собой."),r=p()(o,2),i=r[0],c=r[1],m=l.a.useState(!1),u=p()(m,2),d=u[0],g=u[1];return l.a.createElement(l.a.Fragment,null,l.a.createElement(N,{setReady:n}),a&&l.a.createElement("div",{className:"main",style:{bottom:"0px",height:"calc(100% - 56px)",backgroundColor:"#faf9f8",position:"relative"}},l.a.createElement("div",{class:"ms-Grid",dir:"ltr",style:{height:"100%",overflowY:"scroll",overflowX:"auto"}},l.a.createElement("div",{class:"ms-Grid-row",style:{height:"100%"}},l.a.createElement("div",{class:"ms-Grid-col ms-sm2 ms-md2ms-lg2"}),l.a.createElement("div",{class:"ms-Grid-col ms-sm8 ms-md8 ms-lg8",style:{height:"100%",backgroundColor:"#fff"}},l.a.createElement(y.a,{tokens:{childrenGap:10}},l.a.createElement("div",{style:{padding:"0px 32px",height:"100%",marginTop:12}},l.a.createElement("header",{style:{padding:"12px 0px",minHeight:50,boxSizing:"border-box"},className:"row"},l.a.createElement("h1",{className:"h1"},"Концепт карта"))),l.a.createElement("div",{style:Z()({padding:"12px",boxSizing:"border-box"},"padding","0 24px")},l.a.createElement(y.a,{horizontal:!0,tokens:{childrenGap:10},style:{justifyContent:"center"}},l.a.createElement(ne.a,{label:"Текст для обработки",multiline:!0,rows:11,styles:{root:{width:"100%"}},required:!0,value:i,readOnly:d,onChange:function(e){return t=(t=e.target.value).replace(/\s+/g," "),void c(t);var t}})),l.a.createElement(y.a,{tokens:{childrenGap:24},style:{marginTop:24},horizontal:!1},l.a.createElement(h.a,{styles:{root:{width:200}},text:"Построить карту",onClick:function(){i.length>0&&(g(!0),fetch("/maps/build",{method:"post",headers:{Accept:"application/json, text/plain, */*","Content-Type":"application/json"},body:JSON.stringify({text:i})}).then((function(e){return e.json()})).then((function(e){console.log(e),g(!1)})).catch((function(e){g(!1)})))},allowDisabledFocus:!0,disabled:0==i.length||d,checked:!1})),1==d&&l.a.createElement(l.a.Fragment,null,l.a.createElement(b.a,{label:"Построение...",styles:{root:{paddingTop:"25px"}}})))))))))}function se(){return l.a.createElement(l.a.Fragment,null,l.a.createElement(s.a,{exact:!0,path:"/",component:ae}),l.a.createElement(s.a,{exact:!0,path:"/parser",component:ae}),l.a.createElement(s.a,{exact:!0,path:"/login",component:re}),l.a.createElement(s.a,{exact:!0,path:"/maps",component:ce}),l.a.createElement(s.a,{exact:!0,path:"/settings",component:ie}))}var me=document.getElementById("root");r.a.render(l.a.createElement(i.a,null,l.a.createElement(c.a,{applyTo:"body",theme:{palette:{}},style:{height:"100%"}},l.a.createElement(se,null))),me)}});