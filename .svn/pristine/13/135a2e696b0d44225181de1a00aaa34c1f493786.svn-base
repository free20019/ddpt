//addEventComboBoxList('#xxfs_dx-comboBox');
$('#xxfs_dxlx-input').change(
		function() {
			var comboboxInput = $("#xxfs_dxlx-input");
			var comboboxTj = $("#xxfs_dx-tj");
			var comboboxText = $("#xxfs_dx_text");
			var comboboxSearch = $("#xxfs_dx_search");
			var comboboxList = $("#xxfs_dx-comboBox").find('.iFList');
			switch (comboboxInput.val()) {
			case '全部(除建德)':
				comboboxTj.attr('disabled', 'disabled');
				comboboxText.attr('disabled', 'disabled');
				comboboxSearch.attr('disabled', 'disabled');
				comboboxTj.val('');
				comboboxText.val('');
				break;
			case '应急车队':
				comboboxTj.attr('disabled', 'disabled');
				comboboxText.attr('disabled', 'disabled');
				comboboxSearch.attr('disabled', 'disabled');
				comboboxTj.val('');
				comboboxText.val('');
			break;
			case '公司':
				comboboxTj.attr('placeholder', '');
				comboboxTj.removeAttr('disabled', '');
				comboboxText.removeAttr('disabled', '');
				comboboxSearch.removeAttr('disabled', '');
				comboboxTj.val('');
				comboboxText.val('');
				$.ajax({
					url : basePath + 'xxfs/findgs',
					type : 'post',
					data : 'postData={"comp_name":""}',
					dataType : 'json',
					success : function(data) {
						comboboxList.html('');
						for (var i = 0; i < data.length; i++) {
							var gss = "<li data-value='" + data[i].COMP_NAME
									+ "'>" + data[i].COMP_NAME + "</li>";
							comboboxList.append(gss);
						}
						addEventComboBoxList('#xxfs_dx-comboBox');
					},
					error : function(data) {
					}
				});
				break;
			case '集团':
				comboboxTj.attr('placeholder', '');
				comboboxTj.removeAttr('disabled', '');
				comboboxText.removeAttr('disabled', '');
				comboboxSearch.removeAttr('disabled', '');
				comboboxTj.val('');
				comboboxText.val('');
				$.ajax({
					url : basePath + 'xxfs/findjt',
					type : 'post',
					data : 'postData={"owner_name":""}',
					dataType : 'json',
					success : function(data) {
						comboboxList.html("");
						for (var i = 0; i < data.length; i++) {
							var gss = "<li data-value='" + data[i].OWNER_NAME
									+ "'>" + data[i].OWNER_NAME + "</li>";
							comboboxList.append(gss);
						}
						addEventComboBoxList('#xxfs_dx-comboBox');
					},
					error : function(data) {
					}
				});
				break;
			case '单车':
				comboboxTj.removeAttr('disabled', '');
				comboboxText.removeAttr('disabled', '');
				comboboxSearch.removeAttr('disabled', '');
				comboboxTj.attr('placeholder', '请输入车牌号');
				comboboxTj.val('');
				comboboxText.val('');
				break;
			}
		});

function send() {
	if ($("#xxfs_dxlx-input").val() == '全部(除建德)'||$("#xxfs_dxlx-input").val() == '应急车队') {
		if ($("#xxfs-xxnr").val() === "") {
			layer.alert("请输入消息内容");
		} else {
			fasong();
		}
	} else {
		if ($("#xxfs_dx_text").val() === "") {
			layer.alert("请选择对象！");
		} else if ($("#xxfs-xxnr").val() === "") {
			layer.alert("请输入消息内容");
		} else {
			fasong();
		}
	}
}

function fasong() {
	layer.confirm('你确定发送该消息吗？', function() {
		layer.close();
		var index = layer.load(2, {
			shade : false
		});
		 var xxnr = $("#xxfs-xxnr").val().replace(/\n/g,"");
		 var reg = new RegExp("%","g");
		 xxnr = xxnr.replace(reg,"bfh");
		 var reg2 = new RegExp("'","g");
		 xxnr = xxnr.replace(reg2,"dyh");
         var reg3 = new RegExp('"',"g");
         xxnr = xxnr.replace(reg3,"syh");
		$.ajax({
			url : basePath + 'xxfs/msgsend',
			type : 'post',
			data : 'postData={"type":"' + $("#xxfs_dxlx-input").val()
					+ '","target":"' + $("#xxfs_dx_text").val() + '","nr":"'
					+ xxnr + '"}',
			dataType : "json",
			success : function(data) {
				console.log(data);
				layer.close(index);
				layer.msg(data.msg);
				// if(data.msg === "发送成功"){
				// layer.close(index);
				// layer.msg(data.msg);
				// }else{
				// layer.alert("发生错误");
				// }
			},
			error : function(data) {
			}
		})
	})
}

function search() {
	if ($("#xxfs_dxlx-input").val() == '全部(除建德)') {

	} else if ($("#xxfs_dxlx-input").val() === '公司') {
		$("#xxfs_dx_text").val('');
		$("#xxfs_dx-comboBox").find('.iFList').html("");
		$.ajax({
			url : basePath + 'xxfs/findgs',
			type : 'post',
			data : 'postData={"comp_name":"' + $("#xxfs_dx-tj").val() + '"}',
			dataType : "json",
			success : function(data) {
				$("#xxfs_dx-comboBox").find('.iFList').html("");
				for (var i = 0; i < data.length; i++) {
					var gss = "<li data-value='" + data[i].COMP_NAME + "'>"
							+ data[i].COMP_NAME + "</li>";
					$("#xxfs_dx-comboBox").find('.iFList').append(gss);
				}
				addEventComboBoxList('#xxfs_dx-comboBox');
			},
			error : function(data) {
			}
		})
	} else if ($("#xxfs_dxlx-input").val() === '集团') {
		$("#xxfs_dx_text").val('');
		// $("#xxfs_dx-comboBox").find('.iFList').html("");
//		$("#xxfs_dx-comboBox").find('.iFList').append('<li data-value="1">呵呵</li>');
		$.ajax({
			url : basePath + 'xxfs/findjt',
			type : 'post',
			data : 'postData={"owner_name":"' + $("#xxfs_dx-tj").val() + '"}',
			dataType : "json",
			success : function(data) {
				$("#xxfs_dx-comboBox").find('.iFList').html("");
				for (var i = 0; i < data.length; i++) {
					var gss = "<li data-value='" + data[i].OWNER_NAME + "'>"
							+ data[i].OWNER_NAME + "</li>";
					$("#xxfs_dx-comboBox").find('.iFList').append(gss);
				}
				addEventComboBoxList('#xxfs_dx-comboBox');
			},
			error : function(data) {
			}
		})
	} else if ($("#xxfs_dxlx-input").val() === '单车') {
		$("#xxfs_dx_text").val('');
		$("#xxfs_dx-comboBox").find('.iFList').html("");
		$.ajax({
			url : basePath + 'xxfs/findcl',
			type : 'post',
			data : 'postData={"vehi_no":"' + $("#xxfs_dx-tj").val() + '"}',
			dataType : "json",
			success : function(data) {
				$("#xxfs_dx-comboBox").find('.iFList').html("");
				for (var i = 0; i < data.length; i++) {
					var gss = "<li data-value='" + data[i].VEHI_NO + "'>"
							+ data[i].VEHI_NO + "</li>";
					$("#xxfs_dx-comboBox").find('.iFList').append(gss);
				}
				addEventComboBoxList('#xxfs_dx-comboBox');
			},
			error : function(data) {
			}
		})
	}
}

$(function() {
	$("#xxfs_dx-tj").attr('disabled', 'disabled');
	$("#xxfs_dx_text").attr('disabled', 'disabled');
	$("#xxfs_dx_search").attr('disabled', 'disabled');
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
							$("#xxfs-upd").off('click').on('click',function() {
								xxfsDialog.show().then(function() {
									$("#xxfseditor_tuichu").off('click').on('click',function() {
											xxfsDialog.hide();
									})
									console.log(nr);
									$("#xxfseditor_btn").text('修改');
									$("#xxfs_xx").val(nr);
									$("#xxfseditor_btn").off('click').on('click',function() {
										if ($("#xxfs_xx").val() === "") {
											layer.alert("请输入消息内容");
										} else {
											$.ajax({
												url : basePath+ 'xxfs/msgupdate',
												type : 'post',
												data : 'postData={"id":"'+ id+ '","nr":"'+ $("#xxfs_xx").val()+ '"}',
												dataType : "json",
												success : function(data) {
													if (data.msg === "修改成功") {
														layer.msg(data.msg);
														xxfsDialog.hide();
														Refresh();
													} else {
														layer.alert("发生错误");
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
							$("#xxfs-del").off('click').on('click', function() {
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
		$("#xxfs-xxnr").text($(this).text())
	});

	$("#xxfs-add").off('click').on('click', function() {
		xxfsDialog.show().then(function() {
			$("#xxfseditor_tuichu").off('click').on('click', function() {
				xxfsDialog.hide();
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
								xxfsDialog.hide();
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
	$("#xxfs-upd").off('click').on('click', function() {
		layer.alert("请选择一条消息内容进行修改");
	})
	$("#xxfs-del").off('click').on('click', function() {
		layer.alert("请选择一条消息内容删除");
	})
}
