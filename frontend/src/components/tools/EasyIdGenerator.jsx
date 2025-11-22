import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  User,
  Mail,
  MapPin,
  Building,
  CreditCard,
  Users,
  Key,
  Copy,
  Hash,
  Eye,
  EyeOff
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import api from '../../services/api'
import GenerationControls from './EasyIdGenerator/GenerationControls'
import DownloadSection from './EasyIdGenerator/DownloadSection'
import DataItemCard from './EasyIdGenerator/DataItemCard'
import SocialDataCard from './EasyIdGenerator/SocialDataCard'

// Constants
const DEFAULT_COUNT = 1


const EasyIdGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedData, setGeneratedData] = useState([])
  const [dataType, setDataType] = useState('person')
  const [count, setCount] = useState(DEFAULT_COUNT)
  const [locale, setLocale] = useState('en')
  const [seed, setSeed] = useState('')
  const [usedSeed, setUsedSeed] = useState('')
  const [includeSensitive, setIncludeSensitive] = useState(false)
  const [showSensitive, setShowSensitive] = useState(false)
  const [useIpForLocation, setUseIpForLocation] = useState(false)
  const [availableLocales, setAvailableLocales] = useState([])
  const [availableTypes, setAvailableTypes] = useState([])

  // Data type configs
  const dataTypeConfig = {
    person: { icon: User, color: 'text-blue-400', name: 'Person Profile' },
    contact: { icon: Mail, color: 'text-green-400', name: 'Contact Info' },
    email: { icon: Mail, color: 'text-purple-400', name: 'Email Addresses' },
    username: { icon: Users, color: 'text-pink-400', name: 'Usernames' },
    address: { icon: MapPin, color: 'text-orange-400', name: 'Addresses' },
    company: { icon: Building, color: 'text-cyan-400', name: 'Companies' },
    creditcard: { icon: CreditCard, color: 'text-red-400', name: 'Credit Cards' },
    basic_opsec: { icon: Users, color: 'text-indigo-400', name: 'Basic Opsec' },
    apikey: { icon: Key, color: 'text-yellow-400', name: 'API Keys' }
  }

  useEffect(() => {
    fetchLocales()
    fetchTypes()
  }, [])

  const fetchLocales = async () => {
    try {
      const response = await api.getEasyIdLocales()
      if (response.success) {
        setAvailableLocales(response.data.locales)
      }
    } catch (error) {
      // meh, just have it silently fail. locales will just be empty
    }
  }

  const fetchTypes = async () => {
    try {
      const response = await api.getEasyIdTypes()
      if (response.success) {
        setAvailableTypes(response.data.types)
      }
    } catch (error) {
      // silently fail, types will just be empty
    }
  }

  const generateData = async () => {
    setIsGenerating(true)
    try {
      // auto-generate a seed if none provided to make results reproducible
      const effectiveSeed = seed === '' ? String(Math.floor(Math.random() * 1_000_000_000)) : seed
      // making sure it doesnt inject the generated seed into the input; only track it for display
      setUsedSeed(effectiveSeed)

      const params = {
        type: dataType,
        count: count.toString(),
        locale,
        includeSensitive: includeSensitive.toString(),
        seed: effectiveSeed,
        ...(dataType === 'basic_opsec' && useIpForLocation && { useIpForLocation: 'true' })
      }

      const response = await api.generateEasyIdData(params)
      
      if (response.success) {
        setGeneratedData(response.data.results)
        toast.success(`Generated ${response.data.count} ${dataType} records!`)
      } else {
        throw new Error(response.error?.message || 'Generation failed')
      }
    } catch (error) {
      toast.error(error.message || 'Failed to generate data')
    } finally {
      setIsGenerating(false)
    }
  }

  // Helper functions
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }


  const downloadData = () => {
    if (!generatedData || generatedData.length === 0) {
      toast.error('No data to download')
      return
    }
    const dataStr = JSON.stringify(generatedData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json;charset=utf-8' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `easy-id-${dataType}-${Date.now()}.json`
    document.body.appendChild(link)
    link.click()
    // ehumm. defer cleanup to avoid zero-byte downloads in some browsers
    setTimeout(() => {
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }, 0)
    toast.success('JSON downloaded!')
  }

  // dont mind me, just flattening the object to make it easier to download as csv
  const flattenObject = (obj, prefix = '', res = {}) => {
    if (obj === null || obj === undefined) return res
    if (typeof obj !== 'object') {
      res[prefix.slice(0, -1)] = obj
      return res
    }
    Object.keys(obj).forEach((key) => {
      const value = obj[key]
      const nextPrefix = prefix ? `${prefix}${key}.` : `${key}.`
      if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        flattenObject(value, nextPrefix, res)
      } else {
        res[nextPrefix.slice(0, -1)] = Array.isArray(value) ? JSON.stringify(value) : value
      }
    })
    return res
  }

  const toCsv = (rows) => {
    if (!rows || rows.length === 0) return ''
    // main area, building the columns for the csv. hello there
    const columnsSet = new Set()
    const flatRows = rows.map((r) => flattenObject(r))
    flatRows.forEach((r) => Object.keys(r).forEach((k) => columnsSet.add(k)))
    const columns = Array.from(columnsSet)

    const escape = (val) => {
      if (val === null || val === undefined) return ''
      const str = String(val)
      if (/[",\n]/.test(str)) {
        return '"' + str.replace(/"/g, '""') + '"'
      }
      return str
    }

    const header = columns.map(escape).join(',')
    const body = flatRows
      .map((r) => columns.map((c) => escape(c in r ? r[c] : '')).join(','))
      .join('\n')
    return header + '\n' + body
  }

  const downloadCsv = () => {
    if (!generatedData || generatedData.length === 0) {
      toast.error('No data to download')
      return
    }
    const csv = toCsv(generatedData)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `easy-id-${dataType}-${Date.now()}.csv`
    document.body.appendChild(link)
    link.click()
    setTimeout(() => {
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }, 0)
    toast.success('CSV downloaded!')
  }



  return (
    <div className="max-w-6xl mx-auto">
      {/* Controls */}
      <div className="card mb-8 hover:lift anim-enter">
        <div className="card-content">
        <GenerationControls
          dataType={dataType}
          setDataType={setDataType}
          count={count}
          setCount={setCount}
          seed={seed}
          setSeed={setSeed}
          locale={locale}
          setLocale={setLocale}
          availableTypes={availableTypes}
          availableLocales={availableLocales}
          isGenerating={isGenerating}
          onGenerate={generateData}
        />

        {/* Inline Options */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
          <label className="flex items-start space-x-3 text-white">
            <input
              type="checkbox"
              checked={includeSensitive}
              onChange={(e) => setIncludeSensitive(e.target.checked)}
              className="rounded border-dark-600 bg-dark-700 text-primary-600 focus:ring-primary-500 w-5 h-5 flex-shrink-0 mt-0.5"
            />
            <span className="text-sm sm:text-base break-words">Include financial data (cards/banking/crypto)</span>
          </label>

          {/* IP-based location toggle - only show for Basic_Opsec */}
          {dataType === 'basic_opsec' && (
            <label className="flex items-start space-x-3 text-white">
              <input
                type="checkbox"
                checked={useIpForLocation}
                onChange={(e) => setUseIpForLocation(e.target.checked)}
                className="rounded border-dark-600 bg-dark-700 text-primary-600 focus:ring-primary-500 w-5 h-5 flex-shrink-0 mt-0.5"
              />
              <span className="text-sm sm:text-base break-words">Use IP for location generation</span>
            </label>
          )}

          {/* Removed secondary show toggle; use header toggle instead */}

          {generatedData.length > 0 && (
            <DownloadSection
              onDownloadJSON={downloadData}
              onDownloadCSV={downloadCsv}
            />
          )}
        </div>
        </div>
      </div>

      {/* Results */}
      <AnimatePresence>
        {generatedData.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold text-white">
                Generated Data ({generatedData.length} items)
              </h3>
            <div className="flex items-center space-x-4">
              {includeSensitive && (
                <button
                  onClick={() => setShowSensitive(!showSensitive)}
                  className="flex items-center space-x-3 text-dark-400 hover:text-white transition-colors"
                  aria-label={showSensitive ? 'Hide sensitive financial data' : 'Show sensitive financial data'}
                >
                  {showSensitive ? <EyeOff className="w-5 h-5" aria-hidden="true" /> : <Eye className="w-5 h-5" aria-hidden="true" />}
                  <span className="text-base">{showSensitive ? 'Hide' : 'Show'} Financial</span>
                </button>
              )}
              {usedSeed && (
                <div className="flex items-center space-x-3 text-dark-400">
                  <span className="text-sm md:text-base">Seed: <span className="text-white">{usedSeed}</span></span>
                  <button
                    onClick={() => copyToClipboard(usedSeed)}
                    className="btn-ghost px-3 py-2"
                    aria-label="Copy seed to clipboard"
                    title="Copy seed"
                  >
                    <Copy className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>
            </div>

            <div className="space-y-4">
              {generatedData.map((item, index) => (
                <motion.div key={index} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                  {dataType === 'basic_opsec' ? (
                    <SocialDataCard
                      item={item}
                      index={index}
                      config={dataTypeConfig[dataType]}
                      onCopy={copyToClipboard}
                    />
                  ) : (
                    <DataItemCard
                      item={item}
                      index={index}
                      config={dataTypeConfig[dataType]}
                      showSensitive={showSensitive}
                      setShowSensitive={setShowSensitive}
                      onCopy={copyToClipboard}
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {generatedData.length === 0 && !isGenerating && (
        <div className="text-center py-16 anim-fade">
          <div className="w-20 h-20 bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-5">
            <Hash className="w-10 h-10 text-dark-400" />
          </div>
          <h3 className="text-xl font-medium text-white mb-3">No data generated yet</h3>
          <p className="text-dark-400 text-base mb-4">
            {dataType === 'basic_opsec' 
              ? 'Generate OPSEC-friendly fake identities for anonymous social media presence'
              : 'Choose your settings and click generate to create fake data'
            }
          </p>
        </div>
      )}
    </div>
  )
}

export default EasyIdGenerator
