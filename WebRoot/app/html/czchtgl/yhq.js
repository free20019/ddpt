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
		var yhqGrid = null, store = null;
		var yhq_data;
		var fxkfsr={};
		var columns = {
            checkbox: {label: '选择',selector: 'checkbox'},
            dojoId: {label: '序号'},
            COUPON_NUM: {label: '优惠券编号'},
            DB_TIME: {label: '添加日期',formatter : util.formatYYYYMMDDHHMISS},
            START_TIME: {label: '开始日期',formatter : util.formatYYYYMMDDHHMISS},
            END_TIME: {label: '结束日期',formatter : util.formatYYYYMMDDHHMISS},
            USER: {label: '添加人'},
            IS_USE: {label: '是否使用',formatter : util.formatSFSY},
            IS_YX: {label: '是否有效',formatter : util.formatSFYX}
        };
		var xhrArgsTabel = {
			url : basePath + "back/findyhq",
			postData : 'postData={"page":1,"pageSize":30}',
			handleAs : "json",
			Origin : self.location.origin,
			preventCache : true,
			withCredentials : true,
			load : function(data) {
				yhq_data = data.datas;
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
				yhqGrid.totalCount = data.count;
				yhqGrid.set('collection', store);
				yhqGrid.pagination.refresh(data.datas.length);
				yhqGrid.on('dgrid-select', function (event) {
					fxkfsr=yhqGrid.selection;
				});
				yhqGrid.on('dgrid-deselect', function (event) {
					fxkfsr=yhqGrid.selection;
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
//				if (yhqGrid) {
//					yhqGrid = null;
//					dojo.empty('cllxbTabel')
//				}
				$('#findyhq_stime').val(util.formatYYYYMMDDHHMISS(new Date(new Date().getTime() - 1000*60*60*24*30)));
				$('#findyhq_etime').val(util.formatYYYYMMDDHHMISS(new Date()));
				if (yhqGrid) { yhqGrid.destroy(); }//dojo.destroy('zdbTabel');
                dojo.create("div", {id:'yhqTabels', innerHTML:"" },'yhqTabel');
				yhqGrid = new CustomGrid({
//					collection: store,
//					selectionMode: 'none', 
//					allowSelectAll: true,
					totalCount : 0,
					pagination:null,
					columns : columns
				}, "yhqTabels");
				pageii = new Pagination(yhqGrid,xhrArgsTabel,{"gjz":$("#findyhq_dd").val(),"stime":$("#findyhq_stime").val(),"etime":$("#findyhq_etime").val()},30);
				dc.place(pageii.first(),'yhqTabels','after');
//				this.get();
			},
			del: function (obj) {},
			add:function () {},
			update: function (json) {},
			get: function () {},
			initToolBar:function(){
//				if (yhqGrid) { yhqGrid = null; dojo.empty('cllxbTabel') }
//				yhqGrid = new CustomGrid({ totalCount: 0, pagination: null,columns: columns}, 'cllxbTabel');
				var _self = this;
				query('#yhqFind').on('click', function() {
//					if (yhqGrid) {
//						yhqGrid = null;
//						dojo.empty('cllxbTabel')
//					}
					if (yhqGrid) { yhqGrid.destroy(); }//dojo.destroy('zdbTabel');
	                dojo.create("div", {id:'yhqTabels', innerHTML:"" },'yhqTabel');
					yhqGrid = new CustomGrid({
						totalCount : 0,
						pagination:null,
						columns : columns
					}, "yhqTabels");
					$(".pagination").remove();
					pageii = new Pagination(yhqGrid,xhrArgsTabel,{"gjz":$("#findyhq_dd").val(),"stime":$("#findyhq_stime").val(),"etime":$("#findyhq_etime").val()},30);
					dc.place(pageii.first(),'yhqTabels','after');
//					pageii.first();
				});
				query('#yhqAdd').on('click', function() {
					yhqDialogPanel.set('href', 'app/html/czchtgl/editor/yhq.html');
					yhqDialog.show().then(function () {
						yhqDialog.set('title', '新增优惠券');
						$('#yhq_num').val('10');
						$('#yhq_db').val(util.formatYYYYMMDDHHMISS(new Date()));
						$('#yhq_st').val(util.formatYYYYMMDDHHMISS(new Date()));
						$('#yhq_et').val(util.formatYYYYMMDDHHMISS(new Date(new Date().getTime() + 1000*60*60*24*30)));
						query('.yhq-iFBtnCommit').on('click', function() {
                        	var FormJson = getFormJson("yhqEditorForm");
                        	var reg = /^[0-9]{1,5}$/;
                    		if(!reg.test(FormJson.YHQ_NUM)){
                    			dijit.byId('qd_dialog').show().then(function() {
        							$("#czjg").html('优惠券数量只能是数字且不能为空！');
        						});
        		        		return;
                    		}
                        	var datap = JSON.stringify(FormJson);
                        	var xhrArgs2 = {
									url : basePath  + "back/addyhq",
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
											yhqDialog.hide();
										})
									}
								}
								dojo.xhrPost(xhrArgs2);
                        });
                        query('.yhq-iFBtnClose').on('click', function() {
                        	yhqDialog.hide();
                        });
					})
				});
				query('#yhqSy').on('click', function() {
                	var sz=[];
		        	for(var id in fxkfsr){
		        		if(fxkfsr[id]){
		        			sz.push(id);
		        		}
		        	}
		        	if(sz.length==0){
		        		dijit.byId('qd_dialog').show().then(function() {
							$("#czjg").html('请至少选择一条记录！');
						});
		        		return;
		        	}
		        	var zzid = [];
		        	for(var i=0; i<sz.length; i++){
		        		zzid.push(yhq_data[sz[i]-1].ID);
		        	}
		        	var idstr=zzid.join(',');
		        	layer.confirm('确定要设置为使用吗?', function(index){
		        		var xhrArgs2 = {
								url : basePath  + "back/issy",
								postData : {
									"id" : idstr,
									"issy" : 1
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
				query('#yhqWsy').on('click', function() {
                	var sz=[];
		        	for(var id in fxkfsr){
		        		if(fxkfsr[id]){
		        			sz.push(id);
		        		}
		        	}
		        	if(sz.length==0){
		        		dijit.byId('qd_dialog').show().then(function() {
							$("#czjg").html('请至少选择一条记录！');
						});
		        		return;
		        	}
		        	var zzid = [];
		        	for(var i=0; i<sz.length; i++){
		        		zzid.push(yhq_data[sz[i]-1].ID);
		        	}
		        	var idstr=zzid.join(',');
		        	layer.confirm('确定要设置为未使用吗?', function(index){
		        		var xhrArgs2 = {
								url : basePath  + "back/issy",
								postData : {
									"id" : idstr,
									"issy" : 0
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
				query('#yhqDel').on('click', function() {
                	var sz=[];
		        	for(var id in fxkfsr){
		        		if(fxkfsr[id]){
		        			sz.push(id);
		        		}
		        	}
		        	if(sz.length==0){
		        		dijit.byId('qd_dialog').show().then(function() {
							$("#czjg").html('请至少选择一条记录后删除！');
						});
		        		return;
		        	}
		        	var zzid = [];
		        	for(var i=0; i<sz.length; i++){
		        		zzid.push(yhq_data[sz[i]-1].ID);
		        	}
		        	var idstr=zzid.join(',');
		        	layer.confirm('确定要删除该条记录吗?', function(index){
		        		var xhrArgs2 = {
								url : basePath  + "back/delyhq",
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
				query('#yhqDc').on('click', function() {
					var postData = {
							"gjz":$("#findyhq_dd").val(),
							"stime":$("#findyhq_stime").val(),
							"etime":$("#findyhq_etime").val()
						};
						url = "backExcel/findyhqexcel?postData="
							+ encodeURI(encodeURI(JSON.stringify(postData))), window.open(url)
                });
			}
		})
	});