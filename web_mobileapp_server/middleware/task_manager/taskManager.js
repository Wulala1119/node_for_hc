var task_list = require('./taskList.js');

var util = require('util')								//module to emit signals
	, EventEmitter = require('events').EventEmitter;

var current_task;

task_list.onCurrentTaskChanged(function(){
	//console.log('I know what happended');
	console.log('taskManager: remaining tasks: ' + task_list.getTaskNumber() );
});

task_list.addTask('homer',0, Date.now() + 30*1000);
task_list.addTask('homer',-1, Date.now()+10*1000);
task_list.addTask('lisa',-1, Date.now()+90*1000);
task_list.addTask('bart',50, Date.now()+50*1000);
task_list.addTask('lisa',150, Date.now()+15*1000);
exports.addTask = task_list.addTask;
//console.log(task_list.getTaskList());