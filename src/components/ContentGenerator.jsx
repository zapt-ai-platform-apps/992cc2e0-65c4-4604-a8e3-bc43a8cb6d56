import { For, Show } from 'solid-js';
import { createEvent } from '../supabaseClient';
import { Chart, Title, Tooltip, Legend, Colors } from 'chart.js';

Chart.register(Title, Tooltip, Legend, Colors);

function ContentGenerator(props) {
  const {
    title,
    setTitle,
    topics,
    setTopics,
    numSlides,
    setNumSlides,
    generatedContent,
    setGeneratedContent,
    loading,
    setLoading,
    handleSignOut,
    previewMode,
    setPreviewMode,
    downloadFormat,
    setDownloadFormat,
  } = props;

  const generateContent = async () => {
    setLoading(true);
    console.log('Generating content...');
    try {
      const response = await createEvent('chatgpt_request', {
        app_id: import.meta.env.VITE_PUBLIC_APP_ID,
        prompt: `Generate structured content for a presentation.
Title: ${title()}
Topics: ${topics()}
Number of Slides: ${numSlides()}
Response should be a JSON array with each slide containing a title and bullet points.`,
        response_type: 'json',
      });

      if (response) {
        setGeneratedContent(response.slides);
        console.log('Content generated:', response.slides);
      }
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    setLoading(true);
    console.log('Downloading content as', downloadFormat());
    try {
      const response = await createEvent('export_document', {
        app_id: import.meta.env.VITE_PUBLIC_APP_ID,
        format: downloadFormat(),
        content: generatedContent(),
      });

      if (response.url) {
        const link = document.createElement('a');
        link.href = response.url;
        link.download = `Presentation_Content.${downloadFormat()}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        console.log('Download initiated:', response.url);
      }
    } catch (error) {
      console.error('Error downloading document:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="max-w-4xl mx-auto h-full flex flex-col">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-4xl font-bold text-purple-600">Presentation Content Generator</h1>
        <button
          class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
          onClick={handleSignOut}
        >
          Sign Out
        </button>
      </div>

      <div class="flex-1 overflow-y-auto">
        <div class="bg-white p-6 rounded-lg shadow-md mb-6 box-border">
          <h2 class="text-2xl font-bold mb-4 text-purple-600">Create Your Presentation</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              generateContent();
            }}
            class="space-y-4"
          >
            <input
              type="text"
              placeholder="Title of Presentation"
              value={title()}
              onInput={(e) => setTitle(e.target.value)}
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
              required
            />
            <textarea
              placeholder="Topics (separated by commas)"
              value={topics()}
              onInput={(e) => setTopics(e.target.value)}
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
              rows="3"
              required
            ></textarea>
            <input
              type="number"
              min="1"
              max="20"
              placeholder="Number of Slides"
              value={numSlides()}
              onInput={(e) => setNumSlides(e.target.value)}
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
              required
            />
            <div class="flex space-x-4">
              <button
                type="submit"
                class={`flex-1 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${
                  loading() ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={loading()}
              >
                <Show when={loading()}>Generating...</Show>
                <Show when={!loading()}>Generate Content</Show>
              </button>
            </div>
          </form>
        </div>

        <Show when={generatedContent().length > 0}>
          <div class="bg-white p-6 rounded-lg shadow-md mb-6 box-border">
            <h2 class="text-2xl font-bold mb-4 text-purple-600">Generated Content Preview</h2>
            <For each={generatedContent()}>
              {(slide, index) => (
                <div class="mb-4">
                  <h3 class="text-xl font-semibold text-blue-500">
                    Slide {index() + 1}: {slide.title}
                  </h3>
                  <ul class="list-disc list-inside ml-4 text-gray-700">
                    <For each={slide.bullets}>{(bullet) => <li>{bullet}</li>}</For>
                  </ul>
                </div>
              )}
            </For>
            <div class="flex space-x-4 mt-4">
              <button
                onClick={() => setPreviewMode(true)}
                class="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
              >
                Preview
              </button>
              <button
                onClick={handleDownload}
                class={`flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${
                  loading() ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={loading()}
              >
                <Show when={loading()}>Downloading...</Show>
                <Show when={!loading()}>Download as {downloadFormat().toUpperCase()}</Show>
              </button>
            </div>
            <div class="mt-4">
              <label class="block text-gray-700">Choose Download Format:</label>
              <select
                value={downloadFormat()}
                onInput={(e) => setDownloadFormat(e.target.value)}
                class="mt-2 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
              >
                <option value="pdf">PDF</option>
                <option value="docx">Word</option>
              </select>
            </div>
          </div>
        </Show>

        <Show when={previewMode()}>
          <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div class="bg-white p-8 rounded-lg shadow-lg max-w-3xl w-full h-full overflow-y-auto">
              <h2 class="text-3xl font-bold mb-6 text-center text-purple-600">Presentation Preview</h2>
              <For each={generatedContent()}>
                {(slide, index) => (
                  <div class="mb-6">
                    <h3 class="text-2xl font-semibold text-blue-500">
                      Slide {index() + 1}: {slide.title}
                    </h3>
                    <ul class="list-disc list-inside ml-6 text-gray-700">
                      <For each={slide.bullets}>{(bullet) => <li>{bullet}</li>}</For>
                    </ul>
                  </div>
                )}
              </For>
              <button
                onClick={() => setPreviewMode(false)}
                class="mt-4 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </Show>
      </div>

      <a
        href="https://www.zapt.ai"
        target="_blank"
        rel="noopener noreferrer"
        class="mt-4 text-center text-sm text-gray-500 cursor-pointer"
      >
        Made on ZAPT
      </a>
    </div>
  );
}

export default ContentGenerator;