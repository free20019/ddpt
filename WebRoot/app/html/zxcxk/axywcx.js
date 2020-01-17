define(["dijit/Dialog", "dgrid/Editor", "dijit/form/Button",
			"dijit/form/DateTextBox", "dijit/form/TimeTextBox",
			"dijit/Menu",
			"dijit/MenuItem",
			"dijit/CheckedMenuItem",
			"dijit/MenuSeparator",
			"dijit/PopupMenuItem",
			"dijit/form/SimpleTextarea", "dijit/form/Select",
			"dijit/form/FilteringSelect", "dgrid/OnDemandGrid",
			"dijit/form/TextBox", "app/Pagination1", "dgrid/Selection", 'dgrid/Selector',
			"dgrid/Keyboard", "dgrid/extensions/ColumnResizer",
			"dojo/store/Memory", "cbtree/model/TreeStoreModel",
			"dstore/Memory", "dijit/form/NumberTextBox",
			"dgrid/extensions/DijitRegistry", "dijit/registry", "dojo/dom-style",
			"dojo/_base/declare", "dojo/dom-construct", "dojo/on", "dijit/tree/ObjectStoreModel", "cbtree/Tree",
			"cbtree/models/ForestStoreModel", "dojo/data/ItemFileWriteStore", "dojo/query", "app/util"],
		function (Dialog, Editor, Button, DateTextBox, TimeTextBox,
							Menu, MenuItem, CheckedMenuItem, MenuSeparator, PopupMenuItem,
							SimpleTextarea, Select, FilteringSelect, Grid, TextBox,
							Pagination, Selection, Selector, Keyboard, ColumnResizer,
							Memory2, TreeStoreModel,
							Memory, NumberTextBox, DijitRegistry, registry, domStyle,
							declare, dc, on, ObjectStoreModel, Tree,
							ForestStoreModel, ItemFileWriteStore, query, util) {
		var CustomGrid = declare([DijitRegistry, Grid, Keyboard, Selection, ColumnResizer, Selector]);
		var ywcxGrid = null, store = null;

		var columns = {
			checkbox: {label: '选择', selector: 'checkbox'},
			dojoId: {label: '序号'},
			DB_TIME: {label: '生成时间', formatter:util.formatYYYYMMDDHHMISS},
			CUST_NAME: {label: '客户姓名'},
			CUST_TEL: {label: '联系电话'},
			DDQY: {label: '调度区域'},
			ADDRESS: {label: '详细地址'},
			DEST_ADDRESS: {label: '目的地址'},
			DISP_TIME: {label: '用车时间', formatter:util.formatYYYYMMDDHHMISS},
			VEHI_NO1: {label: '所派车辆1'},
			SJDH1: {label:'司机联系方式1'},
			SIM_NUM1: {label: 'SIM卡1'},
			COMP_NAME1: {label: '所属公司1'},
			VEHI_NO2: {label: '所派车辆2'},
			SJDH2: {label:'司机联系方式2'},
			SIM_NUM2: {label: 'SIM卡2'},
			COMP_NAME2: {label: '所属公司2'},
			VEHI_NO3: {label: '所派车辆3'},
			SJDH3: {label:'司机联系方式3'},
			SIM_NUM3: {label: 'SIM卡3'},
			COMP_NAME3: {label: '所属公司3'},
			YCMS: {label: '用车模式'},
			TSRQ: {label: '特殊人群'},
			PTQK: {label: '陪同情况'},
			YCXQ: {label: '用车需求'},
			NOTE: {label: '附加信息'},

			// YHQ: {label: '优惠券'},
			SZQY: {label: '所在区域', formatter:util.formatDDQY},
			DISP_ID: {label: '业务编号'},
			DISP_USER: {label: '调度员'},
			DISP_STATE: {label: '调度状态'},
			DISP_TYPE: {label: '约车类型'},
//			ADDRESS_REF: {label: '简明地址'},
			ZDLX: {label: '终端类型'},
			ISCOMPL: {label: '是否投诉'},

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
			CALL_STATE: {label: '外呼状态', formatter:util.formatTZZT},
			QXDDLX: {label: '取消调度原因'},
			QXDDYY: {label: '取消调度原因描述'},
			CK_MYD: {label: '乘客满意度'},
			CK_PJ: {label: '乘客评价'},
			SJ_MYD: {label: '司机满意度'},
			SJ_PJ: {label: '司机评价'}
//			DDZT: {label: '分机号'},
//			CUST_VEHI_TYPE: {label: '车辆类型'},
//			DDZT: {label: '异常类型'},
//			DDZT: {label: '监控员'},
//			DDZT: {label: '驻点积分'}
		};
		var xhrArgsTabel = {
				url : basePath + "kb/queryaxyw",
				postData :{},
				handleAs : "json",
				Origin : self.location.origin,
				preventCache : true,
				withCredentials : true,
				load : function(data) {
					unloading();
					for (var i = 0; i < data.length; i++) {
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
			findyh: function(){
				$.ajax({
					url: basePath + "login/checklogin",
					type: 'post',
					data: {},
					async: false,
					dataType: 'json',
					success: function (data) {
						// console.info(data);
						var username = data.username;
						if(username=='8524'||username=='8517'||username=='8551'||username=='8505'){
							$('#ywscbtn').css('display','');
						}else{
							$('#ywscbtn').css('display','none');
						}
					},
					error: function (data) {
					}
				});
			},

			get: function(){
				var postData = {};
					postData.ywbh=$("#ywbh").val();
					postData.pcch=$("#pcch").val();
					postData.zdlx=$("#ywcx-zdlx-comboBox").find('input').val();
					postData.khdh=$("#khdh").val();
					postData.ddzt=$("#ddzt-comboBox").find('input').val();
					postData.khxm=$("#khxm").val();
					postData.ssgs=$("#ssgs-comboBox").find('input').val();
					postData.cllx=$("#cllx-comboBox").find('input').val();
					postData.szqy=$("#ddqy-comboBox").find('input').val();
					postData.xxdz=$("#xxdz").val();
					postData.ddygh=$("#ddygh").val();
					postData.cxgjz=$("#cxgjz").val();
					postData.stime=$("#stime").val();
					postData.etime=$("#etime").val();
					postData.ycms=$("#ycms").val();
					postData.scstime=$("#scstime").val();
					postData.scetime=$("#scetime").val();
					loading('#ywcxTabel');
					dojo.xhrPost(dojo.mixin(xhrArgsTabel,{"postData":'postData='+dojo.toJson(postData)}));
			},
			editywd: function () {

					var _self = this;
					var hs = [];
					dojo.forEach(ywcxGrid.collection.data, function (item, index) {
						if (ywcxGrid.isSelected(item)) {
							hs.push(item.DISP_ID);
						}
					});
					if(hs.length==0){
						layer.msg("没有选中的数据！");
						return;
					}
					layer.confirm('确定删除选中的订单？', {
									btn: ['确定','取消'] //按钮
								}, function(){
									delAxddOrder(hs.join(',')).then(function (data) {
										if(data.msg=="1"){
											layer.msg("删除订单成功！");
											_self.get();
										}else{
											layer.msg("取消订单失败，请重试！");
										}
									});
								}, function(){
								});

				},
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
				// $("#stime").val(setformat3(new Date())+" 00:00:00");
				// $("#etime").val(setformat3(new Date())+" 23:59:59");
				setTimeout(function(){
					_self.findyh();
					query('#ywscbtn').on('click', function () {
						_self.editywd();
					});

					query('#ywcxbtn').on('click', function () {
						_self.get();
					});

					//导出
					query('#ywcxdaochubtn').on('click', function () {
						var postData = {};
						postData.ywbh=$("#ywbh").val();
						postData.pcch=$("#pcch").val();
						postData.zdlx=$("#ywcx-zdlx-comboBox").find('input').val();
						postData.khdh=$("#khdh").val();
						postData.ddzt=$("#ddzt-comboBox").find('input').val();
						postData.khxm=$("#khxm").val();
						postData.ssgs=$("#ssgs-comboBox").find('input').val();
						postData.cllx=$("#cllx-comboBox").find('input').val();
						postData.szqy=$("#ddqy-comboBox").find('input').val();
						postData.xxdz=$("#xxdz").val();
						postData.ddygh=$("#ddygh").val();
						postData.cxgjz=$("#cxgjz").val();
						postData.stime=$("#stime").val();
						postData.etime=$("#etime").val();
						postData.ycms=$("#ycms").val();
						postData.scstime=$("#scstime").val();
						postData.scetime=$("#scetime").val();
						url = basePath + "kb/queryaxyw_daochu?postData="
									+ encodeURI(encodeURI(JSON.stringify(postData))), window.open(url);
					});
				},0);
			}
		})
	});