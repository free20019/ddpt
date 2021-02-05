define(["dijit/Dialog", "dojox/layout/ContentPane", "dojo/dom-construct", "dojo/NodeList-manipulate", "dojo/_base/declare", "dojo/fx", "dojo/dom-class", "dojo/dom-style", "dojo/on", "dojo/domReady!"]
    , function (Dialog, ContentPane, dc, query, declare, fx, domClass, domStyle, on) {
        return declare(null, {
            idName: '',
            menu: null,
            menuLevel: null,
            /*controlId:控制器Id; submenuPanelId: 子菜单面板Id*/
            options: {controlId: '', submenuPanelId: ''},
            currentSelect: null,
            constructor: function (idName, menu, menuLevel, options) {
                this.idName = idName;
                this.menu = menu;
                this.menuLevel = menuLevel;
                this.options = options;
            },
            init: function () {
                this.render();
                this.addEvent();
            },
            render: function () {
                var ul = dojo.byId(this.idName);
                var menu = this.menu;
                for (var i = 0; i < menu.length; i++) {
                    this.createMenuHtml(menu[i], 'li_nevItem', 'nevTitle', ul);
                }
            },
            createMenuHtml: function (data, li_className, a_className, ul) {
                var li = dc.place('<li class="' + li_className + '"></li>', ul);
                var aTag = null;
                if (data.href) {
                    aTag = dc.place(dc.create('a', {href: 'javascript:(0);', class: a_className, skip: data.href}), li);
                } else if (data.item) {
                    aTag = dc.place(dc.create('a', {href: 'javascript:(0);', class: a_className, show: data.id + 'Panel'}), li);
                    var nevItem = dc.place(dc.create('ul', {class: 'nevItem', style: {display: 'none'}}), li);
                    for (var i = 0, item = data.item; i < item.length; i++) {
                        var menuLevel2 = this.menuLevel.m2, j;
                        if (this.menu.indexOf(data) >= 0) {
                            for (j = 0; j < menuLevel2.length; j++) {
                                if (data.item[i] === menuLevel2[j].name) {
                                    this.createMenuHtml(menuLevel2[j], 'li_nevItem2', 'childTitle', nevItem);
                                    break
                                }
                            }
                        } else if (menuLevel2.indexOf(data) >= 0) {
                            var menuLevel3 = this.menuLevel.m3;
                            for (j = 0; j < menuLevel3.length; j++) {
                                if (data.item[i] === menuLevel3[j].name) {
                                    this.createMenuHtml(menuLevel3[j], 'li_nevItem3', 'childTitle', nevItem);
                                    break
                                }
                            }
                        }
                    }
                } else if (data.show) {
                    aTag = dc.place(dc.create('a', {href: 'javascript:(0);', class: a_className, dialog: data.show}), li);
                }
                dc.create('i', {class: 'icon-' + data.id}, aTag);
                dc.create('span', {innerHTML: data.name}, aTag);
                if (data.item) {
                    dc.create('i', {class: 'iconfont icon-arrow', innerHTML: ''}, aTag);
                }
            },
            createHoverMenuHtml: function (thisOne, menu, menuLevel, submenuPanel) {
                for (var i = 0; i < menu.length; i++) {
                    if (thisOne.childNodes[1].innerText === menu[i].name){
                        dc.empty(submenuPanel);
                        var dl = dc.place(dc.create('dl', {class: menu[i].id + 'Panel'}), submenuPanel);
                        dc.place(dc.create('dt', {innerHTML: menu[i].name}), dl);
                        if (menu[i].item){
                            var menuItem = menu[i].item;
                            for (var j = 0; j < menuItem.length; j++) {
                                for (var k = 0; k < menuLevel.length; k++) {
                                    if (menuItem[j] === menuLevel[k].name){
                                        if (menuLevel[k].href) {
                                            var dd = dc.place(dc.create('dd'), dl);
                                            var aTag = dc.place(dc.create('a', {href: 'javascript:(0);', skip: menuLevel[k].href}), dd);
                                            dc.place(dc.create('i', {class: 'icon-' + menuLevel[k].id}), aTag);
                                            dc.place(dc.create('span', {innerHTML: menuLevel[k].name}), aTag);
                                        } else if (menuLevel[k].item) {
                                            var dd = dc.place(dc.create('dd'), dl);
                                            var aTag = dc.place(dc.create('a', { href: 'javascript:(0);', show: menuLevel[k].id + 'Panel'}), dd);
                                            dc.place(dc.create('i', {class: 'icon-' + menuLevel[k].id}), aTag);
                                            dc.place(dc.create('span', {innerHTML: menuLevel[k].name}), aTag);
                                            var ul = dc.place(dc.create('ul', {class: menuLevel[k].id + 'Panel'}), dd);
                                            ul.style.display = 'none';
                                            var menuLevel3 = this.menuLevel.m3;
                                            console.info(menuLevel3)
                                            for (var ki = 0; ki < menuLevel3.length; ki++) {
                                                if (menuLevel3[ki].href) {
                                                    var li = dc.place(dc.create('li'), ul);
                                                    var aTag = dc.place(dc.create('a', {href: 'javascript:(0);', skip: menuLevel3[ki].href}), li);
                                                    dc.place(dc.create('i', {class: 'icon-' + menuLevel3[ki].id}), aTag);
                                                    dc.place(dc.create('span', {innerHTML: menuLevel3[ki].name}), aTag);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }

                    }
                }
            },
            addEvent: function () {
                var self = this;
                var idName = this.idName;
                if(self.options && self.options.controlId) {
                    dojo.forEach(dojo.query('#' + self.options.controlId), function (item, index) {
                        dojo.connect(item, 'click', function (event) {
                            var nevRoot = dojo.query('#' + idName)[0];
                            domClass.toggle(nevRoot, 'smll');
                            domClass.toggle(this, 'smll');
                            // var nevItem = dojo.query('#'+self.options.submenuPanelId+' .nevItem');
                            // fx.wipeOut({node: item}).play();
                            // $('#leftChildPanel, .nevItem').hide();
                            // domStyle.set(dojo.query('#leftChildPanel, .nevItem'), 'display', 'none');
                            domStyle.set('leftChildPanel', 'display', 'none');
                            dijit.byId('indexContainer').resize();
                        });
                    });
                }
                dojo.forEach(dojo.query('#' + idName + ' li.li_nevItem'), function (item, index) {
                    item.name = idName;//checked
                    on(item, 'mouseover, mouseout', function () {
                        domClass.toggle(this, 'hover');
                    });
                    dojo.connect(item.childNodes[0], 'click', function (event) {
                        var nevRoot = dojo.query('#' + idName)[0];
                        if ('smll' === nevRoot.className) {
                            if(!self.options.submenuPanelId) {
                                throw 'TreeLayout：options中找不到"submenuPanelId"值。';
                            }
                            var submenuPanel = dojo.byId(self.options.submenuPanelId);
                            var menu = self.menu,
                                menuLevel = self.menuLevel.m2;

                            var dtTitle = dojo.query('#'+self.options.submenuPanelId+' dt');
                            var display = domStyle.get(submenuPanel, 'display');
                            domStyle.set(submenuPanel, 'display', 'none');
                            if (!item.childNodes[0].getAttribute('show')){
                                domStyle.set(submenuPanel, 'display', 'none');
                            } else if ('none' === display || dtTitle[0].innerText !== item.childNodes[0].childNodes[1].innerText) {
                                domStyle.set(submenuPanel, 'display', 'block');
                            }
                            self.createHoverMenuHtml(this, menu, menuLevel, submenuPanel);
                            if (dojo.query(item.childNodes[0]).attr('skip')[0]) {
                                console.info('info:xixi',this.childNodes[1]);
                                self.jumpPage(this.childNodes[1], menu);
                            }
                            self.addHoverEvent();
                            dojo.query('#' + idName + ' li .nevTitle').removeClass('selected');
                            dojo.addClass(this, 'selected');
                            return false;
                        }
                        if (!$(this).hasClass('selected')) {
                            dojo.query('#' + idName + ' li .nevTitle').removeClass('selected');
                            dojo.query('.li_nevItem2 .childTitle').removeClass('selected');
                            dojo.addClass(this, 'selected');
                        } else {
                            dojo.query('#' + idName + ' li .nevTitle').removeClass('selected');
                            dojo.query('.li_nevItem2 .childTitle').removeClass('selected');
                        }
                        var nevItem = item.childNodes[1];
                        if (dojo.query(nevItem).length !== 0) {
                            if ('none' === dojo.query(nevItem).style('display')[0]) {
                                dojo.query('#' + idName + ' .li_nevItem .nevItem').forEach(function(item,index){
                                    if(item.style.display != 'none'){
                                        fx.wipeOut({ node: item }).play();
                                    }
                                });
                                fx.wipeIn({node: nevItem}).play();
                                console.info('TreeLayou2-display:',fx.wipeOut({ node: item }))
                            } else {
                                fx.wipeOut({node: nevItem}).play();
                            }
                        } else {
                            dojo.query('#' + idName + ' .li_nevItem .nevItem').forEach(function(item,index){
                                if(item.style.display != 'none'){
                                    fx.wipeOut({ node: item }).play();
                                }
                            });
                            var itemTitle = item.childNodes[0];
                            self.jumpPage(itemTitle, self.menu);
                            return false;
                        }
                    });
                });
                dojo.forEach(dojo.query('#' + idName + ' li.li_nevItem2, #' + idName + ' li.li_nevItem3'), function (item, index) {
                    item.name = idName;
                    var count = 0;
                    var className = item.className;
                    on(item, 'mouseover, mouseout', function () {
                        domClass.toggle(this, 'hover');
                    });
                    dojo.connect(item.childNodes[0], 'click', function (event) {
                        dojo.query('#' + idName + ' li .childTitle').removeClass('selected');
                        dojo.addClass(this, 'selected');
                        var nevItem = item.childNodes[1];
                        if (dojo.query(nevItem).length !== 0) {
                            if ('none' === dojo.query(nevItem).style('display')[0]) {
                                dojo.query('#' + idName + ' .' + className + ' .nevItem').forEach(function(item,index){
                                    if(item.style.display != 'none'){
                                        fx.wipeOut({ node: item }).play();
                                    }
                                });
                                fx.wipeIn({node: nevItem}).play();
                            } else {
                                fx.wipeOut({node: nevItem}).play();
                            }
                        } else {
                            dojo.query('#' + idName + ' .' + className + ' .nevItem').forEach(function(item,index){
                                if(item.style.display != 'none'){
                                    fx.wipeOut({ node: item }).play();
                                }
                            });
                            var itemTitle = item.childNodes[0];
                            var menuLevels = self.menuLevel.m2;
                            if ('li_nevItem3' === className)
                                menuLevels = self.menuLevel.m3;
                            self.jumpPage(itemTitle, menuLevels);
                            return false;
                        }
                    });
                });
            },
            addHoverEvent: function () {
                var self = this;
                if(!this.options.submenuPanelId) {
                    throw 'TreeLayout：options中找不到"submenuPanelId"值。';
                }
                dojo.forEach(dojo.query('#' + this.options.submenuPanelId + ' dd'), function (item, index) {
                    dojo.connect(item.childNodes[0], 'click', function (event) {
                        var title = this.childNodes[1];
                        var nevItem = item.childNodes[1];
                        if (dojo.query(nevItem).length !== 0) {
                            dojo.query('#' + self.options.submenuPanelId + ' dd').removeClass('selected');
                            dojo.addClass(this, 'selected');
                            if ('none' === dojo.query(nevItem).style('display')[0]) {
                                dojo.query('#' + self.options.submenuPanelId + ' dd ul').forEach(function (item, index) {
                                    if (item.style.display != 'none') {
                                        fx.wipeOut({node: item}).play();
                                    }
                                });
                                fx.wipeIn({node: nevItem}).play();
                            } else {
                                fx.wipeOut({node: nevItem}).play();
                            }
                        } else {
                            self.jumpPage(title, self.menuLevel.m2);
                            $('#leftChildPanel, .nevItem').hide();
                        }
                    });
                });
                dojo.forEach(dojo.query('#' + this.options.submenuPanelId + ' li'), function (item, index) {
                    dojo.connect(item.childNodes[0], 'click', function (event) {
                        var title = this.childNodes[1];
                        self.jumpPage(title, self.menuLevel.m3);
                        $('#leftChildPanel, .nevItem').hide();
                    });
                });
            },
            jumpPage: function (itemTitle, menuLevels) {
                for (var i = 0; i < menuLevels.length; i++) {
                    var menuLevel = menuLevels[i];
                    var title = itemTitle.children.length === 0 ? dojo.trim(query(itemTitle).text()) :
						itemTitle.children.length === 1 ? dojo.trim(query(itemTitle.children[0]).text()) :
							dojo.trim(query(itemTitle.children[1]).text());
					if (title === dojo.trim(menuLevel.name)) {
                        var index = getTabIndex(menuLevel.name);
                        if(index == -1){
                            if (menuLevel.href){
                                var cp = new ContentPane({
                                    title: menuLevel.name,
                                    href: menuLevel.href,
                                    closable: menuLevel.closable ? menuLevel.closable : 'true'
                                });
                                tc.addChild(cp);
                                tc.selectChild(cp);
                            } else if (menuLevel.show){
                                if (!dojo.byId(menuLevel.id + 'Dialog')) {
                                    openDialog = new Dialog({
                                        id: menuLevel.id + 'Dialog',
                                        title: menuLevel.name
                                    });
                                }
                                openDialog.show().then(function () {
                                    var div = dc.create("div", {style: {width: menuLevel.width, height: menuLevel.height}});
                                    openDialog.set('content', div);
                                });
                            }
                        }else{
                            tc.selectChild(tc.getChildren()[index]);
                        }
                        break;
                    }
                }
            }
        });
    }
);