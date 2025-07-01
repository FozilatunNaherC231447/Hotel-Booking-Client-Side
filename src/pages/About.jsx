import React from "react";
import { Helmet } from "react-helmet";

const About = () => {
  return (
    <div className="bg-black/40 text-white">
      <Helmet>
        <title>About | StayEase</title>
      </Helmet>

      <section className="py-15 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-rose-500 mb-4">About StayEase</h1>
          <p className="text-lg md:text-xl text-gray-300">
            Redefining comfort with seamless online booking and tailored stays.
            Whether for business or leisure, StayEase ensures peace of mind
            from check-in to check-out.
          </p>
        </div>
      </section>

      <section className="py-10 px-6 md:px-12 lg:px-20">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-rose-500 mb-6">Our Mission</h2>
          <p className="text-gray-300 text-lg leading-relaxed">
            At StayEase, our mission is to make travel effortless by connecting
            travelers with top accommodations that blend comfort, value, and
            personalized experiences. We’re committed to transparency,
            simplicity, and creating memories that last.
          </p>
        </div>
      </section>

      <section className="py-16 px-6 md:px-12 lg:px-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-rose-500">Why Choose Us</h2>
          <p className="text-gray-400 mt-2 max-w-2xl mx-auto">
            Discover the StayEase advantage—thoughtfully designed to elevate
            your entire travel experience.
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-3 max-w-6xl mx-auto">
          {/* Card 1 */}
          <div className="bg-[#1a1a1a] p-6 rounded-2xl shadow-md hover:shadow-lg border-t-4 border-rose-500 transition-all">
            <h3 className="text-xl font-semibold mb-2 text-rose-500">Easy Booking</h3>
            <p className="text-gray-300">
              Enjoy a seamless booking process with just a few intuitive steps.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-[#1a1a1a] p-6 rounded-2xl shadow-md hover:shadow-lg border-t-4 border-rose-500 transition-all">
            <h3 className="text-xl font-semibold mb-2 text-rose-500">Verified Hosts</h3>
            <p className="text-gray-300">
              We partner only with trusted hosts to ensure safety, comfort, and
              reliability for every guest.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-[#1a1a1a] p-6 rounded-2xl shadow-md hover:shadow-lg border-t-4 border-rose-500 transition-all">
            <h3 className="text-xl font-semibold mb-2 text-rose-500">24/7 Support</h3>
            <p className="text-gray-300">
              Get assistance whenever you need it with our responsive customer
              support team—day or night.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 text-center border-t border-gray-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-rose-500">Crafting Unique Experiences</h2>
          <p className="text-gray-400 text-lg">
            From romantic getaways to business travel, our curated stays match
            your lifestyle and expectations—no matter the journey.
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;
