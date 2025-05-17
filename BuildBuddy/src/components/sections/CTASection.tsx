import { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Building2, Calendar, Heart, MapPin, Mountain, PlaneTakeoff, TreePalm } from 'lucide-react';
import useOptimizedInView from '../../hooks/useOptimizedInView';

export default function CTASection() {
  const controls = useAnimation();
  const [ref, inView] = useOptimizedInView(0.3, false) as [React.RefObject<HTMLElement>, boolean];
  const buttonRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  // Magnetic button effect
  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const distance = Math.sqrt(
        Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
      );
      
      if (distance < 100) {
        const maxMove = 10;
        const moveX = ((x - centerX) / centerX) * maxMove;
        const moveY = ((y - centerY) / centerY) * maxMove;
        
        // Update the transform of the button safely
        if (button.style) {
          button.style.transform = `translate(${moveX}px, ${moveY}px)`;
        }
      } else {
        if (button.style) {
          button.style.transform = 'translate(0, 0)';
        }
      }
    };
    
    const handleMouseLeave = () => {
      if (button.style) {
        button.style.transform = 'translate(0, 0)';
      }
    };
    
    button.addEventListener('mousemove', handleMouseMove);
    button.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      button.removeEventListener('mousemove', handleMouseMove);
      button.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const buildingVariants = {
    hidden: { y: 100, opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.8,
        ease: "easeOut"
      }
    })
  };

  // Generate random buildings for the cityscape background
  const buildings = Array.from({ length: 18 }).map((_, i) => {
    const width = 20 + Math.random() * 40;
    const height = 100 + Math.random() * 200;
    
    return {
      id: i,
      width,
      height,
      color: i % 3 === 0 ? '#1f2937' : i % 3 === 1 ? '#111827' : '#0f172a',
      windows: Math.floor(height / 20)
    };
  });

  return (
    <section 
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden py-24 md:py-32"
      style={{ scrollSnapAlign: 'start' }}
    >
      {/* Background gradient - deep blue to almost black */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900 via-indigo-950 to-gray-950 z-0" />
      
      {/* Stars in the night sky */}
      <div className="absolute inset-0 z-10">
        {Array.from({ length: 70 }).map((_, i) => (
          <motion.div 
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              top: `${Math.random() * 70}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>
      
      {/* Building silhouettes rising on scroll (dimmed for background effect) */}
      <div className="absolute bottom-0 left-0 right-0 z-20 flex justify-center items-end opacity-40">
        {buildings.map((building, i) => (
          <motion.div 
            key={i}
            custom={i}
            variants={buildingVariants}
            initial="hidden"
            animate={controls}
            className="relative bottom-0 mx-[1px]"
            style={{
              width: building.width,
              height: building.height,
              backgroundColor: building.color,
            }}
          >
            {/* Windows with subtle blink */}
            {Array.from({ length: building.windows }).map((_, j) => (
              <div key={j} className="flex justify-center mt-5">
                {Array.from({ length: Math.floor(building.width / 10) }).map((_, k) => (
                  <motion.div 
                    key={k}
                    className="w-2 h-3 mx-1"
                    style={{
                      backgroundColor: Math.random() > 0.6 ? '#f0c420' : 'rgba(173, 216, 230, 0.5)'
                    }}
                    animate={{
                      opacity: Math.random() > 0.7 ? [0.5, 1, 0.5] : 1
                    }}
                    transition={{
                      duration: 2 + Math.random() * 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: Math.random() * 2
                    }}
                  />
                ))}
              </div>
            ))}
          </motion.div>
        ))}
      </div>
      
      {/* Main content */}
      <motion.div 
        className="relative z-40 text-center px-6 md:px-8 lg:px-12 py-16 max-w-5xl mx-auto"
        variants={variants}
        initial="hidden"
        animate={controls}
      >
        {/* Icon group with increased spacing */}
        <motion.div 
          className="flex justify-center mb-12 gap-8"
          variants={variants}
        >
          <motion.div whileHover={{ scale: 1.1, y: -5 }} className="transform transition-all">
            <Mountain className="text-indigo-400 w-12 h-12" 
                    style={{ filter: 'drop-shadow(0 0 8px rgba(129, 140, 248, 0.8))' }} />
          </motion.div>
          <motion.div whileHover={{ scale: 1.1, y: -5 }} className="transform transition-all">
            <TreePalm className="text-teal-400 w-12 h-12"
                    style={{ filter: 'drop-shadow(0 0 8px rgba(45, 212, 191, 0.8))' }} />
          </motion.div>
          <motion.div whileHover={{ scale: 1.1, y: -5 }} className="transform transition-all">
            <Building2 className="text-blue-400 w-12 h-12" 
                    style={{ filter: 'drop-shadow(0 0 8px rgba(96, 165, 250, 0.8))' }} />
          </motion.div>
        </motion.div>
        
        {/* Improved heading with better spacing and text shadow */}
        <motion.h2 
          className="font-space-grotesk text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-10 uppercase tracking-wide leading-tight"
          variants={variants}
          style={{ 
            textShadow: '0 0 20px rgba(59, 130, 246, 0.7), 0 0 40px rgba(59, 130, 246, 0.3)',
            letterSpacing: '-0.02em'
          }}
        >
          Ready to Plan Your
          <br className="hidden md:block" />
          Perfect Trip?
        </motion.h2>
        
        {/* Enhanced subheading with better contrast and spacing */}
        <motion.p 
          className="text-gray-200 text-lg md:text-2xl mb-16 max-w-2xl mx-auto leading-relaxed font-light"
          variants={variants}
          style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)' }}
        >
          Build your dream itinerary in minutes. Drag, drop, and explore.
          <br className="hidden md:block" />
          Travel planning just got fun.
        </motion.p>
        
        {/* Feature highlights with improved grid spacing and hover effects */}
        <motion.div 
          className="grid md:grid-cols-3 gap-8 mb-16 px-4 md:px-8"
          variants={variants}
        >
          {/* Any Destination Card */}
          <motion.div 
            className="bg-white/10 backdrop-blur-md rounded-xl p-8 shadow-xl border border-white/10 transform transition-all"
            whileHover={{ 
              y: -5,
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}
          >
            <motion.div 
              className="bg-cyan-500 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center"
              style={{ boxShadow: '0 0 20px rgba(6, 182, 212, 0.5)' }}
              whileHover={{ scale: 1.1 }}
            >
              <MapPin className="text-white w-8 h-8" />
            </motion.div>
            <h3 className="text-white font-bold text-xl mb-4">Any Destination</h3>
            <p className="text-gray-300 text-base leading-relaxed">Mountains, beaches, or cities — we've got you covered.</p>
          </motion.div>
          
          {/* Smart Planning Card */}
          <motion.div 
            className="bg-white/10 backdrop-blur-md rounded-xl p-8 shadow-xl border border-white/10 transform transition-all"
            whileHover={{ 
              y: -5,
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}
          >
            <motion.div 
              className="bg-pink-500 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center"
              style={{ boxShadow: '0 0 20px rgba(236, 72, 153, 0.5)' }}
              whileHover={{ scale: 1.1 }}
            >
              <Calendar className="text-white w-8 h-8" />
            </motion.div>
            <h3 className="text-white font-bold text-xl mb-4">Smart Planning</h3>
            <p className="text-gray-300 text-base leading-relaxed">AI-powered suggestions based on your preferences.</p>
          </motion.div>
          
          {/* Travel Deals Card */}
          <motion.div 
            className="bg-white/10 backdrop-blur-md rounded-xl p-8 shadow-xl border border-white/10 transform transition-all"
            whileHover={{ 
              y: -5,
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}
          >
            <motion.div 
              className="bg-indigo-500 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center"
              style={{ boxShadow: '0 0 20px rgba(99, 102, 241, 0.5)' }}
              whileHover={{ scale: 1.1 }}
            >
              <PlaneTakeoff className="text-white w-8 h-8" />
            </motion.div>
            <h3 className="text-white font-bold text-xl mb-4">Travel Deals</h3>
            <p className="text-gray-300 text-base leading-relaxed">Exclusive discounts on flights, hotels and activities.</p>
          </motion.div>
        </motion.div>
        
        {/* Enhanced CTA button with better spacing and hover effects */}
        <motion.button
          ref={buttonRef}
          onClick={() => navigate('/setup')}
          className="relative bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xl font-semibold py-6 px-12 rounded-full 
                   shadow-lg transform transition-all mx-auto flex items-center gap-4 group hover:shadow-2xl"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          style={{ 
            boxShadow: '0 0 30px rgba(59, 130, 246, 0.5)',
            willChange: 'transform'
          }}
          variants={variants}
        >
          Start Your Journey
          <motion.span
            className="inline-block"
            animate={{ x: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <ArrowRight className="w-6 h-6" />
          </motion.span>
          
          {/* Button glow effect */}
          <motion.div 
            className="absolute inset-0 rounded-full opacity-50"
            animate={{
              boxShadow: [
                '0 0 20px rgba(59, 130, 246, 0.5)',
                '0 0 40px rgba(59, 130, 246, 0.3)',
                '0 0 20px rgba(59, 130, 246, 0.5)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.button>
      </motion.div>
      
      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 bg-gray-900/80 backdrop-blur-md py-6 px-4 z-50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <MapPin className="w-5 h-5 text-indigo-400" />
            <span>TravelScape</span>
          </div>
          
          <div className="flex gap-6 text-sm my-4 md:my-0">
            <Link to="/" className="text-gray-400 hover:text-white transition">Mountains</Link>
            <Link to="/" className="text-gray-400 hover:text-white transition">Beaches</Link>
            <Link to="/" className="text-gray-400 hover:text-white transition">Cities</Link>
            <Link to="/planner" className="text-gray-400 hover:text-white transition">Planner</Link>
          </div>
          
          <div className="text-sm text-gray-500">
            Built with <Heart className="inline w-4 h-4 text-pink-500" /> by TravelScape Team
          </div>
        </div>
      </div>
    </section>
  );
}
