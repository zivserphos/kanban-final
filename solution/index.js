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
    for (let key in localSave)
    {
        for(let task of localSave[key])
        {
            const li = createElement("li", [task] , ["task"] , {draggable: "true" , onblur: "saveEditTask(event)"})
            document.getElementById(key).prepend(li)
        }
    }
}
localSave = JSON.parse(window.localStorage.getItem("tasks"))


function createElement(tagName, children = [], classes = [], attributes = {}) 
{
    let el = document.createElement(tagName);

    for (let child of children)
    {
        el.append(child)
    }

    for (let cls of classes)
    {
        el.classList.add(cls)
    }

    for (let attr in attributes)
    {
        el.setAttribute(attr , attributes[attr])
    }
    return el
}


function handleClicks(e)
{   
    if (e.target.classList.contains("submit"))
    {
       const inputTag = document.getElementById(e.target.id.split("submit-")[1]+ "-task")
       const taskInput = inputTag.value
       const ul = document.querySelector("." + inputTag.id.split("add-")[1] + "s")
       const li = createElement("li", [] , [] , {draggable: "true" , onblur: "saveEditTask(event)"})
       li.addEventListener("dblclick" , function(e) {editTask(e)})
       li.classList.add("task")
       li.append(taskInput)
       if (taskInput === "")
       {
           alert("You cant add an empty input as a task")
       }
       else
       {
        ul.prepend(li)
        localSave[ul.id].push(taskInput)
        localStorage.setItem("tasks" , JSON.stringify(localSave))
        
       }
       
    }
}

function moveTaskToSection(id)
{
    if(currentEl && currentEl.closest("ul").id !== id)
    {
        localSave[id].unshift(currentEl.textContent)
        const indexOfTask = localSave[currentEl.closest("ul").id].indexOf(currentEl.textContent)
        localSave[currentEl.closest("ul").id].splice(localSave[currentEl.closest("ul").id].indexOf(currentEl.textContent),1)
        localStorage.setItem("tasks", JSON.stringify(localSave))
        document.getElementById(id).prepend(currentEl)
    }
}

function altPressed(event)
{
    if (event.key === "Alt")
    {
          altpressed = true;  
    }
}

function altGone(event)
{
    altpressed = false
}

function changeTaskSection(event) // check if the user type a nubmer from 1 to 3 while the alt key was pressed and thats mean should move the task a section
{
    if(altpressed && event.key === "1")
    {
        moveTaskToSection("todo")
    }
    else if (altpressed && event.key === "2")
    {
        moveTaskToSection("in-progress")
    }
    else if (altpressed && event.key === "3")
    {
        moveTaskToSection("done")
    }
    
}

function hoverElement(event)
{
    if(event.target.tagName === "LI")
    {
        currentEl = event.target;
    }
}

function outOfElement(event)
{
    if(event.target.tagName === "LI")
    {
        currentEl = null
    }
}

function searchTaskByQuery(event)
{
    if (event.target.id === "search")
    {
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

function editTask(event)
{
    const tag = event.target;
    originTask = tag.textContent
    const localSaveKey = localSave[tag.closest("ul").id]
    tag.contentEditable = "true";
    tag.style.backgroundColor = "pink";
    localSaveKey[localSaveKey.indexOf(tag.textContent)] = "TO EDIT"
    localStorage.setItem("tasks" , JSON.stringify(localSave))
}

function saveEditTask(event)
{
    const tag = event.target
    const localSaveKey = localSave[tag.closest("ul").id]
    tag.style.background = '';
    if (tag.textContent !== "")
    {
        localSaveKey[localSaveKey.indexOf("TO EDIT")] = tag.textContent
    }
    else
    {
        localSaveKey[localSaveKey.indexOf("TO EDIT")] = originTask
        tag.textContent = originTask
    }
    localStorage.setItem("tasks" , JSON.stringify(localSave))
}

document.addEventListener("click" ,  function(e){handleClicks(e)})
document.addEventListener("keydown" , function(event){altPressed(event)})
document.addEventListener("keyup" , function(event){altGone(event)})
document.addEventListener("keydown", function(event){changeTaskSection(event)})
document.addEventListener("mouseover" , function(event){hoverElement(event)})
document.addEventListener("mouseout" ,  function(event){outOfElement(event)})
document.addEventListener("keyup" , function(event) {searchTaskByQuery(event)})
document.addEventListener("dblclick" , function(event) {editTask(event)})

//window.localStorage.setItem("tasks", {todo: [] , "in-progress": [] , done: []} )
