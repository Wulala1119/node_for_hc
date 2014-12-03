var util = require('util')								//module to emit signals
	, EventEmitter = require('events').EventEmitter;


///////////////////////////////////////////////////////
//////////////////////TaskEvent Class//////////////////
///////////////////////////////////////////////////////
var TaskEvent = function() {			
	this.self = this;
	setInterval(function(){
		checkingTask();
	},10*1000);				
}
util.inherits(TaskEvent, EventEmitter);

///////////////////////////////////////////////////////
//////////////////////Task Class///////////////////////
///////////////////////////////////////////////////////
function Task(user_id, action, time, priority){
	action = typeof(action) == "undefined" ? -1 : action;	//>0 means set temperature
	time = typeof(time) == "undefined" ? -1 : time;
	priority = typeof(priority) == "undefined" ? 3 : priority;
	this.user_id = user_id;
	this.action = action;
	this.time = time;
	this.priority = priority;
	this.excuting = false;
}
Task.prototype = {
	setTask : function(action, time, priority){
		this.action = action;
		this.time = timer;
		this.priority = priority;
	}
}


var task_event = new TaskEvent();		//expired client checking timer
var current_task;
var task_list = new Array();
var task_number = 0;

/*
* function: add new task to the list
* input: String user_id, user who set the task
*		 Number action, >0 tempature, -1:turn off
*		 Date time, action time
*		 Priority priority, priority of the task
* output: none
*/
exports.addTask = addTask;
function addTask (user_id, action, time, priority) {
	var task = new Task(user_id, action, time, priority);
	var i = isTaskExist(user_id, action);
	var put_it_in_the_end = 1;

	if( i != -1 )					//remove the task
	{
		task_list.splice(i, 1);
	}

	if( task_list.length == 0 )		//empty list
	{
		//console.log('taskList: empty list....');
		task_list.push(task);
		task_event.self.emit('currentTaskChanged');
	}
	else
	{
		for (var j in task_list)		//insert the task by time
		{
			if( task_list[j].time >= time )
			{
				task_list = insertToArray(task_list,task,j);
				put_it_in_the_end = 0;
				if(j==0)	//current task has been changed
				{
					resetExcutingFlag(0);	//reset the old current task's excuting flag 
					task_event.self.emit('currentTaskChanged');
				}

				break;
			}
		}
		if(put_it_in_the_end)
		{
			task_list.push(task);
		}
	}

}

/*
* function: remove a specific task
* input: Number i, index of the task in the task_list
* output: none
*/
exports.removeTask = function(i) {
	task_list.splice(i, 1); 				//remove it
}


/*
* function: return the remainning task number in the list
* input: none
* output: Number task_list.length
*/
exports.getTaskNumber = function() {
	return task_list.length;
}

/*
* function: return the current reservation task
* input: none
* output: Task task_list[0], the first task in the list
*/
exports.currentTask = currentTask;
function currentTask(){
	return task_list[0];
}


/*
* function: return the whole reservation task list
* input: none
* output: Array task_list, the whole task array
 */
exports.getTaskList = function () {
	return task_list;
}

/*
* function: return the tasks of the specific user 
* input: String user_id
* output: Array user_task_list
*/
exports.userTasks = function (user_id) {
	var user_task_list = new Array();
	for (var i in task_list)
	{
		if( task_list[i].user_id == user_id )
		{
			user_task_list = user_task_list.concat(task_list[i]);
		}
	}
	return user_task_list;
}

/*
* function: set up callback function for current task changed event
* input: Function callback
* output: none
*/
exports.onCurrentTaskChanged = function(callback)
{
	task_event.on('currentTaskChanged', function(){
		if(typeof(callback) != 'undefined')
		{
			callback();
		}
		else
		{
			console.log("taskList: currentTaskChanged with no callback...");
		}
	})
}


//////////////////////////////////////////////////////
//////////////////Internal Methods////////////////////
//////////////////////////////////////////////////////
/*
* function: insert a element to a array in a specific position
* input: Array arr, host array
* 		var   ele, element to insert
*   	Number pos, postion in the array to insert
* output: Array temp, processed array
*/
function insertToArray( arr, ele, pos ) {
	var temp = new Array;
	if( pos < -1 || pos > arr.length )		//invalid posistion
	{
		return arr;
	}
	temp = temp.concat(	arr.slice(0,pos)	//push elements from 0 ~ pos-1
						,ele 				//insert new ele
						,arr.slice(pos)		//push pos ~ end
						);
	//console.log('insert:' + temp);
	return temp;
}

/*
* function: find out whether the task is already exsit
* input: String user_id,
* 	     Number action,
* output: Number i, index of the task, -1 means it does not exist. 
*/
function isTaskExist(user_id, action)
{
	for (var i in task_list)
	{
		if( task_list[i].user_id == user_id
			&& ( (task_list[i].action>-1 && action>-1)		//turn on 
				||  (task_list[i].action<0 && action<0)   )	//turn off
			)
			return i;
	}
	return -1;
}

/*
* function: pop out the first task in the list
* input: none
* output: none
*/
function pop() {
	task_event.self.emit('currentTaskChanged');
	task_list.splice(0,1);
}

/*
* function: checking the task by time
* input: none
* output: none
*/
function checkingTask(){
	var now = Date.now();
	var past_time = 3*1000;
	//console.log(Date.now());
	//console.log(current_task);
	if( typeof(current_task) == 'undefined' )	//current task is empty
	{
		current_task = currentTask();
		if(current_task == 'undefined')
		{
			task_event.self.emit('currentTaskChanged');
		}
	}
	else
	{
		if( (current_task.time+past_time) < now )	//time has past
		{
			console.log('taskList: one task is past');
			pop();
			current_task = currentTask();	//update current task
			if(typeof(current_task) == 'undefined')
			{
				console.log('taskList: task_list is empty...');
			}
		}
	}
}


/*
* function: reset the excuting flag of the task, when the current task has been shift down
* input: Number i, index of the task
* output: none
*/
function resetExcutingFlag(i)
{
	task_list[i].excuting = false;
}
