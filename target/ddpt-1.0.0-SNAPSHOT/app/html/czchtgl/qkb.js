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
        var qkbGrid = null, store = null;
        var fxkfsr={};
        var qkb_data;
        var columns = {
            checkbox: {label: '选择',selector: 'checkbox'},
            dojoId: {label: '序号'},
            VNT_NAME: {label: '区块名称'},
            NOTE: {label: '备注'}
        };
        var xhrArgsTabel = {
            url : basePath + "back/findzacqkb",
            postData :{},
            handleAs : "json",
            Origin : self.location.origin,
            preventCache : true,
            withCredentials : true,
            load : function(data) {
                qkb_data = data;
                for (var i = 0; i < data.length; i++) {
                    data[i] = dojo.mixin({
                        dojoId : i + 1
                    }, data[i]);
                }
                store = new Memory({
                    data : {
                        identifier : 'dojoId',
                        label : 'dojoId',
                        items : data
                    }
                });
//                qkbGrid.totalCount = data.count;
//                qkbGrid.set('collection', store);
//                qkbGrid.pagination.refresh(data.length);
//                if (qkbGrid) { qkbGrid = null; dojo.empty('qkbTabel'); };
                if (qkbGrid) { qkbGrid.destroy(); }//dojo.destroy('zdbTabel');
                dojo.create("div", {id:'qkbTabels', innerHTML:"" },'qkbTabel')
                qkbGrid = new CustomGrid({collection: store,selectionMode: 'none', allowSelectAll: true,totalCount: 0, pagination: null,columns: columns}, 'qkbTabels');
                qkbGrid.on('dgrid-select', function (event) {
					fxkfsr=qkbGrid.selection;
				});
                qkbGrid.on('dgrid-deselect', function (event) {
					fxkfsr=qkbGrid.selection;
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
            	var _self = this;
            	query('#qkbAdd').on('click', function() {
                    qkbDialogPanel.set('href', 'app/html/czchtgl/editor/qkbEditor.html');
                    qkbDialog.show().then(function () {
                        qkbDialog.set('title', '新增区块表');
                        query('.qkb-iFBtnCommit').on('click', function() {
                        	var FormJson = getFormJson("qkbEditorForm");
                        	if(FormJson.VNT_NAME.length==0){
                        		dijit.byId('qd_dialog').show().then(function() {
        							$("#czjg").html('车牌类型不能为空！');
        						});
        		        		return;
                        	}
                        	var datap = JSON.stringify(FormJson);
                        	var xhrArgs2 = {
									url : basePath  + "back/addzacqkb",
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
											qkbDialog.hide();
										})
									}
								}
								dojo.xhrPost(xhrArgs2);
                        });
                        query('.qkb-iFBtnClose').on('click', function() {
                        	qkbDialog.hide();
                        });
                    });
                });

                query('#qkbUpd').on('click', function() {
                	var sz=[];
		        	for(var id in fxkfsr){
		        		if(fxkfsr[id]){
		        			sz.push(id);
		        		}
		        	}
		        	if(sz.length==0){
		        		dijit.byId('qd_dialog').show().then(function() {
							$("#czjg").html('请选择一个区块后修改！');
						});
		        		return;
		        	}
		        	if(sz.length>1){
		        		dijit.byId('qd_dialog').show().then(function() {
							$("#czjg").html('每次只能修改一个区块！');
						});
		        		return;
		        	}
                    qkbDialogPanel.set('href', 'app/html/czchtgl/editor/qkbEditor.html');
                    qkbDialog.show().then(function () {
                        qkbDialog.set('title', '编辑区块表');
                        $("#qkb-cplx").val(qkb_data[sz[0]-1].VNT_NAME);
                        $("#qkb-bz").text(qkb_data[sz[0]-1].NOTE);
                        query('.qkb-iFBtnCommit').on('click', function() {
                        	var FormJson = getFormJson("qkbEditorForm");
                        	if(FormJson.VNT_NAME.length==0){
                        		dijit.byId('qd_dialog').show().then(function() {
        							$("#czjg").html('车牌类型不能为空！');
        						});
        		        		return;
                        	}
                        	FormJson.ID = qkb_data[sz[0]-1].VNT_ID;
                        	var datap = JSON.stringify(FormJson);
                        	var xhrArgs2 = {
									url : basePath  + "back/editzacqkb",
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
											qkbDialog.hide();
										})
									}
								}
								dojo.xhrPost(xhrArgs2);
                        });
                        query('.qkb-iFBtnClose').on('click', function() {
                        	qkbDialog.hide();
                        });
                    });
                });
                query('#qkbDel').on('click', function() {
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
		        	layer.confirm('确定要删除该条记录吗?', function(index){
		        		var zzid = [];
			        	for(var i=0; i<sz.length; i++){
			        		zzid.push(qkb_data[sz[i]-1].VNT_ID);
			        	}
			        	var idstr=zzid.join(',');
			        	var xhrArgs2 = {
								url : basePath  + "back/delzacqkb",
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
                query('#qkbDc').on('click', function() {
						url = "backExcel/findqkbexcle", window.open(url)
                });
            }
        });
    });