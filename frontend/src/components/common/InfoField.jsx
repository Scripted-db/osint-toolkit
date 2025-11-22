const InfoField = ({ 
  label, 
  value, 
  icon, 
  valueClassName = 'text-white',
  labelClassName = 'text-dark-300 text-base',
  tooltip,
  defaultValue = 'Unknown',
  useMono = false,
  formatValue,
  renderValue
}) => {
  let displayValue
  
  if (renderValue) {
    displayValue = renderValue(value)
  } else if (formatValue) {
    displayValue = formatValue(value)
  } else {
    displayValue = value ?? defaultValue
  }
  
  return (
    <div>
      {tooltip ? (
        <div className="flex items-start space-x-2">
          {icon ? (
            <span className={`${labelClassName} flex items-center space-x-1`}>
              {icon}
              <span>{label}</span>
            </span>
          ) : (
            <span className={labelClassName}>{label}</span>
          )}
          <span 
            className="text-dark-400 text-xs cursor-help hover:text-dark-300 transition-colors relative -top-0.5" 
            title={tooltip}
          >
            ?
          </span>
        </div>
      ) : icon ? (
        <span className={`${labelClassName} flex items-center space-x-1`}>
          {icon}
          <span>{label}</span>
        </span>
      ) : (
        <span className={labelClassName}>{label}</span>
      )}
      {renderValue ? (
        renderValue(value)
      ) : (
        <p className={`${valueClassName} ${useMono ? 'font-mono' : ''}`}>
          {displayValue}
        </p>
      )}
    </div>
  )
}

export default InfoField

