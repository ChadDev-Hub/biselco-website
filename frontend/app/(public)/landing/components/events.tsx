"use client"


import React from 'react'
import Carousel from './carousel'
import EventCard from './card'




const Events = () => {
    const events = [{
        title: "Annual General Membership Assembly (AGMA)",
        quote_title: "Beyond Power.",
        quote_description: "Electric Cooperatives Empowering Communities, Changing Lives.",
        footer: "Makiisa, Makilahok, Manalo, Magkaisa sa AGMA!",
        image_src: "/agma_image.jpg",
        abrevation: [
            {
                char: "A",
                color: "text-red-600"
            },
            {
                char: "G",
                color: "text-blue-600"
            },
            {
                char: "M",
                color: "text-yellow-600"
            },
            {
                char: "A",
                color: "text-green-600"
            }
        ]
    }]
  return (
    <div className='w-full flex flex-col justify-center items-center px-2 sm:px-2 md:px-20 lg:px-28 xl:px-64 overflow-x-clip'>
       
        {
            events.map((event, index) => (

                <EventCard key={index}
                footer={event.footer}
                image_src={event.image_src} 
                title={event.title}  
                qoute_title={event.quote_title} 
                qoute_description={event.quote_description}
                abrev={event.abrevation}/>
            ))
        }
    </div>
  )
}

export default Events