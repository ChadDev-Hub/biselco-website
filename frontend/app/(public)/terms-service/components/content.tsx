
"use client";
import Link from 'next/link';
import React from 'react'



const Content = () => {
  return (
    <article className="lg:col-span-9 card bg-base-100 shadow-sm border border-base-300 p-6 sm:p-12 rounded-3xl space-y-12">
            
            {/* Introduction */}
            <section id="intro" className="space-y-4 scroll-mt-24 border-b border-base-200 pb-8">
              <p className="text-lg leading-relaxed">
                Welcome to BISELCO Web Portal. These Terms of Service (&quot;Terms&quot;) govern your access to and use of the website, applications, and digital services provided by BISELCO (&quot;Busuanga Island Electric Cooperative&quot;) available at{" "}
                <Link
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link link-primary font-medium"
                >
                  https://biselco79.com/
                </Link>.
              </p>
              <p className="text-base leading-relaxed text-base-content/80">
                By accessing or using our platform, you agree to be bound by these Terms. If you do not agree to all of these Terms, do not access or use our services.
              </p>
            </section>

            {/* 1. Acceptance of Terms */}
            <section id="acceptance" className="space-y-4 scroll-mt-24">
              <h2 className="text-2xl font-bold tracking-tight text-base-content flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-semibold">1</span>
                Acceptance of Terms
              </h2>
              <p className="text-base-content/80 leading-relaxed">
                By creating an account, submitting forms, or otherwise interacting with our platform, you confirm that you have read, understood, and accept these Terms along with our Privacy Policy. If you are using the service on behalf of an organization, you represent that you have the authority to bind that organization to these Terms.
              </p>
            </section>

            {/* 2. Changes to Terms */}
            <section id="changes-terms" className="space-y-4 scroll-mt-24">
              <h2 className="text-2xl font-bold tracking-tight text-base-content flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-semibold">2</span>
                Changes to Terms
              </h2>
              <p className="text-base-content/80 leading-relaxed">
                We reserve the right to modify or replace these Terms at any time at our sole discretion. When we update the Terms, we will change the &quot;Effective Date&quot; at the top of this page. Your continued use of the platform after any such modifications constitutes your acceptance of the new Terms.
              </p>
            </section>

            {/* 3. User Accounts & Registration */}
            <section id="accounts" className="space-y-4 scroll-mt-24">
              <h2 className="text-2xl font-bold tracking-tight text-base-content flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-semibold">3</span>
                User Accounts & Registration
              </h2>
              <p className="text-base-content/80 leading-relaxed">
                To access certain features, you may need to register an account or sign in using third-party authentication services such as <strong>Google</strong> or <strong>Facebook</strong>. You agree to:
              </p>
              <ul className="space-y-2 pl-4 list-disc text-base-content/80">
                <li>Provide accurate, current, and complete account information</li>
                <li>Maintain and promptly update your account details</li>
                <li>Safeguard your login credentials and active session tokens</li>
                <li>Accept full responsibility for all activities that occur under your account</li>
              </ul>
            </section>

            {/* 4. Acceptable Use Policy */}
            <section id="acceptable-use" className="space-y-4 scroll-mt-24">
              <h2 className="text-2xl font-bold tracking-tight text-base-content flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-semibold">4</span>
                Acceptable Use Policy
              </h2>
              <p className="text-base-content/80">You agree not to misuse the BISelco platform or assist any other party in doing so. Prohibited actions include, but are not limited to:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  "Violating any local or international laws",
                  "Submitting fraudulent or false service requests",
                  "Attempting to bypass security or auth mechanisms",
                  "Interfering with system integrity or server loads",
                  "Harvesting user data without express consent",
                  "Uploading malicious code, viruses, or harmful payloads"
                ].map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-base-200/60 border border-base-300/60 text-sm font-medium text-base-content flex items-start gap-2.5">
                    <span className="text-error font-bold">✕</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* 5. Intellectual Property */}
            <section id="intellectual-property" className="space-y-4 scroll-mt-24">
              <h2 className="text-2xl font-bold tracking-tight text-base-content flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-semibold">5</span>
                Intellectual Property
              </h2>
              <p className="text-base-content/80 leading-relaxed">
                All source code, databases, design frameworks, user interfaces, logos, graphics, and textual content on <Link href="/" target="_blank" rel="noopener noreferrer" className="link link-primary font-medium">biselco79.com</Link> are the property of BISelco or its licensors and are protected under applicable copyright, trademark, and intellectual property laws. Unauthorized duplication or distribution is strictly prohibited.
              </p>
            </section>

            {/* 6. User Content & Submissions */}
            <section id="submissions" className="space-y-4 scroll-mt-24">
              <h2 className="text-2xl font-bold tracking-tight text-base-content flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-semibold">6</span>
                User Content & Submissions
              </h2>
              <p className="text-base-content/80 leading-relaxed">
                When you submit forms, complaints, service requests, photographs, documents, or digital signatures through our app, you retain your ownership rights. However, you grant us a worldwide, non-exclusive, royalty-free license to host, store, process, and display such content solely as necessary to provide our services and handle operational workflows.
              </p>
            </section>

            {/* 7. Third-Party Services */}
            <section id="third-party-links" className="space-y-4 scroll-mt-24">
              <h2 className="text-2xl font-bold tracking-tight text-base-content flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-semibold">7</span>
                Third-Party Services
              </h2>
              <p className="text-base-content/80 leading-relaxed">
                Our application integrates third-party tools and authentication providers (such as <strong>Google</strong> and <strong>Facebook</strong>). We do not control and are not responsible for the availability, content, or practices of these third-party platforms.
              </p>
            </section>

            {/* 8. Termination & Suspension */}
            <section id="termination" className="space-y-4 scroll-mt-24">
              <h2 className="text-2xl font-bold tracking-tight text-base-content flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-semibold">8</span>
                Termination & Suspension
              </h2>
              <p className="text-base-content/80 leading-relaxed">
                We may suspend or terminate your account and access to the platform immediately, without prior notice or liability, if you breach these Terms or engage in conduct that we determine to be harmful to our services, infrastructure, or users.
              </p>
            </section>

            {/* 9. Warranties & Disclaimers */}
            <section id="disclaimers" className="space-y-4 scroll-mt-24">
              <h2 className="text-2xl font-bold tracking-tight text-base-content flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-semibold">9</span>
                Warranties & Disclaimers
              </h2>
              <p className="text-base-content/80 leading-relaxed uppercase text-xs font-semibold tracking-wider bg-base-200 p-4 rounded-xl border border-base-300">
                The platform and its contents are provided on an &quot;as is&quot; and &quot;as available&quot; basis without warranties of any kind, whether express or implied, including merchantability, fitness for a particular purpose, or non-infringement.
              </p>
            </section>

            {/* 10. Limitation of Liability */}
            <section id="limitation-liability" className="space-y-4 scroll-mt-24">
              <h2 className="text-2xl font-bold tracking-tight text-base-content flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-semibold">10</span>
                Limitation of Liability
              </h2>
              <p className="text-base-content/80 leading-relaxed">
                To the maximum extent permitted by law, BISelco shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, arising out of or related to your use of our platform.
              </p>
            </section>

            {/* 11. Indemnification */}
            <section id="indemnification" className="space-y-4 scroll-mt-24">
              <h2 className="text-2xl font-bold tracking-tight text-base-content flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-semibold">11</span>
                Indemnification
              </h2>
              <p className="text-base-content/80 leading-relaxed">
                You agree to defend, indemnify, and hold harmless BISelco and its officers, directors, and employees from and against any claims, liabilities, damages, losses, and expenses arising out of your violation of these Terms or your misuse of the application.
              </p>
            </section>

            {/* 12. Governing Law */}
            <section id="governing-law" className="space-y-4 scroll-mt-24">
              <h2 className="text-2xl font-bold tracking-tight text-base-content flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-semibold">12</span>
                Governing Law
              </h2>
              <p className="text-base-content/80 leading-relaxed">
                These Terms shall be governed by and construed in accordance with local regulations and applicable laws, without regard to conflict of law principles.
              </p>
            </section>

            {/* 13. Contact Us */}
            <section id="contact" className="space-y-4 scroll-mt-24">
              <h2 className="text-2xl font-bold tracking-tight text-base-content flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-semibold">13</span>
                Contact Us
              </h2>
              <p className="text-base-content/80">
                If you have any questions regarding these Terms of Service, please reach out through our official channels:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <Link href="/" target="_blank" rel="noopener noreferrer" className="p-4 rounded-2xl bg-base-200/50 hover:bg-base-200 transition border border-base-300 text-center block">
                  <span className="block text-xs font-semibold text-base-content/50 uppercase tracking-wider mb-1">Website</span>
                  <span className="text-sm font-medium text-primary truncate">biselco79.com</span>
                </Link>
                <Link href="/landing" target="_blank" rel="noopener noreferrer" className="p-4 rounded-2xl bg-base-200/50 hover:bg-base-200 transition border border-base-300 text-center block">
                  <span className="block text-xs font-semibold text-base-content/50 uppercase tracking-wider mb-1">Application</span>
                  <span className="text-sm font-medium text-primary truncate">Landing Portal</span>
                </Link>
                <Link href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="p-4 rounded-2xl bg-base-200/50 hover:bg-base-200 transition border border-base-300 text-center block">
                  <span className="block text-xs font-semibold text-base-content/50 uppercase tracking-wider mb-1">Privacy Policy</span>
                  <span className="text-sm font-medium text-primary truncate">View Policy</span>
                </Link>
              </div>
            </section>

            {/* Footer inside card */}
            <footer className="border-t border-base-300 pt-6 text-center sm:text-left text-sm text-base-content/60">
              Last Updated: September 16, 2026
            </footer>

          </article>
  )
}

export default Content