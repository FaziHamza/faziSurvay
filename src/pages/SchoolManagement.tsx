import { useState } from 'react';
import { Plus, Edit, Trash2, Building2, Save, X } from 'lucide-react';
import { multiSchoolStorage } from '../lib/multiSchoolStorage';
import type { School } from '../types';

export function SchoolManagement() {
  const [schools, setSchools] = useState<School[]>(multiSchoolStorage.getAllSchools());
  const [editingSchool, setEditingSchool] = useState<School | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Partial<School>>({
    name: '',
    logo: '',
    primaryColor: '#1e40af',
    secondaryColor: '#3b82f6',
    tagline: '',
    template: 'modern',
    font: 'inter',
  });

  const handleCreate = () => {
    setIsCreating(true);
    setFormData({
      name: '',
      logo: '',
      primaryColor: '#1e40af',
      secondaryColor: '#3b82f6',
      tagline: '',
      template: 'modern',
      font: 'inter',
    });
  };

  const handleEdit = (school: School) => {
    setEditingSchool(school);
    setFormData(school);
  };

  const handleSave = () => {
    if (isCreating) {
      const newSchool: School = {
        id: `school-${Date.now()}`,
        name: formData.name || 'New School',
        logo: formData.logo || 'https://images.pexels.com/photos/207662/pexels-photo-207662.jpeg?auto=compress&cs=tinysrgb&w=200',
        primaryColor: formData.primaryColor || '#1e40af',
        secondaryColor: formData.secondaryColor || '#3b82f6',
        tagline: formData.tagline || '',
        template: (formData.template as School['template']) || 'modern',
        font: (formData.font as School['font']) || 'inter',
        createdAt: new Date().toISOString(),
      };
      multiSchoolStorage.addSchool(newSchool);
    } else if (editingSchool) {
      const updatedSchool: School = {
        ...editingSchool,
        ...formData,
      } as School;
      multiSchoolStorage.updateSchool(editingSchool.id, updatedSchool);
    }

    setSchools(multiSchoolStorage.getAllSchools());
    handleCancel();
  };

  const handleDelete = (id: string) => {
    if (schools.length === 1) {
      alert('Cannot delete the last school');
      return;
    }
    if (window.confirm('Are you sure you want to delete this school? All associated data will be lost.')) {
      multiSchoolStorage.deleteSchool(id);
      setSchools(multiSchoolStorage.getAllSchools());
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingSchool(null);
    setFormData({
      name: '',
      logo: '',
      primaryColor: '#1e40af',
      secondaryColor: '#3b82f6',
      tagline: '',
      template: 'modern',
      font: 'inter',
    });
  };

  const activeSchoolId = multiSchoolStorage.getActiveSchoolId();

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">School Management</h1>
            <p className="text-gray-600">Create and manage multiple school portals</p>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create School
          </button>
        </div>

        {(isCreating || editingSchool) && (
          <div className="mb-8 p-6 border-2 border-blue-200 bg-blue-50 rounded-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {isCreating ? 'Create New School' : 'Edit School'}
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    School Name
                  </label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter school name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logo URL
                  </label>
                  <input
                    type="text"
                    value={formData.logo || ''}
                    onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/logo.png"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={formData.tagline || ''}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="School tagline"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Template
                  </label>
                  <select
                    value={formData.template || 'modern'}
                    onChange={(e) => setFormData({ ...formData, template: e.target.value as School['template'] })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="modern">Modern</option>
                    <option value="classic">Classic</option>
                    <option value="minimal">Minimal</option>
                    <option value="vibrant">Vibrant</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Color
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={formData.primaryColor || '#1e40af'}
                      onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                      className="h-10 w-16 rounded border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.primaryColor || '#1e40af'}
                      onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Secondary Color
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={formData.secondaryColor || '#3b82f6'}
                      onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                      className="h-10 w-16 rounded border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.secondaryColor || '#3b82f6'}
                      onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Save
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
          {schools.map((school) => (
            <div
              key={school.id}
              className={`p-6 border-2 rounded-lg transition-all ${
                school.id === activeSchoolId
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start gap-4">
                <img
                  src={school.logo}
                  alt={school.name}
                  className="h-16 w-16 rounded-full object-cover border-2 border-gray-200"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        {school.name}
                        {school.id === activeSchoolId && (
                          <span className="text-xs px-2 py-1 bg-blue-600 text-white rounded-full">
                            Active
                          </span>
                        )}
                      </h3>
                      <p className="text-gray-600 mt-1">{school.tagline}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span className="capitalize">Template: {school.template}</span>
                        <span className="capitalize">Font: {school.font}</span>
                        <div className="flex items-center gap-2">
                          <span>Colors:</span>
                          <div className="flex gap-1">
                            <div
                              className="w-5 h-5 rounded border border-gray-300"
                              style={{ backgroundColor: school.primaryColor }}
                              title={school.primaryColor}
                            />
                            <div
                              className="w-5 h-5 rounded border border-gray-300"
                              style={{ backgroundColor: school.secondaryColor }}
                              title={school.secondaryColor}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(school)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit School"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      {schools.length > 1 && (
                        <button
                          onClick={() => handleDelete(school.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete School"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {schools.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">No schools yet. Create your first school!</p>
          </div>
        )}
      </div>
    </div>
  );
}
