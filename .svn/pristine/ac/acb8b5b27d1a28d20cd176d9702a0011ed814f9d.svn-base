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
			var axddzzddGrid = null, ldhmGrid = null, axddrwcjkGrid = null,store = null;
			var selectDays=[];//多选日期集合
			var scmarker = null;// 上车点marker
			var yspoi = null;// 地物查询原始地址，点击定位后回到原始地址
			var lsjlxz = null;// 电话历史记录选择
			var axddzdcheck = 1;// 是否自动回拨
			var axddyycheck = 0;// 是否预约
			var map = null;// 地图对象
			var rwcmaplist = [];// 任务车marker集合
			var rwcmklist = [];// 任务车marker集合
			var dwcenter = null;// 地物中心点
			var markerydlistener = null;// 上车点marker移动监听
			var ddscd = null;//业务单上车点显示
			var pMenu = null;
			var sjclmarker = null;
			var ruler = null;// 测距工具
			var hdtcon = null;
			var pointSimplifierIns, groupStyleMap = {};
			var axddZZDDcolumns = {
				checkbox: {label: '选择', selector: 'checkbox'},
				ZZDDXH: {
					label: '序号', renderCell: function (item) {
						var type = dc.create("div", {innerHTML: item.ZZDDXH, style: {'text-align': 'center'}});
						return type;
					}
				},
				DISP_ID: {
					label: '业务编号', renderCell: function (item) {
						var type = dc.create("div", {
							innerHTML: '<i class="icon-love"></i>' + item.DISP_ID,
							style: {'text-align': 'center', 'color': 'red', 'position': 'relative'}
						});
						return type;
					}
				},
				// YHQ: {
				// 	label: '优惠券', renderCell: function (item) {
				// 		var type = dc.create("div", {innerHTML: item.YHQ, style: {'text-align': 'center'}});
				// 		return type;
				// 	}
				// },
				YEWU_TYPE: {
					label: '业务类型', renderCell: function (item) {
						var ywlxtd = "出租调度";
						if(item.ADD_WAYS=='1'){
							ywlxtd="分中心订单";
						}
						var type = dc.create("div", {innerHTML: ywlxtd, style: {'text-align': 'center'}});
						return type;
					}
				},
				CUST_NAME: {
					label: '客户姓名', renderCell: function (item) {
						var type = dc.create("div", {innerHTML: item.CUST_NAME, style: {'text-align': 'center'}});
						return type;
					}
				},
				CUST_TEL: {
					label: '联系电话', renderCell: function (item) {
						var type = dc.create("div", {innerHTML: item.CUST_TEL, style: {'text-align': 'center'}});
						return type;
					}
				},
				ADDRESS: {
					label: '上车地点', renderCell: function (item) {
						var type = dc.create("div", {innerHTML: item.ADDRESS, style: {'text-align': 'center'}});
						return type;
					}
				},
				SZQY: {
					label: '调度区域', renderCell: function (item) {
						var type = dc.create("div", {innerHTML: item.SZQY, style: {'text-align': 'center'}});
						return type;
					}
				},
				DISP_STATE: {
					label: '调度状态', renderCell: function (item) {
						var type = dc.create("div", {innerHTML: item.DISP_STATE, style: {'text-align': 'center'}});
						return type;
					}
				},
				HBLX: {
					label: '回拨类型/状态', renderCell: function (item) {
						var hblx = (item.AUTOOUTPHONE == "0" ? "人工" : "自动");
						var hbzt = hbzt2(item.CALL_STATE);
						var type = dc.create("div", {innerHTML: hblx + "/" + hbzt, style: {'text-align': 'center'}});
						return type;
					}
				},
				VEHI_NO1: {
					label: '指派车辆', renderCell: function (item) {
						var type = dc.create("div", {innerHTML: item.VEHI_NO1, style: {'text-align': 'center'}});
						return type;
					}
				},
				JSYXM: {
					label: '司机姓名', renderCell: function (item) {
						var type = dc.create("div", {innerHTML: item.JSYXM, style: {'text-align': 'center'}});
						return type;
					}
				},
				SJDH1: {
					label: '联系方式', renderCell: function (item) {
						var type = dc.create("div", {innerHTML: item.SJDH1, style: {'text-align': 'center'}});
						return type;
					}
				},
				SIM_NUM1: {
					label: 'SIM卡号', renderCell: function (item) {
						var type = dc.create("div", {innerHTML: item.SIM_NUM1, style: {'text-align': 'center'}});
						return type;
					}
				},
				COMP_NAME1: {
					label: '所属公司', renderCell: function (item) {
						var type = dc.create("div", {innerHTML: item.COMP_NAME1, style: {'text-align': 'center'}});
						return type;
					}
				},
				// VEHI_NO2: {
				// 	label: '指派车辆2', renderCell: function (item) {
				// 		var type = dc.create("div", {innerHTML: item.VEHI_NO2, style: {'text-align': 'center'}});
				// 		return type;
				// 	}
				// },
				// SJDH2: {
				// 	label: '联系方式2', renderCell: function (item) {
				// 		var type = dc.create("div", {innerHTML: item.SJDH2, style: {'text-align': 'center'}});
				// 		return type;
				// 	}
				// },
				// SIM_NUM2: {
				// 	label: 'SIM卡号2', renderCell: function (item) {
				// 		var type = dc.create("div", {innerHTML: item.SIM_NUM2, style: {'text-align': 'center'}});
				// 		return type;
				// 	}
				// },
				// COMP_NAME2: {
				// 	label: '所属公司2', renderCell: function (item) {
				// 		var type = dc.create("div", {innerHTML: item.COMP_NAME2, style: {'text-align': 'center'}});
				// 		return type;
				// 	}
				// },
				// VEHI_NO3: {
				// 	label: '指派车辆3', renderCell: function (item) {
				// 		var type = dc.create("div", {innerHTML: item.VEHI_NO3, style: {'text-align': 'center'}});
				// 		return type;
				// 	}
				// },
				// SJDH3: {
				// 	label: '联系方式3', renderCell: function (item) {
				// 		var type = dc.create("div", {innerHTML: item.SJDH3, style: {'text-align': 'center'}});
				// 		return type;
				// 	}
				// },
				// SIM_NUM3: {
				// 	label: 'SIM卡号3', renderCell: function (item) {
				// 		var type = dc.create("div", {innerHTML: item.SIM_NUM3, style: {'text-align': 'center'}});
				// 		return type;
				// 	}
				// },
				// COMP_NAME3: {
				// 	label: '所属公司3', renderCell: function (item) {
				// 		var type = dc.create("div", {innerHTML: item.COMP_NAME3, style: {'text-align': 'center'}});
				// 		return type;
				// 	}
				// },
				YCMS: {
					label: '用车模式', renderCell: function (item) {
						var type = dc.create("div", {innerHTML: item.YCMS, style: {'text-align': 'center'}});
						return type;
					}
				},
				TSRQ: {
					label: '特殊人群', renderCell: function (item) {
						var type = dc.create("div", {innerHTML: item.TSRQ, style: {'text-align': 'center'}});
						return type;
					}
				},
				PTQK: {
					label: '陪同情况', renderCell: function (item) {
						var type = dc.create("div", {innerHTML: item.PTQK, style: {'text-align': 'center'}});
						return type;
					}
				},
				YCXQ: {
					label: '用车需求', renderCell: function (item) {
						var type = dc.create("div", {innerHTML: item.YCXQ, style: {'text-align': 'center'}});
						return type;
					}
				},
				DISP_TIME: {
					label: '用车时间', renderCell: function (item) {
						var type = dc.create("div", {
							innerHTML: util.formatYYYYMMDDHHMISS(item.DISP_TIME),
							style: {'text-align': 'center'}
						});
						return type;
					}
				},
				DEST_ADDRESS: {
					label: '目的地', renderCell: function (item) {
						var type = dc.create("div", {innerHTML: item.DEST_ADDRESS, style: {'text-align': 'center'}});
						return type;
					}
				},
				OUTPHONE: {
					label: '回拨电话', renderCell: function (item) {
						var type = dc.create("div", {innerHTML: item.OUTPHONE, style: {'text-align': 'center'}});
						return type;
					}
				},
				DISP_USER: {
					label: '调度员', renderCell: function (item) {
						var type = dc.create("div", {innerHTML: item.DISP_USER, style: {'text-align': 'center'}});
						return type;
					}
				},
				DB_TIME: {
					label: '生成时间', renderCell: function (item) {
						var type = dc.create("div", {
							innerHTML: util.formatYYYYMMDDHHMISS(item.DB_TIME),
							style: {'text-align': 'center'}
						});
						return type;
					}
				},
				QXDDLX: {
					label: '取消调度原因', renderCell: function (item) {
						var type = dc.create("div", {innerHTML: item.QXDDLX, style: {'text-align': 'center'}});
						return type;
					}
				},
				QXDDYY: {
					label: '取消调度原因描述', renderCell: function (item) {
						var type = dc.create("div", {innerHTML: item.QXDDYY, style: {'text-align': 'center'}});
						return type;
					}
				},
				CK_MYD: {
					label: '乘客满意度', renderCell: function (item) {
						var type = dc.create("div", {innerHTML: item.CK_MYD, style: {'text-align': 'center'}});
						return type;
					}
				},
				CK_PJ: {
					label: '乘客评价', renderCell: function (item) {
						var type = dc.create("div", {innerHTML: item.CK_PJ, style: {'text-align': 'center'}});
						return type;
					}
				},
				SJ_MYD: {
					label: '司机满意度', renderCell: function (item) {
						var type = dc.create("div", {innerHTML: item.SJ_MYD, style: {'text-align': 'center'}});
						return type;
					}
				},
				SJ_PJ: {
					label: '司机评价', renderCell: function (item) {
						var type = dc.create("div", {innerHTML: item.SJ_PJ, style: {'text-align': 'center'}});
						return type;
					}
				}
			};
			/* 来电号码的选择 */
			var ldhmColumns = {
				checkbox: {label: '选择', selector: 'checkbox'},
				CI_ID: {
					label: '客户ID', renderCell: function (item) {
						var type = dc.create("div", {innerHTML: item.CI_ID, style: {'text-align': 'center'}});
						return type;
					}
				},
				CI_NAME: {
					label: '客户姓名', renderCell: function (item) {
						var type = dc.create("div", {innerHTML: item.CI_NAME, style: {'text-align': 'center'}});
						return type;
					}
				},
				CI_TEL: {
					label: '客户电话', renderCell: function (item) {
						var type = dc.create("div", {innerHTML: item.CI_TEL, style: {'text-align': 'center'}});
						return type;
					}
				},
				SZQY: {
					label: '调度区域', renderCell: function (item) {
						var type = dc.create("div", {innerHTML: item.SZQY, style: {'text-align': 'center'}});
						return type;
					}
				},
				ADDRES_REF: {
					label: '参考地址', renderCell: function (item) {
						var type = dc.create("div", {innerHTML: item.ADDRES_REF, style: {'text-align': 'center'}});
						return type;
					}
				},
				ADDRESS: {
					label: '详细地址', renderCell: function (item) {
						var type = dc.create("div", {innerHTML: item.ADDRESS, style: {'text-align': 'center'}});
						return type;
					}
				},
				COMPL_NUM: {
					label: '空放总数', renderCell: function (item) {
						var type = dc.create("div", {innerHTML: item.COMPL_NUM, style: {'text-align': 'center'}});
						return type;
					}
				},
				DISP_NUM: {
					label: '调度总数', renderCell: function (item) {
						var type = dc.create("div", {innerHTML: item.DISP_NUM, style: {'text-align': 'center'}});
						return type;
					}
				},
				INSERT_TIME: {
					label: '叫车时间', renderCell: function (item) {
						var type = dc.create("div", {
							innerHTML: util.formatYYYYMMDDHHMISS(item.INSERT_TIME),
							style: {'text-align': 'center'}
						});
						return type;
					}
				},
				NOTE: {
					label: '附加信息（备注）', renderCell: function (item) {
						var type = dc.create("div", {innerHTML: item.NOTE, style: {'text-align': 'center'}});
						return type;
					}
				}
			};
			return declare(null, {
				constructor: function () {
					this.initToolBar();
				},
				//车辆发送信息
				ckfsxx: function (obj) {
					var cljk_self = obj;
					obj.infoWindow.open(map, obj.getPosition());
					setTimeout(function () {
						// 积分查询
						$(".jfcx").click(function () {
							cljk_self.infoWindow1.open(map, cljk_self.getPosition());
						});
						// 拨打车载
						$(".bdcz").click(function () {
							SendMakeCall(cljk_self.clxx.VEHI_SIM);
						});
						$(".xxfs").click(function () {
							xxfsDialogPanel.set('href', 'app/html/ddxpt/editor/ywbhEditor.html');
							$('#xxfsDialogPanel').removeAttr('style');
							xxfsDialog.show().then(function () {
								var xxdzjson = [], xxdzcarsjson = [];
								var json = cljk_self.clxx;
								xxfsDialog.set('title', '消息定制');
								$("#ywbhEditor-zdhm").prop("checked", false);
								$("#fclxxcl").append('<li date-name="' + json.MDT_NO + '">' + json.VEHI_NO + '</li>');
								var first = {};
								first.zd = json.MDT_NO;
								first.cp = json.VEHI_NO;
								xxdzjson.push(first);
								xxdzcarsjson.push(json.VEHI_NO);
								// 查找车牌
								$("#ywbh-car-comboBox").find('input').on('keyup', function () {
									var cpmhs = $("#ywbh-car-comboBox").find('input').val();
									if (cpmhs.length > 2) {
										findddcphm(cpmhs).then(function (data2) {
											$('#syclList').html("");
											for (var i = 0; i < data2.length; i++) {
												$('#syclList').append('<li date-name=' + data2[i].MDT_NO + '>' + data2[i].CPHM + "</li>");
											}
											$("#syclList li").click(function () {
												if ($(this).attr('selected')) {
													$(this).removeAttr("selected");
												} else {
													$(this).attr("selected", '');
												}
											});
										});
									}
									if (cpmhs == "") {
										findallcp().then(function (data) {
											$('#syclList').html("");
											for (var i = 0; i < data.vehilist.length; i++) {
												$('#syclList').append('<li date-name=' + data.vehilist[i].mdtno + '>' + data.vehilist[i].vehino + "</li>");
											}
											$("#syclList li").click(function () {
												if ($(this).attr('selected')) {
													$(this).removeAttr("selected");
												} else {
													$(this).attr("selected", '');
												}
											});
										});
									}

								});
								// 查找车队
								findcd().then(function (data2) {
									$("#ywbh-cd-comboBox").find('.iFList').html("");
									for (var i = 0; i < data2.length; i++) {
										var cphms = "<li data-value='" + data2[i].TM_ID + "'>" + data2[i].TM_NAME + "</li>";
										$("#ywbh-cd-comboBox").find('.iFList').append(cphms);
									}
									$('#ywbh-cd-comboBox').find('.iFList').on('click', function () {
										if (event.stopPropagation) {
											event.stopPropagation();
										} else if (window.event) {
											window.event.cancelBubble = true;
										}
									}).find('li').off('click').on('click', function () {
										$(this).addClass('selected').siblings('.selected').removeClass('selected');
										$("#ywbh-cd-comboBox").find('input').data('value', $(this).data('value')).val($(this).text()).end().removeClass('selected');
									});
								});

								findallcp().then(function (data) {
									$('#syclList').html("");
									for (var i = 0; i < data.vehilist.length; i++) {
										$('#syclList').append('<li date-name=' + data.vehilist[i].mdtno + '>' + data.vehilist[i].vehino + "</li>");
									}
									$("#syclList li").click(function () {
										if ($(this).attr('selected')) {
											$(this).removeAttr("selected");
										} else {
											$(this).attr("selected", '');
										}
									});
								});
								// -------------------------------箭头按钮
								$('#ywbh-delall').on('click', function () {
									xxdzjson.splice(0, xxdzjson.length);
									xxdzcarsjson.splice(0, xxdzcarsjson.length);
									$('#fclxxcl li').remove();
								});
								$('#ywbh-del').on('click', function () {
									/* 移出按钮 */
									var fclxxcl = $('#fclxxcl li[selected]');
									if (!fclxxcl.length) {
										return
									}
									var select_zd = "";
									var select_cp = "";
									for (var i = 0; i < fclxxcl.length; i++) {
										select_zd += $(fclxxcl[i]).attr('date-name') + ",";
										select_cp += $(fclxxcl[i]).text() + ",";
									}
									select_zd = select_zd.substring(0, select_zd.length - 1);
									select_cp = select_cp.substring(0, select_cp.length - 1);
									var select_cp = select_cp.split(',');
									for (var i = 0; i < select_cp.length; i++) {
										var items = select_cp[i];
										xxdzcarsjson.removeByValue(items);
										xxdzjson.removeByCP(items);
									}
									$('#fclxxcl li[selected]').removeAttr("selected").remove();
								});


								$('#ywbh-add').on('click', function () {
									var select_zd = "";
									var select_cp = "";
									/* 移入按钮 */
									var syclList = $('#syclList li[selected]');
									if (!syclList.length) {
										return;
									}
									$('#fclxxcl').empty();
									for (var i = 0; i < syclList.length; i++) {
										select_zd += $(syclList[i]).attr('date-name') + ",";
										select_cp += $(syclList[i]).text() + ",";
									}
									select_zd = select_zd.substring(0, select_zd.length - 1);
									select_cp = select_cp.substring(0, select_cp.length - 1);
									var select_cp_list = select_cp.split(',');
									var select_zd_list = select_zd.split(',');
									for (var i = 0; i < select_cp_list.length; i++) {
										var items = select_cp_list[i];
										if ($.inArray(items, xxdzcarsjson) == -1) {
											var o = {};
											o.zd = select_zd_list[i];
											o.cp = select_cp_list[i];
											xxdzjson.push(o);
											xxdzcarsjson.push(items);
										}
									}
									for (var i = 0; i < xxdzjson.length; i++) {
										var selected1 = ".sele" + i;
										$('#fclxxcl').append('<li class="sele' + i + '" date-name=' + xxdzjson[i].zd + '>' + xxdzjson[i].cp + "</li>");
										$(selected1).on('click', function () {
											if ($(this).attr('selected')) {
												$(this).removeAttr("selected");
											} else {
												$(this).attr("selected", '');
											}
										});
									}
									$('#syclList li[selected]').removeAttr("selected");
								});

// $('#ywbh-addonecl').on('click', function () {
// var select_name = $('#ywbh-cp').data('value');
// if(!select_name){
// return;
// }
// if($.inArray($('#ywbh-cp').val(),xxdzcarsjson)==-1){
// var o = {};
// o.zd = $('#ywbh-cp').data('value');
// o.cp = $('#ywbh-cp').val();
// xxdzjson.push(o);
// xxdzcarsjson.push($('#ywbh-cp').val());
// }else{
// return;
// }
// $('#fclxxcl').empty();
// for (var i=0;i<xxdzjson.length;i++) {
// var selected1 = ".sele"+i;
// $('#fclxxcl').append('<li class="sele'+i+'"
// date-name='+xxdzjson[i].zd+'>'+xxdzjson[i].cp+"</li>");
// $(selected1).on('click',function(){
// if ($(this).attr('selected')) {
// $(this).removeAttr("selected");
// } else {
// $(this).attr("selected", '');
// }
// });
// }
// });
								$('#ywbh-addonecd').on('click', function () {
									var select_name = $('#ywbh-cd').data('value');
									if (!select_name) {
										return;
									}
									findcdcars(select_name).then(function (data) {
										for (var i = 0; i < data.length; i++) {
											if ($.inArray(data[i].VEHI_NO, xxdzcarsjson) == -1) {
												var o = {};
												o.zd = data[i].MDT_NO;
												o.cp = data[i].VEHI_NO;
												xxdzjson.push(o);
												xxdzcarsjson.push(data[i].VEHI_NO);
											} else {
												continue;
											}
										}
										$('#fclxxcl').empty();
										for (var i = 0; i < xxdzjson.length; i++) {
											var selected1 = ".sele" + i;
											$('#fclxxcl').append('<li class="sele' + i + '" date-name=' + xxdzjson[i].zd + '>' + xxdzjson[i].cp + "</li>");
											$(selected1).on('click', function () {
												if ($(this).attr('selected')) {
													$(this).removeAttr("selected");
												} else {
													$(this).attr("selected", '');
												}
											});
										}
									});
								});

								// ---------------------------------
								getdxxx("2").then(function (data) {
									$("#fcldxkjList").html("");
									for (var i = 0; i < data.length; i++) {
										$("#fcldxkjList").append('<li><a href="#">' + data[i].CONTENT + '</a></li>');
									}
									$("#fcldxkjList li").click(function () {
										$("#ywbhEditor-xxnr").val($(this).children().html());
									});

									$("#ywbhEditor-add").click(function () {
										var postData = {};
										postData.cmd = "0x8300";
										var isu = "";
										for (var i = 0; i < xxdzjson.length; i++) {
											isu += xxdzjson[i].zd + ",";
										}
										postData.isu = isu.substring(0, isu.length - 1);
										postData.content = $("#ywbhEditor-xxnr").val();
										postData.flag = 0;
										sendcldx(postData);
										xxfsDialog.hide();
									});
									$("#ywbhEditor-guan").click(function () {
										xxfsDialog.hide();
									});
									$("#ywbhEditor-char").click(function () {
										cdmcDialogPanel.set('href', 'app/html/ddxpt/editor/cdmcEditor.html');
										cdmcDialog.set('title', '添加车队');
										$('#cdmcDialogPanel').removeAttr('style');
										cdmcDialog.show().then(function () {
											$("#cdmcEditor-qued").click(function () {
												if ($("#cdmcEditor-cdmc").val() == "") {
													layer.msg("请输入车队名称");
												} else {
													var postData = {};
													postData.cdmc = $("#cdmcEditor-cdmc").val();
													var cps = "";
													for (var i = 0; i < xxdzjson.length; i++) {
														cps += xxdzjson[i].cp + ",";
													}
													postData.gh = username;
													postData.cps = cps.substring(0, cps.length - 1);
													addcd(postData).then(function (data) {
														layer.msg(data.msg);
														cdmcDialog.hide();
													});
												}
											});
										});
									});
								});
							});
						});
					}, 200);

				},
				// 附近车辆
				fjcl: function () {
					var _self = this;
					axdddata().then(function (data) {
						// lovecls = data.lovecls;
						$("#axddclzs").html(data.axnum.total);
						$("#axddclzxs").html(data.axnum.onnum);
						$("#axddclkcs").html(data.axnum.nnum);
						$("#axddclzcs").html(data.axnum.hnum);
						$("#axddcllxs").html(data.axnum.offnum);
						if (data.axvehilist.length > 0) {
							var axvehilist=data.axvehilist;
							pointSimplifierIns.setData(axvehilist);
						}
						setTimeout(function(){
							_self.fjcl();
						},30000);
					});
				},
				addMark4: function (obj) {
					findclxx(obj.mdtno).then(function (data) {
						obj = $.extend(obj, data);
						var title = '<span style="font-size:12px;color:#278ac4;">' + obj.vehino + '</span>';
						if (obj.gpsStatus == "1") {
							title += '<span style="font-size:11px;color:red;">(非精确)</span>';
						}
						var content = [];
						content.push("时间：" + obj.dateTime);
						content.push("速度：" + obj.speed + "  状态：" + kzc(obj.carStatus));
						content.push("Sim卡号：" + obj.vehisim);
						content.push("终端类型：" + obj.mtname);
						content.push("终端子类型：" + obj.MDT_SUB_TYPE);
						content.push("终端编号：" + obj.mdtno);
						content.push(" 车型：" + obj.cartype);
						content.push("车主电话：" + obj.owntel);
						content.push("车主姓名：" + obj.ownname);
						content.push("公司：" + obj.compname);
						// content.push("区块："+obj.qk);
						content.push("<hr/>&nbsp;&nbsp;<a href='javascript:void(0)' class='xxfs'>信息发送</a>" + "&nbsp;&nbsp;<a href='javascript:void(0)' class='jfcx'>积分查询</a>" + "&nbsp;&nbsp;<a href='javascript:void(0)' class='bdcz'>拨打车载</a>");
						var infoWindow = new AMap.InfoWindow({
							isCustom: true,  // 使用自定义窗体
							content: axcreateInfoWindow(title, content.join("<br/>")),
							offset: new AMap.Pixel(15, -23)
						});
						// 积分查询窗口
						var title1 = '<span style="font-size:11px;color:#278ac4;">' + obj.vehino + '</span>',
								content1 = [];
						content1.push("调度总数：" + obj.dispnum);
						content1.push("投诉总数：" + obj.complnum);
						content1.push("积分总数：" + obj.jfzs);
						var infoWindow1 = new AMap.InfoWindow({
							isCustom: true,  // 使用自定义窗体
							content: axcreateInfoWindow(title1, content1.join("<br/>")),
							offset: new AMap.Pixel(15, -23)
						});
						infoWindow.open(map, [obj.longi, obj.lati]);
						var json = obj;
						setTimeout(function () {
							// 积分查询
							$(".jfcx").click(function () {
								infoWindow1.open(map, [obj.longi, obj.lati]);
							});
							// 拨打车载
							$(".bdcz").click(function () {
								SendMakeCall(obj.vehisim);
							});
							$(".xxfs").click(function () {
								xxfsDialogPanel.set('href', 'app/html/ddxpt/editor/ywbhEditor.html');
								$('#xxfsDialogPanel').removeAttr('style');
								xxfsDialog.show().then(function () {
									var xxdzjson = [], xxdzcarsjson = [];
									xxfsDialog.set('title', '消息定制');
									$("#ywbhEditor-zdhm").prop("checked", true);

									$("#fclxxcl").append('<li date-name="' + json.mdtno + '">' + json.vehino + '</li>');
									var first = {};
									first.zd = json.mdtno;
									first.cp = json.vehino;
									xxdzjson.push(first);
									xxdzcarsjson.push(json.vehino);
									// 查找车牌
									$("#ywbh-car-comboBox").find('input').on('keyup', function () {
										var cpmhs = $("#ywbh-car-comboBox").find('input').val();
										if (cpmhs.length > 2) {
											findddcphm(cpmhs).then(function (data2) {
												$('#syclList').html("");
												for (var i = 0; i < data2.length; i++) {
													$('#syclList').append('<li date-name=' + data2[i].MDT_NO + '>' + data2[i].CPHM + "</li>");
												}
												$("#syclList li").click(function () {
													if ($(this).attr('selected')) {
														$(this).removeAttr("selected");
													} else {
														$(this).attr("selected", '');
													}
												});
											});
										}
										if (cpmhs == "") {
											findallcp().then(function (data) {
												$('#syclList').html("");
												for (var i = 0; i < data.vehilist.length; i++) {
													$('#syclList').append('<li date-name=' + data.vehilist[i].mdtno + '>' + data.vehilist[i].vehino + "</li>");
												}
												$("#syclList li").click(function () {
													if ($(this).attr('selected')) {
														$(this).removeAttr("selected");
													} else {
														$(this).attr("selected", '');
													}
												});
											});
										}

									});
									// 查找车队
									findcd().then(function (data2) {
										$("#ywbh-cd-comboBox").find('.iFList').html("");
										for (var i = 0; i < data2.length; i++) {
											var cphms = "<li data-value='" + data2[i].TM_ID + "'>" + data2[i].TM_NAME + "</li>";
											$("#ywbh-cd-comboBox").find('.iFList').append(cphms);
										}
										$('#ywbh-cd-comboBox').find('.iFList').on('click', function () {
											if (event.stopPropagation) {
												event.stopPropagation();
											} else if (window.event) {
												window.event.cancelBubble = true;
											}
										}).find('li').off('click').on('click', function () {
											$(this).addClass('selected').siblings('.selected').removeClass('selected');
											$("#ywbh-cd-comboBox").find('input').data('value', $(this).data('value')).val($(this).text()).end().removeClass('selected');
										});
									});

									findallcp().then(function (data) {
										$('#syclList').html("");
										for (var i = 0; i < data.vehilist.length; i++) {
											$('#syclList').append('<li date-name=' + data.vehilist[i].mdtno + '>' + data.vehilist[i].vehino + "</li>");
										}
										$("#syclList li").click(function () {
											if ($(this).attr('selected')) {
												$(this).removeAttr("selected");
											} else {
												$(this).attr("selected", '');
											}
										});
									});
									// -------------------------------箭头按钮
									$('#ywbh-delall').on('click', function () {
										xxdzjson.splice(0, xxdzjson.length);
										xxdzcarsjson.splice(0, xxdzcarsjson.length);
										$('#fclxxcl li').remove();
									});
									$('#ywbh-del').on('click', function () {
										/* 移出按钮 */
										var fclxxcl = $('#fclxxcl li[selected]');
										if (!fclxxcl.length) {
											return
										}
										var select_zd = "";
										var select_cp = "";
										for (var i = 0; i < fclxxcl.length; i++) {
											select_zd += $(fclxxcl[i]).attr('date-name') + ",";
											select_cp += $(fclxxcl[i]).text() + ",";
										}
										select_zd = select_zd.substring(0, select_zd.length - 1);
										select_cp = select_cp.substring(0, select_cp.length - 1);
										var select_cp = select_cp.split(',');
										for (var i = 0; i < select_cp.length; i++) {
											var items = select_cp[i];
											xxdzcarsjson.removeByValue(items);
											xxdzjson.removeByCP(items);
										}
										$('#fclxxcl li[selected]').removeAttr("selected").remove();
									});


									$('#ywbh-add').on('click', function () {
										var select_zd = "";
										var select_cp = "";
										/* 移入按钮 */
										var syclList = $('#syclList li[selected]');
										if (!syclList.length) {
											return;
										}
										$('#fclxxcl').empty();
										for (var i = 0; i < syclList.length; i++) {
											select_zd += $(syclList[i]).attr('date-name') + ",";
											select_cp += $(syclList[i]).text() + ",";
										}
										select_zd = select_zd.substring(0, select_zd.length - 1);
										select_cp = select_cp.substring(0, select_cp.length - 1);
										var select_cp_list = select_cp.split(',');
										var select_zd_list = select_zd.split(',');
										for (var i = 0; i < select_cp_list.length; i++) {
											var items = select_cp_list[i];
											if ($.inArray(items, xxdzcarsjson) == -1) {
												var o = {};
												o.zd = select_zd_list[i];
												o.cp = select_cp_list[i];
												xxdzjson.push(o);
												xxdzcarsjson.push(items);
											}
										}
										for (var i = 0; i < xxdzjson.length; i++) {
											var selected1 = ".sele" + i;
											$('#fclxxcl').append('<li class="sele' + i + '" date-name=' + xxdzjson[i].zd + '>' + xxdzjson[i].cp + "</li>");
											$(selected1).on('click', function () {
												if ($(this).attr('selected')) {
													$(this).removeAttr("selected");
												} else {
													$(this).attr("selected", '');
												}
											});
										}
										$('#syclList li[selected]').removeAttr("selected");
									});
									$('#ywbh-addonecd').on('click', function () {
										var select_name = $('#ywbh-cd').data('value');
										if (!select_name) {
											return;
										}
										findcdcars(select_name).then(function (data) {
											for (var i = 0; i < data.length; i++) {
												if ($.inArray(data[i].VEHI_NO, xxdzcarsjson) == -1) {
													var o = {};
													o.zd = data[i].MDT_NO;
													o.cp = data[i].VEHI_NO;
													xxdzjson.push(o);
													xxdzcarsjson.push(data[i].VEHI_NO);
												} else {
													continue;
												}
											}
											$('#fclxxcl').empty();
											for (var i = 0; i < xxdzjson.length; i++) {
												var selected1 = ".sele" + i;
												$('#fclxxcl').append('<li class="sele' + i + '" date-name=' + xxdzjson[i].zd + '>' + xxdzjson[i].cp + "</li>");
												$(selected1).on('click', function () {
													if ($(this).attr('selected')) {
														$(this).removeAttr("selected");
													} else {
														$(this).attr("selected", '');
													}
												});
											}
										});
									});

									// ---------------------------------
									getdxxx("2").then(function (data) {
										$("#fcldxkjList").html("");
										for (var i = 0; i < data.length; i++) {
											$("#fcldxkjList").append('<li><a href="#">' + data[i].CONTENT + '</a></li>');
										}
										$("#fcldxkjList li").click(function () {
											$("#ywbhEditor-xxnr").val($(this).children().html());
										});

										$("#ywbhEditor-add").click(function () {
											var postData = {};
											postData.cmd = "0x8300";
											var isu = "";
											for (var i = 0; i < xxdzjson.length; i++) {
												isu += xxdzjson[i].zd + ",";
											}
											postData.isu = isu.substring(0, isu.length - 1);
											postData.content = $("#ywbhEditor-xxnr").val();
											postData.flag = 0;
											sendcldx(postData);
											xxfsDialog.hide();
										});
										$("#ywbhEditor-guan").click(function () {
											xxfsDialog.hide();
										});
										$("#ywbhEditor-char").click(function () {
											cdmcDialogPanel.set('href', 'app/html/ddxpt/editor/cdmcEditor.html');
											cdmcDialog.set('title', '添加车队');
											$('#cdmcDialogPanel').removeAttr('style');
											cdmcDialog.show().then(function () {
												$("#cdmcEditor-qued").click(function () {
													if ($("#cdmcEditor-cdmc").val() == "") {
														layer.msg("请输入车队名称");
													} else {
														var postData = {};
														postData.cdmc = $("#cdmcEditor-cdmc").val();
														var cps = "";
														for (var i = 0; i < xxdzjson.length; i++) {
															cps += xxdzjson[i].cp + ",";
														}
														postData.gh = username;
														postData.cps = cps.substring(0, cps.length - 1);
														addcd(postData).then(function (data) {
															layer.msg(data.msg);
															cdmcDialog.hide();
														});
													}
												});
											});
										});
									});
								});
							});
						}, 200);
					});
				},
				//清空重置
				clearDD: function () {
					$("#axddldhm").val("");// 来电号码
					$("#axddkhdj").html("A");
					$("#axddckxm").val("");// 乘客姓名
					$("#axddcstj").html("0/0/0");
					//日期
					selectDays=[];
					$("#ycrq-comboBox").find('.iFList').html("");
					$("#axddycrq").val("");
					//时间
					$("#axddycsj").val("");
					$("#axddxxdz").val("");// 详细地址
					$("#axddszqy").val("");// 所在区域
					$("#axddmddd").val("");// 目的地点
					$("#axddfjxx").val("");// 附加信息
					$("#axddcl").val("");// 指派车辆
					$("#axddclgs").val("");// 所属公司
					if (scmarker) {
						scmarker.setMap(null);
						scmarker = null;
					}
					if (ddscd) {
						ddscd.setMap(null);
					}
					AMap.event.removeListener(markerydlistener);

					$('#zpcldivcl2').css('display','none');
					$('#zpcldivgs2').css('display','none');
					$('#zpclan1').css('display','');
					$('#zpcldivcl3').css('display','none');
					$('#zpcldivgs3').css('display','none');
					$('#zpclan2').css('display','');
					$('#axddycms').val('结对用车');
					$('#axddtsrq').val('');
					$('#axddptqk').val('无陪同');
					$('#axddycxq').val('');
					$('#axddsjxm1').val('');

					$('#axddcl1').val('');
					$('#axddclsim1').val('');
					$('#axddlxfs1').val('');
					$('#axddclgs1').val('');
					$('#axddcl2').val('');
					$('#axddclsim2').val('');
					$('#axddlxfs2').val('');
					$('#axddclgs2').val('');
					$('#axddcl3').val('');
					$('#axddclsim3').val('');
					$('#axddlxfs3').val('');
					$('#axddclgs3').val('');
				},
				//关闭地图弹框
				closeInfoWindow: function () {
					map.clearInfoWindow();
				},
				//关闭右键菜单
				gbcd: function () {
					if (pMenu) {
						dijit.popup.close(pMenu);
					}
				},
				// 拷贝信息（新增调度）
				kbxx: function (json) {
					selectDays=[];
					$("#axddycrq").val('');
					$("#axddycsj").val('');
					$("#axddldhm").val(json.CUST_TEL);// 来电号码
					$("#axddckxm").val(json.CUST_NAME);// 乘客姓名
					$("#axddxxdz").val(json.ADDRESS);// 详细地址
					$("#axddszqy").val(json.SZQY);// 所在区域
					$("#axddmddd").val(json.DEST_ADDRESS);// 目的地点
					$("#axddfjxx").val(json.NOTE);// 附加信息
					$("#axddcl").val(json.VEHI_NO);
					$("#axddclsim").val(json.SIM_NUM);
					$("#axddclgs").val(json.COMP_NAME);
					map.setZoom(17);
					if (scmarker) {
						scmarker.setMap(null);
						scmarker = null;
					}
					scmarker = new AMap.Marker({
						icon: "resources/images/start.png",
						position: [json.LONGTI, json.LATI],
						map: map,
						zIndex: 102,
						offset: new AMap.Pixel(-16, -32),
						draggable: true
					});
					map.setCenter([json.LONGTI, json.LATI]);
					markerydlistener = AMap.event.addListener(scmarker, "dragend", function () {
						map.setCenter(scmarker.getPosition());
					});
					dijit.popup.close(pMenu);
				},
				//发送信息
				fsxx: function (json) {
					dijit.popup.close(pMenu);
					if (json.DISP_USER == username) {
						if (json.VEHI_NO != null && json.VEHI_NO != "") {
							xxfsDialogPanel.set('href', 'app/html/ddxpt/editor/ywbhEditor.html');
							$('#xxfsDialogPanel').removeAttr('style');
							xxfsDialog.show().then(function () {
								xxfsDialog.set('title', '消息定制');
								$("#ywbhEditor-zdhm").prop("checked", true);
								$("#fclxxcl").append('<li date-name="' + json.SIM_NUM + '">' + json.VEHI_NO + '</li>');
								$("#ywbhEditor-ywbh").val(json.DISP_ID);
								getdxxx("2").then(function (data) {
									$("#fcldxkjList").html("");
									for (var i = 0; i < data.length; i++) {
										$("#fcldxkjList").append('<li><a href="#">' + data[i].CONTENT + '</a></li>');
									}
									$("#fcldxkjList li").click(function () {
										$("#ywbhEditor-xxnr").val($(this).children().html());
									});

									$("#ywbhEditor-add").click(function () {
										var postData = {};
										postData.cmd = "0x8300";
										postData.isu = $('#fclxxcl li').attr('date-name');
										postData.content = $("#ywbhEditor-xxnr").val();
										postData.flag = 0;
										sendcldx(postData);
									});
									$("#ywbhEditor-guan").click(function () {
										xxfsDialog.hide();
									});

								});
							});
						}
					} else {
						layer.msg('不是自己调度的业务单');
					}
				},
				//电话外拨
				dhwb: function (obj) {
					dijit.popup.close(pMenu);
					if (obj.DISP_USER == username) {
						dhwbDialogPanel.set('href', 'app/html/ddxpt/editor/dhwbEditor.html');
						$('#dhwbDialogPanel').removeAttr('style');
						dhwbDialog.show().then(function () {
							$("#dhwbEditor-dhhm").val(obj.CUST_TEL);
							dhwbDialog.set('title', '电话外拨');
							$("#dhwbEditor-dhhm").unbind('keydown').on('keydown', function (event) {
								var eve = event ? event : window.event;
								if (eve.keyCode == 13) {
									var dh = $("#dhwbEditor-dhhm").val();
									if (dh == "") {
										layer.msg("请输入外拨电话号码！");
									} else {
										SendMakeCall(dh);
										dhwbDialog.hide();
									}
								}
							});
							$("#dhwbEditor-qued").click(function () {
								var dh = $("#dhwbEditor-dhhm").val();
								if (dh == "") {
									layer.msg("请输入外拨电话号码！");
								} else {
									SendMakeCall(dh);
									dhwbDialog.hide();
								}
							});
						});
					} else {
						layer.msg('不是自己调度的业务单');
					}
				},
				//短信通知
				dxtz: function (json) {
					dijit.popup.close(pMenu);
					if (json.DISP_USER == username) {
						xxfsDialogPanel.set('href', 'app/html/ddxpt/editor/dxfsEditor.html');
						$('#xxfsDialogPanel').removeAttr('style');
						xxfsDialog.show().then(function () {
							$("#dxfsEditor-khkh").val(json.CUST_TEL);
							$("#dxfsEditor-cphm").val(json.VEHI_NO);
							xxfsDialog.set('title', '短信发送');
							getdxxx("1").then(function (data) {
								$("#fckdxkjList").html("");
								for (var i = 0; i < data.length; i++) {
									$("#fckdxkjList").append('<li><a href="#">' + data[i].CONTENT + '</a></li>');
								}
								$("#fckdxkjList li").click(function () {
									$("#dxfsEditor-xxnr").val($(this).children().html());
								});
							});
							$("#dxfsEditor-add").click(function () {
								$("#dxfsEditor-xxnr").val($("#dxfsEditor-xxnr").val().replace("浙AT", $("#dxfsEditor-cphm").val()));
							});
							$("#dxfsEditor-qued").click(function () {
								var postData = {};
								postData.dh = $("#dxfsEditor-khkh").val();
								postData.nr = $("#dxfsEditor-xxnr").val();
								senddx(postData).then(function (data) {
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
							$("#dxfsEditor-guan").click(function () {
								xxfsDialog.hide();
							});
						});
					} else {
						layer.msg('不是自己调度的业务单');
					}
				},
				//电话通知
				dhtz: function (obj) {
					dijit.popup.close(pMenu);
					var postData = {};
					postData.CUST_NAME = obj.CUST_NAME;
					postData.CUST_TEL = obj.CUST_TEL;
					postData.VEHI_NO = obj.VEHI_NO;
					dhtz(postData).then(function (data) {
						if (data.msg == "1") {
							layer.msg('发送成功！');
						} else {
							layer.msg('发送失败！');
						}
					});
				},
				//任务车定位
				rwcdw: function (json) {
					map.remove(rwcmklist);
					rwcmaplist = [];
					rwcmklist = [];
					for (var i = 0; i < json.length; i++) {
						var rwcmap = {};
						var icon = gettb(json[i], 1);
						var rwcmarker = new AMap.Marker({
							icon: icon,
							position: [json[i].PX, json[i].PY],
							offset: new AMap.Pixel(-10, -10),
							map: map
						});
						var title = '<span style="font-size:12px;color:#278ac4;">' + json.VEHI_NO + '</span>';
						if (json.STATE == "1") {
							title += '<span style="font-size:11px;color:red;">(非精确)</span>';
						}
						var content = [];
						content.push("时间：" + util.formatYYYYMMDDHHMISS(json[i].STIME));
						content.push("速度：" + json[i].SPEED + "   状态：" + kzc(json[i].CARSTATE));
						content.push("Sim卡号：" + json[i].VEHI_SIM);
						content.push("终端类型：" + json[i].MT_NAME);
						content.push("终端子类型：" + json[i].MDT_SUB_TYPE);
						content.push("终端编号：" + json[i].mtname);
						content.push(" 车型：" + json[i].VT_NAME);
						content.push("车主电话：" + json[i].OWN_TEL);
						content.push("车主姓名：" + json[i].OWN_NAME);
						content.push("公司：" + json[i].COMP_NAME);
						content.push("<hr/>&nbsp;&nbsp;<a href='javascript:void(0)' class='xxfs'>信息发送</a>" + "&nbsp;&nbsp;<a href='javascript:void(0)' class='jfcx'>积分查询</a>" + "&nbsp;&nbsp;<a href='javascript:void(0)' class='bdcz'>拨打车载</a>");
						var infoWindow = new AMap.InfoWindow({
							isCustom: true,  // 使用自定义窗体
							content: axcreateInfoWindow(title, content.join("<br/>")),
							offset: new AMap.Pixel(15, -23)
						});
						var title1 = '<span style="font-size:11px;color:#278ac4;">' + json[i].VEHI_NO + '</span>',
								content1 = [];
						content1.push("调度总数：" + json[i].DISP_NUM);
						content1.push("投诉总数：" + json[i].COMPL_NUM);
						content1.push("积分总数：" + json[i].INTEGRAL);
						var infoWindow1 = new AMap.InfoWindow({
							isCustom: true,  // 使用自定义窗体
							content: axcreateInfoWindow(title1, content1.join("<br/>")),
							offset: new AMap.Pixel(15, -23)
						});
						rwcmarker.infoWindow1 = infoWindow1;
						rwcmarker.infoWindow = infoWindow;
						rwcmarker.cp = json[i].VEHI_NO;
						rwcmarker.clxx = json[i];
						AMap.event.addListener(rwcmarker, 'click', function () {
							axddjsobj.ckfsxx(rwcmarker);
						});
						rwcmklist.push(rwcmarker);
						rwcmap.ywd = json[i].DISP_ID;
						rwcmap.car = json[i].VEHI_NO;
						rwcmap.marker = rwcmarker;
						rwcmaplist.push(rwcmap);
					}
				},
				//来电号码选择按钮查看信息
				axddldjl: function (json) {
					queryLdjl(json).then(function (data) {
						$("#axddkhdj").html(data.KHDJ);
						if (data.KHDJ.indexOf('爱心') > 0) {
							$("#axddkhdj").css('color', 'red');
							$("#axddddqy").val('爱心出租');
							$("#aaxdddiv").css('display', 'block');
							$('#axdd_zdcheck').prop("checked", false);
							axddzdcheck = 0;
						} else {
							$("#axddddqy").val('出租车');
							$("#aaxdddiv").css('display', 'none');
							$("#axddkhdj").css('color', '#000');
						}
						$("#axddscycsj").html(util.formatYYYYMMDDHHMISS(data.SCYC));
						$("#axddcstj").html(data.CS);
						lsjlxz = data.LDLSJL;
					});
				},
				//查询5-10分钟内爱心调度单
				findywd: function () {
					var stime = $("#axddywstime").val()+" 00:00:00";
					var etime = $("#axddywetime").val()+" 23:59:59";
					var ywddh = $("#axddywdh").val();
					var ywdcp = $("#axddywcp").val();
					var ywdbh = $("#axddywbh").val();
					var dz = $("#axdddz").val();
					queryAxddOrder(stime,etime,ywddh,ywdcp, ywdbh,dz).then(function (data) {
						console.log(data);
						axddzzddGrid.set('minRowsPerPage', 999);
						// axddrwcjkGrid.set('minRowsPerPage', 999);
						axddzzddGrid.set('collection', new Memory({data: {identifier: 'ZZDDXH', label: 'ZZDDXH', items: data.zzdd}}));

						for (var i = 0; i <data.zzdd.length; i++) {
							var st = data.zzdd[i].DISP_TIME;
							var et = new Date().getTime();
							if(et-st>0){
								$("#axddConent-zzddTable-row-"+(i+1)).css('background-color','#bbbbbb');
							}
						}
						// axddrwcjkGrid.set('collection', new Memory({data: {identifier: 'RWCXH', label: 'RWCXH', items: data.rwc}}));
						// setTimeout(function () {
						// 	$("#axddConent-tabContainer_tablist_axdd-zzddtitle").html("订单(" + data.zzdd.length + ")");
						// 	$("#axddConent-tabContainer_tablist_axdd-rwcjktitle").html("任务车(" + data.rwc.length + ")");
						// 	rwcdata = data.rwc;
						// }, 500);
					});
				},
				editywd: function () {
					var _self = this;
					var hs = [];
					var cone=null;
					dojo.forEach(axddzzddGrid.collection.data, function (item, index) {
						if (axddzzddGrid.isSelected(item)) {
							hs.push(item.DISP_ID);
							if(cone==null){
								cone = item;
							}
						}
					});
					if(hs.length==0){
						layer.msg("没有选中的数据！");
						return;
					}

					zpclDialogPanel.set('href', 'app/html/ddxpt/editor/zpclEditor.html');
						$('#zpclDialogPanel').removeAttr('style');
						zpclDialog.show().then(function () {
							$('#axddzpcl-dispid-edit').html(hs.join(','));
							$('#axddzpcl-khxm-edit').val(cone.CUST_NAME);
							$('#axddzpcl-khdh-edit').val(cone.CUST_TEL);
							$('#axddzpcl-cp1-edit').val(cone.VEHI_NO1);
							$('#axddzpcl-zd1-edit').val(cone.SIM_NUM1);
							$('#axddzpcl-dh1-edit').val(cone.SJDH1);
							$('#axddzpcl-gs1-edit').val(cone.COMP_NAME1);
							$('#axddzpcl-cp2-edit').val(cone.VEHI_NO2);
							$('#axddzpcl-zd2-edit').val(cone.SIM_NUM2);
							$('#axddzpcl-dh2-edit').val(cone.SJDH2);
							$('#axddzpcl-gs2-edit').val(cone.COMP_NAME2);
							$('#axddzpcl-cp3-edit').val(cone.VEHI_NO3);
							$('#axddzpcl-zd3-edit').val(cone.SIM_NUM3);
							$('#axddzpcl-dh3-edit').val(cone.SJDH3);
							$('#axddzpcl-gs3-edit').val(cone.COMP_NAME3);
							on(query('#axddzpcl-cp1-edit'), 'blur', function () {
								if ($('#axddzpcl-cp1-edit').val().length > 3) {
									queryCompByVehino($('#axddzpcl-cp1-edit').val()).then(function (data) {
										if (data.result == "0") {
											layer.msg('没有该车辆信息，请确认车牌号码！');
											$('#axddzpcl-gs1-edit').val('');
											$('#axddzpcl-zd1-edit').val('');
										} else {
											if (data.result == "1") {
												layer.msg('该车辆不是爱心车队车辆，请确认车牌号码！');
											}
											$('#axddzpcl-gs1-edit').val(data.compname);
											$('#axddzpcl-zd1-edit').val(data.simnum);
										}
									})
								}
							});
							on(query('#axddzpcl-cp2-edit'), 'blur', function () {
								if ($('#axddzpcl-cp2-edit').val().length > 3) {
									queryCompByVehino($('#axddzpcl-cp2-edit').val()).then(function (data) {
										if (data.result == "0") {
											layer.msg('没有该车辆信息，请确认车牌号码！');
											$('#axddzpcl-gs2-edit').val('');
											$('#axddzpcl-zd2-edit').val('');
										} else {
											if (data.result == "1") {
												layer.msg('该车辆不是爱心车队车辆，请确认车牌号码！');
											}
											$('#axddzpcl-gs2-edit').val(data.compname);
											$('#axddzpcl-zd2-edit').val(data.simnum);
										}
									})
								}
							});
							on(query('#axddzpcl-cp3-edit'), 'blur', function () {
								if ($('#axddzpcl-cp3-edit').val().length > 3) {
									queryCompByVehino($('#axddzpcl-cp3-edit').val()).then(function (data) {
										if (data.result == "0") {
											layer.msg('没有该车辆信息，请确认车牌号码！');
											$('#axddzpcl-gs3-edit').val('');
											$('#axddzpcl-zd3-edit').val('');
										} else {
											if (data.result == "1") {
												layer.msg('该车辆不是爱心车队车辆，请确认车牌号码！');
											}
											$('#axddzpcl-gs3-edit').val(data.compname);
											$('#axddzpcl-zd3-edit').val(data.simnum);
										}
									})
								}
							});
							on(query('#axddzpcl-qued'), 'click', function () {
								var pdata = {};
								pdata.ids = hs.join(',');
								pdata.khxm = $('#axddzpcl-khxm-edit').val();
								pdata.khdh = $('#axddzpcl-khdh-edit').val();
								pdata.vehino1 = $('#axddzpcl-cp1-edit').val();
								pdata.simnum1 = $('#axddzpcl-zd1-edit').val();
								pdata.sjdh1 = $('#axddzpcl-dh1-edit').val();
								pdata.compname1 = $('#axddzpcl-gs1-edit').val();
								pdata.vehino2 = $('#axddzpcl-cp2-edit').val();
								pdata.simnum2 = $('#axddzpcl-zd2-edit').val();
								pdata.sjdh2 = $('#axddzpcl-dh2-edit').val();
								pdata.compname2 = $('#axddzpcl-gs2-edit').val();
								pdata.vehino3 = $('#axddzpcl-cp3-edit').val();
								pdata.simnum3 = $('#axddzpcl-zd3-edit').val();
								pdata.sjdh3 = $('#axddzpcl-dh3-edit').val();
								pdata.compname3 = $('#axddzpcl-gs3-edit').val();

								editAxddOrder(pdata).then(function(data){
									if(data.msg=="1"){
										layer.msg("修改订单成功！");
										zpclDialog.hide();
										_self.findywd();
									}else{
										layer.msg("修改订单失败，请重试！");
									}
								});
							})
						});
				},
				qxywd: function(){
					var _self = this;
					var hs = [];
					dojo.forEach(axddzzddGrid.collection.data, function (item, index) {
						if (axddzzddGrid.isSelected(item)) {
							hs.push(item.DISP_ID);
						}
					});
					if(hs.length==0){
						layer.msg("没有选中的数据！");
						return;
					}
				ddqxDialogPanel.set('href', 'app/html/ddxpt/editor/ddqxEditor.html');
						$('#ddqxDialogPanel').removeAttr('style');
						ddqxDialog.show().then(function () {
								addEventComboBox('#ddqxPanel');

							on(query('#qxddbtn'), 'click', function () {
								var postData={};
								postData.ids=hs.join(',');
								postData.QXDDLX=$('#qxddlx').val();
								postData.QXDDYY=$('#qxddms').val();

								layer.confirm('确定取消选中的订单？', {
									btn: ['确定','取消'] //按钮
								}, function(){
									qxAxddOrder(postData).then(function (data) {
										if(data.msg=="1"){
											layer.msg("取消订单成功！");
											ddqxDialog.hide();
											_self.findywd();
										}else{
											layer.msg("取消订单失败，请重试！");
										}
									});
								}, function(){
								});
							})
						});


				},
				pjywd: function(){
					var _self = this;
					var hs = [];
					var itemobj=null;
					dojo.forEach(axddzzddGrid.collection.data, function (item, index) {
						if (axddzzddGrid.isSelected(item)) {
							hs.push(item.DISP_ID);
							itemobj = item;
						}
					});
					if(hs.length!=1){
						layer.msg("请选择一条业务单填写评价！");
						return;
					}
					ddpjDialogPanel.set('href', 'app/html/ddxpt/editor/ddpjEditor.html');
						$('#ddpjDialogPanel').removeAttr('style');
						ddpjDialog.show().then(function () {
								addEventComboBox('#pjPanel');
								$('#pjywd').html(itemobj.DISP_ID);
								$('#pjckxm').html(itemobj.CUST_NAME);
								$('#pjcksj').html(itemobj.CUST_TEL);
								$('#pjzpcl').html(itemobj.VEHI_NO);
								$('#pjckmyd').val(itemobj.CK_MYD);
								$('#pjckpj').val(itemobj.CK_PJ);
								$('#pjsjmyd').val(itemobj.SJ_MYD);
								$('#pjsjpj').val(itemobj.SJ_PJ);

							on(query('#pjbtn'), 'click', function () {
								var postData={};
								postData.DISP_ID=$('#pjywd').html();
								postData.CK_MYD=$('#pjckmyd').val();
								postData.CK_PJ=$('#pjckpj').val();
								postData.SJ_MYD=$('#pjsjmyd').val();
								postData.SJ_PJ=$('#pjsjpj').val();

								pjAxddOrder(postData).then(function(data){
									if(data.msg=="1"){
										layer.msg("评价成功！");
										ddpjDialog.hide();
										_self.findywd();
									}else{
										layer.msg("评价订单失败，请重试！");
									}
								});
							})
						});
				},
				//查询上车地址地址信息
				getDdxxdz: function () {
					getgeocoder().getAddress(scmarker.getPosition(), function (status, result) {
						if (status === 'complete' && result.info === 'OK') {
							geocoder_CallBack(result);
						}
					});

					function geocoder_CallBack(data) {
						var address = data.regeocode.formattedAddress;
						var addressqy = data.regeocode.addressComponent.district;
						if (address.indexOf('杭州') > -1) {
							$("#axddxxdz").val(address.substring(address.indexOf('区') + 1));
							// $("#axddxxdz").val(address.split("区")[1]==undefined?address.split("县")[1]:address.split("区")[1]);
						} else {
							$("#axddxxdz").val(address);
						}
						$("#axddszqy").val(addressqy);
					}
				},
				//初始化页面信息
				initToolBar: function () {
					var _self = this;
					setTimeout(function () {
						$('#axddywstime').val(new Date().Format('yyyy-MM-dd'));
						$('#axddywetime').val(new Date().Format('yyyy-MM-dd'));
						_self.findywd();
						_self.fjcl();
					}, 1000);

					map = new AMap.Map('axddMap', {
						resizeEnable: true,
						mapStyle: 'amap://styles/normal',
						zoom: 14,
						center: [120.209561, 30.245278]
					});

					dwcenter = new AMap.Marker({
						icon: "resources/images/dwcenter.png",
						zIndex: 102,
						map: map,
						offset: new AMap.Pixel(-16, -16),
						position: map.getCenter()

					});
					AMap.event.addListener(map, "moveend", function () {
						dwcenter.setPosition(map.getCenter());
					});
					map.plugin(["AMap.RangingTool"], function () {
						ruler = new AMap.RangingTool(map);
					});
					on(query('#axddmapcj'), 'click', function () {
						ruler.turnOn();
						AMap.event.addListener(ruler, "end", function () {
							ruler.turnOff();
						});
					});
					//地图放大
					on(query('#axddmapfd'), 'click', function () {
						map.setZoom(map.getZoom() + 1);
					});
					//地图缩小
					on(query('#axddmapsx'), 'click', function () {
						map.setZoom(map.getZoom() - 1);
					});
					AMapUI.load(['ui/misc/PointSimplifier', 'lib/$'], function (PointSimplifier, $) {
						if (!PointSimplifier.supportCanvas) {
							alert('当前环境不支持 Canvas！');
							return;
						}
						hdtcon = PointSimplifier;
						groupStyleMap["resources/images/lovecar.png"] = {
								pointStyle: {
									content: hdtcon.Render.Canvas.getImageContent("resources/images/lovecar.png"),
									width: 20,
									height: 20,
									offset: ['-50%', '-50%'],
									fillStyle: null
								}
							};
						pointSimplifierIns = new hdtcon({
							zIndex: 40,
							autoSetFitView: false,
							maxChildrenOfQuadNode: 1,
							map: map, // 所属的地图实例

							getPosition: function (item) {
								return [item.longi, item.lati];
							},
							getHoverTitle: function (dataItem, idx) {
								return '车牌: ' + dataItem.vehino;
							},
							// 使用GroupStyleRender
							renderConstructor: hdtcon.Render.Canvas.GroupStyleRender,
							renderOptions: {
								pointStyle: {
									width: 5,
									height: 5,
									fillStyle: '#A2D0FA'
								},
								getGroupId: function (item, idx) {
									//console.log('1111 ',item);
									var icon =getddtb(item);
									return icon;
								},
								groupStyleOptions: function (obj) {
									return groupStyleMap[obj];
								}
							}
						});
						pointSimplifierIns.on('pointClick', function (e, record) {
//			        	console.log(record.data);
							axddjsobj.addMark4(record.data);
						});
					});

					map.plugin(["AMap.RangingTool"], function () {
						ruler = new AMap.RangingTool(map);
					});
					AMapUI.loadUI(['misc/PoiPicker'], function (PoiPicker) {

						var poiPicker2 = new PoiPicker({
							input: 'axddxxdz'
						});
						poiPickerReady2(poiPicker2);
					});

					function poiPickerReady2(poiPicker2) {
						window.poiPicker = poiPicker2;
						poiPicker2.on('poiPicked', function (poiResult) {
							if (scmarker) {
								map.remove(scmarker);
							}
							scmarker = new AMap.Marker({
								icon: "resources/images/start.png",
								zIndex: 102,
								offset: new AMap.Pixel(-16, -32),
								draggable: true
							});
							poi = poiResult.item,
									scmarker.setMap(map);
							scmarker.setPosition(poi.location);
							yspoi = poi.location;
							map.setCenter(yspoi);
							map.setZoom(17);
							$("#axddxxdz").val(poi.name);
							$("#axddszqy").val(poi.district.substring(poi.district.indexOf('市') + 1));
							markerydlistener = AMap.event.addListener(scmarker, "dragend", function () {
								map.setCenter(scmarker.getPosition());
								_self.getDdxxdz();
							});
						});
					}
					/* 正在调度表格 */
					if (axddzzddGrid) {
						axddzzddGrid = null;
						dojo.empty('axddConent-zzddTable');
					}
					axddzzddGrid = new CustomGrid({
						totalCount: 0,
						pagination: null,
						columns: axddZZDDcolumns,
						allowTextSelection: true
					}, 'axddConent-zzddTable');

					//订单表双击
					axddzzddGrid.on('.dgrid-row:dblclick', function (event) {
						var row = axddzzddGrid.row(event);
						if (row.data.VEHI_NO != "" && row.data.VEHI_NO != null) {
							if (sjclmarker) {
								sjclmarker.setMap(null);
							}
							if (ddscd) {
								ddscd.setMap(null);
							}
							dwjkcl(row.data.VEHI_NO).then(function (data) {
								if (!data.PX) {
									layer.msg("当前无定位数据！");
									return;
								}
								var icon = gettb(data, 2);
								sjclmarker = new AMap.Marker({
									position: [data.PX, data.PY],
									offset: new AMap.Pixel(-10, -10),
									icon: icon,
									zIndex: 101,
									map: map
								});
								ddscd = new AMap.Marker({
									position: [row.data.LONGTI, row.data.LATI],
									offset: new AMap.Pixel(-16, -16),
									icon: "resources/images/ddscd.png",
									zIndex: 101,
									map: map
								});

								map.setCenter(sjclmarker.getPosition());

								// 信息窗口
								var title = '<span style="font-size:12px;color:#278ac4;">' + data.VEHI_NO + '</span>';
								if (data.STATE == "1") {
									title += '<span style="font-size:11px;color:red;">(非精确)</span>';
								}
								var content = [];
// content.push("经度："+data.PX+" 纬度："+data.PY);
								content.push("时间：" + data.STIME);
// content.push("速度："+data.SPEED+" 方向："+dlwz(data.ANGLE)+"
// 状态："+kzc(data.STATE));
								content.push("速度：" + data.SPEED + "   状态：" + kzc(data.CARSTATE));
								content.push("Sim卡号：" + data.VEHI_SIM);
								content.push("终端类型：" + data.MT_NAME);
								content.push("终端子类型：" + data.MDT_SUB_TYPE);
								content.push("终端编号：" + data.MDT_NO);
								content.push(" 车型：" + data.VT_NAME);
								content.push("车主电话：" + data.OWN_TEL);
								content.push("车主姓名：" + data.OWN_NAME);
								content.push("公司：" + data.COMP_NAME);
// content.push("区块："+data.OWNER_NAME);
								content.push("<hr/>&nbsp;&nbsp;<a href='javascript:void(0)' class='xxfs'>信息发送</a>" + "&nbsp;&nbsp;<a href='javascript:void(0)' class='jfcx'>积分查询</a>" + "&nbsp;&nbsp;<a href='javascript:void(0)' class='bdcz'>拨打车载</a>");
								var infoWindow = new AMap.InfoWindow({
									isCustom: true,  // 使用自定义窗体
									content: axcreateInfoWindow(title, content.join("<br/>")),
									offset: new AMap.Pixel(15, -23)
								});
								// 积分查询窗口
								var title1 = '<span style="font-size:11px;color:#278ac4;">' + data.VEHI_NO + '</span>',
										content1 = [];
								content1.push("调度总数：" + data.DISP_NUM);
								content1.push("投诉总数：" + data.COMPL_NUM);
								content1.push("积分总数：" + data.INTEGRAL);
								var infoWindow1 = new AMap.InfoWindow({
									isCustom: true,  // 使用自定义窗体
									content: axcreateInfoWindow(title1, content1.join("<br/>")),
									offset: new AMap.Pixel(15, -23)
								});
								sjclmarker.infoWindow1 = infoWindow1;
								sjclmarker.infoWindow = infoWindow;
								sjclmarker.clxx = data;
								_self.ckfsxx(sjclmarker);
								AMap.event.addListener(sjclmarker, 'click', function () {
									_self.ckfsxx(sjclmarker);
								});
							});
							map.setZoom(16);
						}
					});

					// 正在调度右键菜单关闭
					axddzzddGrid.on('.dgrid-row:click', function (event) {
						if (pMenu) {
							dijit.popup.close(pMenu);
						}
					});
					// 正在调度右键菜单
					axddzzddGrid.on('.dgrid-row:contextmenu', function (event) {
						event.preventDefault();
						var row = axddzzddGrid.row(event);
						pMenu = new Menu({
							targetNodeIds: ["axddConent-zzddTable-row-" + row.id]
						});
						// console.log(row);
						pMenu.addChild(new MenuItem({
							label: "拷贝信息(新增调度)",
							onClick: function () {
								_self.kbxx(row.data);
							}
						}));
						pMenu.addChild(new MenuSeparator());
						pMenu.addChild(new MenuItem({
							label: "发送消息",
							onClick: function () {
								_self.fsxx(row.data);
							}
						}));
						pMenu.addChild(new MenuSeparator());
						var pSubMenu1 = new Menu();
						var pSubMenu11 = new Menu();
						var pSubMenu111 = new Menu();
						var pSubMenu12 = new Menu();
						var pSubMenu13 = new Menu();
						pSubMenu111.addChild(new MenuItem({
							label: "     0",
							onClick: function () {
								_self.jfgl_wjdkr(row.data, 0, 1);
							}
						}));
						pSubMenu111.addChild(new MenuItem({
							label: "     1",
							onClick: function () {
								_self.jfgl_wjdkr(row.data, 1, 1);
							}
						}));
						pSubMenu111.addChild(new MenuItem({
							label: "     3",
							onClick: function () {
								_self.jfgl_wjdkr(row.data, 3, 1);
							}
						}));
						pSubMenu11.addChild(new PopupMenuItem({
							label: "乘客原因",
							popup: pSubMenu111
						}));

						pSubMenu11.addChild(new MenuItem({
							label: "技术原因",
							onClick: function () {
								_self.jfgl_wjdkr(row.data, 0, 2);
							}
						}));
						pSubMenu11.addChild(new MenuItem({
							label: "服务原因",
							onClick: function () {
								_self.jfgl_wjdkr(row.data, 0, 3);
							}
						}));
						pSubMenu11.addChild(new MenuItem({
							label: "其他",
							onClick: function () {
								_self.jfgl_wjdkr(row.data, 0, 4);
							}
						}));
						pSubMenu1.addChild(new PopupMenuItem({
							label: "未接到客人",
							popup: pSubMenu11
						}));
						pSubMenu12.addChild(new MenuItem({
							label: "0",
							onClick: function () {
								_self.jfgl_wjdkr(row.data, 0, 5);
							}
						}));
						pSubMenu12.addChild(new MenuItem({
							label: "-1",
							onClick: function () {
								_self.jfgl_wjdkr(row.data, 1, 5);
							}
						}));
						pSubMenu12.addChild(new MenuItem({
							label: "-3",
							onClick: function () {
								_self.jfgl_wjdkr(row.data, 3, 5);
							}
						}));
						pSubMenu1.addChild(new PopupMenuItem({
							label: "接错客人",
							popup: pSubMenu12
						}));
						pSubMenu1.addChild(new MenuItem({
							label: "客人投诉",
							onClick: function () {
								_self.jfgl_wjdkr(row.data, 0, 6);
							}
						}));
						pSubMenu1.addChild(new MenuSeparator());
						pSubMenu13.addChild(new MenuItem({
							label: "0",
							onClick: function () {
								_self.jfgl_wjdkr(row.data, 0, 7);
							}
						}));
						pSubMenu13.addChild(new MenuItem({
							label: "-1",
							onClick: function () {
								_self.jfgl_wjdkr(row.data, 1, 7);
							}
						}));
						pSubMenu13.addChild(new MenuItem({
							label: "-3",
							onClick: function () {
								_self.jfgl_wjdkr(row.data, 3, 7);
							}
						}));
						pSubMenu1.addChild(new PopupMenuItem({
							label: "不去接客人",
							popup: pSubMenu13
						}));
						pSubMenu1.addChild(new MenuItem({
							label: "其他"
						}));
						pMenu.addChild(new PopupMenuItem({
							label: "积分管理(业务生成)",
							popup: pSubMenu1
						}));
						pMenu.addChild(new MenuSeparator());
						pMenu.addChild(new MenuItem({
							label: "电话外拨",
							onClick: function () {
								_self.dhwb(row.data);
							}
						}));
						pMenu.addChild(new MenuItem({
							label: "短信通知",
							onClick: function () {
								_self.dxtz(row.data);
							}
						}));
						pMenu.addChild(new MenuItem({
							label: "电话通知",
							onClick: function () {
								_self.dhtz(row.data);
							}
						}));
						pMenu.addChild(new MenuSeparator());
						pMenu.addChild(new MenuItem({
							label: "复制",
							onClick: function () {
								document.execCommand("Copy");
								dijit.popup.close(pMenu);
							}
						}));
						dijit.popup.moveOffScreen(pMenu);
						if (pMenu.startup && !pMenu._started) {
							pMenu.startup();
						}
						dijit.popup.open({popup: pMenu, x: event.pageX, y: event.pageY});
					});
					addEventComboBox('#axdd-borderContainer');
					//窗口大小
					$(window).resize(function () {
						$('#axddDialogPanel').removeAttr('style');
					});
					//指派车辆焦点
					on(query('#axddcl1'),'focus',function(){
						if($('#axddcl1').val()==''){
							$('#axddcl1').val("浙A");
						}
					});
					on(query('#axddcl1'),'blur',function(){
							if($('#axddcl1').val().length>6){
								queryCompByVehino($('#axddcl1').val()).then(function(data){
									if(data.result=="0"){
										layer.msg('没有该车辆信息，请确认车牌号码！');
										$('#axddclgs1').val('');
										$('#axddclsim1').val('');
									}else{
										if(data.result=="1"){
											layer.msg('该车辆不是爱心车队车辆，请确认车牌号码！');
										}
										$('#axddclgs1').val(data.compname);
										$('#axddclsim1').val(data.simnum);
									}
								})
							}
					});
					on(query('#axddcl2'),'focus',function(){
						if($('#axddcl2').val()==''){
							$('#axddcl2').val("浙A");
						}
					});
					on(query('#axddcl2'),'blur',function(){
							if($('#axddcl2').val().length>6){
								queryCompByVehino($('#axddcl2').val()).then(function(data){
									if(data.result=="0"){
										layer.msg('没有该车辆信息，请确认车牌号码！');
										$('#axddclgs2').val('');
										$('#axddclsim2').val('');
									}else{
										if(data.result=="1"){
											layer.msg('该车辆不是爱心车队车辆，请确认车牌号码！');
										}
										$('#axddclgs2').val(data.compname);
										$('#axddclsim2').val(data.simnum);
									}
								})
							}
					});
					on(query('#axddcl3'),'focus',function(){
						if($('#axddcl3').val()==''){
							$('#axddcl3').val("浙A");
						}
					});
					on(query('#axddcl3'),'blur',function(){
							if($('#axddcl3').val().length>6){
								queryCompByVehino($('#axddcl3').val()).then(function(data){
									if(data.result=="0"){
										layer.msg('没有该车辆信息，请确认车牌号码！');
										$('#axddclgs3').val('');
										$('#axddclsim3').val('');
									}else{
										if(data.result=="1"){
											layer.msg('该车辆不是爱心车队车辆，请确认车牌号码！');
										}
										$('#axddclgs3').val(data.compname);
										$('#axddclsim3').val(data.simnum);
									}
								})
							}
					});
					/* 来电号码的选择 */
					on(query('#axddldhm_xz'), 'click', function () {
						_self.axddldjl($("#axddldhm").val());
						axddDialogPanel.set('href', 'app/html/ddxpt/compile/ldhm_xz.html');
						axddDialog.show().then(function () {
							$('#axddDialogPanel').removeAttr('style');
							axddDialog.set('title', '选择客户');
							setTimeout(function () {
								if (ldhmGrid) {
									ldhmGrid = null;
									dojo.empty('ldhmTable');
								}
								ldhmGrid = new CustomGrid({totalCount: 0, pagination: null, columns: ldhmColumns}, "ldhmTable");
								store = new Memory({data: {identifier: 'CI_ID', label: 'CI_ID', items: lsjlxz}});
								ldhmGrid.set('collection', store);
								$('.panel-conterBar').show();

								// 新用户
								on(query('#xddxyh'), 'click', function () {
									var postData = {};
									postData.dh = $("#axddldhm").val();
									postData.xm = $("#axddckxm").val();
									addxyh(postData).then(function (data) {
										axddDialog.hide();
										if (data.msg == "1") {
											layer.msg('生成新用户成功！');
										} else if (data.msg == "2") {
											layer.msg('该用户已经存在！');
										} else {
											layer.msg('生成新用户失败！');
										}
									});
								});
								on(query('#xddxzyh'), 'click', function () {
									var hs = 0;
									var postData = {};
									dojo.forEach(ldhmGrid.collection.data, function (item, index) {
										if (ldhmGrid.isSelected(item)) {
											hs++;
											postData = item;
										}
									});
									if (hs == 0) {
										layer.msg("请选择一条数据！");
									} else if (hs > 1) {
										layer.msg("只能选择一条数据！");
									} else {
										edityh(postData).then(function (data) {
											axddDialog.hide();
											if (data.msg == "1") {
												layer.msg('更新用户成功！');
											} else {
												layer.msg('更新用户失败！');
											}
										});
									}
								});

								// xiugai
								ldhmGrid.on('.dgrid-row:dblclick', function (event) {
									var row = ldhmGrid.row(event);
									$("#axddckxm").val(row.data.CI_NAME);// 乘客姓名
									$("#axddxxdz").val(row.data.ADDRESS);// 详细地址
									$("#axddszqy").val(row.data.SZQY);//所在区域
									$("#axddmddd").val(row.data.DEST_ADDRESS);// 目的地点
									$("#axddfjxx").val(row.data.NOTE);// 附加信息
									if (scmarker) {
										map.remove(scmarker);
									}
									scmarker = new AMap.Marker({
										icon: "resources/images/start.png",
										position: [row.data.LONGI, row.data.LATI],
										map: map,
										zIndex: 102,
										offset: new AMap.Pixel(-16, -32),
										draggable: true
									});
									map.setCenter(scmarker.getPosition());
									markerydlistener = AMap.event.addListener(scmarker, "dragend", function () {
										map.setCenter(scmarker.getPosition());
										_self.getDdxxdz();
									});
									axddDialog.hide();
								});
							}, 100);
						});
					});
					//清空爱心调度信息
					on(query('#axddclearbtn'), 'click', function () {
						_self.clearDD();
					});
					/* 爱心调度按钮--点击调度 */
					on(query('#axddscbtn'), 'click', function () {
						layer.confirm('确定生成调度单?', {
							btn: ['确定','取消'] //按钮
						}, function() {
							var jd = "", wd = "";
							if (scmarker) {
								jd = scmarker.getPosition().getLng();
								wd = scmarker.getPosition().getLat();
							}
							var xddldhm = $("#axddldhm").val();// 来电号码
							var xddckxm = $("#axddckxm").val();// 乘客姓名
							var xddxxdz = $("#axddxxdz").val();// 详细地址
							var xddszqy = $("#axddszqy").val();// 所在区域
							var xddmddd = $("#mddrq").val()+' '+$("#axddmddd").val();// 目的地点
							var xddfjxx = $("#axddfjxx").val();// 附加信息
							var xddpx = jd;// 上车经度
							var xddpy = wd;// 上车纬度

							var xddycsj = [];
							for (var i = 0; i < selectDays.length; i++) {
								var ycsj = selectDays[i] + ' ' + $("#axddycsj").val();
								xddycsj.push(ycsj);
							}
							var postData = {};
							if (xddldhm == "") {
								layer.msg("请输入用户电话号码！");
								return;
							}
							if (xddckxm == "") {
								layer.msg("请输入乘客姓名！");
								return;
							}
							if (xddycsj.length == 0) {
								layer.msg("请选择调度日期！");
								return;
							}
							if ($("#axddycsj").val() == "") {
								layer.msg("请选择调度时间！");
								return;
							}
							if (xddxxdz == "") {
								layer.msg("请输入详细地址！");
								return;
							}
							if (xddszqy == "") {
								layer.msg("请输入详细地址所在区域！");
								return;
							}
							if (xddmddd == "") {
								layer.msg("请输入目的地！");
								return;
							}
							if (xddfjxx == "") {
								layer.msg("请输入附加信息！");
								return;
							}
							if (xddpx == "") {
								layer.msg("请设置上车位置！");
								return;
							}
							// if (xddzpcl == "") {
							// 	layer.msg("请输入指派车辆！");
							// 	return;
							// }

							postData.DESP_ADDRESS = xddmddd;
							postData.DISP_USER = username;

							postData.NOTE = xddfjxx;
							postData.ADDRESS = xddxxdz;
							postData.ADDRESS_REF = xddxxdz;
							postData.CUST_NAME = xddckxm;
							postData.CUST_TEL = xddldhm;
							postData.LONGTI = xddpx;
							postData.LATI = xddpy;
							postData.OUTPHONE = xddldhm;
							postData.QQ_ID = createqqid();
							postData.YC_TIME = xddycsj;//多个
							postData.SZQY = xddszqy;
							postData.DDQY = '爱心出租(人工)';

							postData.YCMS = $("#axddycms").val();

							postData.TSRQ = $("#axddtsrq").val();
							postData.PTQK = $("#axddptqk").val();
							postData.YCXQ = $("#axddycxq").val();

							postData.VEHI_NO1 = $("#axddcl1").val();// 指派车辆1;
							postData.SIM_NUM1 = $("#axddclsim1").val();
							postData.COMP_NAME1 = $("#axddclgs1").val();
							postData.SJDH1 = $("#axddlxfs1").val();
							postData.VEHI_NO2 ='';//$("#axddcl2").val();// 指派车辆2;
							postData.SIM_NUM2 ='';// $("#axddclsim2").val();
							postData.COMP_NAME2 ='';// $("#axddclgs2").val();
							postData.SJDH2 ='';// $("#axddlxfs2").val();
							postData.VEHI_NO3 ='';// $("#axddcl3").val();// 指派车辆3;
							postData.SIM_NUM3 ='';// $("#axddclsim3").val();
							postData.COMP_NAME3 ='';// $("#axddclgs3").val();
							postData.SJDH3 ='';// $("#axddlxfs3").val();
							postData.JSYXM=$('#axddsjxm1').val();

							axdd(postData).then(function (data) {
								// console.log(data);
								if (data.error == '0') {
									layer.msg("调度成功!");
									_self.findywd();
									_self.clearDD();
								} else {
									layer.msg(data.etime + "后面的调度失败!");
								}
							});
						})
					});

					// 查询业务单
					query('#btn_axdd_find').on('click', function () {
						_self.findywd();
					});
					// 修改业务单
					query('#btn_axdd_edit').on('click', function () {
						_self.editywd();
					});
					// 取消业务单
					query('#btn_axdd_del').on('click', function () {
						_self.qxywd();
					});
					// 司机乘客评价
					query('#btn_axdd_pj').on('click', function () {
						_self.pjywd();
					});

					query('#axdd-rightContentPane .panel-titleBpx .title span').on('click', function () {
						$(this).siblings('.click').removeClass('click');
						$(this).addClass('click');
					});

					//指派车辆添加
					query('#zpclan1').on('click',function(){
						$('#zpcldivcl2').css('display','');
						$('#zpcldivgs2').css('display','');
						$('#zpclan1').css('display','none');
					});
					query('#zpclan2').on('click',function(){
						$('#zpcldivcl3').css('display','');
						$('#zpcldivgs3').css('display','');
						$('#zpclan2').css('display','none');
					});
					//用车时间日历选择框
					$("#axddchoosedate").click(function () {
						// if (selectDays.length >= 3) {
						// 	alert("最多选择3个日期");
						// 	return;
						// }
						WdatePicker({
							el: 'yyTime2',
							onpicked: function () {
								var rqycz=false;
								for (var i = 0; i < selectDays.length; i++) {
									if(this.value==selectDays[i]){
										rqycz=true;
										selectDays.splice(i, 1);
										break;
									}
								}
								if(!rqycz){
									selectDays.push(this.value);
								}
								selectDays.sort();
								$("#ycrq-comboBox").find('.iFList').html("");
								for (var i = 0; i < selectDays.length; i++) {
									var cphms = "<li data-value='" + selectDays[i] + "'>" + selectDays[i] + "</li>";
									$("#ycrq-comboBox").find('.iFList').append(cphms);
								}
								if(selectDays.length>0){
									$("#axddycrq").val(selectDays[0]);
								}else{
									$("#axddycrq").val("");
								}

								$('#ycrq-comboBox').find('.iFList').on('click', function () {
									if (event.stopPropagation) {
										event.stopPropagation();
									} else if (window.event) {
										window.event.cancelBubble = true;
									}
								}).find('li').off('click').on('click', function () {
									$(this).addClass('selected').siblings('.selected').removeClass('selected');
									$("#ycrq-comboBox").find('input').data('value', $(this).data('value')).val($(this).text()).end().removeClass('selected');
								});

							},
							dateFmt: 'yyyy-MM-dd',
							minDate: '%y-%M-%d',
							specialDates: selectDays
						});
					});

				}
			});
		});




