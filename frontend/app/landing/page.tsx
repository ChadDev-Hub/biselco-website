"use server"
import { getLandingPageData } from "../services/serverapi";
import Hero from "../components/hero";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { section } from "framer-motion/client";
const Landing = async () => {
  const cookie = (await cookies()).get("refresh_token")
  if (cookie) {
    redirect("/")
  }
  const landingPageData = await getLandingPageData()
  return (



    <div class="bg-base-100 text-base-content min-h-screen font-sans">
      <Hero
        subtitle={landingPageData.hero.subtitle}
        description={landingPageData.hero.description} />

      <section class="py-20 bg-base-100">
        <div class="container mx-auto px-4 text-center">
          <div class="stats stats-vertical lg:stats-horizontal shadow-xl bg-base-200 w-full max-w-4xl">

            <div class="stat p-10">
              <div class="stat-figure text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              </div>
              <div class="stat-title font-medium">Trusted by</div>
              <div id="customer-count" class="stat-value text-primary">0</div>
              <div class="stat-desc text-lg mt-1 font-semibold text-secondary">Happy Customers</div>
            </div>

            <div class="stat p-10">
              <div class="stat-figure text-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              </div>
              <div class="stat-title font-medium">Platform Uptime</div>
              <div class="stat-value text-secondary">99.9%</div>
              <div class="stat-desc">Global Availability</div>
            </div>

          </div>
        </div>
      </section>


      <section class="hero min-h-[70vh] bg-base-200 py-20">
        <div class="hero-content flex-col lg:flex-row-reverse gap-12 max-w-6xl">
          <div class="mockup-code bg-primary text-primary-content shadow-2xl lg:w-1/2">
            <pre data-prefix="$"><code>npm install nexus-ai</code></pre>
            <pre data-prefix=">"><code>Installing dependencies...</code></pre>
            <pre data-prefix=">"><code>Ready to scale 🚀</code></pre>
          </div>
          <div class="lg:w-1/2 text-center lg:text-left">
            <h1 class="text-5xl lg:text-6xl font-black leading-tight">
              Build faster with <span class="text-primary italic underline">Intelligence.</span>
            </h1>
            <p class="py-6 text-lg opacity-80">
              The all-in-one platform for modern developers. Scale your applications globally with zero configuration and instant deployments.
            </p>
            <div class="flex flex-wrap gap-3 justify-center lg:justify-start">
              <button class="btn btn-primary btn-lg shadow-lg">Start Building</button>
              <button class="btn btn-outline btn-lg">Watch Demo</button>
            </div>
          </div>
        </div>
      </section>

      <section class="py-24 container mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold mb-4">Everything you need to scale</h2>
          <p class="max-w-xl mx-auto opacity-70">Focus on your code, we handle the rest. From edge computing to global databases.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="card bg-base-200 border border-base-300 hover:border-primary transition-all group">
            <div class="card-body">
              <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 class="card-title">Lightning Fast</h3>
              <p>Optimized for the edge to ensure your users get sub-100ms response times globally.</p>
            </div>
          </div>
          <div class="card bg-base-200 border border-base-300 hover:border-primary transition-all group">
            <div class="card-body">
              <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
              <h3 class="card-title">Bank-Grade Security</h3>
              <p>Automated SSL, DDoS protection, and encrypted storage come standard with every plan.</p>
            </div>
          </div>
          <div class="card bg-base-200 border border-base-300 hover:border-primary transition-all group">
            <div class="card-body">
              <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              </div>
              <h3 class="card-title">Real-time Analytics</h3>
              <p>Gain deep insights into your application performance with our custom dashboard.</p>
            </div>
          </div>
        </div>
      </section>

      <section class="container mx-auto px-4 py-20">
        <div class="bg-primary rounded-3xl p-8 md:p-16 text-primary-content flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 class="text-3xl md:text-4xl font-bold mb-4">Ready to ship your next big idea?</h2>
            <p class="opacity-90 text-lg">Join 10,000+ developers building on NexusAI today.</p>
          </div>
          <button class="btn btn-neutral btn-lg border-none px-12">Get Started Now</button>
        </div>
      </section>

      <footer class="footer p-10 bg-neutral text-neutral-content">
        <nav>
          <h6 class="footer-title">Services</h6>
          <a class="link link-hover">Branding</a>
          <a class="link link-hover">Design</a>
          <a class="link link-hover">Marketing</a>
        </nav>
        <nav>
          <h6 class="footer-title">Company</h6>
          <a class="link link-hover">About us</a>
          <a class="link link-hover">Contact</a>
          <a class="link link-hover">Jobs</a>
        </nav>
        <nav>
          <h6 class="footer-title">Legal</h6>
          <a class="link link-hover">Terms of use</a>
          <a class="link link-hover">Privacy policy</a>
        </nav>
      </footer>
    </div>



  )
}

export default Landing