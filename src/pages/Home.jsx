import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Wrench,
  Droplets,
  Zap,
  Snowflake,
  Sparkles,
  Hammer,
  Paintbrush,
  Cpu,
  CheckCircle2,
  Clock3,
  Star,
  UserCheck,
  MapPin,
  CalendarDays,
  ArrowRight,
  Phone,
  Mail,
  Menu,
  X,
  ChevronRight,
  Copy,
  Check,
  ThumbsUp,
  BadgeCheck,
  ShieldCheck,
  ArrowUpRight,
  Award,
  CreditCard,
  Headphones,
  Layers,
  User,
  ExternalLink,
} from "lucide-react";
import "./home.css";

// Verified High-Resolution Real Commercial Imagery
const images = {
  hero: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=85",
  services: {
    plumbing:
      "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=900&q=85",
    electrical:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=85",
    acRepair:
      "https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=900&q=85",
    cleaning:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=85",
    carpentry:
      "https://images.unsplash.com/photo-1601058268499-e52658b8bb88?auto=format&fit=crop&w=900&q=85",
    painting:
      "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=900&q=85",
    appliance:
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=900&q=85",
    waterTank:
      "https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&w=900&q=85",
  },
  gallery: {
    plumbing:
      "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=900&q=85",
    ac: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=900&q=85",
    electrical:
      "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=900&q=85",
    cleaning:
      "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=900&q=85",
    carpentry:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=85",
    painting:
      "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=900&q=85",
  },
  technicians: {
    arun: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=85",
    karthik:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=85",
    ramesh:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=85",
    priya:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=85",
  },
  testimonials: {
    user1:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=85",
    user2:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=85",
    user3:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=85",
    user4:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=85",
  },
  about:
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=85",
};

// Zero-broken-image fallback handler
const handleImgError = (e, fallbackTitle = "Smart Service") => {
  e.currentTarget.onerror = null;
  e.currentTarget.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="100%" height="100%" fill="%2306284D"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23FF6A00" font-family="sans-serif" font-size="22" font-weight="bold">${encodeURIComponent(fallbackTitle)}</text></svg>`;
};

const Home = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("home");
  const [galleryFilter, setGalleryFilter] = useState("All");
  const [codeCopied, setCodeCopied] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Sticky Navbar shadow on scroll & active nav detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = [
        "top",
        "services",
        "how-it-works",
        "offers",
        "why-us",
        "gallery",
        "technicians",
        "reviews",
        "about",
        "contact",
      ];
      const scrollPosition = window.scrollY + 120;

      for (const sectionId of sections) {
        if (sectionId === "top") continue;
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveNav(sectionId);
            return;
          }
        }
      }

      if (window.scrollY < 300) {
        setActiveNav("home");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const goToLogin = () => {
    setMenuOpen(false);
    navigate("/login");
  };

  const goToRegister = () => {
    setMenuOpen(false);
    navigate("/register");
  };

  const scrollToSection = (id, navKey) => {
    setMenuOpen(false);
    setActiveNav(navKey);

    if (id === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const el = document.getElementById(id);

    if (el) {
      const headerOffset = 78;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText("FIRST20");
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2500);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Show successful submission message
    setFormSubmitted(true);

    // After showing success message, redirect to Login page
    setTimeout(() => {
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });

      setFormSubmitted(false);

      navigate("/login");
    }, 1200);
  };

  // 8 Popular Services
  const services = [
    {
      id: "plumbing",
      name: "Plumbing",
      icon: <Droplets size={22} />,
      image: images.services.plumbing,
      desc: "Leak repairs, pipe fitting, faucet installation & bathroom blockage clearance.",
    },
    {
      id: "electrical",
      name: "Electrical",
      icon: <Zap size={22} />,
      image: images.services.electrical,
      desc: "Switchboard wiring, circuit breakers, light fittings, and power troubleshooting.",
    },
    {
      id: "ac-repair",
      name: "AC Repair",
      icon: <Snowflake size={22} />,
      image: images.services.acRepair,
      desc: "Split & window AC installation, gas charging, filter deep cleaning & tune-up.",
    },
    {
      id: "cleaning",
      name: "Home Cleaning",
      icon: <Sparkles size={22} />,
      image: images.services.cleaning,
      desc: "Complete house deep sanitization, kitchen degreasing & sofa shampooing.",
    },
    {
      id: "carpentry",
      name: "Carpentry",
      icon: <Hammer size={22} />,
      image: images.services.carpentry,
      desc: "Modular furniture assembly, door lock fitting, hinge fixes & custom woodwork.",
    },
    {
      id: "painting",
      name: "Painting",
      icon: <Paintbrush size={22} />,
      image: images.services.painting,
      desc: "Premium interior/exterior wall painting, waterproof coating & texture finishes.",
    },
    {
      id: "appliance",
      name: "Appliance Repair",
      icon: <Cpu size={22} />,
      image: images.services.appliance,
      desc: "Reliable diagnostics and fixes for washing machines, fridges & microwaves.",
    },
    {
      id: "water-tank",
      name: "Water Tank Cleaning",
      icon: <Droplets size={22} />,
      image: images.services.waterTank,
      desc: "Mechanized high-pressure cleaning, sludge removal & antibacterial treatment.",
    },
  ];

  // Stats Strip Data
  const stats = [
    {
      value: "10K+",
      label: "Services Completed",
      icon: <CheckCircle2 size={24} />,
    },
    {
      value: "500+",
      label: "Verified Technicians",
      icon: <UserCheck size={24} />,
    },
    {
      value: "4.8/5",
      label: "Customer Rating",
      icon: <Star size={24} />,
    },
    {
      value: "24/7",
      label: "Support Available",
      icon: <Clock3 size={24} />,
    },
  ];

  // How It Works 5 Steps
  const steps = [
    {
      num: "01",
      title: "Choose Service",
      desc: "Select the required home maintenance service from our curated catalog.",
      icon: <Layers size={24} />,
    },
    {
      num: "02",
      title: "Pick Date & Time",
      desc: "Choose an immediate slot or book your preferred convenient time.",
      icon: <CalendarDays size={24} />,
    },
    {
      num: "03",
      title: "Technician Assigned",
      desc: "A verified, certified specialist is instantly dispatched to your location.",
      icon: <UserCheck size={24} />,
    },
    {
      num: "04",
      title: "Track Service",
      desc: "Monitor technician arrival in real time with transparent status alerts.",
      icon: <MapPin size={24} />,
    },
    {
      num: "05",
      title: "Service Completed",
      desc: "Inspect work satisfaction, pay securely, and enjoy peace of mind.",
      icon: <CheckCircle2 size={24} />,
    },
  ];

  // Why Customers Trust Us
  const trustFeatures = [
    {
      title: "Verified Technicians",
      desc: "100% background-checked, trained, and certified trade professionals.",
      icon: <ShieldCheck size={28} />,
    },
    {
      title: "Secure Payments",
      desc: "Encrypted transactions via UPI, cards, and net-banking with instant receipts.",
      icon: <CreditCard size={28} />,
    },
    {
      title: "Real-Time Tracking",
      desc: "Live updates from booking confirmation right to your technician's arrival.",
      icon: <MapPin size={28} />,
    },
    {
      title: "24/7 Support",
      desc: "Round-the-clock customer assistance ready to answer queries & reschedules.",
      icon: <Headphones size={28} />,
    },
  ];

  // Work Gallery
  const galleryItems = [
    {
      id: 1,
      title: "Kitchen Plumbing Repair",
      category: "Plumbing",
      rating: "4.9",
      image: images.gallery.plumbing,
    },
    {
      id: 2,
      title: "AC Condenser Servicing",
      category: "AC",
      rating: "4.9",
      image: images.gallery.ac,
    },
    {
      id: 3,
      title: "Electrical Panel Upgrade",
      category: "Electrical",
      rating: "4.8",
      image: images.gallery.electrical,
    },
    {
      id: 4,
      title: "Deep Home Cleaning",
      category: "Cleaning",
      rating: "4.9",
      image: images.gallery.cleaning,
    },
    {
      id: 5,
      title: "Custom Furniture Assembly",
      category: "Carpentry",
      rating: "4.8",
      image: images.gallery.carpentry,
    },
    {
      id: 6,
      title: "Interior Wall Painting",
      category: "Painting",
      rating: "4.9",
      image: images.gallery.painting,
    },
  ];

  const filteredGallery =
    galleryFilter === "All"
      ? galleryItems
      : galleryItems.filter((item) => item.category === galleryFilter);

  // Verified Technicians
  const technicians = [
    {
      name: "Arun Kumar",
      specialization: "Master Plumber",
      rating: "4.9",
      experience: "8 Years Experience",
      location: "Karur, TN",
      image: images.technicians.arun,
    },
    {
      name: "Karthik S",
      specialization: "Electrical Specialist",
      rating: "4.8",
      experience: "6 Years Experience",
      location: "Karur, TN",
      image: images.technicians.karthik,
    },
    {
      name: "Ramesh P",
      specialization: "AC Senior Technician",
      rating: "4.9",
      experience: "7 Years Experience",
      location: "Karur, TN",
      image: images.technicians.ramesh,
    },
    {
      name: "Priya Sharma",
      specialization: "Deep Cleaning Lead",
      rating: "4.9",
      experience: "5 Years Experience",
      location: "Karur, TN",
      image: images.technicians.priya,
    },
  ];

  // Testimonials
  const testimonials = [
    {
      name: "Priya S.",
      location: "Trichy, Tamil Nadu",
      rating: 5,
      avatar: images.testimonials.user1,
      comment:
        "Very professional service! The plumbing technician arrived strictly on time, brought advanced tools, and solved the underground pipe leak in under an hour. Outstanding work!",
    },
    {
      name: "Rajesh K.",
      location: "Kulithalai, Tamil Nadu",
      rating: 5,
      avatar: images.testimonials.user2,
      comment:
        "Booked an AC service ahead of summer. Transparent pricing, no hidden charges, and the technician explained the filter issues clearly. Highly recommended platform!",
    },
    {
      name: "Meena T.",
      location: "Karur, Tamil Nadu",
      rating: 5,
      avatar: images.testimonials.user3,
      comment:
        "The deep cleaning team transformed our newly renovated home into a spotless space. Every corner, window, and cabinet was impeccably sanitized. Will book again!",
    },
    {
      name: "Sathish V.",
      location: "Coimbatore, Tamil Nadu",
      rating: 5,
      avatar: images.testimonials.user4,
      comment:
        "The real-time tracking feature gave total peace of mind. The electrician was courteous, wore protective gear, and fixed the main distribution panel safely.",
    },
  ];

  return (
    <div className="ssb-landing">
      {/*
          1. NAVBAR
           */}
      <header className={`ssb-navbar ${isScrolled ? "scrolled" : ""}`}>
        <div className="ssb-container ssb-nav-inner">
          {/* Brand Logo */}
          <button
            className="ssb-brand"
            onClick={() => scrollToSection("top", "home")}
            aria-label="Smart Service Home"
          >
            <span className="ssb-brand-icon">
              <Wrench size={22} strokeWidth={2.5} />
            </span>
            <span className="ssb-brand-texts">
              <strong className="ssb-brand-name">Smart Service</strong>
              <small className="ssb-brand-tagline">Booking & Management</small>
            </span>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="ssb-nav-center" aria-label="Main Navigation">
            {[
              { label: "Home", id: "top", key: "home" },
              { label: "About", id: "about", key: "about" },
              { label: "Services", id: "services", key: "services" },
              { label: "Offers", id: "offers", key: "offers" },
              {
                label: "How It Works",
                id: "how-it-works",
                key: "how-it-works",
              },
              { label: "Why Us", id: "why-us", key: "why-us" },
              { label: "Portfolio", id: "gallery", key: "gallery" },
            ].map((link) => (
              <button
                key={link.key}
                className={`ssb-nav-link ${
                  activeNav === link.key ? "active" : ""
                }`}
                onClick={() => scrollToSection(link.id, link.key)}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right Action CTAs */}
          <div className="ssb-nav-right">
            <button className="ssb-btn-login" onClick={goToLogin}>
              <User size={16} />
              <span>Login</span>
            </button>
            <button className="ssb-btn-register" onClick={goToRegister}>
              <span>Register</span>
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            className="ssb-mobile-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Slide-in Drawer */}
        <div className={`ssb-mobile-menu ${menuOpen ? "open" : ""}`}>
          <div className="ssb-mobile-menu-header">
            <div className="ssb-brand">
              <span className="ssb-brand-icon">
                <Wrench size={20} />
              </span>
              <strong className="ssb-brand-name">Smart Service</strong>
            </div>
            <button
              className="ssb-mobile-close"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            >
              <X size={22} />
            </button>
          </div>

          <nav className="ssb-mobile-nav-links">
            {[
              { label: "Home", id: "top", key: "home" },
              { label: "About", id: "about", key: "about" },
              { label: "Services", id: "services", key: "services" },
              { label: "Offers", id: "offers", key: "offers" },
              {
                label: "How It Works",
                id: "how-it-works",
                key: "how-it-works",
              },
              { label: "Why Us", id: "why-us", key: "why-us" },
              { label: "Portfolio", id: "gallery", key: "gallery" },
            ].map((link) => (
              <button
                key={link.key}
                className={`ssb-mobile-link ${
                  activeNav === link.key ? "active" : ""
                }`}
                onClick={() => scrollToSection(link.id, link.key)}
              >
                <span>{link.label}</span>
                <ChevronRight size={18} />
              </button>
            ))}
          </nav>

          <div className="ssb-mobile-actions">
            <button className="ssb-btn-login w-full" onClick={goToLogin}>
              <User size={16} />
              <span>Login</span>
            </button>
            <button className="ssb-btn-register w-full" onClick={goToRegister}>
              <span>Register</span>
            </button>
          </div>
        </div>
      </header>

      <main>
        {/*
            2. HERO SECTION
             */}
        <section className="ssb-hero" id="hero">
          {/* Floating Decorative Shapes */}
          <div className="ssb-hero-decor shape-1" aria-hidden="true"></div>
          <div className="ssb-hero-decor shape-2" aria-hidden="true"></div>

          <div className="ssb-container ssb-hero-grid">
            {/* Left Content */}
            <div className="ssb-hero-left">
              <div className="ssb-badge-pill">
                <span className="ssb-pulse-dot"></span>
                <span>Trusted Home Services</span>
              </div>

              <h1 className="ssb-hero-title">
                Smart Service Booking &{" "}
                <span className="ssb-text-orange">Management System</span>
              </h1>

              <p className="ssb-hero-desc">
                Book trusted professionals for your home services with ease.
                Choose a service, select your preferred time, and get reliable
                service at your doorstep.
              </p>

              <div className="ssb-hero-actions">
                <button className="ssb-btn-primary" onClick={goToLogin}>
                  <CalendarDays size={18} />
                  <span>Book a Service</span>
                  <ArrowRight size={18} />
                </button>
                <button
                  className="ssb-btn-outline"
                  onClick={() => scrollToSection("services", "services")}
                >
                  <span>Explore Services</span>
                  <ChevronRight size={18} />
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="ssb-trust-indicators">
                <div className="ssb-trust-item">
                  <BadgeCheck size={18} className="ssb-check-icon" />
                  <span>Verified Technicians</span>
                </div>
                <div className="ssb-trust-item">
                  <ShieldCheck size={18} className="ssb-check-icon" />
                  <span>Secure Payments</span>
                </div>
                <div className="ssb-trust-item">
                  <Clock3 size={18} className="ssb-check-icon" />
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>

            {/* Right Visual Image & Floating Badges */}
            <div className="ssb-hero-right">
              <div className="ssb-hero-image-wrap">
                {/* Decorative glow backing */}
                <div className="ssb-hero-image-backdrop"></div>
                <img
                  src={images.hero}
                  alt="Professional home service technician with tools"
                  className="ssb-hero-img"
                  onError={(e) => handleImgError(e, "Professional Technician")}
                />

                {/* Floating Rating Card */}
                <div className="ssb-float-card float-rating">
                  <div className="ssb-float-icon gold">
                    <Star size={20} fill="#FFB800" color="#FFB800" />
                  </div>
                  <div>
                    <strong>4.9 ★ Rating</strong>
                    <small>2,500+ Verified Reviews</small>
                  </div>
                </div>

                {/* Floating Service Badge */}
                <div className="ssb-float-card float-service">
                  <div className="ssb-float-icon orange">
                    <Zap size={20} />
                  </div>
                  <div>
                    <strong>Quick Dispatch</strong>
                    <small>Arrives in 45 Mins</small>
                  </div>
                </div>

                {/* Floating Verified Badge */}
                <div className="ssb-float-card float-verified">
                  <div className="ssb-float-icon blue">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <strong>Verified Technician</strong>
                    <small>100% Background Checked</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/*
            3. TRUST / STATS STRIP
             */}
        <section className="ssb-stats-section">
          <div className="ssb-container">
            <div className="ssb-stats-grid">
              {stats.map((stat, i) => (
                <div key={i} className="ssb-stat-card">
                  <div className="ssb-stat-icon-wrap">{stat.icon}</div>
                  <div className="ssb-stat-info">
                    <h3 className="ssb-stat-val">{stat.value}</h3>
                    <p className="ssb-stat-label">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="ssb-section ssb-about-section" id="about">
          <div className="ssb-container ssb-about-grid">
            <div className="ssb-about-left">
              <div className="ssb-about-image-wrap">
                <img
                  src={images.about}
                  alt="Smart service technician at work"
                  className="ssb-about-img"
                  onError={(e) => handleImgError(e, "Smart Service About")}
                />
                <div className="ssb-about-floating-badge">
                  <span className="ssb-about-stat">5+</span>
                  <span className="ssb-about-stat-label">
                    Years of Trusted Excellence
                  </span>
                </div>
              </div>
            </div>

            <div className="ssb-about-right">
              <span className="ssb-section-badge">ABOUT SMART SERVICE</span>
              <h2 className="ssb-about-title">Making Home Services Simple</h2>
              <p className="ssb-about-desc">
                Smart Service connects customers with verified professionals for
                reliable home services. We take the hassle out of finding
                skilled technicians by offering a single platform with
                transparent pricing, scheduled visits, and guaranteed
                craftsmanship.
              </p>

              <div className="ssb-about-checklist">
                <div className="ssb-check-item">
                  <span className="ssb-check-icon-circle">
                    <Check size={16} strokeWidth={3} />
                  </span>
                  <div>
                    <strong>Trusted Professionals</strong>
                    <p>
                      Screened & background-checked experts for every trade.
                    </p>
                  </div>
                </div>

                <div className="ssb-check-item">
                  <span className="ssb-check-icon-circle">
                    <Check size={16} strokeWidth={3} />
                  </span>
                  <div>
                    <strong>Transparent Pricing</strong>
                    <p>
                      Upfront rate cards with zero hidden or surprise charges.
                    </p>
                  </div>
                </div>

                <div className="ssb-check-item">
                  <span className="ssb-check-icon-circle">
                    <Check size={16} strokeWidth={3} />
                  </span>
                  <div>
                    <strong>Easy Booking</strong>
                    <p>
                      Schedule visits in less than 60 seconds from any device.
                    </p>
                  </div>
                </div>

                <div className="ssb-check-item">
                  <span className="ssb-check-icon-circle">
                    <Check size={16} strokeWidth={3} />
                  </span>
                  <div>
                    <strong>Reliable Support</strong>
                    <p>
                      Dedicated helpline standing by 24/7 for total
                      satisfaction.
                    </p>
                  </div>
                </div>
              </div>

              <div className="ssb-about-actions">
                <button
                  className="ssb-btn-primary"
                  onClick={() => scrollToSection("contact", "contact")}
                >
                  <span>Learn More</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/*
            4. POPULAR SERVICES (8 SERVICES)
             */}
        <section className="ssb-section" id="services">
          <div className="ssb-container">
            <div className="ssb-section-header">
              <span className="ssb-section-badge">OUR EXPERTISE</span>
              <h2 className="ssb-section-title">Popular Services</h2>
              <p className="ssb-section-subtitle">
                Professional services delivered by trusted technicians at your
                doorstep.
              </p>
            </div>

            <div className="ssb-services-grid">
              {services.map((srv) => (
                <div key={srv.id} className="ssb-service-card">
                  <div className="ssb-service-img-wrap">
                    <img
                      src={srv.image}
                      alt={srv.name}
                      className="ssb-service-img"
                      onError={(e) => handleImgError(e, srv.name)}
                    />
                    <span className="ssb-service-icon-floating">
                      {srv.icon}
                    </span>
                  </div>

                  <div className="ssb-service-body">
                    <h3 className="ssb-service-title">{srv.name}</h3>
                    <p className="ssb-service-desc">{srv.desc}</p>
                    <button className="ssb-service-cta" onClick={goToLogin}>
                      <span>Book Now</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="ssb-services-footer-cta">
              <button className="ssb-btn-outline" onClick={goToLogin}>
                <span>View All Services</span>
                <ArrowUpRight size={18} />
              </button>
            </div>
          </div>
        </section>

        {/*
            5. SPECIAL OFFERS
             */}
        <section className="ssb-section ssb-offers-section" id="offers">
          <div className="ssb-offer-banner">
            <div className="ssb-offer-overlay"></div>

            <div className="ssb-offer-content">
              <span className="ssb-offer-label">PROMO</span>

              <h2 className="ssb-offer-title">
                Discount up to <span>20%</span>
                <br />
                for first booking
              </h2>

              <p className="ssb-offer-description">
                Book your first home service with us and enjoy an exclusive
                instant discount on your booking.
              </p>

              <div className="ssb-offer-code-row">
                <span>Use Code:</span>
                <strong>FIRST20</strong>

                <button
                  className="ssb-offer-copy"
                  onClick={handleCopyCode}
                  aria-label="Copy promo code"
                >
                  {codeCopied ? (
                    <>
                      <Check size={15} />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy size={15} />
                      Copy
                    </>
                  )}
                </button>
              </div>

              <button className="ssb-offer-claim" onClick={goToLogin}>
                <span>Claim Offer</span>
                <ArrowRight size={18} />
              </button>
            </div>

            <div className="ssb-offer-side-info">
              <div className="ssb-offer-circle">
                <span>20%</span>
                <small>OFF</small>
              </div>

              <span className="ssb-offer-side-text">LIMITED TIME</span>
            </div>
          </div>
        </section>

        {/*
            6. HOW IT WORKS (5 STEPS)
             */}
        <section className="ssb-section" id="how-it-works">
          <div className="ssb-container">
            <div className="ssb-section-header">
              <span className="ssb-section-badge">SEAMLESS FLOW</span>
              <h2 className="ssb-section-title">How It Works</h2>
              <p className="ssb-section-subtitle">
                Book your service in just a few simple steps.
              </p>
            </div>

            <div className="ssb-steps-container">
              <div className="ssb-steps-line" aria-hidden="true"></div>
              <div className="ssb-steps-grid">
                {steps.map((step, idx) => (
                  <div key={idx} className="ssb-step-card">
                    <div className="ssb-step-number-wrap">
                      <span className="ssb-step-num">{step.num}</span>
                    </div>
                    <div className="ssb-step-icon-wrap">{step.icon}</div>
                    <h3 className="ssb-step-title">{step.title}</h3>
                    <p className="ssb-step-desc">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/*
            7. FEATURE / TRUST SECTION
             */}
        <section className="ssb-section ssb-trust-section" id="why-us">
          <div className="ssb-container">
            <div className="ssb-section-header">
              <span className="ssb-section-badge">WHY CHOOSE US</span>
              <h2 className="ssb-section-title">
                Why Customers Trust Smart Service
              </h2>
              <p className="ssb-section-subtitle">
                Every service comes with our gold standard of safety,
                transparent pricing, and guaranteed customer satisfaction.
              </p>
            </div>

            <div className="ssb-trust-grid">
              {trustFeatures.map((feat, idx) => (
                <div key={idx} className="ssb-feature-card">
                  <div className="ssb-feature-icon-wrap">{feat.icon}</div>
                  <h3 className="ssb-feature-title">{feat.title}</h3>
                  <p className="ssb-feature-desc">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/*
            8. WORK GALLERY (CATEGORIZED PROJECT CARDS)
             */}
        <section className="ssb-section" id="gallery">
          <div className="ssb-container">
            <div className="ssb-section-header">
              <span className="ssb-section-badge">PORTFOLIO</span>
              <h2 className="ssb-section-title">Our Recent Work</h2>
              <p className="ssb-section-subtitle">
                Explore completed home maintenance and repair projects delivered
                by our verified professionals.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="ssb-gallery-filters" role="tablist">
              {[
                "All",
                "Plumbing",
                "Electrical",
                "AC",
                "Cleaning",
                "Carpentry",
              ].map((cat) => (
                <button
                  key={cat}
                  role="tab"
                  aria-selected={galleryFilter === cat}
                  className={`ssb-gallery-tab ${
                    galleryFilter === cat ? "active" : ""
                  }`}
                  onClick={() => setGalleryFilter(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Gallery Grid */}
            <div className="ssb-gallery-grid">
              {filteredGallery.map((work) => (
                <div key={work.id} className="ssb-gallery-card">
                  <div className="ssb-gallery-img-wrap">
                    <img
                      src={work.image}
                      alt={work.title}
                      className="ssb-gallery-img"
                      onError={(e) => handleImgError(e, work.title)}
                    />
                    <span className="ssb-gallery-category-badge">
                      {work.category}
                    </span>
                    <span className="ssb-gallery-completed-badge">
                      <Check size={13} strokeWidth={3} /> Completed
                    </span>
                  </div>

                  <div className="ssb-gallery-body">
                    <h3 className="ssb-gallery-title">{work.title}</h3>
                    <div className="ssb-gallery-meta">
                      <span className="ssb-rating-chip">
                        <Star size={14} fill="#FFB800" color="#FFB800" />
                        <strong>{work.rating}</strong>
                      </span>
                      <span className="ssb-verified-chip">
                        <BadgeCheck size={14} /> Verified Quality
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="ssb-final-cta-section">
          <div
            className="ssb-cta-glow-decor decor-left"
            aria-hidden="true"
          ></div>
          <div
            className="ssb-cta-glow-decor decor-right"
            aria-hidden="true"
          ></div>

          <div className="ssb-container ssb-final-cta-content">
            <span className="ssb-badge-pill-orange">
              INSTANT SERVICE DISPATCH
            </span>
            <h2 className="ssb-final-cta-title">Need a service today?</h2>
            <p className="ssb-final-cta-desc">
              Book a trusted professional and get your service done without the
              hassle.
            </p>

            <div className="ssb-final-cta-buttons">
              <button className="ssb-btn-primary" onClick={goToLogin}>
                <CalendarDays size={18} />
                <span>Book a Service</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </section>
        {/*
            9. VERIFIED TECHNICIANS
             */}
        <section className="ssb-section ssb-techs-section" id="technicians">
          <div className="ssb-container">
            <div className="ssb-section-header">
              <span className="ssb-section-badge">MEET THE EXPERTS</span>
              <h2 className="ssb-section-title">Our Verified Technicians</h2>
              <p className="ssb-section-subtitle">
                Experienced, certified, and vetted professionals ready to
                provide flawless service at your doorstep.
              </p>
            </div>

            <div className="ssb-techs-grid">
              {technicians.map((tech, idx) => (
                <div key={idx} className="ssb-tech-card">
                  <div className="ssb-tech-img-wrap">
                    <img
                      src={tech.image}
                      alt={tech.name}
                      className="ssb-tech-img"
                      onError={(e) => handleImgError(e, tech.name)}
                    />
                    <span className="ssb-tech-rating-badge">
                      <Star size={13} fill="#FFB800" color="#FFB800" />
                      <span>{tech.rating}</span>
                    </span>
                  </div>

                  <div className="ssb-tech-body">
                    <h3 className="ssb-tech-name">{tech.name}</h3>
                    <span className="ssb-tech-role">{tech.specialization}</span>

                    <div className="ssb-tech-details">
                      <div className="ssb-tech-detail-item">
                        <Award size={15} />
                        <span>{tech.experience}</span>
                      </div>
                      <div className="ssb-tech-detail-item">
                        <MapPin size={15} />
                        <span>{tech.location}</span>
                      </div>
                    </div>

                    <button className="ssb-tech-btn" onClick={goToLogin}>
                      <span>View Profile</span>
                      <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/*
            10. CUSTOMER REVIEWS
             */}
        <section className="ssb-section" id="reviews">
          <div className="ssb-container">
            <div className="ssb-section-header">
              <span className="ssb-section-badge">TESTIMONIALS</span>
              <h2 className="ssb-section-title">What Our Customers Say</h2>
              <div className="ssb-overall-rating-badge">
                <div className="ssb-stars-row">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} fill="#FFB800" color="#FFB800" />
                  ))}
                </div>
                <strong>4.8 / 5</strong>
                <span>• Based on 2,500+ reviews</span>
              </div>
            </div>

            <div className="ssb-reviews-grid">
              {testimonials.map((rev, idx) => (
                <div key={idx} className="ssb-review-card">
                  <div className="ssb-review-header">
                    <img
                      src={rev.avatar}
                      alt={rev.name}
                      className="ssb-reviewer-avatar"
                      onError={(e) => handleImgError(e, rev.name)}
                    />
                    <div>
                      <h3 className="ssb-reviewer-name">{rev.name}</h3>
                      <span className="ssb-reviewer-loc">{rev.location}</span>
                    </div>
                  </div>

                  <div className="ssb-stars-row review-stars">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={15} fill="#FFB800" color="#FFB800" />
                    ))}
                  </div>

                  <p className="ssb-review-text">"{rev.comment}"</p>

                  <div className="ssb-review-verified-badge">
                    <BadgeCheck size={15} />
                    <span>Verified Booking</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* <section className="ssb-section ssb-contact-section" id="contact">
          <div className="ssb-container ssb-contact-grid">

            <div className="ssb-contact-info-col">
              <span className="ssb-section-badge">GET IN TOUCH</span>
              <h2 className="ssb-contact-title">Need Help?</h2>
              <p className="ssb-contact-desc">
                Have a question about a service, booking, or quotation? Our
                support team is here to assist you 7 days a week.
              </p>

              <div className="ssb-contact-methods">
                <div className="ssb-contact-method-card">
                  <span className="ssb-contact-icon">
                    <Phone size={22} />
                  </span>
                  <div>
                    <small>Call Us Directly</small>
                    <strong>+91 6379410214</strong>
                  </div>
                </div>

                <div className="ssb-contact-method-card">
                  <span className="ssb-contact-icon">
                    <Mail size={22} />
                  </span>
                  <div>
                    <small>Email Support</small>
                    <strong>nithyasundharame17@gmail.com</strong>
                  </div>
                </div>

                <div className="ssb-contact-method-card">
                  <span className="ssb-contact-icon">
                    <MapPin size={22} />
                  </span>
                  <div>
                    <small>Service Location</small>
                    <strong>Karur, Tamil Nadu — 639001</strong>
                  </div>
                </div>

                <div className="ssb-contact-method-card">
                  <span className="ssb-contact-icon">
                    <Clock3 size={22} />
                  </span>
                  <div>
                    <small>Working Hours</small>
                    <strong>Mon – Sun: 8:00 AM – 9:00 PM</strong>
                  </div>
                </div>
              </div>
            </div>


            <div className="ssb-contact-form-col">
              <div className="ssb-contact-card">
                <h3 className="ssb-form-title">Send Us a Message</h3>
                <p className="ssb-form-subtitle">
                  Fill in your details and our team will get back to you within
                  30 minutes.
                </p>

                {formSubmitted ? (
                  <div className="ssb-form-success">
                    <CheckCircle2 size={44} />
                    <h4>Thank You!</h4>
                    <p>
                      Your message has been sent successfully. Our support
                      specialist will contact you shortly.
                    </p>
                  </div>
                ) : (
                  <form
                    onSubmit={handleFormSubmit}
                    className="ssb-contact-form"
                  >
                    <div className="ssb-form-group">
                      <label htmlFor="fullName">Full Name</label>
                      <input
                        type="text"
                        id="fullName"
                        required
                        placeholder="Nithi"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                    </div>

                    <div className="ssb-form-row">
                      <div className="ssb-form-group">
                        <label htmlFor="emailAddress">Email Address</label>
                        <input
                          type="email"
                          id="emailAddress"
                          required
                          placeholder="nith@example.com"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                        />
                      </div>

                      <div className="ssb-form-group">
                        <label htmlFor="phoneNum">Phone Number</label>
                        <input
                          type="tel"
                          id="phoneNum"
                          required
                          placeholder="+91 xxxxx xx210"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div className="ssb-form-group">
                      <label htmlFor="messageBox">Your Message</label>
                      <textarea
                        id="messageBox"
                        rows={4}
                        required
                        placeholder="Tell us what service you need assistance with..."
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            message: e.target.value,
                          })
                        }
                      ></textarea>
                    </div>

                    <button type="submit" className="ssb-btn-primary w-full">
                      <span>Send Message</span>
                      <ArrowRight size={18} />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section> */}
      </main>

      {/*
          14. FOOTER
           */}
      <footer className="ssb-footer">
        <div className="ssb-container">
          <div className="ssb-footer-top">
            {/* Col 1: Brand & Tagline */}
            <div className="ssb-footer-col ssb-col-brand">
              <div
                className="ssb-brand light"
                onClick={() => scrollToSection("top", "home")}
                role="button"
                tabIndex={0}
              >
                <span className="ssb-brand-icon">
                  <Wrench size={22} />
                </span>
                <span className="ssb-brand-texts">
                  <strong className="ssb-brand-name">Smart Service</strong>
                  <small className="ssb-brand-tagline">
                    Booking & Management
                  </small>
                </span>
              </div>

              <p className="ssb-footer-tagline">
                Your premier on-demand platform for certified home maintenance,
                repairs, and deep sanitation.
              </p>

              {/* Social links */}
              <div className="ssb-footer-socials">
                <a
                  href="#hero"
                  className="ssb-social-btn"
                  aria-label="Facebook"
                  onClick={(e) => e.preventDefault()}
                >
                  <svg
                    width="18"
                    height="18"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>

                <a
                  href="#hero"
                  className="ssb-social-btn"
                  aria-label="Twitter"
                  onClick={(e) => e.preventDefault()}
                >
                  <svg
                    width="18"
                    height="18"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>

                <a
                  href="#hero"
                  className="ssb-social-btn"
                  aria-label="Instagram"
                  onClick={(e) => e.preventDefault()}
                >
                  <svg
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </a>

                <a
                  href="https://www.linkedin.com/in/nithyasundharam-e/"
                  className="ssb-social-btn"
                  aria-label="LinkedIn"
                  onClick={(e) => e.preventDefault()}
                >
                  <svg
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect width="4" height="12" x="2" y="9" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Col 2: Quick Links */}
            <div className="ssb-footer-col">
              <h4 className="ssb-footer-title">Quick Links</h4>
              <ul className="ssb-footer-links">
                <li>
                  <button
                    className="ssb-footer-link"
                    onClick={() => scrollToSection("top", "home")}
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    className="ssb-footer-link"
                    onClick={() => scrollToSection("services", "services")}
                  >
                    Services
                  </button>
                </li>
                <li>
                  <button
                    className="ssb-footer-link"
                    onClick={() =>
                      scrollToSection("how-it-works", "how-it-works")
                    }
                  >
                    How It Works
                  </button>
                </li>
                <li>
                  <button
                    className="ssb-footer-link"
                    onClick={() => scrollToSection("offers", "offers")}
                  >
                    Offers
                  </button>
                </li>
                <li>
                  <button
                    className="ssb-footer-link"
                    onClick={() => scrollToSection("about", "about")}
                  >
                    About
                  </button>
                </li>
                <li>
                  <button
                    className="ssb-footer-link"
                    onClick={() => scrollToSection("contact", "contact")}
                  >
                    Contact
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Popular Services */}
            <div className="ssb-footer-col">
              <h4 className="ssb-footer-title">Popular Services</h4>
              <ul className="ssb-footer-links">
                <li>
                  <button className="ssb-footer-link" onClick={goToLogin}>
                    Plumbing
                  </button>
                </li>
                <li>
                  <button className="ssb-footer-link" onClick={goToLogin}>
                    Electrical
                  </button>
                </li>
                <li>
                  <button className="ssb-footer-link" onClick={goToLogin}>
                    AC Repair
                  </button>
                </li>
                <li>
                  <button className="ssb-footer-link" onClick={goToLogin}>
                    Cleaning
                  </button>
                </li>
                <li>
                  <button className="ssb-footer-link" onClick={goToLogin}>
                    Carpentry
                  </button>
                </li>
                <li>
                  <button className="ssb-footer-link" onClick={goToLogin}>
                    Painting
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 4: Contact Info */}
            <div className="ssb-footer-col">
              <h4 className="ssb-footer-title">Contact</h4>
              <ul className="ssb-footer-contact-list">
                <li>
                  <Phone size={16} />
                  <span>+91 6379410214</span>
                </li>
                <li>
                  <Mail size={16} />
                  <span>nithyasundharame17@gmail.com</span>
                </li>
                <li>
                  <MapPin size={16} />
                  <span>Karur, Tamil Nadu — 639001</span>
                </li>
                <li>
                  <Clock3 size={16} />
                  <span>Mon – Sun: 8:00 AM – 9:00 PM</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="ssb-footer-bottom">
            <p className="ssb-copyright">
              © 2026 Smart Service. All rights reserved.
            </p>

            <div className="ssb-legal-links">
              <a href="#hero" onClick={(e) => e.preventDefault()}>
                Privacy Policy
              </a>
              <span>•</span>
              <a href="#hero" onClick={(e) => e.preventDefault()}>
                Terms & Conditions
              </a>
              <span>•</span>
              <a href="#hero" onClick={(e) => e.preventDefault()}>
                Refund Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
