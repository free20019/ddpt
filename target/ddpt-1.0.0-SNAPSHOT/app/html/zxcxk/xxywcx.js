define(["dijit/Dialog", "dgrid/Editor", "dijit/form/Button",
			"dijit/form/DateTextBox", "dijit/form/TimeTextBox",
			"dijit/Menu",
			"dijit/MenuItem",
			"dijit/CheckedMenuItem",
			"dijit/MenuSeparator",
			"dijit/PopupMenuItem",
			"dijit/form/SimpleTextarea", "dijit/form/Select",
			"dijit/form/FilteringSelect", "dgrid/OnDemandGrid",
			"dijit/form/TextBox", "app/Pagination1", "dgrid/Selection", 'dgrid/Selector',
			"dgrid/Keyboard", "dgrid/extensions/ColumnResizer",
			"dojo/store/Memory", "cbtree/model/TreeStoreModel",
			"dstore/Memory", "dijit/form/NumberTextBox",
			"dgrid/extensions/DijitRegistry", "dijit/registry", "dojo/dom-style",
			"dojo/_base/declare", "dojo/dom-construct", "dojo/on", "dijit/tree/ObjectStoreModel", "cbtree/Tree",
			"cbtree/models/ForestStoreModel", "dojo/data/ItemFileWriteStore", "dojo/query", "app/util"],
		function (Dialog, Editor, Button, DateTextBox, TimeTextBox,
							Menu, MenuItem, CheckedMenuItem, MenuSeparator, PopupMenuItem,
							SimpleTextarea, Select, FilteringSelect, Grid, TextBox,
							Pagination, Selection, Selector, Keyboard, ColumnResizer,
							Memory2, TreeStoreModel,
							Memory, NumberTextBox, DijitRegistry, registry, domStyle,
							declare, dc, on, ObjectStoreModel, Tree,
							ForestStoreModel, ItemFileWriteStore, query, util) {
		var CustomGrid = declare([DijitRegistry, Grid, Keyboard, Selection, ColumnResizer, Selector]);
		var xxywcxGrid = null, store = null;


		var columns = {
			// checkbox: {label: '选择', selector: 'checkbox'},
			dojoId: {label: '序号'},
			ORDER_NR: {label: '95128平台订单号'},
			ORDER_PRICE: {label: '订单价格'},
			PAY_PRICE: {label: '实付金额'},
			ELDERLY_MAME: {label: '老人姓名'},
			ELDERLY_PHONE: {label: '老人联系电话'},
			EMERGENCY_CONTACT: {label: '紧急联系人'},
			EMERGENCY_PHONE: {label: '紧急联系人电话'},
			ORDER_START_TIME: {label: '出行开始时间', formatter:util.formatYYYYMMDDHHMISS},
			ORDERED_HOURS: {label: '出行预订时长'},
			STARTING_POINT: {label: '订单出行起点'},
			ENDING_POINT: {label: '订单出行终点'},
			PAY_STATUS: {label: '支付状态',formatter:util.formatXXZFZT},
			LATEST_STATUS: {label: '订单状态',formatter:util.formatXXDDZT},
			ORDER_VALID: {label: '取消订单状态',formatter:util.formatXXQXDDZT},
			TRIP_START_TIME: {label: '行程开始时间', formatter:util.formatYYYYMMDDHHMISS},
			TRIP_END_TIME: {label: '行程结束时间', formatter:util.formatYYYYMMDDHHMISS},
			START_PIC_URL: {label: '行程开始图片', renderCell: function (item) {
				var div = dc.create('div', {});
                    if (item.START_PIC_URL != "") {
                        dc.place(dc.create('a', {
                            class: 'iFBtn iFColorBlue2', innerHTML: '查看', onclick:
                                function () {
                                    var pics = item.PICPATH.split('|');
                                    var picdata = [];
                                    for (var i = 0; i < pics.length; i++) {
                                        var picmap = {};
                                        picmap.src = "https://www.hzjtwxgps.com/jtwx_wx/swtp/" + pics[i];
                                        picdata.push(picmap)
                                    }
                                    layer.photos({
                                        shade: 0.01,
                                        photos: {
                                            "start": 0, //初始显示的图片序号，默认0
                                            "data": picdata
                                        }
                                    });
                                }
                        }), div);
                    }
                    return div;
			}},
			END_PIC_URL: {label: '行程结束图片', renderCell: function (item) {
				var div = dc.create('div', {});
				if (item.END_PIC_URL != "") {
					dc.place(dc.create('a', {
						class: 'iFBtn iFColorBlue2', innerHTML: '查看', onclick:
							function () {
								var pics = item.PICPATH.split('|');
								var picdata = [];
								for (var i = 0; i < pics.length; i++) {
									var picmap = {};
									picmap.src = "https://www.hzjtwxgps.com/jtwx_wx/swtp/" + pics[i];
									picdata.push(picmap)
								}
								layer.photos({
									shade: 0.01,
									photos: {
										"start": 0, //初始显示的图片序号，默认0
										"data": picdata
									}
								});
							}
					}), div);
				}
				return div;
			}},
			DIAODU_STATUS: {label: '调度状态',formatter:util.formatXXDOZT},
			DRIVER_NAME: {label: '司机姓名'},
			DRIVER_PHONE: {label: '司机电话'},
			VECHICLE_CATAG: {label:'车辆类型'},
			VECHICLE_PLATE: {label: '车辆号牌'},
			CANCEL_REASON: {label: '取消订单原因'}
		};
		var xhrArgsTabel = {
				url : basePath + "xxyw/queryxxyw",
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
					xxywcxGrid.totalCount = data.length;
					xxywcxGrid.set('collection', store);
					$("#xxywts").html(data.length);
				},
				error : function(error) {
					console.log(error);
				}
			};
		return declare( null,{
			constructor:function(){
				this.initToolBar();
				this.get();
			},
			get: function(){
				var postData = {};
				postData.xxyw_ywbh=$("#xxyw_ywbh").val();
				postData.xxyw_cphm=$("#xxyw_cphm").val();
				postData.xxyw_sjdh=$("#xxyw_sjdh").val();
				postData.xxyw_ddzt=$("#xxyw_ddzt").val();
				postData.xxyw_lrxm=$("#xxyw_lrxm").val();
				postData.xxyw_lrdh=$("#xxyw_lrdh").val();
				postData.xxyw_cxgjz=$("#xxyw_cxgjz").val();
				postData.xxyw_stime=$("#xxyw_stime").val();
				postData.xxyw_etime=$("#xxyw_etime").val();
				loading('#xxywcxTabel');
				dojo.xhrPost(dojo.mixin(xhrArgsTabel,{"postData":'postData='+dojo.toJson(postData)}));
			},
			editywd: function () {
					var _self = this;
					var hs = [];
					dojo.forEach(ywcxGrid.collection.data, function (item, index) {
						if (ywcxGrid.isSelected(item)) {
							hs.push(item.DISP_ID);
						}
					});
					if(hs.length==0){
						layer.msg("没有选中的数据！");
						return;
					}
					layer.confirm('确定删除选中的订单？', {
									btn: ['确定','取消'] //按钮
								}, function(){
									delAxddOrder(hs.join(',')).then(function (data) {
										if(data.msg=="1"){
											layer.msg("删除订单成功！");
											_self.get();
										}else{
											layer.msg("取消订单失败，请重试！");
										}
									});
								}, function(){
								});

				},
			initToolBar:function(){
				var _self = this;
				if (xxywcxGrid) { xxywcxGrid = null; dojo.empty('xxywcxTabel') }
				xxywcxGrid = new CustomGrid({ totalCount: 0, pagination: null, columns: columns,allowTextSelection: true}, "xxywcxTabel");
				addEventComboBox('#xxywcxPanel');
				$("#xxyw_stime").val(setformat3(new Date())+" 00:00:00");
				$("#xxyw_etime").val(setformat3(new Date())+" 23:59:59");
				setTimeout(function(){
					// query('#ywscbtn').on('click', function () {
					// 	_self.editywd();
					// });

					query('#xxywcxbtn').on('click', function () {
						_self.get();
					});

					//导出
					query('#xxywcxdaochubtn').on('click', function () {
						var postData = {};
						postData.xxyw_ywbh=$("#xxyw_ywbh").val();
						postData.xxyw_cphm=$("#xxyw_cphm").val();
						postData.xxyw_sjdh=$("#xxyw_sjdh").val();
						postData.xxyw_ddzt=$("#xxyw_ddzt").val();
						postData.xxyw_lrxm=$("#xxyw_lrxm").val();
						postData.xxyw_lrdh=$("#xxyw_lrdh").val();
						postData.xxyw_cxgjz=$("#xxyw_cxgjz").val();
						postData.xxyw_stime=$("#xxyw_stime").val();
						postData.xxyw_etime=$("#xxyw_etime").val();
						url = basePath + "xxyw/queryxxyw_daochu?postData="
									+ encodeURI(encodeURI(JSON.stringify(postData))), window.open(url);
					});
				},0);
			}
		})
	});