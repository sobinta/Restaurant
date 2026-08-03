const text = (de, en, fa, ar) => ({ de, en, fa, ar });

export const categories = [
  { id: 'all', label: text('Alle', 'All', 'همه', 'الكل') },
  { id: 'signature', label: text('Signaturen', 'Signatures', 'منتخب سرآشپز', 'توقيع الشيف') },
  { id: 'main', label: text('Hauptgänge', 'Main courses', 'غذای اصلی', 'الأطباق الرئيسية') },
  { id: 'starter', label: text('Vorspeisen', 'Starters', 'پیش‌غذا', 'المقبلات') },
  { id: 'dessert', label: text('Desserts', 'Desserts', 'دسر', 'الحلويات') },
];

export const dishes = [
  {
    id: 1,
    category: 'signature',
    name: text('Entenbrust · Safran · Berberitze', 'Duck · Saffron · Barberry', 'سینه اردک، زعفران و زرشک', 'صدر البط والزعفران والبرباريس'),
    description: text('Rosa gebratene Entenbrust, geräucherte Aubergine, Safranjus und wilde Kräuter.', 'Rose-roasted duck, smoked aubergine, saffron jus and wild herbs.', 'سینه اردک برشته، بادمجان دودی، سس زعفران و سبزی‌های وحشی.', 'صدر بط محمّر، باذنجان مدخّن، صلصة الزعفران وأعشاب برية.'),
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=88',
    price: 38,
    time: 24,
    rating: 4.9,
    tags: ['halal', 'signature'],
  },
  {
    id: 2,
    category: 'signature',
    name: text('Lammrücken · Pistazie · Schwarzer Knoblauch', 'Lamb · Pistachio · Black Garlic', 'راسته بره، پسته و سیر سیاه', 'لحم الضأن والفستق والثوم الأسود'),
    description: text('Holzkohle-Lamm, Pistazienkruste, schwarzer Knoblauch und Granatapfelreduktion.', 'Charcoal lamb, pistachio crust, black garlic and pomegranate reduction.', 'بره زغالی با پوسته پسته، سیر سیاه و عصاره انار.', 'لحم ضأن على الفحم بقشرة الفستق والثوم الأسود ودبس الرمان.'),
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=88',
    price: 42,
    time: 28,
    rating: 5,
    tags: ['halal', 'signature'],
  },
  {
    id: 3,
    category: 'main',
    name: text('Nordischer Lachs · Limette · Dill', 'Nordic Salmon · Lime · Dill', 'سالمون، لیمو و شوید', 'سلمون بالليمون والشبت'),
    description: text('Sanft gegarter Lachs, Dillöl, fermentierte Limette und saisonales Gemüse.', 'Slow-cooked salmon, dill oil, fermented lime and seasonal vegetables.', 'سالمون آرام‌پز، روغن شوید، لیموی تخمیری و سبزیجات فصل.', 'سلمون مطهو ببطء وزيت الشبت والليمون المخمّر وخضار موسمية.'),
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1000&q=88',
    price: 34,
    time: 22,
    rating: 4.8,
    tags: ['glutenFree', 'omega'],
  },
  {
    id: 4,
    category: 'main',
    name: text('Waldpilz-Risotto · Trüffel', 'Wild Mushroom Risotto · Truffle', 'ریزوتوی قارچ وحشی و ترافل', 'ريزوتو الفطر البري والكمأة'),
    description: text('Carnaroli-Reis, Waldpilze, gereifter Parmesan und schwarzer Trüffel.', 'Carnaroli rice, forest mushrooms, aged parmesan and black truffle.', 'برنج کارنارولی، قارچ جنگلی، پارمزان کهنه و ترافل سیاه.', 'أرز كارنارولي وفطر الغابة وبارميزان معتّق وكمأة سوداء.'),
    image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=1000&q=88',
    price: 29,
    time: 20,
    rating: 4.8,
    tags: ['vegetarian'],
  },
  {
    id: 5,
    category: 'starter',
    name: text('Burrata · Pfirsich · Sumach', 'Burrata · Peach · Sumac', 'بوراتا، هلو و سماق', 'بوراتا والخوخ والسماق'),
    description: text('Cremige Burrata, gegrillter Pfirsich, Sumach, Basilikum und Pistazie.', 'Creamy burrata, grilled peach, sumac, basil and pistachio.', 'بوراتای خامه‌ای، هلوی گریل‌شده، سماق، ریحان و پسته.', 'بوراتا كريمية وخوخ مشوي وسماق وريحان وفستق.'),
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1000&q=88',
    price: 19,
    time: 12,
    rating: 4.7,
    tags: ['vegetarian'],
  },
  {
    id: 6,
    category: 'starter',
    name: text('Jakobsmuschel · Safran-Beurre-blanc', 'Scallop · Saffron Beurre Blanc', 'صدف دریایی با سس کره زعفرانی', 'محار بصلصة الزبدة والزعفران'),
    description: text('Gebratene Jakobsmuscheln, Safran-Beurre-blanc, Fenchel und Zitrus.', 'Seared scallops, saffron beurre blanc, fennel and citrus.', 'صدف گریل‌شده، سس کره زعفرانی، رازیانه و مرکبات.', 'محار مشوي وصلصة زبدة بالزعفران وشمر وحمضيات.'),
    image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=1000&q=88',
    price: 24,
    time: 16,
    rating: 4.9,
    tags: ['glutenFree'],
  },
  {
    id: 7,
    category: 'dessert',
    name: text('Dunkle Schokolade · Rose · Himbeere', 'Dark Chocolate · Rose · Raspberry', 'شکلات تلخ، رز و تمشک', 'شوكولاتة داكنة وورد وتوت'),
    description: text('Warmer Schokoladenkern, Rosencreme, Himbeersorbet und Kakaonibs.', 'Warm chocolate centre, rose cream, raspberry sorbet and cacao nibs.', 'قلب گرم شکلات، کرم گل رز، سوربه تمشک و دانه کاکائو.', 'قلب شوكولاتة دافئ وكريمة الورد وسوربيه التوت وحبوب الكاكاو.'),
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=1000&q=88',
    price: 16,
    time: 14,
    rating: 4.9,
    tags: ['signature'],
  },
  {
    id: 8,
    category: 'dessert',
    name: text('Safran-Panna-cotta · Orange', 'Saffron Panna Cotta · Orange', 'پاناکوتای زعفران و پرتقال', 'بانا كوتا بالزعفران والبرتقال'),
    description: text('Seidige Safrancreme, Blutorange, Kardamom und Mandelkrokant.', 'Silky saffron cream, blood orange, cardamom and almond brittle.', 'کرم ابریشمی زعفران، پرتقال خونی، هل و بادام کاراملی.', 'كريمة زعفران ناعمة وبرتقال دموي وهيل ولوز مكرمل.'),
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=1000&q=88',
    price: 15,
    time: 10,
    rating: 4.8,
    tags: ['glutenFree'],
  },
];

export const tables = [
  { id: 'T1', seats: 2, area: 'window', x: 18, y: 28, status: 'available' },
  { id: 'T2', seats: 4, area: 'salon', x: 44, y: 25, status: 'available' },
  { id: 'T3', seats: 4, area: 'salon', x: 70, y: 28, status: 'reserved' },
  { id: 'T4', seats: 6, area: 'chef', x: 25, y: 65, status: 'available', vip: true },
  { id: 'T5', seats: 8, area: 'salon', x: 54, y: 64, status: 'available', vip: true },
  { id: 'T6', seats: 2, area: 'window', x: 82, y: 67, status: 'available' },
];

export const events = [
  {
    date: '2026-09-14',
    title: text('Jazz & Tasting Night', 'Jazz & Tasting Night', 'شب جاز و منوی مزه', 'ليلة الجاز وقائمة التذوق'),
    description: text('Sechs Gänge, Live-Trio und eine eigens komponierte alkoholfreie Begleitung.', 'Six courses, a live trio and a composed alcohol-free pairing.', 'شش مرحله غذا، اجرای زنده و نوشیدنی‌های بدون الکل ویژه.', 'ستة أطباق وفرقة موسيقية حية ومشروبات مختارة بدون كحول.'),
  },
  {
    date: '2026-09-28',
    title: text('Chef’s Counter', 'Chef’s Counter', 'میز ویژه سرآشپز', 'طاولة الشيف'),
    description: text('Zwölf Plätze, offene Küche und ein Menü, das nur an diesem Abend serviert wird.', 'Twelve seats, an open kitchen and a menu served for one night only.', 'دوازده صندلی، آشپزخانه باز و منویی ویژه فقط برای یک شب.', 'اثنا عشر مقعداً ومطبخ مفتوح وقائمة خاصة لليلة واحدة.'),
  },
];

export const localize = (value, lang) => value?.[lang] ?? value?.en ?? value;
