"use client";

import { useEffect, useRef, useState } from "react";

import { useLanguage } from "./language-provider";
import { StaffConsoleFrame } from "./staff-console-frame";
import { getPublicSiteHref, localize } from "../../lib/site-content";
import {
  deletePromotion,
  fetchPromotions,
  fileToDataUrl,
  formatContentDate,
  getReadableContentError,
  savePromotion,
} from "../../lib/website-content-client";

const text = (en, th) => ({ en, th });

const initialFormValue = {
  kind: "promotion",
  title: "",
  summary: "",
  details: "",
  publishDate: "",
  file: null,
};

const promotionKindOptions = [
  { value: "promotion", label: text("Promotion", "โปรโมชั่น") },
  { value: "news", label: text("News", "ข่าวสาร") },
  { value: "highlight", label: text("Highlight", "ไฮไลต์") },
];

const staffPromotionsContent = {
  shared: {
    promotionsLabel: text("Promotions", "โปรโมชั่น"),
    brochuresLabel: text("Brochures", "โบรชัวร์"),
    openPage: text("Open promotions page", "เปิดหน้าโปรโมชั่น"),
    loading: text("Loading saved content...", "กำลังโหลดรายการที่บันทึกไว้..."),
    loadFailed: text("Unable to load promotion content right now.", "ไม่สามารถโหลดข้อมูลโปรโมชั่นได้ในขณะนี้"),
    saving: text("Saving content...", "กำลังบันทึกรายการ..."),
    deleteLoading: text("Deleting content...", "กำลังลบรายการ..."),
    deleteSuccess: text("The item was deleted successfully.", "ลบรายการเรียบร้อยแล้ว"),
    deleteFailed: text("Unable to delete the selected item right now.", "ไม่สามารถลบรายการที่เลือกได้ในขณะนี้"),
    remoteSaved: text("Promotion content saved successfully.", "บันทึกรายการเรียบร้อยแล้ว"),
    remoteUpdated: text("Promotion content updated successfully.", "อัปเดตรายการเรียบร้อยแล้ว"),
    offlineSaved: text(
      "Saved on this device because the online database is currently unavailable.",
      "บันทึกรายการไว้ในเครื่องนี้แล้ว เนื่องจากฐานข้อมูลออนไลน์ยังไม่พร้อมใช้งาน"
    ),
    requiredSummary: text("Please complete the required fields before saving.", "กรุณากรอกข้อมูลที่จำเป็นให้ครบก่อนบันทึก"),
    previewReady: text("Image preview is ready.", "เตรียมตัวอย่างรูปภาพเรียบร้อยแล้ว"),
    previewFailed: text("The selected image file could not be read.", "ไม่สามารถอ่านไฟล์รูปภาพที่เลือกได้"),
    listEmptyTitle: text("No saved promotion items yet", "ยังไม่มีรายการที่บันทึกไว้"),
    listEmptyBody: text(
      "Create your first promotion card to start showing content on the storefront.",
      "เริ่มเพิ่มรายการแรกเพื่อให้เนื้อหาแสดงบนหน้าเว็บไซต์"
    ),
    previewLabel: text("Preview", "ดูตัวอย่าง"),
    editLabel: text("Edit", "แก้ไข"),
    removeLabel: text("Delete", "ลบ"),
    publishDateLabel: text("Display date", "วันแสดงผล"),
    statusLabel: text("Status", "สถานะ"),
    requiredMark: text("Required", "จำเป็น"),
    confirmDelete: text("Delete this promotion item?", "ต้องการลบรายการนี้ใช่หรือไม่"),
    activeStatus: text("Active", "ใช้งานอยู่"),
    draftStatus: text("Draft", "แบบร่าง"),
    localStatus: text("Local only", "บันทึกในเครื่อง"),
    countLabel: text("items", "รายการ"),
  },
  intro: {
    eyebrow: text("Promotion manager", "จัดการโปรโมชั่น"),
    title: text("Add promotions", "เพิ่มโปรโมชั่น"),
    description: text(
      "Fill in the form to show promotions on the website.",
      "กรอกข้อมูลเพื่อแสดงโปรโมชั่นบนหน้าเว็บไซต์"
    ),
    helperDescription: text("", ""),
  },
  form: {
    createEyebrow: text("Create content", "สร้างรายการใหม่"),
    editEyebrow: text("Edit content", "แก้ไขรายการ"),
    createTitle: text("Add promotion content", "เพิ่มรายการโปรโมชั่น"),
    editTitle: text("Update promotion content", "แก้ไขรายการโปรโมชั่น"),
    description: text("", ""),
    kind: text("Type", "ประเภท"),
    titleLabel: text("Title", "หัวข้อ"),
    titlePlaceholder: text("Example: Buy 1 Get 1", "เช่น โปร 1 แถม 1"),
    image: text("Image", "รูปภาพ"),
    uploadTitle: text("Upload image (JPG, PNG, WEBP)", "อัปโหลดรูป (JPG, PNG, WEBP)"),
    uploadReplace: text("Replace image", "เปลี่ยนรูปภาพ"),
    uploadPlaceholder: text("Select image file", "เลือกไฟล์รูปภาพ"),
    publishDate: text("Expiry date", "วันหมดอายุ"),
    summary: text("Description", "คำอธิบาย"),
    summaryPlaceholder: text(
      "Short summary for the website card",
      "สรุปสั้น ๆ สำหรับหน้าเว็บ"
    ),
    details: text("Details", "รายละเอียด"),
    detailsPlaceholder: text(
      "Additional details (optional)",
      "รายละเอียดเพิ่มเติม (ถ้ามี)"
    ),
    preview: text("Image preview", "ตัวอย่างรูปภาพ"),
    previewEmptyTitle: text("No image selected", "ยังไม่ได้เลือกรูปภาพ"),
    previewEmptyBody: text(
      "Upload an image to preview how the content will look before saving.",
      "อัปโหลดรูปภาพเพื่อดูตัวอย่างก่อนบันทึก"
    ),
    save: text("Save", "บันทึก"),
    update: text("Save", "บันทึก"),
    reset: text("Clear", "ล้าง"),
    cancelEdit: text("Clear", "ล้าง"),
    editingNote: text("Editing", "กำลังแก้ไข"),
    newNote: text("New item", "รายการใหม่"),
    errors: {
      kind: text("Please choose a content type.", "กรุณาเลือกประเภทเนื้อหา"),
      title: text("Please enter a title.", "กรุณากรอกหัวข้อรายการ"),
      file: text("Please upload an image.", "กรุณาอัปโหลดรูปภาพ"),
      publishDate: text("Please choose the display date.", "กรุณาเลือกวันแสดงผล"),
      summary: text("Please enter a short description.", "กรุณากรอกคำอธิบายสั้น"),
    },
  },
  list: {
    title: text("Promotion list", "รายการโปรโมชั่น"),
    description: text("", ""),
    detailsFallback: text("No additional details provided.", "ยังไม่ได้เพิ่มรายละเอียดเพิ่มเติม"),
  },
};

function normalizePromotionItems(items) {
  return [...items].sort((a, b) =>
    String(b.publish_date || b.date || "").localeCompare(String(a.publish_date || a.date || ""))
  );
}

function parseContentDate(value) {
  if (!value) {
    return null;
  }

  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function resolvePromotionStatus(item, content) {
  if (item.offline) {
    return { tone: "draft", label: content.shared.localStatus };
  }

  const date = parseContentDate(item.publish_date || item.date || "");
  if (!date) {
    return { tone: "draft", label: content.shared.draftStatus };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (date.getTime() > today.getTime()) {
    return { tone: "draft", label: content.shared.draftStatus };
  }

  return { tone: "active", label: content.shared.activeStatus };
}

function getPromotionPreviewHref(item) {
  return String(item.image_url || item.image || "").trim();
}

export function StaffPromotionsManager() {
  const { language } = useLanguage();
  const content = localize(staffPromotionsContent, language);
  const kinds = localize(promotionKindOptions, language);
  const formRef = useRef(null);

  const [items, setItems] = useState([]);
  const [feedback, setFeedback] = useState({ tone: "neutral", message: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [formValue, setFormValue] = useState(initialFormValue);
  const [previewSrc, setPreviewSrc] = useState("");

  useEffect(() => {
    let isCancelled = false;

    async function loadItems() {
      setIsLoading(true);

      try {
        const nextItems = await fetchPromotions();
        if (!isCancelled) {
          setItems(normalizePromotionItems(nextItems));
        }
      } catch (error) {
        if (!isCancelled) {
          setFeedback({ tone: "error", message: getReadableContentError(error, content.shared.loadFailed) });
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadItems();

    return () => {
      isCancelled = true;
    };
  }, [content.shared.loadFailed]);

  const loadLatestItems = async () => {
    const nextItems = await fetchPromotions();
    setItems(normalizePromotionItems(nextItems));
  };

  const handleFieldChange = (field) => (event) => {
    const nextValue = event.target.value;

    setFormValue((current) => ({
      ...current,
      [field]: nextValue,
    }));

    setFieldErrors((current) => ({
      ...current,
      [field]: "",
    }));
  };

  const handleFileChange = async (event) => {
    const [file] = event.target.files || [];

    if (!file) {
      setFormValue((current) => ({ ...current, file: null }));
      return;
    }

    setFormValue((current) => ({ ...current, file }));
    setFieldErrors((current) => ({ ...current, file: "" }));

    try {
      const nextPreview = await fileToDataUrl(file);
      setPreviewSrc(nextPreview);
      setFeedback({ tone: "info", message: content.shared.previewReady });
    } catch {
      setPreviewSrc("");
      setFeedback({ tone: "error", message: content.shared.previewFailed });
    }
  };

  const handleReset = () => {
    setEditingItem(null);
    setFormValue(initialFormValue);
    setPreviewSrc("");
    setFieldErrors({});
    setFeedback({ tone: "neutral", message: "" });
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormValue({
      kind: item.kind || "promotion",
      title: item.title || "",
      summary: item.summary || "",
      details: item.details || item.content || "",
      publishDate: item.publish_date || item.date || "",
      file: null,
    });
    setPreviewSrc(item.image_url || item.image || "");
    setFieldErrors({});
    setFeedback({ tone: "info", message: content.form.editingNote });

    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!formValue.kind) {
      nextErrors.kind = content.form.errors.kind;
    }

    if (!formValue.title.trim()) {
      nextErrors.title = content.form.errors.title;
    }

    if (!previewSrc && !formValue.file) {
      nextErrors.file = content.form.errors.file;
    }

    if (!formValue.publishDate) {
      nextErrors.publishDate = content.form.errors.publishDate;
    }

    if (!formValue.summary.trim()) {
      nextErrors.summary = content.form.errors.summary;
    }

    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = validateForm();
    setFieldErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setFeedback({ tone: "error", message: content.shared.requiredSummary });
      return;
    }

    setIsSubmitting(true);
    setFeedback({ tone: "info", message: content.shared.saving });

    try {
      const result = await savePromotion({
        id: editingItem?.id,
        currentItem: editingItem,
        kind: formValue.kind,
        title: formValue.title.trim(),
        summary: formValue.summary.trim(),
        details: formValue.details.trim(),
        publishDate: formValue.publishDate,
        file: formValue.file,
        previewDataUrl: previewSrc,
      });

      await loadLatestItems();
      handleReset();
      setFeedback({
        tone: "success",
        message:
          result.mode === "offline"
            ? content.shared.offlineSaved
            : editingItem
              ? content.shared.remoteUpdated
              : content.shared.remoteSaved,
      });
    } catch (error) {
      setFeedback({ tone: "error", message: getReadableContentError(error, content.shared.loadFailed) });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (typeof window !== "undefined" && !window.confirm(content.shared.confirmDelete)) {
      return;
    }

    setDeletingId(String(id));
    setFeedback({ tone: "info", message: content.shared.deleteLoading });

    try {
      await deletePromotion(id);
      await loadLatestItems();

      if (editingItem && String(editingItem.id) === String(id)) {
        handleReset();
      }

      setFeedback({ tone: "success", message: content.shared.deleteSuccess });
    } catch (error) {
      setFeedback({ tone: "error", message: getReadableContentError(error, content.shared.deleteFailed) });
    } finally {
      setDeletingId("");
    }
  };

  const formModeEyebrow = editingItem ? content.form.editEyebrow : content.form.createEyebrow;
  const formModeTitle = editingItem ? content.form.editTitle : content.form.createTitle;
  const formModeButton = editingItem ? content.form.update : content.form.save;
  const secondaryButtonLabel = editingItem ? content.form.cancelEdit : content.form.reset;

  return (
    <StaffConsoleFrame
      eyebrow={content.intro.eyebrow}
      title={content.intro.title}
      description={content.intro.description}
      helperDescription={content.intro.helperDescription}
      viewHref={getPublicSiteHref("/promotions")}
      viewLabel={content.shared.openPage}
      activeTab="promotions"
      promotionsLabel={content.shared.promotionsLabel}
      brochuresLabel={content.shared.brochuresLabel}
    >
      <div className="staff-manager-grid">
        <article className="staff-manager-panel staff-manager-panel--form">
          <div className="staff-panel-heading">
            <div>
              <p className="eyebrow">{formModeEyebrow}</p>
              <h3>{formModeTitle}</h3>
              {content.form.description ? <p className="section-copy">{content.form.description}</p> : null}
            </div>

            <span className="staff-count-pill">{editingItem ? content.form.editingNote : content.form.newNote}</span>
          </div>

          {feedback.message ? <div className={`staff-feedback is-${feedback.tone}`}>{feedback.message}</div> : null}

          <form ref={formRef} className="staff-form-grid" onSubmit={handleSubmit} noValidate>
            <label className={`staff-field${fieldErrors.kind ? " staff-field--error" : ""}`}>
              <span className="staff-label-row">
                <span>{content.form.kind}</span>
                <span className="staff-required-mark">{content.shared.requiredMark}</span>
              </span>
              <select value={formValue.kind} onChange={handleFieldChange("kind")}>
                {kinds.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {fieldErrors.kind ? <small className="staff-field-error">{fieldErrors.kind}</small> : null}
            </label>

            <label className={`staff-field${fieldErrors.title ? " staff-field--error" : ""}`}>
              <span className="staff-label-row">
                <span>{content.form.titleLabel}</span>
                <span className="staff-required-mark">{content.shared.requiredMark}</span>
              </span>
              <input
                type="text"
                value={formValue.title}
                onChange={handleFieldChange("title")}
                placeholder={content.form.titlePlaceholder}
              />
              {fieldErrors.title ? <small className="staff-field-error">{fieldErrors.title}</small> : null}
            </label>

            <div className={`staff-field staff-field--full${fieldErrors.file ? " staff-field--error" : ""}`}>
              <span className="staff-label-row">
                <span>{content.form.image}</span>
                <span className="staff-required-mark">{content.shared.requiredMark}</span>
              </span>

              <div className={`staff-upload-box${fieldErrors.file ? " is-error" : ""}`}>
                <input
                  id="promotion-image-upload"
                  className="staff-file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <label htmlFor="promotion-image-upload" className="staff-upload-trigger">
                  <strong>{previewSrc ? content.form.uploadReplace : content.form.uploadTitle}</strong>
                  <span>{formValue.file?.name || content.form.uploadPlaceholder}</span>
                </label>
              </div>

              {fieldErrors.file ? <small className="staff-field-error">{fieldErrors.file}</small> : null}
            </div>

            <label className={`staff-field${fieldErrors.publishDate ? " staff-field--error" : ""}`}>
              <span className="staff-label-row">
                <span>{content.form.publishDate}</span>
                <span className="staff-required-mark">{content.shared.requiredMark}</span>
              </span>
              <input type="date" value={formValue.publishDate} onChange={handleFieldChange("publishDate")} />
              {fieldErrors.publishDate ? <small className="staff-field-error">{fieldErrors.publishDate}</small> : null}
            </label>

            <label className={`staff-field${fieldErrors.summary ? " staff-field--error" : ""}`}>
              <span className="staff-label-row">
                <span>{content.form.summary}</span>
                <span className="staff-required-mark">{content.shared.requiredMark}</span>
              </span>
              <textarea
                rows={4}
                value={formValue.summary}
                onChange={handleFieldChange("summary")}
                placeholder={content.form.summaryPlaceholder}
              />
              {fieldErrors.summary ? <small className="staff-field-error">{fieldErrors.summary}</small> : null}
            </label>

            <label className="staff-field staff-field--full">
              <span>{content.form.details}</span>
              <textarea
                rows={6}
                value={formValue.details}
                onChange={handleFieldChange("details")}
                placeholder={content.form.detailsPlaceholder}
              />
            </label>

            <div className="staff-field staff-field--full">
              <span>{content.form.preview}</span>
              <div className="staff-preview-frame">
                {previewSrc ? (
                  <img src={previewSrc} alt={content.form.preview} className="staff-preview-image" />
                ) : (
                  <div className="staff-preview-empty">
                    <strong>{content.form.previewEmptyTitle}</strong>
                    <span>{content.form.previewEmptyBody}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="staff-button-row">
              <button type="submit" className="button" disabled={isSubmitting}>
                {formModeButton}
              </button>
              <button type="button" className="button button--ghost" onClick={handleReset}>
                {secondaryButtonLabel}
              </button>
            </div>
          </form>
        </article>

        <article className="staff-manager-panel staff-manager-panel--list">
          <div className="staff-panel-heading">
            <div>
              <p className="eyebrow">{content.shared.promotionsLabel}</p>
              <h3>{content.list.title}</h3>
              {content.list.description ? <p className="section-copy">{content.list.description}</p> : null}
            </div>

            <span className="staff-count-pill">
              {items.length} {content.shared.countLabel}
            </span>
          </div>

          {isLoading ? <p className="staff-inline-note">{content.shared.loading}</p> : null}

          {!isLoading && !items.length ? (
            <div className="staff-empty-state">
              <strong>{content.shared.listEmptyTitle}</strong>
              <span>{content.shared.listEmptyBody}</span>
            </div>
          ) : null}

          <div className="staff-record-list">
            {items.map((item) => {
              const status = resolvePromotionStatus(item, content);
              const previewHref = getPromotionPreviewHref(item) || getPublicSiteHref("/promotions");
              const kindLabel = kinds.find((option) => option.value === item.kind)?.label || item.kind;

              return (
                <article key={item.id} className="staff-record-card">
                  <div className="staff-record-thumb">
                    {item.image_url || item.image ? (
                      <img src={item.image_url || item.image} alt={item.title} className="staff-record-thumb-image" />
                    ) : (
                      <div className="staff-record-thumb-placeholder">{kindLabel}</div>
                    )}
                  </div>

                  <div className="staff-record-copy">
                    <div className="staff-record-head">
                      <span className="staff-record-kind">{kindLabel}</span>
                      <span className={`staff-status-chip is-${status.tone}`}>{status.label}</span>
                    </div>

                    <h3>{item.title}</h3>
                    <p className="staff-record-summary">{item.summary}</p>

                    <dl className="staff-record-meta-grid">
                      <div>
                        <dt>{content.shared.publishDateLabel}</dt>
                        <dd>{formatContentDate(item.publish_date || item.date || "", language)}</dd>
                      </div>
                      <div>
                        <dt>{content.shared.statusLabel}</dt>
                        <dd>{status.label}</dd>
                      </div>
                    </dl>

                    <div className="staff-record-actions">
                      <a
                        href={previewHref}
                        target="_blank"
                        rel="noreferrer"
                        className="button button--ghost button--compact"
                      >
                        {content.shared.previewLabel}
                      </a>
                      <button type="button" className="button button--ghost button--compact" onClick={() => handleEdit(item)}>
                        {content.shared.editLabel}
                      </button>
                      <button
                        type="button"
                        className="button button--ghost button--compact button--danger"
                        onClick={() => void handleDelete(item.id)}
                        disabled={deletingId === String(item.id)}
                      >
                        {content.shared.removeLabel}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </article>
      </div>
    </StaffConsoleFrame>
  );
}
