import { useEffect, useRef } from 'react'
import './App.css'

function App() {
  // Create a reference to the worker object.
  const worker = useRef<Worker | null>(null);

  // We use the `useEffect` hook to setup the worker as soon as the `App` component is mounted.
  useEffect(() => {
    // Create the worker if it does not yet exist.
    worker.current ??= new Worker(new URL('./worker.js', import.meta.url), {
        type: 'module'
    });

    // Create a callback function for messages from the worker thread.
    const onMessageReceived = (e: MessageEvent) => {
      // TODO: Will fill in later
    };

    // Attach the callback function as an event listener.
    worker.current.addEventListener('message', onMessageReceived);

    // Define a cleanup function for when the component is unmounted.
    return () => worker.current?.removeEventListener('message', onMessageReceived);
  }, []);
  
  return (
    <>
      <h1>Hello World</h1>
    </>
  )
}

export default App
