/**
 * Created by dywed on 2017/7/3.
 */
define([ "dijit/Dialog", "dgrid/Editor", "dijit/form/Button",
		"dijit/form/DateTextBox", "dijit/form/TimeTextBox",
		"dijit/form/SimpleTextarea", "dijit/form/Select",
		"dijit/form/FilteringSelect", "dgrid/OnDemandGrid",
		"dijit/form/TextBox", "app/Pagination", "dgrid/Selection",
		"dgrid/Keyboard", "dgrid/extensions/ColumnResizer",
		"dojo/store/Memory","cbtree/model/TreeStoreModel",
		"app/createAsyncStore", "dstore/Memory","dijit/form/NumberTextBox",
		"dgrid/extensions/DijitRegistry", "dijit/registry", "dojo/dom-style",
		"dojo/_base/declare", "dojo/dom-construct", "dojo/on","dijit/tree/ObjectStoreModel", "cbtree/Tree",
		"cbtree/models/ForestStoreModel", "dojo/data/ItemFileWriteStore", "app/util" ],
	function(Dialog, Editor, Button, DateTextBox, TimeTextBox,
			 SimpleTextarea, Select, FilteringSelect, Grid, TextBox,
			 Pagination, Selection, Keyboard, ColumnResizer,
			 Memory2,TreeStoreModel,
			 createAsyncStore, Memory,NumberTextBox, DijitRegistry, registry, domStyle,
			 declare, dc, on,ObjectStoreModel, Tree,
			 ForestStoreModel, ItemFileWriteStore, util) {
		var CustomGrid = declare([DijitRegistry, Grid, Keyboard, Selection, ColumnResizer]);
		var ddcxGrid = null, store = null;
		var xhrArgsTabel,xhrArgsTabelDel,xhrArgsGuishudi,xhrArgsTabelUpdate;
		var formatBJ_STATUS11 = function formatBJ_STATUS(d) {
            if (d == '0') {
                return "待支付";
            } else if (d == '1') {
                return "已支付";
            } else if (d == '2') {
                return "取消订单";
            }
        }
		var columns = [
			{field:'dojoId',label : "序号"},
			{field:'DDBH_ID',label : "订单编号"},
            {field:'FROMSTATUS',label:"订单状态"
            ,formatter:formatBJ_STATUS11},
			{field:'T_ADDTIME', label: "订单创建日期"
			,formatter:util.formatYYYYMMDD},
			{field:'C_SETOUTCITY', label: "出发城市"},
            {field:'C_INTENTCITY', label: "目的地城市"},
			{field:'PRICE_ALL', label: "订单合计金额"},
			{field:'T_TOURDATE', label: "出团日期"}
		];
		xhrArgsTabel = {
			url: basePath + "order/queryorder",
			postData: '',
			handleAs: "json",
			Origin: self.location.origin,
			preventCache: true,
			withCredentials: true,
			load: function (data) {
                var data = data.data;
                console.info(data);
				for (var i = 0; i < data.length; i++) {
					data[i] = dojo.mixin({dojoId: i + 1}, data[i]);
				}
				store = new Memory({data: {identifier: 'dojoId', label: 'dojoId', items: data}});
				ddcxGrid.set('collection', store);
			},
			error : function(error) {}
		};
        xhrArgsGuishudi= {
            url: basePath + "attribution/findattribution",
            postData: 'postData={"guishudi":""}',
            handleAs: "json",
            Origin: self.location.origin,
            preventCache: true,
            withCredentials: true,
            load: function (data) {
                console.info(data);
                $("#ddcx-cfddQb").html("<option value=''>--全部--</option>");
                for(var i=0; i<data.length; i++){
                    $("#ddcx-cfddQb").append("<option value='"+data[i].CITY+"'>"+data[i].CITY+"</option>");
                    // console.info(data[i].ID);
                }
            },
            error : function(error) {}
        };
        xhrArgsTabelUpdate = {
            url: basePath + "person/updateinfo",
            postData: 'postData={}',
            handleAs: "json",
            Origin: self.location.origin,
            preventCache: true,
            withCredentials: true,
            error : function(error) {}
        };
		return declare( null,{
			constructor:function(){
				this.initToolBar();
				this.get();
			},
			del: function () {
                var _self = this;
                xhrArgsTabelDel.postData = 'postData=' + JSON.stringify(obj);
                xhrArgsTabelDel.load = function() {
                    ddcx_dialog.hide();
                    _self.get();
                };
                dojo.xhrPost(xhrArgsTabelDel);
			},
			add:function(json){},
			update:function(json){
                var _self = this;
                xhrArgsTabelUpdate.postData = 'postData=' + JSON.stringify(json);
                xhrArgsTabelUpdate.load = function(data) {
                    console.log(data.info);
                    if (data.info === '修改成功') {
                        // ddcx_detail.hide();
                        _self.get();
                    }
                };
                dojo.xhrPost(xhrArgsTabelUpdate);
            },
			get:function(){
				this.getTable();
				dojo.xhrPost(xhrArgsGuishudi);
			},
            getTable: function() {
                var ddzt = $('#ddcx-ddztQb').val();
                console.info($('#ddcx-ddksrqQb'))
                xhrArgsTabel.postData = 'postData=' + JSON.stringify({
                        ordertype: ddzt,
                        order_id: $('#ddcx-ddbhQb').val(),
                        starttime: $('#ddcx-ddksrqQb').val(),
                        endtime: $('#ddcx-ddjsrqQb').val(),
                        startaddress: $('#ddcx-cfcs').val(),
                        endaddress: $('#ddcx-mddCs').val(),
                        address:$('#ddcx-cfddQb').val(),
                        info: $('#ddcx-khtelQb').val()
                    });
                console.info('12:', xhrArgsTabel.postData);
                dojo.xhrPost(xhrArgsTabel);
			},
			initToolBar:function(){
				var _self = this;
				if (ddcxGrid) { ddcxGrid = null; dojo.empty('ddcxTabel')}
                columns.push({
                    field: 'caozuo', label: "操作",
                    renderCell: function (item) {
                        var div = dc.create("div", {}),
                            style = {marginLeft: '.5em', marginRight: '.5em'};
                        var btnDetail = dc.create("a", {class: 'btn btn-ms', title: '明细', innerHTML: '明细', style: style, onclick: function () {
                            // 明细
                            ddcx_detail.show().then(function() {
                                ddcx_detail.set('title', '详细信息');
								console.info(item);
								$('#ddcx_gkname').html(item.CUSTOMERNAME);
                                $('#ddcx_gktel').html(item.CUSTOMERTEL);
                                var add = util.format(item.T_ADDTIME);
                                $('#ddcx_cjsj').html(add);
                                var content = item.INTRO;
                                if(content===null){
                                    $('#ddcx_ddbz').html('');
                                }else{
                                    $('#ddcx_ddbz').html(content);
                                }
                                $('#ddcx_fcxx').html(item.TRAFFIC_02);
                                $('#ddcx_qcxx').html(item.TRAFFIC_01);
                                $('#ddcx_hjje').html(item.PRICE_ALL);
                                $('#ddcx_ddzt').html(item.FROMSTATUS);
                                $('#ddcx_lrrs').html(item.AMOUNT_04);
                                $('#ddcx_etbzc').html(item.AMOUNT_03);
                                $('#ddcx_etrs').html(item.AMOUNT_02);
                                $('#ddcx_crrs').html(item.AMOUNT_01);
                                $('#ddcx_ddbh').html(item.DDBH_ID);
                                $('#ddcx_ctrq').html(item.T_TOURDATE);
                                $('#ddcx_fcrq').html(item.T_RETURNDATE);
                                $('#ddcx_cfcs').html(item.C_SETOUTCITY);
                                $('#ddcx_mddcs').html(item.C_INTENTCITY);
                                $('#ddcx_lyts').html(item.TOURDAYS);
                                $('#ddcx_stry').html(item.CORPS_MAN);
                                $('#ddcx_stbz').html(item.CORPS_TAG);
                                $('#ddcx_jtry').html(item.MEET_MAN);
                                $('#ddcx_jtbz').html(item.MEET_TAG);
                                $('#ddcx_jhdd').html(item.MUSTER_ADDR);
                                $('#ddcx_ddbgje').html(item.PRICE_JIA);
                                console.info(item.Travelers);
                                var html = '';
                                var cxr = item.Travelers;
                                for(var i = 0;i<cxr.length;i++){
                                    var sex;
                                    if(cxr[i].SEX== 0){sex = '男'}else{sex = '女'}
                                    html +=
                                    '<tr><th>姓名</th><td>'+
                                    '<input type="text" value="'+cxr[i].INFO_NAME+'" id="ddcx_name_'+cxr[i].ID+'"></td><th>年龄</th>'+
                                    '<td>'+cxr[i].AGE+'</td><th>性别</th>'+
                                    '<td>'+sex+'</td><td rowspan="2"><button class="btn" id="ddcx_update" data-id="'+cxr[i].ID+'">修改</button></td></tr><tr><th>身份证</th>'+
                                    '<td><input type="text" value="'+cxr[i].CARD+'" id="ddcx_sfz" maxlength="18"></td><th>手机号</th>'+
                                    '<td>'+cxr[i].PHONE+'</td><th>生日</th>'+
                                    '<td>'+new Date(cxr[i].BIRTHDAY).format('yyyy-MM-dd')+'</td></tr>';
                                }
                                $('#ddcx_cxr').html(html);
                                xhrArgsTabelUpdate.postData = 'postData=' + JSON.stringify({id: item.ID});
                                dojo.xhrPost(xhrArgsTabelUpdate);
                                $('#ddcx_update').on('click',function () {
                                    event.preventDefault();
                                    console.info($(this).data('id'));
                                    var name = $('#ddcx_name_'+$(this).data('id')).val();
                                    var card = $('#ddcx_sfz').val();
                                    var nameReg = /^[\u4E00-\u9FA5]{1,5}(?:·[\u4E00-\u9FA5]{1,5})*$/;
                                    var cardReg = /^\d{18}$/;
                                    if(!nameReg.test(name)){
                                        alert('请输入有效的姓名！');
                                        return false;
                                    }
                                    else if(!cardReg.test(card)){
                                        alert('请输入正确的身份证！');
                                        return false;
                                    }
                                    else{
                                        alert('修改成功！')
                                    }
                                    var json={
                                        id:$(this).data('id'),
                                        info_name:$('#ddcx_name_'+$(this).data('id')).val(),
                                        card:$('#ddcx_sfz').val()
                                    }
                                    _self.update(json);
                                });
                            });
                        }});
                        var btnDelete = dc.create("a", {class: 'btn btn-ms', title: '取消', innerHTML: '取消', style: style, onclick: function () {
                            if (confirm('是否取消订单')) {
                                console.log('delete:', item.DDBH_ID);
                                var xhrDelete = {
                                    url: basePath + "order/cancel",
                                    handleAs: "json",
                                    preventCache: true,
                                    withCredentials: true,
                                    load: function (data) {
                                        console.info(data);
                                        if (data >0) {
                                            alert('订单取消成功！');
                                            _self.get();
                                        }else{
                                            alert('订单取消失败！')
                                        }
                                    }
                                };
                                xhrDelete.postData = 'postData=' + JSON.stringify({ddbh_id: item.DDBH_ID});
                                dojo.xhrPost(xhrDelete);
                            }
                        }});
                        dc.place(btnDetail, div);
                        dc.place(btnDelete, div);
                        return div;
                    }

                });
                /*columns.push({
                    field : 'CAOZUO',
                    label : "操作",
                    renderCell: function(item){
                        var tmdiv = dc.create("div", {})
                        dc.place(dc.create("img", {
                            src: "resources/images/del.png",
                            onclick: function () {
                                console.info(item.ID);
                                if(confirm("是否删除该订单信息？")) {
                                    console.log('delete:', item.ID);
                                    var xhrDelete = {
                                        url: basePath + "         ",
                                        handleAs: "json",
                                        preventCache: true,
                                        withCredentials: true,
                                        load: function (data) {
                                            console.info(data);
                                            if (data.info === '删除成功') {
                                                _self.get();
                                            }
                                        }
                                    };
                                    xhrArgsTabelDel.postData = 'postData=' + JSON.stringify({user_id: item.ID});
                                    dojo.xhrPost(xhrArgsTabelDel);
                                }
                            }
                        }), tmdiv);
                        return tmdiv;
                    }
                });*/
				if (ddcxGrid) { ddcxGrid = null; dojo.empty('ddcxTabel') }
				$('#ddcx-ddksrqQb').val(getPrevDay1(new Date()).format("yyyy-MM-dd hh"));
				$('#ddcx-ddjsrqQb').val(new Date().format("yyyy-MM-dd hh"));
				ddcxGrid = new CustomGrid({ totalCount: 0, pagination: null, columns: columns,allowTextSelection: true}, "ddcxTabel");
				$('#ddcx_btnQuery').on('click', function() {
					event.preventDefault();
					_self.getTable();
				});
			}
		})
	});