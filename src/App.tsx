import { useEffect, useRef, useState } from 'react'
import { LanguageSelector, Progress } from './components';
import './App.css'

function App() {
  // Create a reference to the worker object.
  const worker = useRef<Worker | null>(null);
  const [sourceLanguage, setSourceLanguage] = useState('eng_Latn');
  const [targetLanguage, setTargetLanguage] = useState('fra_Latn');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [ready, setReady] = useState(false);
  const [progressItems, setProgressItems] = useState<{ file: string, progress: number }[]>([]);
  const [disabled, setDisabled] = useState(false);

  // We use the `useEffect` hook to setup the worker as soon as the `App` component is mounted.
  useEffect(() => {
    // Create the worker if it does not yet exist.
    if (!worker.current) {
      worker.current = new Worker(new URL('./worker.ts', import.meta.url), {
        type: 'module'
      });
    }

    // Create a callback function for messages from the worker thread.
    const onMessageReceived = (message: MessageEvent) => {
      // TODO: Will fill in later
    };

    // Attach the callback function as an event listener.
    worker.current.addEventListener('message', onMessageReceived);

    // Define a cleanup function for when the component is unmounted.
    return () => worker.current?.removeEventListener('message', onMessageReceived);
  }, []);

  const translate = () => {
    setDisabled(true);
    worker.current?.postMessage({
      text: input,
      src_lang: sourceLanguage,
      tgt_lang: targetLanguage,
    });
  }

  return (
    <>
      <h1>Transformers.js</h1>
      <h2>ML-powered multilingual translation in React!</h2>

      <div className='container'>
        <div className='language-container'>
          <LanguageSelector label='Source' defaultLanguage='eng_Latn' onChange={x => setSourceLanguage(x.target.value)} />
          <LanguageSelector label='Target' defaultLanguage='fra_Latn' onChange={x => setTargetLanguage(x.target.value)} />
        </div>

        <div className='textbox-container'>
          <textarea value={input} rows={3} onChange={e => setInput(e.target.value)}></textarea>
          <textarea value={output} rows={3} readOnly></textarea>
        </div>
      </div>

      <button disabled={disabled} onClick={translate}>Translate</button>

      <div className='progress-bars-container'>
        {ready === false && (
          <label>Loading models... (only run once)</label>
        )}
        {progressItems.map(data => (
          <div key={data.file}>
            <Progress text={data.file} progress={data.progress} />
          </div>
        ))}
      </div>
    </>
  )
}

export default App
