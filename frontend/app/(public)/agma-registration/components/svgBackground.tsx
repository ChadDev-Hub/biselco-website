"use client"

const SvgBackground = () => {
  return (
    <svg
          xmlns="http://www.w3.org/2000/svg"
          className="absolute top-0 w-full h-full preserve-3d"
          viewBox="0 0 853 291"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6">
                <animate attributeName="stop-color" values="#3b82f6; #06b6d4; #3b82f6" dur="6s" repeatCount="indefinite" />
              </stop>
              <stop offset="100%" stopColor="#f97316">
                <animate attributeName="stop-color" values="#f97316; #fb7185; #f97316" dur="6s" repeatCount="indefinite" />
              </stop>
            </linearGradient>
          </defs>
          <path fill="url('#waveGradient')" d="M0.131531 42.3431C496.072 -120.432 458.322 253.602 852.905 42.3431V291H0.131531L0.131531 42.3431Z" ></path>
          <path className="fill-base-200/50" d="M0 56.6734C445.7 -6.9999 498.477 210 852.774 56.6734V131C852.774 131 0.230428 71.0163 4.66999e-05 130.976C3.90831e-05 105.306 0 56.6734 0 56.6734Z" >

          </path>
          

        </svg>
  )
}

export default SvgBackground