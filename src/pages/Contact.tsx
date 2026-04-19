export default function Contact() {
  return (
    <div className="bg-surface-container/60 min-h-screen py-20 px-8">
      <div className="max-w-3xl mx-auto bg-surface-highest rounded-2xl p-10 md:p-16 shadow-float">
        <h1 className="text-4xl md:text-5xl font-black text-on-background mb-6 tracking-tight">Contact Us</h1>
        <p className="text-text-secondary text-lg mb-10">
          Have a question, feedback, or need help with your campaign? Our team is always here to assist you. Fill out the form below and we'll get back to you as soon as possible.
        </p>
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-on-background mb-2" htmlFor="firstName">First Name</label>
              <input type="text" id="firstName" className="w-full bg-background border border-outline-variant rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors" placeholder="John" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-on-background mb-2" htmlFor="lastName">Last Name</label>
              <input type="text" id="lastName" className="w-full bg-background border border-outline-variant rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors" placeholder="Doe" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-on-background mb-2" htmlFor="email">Email Address</label>
            <input type="email" id="email" className="w-full bg-background border border-outline-variant rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors" placeholder="john@example.com" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-on-background mb-2" htmlFor="message">Message</label>
            <textarea id="message" rows={5} className="w-full bg-background border border-outline-variant rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors" placeholder="How can we help you?"></textarea>
          </div>
          <button type="button" className="btn-primary w-full py-4 text-lg">Send Message</button>
        </form>
        <div className="mt-12 pt-8 border-t border-outline-variant grid grid-cols-1 md:grid-cols-2 gap-8 text-center md:text-left">
          <div>
            <h3 className="font-bold text-on-background text-lg">Email Support</h3>
            <p className="text-text-secondary mt-2">support@crowdly.com</p>
          </div>
          <div>
            <h3 className="font-bold text-on-background text-lg">Office Location</h3>
            <p className="text-text-secondary mt-2">123 Innovation Drive<br />Tech City, TC 90210</p>
          </div>
        </div>
      </div>
    </div>
  );
}