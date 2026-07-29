"use client"



const HomePageHero = () => {
  return (
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-500 text-sm font-medium">Current Balance</p>
              <h2 className="text-4xl font-bold text-gray-900 mt-1">$142.50</h2>
            </div>
            <span className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full uppercase">
              Due in 4 Days
            </span>
          </div>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition duration-200 shadow-md">
            Pay Now
          </button>
        </div>
  )
}

export default HomePageHero