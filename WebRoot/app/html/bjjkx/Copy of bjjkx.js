define([ "dijit/Dialog", "dgrid/Editor", "dijit/form/Button",
		"dijit/form/DateTextBox", "dijit/form/TimeTextBox",
		"dijit/form/SimpleTextarea", "dijit/form/Select",
		"dijit/form/FilteringSelect", "dgrid/OnDemandGrid",
		"dijit/form/TextBox", "app/Pagination1", "dgrid/Selection",'dgrid/Selector',
		"dgrid/Keyboard", "dgrid/extensions/ColumnResizer",
		"dojo/store/Memory","cbtree/model/TreeStoreModel",
		"dstore/Memory","dijit/form/NumberTextBox",
		"dgrid/extensions/DijitRegistry", "dijit/registry", "dojo/dom-style",
		"dojo/_base/declare", "dojo/dom-construct", "dojo/on","dijit/tree/ObjectStoreModel", "cbtree/Tree",
		"cbtree/models/ForestStoreModel", "dojo/data/ItemFileWriteStore", "dojo/query", "app/util" ],
	function(Dialog, Editor, Button, DateTextBox, TimeTextBox,
			 SimpleTextarea, Select, FilteringSelect, Grid, TextBox,
			 Pagination, Selection,Selector, Keyboard, ColumnResizer,
			 Memory2,TreeStoreModel,
			 Memory,NumberTextBox, DijitRegistry, registry, domStyle,
			 declare, dc, on,ObjectStoreModel, Tree,
			 ForestStoreModel, ItemFileWriteStore, query, util) {
		var CustomGrid = declare([DijitRegistry, Grid, Keyboard, Selection, ColumnResizer,Selector]);
		var zzddGrid = null, store = null;
		map=null,ruler=null,mouseTool=null,settime=null,cluster=null;
		var fjclmarker=[];
		var qylist=[],qytextlist=[];
		var monmks = [];
		var vehilist= null,l2=l3=l4=l5=l6=l7=null;
		var cljkmarker=null;
		var zxmarker=null;
		var settime=null;
		var columns = {
			checkbox: {label: '选择',selector: 'checkbox'},
			AD_ID: {label: '处理编号'},
			AD_CAR_NO: {label: '车牌号码'},
			AD_ALERTTYPE: {label: '报警类型'},
			AD_RESULT:{label: '处警结果'},
			AD_DBTIME: {label: '报警时间',formatter:util.formatYYYYMMDDHHMISS}
		};

		return declare( null,{
			constructor:function(){
				this.initToolBar();
				this.qyquery();
				this.queryad();
			},
			queryad : function(){
				var postData={};
				postData.cp = $("#bjcl_cphm").val();
				postData.ts = $("#bjcl_ts").val();
				findbjclitem(postData).then(function(data){
					zzddGrid.set('collection', new Memory({data: {identifier: 'AD_ID', label: 'AD_ID', items: data}}));
				});
			},
			closeInfoWindow:function(){
				map.clearInfoWindow();
			},
			findone:function(obj){
				dwjkcl(obj).then(function(data){
		    		if(!data.PX){
		    			layer.msg("当前无定位数据！");
		    			return;
		    		}
		    		var icon = gettb(data,2); 
		    		cljkmarker = new AMap.Marker({
		                position: [data.PX, data.PY],
		                offset : new AMap.Pixel(-18,-18),
		                icon:icon,
		                map : map
		            });
		    		map.setCenter(cljkmarker.getPosition());
		    		
		    		//信息窗口
		    		var title = '车牌号码：<span style="font-size:11px;color:#278ac4;">'+data.VEHI_NO+'</span>',
		            content = [];
			        content.push("经度："+data.PX+" 纬度："+data.PY);
			        content.push("时间："+data.STIME);
			        content.push("速度："+data.SPEED+"   方向："+dlwz(data.ANGLE)+"  状态："+kzc(data.STATE));
			        content.push("Sim卡号："+data.VEHI_SIM);
			        content.push("终端类型："+data.MT_NAME);
			        content.push(" 车型："+data.VT_NAME);
			        content.push("车主电话："+data.OWN_TEL);
			        content.push("公司："+data.COMP_NAME);
			        content.push("区块："+data.OWNER_NAME);
			        content.push("车主姓名："+data.OWN_NAME);
			        content.push("<hr/>&nbsp;&nbsp;<a href='javascript:void(0)' class='xxfs'>信息发送</a>"+"&nbsp;&nbsp;<a href='javascript:void(0)' class='jfcx'>积分查询</a>"+"&nbsp;&nbsp;<a href='javascript:void(0)' class='scxs'>删除显示</a>");
			        var infoWindow = new AMap.InfoWindow({
			            isCustom: true,  //使用自定义窗体
			            content: bjcreateInfoWindow(title, content.join("<br/>")),
			            offset: new AMap.Pixel(15, -23)
			        });
			        //积分查询窗口
			        var title1 = '<span style="font-size:11px;color:#278ac4;">'+data.VEHI_NO+'</span>',
			        content1 = [];
			        content1.push("调度总数："+data.DISP_NUM);
			        content1.push("投诉总数："+data.COMPL_NUM);
			        content1.push("积分总数："+data.INTEGRAL);
			        var infoWindow1 = new AMap.InfoWindow({
			            isCustom: true,  //使用自定义窗体
			            content: bjcreateInfoWindow(title1, content1.join("<br/>")),
			            offset: new AMap.Pixel(15, -23)
			        });
			        cljkmarker.infoWindow1=infoWindow1;
			        cljkmarker.infoWindow = infoWindow;
			        var clxxdata={};
			        clxxdata.vehino=data.VEHI_NO;
			        clxxdata.mdtno = data.MDT_NO;
			        cljkmarker.clxx = clxxdata;
			        bjjkxjsobj.ckfsxx(cljkmarker);
			        AMap.event.addListener(cljkmarker, 'click', function() {
			        	bjjkxjsobj.ckfsxx(cljkmarker);
			        });
		    	});
			},
			ckfsxx: function (obj) {//弹出发给车辆终端
				var cljk_self=obj;
				var json = cljk_self.clxx;
				obj.infoWindow.open(map, obj.getPosition());
				map.setCenter(obj.getPosition());
	            setTimeout(function(){
	            	//积分查询
	            	$(".jfcx").click(function(){
	            		cljk_self.infoWindow1.open(map, cljk_self.getPosition());
	            	});
	            	$(".scxs").click(function(){
	            		map.remove(cljk_self);
	            		map.remove(cljk_self.infoWindow1);
	            		map.remove(cljk_self.infoWindow);
	            		cljkmarker=null;
	            	});
	            	$(".xxfs").click(function(){
	            		bjxxfsDialogPanel.set('href', 'app/html/ddxpt/editor/ywbhEditor.html');
	                    $('#bjxxfsDialogPanel').removeAttr('style');
	                    bjxxfsDialog.show().then(function () {
	                    	var xxdzjson=[],xxdzcarsjson=[];
	                        bjxxfsDialog.set('title', '消息定制');
	                        $("#ywbhEditor-zdhm").prop("checked",true);
	                        
	                        $("#fclxxcl").append('<li date-name="'+json.mdtno+'">'+json.vehino+'</li>');
	                        var first={};
	                        first.zd= json.mdtno;
	                        first.cp = json.vehino;
	                        xxdzjson.push(first);
	                        xxdzcarsjson.push(json.vehino);
	                        //查找车牌
	                        $("#ywbh-car-comboBox").find('input').on('keyup',function(){
        						var cpmhs=$("#ywbh-car-comboBox").find('input').val();
        						if(cpmhs.length>2){
        							findddcphm(cpmhs).then(function(data2){
        								$('#syclList').html("");
        								for (var i = 0; i < data2.length; i++) {
        	                        		$('#syclList').append('<li date-name='+data2[i].MDT_NO+'>'+data2[i].CPHM+"</li>");
        								}
        	                        	$("#syclList li").click(function() {
        	                                if ($(this).attr('selected')) {
        	                                    $(this).removeAttr("selected");
        	                                } else {
        	                                    $(this).attr("selected", '');
        	                                }
        	                            });
        							});
        						}
        						if(cpmhs==""){
    	                        	$('#syclList').html("");
    	                        	for (var i = 0; i < vehilist.length; i++) {
    	                        		$('#syclList').append('<li date-name='+vehilist[i].mdtno+'>'+vehilist[i].vehino+"</li>");
    								}
    	                        	$("#syclList li").click(function() {
    	                                if ($(this).attr('selected')) {
    	                                    $(this).removeAttr("selected");
    	                                } else {
    	                                    $(this).attr("selected", '');
    	                                }
    	                            });
        						}
        						
	        				});
	                        //查找车队
	                        findcd().then(function(data2){
	                        	$("#ywbh-cd-comboBox").find('.iFList').html("");
								for (var i = 0; i < data2.length; i++) {
									var cphms="<li data-value='"+data2[i].TM_ID+"'>"+data2[i].TM_NAME+"</li>";
									$("#ywbh-cd-comboBox").find('.iFList').append(cphms);
								}
								$('#ywbh-cd-comboBox').find('.iFList').on('click', function () {
									if (event.stopPropagation){event.stopPropagation();}else if (window.event) {window.event.cancelBubble = true;}
								}).find('li').off('click').on('click', function () {
									$(this).addClass('selected').siblings('.selected').removeClass('selected');
									$("#ywbh-cd-comboBox").find('input').data('value', $(this).data('value')).val($(this).text()).end().removeClass('selected');
								});
	                        });
	                        
	                        	$('#syclList').html("");
	                        	for (var i = 0; i < vehilist.length; i++) {
	                        		$('#syclList').append('<li date-name='+vehilist[i].mdtno+'>'+vehilist[i].vehino+"</li>");
								}
	                        	$("#syclList li").click(function() {
	                                if ($(this).attr('selected')) {
	                                    $(this).removeAttr("selected");
	                                } else {
	                                    $(this).attr("selected", '');
	                                }
	                            });
	                        //-------------------------------箭头按钮
	                        $('#ywbh-delall').on('click', function () {
	                        	xxdzjson.splice(0,xxdzjson.length);
	                        	xxdzcarsjson.splice(0,xxdzcarsjson.length);
	                            $('#fclxxcl li').remove();
	                        });
	                        $('#ywbh-del').on('click', function () {
	                            /*移出按钮*/
	                             var fclxxcl = $('#fclxxcl li[selected]');
	                             if(!fclxxcl.length){
	                                 return
	                             }
	                             var select_zd = "";
		                    	 	var select_cp="";
	                             for(var i = 0; i<fclxxcl.length; i++) {
	                            	 select_zd += $(fclxxcl[i]).attr('date-name')+",";
	                            	 select_cp += $(fclxxcl[i]).text()+",";
	                             }
	                             select_zd = select_zd.substring(0,select_zd.length-1);
	                             select_cp = select_cp.substring(0,select_cp.length-1);
	                             var select_cp = select_cp.split(',');
	                             for(var i=0;i<select_cp.length;i++) {
	                                 var items=select_cp[i];
	                                 xxdzcarsjson.removeByValue(items);
	                                 xxdzjson.removeByCP(items);
	                             }
	                             $('#fclxxcl li[selected]').removeAttr("selected").remove();
	                         });
	                        
	                        
	                        $('#ywbh-add').on('click', function () {
	                    	 	var select_zd = "";
	                    	 	var select_cp="";
	                            /*移入按钮*/
	                            var syclList = $('#syclList li[selected]');
	                            if(!syclList.length){
	                                return;
	                            }
	                            $('#fclxxcl').empty();
	                            for(var i = 0; i<syclList.length; i++) {
	                            	select_zd += $(syclList[i]).attr('date-name')+",";
	                            	select_cp +=$(syclList[i]).text()+",";
	                            }
	                            select_zd = select_zd.substring(0,select_zd.length-1);
	                            select_cp = select_cp.substring(0,select_cp.length-1);
	                            var select_cp_list = select_cp.split(',');
	                            var select_zd_list = select_zd.split(',');
	                            for(var i=0;i<select_cp_list.length;i++) {
	                                var items=select_cp_list[i];
	                                if($.inArray(items,xxdzcarsjson)==-1) {
	                                	var o = {};
			                            o.zd = select_zd_list[i];
			                            o.cp = select_cp_list[i];
			                            xxdzjson.push(o);
			                            xxdzcarsjson.push(items);
	                                }
	                            }
	                            for (var i=0;i<xxdzjson.length;i++) {
                                    var selected1 = ".sele"+i;
                                    $('#fclxxcl').append('<li class="sele'+i+'" date-name='+xxdzjson[i].zd+'>'+xxdzjson[i].cp+"</li>");
                                    $(selected1).on('click',function(){
                                        if ($(this).attr('selected')) {
                                            $(this).removeAttr("selected");
                                        } else {
                                            $(this).attr("selected", '');
                                        }
                                    });
	                            }
	                            $('#syclList li[selected]').removeAttr("selected");
	                        });
	                        $('#ywbh-addonecd').on('click', function () {
								var select_name = $('#ywbh-cd').data('value');
								if(!select_name){
						            return;
						        }
						        findcdcars(select_name).then(function(data){
						        	for (var i=0;i<data.length;i++) {
						        		if($.inArray(data[i].VEHI_NO,xxdzcarsjson)==-1){
			                    			var o = {};
				                            o.zd = data[i].MDT_NO;
				                            o.cp = data[i].VEHI_NO;
				                            xxdzjson.push(o);
				                            xxdzcarsjson.push(data[i].VEHI_NO);
			                    		}else{
			                    			continue;
			                    		}
						        	}
						        	$('#fclxxcl').empty();
						        	for (var i=0;i<xxdzjson.length;i++) {
							               var selected1 = ".sele"+i;
							               $('#fclxxcl').append('<li class="sele'+i+'" date-name='+xxdzjson[i].zd+'>'+xxdzjson[i].cp+"</li>");
							               $(selected1).on('click',function(){
							                   if ($(this).attr('selected')) {
							                       $(this).removeAttr("selected");
							                   } else {
							                       $(this).attr("selected", '');
							                   }
							               });
							        }
						        });
							});
	                        
	                        //---------------------------------
	                        getdxxx("2").then(function(data){
	                        	$("#fcldxkjList").html("");
		                    	for (var i = 0; i < data.length; i++) {
		                    		$("#fcldxkjList").append('<li><a href="#">'+data[i].CONTENT+'</a></li>');
								}
		                    	 $("#fcldxkjList li").click(function(){
		                         	$("#ywbhEditor-xxnr").val($(this).children().html());
		                         });
		                    	 
		                    	 $("#ywbhEditor-add").click(function(){
				                    	var postData={};
				                    	postData.cmd="0x8300";
				                    	var isu = "";
				                    	for (var i = 0; i < xxdzjson.length; i++) {
				                    		isu+=xxdzjson[i].zd+",";
										}
				                    	postData.isu=isu.substring(0,isu.length-1);
				                    	postData.content=$("#ywbhEditor-xxnr").val();
				                    	postData.flag=0;
				                    	sendcldx(postData);
				                    	bjxxfsDialog.hide();
				                    });
				                    $("#ywbhEditor-guan").click(function(){
				                    	bjxxfsDialog.hide();
				                    });
				                    $("#ywbhEditor-char").click(function(){
				                    	bjcdmcDialogPanel.set('href', 'app/html/ddxpt/editor/cdmcEditor.html');
				                    	bjcdmcDialog.set('title', '添加车队');
			        	                $('#cdmcDialogPanel').removeAttr('style');
				                    	bjcdmcDialog.show().then(function () {
				                    		$("#cdmcEditor-qued").click(function(){
						                    	if($("#cdmcEditor-cdmc").val()==""){
						                    		layer.msg("请输入车队名称");
						                    	}else{
						                    		var postData={};
						                    		postData.cdmc = $("#cdmcEditor-cdmc").val();
						                    		var cps = "";
							                    	for (var i = 0; i < xxdzjson.length; i++) {
							                    		cps+=xxdzjson[i].cp+",";
													}
							                    	postData.gh=username;
							                    	postData.cps=cps.substring(0,cps.length-1);
							                    	addcd(postData).then(function(data){
							                    		layer.msg(data.msg);
							                    		bjcdmcDialog.hide();
							                    	});
						                    	}
						                    });
				                    	});
				                    });
	                        });
	                    });
	            	});
	            },200);
			},
			dadian : function(){
				clearTimeout(settime);
				settime = setTimeout(function() {
				var zoom = map.getZoom();
			  if(zoom >=17 && zoom <= 18 ){
				  bjjkxjsobj.addMark4(1) //1,管理员可视范围打点 2,全屏打点
			  }else if(zoom >=14 && zoom <= 16 ){
				  bjjkxjsobj.addMark3(3)
			  }else if(zoom >=12 && zoom <= 13 ){
				  bjjkxjsobj.addMark3(2)
			  }else if(zoom >=10 && zoom <= 11 ){
				  bjjkxjsobj.addMark3(4)
			  }else if(zoom >=8 && zoom <= 9 ){
				  bjjkxjsobj.addMark3(5)
			  }else if(zoom >=6 && zoom <= 7 ){
				  bjjkxjsobj.addMark3(6)
			  }else if(zoom <= 5 ){
				  bjjkxjsobj.addMark3(7)
			  }
				},500);
			},
			addMark4 : function(type){
				if(type == 1){
					if(map.getZoom() < 17){
						return;
					}
				}
				map.remove(monmks);
				monmks = [];
				var containsCount = 0;
				var bounds = map.getBounds();
				for(var i=0;i<vehilist.length;i++){
				    var v = obj = vehilist[i];
				    if(bounds.contains(new AMap.LngLat(v.longi,v.lati))){
				        containsCount++;
				        var icon = getbjtb(obj);
						var marker1 = new AMap.Marker({
				  			   map:map,
							   icon:icon,
							   position:new AMap.LngLat(obj.longi,obj.lati),     
							   offset: new AMap.Pixel(-18, -18)
							});
						monmks.push(marker1);
						//信息窗口
			    		var title = '车牌号码：<span style="font-size:11px;color:#278ac4;">'+obj.vehino+'</span>',
			            content = [];
				        content.push("经度："+obj.longi+" 纬度："+obj.lati);
				        content.push("时间："+obj.dateTime);
				        content.push("速度："+obj.speed+"   方向："+dlwz(obj.heading)+"  状态："+kzc(obj.carStatus));
				        content.push("Sim卡号："+obj.vehisim);
				        content.push("终端类型："+obj.mtname);
				        content.push(" 车型："+obj.cartype);
				        content.push("车主电话："+obj.owntel);
				        content.push("公司："+obj.compname);
				        content.push("区块："+obj.qk);
				        content.push("车主姓名："+obj.ownname);
				        content.push("<hr/>&nbsp;&nbsp;<a href='javascript:void(0)' class='xxfs'>信息发送</a>"+"&nbsp;&nbsp;<a href='javascript:void(0)' class='jfcx'>积分查询</a>"+"&nbsp;&nbsp;");
				        var infoWindow = new AMap.InfoWindow({
				            isCustom: true,  //使用自定义窗体
				            content: bjcreateInfoWindow(title, content.join("<br/>")),
				            offset: new AMap.Pixel(15, -23)
				        });
				        //积分查询窗口
				        var title1 = '<span style="font-size:11px;color:#278ac4;">'+obj.vehino+'</span>',
				        content1 = [];
				        content1.push("调度总数："+obj.dispnum);
				        content1.push("投诉总数："+obj.complnum);
				        content1.push("积分总数："+obj.jfzs);
				        var infoWindow1 = new AMap.InfoWindow({
				            isCustom: true,  //使用自定义窗体
				            content: bjcreateInfoWindow(title1, content1.join("<br/>")),
				            offset: new AMap.Pixel(15, -23)
				        });
				        marker1.infoWindow1=infoWindow1;
				        marker1.infoWindow = infoWindow;
				        marker1.clxx = obj;
				        AMap.event.addListener(marker1, 'click', function() {
				        	bjjkxjsobj.ckfsxx(this);
				        });
				    }
				}
			},
			addMark3 : function(level){
				map.remove(monmks);
				monmks = [];
			    var list ;
			    if(level == 1){
			        list = vehilist;
			    }else if(level == 2){
			        list = l2;
			    }else if(level == 3){
			        list = l3;
			    }else if(level == 4){
			        list = l4;
			    }else if(level == 5){
			        list = l5;
			    }else if(level == 6){
			        list = l6;
			    }else if(level == 7){
			        list = l7;
			    }
				for(var i=0;i<list.length;i++){
				    var obj = v = list[i];
				    if(v.cluster > 1){
				         var point = new AMap.LngLat(v.longi, v.lati);
				        //自定义点标记内容
				        var markerContent = document.createElement("div");
				        markerContent.className = "markerContent";
				        var markerSpan = document.createElement("span");
				        markerSpan.innerHTML = v.cluster;
				        var length = v.cluster.toString().length;
				        var width = 7*length;
				        if (length==1) {
				            length = 4; //1位数时是背景太小，所以要加大一点
				        } 
				        var tmp = "height:"+ width + "px;line-height:"+ width + "px;border-radius :"+ width + "px";
				        markerContent.setAttribute("style", 'padding:' + length + 'px; background-color: #ffbf00;'+tmp);
				        markerContent.appendChild(markerSpan);
				        var marker3=new AMap.Marker({
				            "position":point,
				            "content":markerContent   //自定义点标记覆盖物内容
				        });
				        marker3.setMap(map);  //在地图上添加点  
				        monmks.push(marker3);
				    }else if(!v.deleteFlag){
				        var icon = getbjtb(obj);
				        var marker1 = new AMap.Marker({
				  			   map:map,
							   icon:icon,
							   position:new AMap.LngLat(obj.longi,obj.lati),     
							   offset: new AMap.Pixel(-18, -18)
							});
						monmks.push(marker1);
						//信息窗口
			    		var title = '车牌号码：<span style="font-size:11px;color:#278ac4;">'+obj.vehino+'</span>',
			            content = [];
				        content.push("经度："+obj.longi+" 纬度："+obj.lati);
				        content.push("时间："+obj.dateTime);
				        content.push("速度："+obj.speed+"   方向："+dlwz(obj.heading)+"  状态："+kzc(obj.carStatus));
				        content.push("Sim卡号："+obj.vehisim);
				        content.push("终端类型："+obj.mtname);
				        content.push(" 车型："+obj.cartype);
				        content.push("车主电话："+obj.owntel);
				        content.push("公司："+obj.compname);
				        content.push("区块："+obj.qk);
				        content.push("车主姓名："+obj.ownname);
				        content.push("<hr/>&nbsp;&nbsp;<a href='javascript:void(0)' class='xxfs'>信息发送</a>"+"&nbsp;&nbsp;<a href='javascript:void(0)' class='jfcx'>积分查询</a>"+"&nbsp;&nbsp;");
				        var infoWindow = new AMap.InfoWindow({
				            isCustom: true,  //使用自定义窗体
				            content: bjcreateInfoWindow(title, content.join("<br/>")),
				            offset: new AMap.Pixel(15, -23)
				        });
				        //积分查询窗口
				        var title1 = '<span style="font-size:11px;color:#278ac4;">'+obj.vehino+'</span>',
				        content1 = [];
				        content1.push("调度总数："+obj.dispnum);
				        content1.push("投诉总数："+obj.complnum);
				        content1.push("积分总数："+obj.jfzs);
				        var infoWindow1 = new AMap.InfoWindow({
				            isCustom: true,  //使用自定义窗体
				            content: bjcreateInfoWindow(title1, content1.join("<br/>")),
				            offset: new AMap.Pixel(15, -23)
				        });
				        marker1.infoWindow1=infoWindow1;
				        marker1.infoWindow = infoWindow;
				        marker1.clxx = obj;
				        AMap.event.addListener(marker1, 'click', function() {
				        	bjjkxjsobj.ckfsxx(this);
				        });
						  
				    }
				}
			},
			qyquery:function(){
				bjdata().then(function(data){
					console.log(data);
					vehilist = data.vehilist;
					l2=data.l2;
					l3=data.l3;
					l4=data.l4;
					l5=data.l5;
					l6=data.l6;
					l7=data.l7;
					$("#clzs").html(data.num.total);
					$("#clzxs").html(data.num.onnum);
					$("#clkcs").html(data.num.nnum);
					$("#clzcs").html(data.num.hnum);
					$("#cllxs").html(data.num.offnum);
					
					$("#jjtabledata").html("");
					$("#jjtabledata").append('<li class="titleName"><span class="li-quyu">区域</span><span class="li-chls">车辆数</span><span class="li-ybjs">预报警数</span></li>');
					map.remove(qylist);
					map.remove(qytextlist);
					qylist=[];
					qytextlist=[];
					$("#bjjkx-dxx").html();
					for (var i = 0; i < data.arealist.length; i++) {
						var polygonArr = new Array();//多边形覆盖物节点坐标数组
						var zbsz = data.arealist[i].areazbs.split(';');
						for (var j = 0; j < zbsz.length; j++) {
							var zbs = zbsz[j].split(',');
							polygonArr.push([zbs[0], zbs[1]]);
						}
					    var  polygon = new AMap.Polygon({
					        path: polygonArr,//设置多边形边界路径
					        strokeColor: "#FF33FF", //线颜色
					        strokeOpacity: 0.2, //线透明度
					        strokeWeight: 3,    //线宽
					        fillColor: "#1791fc", //填充色
					        fillOpacity: 0.35//填充透明度
					    });
					    var bjys = "#6aff6a";
					    if(data.arealist[i].all.length>data.arealist[i].areabjs){
					    	bjys = "#ff7979";
					    }
					    var polygontext =new AMap.Text({
					    	text : data.arealist[i].areaname+"("+data.arealist[i].all.length+"/"+data.arealist[i].areabjs+")",
					    	map : map,
					    	style : {"background":bjys},
					    	position : polygon.getBounds().getCenter(),
					    	title : data.arealist[i].areams
					    });
					    polygon.setMap(map);
					    qylist.push(polygon);
					    qytextlist.push(polygontext);
					    
					    if(data.arealist[i].all.length>data.arealist[i].areabjs){
					    	$("#bjjkx-jjbj").prepend('<tr><td><a class="bjxx-red" href="javascript:void(0)" data-qy="" onclick="bjjkxjsobj.bjqydw('+i+')">'+ data.arealist[i].areaname + ' &nbsp;&nbsp;车辆数:'+data.arealist[i].all.length+'&nbsp;&nbsp;预报警数:'+data.arealist[i].areabjs+'&nbsp;&nbsp;时间:'+ setformat1(new Date()) + ' &nbsp;&nbsp;</a></td></tr>');
					    }
					    //加列表
					    $("#jjtabledata").append('<li class="infoConent" onclick="bjjkxjsobj.bjqydw('+i+')"><span class="li-quyu">'+data.arealist[i].areaname+'</span><span class="li-chls">'+data.arealist[i].all.length+'</span><span class="li-ybjs">'+data.arealist[i].areabjs+'</span></li>');
					}
					bjjkxjsobj.dadian();
				});
			},
			bjqydw : function(obj){
				map.setZoom(17);
				map.setCenter(qylist[obj].getBounds().getCenter());
			},
			fjcl:function () {//附近车辆
				if (cluster) {
		            cluster.setMap(null);
		        }
				clearTimeout(settime);
				settime = setTimeout(function() {
				var postData={};
				postData.zjd = map.getBounds().southwest.lng;
				postData.yjd = map.getBounds().northeast.lng;
				postData.swd = map.getBounds().northeast.lat;
				postData.xwd = map.getBounds().southwest.lat;
				findfjcl(postData).then(function(data){
					if(fjclmarker&&fjclmarker.length>0){
						map.remove(fjclmarker);
					}
					fjclmarker=[];
					for (var i = 0; i < data.length; i++) {
						var icon = gettb(data[i],3);
						var fjclmk=new AMap.Marker({
				            icon: icon,
				            position: [data[i].PX,data[i].PY],
				            offset: new AMap.Pixel(-18, -18),
				            map : map
				        });
						//信息窗口
			    		var title = '车牌号码：<span style="font-size:11px;color:#278ac4;">'+data[i].VEHI_NO+'</span>',
			            content = [];
				        content.push("经度："+data[i].PX+" 纬度："+data[i].PY);
				        content.push("时间："+data[i].STIME);
				        content.push("速度："+data[i].SPEED+"   方向："+dlwz(data[i].ANGLE)+"  状态："+kzc(data[i].STATE));
				        content.push("Sim卡号："+data[i].VEHI_SIM);
				        content.push("终端类型："+data[i].MT_NAME);
				        content.push(" 车型："+data[i].VT_NAME);
				        content.push("车主电话："+data[i].OWN_TEL);
				        content.push("公司："+data[i].COMP_NAME);
				        content.push("区块："+data[i].OWNER_NAME);
				        content.push("车主姓名："+data[i].OWN_NAME);
				        content.push("<hr/>&nbsp;&nbsp;<a href='javascript:void(0)' class='xxfs'>信息发送</a>"+"&nbsp;&nbsp;<a href='javascript:void(0)' class='jfcx'>积分查询</a>"+"&nbsp;&nbsp;");
				        var infoWindow = new AMap.InfoWindow({
				            isCustom: true,  //使用自定义窗体
				            content: bjcreateInfoWindow(title, content.join("<br/>")),
				            offset: new AMap.Pixel(15, -23)
				        });
				        //积分查询窗口
				        var title1 = '<span style="font-size:11px;color:#278ac4;">'+data[i].VEHI_NO+'</span>',
				        content1 = [];
				        content1.push("调度总数："+data[i].DISP_NUM);
				        content1.push("投诉总数："+data[i].COMPL_NUM);
				        content1.push("积分总数："+data[i].INTEGRAL);
				        var infoWindow1 = new AMap.InfoWindow({
				            isCustom: true,  //使用自定义窗体
				            content: bjcreateInfoWindow(title1, content1.join("<br/>")),
				            offset: new AMap.Pixel(15, -23)
				        });
				        fjclmk.infoWindow1=infoWindow1;
				        fjclmk.infoWindow = infoWindow;
				        fjclmk.clxx = data[i];
				        AMap.event.addListener(fjclmk, 'click', function() {
				        	bjjkxjsobj.ckfsxx(this);
				        });
						fjclmk.setTitle(data[i].VEHI_NO);
						fjclmarker.push(fjclmk);
					}
					if(map.getZoom()<=12&&fjclmarker.length>200){
						var _renderCluserMarker = function (context) {
							console.log(context);
						    var factor = Math.pow(context.count/count,1/18)
						    var div = document.createElement('div');
						    var Hue = 180 - factor* 180;
						    var bgColor = 'hsla('+Hue+',100%,50%,0.7)';
						    var fontColor = 'hsla('+Hue+',100%,20%,1)';
						    var borderColor = 'hsla('+Hue+',100%,40%,1)';
						    var shadowColor = 'hsla('+Hue+',100%,50%,1)';
						    div.style.backgroundColor = bgColor
						    var size = Math.round(30 + Math.pow(context.count/count,1/5) * 20);
						    div.style.width = div.style.height = size+'px';
						    div.style.border = 'solid 1px '+ borderColor;
						    div.style.borderRadius = size/2 + 'px';
						    div.style.boxShadow = '0 0 1px '+ shadowColor;
						    div.innerHTML = context.count;
						    div.style.lineHeight = size+'px';
						    div.style.color = fontColor;
						    div.style.fontSize = '14px';
						    div.style.textAlign = 'center';
						    context.marker.setOffset(new AMap.Pixel(-size/2,-size/2));
						    context.marker.setContent(div)
						 }
						
						 cluster = new AMap.MarkerClusterer(map, fjclmarker,{gridSize:80,minClusterSize:5});
					}
					
				});
				},1000);
			},
			initToolBar:function(){
				var _self = this;
				map = new AMap.Map('bjjkxMap', {
					resizeEnable: true,
					zoom:13/*,
					center: [116.397428, 39.90923]*/
				});
				var rectOptions = {
			        strokeStyle: "dashed",
			        strokeColor: "#FF33FF",
			        fillColor: "#FF99FF",
			        fillOpacity: 0.5,
			        strokeOpacity: 1,
			        strokeWeight: 2
			    };
			    
			    on($('.icon-qy').parent(), 'click', function () {
			    	if(!mouseTool){
			    		map.plugin(["AMap.MouseTool"], function() {
					        mouseTool = new AMap.MouseTool(map);
					        mouseTool.rectZoomIn(rectOptions); 
					    });
			    	}else{
			    		mouseTool.close();
			    		mouseTool = null;
			    	}
			    });
				var contextMenu = new AMap.ContextMenu();  //创建右键菜单
			    //右键放大
			    contextMenu.addItem("放大一级", function() {
			        map.zoomIn();
			    }, 0);
			    //右键缩小
			    contextMenu.addItem("缩小一级", function() {
			        map.zoomOut();
			    }, 1);
			    //右键显示全国范围
			    contextMenu.addItem("缩放至全国范围", function(e) {
			        map.setZoomAndCenter(4, [108.946609, 34.262324]);
			    }, 2);
			  //右键添加区域
			    contextMenu.addItem("添加区域", function(e) {
			        map.setZoomAndCenter(4, [108.946609, 34.262324]);
			    }, 3);
			    map.on('rightclick', function(e) {
			        contextMenu.open(map, e.lnglat);
			        contextMenuPositon = e.lnglat;
			    });
			    map.on('zoomend',function(){ 
					_self.dadian()
			    });
			    map.on('moveend',function(){ 
			    	_self.addMark4(1) //1,管理员可视范围打点 2,全屏打点
			    });
				map.plugin(["AMap.RangingTool"],function(){ 
				     ruler = new AMap.RangingTool(map); 
				});
				

				 AMapUI.loadUI(['misc/PoiPicker'], function(PoiPicker) {

				        var poiPicker = new PoiPicker({
				            input: 'bjjkx-dwcxtext'
				        });
				        //初始化poiPicker
				        poiPickerReady(poiPicker);
				    });
				 function poiPickerReady(poiPicker) {
			        window.poiPicker = poiPicker;
			        poiPicker.on('poiPicked', function(poiResult) {
			        	zxmarker = new AMap.Marker({
				        	icon: "resources/images/center.png",
				        	zIndex:102,
				            draggable:true
				        });
			        	poi = poiResult.item,
			        	zxmarker.setMap(map);
			        	zxmarker.setPosition(poi.location);
			        	yspoi = poi.location;
			        	map.setCenter(yspoi);
			        	map.setZoom(16);
			        	$("#bjjkx-dwcxtext").val(poi.name);
			        });
			    }
				
				
				on($('.icon-qt').parent(), 'click', function () {
					dijit.byId("bjjkxConent-bottomContentPane").resize({h:0},null)
				});
				 on($('.icon-cj').parent(), 'click', function () {
					 ruler.turnOn();
					 AMap.event.addListener(ruler,"end",function(){
						 ruler.turnOff();
					 });
				 });
				 
				 on($('.icon-fd').parent(), 'click', function () {
					 map.setZoom( map.getZoom()+1);
				 });
				 on($('.icon-sx').parent(), 'click', function () {
					 map.setZoom( map.getZoom()-1);
				 });
				 on($('.icon-dcxxc').parent(), 'click', function () {
					 daochuxxc();
				 });
				 
				if (zzddGrid) { zzddGrid = null; dojo.empty('bjjkxConent-bjcxTable');}
				zzddGrid = new CustomGrid({ totalCount: 0, pagination: null, columns: columns}, 'bjjkxConent-bjcxTable');

				query('#bjjkx-topContentPane a').on('click', function() {
					$(this).addClass('selected').siblings('.selected').removeClass('selected');
				});

				// query('#bjjkx-borderContainer .iFComboBox').on('click', function () {
				// 	var thisOne = this;
				// 	if ($(this).hasClass('selected')) {
				// 		$(this).removeClass('selected');
				// 	} else {
				// 		$(this).addClass('selected');
				// 		$(this).find('.iFList').on('click', function () {
				// 			if (event.stopPropagation) {
				// 		        // 针对 Mozilla 和 Opera
				// 		        event.stopPropagation();
				// 	        }else if (window.event) {
				// 		        // 针对 IE
				// 	        	window.event.cancelBubble = true;
				// 	        }
				// 		}).find('li').off('click').on('click', function () {
				// 			$(this).addClass('selected').siblings('.selected').removeClass('selected');
				// 			$(thisOne).find('input').data('value', $(this).data('value')).val($(this).text()).end().removeClass('selected');
				// 		});
				// 	}
				// });
				addEventComboBox('#bjjkx-borderContainer');

//				on(query('#close_window'),'click',function () {
//				    $('#bjjkx-queryInfoBox').hide()
//                })

                on(query('#close_window'), 'click', function () {
                	var cp = $('#bjjkx-bjcl li[selected]').html();
                	if(typeof(cp)=="undefined"){
                		return;
                	}
                	var bjsj = $('#bjjkx-bjcl li[selected]').data('bjsj');
                    bjjkxDialogPanel.set('href', 'app/html/bjjkx/add.html');
                    bjjkxDialog.show().then(function () {
                        bjjkxDialog.set('title', '报警处理');
                        $('#bjjkx_addEditor-add').html("添加");
                        $('.panel-conterBar').show();
                        $('#bjjkx_addEditor-cjgh').val(username+"("+realname+")");
                        $('#bjjkx_addEditor-cjsj').val(setformat1(new Date()));
                        $('#bjjkx_addEditor-cphm').val(cp);
                        
                        $("input[name='dwqk']").click(function(){
                    	   if($(this).val()=="非精确"){
                    		   $("#dwqkjqdw").val("");
                    		   $("#dwqkjqdw").attr('disabled','disabled');
                    	   }else{
                    		   $("#dwqkjqdw").removeAttr('disabled');
                    	   }
                        });
                        $("input[name='cjjg']").click(function(){
                     	   if($(this).val()=="报警解除"){
                     		   $("#cjjgqtnr").val("");
                     		   $("#cjjgqtnr").attr('disabled','disabled');
                     	   }else{
                     		   $("#cjjgqtnr").removeAttr('disabled');
                     	   }
                         });
                        
                        findcompname(cp).then(function(data){
                        	$('#bjjkx_addEditor-gsmc').val(data.GSMC);
                        	$('#bjjkx_addEditor-zdlx').val(data.ZDLX);
                        });
                        query('#bjjkx_addEditor-cancel').on('click', function () {
                            bjjkxDialog.hide();
                        });
                        
                        query('#bjjkx_addEditor-add').on('click', function () {
                        	var postData={};
                        	postData.ad_dealtime = $('#bjjkx_addEditor-cjsj').val();
                        	postData.ad_userid = $('#bjjkx_addEditor-cjgh').val();
                        	postData.ad_car_no = $('#bjjkx_addEditor-cphm').val();
                        	postData.driver_tel = $('#bjjkx_addEditor-jjlx').val();
                        	postData.ad_listencase = $("input[name='jkqk']:checked").val();
                        	postData.ad_gps = $("input[name='dwqk']:checked").val();
                        	if($("input[name='dwqk']:checked").val()=="非精确"){
                        		postData.ad_gps = "非精确";
                        	}else{
                        		postData.ad_gps = $('#dwqkjqdw').val();
                        	}
                        	if($("input[name='cjjg']:checked").val()=="报警解除"){
                        		postData.ad_result ="报警解除";
                        		postData.ad_lastdeal="不需要";
                        	}else{
                        		postData.ad_result = $("#cjjgqtnr").val();
                        		postData.ad_lastdeal="需要";
                        	}
                        	postData.ad_alerttype = $("input[name='bjlx']:checked").val();
                        	postData.ad_condition = $("#bjjkx_addEditor-sjnr").val();
                        	postData.ad_memo = $("#bjjkx_addEditor-bz").val();
                        	postData.ad_dbtime = bjsj;
                        	bjcl(postData).then(function(data){
                        		if(data.msg=="1"){
                        			layer.msg("处理成功");
                        			bjjkxDialog.hide();
                        			_self.queryad();
                        		}else{
                        			layer.msg("处理失败");
                        		}
                        	});
                        });
                    })
                });
				on(query('.icon-kcctj'), 'click', function () {
					if($('#bjjkx-clcxdialog').css('display')=='none'){
						$('#bjjkx-clcxdialog').css('display','block');
					}else{
						$('#bjjkx-clcxdialog').css('display','none');
					}
                });
				
                on(query('.icon-jjbj'), 'click', function () {
                    $('#bjjkx-bjjkqyBox').show();
                });
                on(query('#bjjkqy-close'), 'click', function () {
                    $('#bjjkx-bjjkqyBox').hide();
                });
                on(query('#bjjkx-qxbj'), 'click', function () {
                	var cp = $('#bjjkx-bjcl li[selected]').data('value');
                	console.log(cp);
                	if(typeof(cp)=="undefined"){
                		return;
                	}
                	var postData={};
                	postData.cmd = "0x8B0B";
                	postData.isu = cp;
                	postData.tel = "";
                	jcbj(postData);
                });
                
				/*on(query('#all-pic'),'click',function () {
                    $('#bjjkx-queryInfoBox').hide();
                    $('#bjjkx-rightContentPane').hide();
                    $('#bjjkxConent-bottomContentPane').hide();
                });*/
                on(query('#part'),'click',function () {
                    $('#bjjkx-queryInfoBox').show();
                    $('#bjjkx-rightContentPane').show();
                    $('#bjjkxConent-bottomContentPane').show();
                });

                on(query('#tb_bjq'),'click',function () {
                    $('#bjjkx-queryInfoBox').show();
                });

                on(query('#ck-close'),'click',function () {
                    $('#bjjkx-queryInfoBox').hide();
                });
                
                $("#bjjkx-jkcl-comboBox").find('input').on('keyup',function(){
					var cpmhs=$("#bjjkx-jkcl-comboBox").find('input').val();
					if(cpmhs.length>2){
						findddcphm(cpmhs).then(function(data2){
							$("#bjjkx-jkcl-comboBox").find('.iFList').html("");
							for (var i = 0; i < data2.length; i++) {
								var cphms="<li data-value='"+data2[i].CPHM+"'>"+data2[i].CPHM+"</li>";
								$("#bjjkx-jkcl-comboBox").find('.iFList').append(cphms);
							}
							$('#bjjkx-jkcl-comboBox').find('.iFList').on('click', function () {
								if (event.stopPropagation){event.stopPropagation();}else if (window.event) {window.event.cancelBubble = true;}
							}).find('li').off('click').on('click', function () {
								$(this).addClass('selected').siblings('.selected').removeClass('selected');
								$("#bjjkx-jkcl-comboBox").find('input').data('value', $(this).data('value')).val($(this).text()).end().removeClass('selected');
							});
						});
					}
				});
                
                on(query('#bjjkx-dwcxdw'), 'click', function () {
                	if(zxmarker){
                		map.setCenter(zxmarker.getPosition());
                	}
                });
              //车辆监控
				on(query('#bjjkx-jkclcx'), 'click', function () {
					var tempcar= $("#bjjkx-jkcltext").val();
					if(tempcar==""){
						layer.msg("请输入或者选择车牌号码！");
						return;
					}
					_self.findone(tempcar);
                });
				on(query('#cl_Query'), 'click', function () {
					_self.queryad();
				});
				on(query('#cl_Add'), 'click', function () {
                	var hs=0;
                	var itemdata={};
    	        	dojo.forEach(zzddGrid.collection.data, function(item,index) {
    					if (zzddGrid.isSelected(item)) {
    						hs++;
    						itemdata=item;
    					}
    				});
    				if(hs==0){
    					layer.msg("请选择一条数据！");
    				}else if(hs>1){
    					layer.msg("只能选择一条数据！");
    				}else{
    					
    					console.log(itemdata);
    					
    					bjjkxDialogPanel.set('href', 'app/html/bjjkx/add.html');
                        bjjkxDialog.show().then(function () {
                            bjjkxDialog.set('title', '报警处理');
                            $('#bjjkx_addEditor-add').html("修改");
                            $('.panel-conterBar').show();
                            $('#bjjkx_addEditor-cjgh').val(itemdata.AD_USERID);
                            $('#bjjkx_addEditor-cjsj').val(util.formatYYYYMMDDHHMISS(itemdata.AD_DEALTIME));
                            $('#bjjkx_addEditor-cphm').val(itemdata.AD_CAR_NO);
                            $("#bjjkx_addEditor-sjnr").val(itemdata.AD_CONDITION);
                        	$("#bjjkx_addEditor-bz").val(itemdata.AD_MEMO);
                        	$("#bjjkx_addEditor-jjlx").val(itemdata.DRIVER_TEL);
                        	$("input[name='jkqk']").each(function(){
                        		if($(this).val()==itemdata.AD_LISTENCASE){
                        			$(this).attr('checked',true);
                        		}else{
                        			$(this).attr('checked',false);
                        		}
                        	});
                        	$("input[name='bjlx']").each(function(){
                        		if($(this).val()==itemdata.AD_ALERTTYPE){
                        			$(this).attr('checked',true);
                        		}else{
                        			$(this).attr('checked',false);
                        		}
                        	});
                        	$("input[name='dwqk']").each(function(){
                        		if($(this).val()==itemdata.AD_GPS){
                        			$(this).attr('checked',true);
                        		}else{
                        			$(this).attr('checked',false);
                        		}
                        	});
                        	if(itemdata.AD_GPS=="非精确"){
                     		   $("#dwqkjqdw").val("");
                     		   $("#dwqkjqdw").attr('disabled','disabled');
                     	   }else{
                     		  $("#dwqkjqdw").val(itemdata.AD_GPS);
                     		   $("#dwqkjqdw").removeAttr('disabled');
                     	   }
                        	$("input[name='cjjg']").each(function(){
                        		if($(this).val()==itemdata.AD_RESULT){
                        			$(this).attr('checked',true);
                        		}else{
                        			$(this).attr('checked',false);
                        		}
                        	});
                        	if(itemdata.AD_RESULT=="报警解除"){
                      		   $("#cjjgqtnr").val("");
                      		   $("#cjjgqtnr").attr('disabled','disabled');
                      	   }else{
                      		 $("#cjjgqtnr").val(itemdata.AD_RESULT);
                      		   $("#cjjgqtnr").removeAttr('disabled');
                      	   }
                        	
                            $("input[name='dwqk']").click(function(){
                        	   if($(this).val()=="非精确"){
                        		   $("#dwqkjqdw").val("");
                        		   $("#dwqkjqdw").attr('disabled','disabled');
                        	   }else{
                        		   $("#dwqkjqdw").removeAttr('disabled');
                        	   }
                            });
                            $("input[name='cjjg']").click(function(){
                         	   if($(this).val()=="报警解除"){
                         		   $("#cjjgqtnr").val("");
                         		   $("#cjjgqtnr").attr('disabled','disabled');
                         	   }else{
                         		   $("#cjjgqtnr").removeAttr('disabled');
                         	   }
                             });
                            
                            findcompname(itemdata.AD_CAR_NO).then(function(data){
                            	$('#bjjkx_addEditor-gsmc').val(data.GSMC);
                            	$('#bjjkx_addEditor-zdlx').val(data.ZDLX);
                            });
                            query('#bjjkx_addEditor-cancel').on('click', function () {
                                bjjkxDialog.hide();
                            });
                            
                            query('#bjjkx_addEditor-add').on('click', function () {
                            	var postData={};
                            	postData.ad_id = itemdata.AD_ID;
                            	postData.ad_dealtime = $('#bjjkx_addEditor-cjsj').val();
                            	postData.ad_userid = $('#bjjkx_addEditor-cjgh').val();
                            	postData.ad_car_no = $('#bjjkx_addEditor-cphm').val();
                            	postData.driver_tel = $('#bjjkx_addEditor-jjlx').val();
                            	postData.ad_listencase = $("input[name='jkqk']:checked").val();
                            	postData.ad_gps = $("input[name='dwqk']:checked").val();
                            	if($("input[name='dwqk']:checked").val()=="非精确"){
                            		postData.ad_gps = "非精确";
                            	}else{
                            		postData.ad_gps = $('#dwqkjqdw').val();
                            	}
                            	if($("input[name='cjjg']:checked").val()=="报警解除"){
                            		postData.ad_result ="报警解除";
                            		postData.ad_lastdeal="不需要";
                            	}else{
                            		postData.ad_result = $("#cjjgqtnr").val();
                            		postData.ad_lastdeal="需要";
                            	}
                            	postData.ad_alerttype = $("input[name='bjlx']:checked").val();
                            	postData.ad_condition = $("#bjjkx_addEditor-sjnr").val();
                            	postData.ad_memo = $("#bjjkx_addEditor-bz").val();
                            	bjcledit(postData).then(function(data){
                            		if(data.msg=="1"){
                            			layer.msg("处理成功");
                            			bjjkxDialog.hide();
                            			_self.queryad();
                            		}else{
                            			layer.msg("处理失败");
                            		}
                            	});
                            });
                        })
    				}
                });
				
			}
		})
	});