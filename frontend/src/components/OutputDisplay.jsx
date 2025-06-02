import React, { useState } from 'react';
import { Copy, Download, RefreshCw, Check, FileText } from 'lucide-react';

const OutputDisplay = ({ content, isLoading }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (content?.content) {
      try {
        await navigator.clipboard.writeText(content.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    }
  };

  const handleDownload = () => {
    if (content?.content) {
      const blob = new Blob([content.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `blog-${content.topic.replace(/\s+/g, '-').toLowerCase()}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Generating your blog content...</p>
            <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
          </div>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg font-medium">Ready to Generate</p>
            <p className="text-sm text-gray-500 mt-2">
              Enter a topic and click "Generate Blog" to create content
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Generated Content</h3>
          <p className="text-sm text-gray-500">
            {content.word_count} words • {content.character_count} characters
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-green-600">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>Copy</span>
              </>
            )}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center space-x-1 px-3 py-2 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="prose max-w-none">
          <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
            {content.content}
          </div>
        </div>
      </div>

      {/* Footer with metadata */}
      <div className="px-6 py-4 bg-gray-50 border-t rounded-b-lg">
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <span>
            <strong>Topic:</strong> {content.topic}
          </span>
          <span>
            <strong>Type:</strong> {content.blog_type.replace('_', ' ')}
          </span>
          <span>
            <strong>Style:</strong> {content.writing_style}
          </span>
          <span>
            <strong>Temperature:</strong> {content.temperature}
          </span>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          Generated on {new Date(content.created_at).toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default OutputDisplay; 