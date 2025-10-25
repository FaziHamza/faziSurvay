# School Portal Demo Guide

Welcome to the School Portal MVP! This is a fully functional, demo-ready application that runs entirely in your browser with no backend required.

## 🎯 Quick Start

1. **Run the application:**
   ```bash
   npm run dev
   ```

2. **Access the login page:**
   Open your browser to `http://localhost:5173`

3. **Choose a role to demo:**
   - Admin: `admin@school.edu` / `admin123`
   - Teacher: `teacher@school.edu` / `teacher123`
   - Viewer: `viewer@school.edu` / `viewer123`

## 🎬 Screencast Demo Flow

### 1. Role-Based Login (2 minutes)
- Show the login page with school branding
- Use quick login buttons to demonstrate all three roles
- Show how each role has different navigation menus

### 2. Admin - Branding Customization (3 minutes)
**Login as Admin**

- Navigate to **Branding** page
- Change school name: "Riverside High School" → "Your Demo School"
- Upload a new logo (or use existing)
- Select different color presets
- Change fonts and templates
- Save changes
- Show how branding applies throughout the entire app

### 3. Admin - File Management (2 minutes)
- Navigate to **Uploads** page
- Click "Choose Files" to upload demo files
- Show uploaded files list with icons
- Download a file to demonstrate retrieval
- Delete a file to show management capabilities

### 4. Admin - Survey Creation (3 minutes)
- Navigate to **Survey Builder**
- Click "Create Survey"
- Add survey details:
  - Title: "Demo Feedback Survey"
  - Description: "Help us improve"
- Add different question types:
  - Text question
  - Multiple choice
  - Rating (1-5)
  - Yes/No question
- Set some questions as required
- Publish the survey
- Show the survey in the list with response count

### 5. Admin - Preview Mode (2 minutes)
- Navigate to **Portal** page
- Toggle "Preview Mode" to show draft content
- Show published vs draft surveys
- Explain this is what users see

### 6. Teacher Role (2 minutes)
**Logout and login as Teacher**

- Show Dashboard with teacher-specific features
- Navigate to **Survey Builder**
- View existing surveys and responses
- Click "Responses" to view submitted survey answers
- Show anonymous vs identified responses

### 7. Viewer - Taking Surveys (3 minutes)
**Logout and login as Viewer**

- Navigate to **Portal** page
- Click "Take Survey" on a published survey
- Show the survey form with school branding
- Toggle **Anonymous Submission**
- Fill out the survey
- Submit and show confirmation

### 8. Admin - View Responses (2 minutes)
**Logout and login as Admin**

- Navigate to **Survey Builder**
- Click "Responses" on a survey
- Show all submitted responses
- Point out anonymous responses
- Show response timestamps and details

### 9. Data Management (2 minutes)
- Navigate to **Data Management** page
- Show storage statistics
- Export all data as JSON
- Explain import functionality
- Show the "Clear All Data" option (don't click it!)

### 10. Smooth Navigation Demo (1 minute)
- Show the sticky navigation bar
- Demonstrate mobile responsive menu
- Switch between pages smoothly
- Show role-based menu items

## ✨ Key Features to Highlight

### Local Storage
- **Everything persists** in the browser
- No database or backend required
- Data survives page refreshes
- Export/import functionality

### Branding
- ✅ Custom colors (6 presets)
- ✅ Logo upload
- ✅ Multiple fonts
- ✅ 4 template styles
- ✅ Applied throughout entire app

### Role-Based Access
- ✅ Admin: Full access to all features
- ✅ Teacher: Survey and file management
- ✅ Viewer: Portal access and survey submission

### Survey Features
- ✅ Multiple question types (text, multiple choice, rating, yes/no)
- ✅ Required field validation
- ✅ Draft and published states
- ✅ Anonymous submission option
- ✅ Response viewing and management

### File Management
- ✅ Upload multiple file types
- ✅ Preview images
- ✅ Download files
- ✅ Delete files
- ✅ Displays file size and type

### Preview Mode
- ✅ Admin can see draft content
- ✅ Toggle between published and all content
- ✅ See exactly what users see

## 📊 Demo Data Included

The application comes pre-loaded with:
- 3 surveys (2 published, 1 draft)
- 5 files (images and PDFs)
- 4 sample survey responses
- 1 configured school (Riverside High School)

## 🎨 UX/UI Highlights

- Clean, modern interface
- Mobile responsive design
- Smooth transitions and animations
- Clear empty states with helpful messages
- Branded color scheme throughout
- Intuitive navigation
- Loading states on actions
- Success confirmations

## 🔐 Security Features

- Role-based access control
- Protected routes
- Session management
- Anonymous survey option

## 💾 Data Persistence

All data is stored in `localStorage`:
- `school_data` - Branding and school info
- `surveys_data` - All surveys
- `files_data` - Uploaded files (base64)
- `survey_responses` - All survey submissions
- `auth_token` - User session

## 🚀 Production Ready Features

- ✅ Build optimized for production
- ✅ No console errors
- ✅ Clean code structure
- ✅ Type-safe with TypeScript
- ✅ Responsive on all devices
- ✅ Fast load times
- ✅ Smooth animations

## 📝 Talking Points for Demo

1. **"This is a complete MVP that requires no backend"**
   - Everything runs in the browser
   - Perfect for pilot testing
   - Easy to deploy anywhere

2. **"Role-based access control"**
   - Three distinct user roles
   - Different permissions for each
   - Secure and organized

3. **"Full customization for each school"**
   - Upload their logo
   - Choose their colors
   - Set their identity

4. **"Anonymous feedback capability"**
   - Encourages honest responses
   - Respects user privacy
   - Still tracks submission data

5. **"Data export for analysis"**
   - Download all data as JSON
   - Import to other systems
   - Backup and restore

6. **"Demo ready and polished"**
   - Professional UI/UX
   - Smooth interactions
   - Production-quality code

## 🎥 Estimated Demo Time

- Quick demo: 10 minutes
- Comprehensive demo: 20 minutes
- Full feature walkthrough: 30 minutes

## 🐛 Known Limitations (By Design)

- No real authentication (uses mock users)
- Files stored as base64 (size limited)
- Single browser storage (no sync)
- No email notifications

These are **intentional** for the MVP/demo phase and would be added with a real backend.

---

**Ready to impress!** 🚀

This MVP demonstrates all core functionality needed for a school portal pilot program, with beautiful UI, smooth interactions, and professional polish.
