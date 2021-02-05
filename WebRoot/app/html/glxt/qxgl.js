/**
 * Created by dywed on 2017/7/1.
 */
define([ "dijit/Dialog", "dgrid/Editor", "dijit/form/Button",
		"dijit/form/DateTextBox", "dijit/form/TimeTextBox",
		"dijit/form/SimpleTextarea", "dijit/form/Select",
		"dijit/form/FilteringSelect", "dgrid/OnDemandGrid",
		"dijit/form/TextBox", "app/Pagination", "dgrid/Selection",
		"dgrid/Keyboard", "dgrid/extensions/ColumnResizer",
		"dojo/store/Memory","cbtree/model/TreeStoreModel",
		"app/createAsyncStore", "dstore/Memory","dijit/form/NumberTextBox",
		"dgrid/extensions/DijitRegistry", "dijit/registry", "dojo/dom-style",
		"dojo/_base/declare", "dojo/dom-construct", "dojo/on","dijit/tree/ObjectStoreModel", "cbtree/Tree",
		"cbtree/models/ForestStoreModel", "dojo/data/ItemFileWriteStore", "app/util" ],
	function(Dialog, Editor, Button, DateTextBox, TimeTextBox,
			 SimpleTextarea, Select, FilteringSelect, Grid, TextBox,
			 Pagination, Selection, Keyboard, ColumnResizer,
			 Memory2,TreeStoreModel,
			 createAsyncStore, Memory,NumberTextBox, DijitRegistry, registry, domStyle,
			 declare, dc, on,ObjectStoreModel, Tree,
			 ForestStoreModel, ItemFileWriteStore, util) {
		var CustomGrid = declare([DijitRegistry, Grid, Keyboard, Selection, ColumnResizer]);
		var rightsGrid = null, store = null;
		var xhrArgsTabel;
		var zTree_qxgl;
		var guolvq = ['出发地']
		var setting = {
			edit: {
				enable: true,
				showRemoveBtn: false,
				showRenameBtn: false
			},
			check: {
				enable: true
			},
			data: {
				simpleData: {
					enable: true
				}
			}
		};
		var columns = [
			{field:'dojoId',label : "序号"},
			{field:'POWERNAME', label: "权限名"},
			{field:'POWERLIST', label: "用户权限"}
		];
		xhrArgsTabel = {
			url: basePath + "power/querypower",
			postData: 'postData={}',
			handleAs: "json",
			Origin: self.location.origin,
			preventCache: true,
			withCredentials: true,
			load: function (data) {
				for (var i = 0; i < data.length; i++) {
					data[i] = dojo.mixin({dojoId: i + 1}, data[i]);
				}
				store = new Memory({data: {identifier: 'dojoId', label: 'dojoId', items: data}});
				rightsGrid.set('collection', store);
			},
			error : function(error) {}
		};
        xhrArgsTree = {
            url: basePath + "power/queryaddress",
            postData: 'postData={}',
            handleAs: "json",
            Origin: self.location.origin,
            preventCache: true,
            withCredentials: true,
            load: function (data) {
                var zNodes = [{id: 1, pId: 0, name: "出发地"},
                    {id: 'a1', pId: 1, name: data[0].CITY},
                    {id: 'a2', pId: 1, name: data[1].CITY}]
                zTree_qxgl = $.fn.zTree.init($("#treeDemo"), setting, zNodes);
            },
            error : function(error) {}
        };
        xhrArgsSetQx = {
            url: basePath + "power/addpower",
            postData: 'postData={}',
            handleAs: "json",
            Origin: self.location.origin,
            preventCache: true,
            withCredentials: true,
            load: function (data) {},
            error : function(error) {}
        };

        xhrArgsupDate = {
            url: basePath + "power/editpower",
            postData: 'postData={}',
            handleAs: "json",
            Origin: self.location.origin,
            preventCache: true,
            withCredentials: true,
            load: function (data) {},
            error : function(error) {}
        };

        xhrArgsDel = {
            url: basePath + "power/delpower",
            postData: 'postData={}',
            handleAs: "json",
            Origin: self.location.origin,
            preventCache: true,
            withCredentials: true,
            load: function (data) {},
            error : function(error) {}
        };
		return declare( null,{
			constructor:function(){
				this.initToolBar();
				this.post();
			},
			addQx:function(json){
				var _self = this;
                xhrArgsSetQx.postData = 'postData=' + JSON.stringify(json);
                xhrArgsSetQx.load = function (data) {
                	if (data.info === '添加成功') {
                        qxgl_dialog.hide()
                        _self.getTable()
                    }
                };
                dojo.xhrPost(xhrArgsSetQx);
			},
			update:function(json){
                var _self = this;
                xhrArgsupDate.postData = 'postData=' + JSON.stringify(json);
                xhrArgsupDate.load = function (data) {
                    if (data.info === '修改成功') {
                        qxgl_dialog.hide()
                        _self.getTable()
                    }
                };
                dojo.xhrPost(xhrArgsupDate);
			},
            del: function (json) {
                var _self = this;
                xhrArgsDel.postData = 'postData=' + JSON.stringify(json);
                xhrArgsDel.load = function (data) {
                    if (data.info === '删除成功') {
                        _self.getTable()
                    }
                };
                dojo.xhrPost(xhrArgsDel);
            },
			post:function(){
                this.getTable()
                dojo.xhrPost(xhrArgsTree);
			},
			getTable: function () {
                xhrArgsTabel.postData = 'postData=' + JSON.stringify({
                        powername: $('#qxgl-yhm').val(),
                    });
                dojo.xhrPost(xhrArgsTabel);
            },
			initToolBar:function(){
                var _self = this;

                columns.push({
                    field : 'CAOZUO',
                    label : "操作",
                    renderCell: function (item) {
                        var div = dc.create("div", {}),
                            style = {marginLeft: '.5em', marginRight: '.5em'};
                        var btnUpdate = dc.create("a", {class: 'btn btn-ms', title: '修改', innerHTML: '修改', style: style, onclick: function () {
                            // 修改操作
                            qxgl_dialog.show().then(function() {
                                qxgl_dialog.set('title', '修改权限')
                                $('#qxgl_yhm').val(item.POWERNAME)
                                $('#qxgl_ID').val(item.ID)
                                var powerList = item.POWERLIST.split('、');
                                var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
                                var nodes = treeObj.getNodes()[0].children;
                                for (var i=0;i<nodes.length;i++){
                                    if (powerList.indexOf(nodes[i].name) >= 0){
                                        treeObj.checkNode(nodes[i], true, true);
                                    } else {
                                        treeObj.checkNode(nodes[i], false, true);
                                    }
                                }
                            });
                        }});
                        var btnDelete = dc.create("a", {class: 'btn btn-ms', title: '删除', innerHTML: '删除', style: style, onclick: function () {
                            // 删除操作
                            if (confirm('是否删除数据')) {
                                $('#qxgl_ID').val(item.ID);
                                var id= $('#qxgl_ID').val();
                                console.info('222222222222:',item.ID);
                                _self.del({
                                    powerid: id
                                })
                            }
                        }});
                        dc.place(btnUpdate, div);
                        dc.place(btnDelete, div);
                        return div;
                    }

                });
                if (rightsGrid) { rightsGrid = null; dojo.empty('qxglTabel') }
                rightsGrid = new CustomGrid({ totalCount: 0, pagination: null, columns: columns,allowTextSelection: true}, "qxglTabel");

                $('#qxgl_btnQuery').on('click', function() {
                    event.preventDefault();
                    console.info('11111111111');
                    _self.post();
                });
                $('#qxgl_addQx').on('click', function () {
                    qxgl_dialog.show().then(function() {
                        qxgl_dialog.set('title', '添加权限')
                        $('#qxgl_yhm').val('')
                        $('#qxgl_ID').val('')
                        var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
                        var nodes = treeObj.getNodes()[0].children;
                        for (var i = 0; i < nodes.length; i++) {
                            treeObj.checkNode(nodes[i], false, true);
                        }
					})
                })
				$('#qxgl_add').on('click',function () {
					event.preventDefault();
                    var gwm=$('#qxgl_yhm').val();
					var gwmReg = /^\w{2,12}$/;
                    var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
                    var nodes = treeObj.getCheckedNodes(true);
                    console.log(nodes);
                    if(!gwmReg.test(gwm)){
                        alert('请输入有效的用户名！');
                        return false;
                    }else if(nodes.length<1) {
                        alert('请勾选出发地址！');
                        return false;
                    }
					if (qxgl_dialog.get('title') === '添加权限') {
                        var gwm=$('#qxgl_yhm').val();
                        var qxs = [];

                        for(var i=0;i<nodes.length;i++){
                            var yhqx= nodes[i].name;
                            var not = false;
                            if (guolvq.indexOf(yhqx) < 0) {
                                qxs.push(yhqx);
                            }
                        }
                            _self.addQx({
                                powername: gwm,
                                powerlist: qxs.join('、')
                            })
					} else {
                        var gwm=$('#qxgl_yhm').val();
                        var id = $('#qxgl_ID').val();
                        var qxs = [];
                        for(var i=0;i<nodes.length;i++){
                            var yhqx= nodes[i].name;
                            var not = false;
                            if (guolvq.indexOf(yhqx) < 0) {
                                qxs.push(yhqx);
                            }
                        }
                            _self.update({
                                powerid: id,
                                powername: gwm,
                                powerlist: qxs.join('、')
                            })
                        }
                });
                $('#qxgl_xx').on('click',function () {
                    qxgl_dialog.hide();
                })
			}
		})
	});