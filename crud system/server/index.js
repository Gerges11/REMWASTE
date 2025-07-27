const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const PORT = 5000; // The port your backend will listen on

// Middleware
app.use(cors()); // Enables Cross-Origin Resource Sharing for your frontend
app.use(bodyParser.json()); // Parses incoming request bodies in JSON format

// In-memory data stores (for demonstration purposes)
let items = [
  { id: 1, name: 'Sample Item 1' },
  { id: 2, name: 'Sample Item 2' }
];

let users = [{ username: 'admin', password: 'admin' }]; // Simple user for login

// --- API Endpoints ---

// POST /login: Authenticates a user
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  // Find if a user with matching credentials exists
  const user = users.find(u => u.username === username && u.password === password);
  
  if (user) {
    // If user found, send success response
    res.json({ success: true , token: "fake-jwt-token"});
  } else {
    // If not found, send 401 Unauthorized with an error message
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// GET /items: Retrieves all items
app.get('/items', (req, res) => {
  res.json(items);
});

app.get('/items/:id', (req, res) => {
  const id = parseInt(req.params.id); // Get the item ID from the URL parameters and convert to integer
  const item = items.find(i => i.id === id); // Find the item in the array by its ID

  if (item) {
    // If the item is found, send it as a JSON response with a 200 OK status
    res.json(item);
    res.status(200);
    
  } else {
    // If the item is not found, send a 404 Not Found status with an error message
    res.status(404).json({ error: 'Item not found' });
  }
});

// POST /items: Adds a new item
app.post('/items', (req, res) => {
  const newItem = { id: Date.now(), name: req.body.name }; // Create new item with unique ID
  items.push(newItem); // Add to the in-memory array
  res.status(201).json(newItem); // Send back the created item with 201 Created status
});

// PUT /items/:id: Updates an existing item by ID
app.put('/items/:id', (req, res) => {
  const id = parseInt(req.params.id); // Get ID from URL parameters
  const index = items.findIndex(i => i.id === id); // Find the item's index

  if (index !== -1) {
    items[index].name = req.body.name; // Update the item's name
    res.json(items[index]); // Send back the updated item
  } else {
    res.status(404).json({ error: 'Item not found' }); // Item not found error
  }
});

// DELETE /items/:id: Deletes an item by ID
app.delete('/items/:id', (req, res) => {
  const id = parseInt(req.params.id); // Get ID from URL parameters
  const initialLength = items.length; // Store initial length BEFORE filtering

  // Filter out the item. 'items' will be a new array without the deleted item (if found).
  items = items.filter(i => i.id !== id);

  // Check if the length of the items array has changed.
  // If it has, an item was successfully removed.
  if (items.length < initialLength) {
    // Send 204 No Content for successful deletion, as no response body is needed.
    res.status(200).send();
  } else {
    // If the length hasn't changed, it means no item with that ID was found.
    // Send a 404 Not Found status with an error message.
    res.status(404).json({ error: 'Item not found' });
  }
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
