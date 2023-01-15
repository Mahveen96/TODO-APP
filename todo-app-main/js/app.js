// Show dark theme on content load
window.addEventListener('DOMContentLoaded', () => {
  const themeIcon = document.querySelector('.themeIcon')
  document.body.classList.add('dark')
  themeIcon.src = 'images/icon-sun.svg'
})

window.addEventListener('load', () => {
  const toggleBtn = document.querySelector('.toggleBtn')
  const themeIcon = document.querySelector('.themeIcon')
  const todoText = document.querySelector('#todoText')
  const form = document.querySelector('#form')
  const count = document.querySelector('.itemsCount')
  const btns = document.querySelectorAll('.btn')
  const clearBtn = document.querySelector('.clearBtn')
  const localStorageKey = 'todos'
  // Making global variable
  lists = JSON.parse(localStorage.getItem(localStorageKey)) || []

  // Functions
  // Create a new list in local storage
  const createList = (name) => {
    return { id: Date.now().toString(), name: name, complete: false }
  }

  // Saving list to Local Storage
  const saveList = () => {
    localStorage.setItem(localStorageKey, JSON.stringify(lists))
  }

  // update local storage
  const updateLocalStorage = () => {
    const item = lists.filter((list) => list.complete)
    lists = lists.filter((list) => item.indexOf(list) < 0)
    localStorage.todos = JSON.stringify(lists)
  }

  // Event listener
  toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark')
    themeIcon.src = document.body.classList.contains('dark')
      ? 'images/icon-sun.svg'
      : 'images/icon-moon.svg'
  })

  //  render todo count
  btns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const incompleteItems = lists.filter((list) => !list.complete).length
      const completeItems = lists.filter((list) => list.complete).length
      const itemString = lists.length === 1 ? 'item left' : 'items left'
      if (btn.innerText.toLowerCase() === 'all') {
        count.textContent = lists.length + ' ' + itemString
      } else if (btn.innerText.toLowerCase() === 'active') {
        count.textContent = incompleteItems + ' ' + itemString
      } else if (btn.innerText.toLowerCase() === 'completed') {
        count.textContent = completeItems + ' ' + itemString
      } else {
      }
    })
  })

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    let listName = todoText.value
    if (listName === null || listName === '') return
    const list = createList(listName)
    lists.push(list)
    saveList()
    e.target.reset()
    renderTodoData()
  })

  // Show li based on user click
  btns.forEach((btn) => {
    btn.addEventListener('click', () => {
      renderTodoData()
      btns.forEach((btn) => btn.classList.remove('active'))
      btn.classList.add('active')
      const todo = document.querySelectorAll('li')
      if (btn.innerText.toLowerCase() === 'active') {
        todo.forEach((li) => {
          if (li.children[0].children[0].children[0].checked) {
            li.style.display = 'none'
          } else {
            li.style.display = 'block'
          }
        })
      } else if (btn.innerText.toLowerCase() === 'completed') {
        todo.forEach((li) => {
          if (li.children[0].children[0].children[0].checked === false) {
            li.style.display = 'none'
          } else {
            li.style.display = 'block'
          }
        })
      }
    })
  })

  // Clear complete items and update local storage
  clearBtn.addEventListener('click', () => {
    const todo = document.querySelectorAll('li')
    todo.forEach((li) => {
      li.remove()
      count.innerText = ''
    })
    updateLocalStorage()
  })

  renderTodoData()
})

// Remove array from local storage if li is removed
const removeItem = () => {
  const item = lists.find((list) => list.id)
  lists.splice(item, 1)
  localStorage.todos = JSON.stringify(lists)
}

// Render Todos Data to document
const renderTodoData = () => {
  const todoList = document.querySelector('.todoList')
  todoList.innerHTML = ''
  lists.forEach((list) => {
    let li = document.createElement('li')
    li.setAttribute('class', 'todo')
    li.setAttribute('draggable', true)
    li.dataset.listId = li.id
    li.innerHTML = `
          <div class="content">
            <label class="roundCheckbox">
              <input type="checkbox">
              <span class="checkmark"></span>
              <span class="listText">${list.name}</span>
            </label>
           
            <button class="closeBtn">
              <img src="/images/icon-cross.svg" alt="">
            </button>
          </div>
          `

    todoList.appendChild(li)

    const checkbox = li.querySelector('input')
    checkbox.checked = list.complete
    checkbox.addEventListener('click', (e) => {
      list.complete = e.target.checked
      localStorage.setItem('todos', JSON.stringify(lists))
    })

    const closeBtn = li.querySelector('.closeBtn')
    closeBtn.addEventListener('click', (e) => {
      removeItem()
      todoList.removeChild(li)
    })
  })
}

// Sortable Drag and Drop
// const todoContainers = document.querySelectorAll('.todoContainer')
// todoContainers.forEach((container) => {
//   renderTodoData()
//   container.appendChild(li)
// })
// const draggables = document.querySelectorAll('.draggable')
// draggables.forEach((draggable) => {
//   draggable.addEventListener('dragstart', () => {
//     draggable.classList.add('dragging')
//   })

//   draggable.addEventListener('dragend', () => {
//     draggable.classList.remove('dragging')
//   })
// })

// todoContainers.forEach((container) => {
//   container.addEventListener('dragover', (e) => {
//     e.preventDefault()
//     const afterElement = getDragAfterElement(container, e.clientY)
//     const draggable = document.querySelector('.dragging')
//     if (afterElement == null) {
//       container.appendChild(draggable)
//     } else {
//       container.insertBefore(draggable, afterElement)
//     }
//   })
// })

// const getDragAfterElement = (container, y) => {
//   const draggableElements = [
//     ...container.querySelectorAll('.draggable:not(.dragging)'),
//   ]

//   return draggableElements.reduce(
//     (closest, child) => {
//       const box = child.getBoundingClientRect()
//       const offset = y - box.top - box.height / 2
//       if (offset < 0 && offset > closest.offset) {
//         return { offset: offset, element: child }
//       } else {
//         return closest
//       }
//     },
//     { offset: Number.NEGATIVE_INFINITY }
//   ).element
// }
