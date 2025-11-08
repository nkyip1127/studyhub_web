# StudyHub - University Study Platform

A web-based study platform designed for university students to collaborate, share resources, and track their academic progress.

## Features

- **Study Rooms**: Create and join virtual study rooms (public or private) with up to 20 participants
- **Resource Hub**: Upload and download study resources with a point-based system
- **Leaderboard**: Track weekly study time rankings (global and friends)
- **Friends System**: Add and manage friends, see their online status and study time
- **Gamification**: Earn study points through daily and weekly missions
- **Study Tracking**: Monitor total study time, weekly progress, and study streaks

## Getting Started

### Local Development

1. Simply open `index.html` in a web browser, or
2. Use a local web server:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (if you have http-server installed)
npx http-server

# Using PHP
php -S localhost:8000
```

3. Navigate to `http://localhost:8000` in your browser

### Deployment

This is a static website that can be deployed to any web hosting service:

#### GitHub Pages
1. Create a new repository on GitHub
2. Upload all files to the repository
3. Go to Settings > Pages
4. Select the main branch as source
5. Your site will be available at `https://yourusername.github.io/repository-name`

#### Netlify
1. Drag and drop the project folder to [Netlify](https://www.netlify.com/)
2. Your site will be live immediately

#### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project directory
3. Follow the prompts

#### Other Hosting Services
Any static hosting service will work:
- AWS S3 + CloudFront
- Google Cloud Storage
- Azure Static Web Apps
- Any traditional web hosting (cPanel, etc.)

## File Structure

```
├── index.html              # Login page
├── home.html              # Home page with missions and stats
├── study-room.html        # Study room listing and creation
├── study-room-interface.html  # Inside study room view
├── resource-hub.html      # Resource hub main page
├── resource-detail.html   # Resource detail page
├── leaderboard.html       # Leaderboard page
├── friends.html          # Friends list page
├── settings.html         # Settings page
├── styles.css            # All CSS styles
├── app.js                # JavaScript functionality
└── README.md            # This file
```

## Usage

### Login
- Username: Any text (demo purposes)
- Password: Any text (demo purposes)
- Click "Login" to enter the platform

### Study Points System

**Upload Points:**
- Past Papers: +300 pts (+100 if with solution)
- Lab Reports: +150 pts (+100 if with solution)
- Lecture Notes: +100 pts
- Homework: +200 pts (+100 if with solution)

**Unlock Points:**
- Past Papers: -300 pts (-100 more if with solution)
- Lab Reports: -150 pts (-100 more if with solution)
- Lecture Notes: -100 pts
- Homework: -200 pts (-100 more if with solution)

### Study Room Features
- Create public or private study rooms
- Private rooms require a 6-digit password
- Alert notification appears after 50 minutes of study
- Users are automatically removed if they don't confirm they're still active

### Missions
- **Daily Missions**: Login, study in rooms, join with friends
- **Weekly Missions**: Leaderboard rankings, upload resources, study time goals

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Notes

- This is a prototype/demo version
- All data is stored in browser memory (sessionStorage/localStorage)
- Data will be lost on page refresh (except for current session data)
- For production use, integrate with a backend database

## Color Scheme

- Primary Blue: #1565C0
- Dark Blue: #0D47A1
- Green (buttons): #4caf50
- Red (delete/logout): #f44336
- Font: Roboto

## License

This project is created for educational purposes.

