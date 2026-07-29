"use client"



const AgmaRegistrationFooter = () => {
    const text = [{
        word: "Makiisa, ",
        color: "text-red-600"}
        ,{
            word: "Makisaya, ",
            color: "text-blue-600"}
        ,{
            word: "Manalo, ",
            color: "text-green-600"}
        ,{
            word: "Magkaisa ",
            color: "text-yellow-600"}
        ,{
            word: "sa AGMA! ",
            color: "text-pink-600"}
        ]
  return (
    <div className="h-full">
        <h1 className="px-2">
            {text.map((char,index)=>(<span key={index} className={`${char.color} text-shadow-md text-shadow-black italic text-md sm:text-3xl md:text-4xl font-bold`}>{char.word}</span>))}
        </h1>
    </div>
  )
}

export default AgmaRegistrationFooter