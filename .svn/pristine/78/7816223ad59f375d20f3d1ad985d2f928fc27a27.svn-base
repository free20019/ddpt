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
				VNT_NAME: {label: '业务区块'},
				BA_NAME: {label: '公司名称'},
				COMP_NAME: {label: '分公司名'},
				VEHI_NUM: {label: '车辆编号'},
				VEHI_NO: {label: '车辆号码'},
				MDT_NO: {label: '终端编号'},
				MT_NAME: {label: '终端类型'},
				CT_NAME: {label: '通信类型名'},
				SIM_NUM: {label: 'SIM卡号'},
				RLLX: {label: '燃料类型'},
				OWN_NAME: {label: '车主姓名'},
				OWN_TEL: {label: '车主电话'},
				HOME_TEL: {label: '白班电话'},
				NIGHT_TEL: {label: '晚班电话'},
				VT_NAME: {label: '车辆类型'},
				QRY_PWD: {label: '查询密码'},
				VC_NAME: {label: '车辆颜色'},
				VNC_NAME: {label: '车牌颜色'},
				BASIS_COMP: {label: '车辆子公司'},
				MTN_TIME: {label: '初装时间',formatter : util.formatYYYYMMDDHHMISS},
				RECONSTRUCT_DATE: {label: '改造时间',formatter : util.formatYYYYMMDDHHMISS},
				UP_DATE: {label: '升级时间',formatter : util.formatYYYYMMDDHHMISS},
				VS_NAME: {label: '车辆状态'},
				VIRWEB: {label: '车辆子型号'},
				MDT_SUB_TYPE: {label: '终端型号'},
				VSIM_NUM: {label: '虚拟网'},
				NOTE: {label: '备注'}
        };
		var xhrArgsTabel = {
			url : basePath + "back/findclb",
			postData : 'postData={"page":1,"pageSize":30}',
			handleAs : "json",
			Origin : self.location.origin,
			preventCache : true,
			withCredentials : true,
			load : function(data) {
				layer.closeAll();
				clb_data = data.datas;
				console.log(clb_data)
				for (var i = 0; i < data.datas.length; i++) {
					data.datas[i] = dojo.mixin({
						dojoId : i + 1
					}, data.datas[i]);
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
				pageii = new Pagination(clbGrid,xhrArgsTabel,{"BA_ID":$(".gs-list").val(),
						"COMP_ID":$(".fgs-list").val(),"VEHI_NO":$("#ch-f").val(),"GJZ":$("#clb-gjz").val()
						,"STIME":$("#clb-startTime").val(),"ETIME":$("#clb-endTime").val()},30);
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
					pageii = new Pagination(clbGrid,xhrArgsTabel,{"BA_ID":$(".gs-list").val(),
							"COMP_ID":$(".fgs-list").val(),"VEHI_NO":$("#ch-f").val(),"GJZ":$("#clb-gjz").val()
							,"STIME":$("#clb-startTime").val(),"ETIME":$("#clb-endTime").val()},30);
					dc.place(pageii.first(),'clbTabels','after');
//					pageii.first();
				});
				query('#clbAdd').on('click', function() {
					clbDialogPanel.set('href', 'app/html/czchtgl/editor/clbEditor.html');
					clbDialog.show().then(function () {
						clbDialog.set('title', '新增车辆');
						//弹出框出来之后，往下拉列表框放值
						//公司
						fingba().then(function(data){
							xlktyff("tc-gs-ul-list",data.datas);
							comboboxDFun('#gs-tc')
						});
						//分公司
						$("#tc-gs").change(function(){
							$("#tc-fgs-ul-list").empty();
							$("#tc-gs-ul-list").empty();
							if($("#tc-gs").val()==''){
								fingba().then(function(data){
									xlktyff("tc-gs-ul-list",data.datas);
									comboboxDFun('#gs-tc')
								});
							}else{
								findbatj($("#tc-gs").val()).then(function(data){
									xlktyff("tc-gs-ul-list",data.datas);
									comboboxDFun('#gs-tc');
								});
							}
							$("#tc-fgs").data('value','');
							$("#tc-fgs").val('请选择分公司');
							findcomp($("#gs-tc input").data('value')).then(function(data){
								xlktyff("tc-fgs-ul-list",data.datas);
								comboboxDFun('#fgs-tc')
							});
						})
						//车辆类型
						findcllx().then(function(data){
							xlktyff("tc-cx-ul-list",data.datas);
							comboboxDFun('#tc-cx')
						});
						$("#tc-cllx").change(function(){
							$("#tc-cx-ul-list").empty();
							if($("#tc-cllx").val()==''){
								findcllx().then(function(data){
									xlktyff("tc-cx-ul-list",data.datas);
									comboboxDFun('#tc-cx');
								});
							}else{
								findcllxtj($("#tc-cllx").val()).then(function(data){
									xlktyff("tc-cx-ul-list",data.datas);
									comboboxDFun('#tc-cx');
								});
							}
						});
						//车辆颜色
						findclys().then(function(data){
							xlktyff("ys-ul-list",data.datas);
							comboboxDFun('#tc-clys')
						});
						//车牌类型
						findcplx().then(function(data){
							xlktyff("cp-ul-list",data.datas);
							comboboxDFun('#tc-cplx')
						});
						comboboxDFun('#tc-jjqlx')
						comboboxDFun('#tc-fwzt')
						comboboxDFun('#tc-yjcl')
						comboboxDFun('#tc-rllx')
						//车辆状态
						findclzt().then(function(data){
							xlktyff("clzt-ul-list",data.datas);
							comboboxDFun('#tc-clzt')
						});
						//车牌颜色
						findcpys().then(function(data){
							xlktyff("cpys-ul-list",data.datas);
							comboboxDFun('#tc-cpys')
						});
						//终端类型
						findzdlx().then(function(data){
							xlktyff("zdlxmc-ul-list",data.datas);
							comboboxDFun('#tc-zdlxmc')
						});
						comboboxDFun('#tc-ddlx')
						comboboxDFun('#tc-thlx')
						comboboxDFun('#tc-bbgl')
						//通信类型
						findtxlx().then(function(data){
							xlktyff("txlx-ul-list",data.datas);
							comboboxDFun('#tc-txlx')
						});
						//终端型号
						findzdxh().then(function(data){
							xlktyff("zdxh-ul-list",data.datas);
							comboboxDFun('#tc-zdxh')
						});
						//终端状态
						findzdzt().then(function(data){
							xlktyff("ul-list-zdzt",data.datas);
							comboboxDFun('#tc-zdzt')
						});
						$("#tc-czsj").val(util.formatYYYYMMDD(new Date().getTime()));
						//单机确定按钮 
						query('.clb-iFBtnCommit').on('click', function() {
                        	var FormJson = getFormJson("clbEditorForm");
                        	FormJson.BA_ID = $("#gs-tc input").data('value');//总公司
                        	FormJson.COMP_ID = $("#fgs-tc input").data('value');//分公司
                        	FormJson.VT_ID = $("#clbEditor-clxx_cllx input").data('value');//车辆类型
                        	FormJson.VC_ID = $("#clbEditor-clxx_clys input").data('value');//车辆颜色
                        	FormJson.VNT_ID = $("#clbEditor-clxx_cplx input").data('value');//车牌类型
                        	FormJson.VS_ID = $("#clbEditor-clxx_clzt input").data('value');//车辆状态
                        	FormJson.VNC_ID = $("#clbEditor-clxx_cpys input").data('value');//车牌颜色
                        	FormJson.MT_ID = $("#clbEditor-zdxx_gs input").data('value');//终端类型名称
                        	FormJson.CT_ID = $("#clbEditor-zdxx_txlxm input").data('value');//通信类型名称
                        	FormJson.SUBID = $("#clbEditor-zdxx_zdxh input").data('value');//终端型号
                        	FormJson.SERVICE_STATUS = $("#clbEditor-clxx_fwzt input").data('value');//服务状态
                        	FormJson.MS_ID = $("#clbEditor-zdxx_zdzt input").data('value');//终端状态
                        	FormJson.DISP_TYPE = $("#clbEditor-zdxx_ddlx input").data('value');//调度类型
                        	FormJson.ALERT_MALFUNC = $("#clbEditor-zdxx_bjgl input").data('value');//报警过滤
                        	if(FormJson.BA_ID.length==0){
                        		dijit.byId('qd_dialog').show().then(function() {
        							$("#czjg").html('车辆公司不能为空！');
        						});
        		        		return;
                        	}
                        	if(FormJson.VEHI_NO.length==0){
                        		dijit.byId('qd_dialog').show().then(function() {
        							$("#czjg").html('车牌号码不能为空！');
        						});
        		        		return;
                        	}
                        	if(FormJson.MDT_NO.length==0){
                        		dijit.byId('qd_dialog').show().then(function() {
        							$("#czjg").html('终端编号不能为空！');
        						});
        		        		return;
                        	}
                        	if(FormJson.VNT_ID.length==0){
                        		dijit.byId('qd_dialog').show().then(function() {
        							$("#czjg").html('车牌类型不能为空！');
        						});
        		        		return;
                        	}
                        	if(FormJson.COMP_ID.length==0){
                        		dijit.byId('qd_dialog').show().then(function() {
        							$("#czjg").html('车辆分公司不能为空！');
        						});
        		        		return;
                        	}
                        	if(FormJson.MT_ID.length==0){
                        		dijit.byId('qd_dialog').show().then(function() {
        							$("#czjg").html('终端类型名称不能为空！');
        						});
        		        		return;
                        	}
                        	if(FormJson.VC_ID.length==0){
                        		dijit.byId('qd_dialog').show().then(function() {
        							$("#czjg").html('车辆颜色不能为空！');
        						});
        		        		return;
                        	}
                        	var cln = '',zdn = '';
                        	var reg = new RegExp(";","g");
                        	if(FormJson.CL_NOTE1!=''){
                        		cln = FormJson.CL_NOTE1+"";
                        		cln = cln.replace(reg,"；");
                        		FormJson.CL_NOTE = cln;
                        	}else{
                        		FormJson.CL_NOTE = FormJson.CL_NOTE1;
                        	}
                        	if(FormJson.ZZ_NOTE1!=''){
                        		zdn = FormJson.ZZ_NOTE1+"";
                        		zdn = zdn.replace(reg,"；");
                        		FormJson.ZZ_NOTE = zdn;
                        	}else{
                        		FormJson.ZZ_NOTE = FormJson.ZZ_NOTE1;
                        	}
                        	var datap = JSON.stringify(FormJson);
                        	var xhrArgs2 = {
									url : basePath  + "back/addclb",
									postData : {
										"postData" : datap
									},
									handleAs : "json",
									Origin : self.location.origin,
									preventCache:true,
									withCredentials :  true,
									load : function(data) {
										dijit.byId('qd_dialog').show().then(function() {
											$("#czjg").html(data.info);
											dojo.xhrPost(xhrArgsTabel);
											clbDialog.hide();
										})
									}
								}
								dojo.xhrPost(xhrArgs2);
                        });
                        query('.clb-iFBtnClose').on('click', function() {
                        	clbDialog.hide();
                        });
					})
				});
				query('#clbUpd').on('click', function() {
					var sz=[];
		        	for(var id in fxkfsr){
		        		if(fxkfsr[id]){
		        			sz.push(id);
		        		}
		        	}
		        	if(sz.length==0){
		        		dijit.byId('qd_dialog').show().then(function() {
							$("#czjg").html('请选择一个车辆信息后修改！');
						});
		        		return;
		        	}
		        	if(sz.length>1){
		        		dijit.byId('qd_dialog').show().then(function() {
							$("#czjg").html('每次只能修改一个车辆信息！');
						});
		        		return;
		        	}
		        	clbDialogPanel.set('href', 'app/html/czchtgl/editor/clbEditor.html');
					clbDialog.show().then(function () {
						clbDialog.set('title', '修改车辆');
						//弹出修改框，将下拉框能下拉
						//公司
						fingba().then(function(data){
							xlktyff("tc-gs-ul-list",data.datas);
							comboboxDFun('#gs-tc')
						});
						$("#tc-clsx").change(function(){
							$("#tc-gs-ul-list").empty();
							if($("#tc-clsx").val()==''){
								fingba().then(function(data){
									xlktyff("tc-gs-ul-list",data.datas);
									comboboxDFun('#gs-tc')
								});
							}else{
								findbatj($("#tc-clsx").val()).then(function(data){
									xlktyff("tc-gs-ul-list",data.datas);
									comboboxDFun('#gs-tc');
								});
							}
						});
						//分公司
						$("#tc-gs").change(function(){
							$("#tc-fgs-ul-list").empty();
							$("#tc-gs-ul-list").empty();
							if($("#tc-gs").val()==''){
								fingba().then(function(data){
									xlktyff("tc-gs-ul-list",data.datas);
									comboboxDFun('#gs-tc')
								});
							}else{
								findbatj($("#tc-gs").val()).then(function(data){
									xlktyff("tc-gs-ul-list",data.datas);
									comboboxDFun('#gs-tc');
								});
							}
							$("#tc-fgs").data('value','');
							$("#tc-fgs").val('请选择分公司');
							findcomp($("#gs-tc input").data('value')).then(function(data){
								xlktyff("tc-fgs-ul-list",data.datas);
								comboboxDFun('#fgs-tc')
							});
						})
						//车辆类型
						findcllx().then(function(data){
							xlktyff("tc-cx-ul-list",data.datas);
							comboboxDFun('#tc-cx')
						});
						$("#tc-cllx").change(function(){
							$("#tc-cx-ul-list").empty();
							if($("#tc-cllx").val()==''){
								findcllx().then(function(data){
									xlktyff("tc-cx-ul-list",data.datas);
									comboboxDFun('#tc-cx');
								});
							}else{
								findcllxtj($("#tc-cllx").val()).then(function(data){
									xlktyff("tc-cx-ul-list",data.datas);
									comboboxDFun('#tc-cx');
								});
							}
						});
						//车辆颜色
						findclys().then(function(data){
							xlktyff("ys-ul-list",data.datas);
							comboboxDFun('#tc-clys')
						});
						//车牌类型
						findcplx().then(function(data){
							xlktyff("cp-ul-list",data.datas);
							comboboxDFun('#tc-cplx')
						});
						comboboxDFun('#tc-jjqlx')
						comboboxDFun('#tc-fwzt')
						comboboxDFun('#tc-yjcl')
						comboboxDFun('#tc-rllx')
						//车辆状态
						findclzt().then(function(data){
							xlktyff("clzt-ul-list",data.datas);
							comboboxDFun('#tc-clzt')
						});
						//车牌颜色
						findcpys().then(function(data){
							xlktyff("cpys-ul-list",data.datas);
							comboboxDFun('#tc-cpys')
						});
						//终端类型
						findzdlx().then(function(data){
							xlktyff("zdlxmc-ul-list",data.datas);
							comboboxDFun('#tc-zdlxmc')
						});
						comboboxDFun('#tc-ddlx')
						comboboxDFun('#tc-thlx')
						comboboxDFun('#tc-bbgl')
						//通信类型
						findtxlx().then(function(data){
							xlktyff("txlx-ul-list",data.datas);
							comboboxDFun('#tc-txlx')
						});
						//终端型号
						findzdxh().then(function(data){
							xlktyff("zdxh-ul-list",data.datas);
							comboboxDFun('#tc-zdxh')
						});
						//终端状态
						findzdzt().then(function(data){
							xlktyff("ul-list-zdzt",data.datas);
							comboboxDFun('#tc-zdzt')
						});
						comboboxDFun('#tc-kg1');
						comboboxDFun('#tc-kg2');
						comboboxDFun('#tc-kg3');
						comboboxDFun('#tc-kg4');
						comboboxDFun('#tc-kg5');
						comboboxDFun('#tc-kg6');
						comboboxDFun('#tc-kg7');
						comboboxDFun('#tc-kg8');
						comboboxDFun('#tc-kg9');
						comboboxDFun('#tc-kg10');
						comboboxDFun('#tc-kg11');
						comboboxDFun('#tc-kg12');
						comboboxDFun('#tc-kg13');
						comboboxDFun('#tc-kg14');
						comboboxDFun('#tc-kg15');
						comboboxDFun('#tc-kg16');
						findcomp(clb_data[sz[0]-1].BA_ID).then(function(data){
							xlktyff("tc-fgs-ul-list",data.datas);
							comboboxDFun('#fgs-tc')
						});
						//往弹出框内放值
						$("#tc-gs").val(clb_data[sz[0]-1].BA_NAME);
						$("#tc-gs").attr('data-value',clb_data[sz[0]-1].BA_ID);//公司
						$("#tc-fgs").val(clb_data[sz[0]-1].COMP_NAME);
						$("#tc-fgs").attr('data-value',clb_data[sz[0]-1].COMP_ID);//分公司
//						$("#tc-clbh").val(clb_data[sz[0]-1].VEHI_NUM);//车辆编号
						$("#tc-simk").val(clb_data[sz[0]-1].SIM_NUM);//SIM卡号
						$("#tc-cphm").val(clb_data[sz[0]-1].VEHI_NO);//车牌号码
						$("#tc-czxm").val(clb_data[sz[0]-1].OWN_NAME);//车主姓名
						$("#tc-cllx").val(clb_data[sz[0]-1].VT_NAME);
						$("#tc-cllx").attr('data-value',clb_data[sz[0]-1].VT_ID);//车辆类型
						$("#tc-czdh").val(clb_data[sz[0]-1].OWN_TEL);//车主电话
						$("#tc-bbdh").val(clb_data[sz[0]-1].HOME_TEL);//白班电话
						$("#tc-wbdh").val(clb_data[sz[0]-1].NIGHT_TEL);//晚班电话
						$("#tc-clys-input").val(clb_data[sz[0]-1].VC_NAME);
						$("#tc-clys-input").attr('data-value',clb_data[sz[0]-1].VC_ID);//车辆颜色
						$("#tc-czsj").val(util.formatYYYYMMDD(clb_data[sz[0]-1].MTN_TIME));//初装时间
						$("#tc-cplx-input").val(clb_data[sz[0]-1].VNT_NAME);
						$("#tc-cplx-input").attr('data-value',clb_data[sz[0]-1].VNT_ID);//车牌类型
						$("#tc-cxmm").val(clb_data[sz[0]-1].QRY_PWD);//查询密码
						$("#tc-clzgs").val(clb_data[sz[0]-1].BASIS_COMP);//车辆子公司
						$("#tc-jjqlx-input").val(clb_data[sz[0]-1].OIL_TYPE);
						$("#tc-jjqlx-input").attr('data-value',clb_data[sz[0]-1].OIL_TYPE);//计价器类型
						$("#tc-clzt-input").val(clb_data[sz[0]-1].VS_NAME);
						$("#tc-clzt-input").attr('data-value',clb_data[sz[0]-1].VS_ID);//车辆状态
						$("#tc-rllx-input").attr('data-value',clb_data[sz[0]-1].RLLX);//燃料类型
						$("#tc-rllx-input").val(clb_data[sz[0]-1].RLLX);//燃料类型
						if(clb_data[sz[0]-1].SERVICE_STATUS=='0'){
							$("#tc-fwzt-input").val('服务');
						}
						if(clb_data[sz[0]-1].SERVICE_STATUS=='1'){
							$("#tc-fwzt-input").val('不服务');
						}
						$("#tc-fwzt-input").attr('data-value',clb_data[sz[0]-1].SERVICE_STATUS);//服务状态
						$("#tc-xnw").val(clb_data[sz[0]-1].VSIM_NUM);//虚拟网
						$("#tc-zhxgr").val(clb_data[sz[0]-1].LAST_UPDATE);//最后修改人
						$("#tc-gzsj").val(util.formatYYYYMMDD(clb_data[sz[0]-1].RECONSTRUCT_DATE));//改造时间
						$("#tc-sjsj").val(util.formatYYYYMMDD(clb_data[sz[0]-1].UP_DATE));//升级时间
						$("#tc-cpys-input").val(clb_data[sz[0]-1].VNC_NAME);
						$("#tc-cpys-input").attr('data-value',clb_data[sz[0]-1].VNC_ID);//车辆颜色
						$("#tc-yjcl-input").val(clb_data[sz[0]-1].DR_NO);
						$("#tc-yjcl-input").attr('data-value',clb_data[sz[0]-1].DR_NO);//应急车辆
						$("#tc-jjbsj").val(clb_data[sz[0]-1].CHANGE_BUI_TIME);//交接班时间
						$("#tc-jjbdz").val(clb_data[sz[0]-1].CHANGE_BUI_ADDR);//交接班地址
						$("#tc-cl-bz").text(clb_data[sz[0]-1].NOTE);//车辆备注
						
						//终端框内添加数据
						var mdtinfo = clb_data[sz[0]-1].MDTINFO[0];
						console.log(mdtinfo)
						$("#tc-zdlxmc-input").val(mdtinfo.MT_NAME);
						$("#tc-zdlxmc-input").attr('data-value',mdtinfo.MT_ID);//终端类型名称
						$("#tc-zdbh").val(mdtinfo.MDT_NO);//终端编号
						if(clb_data[sz[0]-1].DISP_TYPE=='0'){
							$("#tc-ddlx-input").val('老');
						}
						if(clb_data[sz[0]-1].DISP_TYPE=='1'){
							$("#tc-ddlx-input").val('新');
						}
						$("#tc-ddlx-input").attr('data-value',mdtinfo.DISP_TYPE);//调度类型
						$("#tc-bgip").val(mdtinfo.REPORT_IP);//报告ip
						$("#tc-thgn").val(mdtinfo.TALK_FUNC);//通话功能
						$("#tc-azry").val(mdtinfo.INST_MAN);//安装人员
						$("#tc-txlxm").val(mdtinfo.CT_NAME);
						$("#tc-txlxm").attr('data-value',mdtinfo.CT_ID);//通信类型名
						$("#tc-zdzt-input").val(mdtinfo.MS_NAME);//
						$("#tc-zdzt-input").attr('data-value',mdtinfo.MS_ID);//终端状态
						$("#tc-zdxh-input").val(mdtinfo.SUB_NAME);//
						$("#tc-zdxh-input").attr('data-value',mdtinfo.SUBID);//终端型号
						if(clb_data[sz[0]-1].ALERT_MALFUNC=='0'){
							$("#tc-jbgl").val('否');
						}
						if(clb_data[sz[0]-1].ALERT_MALFUNC=='1'){
							$("#tc-jbgl").val('是');
						}
						$("#tc-jbgl").attr('data-value',mdtinfo.ALERT_MALFUNC);//警报过滤
						$("#tc-jsdk").val(mdtinfo.RCV_PORT);//接收端口
						$("#tc-gpsdk").val(mdtinfo.GPS_PORT);//GPS端口
						$("#tc-fsdk").val(mdtinfo.SEND_PORT);//发送端口
						$("#tc-zdsbid").val(mdtinfo.MDT_MID);//终端设备
						$("#tc-mdt-bz").text(mdtinfo.NOTE);//mdt备注
                        query('.clb-iFBtnCommit').on('click', function() {
                        	var FormJson = getFormJson("clbEditorForm");
                        	FormJson.BA_ID = $("#gs-tc input").data('value');//总公司
                        	FormJson.COMP_ID = $("#fgs-tc input").data('value');//分公司
                        	FormJson.VT_ID = $("#clbEditor-clxx_cllx input").data('value');//车辆类型
                        	FormJson.VC_ID = $("#clbEditor-clxx_clys input").data('value');//车辆颜色
                        	FormJson.VNT_ID = $("#clbEditor-clxx_cplx input").data('value');//车牌类型
                        	FormJson.VS_ID = $("#clbEditor-clxx_clzt input").data('value');//车辆状态
                        	FormJson.VNC_ID = $("#clbEditor-clxx_cpys input").data('value');//车牌颜色
                        	FormJson.MT_ID = $("#clbEditor-zdxx_gs input").data('value');//终端类型名称
                        	FormJson.CT_ID = $("#clbEditor-zdxx_txlxm input").data('value');//通信类型名称
                        	FormJson.SUBID = $("#clbEditor-zdxx_zdxh input").data('value');//终端型号
                        	FormJson.SERVICE_STATUS = $("#clbEditor-clxx_fwzt input").data('value');//服务状态
                        	FormJson.MS_ID = $("#clbEditor-zdxx_zdzt input").data('value');//终端状态
                        	FormJson.DISP_TYPE = $("#clbEditor-zdxx_ddlx input").data('value');//调度类型
                        	FormJson.ALERT_MALFUNC = $("#clbEditor-zdxx_bjgl input").data('value');//报警过滤
                        	if(FormJson.BA_ID.length==0){
                        		dijit.byId('qd_dialog').show().then(function() {
        							$("#czjg").html('车辆公司不能为空！');
        						});
        		        		return;
                        	}
                        	if(FormJson.VEHI_NO.length==0){
                        		dijit.byId('qd_dialog').show().then(function() {
        							$("#czjg").html('车牌号码不能为空！');
        						});
        		        		return;
                        	}
                        	if(FormJson.MDT_NO.length==0){
                        		dijit.byId('qd_dialog').show().then(function() {
        							$("#czjg").html('终端编号不能为空！');
        						});
        		        		return;
                        	}
                        	if(FormJson.VNT_ID.length==0){
                        		dijit.byId('qd_dialog').show().then(function() {
        							$("#czjg").html('车牌类型不能为空！');
        						});
        		        		return;
                        	}
                        	if(FormJson.COMP_ID.length==0){
                        		dijit.byId('qd_dialog').show().then(function() {
        							$("#czjg").html('车辆分公司不能为空！');
        						});
        		        		return;
                        	}
                        	if(FormJson.MT_ID.length==0){
                        		dijit.byId('qd_dialog').show().then(function() {
        							$("#czjg").html('终端类型名称不能为空！');
        						});
        		        		return;
                        	}
                        	if(FormJson.VC_ID.length==0){
                        		dijit.byId('qd_dialog').show().then(function() {
        							$("#czjg").html('车辆颜色不能为空！');
        						});
        		        		return;
                        	}
                        	FormJson.VEHI_ID = clb_data[sz[0]-1].VEHI_ID;
                        	FormJson.MDT_ID = clb_data[sz[0]-1].MDTINFO[0].MDT_ID;
                        	var cln = '',zdn = '';
                        	var reg = new RegExp(";","g");
                        	if(FormJson.CL_NOTE1!=''){
                        		cln = FormJson.CL_NOTE1+"";
                        		cln = cln.replace(reg,"；");
                        		FormJson.CL_NOTE = cln;
                        	}else{
                        		FormJson.CL_NOTE = FormJson.CL_NOTE1;
                        	}
                        	if(FormJson.ZZ_NOTE1!=''){
                        		zdn = FormJson.ZZ_NOTE1+"";
                        		zdn = zdn.replace(reg,"；");
                        		FormJson.ZZ_NOTE = zdn;
                        	}else{
                        		FormJson.ZZ_NOTE = FormJson.ZZ_NOTE1;
                        	}
                        	var datap = JSON.stringify(FormJson);
                        	var xhrArgs2 = {
									url : basePath  + "back/editclb",
									postData : {
										"postData" : datap
									},
									handleAs : "json",
									Origin : self.location.origin,
									preventCache:true,
									withCredentials :  true,
									load : function(data) {
										dijit.byId('qd_dialog').show().then(function() {
											$("#czjg").html(data.info);
											dojo.xhrPost(xhrArgsTabel);
											clbDialog.hide();
										});
									}
								};
								dojo.xhrPost(xhrArgs2);
                        });
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
					var postData = {"BA_ID":$(".gs-list").val(),
							"COMP_ID":$(".fgs-list").val(),"VEHI_NO":$("#ch-f").val(),"GJZ":$("#clb-gjz").val()
							,"STIME":$("#clb-startTime").val(),"ETIME":$("#clb-endTime").val()};
					url = "backExcel/clbdcexcle?postData="
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