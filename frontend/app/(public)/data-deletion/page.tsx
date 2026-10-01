import Header from "./components/header";
import DeletiopModal from "./components/deletion-modal";
const DataDeletion = () => {
  return (
    <div className="flex flex-col justify-center bg-base-300 w-full max-w-2xl mx-auto mt-12 rounded-box shadow-2xl border border-base-200 overflow-hidden">
      <Header />

      <article className="p-6 md:p-8 space-y-4">
        <section className="space-y-2">
          <h1 className="text-2xl font-bold text-base-content">
            Data Privacy & Account Deletion Notice
          </h1>
          <p className="text-base text-base-content/80 leading-relaxed">
            We at{" "}
            <strong className="font-semibold text-base-content">
              Busuanga Island Electric Cooperative Inc. (BISELCO)
            </strong>{" "}
            respect your privacy and provide you with the ability to request
            deletion of your personal data associated with our application.
          </p>

          <DeletiopModal />
        </section>
      </article>

    </div>
  );
};

export default DataDeletion;
