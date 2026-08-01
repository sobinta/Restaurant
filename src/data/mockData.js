// Mock Data for World-Class White-Label Restaurant Platform

export const RESTAURANT_PRESETS = [
  {
    id: "luxury-gold",
    name: "رستوران بین‌المللی آرشیدا",
    subName: "Arshida Fine Dining & Lounge",
    tagline: "تجربه‌ای ماندگار از طعم‌های شاهانه و فضایی مجلل",
    themeClass: "theme-gold",
    primaryColor: "#f59e0b",
    logoText: "رستوران آرشیدا",
    badge: "برنده تندیس برتر سال ۲۰۲۵",
    type: "Luxury Fine Dining",
    bgPattern: "radial-gradient(circle at 50% 20%, rgba(245, 158, 11, 0.15) 0%, transparent 60%)",
  },
  {
    id: "steakhouse-ruby",
    name: "استیک‌هاوس پرایم",
    subName: "Prime Cut Steakhouse & Grill",
    tagline: "بهترین برش‌های گوشت عمل‌آوری شده با چوب گردو",
    themeClass: "theme-ruby",
    primaryColor: "#e11d48",
    logoText: "PRIME CUT",
    badge: "دارای گواهی گوشت وگیو A5",
    type: "Premium Steakhouse",
    bgPattern: "radial-gradient(circle at 50% 20%, rgba(225, 29, 72, 0.15) 0%, transparent 60%)",
  },
  {
    id: "emerald-organic",
    name: "کافه رستوران گیاهی زیتون",
    subName: "Zeytoon Garden & Bio Bistro",
    tagline: "غذای سالم، مواد اولیه ۱۰۰٪ ارگانیک و فضایی سرسبز",
    themeClass: "theme-emerald",
    primaryColor: "#10b981",
    logoText: "کافه زیتون",
    badge: "۱۰۰٪ ارگانیک و فاقد گلوتن",
    type: "Organic & Healthy Bistro",
    bgPattern: "radial-gradient(circle at 50% 20%, rgba(16, 185, 129, 0.15) 0%, transparent 60%)",
  },
  {
    id: "traditional-amber",
    name: "رستوران سنتی عالی‌قاپو",
    subName: "Ali Qapu Heritage Restaurant",
    tagline: "اصالت طعم‌های ایرانی در شکوه معماری صفوی",
    themeClass: "theme-amber-wood",
    primaryColor: "#d97706",
    logoText: "عالی‌قاپو",
    badge: "ثبت شده در میراث فرهنگی",
    type: "Persian Traditional Luxury",
    bgPattern: "radial-gradient(circle at 50% 20%, rgba(217, 119, 6, 0.15) 0%, transparent 60%)",
  }
];

export const MENU_CATEGORIES = [
  { id: "all", name: "همه موارد", icon: "Utensils" },
  { id: "chef-special", name: "پیشنهاد سرآشپز", icon: "Crown" },
  { id: "main-courses", name: "غذای اصلی", icon: "Flame" },
  { id: "starters", name: "پیش‌غذا & سالاد", icon: "Salad" },
  { id: "desserts", name: "دسر & عصرانه", icon: "Cake" },
  { id: "beverages", name: "نوشیدنی‌های بار", icon: "Coffee" },
];

export const DISHES = [
  {
    id: 1,
    categoryId: "chef-special",
    name: "استیک فیله مینیون با سس قارچ وحشی",
    enName: "Filet Mignon with Wild Mushroom Sauce",
    price: 980000,
    rating: 4.9,
    reviews: 142,
    prepTime: "۲۵-۳۰ دقیقه",
    calories: "۶۵۰ کیلوکالری",
    image: "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80",
    description: "۲۵۰ گرم فیله گوساله خالص مرینیت شده با سبزیجات معطر و سس مخصوص قارچ وحشی و کره ترنسلیوانیا.",
    dietary: ["حلال", "پروتیئن بالا"],
    isChefSpecial: true,
    spiceLevel: 0,
    pairing: "پیشنهاد نوشیدنی: موهیتو زنجبیل و نعناع تازه",
    options: [
      { name: "میزان پخت استیک", choices: ["مدیوم رر (Medium Rare)", "مدیوم (Medium)", "ول دان (Well Done)"] },
      { name: "دورچین انتخابی", choices: ["سیب‌زمینی تنوری با دیپ سیر", "سبزیجات بخارپز فصل", "پوره سیب‌زمینی کره‌ای"] }
    ]
  },
  {
    id: 2,
    categoryId: "chef-special",
    name: "چلوکباب شاندیز مخصوص با استخوان",
    enName: "Special Shandiz Lamb Chops Kebab",
    price: 1150000,
    rating: 5.0,
    reviews: 210,
    prepTime: "۲۰ دقیقه",
    calories: "۸۲۰ کیلوکالری",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
    description: "۴۰۰ گرم دنده گوسفندی نرم و آبدار طبخ شده روی زغال طبیعی همراه برنج زعفرانی طارم اصل مشهد و گوجه کبابی.",
    dietary: ["حلال", "غذای اصیل"],
    isChefSpecial: true,
    spiceLevel: 0,
    pairing: "پیشنهاد: دوغ محلی نیشابوری با نعناع و گل‌محمدی",
    options: [
      { name: "نوع برنج", choices: ["برنج زعفرانی طارم", "برنج کته محلی با کره حیوان"] }
    ]
  },
  {
    id: 3,
    categoryId: "main-courses",
    name: "ماهی سالمون نروژی گرانیت شده با سس لیمو و شوید",
    enName: "Pan-Seared Norwegian Salmon",
    price: 890000,
    rating: 4.8,
    reviews: 98,
    prepTime: "۲۰-۲۵ دقیقه",
    calories: "۴۸۰ کیلوکالری",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80",
    description: "فیله تازه سالمون نروژی کباب‌شده در فر همراه با سس لیموترش شیرازی، شوید تازه و سبزیجات مدیترانه‌ای.",
    dietary: ["حلال", "امگا ۳ بالا", "بدون گلوتن"],
    isChefSpecial: false,
    spiceLevel: 0,
    pairing: "پیشنهاد: نوشیدنی لیموناد نعناع آلپ",
    options: [
      { name: "نوع پخت", choices: ["کباب شده در فر", "سرخ شده با روغن زیتون"] }
    ]
  },
  {
    id: 4,
    categoryId: "main-courses",
    name: "پاستا پنه آلفردو با مرغ گریل شده",
    enName: "Chicken Fettuccine Alfredo",
    price: 540000,
    rating: 4.7,
    reviews: 175,
    prepTime: "۱۵-۲۰ دقیقه",
    calories: "۷۲۰ کیلوکالری",
    image: "https://images.unsplash.com/photo-1621996346565-e3d5d6288091?auto=format&fit=crop&w=800&q=80",
    description: "پاستا پنه ایتالیایی دست‌ساز همراه با سس خامه آلفردو، دیپ پارمزان ایتالیایی، فیله مرغ گریل شده و قارچ بلانچ شده.",
    dietary: ["محبوب‌ترین"],
    isChefSpecial: false,
    spiceLevel: 0,
    pairing: "پیشنهاد: موکتیل توت‌فرنگی و ریحان",
    options: [
      { name: "پنیر اضافه", choices: ["بدون پنیر اضافه (+۰)", "پنیر پارمزان ۲۴ ماهه اضافه (+۵۰,۰۰۰ تومان)"] }
    ]
  },
  {
    id: 5,
    categoryId: "starters",
    name: "سالاد سزار اختصاصی با فیله سوخاری panko",
    enName: "Special Caesar Salad with Panko Chicken",
    price: 390000,
    rating: 4.9,
    reviews: 320,
    prepTime: "۱۰-۱۵ دقیقه",
    calories: "۳۸۰ کیلوکالری",
    image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=800&q=80",
    description: "کاهو رومانو تازه، فیله مرغ ترد پانکو، نان سیر برشته، پنیر پارمزان رنده شده و سس سزار آنچوی اختصاصی سرآشپز.",
    dietary: ["پروتیئن بالا"],
    isChefSpecial: false,
    spiceLevel: 0,
    options: [
      { name: "نوع مرغ", choices: ["فیله پانکو سوخاری", "فیله مرغ گریل شده رژیمی"] }
    ]
  },
  {
    id: 6,
    categoryId: "starters",
    name: "سوپ قارچ و خامه توپر در نان چاباتا",
    enName: "Creamy Wild Mushroom Soup in Ciabatta Bowl",
    price: 280000,
    rating: 4.8,
    reviews: 85,
    prepTime: "۱۰ دقیقه",
    calories: "۳۱۰ کیلوکالری",
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80",
    description: "سوپ خامه و قارچ جنگلی سرو شده داخل کاسه نان چاباتا ایتالیایی برشته شده با جعفری تازه.",
    dietary: ["وگن", "گرم & دلچسب"],
    isChefSpecial: false,
    spiceLevel: 0,
    options: []
  },
  {
    id: 7,
    categoryId: "desserts",
    name: "کیک نوتلا و شکلات بلژیکی با آیس‌کریم وانیل",
    enName: "Belgian Chocolate Lava Cake",
    price: 320000,
    rating: 4.9,
    reviews: 190,
    prepTime: "۱۲ دقیقه",
    calories: "۵۲۰ کیلوکالری",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80",
    description: "کیک شکلاتی مذاب لاهوا با مغز نوتلا گرم، سرو شده همراه با یک اسکوپ بستنی وانیل ماداگاسکار و سس توت‌فرنگی.",
    dietary: ["دسر لذیذ"],
    isChefSpecial: false,
    spiceLevel: 0,
    options: []
  },
  {
    id: 8,
    categoryId: "beverages",
    name: "موکتیل اختصاصی کهکشان آرشیدا",
    enName: "Arshida Galaxy Blue Signature Mocktail",
    price: 210000,
    rating: 4.9,
    reviews: 154,
    prepTime: "۵ دقیقه",
    calories: "۱۴۰ کیلوکالری",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80",
    description: "ترکیب جادویی بلوبری تازه، عصاره گل پنیرک، لیموترش شیرازی و افکت ذرات طلای خوراکی ۲۴ عیار.",
    dietary: ["نوشیدنی اختصاصی", "بدون الکل"],
    isChefSpecial: true,
    spiceLevel: 0,
    options: []
  }
];

export const SECTIONS = [
  { id: "main-hall", name: "سالن اصلی (Main Lounge)", icon: "Users" },
  { id: "vip-room", name: "غرفه VIP و شیشه‌ای (VIP Glass Room)", icon: "Crown" },
  { id: "terrace", name: "تراس پانوراما و فضای باز (Outdoor Terrace)", icon: "Sun" }
];

export const TABLES = [
  {
    id: "T-01",
    sectionId: "main-hall",
    name: "میز شماره ۱ - مرکزی",
    capacity: 4,
    status: "available", // available, reserved, selected
    minDeposit: 200000,
    view360Title: "ویوی ۳۶۰ درجه از صندلی میز ۱ - سالن اصلی",
    view360Image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80",
    description: "دسترسی آسان به استیج پیانو و بار اصلی، ایده‌آل برای قرارهای ۴ نفره دوستانه.",
    coordinates: { x: 25, y: 30 },
    shape: "round", // round, square, rectangle
  },
  {
    id: "T-02",
    sectionId: "main-hall",
    name: "میز شماره ۲ - کنار آب‌نما",
    capacity: 2,
    status: "available",
    minDeposit: 150000,
    view360Title: "ویوی ۳۶۰ درجه از صندلی میز ۲ - رمانتیک ۲ نفره",
    view360Image: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1600&q=80",
    description: "میز رمانتیک دو نفره با صدای آرامش‌بخش آب‌نمای دیواری و نورپردازی ملایم.",
    coordinates: { x: 50, y: 30 },
    shape: "square",
  },
  {
    id: "T-03",
    sectionId: "main-hall",
    name: "میز شماره ۳ - خانواده",
    capacity: 6,
    status: "reserved",
    minDeposit: 300000,
    view360Title: "ویوی ۳۶۰ درجه از صندلی میز ۳ - سالن اصلی",
    view360Image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1600&q=80",
    description: "محیط وسیع با صندلی‌های مبله چرمی راحت برای مهمانی‌های خانوادگی.",
    coordinates: { x: 75, y: 30 },
    shape: "rectangle",
  },
  {
    id: "T-04",
    sectionId: "vip-room",
    name: "میز VIP شماره ۴ - لوکس آکواریوم",
    capacity: 8,
    status: "available",
    minDeposit: 600000,
    view360Title: "ویوی ۳۶۰ درجه اختصای از داخل اتافق شیشه‌ای VIP",
    view360Image: "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=1600&q=80",
    description: "اتاق خصوصی با سیستم صوتی جداگانه، ویوی اختصاصی و خدمتکار اختصاصی (Personal Butler).",
    coordinates: { x: 30, y: 65 },
    shape: "rectangle",
    isVip: true,
  },
  {
    id: "T-05",
    sectionId: "vip-room",
    name: "میز VIP شماره ۵ - تشریفات مدیران",
    capacity: 10,
    status: "available",
    minDeposit: 1000000,
    view360Title: "ویوی ۳۶۰ درجه از میز تشریفات VIP شاهانه",
    view360Image: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=1600&q=80",
    description: "مخصوص جلسات کاری مهم، جشن‌های تولد خاص و مجهز به پروژکتور نمایش اسلاید.",
    coordinates: { x: 70, y: 65 },
    shape: "rectangle",
    isVip: true,
  },
  {
    id: "T-06",
    sectionId: "terrace",
    name: "میز تراس شماره ۶ - ویوی برج و شهر",
    capacity: 4,
    status: "available",
    minDeposit: 250000,
    view360Title: "ویوی ۳۶۰ درجه پانوراما از تراس فضای باز در شب",
    view360Image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80",
    description: "چشم‌انداز بی‌نظیر ۳۶۰ درجه از چراغ‌های شهر، مجهز به گرم‌کن‌های گرمایشی مدرن.",
    coordinates: { x: 35, y: 85 },
    shape: "square",
  },
  {
    id: "T-07",
    sectionId: "terrace",
    name: "میز تراس شماره ۷ - کنار شومینه فضای باز",
    capacity: 2,
    status: "reserved",
    minDeposit: 200000,
    view360Title: "ویوی ۳۶۰ درجه کنار شومینه تراس مدرن",
    view360Image: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1600&q=80",
    description: "فضای فوق‌العاده گرم و رمانتیک کنار آتش‌پاد غربی تراس.",
    coordinates: { x: 65, y: 85 },
    shape: "round",
  }
];

export const GUESTS_CRM = [
  {
    id: "CRM-101",
    name: "مهندس علی صادقی",
    phone: "۰۹۱۲۳۴۵۶۷۸۹",
    tier: "VIP Gold",
    visits: 14,
    totalSpent: "۱۲,۴۰۰,۰۰۰ تومان",
    favTable: "میز VIP شماره ۴",
    allergies: "حساسیت به پنی‌سیلین و میگو",
    notes: "دوستدار استیک مدیوم؛ همیشه صندلی رو به پنجره را ترجیح می‌دهد.",
    lastVisit: "۱۴۰۳/۰۵/۱۵",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: "CRM-102",
    name: "دکتر سارا ابراهیمی",
    phone: "۰۹۱۹۸۷۶۵۴۳۲",
    tier: "Platinum Corporate",
    visits: 28,
    totalSpent: "۲۸,۹۰۰,۰۰۰ تومان",
    favTable: "میز تراس شماره ۶",
    allergies: "رژیم غذایی فاقد گلوتن (Gluten-Free)",
    notes: "مشتری سازمانی؛ سفارش همیشگی سالاد سزار و ماهی سالمون.",
    lastVisit: "۱۴۰۳/۰۵/۲۸",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: "CRM-103",
    name: "امیرحسین رضایی",
    phone: "۰۹۳۵۱۱۱۲۲۳۳",
    tier: "Silver Regular",
    visits: 5,
    totalSpent: "۳,۸۰۰,۰۰۰ تومان",
    favTable: "میز شماره ۲ - کنار آب‌نما",
    allergies: "ندارد",
    notes: "سالگرد ازدواج در تاریخ ۱۰ مهرماه.",
    lastVisit: "۱۴۰۳/۰۴/۱۰",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
  }
];

export const CAMPAIGNS = [
  {
    id: "CAMP-1",
    title: "جشنواره تابستانه VIP: ۲۰٪ تخفیف رزرو آنلاین میزهای ۳۶۰ درجه",
    subtitle: "با رزرو آنلاین هر یک از میزهای VIP، از ۲۰٪ تخفیف روی فاکتور و نوشیدنی خوشامدگویی رایگان بهره‌مند شوید.",
    code: "VIP2026",
    discountPercent: 20,
    validUntil: "۱۵ مرداد ۱۴۰۵",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80",
    badge: "ویژه رزرو آنلاین"
  },
  {
    id: "CAMP-2",
    title: "شب‌های موسیقی زنده جاز & استیک پرایم",
    subtitle: "پنجشنبه‌ها همراه با اجرای زنده پیانو و ۲۰٪ تخفیف سفارش استیک فیله مینیون.",
    code: "JAZZNIGHT",
    discountPercent: 15,
    validUntil: "پایان تابستان",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80",
    badge: "رویداد اختصاصی"
  }
];

export const REWARDS = [
  { id: 1, title: "اسکوپ بستنی لاهوا با نوتلا", pointsReq: 250, icon: "Cake" },
  { id: 2, title: "موکتیل کهکشان اختصاصی رایگان", pointsReq: 400, icon: "Coffee" },
  { id: 3, title: "پیش‌غذا یا سالاد سزار رایگان", pointsReq: 600, icon: "Salad" },
  { id: 4, title: "ارتقای رایگان میز به غرفه VIP", pointsReq: 1000, icon: "Crown" },
];
