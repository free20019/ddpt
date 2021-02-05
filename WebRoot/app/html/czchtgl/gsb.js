define([ "dijit/Dialog", "dgrid/Editor", "dijit/form/Button",
		"dijit/form/DateTextBox", "dijit/form/TimeTextBox",
		"dijit/form/SimpleTextarea", "dijit/form/Select",
		"dijit/form/FilteringSelect", "dgrid/OnDemandGrid",
		"dijit/form/TextBox", "app/Pagination", "dgrid/Selection",
		"dgrid/Keyboard", "dgrid/extensions/ColumnResizer",
		"dojo/store/Memory","cbtree/model/TreeStoreModel",
		"dstore/Memory","dijit/form/NumberTextBox",
		"dgrid/extensions/DijitRegistry", "dijit/registry", "dojo/dom-style",
		"dojo/_base/declare", "dojo/dom-construct", "dojo/on","dijit/tree/ObjectStoreModel", "cbtree/Tree",
		"cbtree/models/ForestStoreModel", "dojo/data/ItemFileWriteStore", "dojo/query", "app/util" ],
	function(Dialog, Editor, Button, DateTextBox, TimeTextBox,
			 SimpleTextarea, Select, FilteringSelect, Grid, TextBox,
			 Pagination, Selection, Keyboard, ColumnResizer,
			 Memory2,TreeStoreModel,
			 Memory,NumberTextBox, DijitRegistry, registry, domStyle,
			 declare, dc, on,ObjectStoreModel, Tree,
			 ForestStoreModel, ItemFileWriteStore, query, util) {
		var CustomGrid = declare([DijitRegistry, Grid, Keyboard, Selection, ColumnResizer]);
		var gsbGrid = null, store = null,count=0;
		var gsb_data;
		var columns = {
			checkbox: {label: '选择', renderCell: function (item) {
				var div = dc.create('div', {});
				dc.place(dc.create('input', {type: 'checkbox', name: 'gsb-tableCheckBox', id: item.COMP_ID, value:item.BA_ID}), div);
				return div;
			}},
			dojoId: {label: '序号'},
			OWNER_NAME: {label: '业务区块'},
			BA_NAME: {label: '公司名称'},
			COMP_NAME: {label: '分公司名称'},
			UNIT_NAME: {label: '所属分队'},
			NOTE: {label: '备注'}
		};
		var xhrArgsTabel = {
			url : basePath + "back/findgsb",
			postData : 'postData={"page":1,"pageSize":30,"COMP_NAME":'+$("#findgsb_name").val()+'}',
			handleAs : "json",
			Origin : self.location.origin,
			preventCache : true,
			withCredentials : true,
			load : function(data) {
				gsb_data = data.datas;
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
				gsbGrid.totalCount = data.count;
				gsbGrid.set('collection',store);
				gsbGrid.pagination.refresh(data.datas.length);
			
			},
			error : function(error) {
				console.log(error);
			}
		};
		var pageii = null;	
		var childCompanyHtml = function(index, hms) {
			return '<div class="childCompanyPanel" data-numId="' + (index + 1) + '">' +
				'<a href="javascript:void(0);" class="childCompanyPanel-clear">-</a>' +
				'<div class="iFInputItem">' + '<label class="iFLabel">业务区块</label>' + '<div class="iFComboBox" id="gsbEditor-ywqk' + hms + '">' + '<input type="text" class="gsbEditor-ywqk" readonly name="FGS_OWNER_NAME" data-value="" value="请选择业务区块">' + '<a href="javascript:void(0);"></a>' + '<ul class="iFList" id="gsb_ywqk' + hms + '">'  + '</ul>' + '</div>' + '</div>' +
				'<div class="iFInputItem">' + '<label class="iFLabel">分公司名称</label>' + '<div class="iFInput">' + '<input type="text" name="COMP_NAME">' + '</div>' + '</div>' +
				'<div class="iFInputItem">' + '<label class="iFLabel">所属区域</label>' + '<div class="iFInput">' + '<input type="text" name="AREA">' + '</div>' + '</div>' +
				'<div class="iFInputItem">' + '<label class="iFLabel">维修负责人</label>' + '<div class="iFInput">' + '<input type="text" name="REPAIRUSER">' + '</div>' + '</div>' +
				'<div class="iFInputItem">' + '<label class="iFLabel">所属分队</label>' + '<div class="iFInput">' + '<input type="text" name="UNIT_NAME">' + '</div>' + '</div>' +
				'<div class="iFInputItem">' + '<label class="iFLabel">区域名称</label>' + '<div class="iFComboBox" id="gsbEditor-qymc' + hms + '">' + '<input type="text" class="gsbEditor-qymc" readonly name="RE_NAME" data-value="" value="请选择业务区块">' + '<a href="javascript:void(0);"></a>' + '<ul class="iFList" id="gsb_qymc' + hms + '">'  + '</ul>' + '</div>' + '</div>' +
				'<div class="iFInputItem iFTextArea">' + '<label class="iFLabel">备注</label>' + '<div class="iFInput">' + '<textarea name="FGS_NOTE"></textarea>' + '</div>' + '</div>' +
				'</div>';
		};

		return declare( null,{
			constructor:function(){
				this.initToolBar();
				if (gsbGrid) {
					gsbGrid = null;
					dojo.empty('gsbTabel')
				}
				gsbGrid = new CustomGrid({
					totalCount : 0,
					pagination:null,
					columns : columns
				}, "gsbTabel");
				pageii = new Pagination(gsbGrid,xhrArgsTabel,{"COMP_NAME":$("#findgsb_name").val()},30);
				dc.place(pageii.first(),'gsbTabel','after');
//				this.get();
			},
			del: function (obj) {},
			add:function () {},
			update: function (json) {},
			get: function () {},
			initToolBar:function(){
				var _self = this;
//				if (gsbGrid) { gsbGrid = null; dojo.empty('gsbTabel')};
//				gsbGrid = new CustomGrid({ totalCount: 0, pagination: null, columns: columns}, 'gsbTabel');
				query('#gsbQuery').on('click', function () {
					if (gsbGrid) {
						gsbGrid = null;
						dojo.empty('gsbTabel')
					}
					gsbGrid = new CustomGrid({
						totalCount : 0,
						pagination:null,
						columns : columns
					}, "gsbTabel");
					$(".pagination").remove();
					pageii = new Pagination(gsbGrid,xhrArgsTabel,{"COMP_NAME":$("#findgsb_name").val()},30);
					dc.place(pageii.first(),'gsbTabel','after');
//					pageii.first();
				});
				query('#gsbAdd').on('click', function () {
					gsbDialogPanel.set('href', 'app/html/czchtgl/editor/gsbEditor.html');
					gsbDialog.show().then(function() {
						findqk().then(function(data){
							xlktyff("zgsb_ywqk",data.datas);
						});
						gsbDialog.set('title', '添加');
						comboboxDFun('#gsbEditorPanel');
						query('#gsbEditor-addChildCompany').on('click', function() {
							var index = $('#gsbEditor-childCompany .childCompanyPanel').length;
							var hms = new Date().getTime();
							$('#gsbEditor-childCompany').append(childCompanyHtml(index,hms));
							comboboxDFun('#gsbEditor-childCompany');
							/**
							 * 往下拉框中添加内容
							 */
							findqk().then(function(data){
								xlktyff("gsb_ywqk"+hms,data.datas);
							});
							findqy().then(function(data){
								xlktyff("gsb_qymc"+hms,data.datas);
							});

							query('.childCompanyPanel-clear').on('click', function () {
								$(this).parent().remove();
								$('#gsbEditor-childCompany .childCompanyPanel').each(function(index, item) {
									$(item).attr('data-numid', index+1);
								});	 	
							});
						});
						query('#gsbEditorPanel .iFBtnClose').on('click', function () {
							gsbDialog.hide();
						});
						query('#gsbEditorPanel .iFBtnCommit').on('click', function () {
							var FormJson = getFormJson("gsbEditorForm");
							FormJson.OWNER_ID = $("#gsbEditor-ywqk input").data('value');
							var fgs_qk=[],fgs_qy=[];
							$(".childCompanyPanel").each(function(index, item) {
								fgs_qk.push($(item).find('.gsbEditor-ywqk').data('value'));
								fgs_qy.push($(item).find('.gsbEditor-qymc').data('value'));
							});
							FormJson.FGS_OWNER_ID = fgs_qk.toString();
							FormJson.FGS_RE_ID = fgs_qy.toString();
							FormJson.COMP_NAME = FormJson.COMP_NAME.toString();
							FormJson.AREA = FormJson.AREA.toString();
							FormJson.REPAIRUSER = FormJson.REPAIRUSER.toString();
							FormJson.UNIT_NAME = FormJson.UNIT_NAME.toString();
							FormJson.FGS_NOTE = FormJson.FGS_NOTE.toString();
							var datap = JSON.stringify(FormJson);
							console.log(datap)
							var xhrArgs2 = {
									url : basePath  + "back/addgsb",
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
											gsbDialog.hide();
										})
									}
								}
								dojo.xhrPost(xhrArgs2);
						})
					});
				});

				query('#gsbUpd').on('click', function () {
					var id_array=new Array();  
					$('input[name="gsb-tableCheckBox"]:checked').each(function(){  
					    id_array.push($(this).val());//向数组中添加元素
					});
					if (id_array.length==0) {
						dijit.byId('qd_dialog').show().then(function() {
							$("#czjg").html('请选择一个公司后修改！');
						});
						return;
					}else if(id_array.length>1){
						dijit.byId('qd_dialog').show().then(function() {
							$("#czjg").html('每次只能修改一个公司！');
						});
						return;
					}
					gsbDialogPanel.set('href', 'app/html/czchtgl/editor/gsbEditor.html');
					gsbDialog.show().then(function() {
						findqk().then(function(data){
							xlktyff("zgsb_ywqk",data.datas);
						});
						gsbDialog.set('title', '修改');
						comboboxDFun('#gsbEditorPanel');
						query('#gsbEditor-addChildCompany').on('click', function() {
							var index = $('#gsbEditor-childCompany .childCompanyPanel').length;
							var hms = new Date().getTime();
							$('#gsbEditor-childCompany').append(childCompanyHtml(index,hms));
							comboboxDFun('#gsbEditor-childCompany');
							/**
							 * 往下拉框中添加内容
							 */
							findqk().then(function(data){
								xlktyff("gsb_ywqk"+hms,data.datas);
							});
							findqy().then(function(data){
								xlktyff("gsb_qymc"+hms,data.datas);
							});
							query('.childCompanyPanel-clear').on('click', function () {
								$(this).parent().remove();
								$('#gsbEditor-childCompany .childCompanyPanel').each(function(index, item) {
									$(item).attr('data-numid', index+1);
								});	 	
							})
						});
						/*
						 * 将修改内容放入弹出框内
						 * */
						var idstr=id_array.join(',');
						for(var i =0; i<gsb_data.length;i++){
							if(gsb_data[i].BA_ID==idstr){
								$("#gsb-ywqk").val(gsb_data[i].OWNER_NAME);
								$("#gsb-ywqk").attr('data-value',gsb_data[i].OWNER_ID);
								$("#gsb-gsmc").val(gsb_data[i].BA_NAME);
								$("#gsb-bz").val(gsb_data[i].NOTE);
								var xhrArgs2 = {
										url : basePath  + "back/findcompall",
										postData : {
											"ba_id" : idstr
										},
										handleAs : "json",
										Origin : self.location.origin,
										preventCache:true,
										withCredentials :  true,
										load : function(data) {
											console.log(data)
											var tab = "";
											for(var i=0; i<data.length; i++){
												tab += '<div class="childCompanyPanel" data-numId="' + (i + 1) + '">' +
												'<a href="javascript:void(0);" class="childCompanyPanel-clear">-</a>' +
												'<div class="iFInputItem">' + '<label class="iFLabel">业务区块</label>' + '<div class="iFComboBox" id="gsbEditor-ywqk' + i + '">' + '<input type="text" class="gsbEditor-ywqk" readonly name="FGS_OWNER_NAME" data-value="'+data[i].OWNER_ID+'" value="'+data[i].OWNER_NAME+'">' + '<a href="javascript:void(0);"></a>' + '<ul class="iFList" id="gsb_ywqk' + i + '">'  + '</ul>' + '</div>' + '</div>' +
												'<div class="iFInputItem">' + '<label class="iFLabel">分公司名称</label>' + '<div class="iFInput">' + '<input type="text" name="COMP_NAME" value="'+data[i].COMP_NAME+'">' + '</div>' + '</div>' +
												'<div class="iFInputItem">' + '<label class="iFLabel">所属区域</label>' + '<div class="iFInput">' + '<input type="text" name="AREA"  value="'+data[i].AREA+'">' + '</div>' + '</div>' +
												'<div class="iFInputItem">' + '<label class="iFLabel">维修负责人</label>' + '<div class="iFInput">' + '<input type="text" name="REPAIRUSER" value="'+data[i].REPAIRUSER+'">' + '</div>' + '</div>' +
												'<div class="iFInputItem">' + '<label class="iFLabel">所属分队</label>' + '<div class="iFInput">' + '<input type="text" name="UNIT_NAME" value="'+data[i].UNIT_NAME+'">' + '</div>' + '</div>' +
												'<div class="iFInputItem">' + '<label class="iFLabel">区域名称</label>' + '<div class="iFComboBox" id="gsbEditor-qymc' + i + '">' + '<input type="text" class="gsbEditor-qymc" readonly name="RE_NAME" data-value="'+data[i].RE_ID+'" value="'+data[i].RE_NAME+'">' + '<a href="javascript:void(0);"></a>' + '<ul class="iFList" id="gsb_qymc' + i + '">'  + '</ul>' + '</div>' + '</div>' +
												'<div class="iFInputItem iFTextArea">' + '<label class="iFLabel">备注</label>' + '<div class="iFInput">' + '<textarea name="FGS_NOTE">'+data[i].NOTE+'</textarea>' + '</div>' + '</div>' +
												'</div>';
											}
											$('#gsbEditor-childCompany').html(tab);
											dojo.forEach(data, function(item,index){
												var qk = "gsb_ywqk"+index;
												var qy = "gsb_qymc"+index;
												findqk().then(function(data){
													xlktyff(qk,data.datas);
												});
												findqy().then(function(data){
													xlktyff(qy,data.datas);
												});
											});
											comboboxDFun('#gsbEditor-childCompany');
										}
									}
									dojo.xhrPost(xhrArgs2);
								break;
							}
						}
						query('#gsbEditorPanel .iFBtnClose').on('click', function () {
							gsbDialog.hide();
						});
						query('#gsbEditorPanel .iFBtnCommit').on('click', function () {
							var FormJson = getFormJson("gsbEditorForm");
							FormJson.OWNER_ID = $("#gsbEditor-ywqk input").data('value');
							FormJson.BA_ID = idstr;
							var fgs_qk=[],fgs_qy=[];
							$(".childCompanyPanel").each(function(index, item) {
								fgs_qk.push($(item).find('.gsbEditor-ywqk').data('value'));
								fgs_qy.push($(item).find('.gsbEditor-qymc').data('value'));
							});
							FormJson.FGS_OWNER_ID = fgs_qk.toString();
							FormJson.FGS_RE_ID = fgs_qy.toString();
							FormJson.COMP_NAME = FormJson.COMP_NAME.toString();
							FormJson.AREA = FormJson.AREA.toString();
							FormJson.REPAIRUSER = FormJson.REPAIRUSER.toString();
							FormJson.UNIT_NAME = FormJson.UNIT_NAME.toString();
							FormJson.FGS_NOTE = FormJson.FGS_NOTE.toString();
							var datap = JSON.stringify(FormJson);
							var xhrArgs2 = {
									url : basePath  + "back/editgsb",
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
											gsbDialog.hide();
										})
									}
								}
								dojo.xhrPost(xhrArgs2);
						})
					});
				});
				query('#gsbDel').on('click', function() {
					var id_array=new Array();  
					$('input[name="gsb-tableCheckBox"]:checked').each(function(){  
					    id_array.push($(this).attr('id'));//向数组中添加元素
					});
					if (id_array.length==0) {
						dijit.byId('qd_dialog').show().then(function() {
							$("#czjg").html('请选择一个终端状态后删除！');
						});
						return;
					}
					layer.confirm('确定要删除该条记录吗?', function(index){
						var idstr=id_array.join(',');
						var xhrArgs2 = {
							url : basePath  + "back/delgsb",
							postData : {
								"comp_id" : idstr
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
				query('#gsbDc').on('click', function() {
					var postData = {
							"COMP_NAME":$("#findgsb_name").val(),
						};
						url = "backExcel/findgsbexcle?postData="
							+ encodeURI(encodeURI(JSON.stringify(postData))), window.open(url)
				});
			}
		})
	});