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

export interface ShopWeaponSkin {
  id: string;
  name: string;
  nameAr: string;
  weaponType: 'axe' | 'sword' | 'gun' | 'rocket' | 'rope' | 'magnet' | 'all';
  price: number; // 200 - 10000 gems
  currency: 'gems';
  description: string;
  primaryColor: string;
  secondaryColor: string;
  glowColor: string;
  bladeColor?: string;
  effect?: 'plasma' | 'solar' | 'cyber' | 'dragon' | 'void' | 'rainbow' | 'quantum';
}

export interface PlayerWallet {
  coins: number;
  gems: number;
  purchasedHats: string[];
  purchasedSkins: string[];
  purchasedShoes: string[];
  purchasedWeaponSkins: string[];
  equippedHat: string | null;
  equippedSkin: string | null;
  equippedShoes: string | null;
  equippedWeaponSkin: string | null;
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

export const WEAPON_SKINS: ShopWeaponSkin[] = [
  // 1. Battleaxe Skins
  {
    id: 'axe_neon_plasma',
    name: 'Neon Plasma Reaper',
    nameAr: 'فأس البلازما النيوني المشع',
    weaponType: 'axe',
    price: 250,
    currency: 'gems',
    description: 'فأس حربي سيبراني مصبوب من طاقة البلازما النقية مع شفرة متوهجة باللون السماوي الفلوري.',
    primaryColor: '#0891b2',
    secondaryColor: '#06b6d4',
    glowColor: '#22d3ee',
    bladeColor: '#a5f3fc',
    effect: 'plasma',
  },
  {
    id: 'axe_solar_emperor',
    name: 'Solar Emperor Battleaxe',
    nameAr: 'فأس الإمبراطور الشمسي الملكي',
    weaponType: 'axe',
    price: 1500,
    currency: 'gems',
    description: 'سلاح إمبراطوري مطروق من ذهب النجوم القديمة يشع حرارة شمسية وهالة ذهبية حارقة تذيب كل درع.',
    primaryColor: '#b45309',
    secondaryColor: '#f59e0b',
    glowColor: '#fbbf24',
    bladeColor: '#fef08a',
    effect: 'solar',
  },
  {
    id: 'axe_void_annihilator',
    name: 'Void Oblivion Destroyer',
    nameAr: 'فأس الهاوية الكونية الفخم',
    weaponType: 'axe',
    price: 5000,
    currency: 'gems',
    description: 'فأس ملكي أسود يمتص الضوء المحيط وينبض بهالة أرجوانية كونية فتاكة من أفق الثقوب السوداء.',
    primaryColor: '#3b0764',
    secondaryColor: '#9333ea',
    glowColor: '#c084fc',
    bladeColor: '#f3e8ff',
    effect: 'void',
  },

  // 2. Sword Skins
  {
    id: 'sword_cyber_katana',
    name: 'Cyber Neon Katana',
    nameAr: 'كاتانا السايبر النيونية',
    weaponType: 'sword',
    price: 300,
    currency: 'gems',
    description: 'سيف كاتانا مستقبلي عالي التردد بنصل وردي نيون متوهج يقطع الهواء بانسيابية مذهلة.',
    primaryColor: '#0f172a',
    secondaryColor: '#db2777',
    glowColor: '#f472b6',
    bladeColor: '#fbcfe8',
    effect: 'cyber',
  },
  {
    id: 'sword_dragon_flame',
    name: 'Infernal Dragonfang',
    nameAr: 'سيف التنين الناري الملكي',
    weaponType: 'sword',
    price: 2000,
    currency: 'gems',
    description: 'سيف أسطوري مشبع بأنفاس تنين بركاني، يشتعل بنيران حية متدفقة متوهجة عند كل ضربة.',
    primaryColor: '#7f1d1d',
    secondaryColor: '#ea580c',
    glowColor: '#ef4444',
    bladeColor: '#fed7aa',
    effect: 'dragon',
  },
  {
    id: 'sword_celestial_god',
    name: 'Celestial Sovereign Blade',
    nameAr: 'سيف الآلهة الكوني المشع',
    weaponType: 'sword',
    price: 8000,
    currency: 'gems',
    description: 'نصل كوني مقدس من ألماس النجوم، يشع طاقة أثيرية زرقاء وذهبية ملكية تخطف الأبصار.',
    primaryColor: '#1e1b4b',
    secondaryColor: '#fbbf24',
    glowColor: '#60a5fa',
    bladeColor: '#ffffff',
    effect: 'solar',
  },

  // 3. Gun (Blaster) Skins
  {
    id: 'gun_hyper_laser',
    name: 'Hyper Pulse Blaster',
    nameAr: 'مسدس الليزر الفائق المشع',
    weaponType: 'gun',
    price: 200,
    currency: 'gems',
    description: 'مسدس ليزري تكتيكي متطور يطلق حزم فوتونية خضراء زمردية متوهجة.',
    primaryColor: '#064e3b',
    secondaryColor: '#059669',
    glowColor: '#34d399',
    bladeColor: '#6ee7b7',
    effect: 'plasma',
  },
  {
    id: 'gun_quantum_blaster',
    name: 'Quantum Void Cannon',
    nameAr: 'قاذف الكوانتم المشع الفخم',
    weaponType: 'gun',
    price: 3500,
    currency: 'gems',
    description: 'سلاح ذري متقدم بمسرع جزيئات نيون نبضي يحول الطلقات إلى كتل كوانتم براقة فائقة القوة.',
    primaryColor: '#1e1b4b',
    secondaryColor: '#4f46e5',
    glowColor: '#818cf8',
    bladeColor: '#c7d2fe',
    effect: 'quantum',
  },

  // 4. Rocket Launcher Skins
  {
    id: 'rocket_supernova',
    name: 'Supernova Launch Pod',
    nameAr: 'راجمة السوبرنوفا النووية',
    weaponType: 'rocket',
    price: 400,
    currency: 'gems',
    description: 'راجمة صواريخ حرارية مطلية بالبرتقالي البركاني مع رأس تفجيري متقد وشعلة مضيئة.',
    primaryColor: '#431407',
    secondaryColor: '#c2410c',
    glowColor: '#f97316',
    bladeColor: '#ffedd5',
    effect: 'solar',
  },
  {
    id: 'rocket_doomsday_cannon',
    name: 'Doomsday Titan Railgun',
    nameAr: 'مدفع يوم القيامة المضيء',
    weaponType: 'rocket',
    price: 6000,
    currency: 'gems',
    description: 'مدفع تيتانيوم ضخم فتاك يطلق قذائف هيدروجينية مضيئة تترك هالة رعب حمراء متوهجة.',
    primaryColor: '#18181b',
    secondaryColor: '#b91c1c',
    glowColor: '#f87171',
    bladeColor: '#fca5a5',
    effect: 'dragon',
  },

  // 5. Grapple Hook Skins
  {
    id: 'rope_cyber_wire',
    name: 'Cyberwire Grappler',
    nameAr: 'خطاف السايبر المشع',
    weaponType: 'rope',
    price: 250,
    currency: 'gems',
    description: 'خطاف نانومتري مشع بألياف ضوئية فائقة الصلابة مع مقبض كربون تكتيكي.',
    primaryColor: '#0f172a',
    secondaryColor: '#0284c7',
    glowColor: '#38bdf8',
    bladeColor: '#bae6fd',
    effect: 'cyber',
  },
  {
    id: 'rope_ether_chain',
    name: 'Ethereal Soul Chain',
    nameAr: 'سلاسل الأثير النورانية',
    weaponType: 'rope',
    price: 4500,
    currency: 'gems',
    description: 'سلاسل أثيرية مشعة بطاقة أرواح الأبطال القدامى تتلألأ بهالة مائية سماوية تتنفس بالحياة.',
    primaryColor: '#042f2e',
    secondaryColor: '#0d9488',
    glowColor: '#2dd4bf',
    bladeColor: '#99f6e4',
    effect: 'plasma',
  },

  // 6. Magnet Pulse Skins
  {
    id: 'magnet_pulsar_core',
    name: 'Pulsar Magnetic Core',
    nameAr: 'نبض النجم النيوتروني',
    weaponType: 'magnet',
    price: 350,
    currency: 'gems',
    description: 'قلب مغناطيسي مستخرج من نجم نابض يولد موجات ارتدادية كهرومغناطيسية بنفسجية مبهرة.',
    primaryColor: '#2e1065',
    secondaryColor: '#7e22ce',
    glowColor: '#c084fc',
    bladeColor: '#f3e8ff',
    effect: 'void',
  },
  {
    id: 'magnet_singularity',
    name: 'Singularity Event Sphere',
    nameAr: 'مغناطيس الثقب الأسود الملكي',
    weaponType: 'magnet',
    price: 7500,
    currency: 'gems',
    description: 'كرة جاذبية فائقة الكتلة يلفها أفق حدث ياقوتي متوهج يدفع الخصوم بهيبة أسطورية.',
    primaryColor: '#030712',
    secondaryColor: '#be123c',
    glowColor: '#fb7185',
    bladeColor: '#ffe4e6',
    effect: 'dragon',
  },

  // 7. Supreme Ultimate God Weapon (10,000 GEMS)
  {
    id: 'weapon_supreme_infinity',
    name: 'Infinity Genesis God Weapon',
    nameAr: 'سلاح اللانهاية الكوني المطلق',
    weaponType: 'all',
    price: 10000,
    currency: 'gems',
    description: 'السلاح الأسطوري الأغلى والأفخم في تاريخ ستيك أرينا (10,000 جوهرة)! يغطي أي سلاح تحمله (فأس، سيف، مسدس، صاروخ، خطاف، مغناطيس) بهالة قوس قزح كروماتيكية متدفقة متغيرة الألوان كل ثانية مع شرارات نورانية أسطورية!',
    primaryColor: '#ffffff',
    secondaryColor: '#fbbf24',
    glowColor: 'rainbow',
    bladeColor: 'rainbow',
    effect: 'rainbow',
  },
];
