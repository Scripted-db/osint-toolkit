import { Download } from 'lucide-react'

const DownloadSection = ({ onDownloadJSON, onDownloadCSV }) => {
  return (
    <div className="w-full">
      <div className="flex flex-col space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-dark-300">Download Options</h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          <button
            onClick={onDownloadJSON}
            className="group flex items-center justify-center space-x-2 px-3 py-2.5 text-sm text-dark-300 hover:text-white hover:bg-dark-700 rounded-lg border border-dark-600 transition-all duration-200 hover:border-primary-500/50"
            aria-label="Download as JSON"
          >
            <Download className="w-4 h-4 group-hover:scale-110 transition-transform" aria-hidden="true" />
            <span className="font-medium">JSON</span>
          </button>
          
          <button
            onClick={onDownloadCSV}
            className="group flex items-center justify-center space-x-2 px-3 py-2.5 text-sm text-dark-300 hover:text-white hover:bg-dark-700 rounded-lg border border-dark-600 transition-all duration-200 hover:border-primary-500/50"
            aria-label="Download as CSV"
          >
            <Download className="w-4 h-4 group-hover:scale-110 transition-transform" aria-hidden="true" />
            <span className="font-medium">CSV</span>
          </button>
        </div>

        <div className="block sm:hidden">
          <button
            onClick={() => {
              onDownloadJSON()
              setTimeout(() => onDownloadCSV(), 100)
            }}
            className="group w-full flex items-center justify-center space-x-2 px-4 py-3 text-sm text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-all duration-200"
            aria-label="Download all formats"
          >
            <Download className="w-4 h-4 group-hover:scale-110 transition-transform" aria-hidden="true" />
            <span className="font-medium">Download All Formats</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default DownloadSection

