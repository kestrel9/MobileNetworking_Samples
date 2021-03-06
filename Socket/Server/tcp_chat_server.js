var net = require('net');

var sockets = [];

var server = net.createServer(function (socket) {
   var name = 'Guest' + Math.floor(Math.random()*100);
   socket.name = name;
   // Connection Event
   console.log('Remote Address : ', socket.remoteAddress);
   
   // 클라이언트와 접속한 소켓을 채팅 클라이언트 목록에 추가
   sockets.push(socket);      
   socket.write('Welcome to TCP Chat Service\n');
   socket.write('당신의 이름은 ' + name + ' 입니다.\n');

   socket.on('data', function (data) {
      var message = data.toString('UTF-8');
      if ( message.indexOf('\\rename') != -1 ) {
         const oldName = socket.name;
         const newName = message.split(' ')[1];
         socket.name = newName;
         socket.write('이름 변경 성공\n');
         sockets.forEach(function (item) {
            if ( item !== socket ) {
               item.write(oldName + "님이 " + newName + "으로 이름 변경\n");   
            }            
         });
      }
      else {
         console.log(socket.name + ' << ' + message);      
         sockets.forEach(function (item) {
            item.write(socket.name + ' >> ' + message);
         });
      }
   });

   socket.on('end', function () {
      console.log('connection end')
      // 소켓 목록에서 삭제
      var index = sockets.indexOf(socket);
      sockets.splice(index, 1);
   });
});

server.listen(3000);

// 서버 IP 주소 얻기
var serverIp = require('./serverIp');

console.log('TCP Chat server is running on ' + serverIp.getIPAddress() + ':3000');