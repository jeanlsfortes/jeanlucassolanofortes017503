import { useTranslation } from 'react-i18next'

const LanguageSwitcher = () => {
  const { i18n } = useTranslation()

  const currentLanguage = i18n.language

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
  }

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => changeLanguage('pt-BR')}
        className={`p-1.5 rounded-lg transition-all ${
          currentLanguage === 'pt-BR' || currentLanguage === 'pt'
            ? 'bg-primary-100 ring-2 ring-primary-500'
            : 'hover:bg-gray-100'
        }`}
        title="Português (Brasil)"
        aria-label="Mudar para Português"
      >
        <svg
          className="w-6 h-6"
          viewBox="0 0 512 512"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="512" height="512" fill="#009739" />
          <polygon points="256,64 480,256 256,448 32,256" fill="#FEDD00" />
          <circle cx="256" cy="256" r="96" fill="#012169" />
          <path
            d="M160,256 Q256,192 352,256"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="12"
          />
        </svg>
      </button>

      <button
        onClick={() => changeLanguage('en-US')}
        className={`p-1.5 rounded-lg transition-all ${
          currentLanguage === 'en-US' || currentLanguage === 'en'
            ? 'bg-primary-100 ring-2 ring-primary-500'
            : 'hover:bg-gray-100'
        }`}
        title="English (US)"
        aria-label="Switch to English"
      >
        <svg
          className="w-6 h-6"
          viewBox="0 0 512 512"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="512" height="512" fill="#FFFFFF" />
          {/* Red stripes */}
          <rect y="0" width="512" height="39.4" fill="#BF0A30" />
          <rect y="78.8" width="512" height="39.4" fill="#BF0A30" />
          <rect y="157.5" width="512" height="39.4" fill="#BF0A30" />
          <rect y="236.3" width="512" height="39.4" fill="#BF0A30" />
          <rect y="315" width="512" height="39.4" fill="#BF0A30" />
          <rect y="393.8" width="512" height="39.4" fill="#BF0A30" />
          <rect y="472.6" width="512" height="39.4" fill="#BF0A30" />
          {/* Blue canton */}
          <rect width="204.8" height="275.7" fill="#002868" />
          {/* Stars (simplified) */}
          <g fill="#FFFFFF">
            <circle cx="25" cy="25" r="8" />
            <circle cx="60" cy="25" r="8" />
            <circle cx="95" cy="25" r="8" />
            <circle cx="130" cy="25" r="8" />
            <circle cx="165" cy="25" r="8" />
            <circle cx="42" cy="50" r="8" />
            <circle cx="77" cy="50" r="8" />
            <circle cx="112" cy="50" r="8" />
            <circle cx="147" cy="50" r="8" />
            <circle cx="182" cy="50" r="8" />
            <circle cx="25" cy="75" r="8" />
            <circle cx="60" cy="75" r="8" />
            <circle cx="95" cy="75" r="8" />
            <circle cx="130" cy="75" r="8" />
            <circle cx="165" cy="75" r="8" />
            <circle cx="42" cy="100" r="8" />
            <circle cx="77" cy="100" r="8" />
            <circle cx="112" cy="100" r="8" />
            <circle cx="147" cy="100" r="8" />
            <circle cx="182" cy="100" r="8" />
            <circle cx="25" cy="125" r="8" />
            <circle cx="60" cy="125" r="8" />
            <circle cx="95" cy="125" r="8" />
            <circle cx="130" cy="125" r="8" />
            <circle cx="165" cy="125" r="8" />
            <circle cx="42" cy="150" r="8" />
            <circle cx="77" cy="150" r="8" />
            <circle cx="112" cy="150" r="8" />
            <circle cx="147" cy="150" r="8" />
            <circle cx="182" cy="150" r="8" />
            <circle cx="25" cy="175" r="8" />
            <circle cx="60" cy="175" r="8" />
            <circle cx="95" cy="175" r="8" />
            <circle cx="130" cy="175" r="8" />
            <circle cx="165" cy="175" r="8" />
            <circle cx="42" cy="200" r="8" />
            <circle cx="77" cy="200" r="8" />
            <circle cx="112" cy="200" r="8" />
            <circle cx="147" cy="200" r="8" />
            <circle cx="182" cy="200" r="8" />
            <circle cx="25" cy="225" r="8" />
            <circle cx="60" cy="225" r="8" />
            <circle cx="95" cy="225" r="8" />
            <circle cx="130" cy="225" r="8" />
            <circle cx="165" cy="225" r="8" />
          </g>
        </svg>
      </button>
    </div>
  )
}

export default LanguageSwitcher
