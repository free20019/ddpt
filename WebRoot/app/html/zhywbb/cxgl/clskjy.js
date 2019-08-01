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
		var clskjyGrid = null, store = null;
		var queryCondition={},settime=null;
		var loadindex=null;
		var columns = {
			dojoId: {label: '序号'},
			JIAOYITYPE: {label: '营运类型'},
			QY: {label: '区域'},
			FGS: {label: '公司'},
			CPHM: {label: '车号'},
			SIM: {label: '终端编号'},
			YINGYUN: {label: '营运资格服务证'},
			SHANGCHE: {label: '上车时间', formatter:util.formatYYYYMMDDHHMISS},
			XIACHE: {label: '下车时间', formatter:util.formatYYYYMMDDHHMISS},
			JICHENG: {label: '计程(公里)'},
			DENGHOU: {label: '等候时间'},
			JINE: {label: '交易金额'},
			KONGSHI: {label: '空驶(公里)', formatter:util.formatYWS},
			ZHONGXINTIME: {label: '接收时间', formatter:util.formatYYYYMMDDHHMISS},
			YUANE: {label: '卡原额', formatter:util.formatLWS},
			CITY: {label: '城市代码'},
			XIAOFEI: {label: '唯一代码'},
			KAHAO: {label: '卡留水号'},
			BAOLIU: {label: '保留位'},
			ZHONGDUANNO: {label: '终端交易流水号'},
			JIAOYI: {label: '交易类型'},
			KATYPE: {label: '卡类型'},
			QIANBAO: {label: '钱包累计交易次数'},
			QIYONG: {label: '启用时间'},
			JIAKUAN: {label: '存钱时间'},
			TAC: {label: 'TAC交易认证码'},
			POS: {label: 'POS机号'},
			QIYE: {label: '企业编号'}
		};
		var xhrArgsTabel = {
			url : basePath + "zhyw/queryclskjy",
			postData :{},
			handleAs : "json",
			Origin : self.location.origin,
			preventCache : true,
			withCredentials : true,
			load : function(data) {
				if(data==null){
					alert("链接超时！");
				}
				layer.close(loadindex);
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
				clskjyGrid.totalCount = data.count;
				clskjyGrid.set('collection', store);
				clskjyGrid.pagination.refresh(data.data.length);
			},
			error : function(error) {
				layer.close(loadindex);
				console.log(error);
			}
		};
		var pageii;
		return declare( null,{
			constructor:function(){
				this.initToolBar();
				queryCondition.stime=$("#clskjy-startTime").val();
				queryCondition.etime=$("#clskjy-endTime").val();
				queryCondition.qy=$("#clskjy-quyu-comboBox").find('input').val();   //$("#clxjjy-quyu-comboBox").find('input').data('value')==undefined?"":$("#clxjjy-quyu-comboBox").find('input').data('value');
				queryCondition.gs=$("#clskjy-company-comboBox").find('input').val();	 //$("#clxjjy-company-comboBox").find('input').data('value')==undefined?"":$("#clxjjy-company-comboBox").find('input').data('value');
				queryCondition.cp=$("#clskjy-cphm-comboBox").find('input').val();
				loadindex=layer.load(1);
				pageii = new Pagination(clskjyGrid,xhrArgsTabel,queryCondition,50);
				dc.place(pageii.first(),'clskjyTabel','after');
			},
			initToolBar:function(){
				var _self = this;
				if (clskjyGrid) { clskjyGrid = null; dojo.empty('clskjyTabel');};
				clskjyGrid = new CustomGrid({ totalCount: 0, pagination: null, columns: columns,allowTextSelection: true}, 'clskjyTabel');
				$("#clskjy-startTime").val(setformat1(new Date(new Date().getTime() - 1000 * 60 * 60*2)));
				$("#clskjy-endTime").val(setformat1(new Date()));
				
				addEventComboBox('#clskjyPanel');

				query('#clskjy-startTime').on('focus', function () {
					WdatePicker({
						onpicked: function () {
							$('#clskjy-endTime').trigger('focus');
						},
						dateFmt: STATEDATETIME
					});
				});
				query('#clskjy-endTime').on('focus', function () {
					WdatePicker({dateFmt: STATEDATETIME});
				});
				
				//公司
				findgs().then(function(data){
					$("#clskjy-company-comboBox").find('.iFList').html("");
					for (var i = 0; i < data.length; i++) {
						var gss="<li data-value='"+data[i].COMP_NAME+"'>"+data[i].COMP_NAME+"</li>";
						$("#clskjy-company-comboBox").find('.iFList').append(gss);
					}
					$('#clskjy-company-comboBox').find('.iFList').on('click', function () {
						event.stopPropagation();
					}).find('li').off('click').on('click', function () {
						$(this).addClass('selected').siblings('.selected').removeClass('selected');
						$("#clskjy-company-comboBox").find('input').data('value', $(this).data('value')).val($(this).text()).end().removeClass('selected');
						$('#clskjy-company-comboBox').find('input').trigger('change');
					});
					$("#clskjy-company-comboBox").find('input').on('change',function(){
						//sim卡
						if($("#clskjy-company-comboBox").find('input').data('value')!=""){
						//车牌
							$("#clskjy-cphm-comboBox").find('.iFList').html("");
							findcphm($("#clskjy-company-comboBox").find('input').data('value')).then(function(data2){
								for (var i = 0; i < data2.length; i++) {
									var cphms="<li data-value='"+data2[i].CPHM+"'>"+data2[i].CPHM+"</li>";
									$("#clskjy-cphm-comboBox").find('.iFList').append(cphms);
								}
							});
						}
					}).on('keyup',function(){
						clearTimeout(settime);
						settime = setTimeout(function() {
							findgs2($("#clskjy-company-comboBox").find('input').val()).then(function(data2){
								$("#clskjy-company-comboBox").find('.iFList').html("");
								for (var i = 0; i < data2.length; i++) {
									var gss="<li data-value='"+data2[i].COMP_NAME+"'>"+data2[i].COMP_NAME+"</li>";
									$("#clskjy-company-comboBox").find('.iFList').append(gss);
								}
								$('#clskjy-company-comboBox').find('.iFList').on('click', function () {
									event.stopPropagation();
								}).find('li').off('click').on('click', function () {
									$(this).addClass('selected').siblings('.selected').removeClass('selected');
									$("#clskjy-company-comboBox").find('input').data('value', $(this).data('value')).val($(this).text()).end().removeClass('selected');
									$('#clskjy-company-comboBox').find('input').trigger('change');
								});
							});
						}, 1200);
					});
				});
				$("#clskjy-cphm-comboBox").find('input').on('keyup',function(){
					//车牌
					clearTimeout(settime);
					settime = setTimeout(function() {
						var cpmhs=$("#clskjy-cphm-comboBox").find('input').val();
						if(cpmhs.length>2){
							findcphm2(cpmhs).then(function(data2){
								$("#clskjy-cphm-comboBox").find('.iFList').html("");
								for (var i = 0; i < data2.length; i++) {
									var cphms="<li data-value='"+data2[i].CPHM+"'>"+data2[i].CPHM+"</li>";
									$("#clskjy-cphm-comboBox").find('.iFList').append(cphms);
								}
								$('#clskjy-cphm-comboBox').find('.iFList').on('click', function () {
									event.stopPropagation();
								}).find('li').off('click').on('click', function () {
									$(this).addClass('selected').siblings('.selected').removeClass('selected');
									$("#clskjy-cphm-comboBox").find('input').data('value', $(this).data('value')).val($(this).text()).end().removeClass('selected');
									$('#clskjy-cphm-comboBox').find('input').trigger('change');
								});
							});
						}
					}, 1200);
				});
				
				query('#clskjyQuery').on('click', function () {
					pageii.queryCondition.stime=$("#clskjy-startTime").val();
					pageii.queryCondition.etime=$("#clskjy-endTime").val();
					pageii.queryCondition.qy=$("#clskjy-quyu-comboBox").find('input').val();   //$("#clxjjy-quyu-comboBox").find('input').data('value')==undefined?"":$("#clxjjy-quyu-comboBox").find('input').data('value');
					pageii.queryCondition.gs=$("#clskjy-company-comboBox").find('input').val();	 //$("#clxjjy-company-comboBox").find('input').data('value')==undefined?"":$("#clxjjy-company-comboBox").find('input').data('value');
					pageii.queryCondition.cp=$("#clskjy-cphm-comboBox").find('input').val();
					var yjlx="";
					$("input[name='clskjychk']:checked").each(function(){
						yjlx+=$(this).val()+",";
					});
					pageii.queryCondition.yjlx=yjlx;
					loadindex=layer.load(1);
					pageii.first();
				});
				//导出
				query('#clskjyDaochu').on('click', function () {
					var postData = {};
					
					postData.stime=$("#clskjy-startTime").val();
					postData.etime=$("#clskjy-endTime").val();
					postData.qy=$("#clskjy-quyu-comboBox").find('input').val();   //$("#clxjjy-quyu-comboBox").find('input').data('value')==undefined?"":$("#clxjjy-quyu-comboBox").find('input').data('value');
					postData.gs=$("#clskjy-company-comboBox").find('input').val();	 //$("#clxjjy-company-comboBox").find('input').data('value')==undefined?"":$("#clxjjy-company-comboBox").find('input').data('value');
					postData.cp=$("#clskjy-cphm-comboBox").find('input').val();
					var yjlx="";
					$("input[name='clskjychk']:checked").each(function(){
						yjlx+=$(this).val()+",";
					});
					postData.yjlx=yjlx;
					
					url = basePath + "zhyw/clskjy_daochu?postData="
             		+ encodeURI(encodeURI(JSON.stringify(postData))), window.open(url);
				});
			}
		});
	});