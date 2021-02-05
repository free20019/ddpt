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
				url : basePath + "zhyw/queryrtj",
				postData :{},
				handleAs : "json",
				Origin : self.location.origin,
				preventCache : true,
				withCredentials : true,
				load : function(data) {
					layer.close(loadindex);
						var sj1 = "<th>全天</th>" +
								"<td>"+data.data1[0].QY+"</td>" +
								"<td>"+(data.data1[0].RYYCS==""?0:data.data1[0].RYYCS)+"</td>" +
								"<td>"+data.data1[0].CLZS+"</td>" +
								"<td>"+(data.data1[0].RYYCL==""?0:data.data1[0].RYYCL)+"</td>" +
								"<td>"+(data.data1[0].RZLC==""?0:data.data1[0].RZLC)+"</td>" +
								"<td>"+(data.data1[0].RZKLC==""?0:data.data1[0].RZKLC)+"</td>" +
								"<td>"+(data.data1[0].RKSLC==""?0:data.data1[0].RKSLC)+"</td>" +
								"<td>"+(data.data1[0].RYSJE==""?0:data.data1[0].RYSJE)+"</td>" +
								"<td>"+(data.data1[0].DHSJ==""?0:data.data1[0].DHSJ)+"</td>" +
								"<td>"+(data.data1[0].RYYSC==""?0:data.data1[0].RYYSC)+"</td>" +
								"<td>"+(data.data1[0].ZZCS==""?0:data.data1[0].ZZCS)+"</td>" +
								"<td>"+(data.data1[0].PJYS==""?0:data.data1[0].PJYS)+"</td>" +
								"<td>"+(data.data1[0].PJXSSD==""?0:data.data1[0].PJXSSD)+"</td>" +
								"<td>"+(data.data1[0].PJYYSC==""?0:data.data1[0].PJYYSC)+"</td>" +
								"<td>"+(data.data1[0].PJDHSJ==""?0:data.data1[0].PJDHSJ)+"</td>" +
								"<td>"+(data.data1[0].SLL==""?0:data.data1[0].SLL)+"</td>";
						$("#trdata1").html(sj1);
						var sj2 = "<th>早高峰</th>" +
						"<td>"+data.data2[0].QY+"</td>" +
						"<td>"+(data.data2[0].RYYCS==""?0:data.data2[0].RYYCS)+"</td>" +
						"<td>"+data.data2[0].CLZS+"</td>" +
						"<td>"+(data.data2[0].RYYCL==""?0:data.data2[0].RYYCL)+"</td>" +
						"<td>"+(data.data2[0].RZLC==""?0:data.data2[0].RZLC)+"</td>" +
						"<td>"+(data.data2[0].RZKLC==""?0:data.data2[0].RZKLC)+"</td>" +
						"<td>"+(data.data2[0].RKSLC==""?0:data.data2[0].RKSLC)+"</td>" +
						"<td>"+(data.data2[0].RYSJE==""?0:data.data2[0].RYSJE)+"</td>" +
						"<td>"+(data.data2[0].DHSJ==""?0:data.data2[0].DHSJ)+"</td>" +
						"<td>"+(data.data2[0].RYYSC==""?0:data.data2[0].RYYSC)+"</td>" +
						"<td>"+(data.data2[0].ZZCS==""?0:data.data2[0].ZZCS)+"</td>" +
						"<td>"+(data.data2[0].PJYS==""?0:data.data2[0].PJYS)+"</td>" +
						"<td>"+(data.data2[0].PJXSSD==""?0:data.data2[0].PJXSSD)+"</td>" +
						"<td>"+(data.data2[0].PJYYSC==""?0:data.data2[0].PJYYSC)+"</td>" +
						"<td>"+(data.data2[0].PJDHSJ==""?0:data.data2[0].PJDHSJ)+"</td>" +
						"<td>"+(data.data2[0].SLL==""?0:data.data2[0].SLL)+"</td>";
						$("#trdata2").html(sj2);
						
						var sj3 = "<th>晚高峰</th>" +
						"<td>"+data.data3[0].QY+"</td>" +
						"<td>"+(data.data3[0].RYYCS==""?0:data.data3[0].RYYCS)+"</td>" +
						"<td>"+data.data3[0].CLZS+"</td>" +
						"<td>"+(data.data3[0].RYYCL==""?0:data.data3[0].RYYCL)+"</td>" +
						"<td>"+(data.data3[0].RZLC==""?0:data.data3[0].RZLC)+"</td>" +
						"<td>"+(data.data3[0].RZKLC==""?0:data.data3[0].RZKLC)+"</td>" +
						"<td>"+(data.data3[0].RKSLC==""?0:data.data3[0].RKSLC)+"</td>" +
						"<td>"+(data.data3[0].RYSJE==""?0:data.data3[0].RYSJE)+"</td>" +
						"<td>"+(data.data3[0].DHSJ==""?0:data.data3[0].DHSJ)+"</td>" +
						"<td>"+(data.data3[0].RYYSC==""?0:data.data3[0].RYYSC)+"</td>" +
						"<td>"+(data.data3[0].ZZCS==""?0:data.data3[0].ZZCS)+"</td>" +
						"<td>"+(data.data3[0].PJYS==""?0:data.data3[0].PJYS)+"</td>" +
						"<td>"+(data.data3[0].PJXSSD==""?0:data.data3[0].PJXSSD)+"</td>" +
						"<td>"+(data.data3[0].PJYYSC==""?0:data.data3[0].PJYYSC)+"</td>" +
						"<td>"+(data.data3[0].PJDHSJ==""?0:data.data3[0].PJDHSJ)+"</td>" +
						"<td>"+(data.data3[0].SLL==""?0:data.data3[0].SLL)+"</td>";
						$("#trdata3").html(sj3);

						var sj4 = "<th>23:00-05:00</th>" +
						"<td>"+data.data4[0].QY+"</td>" +
						"<td>"+(data.data4[0].RYYCS==""?0:data.data4[0].RYYCS)+"</td>" +
						"<td>"+data.data4[0].CLZS+"</td>" +
						"<td>"+(data.data4[0].RYYCL==""?0:data.data4[0].RYYCL)+"</td>" +
						"<td>"+(data.data4[0].RZLC==""?0:data.data4[0].RZLC)+"</td>" +
						"<td>"+(data.data4[0].RZKLC==""?0:data.data4[0].RZKLC)+"</td>" +
						"<td>"+(data.data4[0].RKSLC==""?0:data.data4[0].RKSLC)+"</td>" +
						"<td>"+(data.data4[0].RYSJE==""?0:data.data4[0].RYSJE)+"</td>" +
						"<td>"+(data.data4[0].DHSJ==""?0:data.data4[0].DHSJ)+"</td>" +
						"<td>"+(data.data4[0].RYYSC==""?0:data.data4[0].RYYSC)+"</td>" +
						"<td>"+(data.data4[0].ZZCS==""?0:data.data4[0].ZZCS)+"</td>" +
						"<td>"+(data.data4[0].PJYS==""?0:data.data4[0].PJYS)+"</td>" +
						"<td>"+(data.data4[0].PJXSSD==""?0:data.data4[0].PJXSSD)+"</td>" +
						"<td>"+(data.data4[0].PJYYSC==""?0:data.data4[0].PJYYSC)+"</td>" +
						"<td>"+(data.data4[0].PJDHSJ==""?0:data.data4[0].PJDHSJ)+"</td>" +
						"<td>"+(data.data4[0].SLL==""?0:data.data4[0].SLL)+"</td>";
						$("#trdata4").html(sj4);
				},
				error : function(error) {
					layer.close(loadindex);
					console.log(error);
				}
			};
		
		return declare( null,{
			constructor:function(){
				this.initToolBar();
				// loadindex = layer.load(1);
				// var postData = {};
				// postData.stime=$("#statistics2-date").val();
				// postData.qy=$("#statistics2-quyu-comboBox").find('input').val();
				// dojo.xhrPost(dojo.mixin(xhrArgsTabel,{"postData":'postData='+dojo.toJson(postData)}));
			},
			initToolBar:function(){
				addEventComboBox('#s2Panel');
				
				$("#statistics2-date").val(setformat3(new Date()));				
				query('#statistics2-date').on('focus', function () {
					WdatePicker({dateFmt: STATEDATE});
				});

				
				query('#statistics2-query').on('click', function () {
					loadindex = layer.load(1);
					var postData = {};
					postData.stime=$("#statistics2-date").val();
					postData.qy=$("#statistics2-quyu-comboBox").find('input').val();
					dojo.xhrPost(dojo.mixin(xhrArgsTabel,{"postData":'postData='+dojo.toJson(postData)}));
				});
				
				//导出
				query('#statistics2-daochu').on('click', function () {
					var postData = {};
					postData.stime=$("#statistics2-date").val();
					postData.qy=$("#statistics2-quyu-comboBox").find('input').val();
					url = basePath + "zhyw/rtj_daochu?postData="
             		+ encodeURI(encodeURI(JSON.stringify(postData))), window.open(url);
				});
			}
		});
	});