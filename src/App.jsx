import { useState, useRef } from 'react'
import JSZip from 'jszip'
import './App.css'

function App() {
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState('')
  const fileInputRef = useRef(null)

  const createAndDownloadZip = async (files) => {
    setProgress('Creating ZIP file...')
    
    const zip = new JSZip()
    
    for (const file of files) {
      zip.file(file.filename, file.content)
    }
    
    const zipBlob = await zip.generateAsync({ type: 'blob' })
    
    const url = URL.createObjectURL(zipBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'chatgpt-chats.zip'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleFileSelect = (event) => {
    const selectedFile = event.target.files[0]
    if (selectedFile) {
      if (selectedFile.type === 'application/json' || selectedFile.name.endsWith('.json')) {
        setFile(selectedFile)
        setStatus(`Selected: ${selectedFile.name} (${(selectedFile.size / 1024 / 1024).toFixed(1)} MB)`)
      } else {
        setStatus('Please select a JSON file')
      }
    }
  }

  const handleConvert = async () => {
    if (!file) {
      setStatus('Please select a JSON file first')
      return
    }

    setIsProcessing(true)
    setStatus('Starting conversion...')
    setProgress('Reading file...')

    try {
      // Create a Web Worker for processing
      const worker = new Worker(new URL('./worker.js', import.meta.url))
      
      worker.onmessage = async (event) => {
        const { type, data } = event.data
        
        switch (type) {
          case 'progress':
            setProgress(data.message)
            break
          case 'success':
            setProgress(`Processed ${data.conversationCount} conversations`)
            try {
              await createAndDownloadZip(data.files)
              setStatus('Conversion completed! Download should start automatically.')
            } catch (zipError) {
              setStatus(`Error creating ZIP: ${zipError.message}`)
            }
            setIsProcessing(false)
            worker.terminate()
            break
          case 'error':
            setStatus(`Error: ${data.message}`)
            setProgress('')
            setIsProcessing(false)
            worker.terminate()
            break
        }
      }

      // Read the file and send to worker
      const fileContent = await file.text()
      worker.postMessage({
        type: 'process',
        data: {
          content: fileContent,
          fileName: file.name
        }
      })

    } catch (error) {
      setStatus(`Error: ${error.message}`)
      setProgress('')
      setIsProcessing(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setStatus('')
    setProgress('')
    setIsProcessing(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="app">
      <div className="container">
        <h1>ChatGPT Export Splitter</h1>
        <p className="description">
          Upload your ChatGPT export JSON and download each chat as a separate .txt file
        </p>

        <div className="upload-section">
          <div className="file-input-wrapper">
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileSelect}
              disabled={isProcessing}
              id="file-input"
            />
            <label htmlFor="file-input" className={`file-input-label ${isProcessing ? 'disabled' : ''}`}>
              {file ? 'Change File' : 'Choose JSON File'}
            </label>
          </div>

          <button
            onClick={handleConvert}
            disabled={!file || isProcessing}
            className="convert-button"
          >
            {isProcessing ? 'Converting...' : 'Convert / Export'}
          </button>

          {file && !isProcessing && (
            <button onClick={handleReset} className="reset-button">
              Reset
            </button>
          )}
        </div>

        <div className="status-section">
          {status && (
            <div className={`status ${isProcessing ? 'processing' : ''}`}>
              {status}
            </div>
          )}
          
          {progress && (
            <div className="progress">
              {progress}
            </div>
          )}
        </div>

        <div className="instructions">
          <h3>Instructions:</h3>
          <ol>
            <li>Export your ChatGPT conversations from ChatGPT settings</li>
            <li>Select the exported JSON file using the button above</li>
            <li>Click "Convert / Export" to process your conversations</li>
            <li>A ZIP file will be downloaded containing individual .txt files for each conversation</li>
          </ol>
        </div>
      </div>
    </div>
  )
}

export default App