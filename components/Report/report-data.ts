export type ReportCategory = {
  id: string;
  label: string;
  reasons: ReportReason[];
};

export type ReportReason = {
  id: string;
  label: string;
};

export const REPORT_CATEGORIES: ReportCategory[] = [
  {
    id: "security-sensitive",
    label: "Keamanan & Konten Sensitif",
    reasons: [
      {
        id: "sexual-content",
        label: "Konten Seksual atau Telanjang",
      },
      {
        id: "violence",
        label: "Kekerasan atau Organisasi Berbahaya",
      },
      {
        id: "self-harm",
        label: "Bunuh Diri atau Melukai Diri Sendiri",
      },
      {
        id: "child-exploitation",
        label: "Eksploitasi Anak",
      },
    ],
  },
  {
    id: "behavior-interaction",
    label: "Perilaku & Interaksi",
    reasons: [
      {
        id: "harassment-bullying",
        label: "Pelecehan atau Perundungan (Bullying)",
      },
      {
        id: "hate-speech",
        label: "Ujaran Kebencian (Hate Speech)",
      },
      {
        id: "impersonation",
        label: "Meniru Identitas Orang Lain (Impersonation)",
      },
    ],
  },
  {
    id: "platform-integrity",
    label: "Integritas Platform & Spam",
    reasons: [
      {
        id: "spam",
        label: "Spam",
      },
      {
        id: "scam",
        label: "Penipuan atau Scam",
      },
      {
        id: "misinformation",
        label: "Informasi Palsu (Hoax/Misinformation)",
      },
    ],
  },
  {
    id: "legality-copyright",
    label: "Legalitas & Hak Cipta",
    reasons: [
      {
        id: "copyright-violation",
        label: "Pelanggaran Hak Cipta (Copyright)",
      },
      {
        id: "illegal-goods",
        label: "Barang atau Jasa Ilegal",
      },
    ],
  },
  {
    id: "other",
    label: "Lainnya",
    reasons: [
      {
        id: "other-reason",
        label: "Lainnya",
      },
    ],
  },
];
