"use client";

const supabaseUrl = "https://ajecxsbfvxurdxrssdqn.supabase.co";
const supabaseKey = "sb_publishable_Gs7_Llbh2pPjthTY4YJQ_A_qUNLJF_T";

const offlinePromotionsStorageKey = "sophon_offline_promotions";
const offlineBrochuresStorageKey = "sophon_offline_brochures";

function getAuthHeaders(extraHeaders = {}) {
  return {
    apikey: supabaseKey,
    Authorization: `Bearer ${supabaseKey}`,
    ...extraHeaders,
  };
}

async function parseErrorResponse(response, fallbackMessage) {
  let payload = null;

  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  const message =
    payload?.message ||
    payload?.error_description ||
    payload?.error ||
    fallbackMessage ||
    `Request failed with status ${response.status}`;

  const error = new Error(String(message));
  error.status = response.status;
  error.details = payload;
  return error;
}

async function requestJson(path, options = {}) {
  const response = await fetch(`${supabaseUrl}${path}`, {
    ...options,
    headers: getAuthHeaders(options.headers),
  });

  if (!response.ok) {
    throw await parseErrorResponse(response);
  }

  if (response.status === 204) {
    return null;
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

function readStorageArray(key) {
  if (typeof window === "undefined") {
    return [];
  }

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
}

function writeStorageArray(key, items) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(items));
}

function removeStorageItem(key) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(key);
}

function normalizeValue(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function encodeStoragePath(path) {
  return String(path || "")
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

function buildPublicStorageUrl(bucket, filePath) {
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${encodeStoragePath(filePath)}`;
}

function getStoragePathFromPublicUrl(bucket, publicUrl) {
  const value = String(publicUrl || "").trim();
  const marker = `/storage/v1/object/public/${bucket}/`;
  const markerIndex = value.indexOf(marker);

  if (markerIndex === -1) {
    return "";
  }

  return decodeURIComponent(value.slice(markerIndex + marker.length));
}

function isSchemaCompatibilityError(error, columnName = "") {
  const message = String(error?.message || error?.error_description || "").toLowerCase();
  const hasSchemaKeyword =
    message.includes("column") ||
    message.includes("schema cache") ||
    message.includes("could not find") ||
    message.includes("does not exist");

  if (!hasSchemaKeyword) {
    return false;
  }

  return columnName ? message.includes(String(columnName).toLowerCase()) : true;
}

function isNetworkFetchError(error) {
  const message = String(error?.message || error?.error_description || "").toLowerCase();

  return (
    message.includes("failed to fetch") ||
    message.includes("networkerror") ||
    message.includes("network request failed") ||
    message.includes("load failed") ||
    message.includes("dns") ||
    message.includes("timed out") ||
    message.includes("timeout") ||
    message.includes("fetch failed") ||
    message.includes("connection to the database timed out")
  );
}

function shouldUseOfflineFallback(error) {
  return isNetworkFetchError(error);
}

export function getReadableContentError(error, fallbackText) {
  const message = String(error?.message || error?.error_description || "").trim();

  if (!message) {
    return fallbackText;
  }

  if (message.toLowerCase().includes("failed to fetch")) {
    return "Cannot reach the online database right now. The project URL may be invalid or the backend may be unavailable.";
  }

  if (message.toLowerCase().includes("timed out") || message.toLowerCase().includes("timeout")) {
    return "The database connection took too long. The online service may be unavailable right now.";
  }

  if (message.toLowerCase().includes("bucket")) {
    return `File upload could not be completed: ${message}`;
  }

  if (message.toLowerCase().includes("row-level security") || message.toLowerCase().includes("policy")) {
    return `Supabase policy blocked the update: ${message}`;
  }

  if (message.toLowerCase().includes("relation") || message.toLowerCase().includes("column")) {
    return `The Supabase table structure does not match this form: ${message}`;
  }

  return `${fallbackText} (${message})`;
}

export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
    reader.onerror = () => reject(new Error("file_read_failed"));
    reader.readAsDataURL(file);
  });
}

function createSafeFileName(name) {
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
}

async function uploadFileToBucket(bucket, folder, file) {
  const safeFileName = `${Date.now()}_${createSafeFileName(file.name)}`;
  const filePath = `${folder}/${safeFileName}`;
  const uploadPath = encodeStoragePath(filePath);

  const response = await fetch(`${supabaseUrl}/storage/v1/object/${bucket}/${uploadPath}`, {
    method: "POST",
    headers: getAuthHeaders({
      "Content-Type": file.type || "application/octet-stream",
      "x-upsert": "false",
    }),
    body: file,
  });

  if (!response.ok) {
    throw await parseErrorResponse(response, "upload_failed");
  }

  return {
    filePath,
    publicUrl: buildPublicStorageUrl(bucket, filePath),
    fileName: file.name,
    fileType: file.type,
  };
}

async function deleteFileFromBucket(bucket, filePath) {
  if (!filePath) {
    return;
  }

  const response = await fetch(`${supabaseUrl}/storage/v1/object/${bucket}/${encodeStoragePath(filePath)}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw await parseErrorResponse(response, "delete_failed");
  }
}

function getGoogleDriveFileId(url) {
  const value = String(url || "").trim();
  if (!value) {
    return "";
  }

  const match =
    value.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
    value.match(/[?&]id=([a-zA-Z0-9_-]+)/) ||
    value.match(/\/d\/([a-zA-Z0-9_-]+)/);

  return match ? match[1] : "";
}

export function createGoogleDrivePreviewUrl(url) {
  const fileId = getGoogleDriveFileId(url);
  return fileId ? `https://drive.google.com/file/d/${fileId}/preview` : String(url || "").trim();
}

export function createGoogleDriveOpenUrl(url) {
  const fileId = getGoogleDriveFileId(url);
  return fileId ? `https://drive.google.com/file/d/${fileId}/view` : String(url || "").trim();
}

export function isPublishedDate(dateValue) {
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
}

export function formatContentDate(dateValue, language) {
  if (!dateValue) {
    return "";
  }

  const date = new Date(`${dateValue}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return new Intl.DateTimeFormat(language === "th" ? "th-TH" : "en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function isPdfFile(item) {
  const typeValue = String(item?.file_type || item?.fileType || "").toLowerCase();
  const urlValue = String(item?.file_url || item?.image_url || item?.image || "").toLowerCase();

  return (
    typeValue.includes("pdf") ||
    urlValue.includes(".pdf") ||
    urlValue.startsWith("data:application/pdf")
  );
}

export function getBrochurePreviewUrl(item) {
  const rawFileUrl = String(item?.file_url || item?.image || "").trim();
  return isPdfFile(item) ? createGoogleDrivePreviewUrl(rawFileUrl) : rawFileUrl;
}

export function getBrochureOpenUrl(item) {
  const rawFileUrl = String(item?.file_url || item?.image || "").trim();
  return isPdfFile(item) ? createGoogleDriveOpenUrl(rawFileUrl) : rawFileUrl;
}

export function normalizePublishedBrochures(items) {
  return [...(Array.isArray(items) ? items : [])]
    .filter((item) => {
      const hasAsset = String(item?.file_url || item?.image || "").trim();
      const hasTitle = String(item?.title || "").trim();
      return Boolean(hasAsset && hasTitle && isPublishedDate(item?.display_date || item?.date));
    })
    .sort((a, b) => String(b?.display_date || b?.date || "").localeCompare(String(a?.display_date || a?.date || "")));
}

function getOfflinePromotions() {
  return readStorageArray(offlinePromotionsStorageKey);
}

function setOfflinePromotions(items) {
  if (items.length) {
    writeStorageArray(offlinePromotionsStorageKey, items);
    return;
  }

  removeStorageItem(offlinePromotionsStorageKey);
}

function getOfflineBrochures() {
  return readStorageArray(offlineBrochuresStorageKey);
}

function setOfflineBrochures(items) {
  if (items.length) {
    writeStorageArray(offlineBrochuresStorageKey, items);
    return;
  }

  removeStorageItem(offlineBrochuresStorageKey);
}

function createOfflineId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function getPromotionIdentityKey(item) {
  if (item?.id) {
    return `promotion:${item.id}`;
  }

  return [
    normalizeValue(item.title),
    normalizeValue(item.summary),
    normalizeValue(item.kind),
    normalizeValue(item.publish_date || item.date),
  ].join("|");
}

function getBrochureIdentityKey(item) {
  if (item?.id) {
    return `brochure:${item.id}`;
  }

  return [
    normalizeValue(item.title),
    normalizeValue(item.display_date || item.date),
    normalizeValue(item.file_url || item.image),
  ].join("|");
}

function mergeContentItems(primaryItems, secondaryItems, getKey) {
  const merged = new Map();

  [...primaryItems, ...secondaryItems].forEach((item) => {
    const key = getKey(item);
    const shouldOverride = item?.offline && merged.has(key);

    if (!merged.has(key) || shouldOverride) {
      merged.set(key, item);
    }
  });

  return Array.from(merged.values());
}

function createPromotionPayloadOptions(payload) {
  return [
    payload,
    {
      kind: payload.kind,
      title: payload.title,
      image_url: payload.image_url,
      summary: payload.summary,
      details: payload.details,
      publish_date: payload.publish_date,
    },
    {
      kind: payload.kind,
      title: payload.title,
      image: payload.image_url,
      summary: payload.summary,
      publish_date: payload.publish_date,
    },
  ];
}

function createBrochurePayloadOptions(payload) {
  return [
    payload,
    {
      title: payload.title,
      file_url: payload.file_url,
      display_date: payload.display_date,
      file_type: payload.file_type,
    },
    {
      title: payload.title,
      image: payload.file_url,
      date: payload.display_date,
      file_type: payload.file_type,
    },
  ];
}

async function insertPromotionRecord(payload) {
  const payloadOptions = createPromotionPayloadOptions(payload);

  let lastError = null;

  for (let index = 0; index < payloadOptions.length; index += 1) {
    try {
      const data = await requestJson("/rest/v1/promotions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify([payloadOptions[index]]),
      });
      return Array.isArray(data) ? data[0] ?? payloadOptions[index] : payloadOptions[index];
    } catch (error) {
      lastError = error;
      const canRetry =
        index < payloadOptions.length - 1 &&
        (isSchemaCompatibilityError(error, "image_path") ||
          isSchemaCompatibilityError(error, "image_name") ||
          isSchemaCompatibilityError(error, "details") ||
          isSchemaCompatibilityError(error, "image_url") ||
          isSchemaCompatibilityError(error));

      if (!canRetry) {
        break;
      }
    }
  }

  throw lastError || new Error("promotion_insert_failed");
}

async function insertBrochureRecord(payload) {
  const payloadOptions = createBrochurePayloadOptions(payload);

  let lastError = null;

  for (let index = 0; index < payloadOptions.length; index += 1) {
    try {
      const data = await requestJson("/rest/v1/brochures", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify([payloadOptions[index]]),
      });
      return Array.isArray(data) ? data[0] ?? payloadOptions[index] : payloadOptions[index];
    } catch (error) {
      lastError = error;
      const canRetry =
        index < payloadOptions.length - 1 &&
        (isSchemaCompatibilityError(error, "file_path") ||
          isSchemaCompatibilityError(error, "file_name") ||
          isSchemaCompatibilityError(error, "file_type") ||
          isSchemaCompatibilityError(error, "file_url") ||
          isSchemaCompatibilityError(error));

      if (!canRetry) {
        break;
      }
    }
  }

  throw lastError || new Error("brochure_insert_failed");
}

async function updatePromotionRecord(id, payload) {
  const payloadOptions = createPromotionPayloadOptions(payload);

  let lastError = null;

  for (let index = 0; index < payloadOptions.length; index += 1) {
    try {
      const data = await requestJson(`/rest/v1/promotions?id=eq.${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify(payloadOptions[index]),
      });
      return Array.isArray(data) ? data[0] ?? payloadOptions[index] : payloadOptions[index];
    } catch (error) {
      lastError = error;
      const canRetry =
        index < payloadOptions.length - 1 &&
        (isSchemaCompatibilityError(error, "image_path") ||
          isSchemaCompatibilityError(error, "image_name") ||
          isSchemaCompatibilityError(error, "details") ||
          isSchemaCompatibilityError(error, "image_url") ||
          isSchemaCompatibilityError(error));

      if (!canRetry) {
        break;
      }
    }
  }

  throw lastError || new Error("promotion_update_failed");
}

async function updateBrochureRecord(id, payload) {
  const payloadOptions = createBrochurePayloadOptions(payload);

  let lastError = null;

  for (let index = 0; index < payloadOptions.length; index += 1) {
    try {
      const data = await requestJson(`/rest/v1/brochures?id=eq.${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify(payloadOptions[index]),
      });
      return Array.isArray(data) ? data[0] ?? payloadOptions[index] : payloadOptions[index];
    } catch (error) {
      lastError = error;
      const canRetry =
        index < payloadOptions.length - 1 &&
        (isSchemaCompatibilityError(error, "file_path") ||
          isSchemaCompatibilityError(error, "file_name") ||
          isSchemaCompatibilityError(error, "file_type") ||
          isSchemaCompatibilityError(error, "file_url") ||
          isSchemaCompatibilityError(error, "image") ||
          isSchemaCompatibilityError(error));

      if (!canRetry) {
        break;
      }
    }
  }

  throw lastError || new Error("brochure_update_failed");
}

async function fetchPromotionStorageRecord(id) {
  const queryOptions = [
    "/rest/v1/promotions?select=id,image_path,image_url,image&id=eq.",
    "/rest/v1/promotions?select=id,image_url,image&id=eq.",
    "/rest/v1/promotions?select=id&id=eq.",
  ];

  let lastError = null;

  for (let index = 0; index < queryOptions.length; index += 1) {
    try {
      const data = await requestJson(`${queryOptions[index]}${encodeURIComponent(id)}&limit=1`);
      return Array.isArray(data) ? data[0] ?? null : null;
    } catch (error) {
      lastError = error;
      const canRetry =
        index < queryOptions.length - 1 &&
        (isSchemaCompatibilityError(error, "image_path") ||
          isSchemaCompatibilityError(error, "image_url") ||
          isSchemaCompatibilityError(error, "image"));

      if (!canRetry) {
        break;
      }
    }
  }

  throw lastError || new Error("promotion_lookup_failed");
}

async function fetchBrochureStorageRecord(id) {
  const queryOptions = [
    "/rest/v1/brochures?select=id,file_path,file_url,image&id=eq.",
    "/rest/v1/brochures?select=id,file_url,image&id=eq.",
    "/rest/v1/brochures?select=id&id=eq.",
  ];

  let lastError = null;

  for (let index = 0; index < queryOptions.length; index += 1) {
    try {
      const data = await requestJson(`${queryOptions[index]}${encodeURIComponent(id)}&limit=1`);
      return Array.isArray(data) ? data[0] ?? null : null;
    } catch (error) {
      lastError = error;
      const canRetry =
        index < queryOptions.length - 1 &&
        (isSchemaCompatibilityError(error, "file_path") ||
          isSchemaCompatibilityError(error, "file_url") ||
          isSchemaCompatibilityError(error, "image"));

      if (!canRetry) {
        break;
      }
    }
  }

  throw lastError || new Error("brochure_lookup_failed");
}

export async function fetchPromotions() {
  const offlineItems = getOfflinePromotions();

  try {
    const data = await requestJson("/rest/v1/promotions?select=*&order=publish_date.desc");
    return mergeContentItems(Array.isArray(data) ? data : [], offlineItems, getPromotionIdentityKey);
  } catch (error) {
    if (shouldUseOfflineFallback(error)) {
      return offlineItems;
    }

    throw error;
  }
}

export async function savePromotion({ id, currentItem, kind, title, summary, details, publishDate, file, previewDataUrl }) {
  const isEditing = Boolean(id);
  let uploaded = null;
  const existingImageUrl = String(currentItem?.image_url || currentItem?.image || "").trim();
  const existingImagePath =
    String(currentItem?.image_path || "").trim() || getStoragePathFromPublicUrl("promotions", existingImageUrl);

  try {
    const basePayload = {
      kind,
      title,
      summary,
      details,
      publish_date: publishDate,
    };

    if (isEditing) {
      let nextPayload = basePayload;

      if (file) {
        uploaded = await uploadFileToBucket("promotions", "images", file);
        nextPayload = {
          ...basePayload,
          image_url: uploaded.publicUrl,
          image_path: uploaded.filePath,
          image_name: uploaded.fileName,
        };
      }

      const savedItem = await updatePromotionRecord(id, nextPayload);

      if (uploaded?.filePath && existingImagePath && existingImagePath !== uploaded.filePath) {
        try {
          await deleteFileFromBucket("promotions", existingImagePath);
        } catch {
          // Ignore old-file cleanup failures after a successful update.
        }
      }

      return { mode: "remote", item: { ...currentItem, ...savedItem, id } };
    }

    if (!file) {
      throw new Error("promotion_file_required");
    }

    uploaded = await uploadFileToBucket("promotions", "images", file);
    const savedItem = await insertPromotionRecord({
      ...basePayload,
      image_url: uploaded.publicUrl,
      image_path: uploaded.filePath,
      image_name: uploaded.fileName,
    });

    return { mode: "remote", item: savedItem };
  } catch (error) {
    if (uploaded?.filePath) {
      try {
        await deleteFileFromBucket("promotions", uploaded.filePath);
      } catch {
        // Ignore cleanup failures. The save error is the important signal.
      }
    }

    if (shouldUseOfflineFallback(error)) {
      const offlineImage = file ? previewDataUrl || (await fileToDataUrl(file)) : existingImageUrl;
      const offlineItems = getOfflinePromotions();
      const nextItem = {
        ...(currentItem || {}),
        id: id || createOfflineId("local-promotion"),
        kind,
        title,
        summary,
        details,
        publish_date: publishDate,
        image_url: offlineImage,
        image: offlineImage,
        image_name: file?.name || currentItem?.image_name || "",
        offline: true,
      };
      const existingIndex = offlineItems.findIndex((item) => String(item.id) === String(nextItem.id));

      if (existingIndex >= 0) {
        offlineItems[existingIndex] = nextItem;
      } else {
        offlineItems.unshift(nextItem);
      }

      setOfflinePromotions(offlineItems);
      return { mode: "offline", item: nextItem };
    }

    throw error;
  }
}

export async function deletePromotion(id) {
  const offlineItems = getOfflinePromotions();
  if (offlineItems.some((item) => String(item.id) === String(id))) {
    setOfflinePromotions(offlineItems.filter((item) => String(item.id) !== String(id)));

    if (String(id).startsWith("local-promotion")) {
      return { mode: "offline" };
    }
  }

  const existing = await fetchPromotionStorageRecord(id);
  const storagePath =
    String(existing?.image_path || "").trim() ||
    getStoragePathFromPublicUrl("promotions", existing?.image_url || existing?.image || "");

  if (storagePath) {
    await deleteFileFromBucket("promotions", storagePath);
  }

  await requestJson(`/rest/v1/promotions?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: {
      Prefer: "return=minimal",
    },
  });

  return { mode: "remote" };
}

export async function fetchBrochures() {
  const offlineItems = getOfflineBrochures();

  try {
    const data = await requestJson("/rest/v1/brochures?select=*&order=display_date.desc");
    return mergeContentItems(Array.isArray(data) ? data : [], offlineItems, getBrochureIdentityKey);
  } catch (error) {
    if (shouldUseOfflineFallback(error)) {
      return offlineItems;
    }

    throw error;
  }
}

export async function saveBrochure({ id, currentItem, title, displayDate, file, driveUrl }) {
  const isEditing = Boolean(id);
  let uploaded = null;
  const normalizedDriveUrl = String(driveUrl || "").trim();
  const existingFileUrl = String(currentItem?.file_url || currentItem?.image || "").trim();
  const existingFilePath =
    String(currentItem?.file_path || "").trim() || getStoragePathFromPublicUrl("brochures", existingFileUrl);

  try {
    let brochurePayload = normalizedDriveUrl
      ? {
          title,
          file_url: createGoogleDriveOpenUrl(normalizedDriveUrl),
          file_path: null,
          file_name: title,
          file_type: "application/pdf",
          display_date: displayDate,
        }
      : null;

    if (!normalizedDriveUrl && file) {
      uploaded = await uploadFileToBucket("brochures", "files", file);
      brochurePayload = {
        title,
        file_url: uploaded.publicUrl,
        file_path: uploaded.filePath,
        file_name: uploaded.fileName,
        file_type: uploaded.fileType,
        display_date: displayDate,
      };
    }

    if (isEditing) {
      if (!brochurePayload) {
        brochurePayload = {
          title,
          display_date: displayDate,
          file_url: existingFileUrl || undefined,
          file_path: existingFilePath || undefined,
          file_name: currentItem?.file_name || title,
          file_type: currentItem?.file_type || undefined,
        };
      }

      const savedItem = await updateBrochureRecord(id, brochurePayload);

      if (
        existingFilePath &&
        ((uploaded?.filePath && existingFilePath !== uploaded.filePath) || (normalizedDriveUrl && !uploaded))
      ) {
        try {
          await deleteFileFromBucket("brochures", existingFilePath);
        } catch {
          // Ignore old-file cleanup failures after a successful update.
        }
      }

      return { mode: "remote", item: { ...currentItem, ...savedItem, id } };
    }

    if (!brochurePayload) {
      throw new Error("brochure_file_required");
    }

    const savedItem = await insertBrochureRecord(brochurePayload);
    return { mode: "remote", item: savedItem };
  } catch (error) {
    if (uploaded?.filePath) {
      try {
        await deleteFileFromBucket("brochures", uploaded.filePath);
      } catch {
        // Ignore cleanup failures. The save error is the important signal.
      }
    }

    if (shouldUseOfflineFallback(error)) {
      const offlineItems = getOfflineBrochures();
      let localFileUrl = normalizedDriveUrl ? createGoogleDriveOpenUrl(normalizedDriveUrl) : existingFileUrl;
      let localFileType = normalizedDriveUrl ? "application/pdf" : currentItem?.file_type || "";
      let localFileName = normalizedDriveUrl ? title : currentItem?.file_name || "";

      if (!normalizedDriveUrl && file) {
        localFileUrl = await fileToDataUrl(file);
        localFileType = file.type;
        localFileName = file.name;
      }

      const nextItem = {
        ...(currentItem || {}),
        id: id || createOfflineId("local-brochure"),
        title,
        file_url: localFileUrl,
        file_type: localFileType,
        file_name: localFileName,
        display_date: displayDate,
        offline: true,
      };
      const existingIndex = offlineItems.findIndex((item) => String(item.id) === String(nextItem.id));

      if (existingIndex >= 0) {
        offlineItems[existingIndex] = nextItem;
      } else {
        offlineItems.unshift(nextItem);
      }

      setOfflineBrochures(offlineItems);
      return { mode: "offline", item: nextItem };
    }

    throw error;
  }
}

export async function deleteBrochure(id) {
  const offlineItems = getOfflineBrochures();
  if (offlineItems.some((item) => String(item.id) === String(id))) {
    setOfflineBrochures(offlineItems.filter((item) => String(item.id) !== String(id)));

    if (String(id).startsWith("local-brochure")) {
      return { mode: "offline" };
    }
  }

  const existing = await fetchBrochureStorageRecord(id);
  const storagePath =
    String(existing?.file_path || "").trim() ||
    getStoragePathFromPublicUrl("brochures", existing?.file_url || existing?.image || "");

  if (storagePath) {
    await deleteFileFromBucket("brochures", storagePath);
  }

  await requestJson(`/rest/v1/brochures?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: {
      Prefer: "return=minimal",
    },
  });

  return { mode: "remote" };
}
