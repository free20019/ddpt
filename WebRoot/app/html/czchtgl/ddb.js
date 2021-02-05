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
		var ddbGrid = null, store = null;
		var ddb_data;
		var fxkfsr={};
		var queryData = {"STIME":$("#ddb-kssj").val(),
				"ETIME":$("#ddb-jssj").val(),
				"CUST_NAME":$("#ddb-khmc").val(),
				"CUST_TEL":$("#ddb-khdh").val(),
				"ADDRESS_REF":$("#ddb-ckdz").val(),
				"ADDRESS":$("#ddb-xxmc").val(),
				"DISP_TYPE":$("#ddb-ddlx").val()};
		var columns = {
			checkbox: {label: '选择',selector: 'checkbox'},
			dojoId: {label: '序号'},
			CI_ID: {label: '客户编号'},
			CUST_NAME: {label: '客户名'},
			DISP_TYPE: {label: '调度类型'},
			CUST_TEL: {label: '客户电话'},
			ADDRESS_REF: {label: '参考地址'},
			ADDRESS: {label: '详细地址'},
			VEHI_NUM: {label: '叫车数量'},
			DEST_ADDRESS: {label: '目的地'},
			VEHI_NO: {label: '派车车号'},
			SIM_NUM: {label: 'SIM卡号'},
			COMP_NAME: {label: '所属公司'},
			DISP_STATE: {label: '调度状态'},
			DISP_USER: {label: '调度员编号'},
			DISP_TIME: {label: '调度时间',format:util.formatYYYYMMDDHHMISS},
			NOTE: {label: '备注'}
		};
		var xhrArgsTabel = {
			url : basePath + "back/findddb",
			postData : 'postData={"page":1,"pageSize":30}',
			handleAs : "json",
			Origin : self.location.origin,
			preventCache : true,
			withCredentials : true,
			load : function(data) {
				ddb_data = data.datas;
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
				ddbGrid.totalCount = data.count;
				ddbGrid.set('collection', store);
				ddbGrid.pagination.refresh(data.datas.length);
				ddbGrid.on('dgrid-select', function (event) {
					fxkfsr=ddbGrid.selection;
				});
				ddbGrid.on('dgrid-deselect', function (event) {
					fxkfsr=ddbGrid.selection;
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
//				if (ddbGrid) {
//					ddbGrid = null;
//					dojo.empty('ddbTabel')
//				}
				if (ddbGrid) { ddbGrid.destroy(); }//dojo.destroy('zdbTabel');
                dojo.create("div", {id:'ddbTabels', innerHTML:"",class:"ddbTabels" },'ddbTabel')
				ddbGrid = new CustomGrid({
//					collection: store,
//					selectionMode: 'none', 
//					allowSelectAll: true,
					totalCount : 0,
					pagination:null,
					columns : columns
				}, "ddbTabels");
				pageii = new Pagination(ddbGrid,xhrArgsTabel,queryData,30);
				dc.place(pageii.first(),'ddbTabels','after');
//				this.get();
			},
			del: function (obj) {},
			add:function () {},
			update: function (json) {},
			get: function () {},
			initToolBar:function(){
//				if (ddbGrid) { ddbGrid = null; dojo.empty('ddbTabel') }
//				ddbGrid = new CustomGrid({ totalCount: 0, pagination: null,columns: columns}, 'ddbTabel');
				var _self = this;
				query('#ddbFind').on('click', function() {
					queryData = {"STIME":$("#ddb-kssj").val(),
							"ETIME":$("#ddb-jssj").val(),
							"CUST_NAME":$("#ddb-khmc").val(),
							"CUST_TEL":$("#ddb-khdh").val(),
							"ADDRESS_REF":$("#ddb-ckdz").val(),
							"ADDRESS":$("#ddb-xxmc").val(),
							"DISP_TYPE":$("#ddb-ddlx").val()};
//					if (ddbGrid) {
//						ddbGrid = null;
//						dojo.empty('ddbTabel')
//					}
					if (ddbGrid) { ddbGrid.destroy(); }//dojo.destroy('zdbTabel');
	                dojo.create("div", {id:'ddbTabels', innerHTML:"" },'ddbTabel')
					ddbGrid = new CustomGrid({
						totalCount : 0,
						pagination:null,
						columns : columns
					}, "ddbTabels");
					$(".pagination").remove();
					pageii = new Pagination(ddbGrid,xhrArgsTabel,queryData,30);
					dc.place(pageii.first(),'ddbTabels','after');
//					pageii.first();
				});
				query('#ddbUpd').on('click', function() {
					var sz=[];
		        	for(var id in fxkfsr){
		        		if(fxkfsr[id]){
		        			sz.push(id);
		        		}
		        	}
		        	if(sz.length==0){
		        		dijit.byId('qd_dialog').show().then(function() {
							$("#czjg").html('请选择一个调度信息后修改！');
						});
		        		return;
		        	}
		        	if(sz.length>1){
		        		dijit.byId('qd_dialog').show().then(function() {
							$("#czjg").html('每次只能修改一个调度信息！');
						});
		        		return;
		        	}
		        	ddbDialogPanel.set('href', 'app/html/czchtgl/editor/ddbEditor.html');
		        	ddbDialog.show().then(function () {
		        		ddbDialog.set('title', '编辑调度信息');
								/*query('.iFComboBox').on('click', function () {
									var thisOne = this;
									if ($(this).hasClass('selected')) {
										$(this).removeClass('selected');
									} else {
										$(this).addClass('selected');
										$(this).find('.iFList').on('click', function () {
											event.stopPropagation();
										}).find('li').off('click').on('click', function () {
											$(this).addClass('selected').siblings('.selected').removeClass('selected');
											$(thisOne).find('input').data('value', $(this).data('value')).val($(this).text()).end().removeClass('selected');
											$(thisOne).find('input').trigger('change');
										});
									}
								});*/
								addEventComboBox('#cldEditorPanel');
		        		$("#x-ddb-ddybh").val(ddb_data[sz[0]-1].DISP_USER);
		        		$("#x-ddb-pcch").val(ddb_data[sz[0]-1].VEHI_NO);
		        		$("#x-ddb-khxm").val(ddb_data[sz[0]-1].CUST_NAME);
		        		$("#x-ddb-khdh").val(ddb_data[sz[0]-1].CUST_TEL);
		        		$("#x-ddb-xxdz").val(ddb_data[sz[0]-1].ADDRESS);
		        		$("#x-ddb-ckdz").val(ddb_data[sz[0]-1].ADDRESS_REF);
		        		$("#x-ddb-ddzt").val(ddb_data[sz[0]-1].DISP_STATE);//
		        		$("#x-ddb-jcsl").val(ddb_data[sz[0]-1].VEHI_NUM);
		        		$("#x-ddb-ywbh").val(ddb_data[sz[0]-1].DISP_ID);//
		        		$("#x-ddb-mdd").val(ddb_data[sz[0]-1].DEST_ADDRESS);
		        		$("#x-ddb-ddsj").val(setformat1(new Date(ddb_data[sz[0]-1].DISP_TIME)));//
		        		$("#x-ddb-sfct").val(ddb_data[sz[0]-1].ISLONG);
		        		$("#x-ddb-bz").val(ddb_data[sz[0]-1].NOTE);
                        query('.ddb-iFBtnCommit').on('click', function() {
                        	var FormJson = getFormJson("ddbEditorForm");
//                        	if(FormJson.VT_NAME.length==0){
//                        		dijit.byId('qd_dialog').show().then(function() {
//        							$("#czjg").html('车牌类型不能为空！');
//        						});
//        		        		return;
//                        	}
                        	FormJson.DISP_ID = ddb_data[sz[0]-1].DISP_ID;
                        	FormJson.STIME = $("#ddb-kssj").val();
                        	var datap = JSON.stringify(FormJson);
                        	var xhrArgs2 = {
									url : basePath  + "back/editddb",
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
											ddbDialog.hide();
										})
									}
								}
								dojo.xhrPost(xhrArgs2);
                        });
                        query('.ddb-iFBtnClose').on('click', function() {
                        	ddbDialog.hide();
                        });
                    });
				});
				query('#ddbDel').on('click', function() {
                	var sz=[];
		        	for(var id in fxkfsr){
		        		if(fxkfsr[id]){
		        			sz.push(id);
		        		}
		        	}
		        	if(sz.length==0){
		        		dijit.byId('qd_dialog').show().then(function() {
							$("#czjg").html('请至少选择一个调度信息后删除！');
						});
		        		return;
		        	}
		        	var zzid = [];
		        	var stime = "";
		        	for(var i=0; i<sz.length; i++){
		        		zzid.push(ddb_data[sz[i]-1].DISP_ID);
		        		stime = setformat1(new Date(ddb_data[sz[i]-1].DISP_TIME));
		        	}
		        	var idstr=zzid.join(',');
		        	layer.confirm('确定要删除该条记录吗?', function(index){
		        		var xhrArgs2 = {
								url : basePath  + "back/delddb",
								postData : {
									"id" : idstr,
									"stime" : stime
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
				query('#ddbDc').on('click', function() {
					var postData = {
							"STIME":$("#ddb-kssj").val(),
							"ETIME":$("#ddb-jssj").val(),
							"CUST_NAME":$("#ddb-khmc").val(),
							"CUST_TEL":$("#ddb-khdh").val(),
							"ADDRESS_REF":$("#ddb-ckdz").val(),
							"ADDRESS":$("#ddb-xxmc").val(),
							"DISP_TYPE":$("#ddb-ddlx").val()
						};
						url = "backExcel/findddbexcle?postData="
							+ encodeURI(encodeURI(JSON.stringify(postData))), window.open(url)
                });
			}
		})
	});