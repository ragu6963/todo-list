const apiUrl = "http://localhost:3000/todos";

// HTML 요소 선택
const todoInput = document.querySelector("#todo-input");
const addTodoButton = document.querySelector("#add-todo");
const todoList = document.querySelector("#todo-list");

// 페이지 로드 시 할 일 목록 가져오기
document.addEventListener("DOMContentLoaded", fetchTodos);

// 할 일 추가 버튼 클릭 이벤트
addTodoButton.addEventListener("click", addTodo);

// 할 일 목록 가져오기 (GET 요청)
async function fetchTodos() {
  try {
    const response = await axios.get(apiUrl);
    todoList.innerHTML = "";
    response.data.forEach((todo) => renderTodo(todo));
  } catch (error) {
    console.error("Error fetching todos:", error);
  }
}

// 할 일 렌더링 함수
function renderTodo(todo) {
  const li = document.createElement("li");
  li.id = `list-${todo.id}`;
  li.className = todo.completed ? "completed" : "";

  // 할 일 텍스트
  const todoText = document.createElement("span");
  todoText.textContent = todo.content; // 할 일 내용을 보여줌

  // 상태 변경 버튼
  const toggleButton = document.createElement("button");
  toggleButton.textContent = "완료";
  toggleButton.addEventListener("click", () => toggleComplete(todo.id));

  // 삭제 버튼
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "삭제";
  deleteButton.addEventListener("click", () => deleteTodo(todo.id));

  li.appendChild(todoText);
  li.appendChild(toggleButton);
  li.appendChild(deleteButton);
  todoList.appendChild(li);
}

// 할 일 추가하기 (POST 요청)
async function addTodo() {
  const content = todoInput.value.trim();
  if (!content) return;

  const newTodo = { content, completed: false }; // content 속성 사용

  try {
    const response = await axios.post(apiUrl, newTodo);
    renderTodo(response.data);
    todoInput.value = "";
  } catch (error) {
    console.error("Error adding todo:", error);
  }
}

// 할 일 완료 상태 토글 (PATCH 요청)
async function toggleComplete(id) {
  const todoElement = document.querySelector(`#list-${id}`);
  const isCompleted = !todoElement.classList.contains("completed");

  try {
    // 서버에 완료 상태 업데이트 요청
    await axios.patch(`${apiUrl}/${id}`, { completed: isCompleted });

    // DOM에서 할 일의 완료 상태 스타일을 업데이트
    todoElement.classList.toggle("completed");
  } catch (error) {
    console.error("Error toggling todo:", error);
  }
}

// 할 일 삭제하기 (DELETE 요청)
async function deleteTodo(id) {
  try {
    await axios.delete(`${apiUrl}/${id}`);
    const todoElement = document.querySelector(`#list-${id}`);
    todoElement.remove();
  } catch (error) {
    console.error("Error deleting todo:", error);
  }
}
