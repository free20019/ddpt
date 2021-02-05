/**
 * Created by dywed on 2017/7/1.
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
        var userGrid = null, store = null;
        var xhrArgsTabelQuery,xhrArgsTabelAdd,xhrArgsTabelUpdate,xhrArgsTabelDel,xhrArgsGuishudi,xhrArgspower,xhrArgspowerID;
        var columns = [
            {field:'dojoId',label : "序号"},
            {field:'CUSTOMIZATION', label: "定制类型"
            	,formatter:util.formatBJ_DZLX},
            {field:'CUSTOMERNAME', label: "下单顾客姓名"},
            {field:'CUSTOMERTEL', label: "下单顾客手机号"},
            {field:'P_CONSUMPTION', label: "人均消费"},
            {field:'C_SETOUTCITY', label: "出发城市"},
            {field:'C_INTENTCITY', label: "目的城市"},
            {field:'TOURDAYS', label: "旅游天数"},
            {field:'T_TOURDATE', label: "出发日期"},
            {field:'AMOUNT_02', label: "儿童人数"},
            {field:'AMOUNT_01', label: "成人人数"},
        ];
        xhrArgsTabelQuery = {
            url: basePath + "made/findmade",
            postData: 'postData={}',
            handleAs: "json",
            Origin: self.location.origin,
            preventCache: true,
            withCredentials: true,
            load: function (data) {
                // console.info('111111111111',data);
                for (var i = 0; i < data.length; i++) {
                    data[i] = dojo.mixin({dojoId: i + 1}, data[i]);
                }
                store = new Memory({data: {identifier: 'dojoId', label: 'dojoId', items: data}});
                userGrid.set('collection', store);
            },
            error : function(error) {}
        };
        xhrArgsTabelAdd = {
            url: basePath + "made/addmade",
            postData: 'postData={}',
            handleAs: "json",
            Origin: self.location.origin,
            preventCache: true,
            withCredentials: true,
            error : function(error) {}
        };
        xhrArgsTabelUpdate = {
            url: basePath + "made/updatemade",
            postData: 'postData={}',
            handleAs: "json",
            Origin: self.location.origin,
            preventCache: true,
            withCredentials: true,
            error : function(error) {}
        };
        xhrArgsTabelDel = {
            url: basePath + "made/delmade",
            postData: 'postData={}',
            handleAs: "json",
            Origin: self.location.origin,
            preventCache: true,
            withCredentials: true,
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
                $("#dzgl_gsd").html("<option value=''>--全部--</option>");
                for(var i=0; i<data.length; i++){
                    $("#dzgl_gsd").append("<option value='"+data[i].CITY+"'>"+data[i].CITY+"</option>");
                }
            },
            error : function(error) {}
        };
        return declare( null,{
            constructor:function(){
                this.initToolBar();
                this.get();
            },
            del: function (obj) {
                var _self = this;
                xhrArgsTabelDel.postData = 'postData=' + JSON.stringify({
                    id: $('#dzglIsAdmin').val()
                });
                xhrArgsTabelDel.load = function(data) {
                    if (data.info === '删除成功') {
//                        _self.get()
                        xhrArgsTabelQuery.postData = 'postData=' + JSON.stringify({});
                        dojo.xhrPost(xhrArgsTabelQuery);
                    }
                };
                dojo.xhrPost(xhrArgsTabelDel);
            },
            add:function(){
                var _self = this;
                xhrArgsTabelAdd.postData = 'postData=' + JSON.stringify({
                        CUSTOMIZATION:$("#dzgl_dzlx").val(),
                        C_SETOUTCITY:$('#dzgl_cfcs').val(),
                        C_INTENTCITY:$('#dzgl_mdcs').val(),
                        T_TOURDATE:$('#dzgl_cfrq').val(),
                        TOURDAYS:$('#dzgl_lyts').val(),
                        AMOUNT_02:$('#dzgl_etrs').val(),
                        AMOUNT_01:$('#dzgl_crrs').val(),
                        P_CONSUMPTION:$('#dzgl_rjxf').val(),
                        CUSTOMERNAME:$('#dzgl_xdgkxm').val(),
                        CUSTOMERTEL:$('#dzgl_xdgksjh').val()
                       // ID:$('#dzglIsAdmin').val()
                    });
                xhrArgsTabelAdd.load = function(data) {
                    if (data.info === '添加成功') {
                        dzgl_dialog.hide();
                        _self.get();
                    }
                };
                dojo.xhrPost(xhrArgsTabelAdd);
            },
            update:function(json){
                var _self = this;
                console.log('postData=' + JSON.stringify(json))
                xhrArgsTabelUpdate.postData = 'postData=' + JSON.stringify(json);
                xhrArgsTabelUpdate.load = function(data) {
                    // console.log(data.info);
                    if (data.info === '修改成功') {
                        dzgl_dialog.hide();
                        _self.get();
                    }
                };
                dojo.xhrPost(xhrArgsTabelUpdate);
            },
            get:function(){
                xhrArgsTabelQuery.postData = 'postData=' + JSON.stringify({});
                dojo.xhrPost(xhrArgsTabelQuery);
                dojo.xhrPost(xhrArgsGuishudi);
            },

            query:function(){
                xhrArgsTabelQuery.postData = 'postData=' + JSON.stringify({
                        customization:$('#dzgl_ddxsQb').val(),
                        c_setoutcity:$('#dzgl_cfd').val(),
                        t_tourdate:$('#dzgl_cfsj').val(),
                        address:$('#dzgl_gsd').val(),
                    });
                dojo.xhrPost(xhrArgsTabelQuery);
            },
            initToolBar:function(){
                var _self = this;
                columns.push({
                    field : 'CAOZUO',
                    label : "操作",
                    renderCell: function(item){
                        var div = dc.create("div", {}),
                            style = {marginLeft: '.5em', marginRight: '.5em'};
                        var btnUpdate=dc.create("img", {
                            src: "resources/images/edit.png",
                            onclick: function () {
                                // console.info('edit:', item)
                                dzgl_dialog.show().then(function () {
                                    dzgl_dialog.set('title', '修改定制信息')
                                    $('#dzgl_dzlx').val(item.CUSTOMIZATION);
                                    $('#dzgl_cfcs').val(item.C_SETOUTCITY);
                                    $('#dzgl_mdcs').val(item.C_INTENTCITY);
                                    $('#dzgl_cfrq').val(item.T_TOURDATE);
                                    $('#dzgl_lyts').val(item.TOURDAYS);
                                    $('#dzgl_etrs').val(item.AMOUNT_02);
                                    $('#dzgl_crrs').val(item.AMOUNT_01);
                                    $('#dzgl_rjxf').val(item.P_CONSUMPTION);
                                    $('#dzgl_xdgkxm').val(item.CUSTOMERNAME);
                                    $('#dzgl_xdgksjh').val(item.CUSTOMERTEL);
                                    $('#dzglIsAdmin').val(item.ID);
                                });
                            },
                        });

                        var btnDelete=dc.create("img", {
                            src: "resources/images/del.png",
                            style: {
                                "margin-left": "10px"
                            },
                            onclick: function () {
                                if(confirm("是否删除该用户信息？")) {
                                    _self.del({
                                        id: item.ID
                                    })
                                }
                            }
                        });
                        dc.place(btnUpdate, div);
                        dc.place(btnDelete, div);
                        return div;
                    }
                });
                if (userGrid) { userGrid = null; dojo.empty('dzglTabel') }
                userGrid = new CustomGrid({ totalCount: 0, pagination: null, columns: columns,allowTextSelection: true}, "dzglTabel");
                $('#dzgl_btnQuery').on('click',function () {
                    event.preventDefault();
                    _self.query();
                });

                $('#dzgl_btnAdd').on('click', function() {
                    event.preventDefault();
                    dzgl_dialog.show().then(function () {
                        dzgl_dialog.set('title', '添加定制信息');
                        $('#dzgl_dzlx').val(0);
                        $('#dzgl_cfcs').val('');
                        $('#dzgl_mdcs').val('');
                        $('#dzgl_cfrq').val('');
                        $('#dzgl_lyts').val('');
                        $('#dzgl_etrs').val('');
                        $('#dzgl_crrs').val('');
                        $('#dzgl_rjxf').val('');
                        $('#dzgl_xdgkxm').val('');
                        $('#dzgl_xdgksjh').val('');
                        $('#dzglIsAdmin').val('');
                    });
                });

                $('#dzgl_confirm').on('click',function () {
                    event.preventDefault();
                    var tel = $('#dzgl_xdgksjh').val();
                    var name = $('#dzgl_xdgkxm').val();
                    var type=$('#dzgl_dzlx').val();
                    var cfcs=$('#dzgl_cfcs').val();
                    var mdcs=$('#dzgl_mdcs').val();

                    var telReg = /^\d{11}$/;
                    var nameReg = /^[\u4E00-\u9FA5]{2,5}(?:·[\u4E00-\u9FA5]{1,5})*$/;
                    var typeReg=/^[01]$/;
                    var numReg=/^[0-9]*$/;


console.info(type)
                    if(!typeReg.test(type)){
                        alert('请选择定制形式！');
                        return false;
                    }else if(!nameReg.test(cfcs)){
                        alert('请输入有效的出发城市！');
                        return false;
                    }else if(!nameReg.test(mdcs)){
                        alert('请输入有效的目的城市！');
                        return false;
                    }else if(!nameReg.test(name)){
                        alert('请输入下单顾客的姓名！');
                        return false;
                    }else if(!telReg.test(tel)){
                        alert('请输入下单顾客的手机号码！');
                        return false;
                    }
                    if (dzgl_dialog.get('title') === '添加定制信息') {
                        var type=$('#dzgl_dzlx').val();
                        var cfcs=$('#dzgl_cfcs').val();
                        var mdcs=$('#dzgl_mdcs').val();
                        var cfrq=$('#dzgl_cfrq').val();
                        var lyts=$('#dzgl_lyts').val();
                        var etrs=$('#dzgl_etrs').val();
                        var crrs=$('#dzgl_crrs').val();
                        var rjxf=$('#dzgl_rjxf').val();
                        var xm=$('#dzgl_xdgkxm').val();
                        var sj=$('#dzgl_xdgksjh').val();
                        _self.add({
                            customername:xm,
                            customertel:sj,
                            p_consumption:rjxf,
                            c_setoutcity:cfcs,
                            c_intentcity:mdcs,
                            tourdays:lyts,
                            T_TOURDATE:cfrq,
                            amount_02:etrs,
                            amount_01:crrs
                        });

                    } else{
                        var type=$('#dzgl_dzlx').val();
                        var cfcs=$('#dzgl_cfcs').val();
                        var mdcs=$('#dzgl_mdcs').val();
                        var cfrq=$('#dzgl_cfrq').val();
                        var lyts=$('#dzgl_lyts').val();
                        var etrs=$('#dzgl_etrs').val();
                        var crrs=$('#dzgl_crrs').val();
                        var rjxf=$('#dzgl_rjxf').val();
                        var xm=$('#dzgl_xdgkxm').val();
                        var sj=$('#dzgl_xdgksjh').val();
                        var id=$('#dzglIsAdmin').val()
                        _self.update({
                            customername:xm,
                            customertel:sj,
                            p_consumption:rjxf,
                            c_setoutcity:cfcs,
                            c_intentcity:mdcs,
                            t_tourdate:cfrq,
                            tourdays:lyts,
                            amount_02:etrs,
                            amount_01:crrs,
                            id:id
                        });
                    }
                });

                $('#dzgl_xx').on('click',function () {
                    dzgl_dialog.hide();
                });
            }
        })
    });