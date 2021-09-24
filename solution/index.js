let tasks = window.localStorage.getItem("tasks") // all the tasks in the local storage
let originTask; // saves and pass the <li> element that dragged in to other section  
let altpressed = false; // global variable to check is alt is currently pressed
let currentEl; // global variable that contains the <li> tag of the element that the mouse is currently over
let localSave; // a global variable with the value of localStorage.tasks parsed into object

const mouseOverElement = event => event.target.tagName === "LI" ? currentEl = event.target : hoverElement // attr for <li> elements that can tell if the mouse is over the element
const outOfElemet = event => event.target.tagName === "LI" ? currentEl = null : outOfElemet // attr for <li> elements that can tell if the mouse is over the element

if (!tasks) // even if there is no tasks at the moment local storage will still have a key of tasks with empty array for each section
{
    tasks = {
        "todo": [],
        "in-progress": [],
        "done": []
    }
    window.localStorage.setItem("tasks" , JSON.stringify(tasks))
}
else // present the tasks on the page also after when you refresh it
{
    localSave = JSON.parse(tasks); // a global variable with the localStorage.tasks value parsed into object
    for (let key in localSave) {
        for(let task of localSave[key]) {
            const li = createElement("li", [task] , ["task"] , {draggable: "true" ,ondblclick: "editTask(event)" , onmouseover: "mouseOverElement(event)" ,onmouseout: "outOfElemet(event)" , onblur: "saveEditTask(event)" , ondragstart: "drag(event)" , onfocus: "toPink(event)"}) // create <li> element with all the  
            document.getElementById(key).append(li)
        }
    }
}
localSave = JSON.parse(window.localStorage.getItem("tasks")) // parse the value of localStprage.tasks into object


function createElement(tagName, children = [], classes = [], attributes = {}) { // create new element in more comfortable
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


function addTask(e) { // attr on click for the submit buttons to add tasks
    const buttonTag = e.target.closest("button") // in case the user pressed the the div inside the button tag
    const inputTag = document.getElementById(buttonTag.id.split("submit-")[1]+ "-task") // find that <input> closest tag  to the button (in the same section of the button)
    const taskInput = inputTag.value // input value
    const ul = document.querySelector("." + inputTag.id.split("add-")[1] + "s") // find the closest <ul> tag (in the same section of the button)
    const li = createElement("li", [] , ["task"] , {draggable: "true" ,ondblclick: "editTask(event)" , onmouseover: "mouseOverElement(event)", onmouseout: "outOfElemet(event)", onblur: "saveEditTask(event)" , ondragstart: "drag(event)", onfocus: "toPink(event)"}) // create new <li> element
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

const changeTaskSection = event => altpressed && event.key === "1" ? moveTaskToSection("todo") 
:  altpressed && event.key === "2" ? moveTaskToSection("in-progress")
:  altpressed && event.key === "3" ? moveTaskToSection("done") : changeTaskSection


function searchTaskByQuery(event) {
    query = event.target.value.toLowerCase()
    const todo = document.getElementById("todo")
    const inProgress =  document.getElementById("in-progress")
    const done = document.getElementById("done")
    for (let key in localSave) {
        const ul = document.getElementById(key)
        for(let i=0; i<ul.children.length;i++) {
            ul.children[i].textContent.toLowerCase().replace(/[\W_]/g , "").includes(query) ? ul.children[i].hidden = false : ul.children[i].hidden =true
        }   
    }
}

function editTask(event) {
    const tag = event.target; // find tag
    tag.focus()
    originTask = tag.textContent
    console.log(originTask)
    const localSaveKey = localSave[tag.closest("ul").id] // the array according to the theme of the tasks
    tag.contentEditable = "true"; // allows edit text without turn into input
    //localSaveKey[localSaveKey.indexOf(tag.textContent)] = "TO EDIT" 
    //localStorage.setItem("tasks" , JSON.stringify(localSave))
}

function saveEditTask(event) {
    const tag = event.target
    console.log(tag.textContent)
    console.log(originTask.textContent)
    tag.style.background = '';
    const localSaveKey = localSave[tag.closest("ul").id] // the array according to the theme of the tasks
    if (tag.textContent !== "") {
        localSaveKey[localSaveKey.indexOf(originTask)] = tag.textContent
    }
    tag.contentEditable = false;
    console.log(localSaveKey)
    localStorage.setItem("tasks" , JSON.stringify(localSave))
}

function drag(event) {
    const listId = event.target.closest("ul").id;
    const localSaveKey = localSave[listId];
    console.log(localSaveKey)
    const indexTask = localSaveKey.indexOf(event.target.textContent)
    event.dataTransfer.setData("text", [listId , indexTask]);
}

function drop(event) {
    event.preventDefault()
    const data = event.dataTransfer.getData("text").split(",")
    const curUl = event.target.closest("section").children[0]
    let ulLength = document.getElementById(data[0]).children.length
    const originEl = document.getElementById(data[0]).children[(ulLength-1) - data[1]];
    if (data[0] !== curUl.id){
        console.log(originEl)
        curUl.prepend(originEl)
        localSave[curUl.id].push(originEl.textContent)
        localSave[data[0]].splice(data[1],1)
        localStorage.setItem("tasks" , JSON.stringify(localSave))
        ulLength+=1
    }
  }

  function allowDrop(event){
    event.preventDefault()
  }

function toPink(event){
    event.target.style.backgroundColor = "pink"
}

document.addEventListener("keydown" , event => event.key === "Alt" ? altpressed =true : changeTaskSection(event))
document.addEventListener("keyup" , event => altpressed = false)
//document.addEventListener("keydown", event => changeTaskSection(event))

async function saveApi() {
    const tasks = localSave
    const response = fetch('https://json-bins.herokuapp.com/bin/614afec64021ac0e6c080ccb' , {
        method: 'PUT',
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({tasks}),
    }).then(response => response.json())
      .then(data => console.log(data))
    
}

function loadApi()
{
    fetch("https://json-bins.herokuapp.com/bin/614afec64021ac0e6c080ccb")
    .then(response => response.json())
    .then(data => console.log(data))
}