/**
 * TreeLayout-v3.0.1
 */
define(["dijit/Dialog", "dojox/layout/ContentPane", "dojo/dom-construct", "dojo/query", "dojo/_base/declare", "dojo/fx", "dojo/dom-class", "dojo/dom-style", "dojo/on", "dojo/domReady!"]
	, function (Dialog, ContentPane, dc, query, declare, fx, domClass, domStyle, on) {
		return declare(null, {
			idName: '',
			menu: null,
			options: {
				/**
				 * 是否默认打开第一个模块
				 */
				defaultDisplay: false
			},
			aTagState: [],
			/**
			 * 显示状态
			 * @type {{show: show, hide: hide}}
			 */
			displayState: {
				show: function (item, nevItem) {
					domClass.add(item, 'selected');
					if (nevItem) {
						fx.wipeIn({node: nevItem}).play();
					}
				},
				hide: function (item,nevItem) {
					domClass.remove(item, 'selected');
					if (nevItem) {
						fx.wipeOut({node: nevItem}).play();
					}
				}
			},
			/**
			 * 构造函数
			 * @param idName：标签id
			 * @param menu：菜单
			 * @param options：属性
			 */
			constructor: function (idName, menu, options) {
				this.idName = idName;
				this.menu = menu;
				this.options = this.mergeJSON(this.options, options);
			},
			init: function () {
				this.render();
				this.addMenuEvent();
				if(this.options.defaultDisplay){
					this.showDefaultDisplay(1);
				}
			},
			render: function () {
				var ul = dojo.byId(this.idName);
				this.menuEach('root', ul, 1);
			},
			/**
			 * 合并JSON数据
			 * @param json1：原始的数据
			 * @param json2：添加的数据
			 * @returns {*} 合并后的数据
			 */
			mergeJSON: function mergeJSON(json1, json2) {
				var json = json1;
				for (var key in json2) {
					json[key] = json2[key];
				}
				return json;
			},
			/**
			 * 遍历菜单
			 * @param pid：父节点id
			 * @param ptag：父节点标签
			 * @param level：级别
			 */
			menuEach: function (pid, ptag, level) {
				var _self = this;
				dojo.forEach(_self.menu, function(item){
					if (pid === item.pid) {
						_self.createMenuHtml(item, ptag, level);
					}
				});
			},
			/**
			 * 创建菜单栏
			 * @param data：菜单栏显示的数据
			 * @param ptag：父节点标签
			 * @param level：级别
			 */
			createMenuHtml: function (data, ptag, level) {
				var li = dc.place(dc.create('li', {class: 'nevItem nevItem_l' + level, sign: data.pid + '|' + data.id}), ptag);
				this.createATagAndChildHtml(data, li);
				if (undefined === data.href) {
					var ul = dc.place(dc.create('ul', {class: 'childPanel '+data.id + 'Panel', style: {display: 'none'}}), li);
					this.menuEach(data.id, ul, level + 1);
				}
			},
			/**
			 * 创建A标签和他的子标签创建
			 * @param data：菜单栏显示的数据
			 * @param ptag：父节点标签
			 */
			createATagAndChildHtml: function(data, ptag) {
				var _self = this;
				/*创建a标签*/
				var aTagProp = {class: 'titleItem', href: 'javascript:void(0);'};
				function setATagState(data) {
					if (_self.aTagState.indexOf(data) < 0)
						_self.aTagState.push(data);
				}
				if (undefined !== data.href) {
					aTagProp.skip = data.href;
					setATagState('skip');
				} else {
					aTagProp.show = data.id + 'Panel';
					setATagState('show');
				}
				var aTag = dc.place(dc.create('a', aTagProp), ptag);
				/*创建a标签的子标签*/
				var iTagProp = {},
					spanTagProp = {innerHTML: data.title},
					arrowTagProp = {class: 'iconfont icon-arrow', style: {textIndent: '0'}, innerHTML: ''};
				if (!data.icon) {iTagProp.class = 'iconfont icon-' + data.id;}
				else {iTagProp.class = 'iconfont ' + data.icon;}
				dc.create('i', iTagProp, aTag);
				dc.create('span', spanTagProp, aTag);
				if (undefined === data.href) {dc.create('i', arrowTagProp, aTag);}
			},
			/**
			 * 添加菜单栏事件
			 */
			addMenuEvent: function() {
				var _self = this,
					idName = _self.idName;
				dojo.forEach(dojo.query('#' + idName + ' li.nevItem'), function (item, index) {
					item.idName = idName;
					on(item, 'mouseover, mouseout', function () {
						domClass.toggle(this, 'hover');
					});
					dojo.connect(item.childNodes[0], 'click', function (event) {
						if (item.childNodes.length > 1) {
							var classList = item.className.split(' ');
							_self.selectedOperation(item, _self.indexOfClass(classList, 'nevItem_l'));
						} else if (item.childNodes.length === 1) {
							_self.selectedItem(item)
						}
					})
				})
			},
			indexOfClass: function(item, value){
				var className = null;
				dojo.forEach(item, function (item, index) {
					if (item.indexOf(value) >= 0) {
						className = item;
						return className;
					}
				});
				return className;
			},
			/**
			 * 将title转成JSON格式
			 * @param item：当前点击的对象信息
			 * @returns {*} 返回JSON格式
			 */
			aTagToJSON: function (item) {
				if ('A' !== item.tagName) return null;
				var json = {};
				var title = item.childNodes[1].innerText;
				if (title) json.title = title;
				return json;
			},
			/**
			 * 点击的菜单项转换成JSON格式
			 * @param item：当前点击的对象信息
			 * @returns {*} 返回JSON格式
			 */
			itemJSON: function (item) {
				var json = this.aTagToJSON(item.childNodes[0]), liTag = query(item);
				if (null !== liTag.attr('sign')[0]) {
					var sign = liTag.attr('sign')[0].split('|');
					json.id = sign[1];
					json.pid = sign[0];
				}
				return json;
			},
			/**
			 * 菜单选择操作类型
			 * @param currentLevelClass：当前级别class
			 */
			selectedOperation: function (item, currentLevelClass) {
				if (domClass.contains(item, 'selected')) {
					if (item.childNodes.length === 1) {
						this.selectedDisplayState(item, 'show');
					} else {
						this.selectedDisplayState(item, 'hide');
					}
				} else {
					var _self = this, thisItem = item, domQuery = this.selectedRemoveClass(currentLevelClass);
					dojo.forEach(dojo.query(domQuery), function (item, index) {
						var selectedItem = _self.indexOfClass(thisItem.className.split(' '), 'nevItem_l'),
							foreachItem = _self.indexOfClass(item.className.split(' '), 'nevItem_l');
						if (selectedItem.substring(selectedItem.length-1)<=foreachItem.substring(foreachItem.length-1)){
							_self.selectedDisplayState(item, 'hide');
						}
					});
					this.selectedDisplayState(item, 'show');
				}
			},
			/**
			 * 菜单栏获取操作方法
			 * @param currentItem
			 * @param state
			 */
			selectedDisplayState: function (currentItem, state) {
				var nevItem = null;
				if (currentItem.childNodes.length > 1) {
					nevItem = currentItem.childNodes[1];
				}
				if (currentItem.childNodes.length >= 1){
					this.displayState[state](currentItem, nevItem);
				}
			},
			/**
			 * 菜单栏获取选中的标签
			 * @param className：当前的class的级别
			 * @returns {string} 返回查询的条件
			 */
			selectedRemoveClass: function (className) {
				var domQuery = '#' + this.idName;
				if ('nevItem_l1' === className) {
				} else if ('nevItem_l2' === className) {
					domQuery += ' .nevItem_l1';
				} else if ('nevItem_l3' === className) {
					domQuery += ' .nevItem_l2';
				}
				return domQuery += ' .selected';
			},
			/**
			 * 选中的模块
			 * @param item：当前点击的对象信息
			 */
			selectedItem: function (item) {
				var _self = this, data = this.itemJSON(item), menu = this.menu, thisItem = item;
				dojo.forEach(menu, function (item) {
					if (data.id === item.id && data.pid === item.pid && data.title === item.title) {
						var classList = thisItem.className.split(' ');
						_self.selectedOperation(thisItem, _self.indexOfClass(classList, 'nevItem_l'));
						_self.jumpPage(item);
						return true;
					}
				});
			},
			/**
			 * 显示模块
			 * @param menu：菜单项信息
			 */
			jumpPage: function (menu) {
				var index = getTabIndex(menu);
				if(index === -1){
					if (undefined !== menu.href) {
						var cp = new ContentPane({
							title: menu.title,
							href: menu.href,
							sign: menu.pid + '|' + menu.id,
							closable: menu.closable === undefined ? true : menu.closable
						});
						tc.addChild(cp);
						tc.selectChild(cp);
					}
				}else{
					tc.selectChild(tc.getChildren()[index]);
				}
			},
			/**
			 * 默认显示一个标签页
			 * @param level：层级
			 */
			showDefaultDisplay: function (level) {
				var domQuery = '#' + this.idName + ' .nevItem_l' + level;
				var currentLevel = query(domQuery)[0];
				if (currentLevel.childNodes.length > 1) {
					var nevItem = currentLevel.childNodes[1];
					this.displayState.show(currentLevel, nevItem);
					this.showDefaultDisplay(level + 1);
				} else if (currentLevel.childNodes.length === 1) {
					this.selectedItem(currentLevel);
				}
			}
		});
	}
);