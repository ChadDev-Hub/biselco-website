
"use client";

import Link from "next/link";




const Content = () => {
  return (
    <article className="lg:col-span-9 card bg-base-100 shadow-sm border border-base-300 p-6 sm:p-12 rounded-3xl space-y-12">
            {/* Introduction */}
            <section
              id="intro"
              className="space-y-4 scroll-mt-24 border-b border-base-200 pb-8"
            >
              <p className="text-lg leading-relaxed">
                We at Busuanga Island Electric Cooperative want you to what
                information we collect and how we use it to improve our
                services. This Privacy Policy applies to the website and
                application available at{" "}
                <Link
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link link-primary font-medium"
                >
                  biselco
                </Link>
                .
              </p>
              <p className="text-base leading-relaxed text-base-content/80">
                This Privacy Policy explains how we collect, use, store, and
                protect information when you use our website and application,
                including when you sign in using <strong>Google</strong> or{" "}
                <strong>Facebook</strong>.
              </p>
            </section>

            {/* 1. Information We Collect */}
            <section id="info-collected" className="space-y-4 scroll-mt-24">
              <h2 className="text-2xl font-bold tracking-tight text-base-content flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-semibold">
                  1
                </span>
                Information We Collect
              </h2>
              <p className="text-base-content/80 leading-relaxed">
                When you create an account or sign in using Google or Facebook,
                we may receive information provided by the respective
                authentication provider, including:
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-2">
                {[
                  "Name",
                  "Email address",
                  "Profile picture",
                  "Unique account identifier",
                  "Authorized shared preferences",
                ].map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-2 p-3 rounded-xl bg-base-200/50 text-sm font-medium"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-base-content/80 pt-2">
                We only request information that is necessary to provide and
                maintain your account and the services available through our
                application.
              </p>

              <h3 className="text-xl font-semibold pt-4 text-base-content">
                Information You Provide Directly
              </h3>
              <p className="text-base-content/80">
                You may also provide information directly to us when using the
                application, such as:
              </p>
              <ul className="space-y-2 pl-4 list-disc text-base-content/80">
                <li>Contact and account information</li>
                <li>Information submitted through application forms</li>
                <li>Service requests, complaints, or submissions</li>
                <li>
                  Files, photographs, documents, or voluntarily uploaded content
                </li>
              </ul>
            </section>

            {/* 2. Google Sign-In */}
            <section id="google-signin" className="space-y-4 scroll-mt-24">
              <h2 className="text-2xl font-bold tracking-tight text-base-content flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-semibold">
                  2
                </span>
                Google Sign-In
              </h2>
              <p className="text-base-content/80 leading-relaxed">
                Our application may allow you to sign in using your Google
                account. Google provides us with profile attributes based on
                your authorization settings.
              </p>
              <p className="font-medium text-base-content mt-2">
                We use this information to:
              </p>
              <ul className="space-y-2 pl-4 list-disc text-base-content/80">
                <li>
                  Create or identify your account and authenticate your identity
                </li>
                <li>Maintain your secure session</li>
                <li>
                  Provide application features associated with your account
                </li>
                <li>Communicate with you when necessary</li>
              </ul>
              <p className="text-base-content/80 text-sm bg-base-200 p-4 rounded-xl border border-base-300">
                <strong>Note:</strong> We do not store your Google password.
                Authentication is securely handled through Google. Review{" "}
                <Link
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link link-primary font-medium"
                >
                  Google&apos;s Privacy Policy
                </Link>
                .
              </p>
            </section>

            {/* 3. Facebook Login */}
            <section id="facebook-login" className="space-y-4 scroll-mt-24">
              <h2 className="text-2xl font-bold tracking-tight text-base-content flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-semibold">
                  3
                </span>
                Facebook Login
              </h2>
              <p className="text-base-content/80 leading-relaxed">
                When you choose Facebook Login, Meta provides us with
                information you authorize (such as your name, email address,
                profile picture, and account identifier).
              </p>
              <p className="font-medium text-base-content mt-2">
                We use this information to:
              </p>
              <ul className="space-y-2 pl-4 list-disc text-base-content/80">
                <li>Create or identify your account and authenticate you</li>
                <li>Maintain your session and core profile parameters</li>
                <li>Provide associated application services</li>
              </ul>
              <p className="text-base-content/80 text-sm bg-base-200 p-4 rounded-xl border border-base-300">
                We do not receive or store your Facebook password. Review{" "}
                <Link
                  href="https://www.facebook.com/privacy/policy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link link-primary font-medium"
                >
                  Meta&apos;s Privacy Policy
                </Link>
                .
              </p>
            </section>

            {/* 4. How We Use Your Information */}
            <section id="use-of-info" className="space-y-4 scroll-mt-24">
              <h2 className="text-2xl font-bold tracking-tight text-base-content flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-semibold">
                  4
                </span>
                How We Use Your Information
              </h2>
              <p className="text-base-content/80">
                We use collected details to operate smoothly, efficiently, and
                securely:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  "Create and manage user accounts",
                  "Authenticate and verify users",
                  "Provide and maintain services",
                  "Process requests and submissions",
                  "Respond to inquiries & support",
                  "Improve application security",
                  "Prevent fraud, abuse, or threats",
                  "Comply with legal regulations",
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-base-200/60 border border-base-300/60 text-sm font-medium text-base-content flex items-start gap-2.5"
                  >
                    <span className="text-primary font-bold">✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* 5. Information Sharing */}
            <section id="info-sharing" className="space-y-4 scroll-mt-24">
              <h2 className="text-2xl font-bold tracking-tight text-base-content flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-semibold">
                  5
                </span>
                Information Sharing
              </h2>
              <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 text-primary font-medium">
                We do not sell your personal information to third parties.
              </div>
              <p className="text-base-content/80">
                We may share information strictly when necessary to:
              </p>
              <ul className="space-y-2 pl-4 list-disc text-base-content/80">
                <li>
                  Operate our services and deploy technical infrastructure
                </li>
                <li>
                  Utilize vetted cloud hosting, storage, and communications
                  providers
                </li>
                <li>
                  Comply with applicable laws, regulations, or lawful court
                  processes
                </li>
                <li>
                  Protect security, user safety, and prevent unauthorized
                  fraud/abuse
                </li>
              </ul>
            </section>

            {/* 6. Data Storage and Security */}
            <section id="storage-security" className="space-y-4 scroll-mt-24">
              <h2 className="text-2xl font-bold tracking-tight text-base-content flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-semibold">
                  6
                </span>
                Data Storage and Security
              </h2>
              <p className="text-base-content/80 leading-relaxed">
                We take reasonable administrative, technical, and organizational
                measures to safeguard your personal data against unauthorized
                access, alteration, disclosure, or loss. Information is securely
                stored across our protected servers and certified infrastructure
                providers. However, no electronic transmission over the internet
                is completely foolproof.
              </p>
            </section>

            {/* 7. Cookies and Authentication Technologies */}
            <section id="cookies" className="space-y-4 scroll-mt-24">
              <h2 className="text-2xl font-bold tracking-tight text-base-content flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-semibold">
                  7
                </span>
                Cookies and Authentication Technologies
              </h2>
              <p className="text-base-content/80">
                Our app uses secure cookies and sessions to:
              </p>
              <ul className="space-y-2 pl-4 list-disc text-base-content/80">
                <li>
                  Keep you signed in and preserve active authorization tokens
                </li>
                <li>Protect application endpoints and user resources</li>
                <li>
                  Remember interface preferences and improve overall experience
                </li>
              </ul>
            </section>

            {/* 8. Data Retention */}
            <section id="retention" className="space-y-4 scroll-mt-24">
              <h2 className="text-2xl font-bold tracking-tight text-base-content flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-semibold">
                  8
                </span>
                Data Retention
              </h2>
              <p className="text-base-content/80 leading-relaxed">
                We retain personal information for as long as needed to deliver
                our services, fulfill legitimate operational interests, and meet
                compliance rules. When data is no longer necessary, we securely
                delete or anonymize it.
              </p>
            </section>

            {/* 9. Your Rights */}
            <section id="your-rights" className="space-y-4 scroll-mt-24">
              <h2 className="text-2xl font-bold tracking-tight text-base-content flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-semibold">
                  9
                </span>
                Your Rights
              </h2>
              <p className="text-base-content/80">
                Depending on local legislation, you may hold rights to:
              </p>
              <ul className="space-y-2 pl-4 list-disc text-base-content/80">
                <li>Access or request a copy of your personal data</li>
                <li>Request correction of inaccurate attributes</li>
                <li>
                  Request deletion or restriction of certain data processing
                </li>
                <li>Withdraw consent at any time</li>
              </ul>
            </section>

            {/* 10. Account and Data Deletion */}
            <section id="account-deletion" className="space-y-4 scroll-mt-24">
              <h2 className="text-2xl font-bold tracking-tight text-base-content flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-semibold">
                  10
                </span>
                Account and Data Deletion
              </h2>
              <p className="text-base-content/80 leading-relaxed">
                You can request deletion of your account and personal history at
                any time. Note that disconnecting your account from Google or
                Facebook does not automatically delete your records inside our
                app database—you must reach out directly to clear application
                records.
              </p>
            </section>

            {/* 11. Third-Party Services */}
            <section id="third-party" className="space-y-4 scroll-mt-24">
              <h2 className="text-2xl font-bold tracking-tight text-base-content flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-semibold">
                  11
                </span>
                Third-Party Services
              </h2>
              <p className="text-base-content/80">
                We leverage reliable third-party layers specifically for
                operational continuity, hosting, and auth frameworks (such as{" "}
                <strong>Google</strong> and <strong>Facebook/Meta</strong>).
                Each provider manages data under their respective independent
                privacy terms.
              </p>
            </section>

            {/* 12. Children's Privacy */}
            <section id="children" className="space-y-4 scroll-mt-24">
              <h2 className="text-2xl font-bold tracking-tight text-base-content flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-semibold">
                  12
                </span>
                Children&apos;s Privacy
              </h2>
              <p className="text-base-content/80 leading-relaxed">
                Our platform is not intentionally targeted toward children under
                applicable prohibited age ranges. If you suspect an underage
                user has provided personal details without proper consent,
                contact us immediately for removal.
              </p>
            </section>

            {/* 13. Changes to This Privacy Policy */}
            <section id="changes" className="space-y-4 scroll-mt-24">
              <h2 className="text-2xl font-bold tracking-tight text-base-content flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-semibold">
                  13
                </span>
                Changes to This Privacy Policy
              </h2>
              <p className="text-base-content/80 leading-relaxed">
                We may revise this policy periodically to reflect architectural
                updates or legal shifts. When changes occur, the Effective Date
                at the top will be updated accordingly.
              </p>
            </section>

            {/* 14. Contact Us */}
            <section id="contact" className="space-y-4 scroll-mt-24">
              <h2 className="text-2xl font-bold tracking-tight text-base-content flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-semibold">
                  14
                </span>
                Contact Us
              </h2>
              <p className="text-base-content/80">
                If you have questions regarding this policy or want to submit an
                access/deletion inquiry, connect with us through our official
                channels:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <Link
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-2xl bg-base-200/50 hover:bg-base-200 transition border border-base-300 text-center block"
                >
                  <span className="block text-xs font-semibold text-base-content/50 uppercase tracking-wider mb-1">
                    Website
                  </span>
                  <span className="text-sm font-medium text-primary truncate">
                    biselco79.com
                  </span>
                </Link>
                <Link
                  href="/landing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-2xl bg-base-200/50 hover:bg-base-200 transition border border-base-300 text-center block"
                >
                  <span className="block text-xs font-semibold text-base-content/50 uppercase tracking-wider mb-1">
                    Application
                  </span>
                  <span className="text-sm font-medium text-primary truncate">
                    Landing Portal
                  </span>
                </Link>
                <Link
                  href="/terms-service"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-2xl bg-base-200/50 hover:bg-base-200 transition border border-base-300 text-center block"
                >
                  <span className="block text-xs font-semibold text-base-content/50 uppercase tracking-wider mb-1">
                    Terms of Service
                  </span>
                  <span className="text-sm font-medium text-primary truncate">
                    Terms of Service
                  </span>
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