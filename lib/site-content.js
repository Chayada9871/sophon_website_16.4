const languages = ["en", "th"];

function text(en, th) {
  return { en, th };
}

function isLocalizedValue(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const keys = Object.keys(value);

  return keys.length === languages.length && languages.every((language) => keys.includes(language));
}

export function localize(value, language) {
  if (Array.isArray(value)) {
    return value.map((item) => localize(item, language));
  }

  if (isLocalizedValue(value)) {
    return value[language] ?? value.en;
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, localize(entry, language)])
    );
  }

  return value;
}

export const storeProfile = {
  name: "Sophon Market",
  storeName: text("Sophon Supermarket", "โสภณซุปเปอร์"),
  tagline: text(
    "Fresh picks, weekly deals, and easy store contact",
    "สินค้าคัดสรร โปรโมชั่นประจำสัปดาห์ และการติดต่อร้านที่ง่ายขึ้น"
  ),
  phoneDisplay: "065 262 6861",
  phoneHref: "tel:0652626861",
  hours: text("Open daily 07:30 - 19:30", "เปิดทุกวัน 07:30 - 19:30"),
  address: text(
    "99/9 Moo 6, Phlu Ta Luang, Sattahip, Chon Buri 20150",
    "99/9 หมู่ 6 ตำบลพลูตาหลวง อำเภอสัตหีบ จังหวัดชลบุรี 20150"
  ),
  mapsUrl: "https://maps.app.goo.gl/sRpQ1VrNCvYdVP1U9",
  mapEmbed: "https://www.google.com/maps?q=https://maps.app.goo.gl/sRpQ1VrNCvYdVP1U9&output=embed",
};

export const brochureLinkHref = "/brochure/latest";

export const headerContent = {
  topbarLabel: text("Daily support", "ติดต่อร้านทุกวัน"),
  topbarPromo: text("Fresh promotions", "โปรโมชั่นเด่น"),
  weeklyBrochure: text("Weekly brochure", "โบรชัวร์ประจำสัปดาห์"),
  openBrochure: text("Open brochure", "เปิดโบรชัวร์"),
  contactStore: text("Contact store", "ติดต่อร้าน"),
  searchPlaceholder: text(
    "Search departments, brochure, or promotions",
    "ค้นหาหมวดสินค้า โบรชัวร์ หรือโปรโมชั่น"
  ),
  searchButton: text("Browse", "ค้นหา"),
  languageLabel: text("Language", "ภาษา"),
  navNote: text(
    "Brochure, promotions, and pickup support in one place.",
    "รวมโบรชัวร์ โปรโมชั่น และข้อมูลการรับสินค้าที่ร้านไว้ในที่เดียว"
  ),
};

export const footerContent = {
  description: text(
    "Grocery essentials, weekly deals, and easy store contact in one place.",
    "รวมสินค้าอุปโภคบริโภค โปรโมชั่นประจำสัปดาห์ และช่องทางติดต่อร้านไว้ในที่เดียว"
  ),
  exploreHeading: text("Explore", "สำรวจเว็บไซต์"),
  storeInfoHeading: text("Store Info", "ข้อมูลร้าน"),
  quickActionsHeading: text("Quick Actions", "ทางลัด"),
  viewBrochure: text("View brochure", "ดูโบรชัวร์"),
  seePromotions: text("See promotions", "ดูโปรโมชั่น"),
  openGoogleMaps: text("Open Google Maps", "เปิดใน Google Maps"),
};

export const navItems = [
  { href: "/", label: text("Home", "หน้าแรก") },
  { href: "/products", label: text("Products", "สินค้า") },
  { href: "/promotions", label: text("Promotions", "โปรโมชั่น") },
  { href: "/shopping", label: text("Online Order", "สั่งซื้อออนไลน์") },
  { href: "/contact", label: text("Contact", "ติดต่อเรา") },
];

export const staffNavItems = [
  { href: "/staff/promotions", label: text("Manage Promotions", "จัดการโปรโมชั่น") },
  { href: "/staff/brochures", label: text("Manage Brochures", "จัดการโบรชัวร์") },
];

export const heroStats = [
  { value: "8", label: text("popular departments", "หมวดหมู่ยอดนิยม") },
  { value: "7:30 - 19:30", label: text("daily opening hours", "เวลาเปิดทำการ") },
  { value: text("Fast", "รวดเร็ว"), label: text("phone and chat support", "รองรับโทรและแชต") },
];

export const categoryCards = [
  {
    slug: "dry-goods",
    title: text("Dry Goods", "อาหารแห้ง"),
    subtitle: text(
      "Pantry staples and everyday kitchen essentials.",
      "ของใช้ประจำครัวและวัตถุดิบพื้นฐานสำหรับทุกวัน"
    ),
    image: "/assets/dry.png",
    intro: text(
      "Dry goods cover the shelf-stable foods that help families keep the kitchen ready for everyday meals.",
      "อาหารแห้งคือสินค้าที่เก็บไว้ได้นานและช่วยให้ครัวพร้อมสำหรับมื้อประจำวันอยู่เสมอ"
    ),
    guideDescription: text(
      "Dry goods are pantry essentials such as rice, noodles, seasonings, sauces, canned foods, and other shelf-stable ingredients that support everyday cooking at home. Customers usually choose this category when they want long-lasting kitchen basics that are easy to store, simple to use, and helpful for meal planning, quick preparation, and keeping the household ready for daily meals.",
      "อาหารแห้งคือสินค้าพื้นฐานในตู้กับข้าว เช่น ข้าว เส้นก๋วยเตี๋ยว เครื่องปรุง ซอส อาหารกระป๋อง และวัตถุดิบที่เก็บไว้ได้นาน ซึ่งช่วยรองรับการทำอาหารในชีวิตประจำวัน ลูกค้ามักเลือกหมวดนี้เมื่อต้องการของใช้ในครัวที่เก็บง่าย ใช้งานสะดวก และเหมาะกับการวางแผนมื้ออาหารหรือเตรียมของสำรองไว้ใช้ในบ้าน"
    ),
    whatIs: text(
      "This category usually includes long-keeping ingredients and pantry basics that support simple cooking, meal prep, and household stocking.",
      "หมวดนี้มักรวมวัตถุดิบที่เก็บได้นานและของใช้พื้นฐานในตู้กับข้าว ซึ่งเหมาะกับการทำอาหารง่าย ๆ การเตรียมมื้ออาหาร และการซื้อเก็บไว้ใช้"
    ),
    commonItems: [
      text("Rice, noodles, and instant meal staples", "ข้าว เส้นก๋วยเตี๋ยว และอาหารสำเร็จรูปพื้นฐาน"),
      text("Seasonings, sauces, and dry cooking ingredients", "เครื่องปรุง ซอส และวัตถุดิบแห้งสำหรับทำอาหาร"),
      text("Canned foods and backup pantry items", "อาหารกระป๋องและของสำรองสำหรับเก็บไว้ในบ้าน"),
    ],
    customerUse: text(
      "Customers often choose dry goods based on cooking habits, storage life, package size, and how often the item will be used at home.",
      "ลูกค้ามักเลือกอาหารแห้งจากลักษณะการทำอาหาร อายุการเก็บรักษา ขนาดบรรจุ และความถี่ในการใช้งานภายในบ้าน"
    ),
    whyUseful: text(
      "A well-stocked dry goods shelf makes it easier to plan meals, handle busy weekdays, and keep essential ingredients on hand.",
      "การมีอาหารแห้งติดบ้านช่วยให้วางแผนมื้ออาหารได้ง่าย รองรับวันเร่งรีบ และมีวัตถุดิบพื้นฐานพร้อมใช้อยู่เสมอ"
    ),
    tips: [
      text("Choose pack sizes that match how quickly your household uses the item.", "เลือกขนาดบรรจุให้เหมาะกับปริมาณการใช้ของคนในบ้าน"),
      text("Check expiry dates and storage instructions before buying larger quantities.", "ตรวจสอบวันหมดอายุและวิธีเก็บรักษาก่อนซื้อจำนวนมาก"),
      text("Keep a mix of everyday staples and backup pantry items for convenience.", "ควรมีทั้งของใช้ประจำและของสำรองในตู้กับข้าวเพื่อความสะดวก"),
    ],
    highlights: [
      text("Long shelf life for household planning", "เก็บได้นาน เหมาะกับการวางแผนของใช้ในบ้าน"),
      text("Useful for daily cooking and quick meal prep", "เหมาะกับการทำอาหารประจำวันและเตรียมมื้ออาหาร"),
      text("Easy to stock up for family convenience", "ซื้อเก็บได้ง่าย ช่วยให้ครอบครัวใช้งานสะดวก"),
    ],
  },
  {
    slug: "drinks",
    title: text("Drinks", "เครื่องดื่ม"),
    subtitle: text(
      "Soft drinks, juices, and ready-to-go refreshment.",
      "เครื่องดื่ม น้ำผลไม้ และตัวเลือกพร้อมดื่มที่หยิบง่าย"
    ),
    image: "/assets/drink.png",
    intro: text(
      "The drinks category brings together everyday refreshment choices for home, work, travel, and family sharing.",
      "หมวดเครื่องดื่มรวมตัวเลือกสำหรับการดื่มประจำวัน ไม่ว่าจะที่บ้าน ที่ทำงาน ระหว่างเดินทาง หรือใช้ร่วมกันในครอบครัว"
    ),
    guideDescription: text(
      "The drinks category includes bottled water, juices, soft drinks, ready-to-drink tea or coffee, and other beverages chosen for refreshment, convenience, and daily hydration. Customers often use this category to find drinks for home, work, travel, or sharing with family and guests, and they usually choose items by taste, size, sweetness, and the occasion they need the drink for.",
      "หมวดเครื่องดื่มรวมทั้งน้ำดื่ม น้ำผลไม้ น้ำอัดลม ชาหรือกาแฟพร้อมดื่ม และเครื่องดื่มอื่น ๆ ที่เหมาะกับการเพิ่มความสดชื่น ความสะดวก และการดื่มในชีวิตประจำวัน ลูกค้ามักเลือกหมวดนี้เพื่อหาเครื่องดื่มสำหรับบ้าน ที่ทำงาน การเดินทาง หรือใช้ร่วมกับครอบครัวและแขก โดยมักตัดสินใจจากรสชาติ ขนาด ความหวาน และโอกาสในการใช้งาน"
    ),
    whatIs: text(
      "This category includes ready-to-drink options and household beverage staples, from water and juices to soft drinks and energy-boosting choices.",
      "หมวดนี้ครอบคลุมทั้งเครื่องดื่มพร้อมดื่มและตัวเลือกพื้นฐานในบ้าน ตั้งแต่น้ำดื่ม น้ำผลไม้ ไปจนถึงน้ำอัดลมและเครื่องดื่มที่ให้พลังงาน"
    ),
    commonItems: [
      text("Bottled water, juices, and flavored drinks", "น้ำดื่มบรรจุขวด น้ำผลไม้ และเครื่องดื่มปรุงแต่งรส"),
      text("Soft drinks, sparkling drinks, and refreshment cans", "น้ำอัดลม เครื่องดื่มซ่า และเครื่องดื่มแบบกระป๋อง"),
      text("Ready-to-drink tea, coffee, and sports beverages", "ชา กาแฟพร้อมดื่ม และเครื่องดื่มเกลือแร่"),
    ],
    customerUse: text(
      "Shoppers often choose beverages by taste, sugar level, caffeine content, serving size, and whether the drink is for daily use or special occasions.",
      "ลูกค้ามักเลือกเครื่องดื่มจากรสชาติ ระดับความหวาน ปริมาณคาเฟอีน ขนาดบรรจุ และวัตถุประสงค์ในการดื่มว่าใช้ประจำวันหรือในโอกาสพิเศษ"
    ),
    whyUseful: text(
      "Drinks are one of the fastest-moving supermarket categories because they support hydration, convenience, entertaining guests, and quick energy during the day.",
      "เครื่องดื่มเป็นหนึ่งในหมวดที่ลูกค้าเลือกซื้อบ่อย เพราะช่วยเรื่องความสดชื่น ความสะดวก การต้อนรับแขก และการเติมพลังระหว่างวัน"
    ),
    tips: [
      text("Compare bottle or can size with how many people will share it.", "เปรียบเทียบขนาดบรรจุกับจำนวนคนที่จะดื่มร่วมกัน"),
      text("Check whether the drink needs chilling or can be stored easily at room temperature.", "ดูว่าเครื่องดื่มควรแช่เย็นหรือเก็บที่อุณหภูมิห้องได้สะดวก"),
      text("Choose sugar or caffeine levels that fit the occasion and the customer.", "เลือกระดับความหวานหรือคาเฟอีนให้เหมาะกับผู้ดื่มและช่วงเวลา"),
    ],
    highlights: [
      text("Good for daily hydration and quick refreshment", "เหมาะกับการดื่มประจำวันและเพิ่มความสดชื่น"),
      text("Easy to choose by taste, size, and occasion", "เลือกได้ง่ายตามรสชาติ ขนาด และการใช้งาน"),
      text("Useful for home stocking and guest serving", "เหมาะกับการซื้อเก็บไว้ที่บ้านและใช้ต้อนรับแขก"),
    ],
  },
  {
    slug: "dairy",
    title: text("Dairy", "ผลิตภัณฑ์นม"),
    subtitle: text(
      "Milk, yogurt, and chilled family favorites.",
      "นม โยเกิร์ต และสินค้าความเย็นสำหรับทุกคนในบ้าน"
    ),
    image: "/assets/milk.png",
    intro: text(
      "Dairy products support breakfast routines, family nutrition, and chilled everyday convenience.",
      "ผลิตภัณฑ์นมช่วยเติมเต็มมื้อเช้า โภชนาการของครอบครัว และความสะดวกในชีวิตประจำวัน"
    ),
    guideDescription: text(
      "Dairy includes milk, yogurt, cheese, butter, and other chilled or milk-based items that are commonly used for drinking, breakfast, snacks, and simple cooking at home. Customers usually choose this category for everyday nutrition and family convenience, and they often compare products by age suitability, flavor, storage type, and how the item will be used in daily meals.",
      "ผลิตภัณฑ์นมประกอบด้วยนม โยเกิร์ต ชีส เนย และสินค้ากลุ่มนมอื่น ๆ ที่นิยมใช้สำหรับดื่ม ทานมื้อเช้า เป็นของว่าง หรือประกอบอาหารแบบง่าย ๆ ภายในบ้าน ลูกค้ามักเลือกหมวดนี้เพื่อโภชนาการในชีวิตประจำวันและความสะดวกของครอบครัว โดยมักพิจารณาจากช่วงอายุ รสชาติ รูปแบบการเก็บรักษา และลักษณะการใช้งานในมื้ออาหาร"
    ),
    whatIs: text(
      "This category focuses on refrigerated milk-based products that are commonly used for drinking, snacking, cooking, and family meal planning.",
      "หมวดนี้เน้นสินค้ากลุ่มนมและผลิตภัณฑ์แช่เย็นที่นิยมใช้ทั้งสำหรับดื่ม ทานเล่น ทำอาหาร และวางแผนมื้อของคนในบ้าน"
    ),
    commonItems: [
      text("Fresh milk, UHT milk, and flavored milk", "นมสด นมยูเอชที และนมปรุงแต่งรส"),
      text("Yogurt, drinking yogurt, and chilled snacks", "โยเกิร์ต โยเกิร์ตพร้อมดื่ม และของว่างแช่เย็น"),
      text("Butter, cheese, and cooking-related dairy items", "เนย ชีส และผลิตภัณฑ์นมสำหรับใช้ทำอาหาร"),
    ],
    customerUse: text(
      "Customers usually choose dairy by age group, nutrition needs, flavor preference, storage space, and whether the item is for drinking, breakfast, or cooking.",
      "ลูกค้ามักเลือกสินค้านมจากช่วงอายุ ความต้องการด้านโภชนาการ รสชาติ พื้นที่จัดเก็บ และวัตถุประสงค์ว่าจะใช้ดื่ม ทานมื้อเช้า หรือทำอาหาร"
    ),
    whyUseful: text(
      "Dairy is useful because it supports everyday family meals, offers convenient nutrition, and works across many different habits and age groups.",
      "หมวดนมมีความสำคัญเพราะช่วยเสริมมื้ออาหารในครอบครัว ให้โภชนาการที่หยิบใช้ได้ง่าย และเหมาะกับคนหลายช่วงวัย"
    ),
    tips: [
      text("Check storage type carefully between chilled and shelf-stable milk products.", "ตรวจสอบให้ชัดว่าสินค้าเป็นแบบแช่เย็นหรือเก็บนอกตู้เย็นได้"),
      text("Choose pack sizes that fit how quickly the product will be consumed.", "เลือกขนาดบรรจุให้เหมาะกับระยะเวลาที่จะดื่มหรือทานหมด"),
      text("Look at age suitability or nutrition labels when shopping for children or seniors.", "อ่านฉลากโภชนาการหรือช่วงอายุที่เหมาะสมเมื่อซื้อให้เด็กหรือผู้สูงอายุ"),
    ],
    highlights: [
      text("Supports breakfast and daily nutrition", "ช่วยเสริมมื้อเช้าและโภชนาการประจำวัน"),
      text("Useful for drinking, snacking, and cooking", "ใช้ได้ทั้งดื่ม ทานเล่น และประกอบอาหาร"),
      text("Popular with families and all age groups", "เป็นหมวดที่เหมาะกับครอบครัวและคนทุกวัย"),
    ],
  },
  {
    slug: "snacks",
    title: text("Snacks", "ขนมและของทานเล่น"),
    subtitle: text(
      "Grab-and-go treats for home, school, or work.",
      "ของว่างหยิบง่ายสำหรับบ้าน โรงเรียน หรือที่ทำงาน"
    ),
    image: "/assets/snack.png",
    intro: text(
      "Snacks bring convenience, enjoyment, and quick bites for busy days, travel, and sharing moments.",
      "ขนมและของทานเล่นช่วยเติมความสะดวก ความอร่อย และมื้อเบา ๆ สำหรับวันเร่งรีบ การเดินทาง หรือช่วงเวลาที่อยากแบ่งปัน"
    ),
    guideDescription: text(
      "Snacks are ready-to-eat items such as chips, biscuits, crackers, nuts, seaweed, and sweet treats that people choose for quick bites between meals or for casual enjoyment. This category is useful for lunchboxes, office breaks, travel, and sharing at home, and customers usually pick products based on flavor, portion size, convenience, and whether the snack is for one person or a group.",
      "ขนมและของทานเล่นคือสินค้าพร้อมรับประทาน เช่น มันฝรั่งทอด บิสกิต แครกเกอร์ ถั่ว สาหร่าย และของหวานต่าง ๆ ที่นิยมซื้อไว้ทานระหว่างมื้อหรือเพื่อความเพลิดเพลิน หมวดนี้เหมาะกับการใส่กล่องอาหาร ช่วงพักงาน การเดินทาง หรือแบ่งกันทานที่บ้าน โดยลูกค้ามักเลือกจากรสชาติ ปริมาณต่อซอง ความสะดวก และจำนวนคนที่จะทานร่วมกัน"
    ),
    whatIs: text(
      "This category includes ready-to-eat treats and light bites that are commonly chosen for between-meal snacking, lunchboxes, sharing, or relaxing at home.",
      "หมวดนี้รวมของทานเล่นพร้อมรับประทานที่นิยมซื้อไว้กินระหว่างมื้อ ใส่กล่องอาหารกลางวัน แบ่งกันทาน หรือทานเล่นที่บ้าน"
    ),
    commonItems: [
      text("Chips, crackers, biscuits, and cookies", "มันฝรั่งทอด แครกเกอร์ บิสกิต และคุกกี้"),
      text("Nuts, seaweed, and savory bite-size snacks", "ถั่ว สาหร่าย และของว่างรสเค็มขนาดพอดีคำ"),
      text("Sweet treats and snack packs for school or work", "ขนมหวานและแพ็กของว่างสำหรับพกไปโรงเรียนหรือที่ทำงาน"),
    ],
    customerUse: text(
      "Shoppers often choose snacks by taste, portion size, sharing needs, and whether they want an everyday snack, a lunchbox item, or something for guests.",
      "ลูกค้ามักเลือกขนมจากรสชาติ ปริมาณต่อซอง ความเหมาะกับการแบ่งกันทาน และวัตถุประสงค์ว่าใช้กินเล่นประจำวัน ใส่กล่องอาหาร หรือเตรียมไว้ต้อนรับแขก"
    ),
    whyUseful: text(
      "Snack shelves are useful because they make it easy to find convenient treats for kids, adults, office breaks, road trips, and casual occasions.",
      "หมวดขนมมีประโยชน์เพราะช่วยให้เลือกของว่างที่สะดวกได้ง่าย ทั้งสำหรับเด็ก ผู้ใหญ่ ช่วงพักงาน การเดินทาง และโอกาสสบาย ๆ"
    ),
    tips: [
      text("Look for portion sizes that match whether the snack is for one person or sharing.", "ดูขนาดบรรจุให้เหมาะกับการทานคนเดียวหรือแบ่งกันทาน"),
      text("Mix sweet and savory options when stocking snacks for the household.", "ควรมีทั้งขนมหวานและขนมเค็มเมื่อซื้อเก็บไว้ที่บ้าน"),
      text("Choose lunchbox-friendly packs when shopping for school or work.", "เลือกขนาดที่พกง่ายเมื่อซื้อไว้สำหรับโรงเรียนหรือที่ทำงาน"),
    ],
    highlights: [
      text("Easy grab-and-go choices for any time of day", "หยิบง่าย เหมาะกับทุกช่วงเวลา"),
      text("Works well for lunchboxes, travel, and sharing", "เหมาะกับกล่องอาหาร การเดินทาง และการแบ่งกันทาน"),
      text("Wide variety of sweet and savory options", "มีตัวเลือกทั้งรสหวานและรสเค็มหลากหลาย"),
    ],
  },
  {
    slug: "beauty",
    title: text("Beauty", "สุขภาพและความงาม"),
    subtitle: text(
      "Personal care products and wellness basics.",
      "ของใช้ดูแลร่างกายและสินค้าพื้นฐานด้านสุขภาพ"
    ),
    image: "/assets/beauty.png",
    intro: text(
      "Beauty and personal care products help customers manage daily hygiene, self-care, and confidence in simple routines.",
      "หมวดสุขภาพและความงามช่วยให้ลูกค้าดูแลสุขอนามัย การดูแลตัวเอง และความมั่นใจในกิจวัตรประจำวันได้ง่ายขึ้น"
    ),
    guideDescription: text(
      "Beauty and personal care products include items such as soap, shampoo, skincare, oral care, deodorant, and other daily-use essentials that support hygiene and self-care. Customers use this category to choose products that fit their skin type, routine, scent preference, and household needs, making it an important part of everyday comfort, cleanliness, and personal wellbeing.",
      "หมวดสุขภาพและความงามรวมสินค้าอย่างสบู่ แชมพู สกินแคร์ ของใช้ดูแลช่องปาก ผลิตภัณฑ์ระงับกลิ่นกาย และของใช้ประจำวันอื่น ๆ ที่ช่วยเรื่องความสะอาดและการดูแลตัวเอง ลูกค้าใช้หมวดนี้เพื่อเลือกสินค้าที่เหมาะกับสภาพผิว กิจวัตร กลิ่นที่ชอบ และความต้องการของคนในบ้าน จึงเป็นหมวดสำคัญสำหรับความสบาย ความสะอาด และการดูแลตัวเองในทุกวัน"
    ),
    whatIs: text(
      "This category covers personal care items used every day for cleansing, grooming, skincare, oral care, and small wellness needs at home.",
      "หมวดนี้ครอบคลุมของใช้ส่วนบุคคลที่ใช้ทุกวัน เช่น การทำความสะอาดร่างกาย การดูแลรูปลักษณ์ การบำรุงผิว การดูแลช่องปาก และสินค้าพื้นฐานด้านสุขภาพ"
    ),
    commonItems: [
      text("Soap, shampoo, body wash, and hair care", "สบู่ แชมพู ครีมอาบน้ำ และผลิตภัณฑ์ดูแลเส้นผม"),
      text("Skincare, deodorant, and personal grooming items", "สกินแคร์ ผลิตภัณฑ์ระงับกลิ่นกาย และของใช้ดูแลบุคลิก"),
      text("Toothpaste, oral care, and everyday wellness basics", "ยาสีฟัน ของใช้ดูแลช่องปาก และสินค้าสุขภาพพื้นฐาน"),
    ],
    customerUse: text(
      "Customers usually choose personal care products by skin type, scent preference, daily routine, family needs, and how often the item is replaced.",
      "ลูกค้ามักเลือกของใช้ดูแลตัวเองจากสภาพผิว กลิ่นที่ชอบ กิจวัตรประจำวัน ความต้องการของคนในบ้าน และความถี่ในการซื้อซ้ำ"
    ),
    whyUseful: text(
      "This category matters because it supports daily comfort, hygiene, and self-care with products that most households use regularly.",
      "หมวดนี้มีความสำคัญเพราะช่วยเรื่องความสะอาด ความสบาย และการดูแลตัวเองในชีวิตประจำวัน ซึ่งเป็นสิ่งที่เกือบทุกบ้านต้องใช้อยู่เสมอ"
    ),
    tips: [
      text("Choose formulas that match sensitive, dry, or oily skin needs.", "เลือกสูตรที่เหมาะกับผิวแพ้ง่าย ผิวแห้ง หรือผิวมัน"),
      text("Think about fragrance level if the product will be used by the whole family.", "คำนึงถึงระดับกลิ่นหอมเมื่อสินค้าต้องใช้ร่วมกันทั้งบ้าน"),
      text("Keep daily essentials stocked to avoid running out of routine items.", "ควรมีของใช้ประจำติดบ้านไว้เสมอเพื่อไม่ให้ขาดของจำเป็น"),
    ],
    highlights: [
      text("Supports hygiene and daily self-care", "ช่วยเรื่องสุขอนามัยและการดูแลตัวเอง"),
      text("Useful for all ages and family routines", "เหมาะกับทุกวัยและกิจวัตรของครอบครัว"),
      text("Easy to choose by skin type and usage habit", "เลือกได้ตามสภาพผิวและลักษณะการใช้งาน"),
    ],
  },
  {
    slug: "home-care",
    title: text("Home Care", "ของใช้ทำความสะอาด"),
    subtitle: text(
      "Cleaning products for a tidy and stocked home.",
      "อุปกรณ์และผลิตภัณฑ์ทำความสะอาดสำหรับบ้านที่พร้อมใช้งาน"
    ),
    image: "/assets/clean.png",
    intro: text(
      "Home care items help households stay clean, organized, and prepared for everyday maintenance.",
      "ของใช้ทำความสะอาดช่วยให้บ้านสะอาด เป็นระเบียบ และพร้อมสำหรับการดูแลรักษาในทุกวัน"
    ),
    guideDescription: text(
      "Home care includes cleaning and maintenance items such as detergents, dishwashing products, surface cleaners, tissues, trash bags, and other essentials used to keep the home clean and organized. Customers usually choose this category for laundry, kitchen care, bathroom cleaning, and everyday household upkeep, often comparing products by purpose, scent, strength, and how often they are used at home.",
      "หมวดของใช้ทำความสะอาดรวมสินค้าสำหรับการดูแลบ้าน เช่น น้ำยาซักผ้า ผลิตภัณฑ์ล้างจาน น้ำยาทำความสะอาดพื้นผิว ทิชชู ถุงขยะ และของใช้จำเป็นอื่น ๆ ที่ช่วยให้บ้านสะอาดและเป็นระเบียบ ลูกค้ามักเลือกหมวดนี้สำหรับซักผ้า ดูแลครัว ทำความสะอาดห้องน้ำ และการดูแลบ้านในชีวิตประจำวัน โดยมักเปรียบเทียบจากวัตถุประสงค์ กลิ่น ความเข้มข้น และความถี่ในการใช้งาน"
    ),
    whatIs: text(
      "This category focuses on products used for washing, wiping, sanitizing, and general household cleaning in kitchens, bathrooms, and shared spaces.",
      "หมวดนี้เน้นสินค้าที่ใช้สำหรับซัก ล้าง เช็ด ฆ่าเชื้อ และดูแลความสะอาดทั่วไปในครัว ห้องน้ำ และพื้นที่ใช้งานร่วมกันภายในบ้าน"
    ),
    commonItems: [
      text("Laundry products, dishwashing items, and cleaners", "ผลิตภัณฑ์ซักผ้า ล้างจาน และน้ำยาทำความสะอาด"),
      text("Floor, bathroom, and surface cleaning solutions", "น้ำยาทำความสะอาดพื้น ห้องน้ำ และพื้นผิวต่าง ๆ"),
      text("Tissues, trash bags, and household paper essentials", "ทิชชู ถุงขยะ และของใช้กระดาษภายในบ้าน"),
    ],
    customerUse: text(
      "Shoppers often choose home care products by cleaning purpose, scent, strength, family sensitivity, and how often each room needs maintenance.",
      "ลูกค้ามักเลือกของใช้ทำความสะอาดจากประเภทงานที่ต้องการทำ กลิ่น ความเข้มข้น ความเหมาะกับคนในบ้าน และความถี่ในการทำความสะอาดแต่ละพื้นที่"
    ),
    whyUseful: text(
      "A strong home care section keeps everyday living spaces cleaner, safer, and easier to maintain for families of all sizes.",
      "หมวดนี้ช่วยให้พื้นที่ใช้สอยในบ้านสะอาด ปลอดภัย และดูแลง่ายขึ้นสำหรับครอบครัวทุกขนาด"
    ),
    tips: [
      text("Choose cleaners based on the surface or room you need to care for.", "เลือกน้ำยาทำความสะอาดให้เหมาะกับพื้นผิวหรือห้องที่ต้องการใช้"),
      text("Keep basic refills ready for frequently used items like detergent and tissue.", "ควรมีของเติมสำหรับของใช้บ่อย เช่น น้ำยาซักผ้าและทิชชู"),
      text("Check whether stronger products are suitable for homes with children or pets.", "ดูว่าสินค้าที่มีความเข้มข้นสูงเหมาะกับบ้านที่มีเด็กหรือสัตว์เลี้ยงหรือไม่"),
    ],
    highlights: [
      text("Supports cleanliness across the whole home", "ช่วยดูแลความสะอาดได้ทั่วทั้งบ้าน"),
      text("Useful for everyday maintenance and refills", "เหมาะกับการใช้งานประจำวันและการซื้อเติม"),
      text("Helps keep living spaces tidy and ready", "ช่วยให้พื้นที่ในบ้านเป็นระเบียบและพร้อมใช้งาน"),
    ],
  },
  {
    slug: "kitchen-tools",
    title: text("Kitchen Tools", "ของใช้ในครัวเรือน"),
    subtitle: text(
      "Useful equipment and household support items.",
      "อุปกรณ์และของใช้จำเป็นที่ช่วยให้การใช้งานในบ้านสะดวกขึ้น"
    ),
    image: "/assets/clean_eqip.png",
    intro: text(
      "Kitchen and household tools support everyday cooking, storage, and practical home routines.",
      "ของใช้ในครัวเรือนช่วยให้การทำอาหาร การจัดเก็บ และการดูแลบ้านในแต่ละวันสะดวกขึ้น"
    ),
    guideDescription: text(
      "Kitchen tools include practical household items such as food containers, storage accessories, cleaning tools, and utility products that help with cooking, organizing, and daily home routines. Customers usually use this category to make food preparation and storage easier, reduce clutter, and choose useful items based on function, durability, available space, and how often they will be used.",
      "หมวดของใช้ในครัวเรือนรวมอุปกรณ์ที่ใช้งานได้จริง เช่น กล่องเก็บอาหาร อุปกรณ์จัดเก็บ ของใช้ช่วยทำความสะอาด และสินค้าช่วยงานบ้านที่ทำให้การทำอาหาร การจัดระเบียบ และกิจวัตรภายในบ้านสะดวกขึ้น ลูกค้ามักเลือกหมวดนี้เพื่อช่วยเรื่องการเตรียมอาหาร การเก็บของให้เป็นระเบียบ และเลือกใช้สิ่งที่เหมาะกับพื้นที่ ความทนทาน และความถี่ในการใช้งาน"
    ),
    whatIs: text(
      "This category includes practical tools and support items that make food preparation, cleaning, storage, and home organization easier.",
      "หมวดนี้รวมอุปกรณ์และของใช้ที่ช่วยให้งานเตรียมอาหาร การทำความสะอาด การจัดเก็บ และการจัดระเบียบบ้านทำได้ง่ายขึ้น"
    ),
    commonItems: [
      text("Food containers, storage items, and organizers", "กล่องใส่อาหาร อุปกรณ์จัดเก็บ และของใช้จัดระเบียบ"),
      text("Cleaning tools, sponges, and kitchen utility items", "อุปกรณ์ทำความสะอาด ฟองน้ำ และของใช้ช่วยงานครัว"),
      text("Everyday household tools for convenience and support", "ของใช้ในบ้านทั่วไปที่ช่วยเพิ่มความสะดวกในการใช้งาน"),
    ],
    customerUse: text(
      "Customers usually choose these items by function, durability, storage space, and how often the tool will be used in daily routines.",
      "ลูกค้ามักเลือกหมวดนี้จากการใช้งานจริง ความทนทาน พื้นที่จัดเก็บ และความถี่ที่ต้องใช้ในชีวิตประจำวัน"
    ),
    whyUseful: text(
      "Simple household tools often save time, reduce clutter, and make everyday kitchen work more efficient.",
      "ของใช้ในบ้านที่เหมาะสมช่วยประหยัดเวลา ลดความรก และทำให้งานในครัวหรือในบ้านคล่องตัวขึ้น"
    ),
    tips: [
      text("Choose items that fit the available kitchen or storage space.", "เลือกอุปกรณ์ที่เหมาะกับขนาดพื้นที่ในครัวหรือที่จัดเก็บ"),
      text("Prioritize tools that solve frequent daily tasks first.", "ให้ความสำคัญกับของใช้ที่ช่วยแก้ปัญหางานประจำวันก่อน"),
      text("Look for easy-to-clean and durable materials when possible.", "ควรเลือกวัสดุที่ทำความสะอาดง่ายและใช้งานได้นาน"),
    ],
    highlights: [
      text("Improves convenience in cooking and storage", "ช่วยให้การทำอาหารและจัดเก็บสะดวกขึ้น"),
      text("Useful for organizing everyday household routines", "เหมาะกับการจัดการงานบ้านในทุกวัน"),
      text("Supports practical, space-conscious living", "ช่วยให้ใช้พื้นที่และอุปกรณ์ได้คุ้มค่า"),
    ],
  },
  {
    slug: "pet-care",
    title: text("Pet Care", "สินค้าสัตว์เลี้ยง"),
    subtitle: text(
      "Selected supplies for cats, dogs, and more.",
      "สินค้าคัดสรรสำหรับสุนัข แมว และสัตว์เลี้ยงอื่นๆ"
    ),
    image: "/assets/pet.png",
    intro: text(
      "Pet care products help owners look after feeding, hygiene, comfort, and routine care for beloved animals at home.",
      "สินค้าสัตว์เลี้ยงช่วยให้เจ้าของดูแลเรื่องอาหาร สุขอนามัย ความสบาย และการดูแลประจำวันของสัตว์เลี้ยงได้ครบขึ้น"
    ),
    guideDescription: text(
      "Pet care includes food, treats, hygiene products, litter, and everyday support items for cats, dogs, and other household pets. Customers use this category to look after feeding, cleanliness, and comfort for their animals, and they usually choose products according to pet type, age, size, habits, and the specific care needs of each animal.",
      "หมวดสินค้าสัตว์เลี้ยงรวมอาหาร ขนม ของใช้ด้านสุขอนามัย ทราย และอุปกรณ์พื้นฐานสำหรับแมว สุนัข และสัตว์เลี้ยงในบ้าน ลูกค้าใช้หมวดนี้เพื่อดูแลเรื่องอาหาร ความสะอาด และความสบายของสัตว์เลี้ยง โดยมักเลือกสินค้าตามชนิดสัตว์ อายุ ขนาด พฤติกรรม และความต้องการเฉพาะของสัตว์แต่ละตัว"
    ),
    whatIs: text(
      "This category includes basic supplies for dogs, cats, and household pets, with a focus on food support, care items, and everyday convenience.",
      "หมวดนี้รวบรวมของใช้พื้นฐานสำหรับสุนัข แมว และสัตว์เลี้ยงในบ้าน โดยเน้นสินค้าด้านอาหาร การดูแล และความสะดวกในการใช้งานประจำวัน"
    ),
    commonItems: [
      text("Pet food, treats, and feeding support items", "อาหารสัตว์ ขนม และของใช้ที่เกี่ยวกับการให้อาหาร"),
      text("Litter, hygiene products, and cleaning supplies", "ทราย ของใช้ด้านสุขอนามัย และอุปกรณ์ทำความสะอาด"),
      text("Basic accessories for comfort and routine care", "อุปกรณ์พื้นฐานเพื่อความสบายและการดูแลประจำวัน"),
    ],
    customerUse: text(
      "Shoppers usually choose pet care products by animal type, size, age, feeding habits, and how sensitive the pet is to ingredients or materials.",
      "ลูกค้ามักเลือกสินค้าสัตว์เลี้ยงจากชนิดสัตว์ ขนาด ช่วงอายุ พฤติกรรมการกิน และความไวต่อส่วนผสมหรือวัสดุของสัตว์เลี้ยง"
    ),
    whyUseful: text(
      "A reliable pet care category helps owners keep food, cleaning, and comfort essentials ready for the animals they care about.",
      "หมวดสินค้าสัตว์เลี้ยงที่ครบถ้วนช่วยให้เจ้าของมีของจำเป็นด้านอาหาร ความสะอาด และความสบายพร้อมดูแลสัตว์เลี้ยงเสมอ"
    ),
    tips: [
      text("Choose food and treats that match the pet's age and size.", "เลือกอาหารและขนมให้เหมาะกับอายุและขนาดของสัตว์เลี้ยง"),
      text("Keep routine essentials stocked so daily care stays simple.", "ควรมีของใช้พื้นฐานติดบ้านไว้เสมอเพื่อให้การดูแลง่ายขึ้น"),
      text("Pay attention to ingredient and material sensitivity when changing products.", "สังเกตความไวต่อส่วนผสมหรือวัสดุเมื่อเปลี่ยนยี่ห้อหรือประเภทสินค้า"),
    ],
    highlights: [
      text("Supports feeding, hygiene, and comfort", "ช่วยดูแลเรื่องอาหาร สุขอนามัย และความสบาย"),
      text("Useful for cats, dogs, and household pets", "เหมาะกับสุนัข แมว และสัตว์เลี้ยงในบ้าน"),
      text("Makes daily pet routines easier to manage", "ช่วยให้การดูแลสัตว์เลี้ยงประจำวันเป็นระบบมากขึ้น"),
    ],
  },
];

export const spotlightCards = [
  {
    eyebrow: text("Weekly brochure", "โบรชัวร์ประจำสัปดาห์"),
    title: text(
      "See the latest product highlights before you visit.",
      "ดูสินค้าหรือรายการเด่นล่าสุดก่อนแวะมาที่ร้าน"
    ),
    description: text(
      "Use the brochure page for featured shelves, deal banners, and seasonal product updates.",
      "ใช้หน้าโบรชัวร์เพื่อแสดงสินค้าขายดี แบนเนอร์โปรโมชัน และการอัปเดตสินค้าตามฤดูกาล"
    ),
    image: "/assets/sp-2.png",
    href: brochureLinkHref,
    linkLabel: text("Browse brochure", "ดูโบรชัวร์"),
  },
  {
    eyebrow: text("Fresh promotions", "โปรโมชั่นใหม่"),
    title: text(
      "Check current promotions, weekly deals, and featured items.",
      "ดูโปรโมชั่นปัจจุบัน ดีลประจำสัปดาห์ และสินค้าที่แนะนำ"
    ),
    description: text(
      "Visit the promotions page to see the latest offers, campaign highlights, and store updates.",
      "เข้าไปที่หน้าโปรโมชั่นเพื่อดูข้อเสนอล่าสุด สินค้าแนะนำ และข่าวสารจากทางร้าน"
    ),
    image: "/assets/promotion.png",
    href: "/promotions",
    linkLabel: text("See promotions", "ดูโปรโมชั่น"),
  },
  {
    eyebrow: text("Order support", "ช่วยเรื่องการสั่งซื้อ"),
    title: text(
      "Guide shoppers from discovery to pickup in just a few steps.",
      "พาลูกค้าจากการดูสินค้าไปจนถึงการรับของด้วยขั้นตอนที่ชัดเจน"
    ),
    description: text(
      "The online shopping page explains how to browse, contact the team, and confirm store pickup.",
      "หน้าสั่งซื้อออนไลน์อธิบายการดูสินค้า ติดต่อทีมงาน และยืนยันการรับสินค้าที่ร้านอย่างเป็นขั้นตอน"
    ),
    image: "/assets/online.jpg",
    href: "/shopping",
    linkLabel: text("How ordering works", "ดูขั้นตอนการสั่งซื้อ"),
  },
];

export const serviceSteps = [
  {
    step: "01",
    title: text("Browse current products", "ดูสินค้าหรือโปรโมชันปัจจุบัน"),
    description: text(
      "Start with featured departments, brochure visuals, or the latest promotional cards.",
      "เริ่มจากหมวดสินค้ายอดนิยม ภาพโบรชัวร์ หรือการ์ดโปรโมชั่นล่าสุดของร้าน"
    ),
  },
  {
    step: "02",
    title: text("Send your order request", "แจ้งรายการที่ต้องการ"),
    description: text(
      "Reach the team by phone or chat to confirm product details, quantities, and availability.",
      "ติดต่อทีมงานผ่านโทรศัพท์หรือแชตเพื่อยืนยันรายละเอียดสินค้า จำนวน และสต็อกที่มี"
    ),
  },
  {
    step: "03",
    title: text("Confirm pickup or visit", "ยืนยันแล้วรับสินค้าหรือเข้ามาที่ร้าน"),
    description: text(
      "Receive a quick confirmation, then collect your order or come to the store prepared.",
      "รับการยืนยันอย่างรวดเร็ว แล้วเข้ามารับสินค้าหรือแวะที่ร้านได้อย่างมั่นใจ"
    ),
  },
];

export const trustPoints = [
  {
    title: text("Popular departments", "หมวดยอดนิยมที่หาได้ง่าย"),
    description: text(
      "Browse core categories like drinks, dairy, snacks, home care, and more.",
      "เลือกดูหมวดหลักอย่างเครื่องดื่ม นม ขนม ของใช้ในบ้าน และสินค้าอื่น ๆ ได้สะดวก"
    ),
  },
  {
    title: text("Weekly deals and brochure picks", "โปรประจำสัปดาห์และสินค้าแนะนำ"),
    description: text(
      "Keep up with current promotions, featured products, and seasonal offers before visiting.",
      "ติดตามโปรโมชั่นปัจจุบัน สินค้าเด่น และข้อเสนอพิเศษก่อนเข้าร้าน"
    ),
  },
  {
    title: text("Easy store contact", "ติดต่อร้านได้สะดวก"),
    description: text(
      "Phone, chat, maps, and brochure links stay close by when you need quick help.",
      "มีทั้งโทร แชต แผนที่ และโบรชัวร์ให้เข้าถึงได้ง่ายเมื่ออยากสอบถามข้อมูล"
    ),
  },
];

export const promotionCards = [
  {
    title: text("Weekly brochure focus", "จุดเด่นของโบรชัวร์ประจำสัปดาห์"),
    description: text(
      "Use brochure visuals as the primary campaign block for limited-time deals and featured goods.",
      "ใช้ภาพโบรชัวร์เป็นบล็อกหลักสำหรับโปรโมชันช่วงเวลาจำกัดและสินค้าที่อยากเน้น"
    ),
    image: "/assets/sp-2.png",
  },
  {
    title: text("In-store campaign banner", "แบนเนอร์แคมเปญหน้าร้าน"),
    description: text(
      "Keep your key promotional banner large, visible, and easy to reuse across landing sections.",
      "ทำให้แบนเนอร์หลักของร้านเห็นได้ชัด และนำไปใช้ต่อในหลายส่วนของหน้าเว็บได้ง่าย"
    ),
    image: "/assets/sp-3.png",
  },
  {
    title: text("Seasonal visual slot", "พื้นที่ภาพสำหรับโปรโมชันตามเทศกาล"),
    description: text(
      "Reserve a third panel for festival offers, household bundles, or new arrival campaigns.",
      "สำรองพื้นที่สำหรับโปรโมชันเทศกาล ชุดสินค้าครัวเรือน หรือแคมเปญสินค้าเข้าใหม่"
    ),
    image: "/assets/sp-3-2.png",
  },
];

export const shoppingChannels = [
  {
    title: text("Phone order", "โทรสั่งซื้อ"),
    description: text(
      "Call the team for product checks, pickup coordination, and direct support during store hours.",
      "โทรหาทีมงานเพื่อสอบถามสินค้า นัดรับของ และติดต่อโดยตรงในช่วงเวลาเปิดร้าน"
    ),
    action: text("Call the store", "โทรหาร้าน"),
    href: "tel:0652626861",
    icon: "/assets/tel-icon.png",
  },
  {
    title: text("Line support", "Line Official"),
    description: text(
      "Use chat for quick questions, order details, and follow-up after checking brochure items.",
      "ใช้แชตเพื่อสอบถามอย่างรวดเร็ว ส่งรายละเอียดการสั่งซื้อ และติดตามรายการจากโบรชัวร์"
    ),
    action: text("Open contact page", "ดูช่องทางติดต่อ"),
    href: "/contact",
    icon: "/assets/line-icon.png",
  },
  {
    title: text("Facebook updates", "Facebook"),
    description: text(
      "Share news, promotions, and store announcements through a familiar social channel.",
      "ติดตามข่าวสาร โปรโมชั่น และประกาศของร้านผ่านช่องทางโซเชียลที่คุ้นเคย"
    ),
    action: text("View contact options", "ดูช่องทางติดต่อ"),
    href: "/contact",
    icon: "/assets/fb-icon.png",
  },
];

export const brochurePanels = [
  {
    title: text("Main brochure cover", "หน้าปกโบรชัวร์หลัก"),
    description: text(
      "A strong hero visual for your weekly selection and featured categories.",
      "ภาพหลักที่เหมาะสำหรับแสดงสินค้าเด่นและหมวดหมู่ที่อยากโปรโมตในสัปดาห์นั้น"
    ),
    image: "/assets/sp-2.png",
  },
  {
    title: text("Promotion banner", "แบนเนอร์โปรโมชั่น"),
    description: text(
      "Reuse this format for rotating promotions or limited-time campaigns.",
      "นำรูปแบบนี้ไปใช้ซ้ำสำหรับโปรโมชันหมุนเวียนหรือแคมเปญระยะเวลาจำกัดได้"
    ),
    image: "/assets/sp-3.png",
  },
  {
    title: text("Seasonal alternate", "ภาพสำรองตามฤดูกาล"),
    description: text(
      "Add a second feature slot to keep the brochure page feeling current.",
      "เพิ่มสล็อตภาพอีกชุดเพื่อให้หน้าโบรชัวร์ดูอัปเดตและพร้อมใช้งานตลอด"
    ),
    image: "/assets/sp-3-2.png",
  },
];

export const homePageContent = {
  heroEyebrow: text("Fresh picks for every day", "คัดสรรของสดและของใช้ทุกวัน"),
  heroTitle: text(
    "Fresh groceries, household essentials, and weekly deals at Sophon Supermarket.",
    "รวมสินค้าของสด ของใช้ประจำบ้าน และโปรโมชั่นประจำสัปดาห์จากโสภณซุปเปอร์"
  ),
  heroLead: text(
    "Browse popular departments, check the weekly brochure, and contact the store before you visit.",
    "ดูหมวดสินค้ายอดนิยม เปิดโบรชัวร์ประจำสัปดาห์ และติดต่อร้านก่อนแวะมาได้ง่ายขึ้น"
  ),
  primaryCta: text("Explore products", "ดูสินค้า"),
  secondaryCta: text("Open brochure", "เปิดโบรชัวร์"),
  heroPhoneLabel: text("Call the store", "โทรหาร้าน"),
  heroHoursLabel: text("Opening hours", "เวลาเปิดทำการ"),
  heroLocationLabel: text("Store location", "ที่ตั้งร้าน"),
  supportEyebrow: text("Store support", "ติดต่อร้าน"),
  supportTitle: text(
    "Need help before you visit Sophon Supermarket?",
    "ต้องการสอบถามก่อนแวะมาที่โสภณซุปเปอร์?"
  ),
  supportDescription: text(
    "Call the store for product questions, opening hours, and help finding the right department.",
    "โทรหาร้านเพื่อสอบถามสินค้า เวลาทำการ และขอคำแนะนำเกี่ยวกับหมวดสินค้าที่ต้องการ"
  ),
  supportCallCta: text("Call now", "โทรเลย"),
  highlightEyebrow: text("This week's highlights", "ไฮไลต์ประจำสัปดาห์"),
  highlightTitle: text(
    "Brochure, promotions, and ordering support in one place.",
    "โบรชัวร์ โปรโมชั่น และข้อมูลการสั่งซื้ออยู่ในที่เดียว"
  ),
  highlightDescription: text(
    "Check the latest offers, featured products, and quick store actions from the homepage.",
    "ดูข้อเสนอล่าสุด สินค้าแนะนำ และปุ่มติดต่อสำคัญได้จากหน้าแรก"
  ),
  categoriesEyebrow: text("Popular departments", "หมวดหมู่ยอดนิยม"),
  categoriesTitle: text(
    "Selected categories at a glance",
    "รวมหมวดสินค้าที่สำคัญไว้ให้ดูได้ทันที"
  ),
  categoriesAction: text("Browse all departments", "ดูหมวดทั้งหมด"),
  categoriesDescription: text(
    "Open category guides for everyday groceries, drinks, snacks, and household essentials.",
    "เปิดหน้าข้อมูลของหมวดยอดนิยมสำหรับของใช้ประจำวัน เครื่องดื่ม ขนม และของใช้ในบ้าน"
  ),
  orderingEyebrow: text("Ordering flow", "ลำดับการสั่งซื้อ"),
  orderingTitle: text(
    "A simpler path from promotion to pickup",
    "เส้นทางที่ง่ายขึ้นจากการดูโปรโมชันไปจนถึงการรับสินค้า"
  ),
  orderingDescription: text(
    "Check products, contact the team, and confirm pickup in a few simple steps.",
    "ดูสินค้า ติดต่อทีมงาน และยืนยันการรับสินค้าที่ร้านได้ในไม่กี่ขั้นตอน"
  ),
  visitEyebrow: text("Visit the store", "แวะมาที่ร้าน"),
  visitTitle: text("Sophon Supermarket", "โสภณซุปเปอร์"),
  visitDescription: text(
    "Find store details, contact channels, and directions before heading to Sophon Supermarket.",
    "ดูข้อมูลร้าน ช่องทางติดต่อ และเส้นทางมาก่อนแวะมาที่โสภณซุปเปอร์"
  ),
  visitContact: text("Contact options", "ช่องทางติดต่อ"),
  visitMap: text("Open map", "เปิดแผนที่"),
  whyEyebrow: text("Why shop here", "ทำไมลูกค้าถึงเลือกเรา"),
  whyTitle: text(
    "Everyday essentials, weekly deals, and convenient store support.",
    "ของใช้ประจำวัน โปรโมชั่นประจำสัปดาห์ และการติดต่อร้านที่สะดวก"
  ),
};

export const productsPageContent = {
  heroEyebrow: text("Category guides", "คู่มือหมวดสินค้า"),
  heroTitle: text(
    "Browse the main category guides at Sophon Supermarket.",
    "เปิดดูหน้าข้อมูลของหมวดสินค้าหลักในโสภณซุปเปอร์ได้ง่ายขึ้น"
  ),
  heroDescription: text(
    "Explore each department through readable guide pages before you visit the store.",
    "สำรวจแต่ละหมวดผ่านหน้าข้อมูลที่อ่านง่ายก่อนแวะมาที่ร้าน"
  ),
  brochureCta: text("View brochure", "ดูโบรชัวร์"),
  contactCta: text("Ask the team", "สอบถามร้าน"),
  categoriesEyebrow: text("Departments", "หมวดสินค้า"),
  categoriesTitle: text("Main category guides", "หน้าข้อมูลหมวดสินค้าหลัก"),
  categoriesDescription: text(
    "Choose a department card to open a category guide with useful details and shopping context.",
    "เลือกการ์ดของแต่ละหมวดเพื่อเปิดหน้าข้อมูลที่มีรายละเอียดและคำแนะนำในการเลือกซื้อ"
  ),
  strengthsEyebrow: text("Store strengths", "จุดแข็งของหน้าเว็บ"),
  strengthsTitle: text(
    "Built to support product discovery and store trust",
    "ออกแบบมาเพื่อช่วยให้ดูสินค้าได้ง่ายและสร้างความมั่นใจให้ผู้ใช้"
  ),
  helpEyebrow: text("Need help choosing?", "ต้องการสอบถามสินค้า?"),
  helpTitle: text(
    "Call or message the store for product details before you visit.",
    "โทรหรือส่งข้อความหาร้านเพื่อสอบถามรายละเอียดสินค้าก่อนแวะมาได้เลย"
  ),
  orderingCta: text("Ordering steps", "ขั้นตอนการสั่งซื้อ"),
  searchEyebrow: text("Filtered browse", "ผลการค้นหา"),
  searchTitle: text("Showing departments for", "กำลังแสดงหมวดสินค้าสำหรับ"),
  searchDescription: text(
    "Use the quick search in the header to jump into the category information list faster.",
    "ใช้ช่องค้นหาด้านบนเพื่อเข้ามายังรายการหน้าข้อมูลหมวดสินค้าได้เร็วขึ้น"
  ),
  searchCountLabel: text("matching category guides", "หน้าข้อมูลหมวดสินค้าที่เกี่ยวข้อง"),
  clearSearch: text("Clear search", "ล้างการค้นหา"),
  emptyTitle: text("No matching category guides found yet", "ยังไม่พบหน้าข้อมูลหมวดสินค้าที่ตรงกัน"),
  emptyDescription: text(
    "Try a broader keyword or clear the search to browse every category guide.",
    "ลองใช้คำค้นที่กว้างขึ้น หรือล้างการค้นหาเพื่อดูหน้าข้อมูลหมวดสินค้าทั้งหมด"
  ),
};

export const categoryGuideContent = {
  heroEyebrow: text("Category guide", "คู่มือหมวดสินค้า"),
  backCta: text("Back", "กลับ"),
  contactCta: text("Contact the store", "ติดต่อร้าน"),
  introEyebrow: text("Introduction", "แนะนำหมวดสินค้า"),
  aboutTitle: text("What this category includes", "หมวดนี้มีอะไรบ้าง"),
  commonItemsTitle: text("Common items in this category", "สินค้าที่พบได้บ่อยในหมวดนี้"),
  chooseTitle: text("How shoppers usually choose", "ลูกค้ามักเลือกซื้ออย่างไร"),
  importanceTitle: text("Why this category matters", "ทำไมหมวดนี้จึงสำคัญ"),
  tipsEyebrow: text("Buying tips", "คำแนะนำในการเลือกซื้อ"),
  tipsTitle: text("Helpful shopping guidance", "คำแนะนำที่ช่วยให้เลือกได้ง่ายขึ้น"),
  highlightsEyebrow: text("Quick highlights", "สรุปจุดเด่น"),
  highlightsTitle: text("What makes this category useful", "จุดเด่นของหมวดนี้"),
  moreEyebrow: text("Explore more", "ดูหมวดอื่นต่อ"),
  moreTitle: text("Other category guides", "คู่มือหมวดสินค้าอื่น ๆ"),
  moreDescription: text(
    "Browse another department guide if you want to learn more before visiting the store.",
    "เปิดดูหน้าข้อมูลของหมวดอื่นเพิ่มเติมได้หากต้องการศึกษาก่อนแวะมาที่ร้าน"
  ),
  openGuide: text("Open guide", "เปิดหน้าข้อมูล"),
};

export const promotionsPageContent = {
  heroEyebrow: text("Promotions and news", "ข่าวสารและโปรโมชั่น"),
  heroTitle: text(
    "Current promotions, weekly deals, and featured offers.",
    "รวมโปรโมชั่นปัจจุบัน ดีลประจำสัปดาห์ และข้อเสนอแนะนำ"
  ),
  heroDescription: text(
    "Use this page to highlight campaign banners, brochure items, and seasonal promotions.",
    "ใช้หน้านี้สำหรับแสดงแบนเนอร์แคมเปญ รายการจากโบรชัวร์ และโปรโมชั่นตามช่วงเวลา"
  ),
  brochureCta: text("Open brochure", "เปิดโบรชัวร์"),
  productsCta: text("Browse departments", "ดูหมวดสินค้า"),
  slotsEyebrow: text("Campaign slots", "พื้นที่แสดงแคมเปญ"),
  slotsTitle: text("Reusable promotion blocks", "บล็อกโปรโมชั่นที่นำกลับมาใช้ได้"),
  slotsDescription: text(
    "These sections make it easier to keep weekly news, featured products, and seasonal promotions visible.",
    "ส่วนเหล่านี้ช่วยให้ข่าวสารประจำสัปดาห์ สินค้าเด่น และโปรโมชั่นตามฤดูกาลยังคงมองเห็นได้ชัด"
  ),
  slotLink: text("Use this on brochure page", "ดูตัวอย่างในหน้าโบรชัวร์"),
  rhythmEyebrow: text("Update rhythm", "จังหวะการอัปเดตหน้าเว็บ"),
  rhythmTitle: text(
    "Brochure, banner, and category highlights now work together as one campaign system.",
    "โบรชัวร์ แบนเนอร์ และส่วนไฮไลต์หมวดสินค้า ทำงานร่วมกันเป็นระบบแคมเปญเดียวกันแล้ว"
  ),
  rhythmDescription: text(
    "Keep brochure offers, banners, and category highlights grouped in one easy place.",
    "รวมข้อเสนอจากโบรชัวร์ แบนเนอร์ และสินค้าเด่นไว้ในที่เดียวเพื่อให้ติดตามได้ง่าย"
  ),
  contactCta: text("Contact the store", "ติดต่อร้าน"),
};

export const shoppingPageContent = {
  heroEyebrow: text("Online shopping", "สั่งซื้อออนไลน์"),
  heroTitle: text(
    "Clear ordering steps with faster paths to phone and chat support.",
    "ขั้นตอนการสั่งซื้อที่ชัดเจน พร้อมทางลัดไปยังโทรศัพท์และแชตของร้าน"
  ),
  heroDescription: text(
    "Follow the ordering steps, contact the team, and arrange store pickup more easily.",
    "ดูขั้นตอนการสั่งซื้อ ติดต่อทีมงาน และนัดรับสินค้าที่ร้านได้สะดวกขึ้น"
  ),
  contactCta: text("Contact the team", "ติดต่อทีมงาน"),
  categoriesCta: text("Check categories", "ดูหมวดสินค้า"),
  stepsEyebrow: text("3 simple steps", "3 ขั้นตอนง่ายๆ"),
  stepsTitle: text("How ordering works", "วิธีการสั่งซื้อ"),
  stepsDescription: text(
    "Start with products or promotions, then send your request and confirm pickup with the store.",
    "เริ่มจากดูสินค้า หรือโปรโมชั่น จากนั้นส่งรายการและยืนยันการรับสินค้ากับทางร้าน"
  ),
  channelsEyebrow: text("Support channels", "ช่องทางการสั่งซื้อ"),
  channelsTitle: text(
    "Choose the contact method that works best for the customer",
    "เลือกช่องทางที่สะดวกที่สุดสำหรับลูกค้า"
  ),
};

export const contactPageContent = {
  heroEyebrow: text("Contact the store", "ติดต่อร้าน"),
  heroTitle: text(
    "Phone, chat, map, and store details in one place.",
    "รวมเบอร์โทร แชต แผนที่ และข้อมูลร้านไว้ในที่เดียว"
  ),
  heroDescription: text(
    "Find the quickest way to contact Sophon Supermarket and get directions before you visit.",
    "เลือกช่องทางที่สะดวกที่สุดในการติดต่อโสภณซุปเปอร์และดูเส้นทางมาก่อนเดินทาง"
  ),
  mapsCta: text("Open Google Maps", "เปิด Google Maps"),
  supportEyebrow: text("Support options", "ช่องทางติดต่อ"),
  supportTitle: text(
    "Reach the team through the channel that fits the request",
    "ติดต่อทีมงานผ่านช่องทางที่เหมาะกับสิ่งที่ต้องการสอบถาม"
  ),
  locationEyebrow: text("Store location", "ที่ตั้งร้าน"),
  routeCta: text("Open route", "เปิดเส้นทาง"),
};

export const brochurePageContent = {
  heroEyebrow: text("Online brochure", "โบรชัวร์ออนไลน์"),
  heroTitle: text(
    "Browse brochure visuals and featured weekly offers.",
    "ดูภาพโบรชัวร์และข้อเสนอประจำสัปดาห์"
  ),
  heroDescription: text(
    "See featured product visuals, seasonal picks, and promotion panels from the latest brochure.",
    "รวมภาพสินค้าเด่น โปรโมชั่นตามฤดูกาล และภาพจากโบรชัวร์ล่าสุดไว้ให้ดูง่าย"
  ),
  promotionsCta: text("See promotions", "ดูโปรโมชั่น"),
  productsCta: text("Browse products", "ดูสินค้า"),
  galleryEyebrow: text("Brochure gallery", "แกลเลอรีโบรชัวร์"),
  galleryTitle: text("Promotion-ready visuals", "ภาพที่พร้อมใช้กับโปรโมชัน"),
  galleryDescription: text(
    "Use these blocks for brochure pages, campaign slots, or featured category banners.",
    "ใช้บล็อกเหล่านี้สำหรับหน้าโบรชัวร์ พื้นที่แคมเปญ หรือแบนเนอร์หมวดสินค้าที่อยากเน้น"
  ),
  panelEyebrow: text("Brochure section", "ส่วนของโบรชัวร์"),
  panelLink: text("Use this in campaigns", "นำไปใช้ในแคมเปญ"),
  openPdf: text("Open PDF", "เปิด PDF"),
  openImage: text("Open image", "เปิดรูป"),
};


