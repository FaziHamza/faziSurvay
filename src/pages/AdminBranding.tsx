import { useState, useEffect } from 'react';
import { Save, Upload, Image as ImageIcon, Palette, Type, Layout } from 'lucide-react';
import { storage } from '../lib/storage';
import type { School } from '../types';

const colorPresets = [
  { name: 'Ocean Blue', primary: '#1e40af', secondary: '#3b82f6' },
  { name: 'Forest Green', primary: '#065f46', secondary: '#10b981' },
  { name: 'Sunset Orange', primary: '#c2410c', secondary: '#fb923c' },
  { name: 'Royal Purple', primary: '#6b21a8', secondary: '#a855f7' },
  { name: 'Cherry Red', primary: '#b91c1c', secondary: '#ef4444' },
  { name: 'Slate Gray', primary: '#334155', secondary: '#64748b' },
];

const templates = [
  { id: 'modern', name: 'Modern', description: 'Clean and contemporary design' },
  { id: 'classic', name: 'Classic', description: 'Traditional and professional' },
  { id: 'minimal', name: 'Minimal', description: 'Simple and elegant' },
  { id: 'vibrant', name: 'Vibrant', description: 'Bold and colorful' },
];

const fonts = [
  { id: 'inter', name: 'Inter', preview: 'Modern and readable' },
  { id: 'roboto', name: 'Roboto', preview: 'Clean and friendly' },
  { id: 'poppins', name: 'Poppins', preview: 'Geometric and modern' },
  { id: 'playfair', name: 'Playfair Display', preview: 'Elegant and classic' },
];

export function AdminBranding() {
  const [school, setSchool] = useState<School>(storage.getSchool());
  const [saved, setSaved] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string>(storage.getSchool().logo);

  useEffect(() => {
    const data = storage.getSchool();
    setSchool(data);
    setLogoPreview(data.logo);
  }, []);

  const handleSave = () => {
    storage.saveSchool(school);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setLogoPreview(result);
        setSchool({ ...school, logo: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const applyColorPreset = (preset: typeof colorPresets[0]) => {
    setSchool({ ...school, primaryColor: preset.primary, secondaryColor: preset.secondary });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">School Branding</h1>
          <p className="text-gray-600">Customize your school portal's appearance and branding</p>
        </div>

        <div className="space-y-8">
          <div className="border-b pb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Layout className="w-5 h-5 text-blue-600" />
              Portal Template
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSchool({ ...school, template: template.id as School['template'] })}
                  className={`p-4 border-2 rounded-lg text-left transition-all hover:shadow-md ${
                    school.template === template.id
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold text-gray-900 mb-1">{template.name}</div>
                  <div className="text-xs text-gray-600">{template.description}</div>
                </button>
              ))}
            </div>
          </div>
          <div className="border-b pb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">School Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  School Name
                </label>
                <input
                  type="text"
                  value={school.name}
                  onChange={(e) => setSchool({ ...school, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your school name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tagline
                </label>
                <input
                  type="text"
                  value={school.tagline}
                  onChange={(e) => setSchool({ ...school, tagline: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="A short description of your school"
                />
              </div>
            </div>
          </div>

          <div className="border-b pb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-blue-600" />
              School Logo
            </h2>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Logo
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label htmlFor="logo-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-1">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500">PNG, JPG up to 2MB</p>
                  </label>
                </div>
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Or enter image URL
                  </label>
                  <input
                    type="text"
                    value={school.logo}
                    onChange={(e) => {
                      setSchool({ ...school, logo: e.target.value });
                      setLogoPreview(e.target.value);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/logo.png"
                  />
                </div>
              </div>
              {logoPreview && (
                <div className="flex-shrink-0">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preview
                  </label>
                  <div className="w-40 h-40 border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="border-b pb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Palette className="w-5 h-5 text-blue-600" />
              Color Scheme
            </h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Quick Presets
              </label>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {colorPresets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => applyColorPreset(preset)}
                    className="group relative p-3 border-2 border-gray-200 rounded-lg hover:border-gray-400 transition-all"
                    title={preset.name}
                  >
                    <div className="flex gap-1">
                      <div
                        className="w-full h-8 rounded"
                        style={{ background: `linear-gradient(135deg, ${preset.primary}, ${preset.secondary})` }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 mt-1 text-center truncate">{preset.name}</p>
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={school.primaryColor}
                    onChange={(e) => setSchool({ ...school, primaryColor: e.target.value })}
                    className="h-12 w-16 rounded border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={school.primaryColor}
                    onChange={(e) => setSchool({ ...school, primaryColor: e.target.value })}
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
                    value={school.secondaryColor}
                    onChange={(e) => setSchool({ ...school, secondaryColor: e.target.value })}
                    className="h-12 w-16 rounded border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={school.secondaryColor}
                    onChange={(e) => setSchool({ ...school, secondaryColor: e.target.value })}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border-b pb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Type className="w-5 h-5 text-blue-600" />
              Typography
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fonts.map((font) => (
                <button
                  key={font.id}
                  onClick={() => setSchool({ ...school, font: font.id as School['font'] })}
                  className={`p-4 border-2 rounded-lg text-left transition-all hover:shadow-md ${
                    school.font === font.id
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold text-gray-900 mb-1">{font.name}</div>
                  <div className="text-sm text-gray-600">{font.preview}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
            {saved && (
              <p className="mt-2 text-sm text-green-600">Settings saved successfully!</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-md p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Live Preview</h2>
        <div className="space-y-4">
          <div
            className="p-8 rounded-lg text-white shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${school.primaryColor}, ${school.secondaryColor})`,
            }}
          >
            <div className="flex items-center gap-6">
              {logoPreview && (
                <img
                  src={logoPreview}
                  alt={school.name}
                  className="h-20 w-20 rounded-full object-cover border-4 border-white shadow-lg"
                />
              )}
              <div>
                <h3 className="text-3xl font-bold mb-1">{school.name || 'Your School Name'}</h3>
                <p className="text-lg text-white/90">{school.tagline || 'Your tagline here'}</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 p-6 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Template</p>
              <p className="text-gray-900 capitalize">{school.template}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Font</p>
              <p className="text-gray-900 capitalize">{fonts.find(f => f.id === school.font)?.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Primary Color</p>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded border" style={{ backgroundColor: school.primaryColor }} />
                <p className="text-gray-900 font-mono text-sm">{school.primaryColor}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Secondary Color</p>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded border" style={{ backgroundColor: school.secondaryColor }} />
                <p className="text-gray-900 font-mono text-sm">{school.secondaryColor}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
