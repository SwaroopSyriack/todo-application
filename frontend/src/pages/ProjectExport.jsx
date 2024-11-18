import React, { useState, useEffect } from 'react';
import { Download, Github } from 'lucide-react';
import api from '../api';

const ProjectExporter = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [gistDescription, setGistDescription] = useState('');
  const [exportSuccess, setExportSuccess] = useState(null);
  const [showGistDialog, setShowGistDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    getProjects();
  }, []);

  const getProjects = () => {
    setLoading(true);
    api
      .get("api/projects/")
      .then((res) => res.data)
      .then((data) => {
        setProjects(data);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
        setProjects([]);
      })
      .finally(() => setLoading(false));
  };

  const handleExport = async (project, type) => {
    setLoading(true);
    setError(null);
    setExportSuccess(null);

    try {
      if (type === 'markdown') {
        const response = await api.post(`api/projects/${project.id}/export/`, null, {
          params: { type: 'markdown' }
        });
        // Trigger download of markdown file
        const blob = new Blob([response.data], { type: 'text/markdown' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${project.title.replace(' ', '_')}.md`;
        a.click();
        window.URL.revokeObjectURL(url);
        setExportSuccess('Markdown exported successfully!');
      } else if (type === 'gist') {
        const response = await api.post(`api/projects/${project.id}/export/`, {
          description: gistDescription
        }, {
          params: { type: 'gist' }
        });
        setExportSuccess(`Gist created successfully! View it at: ${response.data.gist_url}`);
        setShowGistDialog(false);
        setGistDescription('');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Export failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !projects.length) {
    return <div className="flex items-center justify-center p-8">Loading projects...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Project Exporter</h1>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {exportSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
          {exportSuccess}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <div 
            key={project.id} 
            className="border rounded-lg shadow-sm bg-white"
          >
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">{project.title}</h2>
            </div>
            <div className="p-4">
              <div className="flex gap-2">
                <button 
                  className="flex items-center px-3 py-2 border rounded-md hover:bg-gray-50 transition-colors"
                  onClick={() => handleExport(project, 'markdown')}
                  disabled={loading}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Markdown
                </button>

                <button
                  className="flex items-center px-3 py-2 border rounded-md hover:bg-gray-50 transition-colors"
                  onClick={() => {
                    setSelectedProject(project);
                    setShowGistDialog(true);
                  }}
                >
                  <Github className="w-4 h-4 mr-2" />
                  Export to Gist
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Gist Dialog */}
      {showGistDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Create GitHub Gist</h3>
              <button 
                onClick={() => setShowGistDialog(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label 
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Gist Description
                </label>
                <input
                  id="description"
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Enter a description for your gist"
                  value={gistDescription}
                  onChange={(e) => setGistDescription(e.target.value)}
                />
              </div>
              <button 
                onClick={() => handleExport(selectedProject, 'gist')}
                disabled={loading}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
              >
                Create Gist
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectExporter;