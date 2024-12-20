import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="fixed w-full z-50 backdrop-blur-md bg-black/30 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-white">
              NextCrm
            </Link>
          </div>
          <div className="flex items-center space-x-8">
            <Link href="#" className="text-white/80 hover:text-white transition-colors">Products</Link>
            <Link href="#" className="text-white/80 hover:text-white transition-colors">Solutions</Link>
            <Link href="#" className="text-white/80 hover:text-white transition-colors">Pricing</Link>
            <Link 
              href="/login" 
              className="backdrop-blur-sm bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all duration-300 border border-white/10 hover:border-white/20"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}