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
		var qyjdtjGrid = null, store = null;

		var columns = {
			dojoId: {label: '序号'},
			RQ: {label: '日期'},
			GSMC: {label: '公司'},
			FDMC: {label: '分队'},
			NUM: {label: '结对服务次数'}
		};
		var xhrArgsTabel = {
				url : basePath + "kb/queryQyjdtj",
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
					qyjdtjGrid.set('collection', store);
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
				if (qyjdtjGrid) { qyjdtjGrid = null; dojo.empty('qyjdtjTabel') }
				qyjdtjGrid = new CustomGrid({ totalCount: 0, pagination: null, columns: columns,allowTextSelection: true}, "qyjdtjTabel");
				$("#qyjdtj-stime").val(setformat3(new Date())+' 00:00:00');
				$("#qyjdtj-etime").val(setformat3(new Date())+' 23:59:59');

				addEventComboBox('#qyjdtjPanel');



				//公司
				findgs3().then(function(data){
					for (var i = 0; i < data.length; i++) {
						var gss="<li data-value='"+data[i].COMP_ID+"'>"+data[i].COMP_NAME+"</li>";
						$("#qyjdtj-gsmc-comboBox").find('.iFList').append(gss);
					}
					addEventComboBox('#qyjdtjPanel');
					$("#qyjdtj-gsmc-comboBox").find('input').on('keyup',function(){
						clearTimeout(settime);
						settime = setTimeout(function() {
							findgs2($("#qyjdtj-gsmc-comboBox").find('input').val()).then(function(data2){
								$("#qyjdtj-gsmc-comboBox").find('.iFList').html("<li data-value='' style='height: 1.5em;'></li>");
								for (var i = 0; i < data2.length; i++) {
									var gss="<li data-value='"+data2[i].COMP_ID+"'>"+data2[i].COMP_NAME+"</li>";
									$("#qyjdtj-gsmc-comboBox").find('.iFList').append(gss);
								}
								$('#qyjdtj-gsmc-comboBox').find('.iFList').on('click', function () {
									if (event.stopPropagation){event.stopPropagation();}else if (window.event) {window.event.cancelBubble = true;}
								}).find('li').off('click').on('click', function () {
									$(this).addClass('selected').siblings('.selected').removeClass('selected');
									$("#qyjdtj-gsmc-comboBox").find('input').data('value', $(this).data('value')).val($(this).text()).end().removeClass('selected');
									$('#qyjdtj-gsmc-comboBox').find('input').trigger('change');
								});
							});
						}, 1200)
					});
				});
				//分队
				findFd('').then(function(data){
					for (var i = 0; i < data.length; i++) {
						var gss="<li data-value='"+data[i].COMP_ID+"'>"+data[i].UNIT_NAME+"</li>";
						$("#qyjdtj-fdmc-comboBox").find('.iFList').append(gss);
					}
					addEventComboBox('#qyjdtjPanel');
					$("#qyjdtj-fdmc-comboBox").find('input').on('keyup',function(){
						clearTimeout(settime);
						settime = setTimeout(function() {
							findFd($("#qyjdtj-fdmc-comboBox").find('input').val()).then(function(data2){
								$("#qyjdtj-fdmc-comboBox").find('.iFList').html("<li data-value='' style='height: 1.5em;'></li>");
								for (var i = 0; i < data2.length; i++) {
									var gss="<li data-value='"+data2[i].COMP_ID+"'>"+data2[i].UNIT_NAME+"</li>";
									$("#qyjdtj-fdmc-comboBox").find('.iFList').append(gss);
								}
								$('#qyjdtj-fdmc-comboBox').find('.iFList').on('click', function () {
									if (event.stopPropagation){event.stopPropagation();}else if (window.event) {window.event.cancelBubble = true;}
								}).find('li').off('click').on('click', function () {
									$(this).addClass('selected').siblings('.selected').removeClass('selected');
									$("#qyjdtj-fdmc-comboBox").find('input').data('value', $(this).data('value')).val($(this).text()).end().removeClass('selected');
									$('#qyjdtj-fdmc-comboBox').find('input').trigger('change');
								});
							});
						}, 1200)
					});
				});
				query('#qyjdtjbtn').on('click', function () {
					var postData = {};
					postData.stime=$("#qyjdtj-stime").val();
					postData.etime=$("#qyjdtj-etime").val();
					postData.gs=$("#qyjdtj-gsmc-comboBox").find('input').val();
					postData.fd=$("#qyjdtj-fdmc-comboBox").find('input').val();
					loading('#qyjdtjTabel');
					dojo.xhrPost(dojo.mixin(xhrArgsTabel,{"postData":'postData='+dojo.toJson(postData)}));
				});
				
				query('#qyjdtjdcbtn').on('click', function () {
					var postData = {};
					postData.stime=$("#qyjdtj-stime").val();
					postData.etime=$("#qyjdtj-etime").val();
					postData.gs=$("#qyjdtj-gsmc-comboBox").find('input').val();
					postData.fd=$("#qyjdtj-fdmc-comboBox").find('input').val();
					url = basePath + "kb/queryQyjdtj_daochu?postData="
             		+ encodeURI(encodeURI(JSON.stringify(postData))), window.open(url);
				});
			}
		})
	});