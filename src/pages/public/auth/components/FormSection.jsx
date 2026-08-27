const FormSection = ({ icon: Icon, iconClassName = "", title, children }) => {
  return (
    <section className="rounded-xl border color-border p-4">
      <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-tertiary">
        {Icon && <Icon size={16} className={iconClassName} />}
        {title}
      </h2>
      {children}
    </section>
  );
};

export default FormSection;
