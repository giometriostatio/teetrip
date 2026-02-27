import { Link } from 'react-router-dom';

export default function Terms() {
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

        <h1 className="font-display text-4xl font-bold text-gold mb-2">TeeTrip Terms of Service</h1>
        <p className="text-white/50 mb-10">Last updated: February 27, 2026</p>

        <div className="space-y-8 text-white/80 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Acceptance of Terms</h2>
            <p>By using TeeTrip, you agree to these terms. If you don't agree, please don't use the service.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Description of Service</h2>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>TeeTrip is a golf tee time discovery platform that helps users find golf courses and tee times using an interactive map.</li>
              <li>TeeTrip currently displays simulated tee time data for demonstration purposes. Real-time tee time availability and booking will be available through third-party partners in a future update.</li>
              <li>TeeTrip does not guarantee the accuracy of course information, tee time availability, or pricing displayed.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Use of the Service</h2>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>You may use TeeTrip for personal, non-commercial purposes.</li>
              <li>You agree not to scrape, crawl, or programmatically access the service without permission.</li>
              <li>You agree not to interfere with the service's operation or infrastructure.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Tee Time Bookings</h2>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>When booking functionality is available through third-party providers, bookings are subject to the terms and conditions of those providers.</li>
              <li>TeeTrip is not responsible for booking confirmations, cancellations, refunds, or disputes with golf courses or booking providers.</li>
              <li>Tee time prices and availability are subject to change without notice.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Intellectual Property</h2>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>TeeTrip, the TeeTrip logo, and associated branding are the property of TeeTrip.</li>
              <li>Course information and photos are sourced from Google Places and belong to their respective owners.</li>
              <li>Map data is provided by OpenStreetMap contributors under the ODbL license.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Limitation of Liability</h2>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>TeeTrip is provided "as is" without warranties of any kind.</li>
              <li>We are not liable for any damages arising from your use of the service.</li>
              <li>We are not liable for inaccuracies in course information, tee time data, or pricing.</li>
              <li>Our total liability is limited to the amount you paid to use TeeTrip (currently $0).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Disclaimer</h2>
            <p>TeeTrip is an independent platform and is not affiliated with, endorsed by, or sponsored by any golf course, golf organization, or booking provider unless explicitly stated.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Termination</h2>
            <p>We reserve the right to suspend or terminate access to TeeTrip at any time for any reason.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Governing Law</h2>
            <p>These terms are governed by the laws of the State of New Jersey, United States.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Changes to Terms</h2>
            <p>We may update these terms at any time. Continued use constitutes acceptance of updated terms.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Contact</h2>
            <p>For questions about these terms, contact: <a href="mailto:legal@teetrip.app" className="text-gold underline hover:text-gold/80">legal@teetrip.app</a></p>
          </section>
        </div>
      </div>
    </div>
  );
}
