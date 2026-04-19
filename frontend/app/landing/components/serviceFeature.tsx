"use client"
import {motion} from "framer-motion";
const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.2 }
    }
}
const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 1 } }
}
const ServiceFeature = () => {
    const services = ['Lightning Fast Response', 'Live Monitoring']
  return (
    <>
    <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl text-primary  font-extrabold mb-4 italic">Service Excellence</h2>
          <p className="max-w-xl text-blue-600 font-bold mx-auto opacity-70 text-lg">Beyond just electricity, we provide the tools for a connected life.</p>
        </motion.div>
        
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          className={`grid grid-cols-1 md:grid-cols-${services.length} gap-8`}
        >
          {services.map((service, index) => (
            <motion.div 
              initial="hidden"
              whileInView="visible"
              key={index}
              variants={fadeInUp}
              className="card bg-base-100/20 backdrop-blur-sm shadow-xl hover:bg-base-300 transition-all cursor-pointer group border-b-4 border-transparent hover:border-primary"
            >
              <div className="card-body">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                   <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="card-title">{service}</h3>
                <p className="opacity-70">Dedicated support teams and digital tools designed for your convenience and safety.</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
    </>
    
  )
}

export default ServiceFeature