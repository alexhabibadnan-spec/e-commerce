const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-10 text-center">
        <h2 className="text-xl font-semibold">Ocean Gear</h2>

        <p className="mt-2 text-gray-400">
          Bring Comport
        </p>

        <p className="mt-5 text-sm text-gray-500">
          © {new Date().getFullYear()} Ocean Gear. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;