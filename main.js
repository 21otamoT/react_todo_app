const AddForm = props => {
  const [title, setTitle] = React.useState('');
  const inputRef = React.useRef(null);

  const handleTextChange = e => {
    setTitle(e.currentTarget.value);
  };

  const handleSubmit = e => {
    e.preventDefault();
    props.onSubmit(title);
    setTitle('');
    inputRef.current.focus();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={handleTextChange}
        ref={inputRef}
      />
      <button className="add">Add</button>
    </form>
  );
};


const Todo = props => {
  const handleDeleteClick = () => {
    props.onDeleteClick(props.todo.id);
  };

  const handleCheckboxChange = () => {
    props.onCheckboxChange(props.todo.id);
  };

  return (
    <li>
      <label>
      <input
          type="checkbox"
          checked={props.todo.isCompleted} 
          onChange={handleCheckboxChange}
        />
        <span>{props.todo.title}</span>
      </label>
      <button onClick={handleDeleteClick}>Delete</button>
    </li>
  );
};


const App = () => {
  const [todos, setTodos] = React.useState([]);

  React.useEffect(() => {
    let savedTodos;
    if (localStorage.getItem('todos') === null) {
      savedTodos = [];
    } else {
      savedTodos = JSON.parse(localStorage.getItem('todos'));
    }
    setTodos(savedTodos);
  }, []);

  const updateTodos = (newTodos) => {
    setTodos(newTodos);
    localStorage.setItem('todos', JSON.stringify(newTodos));
  };

  const handlePurgeClick = () => {
    if (!confirm('削除?')) {
      return;
    }
    const newTodos = todos.filter( todo => {
      return todo.isCompleted === false;
    });
    updateTodos(newTodos);
  };

  const handleAddFormSubmit = title => {
    const newTodos = [...todos];

    newTodos.push({
      id: Date.now(),
      title: title,
      isCompleted: false,
    });
      updateTodos(newTodos);
  };

  const handleTodoCheckboxChange = id => {
    const newTodos = todos.map( todo => {
      return {
        id: todo.id,
        title: todo.title,
        isCompleted: todo.id === id ? !todo.isCompleted : todo.isCompleted,
      };
    });
    updateTodos(newTodos);
  };

  const handleTodoDeleteClick = id => {
    if (!confirm('削除?')) {
      return;
    }
    const newTodos = todos.filter( todo => {
      return todo.id !== id;
    });
    updateTodos(newTodos);
  };

  const todoItems = todos.map( todo => {
    if (todo.title === "") {
      return;
    }
    return (
      <Todo
        key={todo.id}
        todo={todo}
        onDeleteClick={handleTodoDeleteClick}
        onCheckboxChange={handleTodoCheckboxChange}
      />
    );
  });

  return (
    <>
      <img src="./logo.svg" />
      <h1>
        Todoリスト
        <button onClick={handlePurgeClick}>Purge</button>
      </h1>
      <ul id="todos">
        {todoItems}
      </ul>
      <AddForm 
        onSubmit={handleAddFormSubmit}
      />
      <p className="copy">&copy;2024 HIROSE YUKIHIRO Inc.</p>
    </>
  );
};


ReactDOM.createRoot(root).render(
  <App />
);
