import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Define the base URL for your API.
const API = 'http://localhost:5000';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [editItem, setEditItem] = useState(null);
  const [loginError, setLoginError] = useState('');
  const [itemErrorMessage, setItemErrorMessage] = useState(''); // New state for item-related errors

  // State for managing current page/view (to simulate routing for Selenium)
  const [currentPage, setCurrentPage] = useState('login'); // 'login' or 'items'

  // State for custom confirmation modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmModalMessage, setConfirmModalMessage] = useState('');
  const [confirmModalCallback, setConfirmModalCallback] = useState(null);

  // Function to fetch all items from the API
  const fetchItems = async () => {
    try {
      const res = await axios.get(`${API}/items`);
      setItems(res.data);
    } catch (error) {
      console.error("Error fetching all items:", error);
      setItemErrorMessage('Failed to load items.'); // Display error if fetching fails
    }
  };

  // Handle user login
  const handleLogin = async () => {
    setLoginError(''); // Clear previous login error
    setItemErrorMessage(''); // Clear any item errors
    try {
      const res = await axios.post(`${API}/login`, { username, password });
      setLoggedIn(true);
      setCurrentPage('items'); // Navigate to items page on successful login
      fetchItems();
      // In a real app, you might store the token: localStorage.setItem('userToken', res.data.token);
    } catch (error) {
      console.error("Login failed:", error);
      if (error.response && error.response.data && error.response.data.error) {
        setLoginError(error.response.data.error);
      } else {
        setLoginError('An unexpected error occurred during login.');
      }
    }
  };

  // Handle user logout
  const handleLogout = () => {
    setLoggedIn(false);
    setUsername('');
    setPassword('');
    setItems([]);
    setNewItem('');
    setEditItem(null);
    setLoginError('');
    setItemErrorMessage('');
    setCurrentPage('login'); // Navigate back to login page
    // In a real app, you'd also clear any stored tokens: localStorage.removeItem('userToken');
  };

  // Handle creating a new item
  const handleCreate = async () => {
    setItemErrorMessage(''); // Clear previous item error
    if (!newItem.trim()) {
      setItemErrorMessage('Item name is required.'); // Client-side validation
      return;
    }
    try {
      await axios.post(`${API}/items`, { name: newItem });
      setNewItem('');
      fetchItems();
    } catch (error) {
      console.error("Error creating item:", error);
      if (error.response && error.response.data && error.response.data.error) {
        setItemErrorMessage(error.response.data.error); // Use specific backend error
      } else {
        setItemErrorMessage('Failed to create item.');
      }
    }
  };

  // Handle updating an existing item
  const handleUpdate = async (id) => {
    setItemErrorMessage(''); // Clear previous item error
    if (!editItem.name.trim()) {
      setItemErrorMessage('Item name cannot be empty.'); // Client-side validation
      return;
    }
    try {
      await axios.put(`${API}/items/${id}`, { name: editItem.name });
      setEditItem(null);
      fetchItems();
    } catch (error) {
      console.error("Error updating item:", error);
      if (error.response && error.response.data && error.response.data.error) {
        setItemErrorMessage(error.response.data.error); // Use specific backend error
      } else {
        setItemErrorMessage('Failed to update item.');
      }
    }
  };

  // Handle deleting an item (using custom confirmation modal)
  const handleDelete = (id) => {
    setConfirmModalMessage("Are you sure you want to delete this item?");
    setConfirmModalCallback(() => async () => {
      setItemErrorMessage(''); // Clear previous item error
      try {
        await axios.delete(`${API}/items/${id}`);
        fetchItems();
        setShowConfirmModal(false); // Close modal on success
      } catch (error) {
        console.error("Error deleting item:", error);
        if (error.response && error.response.data && error.response.data.error) {
          setItemErrorMessage(error.response.data.error);
        } else {
          setItemErrorMessage('Failed to delete item.');
        }
        setShowConfirmModal(false); // Close modal even on error
      }
    });
    setShowConfirmModal(true); // Show the confirmation modal
  };

  // Use useEffect to fetch items when the user logs in
  useEffect(() => {
    if (loggedIn && currentPage === 'items') { // Only fetch if logged in AND on items page
      fetchItems();
    }
  }, [loggedIn, currentPage]); // Dependency array: runs when 'loggedIn' or 'currentPage' state changes

  // Simple Modal Component (for confirmations/alerts)
  const Modal = ({ message, onConfirm, onCancel }) => {
    if (!showConfirmModal) return null; // Only render if showConfirmModal is true

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
          <p className="text-lg mb-4">{message}</p>
          <div className="flex justify-center gap-4">
            <button
              id="confirmButton" // ID for Selenium
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
              onClick={onConfirm}
            >
              Confirm
            </button>
            <button
              id="cancelButton" // ID for Selenium
              className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition duration-300"
              onClick={onCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Simple App</h1>

        {/* Render content based on currentPage state */}
        {currentPage === 'login' && (
          <div className="space-y-4">
            <input
              id="username" // Added ID for Selenium
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
            <input
              id="password" // Added ID for Selenium
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <button
              id="loginButton" // Added ID for Selenium
              className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition duration-300 ease-in-out shadow-md"
              onClick={handleLogin}
            >
              Login
            </button>
            {loginError && (
              <p className="text-red-500 text-sm mt-2 text-center error"> {/* Added class for Selenium */}
                {loginError}
              </p>
            )}
          </div>
        )}

        {currentPage === 'items' && (
          <div>
            {/* Logout Button */}
            <div className="flex justify-end mb-4">
              <button
                id="logoutBtn" // Added ID for Selenium
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-300 ease-in-out shadow-md"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>

            {/* Item-related error message */}
            {itemErrorMessage && (
              <p className="text-red-500 text-sm mb-4 error"> {/* Added class for Selenium */}
                {itemErrorMessage}
              </p>
            )}

            {/* Section for adding new items */}
            <h2 className="text-2xl font-semibold text-gray-700 mt-8 mb-4">Manage Items</h2>
            <div className="flex gap-2 mb-4">
              <input
                id="newItemInput" // Added ID for Selenium
                className="flex-grow p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                value={newItem}
                onChange={e => setNewItem(e.target.value)}
                placeholder="New item name"
              />
              <button
                id="addItemButton" // Added ID for Selenium
                className="bg-green-600 text-white p-3 rounded-md hover:bg-green-700 transition duration-300 ease-in-out shadow-md"
                onClick={handleCreate}
              >
                Add Item
              </button>
            </div>

            {/* List of all items */}
            <h3 className="font-semibold text-xl text-gray-700 mb-3">All Items:</h3>
            <ul id="itemList" className="space-y-3"> {/* Added ID for Selenium */}
              {items.map(item => (
                <li
                  key={item.id}
                  className="flex items-center justify-between bg-gray-50 p-3 rounded-md shadow-sm"
                >
                  {editItem?.id === item.id ? (
                    // Edit mode for an item
                    <div className="flex-grow flex gap-2">
                      <input
                        id="editItemInput" // Added ID for Selenium
                        className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        value={editItem.name}
                        onChange={e => setEditItem({ ...editItem, name: e.target.value })}
                      />
                      <button
                        id="saveItemButton" // Added ID for Selenium
                        className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition duration-300 ease-in-out shadow-md"
                        onClick={() => handleUpdate(item.id)}
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    // Display mode for an item
                    <div className="flex-grow text-gray-700">
                      <span className="font-medium">ID:</span> {item.id} - <span className="font-medium">Name:</span> {item.name}
                    </div>
                  )}
                  {/* Action buttons for items */}
                  <div className="flex gap-2 ml-4">
                    {editItem?.id !== item.id && (
                      <>
                        <button
                          className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition duration-300 ease-in-out shadow-md edit-btn" // Added class for Selenium
                          onClick={() => setEditItem(item)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-300 ease-in-out shadow-md delete-btn" // Added class for Selenium
                          onClick={() => handleDelete(item.id)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {/* Custom Confirmation Modal */}
      <Modal
        message={confirmModalMessage}
        onConfirm={confirmModalCallback}
        onCancel={() => setShowConfirmModal(false)}
      />
    </div>
  );
}

export default App;
