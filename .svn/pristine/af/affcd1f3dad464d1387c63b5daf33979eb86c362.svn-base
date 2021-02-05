define([ "dijit/Dialog", "dgrid/Editor", "dijit/form/Button",
		"dijit/form/DateTextBox", "dijit/form/TimeTextBox", "dijit/Menu",
		"dijit/MenuItem", "dijit/CheckedMenuItem", "dijit/MenuSeparator",
		"dijit/PopupMenuItem", "dijit/form/SimpleTextarea",
		"dijit/form/Select", "dijit/form/FilteringSelect",
		"dgrid/OnDemandGrid", "dijit/form/TextBox", "app/Pagination1",
		"dgrid/Selection", 'dgrid/Selector', "dgrid/Keyboard",
		"dgrid/extensions/ColumnResizer", "dojo/store/Memory",
		"cbtree/model/TreeStoreModel", "dstore/Memory",
		"dijit/form/NumberTextBox", "dgrid/extensions/DijitRegistry",
		"dijit/registry", "dojo/dom-style", "dojo/_base/declare",
		"dojo/dom-construct", "dojo/on", "dijit/tree/ObjectStoreModel",
		"cbtree/Tree", "cbtree/models/ForestStoreModel",
		"dojo/data/ItemFileWriteStore", "dojo/query", "app/util" ], function(
		Dialog, Editor, Button, DateTextBox, TimeTextBox, Menu, MenuItem,
		CheckedMenuItem, MenuSeparator, PopupMenuItem, SimpleTextarea, Select,
		FilteringSelect, Grid, TextBox, Pagination, Selection, Selector,
		Keyboard, ColumnResizer, Memory2, TreeStoreModel, Memory,
		NumberTextBox, DijitRegistry, registry, domStyle, declare, dc, on,
		ObjectStoreModel, Tree, ForestStoreModel, ItemFileWriteStore, query,
		util) {
	var CustomGrid = declare([DijitRegistry, Grid, Keyboard, Selection, ColumnResizer,Selector]);
	var zzddGrid = null,  pcqrGrid=null, ddwcGrid=null,ldhmGrid=null,rwcjkGrid=null,qtywGrid=null,store = null;
	var xhcddmap = null;
	var dwcenter = null;
	var lsjlxz=null;//电话历史记录选择
	var xhcddruler = null;
	var scmarker = null;
	var settime =null;
	var markerydlistener=null;//上车点marker移动监听
	var mapydlistener=null;//地图移动移动监听
	var xhcmarkerlist=[];
	var allxhc=[];
	var pMenu=null;
	/*来电号码的选择*/
	var ldhmColumns={
		checkbox: {label: '选择',selector: 'checkbox'},
		CI_ID: {label: '客户ID',renderCell:function(item){
            var type = dc.create("div", {innerHTML: item.CI_ID, style:{'text-align':'center'}});
            return type;
        }},
        CI_NAME: {label: '客户姓名',renderCell:function(item){
            var type = dc.create("div", {innerHTML: item.CI_NAME, style:{'text-align':'center'}});
            return type;
        }},
        CI_TEL: {label: '客户电话',renderCell:function(item){
            var type = dc.create("div", {innerHTML: item.CI_TEL, style:{'text-align':'center'}});
            return type;
        }},
        ADDRES_REF: {label: '参考地址',renderCell:function(item){
                var type = dc.create("div", {innerHTML: item.ADDRES_REF, style:{'text-align':'center'}});
                return type;
        }},
        ADDRESS: {label: '详细地址',renderCell:function(item){
            var type = dc.create("div", {innerHTML: item.ADDRESS, style:{'text-align':'center'}});
            return type;
        }},
        COMPL_NUM: {label: '空放总数',renderCell:function(item){
            var type = dc.create("div", {innerHTML: item.COMPL_NUM, style:{'text-align':'center'}});
            return type;
        }},
        DISP_NUM: {label: '调度总数',renderCell:function(item){
            var type = dc.create("div", {innerHTML: item.DISP_NUM, style:{'text-align':'center'}});
            return type;
        }},
        INSERT_TIME: {label: '叫车时间',renderCell:function(item){
            var type = dc.create("div", {innerHTML: util.formatYYYYMMDDHHMISS(item.INSERT_TIME), style:{'text-align':'center'}});
            return type;
        }},
        NOTE: {label: '附加信息（备注）',renderCell:function(item){
            var type = dc.create("div", {innerHTML: item.NOTE, style:{'text-align':'center'}});
            return type;
        }}
	};
	var RWCcolumns={
			RWCXH: {label: '序号',renderCell:function(item){
                var type = dc.create("div", {innerHTML: item.RWCXH, style:{'text-align':'center'}});
                return type;
            }},
            DISP_ID: {label: '业务编号',renderCell:function(item){
                var type = dc.create("div", {innerHTML: item.DISP_ID, style:{'text-align':'center'}});
                return type;
            }},
            VEHI_NO: {label: '车牌号码',renderCell:function(item){
                var type = dc.create("div", {innerHTML: item.VEHI_NO, style:{'text-align':'center'}});
                return type;
            }},
            VEHI_SIM: {label: 'SIM卡',renderCell:function(item){
                var type = dc.create("div", {innerHTML: item.VEHI_SIM, style:{'text-align':'center'}});
                return type;
            }},
            COMP_NAME: {label: '公司名称',renderCell:function(item){
                var type = dc.create("div", {innerHTML: item.COMP_NAME, style:{'text-align':'center'}});
                return type;
            }},
            SPEED: {label: '速度',renderCell:function(item){
                var type = dc.create("div", {innerHTML: item.SPEED, style:{'text-align':'center'}});
                return type;
            }},
            PX: {label: '经度',renderCell:function(item){
                var type = dc.create("div", {innerHTML: item.PX, style:{'text-align':'center'}});
                return type;
            }},
            PY: {label: '纬度',renderCell:function(item){
                var type = dc.create("div", {innerHTML: item.PY, style:{'text-align':'center'}});
                return type;
            }},
            HEADING: {label: '方向',renderCell:function(item){
                var type = dc.create("div", {innerHTML: dlwz(item.HEADING), style:{'text-align':'center'}});
                return type;
            }},
            DATETIME: {label: '定位时间',renderCell:function(item){
                var type = dc.create("div", {innerHTML: util.formatYYYYMMDDHHMISS(item.DATETIME), style:{'text-align':'center'}});
                return type;
            }}
	};
	var ZZDDcolumns = {
			ZZDDXH: {label: '序号',renderCell:function(item){
                var type = dc.create("div", {innerHTML: item.ZZDDXH, style:{'text-align':'center'}});
                return type;
            }},
            DISP_ID: {label: '业务编号',renderCell:function(item){
                var type = dc.create("div", {innerHTML: item.DISP_ID, style:{'text-align':'center'}});
                return type;
            }},
            CUST_NAME: {label: '客户姓名',renderCell:function(item){
                var type = dc.create("div", {innerHTML: item.CUST_NAME, style:{'text-align':'center'}});
                return type;
            }},
            CUST_TEL: {label: '联系电话',renderCell:function(item){
                var type = dc.create("div", {innerHTML: item.CUST_TEL, style:{'text-align':'center'}});
                return type;
            }},
            ADDRESS: {label: '上车地点',renderCell:function(item){
                var type = dc.create("div", {innerHTML: item.ADDRESS, style:{'text-align':'center'}});
                return type;
            }},
            DISP_STATE: {label: '调度状态',renderCell:function(item){
                var type = dc.create("div", {innerHTML: item.DISP_STATE, style:{'text-align':'center'}});
                return type;
            }},
			HBLX: {label: '回拨类型/状态',renderCell:function(item){
				var hblx=(item.AUTOOUTPHONE=="0"?"人工":"自动");
				var hbzt=hbzt2(item.CALL_STATE);
                var type = dc.create("div", {innerHTML: hblx+"/"+hbzt, style:{'text-align':'center'}});
                return type;
            }},
            VEHI_NO: {label: '已派车牌号',renderCell:function(item){
                var type = dc.create("div", {innerHTML: item.VEHI_NO, style:{'text-align':'center'}});
                return type;
            }},
            VEHI_SIM: {label: 'SIM卡号',renderCell:function(item){
                var type = dc.create("div", {innerHTML: item.VEHI_SIM, style:{'text-align':'center'}});
                return type;
            }},
            DISP_TIME: {label: '调度时间',renderCell:function(item){
                var type = dc.create("div", {innerHTML: util.formatYYYYMMDDHHMISS(item.DISP_TIME), style:{'text-align':'center'}});
                return type;
            }},
            DEST_ADDRESS: {label: '目的地',renderCell:function(item){
                    var type = dc.create("div", {innerHTML: item.DEST_ADDRESS, style:{'text-align':'center'}});
                    return type;
                }},
                OUTPHONE: {label: '回拨电话',renderCell:function(item){
                var type = dc.create("div", {innerHTML: item.OUTPHONE, style:{'text-align':'center'}});
                return type;
            }},
            DISP_USER: {label: '调度员',renderCell:function(item){
                var type = dc.create("div", {innerHTML: item.DISP_USER, style:{'text-align':'center'}});
                return type;
            }}
		};
		var PCQRcolumns={
				PCQRXH: {label: '序号',renderCell:function(item){
	                var type = dc.create("div", {innerHTML: item.PCQRXH, style:{'text-align':'center'}});
	                return type;
	            }},
	            DISP_ID: {label: '业务编号',renderCell:function(item){
	                var type = dc.create("div", {innerHTML: item.DISP_ID, style:{'text-align':'center'}});
	                return type;
	            }},
	            CUST_NAME: {label: '客户姓名',renderCell:function(item){
	                var type = dc.create("div", {innerHTML: item.CUST_NAME, style:{'text-align':'center'}});
	                return type;
	            }},
	            CUST_TEL: {label: '联系电话',renderCell:function(item){
	                var type = dc.create("div", {innerHTML: item.CUST_TEL, style:{'text-align':'center'}});
	                return type;
	            }},
	            ADDRESS: {label: '上车地点',renderCell:function(item){
	                var type = dc.create("div", {innerHTML: item.ADDRESS, style:{'text-align':'center'}});
	                return type;
	            }},
	            DISP_STATE: {label: '调度状态',renderCell:function(item){
	                var type = dc.create("div", {innerHTML: item.DISP_STATE, style:{'text-align':'center'}});
	                return type;
	            }},
				HBLX: {label: '回拨类型/状态',renderCell:function(item){
					var hblx=(item.AUTOOUTPHONE=="0"?"人工":"自动");
					var hbzt=hbzt2(item.CALL_STATE);
	                var type = dc.create("div", {innerHTML: hblx+"/"+hbzt, style:{'text-align':'center'}});
	                return type;
	            }},
	            VEHI_NO: {label: '已派车牌号',renderCell:function(item){
	                var type = dc.create("div", {innerHTML: item.VEHI_NO, style:{'text-align':'center'}});
	                return type;
	            }},
	            VEHI_SIM: {label: 'SIM卡号',renderCell:function(item){
	                var type = dc.create("div", {innerHTML: item.VEHI_SIM, style:{'text-align':'center'}});
	                return type;
	            }},
	            DISP_TIME: {label: '调度时间',renderCell:function(item){
	                var type = dc.create("div", {innerHTML: util.formatYYYYMMDDHHMISS(item.DISP_TIME), style:{'text-align':'center'}});
	                return type;
	            }},
	            DEST_ADDRESS: {label: '目的地',renderCell:function(item){
	                    var type = dc.create("div", {innerHTML: item.DEST_ADDRESS, style:{'text-align':'center'}});
	                    return type;
	                }},
	                OUTPHONE: {label: '回拨电话',renderCell:function(item){
	                var type = dc.create("div", {innerHTML: item.OUTPHONE, style:{'text-align':'center'}});
	                return type;
	            }},
	            DISP_USER: {label: '调度员',renderCell:function(item){
	                var type = dc.create("div", {innerHTML: item.DISP_USER, style:{'text-align':'center'}});
	                return type;
	            }}
		};
		var DDWCcolumns={
				DDWCXH: {label: '序号',renderCell:function(item){
	                var type = dc.create("div", {innerHTML: item.DDWCXH, style:{'text-align':'center'}});
	                return type;
	            }},
	            DISP_ID: {label: '业务编号',renderCell:function(item){
	                var type = dc.create("div", {innerHTML: item.DISP_ID, style:{'text-align':'center'}});
	                return type;
	            }},
	            CUST_NAME: {label: '客户姓名',renderCell:function(item){
	                var type = dc.create("div", {innerHTML: item.CUST_NAME, style:{'text-align':'center'}});
	                return type;
	            }},
	            CUST_TEL: {label: '联系电话',renderCell:function(item){
	                var type = dc.create("div", {innerHTML: item.CUST_TEL, style:{'text-align':'center'}});
	                return type;
	            }},
	            ADDRESS: {label: '上车地点',renderCell:function(item){
	                var type = dc.create("div", {innerHTML: item.ADDRESS, style:{'text-align':'center'}});
	                return type;
	            }},
	            DISP_STATE: {label: '调度状态',renderCell:function(item){
	                var type = dc.create("div", {innerHTML: item.DISP_STATE, style:{'text-align':'center'}});
	                return type;
	            }},
				HBLX: {label: '回拨类型/状态',renderCell:function(item){
					var hblx=(item.AUTOOUTPHONE=="0"?"人工":"自动");
					var hbzt=hbzt2(item.CALL_STATE);
	                var type = dc.create("div", {innerHTML: hblx+"/"+hbzt, style:{'text-align':'center'}});
	                return type;
	            }},
	            VEHI_NO: {label: '已派车牌号',renderCell:function(item){
	                var type = dc.create("div", {innerHTML: item.VEHI_NO, style:{'text-align':'center'}});
	                return type;
	            }},
	            VEHI_SIM: {label: 'SIM卡号',renderCell:function(item){
	                var type = dc.create("div", {innerHTML: item.VEHI_SIM, style:{'text-align':'center'}});
	                return type;
	            }},
	            DISP_TIME: {label: '调度时间',renderCell:function(item){
	                var type = dc.create("div", {innerHTML: util.formatYYYYMMDDHHMISS(item.DISP_TIME), style:{'text-align':'center'}});
	                return type;
	            }},
	            DEST_ADDRESS: {label: '目的地',renderCell:function(item){
	                    var type = dc.create("div", {innerHTML: item.DEST_ADDRESS, style:{'text-align':'center'}});
	                    return type;
	                }},
	            OUTPHONE: {label: '回拨电话',renderCell:function(item){
	                var type = dc.create("div", {innerHTML: item.OUTPHONE, style:{'text-align':'center'}});
	                return type;
	            }},
	            DISP_USER: {label: '调度员',renderCell:function(item){
	                var type = dc.create("div", {innerHTML: item.DISP_USER, style:{'text-align':'center'}});
	                return type;
	            }}
		};
        /*正在调度表格*/
		if (zzddGrid) { zzddGrid = null; dojo.empty('xhcddConent-zzddTable');}
		zzddGrid = new CustomGrid({ totalCount: 0, pagination: null, columns: ZZDDcolumns,allowTextSelection: true}, 'xhcddConent-zzddTable');

        /*派车确认*/
		if (pcqrGrid) { pcqrGrid = null; dojo.empty('xhcddConent-pcqrTable');}
        pcqrGrid = new CustomGrid({ totalCount: 0, pagination: null, columns: PCQRcolumns,allowTextSelection: true}, 'xhcddConent-pcqrTable');
        /*任务车监控*/
        if (rwcjkGrid) { rwcjkGrid = null; dojo.empty('xhcddConent-rwcjkTable');}
        rwcjkGrid = new CustomGrid({ totalCount: 0, pagination: null, columns: RWCcolumns,allowTextSelection: true}, 'xhcddConent-rwcjkTable');
        /*调度完成*/
        if (ddwcGrid) { ddwcGrid = null; dojo.empty('xhcddConent-ddwcTable');}
        ddwcGrid = new CustomGrid({ totalCount: 0, pagination: null, columns: DDWCcolumns,allowTextSelection: true}, 'xhcddConent-ddwcTable');
        
	return declare(null, {
		constructor : function() {
			this.initToolBar();
		},
		initToolBar : function() {
			var _self = this;

			xhcddmap = new AMap.Map('xhcddMap', {
				resizeEnable : true,
				mapStyle : 'amap://styles/normal',
				zoom : 14,
				center : [ 120.209561, 30.245278 ]
			});

			dwcenter = new AMap.Marker({
				icon : "resources/images/dwcenter.png",
				zIndex : 102,
				map : xhcddmap,
				offset : new AMap.Pixel(-16, -16),
				position : xhcddmap.getCenter()

			});
			AMap.event.addListener(xhcddmap, "moveend", function() {
				dwcenter.setPosition(xhcddmap.getCenter());
			});

			xhcddmap.plugin([ "AMap.RangingTool" ], function() {
				xhcddruler = new AMap.RangingTool(xhcddmap);
			});
			on(query('#mapcj'), 'click', function() {
				xhcddruler.turnOn();
				AMap.event.addListener(xhcddruler, "end", function() {
					xhcddruler.turnOff();
				});
			});
			on(query('#mapfd'), 'click', function() {
				xhcddmap.setZoom(xhcddmap.getZoom() + 1);
			});
			on(query('#mapsx'), 'click', function() {
				xhcddmap.setZoom(xhcddmap.getZoom() - 1);
			});
			AMapUI.loadUI([ 'misc/PoiPicker' ], function(PoiPicker) {

				var poiPicker = new PoiPicker({
					input : 'wz-comboBox'
				});
				var poiPicker2 = new PoiPicker({
					input : 'xhcddxxdz'
				});
				poiPickerReady(poiPicker);
				poiPickerReady2(poiPicker2);
			});
			function poiPickerReady(poiPicker) {
		        window.poiPicker = poiPicker;
		        poiPicker.on('poiPicked', function(poiResult) {
		        	poi = poiResult.item,
		        	dwcenter.setPosition(poi.location);
		        	yspoi = poi.location;
		        	xhcddmap.setCenter(yspoi);
		        	xhcddmap.setZoom(17);
		        	$("#wz-comboBox").val(poi.name);
		        });
		    }
			function poiPickerReady2(poiPicker2) {
		        window.poiPicker = poiPicker2;
		        poiPicker2.on('poiPicked', function(poiResult) {
		        	if(scmarker){xhcddmap.remove(scmarker);}
		        	scmarker = new AMap.Marker({
			        	icon: "resources/images/start.png",
			        	zIndex:102,
			        	offset : new AMap.Pixel(-16,-32),
			            draggable:true
			        });
		        	poi = poiResult.item,
		        	scmarker.setMap(xhcddmap);
		        	scmarker.setPosition(poi.location);
		        	yspoi = poi.location;
		        	xhcddmap.setCenter(yspoi);
		        	xhcddmap.setZoom(17);
		        	$("#xhcddxxdz").val(poi.name);
		        	markerydlistener = AMap.event.addListener(scmarker,"dragend",function(){
		        		xhcddmap.setCenter(scmarker.getPosition());
		        		_self.getDdxxdz();
				    });
		        });
			}
			//车辆监控查询车辆
			addEventComboBox('#xhcdd-borderContainer');
			
			//车辆监控
			$(".cljkul").bind("contextmenu", function(){
			    return false;
			});
			on(query('#cljkbtn'), 'click', function () {
				var tempcar= $("#cljktext").val();
				if($("#cljktext").val()==""){
					layer.msg("请选择车牌号码！");
					return;
				}
				
				for (var i = 0; i < xhcmarkerlist.length; i++) {
					if(xhcmarkerlist[i].cp == tempcar){
						xhcddmap.setZoom(16);
						xhcddmap.setCenter(xhcmarkerlist[i].getPosition());
						xhcmarkerlist[i].infoWindow.open(xhcddmap, xhcmarkerlist[i].getPosition());
						break;
					}
				}
            });
			$('#zyxx-qdxx span').click(function () {
//				console.log(this);
                $(this).siblings('.selected').removeClass('selected').removeClass('click');
                $(this).addClass('selected').addClass('click');
            });
            $('#qdxx').click(function () {
                $('.qdxx').removeClass('hide');
                $('.jkxx').addClass('hide');
            });
            $('#jkxx').click(function () {
                $('.jkxx').removeClass('hide');
                $('.qdxx').addClass('hide');
            });
            $(".jkxx").mousedown(function(e) {
			    if (3 == e.which) {
			        $(".jkxx").html("");
			    }
			});
			setInterval(function(){
				_self.xhcddxx();
             },30000);
            setTimeout(function(){
            	_self.xhcddxx();
    			_self.findywd();
			},500);
			
			/*来电号码的选择*/
            on(query('#ldhm_xz'), 'click', function () {
            	 _self.ldjl($("#xhcddldhm").val());
                xhcddDialogPanel.set('href', 'app/html/ddxpt/compile/ldhm_xz.html');
                xhcddDialog.show().then(function() {
                    $('#xhcddDialogPanel').removeAttr('style');
                    xhcddDialog.set('title', '选择客户');
                    setTimeout(function() {
                        if (ldhmGrid) { ldhmGrid = null; dojo.empty('ldhmTable');}
                        ldhmGrid = new CustomGrid({ totalCount: 0, pagination: null, columns: ldhmColumns}, "ldhmTable");
                        store = new Memory({data: {identifier: 'CI_ID', label: 'CI_ID', items: lsjlxz}});
                        ldhmGrid.set('collection', store);
                        $('.panel-conterBar').show();
                        
                        //新用户
                        on(query('#xddxyh'), 'click', function () {
                        	var postData={};
                        	postData.dh = $("#xhcddldhm").val();
                        	postData.xm = $("#xhcddckxm").val();
                        	addxyh(postData).then(function(data){
                        		xhcddDialog.hide();
                        		if(data.msg=="1"){
    	                			layer.msg('生成新用户成功！');
    	                		}else if(data.msg=="2"){
    	                			layer.msg('该用户已经存在！');
    	                		}else{
    	                			layer.msg('生成新用户失败！');
    	                		}
                        	});
                        });
                        on(query('#xddxzyh'), 'click', function () {
                        	var hs=0;
                        	var postData={};
            	        	dojo.forEach(ldhmGrid.collection.data, function(item,index) {
            					if (ldhmGrid.isSelected(item)) {
            						hs++;
            						postData=item;
            					}
            				});
            				if(hs==0){
            					layer.msg("请选择一条数据！");
            				}else if(hs>1){
            					layer.msg("只能选择一条数据！");
            				}else{
            					edityh(postData).then(function(data){
                            		xhcddDialog.hide();
                            		if(data.msg=="1"){
        	                			layer.msg('更新用户成功！');
        	                		}else{
        	                			layer.msg('更新用户失败！');
        	                		}
                            	});
            				}
                        });
                        
                        //xiugai
                        ldhmGrid.on('.dgrid-row:dblclick', function(event) {
    						var row = ldhmGrid.row(event);
    						$("#xhcddhbdh").val($("#xhcddldhm").val());
    						$("#xhcddckxm").val(row.data.CI_NAME);//乘客姓名
    	                	$("#xhcddxxdz").val(row.data.ADDRESS);//详细地址
//    	                	$("#xddszqy").val(row.data.CI_NAME);//所在区域
    	                	$("#xhcddmddd").val(row.data.DEST_ADDRESS);//目的地点
    	                	$("#xhcddfjxx").val(row.data.NOTE);//附加信息
    	                	if(scmarker){map.remove(scmarker);}
				        	scmarker = new AMap.Marker({
				        		icon: "resources/images/start.png",
					            position: [row.data.LONGI,row.data.LATI],
					            map : xhcddmap,
					            zIndex:102,
					            offset : new AMap.Pixel(-16,-32),
					            draggable:true
					        });
				        	xhcddmap.setCenter(scmarker.getPosition());
				        	markerydlistener = AMap.event.addListener(scmarker,"dragend",function(){
				        		xhcddmap.setCenter(scmarker.getPosition());
				        		_self.getDdxxdz();
						    });
    	                	xhcddDialog.hide();
                        });
                    }, 100);
                });
            });
            //调度清空
            on(query('#xhcddclearbtn'), 'click', function () {
            	xhcddjsobj.clearDD();
            });
            /*调度按钮--点击调度*/
            on(query('#xhcddbtn'), 'click', function () {
            	var jd="",wd="";
            	if(scmarker){
            		jd = scmarker.getPosition().getLng();
            		wd = scmarker.getPosition().getLat();
            	}
            	var cmd = 1;//命令号
            	var xddqqid = createqqid();//请求编号
            	var xddldhm = $("#xhcddldhm").val();//来电号码
            	var xddhbdh = $("#xhcddhbdh").val();//回拨电话
            	var xddzdhb = 1;//是否自动回拨
            	var xddckxm = $("#xhcddckxm").val();//乘客姓名
            	var xddxxdz = $("#xhcddxxdz").val();//详细地址
            	var xddszqy = $("#xhcddszqy").val();//所在区域
            	var xddmddd = $("#xhcddmddd").val();//目的地点
            	var xddfjxx = $("#xhcddfjxx").val();//附加信息
            	var xddpx = jd;//上车经度
            	var xddpy = wd;//上车纬度
            	var xddlx = $("#xhcddywlx").val();//调度业务类型
            	var xddcx = $("#xhcddcx").val();//调度业务类型
            	var xddddfw = $("#xhcddddfw").val().replace('km','');//调度范围
            	var postData={};
            	
            	if(xddldhm==""){layer.msg("没有来电号码！");return;}
            	if(xddpx==""){layer.msg("没有设置上车位置！");return;}
            	if(xddxxdz==""){layer.msg("请输入详细地址！");return;}
            	if(xddmddd==""){layer.msg("请输入目的地！");return;}
            	if(xddckxm==""){layer.msg("请输入乘客姓名！");return;}
            	if(xddfjxx==""){layer.msg("请输入附加信息！");return;}
            	
            	postData.cmd=cmd;
            	postData.cksj=xddldhm;
            	postData.scjd=xddpx;
            	postData.scwd=xddpy;
            	postData.qq_id=xddqqid;
            	postData.scdz=xddxxdz;
            	postData.mdd=xddmddd;
            	postData.yhm=xddckxm;
            	postData.xb=0;
            	postData.fjxx=xddfjxx;
            	postData.cllx=xddcx;
            	postData.ycsj="";
            	postData.ywlx=xddlx;
            	postData.ci_id="";
            	postData.disp_user=username;
            	postData.yclx="电话约车";
            	postData.wbdh=xddhbdh;
            	postData.ddfw=xddddfw;
            	postData.disp_id="";
            	postData.zdwb=xddzdhb;
            	postData.fsbz=9;
            	postData.cxdd="0";
            	xdd(postData);
            });
            
          //生成
            on(query('#xhcddscbtn'), 'click', function () {
            	var hmdxx={};
            	if($("#xhcddckxm").val()==""||$("#xhcddldhm").val()==""){
            		layer.alert('请输入来电号码和乘客姓名！', {
            			closeBtn: 0
            		  });
            	}else{
                	hmdxx.custname=$("#xhcddckxm").val();
                	hmdxx.custtel=$("#xhcddldhm").val();
                	createHMD(hmdxx).then(function(data){
                		if(data.msg=="1"){
                			layer.msg('生成成功！');
                			$("#xhcddckxm").val("");
                			$("#xhcddldhm").val("");
                		}else{
                			layer.msg('生成失败！');
                		}
                	});
            	}
            });
          //查询业务单
            query('#btn_find').on('click',function () {
                _self.findywd();
            });
            
            zzddGrid.on('.dgrid-row:dblclick', function(event) {
            	var row = zzddGrid.row(event);
            	if(row.data.VEHI_NO!=""&&row.data.VEHI_NO!=null){
            		var tempcar = row.data.VEHI_NO;
            		xhcddjsobj.ddcldw(tempcar);
            	}
            });
            pcqrGrid.on('.dgrid-row:dblclick', function(event) {
            	var row = pcqrGrid.row(event);
            	if(row.data.VEHI_NO!=""&&row.data.VEHI_NO!=null){
            		var tempcar = row.data.VEHI_NO;
            		xhcddjsobj.ddcldw(tempcar);
            	}
            });
            ddwcGrid.on('.dgrid-row:dblclick', function(event) {
            	var row = ddwcGrid.row(event);
            	if(row.data.VEHI_NO!=""&&row.data.VEHI_NO!=null){
            		var tempcar = row.data.VEHI_NO;
            		xhcddjsobj.ddcldw(tempcar);
            	}
            });
            rwcjkGrid.on('.dgrid-row:dblclick', function(event) {
            	var row = rwcjkGrid.row(event);
            	if(row.data.VEHI_NO!=""&&row.data.VEHI_NO!=null){
            		var tempcar = row.data.VEHI_NO;
            		xhcddjsobj.ddcldw(tempcar);
            	}
            });
            //正在调度右键菜单关闭
            zzddGrid.on('.dgrid-row:click', function(event) {
            	if(pMenu){
            		dijit.popup.close(pMenu); 
            	}
            });
            //派车确认右键菜单关闭
            pcqrGrid.on('.dgrid-row:click', function(event) {
            	if(pMenu){
            		dijit.popup.close(pMenu); 
            	}
            });
            //调度完成右键菜单关闭
            ddwcGrid.on('.dgrid-row:click', function(event) {
            	if(pMenu){
            		dijit.popup.close(pMenu); 
            	}
            });
            //调度完成右键菜单
            ddwcGrid.on('.dgrid-row:contextmenu', function(event) {
            	event.preventDefault(); 
				var row = ddwcGrid.row(event);
//				console.log(row);
				pMenu = new Menu({
                    targetNodeIds: ["xhcddConent-ddwcTable-row-"+row.id]
                });
                pMenu.addChild(new MenuItem({
                    label: "拷贝信息(新增调度)",
                    onClick: function(){_self.kbxx(row.data);}
                }));
                pMenu.addChild(new MenuItem({
                    label: "解除锁车",
                    onClick: function(){_self.jcsc(row.data);}
                }));
                pMenu.addChild(new MenuSeparator());
                pMenu.addChild(new MenuItem({
                    label: "发送消息",
                    onClick: function(){_self.fsxx(row.data);}
                }));
                pMenu.addChild(new MenuSeparator());
//                var pSubMenu1 = new Menu();
//                var pSubMenu11 = new Menu();
//                var pSubMenu111 = new Menu();
//                var pSubMenu12 = new Menu();
//                var pSubMenu13 = new Menu();
//                pSubMenu111.addChild(new MenuItem({
//                    label: "     0",
//                    onClick: function(){_self.jfgl_wjdkr(row.data,0,1);}
//                }));
//                pSubMenu111.addChild(new MenuItem({
//                    label: "     1",
//                    onClick: function(){_self.jfgl_wjdkr(row.data,1,1);}
//                }));
//                pSubMenu111.addChild(new MenuItem({
//                    label: "     3",
//                    onClick: function(){_self.jfgl_wjdkr(row.data,3,1);}
//                }));
//                pSubMenu11.addChild(new PopupMenuItem({
//                    label: "乘客原因",
//                    popup: pSubMenu111
//                }));
//               
//                pSubMenu11.addChild(new MenuItem({
//                    label: "技术原因",
//                    onClick: function(){_self.jfgl_wjdkr(row.data,0,2);}
//                }));
//                pSubMenu11.addChild(new MenuItem({
//                    label: "服务原因",
//                    onClick: function(){_self.jfgl_wjdkr(row.data,0,3);}
//                }));
//                pSubMenu11.addChild(new MenuItem({
//                    label: "其他",
//                    onClick: function(){_self.jfgl_wjdkr(row.data,0,4);}
//                }));
//                pSubMenu1.addChild(new PopupMenuItem({
//                    label: "未接到客人",
//                    popup: pSubMenu11
//                }));
//                pSubMenu12.addChild(new MenuItem({
//                    label: "0",
//                    onClick: function(){_self.jfgl_wjdkr(row.data,0,5);}
//                }));
//                pSubMenu12.addChild(new MenuItem({
//                    label: "-1",
//                    onClick: function(){_self.jfgl_wjdkr(row.data,1,5);}
//                }));
//                pSubMenu12.addChild(new MenuItem({
//                    label: "-3",
//                    onClick: function(){_self.jfgl_wjdkr(row.data,3,5);}
//                }));
//                pSubMenu1.addChild(new PopupMenuItem({
//                    label: "接错客人",
//                    popup: pSubMenu12
//                }));
//                pSubMenu1.addChild(new MenuItem({
//                    label: "客人投诉",
//                    onClick: function(){_self.jfgl_wjdkr(row.data,0,6);}
//                }));
//                pSubMenu1.addChild(new MenuSeparator());
//                pSubMenu13.addChild(new MenuItem({
//                    label: "0",
//                    onClick: function(){_self.jfgl_wjdkr(row.data,0,7);}
//                }));
//                pSubMenu13.addChild(new MenuItem({
//                    label: "-1",
//                    onClick: function(){_self.jfgl_wjdkr(row.data,1,7);}
//                }));
//                pSubMenu13.addChild(new MenuItem({
//                    label: "-3",
//                    onClick: function(){_self.jfgl_wjdkr(row.data,3,7);}
//                }));
//                pSubMenu1.addChild(new PopupMenuItem({
//                    label: "不去接客人",
//                    popup: pSubMenu13
//                }));
//                pSubMenu1.addChild(new MenuItem({
//                    label: "其他"
//                }));
//                pMenu.addChild(new PopupMenuItem({
//                    label: "积分管理(业务生成)",
//                    popup: pSubMenu1
//                }));
//                var pSubMenu2 = new Menu();
//                pSubMenu2.addChild(new MenuItem({
//                    label: "生成回程",
//                    onClick: function(){_self.schc(row.data);}
//                }));
//                pMenu.addChild(new PopupMenuItem({
//                    label: "业务生成",
//                    popup: pSubMenu2
//                }));
//                pMenu.addChild(new MenuSeparator());
                pMenu.addChild(new MenuItem({
                    label: "短信通知",
                    onClick: function(){_self.dxtz(row.data);}
                }));
                pMenu.addChild(new MenuSeparator());
                pMenu.addChild(new MenuItem({
                    label: "复制",
                    onClick: function(){document.execCommand("Copy");dijit.popup.close(pMenu);}
                }));
//                pMenu.addChild(new MenuSeparator());
//                pMenu.addChild(new MenuItem({
//                    label: "删除显示"
//                }));
//                pMenu.addChild(new MenuItem({
//                    label: "Menu Item With an icon",
//                    iconClass: "dijitEditorIcon dijitEditorIconCut",
//                    onClick: function(){alert('i was clicked')}
//                }));
               
                dijit.popup.moveOffScreen(pMenu); 
                if(pMenu.startup && !pMenu._started){ 
                      pMenu.startup(); 
                } 
              dijit.popup.open({popup: pMenu, x: event.pageX, y: event.pageY}); 
			});
          //派车确认右键菜单
            pcqrGrid.on('.dgrid-row:contextmenu', function(event) {
            	event.preventDefault(); 
				var row = pcqrGrid.row(event);
				pMenu = new Menu({
                    targetNodeIds: ["xhcddConent-pcqrTable-row-"+row.id]
                });
                pMenu.addChild(new MenuItem({
                    label: "拷贝信息(新增调度)",
                    onClick: function(){_self.kbxx(row.data);}
                }));
                pMenu.addChild(new MenuItem({
                    label: "手动复位(取消用车)",
                    onClick: function(){_self.qxdd(row.data);}
                }));
                pMenu.addChild(new MenuItem({
                    label: "调度完成",
                    onClick: function(){_self.ddwc(row.data);}
                }));
                pMenu.addChild(new MenuItem({
                    label: "解除锁车",
                    onClick: function(){_self.jcsc(row.data);}
                }));
                pMenu.addChild(new MenuSeparator());
                pMenu.addChild(new MenuItem({
                    label: "发送消息",
                    onClick: function(){_self.fsxx(row.data);}
                }));
                pMenu.addChild(new MenuSeparator());
//                var pSubMenu1 = new Menu();
//                var pSubMenu11 = new Menu();
//                var pSubMenu111 = new Menu();
//                var pSubMenu12 = new Menu();
//                var pSubMenu13 = new Menu();
//                pSubMenu111.addChild(new MenuItem({
//                    label: "     0",
//                    onClick: function(){_self.jfgl_wjdkr(row.data,0,1);}
//                }));
//                pSubMenu111.addChild(new MenuItem({
//                    label: "     1",
//                    onClick: function(){_self.jfgl_wjdkr(row.data,1,1);}
//                }));
//                pSubMenu111.addChild(new MenuItem({
//                    label: "     3",
//                    onClick: function(){_self.jfgl_wjdkr(row.data,3,1);}
//                }));
//                pSubMenu11.addChild(new PopupMenuItem({
//                    label: "乘客原因",
//                    popup: pSubMenu111
//                }));
//               
//                pSubMenu11.addChild(new MenuItem({
//                    label: "技术原因",
//                    onClick: function(){_self.jfgl_wjdkr(row.data,0,2);}
//                }));
//                pSubMenu11.addChild(new MenuItem({
//                    label: "服务原因",
//                    onClick: function(){_self.jfgl_wjdkr(row.data,0,3);}
//                }));
//                pSubMenu11.addChild(new MenuItem({
//                    label: "其他",
//                    onClick: function(){_self.jfgl_wjdkr(row.data,0,4);}
//                }));
//                pSubMenu1.addChild(new PopupMenuItem({
//                    label: "未接到客人",
//                    popup: pSubMenu11
//                }));
//                pSubMenu12.addChild(new MenuItem({
//                    label: "0",
//                    onClick: function(){_self.jfgl_wjdkr(row.data,0,5);}
//                }));
//                pSubMenu12.addChild(new MenuItem({
//                    label: "-1",
//                    onClick: function(){_self.jfgl_wjdkr(row.data,1,5);}
//                }));
//                pSubMenu12.addChild(new MenuItem({
//                    label: "-3",
//                    onClick: function(){_self.jfgl_wjdkr(row.data,3,5);}
//                }));
//                pSubMenu1.addChild(new PopupMenuItem({
//                    label: "接错客人",
//                    popup: pSubMenu12
//                }));
//                pSubMenu1.addChild(new MenuItem({
//                    label: "客人投诉",
//                    onClick: function(){_self.jfgl_wjdkr(row.data,0,6);}
//                }));
//                pSubMenu1.addChild(new MenuSeparator());
//                pSubMenu13.addChild(new MenuItem({
//                    label: "0",
//                    onClick: function(){_self.jfgl_wjdkr(row.data,0,7);}
//                }));
//                pSubMenu13.addChild(new MenuItem({
//                    label: "-1",
//                    onClick: function(){_self.jfgl_wjdkr(row.data,1,7);}
//                }));
//                pSubMenu13.addChild(new MenuItem({
//                    label: "-3",
//                    onClick: function(){_self.jfgl_wjdkr(row.data,3,7);}
//                }));
//                pSubMenu1.addChild(new PopupMenuItem({
//                    label: "不去接客人",
//                    popup: pSubMenu13
//                }));
//                pSubMenu1.addChild(new MenuItem({
//                    label: "其他"
//                }));
//                pMenu.addChild(new PopupMenuItem({
//                    label: "积分管理(业务生成)",
//                    popup: pSubMenu1
//                }));
//                var pSubMenu2 = new Menu();
//                pSubMenu2.addChild(new MenuItem({
//                    label: "生成回程",
//                    onClick: function(){_self.schc(row.data);}
//                }));
//                pMenu.addChild(new PopupMenuItem({
//                    label: "业务生成",
//                    popup: pSubMenu2
//                }));
                pMenu.addChild(new MenuSeparator());
                pMenu.addChild(new MenuItem({
                    label: "电话外拨",
                    onClick: function(){_self.dhwb(row.data);}
                }));
                pMenu.addChild(new MenuItem({
                    label: "短信通知",
                    onClick: function(){_self.dxtz(row.data);}
                }));
                pMenu.addChild(new MenuSeparator());
                pMenu.addChild(new MenuItem({
                    label: "复制",
                    onClick: function(){document.execCommand("Copy");dijit.popup.close(pMenu);}
                }));
                dijit.popup.moveOffScreen(pMenu); 
                if(pMenu.startup && !pMenu._started){ 
                      pMenu.startup(); 
                } 
              dijit.popup.open({popup: pMenu, x: event.pageX, y: event.pageY}); 
			});
            //正在调度右键菜单
            zzddGrid.on('.dgrid-row:contextmenu', function(event) {
            	event.preventDefault(); 
				var row = zzddGrid.row(event);
				pMenu = new Menu({
                    targetNodeIds: ["xhcddConent-zzddTable-row-"+row.id]
                });
                pMenu.addChild(new MenuItem({
                    label: "拷贝信息(新增调度)",
                    onClick: function(){_self.kbxx(row.data);}
                }));
                pMenu.addChild(new MenuItem({
                    label: "重新调度",
                    onClick: function(){_self.cxdd(row.data);}
                }));
                pMenu.addChild(new MenuItem({
                    label: "手动复位(取消用车)",
                    onClick: function(){_self.qxdd(row.data);}
                }));
                pMenu.addChild(new MenuItem({
                    label: "调度完成",
                    onClick: function(){_self.ddwc(row.data);}
                }));
                pMenu.addChild(new MenuItem({
                    label: "解除锁车",
                    onClick: function(){_self.jcsc(row.data);}
                }));
                pMenu.addChild(new MenuSeparator());
                pMenu.addChild(new MenuItem({
                    label: "发送消息",
                    onClick: function(){_self.fsxx(row.data);}
                }));
                pMenu.addChild(new MenuItem({
                    label: "手动催单",
                    onClick: function(){_self.sdcd(row.data);}
                }));
//                pMenu.addChild(new MenuSeparator());
//                var pSubMenu1 = new Menu();
//                var pSubMenu11 = new Menu();
//                var pSubMenu111 = new Menu();
//                var pSubMenu12 = new Menu();
//                var pSubMenu13 = new Menu();
//                pSubMenu111.addChild(new MenuItem({
//                    label: "     0",
//                    onClick: function(){_self.jfgl_wjdkr(row.data,0,1);}
//                }));
//                pSubMenu111.addChild(new MenuItem({
//                    label: "     1",
//                    onClick: function(){_self.jfgl_wjdkr(row.data,1,1);}
//                }));
//                pSubMenu111.addChild(new MenuItem({
//                    label: "     3",
//                    onClick: function(){_self.jfgl_wjdkr(row.data,3,1);}
//                }));
//                pSubMenu11.addChild(new PopupMenuItem({
//                    label: "乘客原因",
//                    popup: pSubMenu111
//                }));
//               
//                pSubMenu11.addChild(new MenuItem({
//                    label: "技术原因",
//                    onClick: function(){_self.jfgl_wjdkr(row.data,0,2);}
//                }));
//                pSubMenu11.addChild(new MenuItem({
//                    label: "服务原因",
//                    onClick: function(){_self.jfgl_wjdkr(row.data,0,3);}
//                }));
//                pSubMenu11.addChild(new MenuItem({
//                    label: "其他",
//                    onClick: function(){_self.jfgl_wjdkr(row.data,0,4);}
//                }));
//                pSubMenu1.addChild(new PopupMenuItem({
//                    label: "未接到客人",
//                    popup: pSubMenu11
//                }));
//                pSubMenu12.addChild(new MenuItem({
//                    label: "0",
//                    onClick: function(){_self.jfgl_wjdkr(row.data,0,5);}
//                }));
//                pSubMenu12.addChild(new MenuItem({
//                    label: "-1",
//                    onClick: function(){_self.jfgl_wjdkr(row.data,1,5);}
//                }));
//                pSubMenu12.addChild(new MenuItem({
//                    label: "-3",
//                    onClick: function(){_self.jfgl_wjdkr(row.data,3,5);}
//                }));
//                pSubMenu1.addChild(new PopupMenuItem({
//                    label: "接错客人",
//                    popup: pSubMenu12
//                }));
//                pSubMenu1.addChild(new MenuItem({
//                    label: "客人投诉",
//                    onClick: function(){_self.jfgl_wjdkr(row.data,0,6);}
//                }));
//                pSubMenu1.addChild(new MenuSeparator());
//                pSubMenu13.addChild(new MenuItem({
//                    label: "0",
//                    onClick: function(){_self.jfgl_wjdkr(row.data,0,7);}
//                }));
//                pSubMenu13.addChild(new MenuItem({
//                    label: "-1",
//                    onClick: function(){_self.jfgl_wjdkr(row.data,1,7);}
//                }));
//                pSubMenu13.addChild(new MenuItem({
//                    label: "-3",
//                    onClick: function(){_self.jfgl_wjdkr(row.data,3,7);}
//                }));
//                pSubMenu1.addChild(new PopupMenuItem({
//                    label: "不去接客人",
//                    popup: pSubMenu13
//                }));
//                pSubMenu1.addChild(new MenuItem({
//                    label: "其他"
//                }));
//                pMenu.addChild(new PopupMenuItem({
//                    label: "积分管理(业务生成)",
//                    popup: pSubMenu1
//                }));
//                var pSubMenu2 = new Menu();
//                pSubMenu2.addChild(new MenuItem({
//                    label: "生成回程",
//                    onClick: function(){_self.schc(row.data);}
//                }));
//                pMenu.addChild(new PopupMenuItem({
//                    label: "业务生成",
//                    popup: pSubMenu2
//                }));
                pMenu.addChild(new MenuSeparator());
                pMenu.addChild(new MenuItem({
                    label: "电话外拨",
                    onClick: function(){_self.dhwb(row.data);}
                }));
                pMenu.addChild(new MenuItem({
                    label: "短信通知",
                    onClick: function(){_self.dxtz(row.data);}
                }));
                pMenu.addChild(new MenuItem({
                    label: "电话通知",
                    onClick: function(){_self.dhtz(row.data);}
                }));
                pMenu.addChild(new MenuSeparator());
                pMenu.addChild(new MenuItem({
                    label: "复制",
                    onClick: function(){document.execCommand("Copy");dijit.popup.close(pMenu);}
                }));
                dijit.popup.moveOffScreen(pMenu); 
                if(pMenu.startup && !pMenu._started){ 
                      pMenu.startup(); 
                } 
              dijit.popup.open({popup: pMenu, x: event.pageX, y: event.pageY}); 
			});
            query('#xhcdd-topContentPane a').on('click', function() {
				//$(this).addClass('selected').siblings('.selected').removeClass('selected');
				var dqyyzt = $(this).find('span').html();
				if(dqyyzt=="置忙"){
					
					ZhimangAUX();
					$(this).addClass('selected').siblings('.selected').removeClass('selected');
				}else if(dqyyzt=="置闲"){
					SendAvailable();
					$(this).addClass('selected').siblings('.selected').removeClass('selected');
				}else if(dqyyzt=="接机"){
					
				}else if(dqyyzt=="挂机"){
					
				}else if(dqyyzt=="登录"){
					console.log(CTIProxy);
					SendLogin();
				}else if(dqyyzt=="外拨"){
					dhwbDialogPanel.set('href', 'app/html/xhcdd/editor/dhwbEditor.html');
	                $('#dhwbDialogPanel').removeAttr('style');
	                dhwbDialog.show().then(function () {
	                	
	                	$("#dhwbEditor-dhhm").val("");
	                	dhwbDialog.set('title', '电话外拨');

	                	$("#dhwbEditor-dhhm").unbind('keydown').on('keydown',function(event) {
	                        var eve=event ? event : window.event;  
	                        if(eve.keyCode==13){  
	                        	var dh = $("#dhwbEditor-dhhm").val();
			                	if(dh==""){
			                		layer.msg("请输入外拨电话号码！");
			                	}else{
			                		SendMakeCall(dh);
			                		dhwbDialog.hide();
			                	}
	                        }  
	                    });
	                	
	                	$("#dhwbEditor-qued").click(function(){
	                		var dh = $("#dhwbEditor-dhhm").val();
		                	if(dh==""){
		                		layer.msg("请输入外拨电话号码！");
		                	}else{
		                		SendMakeCall(dh);
		                		dhwbDialog.hide();
		                	}
	                	});
	                });
				}else if(dqyyzt=="呼叫保持"){
					ContinueCall();
				}else if(dqyyzt=="恢复"){
					CompleteCall();
				}else if(dqyyzt=="呼叫转移"){
					
				}else if(dqyyzt=="会议"){
					dhwbDialogPanel.set('href', 'app/html/xhcdd/editor/dhwbEditor.html');
	                $('#dhwbDialogPanel').removeAttr('style');
	                dhwbDialog.show().then(function () {
	                	$("#dhwbEditor-dhhm").val("");
	                	dhwbDialog.set('title', '会议');
	                	$("#dhwbEditor-dhhm").unbind('keydown').on('keydown',function(event) {
	                        var eve=event ? event : window.event;  
	                        if(eve.keyCode==13){  
	                        	var dh = $("#dhwbEditor-dhhm").val();
			                	if(dh==""){
			                		layer.msg("请输入会议电话号码！");
			                	}else{
			                		SendBeginConference(dh);
			                		dhwbDialog.hide();
			                	}
	                        }  
	                    });
	                	$("#dhwbEditor-qued").click(function(){
	                		var dh = $("#dhwbEditor-dhhm").val();
		                	if(dh==""){
		                		layer.msg("请输入会议电话号码！");
		                	}else{
		                		SendBeginConference(dh);
		                		dhwbDialog.hide();
		                	}
	                	});
	                });
				}else if(dqyyzt=="会议完成"){
					SendCompleteConference();
				}else if(dqyyzt=="会议取消"){
					SendCancelConference();
				}
			});
            
		},
		ddcldw :function(tempcar){
			for (var i = 0; i < xhcmarkerlist.length; i++) {
				if(xhcmarkerlist[i].cp == tempcar){
					xhcmarkerlist[i].infoWindow.open(xhcddmap, xhcmarkerlist[i].getPosition());
					xhcddmap.setZoom(16);
					xhcddmap.setCenter(xhcmarkerlist[i].getPosition());
					break;
				}
			}
		},
		findywd:function(){
			 var ywdcp=$("#xhcddywcp").val();
             var ywdbh=$("#xhcddywbh").val();
		    queryOrder(ywdcp,ywdbh).then(function(data){
//		    	console.log(data);
		    	zzddGrid.set('minRowsPerPage',999);
		    	pcqrGrid.set('minRowsPerPage',999);
		    	ddwcGrid.set('minRowsPerPage',999);
		    	rwcjkGrid.set('minRowsPerPage',999);
                zzddGrid.set('collection', new Memory({data: {identifier: 'ZZDDXH', label: 'ZZDDXH', items: data.zzdd}}));
                pcqrGrid.set('collection', new Memory({data: { identifier: 'PCQRXH', label: 'PCQRXH', items: data.pcqr}}));
                ddwcGrid.set('collection', new Memory({data: { identifier: 'DDWCXH', label: 'DDWCXH', items: data.ddwc}}));
                rwcjkGrid.set('collection', new Memory({data: { identifier: 'RWCXH', label: 'RWCXH', items: data.rwc}}));
                setTimeout(function(){
                	$("#xhcddConent-tabContainer_tablist_zzddtitle").html("正在调度("+data.zzdd.length+")");
                	$("#xhcddConent-tabContainer_tablist_pcqrtitle").html("派车确认("+data.pcqr.length+")");
                	$("#xhcddConent-tabContainer_tablist_ddwctitle").html("调度完成("+data.ddwc.length+")");
                	$("#xhcddConent-tabContainer_tablist_rwcjktitle").html("任务车监控("+data.rwc.length+")");
//                	rwcdata = data.rwc;
                },500);
		    });
		},
		xhcddxx : function(){
			xhcdddw().then(function(data){
				xhcmarkerlist=[];
				allxhc = data;
				$("#car-comboBox").find('.iFList').html("");
				for (var i = 0; i < data.length; i++) {
					var cphms="<li data-value='"+data[i].VEHI_NO+"'>"+data[i].VEHI_NO+"</li>";
					$("#car-comboBox").find('.iFList').append(cphms);
					xhcddjsobj.addmarker(data[i]);
					$(".jkxx").prepend("<p class=''>"+data[i].VEHI_NO+"-"+data[i].PX+","+data[i].PY+"-"+dlwz(data[i].HEADING)+"</p>");
				}
				$('#car-comboBox').find('.iFList').on('click', function () {
					if (event.stopPropagation){event.stopPropagation();}else if (window.event) {window.event.cancelBubble = true;}
				}).find('li').off('click').on('click', function () {
					$(this).addClass('selected').siblings('.selected').removeClass('selected');
					$("#car-comboBox").find('input').data('value', $(this).data('value')).val($(this).text()).end().removeClass('selected');
				});
//				xhcddmap.setFitView();
//				xhcddmap.setZoom(11);
			});
		},
		addmarker : function(data){
//			console.log(data);
			var icon = gettb(data,2); 
    		var marker = new AMap.Marker({
                position: [data.PX, data.PY],
                offset : new AMap.Pixel(-10,-10),
                icon:icon,
                zIndex:101,
                map : xhcddmap
            });
    		//信息窗口
    		var title = '车牌号码：<span style="font-size:11px;color:#278ac4;">'+data.VEHI_NO+'</span>',
            content = [];
	        content.push("时间："+data.DATETIME);
	        content.push("速度："+data.SPEED);//+"   状态："+kzc(data.STATE));
	        content.push("Sim卡号："+data.VEHI_SIM);
	        content.push("终端类型："+data.MT_NAME);
	        content.push(" 车型："+data.VT_NAME);
	        content.push("车主电话："+data.OWN_TEL);
	        content.push("车主姓名："+data.OWN_NAME);
	        content.push("公司："+data.COMP_NAME);
	        content.push("<hr/>&nbsp;&nbsp;<a href='javascript:void(0)' class='xxfs'>信息发送</a>"+"&nbsp;&nbsp;<a href='javascript:void(0)' class='bdcz'>拨打车载</a>");
	        var infoWindow = new AMap.InfoWindow({
	            isCustom: true,  //使用自定义窗体
	            content: createInfoWindow(title, content.join("<br/>")),
	            offset: new AMap.Pixel(15, -23)
	        });
	        marker.infoWindow = infoWindow;
	        marker.cp = data.VEHI_NO;
	        marker.clxx = data;
	        AMap.event.addListener(marker, 'click', function() {
	        	this.infoWindow.open(xhcddmap, this.getPosition());
	        	xhcddjsobj.setczbtn(this.clxx);
	        });
	        xhcmarkerlist.push(marker);
	        
		},
		setczbtn :function(json){
			setTimeout(function(){
            	//拨打车载
            	$(".bdcz").click(function(){
            		SendMakeCall(json.VEHI_SIM);
            	});
            	$(".xxfs").click(function(){
            		xxfsDialogPanel.set('href', 'app/html/xhcdd/editor/ywbhEditor.html');
                    $('#xxfsDialogPanel').removeAttr('style');
                    xxfsDialog.show().then(function () {
                    	var xxdzjson=[],xxdzcarsjson=[];
                        xxfsDialog.set('title', '消息定制');
                        $("#ywbhEditor-zdhm").prop("checked",true);
                        
                        $("#fclxxcl").append('<li date-name="'+json.VEHI_SIM+'">'+json.VEHI_NO+'</li>');
                        var first={};
                        first.zd= json.VEHI_SIM;
                        first.cp = json.VEHI_NO;
                        xxdzjson.push(first);
                        xxdzcarsjson.push(json.VEHI_NO);
                        //查找车牌
                    	$('#syclList').html("");
                    	for (var i = 0; i < allxhc.length; i++) {
                    		$('#syclList').append('<li date-name='+allxhc[i].VEHI_SIM+'>'+allxhc[i].VEHI_NO+"</li>");
						}
                    	$("#syclList li").click(function() {
                            if ($(this).attr('selected')) {
                                $(this).removeAttr("selected");
                            } else {
                                $(this).attr("selected", '');
                            }
                        });
                        //-------------------------------箭头按钮
                        $('#ywbh-delall').on('click', function () {
                        	xxdzjson.splice(0,xxdzjson.length);
                        	xxdzcarsjson.splice(0,xxdzcarsjson.length);
                            $('#fclxxcl li').remove();
                        });
                        $('#ywbh-del').on('click', function () {
                            /*移出按钮*/
                             var fclxxcl = $('#fclxxcl li[selected]');
                             if(!fclxxcl.length){
                                 return
                             }
                             var select_zd = "";
	                    	 	var select_cp="";
                             for(var i = 0; i<fclxxcl.length; i++) {
                            	 select_zd += $(fclxxcl[i]).attr('date-name')+",";
                            	 select_cp += $(fclxxcl[i]).text()+",";
                             }
                             select_zd = select_zd.substring(0,select_zd.length-1);
                             select_cp = select_cp.substring(0,select_cp.length-1);
                             var select_cp = select_cp.split(',');
                             for(var i=0;i<select_cp.length;i++) {
                                 var items=select_cp[i];
                                 xxdzcarsjson.removeByValue(items);
                                 xxdzjson.removeByCP(items);
                             }
                             $('#fclxxcl li[selected]').removeAttr("selected").remove();
                         });
                        
                        
                        $('#ywbh-add').on('click', function () {
                    	 	var select_zd = "";
                    	 	var select_cp="";
                            /*移入按钮*/
                            var syclList = $('#syclList li[selected]');
                            if(!syclList.length){
                                return;
                            }
                            $('#fclxxcl').empty();
                            for(var i = 0; i<syclList.length; i++) {
                            	select_zd += $(syclList[i]).attr('date-name')+",";
                            	select_cp +=$(syclList[i]).text()+",";
                            }
                            select_zd = select_zd.substring(0,select_zd.length-1);
                            select_cp = select_cp.substring(0,select_cp.length-1);
                            var select_cp_list = select_cp.split(',');
                            var select_zd_list = select_zd.split(',');
                            for(var i=0;i<select_cp_list.length;i++) {
                                var items=select_cp_list[i];
                                if($.inArray(items,xxdzcarsjson)==-1) {
                                	var o = {};
		                            o.zd = select_zd_list[i];
		                            o.cp = select_cp_list[i];
		                            xxdzjson.push(o);
		                            xxdzcarsjson.push(items);
                                }
                            }
                            for (var i=0;i<xxdzjson.length;i++) {
                                var selected1 = ".sele"+i;
                                $('#fclxxcl').append('<li class="sele'+i+'" date-name='+xxdzjson[i].zd+'>'+xxdzjson[i].cp+"</li>");
                                $(selected1).on('click',function(){
                                    if ($(this).attr('selected')) {
                                        $(this).removeAttr("selected");
                                    } else {
                                        $(this).attr("selected", '');
                                    }
                                });
                            }
                            $('#syclList li[selected]').removeAttr("selected");
                        });
                        //---------------------------------
                        getdxxx("2").then(function(data){
                        	$("#fcldxkjList").html("");
	                    	for (var i = 0; i < data.length; i++) {
	                    		$("#fcldxkjList").append('<li><a href="#">'+data[i].CONTENT+'</a></li>');
							}
	                    	 $("#fcldxkjList li").click(function(){
	                         	$("#ywbhEditor-xxnr").val($(this).children().html());
	                         });
	                    	 
	                    	 $("#ywbhEditor-add").click(function(){
			                    	var postData={};
			                    	postData.cmd="0x8300";
			                    	var isu = "";
			                    	for (var i = 0; i < xxdzjson.length; i++) {
			                    		isu+=xxdzjson[i].zd+",";
									}
			                    	postData.isu=isu.substring(0,isu.length-1);
			                    	postData.content=$("#ywbhEditor-xxnr").val();
			                    	postData.flag=0;
			                    	sendcldx(postData);
			                    	xxfsDialog.hide();
			                    });
			                    $("#ywbhEditor-guan").click(function(){
			                    	xxfsDialog.hide();
			                    });
                        });
                    });
            	});
            },200);
		},
		closeInfoWindow:function(){
			xhcddmap.clearInfoWindow();
		},
		ldjl : function(json){
			queryLdjl(json).then(function(data){
//				console.log(data);
				$("#xhcddkhdjs").html(data.KHDJ);
				$("#xhcddscycsj").html(util.formatYYYYMMDDHHMISS(data.SCYC));
				$("#xhcddcstj").html(data.CS);
				lsjlxz = data.LDLSJL;
			});
		},
		clearDD:function(){
			$("#xhcddldhm").val("");//来电号码
        	$("#xhcddhbdh").val("");//回拨电话
        	$("#xhcddkhdj").html("A");
			$("#xhcddscycsj").html("");
			$("#xhcddcstj").html("");
			lsjlxz = [];
			$('#xhcdd_zdcheck').attr('checked',true);//是否自动回拨
			xhcddzdcheck=1;
        	$("#xhcddyyjcsj").val("");//预约叫车时间
        	$("#xhcddckxm").val("");//乘客姓名
        	$("#xhcddxxdz").val("");//详细地址
        	$("#xhcddszqy").val("");//所在区域
        	$("#xhcddmddd").val("");//目的地点
        	$("#xhcddfjxx").val("");//附加信息
        	$("#xhcddywlx").val("普通约车");//调度区域
        	$("#xhcddcx").val("所有");//调度区域
        	$("#xhcddddfw").val("5km");//调度范围
        	if(scmarker){
        		scmarker.setMap(null);
            	scmarker=null;
        	}
        	AMap.event.removeListener(markerydlistener);
		},
		getDdxxdz: function () {
			var _self = this;
			getgeocoder().getAddress(scmarker.getPosition(), function(status, result) {
				if (status === 'complete' && result.info === 'OK') {
	                geocoder_CallBack(result);
	            }
	        });   
		    function geocoder_CallBack(data) {
		    	var address = data.regeocode.formattedAddress;
		    	var addressqy = data.regeocode.addressComponent.district;
		    	if(address.indexOf('杭州')>-1){
		    		$("#xhcddxxdz").val(address.substring(address.indexOf('区')+1));
		    		//$("#xddxxdz").val(address.split("区")[1]==undefined?address.split("县")[1]:address.split("区")[1]);
		    	}else{
		    		$("#xhcddxxdz").val(address);
		    	}
		    	$("#xhcddszqy").val(addressqy);
		    }
		},
		kbxx:function(json){//拷贝信息（新增调度）
			$("#xhcddldhm").val(json.CUST_TEL);//来电号码
        	$("#xhcddhbdh").val(json.OUTPHONE);//回拨电话
        	$("#xhcddckxm").val(json.CUST_NAME);//乘客姓名
        	$("#xhcddxxdz").val(json.ADDRESS);//详细地址
        	$("#xhcddszqy").val("");//所在区域
        	$("#xhcddmddd").val(json.DEST_ADDRESS);//目的地点
        	$("#xhcddfjxx").val(json.NOTE);//附加信息
        	xhcddmap.setZoom(17);
        	if(scmarker){
        		scmarker.setMap(null);
        		scmarker=null;
        	}
    		scmarker = new AMap.Marker({
    			 icon: "resources/images/start.png",
	            position: [json.LONGTI,json.LATI],
	            map : xhcddmap,
	            zIndex:102,
	            offset : new AMap.Pixel(-16,-32),
	            draggable:true
	        });
    		xhcddmap.setCenter([json.LONGTI,json.LATI]);
    		markerydlistener = AMap.event.addListener(scmarker,"dragend",function(){
    			xhcddmap.setCenter(scmarker.getPosition());
    			xhcddjsobj.getDdxxdz();
		    });
        	dijit.popup.close(pMenu); 
		},
		cxdd:function(json){//重新调度
			var postData={};
        	postData.cmd=1;
        	postData.disp_id=json.DISP_ID;
        	postData.cksj=json.CUST_TEL;
        	postData.scjd=json.LONGTI;
        	postData.scwd=json.LATI;
        	postData.qq_id=json.QQ_ID;
        	postData.scdz=json.ADDRESS;
        	postData.mdd=json.DEST_ADDRESS;
        	postData.yhm=json.CUST_NAME;
        	postData.xb=0;
        	postData.fjxx=json.NOTE;
        	postData.cllx=json.CUST_VEHI_TYPE;//
        	postData.ywlx=json.DIS_TYPE;//
        	postData.ci_id=json.CI_ID;
        	postData.disp_user=username;
        	postData.yclx="电话约车";
        	postData.wbdh=json.OUTPHONE;
        	postData.ddfw="5";
        	postData.zdwb="1";
        	postData.fsbz=9;
        	postData.cxdd="1";
        	xddcxdd(postData).then(function(){
        		dijit.popup.close(pMenu); 
        	});
		},
		qxdd:function(json){//取消用车
//			if(json.VEHI_NO!=null&&json.VEHI_NO!=""){
				var postData={};
            	postData.cmd=2;
            	postData.cksjh=json.CUST_TEL;
            	postData.qq_id=json.QQ_ID;
            	postData.isu=json.SIM_NUM;
            	postData.dispid=json.DISP_ID;
            	qxdd(postData).then(function(){
            		dijit.popup.close(pMenu); 
            	});
//			}
		},
		ddwc:function(json){//右键调度完成
			var postData={};
        	postData.dispid=json.DISP_ID;
        	ddwc(postData).then(function(data){
        		if(data.msg=="1"){
        			layer.msg('操作成功！');
        			xddjsobj.findywd();
        		}else{
        			layer.msg('操作失败！');
        		}
        		dijit.popup.close(pMenu); 
        	});
		},
		jcsc:function(json){//解除锁车
			var postData={};
        	postData.VEHI_NO=json.VEHI_NO;
        	jcsc(postData).then(function(data){
        		if(data.msg=="1"){
        			layer.msg('操作成功！');
        		}else{
        			layer.msg('操作失败！');
        		}
        		dijit.popup.close(pMenu); 
        	});
		},
		sdcd:function(json){
			if(json.VEHI_NO!=null&&json.VEHI_NO!=""&&json.DISP_STATE=="已下单"){
				var postData={};
				postData.cmd=721;
				postData.cksj=json.CUST_TEL;
				postData.scjd=json.LONGTI;
				postData.scwd=json.LATI;
				postData.qq_id=json.QQ_ID;
				postData.scdz=json.ADDRESS;
				postData.mdd=json.DEST_ADDRESS;
				postData.yhm=json.CUST_NAME;
				postData.xb=0;
				postData.fjxx=json.NOTE;
				postData.cllx=json.CUST_VEHI_TYPE;
				postData.ycsj=new Date().format('yyyyMMddhhmmss')
				postData.ywlx=json.DIS_TYPE;
				postData.isu=json.SIM_NUM;
				postData.fsbz=13;
            	postData.dispid=json.DISP_ID;
            	sdcd(postData).then(function(data){
            		if(data.msg=="1"){
            			layer.msg('操作成功！');
            		}else{
            			layer.msg('操作失败！');
            		}
            		dijit.popup.close(pMenu); 
            	});
			}
		},
		fsxx:function(json){//
			dijit.popup.close(pMenu); 
			if(json.DISP_USER==username){
				if(json.VEHI_NO!=null&&json.VEHI_NO!=""){
					
					
					xxfsDialogPanel.set('href', 'app/html/xhcdd/editor/ywbhEditor.html');
                    $('#xxfsDialogPanel').removeAttr('style');
                    xxfsDialog.show().then(function () {
                        xxfsDialog.set('title', '消息定制');
                        $("#ywbhEditor-zdhm").prop("checked",true);
                        $('#syclList').html("");
                    	for (var i = 0; i < allxhc.length; i++) {
                    		$('#syclList').append('<li date-name='+allxhc[i].VEHI_SIM+'>'+allxhc[i].VEHI_NO+"</li>");
						}
                        $("#fclxxcl").append('<li date-name="'+json.VEHI_SIM+'">'+json.VEHI_NO+'</li>');
                        $("#ywbhEditor-ywbh").val(json.DISP_ID);
                        getdxxx("2").then(function(data){
                        	$("#fcldxkjList").html("");
	                    	for (var i = 0; i < data.length; i++) {
	                    		$("#fcldxkjList").append('<li><a href="#">'+data[i].CONTENT+'</a></li>');
							}
	                    	 $("#fcldxkjList li").click(function(){
	                         	$("#ywbhEditor-xxnr").val($(this).children().html());
	                         });
	                    	 
	                    	 $("#ywbhEditor-add").click(function(){
			                    	var postData={};
			                    	postData.cmd="0x8300";
			                    	postData.isu="15824437059";//$('#fclxxcl li').attr('date-name');
			                    	postData.content=$("#ywbhEditor-xxnr").val();
			                    	postData.flag=0;
			                    	sendcldx(postData).then(function(){
			                    		xxfsDialog.hide();
			                    	});
			                    });
			                    $("#ywbhEditor-guan").click(function(){
			                    	xxfsDialog.hide();
			                    });
	                    	 
                        });
                    });
				}
			}else{
				layer.msg('不是自己调度的业务单');
			}
		},
		dhwb:function(obj){
			dijit.popup.close(pMenu); 
			if(obj.DISP_USER==username){
				dhwbDialogPanel.set('href', 'app/html/ddxpt/editor/dhwbEditor.html');
                $('#dhwbDialogPanel').removeAttr('style');
                dhwbDialog.show().then(function () {
                	$("#dhwbEditor-dhhm").val(obj.CUST_TEL);
                	dhwbDialog.set('title', '电话外拨');
                	$("#dhwbEditor-dhhm").unbind('keydown').on('keydown',function(event) {
                        var eve=event ? event : window.event;  
                        if(eve.keyCode==13){  
                        	var dh = $("#dhwbEditor-dhhm").val();
		                	if(dh==""){
		                		layer.msg("请输入外拨电话号码！");
		                	}else{
		                		SendMakeCall(dh);
		                		dhwbDialog.hide();
		                	}
                        }  
                    });
                	$("#dhwbEditor-qued").click(function(){
                		var dh = $("#dhwbEditor-dhhm").val();
	                	if(dh==""){
	                		layer.msg("请输入外拨电话号码！");
	                	}else{
	                		SendMakeCall(dh);
	                		dhwbDialog.hide();
	                	}
                	});
                });
			}else{
				layer.msg('不是自己调度的业务单');
			}
		},
		dxtz:function(json){
			dijit.popup.close(pMenu); 
			if(json.DISP_USER==username){
				 xxfsDialogPanel.set('href', 'app/html/ddxpt/editor/dxfsEditor.html');
	                $('#xxfsDialogPanel').removeAttr('style');
	                xxfsDialog.show().then(function () {
	                	$("#dxfsEditor-khkh").val(json.CUST_TEL);
	                	$("#dxfsEditor-cphm").val(json.VEHI_NO);
	                    xxfsDialog.set('title', '短信发送');
	                    getdxxx("1").then(function(data){
	                    	$("#fckdxkjList").html("");
	                    	for (var i = 0; i < data.length; i++) {
	                    		$("#fckdxkjList").append('<li><a href="#">'+data[i].CONTENT+'</a></li>');
							}
	                    	 $("#fckdxkjList li").click(function(){
	                         	$("#dxfsEditor-xxnr").val($(this).children().html());
	                         });
	                    });
	                    $("#dxfsEditor-add").click(function(){
	                    	$("#dxfsEditor-xxnr").val($("#dxfsEditor-xxnr").val().replace("浙",$("#dxfsEditor-cphm").val()));
	                    });
	                    $("#dxfsEditor-qued").click(function(){
	                    	var postData={};
	                    	postData.dh=$("#dxfsEditor-khkh").val();
	                    	postData.nr=$("#dxfsEditor-xxnr").val();
	                    	senddx(postData).then(function(data){
	                    		if (data.sfdl == "1") {
	            					layer.msg("发送失败");
	            				} else {
	            					if (data.errordh == "") {
	            						layer.msg("发送成功");
	            						xxfsDialog.hide();
	            					}
	            				}
	                    	});
	                    });
	                    $("#dxfsEditor-guan").click(function(){
	                    	xxfsDialog.hide();
	                    });
	                });
			}else{
				layer.msg('不是自己调度的业务单');
			}
		},
		dhtz:function(obj){
			dijit.popup.close(pMenu); 
			if(obj.DISP_USER==username){
                	var postData={};
                	postData.CUST_NAME=obj.CUST_NAME;
                	postData.CUST_TEL=obj.CUST_TEL;
                	postData.VEHI_NO=obj.VEHI_NO;
                	dhtz(postData).then(function(data){
                		if(data.msg=="1"){
	            			layer.msg('发送成功！');
	            		}else{
	            			layer.msg('发送失败！');
	            		}
                	});
			}else{
				layer.msg('不是自己调度的业务单');
			}
		}
	});
});

