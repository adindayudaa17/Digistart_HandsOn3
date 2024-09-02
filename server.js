const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

let users = [];

const checkUserData = (data) => {
  return data.id && data.name;
};

app.get("/users", (req, res) => {
  res.json(users);
});

app.post("/users", (req, res) => {
  const user = req.body;
  if (!checkUserData(user)) {
    return res.status(400).json({ message: "Please fill the id and name data" });
  }
  const isExist = users.find((u) => u.id === user.id);
  if (!isExist) {
    users.push(user);
    res.status(201).json(user);
  } else {
    res.status(400).json({ message: `User with id ${user.id} already exists` });
  }
});

app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const user = req.body;
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) {
    res.status(404).json({ message: `User with id ${id} not found` });
  } else {
    users[index] = user;
    res.json(user);
  }
});

app.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) {
    res.status(404).json({ message: `User with id ${id} not found` });
  } else {
    users.splice(index, 1); // Removes the user by index
    res.status(204).end();
  }
});

app.get("/users/search", (req, res) => {
  const { name } = req.query;
  if (!name) {
    return res.status(400).json({ error: "Missing name query parameter" });
  }
  const filteredUsers = users.filter((u) => u.name.includes(name));
  if (filteredUsers.length === 0) {
    res.status(404).json({ message: "User not found" });
  } else {
    res.status(200).json(filteredUsers);
  }
});
