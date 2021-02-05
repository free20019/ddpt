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
		var loadindex;
		var xhrArgsTabel = {
				url : basePath + "form/getodlxtj",
				postData :{},
				handleAs : "json",
				Origin : self.location.origin,
				preventCache : true,
				withCredentials : true,
				load : function(data) {
					layer.close(loadindex);
					var tab = '';
					if(data.length == 0){
						$('#lstj_tbody').html('<tr><td colspan="3">无数据</td></tr>');
					}else{
						for(var i=0; i<data.length; i++){
							tab += '<tr><td>'+(i+1)+'</td><td>'+data[i].AREA_NAME+'</td><td>'+data[i].COUNT_NUM+'</td></tr>';
						}
						$('#lstj_tbody').html(tab);
					}
				},
				error : function(error) {
					layer.close(loadindex);
					console.log(error);
				}
			};
		
		return declare( null,{
			constructor:function(){
				this.initToolBar();
				loadindex = layer.load(1);
				var postData = {};
				postData.STIME=$("#lxtj-sdate").val();
				postData.ETIME=$("#lxtj-edate").val();
				postData.SJD=$("#lxtj-sjd-comboBox").find('input').val();
				postData.QD=$("#lxtj-qd-comboBox").find('input').val();
				dojo.xhrPost(dojo.mixin(xhrArgsTabel,{"postData":'postData='+dojo.toJson(postData)}));
			},
			initToolBar:function(){
				addEventComboBox('#s2Panel');
				
				$("#lxtj-sdate").val(setformat3(new Date(new Date().getTime() - 1000*60*60*24)));
				query('#lxtj-sdate').on('focus', function () {
					WdatePicker({dateFmt: STATEDATE});
				});
				$("#lxtj-edate").val(setformat3(new Date()));				
				query('#lxtj-edate').on('focus', function () {
					WdatePicker({dateFmt: STATEDATE});
				});
				
				query('#lxtj-query').on('click', function () {
					loadindex = layer.load(1);
					var postData = {};
					postData.STIME=$("#lxtj-sdate").val();
					postData.ETIME=$("#lxtj-edate").val();
					postData.SJD=$("#lxtj-sjd-comboBox").find('input').val();
					postData.QD=$("#lxtj-qd-comboBox").find('input').val();
					dojo.xhrPost(dojo.mixin(xhrArgsTabel,{"postData":'postData='+dojo.toJson(postData)}));
				});
				
				//导出
				query('#lxtj-daochu').on('click', function () {
					var postData = {};
					postData.STIME=$("#lxtj-sdate").val();
					postData.ETIME=$("#lxtj-edate").val();
					postData.SJD=$("#lxtj-sjd-comboBox").find('input').val();
					postData.QD=$("#lxtj-qd-comboBox").find('input').val();
					url = basePath + "form/odlxtjexcle?postData="
             		+ encodeURI(encodeURI(JSON.stringify(postData))), window.open(url);
				});
			}
		});
	});