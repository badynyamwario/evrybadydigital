import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Evrybady Digital',
  description: 'Terms of Service for Evrybady Digital Creative Marketing Ltd.',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#0a1e0a] text-white">
      <div className="mx-auto max-w-3xl px-6 py-24 sm:px-8 lg:py-32">
        <p className="text-xs uppercase tracking-[0.3em] text-[#f7e7a6]">Legal</p>
        <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Terms of Service</h1>
        <p className="mt-2 text-sm text-white/50">Last updated: 1 June 2026</p>

        <div className="mt-8 space-y-6 text-sm leading-7 text-white/75">
          <section>
            <h2 className="text-lg font-semibold text-white mb-2">1. Introduction</h2>
            <p>
              These Terms of Service (&quot;Terms&quot;) govern your use of the website and services provided by Evrybady Digital Creative Marketing Ltd (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;), a company registered in England and Wales. By accessing or using our website at evrybady.digital, you agree to be bound by these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">2. Services</h2>
            <p>
              We provide digital marketing, branding, web design, SEO, social media management, and related creative and consulting services to professional service businesses. The scope, deliverables, and fees for any engagement will be set out in a separate proposal or statement of work agreed between us and the client.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">3. Use of Website</h2>
            <p>You agree to use this website only for lawful purposes and in a manner that does not infringe the rights of, or restrict or inhibit the use and enjoyment of, this site by any third party. Prohibited behaviour includes but is not limited to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Conducting any unlawful activity</li>
              <li>Attempting to gain unauthorised access to our systems</li>
              <li>Transmitting any material that is defamatory, offensive, or otherwise objectionable</li>
              <li>Using automated tools to scrape or harvest data from this site</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">4. Intellectual Property</h2>
            <p>
              All content on this website — including text, graphics, logos, images, audio, video, and software — is the property of Evrybady Digital Creative Marketing Ltd or its content suppliers and is protected by UK and international copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, modify, or create derivative works from any content without our prior written consent.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">5. Client Work & Ownership</h2>
            <p>
              Upon full payment of all fees, clients receive a licence to use the deliverables created for them as specified in the project agreement. Unless otherwise stated in writing, we retain ownership of all original source files, templates, and proprietary processes. Third-party assets (stock images, fonts, plugins) remain subject to their respective licence terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">6. Payment Terms</h2>
            <p>
              Unless otherwise agreed, a deposit of 50% is required before work commences. The remaining balance is due upon completion and delivery. Invoices are payable within 14 days of issue. We reserve the right to charge interest on overdue invoices at the rate of 4% above the Bank of England base rate, in accordance with the Late Payment of Commercial Debts (Interest) Act 1998.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">7. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from your use of our website or services.
            </p>
            <p className="mt-2">
              Our total aggregate liability in connection with any engagement shall not exceed the fees paid by the client for the specific project giving rise to the claim.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">8. Termination</h2>
            <p>
              Either party may terminate a service engagement by providing 30 days&apos; written notice. In the event of termination, the client shall pay for all work completed up to the date of termination. We reserve the right to terminate or suspend access to our website at any time without notice.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">9. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of England and Wales. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts of England and Wales.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">10. Changes to Terms</h2>
            <p>
              We reserve the right to update these Terms at any time. Changes will be posted on this page with an updated revision date. Your continued use of the website following any changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">11. Contact</h2>
            <p>
              If you have any questions about these Terms, please contact us at{' '}
              <a href="mailto:hello@evrybady.digital" className="text-[#f7e7a6] hover:underline">hello@evrybady.digital</a> or call 01604 59 89 99.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
