import { useState } from 'react';
import { Plus, Edit, Trash2, Users as UsersIcon, Save, X, Eye, EyeOff } from 'lucide-react';
import { schoolAuth } from '../lib/schoolAuth';
import { multiSchoolStorage } from '../lib/multiSchoolStorage';
import type { User, Role } from '../types';

export function UserManagement() {
  const activeSchoolId = multiSchoolStorage.getActiveSchoolId();
  const activeSchool = multiSchoolStorage.getActiveSchool();
  const [users, setUsers] = useState<User[]>(schoolAuth.getAllUsersForSchool(activeSchoolId));
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({
    email: '',
    name: '',
    password: '',
    role: 'viewer',
  });

  const handleCreate = () => {
    setIsCreating(true);
    setFormData({
      email: '',
      name: '',
      password: '',
      role: 'viewer',
    });
    setShowPassword(false);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      ...user,
      password: user.password || '',
    });
    setShowPassword(false);
  };

  const handleSave = () => {
    if (!formData.email || !formData.name || !formData.password) {
      alert('Please fill in all required fields');
      return;
    }

    if (isCreating) {
      const newUser: User = {
        id: `${activeSchoolId}-user-${Date.now()}`,
        email: formData.email,
        name: formData.name,
        password: formData.password,
        role: (formData.role as Role) || 'viewer',
        schoolId: activeSchoolId,
        createdAt: new Date().toISOString(),
      };
      schoolAuth.addUser(newUser);
    } else if (editingUser) {
      const updatedUser: User = {
        ...editingUser,
        email: formData.email!,
        name: formData.name!,
        password: formData.password!,
        role: (formData.role as Role) || editingUser.role,
      };
      schoolAuth.updateUser(editingUser.id, updatedUser);
    }

    setUsers(schoolAuth.getAllUsersForSchool(activeSchoolId));
    handleCancel();
  };

  const handleDelete = (userId: string) => {
    if (users.length === 1) {
      alert('Cannot delete the last user in the school');
      return;
    }
    if (window.confirm('Are you sure you want to delete this user?')) {
      schoolAuth.deleteUser(userId, activeSchoolId);
      setUsers(schoolAuth.getAllUsersForSchool(activeSchoolId));
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingUser(null);
    setFormData({
      email: '',
      name: '',
      password: '',
      role: 'viewer',
    });
    setShowPassword(false);
  };

  const getRoleBadgeColor = (role: Role) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'teacher':
        return 'bg-blue-100 text-blue-800';
      case 'viewer':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
            <p className="text-gray-600">
              Manage users for <span className="font-semibold">{activeSchool.name}</span>
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create User
          </button>
        </div>

        {(isCreating || editingUser) && (
          <div className="mb-8 p-6 border-2 border-blue-200 bg-blue-50 rounded-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {isCreating ? 'Create New User' : 'Edit User'}
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="user@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password || ''}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                      placeholder="Enter password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.role || 'viewer'}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="admin">Admin</option>
                    <option value="teacher">Teacher</option>
                    <option value="viewer">Viewer</option>
                  </select>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Mock AWS Cognito Flow:</strong> This simulates AWS Cognito user management.
                  In production, this would integrate with actual Cognito for secure authentication.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Save User
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="p-6 border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                    style={{ backgroundColor: activeSchool.primaryColor }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{user.name}</h3>
                    <p className="text-gray-600 text-sm">{user.email}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${getRoleBadgeColor(user.role)}`}>
                        {user.role}
                      </span>
                      <span className="text-xs text-gray-500">
                        Created: {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(user)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit User"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  {users.length > 1 && (
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete User"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {users.length === 0 && (
          <div className="text-center py-12">
            <UsersIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">No users yet. Create your first user!</p>
          </div>
        )}

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3">Mock AWS Cognito Credentials</h3>
          <p className="text-sm text-blue-800 mb-4">
            This system simulates AWS Cognito user pools. Each school has isolated user credentials stored in localStorage.
          </p>
          <div className="bg-white rounded border border-blue-200 p-4">
            <h4 className="font-medium text-gray-900 mb-2">Default Login Credentials:</h4>
            <div className="space-y-2 text-sm font-mono">
              <div>
                <span className="text-gray-600">Admin:</span> admin@school.edu / admin123
              </div>
              <div>
                <span className="text-gray-600">Teacher:</span> teacher@school.edu / teacher123
              </div>
              <div>
                <span className="text-gray-600">Viewer:</span> viewer@school.edu / viewer123
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
