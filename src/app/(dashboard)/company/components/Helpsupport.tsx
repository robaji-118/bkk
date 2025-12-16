// src/components/pages/HelpSupportComponent.tsx
import { HelpCircle } from "lucide-react";

export default function HelpSupportComponent() {
  const helpItems = [
    { title: "Getting Started", desc: "Learn the basics of the platform" },
    { title: "Account Settings", desc: "Manage your account preferences" },
    { title: "Billing & Payments", desc: "Information about payments" },
    { title: "Technical Support", desc: "Get technical assistance" },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="max-w-2xl mx-auto text-center">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <HelpCircle size={32} className="text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">How can we help you?</h2>
        
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search for help articles..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          {helpItems.map((item, i) => (
            <div key={i} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer transition-colors">
              <h3 className="font-semibold text-gray-800 mb-1">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-3">Still need help?</p>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}