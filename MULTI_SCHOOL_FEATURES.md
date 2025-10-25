# Multi-School Management System

## Overview

The School Portal now supports complete multi-school management with isolated data, per-school branding, file uploads, and user management. Each school operates as a completely independent instance with its own users, content, and customization.

## Key Features

### 1. School Management

**Location:** `/schools` (Admin only)

- Create unlimited schools with unique identities
- Edit school details and branding
- Delete schools (with protection for last school)
- View all schools with their configurations

**School Properties:**
- Unique ID
- School name
- Logo (image URL or upload)
- Primary and secondary colors
- Tagline
- Template style (modern, classic, minimal, vibrant)
- Font family (inter, roboto, poppins, playfair)
- Creation timestamp

### 2. Per-School Branding

**Location:** `/admin` (Admin only)

Each school has completely customizable branding:
- Custom logo upload or URL
- Color scheme with 6 preset options
- Primary and secondary colors
- Template selection
- Font selection
- Live preview of changes

**Branding applies to:**
- Login page
- Navigation bar
- Dashboard header
- All portal pages
- Survey forms
- Public-facing content

### 3. Per-School File Uploads

**Location:** `/uploads` (Admin, Teacher)

File uploads are completely isolated per school:
- Each school has its own file library
- Upload multiple file types (images, PDFs, documents)
- Files stored as base64 in localStorage with school-specific keys
- Delete and manage files independently
- File metadata includes name, type, size, and upload date

**Storage Key Format:** `files_data_{schoolId}`

### 4. Per-School User Management (Mock AWS Cognito)

**Location:** `/users` (Admin only)

Complete user management system simulating AWS Cognito:

**Features:**
- Create users with email, name, password, and role
- Edit existing users
- Delete users (with protection for last user)
- Password visibility toggle
- Three role levels: Admin, Teacher, Viewer

**Default Users per School:**
- Admin: admin@school.edu / admin123
- Teacher: teacher@school.edu / teacher123
- Viewer: viewer@school.edu / viewer123

**Mock Cognito Flow:**
- Simulates AWS Cognito user pools
- JWT token generation with school context
- Session management with expiration
- Role-based access control
- School-specific authentication

**Storage Key:** `school_users` (contains all schools' users)

### 5. School Switcher

**Location:** Navbar (when multiple schools exist)

Convenient dropdown to switch between schools:
- Shows school logo and name
- Indicates active school
- Click to switch instantly
- Page reloads with new school context

### 6. Data Isolation

Every school has completely isolated data:

**School-Specific Storage Keys:**
- `school_data_{schoolId}` - Branding configuration
- `surveys_data_{schoolId}` - Survey definitions
- `files_data_{schoolId}` - Uploaded files
- `survey_responses_{schoolId}` - Survey submissions

**Shared Storage Keys:**
- `schools_list` - List of all schools
- `active_school_id` - Currently active school
- `school_users` - All users across schools
- `auth_token` - Current session token

## Authentication Flow

### School-Aware Login

1. User visits login page
2. Login page displays active school branding
3. User enters credentials
4. System validates against active school's user pool
5. JWT token includes `schoolId` in payload
6. Token validated on every request to ensure school match
7. Switching schools requires re-authentication

### Security Features

- Users are scoped to specific schools
- Cannot access data from other schools
- Logout required when switching schools
- Token includes school context
- Role-based access control within each school

## User Roles & Permissions

### Admin Role
- Full access to all features
- School management (create, edit, delete)
- User management (create, edit, delete users)
- Branding customization
- File uploads and management
- Survey creation and management
- View all responses
- Data export/import

### Teacher Role
- File uploads and management
- Survey creation and management
- View responses for their surveys
- Access to portal preview

### Viewer Role
- Access to public portal
- Take surveys
- View published content
- Read-only access

## Dashboard Integration

The admin dashboard shows:
- School Management card with school count
- User Management card with user count
- Quick access to all management features
- Statistics for active school

## Technical Implementation

### Multi-School Storage System

```typescript
// Get school-specific key
function getSchoolKey(key: string): string {
  const schoolId = multiSchoolStorage.getActiveSchoolId();
  return `${key}_${schoolId}`;
}
```

### School Authentication System

```typescript
// Validate credentials for specific school
schoolAuth.validateCredentials(email, password, schoolId);

// Get users for specific school
schoolAuth.getUsersBySchool(schoolId);
```

### JWT Token Structure

```json
{
  "sub": "user-id",
  "email": "user@example.com",
  "name": "User Name",
  "role": "admin",
  "schoolId": "school-1",
  "iat": 1234567890,
  "exp": 1234654290
}
```

## Data Export/Import

**Location:** `/data` (Admin only)

Export includes school-specific data:
- Current school's branding
- Current school's surveys
- Current school's files (base64)
- Current school's responses
- Current school's users

Import restores data for the active school only.

## Migration from Single School

The system automatically migrates existing data:
1. Existing school becomes `school-1`
2. Existing data gets school-specific keys
3. Default users created for the school
4. No data loss during migration

## Usage Example

### Creating a New School

1. Login as admin
2. Navigate to "Schools" in navbar
3. Click "Create School"
4. Fill in school details:
   - Name: "Westside Academy"
   - Logo URL: (upload or paste URL)
   - Tagline: "Learning Excellence"
   - Select colors and template
5. Click "Save"
6. New school appears in list

### Switching to New School

1. Click "School Switcher" in navbar
2. Select "Westside Academy"
3. Page reloads
4. Now managing Westside Academy
5. Create users for this school
6. Customize branding
7. Upload files
8. Create surveys

### Adding Users to School

1. Navigate to "Users" page
2. Click "Create User"
3. Enter user details:
   - Email: teacher@westside.edu
   - Name: Jane Smith
   - Password: secure123
   - Role: Teacher
4. Click "Save User"
5. User can now login to this school

## Best Practices

### School Management
- Use descriptive school names
- Choose distinct colors for each school
- Upload recognizable logos
- Set meaningful taglines

### User Management
- Use role-appropriate email addresses
- Follow consistent password policies
- Assign minimum required permissions
- Regularly review user access

### File Management
- Organize files by school
- Use descriptive filenames
- Consider file size limits (base64 storage)
- Clean up unused files

### Data Management
- Export data regularly for backups
- Test imports in isolated environment
- Monitor localStorage usage
- Clear old data periodically

## Limitations

### By Design (MVP)
- No cross-school data sharing
- No school-to-school user transfers
- Base64 file storage (size limited)
- Single browser localStorage
- Mock authentication (not real Cognito)

### Future Enhancements
- Real AWS Cognito integration
- Cloud file storage (S3)
- Cross-school reporting
- User role assignments across schools
- School hierarchy/districts
- API backend for persistence
- Multi-device sync
- Email notifications

## Storage Structure

```
localStorage:
├── schools_list
│   └── Array of School objects
├── active_school_id
│   └── Current school ID string
├── school_users
│   └── Object mapping schoolId to User arrays
├── auth_token
│   └── Current JWT token
├── school_data_school-1
│   └── School 1 branding
├── surveys_data_school-1
│   └── School 1 surveys
├── files_data_school-1
│   └── School 1 files
├── survey_responses_school-1
│   └── School 1 responses
├── school_data_school-2
│   └── School 2 branding
└── ... (continues for each school)
```

## Demonstration Flow

### For Clients/Stakeholders

1. **Show Multiple Schools**
   - Login as admin
   - Navigate to Schools page
   - Show existing schools
   - Create a new school live

2. **Switch Between Schools**
   - Use School Switcher
   - Show data isolation
   - Demonstrate independent branding

3. **User Management**
   - Create users for a school
   - Show role-based access
   - Login as different users

4. **Complete Isolation**
   - Upload files in School A
   - Switch to School B
   - Show files are separate
   - Create survey in each school
   - Show responses are isolated

## Conclusion

The multi-school management system provides enterprise-grade capabilities for managing multiple educational institutions from a single platform. Each school operates as an independent entity with complete data isolation, custom branding, and dedicated user management, all powered by localStorage for the MVP phase.

The mock AWS Cognito implementation demonstrates production-ready authentication patterns and can be easily replaced with actual Cognito integration for deployment.
