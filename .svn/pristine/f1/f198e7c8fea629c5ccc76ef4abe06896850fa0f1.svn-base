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
		var cltjGrid = null, store = null;
		var queryCondition={},settime=null,queryCondition = {};
		var loadindex=null;
		var columns = {
			dojoId: {label: '序号'},
			QY: {label: '区域'},
			FGS: {label: '公司'},
			CPHM: {label: '车牌号码 '},
			ZDLX: {label: '终端类型'},
			RYYCS: {label: '总营运次数(次)'},
			RYYCL: {label: '营运车辆数(辆)'},
			RYSJE: {label: '总营收金额(元)'},
			RZKLC: {label: '载客行驶里程(公里)'},
			RKSLC: {label: '空驶里程(公里)'},
			RZLC: {label: '总行驶里程(公里)'},
			RYYSC: {label: '营运时长(小时)'},
			DHSJ: {label: '等候时间(分钟)'},
			KSYYSJ: {label: '开始营运时间'},
			JSYYSJ: {label: '结束营运时间'}
		};
		var xhrArgsTabel = {
			url : basePath + "zhyw/cltj",
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
				cltjGrid.totalCount = data.count;
				cltjGrid.set('collection', store);
				cltjGrid.pagination.refresh(data.data.length);
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
				queryCondition.stime=$("#cltj-startTime").val();
				queryCondition.etime=$("#cltj-endTime").val();
				queryCondition.qy=$("#cltj-quyu-comboBox").find('input').val();  
				queryCondition.gs=$("#cltj-company-comboBox").find('input').val();
				queryCondition.cp=$("#cltj-cphm-comboBox").find('input').val();
				queryCondition.zdlx=$("#cltj-zdlx-comboBox").find('input').val();
				queryCondition.xs=$("#cltj-scs").val();
				queryCondition.ds=$("#cltj-ecs").val();	
				queryCondition.px=$("#cltj-px-comboBox").find('input').attr('data-value');
				loadindex = layer.load(1);
				console.log(queryCondition);
				pageii = new Pagination(cltjGrid,xhrArgsTabel,queryCondition,100);
				dc.place(pageii.first(),'cltjTabel','after');
			},
			initToolBar:function(){
				
				var _self = this;
				if (cltjGrid) { cltjGrid = null; dojo.empty('cltjTabel') }
				cltjGrid = new CustomGrid({ totalCount: 0, pagination: null, columns: columns,allowTextSelection: true}, 'cltjTabel');
				$("#cltj-startTime").val(setformat3(new Date())+" 00:00:00");
				$("#cltj-endTime").val(setformat3(new Date())+" 23:59:59");
				
				addEventComboBox('#cltjPanel');

				query('#cltj-startTime').on('focus', function () {
					WdatePicker({
						dateFmt: STATEDATETIME
					});
				});
				query('#cltj-endTime').on('focus', function () {
					WdatePicker({dateFmt: STATEDATETIME});
				});
				
				findzdxh().then(function(data2){
					for (var i = 0; i < data2.datas.length; i++) {
						var zdlx="<li data-value='"+data2.datas[i].name+"'>"+data2.datas[i].name+"</li>";
						$("#cltj-zdlx-comboBox").find('.iFList').append(zdlx);
					}
					$('#cltj-zdlx-comboBox').find('.iFList').on('click', function () {
						event.stopPropagation();
					}).find('li').off('click').on('click', function () {
						$(this).addClass('selected').siblings('.selected').removeClass('selected');
						$("#cltj-zdlx-comboBox").find('input').data('value', $(this).data('value')).val($(this).text()).end().removeClass('selected');
					});
				});
				
				findgs().then(function(data){
					$("#cltj-company-comboBox").find('.iFList').html("");
					for (var i = 0; i < data.length; i++) {
						var gss="<li data-value='"+data[i].COMP_NAME+"'>"+data[i].COMP_NAME+"</li>";
						$("#cltj-company-comboBox").find('.iFList').append(gss);
					}
					$('#cltj-company-comboBox').find('.iFList').on('click', function () {
						event.stopPropagation();
					}).find('li').off('click').on('click', function () {
						$(this).addClass('selected').siblings('.selected').removeClass('selected');
						$("#cltj-company-comboBox").find('input').data('value', $(this).data('value')).val($(this).text()).end().removeClass('selected');
						$('#cltj-company-comboBox').find('input').trigger('change');
					});
					$("#cltj-company-comboBox").find('input').on('change',function(){
						//sim卡
						if($("#cltj-company-comboBox").find('input').data('value')!=""){
						//车牌
							$("#cltj-cphm-comboBox").find('.iFList').html("");
							findcphm($("#cltj-company-comboBox").find('input').data('value')).then(function(data2){
								for (var i = 0; i < data2.length; i++) {
									var cphms="<li data-value='"+data2[i].CPHM+"'>"+data2[i].CPHM+"</li>";
									$("#cltj-cphm-comboBox").find('.iFList').append(cphms);
								}
							});
						}
					}).on('keyup',function(){
						clearTimeout(settime);
						settime = setTimeout(function() {
							findgs2($("#cltj-company-comboBox").find('input').val()).then(function(data2){
								$("#cltj-company-comboBox").find('.iFList').html("");
								for (var i = 0; i < data2.length; i++) {
									var gss="<li data-value='"+data2[i].COMP_NAME+"'>"+data2[i].COMP_NAME+"</li>";
									$("#cltj-company-comboBox").find('.iFList').append(gss);
								}
								$('#cltj-company-comboBox').find('.iFList').on('click', function () {
									event.stopPropagation();
								}).find('li').off('click').on('click', function () {
									$(this).addClass('selected').siblings('.selected').removeClass('selected');
									$("#cltj-company-comboBox").find('input').data('value', $(this).data('value')).val($(this).text()).end().removeClass('selected');
									$('#cltj-company-comboBox').find('input').trigger('change');
								});
							});
						}, 1200)
					});
				});
				$("#cltj-cphm-comboBox").find('input').on('keyup',function(){
					//车牌
					clearTimeout(settime);
					settime = setTimeout(function() {
						var cpmhs=$("#cltj-cphm-comboBox").find('input').val();
						if(cpmhs.length>2){
							findcphm2(cpmhs).then(function(data2){
								$("#cltj-cphm-comboBox").find('.iFList').html("");
								for (var i = 0; i < data2.length; i++) {
									var cphms="<li data-value='"+data2[i].CPHM+"'>"+data2[i].CPHM+"</li>";
									$("#cltj-cphm-comboBox").find('.iFList').append(cphms);
								}
								$('#cltj-cphm-comboBox').find('.iFList').on('click', function () {
									event.stopPropagation();
								}).find('li').off('click').on('click', function () {
									$(this).addClass('selected').siblings('.selected').removeClass('selected');
									$("#cltj-cphm-comboBox").find('input').data('value', $(this).data('value')).val($(this).text()).end().removeClass('selected');
									$('#cltj-cphm-comboBox').find('input').trigger('change');
								});
							});
						}
					}, 1200)
				})
				query('#cltjQuery').on('click', function () {
					var stime= $("#cltj-startTime").val();
					var etime= $("#cltj-endTime").val();
					if(stime.substring(0,7)!=etime.substring(0,7)){
						$("#czjg").html("不支持跨月查询！");
						dijit.byId('qd_dialog').show();
					}else{
						pageii.queryCondition.stime=stime;
						pageii.queryCondition.etime=etime;
						pageii.queryCondition.qy=$("#cltj-quyu-comboBox").find('input').val();  
						pageii.queryCondition.gs=$("#cltj-company-comboBox").find('input').val();
						pageii.queryCondition.cp=$("#cltj-cphm-comboBox").find('input').val();
						pageii.queryCondition.zdlx=$("#cltj-zdlx-comboBox").find('input').val();
						pageii.queryCondition.xs=$("#cltj-scs").val();
						pageii.queryCondition.ds=$("#cltj-ecs").val();
						pageii.queryCondition.px=$("#cltj-px-comboBox").find('input').attr('data-value');
						loadindex = layer.load(1);
						pageii.first();
					}
				});
				//导出
				query('#cltjDaochu').on('click', function () {
					var stime= $("#cltj-startTime").val();
					var etime= $("#cltj-endTime").val();
					if(stime.substring(0,7)!=etime.substring(0,7)){
						$("#czjg").html("不支持跨月查询！");
						dijit.byId('qd_dialog').show();
					}else{
						var postData = {};
						postData.stime=stime;
						postData.etime=etime;
						postData.qy=$("#cltj-quyu-comboBox").find('input').val();  
						postData.gs=$("#cltj-company-comboBox").find('input').val();
						postData.cp=$("#cltj-cphm-comboBox").find('input').val();
						postData.zdlx=$("#cltj-zdlx-comboBox").find('input').val();
						postData.xs=$("#cltj-scs").val();
						postData.ds=$("#cltj-ecs").val();
						postData.px=$("#cltj-px-comboBox").find('input').attr('data-value');
						url = basePath + "zhyw/cltj_daochu?postData="
	             		+ encodeURI(encodeURI(JSON.stringify(postData))), window.open(url);
					}
				});
			}
		})
	});