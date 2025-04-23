import { useState } from 'react';
import { User } from '../../types/user';
import { Todo } from '../../types/todo';

type Props = {
  users: User[];
  todo: Todo[];
  onAddTodo: (todo: Todo) => void;
};

export const TodoForm: React.FC<Props> = ({ users, todo, onAddTodo }) => {
  const [title, setTitle] = useState('');
  const [userId, setUserId] = useState(0);
  const [nameError, setNameError] = useState('');
  const [userError, setUserError] = useState('');

  function handleTitleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setTitle(event.target.value);
    setNameError('');
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const titleValid = () => {
      if (title.trim() === '') {
        setNameError('Please enter a title');

        return false;
      }

      return true;
    };

    const userValid = () => {
      if (userId === 0) {
        setUserError('Please choose a user');

        return false;
      }

      return true;
    };

    if (!titleValid() || !userValid()) {
      return;
    }

    const maxId = todo.reduce((max, { id }) => Math.max(max, id), 0);

    const newTodo: Todo = {
      id: maxId + 1,
      title,
      completed: false,
      userId,
    };

    onAddTodo(newTodo);

    setTitle('');
    setUserId(0);
  };

  return (
    <form action="/api/todos" method="POST" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="post-title">Title: </label>
        <input
          id="post-title"
          type="text"
          data-cy="titleInput"
          placeholder="Please enter a title"
          value={title}
          onChange={handleTitleChange}
        />
        {nameError && <span className="error">{nameError}</span>}
      </div>

      <div className="field">
        <label htmlFor="user-id">User: </label>
        <select
          data-cy="userSelect"
          id="user-id"
          value={userId}
          onChange={event => {
            setUserId(+event.target.value);
            setUserError('');

            return;
          }}
        >
          <option value="0" disabled>
            Choose a user
          </option>
          {users.map((user: User) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
        {userError && <span className="error">{userError}</span>}
        <div className="submit-button">
          <button type="submit" data-cy="submitButton">
            Add
          </button>
        </div>
      </div>
    </form>
  );
};
