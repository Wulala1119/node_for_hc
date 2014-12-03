var mongoose = require( 'mongoose' );
var dbURL = 'mongodb://localhost/MongoosePM';

mongoose.connect(dbURL);

mongoose.connection.on('connected',function () {
	console.log('Mongoose connected to ' + dbURL);
});

mongoose.connection.on('error',function (err) {
	console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function () {
	console.log('Mongoose disconnected');
});

process.on('SIGINT', function() {
		mongoose.connection.close(function () {
		console.log('Mongoose disconnected through app termination');
		process.exit(0);
	});
});

/*********************************************
      USER SCHEMA
 *********************************************/
var userSchema = new mongoose.Schema({
	userID: { type:String, unique:true },
	password: String,
	name: String,
	permission: Number,
	login: { type: Boolean, default: false },
	modifiedOn: { type: Date, default: Date.now },
	createdOn: { type: Date, default: Date.now },
	lastLogin: { type: Date, default: Date.now }
});
mongoose.model( 'User', userSchema );


/*********************************************
      DEVICE SCHEMA
 *********************************************/
var deviceSchema =new mongoose.Schema({
	deviceID: Number,
	type: String,
	status: {
		running: { type:Boolean, default: false },
		parameter:[],
		autoOn: { enable: { type:Boolean, default: false },
				  time : Date
				},
		autoOff:{ enable: { type:Boolean, default: false },
				  time: Date
				}	
		}
});

/*********************************************
      ROOM SCHEMA
 *********************************************/
var roomSchema =new mongoose.Schema({
	roomID: Number,
	name: String,
	devices: [deviceSchema]
});
mongoose.model( 'Room', roomSchema );
