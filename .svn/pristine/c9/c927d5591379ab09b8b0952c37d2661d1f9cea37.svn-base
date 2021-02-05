define([ "dijit/Dialog", "dgrid/Editor", "dijit/form/Button",
		"dijit/form/DateTextBox", "dijit/form/TimeTextBox",
		"dijit/form/SimpleTextarea", "dijit/form/Select",
		"dijit/form/FilteringSelect", "dgrid/OnDemandGrid",
		"dijit/form/TextBox", "app/Pagination1", "dgrid/Selection",
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
		var clcxGrid = null, store = null;

		var columns = {
			dojoId: {label: '序号'},
			OWNER_NAME: {label: '业务区块'},
			COMP_NAME: {label: '分公司'},
			VEHI_NO: {label: '车牌号码'},
			VEHI_SIM: {label: 'SIM卡号'},
			OWN_NAME: {label: '车主姓名'},
			OWN_TEL: {label: '车主电话'},
			HOME_TEL: {label: '白班电话'},
			NIGHT_TEL: {label: '晚班电话'},
			MDT_NO: {label: '终端号'},
			VEHI_NUM: {label: '车号'},
			MT_NAME: {label: '终端名'},
			MDT_SUB_TYPE: {label: '终端子类型'},
			VT_NAME: {label: '车型'},
			VSIM_NUM: {label: '虚拟卡号'},
			DISP_TYPE: {label: '调度类型'},
			QRY_PWD: {label: '查询密码'},
			INST_TIME: {label: '安装时间',formatter:util.formatYYYYMMDDHHMISS},
			INST_MAN: {label: '安装人员'},
			INST_POSITION: {label: '主机安装位置'},
			LCD_INST_POSITION: {label: 'LCD安装位置'},
			ELEC_TYPE: {label: '电源类型'},
			TALK_FUNC: {label: '有无通话功能'},
			SIM_TIME: {label: '开通时间',formatter:util.formatYYYYMMDDHHMISS},
			NOTE: {label: '备注'},
			DISP_NUM: {label: '调度总数'},
			COMPL_NUM: {label: '投诉总数'},
			INTEGRAL: {label: '积分'},
			INTEGRALYANGZHAO: {label: '驻点积分'}
		};
		var xhrArgsTabel = {
				url : basePath + "kb/querycl",
				postData :{},
				handleAs : "json",
				Origin : self.location.origin,
				preventCache : true,
				withCredentials : true,
				load : function(data) {
					unloading();
					for (var i = 0; i < data.data.length; i++) {
						data.data[i] = dojo.mixin({
							dojoId : i + 1
						}, data.data[i]);
					}
					store = new Memory({
						data : {
							identifier : 'dojoId',
							label : 'dojoId',
							items : data.data
						}
					});
					clcxGrid.totalCount = data.count;
					clcxGrid.set('collection', store);
					$("#clts").html(data.data.length);
//					clcxGrid.pagination.refresh(data.data.length);
				},
				error : function(error) {
					console.log(error);
				}
			};
		return declare( null,{
			constructor:function(){
				this.initToolBar();
			},
			initToolBar:function(){
				var _self = this;
				if (clcxGrid) { clcxGrid = null; dojo.empty('clcxTabel') }
				clcxGrid = new CustomGrid({ totalCount: 0, pagination: null, columns: columns,allowTextSelection: true}, "clcxTabel");
				// query('.iFComboBox').on('click', function () {
				// 	var thisOne = this;
				// 	if ($(this).hasClass('selected')) {
				// 		$(this).removeClass('selected');
				// 	} else {
				// 		$(this).addClass('selected');
				// 		$(this).find('.iFList').on('click', function () {
				// 			event.stopPropagation();
				// 		}).find('li').off('click').on('click', function () {
				// 			$(this).addClass('selected').siblings('.selected').removeClass('selected');
				// 			$(thisOne).find('input').data('value', $(this).data('value')).val($(this).text()).end().removeClass('selected');
				// 			$(thisOne).find('input').trigger('change');
				// 		});
				// 	}
				// });
				addEventComboBox('#clcxPanel');
				
				//业务区块
				findywqk().then(function(data){
					for (var i = 0; i < data.length; i++) {
						var ywqks="<li data-value='"+data[i].OWNER_ID+"'>"+data[i].OWNER_NAME+"</li>";
						$("#clcx-car-comboBox").find('.iFList').append(ywqks);
					}
					addEventComboBox('#clcxPanel');
				});
				//终端类型
				findzdlx2().then(function(data){
					for (var i = 0; i < data.length; i++) {
						var zdlxs="<li data-value='"+data[i].SUB_NAME+"'>"+data[i].SUB_NAME+"</li>";
						$("#clcx-zdlx-comboBox").find('.iFList').append(zdlxs);
					}
					addEventComboBox('#clcxPanel');
				});
				//车辆类型
				findcx2().then(function(data){
					for (var i = 0; i < data.length; i++) {
						var cxs="<li data-value='"+data[i].VT_ID+"'>"+data[i].VT_NAME+"</li>";
						$("#clcx-cx-comboBox").find('.iFList').append(cxs);
					}
					addEventComboBox('#clcxPanel');
				});
				//公司
				findgs3().then(function(data){
					for (var i = 0; i < data.length; i++) {
						var gss="<li data-value='"+data[i].COMP_ID+"'>"+data[i].COMP_NAME+"</li>";
						$("#clcx-gs-comboBox").find('.iFList').append(gss);
					}
					addEventComboBox('#clcxPanel');
					$("#clcx-gs-comboBox").find('input').on('change',function(){
						//sim卡
//						alert($("#clcx-gs-comboBox").find('input').data('value'));
						if($("#clcx-gs-comboBox").find('input').data('value')!=""){
						$("#clcx-simkh-comboBox").find('.iFList').html("");
						findsimka($("#clcx-gs-comboBox").find('input').data('value')).then(function(data2){
							for (var i = 0; i < data2.length; i++) {
								var simkas="<li data-value='"+data2[i].SIM_NUM+"'>"+data2[i].SIM_NUM+"</li>";
								$("#clcx-simkh-comboBox").find('.iFList').append(simkas);
							}
							addEventComboBox('#clcxPanel');
						});
						//车牌
						$("#clcx-cphm-comboBox").find('.iFList').html("");
						findcphm($("#clcx-gs-comboBox").find('input').data('value')).then(function(data2){
							for (var i = 0; i < data2.length; i++) {
								var cphms="<li data-value='"+data2[i].VEHI_NO+"'>"+data2[i].VEHI_NO+"</li>";
								$("#clcx-cphm-comboBox").find('.iFList').append(cphms);
							}
							addEventComboBox('#clcxPanel');
						});
						//虚拟卡号
//						$("#clcx-xnkh-comboBox").find('.iFList').html("");
//						findxnkh($("#clcx-gs-comboBox").find('input').data('value')).then(function(data2){
//							for (var i = 0; i < data2.length; i++) {
//								var cxs="<li data-value='"+data2[i].VSIM_NUM+"'>"+data2[i].VSIM_NUM+"</li>";
//								$("#clcx-xnkh-comboBox").find('.iFList').append(cxs);
//							}
//						});
						}
					});
				});
				//
				
				$("#clcx-cphm-comboBox").find('input').on('keyup',function(){
					var cpmhs=$("#clcx-cphm-comboBox").find('input').val();
					if(cpmhs.length>2&&cpmhs!="浙AT"&&cpmhs!="浙A"){
						findddcphm(cpmhs).then(function(data2){
							$("#clcx-cphm-comboBox").find('.iFList').html("");
							for (var i = 0; i < data2.length; i++) {
								var cphms="<li data-value='"+data2[i].CPHM+"'>"+data2[i].CPHM+"</li>";
								$("#clcx-cphm-comboBox").find('.iFList').append(cphms);
							}
							addEventComboBox('#clcxPanel');
//							$('#clcx-cphm-comboBox').find('.iFList').on('click', function () {
//								if (event.stopPropagation){event.stopPropagation();}else if (window.event) {window.event.cancelBubble = true;}
//							}).find('li').off('click').on('click', function () {
//								$(this).addClass('selected').siblings('.selected').removeClass('selected');
//								$("#clcx-cphm-comboBox").find('input').data('value', $(this).data('value')).val($(this).text()).end().removeClass('selected');
//							});
						});
					}
				});
				query('#clcxbtn').on('click', function () {
					var postData = {};
					postData.ywqk=$("#clcx-car-comboBox").find('input').val();//$("#clcx-car-comboBox").find('input').data('value')==undefined?"":$("#clcx-car-comboBox").find('input').data('value');
					postData.zdlx=$("#clcx-zdlx-comboBox").find('input').val();//.find('input').data('value')==undefined?"":$("#clcx-zdlx-comboBox").find('input').data('value');
					postData.cllx=$("#clcx-cx-comboBox").find('input').val();//.find('input').data('value')==undefined?"":$("#clcx-cx-comboBox").find('input').data('value');
					postData.gs=$("#clcx-gs-comboBox").find('input').val();//.find('input').data('value')==undefined?"":$("#clcx-gs-comboBox").find('input').data('value');
					postData.simka=$("#clcx-simkh-comboBox").find('input').val();
					postData.gjz=$("#clcx-clgjz").val();
					postData.cp=$("#clcx-cphm-comboBox").find('input').val();
//					postData.xnk=$("#clcx-xnkh-comboBox").find('input').val();
					loading('#clcxTabel');
					dojo.xhrPost(dojo.mixin(xhrArgsTabel,{"postData":'postData='+dojo.toJson(postData)}));
				});
				
				query('#clcxdcbtn').on('click', function () {
					var postData = {};
					postData.ywqk=$("#clcx-car-comboBox").find('input').val();//$("#clcx-car-comboBox").find('input').data('value')==undefined?"":$("#clcx-car-comboBox").find('input').data('value');
					postData.zdlx=$("#clcx-zdlx-comboBox").find('input').val();//.find('input').data('value')==undefined?"":$("#clcx-zdlx-comboBox").find('input').data('value');
					postData.cllx=$("#clcx-cx-comboBox").find('input').val();//.find('input').data('value')==undefined?"":$("#clcx-cx-comboBox").find('input').data('value');
					postData.gs=$("#clcx-gs-comboBox").find('input').val();//.find('input').data('value')==undefined?"":$("#clcx-gs-comboBox").find('input').data('value');
					postData.simka=$("#clcx-simkh-comboBox").find('input').val();
					postData.gjz=$("#clcx-clgjz").val();
					postData.cp=$("#clcx-cphm-comboBox").find('input').val();
					url = basePath + "kb/querycl_daochu?postData="
             		+ encodeURI(encodeURI(JSON.stringify(postData))), window.open(url);
				});
			}
		})
	});