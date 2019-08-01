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
		var sjbGrid = null, store = null;
		var sjb_data;
		var fxkfsr={};
		var columns = {
            checkbox: {label: '选择',selector: 'checkbox'},
            dojoId: {label: '序号'},
            COMP_NAME: {label: '公司'},
            VEHI_NO: {label: '车号'},
            NAME: {label: '司机姓名'},
            PHONE: {label: '联系电话'},
            RLLX: {label: '燃料类型'},
            VT_NAME: {label: '车型'},
            NOTE: {label: '备注'}
        };
		var xhrArgsTabel = {
			url : basePath + "back/findsjb",
			postData : 'postData={"page":1,"pageSize":30}',
			handleAs : "json",
			Origin : self.location.origin,
			preventCache : true,
			withCredentials : true,
			load : function(data) {
				sjb_data = data.datas;
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
				sjbGrid.totalCount = data.count;
				sjbGrid.set('collection', store);
				sjbGrid.pagination.refresh(data.datas.length);
				sjbGrid.on('dgrid-select', function (event) {
					fxkfsr=sjbGrid.selection;
				});
				sjbGrid.on('dgrid-deselect', function (event) {
					fxkfsr=sjbGrid.selection;
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
//				if (sjbGrid) {
//					sjbGrid = null;
//					dojo.empty('cllxbTabel')
//				}
				$('#findsjb_stime').val(util.formatYYYYMMDDHHMISS(new Date(new Date().getTime() - 1000*60*60*24*30)));
				$('#findsjb_etime').val(util.formatYYYYMMDDHHMISS(new Date()));
				if (sjbGrid) { sjbGrid.destroy(); }//dojo.destroy('zdbTabel');
                dojo.create("div", {id:'sjbTabels', innerHTML:"" },'sjbTabel');
				sjbGrid = new CustomGrid({
//					collection: store,
//					selectionMode: 'none', 
//					allowSelectAll: true,
					totalCount : 0,
					pagination:null,
					columns : columns
				}, "sjbTabels");
				pageii = new Pagination(sjbGrid,xhrArgsTabel,{"gjz":$("#findsjb_dd").val()},30);
				dc.place(pageii.first(),'sjbTabels','after');
//				this.get();
			},
			del: function (obj) {},
			add:function () {},
			update: function (json) {},
			get: function () {},
			initToolBar:function(){
//				if (sjbGrid) { sjbGrid = null; dojo.empty('cllxbTabel') }
//				sjbGrid = new CustomGrid({ totalCount: 0, pagination: null,columns: columns}, 'cllxbTabel');
				var _self = this;
				query('#sjbFind').on('click', function() {
//					if (sjbGrid) {
//						sjbGrid = null;
//						dojo.empty('cllxbTabel')
//					}
					if (sjbGrid) { sjbGrid.destroy(); }//dojo.destroy('zdbTabel');
	                dojo.create("div", {id:'sjbTabels', innerHTML:"" },'sjbTabel');
					sjbGrid = new CustomGrid({
						totalCount : 0,
						pagination:null,
						columns : columns
					}, "sjbTabels");
					$(".pagination").remove();
					pageii = new Pagination(sjbGrid,xhrArgsTabel,{"gjz":$("#findsjb_dd").val()},30);
					dc.place(pageii.first(),'sjbTabels','after');
//					pageii.first();
				});
				query('#sjbAdd').on('click', function() {
					sjbDialogPanel.set('href', 'app/html/czchtgl/editor/sjbWditor.html');
					sjbDialog.show().then(function () {
					sjbDialog.set('title', '新增司机表');
					 $("#sjb_cphm").on('keyup',function(){
							if($("#sjb_cphm").val().length == 7){
								var xhrArgs2 = {
									url : basePath  + "back/findvhic",
									postData : {
										'cphm' : $("#sjb_cphm").val()
									},
									handleAs : "json",
									Origin : self.location.origin,
									preventCache:true,
									withCredentials :  true,
									load : function(data) {
										if(data.length>0){
											$('#sjb_compname').val(data[0].COMP_NAME);
											$('#sjb_cx').val(data[0].VT_NAME);
											$('#sjb_rllx').val(data[0].RLLX);
										}else{
											dijit.byId('qd_dialog').show().then(function() {
			        							$("#czjg").html('没有该车牌号码的车辆！');
			        						});
										}
									}
								}
								dojo.xhrPost(xhrArgs2);
							}
	    				});
						query('.sjb-iFBtnCommit').on('click', function() {
                        	var FormJson = getFormJson("sjbEditorForm");
                    		if($("#sjb_cphm").val().length != 7){
                    			dijit.byId('qd_dialog').show().then(function() {
        							$("#czjg").html('车牌号码不正确！');
        						});
        		        		return;
                    		}
                    		if($("#sjb_name").val().length == ''){
                    			dijit.byId('qd_dialog').show().then(function() {
        							$("#czjg").html('司机姓名不能为空！');
        						});
        		        		return;
                    		}
                    		if($("#sjb_phone").val().length == ''){
                    			dijit.byId('qd_dialog').show().then(function() {
        							$("#czjg").html('联系电话不能为空！');
        						});
        		        		return;
                    		}
                        	var datap = JSON.stringify(FormJson);
                        	var xhrArgs2 = {
									url : basePath  + "back/addsjb",
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
											sjbDialog.hide();
										})
									}
								}
								dojo.xhrPost(xhrArgs2);
                        });
                        query('.sjb-iFBtnClose').on('click', function() {
                        	sjbDialog.hide();
                        });
					})
				});
				query('#sjbEdit').on('click', function() {
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
					sjbDialogPanel.set('href', 'app/html/czchtgl/editor/sjbWditor.html');
					sjbDialog.show().then(function () {
		        	sjbDialog.set('title', '修改司机表');
		        	$('#sjb_name').val(sjb_data[sz[0]-1].NAME);
		        	$('#sjb_phone').val(sjb_data[sz[0]-1].PHONE);
		        	$('#sjb_cphm').val(sjb_data[sz[0]-1].VEHI_NO);
		        	$('#qkb_bz').text(sjb_data[sz[0]-1].NOTE);
					$('#sjb_compname').val(sjb_data[sz[0]-1].COMP_NAME);
					$('#sjb_cx').val(sjb_data[sz[0]-1].VT_NAME);
					$('#sjb_rllx').val(sjb_data[sz[0]-1].RLLX);
					 $("#sjb_cphm").on('keyup',function(){
							if($("#sjb_cphm").val().length == 7){
								var xhrArgs2 = {
									url : basePath  + "back/findvhic",
									postData : {
										'cphm' : $("#sjb_cphm").val()
									},
									handleAs : "json",
									Origin : self.location.origin,
									preventCache:true,
									withCredentials :  true,
									load : function(data) {
										if(data.length>0){
											$('#sjb_compname').val(data[0].COMP_NAME);
											$('#sjb_cx').val(data[0].VT_NAME);
											$('#sjb_rllx').val(data[0].RLLX);
										}else{
											dijit.byId('qd_dialog').show().then(function() {
			        							$("#czjg").html('没有该车牌号码的车辆！');
												$('#sjb_compname').val('');
												$('#sjb_cx').val('');
												$('#sjb_rllx').val('');
			        							return;
			        						});
										}
									}
								}
								dojo.xhrPost(xhrArgs2);
							}
	    				});
					 query('.sjb-iFBtnCommit').on('click', function() {
                     	var FormJson = getFormJson("sjbEditorForm");
                 		if($("#sjb_cphm").val().length != 7){
                 			dijit.byId('qd_dialog').show().then(function() {
     							$("#czjg").html('车牌号码不正确！');
     						});
     		        		return;
                 		}
                 		if($("#sjb_name").val().length == ''){
                 			dijit.byId('qd_dialog').show().then(function() {
     							$("#czjg").html('司机姓名不能为空！');
     						});
     		        		return;
                 		}
                 		if($("#sjb_phone").val().length == ''){
                 			dijit.byId('qd_dialog').show().then(function() {
     							$("#czjg").html('联系电话不能为空！');
     						});
     		        		return;
                 		}
                 		FormJson.ID = sjb_data[sz[0]-1].ID;
                     	var datap = JSON.stringify(FormJson);
                     	var xhrArgs2 = {
									url : basePath  + "back/editsjb",
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
											sjbDialog.hide();
										})
									}
								}
								dojo.xhrPost(xhrArgs2);
                     });
                     query('.sjb-iFBtnClose').on('click', function() {
                     	sjbDialog.hide();
                     });
					});
                });
				query('#sjbDel').on('click', function() {
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
		        		zzid.push(sjb_data[sz[i]-1].ID);
		        	}
		        	var idstr=zzid.join(',');
		        	layer.confirm('确定要删除该条记录吗?', function(index){
		        		var xhrArgs2 = {
								url : basePath  + "back/delsjb",
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
				query('#sjbDc').on('click', function() {
					var postData = {
							"gjz":$("#findsjb_dd").val()
						};
						url = "backExcel/findsjbexcel?postData="
							+ encodeURI(encodeURI(JSON.stringify(postData))), window.open(url)
                });
			}
		})
	});