var mongo = require('mongodb').MongoClient,
	client = require('socket.io').listen(3000).sockets;


mongo.connect('mongodb://127.0.0.1/chat',function(err , db ){
	if(err) throw err;


client.on('connection',function(socket) {
	
	console.log('some one has connected ...');


	var col = db.collection('message'),
		sendStatus = function(s){
			socket.emit('status',s);
		};
	
	
	
	// emit all messages
	
	
	col.find().limit(100).sort({_id: 1}).toArray(function(err,res){
		if(err) throw err;
		
		socket.emit('output',res);
		
	});
	
	
	
	
	// wait for input
	
	
	socket.on('input',function(data) {	
		var name=data.name,
			messagediscription= data.message;
			whiteSpacePattern= /^\s*$/;
			
			if(whiteSpacePattern.test(name) || whiteSpacePattern.test(messagediscription)){
				console.log('invalid');
				sendStatus('Name and message is required');
				
			}
			else{			
			
				col.insert({name:name, messagediscription:messagediscription},function(){
				
				//Emit Latest Message to All Clients.
				
				client.emit('output',[data]);
				
				
				console.log('inserted');
				
					sendStatus({
						message:"Message Sent.",
						clear: true
					});
				
				
				
				});
			}
		});	
	});	
});

