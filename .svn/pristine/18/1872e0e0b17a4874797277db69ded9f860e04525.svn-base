define([ "dijit/Dialog", "dgrid/Editor", "dijit/form/Button",
        "dijit/form/DateTextBox", "dijit/form/TimeTextBox",
        "dijit/form/SimpleTextarea", "dijit/form/Select",
        "dijit/form/FilteringSelect", "dgrid/OnDemandGrid",
        "dijit/form/TextBox", "app/Pagination1", "dgrid/Selection",
        "dgrid/Keyboard", "dgrid/extensions/ColumnResizer",
        "dojo/store/Memory","cbtree/model/TreeStoreModel",
        "dstore/Memory","dijit/form/NumberTextBox",
        "dgrid/extensions/DijitRegistry", "dijit/registry", "dojo/dom-style",
        'dstore/Trackable', 'dgrid/Selector',
        "dojo/_base/declare", "dojo/dom-construct", "dojo/on","dijit/tree/ObjectStoreModel", "cbtree/Tree",
        "cbtree/models/ForestStoreModel", "dojo/data/ItemFileWriteStore", "dojo/query", "app/util" ],
    function(Dialog, Editor, Button, DateTextBox, TimeTextBox,
             SimpleTextarea, Select, FilteringSelect, Grid, TextBox,
             Pagination, Selection, Keyboard, ColumnResizer,
             Memory2,TreeStoreModel,
             Memory,NumberTextBox, DijitRegistry, registry, domStyle,
             Trackable, Selector,
             declare, dc, on,ObjectStoreModel, Tree,
             ForestStoreModel, ItemFileWriteStore, query, util) {
        var CustomGrid = declare([Grid, Selection, DijitRegistry, Editor, ColumnResizer, Selector]);
        var  store = null;
        var zdbGrid = null;
        var fxkfsr={};
        var zdb_data;
        var columns = {
            checkbox: {label: '选择',selector: 'checkbox'},
            dojoId: {label: '序号'},
//            ZDZTID: {label: '终端状态ID'},
//            ZDZTM: {label: '终端状态名'},
            MT_NAME: {label: '终端类型名称'},
            NUM: {label: '总数'},
            NOTE: {label: '备注'}
        };
        var xhrArgsTabel = {
            url : basePath + "back/findzdb",
            postData :{},
            handleAs : "json",
            Origin : self.location.origin,
            preventCache : true,
            withCredentials : true,
            load : function(data) {
                zdb_data = data;
                for (var i = 0; i < data.length; i++) {
                    data[i] = dojo.mixin({
                        dojoId : i + 1
                    }, data[i]);
                }
//                store = new Memory({
//                    data : {
//                        identifier : 'dojoId',
//                        label : 'dojoId',
//                        items : data
//                    }
//                });
//                zdbGrid.totalCount = data.count;
//                zdbGrid.set('collection', store);
//                zdbGrid.pagination.refresh(data.length);
                store = new Memory({data: {identifier: 'dojoId', label: 'dojoId', items: data}});
                if (zdbGrid) { zdbGrid.destroy(); }//dojo.destroy('zdbTabel');
                dojo.create("div", {id:'zdbTabels', innerHTML:"" },'zdbTabel')
                zdbGrid = new CustomGrid({collection: store,selectionMode: 'none', allowSelectAll: true, totalCount: 0, pagination: null,columns: columns}, 'zdbTabels');
                zdbGrid.on('dgrid-select', function (event) {
					fxkfsr=zdbGrid.selection;
				});
                zdbGrid.on('dgrid-deselect', function (event) {
					fxkfsr=zdbGrid.selection;
				});
            },
            error : function(error) {
                console.log(error);
            }
        };
        return declare( null,{
            constructor:function(){
                this.initToolBar();
                this.get();
            },
            del: function (obj) {},
            add:function () {},
            update: function (json) {},
            get: function () {
            	dojo.xhrPost(xhrArgsTabel);
            },
            initToolBar:function(){
                query('#zdbAdd').on('click', function() {
                    zdbDialogPanel.set('href', 'app/html/czchtgl/editor/zdbEditor.html');
                    zdbDialog.show().then(function () {
                        zdbDialog.set('title', '新增终端');
                        query('.zdb-iFBtnCommit').on('click', function() {
                        	var FormJson = getFormJson("zdbEditorForm");
                        	if(FormJson.MT_NAME.length==0){
                        		dijit.byId('qd_dialog').show().then(function() {
        							$("#czjg").html('终端类型名称不能为空！');
        						});
        		        		return;
                        	}
                        	var datap = JSON.stringify(FormJson);
                        	var xhrArgs2 = {
									url : basePath  + "back/addzdb",
									postData : {
										"postData" : datap
									},
									handleAs : "json",
									Origin : self.location.origin,
									preventCache:true,
									withCredentials :  true,
									load : function(data) {
										dijit.byId('qd_dialog').show().then(function() {
											$("#czjg").html(data.info);
											dojo.xhrPost(xhrArgsTabel);
											zdbDialog.hide();
										})
									}
								}
								dojo.xhrPost(xhrArgs2);
                        });
                        query('.zdb-iFBtnClose').on('click', function() {
                        	zdbDialog.hide();
                        });
                    })
                });
                query('#zdbUpd').on('click', function() {
                	var sz=[];
		        	for(var id in fxkfsr){
		        		if(fxkfsr[id]){
		        			sz.push(id);
		        		}
		        	}
		        	if(sz.length==0){
		        		dijit.byId('qd_dialog').show().then(function() {
							$("#czjg").html('请选择一个终端后修改！');
						});
		        		return;
		        	}
		        	if(sz.length>1){
		        		dijit.byId('qd_dialog').show().then(function() {
							$("#czjg").html('每次只能修改一个终端！');
						});
		        		return;
		        	}
                    zdbDialogPanel.set('href', 'app/html/czchtgl/editor/zdbEditor.html');
                    zdbDialog.show().then(function () {
                        zdbDialog.set('title', '编辑终端');
                        $("#zdb-zdlxm").val(zdb_data[sz[0]-1].MT_NAME);
                        $("#zdb-bz").text(zdb_data[sz[0]-1].NOTE);
                        query('.zdb-iFBtnCommit').on('click', function() {
                        	var FormJson = getFormJson("zdbEditorForm");
                        	if(FormJson.MT_NAME.length==0){
                        		dijit.byId('qd_dialog').show().then(function() {
        							$("#czjg").html('车牌类型不能为空！');
        						});
        		        		return;
                        	}
                        	FormJson.ID = zdb_data[sz[0]-1].MT_ID;
                        	var datap = JSON.stringify(FormJson);
                        	var xhrArgs2 = {
									url : basePath  + "back/editzdb",
									postData : {
										"postData" : datap
									},
									handleAs : "json",
									Origin : self.location.origin,
									preventCache:true,
									withCredentials :  true,
									load : function(data) {
										dijit.byId('qd_dialog').show().then(function() {
											$("#czjg").html(data.info);
											dojo.xhrPost(xhrArgsTabel);
											zdbDialog.hide();
										})
									}
								}
								dojo.xhrPost(xhrArgs2);
                        });
                        query('.zdb-iFBtnClose').on('click', function() {
                        	zdbDialog.hide();
                        });
                    })
                });
                query('#zdbDel').on('click', function() {
                	var sz=[];
		        	for(var id in fxkfsr){
		        		if(fxkfsr[id]){
		        			sz.push(id);
		        		}
		        	}
		        	if(sz.length==0){
		        		dijit.byId('qd_dialog').show().then(function() {
							$("#czjg").html('请至少选择一个区块后删除！');
						});
		        		return;
		        	}
		        	var zzid = [];
		        	for(var i=0; i<sz.length; i++){
		        		zzid.push(zdb_data[sz[i]-1].MT_ID);
		        	}
		        	var idstr=zzid.join(',');
		        	layer.confirm('确定要删除该条记录吗?', function(index){
		        		var xhrArgs2 = {
								url : basePath  + "back/delzdb",
								postData : {
									"id" : idstr
								},
								handleAs : "json",
								Origin : self.location.origin,
								preventCache:true,
								withCredentials :  true,
								load : function(data) {
									dijit.byId('qd_dialog').show().then(function() {
										$("#czjg").html(data.info);
										dojo.xhrPost(xhrArgsTabel);
									})
								}
							}
							dojo.xhrPost(xhrArgs2);
		        		  layer.close(index);
	        		}); 
                });
                query('#zdbDc').on('click', function() {
						url = "backExcel/findzdbexcle", window.open(url)
                });
            }
        })
    });