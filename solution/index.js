let tasks = window.localStorage.getItem("tasks")
let localSave;
if (!tasks)
{
    alert("s")
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
    console.log(tasks)
    for (let key in localSave)
    {
        for(let task of localSave[key])
        {
            const li = createElement("li", [task] , ["task"] , {draggable: "true"})
            console.log(document.getElementById(key).firstChild)
            document.getElementById(key).append(li)
        }
    }
}
localSave = JSON.parse(window.localStorage.getItem("tasks"))
console.log(localSave)

function createElement(tagName, children = [], classes = [], attributes = {}) 
{
    let el = document.createElement(tagName);

    for (let child of children)
    {
        console.log(child)
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
       const task = document.createElement("div")
       const taskInput = document.getElementById(e.target.id.split("submit-")[1]+ "-task").value
       const div = e.target.closest("section")
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
        div.append(li)
        localSave[div.id].push(taskInput)
        localStorage.setItem("tasks" , JSON.stringify(localSave))
        //localStorage.getItem("tasks").push(taskInput)
       }
       
    }
}


document.addEventListener("click" ,  function(e){enterButton(e)})
//window.localStorage.setItem("tasks", {todo: [] , "in-progress": [] , done: []} )