import { useState } from 'react'
import { MapPin, Search, Globe, Shield, Phone, Building2, Smartphone, Satellite, Bot, AlertTriangle } from 'lucide-react'
import { toast } from 'react-hot-toast'
import api from '../../services/api'
import { validateIp } from '../../utils/validation'
import InfoField from '../common/InfoField'

const IpLookupTool = () => {
  const [ip, setIp] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [isValidIp, setIsValidIp] = useState(null)

  const handleInputChange = (e) => {
    const value = e.target.value
    setIp(value)
    
    // Real-time validation feedback
    if (value.trim()) {
      setIsValidIp(validateIp(value.trim()))
    } else {
      setIsValidIp(null)
    }
  }

  const handleLookup = async (e) => {
    e.preventDefault()
    if (!ip.trim()) {
      toast.error('Please enter an IP address')
      return
    }

    // Validate IP format before making API call
    if (!validateIp(ip.trim())) {
      toast.error('Please enter a valid IP address (e.g., 8.8.8.8)')
      return
    }

    setIsLoading(true)
    try {
      const response = await api.lookupIP(ip)
      if (response.success) {
        setResults(response.data)
        toast.success('IP lookup completed!')
      } else {
        throw new Error(response.error?.message || 'Lookup failed')
      }
    } catch (error) {
      toast.error(error.message || 'Failed to lookup IP')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* searching form / input area */}
      <div className="card hover:lift anim-enter">
        <div className="card-content">
          <form onSubmit={handleLookup} className="space-y-5">
          <div>
            <label htmlFor="ip-input" className="block text-base font-medium text-white mb-3">
              IP Address
            </label>
            <div className="flex space-x-4">
              <input
                id="ip-input"
                type="text"
                value={ip}
                onChange={handleInputChange}
                placeholder="Enter IP address (e.g., 8.8.8.8)"
                className={`input-field flex-1 ${
                  isValidIp === true ? 'border-green-400' : 
                  isValidIp === false ? 'border-red-400' : ''
                }`}
                disabled={isLoading}
                aria-invalid={isValidIp === false}
                aria-describedby={isValidIp === false ? 'ip-error' : undefined}
                aria-label="IP address input"
              />
              {isValidIp === false && (
                <span id="ip-error" className="sr-only">Invalid IP address format</span>
              )}
              <button
                type="submit"
                disabled={isLoading || !ip.trim() || isValidIp === false}
                className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label={isLoading ? 'Looking up IP address' : 'Lookup IP address'}
                aria-busy={isLoading}
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                ) : (
                  <Search className="w-6 h-6" aria-hidden="true" />
                )}
                <span>{isLoading ? 'Looking up...' : 'Lookup'}</span>
              </button>
            </div>
          </div>
          </form>
        </div>
      </div>

      {/* results (duh?) */}
      {results && (
        <div className="space-y-8 anim-fade" role="region" aria-live="polite" aria-label="IP lookup results">
          <h3 className="text-2xl font-semibold text-white">Lookup Results</h3>
          
          {/* basic ip info card */}
          <div className="card hover:lift anim-enter">
            <div className="card-content">
              <h4 className="text-xl font-medium text-white mb-5 flex items-center space-x-3">
                <MapPin className="w-6 h-6 text-primary-400" />
                <span>IP Information</span>
              </h4>
              <div className="grid md:grid-cols-2 gap-5">
                <InfoField 
                  label="IP Address" 
                  value={results.ip || ip} 
                  useMono 
                />
                <InfoField 
                  label="Version" 
                  value={results.geolocation?.version} 
                />
              </div>
            </div>
          </div>

          {/* Location info, not exact tho obv */}
          {results.geolocation && (
            <div className="card hover:lift anim-enter">
              <div className="card-content">
                <h4 className="text-xl font-medium text-white mb-5 flex items-center space-x-3">
                  <Globe className="w-6 h-6 text-primary-400" />
                  <span>Location</span>
                </h4>
                <div className="grid md:grid-cols-2 gap-5">
                  <InfoField label="Country" value={results.geolocation?.country_name} />
                  <InfoField 
                    label="Country Code" 
                    value={results.geolocation?.country_code} 
                    useMono 
                  />
                  <InfoField label="Region/State" value={results.geolocation?.region} />
                  <InfoField label="City" value={results.geolocation?.city} />
                  <InfoField label="Postal Code" value={results.geolocation?.postal} />
                  <InfoField label="Continent" value={results.geolocation?.continent} />
                  <InfoField 
                    label="Coordinates" 
                    value={results.geolocation}
                    formatValue={(geo) => 
                      geo?.latitude && geo?.longitude
                        ? `${geo.latitude}, ${geo.longitude}`
                        : 'Unknown'
                    }
                    useMono
                  />
                  <InfoField label="Timezone" value={results.geolocation?.timezone} />
                  <InfoField 
                    label="Calling Code" 
                    value={results.geolocation?.calling_code}
                    icon={<Phone className="w-4 h-4" />}
                    formatValue={(code) => code ? `+${code}` : 'Unknown'}
                  />
                  <InfoField label="Currency" value={results.geolocation?.currency_name} />
                  <InfoField 
                    label="EU Member" 
                    value={results.geolocation?.is_eu_member}
                    renderValue={(isEu) => (
                      <p className={`font-medium ${isEu ? 'text-blue-400' : 'text-dark-400'}`}>
                        {isEu ? 'Yes' : 'No'}
                      </p>
                    )}
                  />
                </div>
              </div>
            </div>
          )}

          {/* network info shit */}
          {results.geolocation && (
            <div className="card hover:lift anim-enter">
              <div className="card-content">
                <h4 className="text-xl font-medium text-white mb-5 flex items-center space-x-3">
                  <Shield className="w-6 h-6 text-primary-400" />
                  <span>Network Information</span>
                </h4>
                <div className="grid md:grid-cols-2 gap-5">
                  <InfoField label="ASN" value={results.geolocation?.asn} useMono />
                  <InfoField label="Organization" value={results.geolocation?.org} />
                  <InfoField label="Network" value={results.geolocation?.network} useMono />
                  {results.geolocation?.datacenter && (
                    <InfoField 
                      label="Datacenter Provider" 
                      value={results.geolocation.datacenter}
                      icon={<Building2 className="w-4 h-4" />}
                    />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* rep check */}
          {results.reputation && (
            <div className="card hover:lift anim-enter">
              <div className="card-content">
                <h4 className="text-xl font-medium text-white mb-5 flex items-center space-x-3">
                  <Shield className="w-6 h-6 text-primary-400" />
                  <span>Reputation & Security</span>
                </h4>
                <div className="grid md:grid-cols-2 gap-5">
                  <InfoField 
                    label="Malicious" 
                    value={results.reputation?.malicious}
                    tooltip="IP flagged for significant abuse (Elevated/High scores). Low scores are filtered to reduce false positives. Independent of VPN/Tor/Proxy status."
                    renderValue={(isMalicious) => (
                      <p className={`font-medium ${isMalicious ? 'text-red-400' : 'text-green-400'}`}>
                        {isMalicious ? 'Yes' : 'No'}
                      </p>
                    )}
                  />
                  <InfoField 
                    label="Suspicious" 
                    value={results.reputation?.suspicious}
                    tooltip="IP uses anonymous networks (Tor, VPN, or Proxy). Not inherently malicious, just indicates anonymity."
                    renderValue={(isSuspicious) => (
                      <p className={`font-medium ${isSuspicious ? 'text-yellow-400' : 'text-green-400'}`}>
                        {isSuspicious ? 'Yes' : 'No'}
                      </p>
                    )}
                  />
                  <InfoField 
                    label="VPN" 
                    value={results.reputation?.is_vpn}
                    renderValue={(isVpn) => (
                      <p className={`font-medium ${isVpn ? 'text-yellow-400' : 'text-green-400'}`}>
                        {isVpn ? 'Yes' : 'No'}
                      </p>
                    )}
                  />
                  <InfoField 
                    label="Tor" 
                    value={results.reputation?.is_tor}
                    renderValue={(isTor) => (
                      <p className={`font-medium ${isTor ? 'text-yellow-400' : 'text-green-400'}`}>
                        {isTor ? 'Yes' : 'No'}
                      </p>
                    )}
                  />
                  <InfoField 
                    label="Proxy" 
                    value={results.reputation?.is_proxy}
                    renderValue={(isProxy) => (
                      <p className={`font-medium ${isProxy ? 'text-yellow-400' : 'text-green-400'}`}>
                        {isProxy ? 'Yes' : 'No'}
                      </p>
                    )}
                  />
                  <InfoField 
                    label="Datacenter" 
                    value={results.reputation?.is_datacenter}
                    renderValue={(isDatacenter) => (
                      <p className={`font-medium ${isDatacenter ? 'text-blue-400' : 'text-dark-400'}`}>
                        {isDatacenter ? 'Yes' : 'No'}
                      </p>
                    )}
                  />

                  {/* abuser scores, even though they arent very accurate (see above) */}
                  {results.reputation?.abuser_score_company && (
                    <InfoField 
                      label="Abuse Score (Company)" 
                      value={results.reputation.abuser_score_company}
                      icon={<AlertTriangle className="w-4 h-4" />}
                      renderValue={(score) => (
                        <p className={`font-medium ${
                          score?.includes('High') ? 'text-red-400' :
                          score?.includes('Elevated') ? 'text-yellow-400' :
                          'text-dark-400'
                        }`}>
                          {score}
                        </p>
                      )}
                    />
                  )}
                  {results.reputation?.abuser_score_asn && (
                    <InfoField 
                      label="Abuse Score (ASN)" 
                      value={results.reputation.abuser_score_asn}
                      icon={<AlertTriangle className="w-4 h-4" />}
                      renderValue={(score) => (
                        <p className={`font-medium ${
                          score?.includes('High') ? 'text-red-400' :
                          score?.includes('Elevated') ? 'text-yellow-400' :
                          'text-dark-400'
                        }`}>
                          {score}
                        </p>
                      )}
                    />
                  )}

                  {/* additional stuff/flags */}
                  {results.geolocation?.is_mobile && (
                    <InfoField 
                      label="Mobile Network" 
                      value={true}
                      icon={<Smartphone className="w-4 h-4" />}
                      renderValue={() => <p className="text-blue-400 font-medium">Yes</p>}
                    />
                  )}
                  {results.geolocation?.is_satellite && (
                    <InfoField 
                      label="Satellite ISP" 
                      value={true}
                      icon={<Satellite className="w-4 h-4" />}
                      renderValue={() => <p className="text-blue-400 font-medium">Yes</p>}
                    />
                  )}
                  {results.geolocation?.crawler && (
                    <InfoField 
                      label="Crawler/Bot" 
                      value={results.geolocation.crawler}
                      icon={<Bot className="w-4 h-4" />}
                      valueClassName="text-blue-400 font-medium"
                    />
                  )}
                </div>

                {/* virustotal data (if available) */}
                {results.reputation?.virustotal && (
                  <div className="mt-6 pt-6 border-t border-dark-700">
                    <h5 className="text-lg font-medium text-white mb-4 flex items-center space-x-2">
                      <Shield className="w-5 h-5 text-primary-400" />
                      <span>VirusTotal Analysis</span>
                    </h5>
                    <div className="grid md:grid-cols-3 gap-5">
                      <InfoField 
                        label="Detections" 
                        value={results.reputation.virustotal}
                        renderValue={(vt) => (
                          <p className={`font-medium ${
                            vt?.positives > 0 ? 'text-red-400' : 'text-green-400'
                          }`}>
                            {vt?.positives || 0} / {vt?.total || 0}
                          </p>
                        )}
                      />
                      {results.reputation.virustotal?.scan_date && (
                        <InfoField 
                          label="Last Scanned" 
                          value={results.reputation.virustotal.scan_date}
                          formatValue={(date) => new Date(date * 1000).toLocaleDateString()}
                          valueClassName="text-white text-sm"
                        />
                      )}
                      {results.reputation.virustotal?.detected_urls && results.reputation.virustotal.detected_urls.length > 0 && (
                        <InfoField 
                          label="Malicious URLs" 
                          value={results.reputation.virustotal.detected_urls.length} 
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!results && !isLoading && (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-5">
            <MapPin className="w-10 h-10 text-dark-300" />
          </div>
          <h3 className="text-xl font-medium text-white mb-3">No lookup performed yet</h3>
          <p className="text-dark-400 text-base">
            Enter an IP address above to start the lookup process
          </p>
        </div>
      )}
    </div>
  )
}

export default IpLookupTool
