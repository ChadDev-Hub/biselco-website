"use client"


import React from 'react'
import Carousel from './carousel'
import EventCard from './card'



const Events = () => {
    const events = [{
        title: "Annual General Membership Assembly (AGMA)",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.",
        image_src: "/apple-icon.png"
    }, {
        title: "Annual General Membership Assembly (AGMA)",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.",
        image_src: "/agma_image.jpg"
    }]
  return (
    <div className='h-["200px"] w-full'>
        <h1>Events</h1>
        <Carousel>
        {
            events.map((event, index) => (
                <EventCard key={index} image_src={event.image_src} title={event.title} description={event.description} />
            ))
        }
    </Carousel>

    </div>
    
  )
}

export default Events