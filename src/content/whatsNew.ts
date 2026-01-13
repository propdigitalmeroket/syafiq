export interface WhatsNewItem {
  date: string;
  titleEn: string;
  titleMs: string;
  descriptionEn: string;
  descriptionMs: string;
}

export const whatsNewItems: WhatsNewItem[] = [
  {
    date: "2025-12-19",
    titleEn: "Entitle For Housing loan Visualise",
    titleMs: "Analog Kelayakan Untuk Rumah",
    descriptionEn: "Users now view DSR your current comitment with future comitment.",
    descriptionMs: "Pengguna kini lihat terus analog kelayakan secara visual."
  },
  {
    date: "2025-12-15",
    titleEn: "Multi-language Support",
    titleMs: "Sokongan BM dan BI",
    descriptionEn: "Calculator now supports both English and Bahasa Melayu languages.",
    descriptionMs: "Kalkulator kini menyokong kedua-dua bahasa Inggeris dan Bahasa Melayu."
  },
  {
    date: "2025-12-10",
    titleEn: "Bank Recommendations",
    titleMs: "Cadangan Bank",
    descriptionEn: "Get personalized bank recommendations based on your income profile and DSR status.",
    descriptionMs: "Dapatkan cadangan bank yang diperibadikan berdasarkan profil pendapatan dan status DSR anda."
  }
];
