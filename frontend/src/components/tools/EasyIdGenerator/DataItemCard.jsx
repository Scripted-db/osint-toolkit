import { motion } from 'framer-motion'
import { Copy, Eye } from 'lucide-react'

const ANIMATION_DURATION = 0.3
const ANIMATION_DELAY_STEP = 0.1

const getAnimationDelay = (index) => {
  return index * ANIMATION_DELAY_STEP
}

const formatValue = (value, key) => {
  if (typeof value === 'object' && value !== null) {
    if (key === 'address' && value.street && value.city)
      return `${value.street}, ${value.city}, ${value.state} ${value.zipCode}, ${value.country}`
    if (key === 'creditCard' && value.number)
      return `${value.type}: ${value.number} (Exp: ${value.expiry})`
    if (key === 'bankAccount' && value.account)
      return `Account: ${value.account}`
    if (key === 'bitcoin' && value.address)
      return `Bitcoin: ${value.address}`
    if (key === 'platforms' && typeof value === 'object') {
      return Object.entries(value)
        .map(([platform, data]) => `${data.platform}: ${data.displayName}`)
        .join(', ')
    }
    return JSON.stringify(value, null, 2)
  }
  return String(value)
}

const DataItemCard = ({ item, index, config, showSensitive, setShowSensitive, onCopy }) => {
  return (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: ANIMATION_DURATION, delay: getAnimationDelay(index) }}
      className="card-content bg-dark-800/50 border border-dark-600 rounded-lg p-5 hover:border-dark-500 transition-colors group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <config.icon className={`w-6 h-6 ${config.color}`} aria-hidden="true" />
          <span className="text-white font-medium text-lg">#{index + 1}</span>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => onCopy(JSON.stringify(item, null, 2))}
            className="btn-ghost p-2.5"
            aria-label="Copy all data"
            title="Copy all data"
          >
            <Copy className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {Object.entries(item).map(([key, value]) => {
          const isSensitive = ['creditCard', 'bankAccount', 'bitcoin', 'cvv', 'number'].includes(key)
          const shouldHide = isSensitive && !showSensitive
          
          return (
            <div key={key} className="flex items-start space-x-4">
              <span className="text-dark-400 text-base font-medium min-w-[120px] capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}:
              </span>
              <div className="flex-1 min-w-0">
                {shouldHide ? (
                  <div className="flex items-center space-x-3">
                    <span className="text-dark-500">••••••••</span>
                    <button
                      onClick={() => setShowSensitive(!showSensitive)}
                      className="text-dark-400 hover:text-white transition-colors"
                      aria-label="Show sensitive data"
                    >
                      <Eye className="w-5 h-5" aria-hidden="true" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <span className="text-white text-base break-all">
                      {formatValue(value, key)}
                    </span>
                    <button
                      onClick={() => onCopy(formatValue(value, key))}
                      className="p-2 text-dark-400 hover:text-white hover:bg-dark-700 rounded transition-colors opacity-0 group-hover:opacity-100"
                      aria-label={`Copy ${key} value`}
                      title="Copy value"
                    >
                      <Copy className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

export default DataItemCard

