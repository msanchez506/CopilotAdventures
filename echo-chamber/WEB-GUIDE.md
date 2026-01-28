# Echo Chamber Web Interface Guide

## 🌐 Web Server Setup

The Echo Chamber now includes a modern web interface built with Express.js, HTML5, CSS3, and vanilla JavaScript.

### Starting the Web Server

```bash
cd /workspaces/CopilotAdventures/echo-chamber
npm run web
```

Then open your browser and navigate to:
```
http://localhost:3000
```

### Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern UI**: Beautiful gradient design with smooth animations
- **Real-time Predictions**: Instant feedback on sequence predictions
- **Memory Management**: View all stored sequences with timestamps
- **Demo Mode**: Test with pre-configured sequences
- **RESTful API**: Programmatic access to all features

## 📱 Interface Overview

### Navigation Tabs

The web interface has three main sections:

#### 1. **Predict Tab** (Default)
   - Enter a sequence to get predictions
   - Two action buttons:
     - **Predict**: Calculate next number without storing
     - **Echo & Store**: Calculate and save to memory
   - Includes info box with examples

#### 2. **Demo Tab**
   - Run demo with 8 different sequences
   - See both successful and failed predictions
   - Test the Chamber's pattern recognition

#### 3. **Memories Tab**
   - View all stored sequences
   - See predictions and timestamps
   - Clear all memories when needed

## 🔌 REST API Endpoints

### Health Check

```http
GET /api/health
```

**Response:**
```json
{
  "status": "ok",
  "message": "Echo Chamber is running"
}
```

### Predict Next Number

```http
POST /api/predict
Content-Type: application/json

{
  "sequence": [3, 6, 9, 12]
}
```

**Success Response:**
```json
{
  "success": true,
  "nextNumber": 15,
  "difference": 3,
  "isValid": true,
  "error": null
}
```

**Error Response:**
```json
{
  "success": false,
  "nextNumber": null,
  "difference": null,
  "error": "Not an arithmetic progression",
  "isValid": false
}
```

### Echo and Store

```http
POST /api/echo
Content-Type: application/json

{
  "sequence": [3, 6, 9, 12]
}
```

**Response:**
```json
{
  "success": true,
  "echo": {
    "sequence": [3, 6, 9, 12],
    "prediction": 15,
    "success": true,
    "error": null,
    "timestamp": "2026-01-28T21:45:30.123Z"
  },
  "memoryCount": 1
}
```

### Get All Memories

```http
GET /api/memories
```

**Response:**
```json
{
  "memories": [
    {
      "sequence": [3, 6, 9, 12],
      "prediction": 15,
      "success": true,
      "error": null,
      "timestamp": "2026-01-28T21:45:30.123Z"
    }
  ],
  "count": 1
}
```

### Clear Memories

```http
POST /api/memories/clear
```

**Response:**
```json
{
  "success": true,
  "message": "Memories cleared successfully"
}
```

### Get Demo Data

```http
GET /api/demo
```

**Response:**
```json
{
  "demos": [
    {
      "name": "Multiples of 3",
      "sequence": [3, 6, 9, 12, 15],
      "prediction": 18,
      "success": true,
      "error": null
    },
    ...
  ]
}
```

## 🎨 Design & Layout

### Color Scheme

```css
Primary:     #7c3aed (Purple)
Secondary:   #06b6d4 (Cyan)
Success:     #10b981 (Green)
Danger:      #ef4444 (Red)
Background:  Linear gradient (Purple to Violet)
Card:        White with shadows
```

### Responsive Breakpoints

- **Desktop**: Full layout with 3-column grids
- **Tablet**: 2-column grids, adjusted spacing
- **Mobile**: Single column, optimized touch targets

### Accessibility

- Semantic HTML structure
- ARIA labels where appropriate
- Keyboard navigation support
- High contrast ratios
- Focus visible states

## 📊 File Structure

```
echo-chamber/
├── web.js                 # Express server configuration
├── package.json           # Dependencies (Express)
└── public/
    ├── index.html         # Main HTML file
    ├── styles.css         # Complete styling
    └── app.js            # Client-side logic
```

## 🚀 Running Both Interfaces

You can run both console and web interfaces:

```bash
# Terminal 1: Console interface
npm start

# Terminal 2: Web interface  
npm run web
```

The web server runs on `http://localhost:3000` by default.
The console interface runs interactively in the terminal.

## 🛠️ Customization

### Change Server Port

```bash
PORT=5000 npm run web
```

### Modify Styling

Edit `public/styles.css` to customize:
- Colors (use CSS variables at top)
- Layout (grid templates)
- Animations (keyframes)
- Responsive breakpoints

### Add New Features

1. Add UI in `public/index.html`
2. Add styles in `public/styles.css`
3. Add client logic in `public/app.js`
4. Add API endpoint in `web.js`

### Examples

**Add new API endpoint in web.js:**
```javascript
app.post('/api/custom', (req, res) => {
  // Your logic here
  res.json({ result: 'success' });
});
```

**Add client function in app.js:**
```javascript
async function customFunction() {
  const response = await fetch('/api/custom', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: 'value' })
  });
  const data = await response.json();
  // Handle response
}
```

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Use different port
PORT=3001 npm run web
```

### Express Not Installed

```bash
npm install
npm run web
```

### Styling Not Loading

- Check that `public/` folder exists
- Verify CSS file is named `styles.css`
- Clear browser cache (Ctrl+Shift+Delete)

### API Requests Failing

- Check browser console for errors (F12)
- Verify server is running
- Check network tab in DevTools
- Ensure correct JSON format

## 📈 Performance

- **Client-side**: Minimal dependencies, vanilla JS
- **Server-side**: Express with efficient routing
- **Memory**: In-memory storage (can add database later)
- **Load Time**: ~100ms API responses
- **Browser Support**: All modern browsers (IE11 requires polyfills)

## 🔒 Security Notes

For production use, consider:

- Input validation (already implemented)
- Rate limiting (use `express-rate-limit`)
- CORS configuration (use `cors` package)
- HTTPS (use reverse proxy like nginx)
- Environment variables for configuration

## 📚 Related Files

- Main logic: [index.js](index.js)
- Tests: [test.js](test.js)
- Console interface: [Running `npm start`]
- Full docs: [README.md](README.md)

## 🎓 Learning Resources

### Front-end Concepts
- Fetch API for HTTP requests
- DOM manipulation
- CSS Grid and Flexbox
- Event handling
- Async/await patterns

### Back-end Concepts
- Express.js routing
- REST API design
- Middleware patterns
- Static file serving
- Error handling

### Full-Stack
- Client-server communication
- Request/response cycles
- Data serialization (JSON)
- State management (in-memory)

---

**Happy exploring!** Open `http://localhost:3000` in your browser to get started. 🚀
