"use client"
import { useState, useRef, useEffect, memo } from "react"

const CompatibleChains = memo(function CompatibleChains() {
  // State to track which tooltip is currently visible
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null)
  const [isLeaving, setIsLeaving] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Function to show tooltip
  const showTooltip = (name: string) => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    setIsLeaving(false)
    setActiveTooltip(name)
  }

  // Function to hide tooltip
  const hideTooltip = () => {
    setIsLeaving(true)

    // Set a timeout to actually remove the tooltip after animation completes
    timeoutRef.current = setTimeout(() => {
      setActiveTooltip(null)
      setIsLeaving(false)
    }, 200) // Match this to the animation duration
  }

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <div className="mt-8 md:mt-8 pt-2 md:pt-8 w-full px-4 md:px-0">
      <div className="w-full flex mb-4">
        <div className="h-px flex-1 bg-red-500"></div>
        <div className="h-px flex-1 bg-orange-500"></div>
        <div className="h-px flex-1 bg-yellow-500"></div>
        <div className="h-px flex-1 bg-green-500"></div>
        <div className="h-px flex-1 bg-blue-500"></div>
        <div className="h-px flex-1 bg-indigo-500"></div>
        <div className="h-px flex-1 bg-purple-500"></div>
      </div>
      <div className="text-center mb-3 md:mb-6">
        <div className="text-sm uppercase opacity-60">Compatible With</div>
      </div>
      <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 lg:gap-12">
        {/* Ethereum */}
        <div
          className="opacity-90 hover:opacity-100 transition-opacity relative"
          onMouseEnter={() => showTooltip("Ethereum")}
          onMouseLeave={hideTooltip}
        >
          <svg width="28" height="28" viewBox="0 0 256 417" xmlns="http://www.w3.org/2000/svg" className="fill-current">
            <path d="M127.961 0l-2.795 9.5v275.668l2.795 2.79 127.962-75.638z" />
            <path d="M127.962 0L0 212.32l127.962 75.639V154.158z" fillOpacity="0.8" />
            <path d="M127.961 312.187l-1.575 1.92v98.199l1.575 4.6L256 236.587z" />
            <path d="M127.962 416.905v-104.72L0 236.585z" fillOpacity="0.8" />
            <path d="M127.961 287.958l127.96-75.637-127.96-58.162z" />
            <path d="M0 212.32l127.96 75.638v-133.8z" fillOpacity="0.8" />
          </svg>
          {activeTooltip === "Ethereum" && (
            <div
              className={`absolute left-1/2 -bottom-8 bg-white !text-black text-xs px-2 py-1 rounded-md whitespace-nowrap z-10 ${isLeaving ? "animate-tooltip-fade-out" : "animate-tooltip-fade-in"}`}
              style={{ transform: "translateX(-50%)" }}
            >
              Ethereum
            </div>
          )}
        </div>

        {/* Optimism */}
        <div
          className="opacity-90 hover:opacity-100 transition-opacity relative"
          onMouseEnter={() => showTooltip("Optimism")}
          onMouseLeave={hideTooltip}
          style={{ color: "rgb(234,52,49)" }}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            className="fill-current"
            style={{ margin: "2px" }}
          >
            <circle cx="50" cy="50" r="50" fill="currentColor" />
            <path
              d="M51.89,64c-.25,0-.46-.09-.61-.27-.15-.18-.2-.41-.15-.68l5.24-24.7c.05-.28.19-.51.42-.68.23-.18.47-.27.72-.27h10.11c1.55,0,2.94.18,4.18.53,1.27.35,2.32.9,3.15,1.63.84.73,1.42,1.66,1.75,2.77.33,1.09.34,2.37.04,3.84-.63,2.91-1.93,5.07-3.88,6.46-1.93,1.39-4.52,2.09-7.79,2.09h-5.13l-1.75,8.32c-.05.28-.19.51-.42.68-.2.18-.44.27-.72.27h-5.17ZM60.93,49.48h4.37c1.04,0,1.96-.28,2.77-.84.84-.56,1.38-1.41,1.63-2.55.13-.66.15-1.24.08-1.75-.08-.51-.34-.91-.8-1.22-.43-.3-1.1-.46-2.01-.46h-4.56l-1.48,6.8Z"
              className="fill-white dark:fill-black"
            />
            <path
              d="M35.63,64.38c-1.6,0-3.08-.22-4.45-.65-1.37-.43-2.52-1.08-3.46-1.94-.94-.86-1.61-1.94-2.01-3.23-.38-1.29-.43-2.8-.15-4.52.2-1.09.42-2.18.65-3.27.25-1.09.51-2.19.76-3.31.84-3.42,2.34-6.02,4.52-7.79,2.18-1.77,5.12-2.66,8.82-2.66,1.6,0,3.07.23,4.41.68,1.37.43,2.52,1.09,3.46,1.98.96.89,1.63,1.98,2.01,3.27.41,1.29.46,2.8.15,4.52-.18,1.11-.39,2.22-.65,3.31-.23,1.09-.47,2.18-.72,3.27-.86,3.47-2.38,6.07-4.56,7.79-2.18,1.7-5.1,2.55-8.78,2.55ZM36.12,58.91c1.37,0,2.57-.4,3.61-1.22,1.04-.81,1.77-2.1,2.2-3.88.28-1.11.52-2.17.72-3.15.23-.99.43-2.01.61-3.08.33-1.77.18-3.07-.46-3.88-.63-.81-1.63-1.22-3-1.22s-2.57.41-3.61,1.22c-1.01.81-1.74,2.1-2.17,3.88-.28,1.06-.53,2.09-.76,3.08-.2.99-.41,2.04-.61,3.15-.3,1.77-.15,3.07.46,3.88.61.81,1.61,1.22,3,1.22Z"
              className="fill-white dark:fill-black"
            />
          </svg>
          {activeTooltip === "Optimism" && (
            <div
              className={`absolute left-1/2 -bottom-8 bg-white !text-black text-xs px-2 py-1 rounded-md whitespace-nowrap z-10 ${isLeaving ? "animate-tooltip-fade-out" : "animate-tooltip-fade-in"}`}
              style={{ transform: "translateX(-50%)" }}
            >
              Optimism
            </div>
          )}
        </div>

        {/* Base */}
        <div
          className="opacity-90 hover:opacity-100 transition-opacity relative"
          onMouseEnter={() => showTooltip("Base")}
          onMouseLeave={hideTooltip}
          style={{ color: "rgb(33,81,245)" }}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 111 111"
            xmlns="http://www.w3.org/2000/svg"
            className="fill-current"
            style={{ margin: "2px" }}
          >
            <path
              d="M54.921 110.034C85.359 110.034 110.034 85.402 110.034 55.017C110.034 24.6319 85.359 0 54.921 0C26.0432 0 2.35281 22.1714 0 50.3923H72.8467V59.6416H3.9565e-07C2.35281 87.8625 26.0432 110.034 54.921 110.034Z"
              fill="currentColor"
            />
          </svg>
          {activeTooltip === "Base" && (
            <div
              className={`absolute left-1/2 -bottom-8 bg-white !text-black text-xs px-2 py-1 rounded-md whitespace-nowrap z-10 ${isLeaving ? "animate-tooltip-fade-out" : "animate-tooltip-fade-in"}`}
              style={{ transform: "translateX(-50%)" }}
            >
              Base
            </div>
          )}
        </div>

        {/* Berachain */}
        <div
          className="opacity-90 hover:opacity-100 transition-opacity relative"
          onMouseEnter={() => showTooltip("Berachain")}
          onMouseLeave={hideTooltip}
          style={{ color: "rgb(121,73,44)", margin: "2px" }}
        >
          <svg width="28" height="28" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="40" cy="40" r="40" fill="currentColor" />
            <path
              d="M38.5083 37.9747C38.4643 37.8418 38.4335 37.7055 38.4097 37.5679C38.3988 37.5041 38.3862 37.4407 38.3717 37.3777C38.3404 37.2408 38.3055 37.1047 38.2678 36.9693V36.969C38.8916 36.0594 41.8735 31.3157 38.4803 28.271C34.7143 24.8918 30.3139 29.321 30.3139 29.321L30.3276 29.3407C28.3499 28.7618 26.2054 28.6939 24.119 29.3208C24.1188 29.3208 24.1186 29.3208 24.1186 29.3208C24.0928 29.2949 19.7074 24.9017 15.9525 28.271C12.1963 31.6414 16.2523 37.0942 16.2736 37.1226C16.2736 37.1226 16.2736 37.1228 16.2736 37.123C16.2303 37.2511 16.1955 37.3819 16.1725 37.5148C15.7661 39.8482 12.9999 40.5683 12.9999 44.6327C12.9999 48.6971 15.8938 52.0403 21.8005 52.0403H24.2243C24.2243 52.0403 24.2245 52.0403 24.2247 52.0403C24.2356 52.0552 25.2334 53.4176 27.2825 53.416C29.1847 53.4147 30.441 52.0519 30.4519 52.0403C30.4519 52.0403 30.4519 52.0403 30.4523 52.0403H32.7646C38.6714 52.0403 41.5653 48.7756 41.5653 44.6327C41.5653 40.8478 39.1663 39.9629 38.5085 37.9747H38.5083Z"
              className="fill-white dark:fill-black"
            />
            <path
              d="M66.7358 33.3303C66.7358 33.3303 67.1751 29.413 63.8358 28.5713V27.0001H61.2499V28.532C57.7274 29.2825 58.1814 33.3303 58.1814 33.3303V34.0019C58.1814 34.0019 57.7273 38.0507 61.2511 38.8005H61.2508V42.1634C57.538 42.8148 58.0071 46.9956 58.0071 46.9956V47.6673C58.0071 47.6673 57.5529 51.715 61.0756 52.4654V53.9974H63.6615V52.4263C67.0009 51.5846 66.5614 47.6673 66.5614 47.6673C66.7073 47.6673 66.8257 47.5532 66.8257 47.4127V47.2502C66.8257 47.1096 66.7073 46.9956 66.5614 46.9956C66.5614 46.9956 66.9971 43.1122 63.7047 42.2478V38.8005H63.6659C67.1897 38.0507 66.7356 34.0019 66.7356 34.0019C66.8815 34.0019 66.9999 33.8879 66.9999 33.7474V33.5849C66.9999 33.4443 66.8815 33.3303 66.7356 33.3303H66.7358ZM64.6283 46.9956H64.3918C64.2459 46.9956 64.1275 47.1096 64.1275 47.2502V47.4127C64.1275 47.5532 64.2459 47.6673 64.3918 47.6673H64.6283C64.6283 50.0972 63.7905 50.5061 63.5086 50.5749C63.4623 50.5862 63.4173 50.5531 63.4173 50.5071V49.7325C63.4173 49.3044 63.134 49.0698 62.8507 48.9422C62.4927 48.781 62.0757 48.781 61.7176 48.9422C61.4343 49.0698 61.151 49.3044 61.151 49.7325V50.5071C61.151 50.5524 61.1069 50.5864 61.0613 50.5753C60.7809 50.5076 59.94 50.1019 59.94 47.6673V46.9956C59.94 44.5656 60.7778 44.1568 61.0597 44.0879C61.1061 44.0767 61.151 44.1098 61.151 44.1558V44.9303C61.151 45.3585 61.4343 45.5931 61.7176 45.7207C62.0757 45.8819 62.4927 45.8819 62.8507 45.7207C63.134 45.5931 63.4173 45.3585 63.4173 44.9303V44.1558C63.4173 44.1104 63.4614 44.0765 63.5071 44.0876C63.7874 44.1553 64.6283 44.5609 64.6283 46.9956ZM64.5661 34.0019H64.8026C64.8026 36.4366 63.9617 36.8425 63.6814 36.91C63.6357 36.9211 63.5916 36.8871 63.5916 36.8418V36.0672C63.5916 35.6391 63.3083 35.4045 63.025 35.2769C62.667 35.1157 62.25 35.1157 61.8919 35.2769C61.6086 35.4045 61.3254 35.6391 61.3254 36.0672V36.8418C61.3254 36.8878 61.2804 36.9209 61.234 36.9096C60.9521 36.8408 60.1143 36.4319 60.1143 34.0019V33.3303C60.1143 30.8956 60.9553 30.4898 61.2356 30.4223C61.2813 30.4112 61.3254 30.4453 61.3254 30.4905V31.265C61.3254 31.6932 61.6086 31.9278 61.8919 32.0554C62.25 32.2166 62.667 32.2166 63.025 32.0554C63.3083 31.9278 63.5916 31.6932 63.5916 31.265V30.4905C63.5916 30.4444 63.6366 30.4114 63.683 30.4226C63.9648 30.4915 64.8026 30.9003 64.8026 33.3303H64.5661C64.4202 33.3303 64.3018 33.4443 64.3018 33.5849V33.7474C64.3018 33.8879 64.4202 34.0019 64.5661 34.0019Z"
              className="fill-white dark:fill-black"
            />
          </svg>
          {activeTooltip === "Berachain" && (
            <div
              className={`absolute left-1/2 -bottom-8 bg-white !text-black text-xs px-2 py-1 rounded-md whitespace-nowrap z-10 ${isLeaving ? "animate-tooltip-fade-out" : "animate-tooltip-fade-in"}`}
              style={{ transform: "translateX(-50%)" }}
            >
              Berachain
            </div>
          )}
        </div>

        {/* Solana */}
        <div
          className="opacity-90 hover:opacity-100 transition-opacity relative"
          onMouseEnter={() => showTooltip("Solana")}
          onMouseLeave={hideTooltip}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 373.1 420.29"
            xmlns="http://www.w3.org/2000/svg"
            className="fill-current"
          >
            <path d="m187.11,26.09c1.03,0,1.98.26,2.93.77l154.13,89.64c1.81,1.03,2.93,2.93,2.84,4.99l-.6,178.33c0,2.07-1.12,3.96-2.93,4.99l-154.65,88.6c-.86.52-1.89.77-2.93.77s-1.98-.26-2.93-.77L28.85,303.78c-1.81-1.03-2.93-2.93-2.84-4.99l.6-178.33c0-2.07,1.12-3.96,2.93-4.99L184.27,26.78c.86-.43,1.89-.69,2.84-.69m.09-26.09c-5.51,0-11.02,1.38-15.93,4.22L16.62,92.82C6.72,98.51.6,109.01.6,120.38l-.6,178.33c0,11.37,6.03,21.87,15.84,27.64l154.13,89.64c4.91,2.84,10.42,4.31,15.93,4.31s11.02-1.38,15.93-4.22l154.65-88.6c9.9-5.68,16.02-16.19,16.02-27.55l.6-178.33c0-11.37-6.03-21.87-15.84-27.64L203.13,4.31c-4.91-2.84-10.42-4.31-15.93-4.31h0Z" />
            <path d="m218.45,97.21h-22.56c-1.72,0-3.19,1.03-3.79,2.67l-72.67,199.16c-.52,1.29.52,2.67,1.89,2.67h22.56c1.72,0,3.19-1.03,3.79-2.67l72.67-199.16c.52-1.29-.52-2.67-1.89-2.67Zm-39.52,0h-22.56c-1.72,0-3.19,1.03-3.79,2.67l-72.59,199.08c-.52,1.29.52,2.67,1.89,2.67h22.56c1.72,0,3.19-1.03,3.79-2.67l72.59-199.08c.52-1.29-.43-2.67-1.89-2.67Zm29.28,77.15c-.6-1.81-3.19-1.81-3.79,0l-11.71,32.2c-.34.86-.34,1.89,0,2.76l32.72,89.64c.6,1.55,2.07,2.67,3.79,2.67h22.56c1.38,0,2.41-1.38,1.89-2.67l-45.46-124.6Zm84.9,124.6l-65.18-178.76c-.6-1.81-3.19-1.81-3.79,0l-11.71,32.2c-.34.86-.34,1.89,0,2.76l52.44,143.8c.6,1.55,2.07,2.67,3.79,2.67h22.56c1.46.09,2.41-1.38,1.89-2.67Z" />
          </svg>
          {activeTooltip === "Solana" && (
            <div
              className={`absolute left-1/2 -bottom-8 bg-white !text-black text-xs px-2 py-1 rounded-md whitespace-nowrap z-10 ${isLeaving ? "animate-tooltip-fade-out" : "animate-tooltip-fade-in"}`}
              style={{ transform: "translateX(-50%)" }}
            >
              Solana
            </div>
          )}
        </div>

        {/* Polygon */}
        <div
          className="opacity-90 hover:opacity-100 transition-opacity relative"
          onMouseEnter={() => showTooltip("Polygon")}
          onMouseLeave={hideTooltip}
          style={{ color: "var(--polygon-color, rgb(20,20,22))" }}
        >
          <svg width="28" height="28" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" className="fill-current">
            <path
              d="M180.26,185.07l.03-.02s-.03.02-.05.03c.01,0,.02,0,.03,0h0Z
                  M180.24,185.08c-46.81,14.06-85.52,34.57-109.77,58.59l-1.07,1.07c6.45,6.1,13.52,11.56,21.16,16.2l1.64-2.01c6.62-8.09,13.72-15.9,21.11-23.26,19.83-19.76,42.51-36.86,66.93-50.59Z
                  M185.65,164.24H31.12c1.87,25.07,11.18,48.06,25.79,66.76l.67-.67c15.01-14.81,34.55-28.27,58.12-40,20.66-10.29,44.38-19.12,69.95-26.09Z
                  M126.41,61.2c41.89,41.74,94.61,69.34,152.44,79.81-6.97-61.88-59.64-110.01-123.64-110.01-16.9,0-33.01,3.37-47.72,9.45,5.97,7.19,12.35,14.19,18.92,20.76h0Z
                  M70.47,66.31c24.25,24.06,62.98,44.54,109.8,58.63-24.44-13.76-47.14-30.85-66.98-50.62-7.37-7.34-14.46-15.15-21.11-23.26l-1.64-2.01c-7.64,4.64-14.71,10.09-21.13,16.19l1.07,1.07h-.01Z
                  M126.41,248.78c-6.6,6.57-12.97,13.57-18.92,20.76,14.69,6.08,30.82,9.45,47.72,9.45,64,0,116.67-48.14,123.66-110.04-57.82,10.47-110.54,38.07-152.44,79.81l-.02.02Z
                  M115.67,119.62v.02c-23.55-11.73-43.08-25.2-58.09-39.99l-.67-.67c-14.61,18.7-23.92,41.69-25.79,66.76h154.5c-25.56-6.97-49.26-15.8-69.95-26.12Z"
            />
          </svg>
          {activeTooltip === "Polygon" && (
            <div
              className={`absolute left-1/2 -bottom-8 bg-white !text-black text-xs px-2 py-1 rounded-md whitespace-nowrap z-10 ${isLeaving ? "animate-tooltip-fade-out" : "animate-tooltip-fade-in"}`}
              style={{ transform: "translateX(-50%)" }}
            >
              Sonic
            </div>
          )}
        </div>
      </div>
      <div className="text-center mt-3 md:mt-6">
        <div className="text-sm uppercase opacity-80">AND 20+ CHAINS</div>
      </div>
    </div>
  )
})

export default CompatibleChains
