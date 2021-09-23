let tasks = window.localStorage.getItem("tasks")
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
            const li = createElement("li", [task] , ["task"] , {draggable: "true"})
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

function editTask (e)
{
    if (e.target.tag = "li")
    {
       
       const changeTask = document.createElement("input")
       changeTask.innerHTML = e.target.innerHTML
       e.parentNode.replaceChild(changeTask, e.target);
    }
}

function enterButton(e)
{
    if (e.target.classList.contains("submit"))
    {
       const inputTag = document.getElementById(e.target.id.split("submit-")[1]+ "-task")
       const taskInput = inputTag.value
       const ul = document.querySelector("." + inputTag.id.split("add-")[1] + "s")
       const li = createElement("li", [] , [] , {draggable: "true"})
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
        //localStorage.getItem("tasks").push(taskInput)
       }
       
    }
}

function moveTaskToSection(id)
{
    if(currentEl && currentEl.closest("ul").id !== id)
    {
        localSave[id].unshift(currentEl.textContent)
        const indexOfTask = localSave[currentEl.closest("ul").id].indexOf(currentEl.textContent)
        localSave[currentEl.closest("ul").id].splice(localSave[currentEl.closest("ul").id].indexOf(currentEl.textContent))
        localStorage.setItem("tasks", JSON.stringify(localSave))
        document.getElementById(id).append(currentEl)
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

document.addEventListener("click" ,  function(e){enterButton(e)})
document.addEventListener("keydown" , function(event){altPressed(event)})
document.addEventListener("keyup" , function(event){altGone(event)})
document.addEventListener("keydown", function(event){changeTaskSection(event)})
document.addEventListener("mouseover" , function(event){hoverElement(event)})
document.addEventListener("mouseout" ,  function(event){outOfElement(event)})

//window.localStorage.setItem("tasks", {todo: [] , "in-progress": [] , done: []} )