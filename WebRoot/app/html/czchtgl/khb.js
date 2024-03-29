define([ "dijit/Dialog", "dgrid/Editor", "dijit/form/Button",
        "dijit/form/DateTextBox", "dijit/form/TimeTextBox",
        "dijit/form/SimpleTextarea", "dijit/form/Select",
        "dijit/form/FilteringSelect", "dgrid/OnDemandGrid",
        "dijit/form/TextBox", "app/Pagination", "dgrid/Selection",
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
		var khbGrid = null, store = null;
		var khb_data;
		var fxkfsr={};
		var columns = {
			checkbox: {label: '选择',selector: 'checkbox'},
            dojoId: {label: '序号'},
            CUST_NAME: {label: '客户名'},
            CUST_TEL: {label: '客户电话'},
            CUST_ADDR: {label: '客户地址'},
            NOTE: {label: '备注'}
        };
		var xhrArgsTabel = {
			url : basePath + "back/findkhb",
			postData : 'postData={"page":1,"pageSize":30}',
			handleAs : "json",
			Origin : self.location.origin,
			preventCache : true,
			withCredentials : true,
			load : function(data) {
				khb_data = data.datas;
				for (var i = 0; i < data.datas.length; i++) {
					data.datas[i] = dojo.mixin({
						dojoId : i + 1
					}, data.datas[i]);
				}
				store = new Memory({
					data : {
						identifier : 'dojoId',
						label : 'dojoId',
						items : data.datas
					}
				});
				khbGrid.totalCount = data.count;
				khbGrid.set('collection', store);
				khbGrid.pagination.refresh(data.datas.length);
				khbGrid.on('dgrid-select', function (event) {
					fxkfsr=khbGrid.selection;
				});
				khbGrid.on('dgrid-deselect', function (event) {
					fxkfsr=khbGrid.selection;
				});
			},
			error : function(error) {
				console.log(error);
			}
		};
		var pageii = null;	
		return declare( null,{
			constructor:function(){
				this.initToolBar();
//				if (khbGrid) {
//					khbGrid = null;
//					dojo.empty('cllxbTabel')
//				}
				if (khbGrid) { khbGrid.destroy(); }//dojo.destroy('zdbTabel');
                dojo.create("div", {id:'khbTabels', innerHTML:"" },'khbTabel');
				khbGrid = new CustomGrid({
//					collection: store,
//					selectionMode: 'none', 
//					allowSelectAll: true,
					totalCount : 0,
					pagination:null,
					columns : columns
				}, "khbTabels");
				pageii = new Pagination(khbGrid,xhrArgsTabel,{"CUST_NAME":$("#findkhb_khm").val()},30);
				dc.place(pageii.first(),'khbTabels','after');
//				this.get();
			},
			del: function (obj) {},
			add:function () {},
			update: function (json) {},
			get: function () {},
			initToolBar:function(){
//				if (khbGrid) { khbGrid = null; dojo.empty('cllxbTabel') }
//				khbGrid = new CustomGrid({ totalCount: 0, pagination: null,columns: columns}, 'cllxbTabel');
				var _self = this;
				query('#khbFind').on('click', function() {
//					if (khbGrid) {
//						khbGrid = null;
//						dojo.empty('cllxbTabel')
//					}
					if (khbGrid) { khbGrid.destroy(); }//dojo.destroy('zdbTabel');
	                dojo.create("div", {id:'khbTabels', innerHTML:"" },'khbTabel');
					khbGrid = new CustomGrid({
						totalCount : 0,
						pagination:null,
						columns : columns
					}, "khbTabels");
					$(".pagination").remove();
					pageii = new Pagination(khbGrid,xhrArgsTabel,{"CUST_NAME":$("#findkhb_khm").val()},30);
					dc.place(pageii.first(),'khbTabels','after');
//					pageii.first();
				});
				query('#khbAdd').on('click', function() {
					khbDialogPanel.set('href', 'app/html/czchtgl/editor/khbEditor.html');
					khbDialog.show().then(function () {
						khbDialog.set('title', '新增客户');
						query('.khb-iFBtnCommit').on('click', function() {
                        	var FormJson = getFormJson("khbEditorForm");
                        	if(FormJson.CUST_NAME.length==0){
                        		dijit.byId('qd_dialog').show().then(function() {
        							$("#czjg").html('客户名称不能为空！');
        						});
        		        		return;
                        	}
                        	var datap = JSON.stringify(FormJson);
                        	var xhrArgs2 = {
									url : basePath  + "back/addkhb",
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
											khbDialog.hide();
										})
									}
								}
								dojo.xhrPost(xhrArgs2);
                        });
                        query('.khb-iFBtnClose').on('click', function() {
                        	khbDialog.hide();
                        });
					})
				});
				query('#khbUpd').on('click', function() {
					var sz=[];
		        	for(var id in fxkfsr){
		        		if(fxkfsr[id]){
		        			sz.push(id);
		        		}
		        	}
		        	if(sz.length==0){
		        		dijit.byId('qd_dialog').show().then(function() {
							$("#czjg").html('请选择一个定位后修改！');
						});
		        		return;
		        	}
		        	if(sz.length>1){
		        		dijit.byId('qd_dialog').show().then(function() {
							$("#czjg").html('每次只能修改一个定位！');
						});
		        		return;
		        	}
		        	khbDialogPanel.set('href', 'app/html/czchtgl/editor/khbEditor.html');
					khbDialog.show().then(function () {
						khbDialog.set('title', '编辑客户');
						$("#khb-khm").val(khb_data[sz[0]-1].CUST_NAME);
						$("#khb-khdh").val(khb_data[sz[0]-1].CUST_TEL);
						$("#khb-khdz").val(khb_data[sz[0]-1].CUST_ADDR);
                        $("#khb-bz").text(khb_data[sz[0]-1].NOTE);
                        query('.khb-iFBtnCommit').on('click', function() {
                        	var FormJson = getFormJson("khbEditorForm");
                        	if(FormJson.CUST_NAME.length==0){
                        		dijit.byId('qd_dialog').show().then(function() {
        							$("#czjg").html('客户名称不能为空！');
        						});
        		        		return;
                        	}
                        	FormJson.ID = khb_data[sz[0]-1].AB_ID;
                        	var datap = JSON.stringify(FormJson);
                        	var xhrArgs2 = {
									url : basePath  + "back/editkhb",
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
											khbDialog.hide();
										});
									}
								};
								dojo.xhrPost(xhrArgs2);
                        });
                        query('.khb-iFBtnClose').on('click', function() {
                        	khbDialog.hide();
                        });
                    })
				});
				query('#khbDel').on('click', function() {
                	var sz=[];
		        	for(var id in fxkfsr){
		        		if(fxkfsr[id]){
		        			sz.push(id);
		        		}
		        	}
		        	if(sz.length==0){
		        		dijit.byId('qd_dialog').show().then(function() {
							$("#czjg").html('请至少选择一个客户后删除！');
						});
		        		return;
		        	}
		        	var zzid = [];
		        	for(var i=0; i<sz.length; i++){
		        		zzid.push(khb_data[sz[i]-1].AB_ID);
		        	}
		        	var idstr=zzid.join(',');
		        	layer.confirm('确定要删除该条记录吗?', function(index){
		        		var xhrArgs2 = {
								url : basePath  + "back/delkhb",
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
				query('#khbDc').on('click', function() {
					var postData = {
							"CUST_NAME":$("#findkhb_khm").val()
						};
						url = "backExcel/finddkhexcle?postData="
							+ encodeURI(encodeURI(JSON.stringify(postData))), window.open(url)
                });
			}
		})
	});