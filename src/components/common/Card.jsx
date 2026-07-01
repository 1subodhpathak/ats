function Card({ children, className = "", ...props }) {
  return (
    <section className={`surface-card p-4 ${className}`} {...props}>
      {children}
    </section>
  );
}

export default Card;
