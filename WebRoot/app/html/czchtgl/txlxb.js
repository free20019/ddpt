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
		var txlxbGrid = null, store = null;
		var fxkfsr={};
        var txb_data;
		var columns = {
			checkbox: {label: '选择',selector: 'checkbox'},
			dojoId: {label: '序号'},
			CT_NAME: {label: '通信类型名'},
			NUM: {label: '总数'},
			NOTE: {label: '备注'}
		};
		var xhrArgsTabel = {
			url : basePath + "back/findtxb",
			postData :{},
			handleAs : "json",
			Origin : self.location.origin,
			preventCache : true,
			withCredentials : true,
			load : function(data) {
				txb_data = data;
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
//				txlxbGrid.totalCount = data.count;
//				txlxbGrid.set('collection', store);
//				txlxbGrid.pagination.refresh(data.length);
				 if (txlxbGrid) { txlxbGrid.destroy(); }//dojo.destroy('zdbTabel');
                dojo.create("div", {id:'txlxbTabels', innerHTML:"" },'txlxbTabel')
				txlxbGrid = new CustomGrid({collection: store,selectionMode: 'none', allowSelectAll: true, totalCount: 0, pagination: null,columns: columns}, 'txlxbTabels');
                txlxbGrid.on('dgrid-select', function (event) {
                	fxkfsr=txlxbGrid.selection;
				});
                txlxbGrid.on('dgrid-deselect', function (event) {
                	fxkfsr=txlxbGrid.selection;
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
				query('#txlxbAdd').on('click', function() {
					txlxbDialogPanel.set('href', 'app/html/czchtgl/editor/txlxbEditor.html');
					txlxbDialog.show().then(function () {
						txlxbDialog.set('title', '新增通信类型');
						query('.txb-iFBtnCommit').on('click', function() {
                        	var FormJson = getFormJson("txbEditorForm");
                        	if(FormJson.CT_NAME.length==0){
                        		dijit.byId('qd_dialog').show().then(function() {
        							$("#czjg").html('通信类型名称不能为空！');
        						});
        		        		return;
                        	}
                        	var datap = JSON.stringify(FormJson);
                        	var xhrArgs2 = {
									url : basePath  + "back/addtxb",
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
											txlxbDialog.hide();
										});
									}
								};
								dojo.xhrPost(xhrArgs2);
                        });
                        query('.txb-iFBtnClose').on('click', function() {
                        	txlxbDialog.hide();
                        });
					})
				});
				query('#txlxbUpd').on('click', function() {
					var sz=[];
		        	for(var id in fxkfsr){
		        		if(fxkfsr[id]){
		        			sz.push(id);
		        		}
		        	}
		        	if(sz.length==0){
		        		dijit.byId('qd_dialog').show().then(function() {
							$("#czjg").html('请选择一个通信类型后修改！');
						});
		        		return;
		        	}
		        	if(sz.length>1){
		        		dijit.byId('qd_dialog').show().then(function() {
							$("#czjg").html('每次只能修改一个通信类型！');
						});
		        		return;
		        	}
					txlxbDialogPanel.set('href', 'app/html/czchtgl/editor/txlxbEditor.html');
					txlxbDialog.show().then(function () {
						txlxbDialog.set('title', '编辑通信类型');
						$("#txb-txlxm").val(txb_data[sz[0]-1].CT_NAME);
                        $("#txb-bz").text(txb_data[sz[0]-1].NOTE);
                        query('.txb-iFBtnCommit').on('click', function() {
                        	var FormJson = getFormJson("txbEditorForm");
                        	if(FormJson.CT_NAME.length==0){
                        		dijit.byId('qd_dialog').show().then(function() {
        							$("#czjg").html('车牌颜色不能为空！');
        						});
        		        		return;
                        	}
                        	FormJson.ID = txb_data[sz[0]-1].CT_ID;
                        	var datap = JSON.stringify(FormJson);
                        	var xhrArgs2 = {
									url : basePath  + "back/edittxb",
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
											txlxbDialog.hide();
										});
									}
								};
								dojo.xhrPost(xhrArgs2);
                        });
                        query('.txb-iFBtnClose').on('click', function() {
                        	txlxbDialog.hide();
                        });
					})
				});
				query('#txlxbDel').on('click', function() {
                	var sz=[];
		        	for(var id in fxkfsr){
		        		if(fxkfsr[id]){
		        			sz.push(id);
		        		}
		        	}
		        	if(sz.length==0){
		        		dijit.byId('qd_dialog').show().then(function() {
							$("#czjg").html('请至少选择一个通信类型后删除！');
						});
		        		return;
		        	}
		        	var zzid = [];
		        	for(var i=0; i<sz.length; i++){
		        		zzid.push(txb_data[sz[i]-1].CT_ID);
		        	}
		        	var idstr=zzid.join(',');
		        	layer.confirm('确定要删除该条记录吗?', function(index){
		        		var xhrArgs2 = {
								url : basePath  + "back/deltxb",
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
									});
								}
							};
							dojo.xhrPost(xhrArgs2);
		        		  layer.close(index);
	        		}); 
                });
				query('#txlxbDc').on('click', function() {
						url = "backExcel/findtxbexcle", window.open(url)
                });
			}
		})
	});