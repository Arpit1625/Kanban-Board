import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function BoardPage() {
  const { id: boardId } = useParams();
  const [boardName, setBoardName] = useState("");
  const [columns, setColumns] = useState([]);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [taskInputs, setTaskInputs] = useState({});
  const [editingColumnId, setEditingColumnId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [showEditList, setShowEditList] = useState(false);
  const [showDeleteList, setShowDeleteList] = useState(false);
  const [toast, setToast] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTaskTitle, setEditTaskTitle] = useState("");
  const [editTaskDesc, setEditTaskDesc] = useState("");
  const [taskOptionsVisible, setTaskOptionsVisible] = useState(null);
  const [columnsFilter, setColumnsFilter] = useState("all");
  const [users, setUsers] = useState([]);

  const holdTimeout = useRef(null);
  const token = localStorage.getItem("token");
  const editRef = useRef(null);
  const deleteRef = useRef(null);

  const [inviteEmail, setInviteEmail] = useState("");
const [members, setMembers] = useState([]);

const fetchMembers = async () => {
  try {
    const res = await axios.get(`http://localhost:5000/api/boards/${boardId}/members`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setMembers(res.data);
  } catch {
    console.error("Failed to fetch members");
  }
};

const inviteMember = async (e) => {
  e.preventDefault();
  if (!inviteEmail.trim()) return;

  try {
    await axios.post(
      `http://localhost:5000/api/boards/${boardId}/invite`,
      { email: inviteEmail },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setInviteEmail("");
    fetchMembers();
    showToast("✅ Member invited");
  } catch (err) {
    alert(err.response?.data?.message || "Invite failed");
  }
};



  const fetchBoard = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/boards/${boardId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBoardName(res.data.title);
    } catch {
      setBoardName("Untitled");
    }
  };

  const fetchColumns = async () => {
    try {
      const colRes = await axios.get(`http://localhost:5000/api/columns/board/${boardId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const columnsWithTasks = await Promise.all(
        colRes.data.map(async (col) => {
          const taskRes = await axios.get(`http://localhost:5000/api/tasks/${col._id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          return { ...col, tasks: taskRes.data };
        })
      );
      setColumns(columnsWithTasks);
    } catch (err) {
      console.error("Failed to fetch columns/tasks:", err.message);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/auth/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users:", err.message);
    }
  };

  const createColumn = async (e) => {
    e.preventDefault();
    if (!newColumnTitle.trim()) return;
    try {
      await axios.post(
        "http://localhost:5000/api/columns",
        { title: newColumnTitle, board: boardId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewColumnTitle("");
      fetchColumns();
      showToast("✅ Column created");
    } catch {
      alert("Failed to create column");
    }
  };

  const createTask = async (e, columnId) => {
    e.preventDefault();
    const input = taskInputs[columnId];
    if (!input?.title?.trim()) return;
    try {
      await axios.post(
        "http://localhost:5000/api/tasks",
        {
          title: input.title,
          description: input.description || "",
          columnId,
          assignedTo: input.assignedTo || null,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTaskInputs((prev) => ({
        ...prev,
        [columnId]: { title: "", description: "", assignedTo: "" },
      }));
      fetchColumns();
      showToast("✅ Task created");
    } catch {
      alert("Failed to create task");
    }
  };

  const deleteColumn = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/columns/edit/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchColumns();
      setShowDeleteList(false);
      showToast("✅ Column deleted");
    } catch {
      alert("Delete failed");
    }
  };

  const startEdit = (col) => {
    setEditingColumnId(col._id);
    setEditTitle(col.title);
  };

  const submitEdit = async () => {
    if (!editTitle.trim()) return;
    try {
      await axios.put(
        `http://localhost:5000/api/columns/edit/${editingColumnId}`,
        { title: editTitle },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingColumnId(null);
      setEditTitle("");
      setShowEditList(false);
      fetchColumns();
      showToast("✅ Column updated");
    } catch {
      alert("Update failed");
    }
  };

  const handleHoldStart = (taskId) => {
    holdTimeout.current = setTimeout(() => {
      setTaskOptionsVisible(taskId);
    }, 500);
  };

  const handleHoldEnd = () => {
    clearTimeout(holdTimeout.current);
  };

  const startTaskEdit = (task) => {
    setEditingTaskId(task._id);
    setEditTaskTitle(task.title);
    setEditTaskDesc(task.description || "");
    setTaskOptionsVisible(null);
  };

  const submitTaskEdit = async (taskId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/tasks/${taskId}`,
        { title: editTaskTitle, description: editTaskDesc },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingTaskId(null);
      fetchColumns();
      showToast("✅ Task updated");
    } catch {
      alert("Failed to update task");
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchColumns();
      setTaskOptionsVisible(null);
      showToast("✅ Task deleted");
    } catch {
      alert("Failed to delete task");
    }
  };

  const toggleTaskDone = async (task) => {
    try {
      await axios.put(
        `http://localhost:5000/api/tasks/${task._id}`,
        { done: !task.done },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchColumns();
      showToast(task.done ? "✅ Marked Undone" : "✅ Marked Done");
    } catch {
      alert("Failed to update task status");
    }
  };
 const handleDragEnd = async (result, columnId) => {
  const { destination, source } = result;
  if (!destination) return;

  if (destination.index === source.index) return;

  const column = columns.find((c) => c._id === columnId);
  const newTasks = Array.from(column.tasks);
  const [movedTask] = newTasks.splice(source.index, 1);
  newTasks.splice(destination.index, 0, movedTask);

  const updatedColumns = columns.map((col) =>
    col._id === columnId ? { ...col, tasks: newTasks } : col
  );

  setColumns(updatedColumns);
  try {
    await axios.put(`http://localhost:5000/api/tasks/reorder/${columnId}`, {
      taskIds: newTasks.map((task) => task._id),
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    showToast("✅ Order saved");
  } catch {
    alert("Failed to save order");
  }
};

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };

  useEffect(() => {
    fetchBoard();
    fetchColumns();
    fetchUsers();
    fetchMembers();
  }, [boardId]);

  useEffect(() => {
    const handleClick = (e) => {
      if (showEditList && editRef.current && !editRef.current.contains(e.target)) {
        setShowEditList(false);
        setEditingColumnId(null);
      }
      if (showDeleteList && deleteRef.current && !deleteRef.current.contains(e.target)) {
        setShowDeleteList(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showEditList, showDeleteList]);

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-2 text-center">{boardName}</h1>
      <p className="text-sm text-zinc-400 mb-6 text-center">Board ID: {boardId}</p>

      {/* Filter Buttons */}
      <div className="flex gap-4 mb-6">
        <button onClick={() => setColumnsFilter("all")} className="px-3 py-1 bg-zinc-700 rounded">All</button>
        <button onClick={() => setColumnsFilter("done")} className="px-3 py-1 bg-zinc-700 rounded">Done</button>
        <button onClick={() => setColumnsFilter("undone")} className="px-3 py-1 bg-zinc-700 rounded">Undone</button>
      </div>

      {/* Columns Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-6xl mb-10">
  {columns.map((col) => (
    <div key={col._id} className="bg-zinc-800 p-4 rounded shadow min-w-[250px]">
      <h2 className="text-xl font-semibold mb-2">{col.title}</h2>

      <DragDropContext onDragEnd={(result) => handleDragEnd(result, col._id)}>
        <Droppable droppableId={col._id}>
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {col.tasks
                ?.filter((task) =>
                  columnsFilter === "all"
                    ? true
                    : columnsFilter === "done"
                    ? task.done
                    : !task.done
                )
                .map((task, index) => (
                  <Draggable
                    key={task._id}
                    draggableId={task._id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                        className={`bg-zinc-700 p-2 rounded mb-2 text-sm relative flex items-center gap-2 ${
                          task.done ? "opacity-50 line-through" : ""
                        }`}
                        onMouseDown={() => handleHoldStart(task._id)}
                        onMouseUp={handleHoldEnd}
                        onMouseLeave={handleHoldEnd}
                        onTouchStart={() => handleHoldStart(task._id)}
                        onTouchEnd={handleHoldEnd}
                      >
                        <input
                          type="checkbox"
                          checked={task.done}
                          onChange={() => toggleTaskDone(task)}
                        />
                        <div className="flex-grow">
  <p className="font-semibold">{task.title}</p>
  {task.description && <p>{task.description}</p>}
  {task.assignedTo?.name && (
    <p className="text-xs text-blue-300">
      👤 {task.assignedTo.name}
    </p>
  )}
  {task.dueDate && (
    <p className="text-xs text-red-300">
      📅 Due: {new Date(task.dueDate).toLocaleDateString()}
    </p>
  )}
</div>

                        {taskOptionsVisible === task._id && (
                          <div className="absolute top-1 right-1 flex gap-1">
                            <button
                              onClick={() => startTaskEdit(task)}
                              className="text-xs bg-yellow-400 hover:bg-yellow-500 text-black px-2 rounded"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => deleteTask(task._id)}
                              className="text-xs bg-red-600 hover:bg-red-700 px-2 text-white rounded"
                            >
                              🗑️
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </Draggable>
                ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Create Task Form */}
      <form onSubmit={(e) => createTask(e, col._id)} className="flex flex-col gap-2 mt-3">
              <input
                type="text"
                placeholder="Task title"
                value={taskInputs[col._id]?.title || ""}
                onChange={(e) =>
                  setTaskInputs((prev) => ({
                    ...prev,
                    [col._id]: { ...prev[col._id], title: e.target.value },
                  }))
                }
                className="px-2 py-1 rounded bg-zinc-900 border border-zinc-600 text-white"
              />
              <select
  value={taskInputs[col._id]?.status || "todo"}
  onChange={(e) =>
    setTaskInputs((prev) => ({
      ...prev,
      [col._id]: { ...prev[col._id], status: e.target.value },
    }))
  }
  className="px-2 py-1 rounded bg-zinc-900 border border-zinc-600 text-white"
>
  <option value="todo">To Do</option>
  <option value="inprogress">In Progress</option>
  <option value="done">Done</option>
</select>

<input
  type="date"
  value={taskInputs[col._id]?.dueDate || ""}
  onChange={(e) =>
    setTaskInputs((prev) => ({
      ...prev,
      [col._id]: { ...prev[col._id], dueDate: e.target.value },
    }))
  }
  className="px-2 py-1 rounded bg-zinc-900 border border-zinc-600 text-white"
/>

              <textarea
                placeholder="Description"
                value={taskInputs[col._id]?.description || ""}
                onChange={(e) =>
                  setTaskInputs((prev) => ({
                    ...prev,
                    [col._id]: { ...prev[col._id], description: e.target.value },
                  }))
                }
                className="px-2 py-1 rounded bg-zinc-900 border border-zinc-600 text-white"
              />
              <select
                value={taskInputs[col._id]?.assignedTo || ""}
                onChange={(e) =>
                  setTaskInputs((prev) => ({
                    ...prev,
                    [col._id]: { ...prev[col._id], assignedTo: e.target.value },
                  }))
                }
                className="px-2 py-1 rounded bg-zinc-900 border border-zinc-600 text-white"
              >
                <option value="">Assign to...</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>{user.name}</option>
                ))}
              </select>
              <button type="submit" className="bg-green-600 hover:bg-green-700 text-white text-sm py-1 rounded">➕ Add Task</button>
            </form>
          </div>
        ))}
      </div>

      {/* Create Column */}
      <form onSubmit={createColumn} className="flex items-center gap-3 w-full max-w-md mb-6">
        <input
          type="text"
          placeholder="New column title"
          value={newColumnTitle}
          onChange={(e) => setNewColumnTitle(e.target.value)}
          className="px-4 py-2 rounded-md bg-zinc-800 border border-zinc-600 text-white w-full"
        />
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md">Create</button>
      </form>

      {/* Edit/Delete Column Buttons */}
      <div className="flex gap-4 mb-4">
        <button onClick={() => { setShowEditList(!showEditList); setShowDeleteList(false); }} className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded">✏️ Edit a Column</button>
        <button onClick={() => { setShowDeleteList(!showDeleteList); setShowEditList(false); }} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">🗑️ Delete a Column</button>
      </div>

      {/* Edit Column Popup */}
      {showEditList && (
        <div ref={editRef} className="mt-4 bg-zinc-800 p-4 rounded shadow max-w-md w-full">
          <h3 className="text-lg font-semibold mb-2">Click a column to rename:</h3>
          <ul className="space-y-2">
            {columns.map((col) => (
              <li key={col._id} className="bg-zinc-700 px-4 py-2 rounded flex items-center justify-between">
                {editingColumnId === col._id ? (
                  <>
                    <input
                      autoFocus
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && submitEdit()}
                      onBlur={submitEdit}
                      className="bg-zinc-900 border border-zinc-500 rounded px-2 py-1 text-white flex-grow mr-2"
                    />
                    <button onClick={submitEdit} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded">Save</button>
                  </>
                ) : (
                  <button onClick={() => startEdit(col)} className="text-left w-full">{col.title}</button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Delete Column Popup */}
      {showDeleteList && (
        <div ref={deleteRef} className="mt-4 bg-zinc-800 p-4 rounded shadow max-w-md w-full">
          <h3 className="text-lg font-semibold mb-2">Click a column to delete:</h3>
          <ul className="space-y-2">
            {columns.map((col) => (
              <li key={col._id} onClick={() => deleteColumn(col._id)} className="cursor-pointer bg-zinc-700 hover:bg-red-600 px-4 py-2 rounded">{col.title}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between gap-6 mb-6 w-full max-w-6xl">

  {/* Board Members Section */}
<div className="bg-zinc-800 p-4 rounded shadow mb-6 w-full max-w-md">
  <h2 className="text-xl font-bold mb-4">Board Members</h2>
  <ul className="space-y-2 mb-4">
    {members.map((member) => (
      <li key={member._id} className="bg-zinc-700 px-4 py-2 rounded">
        {member.name} ({member.email})
      </li>
    ))}
  </ul>
  </div>

  {/* Right - Invite Member */}
  <div className="bg-zinc-800 p-4 rounded shadow flex-1">
    <h3 className="text-lg font-semibold mb-2">✉️ Invite Member</h3>
    <form onSubmit={inviteMember} className="flex flex-col gap-2">
      <input
        type="email"
        placeholder="User email"
        value={inviteEmail}
        onChange={(e) => setInviteEmail(e.target.value)}
        className="px-3 py-2 rounded bg-zinc-900 border border-zinc-600 text-white"
      />
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Invite
      </button>
    </form>
  </div>

</div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-2 rounded shadow">
          {toast}
        </div>
      )}
    </div>
  );
}
