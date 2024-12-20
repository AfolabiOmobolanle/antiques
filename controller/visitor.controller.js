const fs = require('fs');
const path = require('path');

const visitorsFilePath = path.join(__dirname, '../data/visitors.json');
const usersFilePath = path.join(__dirname, '../data/users.json');

// Function to read JSON files safely
const readJSONFile = (filePath) => {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8') || '{}');
  } catch {
    return {};
  }
};

// Helper to write JSON files safely
const writeJSONFile = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(`Error writing to file: ${filePath}`, err);
  }
};

// Function to update user visit count (and save their data if they are new)
const updateUserVisit = (req) => {
  const today = new Date().toISOString().slice(0, 10);
  const userIP = req.ip; // Using IP as the unique identifier for the visitor

  // Read the current visitors data
  let visitors = readJSONFile(visitorsFilePath);

  // Reset the visitors file if the date has changed
  if (Object.keys(visitors)[0] && Object.keys(visitors)[0] !== today) {
    visitors = {}; // Clear previous day's data
  }

  // Initialize today's data if it doesn't exist
  if (!visitors[today]) {
    visitors[today] = {
      totalVisits: 0, // Total number of visits
      uniqueVisitors: [], // Array to store unique visitors' IPs
    };
  }

  // Increment total visit count for today
  visitors[today].totalVisits++;

  // Check if this user has already visited today
  if (!visitors[today].uniqueVisitors.includes(userIP)) {
    visitors[today].uniqueVisitors.push(userIP); // Add this IP if it's a new unique visitor
  }

  // Save updated visitors data
  writeJSONFile(visitorsFilePath, visitors);

  // Also save the user (visitor) to the users file if they haven't been saved already
  let users = readJSONFile(usersFilePath);

  // Check if the user already exists
  const userExists = users.some(user => user.ip === userIP);

  if (!userExists) {
    const newUser = { ip: userIP, visitDate: today }; // Store user IP and visit date
    users.push(newUser);
    writeJSONFile(usersFilePath, users); // Save new user data
  }
};

// Function to handle the homepage request and update user visit counts
const handleHomePage = (req, res) => {
  // Update user visit data
  updateUserVisit(req);

  // Track user count in the session
  if (!req.session.userCount) {
    req.session.userCount = 1; // Initialize count for first-time users
  } else {
    req.session.userCount++; // Increment user count on each visit
  }

  // Get visitor stats (total visits and unique visitors)
  const visitors = readJSONFile(visitorsFilePath);
  const today = new Date().toISOString().slice(0, 10);

  // Get the total user count (from session)
  const userCount = req.session.userCount;

  // Return stats (total visits, unique visitors, and user count for this session)
  if (!visitors[today]) {
    return res.status(200).json({
      message: 'Welcome to the homepage!',
      totalVisits: 0,
      uniqueVisitors: 0,
      userCount, // Add the user count from the session
      sessionExpiresAt: new Date(Date.now() + req.session.cookie.maxAge).toLocaleString(),
    });
  }

  const totalVisits = visitors[today].totalVisits;
  const uniqueVisitors = visitors[today].uniqueVisitors.length;

  return res.status(200).json({
    message: 'Welcome to the homepage!',
    totalVisits,
    uniqueVisitors,
    userCount, // Add the user count from the session
    sessionExpiresAt: new Date(Date.now() + req.session.cookie.maxAge).toLocaleString(),
  });
};

// Function to reset visitors data daily (optional)
const resetVisitorsData = () => {
  writeJSONFile(visitorsFilePath, {}); // Clear the visitors file
};

module.exports = {
  handleHomePage,
  resetVisitorsData,
};
