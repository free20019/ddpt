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
        var zzddGrid = null, pcqrGrid = null, ddwcGrid = null, ldhmGrid = null, rwcjkGrid = null, qtywGrid = null,
            fjclGrid = null, xxywGrid = null,xxrwcjkGrid = null, store = null;
        var settime = null;
        var yhqSettime = null;
        var scmarker = null;// 上车点marker
        var yspoi = null;// 地物查询原始地址，点击定位后回到原始地址
        var lsjlxz = null;// 电话历史记录选择
        var xddzdcheck = 1;// 是否自动回拨
        var xddyycheck = 0;// 是否预约
        var map = null;// 地图对象
        var rwcmaplist = [];// 任务车marker集合
        var rwcmklist = [];// 任务车marker集合
        var dwcenter = null;// 地物中心点
        var markerydlistener = null;// 上车点marker移动监听
        var mapydlistener = null;// 地图移动移动监听
        var ddscd = null;//业务单上车点显示
        var pMenu = null;
        var cljkmarker = null;
        var fjclmarker = [];
        var sjclmarker = null;
        var ruler = null;// 测距工具
        var cluster = null;
        var hdtcon = null;
        var rgaxddorder = "";
        var rgaxddmdtno = "";
        var axddTimeIndex = null;
        var pointSimplifierIns, groupStyleMap = {};
        var ZZDDcolumns = {
            ZZDDXH: {
                label: '序号', renderCell: function (item) {
                    var type = dc.create("div", {innerHTML: item.ZZDDXH, style: {'text-align': 'center'}});
                    return type;
                }
            },
            DISP_ID: {
                label: '业务编号', renderCell: function (item) {
                    var type = dc.create("div", {innerHTML: item.DISP_ID, style: {'text-align': 'center'}});
                    if (item.DDQY == '爱心出租') {
                        type = dc.create("div", {
                            innerHTML: '<i class="icon-love"></i>' + item.DISP_ID,
                            style: {'text-align': 'center', 'color': 'red', 'position': 'relative'}
                        });
                    }
                    return type;
                }
            },
            YHQ: {
                label: '优惠券', renderCell: function (item) {
                    var type = dc.create("div", {innerHTML: item.YHQ, style: {'text-align': 'center'}});
                    return type;
                }
            },
            YEWU_TYPE: {
                label: '业务类型', renderCell: function (item) {
                    var ywlxtd = "出租调度";
                    if (item.YEWU_TYPE == "1") {
                        ywlxtd = "小货调度";
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
            VEHI_NO: {
                label: '已派车牌号', renderCell: function (item) {
                    var type = dc.create("div", {innerHTML: item.VEHI_NO, style: {'text-align': 'center'}});
                    return type;
                }
            },
            VEHI_SIM: {
                label: 'SIM卡号', renderCell: function (item) {
                    var type = dc.create("div", {innerHTML: item.VEHI_SIM, style: {'text-align': 'center'}});
                    return type;
                }
            },
            DISP_TIME: {
                label: '调度时间', renderCell: function (item) {
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
            }
        };
        var PCQRcolumns = {
            PCQRXH: {
                label: '序号', renderCell: function (item) {
                    var type = dc.create("div", {innerHTML: item.PCQRXH, style: {'text-align': 'center'}});
                    return type;
                }
            },
            DISP_ID: {
                label: '业务编号', renderCell: function (item) {
                    var type = dc.create("div", {innerHTML: item.DISP_ID, style: {'text-align': 'center'}});
                    if (item.DDQY == '爱心出租') {
                        type = dc.create("div", {
                            innerHTML: '<i class="icon-love"></i>' + item.DISP_ID,
                            style: {'text-align': 'center', 'color': 'red', 'position': 'relative'}
                        });
                    }
                    return type;
                }
            },
            YHQ: {
                label: '优惠券', renderCell: function (item) {
                    var type = dc.create("div", {innerHTML: item.YHQ, style: {'text-align': 'center'}});
                    return type;
                }
            },
            YEWU_TYPE: {
                label: '业务类型', renderCell: function (item) {
                    var ywlxtd = "出租调度";
                    if (item.YEWU_TYPE == "1") {
                        ywlxtd = "小货调度";
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
            VEHI_NO: {
                label: '已派车牌号', renderCell: function (item) {
                    var type = dc.create("div", {innerHTML: item.VEHI_NO, style: {'text-align': 'center'}});
                    return type;
                }
            },
            VEHI_SIM: {
                label: 'SIM卡号', renderCell: function (item) {
                    var type = dc.create("div", {innerHTML: item.VEHI_SIM, style: {'text-align': 'center'}});
                    return type;
                }
            },
            DISP_TIME: {
                label: '调度时间', renderCell: function (item) {
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
            }
        };
        var DDWCcolumns = {
            DDWCXH: {
                label: '序号', renderCell: function (item) {
                    var type = dc.create("div", {innerHTML: item.DDWCXH, style: {'text-align': 'center'}});
                    return type;
                }
            },
            DISP_ID: {
                label: '业务编号', renderCell: function (item) {
                    var type = dc.create("div", {innerHTML: item.DISP_ID, style: {'text-align': 'center'}});
                    if (item.DDQY == '爱心出租') {
                        type = dc.create("div", {
                            innerHTML: '<i class="icon-love"></i>' + item.DISP_ID,
                            style: {'text-align': 'center', 'color': 'red', 'position': 'relative'}
                        });
                    }
                    return type;
                }
            },
            YHQ: {
                label: '优惠券', renderCell: function (item) {
                    var type = dc.create("div", {innerHTML: item.YHQ, style: {'text-align': 'center'}});
                    return type;
                }
            },
            YEWU_TYPE: {
                label: '业务类型', renderCell: function (item) {
                    var ywlxtd = "出租调度";
                    if (item.YEWU_TYPE == "1") {
                        ywlxtd = "小货调度";
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
            VEHI_NO: {
                label: '已派车牌号', renderCell: function (item) {
                    var type = dc.create("div", {innerHTML: item.VEHI_NO, style: {'text-align': 'center'}});
                    return type;
                }
            },
            VEHI_SIM: {
                label: 'SIM卡号', renderCell: function (item) {
                    var type = dc.create("div", {innerHTML: item.VEHI_SIM, style: {'text-align': 'center'}});
                    return type;
                }
            },
            DISP_TIME: {
                label: '调度时间', renderCell: function (item) {
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
            }
        };
        var QTYWcolumns = {
            QTYWXH: {
                label: '序号', renderCell: function (item) {
                    var type = dc.create("div", {innerHTML: item.QTYWXH, style: {'text-align': 'center'}});
                    return type;
                }
            },
            DISP_ID: {
                label: '业务编号', renderCell: function (item) {
                    var type = dc.create("div", {innerHTML: item.DISP_ID, style: {'text-align': 'center'}});
                    if (item.DDQY == '爱心出租') {
                        type = dc.create("div", {
                            innerHTML: '<i class="icon-love"></i>' + item.DISP_ID,
                            style: {'text-align': 'center', 'color': 'red', 'position': 'relative'}
                        });
                    }
                    return type;
                }
            },
            YHQ: {
                label: '优惠券', renderCell: function (item) {
                    var type = dc.create("div", {innerHTML: item.YHQ, style: {'text-align': 'center'}});
                    if (item.YHQ == null || item.YHQ == 'null') {
                        type = dc.create("div", {innerHTML: '', style: {'text-align': 'center'}});
                    }
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
                    if (item.SZQY == null || item.SZQY == 'null') {
                        type = dc.create("div", {innerHTML: '', style: {'text-align': 'center'}});
                    }
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
            VEHI_NO: {
                label: '已派车牌号', renderCell: function (item) {
                    var type = dc.create("div", {innerHTML: item.VEHI_NO, style: {'text-align': 'center'}});
                    return type;
                }
            },
            VEHI_SIM: {
                label: 'SIM卡号', renderCell: function (item) {
                    var type = dc.create("div", {innerHTML: item.VEHI_SIM, style: {'text-align': 'center'}});
                    return type;
                }
            },
            DISP_TIME: {
                label: '调度时间', renderCell: function (item) {
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
            }
        };
        var RWCcolumns = {
            RWCXH: {
                label: '序号', renderCell: function (item) {
                    var type = dc.create("div", {innerHTML: item.RWCXH, style: {'text-align': 'center'}});
                    return type;
                }
            },
            DISP_ID: {
                label: '业务编号', renderCell: function (item) {
                    var type = dc.create("div", {innerHTML: item.DISP_ID, style: {'text-align': 'center'}});
                    if (item.DDQY == '爱心出租') {
                        type = dc.create("div", {
                            innerHTML: '<i class="icon-love"></i>' + item.DISP_ID,
                            style: {'text-align': 'center', 'color': 'red', 'position': 'relative'}
                        });
                    }
                    return type;
                }
            },
            VEHI_NO: {
                label: '车牌号码', renderCell: function (item) {
                    var type = dc.create("div", {innerHTML: item.VEHI_NO, style: {'text-align': 'center'}});
                    return type;
                }
            },
            VEHI_SIM: {
                label: 'SIM卡', renderCell: function (item) {
                    var type = dc.create("div", {innerHTML: item.VEHI_SIM, style: {'text-align': 'center'}});
                    return type;
                }
            },
            COMP_NAME: {
                label: '公司名称', renderCell: function (item) {
                    var type = dc.create("div", {innerHTML: item.COMP_NAME, style: {'text-align': 'center'}});
                    return type;
                }
            },
            SPEED: {
                label: '速度', renderCell: function (item) {
                    var type = dc.create("div", {innerHTML: item.SPEED, style: {'text-align': 'center'}});
                    return type;
                }
            },
            PX: {
                label: '经度', renderCell: function (item) {
                    var type = dc.create("div", {innerHTML: item.PX, style: {'text-align': 'center'}});
                    return type;
                }
            },
            PY: {
                label: '纬度', renderCell: function (item) {
                    var type = dc.create("div", {innerHTML: item.PY, style: {'text-align': 'center'}});
                    return type;
                }
            },
            ANGLE: {
                label: '方向', renderCell: function (item) {
                    var type = dc.create("div", {innerHTML: dlwz(item.ANGLE), style: {'text-align': 'center'}});
                    return type;
                }
            },
            STIME: {
                label: '定位时间', renderCell: function (item) {
                    var type = dc.create("div", {
                        innerHTML: util.formatYYYYMMDDHHMISS(item.STIME),
                        style: {'text-align': 'center'}
                    });
                    return type;
                }
            }
        };
        var FJCLcolumns = {
            RWCXH: {
                label: '序号', renderCell: function (item) {
                    var type = dc.create("div", {innerHTML: item.RWCXH, style: {'text-align': 'center'}});
                    return type;
                }
            },
            VEHI_NO: {
                label: '车牌号码', renderCell: function (item) {
                    var type = dc.create("div", {innerHTML: item.VEHI_NO, style: {'text-align': 'center'}});
                    return type;
                }
            },
            JL: {
                label: '车辆距离', renderCell: function (item) {
                    var type = dc.create("div", {innerHTML: item.JL, style: {'text-align': 'center'}});
                    return type;
                }
            },
            VEHI_SIM: {
                label: 'SIM卡', renderCell: function (item) {
                    var type = dc.create("div", {innerHTML: item.VEHI_SIM, style: {'text-align': 'center'}});
                    return type;
                }
            },
            COMP_NAME: {
                label: '公司名称', renderCell: function (item) {
                    var type = dc.create("div", {innerHTML: item.COMP_NAME, style: {'text-align': 'center'}});
                    return type;
                }
            },
            SPEED: {
                label: '速度', renderCell: function (item) {
                    var type = dc.create("div", {innerHTML: item.SPEED, style: {'text-align': 'center'}});
                    return type;
                }
            },
            PX: {
                label: '经度', renderCell: function (item) {
                    var type = dc.create("div", {innerHTML: item.PX, style: {'text-align': 'center'}});
                    return type;
                }
            },
            PY: {
                label: '纬度', renderCell: function (item) {
                    var type = dc.create("div", {innerHTML: item.PY, style: {'text-align': 'center'}});
                    return type;
                }
            },
            ANGLE: {
                label: '方向', renderCell: function (item) {
                    var type = dc.create("div", {innerHTML: dlwz(item.ANGLE), style: {'text-align': 'center'}});
                    return type;
                }
            },
            STIME: {
                label: '定位时间', renderCell: function (item) {
                    var type = dc.create("div", {
                        innerHTML: util.formatYYYYMMDDHHMISS(item.STIME),
                        style: {'text-align': 'center'}
                    });
                    return type;
                }
            }
        };
        var XXYWcolumns = {
            checkbox: {label: '选择', selector: 'checkbox'},
            XXYWXH: {
                label: '序号', renderCell: function (item) {
                    var type = dc.create("div", {innerHTML: item.XXYWXH, style: {'text-align': 'center'}});
                    return type;
                }
            },
            ORDER_NR: {
                label: '业务编号', renderCell: function (item) {
                    var type = dc.create("div", {
                        // innerHTML: '<i class="icon-xxywl"></i>' + item.ORDER_NR,
                        innerHTML: item.ORDER_NR,
                        style: {'text-align': 'center', 'color': '#219ddd', 'position': 'relative'}
                    });
                    return type;
                }
            },
            ELDERLY_MAME: {
                label: '客户姓名', renderCell: function (item) {
                    var type = dc.create("div", {innerHTML: item.ELDERLY_MAME, style: {'text-align': 'center'}});
                    return type;
                }
            },
            ELDERLY_PHONE: {
                label: '联系电话', renderCell: function (item) {
                    var type = dc.create("div", {innerHTML: item.ELDERLY_PHONE, style: {'text-align': 'center'}});
                    return type;
                }
            },
            ORDER_PRICE: {
                label: '订单价格', renderCell: function (item) {
                    var type = dc.create("div", {innerHTML: item.ORDER_PRICE, style: {'text-align': 'center'}});
                    return type;
                }
            },
            PAY_STATUS: {
                label: '支付状态', renderCell: function (item) {
                	var zfzt = '未支付';
                	if(item.PAY_STATUS=='1'){
                		zfzt = '已支付';
					}
                    var type = dc.create("div", {innerHTML: zfzt, style: {'text-align': 'center'}});
                    return type;
                }
            },
            PAY_PRICE: {
                label: '实付金额', renderCell: function (item) {
                    var type = dc.create("div", {innerHTML: item.PAY_PRICE, style: {'text-align': 'center'}});
                    return type;
                }
            },
            STARTING_POINT: {
                label: '上车地点', renderCell: function (item) {
                    var type = dc.create("div", {innerHTML: item.STARTING_POINT, style: {'text-align': 'center'}});
                    return type;
                }
            },
            ENDING_POINT: {
                label: '下车地点', renderCell: function (item) {
                    var type = dc.create("div", {innerHTML: item.ENDING_POINT, style: {'text-align': 'center'}});
                    return type;
                }
            },
            ORDER_START_TIME: {
                label: '调度时间', renderCell: function (item) {
                    var type = dc.create("div", {
                        innerHTML: util.formatYYYYMMDDHHMISS(item.ORDER_START_TIME),
                        style: {'text-align': 'center'}
                    });
                    return type;
                }
            },
            DIAODU_STATUS: {
                label: '调度状态', renderCell: function (item) {
                	var ddzt='未调度';
                	if(item.DIAODU_STATUS=='1'){
                		ddzt='已调度';
					}
                    var type = dc.create("div", {innerHTML: ddzt, style: {'text-align': 'center'}});
                    return type;
                }
            },
            VECHICLE_PLATE: {
                label: '已派车牌号', renderCell: function (item) {
                    var type = dc.create("div", {innerHTML: item.VECHICLE_PLATE, style: {'text-align': 'center'}});
                    return type;
                }
            },
            DRIVER_NAME: {
                label: '司机姓名', renderCell: function (item) {
                    var type = dc.create("div", {innerHTML: item.DRIVER_NAME, style: {'text-align': 'center'}});
                    return type;
                }
            },
            DRIVER_PHONE: {
                label: '司机电话', renderCell: function (item) {
                    var type = dc.create("div", {innerHTML: item.DRIVER_PHONE, style: {'text-align': 'center'}});
                    return type;
                }
            },
            VEHI_SIM: {
                label: 'SIM卡号', renderCell: function (item) {
                    var type = dc.create("div", {innerHTML: item.VEHI_SIM, style: {'text-align': 'center'}});
                    return type;
                }
            },
            TRIP_START_TIME: {
                label: '行程开始时间', renderCell: function (item) {
                    var type = dc.create("div", {
                        innerHTML: util.formatYYYYMMDDHHMISS(item.TRIP_START_TIME),
                        style: {'text-align': 'center'}
                    });
                    return type;
                }
            },
            TRIP_END_TIME: {
                label: '行程结束时间', renderCell: function (item) {
                    var type = dc.create("div", {
                        innerHTML: util.formatYYYYMMDDHHMISS(item.TRIP_END_TIME),
                        style: {'text-align': 'center'}
                    });
                    return type;
                }
            },
            START_PIC_URL: {
                label: '行程开始图片', renderCell: function (item) {
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
                }
            },
            END_PIC_URL: {
                label: '行程结束图片', renderCell: function (item) {
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
                }
            },
            LATEST_STATUS: {
                label: '订单状态', renderCell: function (item) {
                	//订单状态：1.已接单  2.已开始  3.已结束
					var ddzt = '已接单';
					if(item.LATEST_STATUS=='2'){
						ddzt = '已开始';
					}else if(item.LATEST_STATUS=='3'){
						ddzt = '已结束';
					}
                    var type = dc.create("div", {innerHTML: ddzt, style: {'text-align': 'center'}});
                    return type;
                }
            },
            ORDER_VALID: {
                label: '取消订单状态', renderCell: function (item) {
                	//取消订单状态：0未取消 1取消中 2取消同意 4取消拒绝
					var qxddzt='未取消';
					if(item.ORDER_VALID=='1'){
						qxddzt='取消中';
					}else if(item.ORDER_VALID=='2'){
						qxddzt='取消同意';
					}else if(item.ORDER_VALID=='4'){
						qxddzt='取消拒绝';
					}
                    var type = dc.create("div", {innerHTML: qxddzt, style: {'text-align': 'center'}});
                    return type;
                }
            },
            CANCEL_REASON: {
                label: '取消订单原因', renderCell: function (item) {
                    var type = dc.create("div", {innerHTML: item.CANCEL_REASON, style: {'text-align': 'center'}});
                    return type;
                }
            }
        };
        var XXRWCcolumns = {
            RWCXH: {
                label: '序号', renderCell: function (item) {
                    var type = dc.create("div", {innerHTML: item.RWCXH, style: {'text-align': 'center'}});
                    return type;
                }
            },
            DISP_ID: {
                label: '业务编号', renderCell: function (item) {
                    var type = dc.create("div", {innerHTML: item.DISP_ID, style: {'text-align': 'center'}});
                    if (item.DDQY == '爱心出租') {
                        type = dc.create("div", {
                            innerHTML: '<i class="icon-love"></i>' + item.DISP_ID,
                            style: {'text-align': 'center', 'color': 'red', 'position': 'relative'}
                        });
                    }
                    return type;
                }
            },
            VEHI_NO: {
                label: '车牌号码', renderCell: function (item) {
                    var type = dc.create("div", {innerHTML: item.VEHI_NO, style: {'text-align': 'center'}});
                    return type;
                }
            },
            VEHI_SIM: {
                label: 'SIM卡', renderCell: function (item) {
                    var type = dc.create("div", {innerHTML: item.VEHI_SIM, style: {'text-align': 'center'}});
                    return type;
                }
            },
            COMP_NAME: {
                label: '公司名称', renderCell: function (item) {
                    var type = dc.create("div", {innerHTML: item.COMP_NAME, style: {'text-align': 'center'}});
                    return type;
                }
            },
            SPEED: {
                label: '速度', renderCell: function (item) {
                    var type = dc.create("div", {innerHTML: item.SPEED, style: {'text-align': 'center'}});
                    return type;
                }
            },
            PX: {
                label: '经度', renderCell: function (item) {
                    var type = dc.create("div", {innerHTML: item.PX, style: {'text-align': 'center'}});
                    return type;
                }
            },
            PY: {
                label: '纬度', renderCell: function (item) {
                    var type = dc.create("div", {innerHTML: item.PY, style: {'text-align': 'center'}});
                    return type;
                }
            },
            ANGLE: {
                label: '方向', renderCell: function (item) {
                    var type = dc.create("div", {innerHTML: dlwz(item.ANGLE), style: {'text-align': 'center'}});
                    return type;
                }
            },
            STIME: {
                label: '定位时间', renderCell: function (item) {
                    var type = dc.create("div", {
                        innerHTML: util.formatYYYYMMDDHHMISS(item.STIME),
                        style: {'text-align': 'center'}
                    });
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
            ckfsxx: function (obj) {// 弹出发给车辆终端
                var cljk_self = obj;
                obj.infoWindow.open(map, obj.getPosition());
// map.setCenter(obj.getPosition());
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
            fjcl: function () {// 附近车辆
                dddata().then(function (data) {
                    // console.log(data)
                    yjccl = data.yjccl;
                    gzcl = data.gzlist;
                    lovecls = data.lovecls;
                    $("#clzs").html(data.num.total);
                    $("#clzxs").html(data.num.onnum);
                    $("#clkcs").html(data.num.nnum);
                    $("#clzcs").html(data.num.hnum);
                    $("#cllxs").html(data.num.offnum);
                    $("#cldrsxs").html(data.num.drsxs);
                    if (data.num.total === '0' || data.num.drsxs === '0') {
                        $("#cldrsxl").html("0%");
                    } else {
                        var zs = parseInt(data.num.total);
                        var dr = parseInt(data.num.drsxs);
                        $("#cldrsxl").html((dr * 100 / zs).toFixed(2) + "%");
                    }
                    if (data.zxvehilist.length > 0) {
                        var zxvehilist = data.zxvehilist;
                        pointSimplifierIns.setData(zxvehilist);
                    }
                });
            },
            addMark4: function (obj) {
// var title = '车牌号码：<span
// style="font-size:11px;color:#278ac4;">'+obj.vehino+'</span>',
// content = [];
                findclxx(obj.mdtno).then(function (data) {
                    obj = $.extend(obj, data);
                    var title = '<span style="font-size:12px;color:#278ac4;">' + obj.vehino + '</span>';
                    if (obj.gpsStatus == "1") {
                        title += '<span style="font-size:11px;color:red;">(非精确)</span>';
                    }
                    var content = [];
                    // content.push("经度："+obj.longi+" 纬度："+obj.lati);
                    content.push("时间：" + obj.dateTime);
                    // content.push("速度："+obj.speed+" 方向："+dlwz(obj.heading)+"
                    // 状态："+kzc(obj.carStatus));
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
                        content: createInfoWindow(title, content.join("<br/>")),
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
                        content: createInfoWindow(title1, content1.join("<br/>")),
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
            clearDD: function () {
                $("#xddldhm").val("");// 来电号码
                $("#xddhbdh").val("");// 回拨电话
                $("#xddkhdj").html("A");
                $("#xddscycsj").html("");
                $("#xddcstj").html("");
                lsjlxz = [];
//				$('#xdd_zdcheck').attr('checked',true);// 是否自动回拨
                $('#xdd_zdcheck').prop("checked", true);
                xddzdcheck = 1;
//				$('#xdd_yycheck').attr('checked',false);// 是否预约
                $('#xdd_yycheck').prop("checked", false);
                xddyycheck = 0;
                $("#xddyyjcsj").val("");// 预约叫车时间
                $("#xddckxm").val("");// 乘客姓名
                $("#xddxxdz").val("");// 详细地址
                $("#xddszqy").val("");// 所在区域
                $("#xddmddd").val("");// 目的地点
                $("#xddfjxx").val("");// 附加信息
                $("#xddddqy").val("出租车");// 调度区域
                $("#xddddfw").val("1km");// 调度范围
                var ddjl = '<li data-value="" style="height: 1.5em;">0.5km</li>' +
                    '<li data-value="" style="height: 1.5em;">1km</li>' +
                    '<li data-value="" style="height: 1.5em;">2km</li>' +
                    '<li data-value="" style="height: 1.5em;">3km</li>' +
                    '<li data-value="" style="height: 1.5em;">4km</li>';
                $("#ddfw-comboBox").find('.iFList').html(ddjl);
                $("#xhcdddiv").css('display', 'none');
                //爱心调度
                $("#axddyhq").val("");// 优惠券
                $("#yhqcheck").prop("checked", false);// 优惠券复选框
                $("#axdddiv").css('display', 'none');
                addEventComboBoxList('#ddfw-comboBox');
                if (scmarker) {
                    scmarker.setMap(null);
                    scmarker = null;
                }
                if (ddscd) {
                    ddscd.setMap(null);
                }
                AMap.event.removeListener(markerydlistener);
            },
            clearRGAXDD: function () {
                $("#xddldhm").val("");// 来电号码
                $("#xddhbdh").val("");// 回拨电话
                $("#xddkhdj").html("A");
                $("#xddscycsj").html("");
                $("#xddcstj").html("");
                lsjlxz = [];
//				$('#xdd_zdcheck').attr('checked',true);// 是否自动回拨
                $('#xdd_zdcheck').prop("checked", true);
                xddzdcheck = 1;
//				$('#xdd_yycheck').attr('checked',false);// 是否预约
                $('#xdd_yycheck').prop("checked", false);
                xddyycheck = 0;
                $("#xddyyjcsj").val("");// 预约叫车时间
                $("#xddckxm").val("");// 乘客姓名
                $("#xddxxdz").val("");// 详细地址
                $("#xddszqy").val("");// 所在区域
                $("#xddmddd").val("");// 目的地点
                $("#xddfjxx").val("");// 附加信息
                $("#xddddqy").val("出租车");// 调度区域
                $("#xddddfw").val("1km");// 调度范围
                var ddjl = '<li data-value="" style="height: 1.5em;">0.5km</li>' +
                    '<li data-value="" style="height: 1.5em;">1km</li>' +
                    '<li data-value="" style="height: 1.5em;">2km</li>' +
                    '<li data-value="" style="height: 1.5em;">3km</li>' +
                    '<li data-value="" style="height: 1.5em;">4km</li>';
                $("#ddfw-comboBox").find('.iFList').html(ddjl);
                $("#xhcdddiv").css('display', 'none');
                //爱心调度
                $("#axddyhq").val("");// 优惠券
                $("#yhqcheck").prop("checked", false);// 优惠券复选框
                $("#axdddiv").css('display', 'none');
                addEventComboBoxList('#ddfw-comboBox');
                if (scmarker) {
                    scmarker.setMap(null);
                    scmarker = null;
                }
                if (ddscd) {
                    ddscd.setMap(null);
                }
                if (sjclmarker) {
                    map.remove(sjclmarker);
                    map.remove(sjclmarker.infoWindow);
                    map.remove(sjclmarker.infoWindow1);
                }

                AMap.event.removeListener(markerydlistener);
                $("#rgddzpcl").val('');
                $("#rgaxddbtn").css('display', 'none');
                $("#zcddbtn").css('display', 'block');
                $("#rgaxddyc1").css('display', 'none');
                $("#rgaxddyc2").css('display', 'none');
            },
            closeInfoWindow: function () {
                map.clearInfoWindow();
            },
            gbcd: function () {// 关闭菜单
                if (pMenu) {
                    dijit.popup.close(pMenu);
                }
            },
            kbxx: function (json) {// 拷贝信息（新增调度）
                $("#xddldhm").val(json.CUST_TEL);// 来电号码
                $("#xddhbdh").val(json.OUTPHONE);// 回拨电话
                if (json.AUTOOUTPHONE == "1") {
//            		$('#xdd_zdcheck').attr('checked',true);// 是否自动回拨
                    $('#xdd_zdcheck').prop("checked", true);
                    xddzdcheck = 1;
                } else {
//            		$('#xdd_zdcheck').attr('checked',false);// 是否自动回拨
                    $('#xdd_zdcheck').prop("checked", false);
                    xddzdcheck = 0;
                }
                if (json.SFYY == "1") {
                    $('#xdd_yycheck').prop('checked', true);// 是否预约
                    $("#xddyyjcsj").val(util.formatYYYYMMDDHHMISS(json.DISP_TIME));// 预约叫车时间
                    $("#xddyyjcsjlabel").css('display', '');
                    $("#xddyyjcsjdiv").css('display', '');
                    xddyycheck = 1;
                } else {
                    $('#xdd_yycheck').prop('checked', false);// 是否预约
                    $("#xddyyjcsjlabel").css('display', 'none');
                    $("#xddyyjcsjdiv").css('display', 'none');
                    xddyycheck = 0;
                }
                $("#xddckxm").val(json.CUST_NAME);// 乘客姓名
                $("#xddxxdz").val(json.ADDRESS);// 详细地址
                $("#xddszqy").val(json.SZQY);// 所在区域
                $("#xddmddd").val(json.DEST_ADDRESS);// 目的地点
                $("#xddfjxx").val(json.NOTE);// 附加信息
                $("#xddddqy").val(json.DDQY);// 调度区域
                if (json.DDQY == '爱心出租') {
                    $("#axdddiv").css('display', 'block');
                    if (json.YHQ != '' && json.YHQ != null) {
                        $("#yhqcheck").prop("checked", true);// 优惠券复选框
                        $("#axddyhq").val(json.YHQ);
                        $("#axddyhq").removeAttr("disabled");
                    } else {
                        $("#yhqcheck").prop("checked", false);// 优惠券复选框
                        $("#axddyhq").val('');
                    }

                }

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
            rgdd: function (json) {// 拷贝信息（新增调度）
                var _self = this;
                $("#xddldhm").val(json.CUST_TEL);// 来电号码
                $("#xddhbdh").val(json.OUTPHONE);// 回拨电话
                rgaxddorder = json.DISP_ID;
                if (json.AUTOOUTPHONE == "1") {
//            		$('#xdd_zdcheck').attr('checked',true);// 是否自动回拨
                    $('#xdd_zdcheck').prop("checked", true);
                    xddzdcheck = 1;
                } else {
//            		$('#xdd_zdcheck').attr('checked',false);// 是否自动回拨
                    $('#xdd_zdcheck').prop("checked", false);
                    xddzdcheck = 0;
                }
                if (json.SFYY == "1") {
                    $('#xdd_yycheck').prop('checked', true);// 是否预约
                    $("#xddyyjcsj").val(util.formatYYYYMMDDHHMISS(json.DISP_TIME));// 预约叫车时间
                    $("#xddyyjcsjlabel").css('display', '');
                    $("#xddyyjcsjdiv").css('display', '');
                    xddyycheck = 1;
                } else {
                    $('#xdd_yycheck').prop('checked', false);// 是否预约
                    $("#xddyyjcsjlabel").css('display', 'none');
                    $("#xddyyjcsjdiv").css('display', 'none');
                    xddyycheck = 0;
                }
                $("#xddckxm").val(json.CUST_NAME);// 乘客姓名
                $("#xddxxdz").val(json.ADDRESS);// 详细地址
                $("#xddszqy").val(json.SZQY);// 所在区域
                $("#xddmddd").val(json.DEST_ADDRESS);// 目的地点
                $("#xddfjxx").val(json.NOTE);// 附加信息
                $("#xddddqy").val(json.DDQY);// 调度区域
                $("#axddyhq").attr("disabled", true);
                if (json.DDQY == '爱心出租') {
                    $("#axdddiv").css('display', 'block');
                    if (json.YHQ != '' && json.YHQ != null) {
                        $("#yhqcheck").prop("checked", true);// 优惠券复选框
                        $("#axddyhq").val(json.YHQ);
                        $("#axddyhq").removeAttr("disabled");
                    } else {
                        $("#yhqcheck").prop("checked", false);// 优惠券复选框
                        $("#axddyhq").val('');
                    }
                }
                $("#rgddzpcl").val('');
                $("#rgaxddbtn").css('display', 'block');
                $("#zcddbtn").css('display', 'none');

                $("#rgaxddyc1").css('display', '');
                $("#rgaxddyc2").css('display', '');
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
                //查询附近车辆
                findaxddfjcl(json.LONGTI, json.LATI).then(function (data) {
                    // console.log(data);
                    $("#xddConent-tabContainer_tablist_fjcltitle").html("附近车辆(" + data.length + ")");
                    fjclGrid.set('collection', new Memory({data: {identifier: 'RWCXH', label: 'RWCXH', items: data}}));
                    var tc = dijit.byId('xddConent-tabContainer');
                    tc.selectChild(tc.getChildren()[5]);
                    fjclGrid.on('.dgrid-row:dblclick', function (event) {
                        var row = fjclGrid.row(event);
                        if (sjclmarker) {
                            sjclmarker.setMap(null);
                        }
                        if (ddscd) {
                            ddscd.setMap(null);
                        }
                        dwjkcl(row.data.VEHI_NO).then(function (data) {
                            if (data.PX !== 0 && !data.PX) {
                                layer.msg("当前无定位数据！");
                                return;
                            }
                            $("#rgddzpcl").val(row.data.VEHI_NO);
                            rgaxddmdtno = row.data.MDT_NO;
                            var icon = gettb(data, 1);
                            sjclmarker = new AMap.Marker({
                                position: [data.PX, data.PY],
                                offset: new AMap.Pixel(-10, -10),
                                icon: icon,
                                zIndex: 101,
                                map: map
                            });
//			    		ddscd = new AMap.Marker({
//			                position: [row.data.LONGTI, row.data.LATI],
//			                offset : new AMap.Pixel(-16,-16),
//			                icon:"resources/images/ddscd.png",
//			                zIndex:101,
//			                map : map
//			            });
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
                                content: createInfoWindow(title, content.join("<br/>")),
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
                                content: createInfoWindow(title1, content1.join("<br/>")),
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
                    });
                });
                dijit.popup.close(pMenu);
            },
            cxdd: function (json) {// 重新调度
                var postData = {};
                postData.cmd = 1;
                postData.disp_id = json.DISP_ID;
                postData.cksj = json.CUST_TEL;
                postData.scjd = json.LONGTI;
                postData.scwd = json.LATI;
                postData.qq_id = json.QQ_ID;
                postData.scdz = json.ADDRESS;
                postData.mdd = json.DEST_ADDRESS;
                postData.yhm = json.CUST_NAME;
                postData.xb = 0;
                postData.fjxx = json.NOTE;
                postData.cllx = 0;
                postData.ywlx = 0;
                postData.ci_id = json.CI_ID;
                postData.disp_user = username;
                postData.yclx = "电话约车";
                postData.wbdh = json.OUTPHONE;
                postData.ddfw = "1";
                postData.ddqy = json.DDQY;
                postData.yhq = json.YHQ;
                postData.sfyy = json.SFYY;
                if (json.SFYY == "1") {
                    postData.ycsj = util.formatYYYYMMDDHHMISS(json.DISP_TIME);
                } else {
                    postData.ycsj = "";
                }
                postData.zdwb = json.AUTOOUTPHONE;
                postData.fsbz = 9;
                postData.cxdd = "1";
                xddcxdd(postData).then(function (data) {
                    if (data.msg == "1") {
                        layer.msg('该业务单已有车辆接单！');
                    }
                    dijit.popup.close(pMenu);
                });
            },
            qxdd: function (json) {// 取消用车
// if(json.VEHI_NO!=null&&json.VEHI_NO!=""){
                var postData = {};
                postData.cmd = 2;
                postData.cksjh = json.CUST_TEL;
                postData.qq_id = json.QQ_ID;
                postData.isu = json.SIM_NUM;
                postData.dispid = json.DISP_ID;
                qxdd(postData).then(function () {
                    dijit.popup.close(pMenu);
                });
// }
            },
            ddwc: function (json) {// 右键调度完成
                var postData = {};
                postData.dispid = json.DISP_ID;
                ddwc(postData).then(function (data) {
                    if (data.msg == "1") {
                        layer.msg('操作成功！');
                        xddjsobj.findywd();
                    } else {
                        layer.msg('操作失败！');
                    }
                    56789
                    dijit.popup.close(pMenu);
                });
            },
            jcsc: function (json) {// 解除锁车
                var postData = {};
                postData.VEHI_NO = json.VEHI_NO;
//            	console.log(json.VEHI_NO+"  1111111");
                if (json.VEHI_NO == null && json.VEHI_NO == "") {
                    jcsc(postData).then(function (data) {
                        if (data.msg == "1") {
                            layer.msg('操作成功！');
                        } else {
                            layer.msg('操作失败！');
                        }
                        dijit.popup.close(pMenu);
                    });
                } else {
                    layer.msg('没有车辆！');
                }

            },
            sdcd: function (json) {
                if (json.VEHI_NO != null && json.VEHI_NO != "" && json.DISP_STATE == "已下单") {
                    var postData = {};
                    postData.cmd = 721;
                    postData.cksj = json.CUST_TEL;
                    postData.scjd = json.LONGTI;
                    postData.scwd = json.LATI;
                    postData.qq_id = json.QQ_ID;
                    postData.scdz = json.ADDRESS;
                    postData.mdd = json.DEST_ADDRESS;
                    postData.yhm = json.CUST_NAME;
                    postData.xb = 0;
                    postData.fjxx = json.NOTE;
                    postData.cllx = 0;
                    postData.ycsj = new Date().format('yyyyMMddhhmmss')
                    postData.ywlx = 0;
                    postData.isu = json.SIM_NUM;
                    postData.sfyy = 0;
                    postData.fsbz = 13;
                    postData.dispid = json.DISP_ID;
                    sdcd(postData).then(function (data) {
                        if (data.msg == "1") {
                            layer.msg('操作成功！');
                        } else {
                            layer.msg('操作失败！');
                        }
                        dijit.popup.close(pMenu);
                    });
                }
            },
            jfgl_wjdkr: function (obj, obj1, obj2) {
                if (obj.DISP_USER == username) {
                    if (obj.VEHI_NO != null && obj.VEHI_NO != "") {
                        var postData = {};
                        postData.jflx = obj2// 1:未接到客人
                        postData.DISP_ID = obj.DISP_ID;
                        postData.VEHI_NO = obj.VEHI_NO;
                        postData.CI_ID = obj.CI_ID;
                        postData.addjf = obj1;
                        jfgl(postData).then(function (data) {
                            if (data.msg == "1") {
                                layer.msg('操作成功！');
                            } else {
                                layer.msg('操作失败！');
                            }
                        });
                    }
                } else {
                    layer.msg('不是自己调度的业务单');
                }
            },
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
                            $("#dxfsEditor-xxnr").val($("#dxfsEditor-xxnr").val().replace("浙", $("#dxfsEditor-cphm").val()));
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
            dhtz: function (obj) {
                dijit.popup.close(pMenu);
                if (obj.DISP_USER == username) {
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
                } else {
                    layer.msg('不是自己调度的业务单');
                }
            },
            schc: function (obj) {
                dijit.popup.close(pMenu);
                if (obj.DISP_USER == username) {
                    hccpDialogPanel.set('href', 'app/html/ddxpt/editor/hccpEditor.html');
                    $('#hccpDialogPanel').removeAttr('style');
                    hccpDialog.show().then(function () {
                        hccpDialog.set('title', '回程车牌');
                        $("#hccpEditor-qued").click(function () {
                            var cp = $("#hccpEditor-hccp").val();
                            if (cp == "") {
                                layer.msg("请输入车牌号码！");
                            } else {
                                var postData = {};
                                postData.cp = cp;
                                postData.dispid = obj.DISP_ID;
                                schc(postData).then(function (data) {
                                    if (data.msg == "2") {
                                        layer.msg('请输入正确的车牌！');
                                    } else if (data.msg == "1") {
                                        layer.msg('操作成功！');
                                        hccpDialog.hide()
                                        xddjsobj.findywd();
                                    } else {
                                        layer.msg('操作失败！');
                                    }
                                });
                            }
                        });
                    });
                } else {
                    layer.msg('不是自己调度的业务单');
                }
            },
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
                    // 信息窗口
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
                        content: createInfoWindow(title, content.join("<br/>")),
                        offset: new AMap.Pixel(15, -23)
                    });
                    // 积分查询窗口
                    var title1 = '<span style="font-size:11px;color:#278ac4;">' + json[i].VEHI_NO + '</span>',
                        content1 = [];
                    content1.push("调度总数：" + json[i].DISP_NUM);
                    content1.push("投诉总数：" + json[i].COMPL_NUM);
                    content1.push("积分总数：" + json[i].INTEGRAL);
                    var infoWindow1 = new AMap.InfoWindow({
                        isCustom: true,  // 使用自定义窗体
                        content: createInfoWindow(title1, content1.join("<br/>")),
                        offset: new AMap.Pixel(15, -23)
                    });
                    rwcmarker.infoWindow1 = infoWindow1;
                    rwcmarker.infoWindow = infoWindow;
                    rwcmarker.cp = json[i].VEHI_NO;
                    rwcmarker.clxx = json[i];
                    AMap.event.addListener(rwcmarker, 'click', function () {
                        xddjsobj.ckfsxx(rwcmarker);
                    });
                    rwcmklist.push(rwcmarker);
                    rwcmap.ywd = json[i].DISP_ID;
                    rwcmap.car = json[i].VEHI_NO;
                    rwcmap.marker = rwcmarker;
                    rwcmaplist.push(rwcmap);
                }
            },
            xddldjl: function (json) {
                queryLdjl(json).then(function (data) {
                    $("#xddkhdj").html(data.KHDJ);
                    if (data.KHDJ.indexOf('爱心') > 0) {
                        $("#xddkhdj").css('color', 'red');
                        $("#xddddqy").val('爱心出租');
                        $("#axdddiv").css('display', 'block');
                        $('#xdd_zdcheck').prop("checked", false);
                        xddzdcheck = 0;
                    } else {
                        $("#xddddqy").val('出租车');
                        $("#axdddiv").css('display', 'none');
                        $("#xddkhdj").css('color', '#000');
                    }
                    $("#xddscycsj").html(util.formatYYYYMMDDHHMISS(data.SCYC));
                    $("#xddcstj").html(data.CS);
                    lsjlxz = data.LDLSJL;
                });
            },
            findywd: function () {
                /* 查询业务单start */
                var ywdcp = $("#xddywcp").val();
                var ywdbh = $("#xddywbh").val();
                queryOrder(ywdcp, ywdbh).then(function (data) {
                    // console.log(data);
                    zzddGrid.set('minRowsPerPage', 999);
                    pcqrGrid.set('minRowsPerPage', 999);
                    ddwcGrid.set('minRowsPerPage', 999);
                    rwcjkGrid.set('minRowsPerPage', 999);

                    qtywGrid.set('minRowsPerPage', 999);
                    zzddGrid.set('collection', new Memory({
                        data: {
                            identifier: 'ZZDDXH',
                            label: 'ZZDDXH',
                            items: data.zzdd
                        }
                    }));
                    pcqrGrid.set('collection', new Memory({
                        data: {
                            identifier: 'PCQRXH',
                            label: 'PCQRXH',
                            items: data.pcqr
                        }
                    }));
                    ddwcGrid.set('collection', new Memory({
                        data: {
                            identifier: 'DDWCXH',
                            label: 'DDWCXH',
                            items: data.ddwc
                        }
                    }));
                    rwcjkGrid.set('collection', new Memory({
                        data: {
                            identifier: 'RWCXH',
                            label: 'RWCXH',
                            items: data.rwc
                        }
                    }));
                    qtywGrid.set('collection', new Memory({
                        data: {
                            identifier: 'QTYWXH',
                            label: 'QTYWXH',
                            items: data.qtyw
                        }
                    }));

                    setTimeout(function () {
                        $("#xddConent-tabContainer_tablist_zzddtitle").html("正在调度(" + data.zzdd.length + ")");
                        $("#xddConent-tabContainer_tablist_pcqrtitle").html("派车确认(" + data.pcqr.length + ")");
                        $("#xddConent-tabContainer_tablist_ddwctitle").html("调度完成(" + data.ddwc.length + ")");
                        $("#xddConent-tabContainer_tablist_rwcjktitle").html("任务车监控(" + data.rwc.length + ")");
                        $("#xddConent-tabContainer_tablist_qtywtitle").html("其他业务(" + data.qtyw.length + ")");
                        rwcdata = data.rwc;
                        // xddjsobj.rwcdw(rwcdata);
                    }, 500);
                });
                //查询孝心业务单
                queryXxyw(ywdcp, ywdbh).then(function (data) {
                    // console.log(data);
                    xxywGrid.set('minRowsPerPage', 999);
                    xxrwcjkGrid.set('minRowsPerPage', 999);
                    xxywGrid.set('collection', new Memory({
                        data: {
                            identifier: 'XXYWXH',
                            label: 'XXYWXH',
                            items: data.xxyw
                        }
                    }));
                    xxrwcjkGrid.set('collection', new Memory({
                        data: {
                            identifier: 'RWCXH',
                            label: 'RWCXH',
                            items: data.rwc
                        }
                    }));
                    setTimeout(function () {
                        $("#xddConent-tabContainer_tablist_xxywtitle").html("孝心业务(" + data.xxyw.length + ")");
                        $("#xddConent-tabContainer_tablist_xxrwcjktitle").html("孝心任务车监控(" + data.rwc.length + ")");
                    }, 500);
                });

                /* 查询业务单end */
            },
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
                        $("#xddxxdz").val(address.substring(address.indexOf('区') + 1));
                        // $("#xddxxdz").val(address.split("区")[1]==undefined?address.split("县")[1]:address.split("区")[1]);
                    } else {
                        $("#xddxxdz").val(address);
                    }
                    $("#xddszqy").val(addressqy);
                }
            },
            findaxdd: function () {
                var _self = this;
                clearTimeout(axddTimeIndex);
                var dqsj = new Date();
                var stime = dqsj.Format('yyyy-MM-dd hh:mm:ss');
                var min = dqsj.getMinutes();
                dqsj.setMinutes(min + 10);
                var etime = dqsj.Format('yyyy-MM-dd hh:mm:ss');
                queryAxddOrder(stime, etime, "", "", "", "").then(function (data) {
                    $("#axddlist").html("");
                    for (var i = 0; i < data.zzdd.length; i++) {
                        $("#axddlist").prepend('<li><a class="bjxx-red axddli"  target="_blank">' + data.zzdd[i].DISP_ID + '&nbsp;' + data.zzdd[i].SFM + '&nbsp;' + data.zzdd[i].CUST_TEL + '</a></li>');
                    }
                    query('.axddli').on('click', function () {
                        $('.icon-lovedd').parent().trigger("click");
                    });
                    axddTimeIndex = setTimeout(function () {
                        _self.findaxdd();
                    }, 30000);
                });
            },
            editxxywd: function(){
                var _self = this;
                var hs = [];
                var cone=null;
                dojo.forEach(xxywGrid.collection.data, function (item, index) {
                    if (xxywGrid.isSelected(item)) {
                        hs.push(item.ORDER_NR);
                        if(cone==null){
                            cone = item;
                        }
                    }
                });
                if(hs.length==0||hs.length>1){
                    layer.msg("请选择一条孝心业务订单！");
                    return;
                }

                xxzpclDialogPanel.set('href', 'app/html/ddxpt/editor/xxzpclEditor.html');
                    $('#xxzpclDialogPanel').removeAttr('style');
                    xxzpclDialog.show().then(function () {
                        $('#xxddzpcl-dispid-edit').html(hs[0]);
                        $('#xxddzpcl-khxm-edit').val(cone.ELDERLY_MAME);
                        $('#xxddzpcl-khdh-edit').val(cone.ELDERLY_PHONE);
                        $('#xxddzpcl-cphm-edit').val(cone.VECHICLE_PLATE);
                        $('#xxddzpcl-cllx-edit').val(cone.VECHICLE_CATAG);
                        $('#xxddzpcl-sjxm-edit').val(cone.DRIVER_NAME);
                        $('#xxddzpcl-sjdh-edit').val(cone.DRIVER_PHONE);
                        on(query('#xxddzpcl-cphm-edit'), 'blur', function () {
                            if ($('#xxddzpcl-cphm-edit').val().length > 3) {
                                queryCompByVehino($('#xxddzpcl-cphm-edit').val()).then(function (data) {
                                    if (data.result == "0") {
                                        layer.msg('没有该车辆信息，请确认车牌号码！');
                                    }
                                })
                            }
                        });
                        on(query('#xxddzpcl-qued'), 'click', function () {
                            var pdata = {};
                            pdata.ywd = hs[0];
                            pdata.cphm = $('#xxddzpcl-cphm-edit').val();
                            pdata.cllx = $('#xxddzpcl-cllx-edit').val();
                            pdata.sjxm = $('#xxddzpcl-sjxm-edit').val();
                            pdata.sjdh = $('#xxddzpcl-sjdh-edit').val();
                            editXxddOrder(pdata).then(function(data){
                                if(data.msg=="1"){
                                    // layer.msg(data.msg);
                                    layer.msg("修改订单成功！");
                                    xxzpclDialog.hide();
                                    _self.findywd();
                                }else{
                                    layer.msg("修改订单失败！");
                                }
                            });
                        })
                    });
            },
            delxxywd: function(){
                var _self = this;
                var hs = [];
                var cone=null;
                dojo.forEach(xxywGrid.collection.data, function (item, index) {
                    if (xxywGrid.isSelected(item)) {
                        hs.push(item.ORDER_NR);
                        if(cone==null){
                            cone = item;
                        }
                    }
                });
                if(hs.length==0||hs.length>1){
                    layer.msg("请选择一条孝心业务订单！");
                    return;
                }

                xxddqxDialogPanel.set('href', 'app/html/ddxpt/editor/xxddqxEditor.html');
						$('#xxddqxDialogPanel').removeAttr('style');
						xxddqxDialog.show().then(function () {
						    $('#xxddqx-ywbh').html(hs[0]);
						    $('#xxddqx-yhid').val(cone.CUSTOMER_ID);
						    $('#xxddqx-yfje').val(cone.PAY_PRICE?0:cone.PAY_PRICE);
							on(query('#xxqxddbtn'), 'click', function () {
								var postData={};
								postData.ywbh=hs[0];
								postData.qxyy=$('#xxddqx-qxyy').val();
								postData.yhid=$('#xxddqx-yhid').val();
								postData.yfje=$('#xxddqx-yfje').val();
								layer.confirm('确定取消选中的订单？', {
									btn: ['确定','取消'] //按钮
								}, function(){
									delXxddOrder(postData).then(function (data) {
										if(data.msg=="1"){
										    layer.msg("取消订单成功！");
											// layer.msg(data.msg);
											xxddqxDialog.hide();
											_self.findywd();
										}else{
											layer.msg("取消订单失败！");
										}
									});
								}, function(){
								});
							})
						});
            },
            initToolBar: function () {
                var _self = this;
                setTimeout(function () {
                    _self.findywd();
                    _self.fjcl();
                    _self.findaxdd();
                }, 1000);
                map = new AMap.Map('xddMap', {
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
                    for (var i = 0; i < 8; i++) {
                        groupStyleMap["resources/images/car/k" + (i + 1) + ".png"] = {
                            pointStyle: {
                                content: hdtcon.Render.Canvas.getImageContent("resources/images/car/k" + (i + 1) + ".png"),
                                width: 20,
                                height: 20,
                                offset: ['-50%', '-50%'],
                                fillStyle: null
                            }
                        };
                        groupStyleMap["resources/images/car/z" + (i + 1) + ".png"] = {
                            pointStyle: {
                                content: hdtcon.Render.Canvas.getImageContent("resources/images/car/z" + (i + 1) + ".png"),
                                width: 20,
                                height: 20,
                                offset: ['-50%', '-50%'],
                                fillStyle: null
                            }
                        };
                        groupStyleMap["resources/images/xhcar/k" + (i + 1) + ".png"] = {
                            pointStyle: {
                                content: hdtcon.Render.Canvas.getImageContent("resources/images/xhcar/k" + (i + 1) + ".png"),
                                width: 20,
                                height: 20,
                                offset: ['-50%', '-50%'],
                                fillStyle: null
                            }
                        };
                        groupStyleMap["resources/images/xhcar/z" + (i + 1) + ".png"] = {
                            pointStyle: {
                                content: hdtcon.Render.Canvas.getImageContent("resources/images/xhcar/z" + (i + 1) + ".png"),
                                width: 20,
                                height: 20,
                                offset: ['-50%', '-50%'],
                                fillStyle: null
                            }
                        };
                    }
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
                                var icon = getddtb(item);
                                return icon;
                            },
                            groupStyleOptions: function (obj) {
                                return groupStyleMap[obj];
                            }
                        }
                    });
                    pointSimplifierIns.on('pointClick', function (e, record) {
//			        	console.log(record.data);
                        xddjsobj.addMark4(record.data);
                    });
                });
                map.plugin(["AMap.RangingTool"], function () {
                    ruler = new AMap.RangingTool(map);
                });
                on(query('#mapcj'), 'click', function () {
                    ruler.turnOn();
                    AMap.event.addListener(ruler, "end", function () {
                        ruler.turnOff();
                    });
                });
                on(query('#mapfd'), 'click', function () {
                    map.setZoom(map.getZoom() + 1);
                });
                on(query('#mapsx'), 'click', function () {
                    map.setZoom(map.getZoom() - 1);
                });
                // 路线
// on(query('#maplx'), 'click', function () {
// if($('#xdd-lxdialog').css('display')=='none'){
// $('#xdd-lxdialog').css('display','block');
// }else{
// $('#xdd-lxdialog').css('display','none');
// }
// });
                AMapUI.loadUI(['misc/PoiPicker'], function (PoiPicker) {

                    var poiPicker = new PoiPicker({
                        input: 'wz-comboBox'
                    });
                    var poiPicker2 = new PoiPicker({
                        input: 'xddxxdz'
                    });
                    // 初始化poiPicker
                    poiPickerReady(poiPicker);
                    poiPickerReady2(poiPicker2);
                });
                function poiPickerReady(poiPicker) {
                    window.poiPicker = poiPicker;
                    poiPicker.on('poiPicked', function (poiResult) {
                        poi = poiResult.item,
                            dwcenter.setPosition(poi.location);
                        yspoi = poi.location;
                        map.setCenter(yspoi);
                        map.setZoom(17);
                        $("#wz-comboBox").val(poi.name);
                    });
                }
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
                        $("#xddxxdz").val(poi.name);
                        $("#xddszqy").val(poi.district.substring(poi.district.indexOf('市') + 1));
                        markerydlistener = AMap.event.addListener(scmarker, "dragend", function () {
                            map.setCenter(scmarker.getPosition());
                            _self.getDdxxdz();
                        });
                    });
                }
                on(query('#dddwbtn'), 'click', function () {
                    if (dwcenter) {
                        dwcenter.setPosition(yspoi);
                        map.setCenter(yspoi);
                    }
                });
                // end
                // 查询调度区域
                queryDdqy().then(function (data) {
                    $("#ddqy-comboBox").find('.iFList').html("");
                    for (var i = 0; i < data.length; i++) {
                        var gss = "<li data-value='" + data[i].OWNER_ID + "'>" + data[i].OWNER_NAME + "</li>";
                        $("#ddqy-comboBox").find('.iFList').append(gss);
                    }
                    var gss1 = "<li data-value='000'>小货车</li>";
                    var gss2 = "<li data-value='99'>爱心出租</li>";
                    $("#ddqy-comboBox").find('.iFList').append(gss1);
                    $("#ddqy-comboBox").find('.iFList').append(gss2);
                    addEventComboBoxList('#ddqy-comboBox');

                    $("#xddddqy").on('change', function () {
//							$("#xddddqy").val()
                        if ($("#xddddqy").val() == "小货车") {
                            var ddjl = '<li data-value="" style="height: 1.5em;">5km</li>' +
                                '<li data-value="" style="height: 1.5em;">10km</li>';
                            $("#ddfw-comboBox").find('.iFList').html(ddjl);
                            $("#xddddfw").val("5km");
                            $("#xhcdddiv").css('display', 'block');
                            $("#axdddiv").css('display', 'none');
                            $("#axddyhq").val('');
                            $("#yhqcheck").prop("checked", false);
                        } else if ($("#xddddqy").val() == "爱心出租") {
                            var ddjl = '<li data-value="" style="height: 1.5em;">0.5km</li>' +
                                '<li data-value="" style="height: 1.5em;">1km</li>' +
                                '<li data-value="" style="height: 1.5em;">2km</li>' +
                                '<li data-value="" style="height: 1.5em;">3km</li>' +
                                '<li data-value="" style="height: 1.5em;">4km</li>';
                            $("#ddfw-comboBox").find('.iFList').html(ddjl);
                            $("#xddddfw").val("1km");
                            $("#xhcdddiv").css('display', 'none');
                            $("#axdddiv").css('display', 'block');
                        } else {
                            var ddjl = '<li data-value="" style="height: 1.5em;">0.5km</li>' +
                                '<li data-value="" style="height: 1.5em;">1km</li>' +
                                '<li data-value="" style="height: 1.5em;">2km</li>' +
                                '<li data-value="" style="height: 1.5em;">3km</li>' +
                                '<li data-value="" style="height: 1.5em;">4km</li>';
                            $("#ddfw-comboBox").find('.iFList').html(ddjl);
                            $("#xddddfw").val("1km");
                            $("#axddyhq").val('');
                            $("#yhqcheck").prop("checked", false);
                            $("#xhcdddiv").css('display', 'none');
                            $("#axdddiv").css('display', 'none');
                        }
                        addEventComboBoxList('#ddfw-comboBox');
                    })

                });
                // end
                /* 正在调度表格 */
                if (zzddGrid) {
                    zzddGrid = null;
                    dojo.empty('xddConent-zzddTable');
                }
                zzddGrid = new CustomGrid({
                    totalCount: 0,
                    pagination: null,
                    columns: ZZDDcolumns,
                    allowTextSelection: true
                }, 'xddConent-zzddTable');

                /* 派车确认 */
                if (pcqrGrid) {
                    pcqrGrid = null;
                    dojo.empty('xddConent-pcqrTable');
                }
                pcqrGrid = new CustomGrid({
                    totalCount: 0,
                    pagination: null,
                    columns: PCQRcolumns,
                    allowTextSelection: true
                }, 'xddConent-pcqrTable');
                /* 任务车监控 */
                if (rwcjkGrid) {
                    rwcjkGrid = null;
                    dojo.empty('xddConent-rwcjkTable');
                }
                rwcjkGrid = new CustomGrid({
                    totalCount: 0,
                    pagination: null,
                    columns: RWCcolumns,
                    allowTextSelection: true
                }, 'xddConent-rwcjkTable');
                /* 调度完成 */
                if (ddwcGrid) {
                    ddwcGrid = null;
                    dojo.empty('xddConent-ddwcTable');
                }
                ddwcGrid = new CustomGrid({
                    totalCount: 0,
                    pagination: null,
                    columns: DDWCcolumns,
                    allowTextSelection: true
                }, 'xddConent-ddwcTable');
                /* 其他业务 */
                if (qtywGrid) {
                    qtywGrid = null;
                    dojo.empty('xddConent-qtywTable');
                }
                qtywGrid = new CustomGrid({
                    totalCount: 0,
                    pagination: null,
                    columns: QTYWcolumns,
                    allowTextSelection: true
                }, 'xddConent-qtywTable');
                /* 附近车辆 */
                if (fjclGrid) {
                    fjclGrid = null;
                    dojo.empty('xddConent-fjclTable');
                }
                fjclGrid = new CustomGrid({
                    totalCount: 0,
                    pagination: null,
                    columns: FJCLcolumns,
                    allowTextSelection: true
                }, 'xddConent-fjclTable');

                if (xxywGrid) {
                    xxywGrid = null;
                    dojo.empty('xddConent-xxywTable');
                }
                xxywGrid = new CustomGrid({
                    totalCount: 0,
                    pagination: null,
                    columns: XXYWcolumns,
                    allowTextSelection: true
                }, 'xddConent-xxywTable');
                if (xxrwcjkGrid) {
                    xxrwcjkGrid = null;
                    dojo.empty('xddConent-xxrwcjkTable');
                }
                xxrwcjkGrid = new CustomGrid({
                    totalCount: 0,
                    pagination: null,
                    columns: XXRWCcolumns,
                    allowTextSelection: true
                }, 'xddConent-xxrwcjkTable');

                // 任务车监控
                rwcjkGrid.on('.dgrid-row:dblclick', function (event) {
                    var row = rwcjkGrid.row(event);
                    if (sjclmarker) {
                        sjclmarker.setMap(null);
                    }
                    if (ddscd) {
                        ddscd.setMap(null);
                    }
                    dwjkcl(row.data.VEHI_NO).then(function (data) {
                        if (data.PX !== 0 && !data.PX) {
                            layer.msg("当前无定位数据！");
                            return;
                        }
                        var icon = gettb(data, 1);
                        sjclmarker = new AMap.Marker({
                            position: [data.PX, data.PY],
                            offset: new AMap.Pixel(-10, -10),
                            icon: icon,
                            zIndex: 101,
                            map: map
                        });
//			    		ddscd = new AMap.Marker({
//			                position: [row.data.LONGTI, row.data.LATI],
//			                offset : new AMap.Pixel(-16,-16),
//			                icon:"resources/images/ddscd.png",
//			                zIndex:101,
//			                map : map
//			            });
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
                            content: createInfoWindow(title, content.join("<br/>")),
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
                            content: createInfoWindow(title1, content1.join("<br/>")),
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
                });

                xxrwcjkGrid.on('.dgrid-row:dblclick', function (event) {
                    var row = xxrwcjkGrid.row(event);
                    if (sjclmarker) {
                        sjclmarker.setMap(null);
                    }
                    if (ddscd) {
                        ddscd.setMap(null);
                    }
                    dwjkcl(row.data.VEHI_NO).then(function (data) {
                        if (data.PX !== 0 && !data.PX) {
                            layer.msg("当前无定位数据！");
                            return;
                        }
                        var icon = gettb(data, 1);
                        sjclmarker = new AMap.Marker({
                            position: [data.PX, data.PY],
                            offset: new AMap.Pixel(-10, -10),
                            icon: icon,
                            zIndex: 101,
                            map: map
                        });
//			    		ddscd = new AMap.Marker({
//			                position: [row.data.LONGTI, row.data.LATI],
//			                offset : new AMap.Pixel(-16,-16),
//			                icon:"resources/images/ddscd.png",
//			                zIndex:101,
//			                map : map
//			            });
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
                            content: createInfoWindow(title, content.join("<br/>")),
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
                            content: createInfoWindow(title1, content1.join("<br/>")),
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
                });

                // shuangjicaidan
                zzddGrid.on('.dgrid-row:dblclick', function (event) {
                    var row = zzddGrid.row(event);
                    if (row.data.VEHI_NO != "" && row.data.VEHI_NO != null) {
                        if (sjclmarker) {
                            sjclmarker.setMap(null);
                        }
                        if (ddscd) {
                            ddscd.setMap(null);
                        }
                        dwjkcl(row.data.VEHI_NO).then(function (data) {
                            if (data.PX !== 0 && !data.PX) {
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
                                content: createInfoWindow(title, content.join("<br/>")),
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
                                content: createInfoWindow(title1, content1.join("<br/>")),
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
                pcqrGrid.on('.dgrid-row:dblclick', function (event) {
                    var row = pcqrGrid.row(event);
                    if (sjclmarker) {
                        sjclmarker.setMap(null);
                    }
                    if (ddscd) {
                        ddscd.setMap(null);
                    }
                    dwjkcl(row.data.VEHI_NO).then(function (data) {
                        if (data.PX !== 0 && !data.PX) {
                            layer.msg("当前无定位数据！");
                            return;
                        }
                        var icon = gettb(data, 1);
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
                            content: createInfoWindow(title, content.join("<br/>")),
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
                            content: createInfoWindow(title1, content1.join("<br/>")),
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
                });
                ddwcGrid.on('.dgrid-row:dblclick', function (event) {
                    var row = ddwcGrid.row(event);
                    if (row.data.VEHI_NO != "" && row.data.VEHI_NO != null) {
                        if (sjclmarker) {
                            sjclmarker.setMap(null);
                        }
                        if (ddscd) {
                            ddscd.setMap(null);
                        }
                        dwjkcl(row.data.VEHI_NO).then(function (data) {
                            if (data.PX !== 0 && !data.PX) {
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
                            content.push("速度：" + data.SPEED + "  状态：" + kzc(data.CARSTATE));
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
                                content: createInfoWindow(title, content.join("<br/>")),
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
                                content: createInfoWindow(title1, content1.join("<br/>")),
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
                qtywGrid.on('.dgrid-row:dblclick', function (event) {
                    var row = qtywGrid.row(event);
                    if (row.data.VEHI_NO != "" && row.data.VEHI_NO != null) {
                        if (sjclmarker) {
                            sjclmarker.setMap(null);
                        }
                        dwjkcl(row.data.VEHI_NO).then(function (data) {
                            if (data.PX !== 0 && !data.PX) {
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
                            map.setCenter(sjclmarker.getPosition());

                            // 信息窗口
                            var title = '<span style="font-size:12px;color:#278ac4;">' + data.VEHI_NO + '</span>';
                            if (data.STATE == "1") {
                                title += '<span style="font-size:11px;color:red;">(非精确)</span>';
                            }
                            var content = [];
// content.push("经度："+data.PX+" 纬度："+data.PY);
                            content.push("时间：" + data.STIME);
                            content.push("速度：" + data.SPEED + "  状态：" + kzc(data.CARSTATE));
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
                                content: createInfoWindow(title, content.join("<br/>")),
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
                                content: createInfoWindow(title1, content1.join("<br/>")),
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
                zzddGrid.on('.dgrid-row:click', function (event) {
                    if (pMenu) {
                        dijit.popup.close(pMenu);
                    }
                });
                // 派车确认右键菜单关闭
                pcqrGrid.on('.dgrid-row:click', function (event) {
                    if (pMenu) {
                        dijit.popup.close(pMenu);
                    }
                });
                // 调度完成右键菜单关闭
                ddwcGrid.on('.dgrid-row:click', function (event) {
                    if (pMenu) {
                        dijit.popup.close(pMenu);
                    }
                });
                // 调度完成右键菜单
                ddwcGrid.on('.dgrid-row:contextmenu', function (event) {
                    event.preventDefault();
                    var row = ddwcGrid.row(event);
                    pMenu = new Menu({
                        targetNodeIds: ["xddConent-ddwcTable-row-" + row.id]
                    });
                    pMenu.addChild(new MenuItem({
                        label: "拷贝信息(新增调度)",
                        onClick: function () {
                            _self.kbxx(row.data);
                        }
                    }));
                    pMenu.addChild(new MenuItem({
                        label: "解除锁车",
                        onClick: function () {
                            _self.jcsc(row.data);
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
                    var pSubMenu2 = new Menu();
                    pSubMenu2.addChild(new MenuItem({
                        label: "生成回程",
                        onClick: function () {
                            _self.schc(row.data);
                        }
                    }));
                    pMenu.addChild(new PopupMenuItem({
                        label: "业务生成",
                        popup: pSubMenu2
                    }));
                    pMenu.addChild(new MenuSeparator());
                    pMenu.addChild(new MenuItem({
                        label: "短信通知",
                        onClick: function () {
                            _self.dxtz(row.data);
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
// pMenu.addChild(new MenuSeparator());
// pMenu.addChild(new MenuItem({
// label: "删除显示"
// }));
// pMenu.addChild(new MenuItem({
// label: "Menu Item With an icon",
// iconClass: "dijitEditorIcon dijitEditorIconCut",
// onClick: function(){alert('i was clicked')}
// }));

                    dijit.popup.moveOffScreen(pMenu);
                    if (pMenu.startup && !pMenu._started) {
                        pMenu.startup();
                    }
                    dijit.popup.open({popup: pMenu, x: event.pageX, y: event.pageY});
                });
                // 派车确认右键菜单
                pcqrGrid.on('.dgrid-row:contextmenu', function (event) {
                    event.preventDefault();
                    var row = pcqrGrid.row(event);
                    pMenu = new Menu({
                        targetNodeIds: ["xddConent-pcqrTable-row-" + row.id]
                    });
                    pMenu.addChild(new MenuItem({
                        label: "拷贝信息(新增调度)",
                        onClick: function () {
                            _self.kbxx(row.data);
                        }
                    }));
                    pMenu.addChild(new MenuItem({
                        label: "手动复位(取消用车)",
                        onClick: function () {
                            _self.qxdd(row.data);
                        }
                    }));
                    pMenu.addChild(new MenuItem({
                        label: "调度完成",
                        onClick: function () {
                            _self.ddwc(row.data);
                        }
                    }));
                    pMenu.addChild(new MenuItem({
                        label: "解除锁车",
                        onClick: function () {
                            _self.jcsc(row.data);
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
                    var pSubMenu2 = new Menu();
                    pSubMenu2.addChild(new MenuItem({
                        label: "生成回程",
                        onClick: function () {
                            _self.schc(row.data);
                        }
                    }));
                    pMenu.addChild(new PopupMenuItem({
                        label: "业务生成",
                        popup: pSubMenu2
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
                // 正在调度右键菜单
                zzddGrid.on('.dgrid-row:contextmenu', function (event) {
                    event.preventDefault();
                    var row = zzddGrid.row(event);
                    pMenu = new Menu({
                        targetNodeIds: ["xddConent-zzddTable-row-" + row.id]
                    });
                    // console.log(row);
                    if (row.data.DDQY == '爱心出租' && row.data.DISP_STATE == '调度超时') {
                        pMenu.addChild(new MenuItem({
                            label: "爱心调度(人工调度)",
                            onClick: function () {
                                _self.rgdd(row.data);
                            }
                        }));
                    }
                    pMenu.addChild(new MenuItem({
                        label: "拷贝信息(新增调度)",
                        onClick: function () {
                            _self.kbxx(row.data);
                        }
                    }));
                    pMenu.addChild(new MenuItem({
                        label: "重新调度",
                        onClick: function () {
                            _self.cxdd(row.data);
                        }
                    }));
                    pMenu.addChild(new MenuItem({
                        label: "手动复位(取消用车)",
                        onClick: function () {
                            _self.qxdd(row.data);
                        }
                    }));
                    pMenu.addChild(new MenuItem({
                        label: "调度完成",
                        onClick: function () {
                            _self.ddwc(row.data);
                        }
                    }));
                    pMenu.addChild(new MenuItem({
                        label: "解除锁车",
                        onClick: function () {
                            _self.jcsc(row.data);
                        }
                    }));
                    pMenu.addChild(new MenuSeparator());
                    pMenu.addChild(new MenuItem({
                        label: "发送消息",
                        onClick: function () {
                            _self.fsxx(row.data);
                        }
                    }));
                    pMenu.addChild(new MenuItem({
                        label: "手动催单",
                        onClick: function () {
                            _self.sdcd(row.data);
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
                    var pSubMenu2 = new Menu();
                    pSubMenu2.addChild(new MenuItem({
                        label: "生成回程",
                        onClick: function () {
                            _self.schc(row.data);
                        }
                    }));
                    pMenu.addChild(new PopupMenuItem({
                        label: "业务生成",
                        popup: pSubMenu2
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

                /***/
                // 其它业务右键菜单关闭
                qtywGrid.on('.dgrid-row:click', function (event) {
                    if (pMenu) {
                        dijit.popup.close(pMenu);
                    }
                });
                // 其它业务右键菜单
                qtywGrid.on('.dgrid-row:contextmenu', function (event) {
                    event.preventDefault();
                    var row = qtywGrid.row(event);
                    pMenu = new Menu({
                        targetNodeIds: ["xddConent-ddwcTable-row-" + row.id]
                    });
                    pMenu.addChild(new MenuItem({
                        label: "拷贝信息(新增调度)",
                        onClick: function () {
                            _self.kbxx(row.data);
                        }
                    }));
                    pMenu.addChild(new MenuItem({
                        label: "解除锁车",
                        onClick: function () {
                            _self.jcsc(row.data);
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
                    var pSubMenu2 = new Menu();
                    pSubMenu2.addChild(new MenuItem({
                        label: "生成回程",
                        onClick: function () {
                            _self.schc(row.data);
                        }
                    }));
                    pMenu.addChild(new PopupMenuItem({
                        label: "业务生成",
                        popup: pSubMenu2
                    }));
                    pMenu.addChild(new MenuSeparator());
                    pMenu.addChild(new MenuItem({
                        label: "短信通知",
                        onClick: function () {
                            _self.dxtz(row.data);
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

                /***/


                query('#xdd-topContentPane a').on('click', function () {
                    // $(this).addClass('selected').siblings('.selected').removeClass('selected');
                    var dqyyzt = $(this).find('span').html();
                    if (dqyyzt == "置忙") {

                        ZhimangAUX();
                        $(this).addClass('selected').siblings('.selected').removeClass('selected');
                    } else if (dqyyzt == "置闲") {
                        SendAvailable();
                        $(this).addClass('selected').siblings('.selected').removeClass('selected');
                    } else if (dqyyzt == "接机") {

                    } else if (dqyyzt == "挂机") {

                    } else if (dqyyzt == "登录") {
                        console.log(CTIProxy);
                        SendLogin();
                    } else if (dqyyzt == "外拨") {
                        dhwbDialogPanel.set('href', 'app/html/ddxpt/editor/dhwbEditor.html');
                        $('#dhwbDialogPanel').removeAttr('style');
                        dhwbDialog.show().then(function () {

                            $("#dhwbEditor-dhhm").val("");
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
                    } else if (dqyyzt == "呼叫保持") {
                        ContinueCall();
                    } else if (dqyyzt == "恢复") {
                        CompleteCall();
                    } else if (dqyyzt == "呼叫转移") {

                    } else if (dqyyzt == "会议") {
                        dhwbDialogPanel.set('href', 'app/html/ddxpt/editor/dhwbEditor.html');
                        $('#dhwbDialogPanel').removeAttr('style');
                        dhwbDialog.show().then(function () {
                            $("#dhwbEditor-dhhm").val("26891717");
                            dhwbDialog.set('title', '会议');
                            $("#dhwbEditor-dhhm").unbind('keydown').on('keydown', function (event) {
                                var eve = event ? event : window.event;
                                if (eve.keyCode == 13) {
                                    var dh = $("#dhwbEditor-dhhm").val();
                                    if (dh == "") {
                                        layer.msg("请输入会议电话号码！");
                                    } else {
                                        SendBeginConference(dh);
                                        dhwbDialog.hide();
                                    }
                                }
                            });
                            $("#dhwbEditor-qued").click(function () {
                                var dh = $("#dhwbEditor-dhhm").val();
                                if (dh == "") {
                                    layer.msg("请输入会议电话号码！");
                                } else {
                                    SendBeginConference(dh);
                                    dhwbDialog.hide();
                                }
                            });
                        });
                    } else if (dqyyzt == "会议完成") {
                        SendCompleteConference();
                    } else if (dqyyzt == "会议取消") {
                        SendCancelConference();
                    }
                });

                /*
				 * query('#xdd-borderContainer .iFComboBox').on('click',
				 * function () { var thisOne = this; if
				 * ($(this).hasClass('selected')) {
				 * $(this).removeClass('selected'); } else {
				 * $(this).addClass('selected');
				 * $(this).find('.iFList').on('click', function () { if
				 * (event.stopPropagation){event.stopPropagation();}else if
				 * (window.event) {window.event.cancelBubble = true;}
				 * }).find('li').off('click').on('click', function () {
				 * $(this).addClass('selected').siblings('.selected').removeClass('selected');
				 * $(thisOne).find('input').data('value',
				 * $(this).data('value')).val($(this).text()).end().removeClass('selected');
				 * $(thisOne).find('input').trigger('change'); }); } });
				 */
                addEventComboBox('#xdd-borderContainer');


                // 车辆监控
                $(".cljkul").bind("contextmenu", function () {
                    return false;
                });
                on(query('#cljkbtn'), 'click', function () {
                    var tempcar = $("#cljktext").val();
                    if ($("#cljktext").val() == "") {
                        layer.msg("请输入或者选择车牌号码！");
                        return;
                    }
                    $($("#cljkdiv").children()[0]).mouseover(function () {
                        $(".cljkp").css("background-color", "#FFFFFF");
                        $(this).css("background-color", "#e2fdf2");
                    });

                    $("#cljkdiv").bind("contextmenu", function () {
                        return false;
                    });
                    dwjkcl(tempcar).then(function (data) {
                        console.log(data)
                        if (data.PX !== 0 && (data.PX === '' || data.PX === null)) {
                            layer.msg("当前无定位数据！");
                            return;
                        }
                        if ($("#cljkdiv").html().indexOf(data.VEHI_NO) > -1) {
                            layer.msg("该车牌已在监控列表！");
                            return;
                        }
                        if ($("#cljkdiv").children().size() == 5) {
                            $($("#cljkdiv").children()[4]).remove();
                        }
                        $("#cljkdiv").prepend("<p class='cljkp'>" + data.VEHI_NO + "</p>");

                        var icon = gettb(data, 2);
                        cljkmarker = new AMap.Marker({
                            position: [data.PX, data.PY],
                            offset: new AMap.Pixel(-10, -10),
                            icon: icon,
                            map: map
                        });
                        map.setCenter(cljkmarker.getPosition());
                        // 信息窗口
                        var title = '<span style="font-size:12px;color:#278ac4;">' + data.VEHI_NO + '</span>';
                        if (data.STATE == "1") {
                            title += '<span style="font-size:11px;color:red;">(非精确)</span>';
                        }
                        var content = [];
// content.push("经度："+data.PX+" 纬度："+data.PY);
                        content.push("时间：" + data.STIME);
                        content.push("速度：" + data.SPEED + "  状态：" + kzc(data.CARSTATE));
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
                            content: createInfoWindow(title, content.join("<br/>")),
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
                            content: createInfoWindow(title1, content1.join("<br/>")),
                            offset: new AMap.Pixel(15, -23)
                        });
                        cljkmarker.infoWindow1 = infoWindow1;
                        cljkmarker.infoWindow = infoWindow;
                        cljkmarker.clxx = data;
                        _self.ckfsxx(cljkmarker);
                        AMap.event.addListener(cljkmarker, 'click', function () {
                            _self.ckfsxx(cljkmarker);
                        });
                    });
                    $($("#cljkdiv").children()[0]).mousedown(function (e) {
                        // 右键为3
                        if (3 == e.which) {
                            console.log(this);
                            $(this).remove();
                        } else if (1 == e.which) {
                            // 左键为1
                            if (cljkmarker) {
                                map.remove(cljkmarker);
                            }
                            dwjkcl($(this).html()).then(function (data) {
                                if (data.PX !== 0 && !data.PX) {
                                    layer.msg("当前无定位数据！");
                                    return;
                                }
                                console.log(data);
                                var icon = gettb(data, 2);
                                cljkmarker = new AMap.Marker({
                                    position: [data.PX, data.PY],
                                    offset: new AMap.Pixel(-10, -10),
                                    icon: icon,
                                    map: map
                                });
                                map.setCenter(cljkmarker.getPosition());

                                // 信息窗口
                                var title = '<span style="font-size:12px;color:#278ac4;">' + data.VEHI_NO + '</span>';
                                if (data.STATE == "1") {
                                    title += '<span style="font-size:11px;color:red;">(非精确)</span>';
                                }
                                var content = [];
// content.push("经度："+data.PX+" 纬度："+data.PY);
                                content.push("时间：" + data.STIME);
                                content.push("速度：" + data.SPEED + "  状态：" + kzc(data.CARSTATE));
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
                                    content: createInfoWindow(title, content.join("<br/>")),
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
                                    content: createInfoWindow(title1, content1.join("<br/>")),
                                    offset: new AMap.Pixel(15, -23)
                                });
                                cljkmarker.infoWindow1 = infoWindow1;
                                cljkmarker.infoWindow = infoWindow;
                                cljkmarker.clxx = data;
                                _self.ckfsxx(cljkmarker);
                                AMap.event.addListener(cljkmarker, 'click', function () {
                                    _self.ckfsxx(cljkmarker);
                                });
                            });
                        }
                    });
                });


                on(query('#yuyue'), 'click', function () {
                    yyDialogPanel.set('href', 'app/html/ddxpt/compile/yy.html');
                    yyDialog.show().then(function () {
                        yyDialog.set('title', '请选择用车时间');
                        $('.panel-conterBar').show();
                        query('#cancel').on('click', function () {
                            yyDialog.hide();
                        });
                    });
                });

                $(window).resize(function () {
                    $('#yyDialogPanel').removeAttr('style');
                });
                $(window).resize(function () {
                    $('#xddDialogPanel').removeAttr('style');
                });

                /* 来电号码的选择 */
                on(query('#ldhm_xz'), 'click', function () {
                    _self.xddldjl($("#xddldhm").val());
                    xddDialogPanel.set('href', 'app/html/ddxpt/compile/ldhm_xz.html');
                    xddDialog.show().then(function () {
                        $('#xddDialogPanel').removeAttr('style');
                        xddDialog.set('title', '选择客户');
                        setTimeout(function () {
                            if (ldhmGrid) {
                                ldhmGrid = null;
                                dojo.empty('ldhmTable');
                            }
                            ldhmGrid = new CustomGrid({
                                totalCount: 0,
                                pagination: null,
                                columns: ldhmColumns
                            }, "ldhmTable");
                            store = new Memory({data: {identifier: 'CI_ID', label: 'CI_ID', items: lsjlxz}});
                            ldhmGrid.set('collection', store);
                            $('.panel-conterBar').show();

                            // 新用户
                            on(query('#xddxyh'), 'click', function () {
                                var postData = {};
                                postData.dh = $("#xddldhm").val();
                                postData.xm = $("#xddckxm").val();
                                addxyh(postData).then(function (data) {
                                    xddDialog.hide();
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
                                        xddDialog.hide();
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
                                $("#xddhbdh").val($("#xddldhm").val());
                                $("#xddckxm").val(row.data.CI_NAME);// 乘客姓名
                                $("#xddxxdz").val(row.data.ADDRESS);// 详细地址
                                $("#xddszqy").val(row.data.SZQY);//所在区域
                                $("#xddmddd").val(row.data.DEST_ADDRESS);// 目的地点
                                $("#xddfjxx").val(row.data.NOTE);// 附加信息
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
                                xddDialog.hide();
                            });
                        }, 100);
                    });
                });


                on(query('#rgaxdd'), 'click', function () {

                    var postData = {};
                    postData.dispid = rgaxddorder;
                    if ($("#rgddzpcl").val() == "") {
                        layer.msg("请输入指派车辆！");
                        return;
                    }
                    postData.cp = $("#rgddzpcl").val();
                    postData.yhq = $("#axddyhq").val();
                    postData.mdtno = rgaxddmdtno;
                    zxrgaxdd(postData).then(function (data) {
                        if (data.msg == '1') {
                            layer.msg('人工爱心调度成功！');
                            xddjsobj.clearRGAXDD();
                            xddjsobj.findywd();

                        } else {
                            layer.msg('人工爱心调度失败！');
                        }
                    });
                });
                /* 调度按钮--点击调度 */
                on(query('#xddbtn'), 'click', function () {
                    var jd = "", wd = "";
                    if (scmarker) {
                        jd = scmarker.getPosition().getLng();
                        wd = scmarker.getPosition().getLat();
                    }
                    var cmd = 1;// 命令号
                    var xddqqid = createqqid();// 请求编号
                    var xddldhm = $("#xddldhm").val();// 来电号码
                    var xddhbdh = $("#xddhbdh").val();// 回拨电话
                    var xddzdhb = xddzdcheck;// 是否自动回拨
                    var xddsfyy = xddyycheck;// 是否预约
                    var xddyyjcsj = $("#xddyyjcsj").val();// 预约叫车时间
                    var xddckxm = $("#xddckxm").val();// 乘客姓名
                    var xddxxdz = $("#xddxxdz").val();// 详细地址
                    var xddszqy = $("#xddszqy").val();// 所在区域
                    var xddmddd = $("#xddmddd").val();// 目的地点
                    var xddfjxx = $("#xddfjxx").val();// 附加信息
                    var xddpx = jd;// 上车经度
                    var xddpy = wd;// 上车纬度
                    var xddddqy = $("#xddddqy").val();// 调度区域
                    var xddddfw = $("#xddddfw").val().replace('km', '');// 调度范围
                    var yhq = '';
                    if ($('#yhqcheck').is(':checked')) {
                        yhq = $('#axddyhq').val();
                    }

                    var postData = {};

                    if (xddldhm == "") {
                        layer.msg("没有来电号码！");
                        return;
                    }
                    if (xddpx == "") {
                        layer.msg("没有设置上车位置！");
                        return;
                    }
                    if (xddxxdz == "") {
                        layer.msg("请输入详细地址！");
                        return;
                    }
                    if (xddmddd == "") {
                        layer.msg("请输入目的地！");
                        return;
                    }
                    if (xddckxm == "") {
                        layer.msg("请输入乘客姓名！");
                        return;
                    }
                    if (xddfjxx == "") {
                        layer.msg("请输入附加信息！");
                        return;
                    }
                    if (xddszqy == "") {
                        layer.msg("请输入详细地址所在区域！");
                        return;
                    }

                    postData.cmd = cmd;
                    postData.cksj = xddldhm;
                    postData.scjd = xddpx;
                    postData.scwd = xddpy;
                    postData.qq_id = xddqqid;
                    postData.scdz = xddxxdz;
                    postData.mdd = xddmddd;
                    postData.yhm = xddckxm;
                    postData.xb = 0;
                    postData.fjxx = xddfjxx;
                    postData.ycsj = xddyyjcsj;
                    if (xddddqy == "小货车") {
                        if ($("#xhcddywlx").val() == "普通约车") {
                            postData.ywlx = 0;
                        } else if ($("#xhcddywlx").val() == "回程") {
                            postData.ywlx = 2;
                        } else if ($("#xhcddywlx").val() == "长途") {
                            postData.ywlx = 1;
                        }
                        if ($("#xhcddcx").val() == "所有") {
                            postData.cllx = 5;
                        } else if ($("#xhcddcx").val() == "厢式") {
                            postData.cllx = 3;
                        } else if ($("#xhcddcx").val() == "小厢式") {
                            postData.cllx = 4;
                        }
                    } else {
                        postData.ywlx = 0;
                        postData.cllx = 0;
                    }
                    postData.ci_id = "";
                    postData.disp_user = username;
                    postData.yclx = "电话约车";
                    postData.wbdh = xddhbdh;
                    postData.ddfw = xddddfw;
                    postData.sfyy = xddsfyy;
                    postData.disp_id = "";
                    postData.ddqy = xddddqy;
                    postData.zdwb = xddzdhb;
                    postData.fsbz = 9;
                    postData.cxdd = "0";
                    postData.szqy = xddszqy;
                    //爱心调度
                    postData.yhq = yhq;

                    xdd(postData).then(function (data) {
                        if (data.msg == '2') {
                            layer.msg('请输入选择正确的优惠券！');
                        }
                    });
                });
                // 调度清空
                on(query('#xddclearbtn'), 'click', function () {
                    xddjsobj.clearDD();
                });

                on(query('#rgaxddqx'), 'click', function () {
                    xddjsobj.clearRGAXDD();
                });

                // 生成
                on(query('#xddscbtn'), 'click', function () {
                    var jd = "0.1", wd = "0.1";
                    var cmd = 1;// 命令号
                    var xddqqid = createqqid();// 请求编号
                    var xddldhm = $("#xddldhm").val();// 来电号码
                    var xddhbdh = $("#xddhbdh").val();// 回拨电话
                    var xddzdhb = 0;// 是否自动回拨
                    var xddsfyy = 0;// 是否预约
                    var xddyyjcsj = '';// 预约叫车时间
                    var xddckxm = $("#xddckxm").val();// 乘客姓名
                    var xxdz = "特殊";
                    if ($("#xddxxdz").val() != '') {
                        xxdz = $("#xddxxdz").val();
                    }
                    var xddxxdz = xxdz;// 详细地址
                    var xddszqy = $("#xddszqy").val();// 所在区域
                    var mddd = "特殊";
                    if ($("#xddmddd").val() != '') {
                        xxdz = $("#xddmddd").val();
                    }
                    var xddmddd = mddd;// 目的地点

                    var fjxx = "特殊";
                    if ($("#xddfjxx").val() != '') {
                        xxdz = $("#xddfjxx").val();
                    }
                    var xddfjxx = fjxx;// 附加信息

                    var xddpx = jd;// 上车经度
                    var xddpy = wd;// 上车纬度
                    var xddddqy = $("#xddddqy").val();// 调度区域
                    var xddddfw = $("#xddddfw").val().replace('km', '');// 调度范围
                    var postData = {};

                    if (xddldhm == "") {
                        layer.msg("没有来电号码！");
                        return;
                    }
                    if (xddckxm == "") {
                        layer.msg("请输入乘客姓名！");
                        return;
                    }
                    postData.cmd = cmd;
                    postData.cksj = xddldhm;
                    postData.scjd = xddpx;
                    postData.scwd = xddpy;
                    postData.qq_id = xddqqid;
                    postData.scdz = xddxxdz;
                    postData.mdd = xddmddd;
                    postData.yhm = xddckxm;
                    postData.xb = 0;
                    postData.fjxx = xddfjxx;
                    postData.ycsj = xddyyjcsj;
                    if (xddddqy == "小货车") {
                        if ($("#xhcddywlx").val() == "普通约车") {
                            postData.ywlx = 0;
                        } else if ($("#xhcddywlx").val() == "回程") {
                            postData.ywlx = 2;
                        } else if ($("#xhcddywlx").val() == "长途") {
                            postData.ywlx = 1;
                        }
                        if ($("#xhcddcx").val() == "所有") {
                            postData.cllx = 5;
                        } else if ($("#xhcddcx").val() == "厢式") {
                            postData.cllx = 3;
                        } else if ($("#xhcddcx").val() == "小厢式") {
                            postData.cllx = 4;
                        }
                    } else {
                        postData.ywlx = 0;
                        postData.cllx = 0;
                    }
                    postData.ci_id = "";
                    postData.disp_user = username;
                    postData.yclx = "电话约车";
                    postData.wbdh = xddhbdh;
                    postData.ddfw = xddddfw;
                    postData.sfyy = xddsfyy;
                    postData.disp_id = "";
                    postData.ddqy = xddddqy;
                    postData.zdwb = xddzdhb;
                    postData.fsbz = 9;
                    postData.cxdd = "0";
                    postData.szqy = xddszqy;
                    postData.yhq = '';
                    xdd(postData).then();
                });
                //黑名单
                on(query('#xddhmdbtn'), 'click', function () {
                    var hmdxx = {};
                    if ($("#xddckxm").val() == "" || $("#xddldhm").val() == "") {
                        layer.alert('请输入来电号码和乘客姓名！', {
                            closeBtn: 0
                        });
                    } else {
                        hmdxx.custname = $("#xddckxm").val();
                        hmdxx.custtel = $("#xddldhm").val();
                        createHMD(hmdxx).then(function (data) {
                            if (data.msg == "1") {
                                layer.msg('生成黑名单成功！');
                                $("#xddckxm").val("");
                                $("#xddldhm").val("");
                            } else {
                                layer.msg('生成黑名单失败！');
                            }
                        });
                    }
                });

                // 查询业务单
                query('#btn_find').on('click', function () {
                    _self.findywd();
                });

                query('#xdd-rightContentPane .panel-titleBpx .title span').on('click', function () {
                    $(this).siblings('.click').removeClass('click');
                    $(this).addClass('click');
                });

                $('#zyxx-qdxx span').click(function () {
                    $(this).siblings('.selected').removeClass('selected');
                    $(this).addClass('selected')
                });
                $('#qdxx').click(function () {
                    $('.qdxx').removeClass('hide');
                    $('.jkxx').addClass('hide');
                });
                $('#jkxx').click(function () {
                    $('.jkxx').removeClass('hide');
                    $('.qdxx').addClass('hide');
                });


                $('#xdd_zdcheck').on('click', function () {
                    if (this.checked) {
                        xddzdcheck = 1;
                    } else {
                        xddzdcheck = 0;
                    }

                });
                $('#xdd_yycheck').on('click', function () {
                    if (this.checked) {
                        xddyycheck = 1;
                        $("#xddyyjcsjlabel").css('display', '');
                        $("#xddyyjcsjdiv").css('display', '');
                    } else {
                        xddyycheck = 0;
                        $("#xddyyjcsjlabel").css('display', 'none');
                        $("#xddyyjcsjdiv").css('display', 'none');
                    }
                });
                $('#yhqcheck').on('click', function () {
                    if (this.checked) {
                        $("#axddyhq").removeAttr("disabled");
                    } else {
                        $("#axddyhq").val('');
                        $("#axddyhq").attr("disabled", "disabled");
                    }
                });
                // 查询优惠券
                $("#yhq-comboBox").find('input').on('keyup', function () {
                    // 车牌
                    clearTimeout(yhqSettime);
                    yhqSettime = setTimeout(function () {
                        var yhqtext = $("#yhq-comboBox").find('input').val();
                        if (yhqtext.length >= 6) {
                            findyhq(yhqtext).then(function (data2) {
                                console.log(data2);
                                $("#yhq-comboBox").find('.iFList').html("");
                                for (var i = 0; i < data2.length; i++) {
                                    var cphms = "<li data-value='" + data2[i].ID + "'>" + data2[i].COUPON_NUM + "</li>";
                                    $("#yhq-comboBox").find('.iFList').append(cphms);
                                }
                                $('#yhq-comboBox').find('.iFList').on('click', function () {
                                    if (event.stopPropagation) {
                                        event.stopPropagation();
                                    } else if (window.event) {
                                        window.event.cancelBubble = true;
                                    }
                                }).find('li').off('click').on('click', function () {
                                    $(this).addClass('selected').siblings('.selected').removeClass('selected');
                                    $("#yhq-comboBox").find('input').data('value', $(this).data('value')).val($(this).text()).end().removeClass('selected');
                                });
                            });
                        }
                    }, 1200);
                });

                // 车辆监控查询车辆
                $("#car-comboBox").find('input').on('keyup', function () {
                    // 车牌
                    clearTimeout(settime);
                    settime = setTimeout(function () {
                        var cpmhs = $("#car-comboBox").find('input').val();
                        if (cpmhs.length > 2 && cpmhs != "浙AT") {
                            findddcphm(cpmhs).then(function (data2) {
                                $("#car-comboBox").find('.iFList').html("");
                                for (var i = 0; i < data2.length; i++) {
                                    var cphms = "<li data-value='" + data2[i].CPHM + "'>" + data2[i].CPHM + "</li>";
                                    $("#car-comboBox").find('.iFList').append(cphms);
                                }
                                $('#car-comboBox').find('.iFList').on('click', function () {
                                    if (event.stopPropagation) {
                                        event.stopPropagation();
                                    } else if (window.event) {
                                        window.event.cancelBubble = true;
                                    }
                                }).find('li').off('click').on('click', function () {
                                    $(this).addClass('selected').siblings('.selected').removeClass('selected');
                                    $("#car-comboBox").find('input').data('value', $(this).data('value')).val($(this).text()).end().removeClass('selected');
                                });
                            });
                        }
                    }, 1200);
                });

                setInterval(function () {
                    // console.log("监控车辆刷新～～～～");
                    var cps = ""
                    for (var i = 0; i < $(".cljkp").size(); i++) {
                        cps += $($(".cljkp")[i]).html();
                    }
                    if (cps != "") {
                        jkcl(cps).then(function (data) {
                            for (var i = 0; i < data.length; i++) {
                                $(".jkxx").prepend("<p class=''>" + data[i].VEHI_NO + "-" + data[i].PX + "," + data[i].PY + "-" + dlwz(data[i].ANGLE) + "</p>");
                            }
                        });
                    }
                    _self.fjcl();
                }, 30000);
                // end
                $("#bjxx").bind("contextmenu", function () {
                    return false;
                });
                $("#bjxx").mousedown(function (e) {
                    if (3 == e.which) {
                        $("#bjxx").html("");
                    }
                });
                $(".zyxx").bind("contextmenu", function () {
                    return false;
                });
                $(".qdxx").mousedown(function (e) {
                    if (3 == e.which) {
                        $(".qdxx").html("");
                    }
                });
                $(".jkxx").mousedown(function (e) {
                    if (3 == e.which) {
                        $(".jkxx").html("");
                    }
                });

                // 修改业务单
					query('#btn_xxzpcl').on('click', function () {
						_self.editxxywd();
					});
					//取消孝心订单
					query('#btn_xxqxdd').on('click', function () {
						_self.delxxywd();
					});
            }
        });
    });




