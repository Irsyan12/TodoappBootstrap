const tasks = [];
const RENDER_EVENT = 'render-task';

function generateId(){
    return +new Date();
}

function generateTask(id, taskTitle, taskAbout, timestamp, isCompleted){
    return {
        id,
        taskTitle,
        taskAbout,
        timestamp,
        isCompleted
    }
}

const SAVED_EVENT = 'saved-task';
const STORAGE_KEY = 'TASK_LIST';

function isStorageExist(){
    if(typeof(Storage) === undefined){
        alert('Browser kamu tidak tidak mendukung local storage');
        return false;
    }
    return true;
}

function saveData(){
    if (isStorageExist()){
        const parsed = JSON.stringify(tasks);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function loadDataFromStorage(){
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if(data !== null){
        for (const task of data){
            tasks.push(task)
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}

function addTask(){
    const taskTitle = document.getElementById('title').value;
    const taskAbout = document.getElementById('about').value;
    const timestamp = document.getElementById('inputDate').value;
    

    const generatedID = generateId();
    const taskObject = generateTask(generatedID, taskTitle, taskAbout, timestamp, false);
    tasks.push(taskObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findTask(taskId) {
    for(const taskItem of tasks) {
        if(taskItem.id === taskId){
            return taskItem;
        }
    }
    return null;
}

function findTaskIndex(taskId){
    for(const index in tasks){
        if (tasks[index].id === taskId){
            return index;
        }
    }
}

function addTaskCompleted(taskId){
    const taskTarget = findTask(taskId);

    if (taskTarget == null) return;

    taskTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();

}

function removeTask(taskId){
    const taskTarget = findTaskIndex(taskId);

    if (taskTarget === 1) return;

    tasks.splice(taskTarget, 1);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function undoTask(taskId){
    const taskTarget = findTask(taskId);

    if (taskTarget == null) return;

    taskTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));

    saveData();
}

function makeTask(taskObject){
    const listBelum = document.getElementById('uncompletedTask');

    const taskList = document.createElement('article');
    taskList.classList.add('task_item', 'card', 'flex-row', 'justify-content-between', 'taskObject');

    const taskText = document.createElement('div');
    taskText.classList.add('task', 'm-3');

    const taskTitle = document.createElement('h2')
    taskTitle.innerText = taskObject.taskTitle;
    
    const taskAbout = document.createElement('p')
    taskAbout.innerText = 'Tugas: ' + taskObject.taskAbout;

    const taskTimestamp = document.createElement('p')
    taskTimestamp.innerText ='Deadline: ' + taskObject.timestamp;

    taskText.append(taskTitle, taskAbout, taskTimestamp);

    const btnAction = document.createElement('div');
    btnAction.classList.add('btnAction');
    listBelum.append(taskList);
    taskList.append(taskText, btnAction);

    if (taskObject.isCompleted){
        const btnUndo = document.createElement('button');
        btnUndo.classList.add('undoBtn');

        const btnTrash = document.createElement('button');
        btnTrash.classList.add('trashBtn');

        btnAction.append(btnUndo, btnTrash);

        btnUndo.addEventListener('click', function(){
            undoTaskQuestion(taskObject.id);
        });

        btnTrash.addEventListener('click', function(){
            removeTaskQuestion(taskObject.id);
        });
    } else {
        const btnCheck = document.createElement('button');
        btnCheck.classList.add('checkBtn');

        const btnX = document.createElement('button');
        btnX.classList.add('Xbtn');

        btnAction.append(btnCheck, btnX);

        btnCheck.addEventListener('click', function(){
            addTaskCompletedQuestion(taskObject.id);
        });

        btnX.addEventListener('click', function(){
            removeTaskQuestion(taskObject.id);
        });
    }

    return taskList;
}

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('inputTask');
    
    submitForm.addEventListener('submit', function (event) {
      event.preventDefault();

      addTask();
      submitForm.reset();
      placeBoxMassage();

    });

    if (isStorageExist()){
        loadDataFromStorage();

    }

});

document.addEventListener(RENDER_EVENT, function(){
    const uncompletedTask = document.getElementById('uncompletedTask');
    uncompletedTask.innerHTML = '';

    const completedTask = document.getElementById('completedTask');
    completedTask.innerHTML = '';

    for (const taskItem of tasks){
        const taskElement = makeTask(taskItem);
        if (!taskItem.isCompleted){
            uncompletedTask.append(taskElement);
        } else {
            completedTask.append(taskElement);
        }
    }
});

const faq = document.getElementById('aboutApp');

faq.addEventListener('click', function(){
    Swal.fire(
        'Tentang Aplikasi',
        'Aplikasi ini berbasis web dengan menggunakan penyimpanan local storage, jadi semua tugas yang anda tambahkan akan tersimpan di browser anda masing-masing, jadi jika cache pada browser anda dihapus mungkin tugas anda akan terhapus juga :) ENJOOOY👌',
        'question'
      )
})

function placeBoxMassage(){
    const element = document.getElementById("alertBox");
    element.classList.remove('d-none')
}

function removeTaskQuestion(taskId){
    Swal.fire({
        title: 'Yakin Ingin Mengapusnya?',
        text: "Kamu tidak bisa mengembalikannya!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Batal',
        confirmButtonText: 'Ya'
      }).then((result) => {
        if (result.isConfirmed) {
            removeTask(taskId);
            Swal.fire(
                'Berhasil!',
                'Tugas Anda sudah dihapus.',
                'success'
          )
        }
      })
}

function addTaskCompletedQuestion(taskId){
    Swal.fire({
        title: 'Tandai Sudah Selesai?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Batal',
        confirmButtonText: 'Ya'
      }).then((result) => {
        if (result.isConfirmed) {
            addTaskCompleted(taskId);
            Swal.fire(
                'Berhasil!',
                'Tugas Anda ditandai selesai',
                'success'
          )
        }
      })
}

function undoTaskQuestion(taskId){
    Swal.fire({
        title: 'Tandai Belum Selesai?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Batal',
        confirmButtonText: 'Ya'
      }).then((result) => {
        if (result.isConfirmed) {
            undoTask(taskId);
            Swal.fire(
                'Berhasil!',
                'Tugas Anda ditandai belum selesai',
                'success'
          )
        }
      })
}

searchTask.addEventListener('keyup', function(e){
    const searchTask = e.target.value.toLowerCase();
    const taskList = document.querySelectorAll('.task_item');

    taskList.forEach((item) =>{
        const isiItem = item.firstChild.textContent.toLowerCase();
        
        if(isiItem.indexOf(searchTask) != -1){
            item.classList.remove('d-none');
        } else {
            item.classList.add('d-none');
        }

    });
})