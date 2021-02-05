define([ "dijit/Dialog", "dgrid/Editor", "dijit/form/Button",
        "dijit/form/DateTextBox", "dijit/form/TimeTextBox",
        "dijit/form/SimpleTextarea", "dijit/form/Select",
        "dijit/form/FilteringSelect", "dgrid/OnDemandGrid",
        "dijit/form/TextBox", "app/Pagination", "dgrid/Selection",
        "dgrid/Keyboard", "dgrid/extensions/ColumnResizer",
        "dojo/store/Memory","cbtree/model/TreeStoreModel",
        "dstore/Memory","dijit/form/NumberTextBox",
        "dgrid/extensions/DijitRegistry", "dijit/registry", "dojo/dom-style",
        'dstore/Trackable', 'dgrid/Selector',
        "dojo/_base/declare", "dojo/dom-construct", "dojo/on","dijit/tree/ObjectStoreModel", "cbtree/Tree",
        "cbtree/models/ForestStoreModel", "dojo/data/ItemFileWriteStore", "dojo/query", "app/util" ],
    function(Dialog, Editor, Button, DateTextBox, TimeTextBox,
             SimpleTextarea, Select, FilteringSelect, Grid, TextBox,
             Pagination, Selection, Keyboard, ColumnResizer,
             Memory2,TreeStoreModel,
             Memory,NumberTextBox, DijitRegistry, registry, domStyle,
             Trackable, Selector,
             declare, dc, on,ObjectStoreModel, Tree,
             ForestStoreModel, ItemFileWriteStore, query, util) {
        var CustomGrid = declare([Grid, Selection, DijitRegistry, Editor, ColumnResizer, Selector]);
		var clbGrid = null, store = null;
		var clb_data;
		var fxkfsr={};
		var columns = {
				checkbox: {label: '选择',selector: 'checkbox'},
				dojoId: {label: '序号'},
				PLATE_NUMBER: {label: '车牌号码'},
				VEHICLE_TYPE_NAME: {label: '车辆类型'},
				COMPANY_NAME: {label: '业户名称'},
				COMPANY_LICENSE_NUMBER: {label: '经营许可证号'},
				LICENSE_NUMBER: {label: '道路运输证号'},
				LICENSE_VALID_PERIOD_FROM: {label: '核发日期',formatter : util.formatYYYYMMDDHHMISS},
				LICENSE_VALID_PERIOD_END: {label: '有效日期',formatter : util.formatYYYYMMDDHHMISS},
				BUSINESS_SCOPE_NAME: {label: '经营范围'},
				STATUS_NAME: {label: '状态'},
				COLOR: {label: '车身颜色'},
				AREA_NAME: {label: '行政区划'},
				IS_EXPIRED: {label: '证照是否过期'},
				FUEL_NAME: {label: '燃料类型'},
				EMISSION_STANDARD: {label: '排放标准'},
        };
		var xhrArgsTabel = {
			url : basePath + "xhchtgl/findcl",
			postData : 'postData={"page":1,"pageSize":30}',
			handleAs : "json",
			Origin : self.location.origin,
			preventCache : true,
			withCredentials : true,
			load : function(data) {
				layer.closeAll();
				clb_data = data.datas;
				if(data.count>0){
					for (var i = 0; i < data.datas.length; i++) {
						data.datas[i] = dojo.mixin({
							dojoId : i + 1
						}, data.datas[i]);
					}
				}else{
					dijit.byId('qd_dialog').show().then(function() {
						$("#czjg").html('查询不到该信息！');
					});
				}
				store = new Memory({
					data : {
						identifier : 'dojoId',
						label : 'dojoId',
						items : data.datas
					}
				});
				clbGrid.totalCount = data.count;
				clbGrid.set('collection', store);
				clbGrid.pagination.refresh(data.datas.length);
				clbGrid.on('dgrid-select', function (event) {
					fxkfsr=clbGrid.selection;
				});
				clbGrid.on('dgrid-deselect', function (event) {
					fxkfsr=clbGrid.selection;
				});
			},
			error : function(error) {
				console.log(error);
			}
		};
		var pageii = null;	
		return declare( null,{
			constructor:function(){
				this.initToolBar();
//				if (clbGrid) {
//					clbGrid = null;
//					dojo.empty('cllxbTabel')
//				}
				if (clbGrid) { clbGrid.destroy(); }//dojo.destroy('zdbTabel');
                dojo.create("div", {id:'clbTabels', innerHTML:"" },'clbTabel');
				clbGrid = new CustomGrid({
//					collection: store,
//					selectionMode: 'none', 
//					allowSelectAll: true,
					totalCount : 0,
					pagination:null,
					columns : columns
				}, "clbTabels");
				layer.load(1);
				pageii = new Pagination(clbGrid,xhrArgsTabel,{"VEHI_NO":$(".cp-list").val(),
						"COMP_NAME":$(".yh-list").val(),"AREA_NAME":$(".sq-list").val(),"DLYS":$("#xhc-dlys").val()
						,"JYXK":$("#xhc-jyxk").val(),"STATUS":$("#xhc-zt").val()},30);
				dc.place(pageii.first(),'clbTabels','after');
//				this.get();
			},
			del: function (obj) {},
			add:function () {},
			update: function (json) {},
			get: function () {},
			initToolBar:function(){
//				if (clbGrid) { clbGrid = null; dojo.empty('cllxbTabel') }
//				clbGrid = new CustomGrid({ totalCount: 0, pagination: null,columns: columns}, 'cllxbTabel');
				var _self = this;
				query('#clbQuery').on('click', function() {
					layer.load(1);
//					if (clbGrid) {
//						clbGrid = null;
//						dojo.empty('cllxbTabel')
//					}
					if (clbGrid) { clbGrid.destroy(); }//dojo.destroy('zdbTabel');
	                dojo.create("div", {id:'clbTabels', innerHTML:"" },'clbTabel');
					clbGrid = new CustomGrid({
						totalCount : 0,
						pagination:null,
						columns : columns
					}, "clbTabels");
					$(".pagination").remove();
					pageii = new Pagination(clbGrid,xhrArgsTabel,{"VEHI_NO":$(".cp-list").val(),
						"COMP_NAME":$(".yh-list").val(),"AREA_NAME":$(".sq-list").val(),"DLYS":$("#xhc-dlys").val()
						,"JYXK":$("#xhc-jyxk").val(),"STATUS":$("#xhc-zt").val()},30);
					dc.place(pageii.first(),'clbTabels','after');
//					pageii.first();
				});
				query('#clbDet').on('click', function() {
					var sz=[];
		        	for(var id in fxkfsr){
		        		if(fxkfsr[id]){
		        			sz.push(id);
		        		}
		        	}
		        	if(sz.length==0){
		        		dijit.byId('qd_dialog').show().then(function() {
							$("#czjg").html('请选择一个车辆信息！');
						});
		        		return;
		        	}
		        	if(sz.length>1){
		        		dijit.byId('qd_dialog').show().then(function() {
							$("#czjg").html('每次只能查看一个车辆信息！');
						});
		        		return;
		        	}
		        	clbDialogPanel.set('href', 'app/html/xhchtgl/editor/clbEditor.html');
					clbDialog.show().then(function () {
						clbDialog.set('title', '车辆明细');
						//弹出修改框，将下拉框能下拉
						//业户
						findyh().then(function(data){
							xlktyff("tc-yh-ul-list",data.datas);
							comboboxDFun('#yh-tc')
						});
						//业户经营范围
						findjyfw().then(function(data){
							xlktyff("tc-jyfw-ul-list",data.datas);
							comboboxDFun('#jyfw-tc')
						});
						//车辆类型
						findcllxxh().then(function(data){
							xlktyff("tc-cllx-ul-list",data.datas);
							comboboxDFun('#cllx-tc')
						});
						//车辆型号
						findxh().then(function(data){
							xlktyff("tc-xh-ul-list",data.datas);
							comboboxDFun('#xh-tc')
						});
						$("#tc-xh").change(function(){
							$("#tc-xh-ul-list").empty();
							if($("#tc-xh").val()==''){
								findyh().then(function(data){
									xlktyff("tc-xh-ul-list",data.datas);
									comboboxDFun('#xh-tc')
								});
							}else{
								findxhtj($("#tc-xh").val()).then(function(data){
									xlktyff("tc-xh-ul-list",data.datas);
									comboboxDFun('#xh-tc');
								});
							}
						});
						//车辆型号
						findrllx().then(function(data){
							xlktyff("tc-rllx-ul-list",data.datas);
							comboboxDFun('#rllx-tc')
						});
						
						//往弹出框内放值
						$("#tc-yh").val(clb_data[sz[0]-1].COMPANY_NAME);
						$("#tc-yh").attr('data-value',clb_data[sz[0]-1].COMPANY_ID);//业户名称
						$("#tc-xzqh").val(clb_data[sz[0]-1].AREA_NAME);//行政区划
						$("#tc-jyxk").val(clb_data[sz[0]-1].COMPANY_LICENSE_NUMBER);//经营许可证号
						$("#tc-jyfw").val(clb_data[sz[0]-1].BUSINESS_SCOPE_NAME);//业户经营范围
						$("#tc-isgq").val(clb_data[sz[0]-1].IS_EXPIRED);//车辆备注
//						$("#tc-ccdjrq").val(util.formatYYYYMMDD(clb_data[sz[0]-1].PRODUCTION_DATE));//行驶证初次登记日期
						
						$("#tc-jyfw").attr('data-value',clb_data[sz[0]-1].BUSINESS_SCOPE_CODE);//经营范围
						$("#tc-cphm").val(clb_data[sz[0]-1].PLATE_NUMBER);//车牌号码
						$("#tc-cpys").val(clb_data[sz[0]-1].PLATE_COLOR);//车牌颜色
						if(clb_data[sz[0]-1].PLATE_COLOR=='1'){
							$("#tc-cpys").val('蓝');
						}
						if(clb_data[sz[0]-1].PLATE_COLOR=='2'){
							$("#tc-cpys").val('黄');
						}
						if(clb_data[sz[0]-1].PLATE_COLOR=='9'){
							$("#tc-cpys").val('其他');
						}
						if(clb_data[sz[0]-1].PLATE_COLOR=='94'){
							$("#tc-cpys").val('绿');
						}
						$("#tc-cllx").val(clb_data[sz[0]-1].VEHICLE_TYPE_NAME);
						$("#tc-cllx").attr('data-value',clb_data[sz[0]-1].VEHICLE_TYPE_CODE);//车辆类型
						$("#tc-hdzk").val(clb_data[sz[0]-1].SEAT);//核定载客
						$("#tc-cp").val(clb_data[sz[0]-1].BRAND);//厂牌
						$("#tc-xh").val(clb_data[sz[0]-1].MODEL);//型号
						$("#tc-length").val(clb_data[sz[0]-1].LENGTH);//长
						$("#tc-width").val(clb_data[sz[0]-1].WIDTH);//宽
						$("#tc-height").val(clb_data[sz[0]-1].HEIGHT);//高
						$("#tc-ys").val(clb_data[sz[0]-1].COLOR);//车辆颜色
						$("#tc-dah").val(clb_data[sz[0]-1].FILE_NUMBER);//车辆档案号
						$("#tc-zzl").val(clb_data[sz[0]-1].TOTAL_MASS);//总质量
						$("#tc-pfbz").val(clb_data[sz[0]-1].EMISSION_STANDARD);//排放标准
						$("#tc-ccrq").val(util.formatYYYYMMDD(clb_data[sz[0]-1].PRODUCTION_DATE));//出厂日期
						$("#tc-fdjgl").val(clb_data[sz[0]-1].ENGINE_POWER);//发动机功率
						$("#tc-zj").val(clb_data[sz[0]-1].WHEEL_BASE);//轴距
						$("#tc-czs").val(clb_data[sz[0]-1].AXLE_NUMBER);//车轴数
						$("#tc-cjsj").val(util.formatYYYYMMDD(clb_data[sz[0]-1].CREATED_TIME));//创建时间
						$("#tc-gxsj").val(util.formatYYYYMMDD(clb_data[sz[0]-1].UPDATED_TIME));//更新时间
						$("#tc-cjsj").val(util.formatYYYYMMDD(clb_data[sz[0]-1].INITIAL_RECEIPT_DATE));//初领日期
						$("#tc-gcsj").val(util.formatYYYYMMDD(clb_data[sz[0]-1].PURCHASE_DATE));//购车日期
						$("#tc-sscz").val(clb_data[sz[0]-1].HOLDER);//车主
						$("#tc-sfzh").val(clb_data[sz[0]-1].HOLDER_ID);//idcard
						$("#tc-bz").val(clb_data[sz[0]-1].REMARK);//车辆备注
						
						$("#tc-fdjh").val(clb_data[sz[0]-1].ENGINE_NUMBER);//发动机号
						$("#tc-jsdj").val(clb_data[sz[0]-1].TECH_LEVEL_NAME);
						$("#tc-jsdj").attr('data-value',clb_data[sz[0]-1].TECH_LEVEL);//技术等级
						$("#tc-jsdjsj").val(util.formatYYYYMMDD(clb_data[sz[0]-1].TECH_RATING_VALID_PERIOD_END));//技术等级评定有效期止
						$("#tc-jsdjsjq").val(util.formatYYYYMMDD(clb_data[sz[0]-1].TECH_RATING_VALID_PERIOD_FROM));//技术等级评定有效期起
						$("#tc-cjh").val(clb_data[sz[0]-1].CHASSIS_NUMBER);//车辆识别代码/车架号
						$("#tc-rllx").val(clb_data[sz[0]-1].FUEL_NAME);
						$("#tc-rllx").attr('data-value',clb_data[sz[0]-1].FUEL_TYPE);//燃料类型
//						$("#tc-rlxh").val(clb_data[sz[0]-1].FUEL_USAGE);//燃油消耗
						$("#tc-dlyszh").val(clb_data[sz[0]-1].LICENSE_NUMBER);//道路运输证号
						$("#tc-dlyshfjg").val(clb_data[sz[0]-1].LICENSE_ISSUING_AUTHORITY);//道路运输证核发机关
						$("#tc-dlysbz").val(clb_data[sz[0]-1].LICENSE_MEMO);//道路运输证备注
						$("#tc-dlkssj").val(util.formatYYYYMMDD(clb_data[sz[0]-1].LICENSE_VALID_PERIOD_FROM));//有效开始时间
						$("#tc-dljssj").val(util.formatYYYYMMDD(clb_data[sz[0]-1].LICENSE_VALID_PERIOD_END));//有效截止时间
						$("#tc-nssj").val(util.formatYYYYMMDD(clb_data[sz[0]-1].ANNUAL_REVIEW_VALID_PERIOD_S));//年审有效期起
						$("#tc-jssj").val(util.formatYYYYMMDD(clb_data[sz[0]-1].LICENSE_VALID_PERIOD_END));//年审有效期止
						$("#tc-fzsj").val(util.formatYYYYMMDD(clb_data[sz[0]-1].LICENSE_ISSUE_DATE));//初次发证时间
										
						
//                        query('.clb-iFBtnCommit').on('click', function() {
//                        	var FormJson = getFormJson("clbEditorForm");
//                        	FormJson.COMPANY_ID = $("#yh-tc input").data('value');//业户名称
//                        	FormJson.COMPANY_LICENSE_NUMBER = $("#tc-jyxk").data('value');//经营许可证号
//                        	FormJson.BUSINESS_SCOPE_CODE = $("#jyfw-tc input").data('value');//经营范围
//                        	FormJson.PLATE_COLOR = $("#tc-cpys").data('value');//车牌颜色
//                        	FormJson.VT_ID = $("#cllx-tc input").data('value');//车辆类型
//                        	FormJson.SEAT = $("#tc-hdzk").data('value');//核定载客
//                        	FormJson.BRAND = $("#tc-cp").data('value');//厂牌                    	
//                        	FormJson.MODEL = $("#tc-xh").data('value');//型号              
//                        	FormJson.SEAT = $("#tc-length").data('value');//核定载客
//                        	FormJson.BRAND = $("#tc-length").data('value');//长                  	
//                        	FormJson.MODEL = $("#tc-width").data('value');//宽        
//                        	FormJson.MODEL = $("#tc-height").data('value');//高
//                        	FormJson.COLOR = $("#tc-ys").data('value');//车辆颜色
//                        	FormJson.FILE_NUMBER = $("#tc-dah").data('value');//车辆档案号       	
//                        	FormJson.TOTAL_MASS = $("#tc-zzl").data('value');//总质量
////                        	FormJson.EMISSION_STANDARD = $("#tc-pfbz").data('value');//排放标准
//                        	FormJson.REMARK = $("#tc-bz").data('value');//备注
//                        	FormJson.ENGINE_NUMBER = $("#tc-fdjh").data('value');//发动机号                 	
//                        	FormJson.TECH_LEVEL = $("#tc-jsdj").data('value');//技术等级
//                        	FormJson.TECH_ENDTIME = $("#tc-jsdjsj").data('value');//技术等级评定有效期止
//                        	FormJson.CHASSIS_NUMBER = $("#tc-cjh").data('value');//车辆识别代码/车架号                	
//                        	FormJson.FUEL_TYPE = $("#tc-rllx").data('value');//燃料类型        
////                        	FormJson.FUEL_USAGE = $("#tc-rlxh").data('value');//燃油消耗
//                        	
//                        	if(FormJson.VC_ID.length==0){
//                        		dijit.byId('qd_dialog').show().then(function() {
//        							$("#czjg").html('车辆颜色不能为空！');
//        						});
//        		        		return;
//                        	}
//                        	FormJson.VEHI_ID = clb_data[sz[0]-1].VEHI_ID;
//                        	FormJson.MDT_ID = clb_data[sz[0]-1].MDTINFO[0].MDT_ID;
//                        	var cln = '',zdn = '';
//                        	var reg = new RegExp(";","g");
//                        	if(FormJson.CL_NOTE1!=''){
//                        		cln = FormJson.CL_NOTE1+"";
//                        		cln = cln.replace(reg,"；");
//                        		FormJson.CL_NOTE = cln;
//                        	}else{
//                        		FormJson.CL_NOTE = FormJson.CL_NOTE1;
//                        	}
//                        	if(FormJson.ZZ_NOTE1!=''){
//                        		zdn = FormJson.ZZ_NOTE1+"";
//                        		zdn = zdn.replace(reg,"；");
//                        		FormJson.ZZ_NOTE = zdn;
//                        	}else{
//                        		FormJson.ZZ_NOTE = FormJson.ZZ_NOTE1;
//                        	}
//                        	var datap = JSON.stringify(FormJson);
//                        	var xhrArgs2 = {
//									url : basePath  + "back/editclb",
//									postData : {
//										"postData" : datap
//									},
//									handleAs : "json",
//									Origin : self.location.origin,
//									preventCache:true,
//									withCredentials :  true,
//									load : function(data) {
//										dijit.byId('qd_dialog').show().then(function() {
//											$("#czjg").html(data.info);
//											dojo.xhrPost(xhrArgsTabel);
//											clbDialog.hide();
//										});
//									}
//								};
//								dojo.xhrPost(xhrArgs2);
//                        });
                        query('.clb-iFBtnClose').on('click', function() {
                        	clbDialog.hide();
                        });
                    })
				});
				query('#clbDel').on('click', function() {
                	var sz=[];
		        	for(var id in fxkfsr){
		        		if(fxkfsr[id]){
		        			sz.push(id);
		        		}
		        	}
		        	if(sz.length==0){
		        		dijit.byId('qd_dialog').show().then(function() {
							$("#czjg").html('请至少选择一个客户后删除！');
						});
		        		return;
		        	}
		        	var zzid = [],mdtid = [];
		        	for(var i=0; i<sz.length; i++){
		        		zzid.push(clb_data[sz[i]-1].VEHI_ID);
		        		mdtid.push(clb_data[sz[0]-1].MDTINFO[0].MDT_ID)
		        	}
		        	var idstr=zzid.join(',');
		        	var idmdt=mdtid.join(',');
		        	layer.confirm('确定要删除该条记录吗?', function(index){
		        		var xhrArgs2 = {
								url : basePath  + "back/delclb",
								postData : {
									"cid" : idstr,
									"mid" : idmdt
								},
								handleAs : "json",
								Origin : self.location.origin,
								preventCache:true,
								withCredentials :  true,
								load : function(data) {
									dijit.byId('qd_dialog').show().then(function() {
										$("#czjg").html(data.info);
										dojo.xhrPost(xhrArgsTabel);
									})
								}
							}
					  dojo.xhrPost(xhrArgs2);
	        		  layer.close(index);
	        		}); 
		        	
                });
				query('#clbDc').on('click', function() {
					var postData = {"VEHI_NO":$(".cp-list").val(),
									"COMP_NAME":$(".yh-list").val(),
									"AREA_NAME":$(".sq-list").val(),
									"DLYS":$("#xhc-dlys").val(),
									"JYXK":$("#xhc-jyxk").val(),
									"STATUS":$("#xhc-zt").val()};
					url = "backExcel/findclxxexcle?postData="
						+ encodeURI(encodeURI(JSON.stringify(postData))), window.open(url)
            });
			/*时间控件*/
			query('#clb-startTime').on('focus', function () {
				WdatePicker({
					dateFmt: STATEDATE
				});
			});
			query('#clb-endTime').on('focus', function () {
				WdatePicker({dateFmt: STATEDATE});
			});
			}
		})
	});