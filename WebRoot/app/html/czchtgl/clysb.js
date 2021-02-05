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
		var clysbGrid = null, store = null;
		var fxkfsr={};
        var ysb_data;
		var columns = {
			checkbox: {label: '选择',selector: 'checkbox'},
			dojoId: {label: '序号'},
			VC_NAME: {label: '车辆颜色'},
			NUM: {label: '数量'},
			NOTE: {label: '备注'}
		};
		var xhrArgsTabel = {
			url : basePath + "back/findysb",
			postData :{},
			handleAs : "json",
			Origin : self.location.origin,
			preventCache : true,
			withCredentials : true,
			load : function(data) {
				ysb_data = data;
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
				  if (clysbGrid) { clysbGrid.destroy(); }//dojo.destroy('zdbTabel');
	                dojo.create("div", {id:'clysbTabels', innerHTML:"" },'clysbTabel')
				clysbGrid = new CustomGrid({collection: store,selectionMode: 'none', allowSelectAll: true, totalCount: 0, pagination: null,columns: columns}, 'clysbTabels');
                clysbGrid.on('dgrid-select', function (event) {
                	fxkfsr=clysbGrid.selection;
				});
                clysbGrid.on('dgrid-deselect', function (event) {
                	fxkfsr=clysbGrid.selection;
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
				query('#clysbAdd').on('click', function() {
					clysbDialogPanel.set('href', 'app/html/czchtgl/editor/clysbEditor.html');
					clysbDialog.show().then(function () {
						clysbDialog.set('title', '新增车辆颜色');
						 query('.ysb-iFBtnCommit').on('click', function() {
	                        	var FormJson = getFormJson("ysbEditorForm");
	                        	if(FormJson.VC_NAME.length==0){
	                        		dijit.byId('qd_dialog').show().then(function() {
	        							$("#czjg").html('终端类型名称不能为空！');
	        						});
	        		        		return;
	                        	}
	                        	var datap = JSON.stringify(FormJson);
	                        	var xhrArgs2 = {
										url : basePath  + "back/addysb",
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
												clysbDialog.hide();
											});
										}
									};
									dojo.xhrPost(xhrArgs2);
	                        });
	                        query('.ysb-iFBtnClose').on('click', function() {
	                        	clysbDialog.hide();
	                        });
					});
				});
				query('#clysbUpd').on('click', function() {
					var sz=[];
		        	for(var id in fxkfsr){
		        		if(fxkfsr[id]){
		        			sz.push(id);
		        		}
		        	}
		        	if(sz.length==0){
		        		dijit.byId('qd_dialog').show().then(function() {
							$("#czjg").html('请选择一个车辆颜色后修改！');
						});
		        		return;
		        	}
		        	if(sz.length>1){
		        		dijit.byId('qd_dialog').show().then(function() {
							$("#czjg").html('每次只能修改一个车辆颜色！');
						});
		        		return;
		        	}
					clysbDialogPanel.set('href', 'app/html/czchtgl/editor/clysbEditor.html');
					clysbDialog.show().then(function () {
						clysbDialog.set('title', '编辑车辆颜色');
						 	$("#ysb-clys").val(ysb_data[sz[0]-1].VC_NAME);
	                        $("#ysb-bz").text(ysb_data[sz[0]-1].NOTE);
	                        query('.ysb-iFBtnCommit').on('click', function() {
	                        	var FormJson = getFormJson("ysbEditorForm");
	                        	if(FormJson.VC_NAME.length==0){
	                        		dijit.byId('qd_dialog').show().then(function() {
	        							$("#czjg").html('车牌颜色不能为空！');
	        						});
	        		        		return;
	                        	}
	                        	FormJson.ID = ysb_data[sz[0]-1].VC_ID;
	                        	var datap = JSON.stringify(FormJson);
	                        	var xhrArgs2 = {
										url : basePath  + "back/editysb",
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
												clysbDialog.hide();
											});
										}
									};
									dojo.xhrPost(xhrArgs2);
	                        });
	                        query('.ysb-iFBtnClose').on('click', function() {
	                        	clysbDialog.hide();
	                        });
					})
				});
				query('#clysbDel').on('click', function() {
                	var sz=[];
		        	for(var id in fxkfsr){
		        		if(fxkfsr[id]){
		        			sz.push(id);
		        		}
		        	}
		        	if(sz.length==0){
		        		dijit.byId('qd_dialog').show().then(function() {
							$("#czjg").html('请至少选择一个车辆颜色后删除！');
						});
		        		return;
		        	}
		        	var zzid = [];
		        	for(var i=0; i<sz.length; i++){
		        		zzid.push(ysb_data[sz[i]-1].VC_ID);
		        	}
		        	var idstr=zzid.join(',');
		        	layer.confirm('确定要删除该条记录吗?', function(index){
		        		var xhrArgs2 = {
								url : basePath  + "back/delysb",
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
				query('#clysbDc').on('click', function() {
						url = "backExcel/findysbexcle", window.open(url)
                });
			}
		});
	});