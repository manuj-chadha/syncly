import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

const Header = ({ children, className }: HeaderProps) => {
  return (
    <div
      className={cn(
        "fixed top-0 z-50 flex items-center justify-between w-full py-4 px-8 rounded-b-2xl bg-[#0f1117]/60 backdrop-blur-md border-b border-white/20 shadow-lg",
        className
      )}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 group">
        <div className="relative w-10 h-10 rounded-full flex-shrink-0 p-1 transition-transform transform group-hover:scale-110">
          <Image
            src="/assets/images/logo.png"
            alt="Logo"
            fill
            className="object-contain"
          />
        </div>
        <span className="text-xl font-semibold text-white tracking-wide group-hover:text-indigo-400 transition-colors">
          Syncly
        </span>
      </Link>

      {/* Right-side children */}
      <div className="flex items-center gap-4">{children}</div>
    </div>
  );
};


export default Header