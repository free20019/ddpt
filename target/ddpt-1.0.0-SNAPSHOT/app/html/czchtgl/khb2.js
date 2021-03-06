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
		var khb2Grid = null, store = null;
		var khb2_data;
		var fxkfsr={};
		var columns = {
			checkbox: {label: '选择',selector: 'checkbox'},
            dojoId: {label: '序号'},
            CUST_NAME: {label: '客户名'},
            CUST_TEL: {label: '客户电话'},
            CUST_GRADE: {label: '用户级别',formatter : util.formatYHLX},
            CUST_SEX: {label: '性别'},
            IS_LOVE: {label: '是否爱心出租'},
            ADDRESS_KJ: {label: '地址'},
            NOTE: {label: '备注'}
        };
		var xhrArgsTabel = {
			url : basePath + "back/findkhb2",
			postData : 'postData={"page":1,"pageSize":30}',
			handleAs : "json",
			Origin : self.location.origin,
			preventCache : true,
			withCredentials : true,
			load : function(data) {
				khb2_data = data.datas;
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
				khb2Grid.totalCount = data.count;
				khb2Grid.set('collection', store);
				khb2Grid.pagination.refresh(data.datas.length);
				khb2Grid.on('dgrid-select', function (event) {
					fxkfsr=khb2Grid.selection;
				});
				khb2Grid.on('dgrid-deselect', function (event) {
					fxkfsr=khb2Grid.selection;
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
//				if (khb2Grid) {
//					khb2Grid = null;
//					dojo.empty('cllxbTabel')
//				}
				if (khb2Grid) { khb2Grid.destroy(); }//dojo.destroy('zdbTabel');
                dojo.create("div", {id:'khb2Tabels', innerHTML:"" },'khb2Tabel');
				khb2Grid = new CustomGrid({
//					collection: store,
//					selectionMode: 'none', 
//					allowSelectAll: true,
					totalCount : 0,
					pagination:null,
					columns : columns
				}, "khb2Tabels");
				pageii = new Pagination(khb2Grid,xhrArgsTabel,{"CUST_NAME":$("#findkhb2_khm").val()},30);
				dc.place(pageii.first(),'khb2Tabels','after');
//				this.get();
			},
			del: function (obj) {},
			add:function () {},
			update: function (json) {},
			get: function () {},
			initToolBar:function(){
//				if (khb2Grid) { khb2Grid = null; dojo.empty('cllxbTabel') }
//				khb2Grid = new CustomGrid({ totalCount: 0, pagination: null,columns: columns}, 'cllxbTabel');
				var _self = this;
				query('#khb2Find').on('click', function() {
//					if (khb2Grid) {
//						khb2Grid = null;
//						dojo.empty('cllxbTabel')
//					}
					if (khb2Grid) { khb2Grid.destroy(); }//dojo.destroy('zdbTabel');
	                dojo.create("div", {id:'khb2Tabels', innerHTML:"" },'khb2Tabel');
					khb2Grid = new CustomGrid({
						totalCount : 0,
						pagination:null,
						columns : columns
					}, "khb2Tabels");
					$(".pagination").remove();
					pageii = new Pagination(khb2Grid,xhrArgsTabel,{"CUST_NAME":$("#findkhb2_khm").val()},30);
					dc.place(pageii.first(),'khb2Tabels','after');
//					pageii.first();
				});
				query('#khb2Add').on('click', function() {
					khb2DialogPanel.set('href', 'app/html/czchtgl/editor/khb2Editor.html');
					khb2Dialog.show().then(function () {
						khb2Dialog.set('title', '新增客户');
						query('.khb2-iFBtnCommit').on('click', function() {
                        	var FormJson = getFormJson("khb2EditorForm");
                        	if(FormJson.CUST_NAME.length==0){
                        		dijit.byId('qd_dialog').show().then(function() {
        							$("#czjg").html('客户名称不能为空！');
        						});
        		        		return;
                        	}
                        	var datap = JSON.stringify(FormJson);
                        	var xhrArgs2 = {
									url : basePath  + "back/addkhb2",
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
											khb2Dialog.hide();
										})
									}
								}
								dojo.xhrPost(xhrArgs2);
                        });
                        query('.khb2-iFBtnClose').on('click', function() {
                        	khb2Dialog.hide();
                        });
					})
				});
				query('#khb2Upd').on('click', function() {
					var sz=[];
		        	for(var id in fxkfsr){
		        		if(fxkfsr[id]){
		        			sz.push(id);
		        		}
		        	}
		        	if(sz.length==0){
		        		dijit.byId('qd_dialog').show().then(function() {
							$("#czjg").html('请选择一个客户后修改！');
						});
		        		return;
		        	}
		        	if(sz.length>1){
		        		dijit.byId('qd_dialog').show().then(function() {
							$("#czjg").html('每次只能修改一个客户！');
						});
		        		return;
		        	}
		        	khb2DialogPanel.set('href', 'app/html/czchtgl/editor/khb2Editor.html');
					khb2Dialog.show().then(function () {
						khb2Dialog.set('title', '编辑客户');
						$("#khb2-khm").val(khb2_data[sz[0]-1].CUST_NAME);
						$("#khb2-khdh").val(khb2_data[sz[0]-1].CUST_TEL);
						$("#khb2-yhjb").val(khb2_data[sz[0]-1].CUST_GRADE);
                        $("#khb2-xb").val(khb2_data[sz[0]-1].CUST_SEX);
                        $("#khb2-qtlxdh").val(khb2_data[sz[0]-1].CUST_TEL_OTHER);
                        $("#khb2-dlmm").val(khb2_data[sz[0]-1].LOGINPASS);
                        $("#khb2-jbyxq").val(khb2_data[sz[0]-1].VALID_DAY);
                        $("#khb2-kjdz").val(khb2_data[sz[0]-1].ADDRESS_KJ);
						$("#khb-love").val(khb2_data[sz[0]-1].IS_LOVE);
                        $("#khb2-bz").text(khb2_data[sz[0]-1].NOTE);
                        query('.khb2-iFBtnCommit').on('click', function() {
                        	var FormJson = getFormJson("khb2EditorForm");
                        	if(FormJson.CUST_NAME.length==0){
                        		dijit.byId('qd_dialog').show().then(function() {
        							$("#czjg").html('客户名称不能为空！');
        						});
        		        		return;
                        	}
                        	FormJson.ID = khb2_data[sz[0]-1].CUST_ID;
                        	var datap = JSON.stringify(FormJson);
                        	var xhrArgs2 = {
									url : basePath  + "back/editkhb2",
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
											khb2Dialog.hide();
										});
									}
								};
								dojo.xhrPost(xhrArgs2);
                        });
                        query('.khb2-iFBtnClose').on('click', function() {
                        	khb2Dialog.hide();
                        });
                    })
				});
				query('#khb2Del').on('click', function() {
                	var sz=[];
		        	for(var id in fxkfsr){
		        		if(fxkfsr[id]){
		        			sz.push(id);
		        		}
		        	}
		        	if(sz.length==0){
		        		dijit.byId('qd_dialog').show().then(function() {
							$("#czjg").html('请至少选择一个客户后客户！');
						});
		        		return;
		        	}
		        	var zzid = [];
		        	for(var i=0; i<sz.length; i++){
		        		zzid.push(khb2_data[sz[i]-1].CUST_ID);
		        	}
		        	var idstr=zzid.join(',');
		        	layer.confirm('确定要删除该条记录吗?', function(index){
		        		var xhrArgs2 = {
								url : basePath  + "back/delkhb2",
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
				query('#khb2Dc').on('click', function() {
					var postData = {
							"CUST_NAME":$("#findkhb2_khm").val()
						};
						url = "backExcel/findkhb2excel?postData="
							+ encodeURI(encodeURI(JSON.stringify(postData))), window.open(url)
                });
			}
		})
	});