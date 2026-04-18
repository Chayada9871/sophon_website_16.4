const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const siteHeader = document.querySelector(".site-header");
const languageButtons = document.querySelectorAll("[data-lang]");
const staffPromotionsPerPage = 9;
let staffPromotionRenderToken = 0;
const supabaseUrl = "https://ajecxsbfvxurdxrssdqn.supabase.co";
const supabaseKey = "sb_publishable_Gs7_Llbh2pPjthTY4YJQ_A_qUNLJF_T";
const supabaseClient = window.supabase ? window.supabase.createClient(supabaseUrl, supabaseKey) : null;
const offlinePromotionsStorageKey = "sophon_offline_promotions";

const pageName = (() => {
  const path = window.location.pathname.split("/").pop();
  return path || "index.html";
})();

const setText = (selector, value) => {
  const element = document.querySelector(selector);
  if (element && typeof value === "string") {
    element.textContent = value;
  }
};

const setTexts = (selector, values) => {
  const elements = document.querySelectorAll(selector);
  elements.forEach((element, index) => {
    if (typeof values[index] === "string") {
      element.textContent = values[index];
    }
  });
};

const setMetaDescription = (value) => {
  const meta = document.querySelector('meta[name="description"]');
  if (meta && value) {
    meta.setAttribute("content", value);
  }
};

const setImageSource = (selector, src) => {
  const element = document.querySelector(selector);
  if (element && typeof src === "string") {
    element.setAttribute("src", src);
  }
};

const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const getSupabaseClient = () => {
  if (!supabaseClient) {
    throw new Error("supabase_not_loaded");
  }

  return supabaseClient;
};

const readStorageArray = (key) => {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeStorageArray = (key, items) => {
  window.localStorage.setItem(key, JSON.stringify(items));
};

const getOfflinePromotions = () => readStorageArray(offlinePromotionsStorageKey);

const setOfflinePromotions = (items) => {
  writeStorageArray(offlinePromotionsStorageKey, items);
};

const createOfflinePromotionId = () => `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const isNetworkFetchError = (error) => {
  const message = String(error?.message || error?.error_description || "").toLowerCase();
  return (
    message.includes("failed to fetch") ||
    message.includes("networkerror") ||
    message.includes("network request failed") ||
    message.includes("load failed") ||
    message.includes("dns") ||
    message.includes("timed out") ||
    message.includes("timeout") ||
    message.includes("connection to the database timed out") ||
    message.includes("fetch failed")
  );
};

const shouldUseOfflinePromotionFallback = (error) =>
  String(error?.message || error?.error_description || "").trim() === "supabase_not_loaded" || isNetworkFetchError(error);

const getPromotionIdentityKey = (item) =>
  [
    getPublicPromotionKey(item),
    normalizePromotionValue(item.kind),
    normalizePromotionValue(item.publish_date || item.date)
  ].join("|");

const mergePromotionItems = (remoteItems, offlineItems) => {
  const merged = new Map();

  [...remoteItems, ...offlineItems].forEach((item) => {
    const key = getPromotionIdentityKey(item);
    if (!merged.has(key)) {
      merged.set(key, item);
    }
  });

  return Array.from(merged.values());
};

const fetchStaffPromotions = async () => {
  const offlineItems = getOfflinePromotions();

  try {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from("promotions")
      .select("*")
      .order("publish_date", { ascending: false });

    if (error) {
      throw error;
    }

    return mergePromotionItems(Array.isArray(data) ? data : [], offlineItems);
  } catch (error) {
    if (shouldUseOfflinePromotionFallback(error)) {
      return offlineItems;
    }

    throw error;
  }
};

const fetchStaffBrochures = async () => {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from("brochures")
    .select("*")
    .order("display_date", { ascending: false });

  if (error) {
    throw error;
  }

  return Array.isArray(data) ? data : [];
};

const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
    reader.onerror = () => reject(new Error("file_read_failed"));
    reader.readAsDataURL(file);
  });

const createSafeFileName = (name) => {
  const value = String(name || "upload");
  const dotIndex = value.lastIndexOf(".");
  const rawBase = dotIndex > 0 ? value.slice(0, dotIndex) : value;
  const rawExt = dotIndex > 0 ? value.slice(dotIndex).toLowerCase() : "";

  const safeBase = rawBase
    .normalize("NFKD")
    .replace(/[^\x00-\x7F]/g, "")
    .replace(/[^a-zA-Z0-9_-]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 80);

  const safeExt = rawExt.replace(/[^a-z0-9.]/g, "");
  return `${safeBase || "upload"}${safeExt || ""}`;
};

const getGoogleDriveFileId = (url) => {
  const value = String(url || "").trim();
  if (!value) {
    return "";
  }

  const match =
    value.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
    value.match(/[?&]id=([a-zA-Z0-9_-]+)/) ||
    value.match(/\/d\/([a-zA-Z0-9_-]+)/);

  return match ? match[1] : "";
};

const createGoogleDrivePreviewUrl = (url) => {
  const fileId = getGoogleDriveFileId(url);
  return fileId ? `https://drive.google.com/file/d/${fileId}/preview` : String(url || "").trim();
};

const createGoogleDriveOpenUrl = (url) => {
  const fileId = getGoogleDriveFileId(url);
  return fileId ? `https://drive.google.com/file/d/${fileId}/view` : String(url || "").trim();
};

const uploadFileToBucket = async (bucket, folder, file) => {
  const client = getSupabaseClient();
  const safeFileName = `${Date.now()}_${createSafeFileName(file.name)}`;
  const filePath = `${folder}/${safeFileName}`;

  const { error: uploadError } = await client.storage
    .from(bucket)
    .upload(filePath, file);

  if (uploadError) {
    throw uploadError;
  }

  const { data } = client.storage.from(bucket).getPublicUrl(filePath);
  return {
    filePath,
    publicUrl: data?.publicUrl || "",
    fileName: file.name,
    fileType: file.type
  };
};

const deleteFileFromBucket = async (bucket, filePath) => {
  if (!filePath) {
    return;
  }

  const client = getSupabaseClient();
  const { error } = await client.storage.from(bucket).remove([filePath]);
  if (error) {
    throw error;
  }
};

const isSchemaCompatibilityError = (error, columnName = "") => {
  const message = String(error?.message || error?.error_description || "").toLowerCase();
  if (!message) {
    return false;
  }

  const hasSchemaKeyword =
    message.includes("column") ||
    message.includes("schema cache") ||
    message.includes("could not find") ||
    message.includes("does not exist");

  if (!hasSchemaKeyword) {
    return false;
  }

  return columnName ? message.includes(String(columnName).toLowerCase()) : true;
};

const getStoragePathFromPublicUrl = (bucket, publicUrl) => {
  const value = String(publicUrl || "").trim();
  if (!value) {
    return "";
  }

  const marker = `/storage/v1/object/public/${bucket}/`;
  const markerIndex = value.indexOf(marker);
  if (markerIndex === -1) {
    return "";
  }

  return decodeURIComponent(value.slice(markerIndex + marker.length));
};

const insertPromotionRecord = async (client, payload) => {
  const payloadOptions = [
    payload,
    {
      kind: payload.kind,
      title: payload.title,
      image_url: payload.image_url,
      summary: payload.summary,
      publish_date: payload.publish_date
    },
    {
      kind: payload.kind,
      title: payload.title,
      image: payload.image_url,
      summary: payload.summary,
      publish_date: payload.publish_date
    }
  ];

  let lastError = null;

  for (let index = 0; index < payloadOptions.length; index += 1) {
    const candidate = payloadOptions[index];
    const { error } = await client.from("promotions").insert([candidate]);
    if (!error) {
      return;
    }

    lastError = error;
    const canRetry =
      index < payloadOptions.length - 1 &&
      (isSchemaCompatibilityError(error, "image_path") ||
        isSchemaCompatibilityError(error, "image_name") ||
        isSchemaCompatibilityError(error, "image_url") ||
        isSchemaCompatibilityError(error));

    if (!canRetry) {
      break;
    }
  }

  throw lastError || new Error("promotion_insert_failed");
};

const fetchPromotionStorageRecord = async (client, promotionId) => {
  const selectOptions = ["id,image_path,image_url,image", "id,image_url,image", "id"];
  let lastError = null;

  for (let index = 0; index < selectOptions.length; index += 1) {
    const selectClause = selectOptions[index];
    const response = await client
      .from("promotions")
      .select(selectClause)
      .eq("id", promotionId)
      .maybeSingle();

    if (!response.error) {
      return response.data || null;
    }

    lastError = response.error;
    const canRetry =
      index < selectOptions.length - 1 &&
      (isSchemaCompatibilityError(response.error, "image_path") ||
        isSchemaCompatibilityError(response.error, "image_url") ||
        isSchemaCompatibilityError(response.error, "image"));

    if (!canRetry) {
      break;
    }
  }

  throw lastError || new Error("promotion_lookup_failed");
};

const getReadableErrorMessage = (error, fallbackText) => {
  const message = String(error?.message || error?.error_description || "").trim();

  if (!message) {
    return fallbackText;
  }

  if (message === "supabase_not_loaded") {
    return "ยังโหลด Supabase ไม่สำเร็จ กรุณารีเฟรชหน้าแล้วลองใหม่";
  }

  if (message.toLowerCase().includes("failed to fetch")) {
    return "ไม่สามารถเชื่อมต่อฐานข้อมูลได้ในขณะนี้ ระบบออนไลน์อาจยังตั้งค่า URL ไม่ถูกต้องหรือปลายทางไม่พร้อมใช้งาน";
  }

  if (message.toLowerCase().includes("timed out") || message.toLowerCase().includes("timeout")) {
    return "การเชื่อมต่อฐานข้อมูลใช้เวลานานเกินไป ระบบออนไลน์อาจไม่พร้อมใช้งาน ตอนนี้สามารถบันทึกแบบในเครื่องแทนได้";
  }

  if (message.toLowerCase().includes("bucket")) {
    return `ไม่สามารถอัปโหลดไฟล์ได้: ${message}`;
  }

  if (message.toLowerCase().includes("row-level security") || message.toLowerCase().includes("policy")) {
    return `Supabase ยังไม่อนุญาตให้บันทึกข้อมูล: ${message}`;
  }

  if (message.toLowerCase().includes("relation") || message.toLowerCase().includes("column")) {
    return `โครงสร้างตารางใน Supabase ยังไม่ตรง: ${message}`;
  }

  return `${fallbackText} (${message})`;
};

const isPdfFile = (item) => {
  const fileType = String(item?.fileType || item?.file_type || "").toLowerCase();
  const imageValue = String(item?.image || item?.file_url || "");
  return fileType.includes("pdf") || imageValue.startsWith("data:application/pdf");
};

const kindLabels = {
  th: {
    promotion: "โปรโมชั่น",
    news: "ข่าวสาร",
    highlight: "ไฮไลต์"
  },
  en: {
    promotion: "Promotion",
    news: "News",
    highlight: "Highlight"
  }
};

const formatPromotionDate = (dateValue, lang) => {
  if (!dateValue) {
    return "";
  }

  const date = new Date(`${dateValue}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  const locale = lang === "en" ? "en-US" : "th-TH";
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(date);
};

const isPublishedPromotion = (dateValue) => {
  if (!dateValue) {
    return false;
  }

  const publishDate = new Date(`${dateValue}T00:00:00`);
  if (Number.isNaN(publishDate.getTime())) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return publishDate.getTime() <= today.getTime();
};

const createStaffPromotionCard = (item, lang) => {
  const safeLang = lang === "en" ? "en" : "th";
  const summary = safeLang === "en" && item.summaryEn ? item.summaryEn : item.summary;
  const title = safeLang === "en" && item.titleEn ? item.titleEn : item.title;
  const kindLabel = kindLabels[safeLang][item.kind] || kindLabels[safeLang].promotion;

  return `
    <article class="promo-card promo-card-staff" data-staff-item="true">
      <div class="promo-card-media">
        <img src="${escapeHtml(String(item.image_url || item.image || ""))}" alt="${escapeHtml(title)}">
      </div>
      <div class="promo-card-copy">
        <div class="promo-meta">
          <span>${escapeHtml(formatPromotionDate(item.publish_date || item.date || "", safeLang))}</span>
        </div>
        <span class="promo-tag">${escapeHtml(kindLabel)}</span>
        <h3>${escapeHtml(title)}</h3>
        <p>${escapeHtml(summary || "")}</p>
      </div>
    </article>
  `;
};

const normalizePromotionValue = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

const getPublicPromotionKey = (item) =>
  [
    normalizePromotionValue(item.title),
    normalizePromotionValue(item.titleEn || item.title)
  ].join("|");

const createPaginationButton = (label, page, isActive = false, isDisabled = false) => {
  const disabledAttr = isDisabled ? ' aria-disabled="true"' : "";
  const activeClass = isActive ? " is-active" : "";
  const disabledClass = isDisabled ? " is-disabled" : "";
  return `<a href="#" class="${`promo-page-link${activeClass}${disabledClass}`.trim()}" data-page="${page}"${disabledAttr}>${label}</a>`;
};

const languageContent = {
  th: {
    common: {
      follow: "ติดตามเราได้ที่",
      nav: ["หน้าแรก", "สินค้าและร้านค้า", "ข่าวสารและโปรโมชั่น", "ช้อปปิ้งออนไลน์", "ติดต่อเรา"],
      footerClass: "lang-th"
    },
    pages: {
      "index.html": {
        title: "Sophon Market | Sophon Supermarket",
        description: "Sophon Market ซูเปอร์มาร์เก็ตสำหรับทุกวัน พร้อมสินค้าอุปโภคบริโภค อาหารสด และโปรโมชั่นประจำสัปดาห์",
        apply() {
          setImageSource(".brochure-image", "assets/sp-2.png");
          setImageSource(".about-gallery-single img", "assets/sp-3.png");
          setText(".brochure-button", "โบรชัวร์ออนไลน์ >");
          setText(".map-card-overlay p:nth-of-type(1)", "(โสภณซุปเปอร์)");
          setText(".map-open-link", "เปิดใน Google Maps");
        }
      },
      "products.html": {
        title: "สินค้าและร้านค้า | Sophon Market",
        description: "สินค้าและร้านค้าของ Sophon Market รวมหมวดสินค้าหลัก พร้อมแบนเนอร์โบรชัวร์ออนไลน์",
        apply() {
          setText(".products-hero-header h1", "สินค้าและบริการของเรา");
          setText(".products-heading h2", "ประเภทสินค้า");
          setTexts(".category-item h3", [
            "อาหารแห้ง",
            "เครื่องดื่ม",
            "ผลิตภัณฑ์นม",
            "ขนมและลูกอม",
            "สุขภาพและความงาม",
            "ผลิตภัณฑ์ทำความสะอาด",
            "อุปกรณ์และของใช้ในครัวเรือน",
            "ผลิตภัณฑ์สำหรับสัตว์เลี้ยง"
          ]);
          setText(".products-brochure-button", "โบรชัวร์ออนไลน์ >");
        }
      },
      "promotions.html": {
        title: "ข่าวสารและโปรโมชั่น | Sophon Market",
        description: "รวมข่าวสาร โปรโมชั่น และไฮไลต์ประจำสัปดาห์ของ Sophon Market",
        apply() {
          setText(".promo-top-heading h1", "ข่าวสารและโปรโมชั่น");
          setText(".promo-grid-heading h2", "โปรโมชั่นอื่น ๆ");
          setTexts(".promo-tag", []);
        }
      },
      "shopping.html": {
        title: "ช้อปปิ้งออนไลน์ | Sophon Market",
        description: "ช้อปปิ้งออนไลน์กับ Sophon Market สั่งง่าย ตอบไว และประสานงานรับสินค้าได้สะดวกผ่านช่องทางออนไลน์ของร้าน",
        apply() {
          setText(".shopping-hero-copy h1", "ช้อปปิ้งออนไลน์");
          setTexts(".shopping-section-heading h2", ["ขั้นตอนการสั่งซื้อ", "ช่องทางการสั่งซื้อ"]);
          setTexts(".shopping-section-heading p", [
            "3 ขั้นตอนง่าย ๆ เพื่อให้การสั่งซื้อสินค้าสะดวก รวดเร็ว และชัดเจนมากยิ่งขึ้น",
            "เลือกช่องทางที่สะดวกที่สุดสำหรับการติดต่อสอบถามสินค้า โปรโมชั่น และการสั่งซื้อ"
          ]);
          setTexts(".shopping-step-card h3", [
            "เลือกสินค้าที่ต้องการ",
            "ส่งคำสั่งซื้อทางออนไลน์",
            "ยืนยันและรับสินค้า"
          ]);
          setTexts(".shopping-step-card p", [
            "เลือกดูสินค้า โปรโมชั่น หรือรายการที่ต้องการสั่งซื้อจากช่องทางออนไลน์ของร้าน",
            "ติดต่อผ่าน Line หรือโทรศัพท์ เพื่อแจ้งรายการสินค้าและจำนวนที่ต้องการ",
            "ทีมงานยืนยันข้อมูล รายละเอียดสินค้า และเวลารับสินค้า เพื่อให้คุณรับสินค้าได้สะดวกมากที่สุด"
          ]);
          setTexts(".shopping-channel-card h3", ["Line Official", "โทรสั่งซื้อ"]);
          setTexts(".shopping-channel-card p", [
            "เหมาะสำหรับสอบถามสินค้า แจ้งรายการสั่งซื้อ และรับการตอบกลับได้อย่างรวดเร็วผ่านแชท",
            "โทรหาเจ้าหน้าที่เพื่อสอบถามสินค้า สั่งซื้อโดยตรง และนัดรับสินค้าได้อย่างสะดวก"
          ]);
          setTexts(".shopping-channel-card a", ["เริ่มแชท", "065 262 6861"]);
        }
      },
      "contact.html": {
        title: "ติดต่อเรา | Sophon Market",
        description: "ติดต่อ Sophon Market เพื่อสอบถามสินค้า โปรโมชั่น การรับสินค้า และข้อมูลร้าน ผ่านช่องทางที่สะดวกสำหรับคุณ",
        apply() {
          setText(".contact-hero-copy h1", "ติดต่อเรา");
          setTexts(".contact-section-heading h2", ["ช่องทางการติดต่อ", "ที่ตั้งร้านและแผนที่"]);
          setTexts(".contact-section-heading p", [
            "เลือกช่องทางที่สะดวกที่สุดสำหรับการสอบถามสินค้า ติดต่อทีมงาน หรือประสานงานรับสินค้า",
            "หากต้องการเดินทางมาที่ร้าน สามารถดูตำแหน่งร้าน เบอร์โทรศัพท์ และรายละเอียดการติดต่อได้จากส่วนนี้"
          ]);
          setTexts(".contact-card h3", ["โทรศัพท์", "Line Official", "Facebook"]);
          setTexts(".contact-card p", [
            "ติดต่อด่วน สอบถามและยืนยันข้อมูลกับทีมงานได้ทันที",
            "แชทสะดวก รวดเร็ว ตอบกลับไว",
            "ติดตามข่าวสาร โปรโมชั่น และสอบถามเพิ่มเติมได้"
          ]);
          setTexts(".contact-card a", ["065 262 6861", "เริ่มแชท", "ดูช่องทาง"]);
          setText(".contact-map-info h3", "โสภณซุปเปอร์");
          setTexts(".contact-map-row strong", ["ที่อยู่", "โทรศัพท์", "เวลาทำการ"]);
          setTexts(".contact-map-row p", [
            "99/9 หมู่ 6 หนองปลาไหล เมืองพัทยา อำเภอบางละมุง ชลบุรี 20150",
            "065 262 6861",
            "7:30–19:30"
          ]);
          setText(".contact-map-info a", "เปิดใน Google Maps");
        }
      },
      "brochure.html": {
        title: "โบรชัวร์ออนไลน์ | Sophon Market",
        description: "โบรชัวร์ออนไลน์ของ Sophon Market สำหรับโปรโมชั่นและสินค้าเด่นในแต่ละช่วงเวลา",
        apply() {
          setText(".brochure-page-hero h1", "โบรชัวร์ออนไลน์");
          setText(".brochure-page-back", "กลับสู่หน้าแรก");
        }
      }
    }
  },
  en: {
    common: {
      follow: "Follow us on",
      nav: ["Home", "Products & Store", "News & Promotions", "Online Shopping", "Contact Us"],
      footerClass: "lang-en"
    },
    pages: {
      "index.html": {
        title: "Sophon Market | Sophon Supermarket",
        description: "Sophon Market supermarket for everyday shopping, with groceries, fresh food, and weekly promotions.",
        apply() {
          setImageSource(".brochure-image", "assets/sp-2.png");
          setImageSource(".about-gallery-single img", "assets/sp-3-2.png");
          setText(".brochure-button", "Online Brochure >");
          setText(".map-card-overlay p:nth-of-type(1)", "(Sophon Super)");
          setText(".map-open-link", "Open in Google Maps");
        }
      },
      "products.html": {
        title: "Products & Store | Sophon Market",
        description: "Explore product categories and online brochure highlights from Sophon Market.",
        apply() {
          setText(".products-hero-header h1", "Our Products & Services");
          setText(".products-heading h2", "Product Categories");
          setTexts(".category-item h3", [
            "Dry Food",
            "Beverages",
            "Dairy Products",
            "Snacks & Candy",
            "Health & Beauty",
            "Cleaning Products",
            "Home & Kitchen Supplies",
            "Pet Products"
          ]);
          setText(".products-brochure-button", "Online Brochure >");
        }
      },
      "promotions.html": {
        title: "News & Promotions | Sophon Market",
        description: "See the latest news, promotions, and weekly highlights from Sophon Market.",
        apply() {
          setText(".promo-top-heading h1", "News & Promotions");
          setText(".promo-grid-heading h2", "More Promotions");
          setTexts(".promo-tag", []);
        }
      },
      "shopping.html": {
        title: "Online Shopping | Sophon Market",
        description: "Shop online with Sophon Market through easy ordering channels and convenient pickup coordination.",
        apply() {
          setText(".shopping-hero-copy h1", "Online Shopping");
          setTexts(".shopping-section-heading h2", ["Ordering Steps", "Ordering Channels"]);
          setTexts(".shopping-section-heading p", [
            "Three simple steps to make ordering groceries easier, faster, and clearer.",
            "Choose the most convenient way to ask about products, promotions, and place your order."
          ]);
          setTexts(".shopping-step-card h3", [
            "Choose Your Products",
            "Send Your Order Online",
            "Confirm & Pick Up"
          ]);
          setTexts(".shopping-step-card p", [
            "Browse products, promotions, or any items you want to order through the store's online channels.",
            "Contact us via Line or phone to send your order list and quantities.",
            "Our team confirms your details, product availability, and pickup time for the smoothest experience."
          ]);
          setTexts(".shopping-channel-card h3", ["Line Official", "Order by Phone"]);
          setTexts(".shopping-channel-card p", [
            "Best for quick product inquiries, order lists, and fast chat responses.",
            "Call our staff directly to ask about products, place your order, and schedule pickup."
          ]);
          setTexts(".shopping-channel-card a", ["Start Chat", "065 262 6861"]);
        }
      },
      "contact.html": {
        title: "Contact Us | Sophon Market",
        description: "Contact Sophon Market for product inquiries, promotions, pickup details, and store information.",
        apply() {
          setText(".contact-hero-copy h1", "Contact Us");
          setTexts(".contact-section-heading h2", ["Contact Channels", "Store Location & Map"]);
          setTexts(".contact-section-heading p", [
            "Choose the most convenient channel to ask about products, contact our team, or coordinate pickup.",
            "If you plan to visit our store, you can check the location, phone number, and contact details here."
          ]);
          setTexts(".contact-card h3", ["Phone", "Line Official", "Facebook"]);
          setTexts(".contact-card p", [
            "For urgent inquiries and quick confirmation directly with our team.",
            "Easy and fast chat support with quick responses.",
            "Follow our updates, promotions, and ask for more information anytime."
          ]);
          setTexts(".contact-card a", ["065 262 6861", "Start Chat", "View Channel"]);
          setText(".contact-map-info h3", "Sophon Super");
          setTexts(".contact-map-row strong", ["Address", "Phone", "Opening Hours"]);
          setTexts(".contact-map-row p", [
            "99/9 Moo 6, Nong Pla Lai, Pattaya City, Bang Lamung, Chon Buri 20150",
            "065 262 6861",
            "7:30-19:30"
          ]);
          setText(".contact-map-info a", "Open in Google Maps");
        }
      },
      "brochure.html": {
        title: "Online Brochure | Sophon Market",
        description: "Online brochure from Sophon Market featuring current promotions and product highlights.",
        apply() {
          setText(".brochure-page-hero h1", "Online Brochure");
          setText(".brochure-page-back", "Back to Home");
        }
      }
    }
  }
};

const applyLanguage = (lang) => {
  const safeLang = lang === "en" ? "en" : "th";
  const config = languageContent[safeLang];
  const pageConfig = config.pages[pageName];

  document.documentElement.lang = safeLang;
  document.body.classList.toggle("lang-en", safeLang === "en");

  setText(".utility-left > span", config.common.follow);
  setTexts(".site-nav a", config.common.nav);

  if (pageConfig) {
    document.title = pageConfig.title;
    setMetaDescription(pageConfig.description);
    pageConfig.apply();
  }

  languageButtons.forEach((button) => {
    const isActive = button.dataset.lang === safeLang;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  if (pageName === "promotions.html") {
    renderStaffPromotions(safeLang);
  }

  if (pageName === "brochure.html") {
    void renderPublicBrochuresSupabase();
  }
};

const renderStaffPromotions = async (lang) => {
  const renderToken = ++staffPromotionRenderToken;
  const promoGrid = document.querySelector("#promo-grid");
  const emptyState = document.querySelector("#promo-empty-state");
  const pagination = document.querySelector("#promo-staff-pagination");
  const gridHeading = document.querySelector("#promo-grid-heading");
  const featuredImage = document.querySelector(".promo-top-banner img");
  if (!promoGrid) {
    return;
  }

  promoGrid.innerHTML = "";
  if (gridHeading) {
    gridHeading.hidden = true;
  }
  promoGrid.hidden = true;
  let items = [];
  try {
    items = await fetchStaffPromotions();
  } catch {
    if (renderToken !== staffPromotionRenderToken) {
      return;
    }

    if (emptyState) {
      emptyState.innerHTML =
        lang === "en"
          ? '<div class="promo-empty-card"><h3>Unable to load promotions</h3><p>Please try again later.</p></div>'
          : '<div class="promo-empty-card"><h3>ไม่สามารถโหลดโปรโมชั่นได้</h3><p>กรุณาลองใหม่อีกครั้งภายหลัง</p></div>';
    }
    if (pagination) {
      pagination.innerHTML = "";
    }
    if (featuredImage) {
      featuredImage.src = "assets/promotion.png";
    }
    return;
  }

  if (renderToken !== staffPromotionRenderToken) {
    return;
  }

  const publishedItems = items.filter((item) => {
    const hasImage = String(item.image_url || item.image || "").trim();
    const hasTitle = String(item.title || item.titleEn || "").trim();
    const hasSummary = String(item.summary || item.summaryEn || "").trim();
    return Boolean(hasImage && hasTitle && hasSummary && isPublishedPromotion(item.publish_date));
  });
  const uniquePublishedItems = Array.from(
    publishedItems.reduce((map, item) => {
      const key = getPublicPromotionKey(item);
      if (!map.has(key)) {
        map.set(key, item);
      }
      return map;
    }, new Map()).values()
  );

  if (!uniquePublishedItems.length) {
    if (emptyState) {
      emptyState.innerHTML =
        lang === "en"
          ? '<div class="promo-empty-card"><h3>No published promotions yet</h3><p>Staff items will appear here automatically when their selected publish date arrives.</p></div>'
          : '<div class="promo-empty-card"><h3>ยังไม่มีรายการที่เผยแพร่แล้ว</h3><p>รายการจากทีมงานจะขึ้นที่หน้านี้อัตโนมัติเมื่อถึงวันที่เผยแพร่ที่ตั้งไว้</p></div>';
    }
    if (pagination) {
      pagination.innerHTML = "";
    }
    if (featuredImage) {
      featuredImage.src = "assets/promotion.png";
    }
    return;
  }

  if (emptyState) {
    emptyState.innerHTML = "";
  }

  const sortedItems = [...uniquePublishedItems].sort((a, b) => String(b.publish_date).localeCompare(String(a.publish_date)));

  if (featuredImage) {
    featuredImage.src = "assets/promotion.png";
    featuredImage.alt = lang === "en" ? "News and promotions" : "ข่าวสารและโปรโมชั่น";
  }

  if (gridHeading) {
    gridHeading.hidden = false;
  }
  promoGrid.hidden = false;

  const totalPages = Math.max(1, Math.ceil(sortedItems.length / staffPromotionsPerPage));
  const url = new URL(window.location.href);
  const currentPage = Math.min(
    totalPages,
    Math.max(1, Number.parseInt(url.searchParams.get("promoPage") || "1", 10) || 1)
  );
  const startIndex = (currentPage - 1) * staffPromotionsPerPage;
  const pageItems = sortedItems.slice(startIndex, startIndex + staffPromotionsPerPage);
  const cards = pageItems.map((item) => createStaffPromotionCard(item, lang)).join("");
  promoGrid.insertAdjacentHTML("afterbegin", cards);

  if (pagination) {
    if (totalPages <= 1) {
      pagination.innerHTML = "";
    } else {
      const previousLabel = "&lt;&lt;";
      const nextLabel = "&gt;&gt;";
      const buttons = [
        createPaginationButton(previousLabel, Math.max(1, currentPage - 1), false, currentPage === 1),
        ...Array.from({ length: totalPages }, (_, index) =>
          createPaginationButton(String(index + 1), index + 1, index + 1 === currentPage)
        ),
        createPaginationButton(nextLabel, Math.min(totalPages, currentPage + 1), false, currentPage === totalPages)
      ];
      pagination.innerHTML = buttons.join("");
    }
  }
};

const renderStaffPromoList = async () => {
  const list = document.querySelector("#staff-promo-list");
  if (!list) {
    return;
  }

  let items = [];
  try {
    items = await fetchStaffPromotions();
  } catch {
    list.innerHTML = '<div class="staff-promo-empty">ไม่สามารถโหลดรายการได้</div>';
    return;
  }

  if (!items.length) {
    list.innerHTML = '<div class="staff-promo-empty">ยังไม่มีรายการที่บันทึกไว้</div>';
    return;
  }

  list.innerHTML = items
    .slice()
    .sort((a, b) => String(b.publish_date).localeCompare(String(a.publish_date)))
    .map(
      (item) => `
        <article class="staff-promo-item" data-staff-id="${escapeHtml(item.id)}">
          <img src="${escapeHtml(item.image_url || item.image || "")}" alt="${escapeHtml(item.title)}" class="staff-promo-thumb">
          <div>
            <div class="staff-promo-item-head">
              <span class="staff-promo-kind">${escapeHtml(kindLabels.th[item.kind] || "โปรโมชั่น")}</span>
              <h3>${escapeHtml(item.title)}</h3>
            </div>
            <p class="staff-promo-date">วันเผยแพร่: ${escapeHtml(formatPromotionDate(item.publish_date || item.date || "", "th"))}</p>
            <p class="staff-promo-summary">${escapeHtml(item.summary)}</p>
            <div class="staff-promo-item-actions">
              <a href="/promotions" class="staff-item-link">ดูหน้าโปรโมชั่น</a>
              <button type="button" class="staff-item-delete" data-delete-id="${escapeHtml(item.id)}">ลบรายการ</button>
            </div>
          </div>
        </article>
      `
    )
    .join("");
};

const initStaffPromotionsPage = () => {
  if (pageName !== "staff-promotions.html") {
    return;
  }

  const form = document.querySelector("#staff-promo-form");
  const status = document.querySelector("#staff-promo-status");
  const clearButton = document.querySelector("#staff-clear-promos");
  const list = document.querySelector("#staff-promo-list");
  const imageFileInput = document.querySelector("#staff-image-file");
  const imagePreview = document.querySelector("#staff-image-preview");
  let selectedImageData = "";

  if (!form || !status || !clearButton || !list || !imageFileInput || !imagePreview) {
    return;
  }

  const updatePreview = (src) => {
    const value = String(src || "").trim();
    if (!value) {
      imagePreview.removeAttribute("src");
      imagePreview.classList.remove("is-visible");
      return;
    }

    imagePreview.setAttribute("src", value);
    imagePreview.classList.add("is-visible");
  };

  void renderStaffPromoList();

  imageFileInput.addEventListener("change", async () => {
    const [file] = imageFileInput.files || [];
    if (!file) {
      selectedImageData = "";
      updatePreview("");
      return;
    }

    try {
      selectedImageData = await fileToDataUrl(file);
      updatePreview(selectedImageData);
      status.textContent = "อัปโหลดรูปเรียบร้อยแล้ว";
    } catch {
      selectedImageData = "";
      status.textContent = "ไม่สามารถอ่านไฟล์รูปได้";
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const [file] = imageFileInput.files || [];
    const newItem = {
      kind: String(formData.get("kind") || "promotion"),
      title: String(formData.get("title") || "").trim(),
      summary: String(formData.get("summary") || "").trim(),
      publish_date: String(formData.get("date") || "").trim()
    };

    if (!newItem.title || !newItem.summary || !file || !newItem.publish_date) {
      status.textContent = "เธเธฃเธธเธ“เธฒเธเธฃเธญเธเธเนเธญเธกเธนเธฅเนเธซเนเธเธฃเธเธเนเธญเธเธเธฑเธเธ—เธถเธ";
      return;
    }

    status.textContent = "เธเธณเธฅเธฑเธเธญเธฑเธเนเธซเธฅเธ”เนเธเธฃเนเธกเธเธฑเนเธ...";

    try {
      const uploaded = await uploadFileToBucket("promotions", "images", file);
      const client = getSupabaseClient();
      const { error } = await client.from("promotions").insert([
        {
          kind: newItem.kind,
          title: newItem.title,
          image_url: uploaded.publicUrl,
          image_path: uploaded.filePath,
          image_name: uploaded.fileName,
          summary: newItem.summary,
          publish_date: newItem.publish_date
        }
      ]);

      if (error) {
        throw error;
      }
    } catch {
      status.textContent = "เนเธกเนเธชเธฒเธกเธฒเธฃเธ–เธเธฑเธเธ—เธถเธเธฃเธฒเธขเธเธฒเธฃเนเธ”เน เธเธฃเธธเธ“เธฒเธฅเธญเธเนเธซเธกเนเธญเธตเธเธเธฃเธฑเนเธ";
      return;
    }
    form.reset();
    selectedImageData = "";
    updatePreview("");
    status.textContent = "เธเธฑเธเธ—เธถเธเธฃเธฒเธขเธเธฒเธฃเน€เธฃเธตเธขเธเธฃเนเธญเธขเนเธฅเนเธง";
    void renderStaffPromoList();
  });

  list.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const deleteId = target.getAttribute("data-delete-id");
    if (!deleteId) {
      return;
    }

    const nextItems = getStaffPromotions().filter((item) => item.id !== deleteId);
    setStaffPromotions(nextItems);
    status.textContent = "เธฅเธเธฃเธฒเธขเธเธฒเธฃเน€เธฃเธตเธขเธเธฃเนเธญเธขเนเธฅเนเธง";
    renderStaffPromoList();
  });

  clearButton.addEventListener("click", () => {
    setStaffPromotions([]);
    status.textContent = "เธฅเธเธฃเธฒเธขเธเธฒเธฃเธ—เธฑเนเธเธซเธกเธ”เน€เธฃเธตเธขเธเธฃเนเธญเธขเนเธฅเนเธง";
    renderStaffPromoList();
  });
};

const renderStaffBrochureList = () => {
  const list = document.querySelector("#staff-brochure-list");
  if (!list) {
    return;
  }

  const items = getStaffBrochures();

  if (!items.length) {
    list.innerHTML = '<div class="staff-promo-empty">เธขเธฑเธเนเธกเนเธกเธตเนเธเธฃเธเธฑเธงเธฃเนเธ—เธตเนเธเธฑเธเธ—เธถเธเนเธงเน</div>';
    return;
  }

  list.innerHTML = items
    .slice()
    .sort((a, b) => String(b.date).localeCompare(String(a.date)))
    .map(
      (item) => `
        <article class="staff-promo-item" data-staff-id="${escapeHtml(item.id)}">
          ${
            isPdfFile(item)
              ? '<div class="staff-promo-thumb staff-promo-thumb-pdf">PDF</div>'
              : `<img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}" class="staff-promo-thumb">`
          }
          <div>
            <div class="staff-promo-item-head">
              <span class="staff-promo-kind">เนเธเธฃเธเธฑเธงเธฃเน</span>
              <h3>${escapeHtml(item.title)}</h3>
            </div>
            <p class="staff-promo-date">เธงเธฑเธเธ—เธตเนเนเธชเธ”เธ: ${escapeHtml(formatPromotionDate(item.date, "th"))}</p>
            ${item.summary ? `<p class="staff-promo-summary">${escapeHtml(item.summary)}</p>` : ""}
            <div class="staff-promo-item-actions">
              <a href="brochure.html" class="staff-item-link">เธ”เธนเธซเธเนเธฒเนเธเธฃเธเธฑเธงเธฃเน</a>
              <button type="button" class="staff-item-delete" data-delete-brochure-id="${escapeHtml(item.id)}">เธฅเธเธฃเธฒเธขเธเธฒเธฃ</button>
            </div>
          </div>
        </article>
      `
    )
    .join("");
};

const initStaffBrochuresPage = () => {
  if (pageName !== "staff-brochures.html") {
    return;
  }

  const form = document.querySelector("#staff-brochure-form");
  const status = document.querySelector("#staff-brochure-status");
  const clearButton = document.querySelector("#staff-clear-brochures");
  const list = document.querySelector("#staff-brochure-list");
  const imageFileInput = document.querySelector("#staff-brochure-image-file");
  let selectedImageData = "";
  let selectedFileType = "";
  let selectedFileName = "";

  if (!form || !status || !clearButton || !list || !imageFileInput) {
    return;
  }

  renderStaffBrochureList();

  imageFileInput.addEventListener("change", async () => {
    const [file] = imageFileInput.files || [];
    if (!file) {
      selectedImageData = "";
      selectedFileType = "";
      selectedFileName = "";
      return;
    }

    try {
      selectedImageData = await fileToDataUrl(file);
      selectedFileType = String(file.type || "").toLowerCase();
      selectedFileName = String(file.name || "");
      status.textContent = selectedFileType.includes("pdf")
        ? "เธญเธฑเธเนเธซเธฅเธ”เนเธเธฅเน PDF เน€เธฃเธตเธขเธเธฃเนเธญเธขเนเธฅเนเธง"
        : "เธญเธฑเธเนเธซเธฅเธ”เธฃเธนเธเนเธเธฃเธเธฑเธงเธฃเนเน€เธฃเธตเธขเธเธฃเนเธญเธขเนเธฅเนเธง";
    } catch {
      selectedImageData = "";
      selectedFileType = "";
      selectedFileName = "";
      status.textContent = "เนเธกเนเธชเธฒเธกเธฒเธฃเธ–เธญเนเธฒเธเนเธเธฅเนเธฃเธนเธเนเธ”เน";
    }
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const newItem = {
      id: `brochure-${Date.now()}`,
      title: String(formData.get("title") || "").trim(),
      summary: "",
      image: selectedImageData,
      date: String(formData.get("date") || "").trim(),
      fileType: selectedFileType,
      fileName: selectedFileName
    };

    if (!newItem.title || !newItem.image || !newItem.date) {
      status.textContent = "เธเธฃเธธเธ“เธฒเธเธฃเธญเธเธเนเธญเธกเธนเธฅเนเธซเนเธเธฃเธเธเนเธญเธเธเธฑเธเธ—เธถเธ";
      return;
    }

    const items = getStaffBrochures();
    items.unshift(newItem);
    try {
      setStaffBrochures(items);
    } catch {
      status.textContent = selectedFileType.includes("pdf")
        ? "เนเธกเนเธชเธฒเธกเธฒเธฃเธ–เธเธฑเธเธ—เธถเธเนเธเธฅเน PDF เธเธตเนเนเธ”เน เน€เธเธทเนเธญเธเธเธฒเธเนเธเธฅเนเธกเธตเธเธเธฒเธ”เนเธซเธเนเน€เธเธดเธเนเธเธชเธณเธซเธฃเธฑเธเธฃเธฐเธเธเธเธฑเธเธเธธเธเธฑเธ เธเธฃเธธเธ“เธฒเนเธเนเนเธเธฅเนเธ—เธตเนเน€เธฅเนเธเธฅเธเธซเธฃเธทเธญเนเธเธฅเธเน€เธเนเธเธฃเธนเธเธ เธฒเธ"
        : "เนเธกเนเธชเธฒเธกเธฒเธฃเธ–เธเธฑเธเธ—เธถเธเนเธเธฅเนเธเธตเนเนเธ”เน เธเธฃเธธเธ“เธฒเธฅเธญเธเนเธเนเนเธเธฅเนเธ—เธตเนเน€เธฅเนเธเธฅเธ";
      return;
    }
    form.reset();
    selectedImageData = "";
    selectedFileType = "";
    selectedFileName = "";
    status.textContent = "เธเธฑเธเธ—เธถเธเนเธเธฃเธเธฑเธงเธฃเนเน€เธฃเธตเธขเธเธฃเนเธญเธขเนเธฅเนเธง";
    renderStaffBrochureList();
    renderPublicBrochures();
  });

  list.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const deleteId = target.getAttribute("data-delete-brochure-id");
    if (!deleteId) {
      return;
    }

    const nextItems = getStaffBrochures().filter((item) => item.id !== deleteId);
    setStaffBrochures(nextItems);
    status.textContent = "เธฅเธเนเธเธฃเธเธฑเธงเธฃเนเน€เธฃเธตเธขเธเธฃเนเธญเธขเนเธฅเนเธง";
    renderStaffBrochureList();
    renderPublicBrochures();
  });

  clearButton.addEventListener("click", () => {
    setStaffBrochures([]);
    status.textContent = "เธฅเธเนเธเธฃเธเธฑเธงเธฃเนเธ—เธฑเนเธเธซเธกเธ”เน€เธฃเธตเธขเธเธฃเนเธญเธขเนเธฅเนเธง";
    renderStaffBrochureList();
    renderPublicBrochures();
  });
};

const renderPublicBrochures = () => {
  if (pageName !== "brochure.html") {
    return;
  }

  const list = document.querySelector("#brochure-page-list");
  const fallback = document.querySelector("#brochure-page-default");
  const empty = document.querySelector("#brochure-page-empty");

  if (!list) {
    return;
  }

  const items = getStaffBrochures()
    .filter((item) => isPublishedPromotion(item.date))
    .sort((a, b) => String(b.date).localeCompare(String(a.date)));

  if (!items.length) {
    list.innerHTML = "";
    if (fallback) {
      fallback.hidden = false;
    }
    if (empty) {
      empty.innerHTML = "";
    }
    return;
  }

  if (fallback) {
    fallback.hidden = true;
  }

  list.innerHTML = items
    .map(
      (item) => {
        const dateLabel = escapeHtml(
          formatPromotionDate(item.date, document.documentElement.lang === "en" ? "en" : "th")
        );
        const title = escapeHtml(item.title);
        const summary = item.summary ? `<p>${escapeHtml(item.summary)}</p>` : "";

        if (isPdfFile(item)) {
          return `
            <article class="brochure-public-card brochure-public-card-booklet">
              <div class="brochure-public-booklet">
                <div class="brochure-public-booklet-top">
                  <div class="brochure-public-meta">${dateLabel}</div>
                  <a href="${escapeHtml(item.image)}" class="brochure-page-back brochure-public-open" target="_blank" rel="noreferrer">เน€เธเธดเธ” PDF</a>
                </div>
                <h2>${title}</h2>
                ${summary}
                <div class="brochure-public-viewer-wrap">
                  <iframe
                    src="${escapeHtml(item.image)}#toolbar=0&navpanes=0&scrollbar=1&view=FitH"
                    class="brochure-public-viewer"
                    title="${title}"
                  ></iframe>
                </div>
              </div>
            </article>
          `;
        }

        return `
          <article class="brochure-public-card">
            <img src="${escapeHtml(item.image)}" alt="${title}" class="brochure-public-image">
            <div class="brochure-public-copy">
              <div class="brochure-public-meta">${dateLabel}</div>
              <h2>${title}</h2>
              ${summary}
            </div>
          </article>
        `;
      }
    )
    .join("");

  if (empty) {
    empty.innerHTML = "";
  }
};

const renderPublicBrochuresSupabase = async () => {
  if (pageName !== "brochure.html") {
    return;
  }

  const list = document.querySelector("#brochure-page-list");
  const fallback = document.querySelector("#brochure-page-default");
  const empty = document.querySelector("#brochure-page-empty");

  if (!list) {
    return;
  }

  let items = [];

  try {
    items = (await fetchStaffBrochures())
      .filter((item) => isPublishedPromotion(item.display_date))
      .sort((a, b) => String(b.display_date || "").localeCompare(String(a.display_date || "")));
  } catch {
    list.innerHTML = "";
    if (fallback) {
      fallback.hidden = false;
    }
    if (empty) {
      empty.innerHTML = "<p>ไม่สามารถโหลดโบรชัวร์ได้ในขณะนี้</p>";
    }
    return;
  }

  if (!items.length) {
    list.innerHTML = "";
    if (fallback) {
      fallback.hidden = false;
    }
    if (empty) {
      empty.innerHTML = "";
    }
    return;
  }

  if (fallback) {
    fallback.hidden = true;
  }

  list.innerHTML = items
    .map((item) => {
      const dateLabel = escapeHtml(
        formatPromotionDate(item.display_date || "", document.documentElement.lang === "en" ? "en" : "th")
      );
      const title = escapeHtml(item.title);
      const rawFileUrl = String(item.file_url || "");
      const fileUrl = escapeHtml(rawFileUrl);
      const previewUrl = escapeHtml(isPdfFile(item) ? createGoogleDrivePreviewUrl(rawFileUrl) : rawFileUrl);
      const openUrl = escapeHtml(isPdfFile(item) ? createGoogleDriveOpenUrl(rawFileUrl) : rawFileUrl);

      if (isPdfFile(item)) {
        return `
          <article class="brochure-public-card brochure-public-card-booklet">
            <div class="brochure-public-booklet">
              <div class="brochure-public-booklet-top">
                <div class="brochure-public-meta">${dateLabel}</div>
                <a href="${openUrl}" class="brochure-page-back brochure-public-open" target="_blank" rel="noreferrer">เปิด PDF</a>
              </div>
              <h2>${title}</h2>
              <div class="brochure-public-viewer-wrap">
                <iframe
                  src="${previewUrl}"
                  class="brochure-public-viewer"
                  title="${title}"
                ></iframe>
              </div>
            </div>
          </article>
        `;
      }

      return `
        <article class="brochure-public-card">
          <img src="${fileUrl}" alt="${title}" class="brochure-public-image">
          <div class="brochure-public-copy">
            <div class="brochure-public-meta">${dateLabel}</div>
            <h2>${title}</h2>
          </div>
        </article>
      `;
    })
    .join("");

  if (empty) {
    empty.innerHTML = "";
  }
};

const renderStaffBrochureListSupabase = async () => {
  const list = document.querySelector("#staff-brochure-list");
  if (!list) {
    return;
  }

  let items = [];

  try {
    items = await fetchStaffBrochures();
  } catch {
    list.innerHTML = '<div class="staff-promo-empty">ไม่สามารถโหลดรายการโบรชัวร์ได้</div>';
    return;
  }

  if (!items.length) {
    list.innerHTML = '<div class="staff-promo-empty">ยังไม่มีโบรชัวร์ที่บันทึกไว้</div>';
    return;
  }

  list.innerHTML = items
    .slice()
    .sort((a, b) => String(b.display_date || "").localeCompare(String(a.display_date || "")))
    .map(
      (item) => `
        <article class="staff-promo-item" data-staff-id="${escapeHtml(item.id || "")}">
          ${
            isPdfFile(item)
              ? '<div class="staff-promo-thumb staff-promo-thumb-pdf">PDF</div>'
              : `<img src="${escapeHtml(item.file_url || "")}" alt="${escapeHtml(item.title)}" class="staff-promo-thumb">`
          }
          <div>
            <div class="staff-promo-item-head">
              <span class="staff-promo-kind">โบรชัวร์</span>
              <h3>${escapeHtml(item.title)}</h3>
            </div>
            <p class="staff-promo-date">วันแสดง: ${escapeHtml(formatPromotionDate(item.display_date || "", "th"))}</p>
            <div class="staff-promo-item-actions">
              <a href="brochure.html" class="staff-item-link">ดูหน้าโบรชัวร์</a>
              <button type="button" class="staff-item-delete" data-delete-brochure-id="${escapeHtml(item.id || "")}">ลบรายการ</button>
            </div>
          </div>
        </article>
      `
    )
    .join("");
};

const initStaffBrochuresPageSupabase = () => {
  if (pageName !== "staff-brochures.html") {
    return;
  }

  const form = document.querySelector("#staff-brochure-form");
  const status = document.querySelector("#staff-brochure-status");
  const clearButton = document.querySelector("#staff-clear-brochures");
  const list = document.querySelector("#staff-brochure-list");
  const imageFileInput = document.querySelector("#staff-brochure-image-file");
  const driveUrlInput = document.querySelector("#staff-brochure-drive-url");

  if (!form || !status || !list || !imageFileInput || !driveUrlInput) {
    return;
  }

  void renderStaffBrochureListSupabase();

  imageFileInput.addEventListener("change", () => {
    const [file] = imageFileInput.files || [];
    if (!file) {
      return;
    }

    const isPdf = String(file.type || "").toLowerCase().includes("pdf");
    status.textContent = isPdf ? "อัปโหลดไฟล์ PDF เรียบร้อยแล้ว" : "อัปโหลดรูปโบรชัวร์เรียบร้อยแล้ว";
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const [file] = imageFileInput.files || [];
    const title = String(formData.get("title") || "").trim();
    const date = String(formData.get("date") || "").trim();
    const driveUrl = String(formData.get("driveUrl") || "").trim();

    if (!title || !date || (!file && !driveUrl)) {
      status.textContent = "กรุณากรอกชื่อ วันแสดง และเลือกไฟล์หรือใส่ลิงก์ Google Drive";
      return;
    }

    status.textContent = file ? "กำลังอัปโหลดโบรชัวร์..." : "กำลังบันทึกลิงก์โบรชัวร์...";

    try {
      let brochurePayload;

      if (driveUrl) {
        brochurePayload = {
          title,
          file_url: createGoogleDriveOpenUrl(driveUrl),
          file_path: null,
          file_name: title,
          file_type: "application/pdf",
          display_date: date
        };
      } else {
        const uploaded = await uploadFileToBucket("brochures", "files", file);
        brochurePayload = {
          title,
          file_url: uploaded.publicUrl,
          file_path: uploaded.filePath,
          file_name: uploaded.fileName,
          file_type: uploaded.fileType,
          display_date: date
        };
      }

      const client = getSupabaseClient();
      const { error } = await client.from("brochures").insert([
        brochurePayload
      ]);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("brochure_save_failed", error);
      status.textContent = getReadableErrorMessage(error, "ไม่สามารถบันทึกโบรชัวร์ได้ กรุณาลองใหม่อีกครั้ง");
      return;
    }

    form.reset();
    status.textContent = "บันทึกโบรชัวร์เรียบร้อยแล้ว";
    imageFileInput.value = "";
    driveUrlInput.value = "";
    void renderStaffBrochureListSupabase();
    void renderPublicBrochuresSupabase();
  });

  list.addEventListener("click", async (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const deleteId = target.getAttribute("data-delete-brochure-id");
    if (!deleteId) {
      return;
    }

    status.textContent = "กำลังลบโบรชัวร์...";

    try {
      const client = getSupabaseClient();
      const { data: existing, error: fetchError } = await client
        .from("brochures")
        .select("id,file_path")
        .eq("id", deleteId)
        .maybeSingle();

      if (fetchError) {
        throw fetchError;
      }

      if (existing?.file_path) {
        await deleteFileFromBucket("brochures", existing.file_path);
      }

      const { error: deleteError } = await client.from("brochures").delete().eq("id", deleteId);
      if (deleteError) {
        throw deleteError;
      }

      status.textContent = "ลบโบรชัวร์เรียบร้อยแล้ว";
      void renderStaffBrochureListSupabase();
      void renderPublicBrochuresSupabase();
    } catch {
      status.textContent = "ไม่สามารถลบโบรชัวร์ได้ กรุณาลองใหม่อีกครั้ง";
    }
  });

  if (clearButton) {
    clearButton.addEventListener("click", () => {
      status.textContent = "กรุณาลบทีละรายการจากรายการด้านขวา";
    });
  }
};

const initStaffPromotionsPageSupabase = () => {
  if (pageName !== "staff-promotions.html") {
    return;
  }

  const form = document.querySelector("#staff-promo-form");
  const status = document.querySelector("#staff-promo-status");
  const clearButton = document.querySelector("#staff-clear-promos");
  const list = document.querySelector("#staff-promo-list");
  const imageFileInput = document.querySelector("#staff-image-file");
  const imagePreview = document.querySelector("#staff-image-preview");
  let selectedImageData = "";

  if (!form || !status || !list || !imageFileInput || !imagePreview) {
    return;
  }

  const updatePreview = (src) => {
    const value = String(src || "").trim();
    if (!value) {
      imagePreview.removeAttribute("src");
      imagePreview.classList.remove("is-visible");
      return;
    }

    imagePreview.setAttribute("src", value);
    imagePreview.classList.add("is-visible");
  };

  void renderStaffPromoList();

  imageFileInput.addEventListener("change", async () => {
    const [file] = imageFileInput.files || [];
    if (!file) {
      selectedImageData = "";
      updatePreview("");
      return;
    }

    try {
      selectedImageData = await fileToDataUrl(file);
      updatePreview(selectedImageData);
      status.textContent = "เธญเธฑเธเนเธซเธฅเธ”เธฃเธนเธเน€เธฃเธตเธขเธเธฃเนเธญเธขเนเธฅเนเธง";
    } catch {
      selectedImageData = "";
      status.textContent = "เนเธกเนเธชเธฒเธกเธฒเธฃเธ–เธญเนเธฒเธเนเธเธฅเนเธฃเธนเธเนเธ”เน";
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const [file] = imageFileInput.files || [];
    const kind = String(formData.get("kind") || "promotion");
    const title = String(formData.get("title") || "").trim();
    const summary = String(formData.get("summary") || "").trim();
    const publishDate = String(formData.get("date") || "").trim();

    if (!title || !summary || !publishDate || !file) {
      status.textContent = "กรุณากรอกข้อมูลให้ครบก่อนบันทึก";
      return;
    }

    status.textContent = "กำลังอัปโหลดโปรโมชั่น...";

    let uploaded = null;
    let savedOffline = false;

    try {
      uploaded = await uploadFileToBucket("promotions", "images", file);
      const client = getSupabaseClient();
      await insertPromotionRecord(client, {
        kind,
        title,
        image_url: uploaded.publicUrl,
        image_path: uploaded.filePath,
        image_name: uploaded.fileName,
        summary,
        publish_date: publishDate
      });
    } catch (error) {
      if (shouldUseOfflinePromotionFallback(error)) {
        const offlineImage = selectedImageData || (await fileToDataUrl(file).catch(() => ""));
        const offlineItems = getOfflinePromotions();
        offlineItems.unshift({
          id: createOfflinePromotionId(),
          kind,
          title,
          image_url: offlineImage,
          image: offlineImage,
          image_name: file.name,
          summary,
          publish_date: publishDate,
          offline: true
        });
        setOfflinePromotions(offlineItems);
        savedOffline = true;
      }

      if (uploaded?.filePath) {
        try {
          await deleteFileFromBucket("promotions", uploaded.filePath);
        } catch (cleanupError) {
          console.error("promotion_upload_cleanup_failed", cleanupError);
        }
      }

      if (savedOffline) {
        form.reset();
        selectedImageData = "";
        updatePreview("");
        status.textContent = "บันทึกรายการในเครื่องเรียบร้อยแล้ว เนื่องจากเชื่อมต่อฐานข้อมูลออนไลน์ไม่ได้";
        void renderStaffPromoList();
        void renderStaffPromotions(initialLanguage);
        return;
      }

      console.error("promotion_save_failed", error);
      status.textContent = getReadableErrorMessage(error, "ไม่สามารถบันทึกรายการได้ กรุณาลองใหม่อีกครั้ง");
      return;
    }

    form.reset();
    selectedImageData = "";
    updatePreview("");
    status.textContent = "บันทึกรายการเรียบร้อยแล้ว";
    void renderStaffPromoList();
    void renderStaffPromotions(initialLanguage);
  });

  list.addEventListener("click", async (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const deleteId = target.getAttribute("data-delete-id");
    if (!deleteId) {
      return;
    }

    status.textContent = "กำลังลบรายการ...";

    const offlineItems = getOfflinePromotions();
    if (offlineItems.some((item) => String(item.id) === deleteId)) {
      setOfflinePromotions(offlineItems.filter((item) => String(item.id) !== deleteId));
      status.textContent = "ลบรายการเรียบร้อยแล้ว";
      void renderStaffPromoList();
      void renderStaffPromotions(initialLanguage);
      return;
    }

    try {
      const client = getSupabaseClient();
      const existing = await fetchPromotionStorageRecord(client, deleteId);
      const storagePath =
        String(existing?.image_path || "").trim() ||
        getStoragePathFromPublicUrl("promotions", existing?.image_url || existing?.image || "");

      if (storagePath) {
        await deleteFileFromBucket("promotions", storagePath);
      }

      const { error: deleteError } = await client.from("promotions").delete().eq("id", deleteId);
      if (deleteError) {
        throw deleteError;
      }

      status.textContent = "ลบรายการเรียบร้อยแล้ว";
      void renderStaffPromoList();
      void renderStaffPromotions(initialLanguage);
    } catch (error) {
      console.error("promotion_delete_failed", error);
      status.textContent = getReadableErrorMessage(error, "ไม่สามารถลบรายการได้ กรุณาลองใหม่อีกครั้ง");
    }
  });

  if (clearButton) {
    clearButton.addEventListener("click", () => {
      status.textContent = "กรุณาลบทีละรายการจากรายการด้านขวา";
    });
  }
};

const syncLanguagePreference = (lang) => {
  const safeLang = lang === "en" ? "en" : "th";

  const url = new URL(window.location.href);
  if (safeLang === "en") {
    url.searchParams.set("lang", "en");
  } else {
    url.searchParams.delete("lang");
  }
  window.history.replaceState({}, "", url);
  applyLanguage(safeLang);
};

const initialLanguage = (() => {
  const urlLang = new URLSearchParams(window.location.search).get("lang");
  return urlLang === "en" ? "en" : "th";
})();

applyLanguage(initialLanguage);

languageButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    syncLanguagePreference(button.dataset.lang);
  });
});

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

if (siteHeader) {
  const syncHeaderState = () => {
    siteHeader.classList.toggle("is-scrolled", window.scrollY > 8);
  };

  syncHeaderState();
  window.addEventListener("scroll", syncHeaderState, { passive: true });
}

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window && revealItems.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const categoryShowcases = document.querySelectorAll(".category-showcase");

categoryShowcases.forEach((showcase) => {
  const strip = showcase.querySelector(".category-strip");
  const prevButton = showcase.querySelector(".category-arrow-prev");
  const nextButton = showcase.querySelector(".category-arrow-next");

  if (!strip || !prevButton || !nextButton) {
    return;
  }

  const getScrollAmount = () => {
    const firstCard = strip.querySelector(".category-item");
    if (!firstCard) {
      return 320;
    }

    const styles = window.getComputedStyle(strip);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || "0");
    return firstCard.getBoundingClientRect().width + gap;
  };

  const syncButtons = () => {
    const maxScrollLeft = strip.scrollWidth - strip.clientWidth - 2;
    prevButton.classList.toggle("is-disabled", strip.scrollLeft <= 2);
    nextButton.classList.toggle("is-disabled", strip.scrollLeft >= maxScrollLeft);
  };

  prevButton.addEventListener("click", () => {
    strip.scrollBy({ left: -getScrollAmount(), behavior: "smooth" });
  });

  nextButton.addEventListener("click", () => {
    strip.scrollBy({ left: getScrollAmount(), behavior: "smooth" });
  });

  strip.addEventListener("scroll", syncButtons, { passive: true });
  window.addEventListener("resize", syncButtons);
  syncButtons();
});

if (pageName === "promotions.html") {
  void renderStaffPromotions(initialLanguage);
}

initStaffPromotionsPageSupabase();
initStaffBrochuresPageSupabase();
void renderPublicBrochuresSupabase();

const promoPagination = document.querySelector("#promo-staff-pagination");
if (promoPagination) {
  promoPagination.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const page = target.getAttribute("data-page");
    const isDisabled = target.classList.contains("is-disabled");
    if (!page || isDisabled) {
      return;
    }

    event.preventDefault();
    const url = new URL(window.location.href);
    url.searchParams.set("promoPage", page);
    window.history.replaceState({}, "", url);
    renderStaffPromotions(document.documentElement.lang === "en" ? "en" : "th");
  });
}


