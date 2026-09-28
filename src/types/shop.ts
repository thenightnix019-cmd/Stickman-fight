export interface ShopHat {
  id: string;
  name: string;
  nameAr: string;
  price: number;
  currency: 'coins' | 'gems';
  description: string;
  isSpecial?: boolean; // 8th hat glows and is special
  glowColor?: string;
}

export interface ShopSkin {
  id: string;
  name: string;
  nameAr: string;
  price: number; // in gems (20 - 100)
  currency: 'gems';
  category: 'justice' | 'custom';
  description: string;
  primaryColor: string;
  secondaryColor: string;
  glowColor: string;
  hasCape?: boolean;
  capeColor?: string;
  emblem?:
    | 'bat'
    | 'super'
    | 'flash'
    | 'wonder'
    | 'lantern'
    | 'aquaman'
    | 'cyborg'
    | 'justice'
    | 'spider'
    | 'reactor'
    | 'cyber'
    | 'phoenix'
    | 'void';
}

export interface ShopShoes {
  id: string;
  name: string;
  nameAr: string;
  price: number; // 1000 gems
  currency: 'gems';
  description: string;
  isRainbowChroma: boolean;
}

export interface PlayerWallet {
  coins: number;
  gems: number;
  purchasedHats: string[];
  purchasedSkins: string[];
  purchasedShoes: string[];
  equippedHat: string | null;
  equippedSkin: string | null;
  equippedShoes: string | null;
  redeemedCodes?: string[];
}

export const HATS: ShopHat[] = [
  {
    id: 'cowboy_hat',
    name: 'Cowboy Hat',
    nameAr: 'قبعة رعاة البقر',
    price: 100,
    currency: 'coins',
    description: 'قبعة كلاسيكية جلدية عريضة الحواف مع شارة برونزية.',
  },
  {
    id: 'ninja_bandana',
    name: 'Ninja Bandana',
    nameAr: 'عصابة النينجا',
    price: 150,
    currency: 'coins',
    description: 'عصابة رأس حمراء قتالية مع وشاح يرفرف في الهواء.',
  },
  {
    id: 'viking_helmet',
    name: 'Viking Helmet',
    nameAr: 'خوذة الفايكنج',
    price: 200,
    currency: 'coins',
    description: 'خوذة فولاذية ثقيلة بقرنين من العاج للمعارك العنيفة.',
  },
  {
    id: 'samurai_kabuto',
    name: 'Samurai Kabuto',
    nameAr: 'خوذة الساموراي',
    price: 250,
    currency: 'coins',
    description: 'خوذة كابوتو يابانية سوداء مع هلال ذهبي أمامي.',
  },
  {
    id: 'cyber_visor',
    name: 'Cyber Visor',
    nameAr: 'نظارات السايبر',
    price: 300,
    currency: 'coins',
    description: 'شاشة إلكترونية نيون زرقاء تغطي العينين بأسلوب مستقبلي.',
  },
  {
    id: 'wizard_hat',
    name: 'Mage Wizard Hat',
    nameAr: 'قبعة الساحر',
    price: 350,
    currency: 'coins',
    description: 'قبعة سحرية أرجوانية مدببة مطرزة بنجوم ذهبية.',
  },
  {
    id: 'pirate_tricorne',
    name: 'Pirate Tricorne',
    nameAr: 'قبعة القراصنة',
    price: 400,
    currency: 'coins',
    description: 'قبعة قبطان قراصنة ثلاثية الزوايا مع جمجمة بيضاء وريشة.',
  },
  {
    // The 8th Special Hat - 50 GEMS & RADIANT GLOW
    id: 'celestial_crown',
    name: 'Legendary Crown',
    nameAr: 'التاج الأسطوري',
    price: 50,
    currency: 'gems',
    isSpecial: true,
    glowColor: '#fbbf24',
    description: 'تاج ذهبي أسطوري مشع بهالة شمسية متوهجة تتنفس باستمرار!',
  },
];

export const SKINS: ShopSkin[] = [
  {
    id: 'hero_superman',
    name: 'Man of Steel',
    nameAr: 'سوبرمان (رجل الفولاذ)',
    price: 45,
    currency: 'gems',
    category: 'justice',
    description: 'بدلة عصبة العدالة الزرقاء الملكية الفخمة مع درع الصدر الذهبي والعباءة الحمراء.',
    primaryColor: '#1d4ed8',
    secondaryColor: '#dc2626',
    glowColor: '#60a5fa',
    hasCape: true,
    capeColor: '#dc2626',
    emblem: 'super',
  },
  {
    id: 'hero_batman',
    name: 'Dark Knight',
    nameAr: 'باتمان (فارس الظلام)',
    price: 40,
    currency: 'gems',
    category: 'justice',
    description: 'درع عصبة العدالة التكتيكي الفخم مع قناع الخفاش، عباءة سوداء مجنحة، وشعار الوطواط الذهبي.',
    primaryColor: '#0f172a',
    secondaryColor: '#f59e0b',
    glowColor: '#94a3b8',
    hasCape: true,
    capeColor: '#020617',
    emblem: 'bat',
  },
  {
    id: 'hero_flash',
    name: 'Crimson Speedster',
    nameAr: 'فلاش (البرق الخارق)',
    price: 35,
    currency: 'gems',
    category: 'justice',
    description: 'بدلة السرعة القرمزية الديناميكية مع أجنحة صواعق الأذنين وشعار البرق الذهبي المتوهج.',
    primaryColor: '#dc2626',
    secondaryColor: '#facc15',
    glowColor: '#fbbf24',
    hasCape: false,
    emblem: 'flash',
  },
  {
    id: 'hero_wonderwoman',
    name: 'Amazon Princess',
    nameAr: 'وندر وومان (أميرة الأمازون)',
    price: 45,
    currency: 'gems',
    category: 'justice',
    description: 'درع المحاربة الأمازونية الفخم مع التاج الذهبي، أساور الصد الفضية، وحبل الحقيقة المشع.',
    primaryColor: '#b91c1c',
    secondaryColor: '#fbbf24',
    glowColor: '#f59e0b',
    hasCape: true,
    capeColor: '#1e3a8a',
    emblem: 'wonder',
  },
  {
    id: 'hero_greenlantern',
    name: 'Emerald Guardian',
    nameAr: 'جرين لانترن (الفانوس الأخضر)',
    price: 40,
    currency: 'gems',
    category: 'justice',
    description: 'بدلة طاقة الإرادة الزمردية مع قناع البطل وشعار الفانوس المشع وخاتم القوة الخضراء.',
    primaryColor: '#047857',
    secondaryColor: '#10b981',
    glowColor: '#34d399',
    hasCape: false,
    emblem: 'lantern',
  },
  {
    id: 'hero_aquaman',
    name: 'King of Atlantis',
    nameAr: 'أكوامان (ملك الأطلنطس)',
    price: 40,
    currency: 'gems',
    category: 'justice',
    description: 'درع الحراشف الذهبية الملكية الفخمة مع حزام أطلنطس وشوكة المحيط المائية.',
    primaryColor: '#d97706',
    secondaryColor: '#0f766e',
    glowColor: '#14b8a6',
    hasCape: false,
    emblem: 'aquaman',
  },
  {
    id: 'hero_cyborg',
    name: 'Cybernetic Titan',
    nameAr: 'سايبورغ (المحارب السيبراني)',
    price: 45,
    currency: 'gems',
    category: 'justice',
    description: 'درع معدني تيتانيوم مصقول مع عين إلكترونية حمراء ليزرية ومفاعل طاقة في الصدر.',
    primaryColor: '#334155',
    secondaryColor: '#ef4444',
    glowColor: '#f87171',
    hasCape: false,
    emblem: 'cyborg',
  },
  {
    id: 'hero_justice_lord',
    name: 'Cosmic Justice Sovereign',
    nameAr: 'سيد عصبة العدالة الملكي',
    price: 85,
    currency: 'gems',
    category: 'justice',
    description: 'السكين الأسطوري الفخم الأعلى لعصبة العدالة! درع ملكي يجمع هيبة أبطال العدالة بهالة كونية ملكية.',
    primaryColor: '#1e1b4b',
    secondaryColor: '#fbbf24',
    glowColor: '#c084fc',
    hasCape: true,
    capeColor: '#4338ca',
    emblem: 'justice',
  },
];

export const SHOES: ShopShoes[] = [
  {
    id: 'chroma_rgb_boots',
    name: 'Chroma Prism RGB Boots',
    nameAr: 'حذاء الأطياف المتوهج الأسطوري',
    price: 1000,
    currency: 'gems',
    isRainbowChroma: true,
    description:
      'حذاء أسطوري نادر جداً يشع ألواناً متتالية ويتغير لونه عبر كامل أطياف قوس قزح في كل لحظة، ويترك مسارات ضوئية مشعة عند الجري والقفز!',
  },
];
