import { dishes, events } from './siteData';

const text = (de, en, fa, ar) => ({ de, en, fa, ar });
const slugs = ['duck-saffron-barberry', 'lamb-pistachio-garlic', 'nordic-salmon', 'wild-mushroom-risotto', 'burrata-peach-sumac', 'scallop-saffron', 'dark-chocolate-rose', 'saffron-panna-cotta'];
const galleryImages = [
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1500&q=88',
  'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=1500&q=88',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1500&q=88',
];

export const enrichedDishes = dishes.map((dish, index) => ({
  ...dish,
  slug: slugs[index],
  available: true,
  video: '/dish-film.mp4',
  gallery: [dish.image, ...galleryImages.slice(index % 3).concat(galleryImages.slice(0, index % 3)).slice(0, 2)],
  story: text(
    'Ein Gericht, das persische Erinnerung mit der Präzision einer Berliner Küche verbindet. Jede Komponente wird einzeln entwickelt und erst im letzten Moment auf dem Teller zusammengeführt.',
    'A dish that connects Persian memory with the precision of a Berlin kitchen. Every component is developed separately and brought together only at the final moment.',
    'این بشقاب خاطره‌های آشپزی ایرانی را با دقت یک آشپزخانه مدرن برلینی پیوند می‌دهد. هر جزء جداگانه شکل می‌گیرد و در آخرین لحظه کنار هم قرار می‌گیرد.',
    'طبق يجمع ذاكرة المطبخ الفارسي بدقة مطبخ برليني معاصر. يُحضّر كل عنصر على حدة ثم تجتمع المكونات في اللحظة الأخيرة.'
  ),
  origin: text('Saisonale Höfe · Brandenburg / Gewürze · Khorasan', 'Seasonal farms · Brandenburg / Spices · Khorasan', 'مزارع فصلی براندنبورگ / ادویه خراسان', 'مزارع براندنبورغ الموسمية / توابل خراسان'),
  allergens: index % 3 === 0 ? ['nuts', 'milk'] : index % 3 === 1 ? ['milk'] : ['fish'],
  nutrition: { calories: 420 + index * 24, protein: 24 + index * 2, carbs: 18 + index * 3 },
  pairings: text('Verjus, persischer Tee und ein leichter Zitrusgang', 'Verjus, Persian tea and a bright citrus course', 'آبغوره، چای ایرانی و دسری با مرکبات', 'عصير الحصرم والشاي الفارسي وطبق حمضيات خفيف'),
}));

export const eventDetails = events.map((event, index) => ({
  ...event,
  id: `event-${index + 1}`,
  slug: index === 0 ? 'jazz-tasting-night' : 'chefs-counter',
  cover: index === 0
    ? 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1800&q=88'
    : 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1800&q=88',
  price: index === 0 ? 148 : 195,
  capacity: index === 0 ? 42 : 12,
  remaining: index === 0 ? 11 : 4,
  performer: index === 0 ? 'Mina Rahimi Trio' : 'Chef Arman Vaziri',
  program: index === 0
    ? ['18:30 · Doors & welcome', '19:15 · First movement', '20:45 · Live interlude', '22:15 · Final course']
    : ['18:45 · Counter welcome', '19:00 · Ingredient story', '19:30 · Twelve-course journey', '23:00 · Kitchen farewell'],
  menu: text('Sechs Gänge · alkoholfreie Begleitung · Mitternachtsdessert', 'Six courses · alcohol-free pairing · midnight dessert', 'شش مرحله غذا، نوشیدنی ویژه و دسر نیمه‌شب', 'ستة أطباق ومشروبات مختارة وحلوى منتصف الليل'),
}));

export const panoramaUrl = '/table-panorama-arshida-v2.png';

export const lunchBuffet = {
  id: 'weekday-lunch-buffet',
  days: text('Montag–Freitag', 'Monday–Friday', 'دوشنبه تا جمعه', 'الاثنين–الجمعة'),
  time: '11:30–15:30',
  adultPrice: 12.5,
  childPrice: 8.99,
  eyebrow: text('Arshida am Mittag', 'Arshida at noon', 'آرشیدا در نیمروز', 'أرشيدا وقت الظهيرة'),
  title: text('Der Mittagstisch wird zur offenen Tafel.', 'Lunch becomes an open table.', 'ناهار، به یک سفره باز تبدیل می‌شود.', 'الغداء يتحول إلى مائدة مفتوحة.'),
  description: text(
    'Warme Gerichte, frische Salate und persische Akzente – frei zusammengestellt und jeden Werktag neu komponiert.',
    'Warm dishes, fresh salads and Persian accents — freely combined and newly composed every weekday.',
    'غذاهای گرم، سالادهای تازه و طعم‌های ایرانی؛ انتخاب آزاد و ترکیبی تازه برای هر روز کاری.',
    'أطباق دافئة وسلطات طازجة ولمسات فارسية — اختيارات حرة وتشكيلة متجددة كل يوم عمل.'
  ),
  adultLabel: text('Erwachsene', 'Adults', 'بزرگسالان', 'البالغون'),
  childLabel: text('Kinder unter 12', 'Children under 12', 'کودکان زیر ۱۲ سال', 'الأطفال دون 12 عاماً'),
  reserve: text('Buffet-Tisch reservieren', 'Reserve a buffet table', 'رزرو میز بوفه', 'احجز طاولة البوفيه'),
  viewMenu: text('Im Menü ansehen', 'View in the menu', 'مشاهده در منو', 'عرضه في القائمة'),
  popupTitle: text('Mittag in Berlin, neu serviert.', 'Berlin lunch, served differently.', 'ناهار برلین، با روایتی تازه.', 'غداء برلين، بأسلوب مختلف.'),
};

export const rewards = [
  { id: 'dessert', points: 250, title: text('Dessert des Küchenchefs', 'Chef’s dessert', 'دسر ویژه سرآشپز', 'حلوى الشيف') },
  { id: 'pairing', points: 450, title: text('Alkoholfreie Begleitung', 'Alcohol-free pairing', 'نوشیدنی همراه بدون الکل', 'مشروبات مرافقة بلا كحول') },
  { id: 'counter', points: 800, title: text('Chef’s-Counter-Upgrade', 'Chef’s Counter upgrade', 'ارتقا به میز سرآشپز', 'ترقية إلى طاولة الشيف') },
];

export const orderStatusCopy = {
  submitted: text('Bestellung eingegangen', 'Order received', 'سفارش ثبت شد', 'تم استلام الطلب'),
  confirmed: text('Vom Restaurant bestätigt', 'Confirmed by restaurant', 'تأیید رستوران', 'أكده المطعم'),
  preparing: text('Vorbereitung', 'Preparing', 'در حال آماده‌سازی', 'قيد التحضير'),
  cooking: text('In der Küche / im Ofen', 'Cooking / in the oven', 'در حال پخت / داخل فر', 'قيد الطهي / في الفرن'),
  quality_check: text('Letzte Qualitätskontrolle', 'Final quality check', 'کنترل نهایی کیفیت', 'فحص الجودة النهائي'),
  ready: text('Bereit zur Übergabe', 'Ready for handoff', 'آماده تحویل', 'جاهز للتسليم'),
  courier_handoff: text('An Kurier übergeben', 'With the courier', 'تحویل پیک شد', 'مع مندوب التوصيل'),
  completed: text('Zugestellt', 'Delivered', 'تحویل داده شد', 'تم التسليم'),
};

export const pageCopy = {
  back: text('Zurück', 'Back', 'بازگشت', 'رجوع'), favorite: text('Merken', 'Save', 'ذخیره', 'حفظ'), share: text('Teilen', 'Share', 'اشتراک‌گذاری', 'مشاركة'),
  menuArchive: text('Die Speisekarte', 'The full menu', 'فهرست کامل منو', 'القائمة الكاملة'),
  menuArchiveTitle: text('Jeder Gang, auf einen Blick.', 'Every course, at a glance.', 'تمام بشقاب‌ها، در یک نگاه.', 'كل الأطباق، بنظرة واحدة.'),
  menuArchiveIntro: text('Entdecken, vergleichen und direkt bestellen — mit der Ruhe einer Speisekarte und der Klarheit eines persönlichen Service.', 'Discover, compare and order directly — with the calm of a menu and the clarity of personal service.', 'کشف کنید، مقایسه کنید و مستقیم سفارش دهید؛ با آرامش یک منوی لوکس و وضوح یک سرویس شخصی.', 'اكتشف وقارن واطلب مباشرة — بهدوء قائمة راقية ووضوح خدمة شخصية.'),
  viewMore: text('Mehr aus dieser Kategorie', 'View more in this category', 'مشاهده موارد بیشتر این دسته', 'عرض المزيد من هذه الفئة'),
  viewFullMenu: text('Vollständiges Menü', 'View full menu', 'مشاهده منوی کامل', 'عرض القائمة الكاملة'),
  orderAdded: text('Zur Bestellung hinzugefügt', 'Added to your order', 'به سفارش اضافه شد', 'تمت الإضافة إلى طلبك'),
  orderPanel: text('Ihre Auswahl', 'Your selection', 'انتخاب شما', 'اختيارك'),
  cartShortcut: text('Bestellung ansehen', 'View your order', 'مشاهده سفارش', 'عرض طلبك'),
  clearFilters: text('Filter zurücksetzen', 'Clear filters', 'پاک‌کردن فیلترها', 'مسح عوامل التصفية'),
  buffetMenuLabel: text('Mittagsritual', 'Midday ritual', 'آیین نیمروز', 'طقوس الظهيرة'),
  filmIntro: text('Der letzte Blick: Bewegung, Textur und der Moment vor dem Service.', 'A final look: movement, texture and the moment before service.', 'نگاه آخر؛ حرکت، بافت و لحظه‌ای پیش از سرو.', 'نظرة أخيرة: الحركة والملمس واللحظة قبل التقديم.'),
  film: text('Der Film zum Gericht', 'The dish film', 'فیلم کوتاه غذا', 'فيلم الطبق'), gallery: text('In jedem Detail', 'Every detail', 'تمام جزئیات', 'كل التفاصيل'),
  chefStory: text('Die Geschichte des Küchenchefs', 'The chef’s story', 'روایت سرآشپز', 'قصة الشيف'), provenance: text('Herkunft', 'Provenance', 'منشأ مواد', 'المصدر'),
  nutrition: text('Nährwerte', 'Nutrition', 'ارزش غذایی', 'القيمة الغذائية'), allergens: text('Allergene', 'Allergens', 'آلرژن‌ها', 'مسببات الحساسية'), pairing: text('Empfohlene Begleitung', 'Recommended pairing', 'پیشنهاد همراه', 'المرافقة المقترحة'),
  calories: text('Kalorien', 'Calories', 'کالری', 'سعرات'), protein: text('Protein', 'Protein', 'پروتئین', 'بروتين'), carbs: text('Kohlenhydrate', 'Carbohydrates', 'کربوهیدرات', 'كربوهيدرات'),
  add: text('Zur Bestellung', 'Add to order', 'افزودن به سفارش', 'أضف إلى الطلب'), customize: text('Wünsche für die Küche', 'Kitchen notes', 'توضیحات برای آشپزخانه', 'ملاحظات للمطبخ'),
  eventProgram: text('Der Ablauf des Abends', 'The evening programme', 'برنامه کامل شب', 'برنامج الأمسية'), eventMenu: text('Das Menü des Abends', 'The evening menu', 'منوی ویژه شب', 'قائمة الأمسية'),
  seatsLeft: text('verfügbare Plätze', 'places remaining', 'جای باقی‌مانده', 'أماكن متبقية'), bookEvent: text('Abend reservieren', 'Reserve this evening', 'رزرو این برنامه', 'احجز هذه الأمسية'),
  liveOrder: text('Live-Bestellung', 'Live order', 'رهگیری زنده سفارش', 'تتبع الطلب المباشر'),
  trackerJourney: text('Live-Status Ihrer Bestellung', 'Live status of your order', 'وضعیت زنده سفارش شما', 'الحالة المباشرة لطلبك'),
  orderJourney: text('Ihre Bestellung in Bewegung', 'Your order in motion', 'مسیر زنده سفارش شما', 'رحلة طلبك المباشرة'),
  kitchenToDoor: text('Von der Küche bis zu Ihnen.', 'From our kitchen to you.', 'از آشپزخانه تا دست شما.', 'من مطبخنا إليك.'),
  nowServing: text('Aktueller Schritt', 'Current step', 'مرحله فعلی', 'المرحلة الحالية'),
  statusUpdatesAutomatically: text('Der nächste Schritt erscheint hier automatisch.', 'The next step appears here automatically.', 'مرحله بعدی به‌صورت خودکار همین‌جا نمایش داده می‌شود.', 'ستظهر المرحلة التالية هنا تلقائياً.'),
  liveSignal: text('Live-Signal', 'Live signal', 'سیگنال زنده', 'إشارة مباشرة'),
  liveEstimate: text('Aktuelle Schätzung', 'Live estimate', 'زمان تخمینی زنده', 'الوقت التقديري المباشر'),
  lastUpdated: text('Zuletzt aktualisiert', 'Last updated', 'آخرین به‌روزرسانی', 'آخر تحديث'),
  restaurant: text('Restaurant Workspace', 'Restaurant workspace', 'پنل رستوران', 'مساحة إدارة المطعم'),
  skipIntro: text('Intro überspringen', 'Skip intro', 'رد کردن مقدمه', 'تخطي المقدمة'),
};
