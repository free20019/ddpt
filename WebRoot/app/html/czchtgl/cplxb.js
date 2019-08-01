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
		var cllxbGrid = null, store = null;
		var cxb_data;
		var fxkfsr={};
		var columns = {
			checkbox: {label: '选择',selector: 'checkbox'},
			dojoId: {label: '序号'},
			VT_NAME: {label: '车辆类型'},
			NUM: {label: '总数'},
			NOTE: {label: '备注'}
		};
		var xhrArgsTabel = {
			url : basePath + "back/findcxb",
			postData : 'postData={"page":1,"pageSize":30,"VT_NAME":'+$("#findcxb_name").val()+'}',
			handleAs : "json",
			Origin : self.location.origin,
			preventCache : true,
			withCredentials : true,
			load : function(data) {
				cxb_data = data.datas;
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
				cllxbGrid.totalCount = data.count;
				cllxbGrid.set('collection', store);
				cllxbGrid.pagination.refresh(data.datas.length);
				cllxbGrid.on('dgrid-select', function (event) {
					fxkfsr=cllxbGrid.selection;
				});
				cllxbGrid.on('dgrid-deselect', function (event) {
					fxkfsr=cllxbGrid.selection;
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
//				if (cllxbGrid) {
//					cllxbGrid = null;
//					dojo.empty('cllxbTabel')
//				}
				if (cllxbGrid) { cllxbGrid.destroy(); }//dojo.destroy('zdbTabel');
                dojo.create("div", {id:'cllxbTabels', innerHTML:"" },'cllxbTabel')
				cllxbGrid = new CustomGrid({
//					collection: store,
//					selectionMode: 'none', 
//					allowSelectAll: true,
					totalCount : 0,
					pagination:null,
					columns : columns
				}, "cllxbTabels");
				pageii = new Pagination(cllxbGrid,xhrArgsTabel,{"VT_NAME":$("#findcxb_name").val()},30);
				dc.place(pageii.first(),'cllxbTabels','after');
//				this.get();
			},
			del: function (obj) {},
			add:function () {},
			update: function (json) {},
			get: function () {},
			initToolBar:function(){
//				if (cllxbGrid) { cllxbGrid = null; dojo.empty('cllxbTabel') }
//				cllxbGrid = new CustomGrid({ totalCount: 0, pagination: null,columns: columns}, 'cllxbTabel');
				var _self = this;
				query('#cllxbQuery').on('click', function() {
//					if (cllxbGrid) {
//						cllxbGrid = null;
//						dojo.empty('cllxbTabel')
//					}
					if (cllxbGrid) { cllxbGrid.destroy(); }//dojo.destroy('zdbTabel');
	                dojo.create("div", {id:'cllxbTabels', innerHTML:"" },'cllxbTabel')
					cllxbGrid = new CustomGrid({
						totalCount : 0,
						pagination:null,
						columns : columns
					}, "cllxbTabels");
					$(".pagination").remove();
					pageii = new Pagination(cllxbGrid,xhrArgsTabel,{"VT_NAME":$("#findcxb_name").val()},30);
					dc.place(pageii.first(),'cllxbTabels','after');
//					pageii.first();
				});
				query('#cllxbAdd').on('click', function() {
					cllxbDialogPanel.set('href', 'app/html/czchtgl/editor/cplxbEditor.html');
					cllxbDialog.show().then(function () {
						cllxbDialog.set('title', '新增车牌类型');
						query('.cxb-iFBtnCommit').on('click', function() {
                        	var FormJson = getFormJson("cxbEditorForm");
                        	if(FormJson.VT_NAME.length==0){
                        		dijit.byId('qd_dialog').show().then(function() {
        							$("#czjg").html('车辆类型名称不能为空！');
        						});
        		        		return;
                        	}
                        	var datap = JSON.stringify(FormJson);
                        	var xhrArgs2 = {
									url : basePath  + "back/addcxb",
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
											cllxbDialog.hide();
										})
									}
								}
								dojo.xhrPost(xhrArgs2);
                        });
                        query('.cxb-iFBtnClose').on('click', function() {
                        	cllxbDialog.hide();
                        });
					})
				});
				query('#cllxbUpd').on('click', function() {
					var sz=[];
		        	for(var id in fxkfsr){
		        		if(fxkfsr[id]){
		        			sz.push(id);
		        		}
		        	}
		        	if(sz.length==0){
		        		dijit.byId('qd_dialog').show().then(function() {
							$("#czjg").html('请选择一个车辆类型后修改！');
						});
		        		return;
		        	}
		        	if(sz.length>1){
		        		dijit.byId('qd_dialog').show().then(function() {
							$("#czjg").html('每次只能修改一个车辆类型！');
						});
		        		return;
		        	}
					cllxbDialogPanel.set('href', 'app/html/czchtgl/editor/cplxbEditor.html');
					cllxbDialog.show().then(function () {
						cllxbDialog.set('title', '编辑车牌类型');
						$("#cxb_vt_name").val(cxb_data[sz[0]-1].VT_NAME);
                        $("#cxb_note").text(cxb_data[sz[0]-1].NOTE);
                        query('.cxb-iFBtnCommit').on('click', function() {
                        	var FormJson = getFormJson("cxbEditorForm");
                        	if(FormJson.VT_NAME.length==0){
                        		dijit.byId('qd_dialog').show().then(function() {
        							$("#czjg").html('车牌类型不能为空！');
        						});
        		        		return;
                        	}
                        	FormJson.ID = cxb_data[sz[0]-1].VT_ID;
                        	var datap = JSON.stringify(FormJson);
                        	var xhrArgs2 = {
									url : basePath  + "back/editcxb",
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
											cllxbDialog.hide();
										})
									}
								}
								dojo.xhrPost(xhrArgs2);
                        });
                        query('.cxb-iFBtnClose').on('click', function() {
                        	cllxbDialog.hide();
                        });
                    })
				});
				query('#cllxbDel').on('click', function() {
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
		        		zzid.push(cxb_data[sz[i]-1].VT_ID);
		        	}
		        	var idstr=zzid.join(',');
		        	layer.confirm('确定要删除该条记录吗?', function(index){
		        		var xhrArgs2 = {
								url : basePath  + "back/delcxb",
								postData : {
									"vt_id" : idstr
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
				query('#cllxbDc').on('click', function() {
					var postData = {
							"VT_NAME":$("#findcxb_name").val()
						};
						url = "backExcel/findcxbexcle?postData="
							+ encodeURI(encodeURI(JSON.stringify(postData))), window.open(url)
                });
			}
		})
	});