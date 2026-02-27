import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';

function useScrollReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    const children = el.querySelectorAll('.reveal-on-scroll');
    children.forEach((child) => observer.observe(child));
    return () => observer.disconnect();
  }, []);
  return ref;
}

function MapPinIcon({ className }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function StarsIcon({ className }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function FlagIcon({ className }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" />
    </svg>
  );
}

export default function Landing() {
  const containerRef = useScrollReveal();

  const scrollToLearnMore = () => {
    document.getElementById('problem-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-charcoal text-white font-body overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 landing-gradient-bg" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="floating-pin" style={{ top: '15%', left: '10%', animationDelay: '0s' }}><MapPinIcon className="text-gold/20" /></div>
          <div className="floating-pin" style={{ top: '25%', right: '15%', animationDelay: '1.5s' }}><MapPinIcon className="text-masters-green/20" /></div>
          <div className="floating-pin" style={{ bottom: '30%', left: '20%', animationDelay: '3s' }}><MapPinIcon className="text-gold/15" /></div>
          <div className="floating-pin" style={{ top: '60%', right: '25%', animationDelay: '2s' }}><MapPinIcon className="text-masters-green/15" /></div>
          <div className="floating-pin" style={{ top: '40%', left: '45%', animationDelay: '4s' }}><MapPinIcon className="text-gold/10" /></div>
        </div>

        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Find the Perfect Course <span className="text-gold">for Your Group</span>
          </h1>
          <p className="text-lg md:text-xl text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed">
            TeeTrip is the first map-first golf discovery app that finds courses fairly centered between all your players.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/app"
              className="px-8 py-3.5 bg-masters-green hover:bg-masters-green-light text-white font-semibold rounded-xl transition-colors text-lg shadow-lg shadow-masters-green/20"
            >
              Open TeeTrip
            </Link>
            <button
              onClick={scrollToLearnMore}
              className="px-8 py-3.5 border-2 border-gold text-gold hover:bg-gold/10 font-semibold rounded-xl transition-colors text-lg"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Problem / Solution */}
      <section id="problem-section" className="py-20 md:py-28 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 md:gap-16">
          <div className="reveal-on-scroll">
            <div className="inline-block px-4 py-1.5 rounded-full bg-soft-red/20 text-soft-red text-sm font-medium mb-4">
              The Problem
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Every golf group wastes time debating where to play.</h2>
            <p className="text-white/60 text-lg leading-relaxed">
              Someone always gets stuck with the long drive. Course selection turns into a 30-message group chat. It doesn't have to be this way.
            </p>
          </div>
          <div className="reveal-on-scroll">
            <div className="inline-block px-4 py-1.5 rounded-full bg-masters-green/20 text-masters-green text-sm font-medium mb-4">
              The Solution
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">TeeTrip calculates the geographic center of your group.</h2>
            <p className="text-white/60 text-lg leading-relaxed">
              It finds the best courses for everyone. Fair drives. Great courses. Done. No more arguments — just golf.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 md:py-28 px-6 bg-charcoal-light/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="reveal-on-scroll font-display text-3xl md:text-4xl font-bold text-center mb-16">
            How It <span className="text-gold">Works</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                icon: <MapPinIcon className="text-gold w-8 h-8" />,
                step: '01',
                title: "Enter Your Group's Locations",
                desc: 'Each player adds their address. TeeTrip maps everyone.',
              },
              {
                icon: <StarsIcon className="text-gold w-8 h-8" />,
                step: '02',
                title: 'Get Smart Recommendations',
                desc: 'Our algorithm ranks courses by distance fairness, availability, rating, and price.',
              },
              {
                icon: <FlagIcon className="text-gold w-8 h-8" />,
                step: '03',
                title: 'Book & Play',
                desc: 'See your top 5 courses ranked with gold pins on the map. One tap to book.',
              },
            ].map((item) => (
              <div key={item.step} className="reveal-on-scroll text-center">
                <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gold/10 flex items-center justify-center">
                  {item.icon}
                </div>
                <div className="text-gold/50 text-sm font-mono mb-2">Step {item.step}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-white/60 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 md:py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="reveal-on-scroll font-display text-3xl md:text-4xl font-bold text-center mb-16">
            Key <span className="text-gold">Features</span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Map-First Discovery', desc: 'Full interactive map. See every course. Pan anywhere.', icon: '🗺️' },
              { title: 'Group Triangulation', desc: 'The fairest way to pick a course for 2-4 players.', icon: '📍' },
              { title: 'Smart Filters', desc: '9 or 18 holes, time of day, price range, rating.', icon: '⚙️' },
              { title: 'Ranked Recommendations', desc: 'Gold pins numbered 1-5 for your best options.', icon: '🏆' },
              { title: 'Works Everywhere', desc: 'Web, iOS, and Android. Same experience.', icon: '📱' },
              {
                title: 'Real-Time Availability',
                desc: 'See which courses have open tee times on your date.',
                icon: '⏱️',
                badge: 'Coming Soon',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="reveal-on-scroll glass-panel rounded-2xl p-6 hover:bg-white/[0.06] transition-colors relative"
              >
                {feature.badge && (
                  <span className="absolute top-4 right-4 px-2 py-0.5 text-xs font-medium bg-gold/20 text-gold rounded-full">
                    {feature.badge}
                  </span>
                )}
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-1">{feature.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-14 px-6 bg-charcoal-light/40 border-y border-white/5">
        <div className="reveal-on-scroll max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { number: '12,000+', label: 'Courses' },
            { number: '50', label: 'States' },
            { number: 'Free', label: 'To Use' },
            { number: 'Web + Mobile', label: 'Platform' },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-gold font-display text-2xl md:text-3xl font-bold">{stat.number}</div>
              <div className="text-white/50 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32 px-6 text-center">
        <div className="reveal-on-scroll max-w-2xl mx-auto">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Ready to Find Your <span className="text-gold">Fairway</span>?
          </h2>
          <Link
            to="/app"
            className="inline-block px-10 py-4 bg-masters-green hover:bg-masters-green-light text-white font-semibold rounded-xl transition-colors text-lg shadow-lg shadow-masters-green/20 mb-4"
          >
            Open TeeTrip
          </Link>
          <p className="text-white/40 text-sm">Free. No account required.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-white/10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-white/40">
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-white/70 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white/70 transition-colors">Terms of Service</Link>
          </div>
          <div className="text-center">&copy; 2026 TeeTrip. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <span className="text-white/30">Powered by Google Places & OpenStreetMap</span>
            <a href="#" className="hover:text-white/70 transition-colors" aria-label="Instagram">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a href="#" className="hover:text-white/70 transition-colors" aria-label="X">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
                <path d="M4 20l6.768 -6.768m2.46 -2.46L20 4" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
