"use client";

import Link from "next/link";
import { MobileMenu } from "@/components/mobile-menu";
import React, { useState } from "react";

function Nav() {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link href="/" className="nav-logo">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M16 2C12 2 9 4 8 7c-2 5 1 9 4 11 1 1 3 1 5 1s4-1 5-2c2-2 3-5 2-8-1-3-4-5-8-5z" fill="#ffe228"/>
            <circle cx="16" cy="18" r="3" fill="#130e30"/>
          </svg>
          Pterodactyl
        </Link>
        
        <nav className="nav-links">
          <a href="#features" className="nav-link">Features <span className="nav-chevron">↓</span></a>
          <a href="#security" className="nav-link">Security</a>
          <a href="/pricing" className="nav-link">Pricing</a>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="nav-link">GitHub</a>
        </nav>
        
        <div className="nav-actions">
          <Link href="/login" className="btn-secondary">Log In</Link>
          <Link href="/register" className="btn-primary">Get Started</Link>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  const [email, setEmail] = useState("");
  
  return (
    <section className="hero-section">
      {/* Organic Blobs */}
      <div className="blob blob-green" style={{ top: "-10%", left: "10%" }} />
      <div className="blob blob-fuchsia" style={{ top: "20%", right: "5%" }} />
      <div className="blob blob-yellow" style={{ bottom: "10%", left: "30%" }} />
      
      <div className="hero-container">
        <div className="hero-content">
          <span className="hero-badge">AES-256 · Zero-Knowledge Security</span>
          
          <h1 className="hero-headline">
            Manage all your game servers in one dashboard
          </h1>
          
          <p className="hero-subhead">
            Aggregate multiple Pterodactyl panels into a single view. Real-time monitoring with military-grade encryption.
          </p>
          
          <form className="hero-form mt-4" onSubmit={(e) => { e.preventDefault(); alert("Thanks! We'll contact you soon."); }}>
            <input 
              type="email" 
              className="hero-input input-pill" 
              placeholder="Enter your work email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="btn-primary">
              Start Free Trial
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </form>
          
          <div className="mt-4 flex items-center gap-3 text-[12px] text-slate">
            <span className="flex items-center gap-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#ffe228">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              No credit card required
            </span>
            <span className="text-gray-300">•</span>
            <span className="flex items-center gap-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#ffe228">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              14-day free trial
            </span>
            <span className="text-gray-300">•</span>
            <span className="flex items-center gap-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#ffe228">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              AES-256 encrypted
            </span>
          </div>
        </div>
        
        <div className="hero-image">
          {/* Product Mockup */}
          <div className="hero-mockup animate-float">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#ff5f57]"/>
              <span className="w-2 h-2 rounded-full bg-[#ffbd2e]"/>
              <span className="w-2 h-2 rounded-full bg-[#28c840]"/>
              <span className="ml-auto text-[11px] font-medium text-slate">control-panel</span>
            </div>
            
            <div className="bg-gradient-to-br from-surface-canvas to-surface-soft-meadow rounded-lg p-4 border border-deep-ink/5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-hedvig-letters-serif font-bold text-heading-sm text-deep-ink">My Servers</h3>
                <button className="btn-ghost text-body-sm">Add New</button>
              </div>
              
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white border border-deep-ink/5">
                    <div className="w-10 h-10 rounded-full bg-surface-hi-yellow-accent/10 grid place-items-center text-body">🎮</div>
                    <div className="flex-1">
                      <div className="font-medium text-deep-ink text-body-sm">Server #{100 + i}</div>
                      <div className="text-slate text-caption">Minecraft • Online</div>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-[#59e25d] animate-shimmer-dot"/>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  return (
    <section className="stats-grid">
      <div className="stat-card">
        <div className="stat-value">10K+</div>
        <div className="stat-label">Active Users</div>
      </div>
      <div className="stat-card">
        <div className="stat-value">50K+</div>
        <div className="stat-label">Servers Managed</div>
      </div>
      <div className="stat-card">
        <div className="stat-value">99.9%</div>
        <div className="stat-label">Uptime SLA</div>
      </div>
      <div className="stat-card">
        <div className="stat-value">24/7</div>
        <div className="stat-label">Expert Support</div>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    {
      icon: "🔗",
      title: "Multi-Panel Aggregation",
      text: "Connect unlimited Pterodactyl panels. View all servers, nodes, RAM & CPU usage in one unified table."
    },
    {
      icon: "🔒",
      title: "Zero-Knowledge Encryption",
      text: "API keys encrypted with AES-256-CBC. Decryption happens server-side only. Your data stays yours."
    },
    {
      icon: "⚡",
      title: "Real-Time Monitoring",
      text: "Parallel fetch with 10s timeout. One panel down? Others keep running smoothly without blocking."
    },
    {
      icon: "✅",
      title: "Admin Approval Flow",
      text: "New connections go PENDING → admin approves → active. Keep control of who accesses your infrastructure."
    },
    {
      icon: "🛡️",
      title: "Isolated Encryption",
      text: "Each API key gets unique encryption context. Breach one? Others remain completely secure."
    },
    {
      icon: "🔥",
      title: "Error Resilience",
      text: "Smart timeouts prevent hangs. Unresponsive panels don't block your entire dashboard experience."
    }
  ];
  
  return (
    <section id="features" className="features-section">
      <div className="features-container">
        <span className="hero-badge mb-8">Features</span>
        
        <h2 className="section-headline">
          Everything you need to manage game servers
        </h2>
        
        <p className="section-subhead">
          Powerful tools and integrations to streamline your server management workflow.
        </p>
        
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card reveal-scale">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-text">{feature.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SecurityFeature() {
  return (
    <section id="security" className="features-section" style={{ background: "var(--surface-soft-meadow)" }}>
      <div className="features-container">
        <span className="hero-badge mb-8">Security</span>
        
        <h2 className="section-headline">
          Zero-knowledge architecture
        </h2>
        
        <p className="section-subhead">
          Your API keys are encrypted at rest and never stored in plaintext. Only you hold the decryption capability.
        </p>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="feature-card">
            <div className="w-12 h-12 rounded-full bg-surface-canvas grid place-items-center mb-4 text-xl">
              🔐
            </div>
            <h3 className="feature-title">AES-256-CBC Encryption</h3>
            <p className="feature-text">
              Industry-standard encryption algorithm. IV:ciphertext format ensures each connection is uniquely secured.
            </p>
          </div>
          
          <div className="feature-card border-2 border-hi-yellow">
            <div className="w-12 h-12 rounded-full bg-surface-canvas grid place-items-center mb-4 text-xl">
              🛡️
            </div>
            <h3 className="feature-title">Client-Side Decryption</h3>
            <p className="feature-text">
              Keys decrypt on server only. Even we can't read your credentials. Complete privacy guarantee.
            </p>
            <div className="mt-4 rounded-lg bg-white border border-deep-ink/5 p-4 font-mono text-caption">
              <div className="text-slate">iv:ciphertext</div>
              <div className="text-deep-ink break-all mt-1">a8f3…:7bKp…==</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: "01", t: "Sign Up", d: "Create account automatically set to PENDING state.", cta: "Register Now", link: "/register" },
    { n: "02", t: "Approval", d: "Admin reviews and approves your request.", cta: "Contact Admin", link: "#" },
    { n: "03", t: "Connect", d: "Add your panel URL and encrypted API key.", cta: "Add Panel", link: "/panels" }
  ];
  
  return (
    <section className="features-section">
      <div className="features-container">
        <span className="hero-badge mb-8">How it works</span>
        
        <h2 className="section-headline">
          Get started in three simple steps
        </h2>
        
        <div className="features-grid">
          {steps.map((step) => (
            <div key={step.n} className="feature-card">
              <span className="text-hi-yellow font-semibold text-caption tracking-[0.06em] uppercase">{step.n}</span>
              <h3 className="feature-title mt-2">{step.t}</h3>
              <p className="feature-text mb-4">{step.d}</p>
              <Link href={step.link} className="btn-ghost text-body-sm inline-flex items-center gap-2">
                {step.cta}
                {step.t !== "Approval" && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </Link>
            </div>
          ))}
        </div>
        
        <div className="mt-8 feature-card text-center">
          <h3 className="feature-title">Ready to get started?</h3>
          <p className="text-slate text-body max-w-md mx-auto mb-6">Join thousands of server administrators managing their infrastructure with confidence.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/register" className="btn-primary">Create Account</Link>
            <Link href="/login" className="btn-secondary">Log In</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div>
          <Link href="/" className="footer-logo">
            Pterodactyl
          </Link>
          <p className="footer-copy mt-4 max-w-xs">
            The ultimate control panel for multi-server game hosting. Secure, scalable, and built by gamers.
          </p>
        </div>
        
        <nav className="footer-nav">
          <div>
            <p className="font-medium text-deep-ink text-body-sm mb-3">Product</p>
            <div className="space-y-2">
              <Link href="#features" className="footer-link">Features</Link>
              <Link href="#security" className="footer-link">Security</Link>
              <Link href="/pricing" className="footer-link">Pricing</Link>
              <Link href="#" className="footer-link">Changelog</Link>
            </div>
          </div>
          
          <div>
            <p className="font-medium text-deep-ink text-body-sm mb-3">Resources</p>
            <div className="space-y-2">
              <Link href="#" className="footer-link">Documentation</Link>
              <Link href="#" className="footer-link">API Reference</Link>
              <Link href="#" className="footer-link">Guides</Link>
              <Link href="#" className="footer-link">Community</Link>
            </div>
          </div>
          
          <div>
            <p className="font-medium text-deep-ink text-body-sm mb-3">Company</p>
            <div className="space-y-2">
              <Link href="#" className="footer-link">About</Link>
              <Link href="#" className="footer-link">Blog</Link>
              <Link href="#" className="footer-link">Careers</Link>
              <Link href="#" className="footer-link">Contact</Link>
            </div>
          </div>
        </nav>
        
        <div className="footer-nav">
          <div>
            <Link href="https://github.com" target="_blank" rel="noreferrer" className="footer-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.43 9.81 8.2 11.41.6.11.82-.26.82-.57v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.09 1.83 1.24 1.83 1.24 1.06 1.83 2.79 1.3 3.47 1 .11-.78.42-1.3.76-1.6-2.67-.3-5.48-1.34-5.48-5.95 0-1.31.47-2.38 1.23-3.22-.13-.3-.54-1.52.11-3.16 0 0 1-.32 3.3 1.23a11.46 11.46 0 0 1 6 0c2.3-1.55 3.3-1.23 3.3-1.23.65 1.64.24 2.86.12 3.16.76.84 1.23 1.91 1.23 3.22 0 4.62-2.82 5.65-5.5 5.95.43.37.82 1.1.82 2.22v3.29c0 .34.22.7.83.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
              </svg>
            </Link>
          </div>
          <div>
            <Link href="#" className="footer-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.95 4.57a10 10 0 0 1-2.82.77 4.96 4.96 0 0 0 2.16-2.72 9.9 9.9 0 0 1-3.12 1.19 4.92 4.92 0 0 0-8.39 4.49A14 14 0 0 1 1.67 3.15 4.92 4.92 0 0 0 3.2 9.72a4.86 4.86 0 0 1-2.22-.61v.06a4.92 4.92 0 0 0 3.95 4.82 4.86 4.86 0 0 1-2.22.09 4.93 4.93 0 0 0 4.6 3.42A9.87 9.87 0 0 1 0 19.54 13.92 13.92 0 0 0 7.55 21c8.65 0 13.39-7.17 13.39-13.39 0-.2 0-.4-.01-.6a9.54 9.54 0 0 0 2.35-2.44z"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>
      
      <div className="container mt-8 pt-8 border-t border-deep-ink/6 text-center">
        <p className="footer-copy">
          © 2026 Pterodactyl Control Panel. Not affiliated with Pterodactyl Software. MIT License.
        </p>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen">
      <Nav />
      <Hero />
      <Stats />
      <Features />
      <SecurityFeature />
      <HowItWorks />
      <Footer />
    </main>
  );
}
