define([ "dijit/Dialog", "dgrid/Editor", "dijit/form/Button",
        "dijit/form/DateTextBox", "dijit/form/TimeTextBox",
        "dijit/form/SimpleTextarea", "dijit/form/Select",
        "dijit/form/FilteringSelect", "dgrid/OnDemandGrid",
        "dijit/form/TextBox", "app/Pagination1", "dgrid/Selection",
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
        var axczGrid = null, store = null;
        var fxkfsr={};
        var axcz_data;
        var groupvhic = [];
        var columns = {
    		checkbox: {label: '选择',selector: 'checkbox'},
			dojoId: {label: '序号'},
			TM_NAME: {label: '车辆组名'},
			C: {label: '组内车辆数'},
			VEHI_NO: {label: '组内车辆'}
        };
        var xhrArgsTabel = {
            url : basePath + "back/findaxcz",
            postData :{},
            handleAs : "json",
            Origin : self.location.origin,
            preventCache : true,
            withCredentials : true,
            load : function(data) {
                axcz_data = data;
                for (var i = 0; i < data.length; i++) {
                    data[i] = dojo.mixin({
                        dojoId : i + 1
                    }, data[i]);
                }
                store = new Memory({
                    data : {
                        identifier : 'dojoId',
                        label : 'dojoId',
                        items : data
                    }
                });
                if (axczGrid) { axczGrid.destroy(); }//dojo.destroy('zdbTabel');
                dojo.create("div", {id:'axczTabels', innerHTML:"" },'axczTabel')
                axczGrid = new CustomGrid({collection: store,selectionMode: 'none', allowSelectAll: true,totalCount: 0, pagination: null,columns: columns}, 'axczTabels');
                axczGrid.on('dgrid-select', function (event) {
					fxkfsr=axczGrid.selection;
				});
                axczGrid.on('dgrid-deselect', function (event) {
					fxkfsr=axczGrid.selection;
				});
            },
            error : function(error) {
                console.log(error);
            }
        };
        return declare( null,{
            constructor:function(){
                this.initToolBar();
                this.get();
            },
            del: function (obj) {},
            add:function () {},
            update: function (json) {},
            get: function () {
            	dojo.xhrPost(xhrArgsTabel);
            },
            initToolBar:function(){
            	var _self = this;
            	query('#axczAdd').on('click', function() {
                    axczDialogPanel.set('href', 'app/html/czchtgl/editor/axczEditor.html');
                    axczDialog.show().then(function () {
                    axczDialog.set('title', '新增车辆组');
                    groupvhic = [];
                    var xhrArgs2 = {
							url : basePath  + "back/findvhic",
							postData : {
								'cphm' : ''
							},
							handleAs : "json",
							Origin : self.location.origin,
							preventCache:true,
							withCredentials :  true,
							load : function(data) {
								$('#syclList').html("");
								for (var i = 0; i < data.length; i++) {
	                        		$('#syclList').append('<li date-name='+data[i].VEHI_NO+'>'+data[i].VEHI_NO+"</li>");
								}
	                        	$("#syclList li").click(function() {
	                                if ($(this).attr('selected')) {
	                                    $(this).removeAttr("selected");
	                                } else {
	                                    $(this).attr("selected", '');
	                                }
	                            });
							}
						}
						dojo.xhrPost(xhrArgs2);
                    $("#ywbh-cp").on('keyup',function(){
						var cpmhs = $("#ywbh-cp").val();
							var xhrArgs2 = {
									url : basePath  + "back/findvhic",
									postData : {
										'cphm' : cpmhs
									},
									handleAs : "json",
									Origin : self.location.origin,
									preventCache:true,
									withCredentials :  true,
									load : function(data) {
										$('#syclList').html("");
										for (var i = 0; i < data.length; i++) {
			                        		$('#syclList').append('<li date-name='+data[i].VEHI_NO+'>'+data[i].VEHI_NO+"</li>");
										}
			                        	$("#syclList li").click(function() {
			                                if ($(this).attr('selected')) {
			                                    $(this).removeAttr("selected");
			                                } else {
			                                    $(this).attr("selected", '');
			                                }
			                            });
									}
								}
							dojo.xhrPost(xhrArgs2);
	    				});
                    $('#ywbh-del').on('click', function () {
                        /* 移出按钮 */
                    	var fclxxcl = $('#fclxxcl li[selected]');
                        if(!fclxxcl.length){
                            return;
                        }
                        for(var i=0; i<fclxxcl.length; i++){
                    		$('#syclList').append('<li date-name='+$(fclxxcl[i]).text()+'>'+$(fclxxcl[i]).text()+"</li>");
                        }
                        fclxxcl.remove();
                        groupvhic = groupvhic.splice($.inArray($(fclxxcl[i]).text(),groupvhic))
                     });
                    $('#ywbh-add').on('click', function () {
                    	//console.log(2)
//                        /* 移入按钮 */
                        var syclList = $('#syclList li[selected]');
                        if(!syclList.length){
                            return;
                        }
                        for(var i=0; i<syclList.length; i++){
                        	if(groupvhic.indexOf($(syclList[i]).text())== -1){
                        		groupvhic.push($(syclList[i]).text());
                        		$('#fclxxcl').append('<li date-name='+$(syclList[i]).text()+'>'+$(syclList[i]).text()+"</li>");
                        	}
                        }
                        syclList.remove();
                        $("#fclxxcl li").click(function() {
                            if ($(this).attr('selected')) {
                                $(this).removeAttr("selected");
                            } else {
                                $(this).attr("selected", '');
                            }
                        });
                    });
                        query('.axcz-iFBtnCommit').on('click', function() {
                        	var FormJson = {};
                        	if($('#axcz_name').val()==''){
                        		dijit.byId('qd_dialog').show().then(function() {
        							$("#czjg").html('车辆组名称不能为空！');
        						});
        		        		return;
                        	}
                        	if($('#fclxxcl li').length == 0){
                        		dijit.byId('qd_dialog').show().then(function() {
        							$("#czjg").html('组内车辆不能为空！');
        						});
        		        		return;
                        	}
                        	var vhic = '';
                        	for(var i=0; i<$('#fclxxcl li').length; i++){
                        		vhic += $('#fclxxcl li')[i].innerText+",";
                        	}
                        	FormJson.NAME = $('#axcz_name').val();
                        	FormJson.VHIC = vhic;
                        	var datap = JSON.stringify(FormJson);
                        	var xhrArgs2 = {
									url : basePath  + "back/addaxcz",
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
											axczDialog.hide();
										})
									}
								}
								dojo.xhrPost(xhrArgs2);
                        });
                        query('.axcz-iFBtnClose').on('click', function() {
                        	axczDialog.hide();
                        });
                    });
                });

                query('#axczUpd').on('click', function() {
                	var sz=[];
		        	for(var id in fxkfsr){
		        		if(fxkfsr[id]){
		        			sz.push(id);
		        		}
		        	}
		        	if(sz.length==0){
		        		dijit.byId('qd_dialog').show().then(function() {
							$("#czjg").html('请选择一个区域后修改！');
						});
		        		return;
		        	}
		        	if(sz.length>1){
		        		dijit.byId('qd_dialog').show().then(function() {
							$("#czjg").html('每次只能修改一个区域！');
						});
		        		return;
		        	}
                    axczDialogPanel.set('href', 'app/html/czchtgl/editor/axczEditor.html');
                    axczDialog.show().then(function () {
                        axczDialog.set('title', '编辑车辆组');
                        $("#axcz_name").val(axcz_data[sz[0]-1].TM_NAME);
                        var vhic = axcz_data[sz[0]-1].VEHI_NO;
                        groupvhic = [];
                        var xhrArgs2 = {
    							url : basePath  + "back/findvhic",
    							postData : {
    								'cphm' : ''
    							},
    							handleAs : "json",
    							Origin : self.location.origin,
    							preventCache:true,
    							withCredentials :  true,
    							load : function(data) {
    								$('#syclList').html("");
    								for (var i = 0; i < data.length; i++) {
    	                        		$('#syclList').append('<li date-name='+data[i].VEHI_NO+'>'+data[i].VEHI_NO+"</li>");
    								}
    	                        	$("#syclList li").click(function() {
    	                                if ($(this).attr('selected')) {
    	                                    $(this).removeAttr("selected");
    	                                } else {
    	                                    $(this).attr("selected", '');
    	                                }
    	                            });
    							}
    						}
    						dojo.xhrPost(xhrArgs2);
                        $("#ywbh-cp").on('keyup',function(){
    						var cpmhs = $("#ywbh-cp").val();
    							var xhrArgs2 = {
    									url : basePath  + "back/findvhic",
    									postData : {
    										'cphm' : cpmhs
    									},
    									handleAs : "json",
    									Origin : self.location.origin,
    									preventCache:true,
    									withCredentials :  true,
    									load : function(data) {
    										$('#syclList').html("");
    										for (var i = 0; i < data.length; i++) {
    			                        		$('#syclList').append('<li date-name='+data[i].VEHI_NO+'>'+data[i].VEHI_NO+"</li>");
    										}
    			                        	$("#syclList li").click(function() {
    			                                if ($(this).attr('selected')) {
    			                                    $(this).removeAttr("selected");
    			                                } else {
    			                                    $(this).attr("selected", '');
    			                                }
    			                            });
    									}
    								}
    							dojo.xhrPost(xhrArgs2);
    	    				});
                        $('#ywbh-del').on('click', function () {
                            /* 移出按钮 */
                        	var fclxxcl = $('#fclxxcl li[selected]');
                            if(!fclxxcl.length){
                                return;
                            }
                            for(var i=0; i<fclxxcl.length; i++){
                        		$('#syclList').append('<li date-name='+$(fclxxcl[i]).text()+'>'+$(fclxxcl[i]).text()+"</li>");
                            }
                            fclxxcl.remove();
                            groupvhic = groupvhic.splice($.inArray($(fclxxcl[i]).text(),groupvhic))
                         });
                        $('#ywbh-add').on('click', function () {
                        	//console.log(2)
//                            /* 移入按钮 */
                            var syclList = $('#syclList li[selected]');
                            if(!syclList.length){
                                return;
                            }
                            for(var i=0; i<syclList.length; i++){
                            	if(groupvhic.indexOf($(syclList[i]).text())== -1){
                            		groupvhic.push($(syclList[i]).text());
                            		$('#fclxxcl').append('<li date-name='+$(syclList[i]).text()+'>'+$(syclList[i]).text()+"</li>");
                            	}
                            }
                            syclList.remove();
                            $("#fclxxcl li").click(function() {
                                if ($(this).attr('selected')) {
                                    $(this).removeAttr("selected");
                                } else {
                                    $(this).attr("selected", '');
                                }
                            });
                        });
                        for(var i=0; i<vhic.split(',').length; i++){
                        	groupvhic.push(vhic.split(',')[i]);
                    		$('#fclxxcl').append('<li date-name='+vhic.split(',')[i]+'>'+vhic.split(',')[i]+"</li>");
                        }
                        $("#fclxxcl li").click(function() {
                            if ($(this).attr('selected')) {
                                $(this).removeAttr("selected");
                            } else {
                                $(this).attr("selected", '');
                            }
                        });
                        query('.axcz-iFBtnCommit').on('click', function() {
                        	var FormJson = {};
                        	if($('#axcz_name').val()==''){
                        		dijit.byId('qd_dialog').show().then(function() {
        							$("#czjg").html('车辆组名称不能为空！');
        						});
        		        		return;
                        	}
                        	if($('#fclxxcl li').length == 0){
                        		dijit.byId('qd_dialog').show().then(function() {
        							$("#czjg").html('组内车辆不能为空！');
        						});
        		        		return;
                        	}
                        	var vhic = '';
                        	for(var i=0; i<$('#fclxxcl li').length; i++){
                        		vhic += $('#fclxxcl li')[i].innerText+",";
                        	}
                        	FormJson.NAME = $('#axcz_name').val();
                        	FormJson.VHIC = vhic;
                        	FormJson.ID = axcz_data[sz[0]-1].TM_ID;
                        	var datap = JSON.stringify(FormJson);
                        	var xhrArgs2 = {
									url : basePath  + "back/editaxcz",
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
											axczDialog.hide();
										})
									}
								}
								dojo.xhrPost(xhrArgs2);
                        });
                        query('.axcz-iFBtnClose').on('click', function() {
                        	axczDialog.hide();
                        });
                    });
                });
                query('#axczDel').on('click', function() {
                	var sz=[];
		        	for(var id in fxkfsr){
		        		if(fxkfsr[id]){
		        			sz.push(id);
		        		}
		        	}
		        	if(sz.length==0){
		        		dijit.byId('qd_dialog').show().then(function() {
							$("#czjg").html('请至少选择一个区域后删除！');
						});
		        		return;
		        	}
		        	var zzid = [];
		        	//console.log(axcz_data,sz)
		        	for(var i=0; i<sz.length; i++){
		        		zzid.push(axcz_data[sz[i]-1].TM_ID);
		        	}
		        	var idstr=zzid.join(',');
		        	//console.log(idstr)
		        	layer.confirm('确定要删除该条记录吗?', function(index){
		        		var xhrArgs2 = {
								url : basePath  + "back/delaxcz",
								postData : {
									"id" : idstr
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
                query('#axczDc').on('click', function() {
						url = "back/axcz_daochu", window.open(url)
                });
            }
        });
    });