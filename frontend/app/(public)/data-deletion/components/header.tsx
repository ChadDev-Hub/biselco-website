

"use client";




const header = () => {
  const date = new Date();
  
  return (
    <header className="w-full p-4">
        <h1 className="text-4xl md:text-6xl font-bold text-blue-600 tracking-tighter">
            DATA DELETION
        </h1>
        <p className="font-light text-sm italic">Effective Date: {date.toLocaleString('en-US', { month: "short", day: 'numeric', year: 'numeric' })}</p>
    </header>
  )
}

export default header