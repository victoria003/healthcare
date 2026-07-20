"use client";

import React, { useState } from "react";
import "./home.css";
import {
  ArrowRight,
  ChevronDown,
  CheckCircle2,
  Shield,
  ShieldCheck,
  Heart,
  User,
  Search,
  Calendar,
  Stethoscope,
  ChevronLeft,
  ChevronRight,
  Star,
  Lock,
  Home,
  DollarSign,
  Bell,
  HeadphonesIcon,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Building2 } from "lucide-react";

const roleOptions = [
  { icon: <User size={24} />, title: "Patient Login", desc: "Find and manage your care.", href: "/patient/login" },
  { icon: <Building2 size={24} />, title: "Agency Login", desc: "Manage your organization and team.", href: "/agency/login" },
  { icon: <Stethoscope size={24} />, title: "Professional Login", desc: "Access your schedule and profile.", href: "/professional/login" },
];

function RoleChooserModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();

  return (
    <div className="role-modal-overlay" onClick={onClose}>
      <div className="role-modal" onClick={(e) => e.stopPropagation()}>
        <button className="role-modal-close" onClick={onClose}>&times;</button>
        <h3 className="role-modal-title">Choose Your Login</h3>
        <p className="role-modal-subtitle">Select your role to continue.</p>
        <div className="role-modal-options">
          {roleOptions.map((opt) => (
            <button key={opt.href} className="role-modal-option" onClick={() => { router.push(opt.href); onClose(); }}>
              <div className="role-modal-option-icon">{opt.icon}</div>
              <div className="role-modal-option-text">
                <span className="role-modal-option-title">{opt.title}</span>
                <span className="role-modal-option-desc">{opt.desc}</span>
              </div>
              <ArrowRight size={16} className="role-modal-option-arrow" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="home-wrapper">
      {/* ── NAVIGATION ── */}
      <nav className="home-nav">
        <div className="home-nav-container">
          <a href="/" className="home-logo">
            <Heart size={28} className="home-logo-icon" />
            <div className="home-logo-text">
              <span className="home-logo-main">HomeCare</span>
              <span className="home-logo-sub">MARKETPLACE</span>
            </div>
          </a>

          <div className="home-nav-links">
            <a href="#how">How It Works</a>
            <a href="#about">About Us</a>
          </div>

          <div className="home-nav-actions">
            <button className="home-btn-login" onClick={() => setModalOpen(true)}>Login</button>
          </div>
        </div>
      </nav>

      {modalOpen && <RoleChooserModal onClose={() => setModalOpen(false)} />}

      {/* ── HERO SECTION ── */}
      <section className="home-hero">
        <div className="home-hero-container">
          <div className="home-hero-content">
            <div className="home-hero-badge">
              <CheckCircle2 size={16} className="text-green-600" />
              <span>Trusted Homecare. Anytime. Anywhere.</span>
            </div>

            <h1 className="home-hero-title">
              Bringing Trusted care closer to <span className="text-blue-500">home.</span>
            </h1>

            <p className="home-hero-desc">
              Designed for the moments when finding the right care matters most
            </p>

            <div className="home-hero-buttons">
              <button className="home-btn-blue" onClick={() => router.push('/patient/login')}>
                <User size={18} /> I Need Care <ArrowRight size={16} />
              </button>
              <button className="home-btn-purple" onClick={() => router.push('/professional/login')}>
                <Stethoscope size={18} /> I Provide Care <ArrowRight size={16} />
              </button>
            </div>

            <div className="home-hero-trust">
              <div className="home-hero-avatars">
                <img src="https://i.pravatar.cc/100?img=1" alt="User 1" />
                <img src="https://i.pravatar.cc/100?img=2" alt="User 2" />
                <img src="https://i.pravatar.cc/100?img=3" alt="User 3" />
                <img src="https://i.pravatar.cc/100?img=4" alt="User 4" />
              </div>
              <div className="home-hero-stars-text">
                <div className="home-stars">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#F59E0B" color="#F59E0B" />)}
                </div>
                <p>Trusted by 10,000+ families</p>
              </div>
            </div>
          </div>

          <div className="home-hero-image-wrapper">
            <img src="/images/hero-bg.png" alt="Nurse with elderly patient" className="home-hero-image" />
            
            <div className="home-hero-stat stat-1">
              <div className="stat-icon-wrapper bg-green-100">
                <Shield size={24} className="text-green-600" />
              </div>
              <div className="stat-text">
                <p className="stat-label">Verified Professionals</p>
                <p className="stat-value">10,000+</p>
              </div>
            </div>

            <div className="home-hero-stat stat-2">
              <div className="stat-icon-wrapper bg-purple-100">
                <ShieldCheck size={24} className="text-purple-600" />
              </div>
              <div className="stat-text">
                <p className="stat-label">Completed Visits</p>
                <p className="stat-value">50,000+</p>
              </div>
            </div>

            <div className="home-hero-stat stat-3">
              <div className="stat-icon-wrapper bg-orange-100">
                <Heart size={24} className="text-orange-500" />
              </div>
              <div className="stat-text">
                <p className="stat-label">Happy Families</p>
                <p className="stat-value">25,000+</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="home-how" id="how">
        <div className="home-how-container">
          <div className="home-section-header">
          <h2>How It Works</h2>
          <p>Simple steps to get quality care at home</p>
        </div>

        <div className="home-how-steps">
          <div className="home-how-step">
            <div className="how-icon-wrapper bg-blue-100 text-blue-600"><User size={28} /></div>
            <h4>Create Account</h4>
            <p>Sign up in minutes</p>
          </div>
          <div className="how-connector"></div>
          
          <div className="home-how-step">
            <div className="how-icon-wrapper bg-blue-100 text-blue-600"><Shield size={28} /></div>
            <h4>Verify & Complete</h4>
            <p>Secure verification</p>
          </div>
          <div className="how-connector"></div>
          
          <div className="home-how-step">
            <div className="how-icon-wrapper bg-purple-100 text-purple-600"><Search size={28} /></div>
            <h4>Choose Service</h4>
            <p>Pick what you need</p>
          </div>
          <div className="how-connector"></div>
          
          <div className="home-how-step">
            <div className="how-icon-wrapper bg-purple-100 text-purple-600"><Calendar size={28} /></div>
            <h4>Book & Confirm</h4>
            <p>Instant booking</p>
          </div>
          <div className="how-connector"></div>
          
          <div className="home-how-step">
            <div className="how-icon-wrapper bg-pink-100 text-pink-600"><Stethoscope size={28} /></div>
            <h4>Care at Home</h4>
            <p>Service provided</p>
          </div>
          <div className="how-connector"></div>
          
          <div className="home-how-step">
            <div className="how-icon-wrapper bg-green-100 text-green-600"><CheckCircle2 size={28} /></div>
            <h4>Review & Support</h4>
            <p>Stay connected</p>
          </div>
          </div>
        </div>
      </section>

      {/* ── CHOOSE YOUR PATH ── */}
      <section className="home-path" id="path">
        <div className="home-path-container">
          <div className="home-section-header">
          <h2>Choose Your Path</h2>
          <p>One platform. Multiple journeys. Your way.</p>
        </div>

        <div className="home-path-cards">
          {/* Card 1 */}
          <div className="path-card blue-card" id="patients">
            <div className="path-badge blue-badge">For Patients & Families</div>
            <h3>I Need Care</h3>
            <p>Book trusted professionals for your loved ones</p>
            <ul className="path-features">
              <li><CheckCircle2 size={16} /> Nursing Care</li>
              <li><CheckCircle2 size={16} /> Elder Care</li>
              <li><CheckCircle2 size={16} /> Post-Surgery Care</li>
              <li><CheckCircle2 size={16} /> Physiotherapy</li>
            </ul>
            <button className="path-btn blue-btn" onClick={() => router.push('/patient/login')}>Explore Services <ArrowRight size={16} /></button>
            <img src="/images/hero-bg.png" className="path-img-placeholder" alt="Patients" style={{ opacity: 0.1 }} />
          </div>

          {/* Card 2 */}
          <div className="path-card purple-card" id="professionals">
            <div className="path-badge purple-badge">For Professionals</div>
            <h3>I Provide Care</h3>
            <p>Grow your career with flexible opportunities</p>
            <ul className="path-features">
              <li><CheckCircle2 size={16} /> Verified Profiles</li>
              <li><CheckCircle2 size={16} /> Flexible Work</li>
              <li><CheckCircle2 size={16} /> Fair Earnings</li>
              <li><CheckCircle2 size={16} /> Secure Payments</li>
            </ul>
            <button className="path-btn purple-btn" onClick={() => router.push('/professional/login')}>Join as Professional <ArrowRight size={16} /></button>
            <img src="/images/hero-bg.png" className="path-img-placeholder" alt="Professionals" style={{ opacity: 0.1 }} />
          </div>

          {/* Card 3 */}
          <div className="path-card green-card" id="organizations">
            <div className="path-badge green-badge">For Organizations</div>
            <h3>I Represent Org</h3>
            <p>Manage teams, bookings & patient care efficiently</p>
            <ul className="path-features">
              <li><CheckCircle2 size={16} /> Team Management</li>
              <li><CheckCircle2 size={16} /> Bookings & Reports</li>
              <li><CheckCircle2 size={16} /> Analytics Dashboard</li>
              <li><CheckCircle2 size={16} /> Compliance</li>
            </ul>
            <button className="path-btn green-btn" onClick={() => router.push('/agency/login')}>Partner With Us <ArrowRight size={16} /></button>
            <img src="/images/hero-bg.png" className="path-img-placeholder" alt="Organization" style={{ opacity: 0.1 }} />
          </div>
          </div>
        </div>
      </section>

      {/* ── WHY FAMILIES TRUST US ── */}
      <section className="home-trust" id="about">
        <div className="home-trust-container">
          <div className="home-section-header">
            <h2>Why Families Trust Us</h2>
          </div>
        <div className="home-trust-grid">
          <div className="trust-item">
             <div className="trust-icon bg-green-50 text-green-600"><ShieldCheck size={24} /></div>
             <span>Verified & Background Checked Professionals</span>
          </div>
          <div className="trust-item">
             <div className="trust-icon bg-blue-50 text-blue-600"><Lock size={24} /></div>
             <span>Secure & Transparent Platform</span>
          </div>
          <div className="trust-item">
             <div className="trust-icon bg-green-50 text-green-600"><Home size={24} /></div>
             <span>Quality Care at Home</span>
          </div>
          <div className="trust-item">
             <div className="trust-icon bg-purple-50 text-purple-600"><DollarSign size={24} /></div>
             <span>Affordable & Accessible</span>
          </div>
          <div className="trust-item">
             <div className="trust-icon bg-purple-50 text-purple-600"><Bell size={24} /></div>
             <span>Real-time Tracking & Updates</span>
          </div>
          <div className="trust-item">
             <div className="trust-icon bg-blue-50 text-blue-600"><HeadphonesIcon size={24} /></div>
             <span>24/7 Support Always Available</span>
          </div>
        </div>
        </div>
      </section>

      {/* ── WHAT OUR USERS SAY ── */}
      <section className="home-testimonials">
        <div className="home-testimonials-container">
          <div className="home-section-header">
            <h2>What Our Users Say</h2>
          </div>
          <div className="testimonial-wrapper">
            <button className="test-nav-btn"><ChevronLeft size={24} /></button>
            <div className="testimonial-grid">
              <div className="testimonial-card">
                <div className="test-stars">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#F59E0B" color="#F59E0B" />)}
              </div>
              <p className="test-quote">"This platform made managing my father's healthcare incredibly simple. Everything is in one place and communication is seamless."</p>
              <div className="test-author">
                <img src="https://i.pravatar.cc/100?img=5" alt="Sarah J." />
                <div className="test-author-info">
                  <h4>- Sarah J.</h4>
                  <span>Patient</span>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="test-stars">
                 {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#F59E0B" color="#F59E0B" />)}
              </div>
              <p className="test-quote">"As a professional, I love the flexibility and opportunities this platform provides. It's well-designed and easy to use."</p>
              <div className="test-author">
                <img src="https://i.pravatar.cc/100?img=6" alt="Michael R." />
                <div className="test-author-info">
                  <h4>- Michael R.</h4>
                  <span>Healthcare Professional</span>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="test-stars">
                 {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#F59E0B" color="#F59E0B" />)}
              </div>
              <p className="test-quote">"Managing our healthcare organization has never been this efficient. The dashboard insights are incredible."</p>
              <div className="test-author">
                <img src="https://i.pravatar.cc/100?img=7" alt="Dr. Priya S." />
                <div className="test-author-info">
                  <h4>- Dr. Priya S.</h4>
                  <span>Healthcare Organization</span>
                </div>
              </div>
            </div>
          </div>
          <button className="test-nav-btn"><ChevronRight size={24} /></button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="home-footer">
        <div className="home-footer-grid">
          <div className="footer-brand">
            <div className="home-logo footer-logo">
              <Heart size={24} className="home-logo-icon" />
              <div className="home-logo-text">
                <span className="home-logo-main">HomeCare</span>
              </div>
            </div>
            <p className="footer-desc">Connecting patients, professionals, and organizations for better home healthcare experiences.</p>
            <div className="footer-socials">
              <div className="social-icon">in</div>
              <div className="social-icon">f</div>
              <div className="social-icon">ig</div>
              <div className="social-icon">X</div>
            </div>
          </div>

          <div className="footer-column">
            <h4>Company</h4>
            <a href="#">About</a>
            <a href="#">Careers</a>
            <a href="#">Contact</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms</a>
          </div>

          <div className="footer-column">
            <h4>Patients</h4>
            <a href="#">Find Care</a>
            <a href="#">FAQs</a>
            <a href="#">Support</a>
          </div>

          <div className="footer-column">
            <h4>Professionals</h4>
            <a href="#">Join as Professional</a>
            <a href="#">Verification Process</a>
            <a href="#">Resources</a>
          </div>

          <div className="footer-column">
            <h4>Organizations</h4>
            <a href="#">Partner With Us</a>
            <a href="#">Enterprise Solutions</a>
            <a href="#">Agency Management</a>
          </div>
          
          <div className="footer-column">
            <h4>Support</h4>
            <a href="#">Help Center</a>
            <a href="#">Contact Support</a>
            <a href="#">Email</a>
            <a href="#">Phone</a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 HomeCare Marketplace.</p>
          <p className="footer-bottom-center">Connecting Patients, Professionals & Organizations.</p>
          <div></div> {/* Empty div to balance flex spacing if needed, but the design just has it aligned left and center */}
        </div>
      </footer>
    </div>
  );
}
