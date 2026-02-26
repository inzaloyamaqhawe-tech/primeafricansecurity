import { useEffect, useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Shield, Phone, Mail, MapPin, ChevronRight, Clock, Zap } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Service Section Component
interface ServiceSectionProps {
  index: string;
  title: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
  image: string;
  panelPosition: 'left' | 'right';
  zIndex: number;
}

function ServiceSection({ index, title, description, primaryCta, secondaryCta, image, panelPosition, zIndex }: ServiceSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const panel = panelRef.current;
    const content = contentRef.current;
    const imageEl = imageRef.current;
    if (!section || !panel || !content || !imageEl) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
          onLeaveBack: () => {
            gsap.set([panel, content, imageEl], { clearProps: 'all' });
          }
        }
      });

      // ENTRANCE (0% - 30%)
      const panelStartX = panelPosition === 'left' ? '-50vw' : '50vw';
      const contentStartX = panelPosition === 'left' ? '-10vw' : '10vw';
      
      tl.fromTo(panel, 
        { x: panelStartX, opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0
      );
      
      tl.fromTo(content.querySelectorAll('.animate-item'),
        { x: contentStartX, opacity: 0 },
        { x: 0, opacity: 1, stagger: 0.03, ease: 'none' },
        0.08
      );
      
      tl.fromTo(imageEl,
        { scale: 1.08, opacity: 0.6 },
        { scale: 1, opacity: 1, ease: 'none' },
        0
      );

      // SETTLE (30% - 70%) - no animation

      // EXIT (70% - 100%)
      const panelExitX = panelPosition === 'left' ? '-18vw' : '18vw';
      const contentExitY = '-10vh';
      
      tl.fromTo(panel,
        { x: 0, opacity: 1 },
        { x: panelExitX, opacity: 0, ease: 'power2.in' },
        0.7
      );
      
      tl.fromTo(content.querySelectorAll('.animate-item'),
        { y: 0, opacity: 1 },
        { y: contentExitY, opacity: 0, stagger: 0.02, ease: 'power2.in' },
        0.7
      );
      
      tl.fromTo(imageEl,
        { scale: 1, opacity: 1 },
        { scale: 1.05, opacity: 0.35, ease: 'none' },
        0.7
      );
    }, section);

    return () => ctx.revert();
  }, [panelPosition]);

  const isLeft = panelPosition === 'left';

  return (
    <section 
      ref={sectionRef} 
      className="relative w-full h-screen overflow-hidden"
      style={{ zIndex }}
    >
      {/* Background Image */}
      <div 
        ref={imageRef}
        className="absolute inset-0 w-full h-full"
        style={{ willChange: 'transform, opacity' }}
      >
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className={`absolute inset-0 ${isLeft ? 'gradient-overlay-left' : 'gradient-overlay-right'}`} />
      </div>

      {/* Corner Markers */}
      <div className="corner-marker corner-marker-tl" />
      <div className="corner-marker corner-marker-tr" />
      <div className="corner-marker corner-marker-bl" />
      <div className="corner-marker corner-marker-br" />

      {/* Panel */}
      <div 
        ref={panelRef}
        className={`absolute top-0 ${isLeft ? 'left-0' : 'left-[54vw]'} w-[46vw] h-full panel-dark border-${isLeft ? 'r' : 'l'} border-[rgba(247,248,251,0.10)]`}
        style={{ willChange: 'transform, opacity' }}
      />

      {/* Content */}
      <div 
        ref={contentRef}
        className={`absolute top-0 ${isLeft ? 'left-[8vw]' : 'left-[58vw]'} w-[36vw] h-full flex flex-col justify-center`}
        style={{ willChange: 'transform, opacity' }}
      >
        <div className="section-index animate-item mb-4">{index}</div>
        <h2 className="headline-lg text-[#F7F8FB] mb-6 animate-item">{title}</h2>
        <p className="text-[#A6A9B6] text-base leading-relaxed mb-8 max-w-[32vw] animate-item">
          {description}
        </p>
        <div className="flex flex-wrap gap-4 animate-item">
          <button className="btn-primary">{primaryCta}</button>
          <button className="btn-outline">{secondaryCta}</button>
        </div>
      </div>
    </section>
  );
}

// Hero Section
function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    const imageEl = imageRef.current;
    const markers = markersRef.current;
    if (!section || !content || !imageEl || !markers) return;

    const ctx = gsap.context(() => {
      // Auto-play entrance animation
      const entranceTl = gsap.timeline({ delay: 0.2 });
      
      entranceTl.fromTo(imageEl,
        { opacity: 0 },
        { opacity: 1, duration: 0.4 }
      );
      
      entranceTl.fromTo(markers.children,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, stagger: 0.06 },
        0.1
      );
      
      entranceTl.fromTo(content.querySelectorAll('.hero-animate'),
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.08 },
        0.25
      );

      // Scroll-driven exit animation
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
          onLeaveBack: () => {
            gsap.set(content.querySelectorAll('.hero-animate'), { x: 0, opacity: 1 });
            gsap.set(imageEl, { scale: 1, opacity: 1 });
            gsap.set(markers.children, { opacity: 1 });
          }
        }
      });

      // ENTRANCE (0% - 30%): Hold at final state (entrance already done)
      // SETTLE (30% - 70%): Static
      
      // EXIT (70% - 100%)
      scrollTl.fromTo(content.querySelectorAll('.hero-animate'),
        { x: 0, opacity: 1 },
        { x: '-18vw', opacity: 0, stagger: 0.02, ease: 'power2.in' },
        0.7
      );
      
      scrollTl.fromTo(imageEl,
        { scale: 1, opacity: 1 },
        { scale: 1.06, opacity: 0.35, ease: 'none' },
        0.7
      );
      
      scrollTl.fromTo(markers.children,
        { opacity: 1 },
        { opacity: 0.3, ease: 'none' },
        0.85
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="relative w-full h-screen overflow-hidden"
      style={{ zIndex: 10 }}
    >
      {/* Background Image */}
      <div 
        ref={imageRef}
        className="absolute inset-0 w-full h-full"
        style={{ willChange: 'transform, opacity', opacity: 0 }}
      >
        <img 
          src="/hero_guard_vehicle.jpg" 
          alt="Security Professional"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 gradient-overlay-left" />
      </div>

      {/* Corner Markers */}
      <div ref={markersRef}>
        <div className="corner-marker corner-marker-tl" style={{ opacity: 0 }} />
        <div className="corner-marker corner-marker-tr" style={{ opacity: 0 }} />
        <div className="corner-marker corner-marker-bl" style={{ opacity: 0 }} />
        <div className="corner-marker corner-marker-br" style={{ opacity: 0 }} />
      </div>

      {/* Content */}
      <div 
        ref={contentRef}
        className="absolute left-[8vw] top-[18vh] w-[44vw]"
      >
        <div className="micro-label text-[#F2C94C] mb-4 hero-animate" style={{ opacity: 0 }}>
          PRIME AFRICAN SECURITY
        </div>
        <h1 className="headline-xl text-[#F7F8FB] mb-6 hero-animate" style={{ opacity: 0 }}>
          PROTECTION BY DESIGN
        </h1>
        <p className="text-[#A6A9B6] text-lg leading-relaxed mb-6 max-w-[38vw] hero-animate" style={{ opacity: 0 }}>
          Corporate security services across Southern Africa—guarding, patrols, K9, and 24/7 monitoring.
        </p>
        <div className="accent-underline hero-animate" style={{ opacity: 0 }} />
        <div className="flex flex-wrap gap-4 mt-8 hero-animate" style={{ opacity: 0 }}>
          <button className="btn-primary">Request a site assessment</button>
          <button className="btn-outline">View services</button>
        </div>
      </div>

      {/* Bottom Right Metadata */}
      <div className="absolute right-[8vw] bottom-[10vh] text-right">
        <div className="micro-label text-[#F2C94C] mb-2 hero-animate" style={{ opacity: 0 }}>
          24/7 CONTROL ROOM
        </div>
        <p className="text-[#A6A9B6] text-sm hero-animate" style={{ opacity: 0 }}>
          Incident response • Real-time tracking
        </p>
      </div>

      {/* Logo */}
      <div className="absolute left-[3.5vw] top-[3.2vh]">
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-[#F2C94C]" />
          <span className="font-display font-bold text-xl tracking-tight">PRIME</span>
        </div>
      </div>

      {/* CTA Button */}
      <div className="absolute right-[3.5vw] top-[3.2vh]">
        <button className="btn-outline text-xs py-2 px-4">Get a quote</button>
      </div>
    </section>
  );
}

// Coverage & Trust Section
function CoverageSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const stats = statsRef.current;
    if (!section || !stats) return;

    const ctx = gsap.context(() => {
      // Animate stats on scroll
      gsap.fromTo(stats.querySelectorAll('.stat-item'),
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          scrollTrigger: {
            trigger: stats,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="relative w-full bg-[#F6F7FB] py-24"
      style={{ zIndex: 100 }}
    >
      <div className="max-w-7xl mx-auto px-[8vw]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Content */}
          <div>
            <h2 className="headline-lg text-[#0B0F17] mb-6">Coverage you can verify</h2>
            <p className="text-[#4a4f5c] text-lg leading-relaxed mb-8">
              From city centers to remote sites, we deploy teams with the right training, equipment, and local knowledge.
            </p>
            
            {/* Industries */}
            <div className="flex flex-wrap gap-3 mb-12">
              {['Mining', 'Logistics', 'Retail', 'Corporate', 'Residential', 'Events'].map((industry) => (
                <span 
                  key={industry}
                  className="px-4 py-2 bg-[#0B0F17] text-[#F7F8FB] text-sm font-medium"
                >
                  {industry}
                </span>
              ))}
            </div>
          </div>

          {/* Right - Map Card */}
          <div className="bg-[#0B0F17] p-8 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" viewBox="0 0 400 300">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#F2C94C" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>
            <div className="relative z-10">
              <div className="micro-label text-[#F2C94C] mb-4">SERVICE AREAS</div>
              <h3 className="text-[#F7F8FB] text-2xl font-bold mb-4">Pretoria & Surrounding Areas</h3>
              <p className="text-[#A6A9B6] mb-6">
                Full coverage in Gauteng province with rapid response capabilities across major commercial and industrial zones.
              </p>
              <div className="flex items-center gap-2 text-[#F2C94C]">
                <MapPin className="w-5 h-5" />
                <span className="text-sm">1092 Pretorius Street, Hatfield</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="stat-item text-center p-8 bg-white border border-[#e2e4ea]">
            <div className="text-5xl font-display font-bold text-[#0B0F17] mb-2">500+</div>
            <div className="text-[#4a4f5c]">Sites under protection</div>
          </div>
          <div className="stat-item text-center p-8 bg-white border border-[#e2e4ea]">
            <div className="text-5xl font-display font-bold text-[#0B0F17] mb-2">24/7</div>
            <div className="text-[#4a4f5c]">Control room monitoring</div>
          </div>
          <div className="stat-item text-center p-8 bg-white border border-[#e2e4ea]">
            <div className="text-5xl font-display font-bold text-[#0B0F17] mb-2">15min</div>
            <div className="text-[#4a4f5c]">Average response time</div>
          </div>
        </div>

        {/* Testimonial */}
        <div className="mt-16 bg-white p-8 border-l-4 border-[#F2C94C]">
          <p className="text-[#0B0F17] text-xl italic mb-4">
            "Prime African Security reduced our incident response time significantly. Their reporting is clear, and their teams are professional."
          </p>
          <div className="text-[#4a4f5c] text-sm">
            — Operations Director, Logistics
          </div>
        </div>
      </div>
    </section>
  );
}

// Contact Section
function ContactSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <section 
      ref={sectionRef} 
      className="relative w-full bg-[#0B0F17] py-24"
      style={{ zIndex: 110 }}
    >
      {/* Corner Markers */}
      <div className="corner-marker corner-marker-tl" />
      <div className="corner-marker corner-marker-tr" />
      <div className="corner-marker corner-marker-bl" />
      <div className="corner-marker corner-marker-br" />

      <div className="max-w-7xl mx-auto px-[8vw]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left - Form */}
          <div>
            <h2 className="headline-lg text-[#F7F8FB] mb-4">Get a security assessment</h2>
            <p className="text-[#A6A9B6] mb-8">
              Tell us what you're protecting. We'll propose a plan within 24 hours.
            </p>
            
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="Name" />
                <input type="email" placeholder="Email" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="tel" placeholder="Phone" />
                <input type="text" placeholder="Company" />
              </div>
              <textarea rows={4} placeholder="Tell us about your security needs" />
              <button type="submit" className="btn-primary w-full md:w-auto">
                Send request
              </button>
            </form>
          </div>

          {/* Right - Contact Info */}
          <div className="lg:pl-8">
            <div className="mb-12">
              <div className="micro-label text-[#F2C94C] mb-4">CONTACT</div>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Phone className="w-5 h-5 text-[#F2C94C]" />
                  <span className="text-[#F7F8FB]">+27 12 753 5662</span>
                </div>
                <div className="flex items-center gap-4">
                  <Mail className="w-5 h-5 text-[#F2C94C]" />
                  <span className="text-[#F7F8FB]">info@primeafrican.co.za</span>
                </div>
                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-[#F2C94C] mt-1" />
                  <span className="text-[#F7F8FB]">1092 Pretorius Street, Hatfield, Pretoria</span>
                </div>
              </div>
            </div>

            <div className="border-l-4 border-[#F2C94C] pl-6">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-[#F2C94C]" />
                <span className="text-[#F7F8FB] font-semibold">Emergency Line</span>
              </div>
              <p className="text-[#A6A9B6] text-sm">
                Available for existing clients 24/7
              </p>
            </div>

            {/* Quick Links */}
            <div className="mt-12">
              <div className="micro-label text-[#F2C94C] mb-4">QUICK LINKS</div>
              <div className="space-y-2">
                {['Services', 'Coverage Areas', 'About Us', 'Careers'].map((link) => (
                  <a 
                    key={link}
                    href="#"
                    className="flex items-center gap-2 text-[#A6A9B6] hover:text-[#F2C94C] transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                    {link}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Footer
function Footer() {
  return (
    <footer className="bg-[#0B0F17] border-t border-[rgba(247,248,251,0.10)] py-8">
      <div className="max-w-7xl mx-auto px-[8vw]">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#F2C94C]" />
            <span className="font-display font-bold text-lg">PRIME AFRICAN SECURITY</span>
          </div>
          <div className="text-[#A6A9B6] text-sm">
            © 2024 Prime African Security (Pty) Ltd. All rights reserved.
          </div>
          <div className="flex items-center gap-2 text-[#A6A9B6] text-sm">
            <Zap className="w-4 h-4 text-[#F2C94C]" />
            <span>Passion of Purpose</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Main App
function App() {
  useEffect(() => {
    // Global snap for pinned sections
    const setupSnap = () => {
      const pinned = ScrollTrigger.getAll()
        .filter(st => st.vars.pin)
        .sort((a, b) => a.start - b.start);
      
      const maxScroll = ScrollTrigger.maxScroll(window);
      if (!maxScroll || pinned.length === 0) return;

      const pinnedRanges = pinned.map(st => ({
        start: st.start / maxScroll,
        end: (st.end ?? st.start) / maxScroll,
        center: (st.start + ((st.end ?? st.start) - st.start) * 0.5) / maxScroll,
      }));

      ScrollTrigger.create({
        snap: {
          snapTo: (value: number) => {
            const inPinned = pinnedRanges.some(r => value >= r.start - 0.02 && value <= r.end + 0.02);
            if (!inPinned) return value;
            
            const target = pinnedRanges.reduce((closest, r) =>
              Math.abs(r.center - value) < Math.abs(closest - value) ? r.center : closest,
              pinnedRanges[0]?.center ?? 0
            );
            return target;
          },
          duration: { min: 0.15, max: 0.35 },
          delay: 0,
          ease: 'power2.out'
        }
      });
    };

    // Delay to ensure all ScrollTriggers are created
    const timer = setTimeout(setupSnap, 500);
    return () => clearTimeout(timer);
  }, []);

  const services = [
    {
      index: '01',
      title: 'STATIC GUARDING',
      description: 'Professional officers at your perimeter, reception, and critical checkpoints. Trained in access control, incident reporting, and customer-facing etiquette.',
      primaryCta: 'Request a quote',
      secondaryCta: 'Download service sheet',
      image: '/static_guarding_gate.jpg',
      panelPosition: 'right' as const
    },
    {
      index: '02',
      title: 'MOBILE PATROLS',
      description: 'Marked and unmarked units on randomized routes. GPS-tracked, radio-linked, and deployed to deter, detect, and respond—fast.',
      primaryCta: 'See coverage areas',
      secondaryCta: 'Talk to an ops manager',
      image: '/mobile_patrol_vehicle.jpg',
      panelPosition: 'left' as const
    },
    {
      index: '03',
      title: 'K9 UNITS',
      description: 'Handlers and dogs trained for patrol, detection, and crowd management. A visible deterrent with disciplined, humane protocols.',
      primaryCta: 'Book a K9 assessment',
      secondaryCta: 'View certifications',
      image: '/k9_handler_dog.jpg',
      panelPosition: 'right' as const
    },
    {
      index: '04',
      title: 'ALARM & MONITORING',
      description: '24/7 control room, signal verification, and rapid dispatch. We monitor what matters—so you can focus on running your business.',
      primaryCta: 'Connect your site',
      secondaryCta: 'Monitoring SLA',
      image: '/control_room_monitors.jpg',
      panelPosition: 'left' as const
    },
    {
      index: '05',
      title: 'RISK CONSULTING',
      description: 'Security audits, threat assessments, and operational planning. We map your risks—then build controls that fit your budget and culture.',
      primaryCta: 'Book a consultation',
      secondaryCta: 'Audit checklist',
      image: '/consulting_meeting.jpg',
      panelPosition: 'right' as const
    },
    {
      index: '06',
      title: 'TECH SYSTEMS',
      description: 'CCTV, access control, and analytics—installed, maintained, and monitored by one team. Integrated security, fewer gaps.',
      primaryCta: 'Design a system',
      secondaryCta: 'Support plans',
      image: '/cctv_tech.jpg',
      panelPosition: 'left' as const
    },
    {
      index: '07',
      title: 'RESPONSE & DISPATCH',
      description: 'Verified alarms trigger immediate action. Our control room coordinates the nearest unit, keeps you informed, and follows through.',
      primaryCta: 'Set up response coverage',
      secondaryCta: 'Response times by area',
      image: '/dispatch_control.jpg',
      panelPosition: 'right' as const
    }
  ];

  return (
    <main className="relative bg-[#0B0F17]">
      {/* Grain Overlay */}
      <div className="grain-overlay" />

      {/* Hero Section */}
      <HeroSection />

      {/* Service Sections */}
      {services.map((service, i) => (
        <ServiceSection 
          key={service.index}
          {...service}
          zIndex={20 + i * 10}
        />
      ))}

      {/* Coverage Section */}
      <CoverageSection />

      {/* Contact Section */}
      <ContactSection />

      {/* Footer */}
      <Footer />
    </main>
  );
}

export default App;
