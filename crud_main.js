// Import necessary modules
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const Database = require('better-sqlite3');

// Initialize the database
const db = new Database('product_data.db');
db.exec(`CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  type TEXT,
  price REAL,
  description TEXT,
  photoPath TEXT
)`);

// Function to create the main window
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Load the index.html of the app
  mainWindow.loadFile('index.html');
}

// Handle form submission
ipcMain.on('submit-form', (event, product) => {
  const stmt = db.prepare('INSERT INTO products (name, type, price, description, photoPath) VALUES (?, ?, ?, ?, ?)');
  stmt.run(product.name, product.type, product.price, product.description, product.photoPath);
  event.reply('form-submission-reply', 'Product added successfully!');
});

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
  createWindow();
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
