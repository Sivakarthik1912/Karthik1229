import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaDownload,
  FaJava,
  FaReact,
  FaDatabase,
  FaServer,
  FaCode,
  FaArrowUp,
} from "react-icons/fa";

function useActiveSection(sectionIds) {
  const [active, setActive] = useState(sectionIds[0] || "home");

  useEffect(() => {
    const observers = [];
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) setActive(id);
          });
        },
        { root: null, threshold: 0.35 }
      );

      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [sectionIds]);

  return active;
}

function smoothScrollTo(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function Typing({ phrases = [], speed = 55, pause = 1200 }) {
  const [text, setText] = useState("");
  const [pIndex, setPIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!phrases.length) return;

    const current = phrases[pIndex % phrases.length];
    let timer;

    if (!deleting) {
      timer = setTimeout(() => {
        setText(current.slice(0, text.length + 1));
        if (text.length + 1 === current.length) {
          setTimeout(() => setDeleting(true), pause);
        }
      }, speed);
    } else {
      timer = setTimeout(() => {
        setText(current.slice(0, Math.max(0, text.length - 1)));
        if (text.length - 1 <= 0) {
          setDeleting(false);
          setPIndex((v) => v + 1);
        }
      }, Math.max(25, speed - 15));
    }

    return () => clearTimeout(timer);
  }, [text, deleting, pIndex, phrases, speed, pause]);

  return (
    <span className="typing">
      {text}
      <span className="caret" />
    </span>
  );
}

function Badge({ children }) {
  return <span className="badge">{children}</span>;
}

function SectionTitle({ eyebrow, title, desc }) {
  return (
    <div className="sectionTitle">
      <div className="eyebrow">{eyebrow}</div>
      <h2>{title}</h2>
      {desc ? <p>{desc}</p> : null}
    </div>
  );
}

function Card({ children, className = "" }) {
  return <div className={`card ${className}`}>{children}</div>;
}

function ProjectCard({ p }) {
  return (
    <motion.a
      href={p.link || "#"}
      target={p.link ? "_blank" : undefined}
      rel={p.link ? "noreferrer" : undefined}
      className="projectCard"
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="projectTop">
        <div className="projectIcon">{p.icon}</div>
        <div className="projectMeta">
          <h3>{p.title}</h3>
          <p className="muted">{p.subtitle}</p>
        </div>
      </div>

      <p className="projectDesc">{p.description}</p>

      <div className="tagRow">
        {p.tags.map((t) => (
          <span key={t} className="tag">
            {t}
          </span>
        ))}
      </div>

      <div className="projectFooter">
        <span className="linkHint">{p.linkText || "View details"}</span>
        <span className="arrow">→</span>
      </div>
    </motion.a>
  );
}

export default function App() {
  const sectionIds = useMemo(
    () => ["home", "about", "skills", "projects", "experience", "contact"],
    []
  );
  const active = useActiveSection(sectionIds);

  const [showTop, setShowTop] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitStatus(null);

    try {
      const response = await fetch("/.netlify/functions/sendEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({ type: "success", message: "Message sent successfully! I'll reply soon." });
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setSubmitStatus({ type: "error", message: data.error || "Failed to send message. Please try again." });
      }
    } catch (error) {
      console.error("Error sending email:", error);
      setSubmitStatus({ type: "error", message: "Error sending message. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  // ✅ EDIT YOUR DETAILS HERE
  const profile = {
    name: "Karthikeyan V",
    role: "Java Software Developer",
    location: "India",
    email: "omsiva.karthik.2002@gmail.com",
    github: "https://github.com/Sivakarthik1912",
    linkedin: "https://www.linkedin.com/in/karthikeyan-v-62324b208",
    summary:
      "Java developer focused on building clean, scalable web applications with Spring Boot, REST APIs, and modern front-end integration.",
  };

  const skills = [
    { name: "Java", level: 92, icon: <FaJava /> },
    { name: "Spring Boot / REST APIs", level: 80, icon: <FaServer /> },
    { name: "SQL / MySQL", level: 82, icon: <FaDatabase /> },
    { name: "React", level: 75, icon: <FaReact /> },
    { name: "Python", level: 78, icon: <FaCode /> },
    { name: "AI", level: 70, icon: <FaCode /> },
  ];
 // Projects data
  const projects = [
    {
      title: "Finance Tracking System",
      subtitle: "React + MySQL + JavaScript",
      description:
        "Built a complete finance tracking system with real-time updates, user authentication, and responsive UI .",
      tags: ["Spring Boot", "JWT", "MySQL", "React", "REST API"],
      icon: <FaServer />,
      linkText: "Case study",
      link: "",
    },
    {
      title: "Cab Booking Service",
      subtitle: "React + MySQL + JavaScript",
      description:
        "Built a complete cab booking service with user registration, driver management, and real-time tracking.",
      tags: ["HTML", "CSS", "MySQL", "React", "REST API"],
      icon: <FaServer />,
      linkText: "Case study",
      link: "",
    },
    {
      title: "AI ChatBot Integration",
      subtitle: "Python + OpenAI + PDF generation",
      description:
        "Integrated AI chatbot capabilities with OpenAI's API and automated PDF generation for user interactions.",
      tags: ["Python", "OpenAI", "PDF", "Email", "Automation"],
      icon: <FaCode />,
      linkText: "View features",
      link: "",
    },
    {
      title: "AI ChatBot Assistant For A Company Website",
      subtitle: "REST APIs + Admin Panel",
      description:
        "Developed an AI chatbot assistant for a company website, integrating REST APIs and an admin panel for managing user interactions.",
      tags: ["Python", "OpenAI", "Admin Panel", "PDF", "RAG"],
      icon: <FaDatabase />,
      linkText: "See workflow",
      link: "",
    },
  ];
 // Experience / Timeline data
  const timeline = [
    {
      title: "Sri Manakula Vinayagar Engineering College",
      org: "Bachelor of Instrumentation And Control Engineering",
      time: "2021 — 2024",
      points: [
        "Digital Twin & Mixed Reality for Boiler Process Control",
        "Designed a digital twin and mixed reality application to improve real-time visibility, predictive maintenance,",
        "Decision-making for a boiler process control system.",
      ],
    },
    {
      title: "Motilal Nehru Government Polytechnic College",
      org: "Diploma in Instrumaentation and Control Engineering",
      time: "2018 — 2021",
      points: [
        "Quadcopter Using ATMEGA 328 Micro Controller ",
        "Developed a quadcopter prototype utilizing the ATMEGA 328 microcontroller, integrating sensors and control systems to enable autonomous flight and navigation capabilities.",
      ],
    },
  ];

  return (
    <div className="app">
      <BackgroundFX />

      {/* NAV */}
      <header className="header">
        <div className="container nav">
          <div className="brand" onClick={() => smoothScrollTo("home")} role="button" tabIndex={0}>
            <span className="brandDot" />
            <span className="brandText">{profile.name}</span>
          </div>

          <nav className="navLinks">
            {sectionIds.map((id) => (
              <button
                key={id}
                className={`navBtn ${active === id ? "active" : ""}`}
                onClick={() => smoothScrollTo(id)}
              >
                {id.charAt(0).toUpperCase() + id.slice(1)}
              </button>
            ))}
          </nav>

          <div className="navCtas">
            <a className="iconBtn" href={profile.github} target="_blank" rel="noreferrer">
              <FaGithub />
            </a>
            <a className="iconBtn" href={profile.linkedin} target="_blank" rel="noreferrer">
              <FaLinkedin />
            </a>
            <a className="primaryBtn" href={`mailto:${profile.email}`}>
              <FaEnvelope /> Contact
            </a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section id="home" className="section hero">
        <div className="container heroGrid">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="heroLeft"
          >
            <div className="pill">
              <span className="ping" />
              Available for Java + React roles
            </div>
            
            <h1>
              Building scalable apps with <span className="grad">Java</span> &{" "}
              <span className="grad2">React</span>
            </h1>

            <p className="heroSub">
              <Typing
                phrases={[
                  "Backend development with clean architecture.",
                  "REST APIs, JWT security, and database design.",
                  "Real-time projects with React integration.",
                ]}
              />
            </p>

            <div className="heroBadges">
              <Badge>Java</Badge>
              <Badge>Python</Badge>
              <Badge>REST APIs</Badge>
              <Badge>MySQL</Badge>
              <Badge>React</Badge>
            </div>

            <div className="heroActions">
              <button className="primaryBtn big" onClick={() => smoothScrollTo("projects")}>
                View Projects
              </button>
              <button className="ghostBtn big" onClick={() => smoothScrollTo("contact")}>
                Hire Me
              </button>
              <a className="ghostBtn big" href="/Resume/KarthikResume.pdf" download="KarthikResume.pdf">
                <FaDownload /> Download Resume
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.08 }}
            className="heroRight"
          >
            {/* Profile Card */}
            <div className="profileCard">
              <div className="avatarWrap">
                {/* Replace with your image in /public/profile.jpg */}
                <img className="avatar" src="/Profile/Profile.jpg" alt="Profile" />
              </div>

              <div className="profileInfo">
                <h3>{profile.name}</h3>
                <p className="muted">{profile.role}</p>
                <div className="miniRow">
                  <span className="dot" />
                  <span className="muted">{profile.location}</span>
                </div>
              </div>

              <div className="statsGrid">
                <div className="stat">
                  <div className="statNum">3+</div>
                  <div className="statLabel">Projects</div>
                </div>
                <div className="stat">
                  <div className="statNum">10+</div>
                  <div className="statLabel">Modules</div>
                </div>
                <div className="stat">
                  <div className="statNum">100%</div>
                  <div className="statLabel">Learning</div>
                </div>
              </div>

              <div className="profileCardGlow" />
            </div>

            {/* Floating cards */}
            <motion.div
              className="floatCard fc1"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3.2, repeat: Infinity }}
            >
              <div className="floatTitle">Focus</div>
              <div className="floatText">Performance • Security • Clean Code</div>
            </motion.div>

            <motion.div
              className="floatCard fc2"
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 3.6, repeat: Infinity, delay: 0.25 }}
            >
              <div className="floatTitle">Stack</div>
              <div className="floatText">Spring Boot • MySQL • React</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="section">
        <div className="container">
          <SectionTitle
            eyebrow="About"
            title="Developer who ships real projects"
            desc="I build production-style applications with backend-first thinking: strong APIs, secure auth, and structured data."
          />

          <div className="grid2">
            <Card>
              <h3>What I do</h3>
              <ul className="list">
                <li>Design REST APIs with Spring Boot</li>
                <li>JWT authentication + role-based access</li>
                <li>Database schema design + optimized queries</li>
                <li>Integrate React front-end with backend services</li>
              </ul>
            </Card>

            <Card>
              <h3>Highlights</h3>
              <div className="highlights">
                <div className="highlight">
                  <div className="kpi">Clean Architecture</div>
                  <div className="muted">Maintainable structure for scaling.</div>
                </div>
                <div className="highlight">
                  <div className="kpi">Security First</div>
                  <div className="muted">JWT, validation, and best practices.</div>
                </div>
                <div className="highlight">
                  <div className="kpi">Real-Time Thinking</div>
                  <div className="muted">Logs, dashboards, automation ideas.</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" className="section">
        <div className="container">
          <SectionTitle
            eyebrow="Skills"
            title="Technical strengths"
            desc="A practical stack for building real applications end-to-end."
          />

          <div className="skillsGrid">
            {skills.map((s) => (
              <motion.div
                key={s.name}
                className="skillCard"
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5 }}
              >
                <div className="skillTop">
                  <div className="skillIcon">{s.icon}</div>
                  <div className="skillName">{s.name}</div>
                  <div className="skillLevel">{s.level}%</div>
                </div>
                <div className="bar">
                  <motion.div
                    className="barFill"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${s.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="section">
        <div className="container">
          <SectionTitle
            eyebrow="Projects"
            title="Real-time style projects"
            desc="These are production-inspired projects that highlight architecture and feature completeness."
          />

          <div className="projectsGrid">
            {projects.map((p) => (
              <ProjectCard key={p.title} p={p} />
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className="section">
        <div className="container">
          <SectionTitle
            eyebrow="Education"
            title="My academic journey"
            desc="A closer look at my educational background and key projects."
          />

          <div className="timeline">
            {timeline.map((t) => (
              <motion.div
                key={t.title}
                className="timelineItem"
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.55 }}
              >
                <div className="timelineLeft">
                  <h3>{t.title}</h3>
                  <div className="muted">{t.org}</div>
                  <div className="time">{t.time}</div>
                </div>
                <div className="timelineRight">
                  <ul className="list">
                    {t.points.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="section">
        <div className="container">
          <SectionTitle
            eyebrow="Contact"
            title="Let’s build something"
            desc="Send a message — I’ll reply as soon as possible."
          />

          <div className="grid2">
            <Card className="contactCard">
              <h3>Message me</h3>
              <form onSubmit={handleFormSubmit} className="form">
                {submitStatus && (
                  <div className={`alert alert-${submitStatus.type}`} style={{ 
                    padding: "12px", 
                    borderRadius: "6px", 
                    marginBottom: "16px",
                    backgroundColor: submitStatus.type === "success" ? "#10b981" : "#ef4444",
                    color: "white",
                    fontSize: "14px"
                  }}>
                    {submitStatus.message}
                  </div>
                )}
                <div className="row2">
                  <input 
                    className="input" 
                    placeholder="Your name" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required 
                  />
                  <input 
                    className="input" 
                    placeholder="Your email" 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required 
                  />
                </div>
                <input 
                  className="input" 
                  placeholder="Subject" 
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required 
                />
                <textarea 
                  className="input" 
                  placeholder="Message" 
                  rows={5} 
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required 
                />
                <button className="primaryBtn big" type="submit" disabled={loading}>
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            </Card>

            <Card className="contactCard">
              <h3>Details</h3>
              <p className="muted">{profile.summary}</p>

              <div className="contactLinks">
                <a className="contactLink" href={profile.github} target="_blank" rel="noreferrer">
                  <FaGithub /> GitHub
                </a>
                <a className="contactLink" href={profile.linkedin} target="_blank" rel="noreferrer">
                  <FaLinkedin /> LinkedIn
                </a>
                <a className="contactLink" href={`mailto:${profile.email}`}>
                  <FaEnvelope /> {profile.email}
                </a>
              </div>

              {/* <div className="note">
              </div> */}
            </Card>
          </div>

          <footer className="footer">
            <div className="muted">
              © {new Date().getFullYear()} {profile.name}. Built with React + Framer Motion.
            </div>
          </footer>
        </div>
      </section>

      {/* Back to top */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            className="toTop"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            onClick={() => smoothScrollTo("home")}
            aria-label="Back to top"
          >
            <FaArrowUp />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

function BackgroundFX() {
  return (
    <div className="bgFx" aria-hidden="true">
      <div className="blob b1" />
      <div className="blob b2" />
      <div className="gridOverlay" />
    </div>
  );
}
