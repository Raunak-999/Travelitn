import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface BackButtonProps {
  to?: string;
  className?: string;
}

export default function BackButton({ to, className = '' }: BackButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      className={`group flex items-center gap-2 px-4 py-2 text-white/80 hover:text-white 
        transition-colors rounded-lg hover:bg-white/10 ${className}`}
      whileHover={{ x: -3 }}
      whileTap={{ scale: 0.97 }}
    >
      <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
      <span>Back</span>
    </motion.button>
  );
} 