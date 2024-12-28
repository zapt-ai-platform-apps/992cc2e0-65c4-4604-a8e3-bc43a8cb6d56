import { createSignal, onMount, createEffect, Show } from 'solid-js';
import { supabaseClient } from './supabaseClient';
import AuthComponent from './components/Auth';
import ContentGenerator from './components/ContentGenerator';

function App() {
  const [title, setTitle] = createSignal('');
  const [topics, setTopics] = createSignal('');
  const [numSlides, setNumSlides] = createSignal(1);
  const [generatedContent, setGeneratedContent] = createSignal([]);
  const [loading, setLoading] = createSignal(false);
  const [user, setUser] = createSignal(null);
  const [currentPage, setCurrentPage] = createSignal('login');
  const [previewMode, setPreviewMode] = createSignal(false);
  const [downloadFormat, setDownloadFormat] = createSignal('pdf');

  const checkUserSignedIn = async () => {
    console.log('Checking if user is signed in...');
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (user) {
      setUser(user);
      setCurrentPage('homePage');
      console.log('User is signed in:', user);
    }
  };

  onMount(checkUserSignedIn);

  createEffect(() => {
    const { data: authListener } = supabaseClient.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        setCurrentPage('homePage');
        console.log('User signed in:', session.user);
      } else {
        setUser(null);
        setCurrentPage('login');
        console.log('User signed out.');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  });

  const handleSignOut = async () => {
    console.log('Signing out user...');
    await supabaseClient.auth.signOut();
    setUser(null);
    setCurrentPage('login');
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-4 h-full">
      <Show
        when={currentPage() === 'homePage'}
        fallback={<AuthComponent supabaseClient={supabaseClient} />}
      >
        <ContentGenerator
          title={title}
          setTitle={setTitle}
          topics={topics}
          setTopics={setTopics}
          numSlides={numSlides}
          setNumSlides={setNumSlides}
          generatedContent={generatedContent}
          setGeneratedContent={setGeneratedContent}
          loading={loading}
          setLoading={setLoading}
          handleSignOut={handleSignOut}
          previewMode={previewMode}
          setPreviewMode={setPreviewMode}
          downloadFormat={downloadFormat}
          setDownloadFormat={setDownloadFormat}
          user={user}
        />
      </Show>
    </div>
  );
}

export default App;