"use server"
import { getLandingPageData } from "../services/serverapi";
import Hero from "../components/hero";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
const Landing = async () => {
  const cookie = (await cookies()).get("refresh_token")
  if (cookie) {
    redirect("/")
  }
  const landingPageData = await getLandingPageData()
  return (



    <div className="bg-base-100 text-base-content min-h-screen font-sans">
      <Hero
        subtitle={landingPageData.hero.subtitle}
        description={landingPageData.hero.description} />

      <section className="py-20 bg-base-100">
        <div className="container mx-auto px-4 text-center">
          <div className="stats stats-vertical lg:stats-horizontal shadow-xl bg-base-200 w-full max-w-4xl">

            <div className="stat p-10">
              <div className="stat-figure text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              </div>
              <div className="stat-title font-medium">Trusted by</div>
              <div id="customer-count" className="stat-value text-primary">0</div>
              <div className="stat-desc text-lg mt-1 font-semibold text-secondary">Happy Customers</div>
            </div>

            <div className="stat p-10">
              <div className="stat-figure text-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              </div>
              <div className="stat-title font-medium">Platform Uptime</div>
              <div className="stat-value text-secondary">99.9%</div>
              <div className="stat-desc">Global Availability</div>
            </div>

          </div>
        </div>
      </section>


      <section className="hero min-h-[70vh] bg-base-200 py-20">
        <div className="hero-content flex-col lg:flex-row-reverse gap-12 max-w-6xl">
          <div className="mockup-code bg-primary text-primary-content shadow-2xl lg:w-1/2">
            <pre data-prefix="$"><code>npm install nexus-ai</code></pre>
            <pre data-prefix=">"><code>Installing dependencies...</code></pre>
            <pre data-prefix=">"><code>Ready to scale 🚀</code></pre>
          </div>
          <div className="lg:w-1/2 text-center lg:text-left">
            <h1 className="text-5xl lg:text-6xl font-black leading-tight">
              Build faster with <span className="text-primary italic underline">Intelligence.</span>
            </h1>
            <p className="py-6 text-lg opacity-80">
              The all-in-one platform for modern developers. Scale your applications globally with zero configuration and instant deployments.
            </p>
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              <button className="btn btn-primary btn-lg shadow-lg">Start Building</button>
              <button className="btn btn-outline btn-lg">Watch Demo</button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Everything you need to scale</h2>
          <p className="max-w-xl mx-auto opacity-70">Focus on your code, we handle the rest. From edge computing to global databases.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card bg-base-200 border border-base-300 hover:border-primary transition-all group">
            <div className="card-body">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 className="card-title">Lightning Fast</h3>
              <p>Optimized for the edge to ensure your users get sub-100ms response times globally.</p>
            </div>
          </div>
          <div className="card bg-base-200 border border-base-300 hover:border-primary transition-all group">
            <div className="card-body">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
              <h3 className="card-title">Bank-Grade Security</h3>
              <p>Automated SSL, DDoS protection, and encrypted storage come standard with every plan.</p>
            </div>
          </div>
          <div className="card bg-base-200 border border-base-300 hover:border-primary transition-all group">
            <div className="card-body">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              </div>
              <h3 className="card-title">Real-time Analytics</h3>
              <p>Gain deep insights into your application performance with our custom dashboard.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="bg-primary rounded-3xl p-8 md:p-16 text-primary-content flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to ship your next big idea?</h2>
            <p className="opacity-90 text-lg">Join 10,000+ developers building on NexusAI today.</p>
          </div>
          <button className="btn btn-neutral btn-lg border-none px-12">Get Started Now</button>
        </div>
      </section>

      <footer className="footer p-10 bg-neutral text-neutral-content">
        <nav>
          <h6 className="footer-title">Services</h6>
          <a className="link link-hover">Branding</a>
          <a className="link link-hover">Design</a>
          <a className="link link-hover">Marketing</a>
        </nav>
        <nav>
          <h6 className="footer-title">Company</h6>
          <a className="link link-hover">About us</a>
          <a className="link link-hover">Contact</a>
          <a className="link link-hover">Jobs</a>
        </nav>
        <nav>
          <h6 className="footer-title">Legal</h6>
          <a className="link link-hover">Terms of use</a>
          <a className="link link-hover">Privacy policy</a>
        </nav>
      </footer>
    </div>



  )
}

export default Landing