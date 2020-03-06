const taskCookieName = 'tasks';
const baseExpirationDays = 1;

function addTask() {
    const taskName = document.getElementById('task-name').value;
    const comment = document.getElementById('comment').value;
    const priority = document.getElementById('priority').value;

    let errorClassList = document.getElementById('error-add-task').classList;

    if (!taskName || !comment || priority > 5 || priority < 1) {
        errorClassList.remove('hide');
        errorClassList.add('show-error');

        return;
    }

    errorClassList.add('hide');
    errorClassList.remove('show-error');

    saveTaskInStore({"task_name": taskName, "comment": comment, "priority": priority});

    show('success-add-task');

    setTimeout(function () {hide('success-add-task')},  5000);
}

function saveTaskInStore(task, expirationDays = baseExpirationDays) {
    let date = new Date();
    date.setTime(date.getTime() + (expirationDays * 24 * 60 * 60 * 1000));

    let tasks = findAllTask();
    let tasksLength = Object.keys(tasks).length;
    tasks[tasksLength + 1] = task;

    document.cookie = taskCookieName + '=' + JSON.stringify(tasks) + ';expires=' + date.toUTCString() + ';path=/';
}

function findAllTask() {
    let name = taskCookieName + "=";

    let decodedCookie = decodeURIComponent(document.cookie);
    let allCookies = decodedCookie.split(';');

    for(let i = 0; i < allCookies.length; i++) {
        let cookie = allCookies[i];

        if (cookie.indexOf(name) === 0) {
            let value = cookie.substring(name.length, cookie.length);

            if (value.length > 0) {
                return JSON.parse(value);
            }

            return {};
        }
    }

    return {};
}

function showTaskList() {
    let taskGroupElement = document.getElementById('task-group');
    show('loading-tasks');

    let tasks = findAllTask();

    if (Object.keys(tasks).length === 0) {
        document.getElementById('information').innerHTML = 'Brak zadań';
        hide('loading-tasks');

        return;
    }

    let taskGroupHtml = '';

    for (let i = 1; i <= Object.keys(tasks).length; i++) {
        let task = tasks[i];

        taskGroupHtml += '<li><strong>Nazwa:</strong> ' + task['task_name'] +
            ' <strong>komentarz:</strong> ' + task['comment'] +
            ' <strong>priorytet:</strong> ' + task['priority'] + '</li>'
        ;
    }

    taskGroupElement.innerHTML = taskGroupHtml;
    hide('loading-tasks');
}

function sendEmail() {
    const email = document.getElementById('email').value;
    const content = document.getElementById('content').value;

    if (content.length === 0 || !(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
        show('error-send');
        return;
    }

    hide('error-send');
    show('success-send');

    console.log('Send to api');

    setTimeout(function () {hide('success-send');}, 5000);
}

function validateEmail() {

}

function show(id) {
    let loadingElement = document.getElementById(id).classList;
    loadingElement.add('show');
    loadingElement.remove('hide');
}

function hide(id) {
    let loadingElement = document.getElementById(id).classList;
    loadingElement.add('hide');
    loadingElement.remove('show');
}
