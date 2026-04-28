export default function GradientText({
  children,
  className = "",
}: Readonly<{
  children: React.ReactNode;
  className?: string;
}>) {
  return (
    <span
      className={`bg-clip-text text-transparent ${className}`}
      style={{
        backgroundImage:
          "linear-gradient(160deg, rgba(212,212,212,1) 10%, rgba(212,212,212,0.5) 80%, rgba(115,115,115,1) 100%)",
      }}
    >
      {children}
    </span>
  );
}
