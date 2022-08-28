///////////// Jam //////////////
function updateClock(){
    var now = new Date();
    var dname = now.getDay(),
        month = now.getMonth(),
        dnum = now.getDate(),
        year = now.getFullYear(),
        hour = now.getHours(),
        min = now.getMinutes(),
        sec = now.getSeconds(),
        pe = "AM";

        if(hour == 0){
            hour = 12;
        }
        if(hour > 12){
            hour - 12;
            pe = "PM"
        }

        Number.prototype.pad = function(digits){
            for(var n = this.toString(); n.length < digits; n = 0 + n);
            return n;
        }

        var months = ["Januari","Februari", "Maret","April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
        var week = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
        var ids = ["dayname", "month", "daynum", "year", "hour", "minutes", "seconds"];
        var values = [week[dname], months[month], dnum.pad(2), year, hour.pad(2), min.pad(2), sec.pad(2), pe];

        for(var i = 0; i < ids.length; i++)
        document.getElementById(ids[i]).firstChild.nodeValue = values[i];


}

function initClock(){
    updateClock();
    window.setInterval("updateClock()", 1);
}
////////////////////////////////////////////////

const tasks = [];
const RENDER_EVENT = 'render-task';

function generateId(){
    return +new Date();
}

function addTask(){
    const task = document.getElementById('title').value;
    const aboutTask = document.getElementById('about').value;
    const timestamp = document.getElementById('date').value;

    const generatedID = generateId();
    const taskObject = generateTaskObject(generatedID, task, aboutTask, timestamp, false);
    tasks.push(taskObject);

    document.dispatchEvent(new Event(RENDER_EVENT));

}





function generateTaskObject(id, task, about, timestamp, isCompleted){
    return{
        id,
        task,
        about,
        timestamp,
        isCompleted
    }
}



function makeTask(taskObject){
    const listBelum = document.getElementById('uncompletedTask');
    const article = document.createElement('article');
    article.classList.add('task_item', 'card', 'flex-row', 'justify-content-between', 'taskObject');

    const tugas = document.createElement('div');
    tugas.classList.add('task', 'm-3');

    const tombol = document.createElement('div');
    tombol.classList.add('btnAction');

    article.append(tugas, tombol);

    const taskTitle = document.createElement('h2');
    taskTitle.innerText = taskObject.task;

    const taskAbt = document.createElement('p');
    taskAbt.innerText = 'Tugas: ' + taskObject.about;

    const deadline = document.createElement('p');
    deadline.innerText = 'Deadline: ' + taskObject.timestamp;
    tugas.append(taskTitle, taskAbt, deadline);
    
    listBelum.append(article);
    article.setAttribute('id', `task-${taskObject}`);


    if(taskObject.isCompleted){
        const tmbUndo = document.createElement('i')
        tmbUndo.classList.add('bi', 'bi-arrow-counterclockwise', 'btn', 'm-2', 'p-2', 'undo');

        const tmbHps = document.createElement('i')
        tmbHps.classList.add('bi', 'bi-trash3', 'btn', 'm-3', 'p-2', 'hapus');
        
        tmbUndo.style.fontSize = "20px";
        tmbHps.style.fontSize = "20px";

        
        tmbUndo.addEventListener('click', function(){
            undoTaskFromCompleted(taskObject.id)
        })
        
        tmbHps.addEventListener('click', function(){
            removeTaskFromCompleted(taskObject.id);
        })
        tombol.append(tmbUndo, tmbHps);
    } else {
        const tmbCheck = document.createElement('i')
        tmbCheck.classList.add('bi', 'bi-check-circle', 'btn', 'm-2', 'p-2', 'check');

        const tmbHps = document.createElement('i')
        tmbHps.classList.add('bi', 'bi-trash3', 'btn', 'm-3', 'p-2', 'hapus');

        tmbCheck.style.fontSize = "20px";
        tmbHps.style.fontSize = "20px";


        
        tmbCheck.addEventListener('click', function () {
            addTaskCompleted(taskObject.id);
        });
        tmbHps.addEventListener('click', function(){
            removeTaskFromCompleted(taskObject.id);
        })
        tombol.append(tmbCheck, tmbHps);
    };

    return article;

}




function addTaskCompleted(taskId){
    const taskTarget = findTask(taskId);

    if (taskTarget == null) return;

    taskTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function findTask(taskId){
    for (const taskItem of tasks){
        if (taskItem.id === taskId){
            return taskItem;
        }
    }

    return null;
}

document.addEventListener('DOMContentLoaded', function(){
    const submitForm = document.getElementById('inputTask');
    submitForm.addEventListener('submit', function(event){
        event.preventDefault();
        addTask();
        submitForm.reset();
    });
});

document.addEventListener(RENDER_EVENT, function(){
    const uncompletedTask = document.getElementById('uncompletedTask');
    uncompletedTask.innerHTML = '';
    const completedTask = document.getElementById('completedTask');
    completedTask.innerHTML = '';

    for(const taskItem of tasks) {
        const taskElement = makeTask(taskItem);
        if(!taskElement.isCompleted){
            uncompletedTask.append(taskElement);
        } else {
            completedTask.append(taskElement)
        }
    }
});