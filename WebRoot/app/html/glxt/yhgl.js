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
		var xhrArgsTabelQuery,xhrArgsTabelAdd,xhrArgsTabelUpdate,xhrArgsTabelDel,xhrArgspower,xhrArgspowerID;
		var columns = [
			{field:'dojoId',label : "序号"},
            {field:'TEL', label: "用户名"},
			{field:'XM', label: "姓名"},
			{field:'SFZ', label: "身份证号"}
		];
		xhrArgsTabelQuery = {
			url: basePath + "user/queryuser",
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
			url: basePath + "user/adduser",
        	postData: 'postData={}',
            handleAs: "json",
            Origin: self.location.origin,
            preventCache: true,
            withCredentials: true,
        	error : function(error) {}
    	};
        xhrArgsTabelUpdate = {
            url: basePath + "user/edituser",
            postData: 'postData={}',
            handleAs: "json",
            Origin: self.location.origin,
            preventCache: true,
            withCredentials: true,
            error : function(error) {}
        };
        xhrArgsTabelDel = {
            url: basePath + "user/deluser",
            postData: 'postData={}',
            handleAs: "json",
            Origin: self.location.origin,
            preventCache: true,
            withCredentials: true,
            error : function(error) {}
        };
        xhrArgspower= {
            url: basePath + "power/querypower",
            postData: 'postData={"power":""}',
            handleAs: "json",
            Origin: self.location.origin,
            preventCache: true,
            withCredentials: true,
            load: function (data) {
                console.info(data);
                $("#yhgl_gwm").html("<option value=' '>--全部--</option>");
                for(var i=0; i<data.length; i++){
                    $("#yhgl_gwm").append("<option value='"+data[i].ID+"'>"+data[i].POWERNAME+"</option>");
                    // console.info(data[i].ID);
                }
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
                    yhgl_dialog.hide();
                    _self.get();
                };
                dojo.xhrPost(xhrArgsTabelDel);
			},
			add:function(){
			    var _self = this;
			    var ad = $("input:radio[name='yhgl_isAdmin']").val();
                xhrArgsTabelAdd.postData = 'postData=' + JSON.stringify({
                        user_name: $('#yhgl_username').val(),
                        pass_word: $('#yhgl_passeord').val(),
                        name: $('#yhgl_name').val(),
                        card: $('#yhgl_card').val(),
                        power_id:$('#yhgl_gwm').val(),
                        is_admin:'1'
                    });
                xhrArgsTabelAdd.load = function(data) {
                    console.info(data);
                    $('input.err').removeClass('err');
                    if (data.info === '添加成功') {
                        yhgl_dialog.hide();
                        _self.get();
                    }
                    else if(data.info === '电话号码已经存在！'){
                        $('#yhgl_username').addClass('err');
                    }
                    else if(data.info === '身份证号码已经存在！'){
                        $('#yhgl_card').addClass('err');
                    }
                    else if(data.info === '电话号码和身份证号码都已经存在！'){
                        $('#yhgl_username').addClass('err');
                        $('#yhgl_card').addClass('err');
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
                        yhgl_dialog.hide();
                        _self.get();
                    }
                };
                dojo.xhrPost(xhrArgsTabelUpdate);
			},
			get:function(){
				xhrArgsTabelQuery.postData = 'postData=' + JSON.stringify({});
                console.info('12:',xhrArgsTabelQuery.postData);
                dojo.xhrPost(xhrArgsTabelQuery);
			},
            query:function () {
                xhrArgsTabelQuery.postData = 'postData=' + JSON.stringify({
                        phone:$('#yhgl_phone').val(),
                        city:$('#yhgl_city').val(),
                        card:$('#yhgl_sfz').val()
                    });
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
                                    console.info(item.POWERNAME);
                                    yhgl_dialog.show().then(function () {
                                        yhgl_dialog.set('title', '修改用户')
                                        $("#yhglIsAdmin").val(item.IS_ADMIN);
                                        $("#yhgl_username").val(item.TEL);
                                        $("#yhgl_passeord").val(item.MM);
                                        $("#yhgl_name").val(item.XM);
                                        $("#yhgl_card").val(item.SFZ);
                                        $("#user_id").val(item.ID);
                                        $("#yhgl_gwm").val(item.POWERNAME);
                                        var radios = $('input:radio[name=yhgl_isAdmin]');
//                                        if (item.IS_ADMIN === '1') {
//                                            //不是管理员
//                                            radios[1].click();
//                                            radios.attr('disabled', true)
//                                        } else {
//                                            radios.removeAttr('disabled')
//                                            radios[0].click();
//                                        }
                                        setTimeout(function () {
                                            $('#yhgl_gwm').find('option[value='+item.POWERID+']').attr('selected', true)
                                        }, 80);
                                        dojo.xhrPost(xhrArgspower);
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
                                    if(confirm("是否删除该用户信息？")) {
                                        console.log('delete:', item.ID);
                                        var xhrDelete = {
                                            url: basePath + "user/deluser",
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
                                        xhrDelete.postData = 'postData=' + JSON.stringify({user_id: item.ID});
                                        dojo.xhrPost(xhrDelete);
                                    }
                                }
                            }), tmdiv);
                            return tmdiv;
                        }
                    });
				if (userGrid) { userGrid = null; dojo.empty('yhglTabel') }
				userGrid = new CustomGrid({ totalCount: 0, pagination: null, columns: columns,allowTextSelection: true}, "yhglTabel");
                $('#yhgl_btnQuery').on('click',function () {
                   event.preventDefault();
                   _self.query();
                });
                $('#yhgl_btnAdd').on('click', function() {
                    event.preventDefault();
                    yhgl_dialog.show().then(function () {
                        yhgl_dialog.set('title', '添加用户');
                        $('#yhglIsAdmin').val('');
                        $('#yhgl_username').val('');
                        $('#yhgl_passeord').val('');
                        $('#yhgl_name').val('');
                        $('#yhgl_card').val('');
                        $('#yhgl_powerID').val('');
                        $('#yhgl_gwm').find('option[value= ]').attr('selected', true);
                        var radios = $('input:radio[name=yhgl_isAdmin]');
                        radios[1].click();
//                        radios.attr('disabled', true);
                        // $("#yhgl_powerID").parent().show();
                        dojo.xhrPost(xhrArgspower);
                    });
                    // _self.add();
                });
                $('#yhgl_confirm').on('click',function () {
                    event.preventDefault();
                    if (inputFlag) {return false}
                    var card = $('#yhgl_card').val();
                    var inputs = [{
                        name: 'user_name',
                        value: $('#yhgl_username').val()
                    },{
                        name: 'pwd',
                        value: $('#yhgl_passeord').val()
                    },{
                        name: 'card',
                        value: card
                    },{
                        name: 'name',
                        value: $('#yhgl_name').val()
                    }];
                    var birth = card.substr(6,8);
                    birth = birth.replace(/(.{4})(.{2})/,"$1-$2-");
                    $('#yhltj_cfd').val(birth);
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
                    if($('#yhgl_gwm').val()===' '){
                        alert('请选择权限！');
                        return false;
                    }
                    if (yhgl_dialog.get('title') === '添加用户') {
                            _self.add();

                    } else{
                        var json = {};
                        if($('#yhglIsAdmin').val() === '0' ){
                            var ad = $("input:radio:selected[name='yhgl_isAdmin']").val();
                            json = {
                                user_name: $('#yhgl_username').val(),
                                pass_word: $('#yhgl_passeord').val(),
                                name: $('#yhgl_name').val(),
                                card: $('#yhgl_card').val(),
                                user_id: $('#user_id').val(),
                                power_id: $('#yhgl_gwm').val(),
                                is_admin: (ad === 1 ? '0' : '1')
                            }
                        } else {
                            json = {
                                user_name: $('#yhgl_username').val(),
                                pass_word: $('#yhgl_passeord').val(),
                                name: $('#yhgl_name').val(),
                                card: $('#yhgl_card').val(),
                                user_id: $('#user_id').val(),
                                power_id: $('#yhgl_gwm').val(),
                                is_admin: '1'
                            }
                        }
                            _self.update(json);
                    }

                });
                $('#yhgl_del').on('click',function () {
                    event.preventDefault();
                    yhgl_dialog.hide();
                });
                /*$('#yhgl_confirmD').on('click',function () {
                    event.preventDefault();
                    yhgl_delete.hide();
                    _self.del();
                });
                $('#yhgl_delD').on('click',function () {
                    event.preventDefault();
                    yhgl_delete.hide();
                });*/
			}
		})
	});