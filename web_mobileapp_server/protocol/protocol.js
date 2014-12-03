var SOP =0xFE;        //Datagtam header
function sop()
{
	return SOP;
}
var CMD1 = {};
CMD1['AIR_TEMP_SV'] = 0x01;    //air temperature set value
CMD1['FLOOR_TEMP_SV'] = 0x02;    //floor temperature set value
CMD1['AIR_TEMP_PV'] = 0x03;    //air temperature present value
CMD1['FLOOR_TEMP_PV'] = 0x04;    //floor temperature present value
CMD1['RELAY_STATE'] = 0x05;    //state of the relay in the current period
CMD1['RELAY_SET'] = 0x06;    //turn on or turn off the state
CMD1['SLEEP_MODE'] = 0x07;    //sleeping mode setting
CMD1['TIMER_AUTO_ON'] = 0x08;    //settings for turn-on timer
CMD1['TIMER_AUTO_OFF']= 0x09;    //settings for turn-off timer
CMD1['PRIORITY'] = 0x0A;    //priority settings
CMD1['POWER_ON_OFF'] = 0xFF;    //power on or off	dgram.Socket(type, listener);
function cmd1(key)
{
	return CMD1[key];
}

var CMD_LEN = {};
CMD_LEN['AIR_TEMP_SV_LEN'] = 0x01;    //air temperature set value
CMD_LEN['FLOOR_TEMP_SV_LEN'] = 0x01;    //floor temperature set value
CMD_LEN['AIR_TEMP_PV_LEN'] = 0x02;   //air temperature present value
CMD_LEN['FLOOR_TEMP_PV_LEN'] = 0x02;   //floor temperature present value
CMD_LEN['RELAY_STATE_LEN'] = 0x01;    //state of the relay in the current period
CMD_LEN['RELAY_SET_LEN'] = 0x01;    //turn on or turn off the state
CMD_LEN['SLEEP_MODE_LEN'] = 0x06;    //sleeping mode setting
CMD_LEN['TIMER_AUTO_ON_LEN'] = 0x03;   //settings for turn-on timer
CMD_LEN['TIMER_AUTO_OFF_LEN'] = 0x03;    //settings for turn-off timer
CMD_LEN['PRIORITY_LEN'] = 0x01;    //priority settings
CMD_LEN['POWER_ON_OFF_LEN'] = 0x01;    //power on or off
function cmd_len(key)
{
	return CMD_LEN[key];
}

//************parameters functions and meanings************//
//************* RELAY_STATE/RELAY_SET relay state***************//
var RELAY_STATE = {};
RELAY_STATE['RELAY_ON'] = 0x01;
RELAY_STATE['RELAY_OFF'] = 0x00;
function relay_state(key)
{
	return RELAY_STATE[key];
}

//*************SLEEP_MODE sleep mode settings***************//
var SLEEP_MODE = {};
SLEEP_MODE['SLEEP_MODE_OFF'] = 0x00;
SLEEP_MODE['SLEEP_MODE_ON'] = 0x01;
function sleep_mode(key)
{
	return RELAY_STATE[key];
}

//*************TIMER_AUTO_ON auto-on timer setting**********//
var TIMER_AUTO_ON = {};
TIMER_AUTO_ON['AUTO_ON_ENABLE'] = 0x01;
TIMER_AUTO_ON['AUTO_ON_DISABLE'] = 0x00;
function timer_auto_on(key)
{
	return TIMER_AUTO_ON[key];
}

//*************TIMER_AUTO_OFF auto-off timer setting************//
var TIMER_AUTO_OFF = {};
TIMER_AUTO_OFF['AUTO_OFF_ENABLE'] = 0x01;
TIMER_AUTO_OFF['AUTO_OFF_DISABLE'] = 0x00;
function timer_auto_off(key)
{
	return TIMER_AUTO_OFF[key];
}

//*************POWER_ON_OFF power off or on**********//
var POWER_ON_OFF = {};
POWER_ON_OFF['POWER_OFF'] = 0x00;
POWER_ON_OFF['POWER_ON'] = 0x01;
function power_on_off(key)
{
	return POWER_ON_OFF[key];
}

exports.sop = sop;
exports.cmd1 = cmd1;
exports.cmd_len = cmd_len;
exports.relay_state = relay_state;
exports.timer_auto_on = timer_auto_on;
exports.sleep_mode = sleep_mode;
exports.timer_auto_off = timer_auto_off;
exports.power_on_off = power_on_off;



