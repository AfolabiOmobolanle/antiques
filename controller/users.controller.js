const fs = require('fs');
const path = require('path');

const usersFilePath = path.join(__dirname, '../data/users.json');

const saveUser = (req, res) => {
  const { first_name, last_name } = req.body;

  if (!first_name || !last_name) {
    return res.status(400).json({ error: 'Full name is required' });
  }

  const full_name = `${first_name} ${last_name}`;
 let users = [];
  try {
    users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8') || '[]');
  } catch (err) {
    console.error('Error reading users file:', err);
  }
  // Check if the user already exists
  const userExists = users.some(user => user.full_name === full_name);
  if (!userExists) {
    // Add user only if not already present
    users.push({ full_name });

    // Save updated users list back to the file
    try {
      fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
    } catch (err) {
      console.error('Error writing users file:', err);
      return res.status(500).json({ error: 'Failed to save user data' });
    }
  }

  // Start a session
  req.session.first_name = first_name;

  const greeting = `Hello, ${first_name} Welcome!`;

    req.session.greeting = greeting;


  res.status(200).json({
    message: 'User saved successfully',
    greeting: greeting,  
    first_name,
  });
};
if (!fs.existsSync(usersFilePath)) {
  fs.writeFileSync(usersFilePath, JSON.stringify({ userCount: 0 }, null, 2));
}

// Helper functions
const getTotalUsers = (callback) => {
  fs.readFile(usersFilePath, 'utf-8', (err, data) => {
    if (err) {
      return callback(err);
    }

    try {
      const users = JSON.parse(data || '[]');
      callback(null, users.length);  // Return the number of users
    } catch (e) {
      callback(new Error('Invalid JSON in users file'));
    }
  });
}

module.exports = {
  saveUser,
  getTotalUsers,
  
};
