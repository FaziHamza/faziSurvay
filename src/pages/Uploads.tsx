import { useState, useEffect } from 'react';
import { Upload, File, Image, FileText, Trash2, Download } from 'lucide-react';
import { storage } from '../lib/storage';
import type { UploadedFile } from '../types';

export function Uploads() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const school = storage.getSchool();
  const fileInputRef = useState<HTMLInputElement | null>(null);

  useEffect(() => {
    setFiles(storage.getFiles());
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    const newFiles: UploadedFile[] = [];

    Array.from(selectedFiles).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newFile: UploadedFile = {
          id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          type: file.type,
          url: reader.result as string,
          size: file.size,
          uploadedAt: new Date().toISOString(),
        };
        newFiles.push(newFile);

        if (newFiles.length === selectedFiles.length) {
          const updatedFiles = [...storage.getFiles(), ...newFiles];
          storage.saveFiles(updatedFiles);
          setFiles(updatedFiles);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this file?')) {
      const updatedFiles = files.filter(f => f.id !== id);
      storage.saveFiles(updatedFiles);
      setFiles(updatedFiles);
    }
  };

  const handleDownload = (file: UploadedFile) => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    link.click();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="w-5 h-5 text-blue-500" />;
    if (type.includes('pdf')) return <FileText className="w-5 h-5 text-red-500" />;
    return <File className="w-5 h-5 text-gray-500" />;
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">File Uploads</h1>
          <p className="text-gray-600">Manage files for your school portal</p>
        </div>

        <div className="mb-6 p-6 border-2 border-dashed rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors text-center">
          <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p className="text-gray-600 mb-2">Drag and drop files here, or click to browse</p>
          <input
            type="file"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
          />
          <label
            htmlFor="file-upload"
            className="inline-block px-6 py-2 text-white rounded-lg hover:opacity-90 transition-colors font-medium cursor-pointer"
            style={{ backgroundColor: school.primaryColor }}
          >
            Choose Files
          </label>
          <p className="text-xs text-gray-500 mt-2">Maximum file size: 10MB</p>
        </div>

        <div className="overflow-hidden border border-gray-200 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  File
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Uploaded
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {files.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <File className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 mb-2">No files uploaded yet</p>
                    <p className="text-sm text-gray-400">Upload your first file to get started</p>
                  </td>
                </tr>
              ) : (
                files.map((file) => (
                <tr key={file.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      {getFileIcon(file.type)}
                      <span className="text-sm font-medium text-gray-900">{file.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {file.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatFileSize(file.size)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(file.uploadedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleDownload(file)}
                        className="p-2 hover:bg-blue-50 rounded transition-colors"
                        style={{ color: school.primaryColor }}
                        title="Download file"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(file.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete file"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
