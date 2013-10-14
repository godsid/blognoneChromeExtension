var notificationUrl = 'http://srihawong.info/app/blognone/register.php';

chrome.runtime.onInstalled.addListener(function(obj){
	Debug("Installed");
	createDatabase();
	//createNotification({icon:"images/icon128.png",title:"Welcome Edtguide Notification"});
	var t = new Date().getTime();
	query("INSERT INTO notification(id,type,data,time,url,reading) VALUES(null,'content','{\"type\":\"content\",\"icon\":\"http://www.blognone.com/sites/default/files/imagecache/news-thumbnail/category_pictures/xiaomi.png\",\"title\":\"(ลือ) Xiaomi มีแผนวางขายนาฬิกาอัจฉริยะ (smartwatch) ภายในปีนี้\",\"desc\":\"ปีนี้เป็นปีทองของ Xiaomi จริงๆ ครับ นอกจากจะร่วมมือกับ Tencent เปิดตัวมือถือ Red Rice, เปิดตัว Xiaomi MI3 และ MiTV, รวมทั้งการคว้าตัว Hugo Barra ไปร่วมงานในปีนี้ไปแล้ว ยังมีข่าวลือที่น่าจับตา\",\"url\":\"http://www.blognone.com/node/49537\",\"id\":1381038419829}',"+t+",'http://www.blognone.com/node/49537','false')");
	query("INSERT INTO notification(id,type,data,time,url,reading) VALUES(null,'content','{\"type\":\"content\",\"icon\":\"http://www.blognone.com/sites/default/files/imagecache/news-thumbnail/category_pictures/logo-cth-new.png\",\"title\":\"CTH ร่วมมือกับ DSI จับผู้ค้ากล่อง Android TV Box กลางงาน TME 2013\",\"desc\":\"เมื่อวานนี้ วันสุดท้ายของงานมหกรรมมือถือปลายปีอย่าง Thailand Mobile Expo (TME) 2013 ที่ศูนย์ประชุมแห่งชาติสิริกิติ์ CTH ได้ร่วมมือกับ DSI พร้อมทนายความของบริษัทบุกจับผู้ค้ารายหนึ่ง ที่จำหน่ายกล่อง Android TV Box ที่สามารถรับชมสัญญาณของ CTH ได้แบบละเมิดลิขสิทธิ์\",\"url\":\"http://www.blognone.com/node/49534\",\"id\":1381038802039}',"+t+",'http://www.blognone.com/node/49534','false')");
	query("INSERT INTO notification(id,type,data,time,url,reading) VALUES(null,'content','{\"type\":\"content\",\"icon\":\"http://www.blognone.com/sites/default/files/imagecache/news-thumbnail/category_pictures/Bitcoin.png\",\"title\":\"ผู้ใช้ BitCoin บริจาคเงินเข้าบัญชี Silk Road ประท้วงการจับกุม\",\"desc\":\"หลังการจับกุมผู้ดูแล Silk Road นอกจากเว็บที่ซ่อนไว้ใน Tor จะถูกยึดไปแล้ว ยังมีบัญชี BitCoin หมายเลข  1F1tAaz5x1HUXrCNLbtMDqcw6o5GNn4xqX ถูกยึดไปพร้อมกันในบัญชีนี้มีเงินอยู่ 27,365.90938687 BTC มูลค่ารวมกว่าร้อยล้านบาท ผู้ใช้ BitCoin จำนวนหนึ่งจึงประท้วงการจับกุมครั้งนี้ด้วยการโอนเงินเข้าบัญชีนี้ครั้งละน้อยๆ แล้วใส่ข้อความสาธารณะไว้ในการโอนเพื่อประท้วง\",\"url\":\"http://www.blognone.com/node/49529\",\"id\":1381038921052}',"+t+",'http://www.blognone.com/node/49529','false')");
	query("INSERT INTO notification(id,type,data,time,url,reading) VALUES(null,'content','{\"type\":\"content\",\"icon\":\"http://www.blognone.com/sites/default/files/imagecache/news-thumbnail/news-thumbnails/wordament.png\",\"title\":\"ครั้งแรกสำคัญเสมอ ไมโครซอฟท์ออกเกมตัวแรกบน Android\",\"desc\":\"ที่ผ่านมาไมโครซอฟท์ออกแอพหลายตัวบน Android แต่ส่วนใหญ่มักเป็นแอพที่ใช้คู่กับบริการอื่นๆ ของไมโครซอฟท์ เช่น Xbox, Lync, SkyDrive\",\"url\":\"http://www.blognone.com/node/49527\",\"img\":\"https://lh6.ggpht.com/nDIAIgu3rUPDwNH1dbReEfzXGpqLSi9EuiGx2kE69eEge8KQflG1O2LWK5oXw8v1cA=w320\",\"id\":1381039123830}',"+t+",'http://www.blognone.com/node/49527','false')");

});

chrome.runtime.onUpdateAvailable.addListener(function(obj){
	Debug("Update Version");
});

// Allow notification
if (window.webkitNotifications){
	if (window.webkitNotifications.checkPermission() == 1) { // 0 is PERMISSION_ALLOWED
		window.webkitNotifications.requestPermission();
  }
}
/* Register device*/
var registerDevice = function(){
	Debug("registerDevice");
	chrome.pushMessaging.getChannelId(true,function(ch){
		var name = (typeof localStorage.user=='undefined')?'guest':localStorage.user;
		var email = (typeof localStorage.email=='undefined')?'guest@blognone.com':localStorage.email;
		Debug("ChannelId: "+ch.channelId+", Name: "+name+", Email: "+email);
		$.post(notificationUrl,{
			"udid":ch.channelId,
			"deviceToken":"not token",
			"appid":3,
			"username":name,
			"type":"chrome",
			"appname":"blognone",
			"email":email
		});
	});
};
// Push Process
Debug("pushMessaging Listener");
chrome.pushMessaging.onMessage.addListener(pushReceive);
//Received push data
registerDevice();
//Received push data
function pushReceive(data){
	Debug("Push Receive");
	addBadge();
	switch(data.subchannelId){
		case 0://with data
			//type|icon|title|desc|url|sound
			data.payload = data.payload.split("|");
			createNotification({
					type:data.payload[0],
					icon:data.payload[1],
					title:data.payload[2],
					desc:data.payload[3],
					url:data.payload[4],
					sound:data.payload[5],
					click:function(resp){
					}
			});
			break;
		case 1://with url
			getPushData(data.payload);
			break;
		case 2:
		case 3:
		default:
			break;
	}
};
function getPushData(url){
	$.get(url,function(resp){
			resp.id = new Date().getTime();
			var sql = "INSERT INTO notification(id,type,data,time,url,reading) VALUES(null,'"+resp.type+"','"+JSON.stringify(resp)+"',"+resp.id+",'"+resp.url+"','false')";
			if(typeof resp.img =='undefined'){
				resp.notifytype = "basic";
			}else{
				resp.notifytype = "image";
			}
			 
			query(sql);
			if(!notifications.length){
				createNotificationByType(resp);
			}
			notifications.push(resp);
	});
};
chrome.notifications.onClicked.addListener(function(id){
		chrome.notifications.clear(id,function(){});
		chrome.tabs.create({url:e.url});
});
chrome.notifications.onClosed.addListener(function(id){
		e = notifications.shift();
		clearTimeout(e.timeout);
		chrome.notifications.clear(id,function(){});
		if(notifications.length){
			createNotificationByType(notifications[0]);
		}
});

//pushReceive({subchannelId :1,payload:"http://srihawong.info/app/chrome/getdata.php"});
//pushReceive({subchannelId :0,payload:"|http://ed.files-media.com/di/logo.png|Review:AKA YAKINIKU|การหาช่วงเวลาพิเศษ ในมุมพิเศษ เพื่อเติมช่วงเวลาแห่งความสุข และความผูกพันกับคนในครอบครัวนั้น ถือเป็นโจทย์อย่างหนึ่งที่ต้องพิถีพิถันเลือกกัน...|http://review.edtguide.com/405793_|"})
//pushReceive({type:"url",title:"อิ่มบุญ-อิ่มใจ",desc:"การหาช่วงเวลาพิเศษ ในมุมพิเศษ เพื่อเติมช่วงเวลาแห่งความสุข และความผูกพันกับคนในครอบครัวนั้น ถือเป็นโจทย์อย่างหนึ่งที่ต้องพิถีพิถันเลือกกันหน่อย ซึ่งสำหรับเราแล้วชอบที่จะหาร้านอร่อยๆ มีของคุณภาพแบบจัดเต็ม ในบรรยากาศที่ชวนให้รู้สึกครื้นเครง"});
//pushReceive({icon:"http://ed.files-media.com/di/logo.png",title:"อิ่มบุญ-อิ่มใจ",desc:"การหาช่วงเวลาพิเศษ ในมุมพิเศษ เพื่อเติมช่วงเวลาแห่งความสุข และความผูกพันกับคนในครอบครัวนั้น ถือเป็นโจทย์อย่างหนึ่งที่ต้องพิถีพิถันเลือกกันหน่อย ซึ่งสำหรับเราแล้วชอบที่จะหาร้านอร่อยๆ มีของคุณภาพแบบจัดเต็ม ในบรรยากาศที่ชวนให้รู้สึกครื้นเครง"});