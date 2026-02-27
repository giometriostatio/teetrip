import { Link } from 'react-router-dom';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-charcoal text-white font-body">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gold hover:text-gold/80 transition-colors mb-8"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>

        <h1 className="font-display text-4xl font-bold text-gold mb-2">TeeTrip Privacy Policy</h1>
        <p className="text-white/50 mb-10">Last updated: February 27, 2026</p>

        <div className="space-y-8 text-white/80 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Information We Collect</h2>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong>Location data:</strong> We request your device's location to show nearby golf courses. Location is used only in real-time and is not stored on our servers.</li>
              <li><strong>Addresses entered in Group Play:</strong> Player addresses are geocoded to coordinates using OpenStreetMap's Nominatim service to calculate the geographic center. Addresses are not stored permanently — they exist only during your active session.</li>
              <li><strong>Usage data:</strong> We collect anonymous usage analytics (pages visited, features used) to improve the product. No personally identifiable information is tracked.</li>
              <li>We do <strong>NOT</strong> require user accounts, collect emails, passwords, or payment information at this time.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Third-Party Services</h2>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong>Google Places API:</strong> Used to find golf courses and display course information (photos, ratings, reviews). Subject to <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-gold underline hover:text-gold/80">Google's Privacy Policy</a>.</li>
              <li><strong>OpenStreetMap / Nominatim:</strong> Used for geocoding addresses entered in Group Play. Subject to <a href="https://wiki.openstreetmap.org/wiki/Privacy_Policy" target="_blank" rel="noopener noreferrer" className="text-gold underline hover:text-gold/80">OpenStreetMap's Privacy Policy</a>.</li>
              <li><strong>Vercel:</strong> Our hosting provider. Subject to <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-gold underline hover:text-gold/80">Vercel's Privacy Policy</a>.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>To display golf courses near your current map view</li>
              <li>To calculate the optimal meeting point for group play</li>
              <li>To show tee time availability and pricing</li>
              <li>To improve the TeeTrip product experience</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Data Retention</h2>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>We do not maintain user accounts or persistent user data</li>
              <li>Session data (addresses, search history) is cleared when you close the app</li>
              <li>No personal data is sold to third parties — ever</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Cookies</h2>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>TeeTrip uses minimal cookies for basic site functionality</li>
              <li>No advertising cookies or third-party tracking cookies are used</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Children's Privacy</h2>
            <p>TeeTrip is not directed at children under 13. We do not knowingly collect information from children.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Your Rights</h2>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Since we don't store personal data, there is nothing to delete or export</li>
              <li>If you believe we have inadvertently collected your information, contact us</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Changes to This Policy</h2>
            <p>We may update this policy from time to time. Changes will be posted on this page with an updated date.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Contact</h2>
            <p>For questions about this privacy policy, contact: <a href="mailto:privacy@teetrip.app" className="text-gold underline hover:text-gold/80">privacy@teetrip.app</a></p>
          </section>
        </div>
      </div>
    </div>
  );
}
