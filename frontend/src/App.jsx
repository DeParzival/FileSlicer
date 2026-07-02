import './App.css';
import { useVault } from './useVault'; // Adjust the import path if you put it in a /hooks folder

function App() {
  const {
    file,
    uploadStatus,
    uploading,
    generatedId,
    inputTrackingId,
    setInputTrackingId,
    handleFileChange,
    uploadFile,
    triggerDownload,
    copied,
    copyToClipboard
  } = useVault();

  return (
    <div className="dashboard-layout">
      {/* CARD 1: THE DEPOSIT VAULT */}
      <div className="upload-container">
        <h2>1. Deposit File (Slicer)</h2>
        <div className="input-group">
          <input type="file" onChange={handleFileChange} disabled={uploading} />
        </div>
        <button className="upload-btn" onClick={uploadFile} disabled={uploading || !file}>
          {uploading ? "Slicing & Stashing..." : "Stash File Chunks"}
        </button>
        <p className="status-text">{uploadStatus}</p>

        {generatedId && (
          <div className="receipt-box">
            <span className="receipt-label">YOUR TRACKING ID:</span>
            
            {/* Wrapped inside a layout container for horizontal side-by-side positioning */}
            <div className="receipt-row">
              <code className="receipt-id">{generatedId}</code>
              <button className="copy-btn" onClick={copyToClipboard}>
                {copied ? "Copied!" : "Copy ID"}
              </button>
            </div>
            
            <p className="receipt-note">Copy this ID to retrieve your file later!</p>
          </div>
        )}
      </div>

      {/* CARD 2: THE ASSEMBLY DISPENSER */}
      <div className="upload-container download-card">
        <h2>2. Retrieve File (Assembler)</h2>
        <div className="input-group">
          <input 
            type="text" 
            placeholder="Paste Unique Tracking ID here..." 
            value={inputTrackingId}
            onChange={(e) => setInputTrackingId(e.target.value)}
            className="text-input"
          />
        </div>
        <button className="upload-btn download-btn" onClick={triggerDownload}>
          Assemble & Download File
        </button>
      </div>
    </div>
  );
}

export default App;