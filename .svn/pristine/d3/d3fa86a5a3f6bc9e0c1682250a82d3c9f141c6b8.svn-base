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
		var ycsjcxGrid = null, store = null;
		var queryCondition={},settime=null;
		var loadindex = null;
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
			DENGHOU: {label: '等候时间(秒)'},
			JINE: {label: '交易金额(元)'},
			KONGSHI: {label: '空驶(公里)'},
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
			url : basePath + "zhyw/queryycsjcx",
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
				ycsjcxGrid.totalCount = data.count;
				ycsjcxGrid.set('collection', store);
				for (var i = 0; i <data.data.length; i++) {
					var yclx = data.data[i].YCLX;
					var ycs = yclx.split(",");
					for (var j= 0; j<ycs.length; j++) {
						if(ycs[j]=="3"){
							$("#ycsjcxTabel-row-"+(i+1)+" .field-JINE").css('background-color','#c7c7c7');
						}
						if(ycs[j]=="4"){
							$("#ycsjcxTabel-row-"+(i+1)+" .field-SHANGCHE").css('background-color','#ff0000');
							$("#ycsjcxTabel-row-"+(i+1)+" .field-XIACHE").css('background-color','#ff0000');
						}
						if(ycs[j]=="5"){
							$("#ycsjcxTabel-row-"+(i+1)+" .field-JICHENG").css('background-color','#03f7a8');
						}
						if(ycs[j]=="6"){
							$("#ycsjcxTabel-row-"+(i+1)+" .field-SHANGCHE").css('background-color','#a09eff');
							$("#ycsjcxTabel-row-"+(i+1)+" .field-XIACHE").css('background-color','#a09eff');
						}
						if(ycs[j]=="7"){
							$("#ycsjcxTabel-row-"+(i+1)+" .field-JICHENG").css('background-color','#c7c7c7');
						}
						if(ycs[j]=="8"){
							$("#ycsjcxTabel-row-"+(i+1)+" .field-KONGSHI").css('background-color','#c7c7c7');
						}
						if(ycs[j]=="9"){
							$("#ycsjcxTabel-row-"+(i+1)+" .field-DENGHOU").css('background-color','#c7c7c7');
						}
					}
				}
				ycsjcxGrid.pagination.refresh(data.data.length);
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
				
				queryCondition.stime=$("#ycsjcx-startTime").val();
				queryCondition.etime=$("#ycsjcx-endTime").val();
				queryCondition.qy=$("#ycsjcx-quyu-comboBox").find('input').val();   //$("#clxjjy-quyu-comboBox").find('input').data('value')==undefined?"":$("#clxjjy-quyu-comboBox").find('input').data('value');
				queryCondition.gs=$("#ycsjcx-company-comboBox").find('input').val();	 //$("#clxjjy-company-comboBox").find('input').data('value')==undefined?"":$("#clxjjy-company-comboBox").find('input').data('value');
				queryCondition.cp=$("#ycsjcx-cphm-comboBox").find('input').val();
				var yjlx="";
				$("input[name='ycsjcxchk']:checked").each(function(){
					yjlx+=$(this).val()+",";
				});
				queryCondition.yjlx=yjlx;
				loadindex = layer.load(1);
				pageii = new Pagination(ycsjcxGrid,xhrArgsTabel,queryCondition,50);
				dc.place(pageii.first(),'ycsjcxTabel','after');
			},
			initToolBar:function(){
				
				var _self = this;
				if (ycsjcxGrid) { ycsjcxGrid = null; dojo.empty('ycsjcxTabel') }
				ycsjcxGrid = new CustomGrid({ totalCount: 0, pagination: null, columns: columns,allowTextSelection: true}, 'ycsjcxTabel');
				$("#ycsjcx-startTime").val(GetDateStr(0)+" 00:00:00");
				$("#ycsjcx-endTime").val(GetDateStr(0)+" 23:59:59");
				
				addEventComboBox('#ycsjcxPanel');

				query('#ycsjcx-startTime').on('focus', function () {
					WdatePicker({
						onpicked: function () {
							$('#ycsjcx-endTime').trigger('focus')
						},
						dateFmt: STATEDATETIME
					});
				});
				query('#ycsjcx-endTime').on('focus', function () {
					WdatePicker({dateFmt: STATEDATETIME});
				});
				
				
				//公司
				findgs().then(function(data){
					$("#ycsjcx-company-comboBox").find('.iFList').html("");
					for (var i = 0; i < data.length; i++) {
						var gss="<li data-value='"+data[i].COMP_NAME+"'>"+data[i].COMP_NAME+"</li>";
						$("#ycsjcx-company-comboBox").find('.iFList').append(gss);
					}
					$('#ycsjcx-company-comboBox').find('.iFList').on('click', function () {
						event.stopPropagation();
					}).find('li').off('click').on('click', function () {
						$(this).addClass('selected').siblings('.selected').removeClass('selected');
						$("#ycsjcx-company-comboBox").find('input').data('value', $(this).data('value')).val($(this).text()).end().removeClass('selected');
						$('#ycsjcx-company-comboBox').find('input').trigger('change');
					});
					$("#ycsjcx-company-comboBox").find('input').on('change',function(){
						//sim卡
						if($("#ycsjcx-company-comboBox").find('input').data('value')!=""){
						//车牌
							$("#ycsjcx-cphm-comboBox").find('.iFList').html("");
							findcphm($("#ycsjcx-company-comboBox").find('input').data('value')).then(function(data2){
								for (var i = 0; i < data2.length; i++) {
									var cphms="<li data-value='"+data2[i].CPHM+"'>"+data2[i].CPHM+"</li>";
									$("#ycsjcx-cphm-comboBox").find('.iFList').append(cphms);
								}
							});
						}
					}).on('keyup',function(){
						clearTimeout(settime);
						settime = setTimeout(function() {
							findgs2($("#ycsjcx-company-comboBox").find('input').val()).then(function(data2){
								$("#ycsjcx-company-comboBox").find('.iFList').html("");
								for (var i = 0; i < data2.length; i++) {
									var gss="<li data-value='"+data2[i].COMP_NAME+"'>"+data2[i].COMP_NAME+"</li>";
									$("#ycsjcx-company-comboBox").find('.iFList').append(gss);
								}
								$('#ycsjcx-company-comboBox').find('.iFList').on('click', function () {
									event.stopPropagation();
								}).find('li').off('click').on('click', function () {
									$(this).addClass('selected').siblings('.selected').removeClass('selected');
									$("#ycsjcx-company-comboBox").find('input').data('value', $(this).data('value')).val($(this).text()).end().removeClass('selected');
									$('#ycsjcx-company-comboBox').find('input').trigger('change');
								});
							});
						}, 1200)
					});
				});
				$("#ycsjcx-cphm-comboBox").find('input').on('keyup',function(){
					//车牌
					clearTimeout(settime);
					settime = setTimeout(function() {
						var cpmhs=$("#ycsjcx-cphm-comboBox").find('input').val();
						if(cpmhs.length>2){
							findcphm2(cpmhs).then(function(data2){
								$("#ycsjcx-cphm-comboBox").find('.iFList').html("");
								for (var i = 0; i < data2.length; i++) {
									var cphms="<li data-value='"+data2[i].CPHM+"'>"+data2[i].CPHM+"</li>";
									$("#ycsjcx-cphm-comboBox").find('.iFList').append(cphms);
								}
								$('#ycsjcx-cphm-comboBox').find('.iFList').on('click', function () {
									event.stopPropagation();
								}).find('li').off('click').on('click', function () {
									$(this).addClass('selected').siblings('.selected').removeClass('selected');
									$("#ycsjcx-cphm-comboBox").find('input').data('value', $(this).data('value')).val($(this).text()).end().removeClass('selected');
									$('#ycsjcx-cphm-comboBox').find('input').trigger('change');
								});
							});
						}
					}, 1200)
				})
				
				query('#ycsjcxQuery').on('click', function () {
					
					pageii.queryCondition.stime=$("#ycsjcx-startTime").val();
					pageii.queryCondition.etime=$("#ycsjcx-endTime").val();
					pageii.queryCondition.qy=$("#ycsjcx-quyu-comboBox").find('input').val();   //$("#clxjjy-quyu-comboBox").find('input').data('value')==undefined?"":$("#clxjjy-quyu-comboBox").find('input').data('value');
					pageii.queryCondition.gs=$("#ycsjcx-company-comboBox").find('input').val();	 //$("#clxjjy-company-comboBox").find('input').data('value')==undefined?"":$("#clxjjy-company-comboBox").find('input').data('value');
					pageii.queryCondition.cp=$("#ycsjcx-cphm-comboBox").find('input').val();
					var yjlx="";
					$("input[name='ycsjcxchk']:checked").each(function(){
						yjlx+=$(this).val()+",";
					})
					pageii.queryCondition.yjlx=yjlx;
					
					loadindex = layer.load(1);
					if(yjlx==""){
						$("#czjg").html("请至少选择一项异常数据类型");
						dijit.byId('qd_dialog').show();
					}else{
						pageii.first();
					}
				});
				//导出
				query('#ycsjcxDaochu').on('click', function () {
					var postData = {};
					
					postData.stime=$("#ycsjcx-startTime").val();
					postData.etime=$("#ycsjcx-endTime").val();
					postData.qy=$("#ycsjcx-quyu-comboBox").find('input').val();   //$("#clxjjy-quyu-comboBox").find('input').data('value')==undefined?"":$("#clxjjy-quyu-comboBox").find('input').data('value');
					postData.gs=$("#ycsjcx-company-comboBox").find('input').val();	 //$("#clxjjy-company-comboBox").find('input').data('value')==undefined?"":$("#clxjjy-company-comboBox").find('input').data('value');
					postData.cp=$("#ycsjcx-cphm-comboBox").find('input').val();
					var yjlx="";
					$("input[name='ycsjcxchk']:checked").each(function(){
						yjlx+=$(this).val()+",";
					})
					postData.yjlx=yjlx;
					
					if(yjlx==""){
						$("#czjg").html("请至少选择一项异常数据类型");
						dijit.byId('qd_dialog').show();
					}else{
						url = basePath + "zhyw/ycsjcx_daochu?postData="
                 		+ encodeURI(encodeURI(JSON.stringify(postData))), window.open(url)
					}
				});
			}
		})
	});