var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
const YQL = require('yql')
var app = express()

app.use(bodyParser.json())
app.set('port', (process.env.PORT || 4000))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.post('/webhook', (req, res) => {
  var text = req.body.events[0].message.text
  var sender = req.body.events[0].source.userId
  var replyToken = req.body.events[0].replyToken
  console.log(text, sender, replyToken)
  console.log(typeof sender, typeof text)
  // console.log(req.body.events[0])

  sendText(sender, '1')
  yql(sender, text, function(data){
    sendText(sender, text);
  });

	res.send(sender, text)
  res.sendStatus(200)
})

function yql(sender, text, callback) {
  var query = new YQL('select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="'+text+'")');
  query.exec(function(err, data) {
      sendText(sender,'2')
      callback(data);
  });
}

function sendText (sender, recivedText) {
  let data = {
    to: sender,
    messages: [
      {
        type: 'text',
        text: recivedText
      }
    ]
  }
  request({
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer KFifFHoe92Tndot2UA3hCtijv9tbHB6q81A30ItcJh+Xq6Dc3ScUBqoU41SsIPVQpViQqJBgtXtxsmqTrYpy4BQFoNTdO3ijn7a0CC27fKVsj3tqynsWT3rDGrM5bEwaCbpURfYc5C6FGTQo/sdPdAdB04t89/1O/w1cDnyilFU='
    },
    url: 'https://api.line.me/v2/bot/message/push',
    method: 'POST',
    body: data,
    json: true
  }, function (err, res, body) {
    if (err) console.log('error')
    if (res) console.log('success')
    if (body) console.log(body)
  })
}

app.listen(app.get('port'), function () {
  console.log('run at port', app.get('port'))
})
