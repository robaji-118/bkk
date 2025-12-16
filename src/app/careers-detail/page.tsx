"use client";
import Navbar from "@/app/applications/components/Navbar";
import FooterSection from "@/app/applications/components/Footer";

export default function CareersDetail() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="bg-white text-gray-800">
        <div className="max-w-7xl mx-auto pt-32 pb-20">
          {/* Header */}
          <div className="flex flex-col items-center pb-15 pt-8">
            <div className="text-center max-w-[516px] flex flex-col gap-4">
              <p className="text-sm text-gray-500">Engineering</p>
              <h1 className="text-[64px] leading-16 font-bold">
                Senior Webflow Developer
              </h1>
              <div className="flex items-center gap-2 text-sm text-gray-500 justify-center">
                <span>📍</span>
                <span>Google, California</span>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 px-16">
            {/* Left Content */}
            <div className="lg:col-span-2 space-y-10">
              {/* About */}
              <section>
                <h3 className="text-[40px] font-semibold mb-3">About the role</h3>
                <div className="flex flex-col gap-2">
                  <p className="text-gray-600 text-lg text-justify leading-relaxed ">
                  Growvy engineering is a small team that works quickly,
                  prioritizing getting value to customers and iterating to make
                  those experiences even better. We offer the most powerful
                  product analytics tool while still focusing on making the user
                  experience delightful. The full stack engineers have the
                  freedom to move about the stack to deliver value to customers
                  without being blocked by ownership silos.
                </p>

                <p className="text-gray-600 text-lg text-justify leading-relaxed">
                  Growvy engineering is a small team that works quickly,
                  prioritizing getting value to customers and iterating to make
                  those experiences even better. We offer the most powerful
                  product analytics tool while still focusing on making the user
                  experience delightful. The full stack engineers have the
                  freedom to move about the stack to deliver value to customers
                  without being blocked by ownership silos.
                </p>

                <p className="text-gray-600 text-lg text-justify leading-relaxed">
                  Growvy engineering is a small team that works quickly,
                  prioritizing getting value to customers and iterating to make
                  those experiences even better. We offer the most powerful
                  product analytics tool while still focusing on making the user
                  experience delightful. The full stack engineers have the
                  freedom to move about the stack to deliver value to customers
                  without being blocked by ownership silos.
                </p>
                </div>
              </section>

              {/* Responsibilities */}
              <section>
                <h3 className="text-[40px]  font-semibold mb-3">Responsibilities</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-600 text-lg">
                  <li>
                    Design and develop Webflow websites with best practices.
                  </li>
                  <li>Collaborate with product managers and designers.</li>
                  <li>Optimize performance and accessibility.</li>
                  <li>Maintain clean, scalable components.</li>
                </ul>
              </section>

              {/* Requirements */}
              <section>
                <h3 className="text-[40px] font-semibold mb-3">
                  What we're looking for
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-600 text-lg">
                  <li>
                    5+ years experience in Webflow or frontend development.
                  </li>
                  <li>Strong understanding of responsive design.</li>
                  <li>Experience working with modern UI systems.</li>
                  <li>Good communication and teamwork skills.</li>
                </ul>
              </section>

              {/* Compensation */}
              <section>
                <h3 className="text-[40px] font-semibold mb-3">Compensation</h3>
                <p className="text-gray-600 text-lg">
                  Salary range: <strong>$120,000 – $160,000 USD</strong>{" "}
                  depending on experience and location.
                </p>
              </section>
            </div>

            {/* Right Sidebar */}
            <aside className="border rounded-xl p-6 h-fit lg:sticky lg:top-24">
              <h3 className="font-semibold text-lg mb-4">Perks and benefits</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li>✔ Health Insurance</li>
                <li>✔ Paid Time Off</li>
                <li>✔ Remote Friendly</li>
                <li>✔ Learning Budget</li>
                <li>✔ Team Retreats</li>
              </ul>
              <button className="mt-6 w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 rounded-lg transition">
                Apply Now
              </button>
            </aside>
          </div>
        </div>
      </main>

      <FooterSection />
    </div>
  );
}
