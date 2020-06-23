// Initial variables

var rightNow = new Date();

var sortByNewest = true;

var placeholders = [
	"Add your to-do here",
	"Type in your to-dos, I'll remember 'em",
	"Another day, another thing to do...",
	"So much to do, so little time",
	"What's next on the to-do list?",
	"Another thing to do is..."
];

var todos = [
	{
		body: "Add your first to-do using the input below.",
		isDone: false,
		addedOn: rightNow
	}
];

var starterTodos = [
	{ body: "Pick up Tricia from school", isDone: false, addedOn: new Date(rightNow.getTime() + 5000) },
	{ body: "Mail water bill before Monday", isDone: false, addedOn: new Date(rightNow.getTime() + 4000) },
	{ body: "Buy mom a birthday present", isDone: false, addedOn: new Date(rightNow.getTime() + 3000) },
	{ body: "Fix the towel rack in the guest bathroom", isDone: false, addedOn: new Date(rightNow.getTime() + 2000) },
	{ body: "Look up price for a moving van", isDone: false, addedOn: new Date(rightNow.getTime() + 1000) },
	{ body: "Call Steph about the game this weekend", isDone: false, addedOn: rightNow }
];


// DOM selections


var todosContainer = document.querySelector('.todo-list > ul');
var todoForm = document.querySelector('.todo-form');
var todoInput = document.querySelector('[name="todo-body"]');
var validationMessage = document.querySelector('.validation-message');
var sortBy = document.getElementById('sortBy');


// Function definitions


function generatePlaceholder() {
	var randomIndex = Math.floor( Math.random() * placeholders.length );
	var randomPlaceholder = placeholders[randomIndex];
	todoInput.setAttribute('placeholder', randomPlaceholder);
}


function updateTodoList(array) {

	var newListHtml = "";

	array.forEach(function(item, index) {
		newListHtml += `
			<li id="todo-item-${index}" class="todo ${item.isDone ? 'is-done' : ''}">
				<input type="checkbox" ${item.isDone ? 'checked' : ''} class="done-toggler" title="Mark as done" onclick="toggleDone(${index})">
				<span class="description">${item.body}</span>
				<button class="delete-button" onclick="deleteItem(${index})">Delete</button>
			</li>
		`;
	});

	todosContainer.innerHTML = newListHtml;
}


function handleFormSubmission(event) {

	event.preventDefault();

	var todoValue = todoInput.value.trim();

	if (todoValue.length > 0) {

		// make sure we reset any prior submission's errors/validation message
		todoForm.classList.remove('has-error');
		validationMessage.textContent = "";

		var newTodo = {
			body: todoValue,
			isDone: false,
			addedOn: new Date()
		};

		if (sortByNewest) {
			todos.unshift(newTodo); // adds new to-do to the START of the array
		} else {
			todos.push(newTodo); // adds new to-do to the END of the array
		}

		updateTodoList(todos);

		generatePlaceholder(); // refresh the input placeholder message

		todoInput.value = ""; // remove the to-do's value from the input

		todoInput.focus(); // put the cursor inside the input again, ready to type

	} else {

		// inform the user that there's a problem
		todoForm.classList.add('has-error');
		validationMessage.textContent = validationMessage.dataset.emptyVal + " Try again.";

	}
}


function toggleDone(index) {
	todos[index].isDone = !todos[index].isDone;
	document.getElementById(`todo-item-${index}`).classList.toggle('is-done');
}


function deleteItem(index) {
	var deletedItem = todos.splice(index, 1); // remove the item from the array
	updateTodoList(todos); // regenerate the to-do list

	// notify the user it's been deleted
	var notification = document.createElement('div');
	notification.className = "flash-message"; // could also do: notification.setAttribute('class', 'flash-message'); or: notification.classList.add('flash-message');
	notification.textContent = `Successfully deleted "${deletedItem[0].body}"`;
	document.body.appendChild(notification);

	// clear the notification after 4 seconds
	setTimeout(function(){
		document.body.removeChild(notification);
	}, 4000);
}


// Event handlers


document.querySelector('[href="#home"]').addEventListener('click', function(event) {
	event.preventDefault();
	window.location.reload();
});


document.querySelector('[href="#generate"]').addEventListener('click', function(event) {
	event.preventDefault();
	updateTodoList(starterTodos);
	todos = [...starterTodos];
});


sortBy.addEventListener('change', function(event) {

	if (event.target.value === "oldest") {

		sortByNewest = false;

		todos.sort(function(a, b) {
			return (a.addedOn <= b.addedOn) ? -1 : 1;
		});

	} else {

		sortByNewest = true;

		todos.sort(function(a, b) {
			return (a.addedOn >= b.addedOn) ? -1 : 1;
		});

	}

	updateTodoList(todos);
});


todoForm.addEventListener('submit', handleFormSubmission);


// Immediate executions


generatePlaceholder();

updateTodoList(todos);
