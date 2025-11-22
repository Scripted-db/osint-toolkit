import { RefreshCw } from 'lucide-react'
import CustomDropdown from '../../CustomDropdown'

const MIN_COUNT = 1
const MAX_COUNT = 100
const DEFAULT_COUNT = 1

const GenerationControls = ({
  dataType,
  setDataType,
  count,
  setCount,
  seed,
  setSeed,
  locale,
  setLocale,
  availableTypes,
  availableLocales,
  isGenerating,
  onGenerate
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-5">
      <div>
        <CustomDropdown
          label="Data Type"
          value={dataType}
          onChange={setDataType}
          options={availableTypes.map((type) => ({
            value: type.name,
            label: type.name.charAt(0).toUpperCase() + type.name.slice(1)
          }))}
          placeholder="Select data type..."
        />
      </div>

      <div>
        <label htmlFor="count-input" className="block text-base font-medium text-white mb-3">
          Count
        </label>
        <input
          id="count-input"
          type="number"
          min={MIN_COUNT}
          max={MAX_COUNT}
          value={count}
          onChange={(e) => setCount(Math.max(MIN_COUNT, Math.min(MAX_COUNT, parseInt(e.target.value) || DEFAULT_COUNT)))}
          className="input-field"
          aria-label="Number of items to generate"
        />
      </div>

      <div>
        <label htmlFor="seed-input" className="block text-base font-medium text-white mb-3">
          Seed (optional)
        </label>
        <input
          id="seed-input"
          type="text"
          value={seed}
          onChange={(e) => setSeed(e.target.value)}
          placeholder="e.g. 1234"
          className="input-field"
          aria-label="Seed for reproducible generation"
        />
      </div>

      <div>
        <label className="block text-base font-medium text-white mb-3">
          Locale
        </label>
        <div className="flex bg-dark-700 border border-dark-600 rounded-lg overflow-hidden" role="group" aria-label="Locale selection">
          {[
            { code: 'en', label: 'US' },
            { code: 'nl', label: 'NL' },
            { code: 'be', label: 'BE' }
          ].map((opt) => (
            <button
              key={opt.code}
              type="button"
              onClick={() => setLocale(opt.code)}
              className={`flex-1 px-4 py-3 text-base transition-colors ${
                locale === opt.code
                  ? 'bg-primary-600 text-white'
                  : 'text-dark-200 hover:bg-dark-600'
              }`}
              aria-pressed={locale === opt.code}
              aria-label={`Select ${opt.label} locale`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {availableLocales.length > 0 && !['en','nl','be'].every(l => availableLocales.includes(l)) && (
          <div className="mt-3">
            <CustomDropdown
              value={locale}
              onChange={setLocale}
              options={availableLocales.map((loc) => ({
                value: loc,
                label: loc.toUpperCase()
              }))}
              placeholder="Select locale..."
            />
          </div>
        )}
      </div>

      <div className="flex items-end">
        <button
          onClick={onGenerate}
          disabled={isGenerating}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          aria-label={isGenerating ? 'Generating data' : 'Generate data'}
          aria-busy={isGenerating}
        >
          {isGenerating ? (
            <RefreshCw className="w-5 h-5 animate-spin" aria-hidden="true" />
          ) : (
            <RefreshCw className="w-5 h-5" aria-hidden="true" />
          )}
          <span>{isGenerating ? 'Generating...' : 'Generate'}</span>
        </button>
      </div>
    </div>
  )
}

export default GenerationControls

