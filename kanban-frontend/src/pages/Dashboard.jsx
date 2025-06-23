import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [boards, setBoards] = useState([]);
  const [title, setTitle] = useState("");
  const [showDeleteList, setShowDeleteList] = useState(false);
  const [showEditList, setShowEditList] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const token = localStorage.getItem("token");

  const editRef = useRef(null);
  const deleteRef = useRef(null);

  const fetchBoards = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/boards", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBoards(res.data);
    } catch (err) {
      console.error("Failed to fetch boards:", err);
    }
  };

  const createBoard = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await axios.post(
        "http://localhost:5000/api/boards",
        { title },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTitle("");
      fetchBoards();
    } catch (err) {
      alert(err.response?.data?.message || "Board creation failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/boards/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBoards();
      setToastMessage("✅ Board deleted successfully!");
      setShowDeleteList(false);
      setTimeout(() => setToastMessage(""), 2000);
    } catch (err) {
      alert("Delete failed");
    }
  };

  const startEdit = (board) => {
    setEditingId(board._id);
    setNewTitle(board.title);
  };

  const submitEdit = async () => {
    if (!newTitle.trim()) return;
    try {
      await axios.put(
        `http://localhost:5000/api/boards/${editingId}`,
        { title: newTitle },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingId(null);
      setNewTitle("");
      setShowEditList(false);
      fetchBoards();
    } catch (err) {
      alert("Update failed");
    }
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showEditList && editRef.current && !editRef.current.contains(e.target)) {
        setShowEditList(false);
        setEditingId(null);
      }
      if (showDeleteList && deleteRef.current && !deleteRef.current.contains(e.target)) {
        setShowDeleteList(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEditList, showDeleteList]);

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Boards</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-6xl mb-10">
        {boards.map((board) => (
          <Link
            to={`/board/${board._id}`}
            key={board._id}
            className="bg-zinc-800 p-6 rounded-xl shadow hover:shadow-lg transition cursor-pointer min-w-[250px]"
          >
            <h2 className="text-2xl font-bold text-white">{board.title}</h2>
            <p className="text-sm text-zinc-400 mt-1">
              Board ID: {board._id.slice(-6)}
            </p>
          </Link>
        ))}
      </div>

      <form
        onSubmit={createBoard}
        className="flex items-center gap-3 w-full max-w-md mb-6"
      >
        <input
          type="text"
          placeholder="New board title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="px-4 py-2 rounded-md bg-zinc-800 border border-zinc-600 text-white w-full"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md"
        >
          Create
        </button>
      </form>

      <div className="flex gap-4 mb-4">
        <button
          onClick={() => {
            setShowEditList(!showEditList);
            setShowDeleteList(false);
          }}
          className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded"
        >
          ✏️ Edit a Board
        </button>
        <button
          onClick={() => {
            setShowDeleteList(!showDeleteList);
            setShowEditList(false);
          }}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          🗑️ Delete a Board
        </button>
      </div>

      {showEditList && (
        <div
          ref={editRef}
          className="mt-4 bg-zinc-800 p-4 rounded shadow max-w-md w-full"
        >
          <h3 className="text-lg font-semibold mb-2">Click a board to rename:</h3>
          <ul className="space-y-2">
            {boards.map((b) => (
              <li
                key={b._id}
                className="bg-zinc-700 px-4 py-2 rounded flex items-center justify-between"
              >
                {editingId === b._id ? (
                  <>
                    <input
                      autoFocus
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && submitEdit()}
                      className="bg-zinc-900 border border-zinc-500 rounded px-2 py-1 text-white flex-grow mr-2"
                    />
                    <button
                      onClick={submitEdit}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                    >
                      Save
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => startEdit(b)}
                    className="text-left w-full"
                  >
                    {b.title}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {showDeleteList && (
        <div
          ref={deleteRef}
          className="mt-4 bg-zinc-800 p-4 rounded shadow max-w-md w-full"
        >
          <h3 className="text-lg font-semibold mb-2">Click a board to delete:</h3>
          <ul className="space-y-2">
            {boards.map((b) => (
              <li
                key={b._id}
                onClick={() => handleDelete(b._id)}
                className="cursor-pointer bg-zinc-700 hover:bg-red-600 px-4 py-2 rounded"
              >
                {b.title}
              </li>
            ))}
          </ul>
        </div>
      )}

      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded shadow-md text-center animate-fade">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
