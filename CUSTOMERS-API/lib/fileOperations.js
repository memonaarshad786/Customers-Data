const fs = require("fs");

const path = require("path");
const DATA_FILE = path.join(__dirname, "..", "customers.json");

// Error handling for file operations
function readData() {
  try {
    const data = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading data file:", error);
    return [];
  }
}

function writeData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error writing data file:", error);
    throw error;
  }
}

module.exports = {
  readData,
  writeData,
};
