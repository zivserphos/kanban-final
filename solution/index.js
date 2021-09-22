

function enterButton(e)
{
    if (e.target.classList.contains("submit"))
    {
       const task = document.createElement("div")
       const taskInput = document.getElementById(e.target.id.split("submit-")[1]+ "-task").value
       const div = e.target.closest("section")
       const li = document.createElement("li")
       li.append(taskInput)
       div.append(li)
       localStorage.setItem(taskInput, div.id)
       
    }
}

document.addEventListener("click" ,  function(e){enterButton(e)})