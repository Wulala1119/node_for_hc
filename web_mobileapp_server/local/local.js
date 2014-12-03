function Device(id) {
	this.id = id;
	this.data = {};
	this.data["power"] = true;
	this.data["floor_sv"] = 1;
	this.data["air_sv"] = 2;
	this.data["floor_pv"] = 3;
	this.data["air_pv"] = 4;
	this.data["on_hour"] = 15;
	this.data["on_min"] = 15;
	this.data["off_hour"] = 20;
	this.data["off_min"] = 20;
	this.data["auto_on_ena"] = false;
	this.data["auto_off_ena"] = false;

	//console.log("new devicd id: " + this.id);
};

Device.prototype = {
	getData: function(index) {
		return this.data[index];
		//return 1;
	},
	setData: function(index,temp) {
		this.data[index] = temp;
	}
};

var global_data= {};
global_data[0] = new Device(0);
global_data[1] = new Device(1);

function saveData(index1,index2,temp)
{
	global_data[index1].setData(index2,temp);
}

function getData(index1,index2)
{
	return global_data[index1].getData(index2);
}


exports.global_data = global_data;
exports.saveData = saveData;
exports.getData = getData;

