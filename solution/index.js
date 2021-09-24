let tasks = window.localStorage.getItem("tasks")
let originTask;
let altpressed = false;
let currentEl;
let localSave;

if (!tasks)
{
    tasks = {
        "todo": [],
        "in-progress": [],
        "done": []
    }
    window.localStorage.setItem("tasks" , JSON.stringify(tasks))
}
else
{
    localSave = JSON.parse(tasks);
    for (let key in localSave) {
        for(let task of localSave[key]) {
            const li = createElement("li", [task] , ["task"] , {draggable: "true" , onmouseover: "hoverElement(event)" ,onmouseout: "outOfElemet(event)" , onclick: "editTask(event)" , onblur: "saveEditTask(event)" , ondragstart: "drag(event)"})
            document.getElementById(key).prepend(li)
        }
    }
}
localSave = JSON.parse(window.localStorage.getItem("tasks"))


function createElement(tagName, children = [], classes = [], attributes = {}) {
    let el = document.createElement(tagName);

    for (let child of children) {
        el.append(child)
    }

    for (let cls of classes) {
        el.classList.add(cls)
    }

    for (let attr in attributes) {
        el.setAttribute(attr , attributes[attr])
    }
    return el
}


function handleClicks(e) {   
    const buttonTag = e.target.closest("button")
    const inputTag = document.getElementById(buttonTag.id.split("submit-")[1]+ "-task")
    const taskInput = inputTag.value
    const ul = document.querySelector("." + inputTag.id.split("add-")[1] + "s")
    const li = createElement("li", [] , [] , {draggable: "true", onmouseover: "hoverElement(event)", onmouseout: "outOfElemet(event)", onclick: "editTask(event)", onblur: "saveEditTask(event)" , ondragstart: "drag(event)"})
    li.addEventListener("dblclick" , function(e) {editTask(e)})
    li.classList.add("task")
    li.append(taskInput)
    if (taskInput === "") {
        alert("You cant add an empty input as a task")
    }
    else {
    ul.prepend(li)
    localSave[ul.id].push(taskInput)
    localStorage.setItem("tasks" , JSON.stringify(localSave))
    }
    let buttonText = buttonTag.children[0]
    const originbuttonText = buttonText.textContent
    const tickMark = "<svg width=\"58\" height=\"45\" viewBox=\"0 0 58 45\" xmlns=\"http://www.w3.org/2000/svg\"><path fill=\"#fff\" fill-rule=\"nonzero\" d=\"M19.11 44.64L.27 25.81l5.66-5.66 13.18 13.18L52.07.38l5.65 5.65\"/></svg>";
    if (taskInput !== ""){
        if (buttonText.innerHTML.toLowerCase() === "add " + buttonText.closest("section").children[0].id) {
            buttonText.innerHTML = tickMark;
        }
        buttonTag.classList.toggle('submit__circle');
        setTimeout(function() { buttonTag.classList.toggle('submit__circle')}, 1000)
        setTimeout(function() {buttonText.innerHTML = originbuttonText}, 1200)
    }

   
    
}

function moveTaskToSection(id) {
    if(currentEl && currentEl.closest("ul").id !== id) {
        localSave[id].unshift(currentEl.textContent)
        const indexOfTask = localSave[currentEl.closest("ul").id].indexOf(currentEl.textContent)
        localSave[currentEl.closest("ul").id].splice(localSave[currentEl.closest("ul").id].indexOf(currentEl.textContent),1)
        localStorage.setItem("tasks", JSON.stringify(localSave))
        document.getElementById(id).prepend(currentEl)
    }
}

function altPressed(event) {
    if (event.key === "Alt") {
          altpressed = true;  
    }
}

function altGone(event) {
    altpressed = false
}

function changeTaskSection(event) // check if the user type a nubmer from 1 to 3 while the alt key was pressed and thats mean should move the task a section
{
    if(altpressed && event.key === "1") {
        moveTaskToSection("todo")
    }
    else if (altpressed && event.key === "2") {
        moveTaskToSection("in-progress")
    }
    else if (altpressed && event.key === "3") {
        moveTaskToSection("done")
    }
    
}

function hoverElement(event) {
    if(event.target.tagName === "LI") {
        currentEl = event.target;
    }
}

function outOfElemet(event) {
    if(event.target.tagName === "LI") {
        currentEl = null
    }
}

function searchTaskByQuery(event) {
    if (event.target.id === "search") {
        query = event.target.value.toLowerCase()
        const todo = document.getElementById("todo")
        const inProgress =  document.getElementById("in-progress")
        const done = document.getElementById("done")
        for(let i=0; i<todo.children.length;i++)
            todo.children[i].textContent.toLowerCase().replace(/[\W_]/g , "").includes(query) ? todo.children[i].hidden = false : todo.children[i].hidden =true
        for(let i=0; i<inProgress.children.length; i++)
            inProgress.children[i].textContent.toLowerCase().replace(/[\W_]/g , "").includes(query) ? inProgress.children[i].hidden = false : inProgress.children[i].hidden =true
        for(let i=0; i<done.children.length; i++)
            done.children[i].textContent.toLowerCase().replace(/[\W_]/g , "").includes(query) ? done.children[i].hidden = false : done.children[i].hidden = true
    }
}

function editTask(event) {
    const tag = event.target;
    originTask = tag.textContent
    const localSaveKey = localSave[tag.closest("ul").id]
    tag.contentEditable = "true";
    tag.style.backgroundColor = "pink";
    localSaveKey[localSaveKey.indexOf(tag.textContent)] = "TO EDIT"
    localStorage.setItem("tasks" , JSON.stringify(localSave))
}

function saveEditTask(event) {
    const tag = event.target
    const localSaveKey = localSave[tag.closest("ul").id]
    tag.style.background = '';
    if (tag.textContent !== "") {
        localSaveKey[localSaveKey.indexOf("TO EDIT")] = tag.textContent
    }
    else {
        localSaveKey[localSaveKey.indexOf("TO EDIT")] = originTask
        tag.textContent = originTask
    }
    tag.contentEditable = false;
    localStorage.setItem("tasks" , JSON.stringify(localSave))
}

function drag(event) {
    const listId = event.target.closest("ul").id;
    const localSaveKey = localSave[listId];
    const indexTask = localSaveKey.indexOf(event.target.textContent)
    event.dataTransfer.setData("text/html", [listId , indexTask]);
}


function drop(event) {
    event.preventDefault()
    const data = event.dataTransfer.getData("text/html").split(",")
    const curUl = event.target.closest("section").children[0]
    console.log(data[1])
    const ulLength = document.getElementById(data[0]).children.length
    const originEl = document.getElementById(data[0]).children[(ulLength-1) - data[1]];
    curUl.prepend(originEl)
    localSave[curUl.id].push(originEl.textContent)
    localSave[data[0]].splice(data[1],1)
    localStorage.setItem("tasks" , JSON.stringify(localSave))
  }

  function allowDrop(event){
    event.preventDefault()
  }



document.addEventListener("keydown" , event => altPressed(event))
document.addEventListener("keyup" , event => altGone(event))
document.addEventListener("keydown", event => changeTaskSection(event))

//document.addEventListener("click" ,  event => handleClicks(e))
//document.getElementById("search").addEventListener("keyup" , event => searchTaskByQuery(event))
