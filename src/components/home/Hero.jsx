const Hero = () => {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-blue-400">
      <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center ">

        {/* Text */}
        <div className="text-white">

          <p className="uppercase tracking-widest text-sm">
            Bring the Ocean Home
          </p>

          <h2  className="text-2xl md:text-6xl font-bold mt-4">
            Discover marine life essentials, delivered with care.
          </h2>



          <button className="
            mt-8
            bg-white
            text-blue-600
            px-8
            py-3
            rounded-full
            font-semibold
            hover:bg-gray-100
            transition
          ">
            Shop Now
          </button>

        </div>


        {/* Image */}
        <div className="flex justify-center">

          <img
            src="https://i.etsystatic.com/64115530/r/il/a7f4d6/8307191268/il_fullxfull.8307191268_1bix.jpg"
            alt="shopping"
            className="
              rounded-2xl
              shadow-xl
              w-full
              max-w-md
            "
          />

        </div>

      </div>
    </section>
  );
};


export default Hero;