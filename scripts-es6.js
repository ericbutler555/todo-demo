// Initial variables

const rightNow = new Date();

const placeholders = [
	"Add your to-do here",
	"Type in your to-dos, I'll remember 'em",
	"Another day, another thing to do...",
	"So much to do, so little time",
	"What's next on the to-do list?",
	"Another thing to do is..."
];

const starterTodos = [
	{ body: "Pick up Tricia from school", isDone: false, addedOn: new Date(rightNow.getTime() + 5000) },
	{ body: "Mail water bill before Monday", isDone: false, addedOn: new Date(rightNow.getTime() + 4000) },
	{ body: "Buy mom a birthday present", isDone: false, addedOn: new Date(rightNow.getTime() + 3000) },
	{ body: "Fix the towel rack in the guest bathroom", isDone: false, addedOn: new Date(rightNow.getTime() + 2000) },
	{ body: "Look up price for a moving van", isDone: false, addedOn: new Date(rightNow.getTime() + 1000) },
	{ body: "Call Steph about the game this weekend", isDone: false, addedOn: rightNow }
];

let todos = [
	{
		body: "Add your first to-do using the input below.",
		isDone: false,
		addedOn: rightNow
	}
];

let sortByNewest = true;


// DOM selections


const todosContainer = document.querySelector('.todo-list > ul');
const todoForm = document.querySelector('.todo-form');
const todoInput = document.querySelector('[name="todo-body"]');
const validationMessage = document.querySelector('.validation-message');
const sortBy = document.getElementById('sortBy');


// Function definitions


const generatePlaceholder = () => {
	const randomIndex = Math.floor( Math.random() * placeholders.length );
	const randomPlaceholder = placeholders[randomIndex];
	todoInput.setAttribute('placeholder', randomPlaceholder);
};


const updateTodoList = array => {

	let newListHtml = "";

	array.forEach((item, index) => {
		newListHtml += `
			<li id="todo-item-${index}" class="todo ${item.isDone ? 'is-done' : ''}">
				<input type="checkbox" ${item.isDone ? 'checked' : ''} class="done-toggler" title="Mark as done" onclick="toggleDone(${index})">
				<span class="description">${item.body}</span>
				<button class="delete-button" onclick="deleteItem(${index})">Delete</button>
			</li>
		`;
	});

	todosContainer.innerHTML = newListHtml;
};


const handleFormSubmission = event => {

	event.preventDefault();

	const todoValue = todoInput.value.trim();

	if (todoValue.length === 0) {
		// inform the user that there's a problem
		todoForm.classList.add('has-error');
		validationMessage.textContent = validationMessage.dataset.emptyVal + " Try again.";
		return false;
	}

	// make sure we reset any prior submission's errors/validation message
	todoForm.classList.remove('has-error');
	validationMessage.textContent = "";

	const newTodo = {
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
};


const toggleDone = index => {
	todos[index].isDone = !todos[index].isDone;
	document.getElementById(`todo-item-${index}`).classList.toggle('is-done');
};


const deleteItem = index => {
	const deletedItem = todos.splice(index, 1); // remove the item from the array
	updateTodoList(todos); // regenerate the to-do list

	// notify the user it's been deleted
	const notification = document.createElement('div');
	notification.className = "flash-message"; // could also do: notification.setAttribute('class', 'flash-message'); or: notification.classList.add('flash-message');
	notification.textContent = `Successfully deleted "${deletedItem[0].body}"`;
	document.body.appendChild(notification);

	// clear the notification after 4 seconds
	setTimeout(() => {
		document.body.removeChild(notification);
	}, 4000);
};


// Event handlers


document.querySelector('[href="#home"]').addEventListener('click', event => {
	event.preventDefault();
	window.location.reload();
});


document.querySelector('[href="#generate"]').addEventListener('click', event => {
	event.preventDefault();
	if (sortByNewest) {
		todos = [...starterTodos];
	} else {
		todos = [...starterTodos].reverse(); // dummy data is hard-coded as newest first, so need to reverse the order
	}
	updateTodoList(todos);
});


sortBy.addEventListener('change', event => {

	if (event.target.value === "oldest") {

		sortByNewest = false;

		todos.sort((a, b) => (a.addedOn <= b.addedOn) ? -1 : 1);

	} else {

		sortByNewest = true;

		todos.sort((a, b) => (a.addedOn >= b.addedOn) ? -1 : 1);

	}

	updateTodoList(todos);
});


todoForm.addEventListener('submit', handleFormSubmission);


// Immediate executions


generatePlaceholder();

updateTodoList(todos);
