let tasks = window.localStorage.getItem("tasks") // all the tasks in the local storage
let originTask; // saves and pass the <li> element that dragged in to other section  
let altpressed = false; // global variable to check is alt is currently pressed
let currentEl; // global variable that contains the <li> tag of the element that the mouse is currently over
let localSave; // a global variable with the value of localStorage.tasks parsed into object

const allowDrop = event => event.preventDefault() // allow drop an events on other elements
const toPink = event => event.target.style.backgroundColor = "pink" // paint the <li> element(task) in pink background when focused
const mouseOverElement = event => event.target.tagName === "LI" ? currentEl = event.target : mouseOverElement // attr for <li> elements that can tell if the mouse is over the element
const outOfElemet = event => event.target.tagName === "LI" ? currentEl = null : outOfElemet // attr for <li> elements that can tell if the mouse is over the element
presentTasks(tasks) // call the function to present tasks on the page

function presentTasks(tasks) {
    if (!tasks) {  // even if there is no tasks at the moment local storage will still have a key of tasks with empty array for each section
        tasks = {
            "todo": [],
            "in-progress": [],
            "done": []
        }
        window.localStorage.setItem("tasks" , JSON.stringify(tasks)) // updatae local storage
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
}


function createElement(tagName, children = [], classes = [], attributes = {}) { // create new element in more comfortable
    const el = document.createElement(tagName); 
    for (let child of children) { // append childs of element
        el.append(child)
    }
    for (let cls of classes) { // add all the classes to the element
        el.classList.add(cls)
    }
    for (let attr in attributes) { // add all attributes to the element
        el.setAttribute(attr , attributes[attr])
    }
    return el
}


function addTask(e) { // attr on click for the submit buttons to add tasks
    const buttonTag = e.target.closest("button") // in case the user pressed the the div inside the button tag
    const inputTag = document.getElementById(buttonTag.id.split("submit-")[1]+ "-task") // find that <input> closest tag  to the button (in the same section of the button)
    const taskInput = inputTag.value // input value
    const ul = document.querySelector("." + inputTag.id.split("add-")[1] + "s") // find the closest <ul> tag (in the same section of the button)
    inputTag.value = "" // clear the input field after click on add task
    const li = createElement("li", [] , ["task"] , {draggable: "true" ,ondblclick: "editTask(event)" , onmouseover: "mouseOverElement(event)", onmouseout: "outOfElemet(event)", onblur: "saveEditTask(event)" , ondragstart: "drag(event)", onfocus: "toPink(event)"}) // create new <li> element
    li.append(taskInput)
    if (taskInput === "") { // prevent the user from add empty task
        alert("You cant add an empty input as a task") //alert the user
    }
    else {
    ul.prepend(li) // insert the new tag into the top of the <ul>
    localSave[ul.id].unshift(taskInput) // insert the task in to the appropriate array
    localStorage.setItem("tasks" , JSON.stringify(localSave)) // saves the changes in local storage
    }
    let buttonText = buttonTag.children[0] // saves the element that contains the current button text
    const originbuttonText = buttonText.textContent // saves the original text in the button
    const tickMark = "<svg width=\"58\" height=\"45\" viewBox=\"0 0 58 45\" xmlns=\"http://www.w3.org/2000/svg\"><path fill=\"#fff\" fill-rule=\"nonzero\" d=\"M19.11 44.64L.27 25.81l5.66-5.66 13.18 13.18L52.07.38l5.65 5.65\"/></svg>"; // the icon that will be shown to the user when click the button to add task
    if (taskInput !== ""){ // works only when user write in the input 
        if (buttonText.innerHTML.toLowerCase() === "add " + buttonText.closest("section").children[0].id) { // in case the button is not already pressed
            buttonText.innerHTML = tickMark; // change the <div> buttonText into the icton tickMark
        }
        buttonTag.classList.toggle('submit__circle'); // flips the <button> tag 180deg
        setTimeout(function() {buttonTag.classList.toggle('submit__circle')}, 800) // flips the <button> again 180deg to return the same place he was
        setTimeout(function() {buttonText.innerHTML = originbuttonText}, 1000) // change the <div> button text in to the original text
    }  
}

function moveTaskToSection(id) { 
    if(currentEl && currentEl.closest("ul").id !== id) {
        localSave[id].unshift(currentEl.textContent)
        localSave[currentEl.closest("ul").id].splice(localSave[currentEl.closest("ul").id].indexOf(currentEl.textContent),1)
        localStorage.setItem("tasks", JSON.stringify(localSave))
        document.getElementById(id).prepend(currentEl)
    }
}

const changeTaskSection = event => altpressed && event.key === "1" ? moveTaskToSection("todo")  // if alt+1 is currently pressed together move the task to the first section
:  altpressed && event.key === "2" ? moveTaskToSection("in-progress") // if alt+2 is currently pressed together move the task to second section
:  altpressed && event.key === "3" ? moveTaskToSection("done") : changeTaskSection // if alt+3 is currently pressed together move the task to second section else, do nothing

function searchTaskByQuery(event) { // filter the tasks accordingly to the search bar input
    const query = event.target.value.toLowerCase()
    for (let key in localSave) { 
        const ul = document.getElementById(key) // the <ul> with the id of key (todo , in-progress or done)
        for(let i=0; i<ul.children.length;i++) { // pass on all the <li> elements (tasks)
            ul.children[i].textContent.toLowerCase().replace(/[\W_]/g , "").includes(query) ? ul.children[i].hidden = false : ul.children[i].hidden = true // filter the tasks with regex and hide tasks that are not include the query text
        }   
    }
}

function editTask(event) {
    const tag = event.target; // find tag
    originTask = tag.textContent // saves the origin task content
    tag.contentEditable = "true"; // allows edit text without turn into input 
}

function saveEditTask(event) { // function that saves the user edit when the <li> element(task) is out of focus
    const tag = event.target // find tag
    tag.style.background = ''; // return the <li> element to white background when element is out of focus
    const localSaveKey = localSave[tag.closest("ul").id] // the array according to the theme of the tasks
    if (tag.textContent !== "") { // if the user didnt left the input empty
        localSaveKey[localSaveKey.indexOf(originTask)] = tag.textContent // save the change that the user left
    }
    else {
        tag.textContent = originTask
    }
    tag.contentEditable = false; // <li> is no more editable when out of focus
    localStorage.setItem("tasks" , JSON.stringify(localSave)) // saves the changes in the local storage
}

function drag(event) {
    const liTag = event.target // save the <li> tag
    const listId = liTag.closest("ul").id; // save the <ul> id which is a key in the local storage
    const localSaveKey = localSave[listId]; // the array of the same key with <ul> id
    const indexTask = localSaveKey.indexOf(liTag.textContent) // the index of the task in the local storage tasks[key]
    event.dataTransfer.setData("text", [listId , indexTask]); // save and pass the <ul> id and the index task 
}

function drop(event) {

    const data = event.dataTransfer.getData("text").split(",") // an array with the passed data
    const originEl = document.getElementById(data[0]).children[data[1]]; // saves the element that dragged and should move a section
    if (event.target.id === "removeTask"){ // checks if element dragged into delete element, if it is delete the task
        originEl.remove()
        localSave[data[0]].splice(data[1],1) // update the changes
        localStorage.setItem("tasks" , JSON.stringify(localSave)) // save the changes
        return;
    }
    const curUl = event.target.closest("section").children[0] // in case the user dropped the task somewhere in the section(not on the <ul> itself.)
    if (data[0] !== curUl.id){ //condition that prevents the user from drag tasks to his section
        curUl.prepend(originEl) // insert the task into the top of the <ul>
        localSave[curUl.id].unshift(originEl.textContent) // save the change in the local storage
        localSave[data[0]].splice(data[1],1) // delete the dragged task from the the origin place at local storage
        localStorage.setItem("tasks" , JSON.stringify(localSave)) // save the changes
    }
  }

async function saveApi(event) { // async function that send http PUT request to the api to save there the current tasks from the local storage
    event.target.classList.add("loader") // if button save clicked add him the loader class
    const tasks = localSave // in order to send the request correctly
    const response = await fetch('https://json-bins.herokuapp.com/bin/614afec64021ac0e6c080ccb' , {
        method: 'PUT',
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({tasks}), 
    })
    if (response.ok) { // if the response was successful (between 200 to 300)
        const data = await response.json() // saves the response data as object
        const lastTasks = JSON.stringify(data.tasks) // the tasks that are now on the api
        localStorage.setItem("tasks" , lastTasks) // sets the local storage to the current saved api tasks
    }
    else {
        alert("error") // status is not good, user will be alerted
    }
    event.target.classList.remove("loader") // class loader is shown while waiting for an answer from the api, and then removed
}

async function loadApi(event) { // async function that load the tasks from the api, update both the local storage and the DOM 
    event.target.classList.add("loader") // if button load clicked add him the loader class
    const response = await fetch("https://json-bins.herokuapp.com/bin/614afec64021ac0e6c080ccb") // get request to the api
    if (response.ok) { // if the response was successful (between 200 to 300)
        const data = await response.json() // saves the response data as object
        const lastTasks = data.tasks // the tasks that are now on the api
        for (let key in localSave){
            document.getElementById(key).textContent = "" // delete all children of the <ul> elements (tasks)
        }
        localSave = JSON.parse(JSON.stringify(lastTasks)) // tasks on the api as object
        for (let key in localSave){ // todo, in-progress , done
            for(let task of localSave[key]) { // for every task in the current load api
                const li = createElement("li", [task] , ["task"] , {draggable: "true" ,ondblclick: "editTask(event)" , onmouseover: "mouseOverElement(event)" ,onmouseout: "outOfElemet(event)" , onblur: "saveEditTask(event)" , ondragstart: "drag(event)" , onfocus: "toPink(event)"}) // create <li> element with all the  
                document.getElementById(key).append(li) // insert the <li> element to the <ul> element
            }
        }
        localStorage.setItem("tasks" , JSON.stringify(localSave))
        event.target.classList.remove("loader") // class loader is shown while waiting for an answer from the api, and then removed
    }   
    else {
        alert("erorr") // status is not good, user will be alerted
        event.target.classList.remove("loader") // class loader is shown while waiting for an answer from the api, and then removed
    }
}

function clearAll(event) { // delete all the current tasks
    const uls = [document.getElementById("todo") , document.getElementById("in-progress") , document.getElementById("done")]
    for (let ul of uls){
        ul.textContent = ""
        localSave[ul.id] = []
    }
    localStorage.setItem("tasks" , JSON.stringify(localSave))

}

document.addEventListener("keydown" , event => event.key === "Alt" ? altpressed = true : changeTaskSection(event)) // check if the key is alt and saves altpressed as true else call changeTaskSection(event)
document.addEventListener("keyup" , () => altpressed = false) // if alt is no longer pressed