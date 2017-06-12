// create by weiwei

var G_URL_SERVER = getHttpHead(window.location.href) + "apiv1/";

var u = navigator.userAgent,
	app = navigator.appVersion;
var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端或者uc浏览器
var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
var downloadUrl = "";

$(function() {
	// init
	// change btn style to disable
	document.getElementById("downloadBtn").disabled = true;
	document.getElementById("downloadBtn").style.backgroundColor = "gray";

	$('.qr_code_img').attr("src","http://qr.liantu.com/api.php?&bg=F0F6FC&text="+window.location.href);

	var paramStr;

	if(isiOS) {
		paramStr = "pageNo=1&pageSize=100&platform=1";
		$("#cerBtn").show();
		
	} else {
		paramStr = "pageNo=1&pageSize=100&platform=2";
		$("#cerBtn").hide();
	}

	// 查询所有产品最新版本 app/listAllProds
	startHttpRequest("get", "app/listAllProds", paramStr, function(status, message, jsonData) {
		console.log("success");

		var arrOfData = jsonData;

		var dictOfItem;
		for(var i = 0; i < arrOfData.length; i++) {

			if(arrOfData[i].prodType == "1031") {
				dictOfItem = arrOfData[i];
			}
		}

		console.log(dictOfItem);

		if(dictOfItem) {

			downloadUrl = dictOfItem.downloadUrl;

			// change btn style to enable
			document.getElementById("downloadBtn").disabled = false;
			document.getElementById("downloadBtn").style.backgroundColor = "rgba(35,150,255,0.6)"
		} else {

			document.getElementById("tip").hidden = false;
		}
	});
})

function download_btn_click() {

	window.location.href = downloadUrl;
}

function cerBtn_btn_click() {

	window.location.href = getHttpHead(window.location.href) + "cer/pubCer/selfSigned_pubCA.cer";
}

//网络请求入口
function startHttpRequest(method, url, postData, callback) {
	var queryUrl = G_URL_SERVER + url;

	console.log(queryUrl);
	console.log(postData);
	$.ajax({
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		url: queryUrl,
		type: method,
		data: postData,
		cache: false,
		async: true,
		success: function(result) {
			if(1 == result.code) {
				console.log(result);
				callback(result.status, result.message, result.data);
			} else {
				console.log("请求失败")
			}
		},
		error: function(result) {
			console.log(JSON.stringify(result));
		}
	});
}

function getHttpHead(s) {
	var r = new RegExp("(http.*\/\/[^\/]+\/)");
	var a = r.exec(s);
	if(a) {
		return a[1];
	}
}