var protocol = require("./protocol.js")
	, facilityManager = require("../middleware/facility_manager/facilityManager.js");



function DataBuffer(){
    this.buffer = new Array();
}
DataBuffer.prototype = {
    push: function(index,arg){ 
        if( typeof(this.buffer[index]) == 'undefined' )
        {
            this.buffer[index] = new Array();
        }
        this.buffer[index].push(arg);
    },
    clear: function(){
    	this.buffer = new Array();
    }
}
var dev_stat_buf = new DataBuffer();

function parseDataframe(data)
{
	var cmd0,cmd1,DATA;
	var framebuffer = data;

	console.log(data);
	if( dataframe(data,'SOP') != protocol.sop() )
	{
		console.log("data format invalid: SOP error...");
		return;
	}
	if( dataframe(data,'LEN') != dataframe(data,'DATA_LEN') )
	{
		console.log("data format invalid: LEN error...");
		return;
	}
	if( dataframe(data,'FCS') != getFCS(data) )
	{
		console.log("data format invalid: FCS error... " + getFCS(data));
		return;
	}

	cmd0 = dataframe(data,'CMD0');
	cmd1 = dataframe(data,'CMD1');
	DATA = dataframe(data,'DATA');

	console.log(DATA);
	parseInfo(cmd0,cmd1,DATA);
}

/* function:
* input: 
* output:
*/
function parseIncomingData(data)
{
	var buffer= data;
	var frame_temp;
	var data_num = 0;
	var sop_index = 0;
	var temp_length;
	

	var i=3;
	//console.log("parsing data frame");
	dev_stat_buf.clear();
	while(buffer.length>0)
	{
		if( dataframe(buffer,'SOP') != protocol.sop() )
		{
			console.log("data format invalid: SOP error...");
			break;
		}
		temp_length = dataframe(buffer,'LEN');			//get the length of the first frame in the buffer
		if( (temp_length+5) <= buffer.length )			//if there are more than one frame in the buffer
		{
			frame_temp = buffer.slice(0,(temp_length+5));	//access the first frame in the buffer
			sop_index += (temp_length+5);					//shift the sop index to the next frame's sop
			buffer = data.slice(sop_index);					//access the remaining buffer
			data_num++;										//count the data frame number
			//console.log(frame_temp);
			//parseDataframe(frame_temp,local);
			parseDataframe(frame_temp);
		}
		else 												//if its the only frame left in the buffer
		{
			//console.log("last frame....");
			//console.log(buffer);
			frame_temp = buffer.slice(0,(temp_length+5));	//access the first frame in the buffer
			sop_index += (temp_length+5);					//shift the sop index to the next frame's sop
			buffer = data.slice(sop_index);					//access the remaining buffer
			data_num++;										//count the data frame number
			console.log(frame_temp);
			
			parseDataframe(frame_temp);
			break;
		}
	}
	for(var room in dev_stat_buf.buffer)
	{
		facilityManager.updateDevice(room,dev_stat_buf.buffer[room],function(){
		});
	}

}

function parseInfo_old(cmd0,cmd1,data,local)
{
	var room = cmd0;
	switch(cmd1)
	{
		case protocol.cmd1('AIR_TEMP_SV'):   local.saveData(room,'air_sv',data[0]); break;
        case protocol.cmd1('FLOOR_TEMP_SV'): local.saveData(room,'floor_sv',data[0]); break;
        case protocol.cmd1('AIR_TEMP_PV'):   local.saveData(room,'air_pv',data[0]*100+data[1]); break;
        case protocol.cmd1('FLOOR_TEMP_PV'): local.saveData(room,'floor_pv',data[0]*100+data[1]); break;

        case protocol.cmd1('RELAY_STATE'):   break;
		case protocol.cmd1('RELAY_SET'):     break;
		case protocol.cmd1('SLEEP_MODE'):    break;

        case protocol.cmd1('TIMER_AUTO_ON'):
        	local.saveData(room,'auto_on_ena',data[0] ? true: false);
        	local.saveData(room,'on_hour',data[1]);
        	local.saveData(room,'on_min',data[2]);
        break;

        case protocol.cmd1('TIMER_AUTO_OFF'):
        	local.saveData(room,'auto_off_ena',data[0] ? true: false);
			local.saveData(room,'off_hour',data[1]);
        	local.saveData(room,'off_min',data[2]);
        break;

        case protocol.cmd1('PRIORITY'):

        break;

        case protocol.cmd1('POWER_ON_OFF'): local.saveData(room,'power',data[0]  ? true: false); break;
	}
}

function parseInfo(cmd0,cmd1,data)
{
	var room = cmd0;
	var temp = {};
	temp['deviceID'] = 0;
	switch(cmd1)
	{
		case protocol.cmd1('AIR_TEMP_SV'): {
			temp['parameter'] = [,,,,];
			temp['parameter'][0]=data[0];
			break;
		}
        case protocol.cmd1('FLOOR_TEMP_SV'):{
			temp['parameter'] = [,,,,];
			temp['parameter'][1]=data[0];
			break;
		}
        case protocol.cmd1('AIR_TEMP_PV'):{
			temp['parameter'] = [,,,,];
			temp['parameter'][2]=data[0]*100+data[1]; break;
		}   
        case protocol.cmd1('FLOOR_TEMP_PV'):{
			temp['parameter'] = [,,,,];
			temp['parameter'][3]=data[0]*100+data[1]; break;
		} 
        case protocol.cmd1('RELAY_STATE'):   break;
		case protocol.cmd1('RELAY_SET'):     break;
		case protocol.cmd1('SLEEP_MODE'):    break;

        case protocol.cmd1('TIMER_AUTO_ON'):{
        	temp['autoOn'] = {};
        	temp['autoOn']['enable'] = data[0] ? true: false;
        	if(data[0])
        	{
        		var date = new Date();
				date.setHours(data[1],data[2],0);
				temp['autoOn']['time'] = date;
        	};
        	break;
        }
        case protocol.cmd1('TIMER_AUTO_OFF'):{
        	temp['autoOff'] = {};
        	temp['autoOff']['enable'] = data[0] ? true: false;
        	if(data[0])
        	{
        		var date = new Date();
				date.setHours(data[1],data[2],0);
				temp['autoOff']['time'] = date;
        	};
        	break;
        }


        case protocol.cmd1('PRIORITY'):

        break;

        case protocol.cmd1('POWER_ON_OFF'):{
        	temp['running'] = data[0]  ? true: false;
        	break;
        }
	}
	dev_stat_buf.push(room,temp);
}

function setConfig()
{
	var tmp = 0xAA;
	var buff = new Buffer(1);
	buff.writeUInt8(protocol.cmd_len('TIMER_AUTO_OFF_LEN'),0);
	client.write(buff);
}

function getFCS(data)
{
    var ret,i;
    ret = data[1];
    for(i = 2; i < data.length-1; i++)
    {
        ret ^= data[i];
    }
    return ret;
}

function dataframe(data,index)		//parse the dataframe according to the index
{
	switch(index)
	{
		case 'SOP': 	return data[0];break;
		case 'LEN': 	return data[1];break;
		case 'CMD0': 	return data[2];break;
		case 'CMD1': 	return data[3];break;
		case 'DATA': 	return data.slice(4,4+data[1]);break;
		case 'DATA_LEN':return (data.length-5);break;
		case 'FCS': 	return data[data.length-1];break;
	}
}

function setTemperature(room, cmd, temp)
{
	var buff = new Buffer(6);

	buff.writeUInt8(protocol.sop(),0);							//header SOP
	buff.writeUInt8(protocol.cmd_len('FLOOR_TEMP_SV_LEN'),1 );	//len    LEN
	buff.writeUInt8(room,2);									//room NO CMD0
	if( cmd == protocol.cmd1('AIR_TEMP_SV'))					//command CMD1
	{
		buff.writeUInt8(protocol.cmd1('AIR_TEMP_SV'),3);
	}	
	else if( cmd == protocol.cmd1('FLOOR_TEMP_SV') )
	{
		buff.writeUInt8(protocol.cmd1('FLOOR_TEMP_SV'),3);
	}
	buff.writeUInt8(temp,4);									//temperature DATA
	buff.writeUInt8(getFCS(buff),5);

	return buff;
}
function setAutoON(room, ena, hour, min)
{
	var buff = new Buffer(8);

	ena = ((typeof(ena) == 'undefined') ? 0 : ena);
	hour = ((typeof(hour) == 'undefined') ? 0 : hour);
	min = ((typeof(min) == 'undefined') ? 0 : min);

	buff.writeUInt8(protocol.sop(),0);								//header SOP
	buff.writeUInt8(protocol.cmd_len('TIMER_AUTO_ON_LEN'),1 );		//len    LEN
	buff.writeUInt8(room,2);										//room NO CMD0
	buff.writeUInt8(protocol.cmd1('TIMER_AUTO_ON'),3 );       	//command   CMD1
	if( ena == 1 )													//data if the command DATA
	{
		buff.writeUInt8(protocol.timer_auto_on('AUTO_ON_ENABLE'),4);//enable the auto-on mode
		buff.writeUInt8(hour,5);									//hours
		buff.writeUInt8(min,6);										//minutes
	}	
	else
	{
		buff.writeUInt8(protocol.timer_auto_on('AUTO_ON_DISABLE'),4);//enable the auto-on mode
		buff.writeUInt8(0,5);										//hours
		buff.writeUInt8(0,6);										//minutes
	}
	buff.writeUInt8(getFCS(buff),7);								//FCS

	return buff;
}

function setAutoOFF(room, ena, hour, min)
{
	var buff = new Buffer(8);

	ena = ((typeof(ena) == 'undefined') ? 0 : ena);
	hour = ((typeof(hour) == 'undefined') ? 0 : hour);
	min = ((typeof(min) == 'undefined') ? 0 : min);

	buff.writeUInt8(protocol.sop(),0);								//header SOP
	buff.writeUInt8(protocol.cmd_len('TIMER_AUTO_OFF_LEN'),1 );		//len    LEN
	buff.writeUInt8(room,2);										//room NO CMD0
	buff.writeUInt8(protocol.cmd1('TIMER_AUTO_OFF'),3);       		//command   CMD1
	
	if( ena == 1 )													//data if the command DATA
	{
		buff.writeUInt8(protocol.timer_auto_off('AUTO_OFF_ENABLE'),4);		//enable the auto-off mode
		buff.writeUInt8(hour,5);									//hours
		buff.writeUInt8(min,6);										//minutes
	}	
	else
	{
		buff.writeUInt8(protocol.timer_auto_off('AUTO_OFF_DISABLE'),4);		//enable the auto-on mode
		buff.writeUInt8(0,5);										//hours
		buff.writeUInt8(0,6);										//minutes
	}
	buff.writeUInt8(getFCS(buff),7);	
	//buff.writeUInt8(5,7);											//FCS

	return buff;
}

function setSleepMode(room, ena, on_hour, on_min, off_hour, off_min, temp)
{
	var buff = new Buffer(11);

	ena = ((typeof(ena) == 'undefined') ? 0 : ena);
	on_hour = ((typeof(on_hour) == 'undefined') ? 0 : on_hour);
	on_min = ((typeof(on_min) == 'undefined') ? 0 : on_min);
	off_hour = ((typeof(off_hour) == 'undefined') ? 0 : off_hour);
	off_min = ((typeof(off_min) == 'undefined') ? 0 : off_min);
	temp = ((typeof(temp) == 'undefined') ? 0 : temp);

	buff.writeUInt8(protocol.sop(),0);							//header SOP
	buff.writeUInt8(protocol.cmd_len('SLEEP_MODE_LEN'),1 );		//len    LEN
	buff.writeUInt8(room,2);									//room NO CMD0
	buff.writeUInt8(protocol.cmd1('SLEEP_MODE'),3);			//command CMD1
	if( ena == 1 )												//data of the command DATA
	{
		buff.writeUInt8(protocol.sleep_mode('SLEEP_MODE_ON'),4);	//enable the auto-on mode
		buff.writeUInt8(on_hour,5);								//turn-on mode hour
		buff.writeUInt8(on_min,6);								//turn-on mode minutes
		buff.writeUInt8(off_hour,7);							//turn-off mode hours
		buff.writeUInt8(off_min,8);								//turn-off mode minutes
		buff.writeUInt8(temp,9);								//the specific temperature
	}	
	else
	{
		buff.writeUInt8(protocol.sleep_mode('SLEEP_MODE_OFF'),4);	//enable the auto-on mode
		buff.writeUInt8(0,5);								//turn-on mode hour
		buff.writeUInt8(0,6);								//turn-on mode minutes
		buff.writeUInt8(0,7);								//turn-off mode hours
		buff.writeUInt8(0,8);								//turn-off mode minutes
		buff.writeUInt8(0,9);								//the specific temperature
	}
	buff.writeUInt8(getFCS(buff),10);						//FCS

	return buff;
}

function setPriority(char,char)
{

}

function powerOn(room)
{
	var buff = new Buffer(6);

	buff.writeUInt8(protocol.sop(),0);							//header SOP
	buff.writeUInt8(protocol.cmd_len('POWER_ON_OFF_LEN'),1 );	//len    LEN
	buff.writeUInt8(room,2);									//room NO CMD0
	buff.writeUInt8(protocol.cmd1('POWER_ON_OFF'),3);			//command CMD1
	buff.writeUInt8(protocol.power_on_off('POWER_ON'),4);		//data of the command DATA
	buff.writeUInt8(getFCS(buff),5);							//FCS

	return buff;
}
function powerOff(room)
{
	var buff = new Buffer(6);

	buff.writeUInt8(protocol.sop(),0);							//header SOP
	buff.writeUInt8(protocol.cmd_len('POWER_ON_OFF_LEN'),1 );	//len    LEN
	buff.writeUInt8(room,2);									//room NO CMD0
	buff.writeUInt8(protocol.cmd1('POWER_ON_OFF'),3);			//command CMD1
	buff.writeUInt8(protocol.power_on_off('POWER_OFF'),4);		//data of the command DATA
	buff.writeUInt8(getFCS(buff),5);							//FCS

	return buff;
}

exports.parseIncomingData = parseIncomingData;
exports.setConfig = setConfig;
exports.setTemperature = setTemperature;
exports.setAutoON = setAutoON;
exports.setAutoOFF = setAutoOFF;
exports.setSleepMode = setSleepMode;
exports.setPriority = setPriority;
exports.powerOn = powerOn;
exports.powerOff = powerOff;