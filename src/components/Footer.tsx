export default function Footer() {
  return (
    <footer className="bg-sdm-card border-t border-warm-gray-200 mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center space-y-6">
          {/* Logo */}
          <div className="font-display text-2xl font-bold text-sdm-primary">
            Suburban Dad Mode
          </div>
          
          {/* Tagline */}
          <p className="text-sdm-text-light text-center max-w-md font-cooper">
            Life, parenting, and everything in between from the suburbs
          </p>
          
          {/* Social Links */}
          <div className="flex space-x-8">
            <a 
              href="https://twitter.com/suburbandadmode" 
              className="text-sdm-text-light hover:text-sdm-primary transition-colors duration-200 font-cooper"
              target="_blank"
              rel="noopener noreferrer"
            >
              Twitter
            </a>
            <a 
              href="https://instagram.com/suburbandadmode" 
              className="text-sdm-text-light hover:text-sdm-primary transition-colors duration-200 font-cooper"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
            <a 
              href="/rss" 
              className="text-sdm-text-light hover:text-sdm-primary transition-colors duration-200 font-cooper"
            >
              RSS
            </a>
          </div>
          
          {/* Copyright */}
          <div className="pt-4 border-t border-warm-gray-200 w-full text-center">
            <p className="text-sdm-text-light text-sm">
              © {new Date().getFullYear()} Suburban Dad Mode. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}