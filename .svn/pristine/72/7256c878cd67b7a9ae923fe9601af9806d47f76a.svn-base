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
		var ywcxGrid = null, store = null;

		var columns = {
			dojoId: {label: '序号'},
			DISP_ID: {label: '业务编号'},
			CUST_NAME: {label: '客户姓名'},
			DDQY: {label: '调度区域'},
			YHQ: {label: '优惠券'},
			CUST_TEL: {label: '联系电话'},
			SZQY: {label: '所在区域', formatter:util.formatDDQY},
			ADDRESS: {label: '详细地址'},
			DISP_USER: {label: '调度员'},
			VEHI_NO: {label: '所派车辆'},
			DISP_STATE: {label: '调度状态'},
			DISP_TIME: {label: '调度时间', formatter:util.formatYYYYMMDDHHMISS},
			DISP_TYPE: {label: '约车类型'},
//			ADDRESS_REF: {label: '简明地址'},
			NOTE: {label: '附加信息'},
			DEST_ADDRESS: {label: '目的地址'},
			GSMC: {label: '公司'},
			ZDLX: {label: '终端类型'},
			ISCOMPL: {label: '是否投诉'},
			DISP_TIME: {label: '下单时间', formatter:util.formatYYYYMMDDHHMISS},
//			CUST_NUMBER: {label: '乘车人数'},
//			DIS_TYPE: {label: '距离类型'},
//			DDZT: {label: '参考地点靠近值'},
//			DDZT: {label: '是否长度'},
//			DIS_TYPE: {label: '业务类型'},
//			DDZT: {label: '积分'},
//			DDZT: {label: '积分说明'},
//			QQ_NUMBER: {label: 'QQ号码'},
			AUTOOUTPHONE: {label: '是否自动外拨', formatter:util.formatSFWB},
			OUTPHONE: {label: '外拨号码'},
			CALL_STATE: {label: '外呼状态', formatter:util.formatTZZT}
//			DDZT: {label: '分机号'},
//			CUST_VEHI_TYPE: {label: '车辆类型'},
//			DDZT: {label: '异常类型'},
//			DDZT: {label: '监控员'},
//			DDZT: {label: '驻点积分'}
		};
		var xhrArgsTabel = {
				url : basePath + "kb/queryyw",
				postData :{},
				handleAs : "json",
				Origin : self.location.origin,
				preventCache : true,
				withCredentials : true,
				load : function(data) {
					unloading();
					for (var i = 0; i < data.length; i++) {
						if(data[i].YHQ==null||data[i].YHQ=='null'){
                            data[i].YHQ='';
						}
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
					ywcxGrid.totalCount = data.length;
					ywcxGrid.set('collection', store);
					$("#ywts").html(data.length);
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
			get: function () {},
			initToolBar:function(){
				var _self = this;
				if (ywcxGrid) { ywcxGrid = null; dojo.empty('ywcxTabel') }
				ywcxGrid = new CustomGrid({ totalCount: 0, pagination: null, columns: columns,allowTextSelection: true}, "ywcxTabel");
				addEventComboBox('#ywcxPanel');
				findzdlx2().then(function(data){
					for (var i = 0; i < data.length; i++) {
						var zdlxs="<li data-value='"+data[i].SUBID+"'>"+data[i].SUB_NAME+"</li>";
						$("#ywcx-zdlx-comboBox").find('.iFList').append(zdlxs);
					}
					addEventComboBox('#ywcxPanel');
				});
				findgs().then(function(data){
					for (var i = 0; i < data.length; i++) {
						var gss="<li data-value='"+data[i].COMP_ID+"'>"+data[i].COMP_NAME+"</li>";
						$("#ssgs-comboBox").find('.iFList').append(gss);
					}
					addEventComboBox('#ywcxPanel');
				});
				$("#stime").val(setformat1(new Date(new Date().getTime() - 1000 * 60 * 60*1)));
				$("#etime").val(setformat1(new Date()));
				
				
				query('#ywcxbtn').on('click', function () {
					var postData = {};
					postData.ywbh=$("#ywbh").val();
					postData.pcch=$("#pcch").val();
					postData.zdlx=$("#ywcx-zdlx-comboBox").find('input').val();
					postData.khdh=$("#khdh").val();
					postData.ddzt=$("#ddzt-comboBox").find('input').val();
					postData.yclx=$("#yclx-comboBox").find('input').val();
					postData.khxm=$("#khxm").val();
					postData.ssgs=$("#ssgs-comboBox").find('input').val();
					postData.cllx=$("#cllx-comboBox").find('input').val();
					postData.szqy=$("#ddqy-comboBox").find('input').val();
					postData.xxdz=$("#xxdz").val();
					postData.ddygh=$("#ddygh").val();
					postData.cxgjz=$("#cxgjz").val();
					postData.whzt=$("#whzt-comboBox").find('input').attr('data-value');//$("#whzt-comboBox").find('input').val();
					postData.jkygh=$("#jkygh").val();
					postData.stime=$("#stime").val();
					postData.etime=$("#etime").val();
					postData.ddlx=$("#ddlx-comboBox").find('input').attr('data-value');
					loading('#ywcxTabel');
					dojo.xhrPost(dojo.mixin(xhrArgsTabel,{"postData":'postData='+dojo.toJson(postData)}));
				});
				
				//导出
				query('#ywcxdaochubtn').on('click', function () {
					var postData = {};
					postData.ywbh=$("#ywbh").val();
					postData.pcch=$("#pcch").val();
					postData.zdlx=$("#ywcx-zdlx-comboBox").find('input').val();
					postData.khdh=$("#khdh").val();
					postData.ddzt=$("#ddzt-comboBox").find('input').val();
					postData.yclx=$("#yclx-comboBox").find('input').val();
					postData.khxm=$("#khxm").val();
					postData.ssgs=$("#ssgs-comboBox").find('input').val();
					postData.cllx=$("#cllx-comboBox").find('input').val();
                    postData.szqy=$("#ddqy-comboBox").find('input').val();
					postData.xxdz=$("#xxdz").val();
					postData.ddygh=$("#ddygh").val();
					postData.cxgjz=$("#cxgjz").val();
					postData.whzt=$("#whzt-comboBox").find('input').attr('data-value');//$("#whzt-comboBox").find('input').val();
					postData.jkygh=$("#jkygh").val();
					postData.stime=$("#stime").val();
					postData.etime=$("#etime").val();
					postData.ddlx=$("#ddlx-comboBox").find('input').attr('data-value');
					url = basePath + "kb/queryyw_daochu?postData="
             		+ encodeURI(encodeURI(JSON.stringify(postData))), window.open(url);
				});
			}
		})
	});