"use client";
import { useEffect } from "react";
import PillNav from '@/components/PillNav';
import BubbleMenu from '@/components/BubbleMenu';

function usePageInit() {
  useEffect(() => {
    // Preloader is handled by inline script in layout.tsx (fires before React hydration).
    // This fixes mobile "stuck at 0%". The useEffect no longer needs to drive it.

    // ── Reveal Animations ──
    const revealEls = document.querySelectorAll<Element>('.reveal-up, .reveal-text');
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px' }
    );
    revealEls.forEach(el => revealObserver.observe(el));

    // ── Skills Canvas (re-init on back-navigation) ──
    const w = window as any;
    if (typeof w.initSkillsPhysics === 'function') {
      w.initSkillsPhysics();
    }

    return () => { revealObserver.disconnect(); };
  }, []);
}



export default function Page() {
  usePageInit();

  return (
    <>
  <div id="noise-overlay"></div>

  <PillNav
    logo={<span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1rem', color: '#f0f0f0', letterSpacing: '-0.03em' }}>rs<span className="logo-underscore">.</span></span>}
    logoAlt="Ryyan Safar"
    items={[
      { label: 'About', href: '#about' },
      { label: 'Work', href: '#work' },
      { label: 'Projects', href: '#projects' },
      { label: 'Skills', href: '#skills' },
      { label: 'Ideathon', href: '#ideathon' },
      { label: 'Contact', href: '#contact' },
      { label: '[Design]', href: '/design' },
      { 
        label: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
            <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
            <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
            <line x1="6" y1="2" x2="6" y2="4" />
            <line x1="10" y1="2" x2="10" y2="4" />
            <line x1="14" y1="2" x2="14" y2="4" />
          </svg>
        ), 
        href: 'https://razorpay.me/@ryyansafar',
        ariaLabel: 'Buy me a coffee' 
      }
    ]}
    activeHref=""
  />

  <BubbleMenu
    logo={<span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1.1rem', color: '#FFDD00', letterSpacing: '-0.03em' }}>rs<span style={{ color: '#FFDD00' }}>.</span></span>}
    menuBg="#0d0d0d"
    menuContentColor="#f0f0f0"
    items={[
      { label: 'about',    href: '#about',           rotation: -8, hoverStyles: { bgColor: '#FFDD00', textColor: '#050505' } },
      { label: 'work',     href: '#work',             rotation:  8, hoverStyles: { bgColor: '#FFDD00', textColor: '#050505' } },
      { label: 'projects', href: '#projects',         rotation: -8, hoverStyles: { bgColor: '#FFDD00', textColor: '#050505' } },
      { label: 'skills',   href: '#skills',           rotation:  8, hoverStyles: { bgColor: '#ffffff', textColor: '#050505' } },
      { label: 'contact',  href: '#contact',          rotation: -8, hoverStyles: { bgColor: '#FFDD00', textColor: '#050505' } },
      { label: 'design',   href: '/design',             rotation: -8, hoverStyles: { bgColor: '#FFDD00', textColor: '#050505' } },
    ]}
  />

  
  <div className="main-wrapper">
    <header className="hero">
      <div className="hero-content">
        {/* Swiss poster tag — top left */}
        <div className="reveal-up" style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.72rem',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: 'var(--poster-yellow)',
          marginBottom: '1.5rem',
          marginTop: '6rem', // Prevents overlap with fixed navbar
          opacity: 0.7,
        }}>[RS_DESIGN] · Electronics &amp; Communication Engineer</div>

        <div className="hero-text reveal-text">
          {/* Massive stacked poster headline */}
          <h1 className="glitch-text" style={{ display: 'block' }}>
            <span className="scramble-text" style={{ display: 'block' }}>RYYAN</span>
            <span className="scramble-text" style={{ display: 'block', color: '#fff', WebkitTextFillColor: '#fff' }}>SAFAR</span>
          </h1>
          <h2 className="subtitle">→ Building at the intersection of hardware &amp; software</h2>
        </div>

        {/* Horizontal rule + meta info strip — Swiss editorial */}
        <div className="hero-meta-strip" style={{
          alignItems: 'center',
          borderTop: '1px solid rgba(255,221,0,0.2)',
          borderBottom: '1px solid rgba(255,221,0,0.2)',
          padding: '1.2rem 0',
          margin: '2.5rem 0',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.7rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase' as const,
          color: 'rgba(255,255,255,0.35)',
        }}>
          <span>Electronics · Robotics · Embedded Systems · Web</span>
          <span style={{ color: 'var(--poster-yellow)', opacity: 0.7 }}>2026</span>
        </div>

        <div className="hero-actions reveal-up">
          <a href="#projects" className="btn btn-primary" data-magnetic>View Projects</a>
          <a href="RyyanSafar_Resume.pdf" download className="btn btn-outline btn-resume" data-magnetic style={{ gap: '0.6rem' }}>
            <span>Resume</span>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
          </a>
        </div>

        <div className="social-links reveal-up" style={{animationDelay: '0.2s', justifyContent: 'flex-start'}}>
          <a href="https://linkedin.com/in/ryyan-safar-038a82288/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
            data-magnetic>LinkedIn</a>
          <span className="separator">/</span>
          <a href="https://github.com/ryyansafar" target="_blank" rel="noopener noreferrer" aria-label="GitHub" data-magnetic>GitHub</a>
          <span className="separator">/</span>
          <a href="mailto:safarryyan@gmail.com" aria-label="Email" data-magnetic>Email</a>
        </div>
      </div>

    </header>

    <main>
      <section id="about" className="section-padding">
        <div className="container">
          <div className="section-header reveal-up">
            <span className="section-tag">01</span>
            <h2>About Me</h2>
          </div>

          <div className="about-grid">
            <div className="about-text reveal-up">
              <p className="lead">Aspiring <strong>Electronics & Communication Engineer</strong> with a passion for building
                <strong>automation systems</strong> and <strong>intelligent machines</strong>.
              </p>
              <p>I seek opportunities to apply technical knowledge in robotics, embedded systems, chip design, and
                motion
                control while driving impactful innovations. Eager to contribute to collaborative projects, optimize
                real-world solutions, and grow as a tech leader at the intersection of hardware and software.</p>

              <div className="tech-stack-mini">
                <h3>Core Technologies</h3>
                <ul className="tech-list">
                  <li>ROS 2</li>
                  <li>Verilog HDL</li>
                  <li>Embedded C</li>
                  <li>Python & C++</li>
                  <li>TensorFlow</li>
                  <li>OpenCV</li>
                  <li>PCB Design</li>
                  <li>Raspberry Pi</li>
                </ul>
              </div>
            </div>

            <div className="stats-grid reveal-up" style={{"animationDelay":"0.2s"}}>
              <div className="stat-card">
                <span className="stat-number">3+</span>
                <span className="stat-label">Years Experience</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">12+</span>
                <span className="stat-label">Projects Built</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">5+</span>
                <span className="stat-label">Leadership Roles</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="work" className="section-padding">
        <div className="container">
          <div className="section-header reveal-up">
            <span className="section-tag">02</span>
            <h2>Experience</h2>
          </div>

          <div className="timeline">

            <div className="timeline-item reveal-up">
              <div className="timeline-date">May 2025 – Jun 2025</div>
              <div className="timeline-content">
                <h3>Research Intern</h3>
                <div className="company">AugsenseLab</div>
                <p>Built real-time IMU + GNSS sensor fusion system using Kalman Filter, achieving centimeter-level positioning accuracy.</p>
                <p>Developed Flask-based dashboard for visualizing live sensor streams and weather data using NetCDF models. Designed precipitation prediction tool integrating proprietary sensing data with forecast models.</p>
                <div className="tags">
                  <span>Kalman Filter</span>
                  <span>Sensor Fusion</span>
                  <span>Flask</span>
                  <span>NetCDF</span>
                </div>
              </div>
            </div>

            <div className="timeline-item reveal-up">
              <div className="timeline-date">Sep 2024 – Present</div>
              <div className="timeline-content">
                <h3>Technical Coordinator & Social Media Manager</h3>
                <div className="company">TeamApt Academy LLP</div>
                <p>Designed, built, and maintain <a href="https://teamapt.in" target="_blank" rel="noopener noreferrer">teamapt.in</a> and <a href="https://teachers.teamapt.in" target="_blank" rel="noopener noreferrer">teachers.teamapt.in</a> — a student management portal for attendance and academic records. Built using HTML, CSS, and JavaScript.</p>
                <p>Implemented monthly report downloads and automatic status updates upon completion of fixed class targets. Manages official social media channels, content scheduling, and engagement analytics.</p>
                <div className="tags">
                  <span>Web Dev</span>
                  <span>Social Media</span>
                </div>
              </div>
            </div>

            <div className="timeline-item reveal-up">
              <div className="timeline-date">Nov 2023 – Jan 2025</div>
              <div className="timeline-content">
                <h3>Vice President</h3>
                <div className="company">SOCIAL — Student Open Collaboration for Innovative Applications</div>
                <p>Led technical and outreach initiatives for campus-wide innovation programs. Organized workshops and speaker sessions on social entrepreneurship and tech-for-good.</p>
                <p>Contributed to content creation for student newsletter "Chronicles", featuring student-led innovations.</p>
                <div className="tags">
                  <span>Leadership</span>
                  <span>Event Management</span>
                  <span>Content Writing</span>
                </div>
              </div>
            </div>

            <div className="timeline-item reveal-up">
              <div className="timeline-date">Oct 2025 – Dec 2025</div>
              <div className="timeline-content">
                <h3>Campus Ambassador</h3>
                <div className="company">Perplexity AI — Comet Program</div>
                <p>Represented Perplexity AI across university networks, promoting responsible AI adoption. Generated verified outreach leads and provided user feedback to improve campus engagement.</p>
                <div className="tags">
                  <span>AI Advocacy</span>
                  <span>Community</span>
                  <span>Outreach</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="projects" className="section-padding">
        <div className="container">
          <div className="section-header reveal-up">
            <span className="section-tag">03</span>
            <h2>Projects</h2>
          </div>

          <div className="projects-grid">

            <article className="project-card reveal-up">
              <div className="project-content">
                <div className="project-top">
                  <h3>Tinkerbluds</h3>
                </div>
                <p>ML-based agricultural farmland verification using Sentinel-1/2, SRTM terrain, and ESA WorldCover feature fusion. Fraud detection using geospatial overlap logic and PASS/REVIEW/FAIL scoring pipeline.</p>
                <ul className="project-tech">
                  <li>Python</li>
                  <li>FastAPI</li>
                  <li>Google Earth Engine</li>
                  <li>XGBoost</li>
                  <li>Supabase</li>
                </ul>
              </div>
            </article>

            <article className="project-card reveal-up">
              <div className="project-content">
                <div className="project-top">
                  <h3>OpenBreadboard</h3>
                  <a href="https://github.com/ryyansafar/openbreadboard" target="_blank" rel="noopener noreferrer" className="project-link">↗</a>
                  <span className="wip-badge">WIP</span>
                </div>
                <p>Open-source community platform for uploading IC/component datasheets and collaborative hardware connectivity mapping. Targeting browser-based pre-purchase simulation support for electronics prototyping.</p>
                <ul className="project-tech">
                  <li>TypeScript</li>
                  <li>Open Source</li>
                  <li>Electronics</li>
                </ul>
              </div>
            </article>

            <article className="project-card reveal-up">
              <div className="project-content">
                <div className="project-top">
                  <h3>Ouroboros — Snake Bot</h3>
                </div>
                <p>Bio-inspired screw-drive snake robot with counter-rotating helical modules and 3D-printed ball-and-socket joints. Integrated live telemetry dashboard for orientation and human-presence sensing in disaster scenarios.</p>
                <ul className="project-tech">
                  <li>Raspberry Pi Pico 2W</li>
                  <li>L298N</li>
                  <li>MPU6050</li>
                  <li>PIR</li>
                  <li>3D Printing</li>
                </ul>
              </div>
            </article>

            <article className="project-card reveal-up">
              <div className="project-content">
                <div className="project-top">
                  <h3>NeoPixel Snake Game</h3>
                </div>
                <p>Hardware game for TinkerSpace Space Carnival with falling colored bits on a long LED strip. Custom color-button remote and enclosure using ESP-NOW wireless communication.</p>
                <ul className="project-tech">
                  <li>ESP32</li>
                  <li>ESP-NOW</li>
                  <li>NeoPixel</li>
                  <li>Custom PCB</li>
                </ul>
              </div>
            </article>


            <article className="project-card reveal-up">
              <div className="project-content">
                <div className="project-top">
                  <h3>Mis-Communicationator</h3>

                </div>
                <p>Autonomous AI-to-AI communication system where two LLMs converse continuously. Deployed on Raspberry
                  Pi 4 with thermal optimization (82.3°C).</p>
                <ul className="project-tech">
                  <li>Raspberry Pi 4</li>
                  <li>StableLM</li>
                  <li>llama.cpp</li>
                  <li>Python</li>
                </ul>
              </div>
            </article>

            
            <article className="project-card reveal-up">
              <div className="project-content">
                <div className="project-top">
                  <h3>Camera-Only Height Est.</h3>
                  <a href="https://github.com/ryyansafar/LIDAR_to_Cam_only" target="_blank" rel="noopener noreferrer" className="project-link">↗</a>
                  <span className="wip-badge">WIP</span>
                </div>
                <p>Unified pipeline generating LiDAR-derived height maps from RGB images. Uses a UNet-style architecture
                  trained on KITTI/IDD datasets.</p>
                <ul className="project-tech">
                  <li>PyTorch</li>
                  <li>LiDAR Calibration</li>
                  <li>Docker</li>
                  <li>OpenCV</li>
                </ul>
              </div>
            </article>

            
            <article className="project-card reveal-up">
              <div className="project-content">
                <div className="project-top">
                  <h3>FPGA Kalman Filter</h3>
                  <span className="wip-badge">WIP</span>
                </div>
                <p>Hardware-accelerated sensor fusion on FPGA for fusing IMU and GNSS data. Custom Verilog modules for
                  fixed-point arithmetic.</p>
                <ul className="project-tech">
                  <li>Verilog HDL</li>
                  <li>FPGA</li>
                  <li>Kalman Filter</li>
                  <li>UART</li>
                </ul>
              </div>
            </article>

            
            <article className="project-card reveal-up">
              <div className="project-content">
                <div className="project-top">
                  <h3>Smart Glass Mount</h3>
                  <a href="https://github.com/ryyansafar/Runtime_terrors_EYRA" target="_blank" rel="noopener noreferrer" className="project-link">↗</a>
                </div>
                <p>Assistive device for the visually impaired using ESP32-CAM and YOLOv5 for real-time obstacle
                  detection. Awarded Real-World Impact Award at HackSus 4.0 among 55+ teams.</p>
                <ul className="project-tech">
                  <li>ESP32</li>
                  <li>YOLOv5</li>
                  <li>OpenCV</li>
                  <li>TinyML</li>
                </ul>
              </div>
            </article>

            
            <article className="project-card reveal-up">
              <div className="project-content">
                <div className="project-top">
                  <h3>CNC Plotter Machine</h3>

                </div>
                <p>Compact CNC plotter built from repurposed stepper motors for drawing PCB layouts. Engineered frame
                  and motion system using scrap materials.</p>
                <ul className="project-tech">
                  <li>Arduino UNO</li>
                  <li>GRBL</li>
                  <li>G-code</li>
                  <li>Mechanical Design</li>
                </ul>
              </div>
            </article>

            
            <article className="project-card reveal-up">
              <div className="project-content">
                <div className="project-top">
                  <h3>Autonomous Robot Arm</h3>

                </div>
                <p>5-DOF robotic arm simulation in Gazebo/ROS 2 for car door assembly. Implemented inverse kinematics
                  and path planning.</p>
                <ul className="project-tech">
                  <li>ROS 2</li>
                  <li>Gazebo</li>
                  <li>URDF/Xacro</li>
                  <li>Python</li>
                </ul>
              </div>
            </article>

            
            <article className="project-card reveal-up">
              <div className="project-content">
                <div className="project-top">
                  <h3>Sign Language Translator</h3>
                  <a href="https://github.com/ryyansafar/the-techtastic-four" target="_blank" rel="noopener noreferrer" className="project-link">↗</a>
                </div>
                <p>ID card type prototype translating Sign Language to English using Teachable Machines. Real-time
                  display on LCD via ESP32.</p>
                <ul className="project-tech">
                  <li>TensorFlow</li>
                  <li>Arduino</li>
                  <li>ESP32</li>
                  <li>Python</li>
                </ul>
              </div>
            </article>

            
            <article className="project-card reveal-up">
              <div className="project-content">
                <div className="project-top">
                  <h3>Electronic Voting Machine</h3>

                </div>
                <p>Secure voting machine with SD card logging, LCD interface, and debounce handling. Ensures data
                  integrity and reliable vote registration.</p>
                <ul className="project-tech">
                  <li>C++</li>
                  <li>ESP32</li>
                  <li>SPI</li>
                  <li>SD Card</li>
                </ul>
              </div>
            </article>

            
            <article className="project-card reveal-up">
              <div className="project-content">
                <div className="project-top">
                  <h3>Humidity Alert System</h3>

                </div>
                <p>Real-time humidity monitoring system using ESP32 and DHT22. Triggers buzzer alerts when thresholds
                  are exceeded.</p>
                <ul className="project-tech">
                  <li>ESP32</li>
                  <li>DHT22</li>
                  <li>C++</li>
                  <li>IoT</li>
                </ul>
              </div>
            </article>

            
            <article className="project-card reveal-up">
              <div className="project-content">
                <div className="project-top">
                  <h3>Dual Op-Amp Generator</h3>

                </div>
                <p>Triangle and square wave generator using two IC741 op-amps. Integrated SPDT switch for waveform
                  toggling.</p>
                <ul className="project-tech">
                  <li>IC741</li>
                  <li>Analog Circuits</li>
                  <li>Signal Processing</li>
                </ul>
              </div>
            </article>

            
            <article className="project-card reveal-up">
              <div className="project-content">
                <div className="project-top">
                  <h3>Digital Logic Stopwatch</h3>

                </div>
                <p>Digital stopwatch built from scratch using 7433 IC, 555 Timer, and logic gates. Features
                  start/stop/reset functionality.</p>
                <ul className="project-tech">
                  <li>Digital Logic</li>
                  <li>555 Timer</li>
                  <li>PCB Design</li>
                </ul>
              </div>
            </article>

            
            <article className="project-card reveal-up">
              <div className="project-content">
                <div className="project-top">
                  <h3>IR Communication System</h3>

                </div>
                <p>Wireless IR transmitter-receiver system for output control. Achieved 1-2m range using frequency-based
                  signals.</p>
                <ul className="project-tech">
                  <li>Analog Electronics</li>
                  <li>IR Modules</li>
                  <li>Circuit Design</li>
                </ul>
              </div>
            </article>

            
            <article className="project-card reveal-up">
              <div className="project-content">
                <div className="project-top">
                  <h3>Secure Password Manager</h3>
                  <a href="https://github.com/me50/ryyansafar" target="_blank" rel="noopener noreferrer" className="project-link">↗</a>
                </div>
                <p>Web-based password manager with secure login and CRUD operations. Built as final project for CS50.
                </p>
                <ul className="project-tech">
                  <li>Python</li>
                  <li>Flask</li>
                  <li>MySQL</li>
                  <li>Security</li>
                </ul>
              </div>
            </article>

            
            <article className="project-card reveal-up">
              <div className="project-content">
                <div className="project-top">
                  <h3>Auto Street Light</h3>
                </div>
                <p>Automatic street light prototype using LDR and 555 Timer. Activates lights based on ambient light
                  thresholds.</p>
                <ul className="project-tech">
                  <li>555 Timer</li>
                  <li>LDR</li>
                  <li>Automation</li>
                </ul>
              </div>
            </article>

            
            <article className="project-card reveal-up">
              <div className="project-content">
                <div className="project-top">
                  <h3>Hospital Booking Agent</h3>
                </div>
                <p>Hospital finder and booking assistant using Python and MySQL. Manages details for 5 hospitals and
                  specialists.</p>
                <ul className="project-tech">
                  <li>Python</li>
                  <li>MySQL</li>
                  <li>Database Mgmt</li>
                </ul>
              </div>
            </article>

            <article className="project-card reveal-up">
              <div className="project-content">
                <div className="project-top">
                  <h3>help-me-survive-college</h3>
                  <a href="https://github.com/ryyansafar/help-me-survive-college" target="_blank" rel="noopener noreferrer" className="project-link">↗</a>
                </div>
                <p>Grade calculator that computes the minimum marks needed to pass or hit specific target grades — because sometimes you need the math to be brutal with you.</p>
                <ul className="project-tech">
                  <li>HTML</li>
                  <li>JavaScript</li>
                  <li>Calculator</li>
                </ul>
              </div>
            </article>

            <article className="project-card reveal-up">
              <div className="project-content">
                <div className="project-top">
                  <h3>too-lazy-to-write-homework-inator</h3>
                  <a href="https://github.com/ryyansafar/too-lazy-to-write-homework-inator" target="_blank" rel="noopener noreferrer" className="project-link">↗</a>
                </div>
                <p>Python automation tool for the perpetually time-challenged student. Does what it says on the tin.</p>
                <ul className="project-tech">
                  <li>Python</li>
                  <li>Automation</li>
                </ul>
              </div>
            </article>

            <article className="project-card reveal-up">
              <div className="project-content">
                <div className="project-top">
                  <h3>literature-clock-pro</h3>
                  <a href="https://litclock.ryyansafar.site" target="_blank" rel="noopener noreferrer" className="project-link">↗</a>
                </div>
                <p>Browser simulation of a 191×278 electromagnetic flip-disc display — 53,098 discs showing a literary quote for every minute of the day. Includes ESP32 firmware for the physical installation.</p>
                <ul className="project-tech">
                  <li>Vanilla JS</li>
                  <li>HTML/CSS</li>
                  <li>ESP32</li>
                  <li>Flip Disc</li>
                </ul>
              </div>
            </article>

            <article className="project-card reveal-up">
              <div className="project-content">
                <div className="project-top">
                  <h3>mend-your-heart-game</h3>
                  <a href="https://github.com/ryyansafar/mend-your-heart-game" target="_blank" rel="noopener noreferrer" className="project-link">↗</a>
                </div>
                <p>A small Valentine&apos;s Day game to find yourself — built in Lua for maximum indie energy.</p>
                <ul className="project-tech">
                  <li>Lua</li>
                  <li>Game Dev</li>
                </ul>
              </div>
            </article>
          </div>

          <div className="more-projects reveal-up">
            <a href="https://github.com/ryyansafar" target="_blank" rel="noopener noreferrer" className="btn btn-outline">View All Projects on
              GitHub</a>
          </div>
        </div>
      </section>

      <section id="skills" className="section-padding">
        <style>{`
          .skills-marquee { overflow: hidden; display: flex; flex-direction: column; gap: 0.75rem; }
          .skills-track { overflow: hidden; display: flex; }
          .skills-inner {
            display: flex; gap: 0.75rem; flex-shrink: 0;
            animation: marquee-right 28s linear infinite;
          }
          .skills-track--left .skills-inner { animation-name: marquee-left; }
          .skills-track--mid .skills-inner { animation-duration: 22s; }
          @keyframes marquee-right { from { transform: translateX(0); } to { transform: translateX(-50%); } }
          @keyframes marquee-left  { from { transform: translateX(-50%); } to { transform: translateX(0); } }
          .skills-marquee:hover .skills-inner { animation-play-state: paused; }
          .sk {
            display: inline-flex; align-items: center; gap: 0.45rem;
            padding: 0.35rem 0.9rem;
            border: 1px solid rgba(255,221,0,0.15);
            color: rgba(255,255,255,0.55);
            font-family: var(--font-mono);
            font-size: 0.72rem; letter-spacing: 0.1em; text-transform: uppercase;
            white-space: nowrap; flex-shrink: 0;
            transition: color 0.2s, border-color 0.2s;
          }
          .sk:hover { color: #FFDD00; border-color: rgba(255,221,0,0.5); }
          .sk--accent { color: rgba(232,255,94,0.7); border-color: rgba(232,255,94,0.2); }
          .sk-dot { width: 4px; height: 4px; border-radius: 50%; background: currentColor; opacity: 0.6; flex-shrink: 0; }
        `}</style>
        <div className="container">
          <div className="section-header reveal-up">
            <span className="section-tag">04</span>
            <h2>Technical Arsenal</h2>
          </div>

          <div className="skills-marquee reveal-up" style={{ marginTop: '2.5rem' }}>
            {/* Row 1 → Hardware */}
            {(() => {
              const hw = ['ESP32','Arduino','Raspberry Pi','8051 MCU','NodeMCU','FPGA','PCB Design','KiCad','Keil uVision','555 Timer','LDR Sensors','PIR Sensors'];
              const row = hw.map((s, i) => <span key={i} className="sk sk--accent"><span className="sk-dot"/>{s}</span>);
              return <div className="skills-track"><div className="skills-inner">{row}{row}</div></div>;
            })()}
            {/* Row 2 ← Languages */}
            {(() => {
              const lang = ['Python','C / C++','JavaScript','TypeScript','Verilog','MATLAB','ROS 2','Assembly','HTML / CSS'];
              const row = lang.map((s, i) => <span key={i} className="sk"><span className="sk-dot"/>{s}</span>);
              return <div className="skills-track skills-track--left"><div className="skills-inner">{row}{row}</div></div>;
            })()}
            {/* Row 3 → Frameworks & Tools */}
            {(() => {
              const tools = ['Next.js','Three.js','GSAP','TensorFlow','OpenCV','Flask','MySQL','Git','Tailwind CSS','Framer Motion','Shadcn/UI','Lenis'];
              const row = tools.map((s, i) => <span key={i} className="sk sk--accent"><span className="sk-dot"/>{s}</span>);
              return <div className="skills-track skills-track--mid"><div className="skills-inner">{row}{row}</div></div>;
            })()}
          </div>
        </div>
      </section>

      <section id="volunteering" className="section-padding">
        <div className="container">
        <div className="section-header reveal-up">
            <span className="section-tag">05</span>
            <h2>Responsibility</h2>
          </div>

          <div className="timeline">

            <div className="timeline-item reveal-up">
              <div className="timeline-date">Jan 2026 – Present</div>
              <div className="timeline-content">
                <h3>3D Printer In-Charge & Mentor</h3>
                <div className="company">TinkerSpace Kochi</div>
                <p>Manage and maintain Bambu Lab P1S and A1 mini printers for community prototyping. Mentor for Tink-Her-Hack 4.0 and regular sessions on CS fundamentals and hardware introduction.</p>
                <p>Built <a href="https://tinkerspace-3d-printing-queue.vercel.app" target="_blank" rel="noopener noreferrer">tinkerspace-3d-printing-queue.vercel.app</a> to streamline print requests.</p>
              </div>
            </div>

            <div className="timeline-item reveal-up">
              <div className="timeline-date">Aug 2025 – Dec 2025</div>
              <div className="timeline-content">
                <h3>
                  <a href="https://www.millenniumfellows.org/fellow/2025/ktu/ryyan-safar" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none', borderBottom: '1px solid rgba(255,221,0,0.4)' }}>
                    Millennium Fellow, Class of 2025 ↗
                  </a>
                </h3>
                <div className="company">UN Academic Impact & Millennium Campus Network</div>
                <p>Selected from 60,000+ global applicants, representing APJ Abdul Kalam Technological University. Led &quot;Overflow Ends With Us&quot; — semester-long sustainability initiative on smart waste disposal with custom PCB.</p>
                <p>Engaged in leadership webinars to strengthen project management, budgeting, and strategic planning. Earned completion certificate from United Nations Academic Impact and Millennium Campus Network.</p>
              </div>
            </div>

            <div className="timeline-item reveal-up">
              <div className="timeline-date">Jan 2025 – Present</div>
              <div className="timeline-content">
                <h3>Co-Section Student Representative</h3>
                <div className="company">IEEE Kerala Section</div>
                <p>Representing over 20,000 IEEE student members across Kerala. Coordinating statewide LINK initiatives and student engagement programs.</p>
              </div>
            </div>

            <div className="timeline-item reveal-up">
              <div className="timeline-date">Jan 2025 – Present</div>
              <div className="timeline-content">
                <h3>LINK Representative</h3>
                <div className="company">IEEE RSET Student Branch</div>
                <p>Liaison between IEEE LINK and RSET Student Branch for technical event coordination.</p>
              </div>
            </div>

            <div className="timeline-item reveal-up">
              <div className="timeline-date">Apr 2024 – Dec 2024</div>
              <div className="timeline-content">
                <h3>Technical & Professional Development Coordinator</h3>
                <div className="company">IEEE India Council</div>
                <p>Assisted in organizing AISWYLC&apos;24 and R10 Code-a-thon; contributed to technical content and outreach for students across the R10 Region.</p>
              </div>
            </div>

            <div className="timeline-item reveal-up">
              <div className="timeline-date">Mar 2024 – Jan 2025</div>
              <div className="timeline-content">
                <h3>Technical Coordinator</h3>
                <div className="company">IEEE RSET Student Branch</div>
                <p>Provided technical assistance for workshops; automated certificate workflows using Google AutoCrat. Planned redesign of the IEEE Office on Wheels Bus with integrated piezoelectric sensors.</p>
              </div>
            </div>

            <div className="timeline-item reveal-up">
              <div className="timeline-date">2024 – 2025</div>
              <div className="timeline-content">
                <h3>Project Group Coordinator</h3>
                <div className="company">IEEE Kerala Section — Future Directions Committee</div>
                <p>Researched multiple Future Directions initiatives and planned events, conferences, and workshops in Kerala.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="ideathon" className="section-padding">
        <div className="container">
        <div className="section-header reveal-up">
            <span className="section-tag">06</span>
            <h2>Ideathon</h2>
          </div>

          <div className="projects-grid">

            <article className="project-card reveal-up">
              <div className="project-content">
                <div className="project-top">
                  <h3>KRuizex — Kochi Metro Problathon</h3>
                  <span className="wip-badge">1st Prize</span>
                </div>
                <p>Conducted on-ground investigation to identify operational pain points in metro-linked urban workflows. Won First Prize (February 2026) with actionable, evidence-backed intervention proposals.</p>
                <ul className="project-tech">
                  <li>Urban Research</li>
                  <li>Problem Solving</li>
                  <li>Kochi Metro</li>
                </ul>
              </div>
            </article>


            <article className="project-card reveal-up">
              <div className="project-content">
                <div className="project-top">
                  <h3>Wildfire SAIfety</h3>
                  <span className="wip-badge">Finalist</span>
                </div>
                <p>Early detection system combining computer vision and satellite imagery. Features drone confirmation
                  and
                  alert system for nearby networks.</p>
                <ul className="project-tech">
                  <li>Computer Vision</li>
                  <li>Satellite Imagery</li>
                  <li>Drones</li>
                </ul>
              </div>
            </article>

            
            <article className="project-card reveal-up">
              <div className="project-content">
                <div className="project-top">
                  <h3>KSEB Smart Meter</h3>
                  <span className="wip-badge">Top 10</span>
                </div>
                <p>Smart meter alternative using OCR camera modules and Bluetooth to transmit usage data to POS
                  machines.
                  Includes GIS mapping for efficient reading.</p>
                <ul className="project-tech">
                  <li>OCR</li>
                  <li>Bluetooth</li>
                  <li>GIS</li>
                </ul>
              </div>
            </article>

            
            <article className="project-card reveal-up">
              <div className="project-content">
                <div className="project-top">
                  <h3>Down Syndrome App</h3>
                  <span className="wip-badge">SlashKey 3.0</span>
                </div>
                <p>Social inclusion app featuring emotion detection via Amazon Rekognition and GPT-4o for mood-based
                  music
                  and recommendations.</p>
                <ul className="project-tech">
                  <li>AWS Rekognition</li>
                  <li>GPT-4o</li>
                  <li>App Dev</li>
                </ul>
              </div>
            </article>

            
            <article className="project-card reveal-up">
              <div className="project-content">
                <div className="project-top">
                  <h3>Safe Sight</h3>
                  <span className="wip-badge">Safety</span>
                </div>
                <p>Women's safety system using real-time CCTV monitoring for suspicious activity. Features priority
                  alerts
                  and a feedback loop for law enforcement.</p>
                <ul className="project-tech">
                  <li>YOLO</li>
                  <li>Mediapipe</li>
                  <li>OpenCV</li>
                </ul>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="contact" className="section-padding">
        <div className="container">
          <div className="contact-wrapper reveal-up">
            <h2 className="contact-heading" style={{ lineHeight: 1.1, marginBottom: '2.5rem' }}>
              I turn <span style={{ fontFamily: 'Barrio, cursive', color: '#FFDD00', fontSize: '1.15em' }}>CAFFEINE</span> into <span style={{ fontFamily: 'Barrio, cursive', color: '#00F0FF', fontSize: '1.15em' }}>COMMITS</span><br />
              and <span style={{ fontFamily: 'Barrio, cursive', color: '#FF7E33', fontSize: '1.15em' }}>SHORT-CIRCUITS</span> into <span style={{ fontFamily: 'Barrio, cursive', color: '#a78bfa', fontSize: '1.15em' }}>SOLUTIONS</span>.
            </h2>
            <p className="contact-sub" style={{ maxWidth: '600px', margin: '0 auto 3rem' }}>
              Electronics student by day, high-stakes debugger by night. <br />
              Let&apos;s build something worth the all-nighters.
            </p>

            <div className="contact-actions">
              <button id="email-copy-btn" className="magnetic-btn" data-magnetic>
                <span className="btn-text">safarryyan@gmail.com</span>
                <span className="btn-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                </span>
                <span className="copy-feedback">Copied!</span>
              </button>

            {/* Buy Me a Coffee */}
            <a
              href="https://buymeacoffee.com/ryyansafar"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-bmc"
              style={{ padding: "1rem 2rem", borderRadius: "100px", background: "#FFDD00", color: "#000", fontWeight: "600", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.75rem" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
                <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
                <line x1="6" y1="2" x2="6" y2="4" />
                <line x1="10" y1="2" x2="10" y2="4" />
                <line x1="14" y1="2" x2="14" y2="4" />
              </svg>
              <span>Buy me a coffee</span>
            </a>

            </div>
            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'rgba(255,255,255,0.4)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginTop: '1rem',
              marginBottom: '2rem',
              fontWeight: 600
            }}>
              Available for <span style={{ color: '#00F0FF' }}>Freelance</span> & <span style={{ color: '#FFDD00' }}>Collaborations</span>
            </p>

            <div className="footer-socials">
              <a href="https://github.com/ryyansafar" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="GitHub"
                data-magnetic>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405 1.02 0 2.04.135 3 .405 2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.285 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </a>
              <a href="https://linkedin.com/in/ryyansafar" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="LinkedIn"
                data-magnetic>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a href="https://tinkerhub.org/@ryyansafar" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="TinkerHub"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                data-magnetic>
                <img src="/tinkerhublogo.png" alt="TinkerHub" style={{ width: '28px', height: 'auto', filter: 'brightness(0) invert(1)' }}/>
              </a>
            </div>
          </div>

        </div>
      </section>
    </main>
  </div> 

  <footer className="sticky-footer">
    <div className="container">
      <div className="footer-bottom">
        <p className="copyright">© 2026 Ryyan Safar. Made with <span className="heart">♥</span> & Code.</p>
        <p className="konami-hint" style={{"fontSize":"0.75rem","opacity":"0.5","marginTop":"0.5rem"}}>Know the Konami Code? Try
          it here! 🕹️</p>
      </div>
    </div>
  </footer>

  
  <div id="game-modal" className="modal">
    <div className="modal-content game-content">

      {/* ── Title bar ── */}
      <div className="window-titlebar">
        <div className="window-controls">
          <button className="control-dot red close-modal" aria-label="Close Game">
            <svg width="6" height="6" viewBox="0 0 6 6" style={{ opacity: 0, transition: 'opacity 0.1s', pointerEvents: 'none' }}>
              <path d="M1 1l4 4M5 1L1 5" stroke="#7a0000" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          </button>
          <div className="control-dot yellow"></div>
          <div className="control-dot green"></div>
        </div>
        <div className="window-title">SNAKE_OS_v1.0.exe</div>
        {/* ESC hint */}
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
          color: 'rgba(255,255,255,0.2)', letterSpacing: '0.08em',
        }}>ESC</span>
      </div>

      <div className="game-body">
        <div className="scanline-overlay"></div>

        {/* Score + title row */}
        <div className="game-header">
          <h2 style={{ fontFamily: 'Barrio, cursive', fontSize: '2rem', margin: 0, color: 'var(--accent-color)', textShadow: '0 0 20px var(--accent-glow)' }}>SNAKΞ_OS</h2>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.3)', marginBottom: '2px' }}>DATA_SYNC</div>
            <div id="game-score" style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent-color)', lineHeight: 1 }}>0</div>
          </div>
        </div>

        {/* Canvas */}
        <canvas id="game-canvas" width="400" height="400" style={{ borderRadius: '6px', border: '1px solid rgba(255,255,255,0.07)', boxShadow: '0 0 30px rgba(var(--accent-rgb),0.12), inset 0 0 20px rgba(0,0,0,0.6)', display: 'block', margin: '0 auto 1rem', maxWidth: '100%' }}></canvas>

        {/* Footer */}
        <div className="game-footer" style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '0.875rem' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', margin: '0 0 1rem', lineHeight: 1.7 }}>
            &gt; ARROW_KEYS — navigate<br />
            &gt; AVOID_YOURSELF — obviously<br />
            &gt; EAT_NODES — collect energy
          </p>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button id="start-game-btn" className="btn btn-primary" style={{ flex: 1, letterSpacing: '0.15em', fontSize: '0.75rem' }}>▶ BOOT</button>
            <button className="close-modal" style={{
              flex: '0 0 auto', padding: '0.55rem 1rem',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.45)',
              fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
              letterSpacing: '0.1em', cursor: 'pointer',
              borderRadius: '6px', transition: 'background 0.15s, color 0.15s',
            }}>✕ CLOSE</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  

    </>
  );
}
