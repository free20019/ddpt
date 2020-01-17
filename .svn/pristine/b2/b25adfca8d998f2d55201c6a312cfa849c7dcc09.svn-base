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
		var clyyjyGrid = null, store = null;
		var queryCondition={},settime=null;
		var loadindex=null;
		var columns = {
			dojoId: {label: '序号'},
			JIAOYITYPE: {label: '营运类型'},
			QY: {label: '区域'},
			FGS: {label: '公司'},
			CPHM: {label: '车号'},
			ZDLX: {label: '终端类型'},
			SIM: {label: '终端编号'},
			YINGYUN: {label: '营运资格服务证'},
			SHANGCHE: {label: '上车时间', formatter:util.formatYYYYMMDDHHMISS},
			XIACHE: {label: '下车时间', formatter:util.formatYYYYMMDDHHMISS},
			JICHENG: {label: '计程(公里)'},
			DENGHOU: {label: '等候时间(秒)'},
			JINE: {label: '交易金额(元)'},
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
			url : basePath + "zhyw/queryclyyjy",
			postData :{},
			handleAs : "json",
			Origin : self.location.origin,
			preventCache : true,
			withCredentials : true,
			load : function(data) {
				console.log(data);
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
				clyyjyGrid.totalCount = data.count;
				clyyjyGrid.set('collection', store);
				clyyjyGrid.pagination.refresh(data.data.length);
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
				
				queryCondition.stime=$("#clyyjy-startTime").val();
				queryCondition.etime=$("#clyyjy-endTime").val();
				queryCondition.qy=$("#clyyjy-quyu-comboBox").find('input').val();   //$("#clxjjy-quyu-comboBox").find('input').data('value')==undefined?"":$("#clxjjy-quyu-comboBox").find('input').data('value');
				queryCondition.gs=$("#clyyjy-company-comboBox").find('input').val();	 //$("#clxjjy-company-comboBox").find('input').data('value')==undefined?"":$("#clxjjy-company-comboBox").find('input').data('value');
				queryCondition.cp=$("#clyyjy-cphm-comboBox").find('input').val();
				queryCondition.zdlx=$("#clyyjy-zdlx-comboBox").find('input').val();
				queryCondition.fwzgz=$("#clyyjy-fwzgz").val();
				queryCondition.minje=$("#clyyjy-minjyje").val();
				queryCondition.maxje=$("#clyyjy-maxjyje").val();
				loadindex=layer.load(1);
				pageii = new Pagination(clyyjyGrid,xhrArgsTabel,queryCondition,50);
				dc.place(pageii.first(),'clyyjyTabel','after');
			},
			initToolBar:function(){
				var _self = this;
				if (clyyjyGrid) { clyyjyGrid = null; dojo.empty('clyyjyTabel') }
				clyyjyGrid = new CustomGrid({ totalCount: 0, pagination: null, columns: columns,allowTextSelection: true}, 'clyyjyTabel');
//select * from HZGPS_CITIZEN.TB_CITIZEN_2017@jjq_45 t
				$("#clyyjy-startTime").val(setformat1(new Date(new Date().getTime() - 1000 * 60 * 60*2)));
				$("#clyyjy-endTime").val(setformat1(new Date()));
				
				// query('#clyyjyPanel .iFComboBox').on('click', function () {
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
				$('#clyyjy-minjyje').keyup(function(){
					if($("#clyyjy-minjyje").val().length>4){
						$("#clyyjy-minjyje").val('9999');
					}
				});
				$('#clyyjy-maxjyje').keyup(function(){
					if($("#clyyjy-maxjyje").val().length>4){
						$("#clyyjy-maxjyje").val('9999');
					}
				});
				addEventComboBox('#clyyjyPanel');

				query('#clyyjy-startTime').on('focus', function () {
					WdatePicker({
						onpicked: function () {
							$('#clyyjy-endTime').trigger('focus')
						},
						dateFmt: STATEDATETIME
					});
				});
				query('#clyyjy-endTime').on('focus', function () {
					WdatePicker({dateFmt: STATEDATETIME});
				});
				
				//公司
				findgs().then(function(data){
					$("#clyyjy-company-comboBox").find('.iFList').html("");
					for (var i = 0; i < data.length; i++) {
						var gss="<li data-value='"+data[i].COMP_NAME+"'>"+data[i].COMP_NAME+"</li>";
						$("#clyyjy-company-comboBox").find('.iFList').append(gss);
					}
					$('#clyyjy-company-comboBox').find('.iFList').on('click', function () {
						if (event.stopPropagation){event.stopPropagation();}else if (window.event) {window.event.cancelBubble = true;}
					}).find('li').off('click').on('click', function () {
						$(this).addClass('selected').siblings('.selected').removeClass('selected');
						$("#clyyjy-company-comboBox").find('input').data('value', $(this).data('value')).val($(this).text()).end().removeClass('selected');
						$('#clyyjy-company-comboBox').find('input').trigger('change');
					});
					$("#clyyjy-company-comboBox").find('input').on('change',function(){
						//sim卡
						if($("#clyyjy-company-comboBox").find('input').data('value')!=""){
						//车牌
							$("#clyyjy-cphm-comboBox").find('.iFList').html("");
							findcphm($("#clyyjy-company-comboBox").find('input').data('value')).then(function(data2){
								for (var i = 0; i < data2.length; i++) {
									var cphms="<li data-value='"+data2[i].CPHM+"'>"+data2[i].CPHM+"</li>";
									$("#clyyjy-cphm-comboBox").find('.iFList').append(cphms);
								}
							});
						}
					}).on('keyup',function(){
						clearTimeout(settime);
						settime = setTimeout(function() {
							findgs2($("#clyyjy-company-comboBox").find('input').val()).then(function(data2){
								$("#clyyjy-company-comboBox").find('.iFList').html("");
								for (var i = 0; i < data2.length; i++) {
									var gss="<li data-value='"+data2[i].COMP_NAME+"'>"+data2[i].COMP_NAME+"</li>";
									$("#clyyjy-company-comboBox").find('.iFList').append(gss);
								}
								$('#clyyjy-company-comboBox').find('.iFList').on('click', function () {
									if (event.stopPropagation){event.stopPropagation();}else if (window.event) {window.event.cancelBubble = true;}
								}).find('li').off('click').on('click', function () {
									$(this).addClass('selected').siblings('.selected').removeClass('selected');
									$("#clyyjy-company-comboBox").find('input').data('value', $(this).data('value')).val($(this).text()).end().removeClass('selected');
									$('#clyyjy-company-comboBox').find('input').trigger('change');
								});
							});
						}, 1200)
					});
				});
				$("#clyyjy-cphm-comboBox").find('input').on('keyup',function(){
					//车牌
					clearTimeout(settime);
					settime = setTimeout(function() {
						var cpmhs=$("#clyyjy-cphm-comboBox").find('input').val();
						if(cpmhs.length>2){
							findcphm2(cpmhs).then(function(data2){
								$("#clyyjy-cphm-comboBox").find('.iFList').html("");
								for (var i = 0; i < data2.length; i++) {
									var cphms="<li data-value='"+data2[i].CPHM+"'>"+data2[i].CPHM+"</li>";
									$("#clyyjy-cphm-comboBox").find('.iFList').append(cphms);
								}
								$('#clyyjy-cphm-comboBox').find('.iFList').on('click', function () {
									if (event.stopPropagation){event.stopPropagation();}else if (window.event) {window.event.cancelBubble = true;}
								}).find('li').off('click').on('click', function () {
									$(this).addClass('selected').siblings('.selected').removeClass('selected');
									$("#clyyjy-cphm-comboBox").find('input').data('value', $(this).data('value')).val($(this).text()).end().removeClass('selected');
									$('#clyyjy-cphm-comboBox').find('input').trigger('change');
								});
							});
						}
					}, 1200)
				})
				
				findzdxh().then(function(data2){
					for (var i = 0; i < data2.datas.length; i++) {
						var zdlx="<li data-value='"+data2.datas[i].name+"'>"+data2.datas[i].name+"</li>";
						$("#clyyjy-zdlx-comboBox").find('.iFList').append(zdlx);
					}
					$('#clyyjy-zdlx-comboBox').find('.iFList').on('click', function () {
						event.stopPropagation();
					}).find('li').off('click').on('click', function () {
						$(this).addClass('selected').siblings('.selected').removeClass('selected');
						$("#clyyjy-zdlx-comboBox").find('input').data('value', $(this).data('value')).val($(this).text()).end().removeClass('selected');
					});
				});
				
				
				query('#clyyjyQuery').on('click', function () {
					
					pageii.queryCondition.stime=$("#clyyjy-startTime").val();
					pageii.queryCondition.etime=$("#clyyjy-endTime").val();
					pageii.queryCondition.qy=$("#clyyjy-quyu-comboBox").find('input').val();   //$("#clxjjy-quyu-comboBox").find('input').data('value')==undefined?"":$("#clxjjy-quyu-comboBox").find('input').data('value');
					pageii.queryCondition.gs=$("#clyyjy-company-comboBox").find('input').val();	 //$("#clxjjy-company-comboBox").find('input').data('value')==undefined?"":$("#clxjjy-company-comboBox").find('input').data('value');
					pageii.queryCondition.cp=$("#clyyjy-cphm-comboBox").find('input').val();
					pageii.queryCondition.zdlx=$("#clyyjy-zdlx-comboBox").find('input').val();
					pageii.queryCondition.fwzgz=$("#clyyjy-fwzgz").val();
					pageii.queryCondition.minje=$("#clyyjy-minjyje").val();
					pageii.queryCondition.maxje=$("#clyyjy-maxjyje").val();
					var yjlx="";
					$("input[name='clyyjychk']:checked").each(function(){
						yjlx+=$(this).val()+",";
					})
					pageii.queryCondition.yjlx=yjlx;
					loadindex=layer.load(1);
					pageii.first();
				});
				//导出
				query('#clyyjyDaochu').on('click', function () {
					var postData = {};
					
					postData.stime=$("#clyyjy-startTime").val();
					postData.etime=$("#clyyjy-endTime").val();
					postData.qy=$("#clyyjy-quyu-comboBox").find('input').val();   //$("#clxjjy-quyu-comboBox").find('input').data('value')==undefined?"":$("#clxjjy-quyu-comboBox").find('input').data('value');
					postData.gs=$("#clyyjy-company-comboBox").find('input').val();	 //$("#clxjjy-company-comboBox").find('input').data('value')==undefined?"":$("#clxjjy-company-comboBox").find('input').data('value');
					postData.cp=$("#clyyjy-cphm-comboBox").find('input').val();
					postData.zdlx=$("#clyyjy-zdlx-comboBox").find('input').val();
					postData.fwzgz=$("#clyyjy-fwzgz").val();
					postData.minje=$("#clyyjy-minjyje").val();
					postData.maxje=$("#clyyjy-maxjyje").val();
					var yjlx="";
					$("input[name='clyyjychk']:checked").each(function(){
						yjlx+=$(this).val()+",";
					})
					postData.yjlx=yjlx;
					url = basePath + "zhyw/clyyjy_daochu?postData="
             		+ encodeURI(encodeURI(JSON.stringify(postData))), window.open(url)
				});
			}
		})
	});