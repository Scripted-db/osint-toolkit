import { motion } from 'framer-motion'
import { Copy, Users, MapPin } from 'lucide-react'

const ANIMATION_DURATION = 0.3
const ANIMATION_DELAY_STEP = 0.1

const getAnimationDelay = (index) => {
  return index * ANIMATION_DELAY_STEP
}

const SocialDataCard = ({ item, index, config, onCopy }) => {
  return (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: ANIMATION_DURATION, delay: getAnimationDelay(index) }}
      className="card-content bg-dark-800/50 border border-dark-600 rounded-lg p-7 hover:border-dark-500 transition-colors"
    >
      <div className="flex items-start justify-between mb-7">
        <div className="flex items-center space-x-4">
          <config.icon className={`w-8 h-8 ${config.color}`} aria-hidden="true" />
          <span className="text-white font-semibold text-xl">#{index + 1}</span>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => onCopy(JSON.stringify(item, null, 2))}
            className="p-2 text-dark-400 hover:text-white hover:bg-dark-700 rounded transition-colors"
            aria-label="Copy all data"
            title="Copy all data"
          >
            <Copy className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* profile header thing */}
      <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6 mb-8 p-4 sm:p-6 bg-dark-800/30 rounded-lg border border-dark-600">
        {/* info for profile, the other thing. */}
        <div className="flex-1 min-w-0 w-full">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-3 sm:space-y-0">
            <div className="text-center sm:text-left min-w-0 flex-1">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2 break-words">{item.displayName || 'Unknown'}</h3>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 lg:gap-4 text-dark-300">
                <span className="flex items-center justify-center sm:justify-start space-x-1 min-w-0">
                  <Users className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" aria-hidden="true" />
                  <span className="break-words text-xs sm:text-sm lg:text-base">@{item.username || 'unknown'}</span>
                </span>
                <span className="flex items-center justify-center sm:justify-start space-x-1 min-w-0">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" aria-hidden="true" />
                  <span className="break-words text-xs sm:text-sm lg:text-base">{item.location || 'Unknown'}</span>
                </span>
                <span className="flex items-center justify-center sm:justify-start space-x-1">
                  <span className="text-dark-400 text-xs sm:text-sm lg:text-base">Age:</span>
                  <span className="text-xs sm:text-sm lg:text-base">{item.age || 'Unknown'}</span>
                </span>
                <span className="flex items-center justify-center sm:justify-start space-x-1">
                  <span className="text-dark-400 text-xs sm:text-sm lg:text-base">Joined:</span>
                  <span className="text-xs sm:text-sm lg:text-base">{item.joinYear || 'Unknown'}</span>
                </span>
              </div>
            </div>
            <button
              onClick={() => onCopy(JSON.stringify(item, null, 2))}
              className="p-2 text-dark-400 hover:text-white hover:bg-dark-700 rounded transition-colors self-center sm:self-start flex-shrink-0"
              aria-label="Copy all data"
              title="Copy all data"
            >
              <Copy className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <div className={`grid grid-cols-1 ${item.ipInfo && typeof item.ipInfo === 'object' ? 'lg:grid-cols-2' : ''} gap-6 lg:gap-8`}>
        {/* personality section and traits */}
        <div className="space-y-4 lg:space-y-6">
          <h4 className="font-semibold text-base lg:text-lg text-indigo-400 border-b border-indigo-500/30 pb-2">Personality & Traits</h4>
          
          {item.personalityTags && Array.isArray(item.personalityTags) && item.personalityTags.length > 0 && (
            <div className="space-y-3">
              <h5 className="text-dark-300 font-medium text-sm lg:text-base">Personality Tags</h5>
              <div className="flex flex-wrap gap-2">
                {item.personalityTags.map((tag, tagIndex) => (
                  <span key={tagIndex} className="px-2 lg:px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs lg:text-sm rounded-full border border-indigo-500/30">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {item.languagePreferences && typeof item.languagePreferences === 'object' && (
            <div className="space-y-3">
              <h5 className="text-dark-300 font-medium text-sm lg:text-base">Language Preferences</h5>
              <div className="space-y-2 p-3 lg:p-4 bg-dark-800/50 rounded-lg border border-dark-600">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-1 sm:space-y-0">
                  <span className="text-white font-medium text-sm lg:text-base break-words">{item.languagePreferences.primary}</span>
                  <span className="text-dark-400 text-xs lg:text-sm flex-shrink-0">{item.languagePreferences.proficiency}</span>
                </div>
                {item.languagePreferences.secondary && item.languagePreferences.secondary.length > 0 && (
                  <div className="text-dark-300 text-xs lg:text-sm break-words">
                    <span className="text-dark-400">Also speaks: </span>
                    <span className="break-words">{item.languagePreferences.secondary.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* tech stuff, only show if IP info exists */}
        {item.ipInfo && typeof item.ipInfo === 'object' && (
          <div className="space-y-4 lg:space-y-6">
            <h4 className="font-semibold text-base lg:text-lg text-cyan-400 border-b border-cyan-500/30 pb-2">Technical Details</h4>
            <div className="space-y-3">
              <h5 className="text-dark-300 font-medium text-sm lg:text-base">IP Information</h5>
              <div className="space-y-3 p-3 lg:p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-3">
                  <span className="text-orange-400 font-medium text-sm lg:text-base flex-shrink-0">Your IP:</span>
                  <span className="font-mono text-white text-xs lg:text-sm break-all min-w-0">{item.ipInfo.ip}</span>
                </div>
                <div className="text-white text-xs lg:text-sm break-words">
                  <span className="text-orange-400">Detected Location: </span>
                  <span className="break-words">{item.ipInfo.detectedLocation}</span>
                </div>
                {item.ipInfo.detectedLocale && (
                  <div className="text-white text-xs lg:text-sm break-words">
                    <span className="text-orange-400">Detected Language: </span>
                    <span className="break-words">{item.ipInfo.detectedLocale.toUpperCase()}</span>
                  </div>
                )}
                <div className="text-orange-300 text-xs italic pt-2 border-t border-orange-500/20 break-words">
                  {item.ipInfo.note}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default SocialDataCard

