function Modal({ children, title = "Modal", open = false }) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 p-4">
      <div className="surface-card w-full max-w-xl p-6">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">{title}</h2>
        {children}
      </div>
    </div>
  );
}

export default Modal;
