var webPush = require('web-push');
 
const vapidKeys = {
	"publicKey": "BDjS8tSnOJ10TfQqVWdw2zjp2i5RaLzCy6H4KLNdAW4exuRvjicsF9C7DCYWpp-sDztKnSJ7nEV-6hwiO_Vk_cc",
	"privateKey": "cMXERs5noiOD3KfxnWfcO7EoaXCS-BMcb6kA8ykbsnc"
};
 
 
webPush.setVapidDetails(
	'mailto:samgalaxy111111@gmail.com',
	vapidKeys.publicKey,
	vapidKeys.privateKey
)
var pushSubscription = {
	"endpoint": "https://fcm.googleapis.com/fcm/send/czR-R6i66rA:APA91bGm8tXomtqCrbvxhOZ776R9DjS6IRzYqoMxtomBtBdII9No6Xh0JccXmQvZWs59GMs0-NoAuwWij3oDQoJ8FgSjd03geqEsFtQEGDsbebdMbYz3KDUnaoQxH1g9uKSZqPCKRglX",
	"keys": {
		"p256dh": "BDVG6N6yCcni8b11DcVabyGawkxIYEej8djt3bhsAam5UT4RMV2Qs827xtRPyV1O8EVYZmuZ9grQ7AyeZjAsvwU=",
		"auth": "gdXbTH3u3TOKRZsAiEZpvQ=="
	}
};
var payload = 'Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!';
 
var options = {
	gcmAPIKey: '275173603235',
	TTL: 60
};
webPush.sendNotification(
	pushSubscription,
	payload,
	options
);