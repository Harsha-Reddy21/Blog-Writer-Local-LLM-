import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useGenerateBlog } from '../hooks/useAPI';
import OutputDisplay from './OutputDisplay';
import { Loader2, Wand2, Settings } from 'lucide-react';

const BlogGenerator = () => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      topic: '',
      blog_type: 'intro',
      writing_style: 'professional',
      temperature: 0.7,
      max_tokens: 512,
    }
  });

  const generateMutation = useGenerateBlog();

  const onSubmit = async (data) => {
    try {
      const result = await generateMutation.mutateAsync(data);
      setGeneratedContent(result);
    } catch (error) {
      console.error('Generation failed:', error);
    }
  };

  const topicValue = watch('topic');
  const temperatureValue = watch('temperature');
  const maxTokensValue = watch('max_tokens');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Input Panel */}
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Generate Blog Content</h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Topic Input */}
            <div>
              <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
                Blog Topic *
              </label>
              <textarea
                {...register('topic', { 
                  required: 'Topic is required',
                  minLength: { value: 3, message: 'Topic must be at least 3 characters' }
                })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your blog topic (e.g., 'The benefits of artificial intelligence in healthcare')"
              />
              {errors.topic && (
                <p className="mt-1 text-sm text-red-600">{errors.topic.message}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                {topicValue.length}/500 characters
              </p>
            </div>

            {/* Blog Type */}
            <div>
              <label htmlFor="blog_type" className="block text-sm font-medium text-gray-700 mb-2">
                Blog Type
              </label>
              <select
                {...register('blog_type')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="intro">Blog Introduction</option>
                <option value="full_article">Full Article</option>
                <option value="listicle">Listicle</option>
                <option value="tutorial">Tutorial/How-to</option>
              </select>
            </div>

            {/* Writing Style */}
            <div>
              <label htmlFor="writing_style" className="block text-sm font-medium text-gray-700 mb-2">
                Writing Style
              </label>
              <select
                {...register('writing_style')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="professional">Professional</option>
                <option value="casual">Casual</option>
                <option value="technical">Technical</option>
                <option value="creative">Creative</option>
              </select>
            </div>

            {/* Advanced Settings Toggle */}
            <div>
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700"
              >
                <Settings className="h-4 w-4" />
                <span>{showAdvanced ? 'Hide' : 'Show'} Advanced Settings</span>
              </button>
            </div>

            {/* Advanced Settings */}
            {showAdvanced && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-md">
                {/* Temperature */}
                <div>
                  <label htmlFor="temperature" className="block text-sm font-medium text-gray-700 mb-2">
                    Temperature: {temperatureValue}
                  </label>
                  <input
                    {...register('temperature', { 
                      min: 0, 
                      max: 1, 
                      valueAsNumber: true 
                    })}
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>More Focused</span>
                    <span>More Creative</span>
                  </div>
                </div>

                {/* Max Tokens */}
                <div>
                  <label htmlFor="max_tokens" className="block text-sm font-medium text-gray-700 mb-2">
                    Max Tokens: {maxTokensValue}
                  </label>
                  <input
                    {...register('max_tokens', { 
                      min: 50, 
                      max: 2000, 
                      valueAsNumber: true 
                    })}
                    type="range"
                    min="50"
                    max="2000"
                    step="50"
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Shorter</span>
                    <span>Longer</span>
                  </div>
                </div>
              </div>
            )}

            {/* Generate Button */}
            <button
              type="submit"
              disabled={generateMutation.isPending}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generateMutation.isPending ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Wand2 className="h-5 w-5" />
                  <span>Generate Blog</span>
                </>
              )}
            </button>

            {/* Error Display */}
            {generateMutation.error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">
                  {generateMutation.error.response?.data?.detail || generateMutation.error.message}
                </p>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Output Panel */}
      <div>
        <OutputDisplay content={generatedContent} isLoading={generateMutation.isPending} />
      </div>
    </div>
  );
};

export default BlogGenerator; 