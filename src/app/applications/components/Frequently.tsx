"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/* 🔑 Jadikan AccordionItem sebagai motion component */
const MotionAccordionItem = motion(AccordionItem);

const FrequentlySection: React.FC = () => {
  const faqItems = [
    {
      id: "item-1",
      question: "Apa itu BKK SMKN I Purwosari?",
      answer:
        "Bursa Kerja Khusus (BKK) SMKN I Purwosari adalah lembaga resmi di sekolah yang berfungsi sebagai penghubung antara alumni dengan dunia usaha dan dunia industri (DUDI), khususnya dalam penyaluran lulusan ke dunia kerja.",
    },
    {
      id: "item-2",
      question: "Bagaimana cara mendaftar lowongan kerja di BKK?",
      answer:
        "Untuk mendaftar lowongan kerja, Anda perlu: 1) Membuat akun alumni di website BKK, 2) Melengkapi profil dan CV, 3) Memilih lowongan yang tersedia, 4) Mengirim lamaran melalui sistem kami.",
    },
    {
      id: "item-3",
      question: "Apakah BKK bekerja sama dengan perusahaan industri?",
      answer:
        "Ya, BKK SMKN I Purwosari telah bekerja sama dengan lebih dari 50+ mitra industri dari berbagai sektor untuk memastikan lulusan mendapatkan kesempatan kerja yang terbaik sesuai dengan kompetensi mereka.",
    },
    {
      id: "item-4",
      question: "Apakah pendaftaran dan layanan BKK dipungut biaya?",
      answer:
        "Tidak, seluruh layanan BKK SMKN I Purwosari sepenuhnya GRATIS tanpa biaya pendaftaran atau administrasi apapun.",
    },
    {
      id: "item-5",
      question: "Siapa saja yang dapat mendaftar melalui BKK?",
      answer:
        "Seluruh alumni SMKN I Purwosari dapat mendaftar melalui BKK, termasuk siswa tingkat akhir.",
    },
  ];

  return (
    <section className="w-full py-20 bg-white">
      <div className="container mx-auto px-4 flex gap-20">
        {/* ================= HEADER ================= */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col gap-8 text-start max-w-100"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl text-black font-normal">
            Frequently Asked Question
          </h2>
          <p className="text-lg text-black opacity-50 max-w-3xl mx-auto">
            Berikut adalah beberapa pertanyaan yang sering diajukan terkait
            layanan BKK SMKN I Purwosari.
          </p>
        </motion.div>

        {/* ================= FAQ ================= */}
        <div className="w-full">
          <Accordion type="single" collapsible>
            {faqItems.map((item, index) => (
              <MotionAccordionItem
                key={item.id}
                value={item.id}
                className="border-b border-[#818181]"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.45,
                  ease: "easeOut",
                  delay: index * 0.08,
                }}
              >
                <AccordionTrigger className="text-left py-6 hover:no-underline">
                  <span className="text-lg font-medium text-gray-900">
                    {item.question}
                  </span>
                </AccordionTrigger>

                <AccordionContent className="pb-6">
                  <p className="text-gray-700">{item.answer}</p>
                </AccordionContent>
              </MotionAccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FrequentlySection;
