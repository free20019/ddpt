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
		var dcpjlcfxGrid = null, store = null;
		var queryCondition={},	settime=null;
		var loadindex=null;
		var columns = {
			message: {label: '时间'},
			y0: {label: '00:00'},
			y1: {label: '01:00'},
			y2: {label: '02:00'},
			y3: {label: '03:00'},
			y4: {label: '04:00'},
			y5: {label: '05:00'},
			y6: {label: '06:00'},
			y7: {label: '07:00'},
			y8: {label: '08:00'},
			y9: {label: '09:00'},
			y10: {label: '10:00'},
			y11: {label: '11:00'},
			y12: {label: '12:00'},
			y13: {label: '13:00'},
			y14: {label: '14:00'},
			y15: {label: '15:00'},
			y16: {label: '16:00'},
			y17: {label: '17:00'},
			y18: {label: '18:00'},
			y19: {label: '19:00'},
			y20: {label: '20:00'},
			y21: {label: '21:00'},
			y22: {label: '22:00'},
			y23: {label: '23:00'}
		};
		var xhrArgsTabel = {
			url : basePath + "zhyw/queryyysjfx",
			postData :{},
			handleAs : "json",
			Origin : self.location.origin,
			preventCache : true,
			withCredentials : true,
			load : function(data) {	
				layer.close(loadindex);
				store = new Memory({
					data : {
						identifier : 'dojoId',
						label : 'dojoId',
						items : data
					}
				});
				dcpjlcfxGrid.set('collection', store);
				var jint = [];
                var zuot = [];
                var qiant=[];
                var shangz=[];
                var pingj=[];
                var shangy=[];
                var shangn=[];
                var max=[];
                var min=[];
                for (var i = 0; i < data.length; i++) {
                    if(i==0){
                        jint=tjnr(data[0]);
                    }else if(i==1){
                        zuot=tjnr(data[1]);
                    }else if(i==2){
                        qiant=tjnr(data[2]);
                    }else if(i==3){
                        shangz=tjnr(data[3]);
                    }else if(i==4){
                        pingj=tjnr(data[4]);
                    }else if(i==5){
                        max=tjnr(data[5]);
                    }else if(i==6){
                        min=tjnr(data[6]);
                    }else if(i==7){
                        shangy=tjnr(data[7]);
                    }else if(i==8){
                        shangn=tjnr(data[8]);
                    }
                }
                dcpjyycsfxtb(jint,zuot,qiant,shangz,pingj,shangy,shangn,max,min);
			},
			error : function(error) {
				layer.close(loadindex);
				console.log(error);
			}
		};
		function tjnr(list){
		    var zhsz=[];
		    for(var i=0;i<24;i++){
		        if(list['y'+i]!=null){
		            zhsz.push(list['y'+i]);
		        }
		    }
		    return zhsz;
		}
		function dcpjyycsfxtb(jint,zuot,qiant,shangz,pingj,shangy,shangn,max,min){
			echart = echarts.init(document.getElementById("dcpjlcfxEchart"));
			echart.clear();
		    // 使用
		    echart.setOption({
		        title : {
		            text: '',
		            subtext: ''
		        },
		        tooltip : {
		            trigger: 'axis'
		        },
		        legend: {
		            data:['今天','昨天','前天','上周','上周平均','前半月最大','前半月最小','上月','上年']
		        },
		        toolbox: {
		            show : true,
		            feature : {
		                mark : {show: true},
		                dataView : {show: true, readOnly: false},
		                magicType : {show: true, type: ['line', 'bar']},
		                restore : {show: true},
		                saveAsImage : {show: true}
		            }
		        },		        
		        grid: {
					top: '70px',
					left: '50px',
					right: '80px',
					bottom: '60px'
				},		   
		        calculable : true,
		        xAxis : [
		            {
		                type : 'category',
		                boundaryGap : false,
		                data : ['00:00','01:00', '02:00',
		                    '03:00', '04:00', '05:00', '06:00',
		                    '07:00', '08:00', '09:00', '10:00',
		                    '11:00', '12:00', '13:00', '14:00',
		                    '15:00', '16:00', '17:00', '18:00',
		                    '19:00', '20:00', '21:00', '22:00',
		                    '23:00']
		            }
		        ],
		        yAxis : [
		            {
		                type : 'value',
		                axisLabel : {
		                    formatter: '{value}'
		                }
		            }
		        ],
		        series : [
		            {
		                name:'今天',
		                type:'line',
		                data:jint
		            },{
		                name:'昨天',
		                type:'line',
		                data:zuot
		            },{
		                name:'前天',
		                type:'line',
		                data:qiant
		            },{
		                name:'上周',
		                type:'line',
		                data:shangz
		            },{
		                name:'上周平均',
		                type:'line',
		                data:pingj
		            },{
		                name:'前半月最大',
		                type:'line',
		                data:max
		            },{
		                name:'前半月最小',
		                type:'line',
		                data:min
		            },{
		                name:'上月',
		                type:'line',
		                data:shangy
		            },{
		                name:'上年',
		                type:'line',
		                data:shangn
		            }
		        ]
		    });
		}
		return declare( null,{
			constructor:function(){
				this.initToolBar();			
				queryCondition.time=$("#dcpjlcfx-Time").val();
				queryCondition.module="dcpjlcfx";
				queryCondition.field1="ACTUAL_LOAD_MILEAGE";
				queryCondition.field2="ACTUAL_LOAD_MILEAGE";
				queryCondition.field3="ACTUAL_LOAD_MILEAGE";
				loadindex = layer.load(1);
				dojo.xhrPost(dojo.mixin(xhrArgsTabel,{"postData":'postData='+dojo.toJson(queryCondition)}));
			},
			initToolBar:function(){
				var _self = this;
				if (dcpjlcfxGrid) { dcpjlcfxGrid = null; dojo.empty('dcpjlcfxTabel') }
				dcpjlcfxGrid = new CustomGrid({ totalCount: 0, pagination: null, columns: columns,allowTextSelection: true}, 'dcpjlcfxTabel');

				$("#dcpjlcfx-Time").val(GetDateStr(0));				

				addEventComboBox('#dcpjlcfxPanel');

				query('#dcpjlcfx-Time').on('focus', function () {
					WdatePicker({
						dateFmt: STATEDATE
					});
				});
				$("#dcpjlcfx-cphm-comboBox").find('input').on('keyup',function(){
					//车牌
					clearTimeout(settime);
					settime = setTimeout(function() {
						var cpmhs=$("#dcpjlcfx-cphm-comboBox").find('input').val();
						if(cpmhs.length>2){
							findcphm2(cpmhs).then(function(data2){
								$("#dcpjlcfx-cphm-comboBox").find('.iFList').html("");
								for (var i = 0; i < data2.length; i++) {
									var cphms="<li data-value='"+data2[i].CPHM+"'>"+data2[i].CPHM+"</li>";
									$("#dcpjlcfx-cphm-comboBox").find('.iFList').append(cphms);
								}
								$('#dcpjlcfx-cphm-comboBox').find('.iFList').on('click', function () {
									event.stopPropagation();
								}).find('li').off('click').on('click', function () {
									$(this).addClass('selected').siblings('.selected').removeClass('selected');
									$("#dcpjlcfx-cphm-comboBox").find('input').data('value', $(this).data('value')).val($(this).text()).end().removeClass('selected');
									$('#dcpjlcfx-cphm-comboBox').find('input').trigger('change');
								});
							});
						}
					}, 1200)
				})
				
				query('#dcpjlcfxQuery').on('click', function () {
					queryCondition.time=$("#dcpjlcfx-Time").val();
					queryCondition.module="dcpjlcfx";
					queryCondition.field1="ACTUAL_LOAD_MILEAGE";
					queryCondition.field2="ACTUAL_LOAD_MILEAGE";
					queryCondition.field3="ACTUAL_LOAD_MILEAGE";
					loadindex = layer.load(1);
					dojo.xhrPost(dojo.mixin(xhrArgsTabel,{"postData":'postData='+dojo.toJson(queryCondition)}));
				});
				//导出
				query('#dcpjlcfxDaochu').on('click', function () {
					var postData = {};
					postData.time=$("#dcpjlcfx-Time").val();
					postData.module="dcpjlcfx";
					postData.field1="ACTUAL_LOAD_MILEAGE";
					postData.field2="ACTUAL_LOAD_MILEAGE";
					postData.field3="ACTUAL_LOAD_MILEAGE";
					url = basePath + "zhyw/queryyysjfxdc?postData="
             		+ encodeURI(encodeURI(JSON.stringify(postData))), window.open(url);
				});
			}
		})
	});