define([ "dijit/Dialog", "dgrid/Editor", "dijit/form/Button",
        "dijit/form/DateTextBox", "dijit/form/TimeTextBox",
        "dijit/form/SimpleTextarea", "dijit/form/Select",
        "dijit/form/FilteringSelect", "dgrid/OnDemandGrid",
        "dijit/form/TextBox", "app/Pagination1", "dgrid/Selection",
        "dgrid/Keyboard", "dgrid/extensions/ColumnResizer",'dgrid/Selector',
        "dojo/store/Memory","cbtree/model/TreeStoreModel",
        "dstore/Memory","dijit/form/NumberTextBox",
        "dgrid/extensions/DijitRegistry", "dijit/registry", "dojo/dom-style",
        "dojo/_base/declare", "dojo/dom-construct", "dojo/on","dijit/tree/ObjectStoreModel", "cbtree/Tree",
        "cbtree/models/ForestStoreModel", "dojo/data/ItemFileWriteStore", "dojo/query", "app/util" ],
    function(Dialog, Editor, Button, DateTextBox, TimeTextBox,
             SimpleTextarea, Select, FilteringSelect, Grid, TextBox,
             Pagination, Selection, Keyboard, ColumnResizer,Selector,
             Memory2,TreeStoreModel,
             Memory,NumberTextBox, DijitRegistry, registry, domStyle,
             declare, dc, on,ObjectStoreModel, Tree,
             ForestStoreModel, ItemFileWriteStore, query, util) {
        var CustomGrid = declare([DijitRegistry, Grid, Keyboard, Selection, ColumnResizer,Selector]);
        var zxGrid = null, zxldhmGrid = null, store = null;
        var tsmbdata=null,tsmbid=null,zxSelectId=null;
        var columns = {
//            dojoId: {label: '序号'},
        	checkbox: {label: '选择',selector: 'checkbox'},
            CS_ID: {label: '业务编号'},
            CS_TELNUM: {label: '来电号码'},
            CS_CLIENT: {label: '姓名'},
            CS_STATE: {label: '处理状态'},
            CS_DEALDATETIME: {label: '处理时间'},
            CS_TYPE: {label: '处理类型'},
            CS_TSLX: {label: '投诉类型'},
            CS_WORKERNUM: {label: '工号'},
            CS_VEHIID: {label: '车牌号码'},
            CS_MEMO: {label: '服务内容'},
            CS_OBJECT: {label: '处理对象'},
            COMPANY: {label: '公司名称'}
        };
        /*来电号码的选择*/
		var zxldhmColumns={
			CS_ID: {label: '客户ID',renderCell:function(item){
                var type = dc.create("div", {innerHTML: item.CS_ID, style:{'text-align':'center'}});
                return type;
            }},
            CS_CLIENT: {label: '客户姓名',renderCell:function(item){
                var type = dc.create("div", {innerHTML: item.CS_CLIENT, style:{'text-align':'center'}});
                return type;
            }},
            CS_TELNUM: {label: '客户电话',renderCell:function(item){
                var type = dc.create("div", {innerHTML: item.CS_TELNUM, style:{'text-align':'center'}});
                return type;
            }},
            CS_OBJECT: {label: '受理对象',renderCell:function(item){
                    var type = dc.create("div", {innerHTML: item.CS_OBJECT, style:{'text-align':'center'}});
                    return type;
                }},
            CS_VEHIID: {label: '车牌号码',renderCell:function(item){
                var type = dc.create("div", {innerHTML: item.CS_VEHIID, style:{'text-align':'center'}});
                return type;
            }},
            CS_TYPE: {label: '处理类型',renderCell:function(item){
                var type = dc.create("div", {innerHTML: item.CS_TYPE, style:{'text-align':'center'}});
                return type;
            }}
		};
        return declare( null,{
            constructor:function(){
                this.initToolBar();
                this.getTsmb();
                this.get();
            },
			getTsmb: function(){
            	dojo.xhrPost({
					url : basePath + "ddxpt/findTsmb",
					postData :{},
					handleAs : "json",
					Origin : self.location.origin,
					preventCache : true,
					withCredentials : true,
					load : function(data) {
						tsmbdata = data;
						$('#zx-tsmbBox').html('');
						for (var i = 0; i < data.length; i++) {
							$('#zx-tsmbBox').append('<a class="tsBtn" id="tsmb'+i+'" style="cursor: pointer;color: #0499ff;">'+(i+1)+':'+data[i].TYPE+':'+data[i].CONTENT+'</a><br/><br/>');
						}
						on(query('.tsBtn'), 'click', function () {
							tsmbid = tsmbdata[this.id.slice(4)].MBID;
							$('#zx-fwnr').val(tsmbdata[this.id.slice(4)].CONTENT);
							$('.tsBtn').css('color','#0499ff');
							$(this).css('color','red');
						})
					},
					error : function(error) {
						console.log(error);
					}
				});
			},
			addTsmb: function(){
            	var _self = this;
				tsmbDialogPanel.set('href', 'app/html/ddxpt/editor/tsmbEditor.html');
				tsmbDialog.show().then(function() {
					query('#tsmbtcbtn').on('click', function() {
						tsmbDialog.hide();
					});
					query('#tsmbtjbtn').on('click', function() {
						if($("#edit_mblx").val()==''){
							layer.msg("请选择模板类型！");
							return;
						}
						if($("#edit_mbnr").val()==''){
							layer.msg("请输入模板内容！");
							return;
						}
						dojo.xhrPost({
							url : basePath + "ddxpt/addTsmb",
							postData :"postData={'type':'"+$("#edit_mblx").val()+"','content':'"+$("#edit_mbnr").val()+"'}",
							handleAs : "json",
							Origin : self.location.origin,
							preventCache : true,
							withCredentials : true,
							load : function(data) {
								if(data.msg=='1'){
									tsmbDialog.hide();
									layer.msg("添加模板成功");
									_self.getTsmb();
								}else{
									layer.msg("添加模板失败");
								}

							},
							error : function(error) {
								console.log(error);
							}
						});
					});
				});
			},
			delTsmb: function(){
            	var _self= this;
            	if(tsmbid==null){
            		layer.msg('请点击选中要删除的模板！');
            		return;
				}
				layer.confirm('确定删除选中的模板？', {
					btn: ['确定', '取消'] //按钮
				}, function (index) {
					dojo.xhrPost({
						url: basePath + "ddxpt/delTsmb",
						postData: "tsmbid=" + tsmbid,
						handleAs: "json",
						Origin: self.location.origin,
						preventCache: true,
						withCredentials: true,
						load: function (data) {
							console.log(data);
							if(data.msg=='1'){
								tsmbid=null;
								layer.msg('删除模板成功！');
								_self.getTsmb();
							}else{
								layer.msg('删除模板失败！');
							}

						},
						error: function (error) {
							console.log(error);
						}
					});
				}, function (index) {
					layer.close(index);
				});
			},
            get:function(){
            	var postData={};
            	postData.stime=$("#cx-stime").val();
            	postData.etime=$("#cx-etime").val();
            	postData.sldx=$("#cx-sldx").val();
            	postData.cphm=$("#cx-zxcphm").val();
            	postData.dhhm=$("#cx-zxdhhm").val();
            	postData.clgh=$("#cx-zxclgh").val();
            	postData.fwnr=$("#cx-zxfwnr").val();
            	postData.clzt=$("#cx-clzt").val();
            	findallzx(postData).then(function(data){
//            		console.log(data);
                	store = new Memory({data: {identifier: 'CS_ID', label: 'CS_ID', items: data}});
                	// zxGrid.set('collection', store);
                	if (zxGrid) { zxGrid = null; dojo.empty('zxTabel');}
                	zxGrid = new CustomGrid({collection: store,selectionMode: 'none', allowSelectAll: true,totalCount: 0, pagination: null,columns: columns}, 'zxTabel');
					zxGrid.on('dgrid-select', function (event) {
						zxSelectId=zxGrid.selection;
					});
					zxGrid.on('dgrid-deselect', function (event) {
						zxSelectId=zxGrid.selection;
					});
            	});
            },
			clearText: function(){
            	$("#zx-ldhm").val('');
				$("#zx-sldx").val('');
				$("#zx-cllx").val('');
				$("#zx-khxm").val('');
				$("#zx-cphm").val('');
				$("#zx-ssgs").val('');
				$("#zx-fwnr").val('');
				$('#zx-cllxBox').css('display','inline-block');
				$('#zx-cllxBox2').css('display','none');
				$('#zx-tslxBox2').css('display','none');
				$('#zx-cllx').val('');
				$('#zx-cllx2').val('');
				$('#zx-tslx2').val('');
				$('#zx-clzt').val('');
			},
            initToolBar:function(){
                var _self = this;
                addEventComboBox('#zxPanel');
               //车牌号码
				setTimeout(function(){
				$("#cx-stime").val(setformat3(new Date())+' 00:00:00');
				$("#cx-etime").val(setformat3(new Date())+' 23:59:59');
					query('#cx-stime').on('focus', function () {
						WdatePicker({
							dateFmt: "yyyy-MM-dd HH:mm:ss"
						});
					});
					query('#cx-etime').on('focus', function () {
						WdatePicker({
							dateFmt: "yyyy-MM-dd HH:mm:ss"
						});
					});

				on(query('#zx-cphmglbtn'), 'click', function () {
					findddcphm($("#zx-cphm").val()).then(function(data2){
						$("#zx-cphmBox").find('.iFList').html("");
						for (var i = 0; i < data2.length; i++) {
							var cphms="<li data-value='"+data2[i].COMP_NAME+"'>"+data2[i].CPHM+"</li>";
							$("#zx-cphmBox").find('.iFList').append(cphms);
						}
						$('#zx-cphmBox').find('.iFList').on('click', function () {
							if (event.stopPropagation){event.stopPropagation();}else if (window.event) {window.event.cancelBubble = true;}
						}).find('li').off('click').on('click', function () {
							$(this).addClass('selected').siblings('.selected').removeClass('selected');
							$("#zx-cphmBox").find('input').data('value', $(this).data('value')).val($(this).text()).end().removeClass('selected');
							$("#zx-ssgs").val($(this).data('value'));
							
						});
					});
				});
				on(query('.zx-create'), 'click', function () {
					var postData={};
					postData.ldhm=$("#zx-ldhm").val();
					postData.sldx=$("#zx-sldx").val();
					if($("#zx-sldx").val()==''){
						layer.msg('受理对象不能为空！');
						return;
					}
					postData.cllx='';
					postData.tslx='';
					if($("#zx-sldx").val()=='出租集团'){
						postData.cllx = $("#zx-cllx2").val();

						if($("#zx-cllx2").val()==''){
							layer.msg('处理类型不能为空！');
							return;
						}
						postData.tslx = $("#zx-tslx2").val();
						if($("#zx-cllx2").val()=='投诉登记'){
							if($("#zx-tslx2").val()==''){
								layer.msg('投诉类型不能为空！');
								return;
							}
						}

					}else{
						postData.cllx = $("#zx-cllx").val();
						if($("#zx-cllx").val()==''){
							layer.msg('处理类型不能为空！');
							return;
						}
					}
					postData.clzt=$("#zx-clzt").val();
					if($("#zx-clzt").val()==''){
						layer.msg('处理状态不能为空！');
						return;
					}
					postData.khxm=$("#zx-khxm").val();
					postData.cphm=$("#zx-cphm").val();
					postData.ssgs=$("#zx-ssgs").val();
					postData.fwnr=$("#zx-fwnr").val();
					postData.clgh=username;
					// console.log(postData);
					createZX(postData).then(function(data){
                		if(data.msg=="1"){
                			layer.msg('生成成功！');
                			_self.get();
                			_self.clearText();
                		}else{
                			layer.msg('生成失败！');
                		}
                	});
				});
				on(query('.zx-clear'), 'click', function () {
					_self.clearText();

				});
				
				 /*来电号码的选择*/
                on(query('#zx-ldhmxz'), 'click', function () {
                    xddDialogPanel.set('href', 'app/html/ddxpt/compile/zx_ldxz.html');
                    xddDialog.set('title', '选择客户');
                    xddDialog.show().then(function() {

                        setTimeout(function() {
                            if (zxldhmGrid) { zxldhmGrid = null; dojo.empty('zxldhmTable');}
                            zxldhmGrid = new CustomGrid({ totalCount: 0, pagination: null, columns: zxldhmColumns}, "zxldhmTable");
//                            store = new Memory({data: {identifier: 'CI_ID', label: 'CI_ID', items: lsjlxz}});
//                            ldhmGrid.set('collection', store);
//                            $('.panel-conterBar').show();
                            findbyzxld($("#zx-ldhm").val()).then(function(data){
                            	console.log(data);
                            	store = new Memory({data: {identifier: 'CS_ID', label: 'CS_ID', items: data}});
                                zxldhmGrid.set('collection', store);
//                               $('.panel-conterBar').show();
                            	zxldhmGrid.on('.dgrid-row:dblclick', function(event) {
            						var row = zxldhmGrid.row(event);
            						// console.log(row.data);
            						$("#zx-sldx").val(row.data.CS_OBJECT);
            						$("#zx-cllx").val(row.data.CS_TYPE);
            						$("#zx-khxm").val(row.data.CS_CLIENT);
            						$("#zx-cphm").val(row.data.CS_VEHIID);
//            						$("#zx-ssgs").val(row.data.CS_OBJECT);
            						$("#zx-fwnr").val(row.data.CS_MEMO);
            	                	xddDialog.hide();
                                });
                            });
                        }, 100);
                    });
                });
				
                //查询按钮
                on(query('#zxQuery'), 'click', function () {
                	_self.get();
                });
                //导出按钮
                on(query('#zxDaochu'), 'click', function () {
                	// console.log('aaaaaa',zxSelectId);
                	var sz=[];
		        	for(var id in zxSelectId){
		        		if(zxSelectId[id]){
		        			sz.push(id);
		        		}
		        	}
		        	if(sz.length==0){
		        		layer.msg('没有选中要导出的数据！');
		        		return;
					}
		        	// console.log(sz);
                	var postData={};
                	postData.ids=sz.join(',');
                	// postData.cphm=$("#cx-zxcphm").val();
                	// postData.dhhm=$("#cx-zxdhhm").val();
                	// postData.clgh=$("#cx-zxclgh").val();
                	// postData.fwnr=$("#cx-zxfwnr").val();
                	url = basePath + "ddxpt/findallzx_daochu?postData="
             		+ encodeURI(encodeURI(JSON.stringify(postData))), window.open(url);
                	zxSelectId={};
                });
                //刷新按钮
				on(query('#zxSx'), 'click', function () {
					_self.get();
				});
				
				//修改按钮
				query('#zxUpd').on('click', function() {
					var xgids="",xgidlist=[];
    	        	dojo.forEach(zxGrid.collection.data, function(item,index) {
    					if (zxGrid.isSelected(item)) {
    						xgidlist.push(item.CS_ID);
    						xgids = item.CS_ID;
    					}
    				});
					if(xgidlist.length==0){
							layer.msg("请选择一条记录！");
						return;
					}
					if(xgidlist.length>1){
							layer.msg("只能选择一条记录！");
						return;
					}
					zxDialogPanel.set('href', 'app/html/editor/zxEditor.html');
					findonezx(xgids).then(function(data){
						console.log(data);
						zxDialog.show().then(function() {
							addEventComboBox("#zxeditpanal");
							$("#zxxg-ywbh").val(data.CS_ID);
							$("#zxxg-ldhm").val(data.CS_TELNUM);
							$("#zxxg-cldx").val(data.CS_OBJECT);
							// $("#zxxg-cllx").val(data.CS_TYPE);
							$("#zxxg-khxm").val(data.CS_CLIENT);
							$("#zxxg-cphm").val(data.CS_VEHIID);
							$("#zxxg-fwnr").val(data.CS_MEMO);
							$("#zxxg-comp").val(data.COMPANY);
							$("#zxxg-clzt").val(data.CS_STATE);
							if(data.CS_OBJECT=='出租集团'){
								$('#zxxg-cllx2').val(data.CS_TYPE);
								$('#zxxg-cllx').val('');
								$('#zxxg-cllx-box').css('display','none');
								$('#zxxg-cllx-box2').css('display','inline-block');
								if(data.CS_TYPE=='投诉登记'){
									$('#zxxg-tslx-label').css('display','inline-block');
									$('#zxxg-tslx-box2').css('display','inline-block');
									$('#zxxg-tslx2').val(data.CS_TSLX);
								}else{
									$('#zxxg-tslx-label').css('display','none');
									$('#zxxg-tslx-box2').css('display','none');
									$('#zxxg-tslx2').val('');
								}
							}else{
								$('#zxxg-cllx').val(data.CS_TYPE);
								$('#zxxg-cllx2').val('');
								$('#zxxg-cllx-box2').css('display','none');
								$('#zxxg-cllx-box').css('display','inline-block');
								$('#zxxg-tslx-label').css('display','none');
								$('#zxxg-tslx-box2').css('display','none');
								$('#zxxg-tslx2').val('');
							}

							zxDialog.set('title', '咨询修改');
							query('#zxxgtcbtn').on('click', function() {
								zxDialog.hide();
							});
							$('#zxxg-cldx').change(function(){
								if(this.value=='出租集团'){
									$('#zxxg-cllx-box').css('display','none');
									$('#zxxg-cllx-box2').css('display','inline-block');
									$('#zxxg-tslx-box2').css('display','none');
									$('#zxxg-tslx-label').css('display','none');
								}else{
									$('#zxxg-cllx-box2').css('display','none');
									$('#zxxg-cllx-box').css('display','inline-block');
									$('#zxxg-tslx-box2').css('display','none');
									$('#zxxg-tslx-label').css('display','none');
								}
								$('#zxxg-cllx2').val('');
								$('#zxxg-tslx2').val('');
							});
							$('#zxxg-cllx2').change(function(){
								if(this.value=='投诉登记'){
									$('#zxxg-tslx-label').css('display','inline-block');
									$('#zxxg-tslx-box2').css('display','inline-block');
								}else{
									$('#zxxg-tslx-label').css('display','none');
									$('#zxxg-tslx-box2').css('display','none');
								}
								$('#zxxg-tslx2').val('');
							});


							query('#zxxgtjbtn').on('click', function() {
								var ywbh = $("#zxxg-ywbh").val();
								var ldhm1 = $("#zxxg-ldhm").val();
								var cldx = $("#zxxg-cldx").val();
								var cllx = $("#zxxg-cllx").val();
								var tslx = '';
								if(cldx=='出租集团'){
									cllx = $("#zxxg-cllx2").val();
									if(cllx=='投诉登记'){
										tslx = $('#zxxg-tslx2').val();
									}
								}
								var khxm = $("#zxxg-khxm").val();
								var cphm = $("#zxxg-cphm").val();
								var fwnr = $("#zxxg-fwnr").val();
								var comp = $("#zxxg-comp").val();
								var clzt = $("#zxxg-clzt").val();
								dojo.xhrPost({
									url : basePath + "ddxpt/editzx",
									postData :"postData={'ywbh':'"+ywbh+"','ldhm':'"+ldhm1+"','cldx':'"+cldx+"','khxm':'"+khxm+"','cphm':'"+cphm+"','cllx':'"+cllx+"','fwnr':'"+fwnr+"','tslx':'"+tslx+"','comp':'"+comp+"','clzt':'"+clzt+"'}",
									handleAs : "json",
									Origin : self.location.origin,
									preventCache : true,
									withCredentials : true,
									load : function(data) {
										zxDialog.hide();
										layer.msg(data.msg);
										_self.get();
									},
									error : function(error) {
										console.log(error);
									}
								});
								
							});
						});
					});
				});
				//删除按钮
				on(query('#zxDel'), 'click', function () {
					layer.confirm('确定删除选中的咨询记录？', {
						  btn: ['确定','取消'] //按钮
						}, function(index){
                        	var zxids="";
            	        	dojo.forEach(zxGrid.collection.data, function(item,index) {
            					if (zxGrid.isSelected(item)) {
            						zxids+="'"+item.CS_ID+"',";
            					}
            				});
            	        	if(zxids==""){
            	        		layer.msg("没有选中的记录！");
            	        	}else{
            	        		delbyzxid(zxids).then(function(data){
            	        			if(data.msg=="1"){
        	                			layer.msg('删除成功！');
        	                			_self.get();
        	                		}else{
        	                			layer.msg('删除失败！');
        	                		}
            	        		});
            	        	}
					}, function(index){
						layer.close(index);
					});
				});

				//集团用户
				$('#zx-sldx').change(function(){
					if(this.value=='出租集团'){
						$('#zx-cllxBox').css('display','none');
						$('#zx-cllxBox2').css('display','inline-block');
						$('#zx-tslxBox2').css('display','none');
					}else{
						$('#zx-cllxBox').css('display','inline-block');
						$('#zx-cllxBox2').css('display','none');
						$('#zx-tslxBox2').css('display','none');
					}
					$('#zx-cllx').val('');
					$('#zx-cllx2').val('');
					$('#zx-tslx2').val('');
				});
				$('#zx-cllx2').change(function(){
					if(this.value=='投诉登记'){
						$('#zx-tslxBox2').css('display','inline-block');
					}else{
						$('#zx-tslxBox2').css('display','none');
					}
					$('#zx-tslx2').val('');
				});

				query('.zx-scmb').on('click', function () {
					_self.delTsmb();
				});
				query('.zx-tjmb').on('click', function () {
					_self.addTsmb();
				});
			},0);
            }
        })
    });