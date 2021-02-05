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
		var dwbGrid = null, store = null;
		var dwb_data;
		var fxkfsr={};
		var columns = {
            checkbox: {label: '选择',selector: 'checkbox'},
            dojoId: {label: '序号'},
            PNAME: {label: '地点'},
            GPNAME: {label: '定位点'},
            NOTE: {label: '备注'}
        };
		var xhrArgsTabel = {
			url : basePath + "back/finddwb",
			postData : 'postData={"page":1,"pageSize":30}',
			handleAs : "json",
			Origin : self.location.origin,
			preventCache : true,
			withCredentials : true,
			load : function(data) {
				dwb_data = data.datas;
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
				dwbGrid.totalCount = data.count;
				dwbGrid.set('collection', store);
				dwbGrid.pagination.refresh(data.datas.length);
				dwbGrid.on('dgrid-select', function (event) {
					fxkfsr=dwbGrid.selection;
				});
				dwbGrid.on('dgrid-deselect', function (event) {
					fxkfsr=dwbGrid.selection;
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
//				if (dwbGrid) {
//					dwbGrid = null;
//					dojo.empty('cllxbTabel')
//				}
				if (dwbGrid) { dwbGrid.destroy(); }//dojo.destroy('zdbTabel');
                dojo.create("div", {id:'dwbTabels', innerHTML:"" },'dwbTabel');
				dwbGrid = new CustomGrid({
//					collection: store,
//					selectionMode: 'none', 
//					allowSelectAll: true,
					totalCount : 0,
					pagination:null,
					columns : columns
				}, "dwbTabels");
				pageii = new Pagination(dwbGrid,xhrArgsTabel,{"PNAME":$("#finddwb_dd").val()},30);
				dc.place(pageii.first(),'dwbTabels','after');
//				this.get();
			},
			del: function (obj) {},
			add:function () {},
			update: function (json) {},
			get: function () {},
			initToolBar:function(){
//				if (dwbGrid) { dwbGrid = null; dojo.empty('cllxbTabel') }
//				dwbGrid = new CustomGrid({ totalCount: 0, pagination: null,columns: columns}, 'cllxbTabel');
				var _self = this;
				query('#dwbFind').on('click', function() {
//					if (dwbGrid) {
//						dwbGrid = null;
//						dojo.empty('cllxbTabel')
//					}
					if (dwbGrid) { dwbGrid.destroy(); }//dojo.destroy('zdbTabel');
	                dojo.create("div", {id:'dwbTabels', innerHTML:"" },'dwbTabel');
					dwbGrid = new CustomGrid({
						totalCount : 0,
						pagination:null,
						columns : columns
					}, "dwbTabels");
					$(".pagination").remove();
					pageii = new Pagination(dwbGrid,xhrArgsTabel,{"PNAME":$("#finddwb_dd").val()},30);
					dc.place(pageii.first(),'dwbTabels','after');
//					pageii.first();
				});
				query('#dwbAdd').on('click', function() {
					dwbDialogPanel.set('href', 'app/html/czchtgl/editor/dwbEditor.html');
					dwbDialog.show().then(function () {
						dwbDialog.set('title', '新增定位');
						query('.dwb-iFBtnCommit').on('click', function() {
                        	var FormJson = getFormJson("dwbEditorForm");
                        	if(FormJson.PNAME.length==0){
                        		dijit.byId('qd_dialog').show().then(function() {
        							$("#czjg").html('定位地点不能为空！');
        						});
        		        		return;
                        	}
                        	var datap = JSON.stringify(FormJson);
                        	var xhrArgs2 = {
									url : basePath  + "back/adddwb",
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
											dwbDialog.hide();
										})
									}
								}
								dojo.xhrPost(xhrArgs2);
                        });
                        query('.dwb-iFBtnClose').on('click', function() {
                        	dwbDialog.hide();
                        });
					})
				});
				query('#dwbUpd').on('click', function() {
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
		        	dwbDialogPanel.set('href', 'app/html/czchtgl/editor/dwbEditor.html');
					dwbDialog.show().then(function () {
						dwbDialog.set('title', '编辑定位');
						$("#dwb-dd").val(dwb_data[sz[0]-1].PNAME);
						$("#dwb-dwd").val(dwb_data[sz[0]-1].GPNAME);
                        $("#dwb-bz").text(dwb_data[sz[0]-1].NOTE);
                        query('.dwb-iFBtnCommit').on('click', function() {
                        	var FormJson = getFormJson("dwbEditorForm");
                        	if(FormJson.PNAME.length==0){
                        		dijit.byId('qd_dialog').show().then(function() {
        							$("#czjg").html('车牌类型不能为空！');
        						});
        		        		return;
                        	}
                        	FormJson.ID = dwb_data[sz[0]-1].GP_ID;
                        	var datap = JSON.stringify(FormJson);
                        	var xhrArgs2 = {
									url : basePath  + "back/editdwb",
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
											dwbDialog.hide();
										})
									}
								}
								dojo.xhrPost(xhrArgs2);
                        });
                        query('.dwb-iFBtnClose').on('click', function() {
                        	dwbDialog.hide();
                        });
                    })
				});
				query('#dwbDel').on('click', function() {
                	var sz=[];
		        	for(var id in fxkfsr){
		        		if(fxkfsr[id]){
		        			sz.push(id);
		        		}
		        	}
		        	if(sz.length==0){
		        		dijit.byId('qd_dialog').show().then(function() {
							$("#czjg").html('请至少选择一个定位后删除！');
						});
		        		return;
		        	}
		        	var zzid = [];
		        	for(var i=0; i<sz.length; i++){
		        		zzid.push(dwb_data[sz[i]-1].GP_ID);
		        	}
		        	var idstr=zzid.join(',');
		        	layer.confirm('确定要删除该条记录吗?', function(index){
		        		var xhrArgs2 = {
								url : basePath  + "back/deldwb",
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
				query('#dwbDc').on('click', function() {
					var postData = {
							"PNAME":$("#finddwb_dd").val()
						};
						url = "backExcel/finddwbexcle?postData="
							+ encodeURI(encodeURI(JSON.stringify(postData))), window.open(url)
                });
			}
		})
	});