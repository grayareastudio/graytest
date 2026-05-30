export function FooterTest() {
  return (
    <footer className="
        lg:absolute bottom-0 w-full
        border-t border-white/10 py-8 px-6
        flex flex-col items-center gap-6 text-center
        md:py-10 md:px-12 lg:py-13 lg:px-39 lg:flex-row lg:items-center
        lg:justify-between lg:text-left bg-black"
    >
      <div className="flex flex-col md:flex-row md:items-center md:gap-2">
        <span className="text-sm uppercase text-[#D4D4D4]">Graytest</span>
        <p className="text-xs text-[#A1A1A1] mt-1 md:mt-0">
          &nbsp;&copy; {new Date().getFullYear()}
        </p>
      </div>

      <p className="text-sm text-[#99A1AF] max-w-md">
        Informational self-assessment (not medical diagnosis).
      </p>
    </footer>
  );
}
