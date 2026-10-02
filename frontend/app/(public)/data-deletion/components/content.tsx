import React from "react";

const Content = () => {
  const titleClassName =
    "text-2xl font-bold tracking-tight text-base-content flex items-center gap-3";
  const titleNumaberClassName =
    "flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-semibold";
  const descriptionClassName = "text-base-content/80 text-base leading-relaxed";
  return (
    <article className="lg:col-span-9 card bg-base-100 shadow-sm border border-base-300 p-6 sm:p-12 rounded-3xl space-y-12">
      {/* Introduction */}
      <section
        id="intro"
        className="space-y-4 scroll-mt-24 border-b border-base-200 pb-8"
      >
        <p className={descriptionClassName}>
          At Busuanga Island Electric Cooperative Inc. (BISELCO), we respect
          your privacy and provide you with the ability to request deletion of
          your personal data associated with our application.
        </p>
        <br />
        <p className={descriptionClassName}>
          This page explains what information may be deleted, how you can
          request deletion, and what happens after we receive your request.
        </p>
      </section>

      <section id="information-covered" className="space-y-4 scroll-mt-24">
        <h2 className={titleClassName}>
          <span className={titleNumaberClassName}>1</span>
          Information Covered by a Deletion Request
        </h2>
        <p className={descriptionClassName}>
          Depending on how you use the BISELCO application, the information
          associated with your account may include:
        </p>
        <ul className="list-disc list-inside ">
          <li>Name</li>
          <li>Profile information provided through Google or Facebook Login</li>
          <li>User role and account-related information</li>
          <li>Information you voluntarily submit through the application</li>
          <li>
            Records associated with requests, complaints, or other services
            submitted through your account
          </li>
          <li>
            Profile photographs or other information provided through supported
            authentication providers
          </li>
        </ul>
        <p className={descriptionClassName}>
          When you request account deletion, BISELCO will process the request
          for deletion of personal information that is no longer necessary for
          the purposes for which it was collected, subject to applicable legal
          and regulatory requirements.
        </p>
      </section>
      {/* FACEBOOK AND GOOGLE INFORMATION */}
      <section
        id="google-facebook-signin"
        className="space-y-4 scroll-mt-24 border-b border-base-200 pb-8"
      >
        <h2 className={titleClassName}>
          <span className={titleNumaberClassName}>2</span>
          Facebook and Google Login Information
        </h2>
        <p className={descriptionClassName}>
          If you created or accessed your BISELCO account using Facebook Login
          or Google Sign-In, BISELCO may receive certain information from the
          authentication provider that you authorized, such as your name, email
          address, profile information, and provider-specific account
          identifier.
        </p>

        <p className={descriptionClassName}>
          Deleting your BISELCO account will remove the associated information
          maintained by BISELCO, subject to applicable retention requirements.
        </p>
        <p className={descriptionClassName}>
          <span className="font-bold">Important:</span> Deleting your BISELCO
          account does not automatically delete your Facebook or Google account.
          If you also want to remove permissions granted to BISELCO from your
          Facebook or Google account, you should manage those permissions
          through the respective provider.
        </p>
      </section>

      <section id="request-deletion" className="space-y-4 scroll-mt-24">
        <h2 className={titleClassName}>
          <span className={titleNumaberClassName}>3</span>
          HOW TO REQUEST DELETION
        </h2>
        <p>
          You may request deletion of your personal data by contacting BISELCO
          through the contact information provided on this website.
        </p>

        <p>
          When submitting a request, please provide enough information for us to
          identify your account, such as:
        </p>

        <ul className="list-disc list-inside">
          <li>Name</li>
          <li>Email address</li>
          <li>The login method you used, such as Facebook or Google</li>
          <li>
            A clear statement that you are requesting deletion of your account
            and associated personal data
          </li>
        </ul>
        <p>
          For security purposes, we may need to verify that the request was
          submitted by the account owner before processing the deletion request.
        </p>
      </section>

      <section id="deletion-process" className="space-y-4 scroll-mt-24">
        <h2 className={titleClassName}>
          <span className={titleNumaberClassName}>4</span>
          What Happens After you Submit a Deletion Request
        </h2>
        <p>After we received your requests, BISELCO will:</p>
        <ul className="list-decimal list-inside">
          <li>Verify the request and account ownership when necessary.</li>
          <li>Review the information associated with the account.</li>
          <li>
            Delete or anonymize personal information that is eligible for
            deletion.
          </li>
          <li>
            Retain only information that we are legally required or otherwise
            permitted to retain.
          </li>
          <li>
            Confirm the completion of the deletion request when processing is
            finished.
          </li>
        </ul>
        <p className={descriptionClassName}>
          Deletion may result in the loss of access to your BISELCO account and
          services associated with that account.
        </p>
      </section>

      <section id="retention" className="space-y-4 scroll-mt-24">
        <h2 className={titleClassName}>
          <span className={titleNumaberClassName}>5</span>
          Information That May Be Retained
        </h2>
        <p className={descriptionClassName}>
          Some information may need to be retained for a limited period when
          required or permitted by law, regulation, legitimate legal
          obligations, security requirements, accounting requirements, or other
          applicable requirements.
        </p>

        <p className={descriptionClassName}>
          For example, certain transaction, service, complaint, or regulatory
          records may need to be retained to comply with applicable obligations.
        </p>

        <p className={descriptionClassName}>
          Where retention is required, the retained information will be handled
          in accordance with applicable privacy and security requirements and
          will not be retained longer than necessary for the applicable purpose.
        </p>
      </section>

      <section id="data-security" className="space-y-4 scroll-mt-24">
        <h2 className={titleClassName}>
          <span className={titleNumaberClassName}>6</span>
          Data Security
        </h2>
        <p className={descriptionClassName}>
          BISELCO takes reasonable measures to protect personal information
          against unauthorized access, alteration, disclosure, or destruction.
        </p>

        <p className={descriptionClassName}>
          However, no electronic system or method of transmitting information
          over the internet can be guaranteed to be completely secure.
        </p>
      </section>

      <section
        id="third-party-authentication"
        className="space-y-4 scroll-mt-24"
      >
        <h2 className={titleClassName}>
          <span className={titleNumaberClassName}>7</span>
          Third-Party Authentication Providers
        </h2>
        <p className={descriptionClassName}>
          Our application may use third-party authentication services, including
          Facebook and Google, to provide account authentication.
        </p>

        <p className={descriptionClassName}>
          These providers have their own privacy policies and account-management
          procedures. Your use of their authentication services is also subject
          to their respective policies and terms.
        </p>

        <p className={descriptionClassName}>
          {
            "If you wish to revoke BISELCO's access to your account information through a third-party provider, you should also manage the authorized applications and connections in your Facebook or Google account settings."
          }
        </p>
      </section>

      <section id="uninstall" className="space-y-4 scroll-mt-24">
        <h2 className={titleClassName}>
          <span className={titleNumaberClassName}>8</span>
          Deleting the Application Does Not Necessarily Delete Your Account
        </h2>
        <p className={descriptionClassName}>
          Uninstalling or removing the BISELCO application from your device does
          not necessarily delete your BISELCO account or the personal
          information associated with it.
        </p>

        <p className={descriptionClassName}>
          You must submit a data or account deletion request using the process
          described on this page.
        </p>
      </section>

      <section id="contact" className="space-y-4 scroll-mt-24">
        <h2 className={titleClassName}>
          <span className={titleNumaberClassName}>9</span>
          Contact Us
        </h2>
        <p className={descriptionClassName}>
          If you have questions about this Data Deletion Notice, your personal
          information, or your account deletion request, please contact BISELCO
          through the contact information provided on our official website.
        </p>

        <p className={descriptionClassName}>
          {`When contacting us about an account deletion request, please include
          "Data Deletion Request" in the subject or message so that we can
          properly identify your request.`}
        </p>
      </section>

      <section id="notice-change" className="space-y-4 scroll-mt-24">
        <h2 className={titleClassName}>
          <span className={titleNumaberClassName}>10</span>
          Changes to This Notice
        </h2>
        <p className={descriptionClassName}>
          BISELCO may update this Data Deletion Notice from time to time to
          reflect changes in our application, services, privacy practices, or
          applicable requirements.
        </p>

        <p className={descriptionClassName}>
          Any changes will be posted on this page with an updated effective
          date.
        </p>
      </section>
    </article>
  );
};

export default Content;
