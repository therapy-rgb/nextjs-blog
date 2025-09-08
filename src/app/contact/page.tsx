import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact | Suburban Dad Mode',
  description: 'Get in touch with the suburban dad behind the blog. Share your story, ask questions, or just say hello!',
}

export default function Contact() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-sdm-text mb-6">
          Let&apos;s Connect
        </h1>
        
        <p className="font-cooper text-xl text-sdm-text-light max-w-2xl mx-auto">
          I&apos;d love to hear from fellow parents, suburban adventurers, or anyone who wants to 
          share their story. Whether you have a question, want to collaborate, or just want to 
          say hello, don&apos;t hesitate to reach out!
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div className="bg-sdm-card rounded-lg p-6 sm:p-8 shadow-sm border border-warm-gray-200">
          <h2 className="font-display text-2xl font-bold text-sdm-text mb-6">
            Find Me Around the Web
          </h2>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-sdm-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-sdm-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="font-cooper font-semibold text-sdm-text">Email</p>
                <p className="text-sdm-text-light">hello@suburbandadmode.com</p>
                <p className="text-sm text-sdm-text-light mt-1">Best for longer conversations or collaboration ideas</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-sdm-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-sdm-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </div>
              <div>
                <p className="font-cooper font-semibold text-sdm-text">Twitter</p>
                <p className="text-sdm-text-light">@suburbandadmode</p>
                <p className="text-sm text-sdm-text-light mt-1">Quick thoughts and daily suburban adventures</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-sdm-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-sdm-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.219-5.160 1.219-5.160s-.219-.438-.219-1.085c0-1.016.219-1.775.219-1.775s.199-.438.199-1.085c0-.647-.219-1.085-.219-1.085s.219-.438.219-1.085c0-1.016.592-1.378 1.329-1.378.625 0 .927.469.927 1.031 0 .628-.399 1.569-.602 2.438-.172.729.365 1.322 1.084 1.322 1.301 0 2.301-1.375 2.301-3.35 0-1.753-1.260-2.979-3.063-2.979-2.084 0-3.313 1.563-3.313 3.181 0 .628.241 1.302.544 1.667.060.073.069.136.051.21-.055.229-.177.718-.201.818-.031.131-.099.159-.228.096-1.188-.553-1.929-2.290-1.929-3.681 0-3.007 2.186-5.768 6.302-5.768 3.312 0 5.888 2.361 5.888 5.514 0 3.290-2.073 5.935-4.95 5.935-.966 0-1.875-.504-2.187-1.106l-.595 2.268c-.215.835-.798 1.882-1.188 2.523.895.276 1.840.428 2.820.428 6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z" clipRule="evenodd"/>
                </svg>
              </div>
              <div>
                <p className="font-cooper font-semibold text-sdm-text">Instagram</p>
                <p className="text-sdm-text-light">@suburbandadmode</p>
                <p className="text-sm text-sdm-text-light mt-1">Behind-the-scenes suburban dad life</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-sdm-card rounded-lg p-6 sm:p-8 shadow-sm border border-warm-gray-200">
          <h2 className="font-display text-2xl font-bold text-sdm-text mb-6">
            Send a Message
          </h2>
          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="block font-cooper font-semibold text-sdm-text mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full px-4 py-3 border border-warm-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sdm-primary focus:border-transparent transition-colors font-cooper"
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block font-cooper font-semibold text-sdm-text mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full px-4 py-3 border border-warm-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sdm-primary focus:border-transparent transition-colors font-cooper"
                required
              />
            </div>
            
            <div>
              <label htmlFor="subject" className="block font-cooper font-semibold text-sdm-text mb-2">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                className="w-full px-4 py-3 border border-warm-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sdm-primary focus:border-transparent transition-colors font-cooper"
                required
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block font-cooper font-semibold text-sdm-text mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                className="w-full px-4 py-3 border border-warm-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sdm-primary focus:border-transparent resize-vertical transition-colors font-cooper"
                placeholder="Tell me about your suburban adventures, ask a question, or just say hello!"
                required
              ></textarea>
            </div>
            
            <button
              type="submit"
              className="w-full bg-sdm-primary text-white py-3 px-6 rounded-md hover:bg-sdm-accent focus:outline-none focus:ring-2 focus:ring-sdm-primary focus:ring-offset-2 transition-all duration-200 font-cooper font-semibold text-lg"
            >
              Send Message
            </button>
          </form>
          
          <div className="mt-6 p-4 bg-warm-gray-50 rounded-md">
            <p className="text-sm text-sdm-text-light font-cooper">
              <strong>Note:</strong> This form is for demonstration purposes. In a live site, you&apos;d integrate 
              with a service like Netlify Forms, Formspree, or your own backend to handle submissions.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}