var notificationUrl = 'http://srihawong.info/app/blognone/register.php';
var getMessageLatest = "";

chrome.runtime.onInstalled.addListener(function(obj){
	Debug("Installed");
	createDatabase();
	//createNotification({icon:"images/icon128.png",title:"Welcome Edtguide Notification"});
	$.get("http://srihawong.info/app/blognone/message.php?appid=1",function(resp){
		for(var i=0;i<resp.length;i++){
			var t = new Date(resp[i].pubDate).getTime();
			query("INSERT INTO notification(id,type,data,time,url,reading) VALUES(null,'content','"+JSON.stringify(resp[i])+"',"+t+",'"+resp[i].url+"','false')");
		}
	});
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

$('body').append('<audio id="NotificationAlert"><source src="sound/alert.mp3" type="audio/mpeg" /></audio>');


//pushReceive({subchannelId :1,payload:"http://srihawong.info/app/blognone/message.php?id=200"});
//pushReceive({subchannelId :0,payload:"|http://ed.files-media.com/di/logo.png|Review:AKA YAKINIKU|การหาช่วงเวลาพิเศษ ในมุมพิเศษ เพื่อเติมช่วงเวลาแห่งความสุข และความผูกพันกับคนในครอบครัวนั้น ถือเป็นโจทย์อย่างหนึ่งที่ต้องพิถีพิถันเลือกกัน...|http://review.edtguide.com/405793_|"})
//pushReceive({type:"url",title:"อิ่มบุญ-อิ่มใจ",desc:"การหาช่วงเวลาพิเศษ ในมุมพิเศษ เพื่อเติมช่วงเวลาแห่งความสุข และความผูกพันกับคนในครอบครัวนั้น ถือเป็นโจทย์อย่างหนึ่งที่ต้องพิถีพิถันเลือกกันหน่อย ซึ่งสำหรับเราแล้วชอบที่จะหาร้านอร่อยๆ มีของคุณภาพแบบจัดเต็ม ในบรรยากาศที่ชวนให้รู้สึกครื้นเครง"});
//pushReceive({icon:"http://ed.files-media.com/di/logo.png",title:"อิ่มบุญ-อิ่มใจ",desc:"การหาช่วงเวลาพิเศษ ในมุมพิเศษ เพื่อเติมช่วงเวลาแห่งความสุข และความผูกพันกับคนในครอบครัวนั้น ถือเป็นโจทย์อย่างหนึ่งที่ต้องพิถีพิถันเลือกกันหน่อย ซึ่งสำหรับเราแล้วชอบที่จะหาร้านอร่อยๆ มีของคุณภาพแบบจัดเต็ม ในบรรยากาศที่ชวนให้รู้สึกครื้นเครง"});