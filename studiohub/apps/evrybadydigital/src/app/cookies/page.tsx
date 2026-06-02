import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy | Evrybady Digital',
  description: 'Cookie Policy for Evrybady Digital Creative Marketing Ltd.',
};

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-[#0a1e0a] text-white">
      <div className="mx-auto max-w-3xl px-6 py-24 sm:px-8 lg:py-32">
        <p className="text-xs uppercase tracking-[0.3em] text-[#f7e7a6]">Legal</p>
        <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Cookie Policy</h1>
        <p className="mt-2 text-sm text-white/50">Last updated: 1 June 2026</p>

        <div className="mt-8 space-y-6 text-sm leading-7 text-white/75">
          <section>
            <h2 className="text-lg font-semibold text-white mb-2">1. What Are Cookies</h2>
            <p>
              Cookies are small text files placed on your device when you visit a website. They are widely used to make websites work more efficiently and to provide reporting information to website operators. Cookies set by us are called &quot;first-party cookies&quot;. Cookies set by third parties are called &quot;third-party cookies&quot;.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">2. How We Use Cookies</h2>
            <p>Evrybady Digital (evrybady.digital) uses cookies for the following purposes:</p>

            <div className="mt-3 rounded-xl border border-white/10 overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="px-4 py-2.5 font-semibold text-white">Type</th>
                    <th className="px-4 py-2.5 font-semibold text-white">Purpose</th>
                    <th className="px-4 py-2.5 font-semibold text-white">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="px-4 py-2.5 text-white/80">Essential</td>
                    <td className="px-4 py-2.5">Required for the website to function. These include session cookies and security tokens.</td>
                    <td className="px-4 py-2.5">Session</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 text-white/80">Analytics</td>
                    <td className="px-4 py-2.5">Help us understand how visitors interact with our website by collecting anonymous usage data.</td>
                    <td className="px-4 py-2.5">Up to 2 years</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 text-white/80">Functional</td>
                    <td className="px-4 py-2.5">Remember your preferences such as language selection and form data.</td>
                    <td className="px-4 py-2.5">Up to 1 year</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 text-white/80">Marketing</td>
                    <td className="px-4 py-2.5">Used to deliver relevant advertising and track campaign performance across platforms.</td>
                    <td className="px-4 py-2.5">Up to 1 year</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">3. Third-Party Cookies</h2>
            <p>We may use third-party services that set their own cookies, including:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong className="text-white">Google Analytics:</strong> Measures website traffic and user behaviour.</li>
              <li><strong className="text-white">Google Ads:</strong> Tracks conversions from advertising campaigns.</li>
              <li><strong className="text-white">Meta (Facebook/Instagram):</strong> Supports social media advertising and tracking.</li>
              <li><strong className="text-white">LinkedIn:</strong> Enables advertising and audience insights.</li>
            </ul>
            <p className="mt-2">Each third party has its own privacy policy governing how they use the data they collect.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">4. Managing Cookies</h2>
            <p>You can control and manage cookies through your browser settings. Most browsers allow you to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>View and delete existing cookies</li>
              <li>Block all cookies or specific categories</li>
              <li>Set preferences for certain websites</li>
              <li>Receive notifications when cookies are being set</li>
            </ul>
            <p className="mt-2">
              Please note that blocking essential cookies may affect the functionality of this website. For more information on managing cookies in your browser, visit{' '}
              <a href="https://www.allaboutcookies.org" target="_blank" rel="noreferrer" className="text-[#f7e7a6] hover:underline">allaboutcookies.org</a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">5. Consent</h2>
            <p>
              When you first visit our website, we will ask for your consent to set non-essential cookies. You can change your preferences at any time by clearing your browser cookies and revisiting the site. Essential cookies do not require consent as they are necessary for the website to function.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">6. Changes to This Policy</h2>
            <p>
              We may update this Cookie Policy periodically to reflect changes in technology, legislation, or our business practices. Any updates will be posted on this page with a revised date.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">7. Contact</h2>
            <p>
              For questions about our use of cookies, contact us at{' '}
              <a href="mailto:hello@evrybady.digital" className="text-[#f7e7a6] hover:underline">hello@evrybady.digital</a> or call 01604 59 89 99.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
