"use client"
import {motion} from "framer-motion";

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.2 }
    }
};

const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 1 } }
};

const VisionMission = () => {
  return (
    
      
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12"
          >
            <motion.div 
            initial="hidden"
            whileInView="visible"
            variants={fadeInUp} className="card bg-base-100/20 backdrop-blur-sm hover:bg-base-100/60 hover:cursor-pointer shadow-xl overflow-hidden border-t-4 border-primary">
              <div className="card-body p-10">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                </div>
                <h2 className="card-title text-3xl font-bold mb-4 text-shadow-md text-blue-800">Our Vision</h2>
                <p className="text-lg opacity-80 leading-relaxed ">
                  Busuanga Island Electric Cooperative Inc.(BISELCO)
                  is commited to the vision of premier, modern and autonomous
                  electric cooperative that ensures the welfeare of its member-consumers
                  and fullfills its expected role in rural development.
                </p>
              </div>
            </motion.div>

            <motion.div 
            initial="hidden"
            whileInView="visible"
            variants={fadeInUp} 
            className="card bg-base-100/20 backdrop-blur-sm hover:bg-base-100/60 hover:cursor-pointer  shadow-xl overflow-hidden border-t-4 border-secondary">
              <div className="card-body p-10">
                <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mb-6 text-secondary">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <h2 className="card-title text-3xl font-bold mb-4  text-blue-800">Our Mission</h2>
                <p className="text-lg opacity-80 leading-relaxed">
                  We aim to provide a continous Power Supply to all Barangays and Sitis within our Franchised Area at a reasonable costs
                  and through quality service with the active participation of our member-consumers.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
     
  )
}

export default VisionMission