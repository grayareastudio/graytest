export function Footer() {
  return (
    <footer className="border-t border-white/10 py-13 px-39 flex items-center justify-between bg-black ">
      <div className="flex">
        <span className="text-sm uppercase text-[#D4D4D4]">Graytest</span>
        <p className="text-xs text-[#A1A1A1]">
          &nbsp;&copy; {new Date().getFullYear()}
        </p>
      </div>

      <p className="text-sm text-[#99A1AF]">
        Informational self-assessment (not medical diagnosis).
      </p>
    </footer>
  );
}
