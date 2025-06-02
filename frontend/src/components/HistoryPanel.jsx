import React, { useState } from 'react';
import { useHistory, useDeleteGeneration } from '../hooks/useAPI';
import { Search, Trash2, Eye, Calendar, FileText, Loader2 } from 'lucide-react';

const HistoryPanel = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  
  const { data: history, isLoading, error } = useHistory({ 
    search: searchQuery || undefined 
  });
  const deleteMutation = useDeleteGeneration();

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this generation?')) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        console.error('Failed to delete:', error);
      }
    }
  };

  const handleView = (item) => {
    setSelectedItem(item);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-600">Failed to load history: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Generation History</h2>
          <p className="text-gray-600">
            {history?.total || 0} generations total
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by topic or content..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* History List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* List Panel */}
        <div className="space-y-4">
          {history?.items?.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No generations found</p>
              <p className="text-sm text-gray-500">
                {searchQuery ? 'Try a different search term' : 'Start generating some blog content!'}
              </p>
            </div>
          ) : (
            history?.items?.map((item) => (
              <div
                key={item.id}
                className={`bg-white rounded-lg border p-4 hover:shadow-md transition-shadow cursor-pointer ${
                  selectedItem?.id === item.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => handleView(item)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {item.topic}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {item.content}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(item.created_at)}
                      </span>
                      <span>{item.word_count} words</span>
                      <span className="capitalize">{item.blog_type.replace('_', ' ')}</span>
                      <span className="capitalize">{item.writing_style}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleView(item);
                      }}
                      className="p-1 text-gray-400 hover:text-blue-600"
                      title="View"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item.id);
                      }}
                      className="p-1 text-gray-400 hover:text-red-600"
                      title="Delete"
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Detail Panel */}
        <div className="lg:sticky lg:top-6">
          {selectedItem ? (
            <div className="bg-white rounded-lg border">
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedItem.topic}
                </h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                    {selectedItem.blog_type.replace('_', ' ')}
                  </span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                    {selectedItem.writing_style}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
                    {selectedItem.word_count} words
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-gray-800 text-sm leading-relaxed">
                    {selectedItem.content}
                  </div>
                </div>
              </div>
              <div className="p-4 bg-gray-50 border-t text-xs text-gray-500">
                Generated on {formatDate(selectedItem.created_at)}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border p-8">
              <div className="text-center">
                <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Select an item to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryPanel; 