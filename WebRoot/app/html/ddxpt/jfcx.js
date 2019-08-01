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
        var jfcxGrid = null, store = null;
        var settime1=null; 
        var columns = {
        		JD_ID: {label: '编号'},
        		VEHI_NO: {label: '车牌'},
        		JF_CLASS: {label: '积分类型',formatter:util.formatJFLX},
        		JF_AMOUNT: {label: '数量'},
        		JF_BALANCE: {label: '积分余额'},
        		EVENT_TYPE: {label: '生成类型'},
        		EVENT_DETAIL: {label: '生成明细'},
        		EVENT_TIME: {label: '生成时间',formatter:util.formatYYYYMMDDHHMISS},
        		USER_ID: {label: '工号'}
//        		DISP_ID: {label: '业务编号'},
//              QLDH: {label: '清零单号'},
//          		DISP_JF: {label: '清零积分'},
//        		CLEAR_TIME: {label: '清零时间',formatter:util.formatYYYYMMDDHHMISS},
//        		CLEAR_USER: {label: '记录工号'},
//        		DRIVER: {label: '司机信息'},
//        		FILL_TIME: {label: '补单时间',formatter:util.formatYYYYMMDDHHMISS},
//        		CUST_NAME: {label: '客人姓名'},
//        		CUST_TEL: {label: '客人电话'},
//        		ADDRESS: {label: '上车地点'},
//        		DEST_ADDR: {label: '目的地'},
//        		NOTE: {label: '备注'}
        };
        return declare( null,{
            constructor:function(){
                this.initToolBar();
            },
            initToolBar:function(){
                var _self = this;
                if (jfcxGrid) { jfcxGrid = null; dojo.empty('jfcxTabel') }
                jfcxGrid = new CustomGrid({ totalCount: 0, pagination: null, columns: columns,allowTextSelection: true}, 'jfcxTabel');

                /*下拉框*/
                // query('#jfcxPanel .iFComboBox').on('click', function () {
                //     var thisOne = this;
                //     if ($(this).hasClass('selected')) {
                //         $(this).removeClass('selected');
                //     } else {
                //         $(this).addClass('selected');
                //         $(this).find('.iFList').on('click', function () {
                //         	if (event.stopPropagation){event.stopPropagation();}else if (window.event) {window.event.cancelBubble = true;}
                //         }).find('li').off('click').on('click', function () {
                //             $(this).addClass('selected').siblings('.selected').removeClass('selected');
                //             $(thisOne).find('input').data('value', $(this).data('value')).val($(this).text()).end().removeClass('selected');
                //             $(thisOne).find('input').trigger('change');
                //         });
                //     }
                // });
							addEventComboBox('#jfcxPanel');
                $("#cphm-comboBox").find('input').on('keyup',function(){
					//车牌
					clearTimeout(settime1);
					settime1 = setTimeout(function() {
						var cpmhs=$("#cphm-comboBox").find('input').val();
						if(cpmhs.length>2){
							findddcphm(cpmhs).then(function(data2){
								$("#cphm-comboBox").find('.iFList').html("");
								for (var i = 0; i < data2.length; i++) {
									var cphms="<li data-value='"+data2[i].CPHM+"'>"+data2[i].CPHM+"</li>";
									$("#cphm-comboBox").find('.iFList').append(cphms);
								}
								$('#cphm-comboBox').find('.iFList').on('click', function () {
									if (event.stopPropagation){event.stopPropagation();}else if (window.event) {window.event.cancelBubble = true;}
								}).find('li').off('click').on('click', function () {
									$(this).addClass('selected').siblings('.selected').removeClass('selected');
									$("#cphm-comboBox").find('input').data('value', $(this).data('value')).val($(this).text()).end().removeClass('selected');
								});
							});
						}
					}, 1200);
				});
                /*时间控件*/
                query('#jfcx-stime').on('focus', function () {
                    WdatePicker({
                        dateFmt: "yyyy-MM-dd HH:mm:ss"
                    });
                });
                query('#jfcx-etime').on('focus', function () {
                    WdatePicker({
                    	dateFmt: "yyyy-MM-dd HH:mm:ss"
            		});
                });
                $("#jfcxQuery").click(function(){
                	if($("#jfcx-cphm").val()==""&&$("#jfcx-cphm").val().length<7){
                		layer.msg("请输入正确的车牌号码");
                		return;
                	}
                	var postData={};
                	postData.vehi_no=$("#jfcx-cphm").val();
                	postData.gjz = $("#jfcx-gjz").val();
//                	postData.cklx = $("#jfcx-cklx").val();
                	postData.stime = $("#jfcx-stime").val();
                	postData.etime = $("#jfcx-etime").val();
                	findjfmx(postData).then(function(data){
                		console.log(data);
                		store = new Memory({data: {identifier: 'JD_ID', label: 'JD_ID', items: data.mx}});
                        jfcxGrid.set('collection', store);
                	});
                });     
                
                $("#jfcxDaochu").click(function(){
                	if($("#jfcx-cphm").val()==""&&$("#jfcx-cphm").val().length<7){
                		layer.msg("请输入正确的车牌号码");
                		return;
                	}
                	var postData={};
                	postData.vehi_no=$("#jfcx-cphm").val();
                	postData.gjz = $("#jfcx-gjz").val();
//                	postData.cklx = $("#jfcx-cklx").val();
                	postData.stime = $("#jfcx-stime").val();
                	postData.etime = $("#jfcx-etime").val();
                	url = basePath + "ddxpt/jfmx_daochu?postData="
             		+ encodeURI(encodeURI(JSON.stringify(postData))), window.open(url);
                });    
            }
        })
    });