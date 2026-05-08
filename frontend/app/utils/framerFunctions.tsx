

// TEXT TYPING ANIMATION 
export const textTyping = {
  hidden: { },
  visible: {
    transition: {
      delayChildren: 0.4,
      staggerChildren: 0.05,
    },
    
  },
}

// TYPING TEXT EFFECT
export const letterVariant = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};



// BOUNCING LETTER EFFECT 
export const bouncingLetter = (i: number)=>{ 
return {
  hidden: { 
    y: 0 
  },
  animate: {
    y: [-10, 0],
    transition: {
      delay: 0.5 * i,
      duration: 0.4,
      repeat: Infinity,
      repeatType: "mirror" as const,
      ease: "easeInOut" as const
    }
  }
}};


export const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 1 } },
};


export const StaggeringFadeInUp = {
  
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delayChildren: 0.4,
      staggerChildren: 0.06,
    },
  }
};

export const StaggeringChildren = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 , transition: { duration: 0.5 }},
}