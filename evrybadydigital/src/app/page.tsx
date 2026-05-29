
export default function Page() {
  return (
    <div className="min-h-screen font-sans flex flex-col bg-[#0a1e0a]">
      {/* Hero Section */}
      <header className="w-full py-16 px-4 flex flex-col items-center border-b border-[#806500]/20" style={{background: '#0a1e0a'}}>
        <div className="max-w-6xl w-full flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1 flex flex-col items-start gap-6">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
              Digital Marketing
            </h1>
            <p className="text-2xl text-[#806500] font-medium">Your brand, our strategy — let’s make it happen.</p>
            <a href="#contact" className="mt-4 inline-block rounded-full bg-[#806500] text-white px-8 py-3 font-semibold shadow hover:bg-[#a68a2a] transition-colors">Get Started</a>
          </div>
          <div className="flex-1 flex justify-center">
            {/* Decorative abstract shapes */}
            <div className="relative w-full h-72 flex items-center justify-center">
              <div className="absolute left-0 top-0 w-40 h-40 rounded-full bg-[#806500] opacity-80" style={{zIndex:1}}></div>
              <div className="absolute right-0 bottom-0 w-48 h-48 rounded-full bg-[#806500] opacity-40" style={{zIndex:1}}></div>
              <div className="w-64 h-64 rounded-full border-8 border-white opacity-90" style={{zIndex:2}}></div>
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-white rounded-full opacity-0" style={{zIndex:0}}></div>
            </div>
          </div>
        </div>
      </header>

      {/* Services Section */}
      <section className="w-full py-16 px-4 bg-white border-b border-[#806500]/20">
        <div className="max-w-5xl mx-auto flex flex-col items-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0a1e0a] mb-8">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            <div className="bg-[#f7f7f7] rounded-xl p-8 shadow hover:shadow-lg transition-shadow border border-[#806500]/10 flex flex-col items-center text-center">
              <div className="w-16 h-16 mb-4 rounded-full bg-[#806500] flex items-center justify-center">
                <svg width="32" height="32" fill="none" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#fff"/><path d="M8 24V8h16v16H8z" stroke="#806500" strokeWidth="2"/></svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#0a1e0a]">Web Design & Development</h3>
              <p className="text-[#333]">Custom websites and landing pages that convert visitors into customers, built for speed and SEO.</p>
            </div>
            <div className="bg-[#f7f7f7] rounded-xl p-8 shadow hover:shadow-lg transition-shadow border border-[#806500]/10 flex flex-col items-center text-center">
              <div className="w-16 h-16 mb-4 rounded-full bg-[#806500] flex items-center justify-center">
                <svg width="32" height="32" fill="none" viewBox="0 0 32 32"><circle cx="16" cy="16" r="14" stroke="#fff" strokeWidth="2"/><path d="M16 8v8l6 4" stroke="#806500" strokeWidth="2"/></svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#0a1e0a]">SEO & PPC</h3>
              <p className="text-[#333]">Get found on Google and drive targeted traffic with expert search engine optimization and pay-per-click campaigns.</p>
            </div>
            <div className="bg-[#f7f7f7] rounded-xl p-8 shadow hover:shadow-lg transition-shadow border border-[#806500]/10 flex flex-col items-center text-center">
              <div className="w-16 h-16 mb-4 rounded-full bg-[#806500] flex items-center justify-center">
                <svg width="32" height="32" fill="none" viewBox="0 0 32 32"><rect x="8" y="8" width="16" height="16" rx="4" stroke="#fff" strokeWidth="2"/><path d="M16 12v8" stroke="#806500" strokeWidth="2"/></svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#0a1e0a]">Ongoing Support</h3>
              <p className="text-[#333]">We’re here for you after launch, offering ongoing support, updates, and digital strategy to keep you ahead.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Careers Section */}
      <section className="w-full py-16 px-4 bg-[#0a1e0a] border-b border-[#806500]/20">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Careers with Creative</h2>
            <p className="text-[#806500] mb-4">Our Creative team works closely with businesses to design and create the resources they need to stand out. Designers and developers collaborate on advertising, websites, and full branding projects.</p>
            <a href="#contact" className="inline-block rounded-full bg-[#806500] text-white px-8 py-3 font-semibold shadow hover:bg-[#a68a2a] transition-colors mt-2">Join Our Team</a>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="w-64 h-40 rounded-xl bg-[#806500]/30 flex items-center justify-center">
              <svg width="80" height="80" fill="none" viewBox="0 0 80 80"><rect width="80" height="80" rx="16" fill="#806500" fillOpacity="0.5"/><path d="M20 60V20h40v40H20z" stroke="#fff" strokeWidth="4"/></svg>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="w-full py-16 px-4 bg-white border-b border-[#806500]/20">
        <div className="max-w-5xl mx-auto flex flex-col items-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0a1e0a] mb-8">Our Partners</h2>
          <div className="flex flex-col md:flex-row gap-8 w-full items-center justify-center">
            <a href="https://www.ronaldonyangoconsultancy.co.uk" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 px-6 py-4 rounded-xl bg-[#f7f7f7] border border-[#806500]/10 shadow hover:shadow-lg transition-shadow font-semibold text-[#0a1e0a]">
              Ronald Onyango Consultancy (ROC)
            </a>
            <a href="https://studio.espeezy.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 px-6 py-4 rounded-xl bg-[#f7f7f7] border border-[#806500]/10 shadow hover:shadow-lg transition-shadow font-semibold text-[#0a1e0a]">
              Espeezy Ltd via espeezystudios
            </a>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="w-full py-16 px-4 bg-[#806500]/10">
        <div className="max-w-2xl mx-auto flex flex-col items-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0a1e0a] mb-4">Ready to Grow?</h2>
          <p className="text-[#806500] mb-8 text-center">Contact us today for a free consultation and let’s build something amazing together.</p>
          <a href="mailto:hello@evrybady.digital" className="inline-block rounded-full bg-[#806500] text-white px-8 py-3 font-semibold shadow hover:bg-[#a68a2a] transition-colors">Contact Us</a>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-8 px-4 bg-[#0a1e0a] text-[#806500] flex flex-col items-center mt-auto">
        <div className="max-w-5xl w-full flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-sm">&copy; {new Date().getFullYear()} Evrybady Digital. All rights reserved.</span>
          <span className="text-sm">Built with Next.js</span>
        </div>
      </footer>
    </div>
  );
}
