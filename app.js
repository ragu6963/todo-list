const URL = "http://localhost:3000/todos";

// 페이지 로딩이 끝나면 할 일 목록 초기화 함수 실행
document.addEventListener("DOMContentLoaded", initTodos);

// HTML 요소 선택
const todoInput = document.querySelector("#todo-input");
const addTodoButton = document.querySelector("#add-todo");
const todoList = document.querySelector("#todo-list");

// 할 일 추가 버튼 클릭 이벤트
addTodoButton.addEventListener("click", addTodo);

// 할 일 목록 초기화 (GET 요청)
async function initTodos() {
  try {
    // 할 일 목록 전체 가져오기
    const response = await axios.get(URL);

    // 개별 할 일(todo)를 화면에 그리기(renderTodo)
    response.data.forEach((todo) => {
      renderTodo(todo);
    });
  } catch (error) {
    console.error("Error fetching todos:", error);
  }
}

// 개별 할 일 화면에 그리기 함수
function renderTodo(todo) {
  const li = document.createElement("li");
  li.id = `list-${todo.id}`;

  if (todo.completed === true) {
    li.classList.add("completed");
  }

  // 할 일 텍스트
  const todoText = document.createElement("span");
  todoText.textContent = todo.content;

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
  // 입력 필드 텍스트
  const content = todoInput.value.trim();

  // 빈 텍스트라면 추가하지 않는다.
  if (!content) return;

  // 리소스 생성을 위한 객체 생성
  const newTodo = { content, completed: false };

  try {
    // 새로운 할 일 생성 (POST 요청)
    const response = await axios.post(URL, newTodo);

    // POST 요청 정상 처리 후 새로운 할 일을 리스트에 추가
    renderTodo(response.data);

    // 입력 필드 초기화
    todoInput.value = "";
  } catch (error) {
    console.error("Error adding todo:", error);
  }
}

// 할 일 완료 상태 토글 (PATCH 요청)
async function toggleComplete(id) {
  const todoItem = document.querySelector(`#list-${id}`);

  // 완료 상태 저장 변수
  // 현재 완료 상태의 반대(true / false) 값을 저장
  const isCompleted = !todoItem.classList.contains("completed");

  try {
    // 할 일 완료 상태 변경 (PATCH 요청)
    await axios.patch(`${URL}/${id}`, { completed: isCompleted });

    // PATCH 요청 정상 처리 후 요소 클래스 토글
    todoItem.classList.toggle("completed");
  } catch (error) {
    console.error("Error toggling todo:", error);
  }
}

// 할 일 삭제하기 (DELETE 요청)
async function deleteTodo(id) {
  try {
    // 할 일 삭제 (DELETE 요청)
    await axios.delete(`${URL}/${id}`);

    // DELETE 요청 정상 처리 후 요소 선택 후 제거
    const todoItem = document.querySelector(`#list-${id}`);
    todoItem.remove();
  } catch (error) {
    console.error("Error deleting todo:", error);
  }
}
