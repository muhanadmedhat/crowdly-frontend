import { Link } from 'react-router-dom';

export default function PrivacyTerms() {
  return (
    <div className="bg-surface-container/60 min-h-screen py-20 px-8">
      <div className="max-w-4xl mx-auto bg-surface-highest rounded-2xl p-10 md:p-16 shadow-float">
        <h1 className="text-4xl md:text-5xl font-black text-on-background mb-8 tracking-tight">Privacy & Terms</h1>
        <div className="space-y-8 text-text-secondary text-lg leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-on-background mb-4">1. Information We Collect</h2>
            <p>
              When you use Crowdly, we may collect personal information such as your name, email address, payment details, and interactions with our platform. We also automatically collect technical data like IP addresses and browser types to improve our services and ensure security.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-on-background mb-4">2. How We Use Your Information</h2>
            <p>
              The information we collect is used to facilitate transactions, communicate with you about campaigns, personalize your experience, and enforce our terms of service. We do not sell your personal data to third parties. We may share information with trusted service providers who assist us in operating our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-on-background mb-4">3. User Responsibilities</h2>
            <p>
              As a creator, you are responsible for fulfilling the promises made in your campaign. As a backer, you understand that funding a project involves risks, and Crowdly does not guarantee the successful completion or delivery of any project.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-on-background mb-4">4. Prohibited Content</h2>
            <p>
              Users must not post content that is illegal, abusive, defamatory, or infringes on intellectual property rights. Campaigns raising funds for illegal activities, weapons, or hate speech are strictly prohibited and will be removed immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-on-background mb-4">5. Changes to These Terms</h2>
            <p>
              We reserve the right to update these terms at any time. We will notify users of significant changes via email or prominent notices on our website. Continued use of Crowdly after such updates constitutes acceptance of the new terms.
            </p>
          </section>
          
          <div className="mt-10 p-6 bg-primary/10 rounded-xl border border-primary/20 text-on-background">
            <p className="font-medium">
              If you have any questions about our privacy policy or terms of service, please visit our <Link to="/contact" className="text-primary hover:underline">Contact page</Link> to get in touch with our legal team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}