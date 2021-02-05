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
		var cljdtjGrid = null, store = null;

		var columns = {
			dojoId: {label: '序号'},
			RQ: {label: '日期'},
			GSMC: {label: '公司名称'},
			JSY: {label: '驾驶员'},
			CPHM: {label: '车牌号码'},
			NUM: {label: '结对服务次数'}
		};
		var xhrArgsTabel = {
				url : basePath + "kb/queryCljdtj",
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
					cljdtjGrid.set('collection', store);
				},
				error : function(error) {
					console.log(error);
				}
			};
		var settime=null;
		return declare( null,{
			constructor:function(){
				this.initToolBar();
			},
			initToolBar:function(){
				var _self = this;
				if (cljdtjGrid) { cljdtjGrid = null; dojo.empty('cljdtjTabel') }
				cljdtjGrid = new CustomGrid({ totalCount: 0, pagination: null, columns: columns,allowTextSelection: true}, "cljdtjTabel");
				$("#cljdtj-stime").val(setformat3(new Date())+' 00:00:00');
				$("#cljdtj-etime").val(setformat3(new Date())+' 23:59:59');

				addEventComboBox('#cljdtjPanel');



				//公司
				findgs3().then(function(data){
					for (var i = 0; i < data.length; i++) {
						var gss="<li data-value='"+data[i].COMP_ID+"'>"+data[i].COMP_NAME+"</li>";
						$("#cljdtj-gsmc-comboBox").find('.iFList').append(gss);
					}
					addEventComboBox('#cljdtjPanel');
					$("#cljdtj-gsmc-comboBox").find('input').on('keyup',function(){
						clearTimeout(settime);
						settime = setTimeout(function() {
							findgs2($("#cljdtj-gsmc-comboBox").find('input').val()).then(function(data2){
								$("#cljdtj-gsmc-comboBox").find('.iFList').html("<li data-value='' style='height: 1.5em;'></li>");
								for (var i = 0; i < data2.length; i++) {
									var gss="<li data-value='"+data2[i].COMP_ID+"'>"+data2[i].COMP_NAME+"</li>";
									$("#cljdtj-gsmc-comboBox").find('.iFList').append(gss);
								}
								$('#cljdtj-gsmc-comboBox').find('.iFList').on('click', function () {
									if (event.stopPropagation){event.stopPropagation();}else if (window.event) {window.event.cancelBubble = true;}
								}).find('li').off('click').on('click', function () {
									$(this).addClass('selected').siblings('.selected').removeClass('selected');
									$("#cljdtj-gsmc-comboBox").find('input').data('value', $(this).data('value')).val($(this).text()).end().removeClass('selected');
									$('#cljdtj-gsmc-comboBox').find('input').trigger('change');
								});
							});
						}, 1200)
					});
				});
				//分队
				$("#cljdtj-cphm-comboBox").find('input').on('keyup',function(){
					var cpmhs=$("#cljdtj-cphm-comboBox").find('input').val();
					if(cpmhs.length>2&&cpmhs!="浙AT"&&cpmhs!="浙A"){
						findddcphm(cpmhs).then(function(data2){
							$("#cljdtj-cphm-comboBox").find('.iFList').html("");
							for (var i = 0; i < data2.length; i++) {
								var cphms="<li data-value='"+data2[i].CPHM+"'>"+data2[i].CPHM+"</li>";
								$("#cljdtj-cphm-comboBox").find('.iFList').append(cphms);
							}
							addEventComboBox('#cljdtjPanel');
						});
					}
				});
				query('#cljdtjbtn').on('click', function () {
					var postData = {};
					postData.stime=$("#cljdtj-stime").val();
					postData.etime=$("#cljdtj-etime").val();
					postData.gs=$("#cljdtj-gsmc-comboBox").find('input').val();
					postData.cp=$("#cljdtj-cphm-comboBox").find('input').val();
					loading('#cljdtjTabel');
					dojo.xhrPost(dojo.mixin(xhrArgsTabel,{"postData":'postData='+dojo.toJson(postData)}));
				});
				
				query('#cljdtjdcbtn').on('click', function () {
					var postData = {};
					postData.stime=$("#cljdtj-stime").val();
					postData.etime=$("#cljdtj-etime").val();
					postData.gs=$("#cljdtj-gsmc-comboBox").find('input').val();
					postData.cp=$("#cljdtj-cphm-comboBox").find('input').val();
					url = basePath + "kb/queryCljdtj_daochu?postData="
             		+ encodeURI(encodeURI(JSON.stringify(postData))), window.open(url);
				});
			}
		})
	});