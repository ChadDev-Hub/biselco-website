'use client';

interface AnimatedBackgroundProps {
  variant?: 'subtle' | 'animated';
}

export default function AnimatedBackground({
  variant = 'subtle',
}: AnimatedBackgroundProps) {
  if (variant === 'subtle') {
    return (
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 right-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 opacity-10">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
    </div>
  );
}
