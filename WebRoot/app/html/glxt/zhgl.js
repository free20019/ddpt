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
        var inputFlag = false;
        var xhrArgsTabelQuery,xhrArgsTabelAdd,xhrArgsTabelUpdate,xhrArgsTabelDel,xhrArgsGuishudi;
        var columns = [
            {field:'dojoId',label : "序号"},
            {field:'COMPANY', label: "旅行社"},
            {field:'CITY', label: "归属地"},
            {field:'FZR', label: "负责人"},
            {field:'JLTLE', label: "经理电话"},
            {field:'KFTEL', label: "客服电话"},
            {field:'CZ', label: "传真号码"},
            {field:'ZFB', label: "支付宝账号"},
            {field:'SKRNAME', label: "收款人姓名"}
        ];
        xhrArgsTabelQuery = {
            url: basePath + "custom/querycustom",
            postData: 'postData={}',
            handleAs: "json",
            Origin: self.location.origin,
            preventCache: true,
            withCredentials: true,
            load: function (data) {
                console.info(data);
                for (var i = 0; i < data.length; i++) {
                    data[i] = dojo.mixin({dojoId: i + 1}, data[i]);
                }
                store = new Memory({data: {identifier: 'dojoId', label: 'dojoId', items: data}});
                userGrid.set('collection', store);
            },
            error : function(error) {}
        };
        xhrArgsTabelAdd = {
            url: basePath + "custom/addcustom",
            postData: 'postData={}',
            handleAs: "json",
            Origin: self.location.origin,
            preventCache: true,
            withCredentials: true,
            error : function(error) {}
        };
        xhrArgsTabelUpdate = {
            url: basePath + "custom/updatecustom",
            postData: 'postData={}',
            handleAs: "json",
            Origin: self.location.origin,
            preventCache: true,
            withCredentials: true,
            error : function(error) {}
        };
        xhrArgsTabelDel = {
            url: basePath + "custom/delcustom",
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
                $("#zhgl_gsd").html("<option value=''>--全部--</option>");
                for(var i=0; i<data.length; i++){
                    $("#zhgl_gsd").append("<option value='"+data[i].CITY+"'>"+data[i].CITY+"</option>");
                }
                /*$("#zhgl_city").html("<option value=' '>--请选择归属地--</option>");
                for(var i=0; i<data.length; i++){
                    $("#zhgl_city").append("<option value='"+data[i].CITY+"'>"+data[i].CITY+"</option>");
                }*/
            },
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
                    zhgl_dialog.hide();
                    _self.get();
                };
                dojo.xhrPost(xhrArgsTabelDel);
            },
            add:function(){
                var _self = this;
                xhrArgsTabelAdd.postData = 'postData=' + JSON.stringify({
                        company: $('#zhgl_company').val(),
                        city: $('#zhgl_city').val(),
                        fzr: $('#zhgl_fzr').val(),
                        jltle: $('#zhgl_jltel').val(),
                        kftel:$('#zhgl_kftel').val(),
                        cz:$('#zhgl_cz').val(),
                        zfb:$('#zhgl_zfb').val(),
                        skrname:$('#zhgl_skrname').val()
                    });
                xhrArgsTabelAdd.load = function(data) {
                    console.info(data);
                    $('input.err').removeClass('err');
                    if (data.info === '添加成功') {
                        zhgl_dialog.hide();
                        _self.get();
                    }
                };
                dojo.xhrPost(xhrArgsTabelAdd);
            },
            update:function(json){
                var _self = this;
                xhrArgsTabelUpdate.postData = 'postData=' + JSON.stringify(json);
                xhrArgsTabelUpdate.load = function(data) {
                    console.log(data.info);
                    if (data.info === '修改成功') {
                        zhgl_dialog.hide();
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
                xhrArgsTabelQuery.postData = 'postData=' + JSON.stringify({
                        company:$('#zhgl_companyname').val(),
                        city:$('#zhgl_gsd').val()
                    });
                console.info('12:', xhrArgsTabelQuery.postData);
                dojo.xhrPost(xhrArgsTabelQuery);
            },
            inputReg: function () {
                inputFlag = true;
                setTimeout(function () {
                    inputFlag = false;
                }, 100);
            },
            initToolBar:function(){
                var _self = this;
                columns.push({
                    field : 'CAOZUO',
                    label : "操作",
                    renderCell: function(item){
                        var tmdiv = dc.create("div", {})
                        dc.place(dc.create("img", {
                            src: "resources/images/edit.png",
                            onclick: function () {
                                console.info('edit:', item);
                                zhgl_dialog.show().then(function () {
                                    zhgl_dialog.set('title', '修改用户')
                                    $("#zhgl_company").val(item.COMPANY);
                                    $("#zhgl_fzr").val(item.FZR);
                                    $("#zhgl_jltel").val(item.JLTLE);
                                    $("#zhgl_kftel").val(item.KFTEL);
                                    $("#zhgl_cz").val(item.CZ);
                                    $("#zhgl_zfb").val(item.ZFB);
                                    $("#zhgl_skrname").val(item.SKRNAME);
                                    $("#zhgl_id").val(item.ID);
                                    $("#zhgl_city").val(item.CITY);
                                    /*setTimeout(function () {
                                        $('#zhgl_city').find('option[value='+item.CITY+']').attr('selected', true)
                                    }, 80);
                                    dojo.xhrPost(xhrArgsGuishudi);*/
                                });
                            },
                            style: {
                                "margin-right": "10px"
                            }
                        }), tmdiv);
                        dc.place(dc.create("img", {
                            src: "resources/images/del.png",
                            onclick: function () {
                                console.info(item.ID);
                                if(confirm("是否删除该条信息？")) {
                                    console.log('delete:', item.ID);
                                    var xhrDelete = {
                                        url: basePath + "custom/delcustom",
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
                                    xhrDelete.postData = 'postData=' + JSON.stringify({id: item.ID});
                                    dojo.xhrPost(xhrDelete);
                                }
                            }
                        }), tmdiv);
                        return tmdiv;
                    }
                });
                if (userGrid) { userGrid = null; dojo.empty('zhglTabel') }
                userGrid = new CustomGrid({ totalCount: 0, pagination: null, columns: columns,allowTextSelection: true}, "zhglTabel");
                $('#zhgl_btnQuery').on('click',function () {
                    event.preventDefault();
                    _self.get();
                });
                $('#zhgl_btnAdd').on('click', function() {
                    event.preventDefault();
                    zhgl_dialog.show().then(function () {
                        zhgl_dialog.set('title', '添加用户');
                        $('#zhgl_company').val(''),
                        $('#zhgl_city').val(''),
                        $('#zhgl_fzr').val(''),
                        $('#zhgl_jltel').val(''),
                        $('#zhgl_kftel').val(''),
                        $('#zhgl_cz').val(''),
                        $('#zhgl_zfb').val(''),
                        $('#zhgl_skrname').val('')
                        // dojo.xhrPost(xhrArgspower);
                    });
                });
                $('#zhgl_confirm').on('click',function () {
                    event.preventDefault();

                    if($('#zhgl_city').val()===' '){
                        alert('请选择归属地！');
                        return false;
                    }
                    if (zhgl_dialog.get('title') === '添加用户') {
                        _self.add();
                    } else{
                        var json = {
                            company: $('#zhgl_company').val(),
                            city: $('#zhgl_city').val(),
                            fzr: $('#zhgl_fzr').val(),
                            jltle: $('#zhgl_jltel').val(),
                            kftel:$('#zhgl_kftel').val(),
                            cz:$('#zhgl_cz').val(),
                            zfb:$('#zhgl_zfb').val(),
                            skrname:$('#zhgl_skrname').val(),
                            id:$('#zhgl_id').val()
                        };
                        _self.update(json);
                    }

                });
                $('#zhgl_del').on('click',function () {
                    event.preventDefault();
                    zhgl_dialog.hide();
                });
            }
        })
    });