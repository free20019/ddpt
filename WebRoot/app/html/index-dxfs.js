//function dxfsdr(){
//	$.get('http://192.168.0.98:8080/288dh/288.txt', function(csv) {
//	    var data = csv.split('\n');
//	    console.log(data);
//	});
//}
String.prototype.replaceAll = function(s1, s2) {
	return this.replace(new RegExp(s1, "gm"), s2);
}
function dxfsfs() {
	if ($("#dxfs-xxnr").val() === "") {
		layer.alert("请输入消息内容");
	} else if ($("#dxfs-dhhm").val() === "") {
		layer.alert("请输入发送对象");
	} else {
		fasong();
	}
}
function fasong() {
	layer.confirm('你确定发送该消息吗？', function() {
		layer.close();
		var index = layer.load(2, {
			shade : false
		});
		$.ajax({
			url : basePath + 'xxfs/dxmsgsend',
			type : 'post',
			data : 'postData={"dhhm":"'
					+ $("#dxfs-dhhm").val().replaceAll('\n', ',') + '","nr":"'
					+ $("#dxfs-xxnr").val().replaceAll('\n', '*').replaceAll('%', '~') + '"}',
			dataType : "json",
			success : function(data) {
				console.log(data);
				layer.close(index);
				if (data.sfdl == "1") {
					layer.msg("发送失败");
				} else {
					if (data.errordh == "") {
						layer.msg("发送成功");
					} else {
						layer.msg("发送成功!(其中" + data.errordh + "发送失败)");
					}
				}

			},
			error : function(data) {
				layer.close(index);
			}
		})
	})
}

$(function() {
	$.ajax({
		url : basePath + 'xxfs/findmsg',
		type : 'post',
		data : '',
		dataType : "json",
		success : function(data) {
			$(".xxnrPanel").html("");
			for (var i = 0; i < data.length; i++) {
				var gs = "<li class='sjx' nrid='" + data[i].ID
						+ "'><a href='#'>" + data[i].CONTENT + "</a></li>";
				$(".xxnrPanel").append(gs);
			}
			fangfa();
		},
		error : function(data) {
		}
	});
	queryqzlist();
	
})
function Refresh() {
	$.ajax({
		url : basePath + 'xxfs/findmsg',
		type : 'post',
		data : '',
		dataType : "json",
		success : function(data) {
			$(".xxnrPanel").html("");
			for (var i = 0; i < data.length; i++) {
				var gs = "<li class='sjx' nrid='" + data[i].ID
						+ "'><a href='#'>" + data[i].CONTENT + "</a></li>";
				$(".xxnrPanel").append(gs);
			}
			fangfa();
		},
		error : function(data) {
		}
	})
}
function fangfa() {
	var nr;
	var id;
	$(".xxnrPanel li")
			.click(
					function() {
						if ($(this).attr('selected')) {
							$(this).removeAttr("selected");
						} else {
							nr = $(this).text();
							id = $(this).attr('nrid');
							$(this).siblings().removeAttr("selected");
							$(this).attr("selected", '');
							// layer.alert($(this).attr('nrid'));
							$("#dxfs-upd")
									.off('click')
									.on(
											'click',
											function() {
												dxfsDialog
														.show()
														.then(
																function() {
																	$(
																			"#xxfseditor_tuichu")
																			.off(
																					'click')
																			.on(
																					'click',
																					function() {
																						dxfsDialog
																								.hide();
																					})
																	console
																			.log(nr);
																	$(
																			"#xxfseditor_btn")
																			.text(
																					'修改');
																	$(
																			"#xxfs_xx")
																			.val(
																					nr);
																	$(
																			"#xxfseditor_btn")
																			.off(
																					'click')
																			.on(
																					'click',
																					function() {
																						if ($(
																								"#xxfs_xx")
																								.val() === "") {
																							layer
																									.alert("请输入消息内容");
																						} else {
																							$
																									.ajax({
																										url : basePath
																												+ 'xxfs/msgupdate',
																										type : 'post',
																										data : 'postData={"id":"'
																												+ id
																												+ '","nr":"'
																												+ $(
																														"#xxfs_xx")
																														.val()
																												+ '"}',
																										dataType : "json",
																										success : function(
																												data) {
																											if (data.msg === "修改成功") {
																												layer
																														.msg(data.msg);
																												dxfsDialog
																														.hide();
																												Refresh();
																											} else {
																												layer
																														.alert("发生错误");
																											}
																										},
																										error : function(
																												data) {
																										}
																									})
																						}
																					})
																})

											})
							$("#dxfs-del").off('click').on('click', function() {
								layer.confirm('你确定要删除该消息吗？', function() {
									console.log(id);
									$.ajax({
										url : basePath + 'xxfs/msgdel',
										type : 'post',
										data : 'postData={"id":"' + id + '"}',
										dataType : "json",
										success : function(data) {
											if (data.msg === "删除成功") {
												layer.msg(data.msg);
												$(".xxnrPanel").html("");
												Refresh();
											} else {
												layer.alert("发生错误");
											}
										},
										error : function(data) {
										}
									})
								})
							})
						}
					});
	$(".xxnrPanel li").dblclick(function() {
		$("#dxfs-xxnr").text($(this).text())
	});

	$("#dxfs-add").off('click').on('click', function() {
		dxfsDialog.show().then(function() {
			$("#xxfseditor_tuichu").off('click').on('click', function() {
				dxfsDialog.hide();
			})
			$("#xxfs_xx").val('');
			$("#xxfseditor_btn").off('click').on('click', function() {
				if ($("#xxfs_xx").val() === "") {
					layer.alert("请输入消息内容");
				} else {
					$.ajax({
						url : basePath + 'xxfs/msgadd',
						type : 'post',
						data : 'postData={"nr":"' + $("#xxfs_xx").val() + '"}',
						dataType : "json",
						success : function(data) {
							if (data.msg === "添加成功") {
								layer.msg(data.msg);
								dxfsDialog.hide();
								Refresh();
							} else {
								layer.alert("发生错误");
							}
						},
						error : function(data) {
						}
					})
				}
			})
		})
	})
	$("#dxfs-upd").off('click').on('click', function() {
		layer.alert("请选择一条消息内容进行修改");
	})
	$("#dxfs-del").off('click').on('click', function() {
		layer.alert("请选择一条消息内容删除");
	})
}

function dxqzgl(){
	qzglDialog.show();
}
function dxrygl(){
	ryglDialog.show();
}

function queryqzlist(){
	$.ajax({
		url : basePath + 'xxfs/findqzname',
		type : 'post',
		data : '',
		dataType : "json",
		success : function(data) {
			$("#dxfs_dhqz-comboBox").find('.iFList').html('');
			for (var i = 0; i < data.length; i++) {
				var gss = "<li data-value='" + data[i].YHS + "'>" + data[i].TEAMNAME + "</li>";
				$("#dxfs_dhqz-comboBox").find('.iFList').append(gss);
			}
			addEventComboBoxList('#dxfs_dhqz-comboBox');
		},
		error : function(data) {
		}
	});
}

$('#dxfs_dhqz-input').change(function () {
	var dhs = $("#dxfs_dhqz-input").data('value');
	dhs = dhs.replaceAll(',','\n');
	$("#dxfs-dhhm").val(dhs);
});

function findryxx(){
	var xhrArgs = {
			url : basePath + "xxfs/findryxx",
			postData : "",
			handleAs : "json"
		};
		return dojo.xhrPost(xhrArgs);
}