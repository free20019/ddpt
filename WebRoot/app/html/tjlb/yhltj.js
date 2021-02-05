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
		var djltjGrid = null, store = null;
		var xhrArgsTabelQuery,xhrArgsTabelAdd,xhrArgsTabelUpdate,xhrArgsTabelDel,xhrArgsGuishudi;
		var edit_id;
		var inputFlag = false;
        var columns = [
            {field:'dojoId',label : "序号"},
            {field:'TEL',label : "用户名"},
            {field:'XM',label : "姓名"},
            {field:'SFZ', label: "身份证号"},
            {field:'SR', label: "生日"},
            {field:'CITY', label: "归属地"},
        ];
        xhrArgsTabelQuery = {
			url: basePath + "person/queryperson",
			postData: 'postData={}',
			handleAs: "json",
			Origin: self.location.origin,
			preventCache: true,
			withCredentials: true,
			load: function (data) {
			    var data = data.data;
			    console.log(data)
				for (var i = 0; i < data.length; i++) {
					data[i] = dojo.mixin({dojoId: i + 1}, data[i]);
				}
				store = new Memory({data: {identifier: 'dojoId', label: 'dojoId', items: data}});
				djltjGrid.set('collection', store);
				$('#yhltjsum').html(data.totalLength);
			},
			error : function(error) {}
		};
        xhrArgsTabelAdd = {
            url: basePath + "person/addperson",
            postData: 'postData={}',
            handleAs: "json",
            Origin: self.location.origin,
            preventCache: true,
            withCredentials: true,
            error : function(error) {}
        };
        xhrArgsTabelUpdate = {
            url: basePath + "person/updateperson",
            postData: 'postData={}',
            handleAs: "json",
            Origin: self.location.origin,
            preventCache: true,
            withCredentials: true,
            error : function(error) {}
        };
        xhrArgsTabelDel = {
            url: basePath + "person/delperson",
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
                $("#yhltj-gsdQb").html("<option value=' '>--全部--</option>");
                for(var i=0; i<data.length; i++){
                    $("#yhltj-gsdQb").append("<option value='"+data[i].CITY+"'>"+data[i].CITY+"</option>");
                }
                $("#yhltj-gsddQb").html("<option value=' '>--全部--</option>");
                for(var i=0; i<data.length; i++){
                    $("#yhltj-gsddQb").append("<option value='"+data[i].CITY+"'>"+data[i].CITY+"</option>");
                }
            },
            error : function(error) {}
        };
		return declare( null, {
            constructor: function () {
                this.initToolBar();
                this.get();
            },
            del: function () {
                var _self = this;
                xhrArgsTabelDel.postData = 'postData=' + JSON.stringify(obj);
                xhrArgsTabelDel.load = function() {
                    yhltj_dialog.hide();
                    _self.get();
                };
                dojo.xhrPost(xhrArgsTabelDel);
            },
            add: function () {
                var _self = this;
                xhrArgsTabelAdd.postData = 'postData=' + JSON.stringify({
                        name: $('#yhltj_username').val(),
                        password: $('#yhltj_password').val(),
                        card: $('#yhltj_card').val(),
                        phone: $('#yhltj_tel').val(),
                        sr: $('#yhltj_cfd').val(),
                        address:$('#yhltj-gsddQb').val(),
                    });
                xhrArgsTabelAdd.load = function (data) {
                    console.info(data);
                    $('input.err').removeClass('err');
                    if (data.info === '添加成功') {
                        yhltj_dialog.hide();
                        xhrArgsTabelQuery.postData = 'postData=' + JSON.stringify({});
                        dojo.xhrPost(xhrArgsTabelQuery);
                    }
                    else if(data.info === '电话号已存在'){
                        $('#yhltj_tel').addClass('err');
                    }
                    else if(data.info === '身份证号已存在'){
                        $('#yhltj_card').addClass('err');
                    }
                    else if(data.info === '电话号和身份证都已存在'){
                        $('#yhltj_tel').addClass('err');
                        $('#yhltj_card').addClass('err');
                    }
                };
                dojo.xhrPost(xhrArgsTabelAdd);
            },
            update: function (json) {
                var _self = this;
                xhrArgsTabelUpdate.postData = 'postData=' + JSON.stringify({
                    name: $('#yhltj_username').val(),
                    password: $('#yhltj_password').val(),
                    card: $('#yhltj_card').val(),
                    phone: $('#yhltj_tel').val(),
                    sr: $('#yhltj_cfd').val(),
                    address:$('#yhltj-gsddQb').val(),
                    id:edit_id
                });
                xhrArgsTabelUpdate.load = function(data) {
                    console.log(data.info);
                    if (data.info === '修改成功') {
                        yhltj_dialog.hide();
                        xhrArgsTabelQuery.postData = 'postData=' + JSON.stringify({});
                        dojo.xhrPost(xhrArgsTabelQuery);
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
                        name:$('#yhltj-yhxm').val(),
                        phone:$('#yhltj-telQb').val(),
                        address:$('#yhltj-gsdQb').val()
                    });
                dojo.xhrPost(xhrArgsTabelQuery);
            },
            query: function () {
                xhrArgsTabelQuery.postData = 'postData=' + JSON.stringify({
                        name:$('#yhltj-yhxm').val(),
                        phone:$('#yhltj-telQb').val(),
                        address:$('#yhltj-gsdQb').val()
                    });
                dojo.xhrPost(xhrArgsTabelQuery);
            },
            inputReg: function () {
                inputFlag = true;
                setTimeout(function () {
                    inputFlag = false;
                }, 100);
            },
            initToolBar: function () {
                var _self = this;
                columns.push({
                    field: 'CAOZUO',
                    label: "操作",
                    renderCell: function (item) {
                        var tmdiv = dc.create("div", {});
                        dc.place(dc.create("img", {
                            src: "resources/images/edit.png",
                            onclick: function () {
                                console.info('edit:', item);
                                yhltj_dialog.show().then(function () {
                                    yhltj_dialog.set('title', '修改用户');
                                    edit_id = item.ID;
                                    $("#yhltj_username").val(item.XM);
                                    $("#yhltj_password").val(item.MM);
                                    $("#yhltj_card").val(item.SFZ);
                                    $("#yhltj_tel").val(item.TEL);
                                    $("#yhltj_cfd").val(item.SR);
                                    setTimeout(function () {
                                        $('#yhltj-gsddQb').find('option[value='+item.CITY+']').attr('selected', true)
                                    }, 80);
                                    dojo.xhrPost(xhrArgsGuishudi);
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
                                if (confirm("是否删除该用户信息？")) {
                                    console.log('delete:', item.ID);
                                    var xhrDelete = {
                                        url: basePath + "person/delperson",
                                        handleAs: "json",
                                        preventCache: true,
                                        withCredentials: true,
                                        load: function (data) {
                                            console.info(data);
                                            if (data.info === '删除成功') {
                                            	xhrArgsTabelQuery.postData = 'postData=' + JSON.stringify({});
                                                dojo.xhrPost(xhrArgsTabelQuery);
                                            }
                                        }
                                    };
                                    xhrDelete.postData = 'postData=' + JSON.stringify({ID: item.ID});
                                    dojo.xhrPost(xhrDelete);
                                }
                            }
                        }), tmdiv);
                        return tmdiv;
                    }
                });
                if (djltjGrid) {
                    djltjGrid = null;
                    dojo.empty('yhltjTabel')
                }
                djltjGrid = new CustomGrid({totalCount: 0, pagination: null, columns: columns}, "yhltjTabel");
                $('#yhltj_btnQuery').on('click',function () {
                    event.preventDefault();
                    _self.query();
                });
                $('#yhltj-btnAdd').on('click', function() {
                    event.preventDefault();
                    yhltj_dialog.show().then(function () {
                        yhltj_dialog.set('title', '添加用户');
                        $('#yhltj_username').val('');
                        $('#yhltj_passeord').val(null);
                        $('#yhltj_card').val('');
                        $('#yhltj_tel').val('');
                        $('#yhltj_age').val('');
                        // $('#yhltj_sex').val('');
                        $('#yhltj_bith').val('');
                        $('#yhltj_gsddQb').find('option[value= ]').attr('selected', true);
                        // var radios = $('input:radio[name=yhltj_sex]');
                        // radios.attr('disabled', true);
                        dojo.xhrPost(xhrArgsGuishudi);
                    });
                });
                $('#yhltj_cfd').focus(function () {
                    var card = $('#yhltj_card').val();
                    var birth = card.substr(6,8);
                    birth = birth.replace(/(.{4})(.{2})/,"$1-$2-");
                    $('#yhltj_cfd').val(birth);
                });
                $('#yhltj_confirm').on('click',function () {
                    event.preventDefault();
                    if (inputFlag) {return false}
                    var card = $('#yhltj_card').val();
                    var inputs = [{
                        name: 'tel',
                        value: $('#yhltj_tel').val()
                    },{
                        name: 'pwd',
                        value: $('#yhltj_password').val()
                    },{
                        name: 'card',
                        value: card
                    },{
                        name: 'name',
                        value: $('#yhltj_username').val()
                    }];
                    var birth = card.substr(6,8);
                    birth = birth.replace(/(.{4})(.{2})/,"$1-$2-");
                    $('#yhltj_cfd').val(birth);
                    // var thisYear = (new Date()).substr(0,4);
                    // var age=card.substr(6,4);
                    // age=(thisYear-age);
                    // $('#yhltj_age').val(age);
                    for (var i=0;i<inputs.length;i++){
                        if(inputs[i].name==='sex'){
                            if(inputs[i].value<0||inputs[i].value>1){
                                alert('请选择性别');
                                _self.inputReg();
                                return false;
                            }
                            continue;
                        }
                        var json = util.regular[inputs[i].name](inputs[i].value);
                        if (!json.type) {
                            alert(json.msg);
                            _self.inputReg();
                            return false;
                        }
                    }
                    if($('#yhltj-gsddQb').val()===' '){
                        alert('请选择归属地！');
                        return false;
                    }
                    if (yhltj_dialog.get('title') === '添加用户') {
                        _self.add();
                    } else{
                            var json = {
                                name: $('#yhltj_username').val(),
                                password: $('#yhltj_passeord').val(),
                                card: $('#yhltj_card').val(),
                                phone: $('#yhltj_tel').val(),
                                sr: $('#yhltj_birth').val(),
                                address:$('#yhltj-gsddQb').val()
                            };
                        _self.update(json);
                    }

                });
                $('#yhltj_del').on('click',function () {
                    event.preventDefault();
                    yhltj_dialog.hide();
                });
            }
        });
	});