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
		var odsjfxGrid = null, store = null;
		var odsjfx_data;
		var fxkfsr={};
		var loadindex;
		var columns = {
				dojoId: {label: '序号'},
				VHIC: {label: '车号'},
				SIM: {label: '终端编号'},
				YINGYUN: {label: '营运资格服务证'},
				SHANGCHE: {label: '上车时间', formatter:util.formatYYYYMMDDHHMISS},
				XIACHE: {label: '下车时间', formatter:util.formatYYYYMMDDHHMISS},
				JICHENG: {label: '计程(公里)'},
				DENGHOU: {label: '等候时间'},
				JINE: {label: '交易金额'},
				KONGSHI: {label: '空驶(公里)', formatter:util.formatYWS},
				ZHONGXINTIME: {label: '接收时间', formatter:util.formatYYYYMMDDHHMISS},
				YUANE: {label: '卡原额', formatter:util.formatLWS},
				CITY: {label: '城市代码'},
				XIAOFEI: {label: '唯一代码'},
				KAHAO: {label: '卡留水号'},
				BAOLIU: {label: '保留位'},
				ZHONGDUANNO: {label: '终端交易流水号'},
				JIAOYI: {label: '交易类型'},
				KATYPE: {label: '卡类型'},
				QIANBAO: {label: '钱包累计交易次数'},
				QIYONG: {label: '启用时间'},
				JIAKUAN: {label: '存钱时间'},
				TAC: {label: 'TAC交易认证码'},
				POS: {label: 'POS机号'},
				QIYE: {label: '企业编号'}
        };
		var xhrArgsTabel = {
			url : basePath + "form/getodyysjfx",
			postData : 'postData={"page":1,"pageSize":30}',
			handleAs : "json",
			Origin : self.location.origin,
			preventCache : true,
			withCredentials : true,
			load : function(data) {
				odsjfx_data = data.mx;
				var tab = '';
				for (var i = 0; i < data.tj.length; i++) {
					tab += '<tr><td>'+data.tj[i].TJCS+'</td><td>'+data.tj[i].CPHM+'</td><td>'+data.tj[i].YSSC+'</td><td>'+data.tj[i].DHSJ+'</td><td>'+data.tj[i].JINE+'</td><td>'+data.tj[i].SZLC+'</td></tr>';
				}
				$('#sjfx_lxtj').html(tab);
				for (var i = 0; i < data.mx.length; i++) {
					data.mx[i] = dojo.mixin({
						dojoId : i + 1
					}, data.mx[i]);
				}
				store = new Memory({
					data : {
						identifier : 'dojoId',
						label : 'dojoId',
						items : data.mx
					}
				});
				odsjfxGrid.totalCount = data.count;
				odsjfxGrid.set('collection', store);
				odsjfxGrid.pagination.refresh(data.mx.length);
				layer.close(loadindex);
			},
			error : function(error) {
				console.log(error);
			}
		};
		var pageii = null;	
		return declare( null,{
			constructor:function(){
				this.initToolBar();
//				if (odsjfxGrid) {
//					odsjfxGrid = null;
//					dojo.empty('cllxbTabel')
//				}
				loadindex = layer.load(1);
				$('#odsjfx-sdate').val(util.formatYYYYMMDD(new Date()));
				$('#odsjfx-edate').val(util.formatYYYYMMDD(new Date()));
				if (odsjfxGrid) { odsjfxGrid.destroy(); }//dojo.destroy('zdbTabel');
                dojo.create("div", {id:'odsjfxTabels', innerHTML:"" },'odsjfxTabel');
				odsjfxGrid = new CustomGrid({
//					collection: store,
//					selectionMode: 'none', 
//					allowSelectAll: true,
					totalCount : 0,
					pagination:null,
					columns : columns
				}, "odsjfxTabels");
				pageii = new Pagination(odsjfxGrid,xhrArgsTabel,{"STIME":$("#odsjfx-sdate").val(),"ETIME":$("#odsjfx-edate").val(),"SJD":$("#sjfx-sjd-comboBox").find('input').val(),"QD":$("#odsjfx-quyu-comboBox").find('input').val()},30);
				dc.place(pageii.first(),'odsjfxTabels','after');
//				this.get();
			},
			del: function (obj) {},
			add:function () {},
			update: function (json) {},
			get: function () {},
			initToolBar:function(){
				addEventComboBox('#s2Panel');
//				if (odsjfxGrid) { odsjfxGrid = null; dojo.empty('cllxbTabel') }
//				odsjfxGrid = new CustomGrid({ totalCount: 0, pagination: null,columns: columns}, 'cllxbTabel');
				var _self = this;
				query('#odsjfxFind').on('click', function() {
					if($("#odsjfx-sdate").val().substr(0,7) != $("#odsjfx-edate").val().substr(0,7)){
						alert('不能跨年、跨月查询！');
						return;
					}
					loadindex = layer.load(1);
					if (odsjfxGrid) { odsjfxGrid.destroy(); }//dojo.destroy('zdbTabel');
	                dojo.create("div", {id:'odsjfxTabels', innerHTML:"" },'odsjfxTabel');
					odsjfxGrid = new CustomGrid({
						totalCount : 0,
						pagination:null,
						columns : columns
					}, "odsjfxTabels");
					$(".pagination").remove();
					pageii = new Pagination(odsjfxGrid,xhrArgsTabel,{"STIME":$("#odsjfx-sdate").val(),"ETIME":$("#odsjfx-edate").val(),"SJD":$("#sjfx-sjd-comboBox").find('input').val(),"QD":$("#odsjfx-quyu-comboBox").find('input').val()},30);
					dc.place(pageii.first(),'odsjfxTabels','after');
//					pageii.first();
				});
				query('#odsjfxDc').on('click', function() {
					var postData = {
							"STIME":$("#odsjfx-sdate").val(),
							"ETIME":$("#odsjfx-edate").val(),
							"SJD":$("#sjfx-sjd-comboBox").find('input').val(),
							"QD":$("#odsjfx-quyu-comboBox").find('input').val(),
							"page": '1',
							"pageSize": '1000000'
						};
						url = "form/yysjfxexcle?postData="
							+ encodeURI(encodeURI(JSON.stringify(postData))), window.open(url)
                });
			}
		})
	});