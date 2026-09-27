import { useLayoutEffect, useRef, useState } from "react";
import { ArrowUpRight, Mail, Send } from "lucide-react";
import { gsap } from "../lib/gsap";
import { site } from "../data/site";
import { GithubIcon, LinkedinIcon } from "./BrandIcons";

const SOCIALS = [
  { icon: GithubIcon, label: "GitHub", handle: site.github.replace("https://", ""), href: site.github },
  { icon: LinkedinIcon, label: "LinkedIn", handle: "in/shafeyy", href: site.linkedin },
  { icon: Mail, label: "Email", handle: site.email, href: `mailto:${site.email}` },
];

export default function Contact() {
  const sectionRef = useRef(null);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".contact-heading",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
        }
      );
      gsap.fromTo(
        ".contact-panel",
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: { trigger: ".contact-grid", start: "top 80%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Portfolio inquiry from ${form.name}`);
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name}\n${form.email}`);
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
    setSent(true);
    window.setTimeout(() => setSent(false), 3000);
  };

  const inputClass =
    "w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-colors duration-300 focus:border-accent/60 focus:bg-white/[0.07]";

  return (
    <section id="contact" ref={sectionRef} className="relative px-6 py-28 md:py-40">
      <div className="mx-auto max-w-6xl">
        <div className="contact-heading">
          <p className="font-mono text-xs uppercase tracking-[0.4em] text-accent">
            03 — Contact
          </p>
          <h2 className="mt-4 font-display text-4xl font-bold leading-tight text-white md:text-6xl">
            Let's build something
            <br />
            <span className="text-gradient">together.</span>
          </h2>
        </div>

        <div className="contact-grid mt-14 grid gap-6 lg:grid-cols-5">
          <form
            onSubmit={onSubmit}
            className="contact-panel glass rounded-2xl p-7 lg:col-span-3"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <input
                name="name"
                value={form.name}
                onChange={onChange}
                required
                placeholder="Your name"
                className={inputClass}
              />
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={onChange}
                required
                placeholder="Your email"
                className={inputClass}
              />
            </div>
            <textarea
              name="message"
              value={form.message}
              onChange={onChange}
              required
              rows={5}
              placeholder="Tell me about your project…"
              className={`${inputClass} mt-5 resize-none`}
            />
            <button
              type="submit"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3 text-sm font-bold text-black transition-all duration-300 hover:scale-[1.03] hover:bg-teal-300 active:scale-95"
            >
              {sent ? "Opening email app…" : "Send Message"}
              <Send size={15} />
            </button>
            <p className="mt-4 text-xs text-white/35">
              This opens your email app with the message pre-filled — no server
              needed.
            </p>
          </form>

          <div className="contact-panel flex flex-col gap-4 lg:col-span-2">
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target={social.href.startsWith("mailto") ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="glass group flex flex-1 items-center gap-4 rounded-2xl p-5 transition-all duration-300 hover:border-accent/40 hover:bg-white/[0.06]"
              >
                <div className="rounded-xl bg-accent/10 p-3 text-accent transition-transform duration-300 group-hover:scale-110">
                  <social.icon size={22} strokeWidth={1.8} />
                </div>
                <div className="min-w-0">
                  <p className="font-display font-semibold text-white">{social.label}</p>
                  <p className="truncate text-sm text-white/45">{social.handle}</p>
                </div>
                <ArrowUpRight
                  size={18}
                  className="ml-auto text-white/30 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
