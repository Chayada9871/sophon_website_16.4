"use client";

import { useEffect, useRef, useState } from "react";

import { useLanguage } from "./language-provider";
import { StaffConsoleFrame } from "./staff-console-frame";
import { brochureLinkHref, getPublicSiteHref, localize } from "../../lib/site-content";
import {
  createGoogleDriveOpenUrl,
  createGoogleDrivePreviewUrl,
  deleteBrochure,
  fetchBrochures,
  fileToDataUrl,
  formatContentDate,
  getReadableContentError,
  isPdfFile,
  saveBrochure,
} from "../../lib/website-content-client";

const text = (en, th) => ({ en, th });

const initialFormValue = {
  title: "",
  displayDate: "",
  driveUrl: "",
  file: null,
};

const staffBrochuresContent = {
  shared: {
    promotionsLabel: text("Promotions", "โปรโมชั่น"),
    brochuresLabel: text("Brochures", "โบรชัวร์"),
    openPage: text("Open brochure page", "เปิดหน้าโบรชัวร์"),
    loading: text("Loading saved brochure items...", "กำลังโหลดรายการที่บันทึกไว้..."),
    loadFailed: text("Unable to load brochure content right now.", "ไม่สามารถโหลดข้อมูลโบรชัวร์ได้ในขณะนี้"),
    saving: text("Saving content...", "กำลังบันทึกรายการ..."),
    deleteLoading: text("Deleting content...", "กำลังลบรายการ..."),
    deleteSuccess: text("The item was deleted successfully.", "ลบรายการเรียบร้อยแล้ว"),
    deleteFailed: text("Unable to delete the selected item right now.", "ไม่สามารถลบรายการที่เลือกได้ในขณะนี้"),
    remoteSaved: text("Brochure content saved successfully.", "บันทึกรายการเรียบร้อยแล้ว"),
    remoteUpdated: text("Brochure content updated successfully.", "อัปเดตรายการเรียบร้อยแล้ว"),
    offlineSaved: text(
      "Saved on this device because the online database is currently unavailable.",
      "บันทึกรายการไว้ในเครื่องนี้แล้ว เนื่องจากฐานข้อมูลออนไลน์ยังไม่พร้อมใช้งาน"
    ),
    requiredSummary: text("Please complete the required fields before saving.", "กรุณากรอกข้อมูลที่จำเป็นให้ครบก่อนบันทึก"),
    fileReady: text("Preview is ready.", "เตรียมตัวอย่างไฟล์เรียบร้อยแล้ว"),
    fileFailed: text("The selected file could not be read.", "ไม่สามารถอ่านไฟล์ที่เลือกได้"),
    listEmptyTitle: text("No saved brochure items yet", "ยังไม่มีรายการที่บันทึกไว้"),
    listEmptyBody: text(
      "Add a brochure file or Google Drive link to manage website visuals from one place.",
      "เพิ่มไฟล์โบรชัวร์หรือลิงก์ Google Drive เพื่อจัดการเนื้อหาหน้าเว็บไซต์จากจุดเดียว"
    ),
    previewLabel: text("Preview", "ดูตัวอย่าง"),
    editLabel: text("Edit", "แก้ไข"),
    removeLabel: text("Delete", "ลบ"),
    displayDateLabel: text("Display date", "วันแสดงผล"),
    statusLabel: text("Status", "สถานะ"),
    sourceLabel: text("Source", "แหล่งที่มา"),
    requiredMark: text("Required", "จำเป็น"),
    confirmDelete: text("Delete this brochure item?", "ต้องการลบรายการนี้ใช่หรือไม่"),
    activeStatus: text("Active", "ใช้งานอยู่"),
    draftStatus: text("Draft", "แบบร่าง"),
    localStatus: text("Local only", "บันทึกในเครื่อง"),
    pdfLabel: text("PDF file", "ไฟล์ PDF"),
    imageLabel: text("Image file", "ไฟล์รูปภาพ"),
    uploadedLabel: text("Uploaded file", "ไฟล์อัปโหลด"),
    driveLabel: text("Google Drive", "Google Drive"),
    countLabel: text("items", "รายการ"),
  },
  intro: {
    eyebrow: text("Brochure manager", "จัดการโบรชัวร์"),
    title: text("Add and manage brochure files on the website.", "เพิ่มและจัดการโบรชัวร์บนเว็บไซต์"),
    description: text(
      "Upload image or PDF files, or attach a Google Drive link so brochure content is ready for the storefront.",
      "อัปโหลดไฟล์รูปภาพหรือ PDF หรือใส่ลิงก์ Google Drive เพื่อให้โบรชัวร์พร้อมแสดงบนหน้าเว็บไซต์"
    ),
    helperDescription: text(
      "Saved brochure items appear on the right so staff can preview, edit, or remove files when needed.",
      "สามารถดูรายการที่บันทึกไว้ ตรวจสอบไฟล์ และจัดการแก้ไขหรือลบรายการได้จากด้านขวา"
    ),
  },
  form: {
    createEyebrow: text("Create content", "สร้างรายการใหม่"),
    editEyebrow: text("Edit content", "แก้ไขรายการ"),
    createTitle: text("Add brochure content", "เพิ่มรายการโบรชัวร์"),
    editTitle: text("Update brochure content", "แก้ไขรายการโบรชัวร์"),
    description: text(
      "Use this form to keep brochure files and links organized for the live website page.",
      "ใช้แบบฟอร์มนี้เพื่อจัดการไฟล์และลิงก์โบรชัวร์สำหรับหน้าเว็บไซต์จริง"
    ),
    titleLabel: text("Brochure title", "หัวข้อรายการ"),
    titlePlaceholder: text("Example: Weekly brochure", "เช่น โบรชัวร์ประจำสัปดาห์"),
    displayDate: text("Display date", "วันแสดงผล"),
    displayDateHint: text("Choose the date used to order and show this brochure.", "กำหนดวันที่ใช้เรียงและแสดงโบรชัวร์บนเว็บไซต์"),
    file: text("Upload file", "อัปโหลดไฟล์"),
    fileHint: text(
      "Upload an image or PDF. If a Drive link is also provided, the Drive link will be used.",
      "รองรับไฟล์รูปภาพและ PDF หากใส่ลิงก์ Google Drive ด้วย ระบบจะใช้ลิงก์นั้นเป็นหลัก"
    ),
    uploadTitle: text("Choose a file to upload", "เลือกไฟล์สำหรับรายการนี้"),
    uploadReplace: text("Replace file", "เปลี่ยนไฟล์"),
    uploadPlaceholder: text("Recommended: image files or PDF documents.", "แนะนำไฟล์รูปภาพหรือเอกสาร PDF"),
    driveUrl: text("Google Drive link", "ลิงก์ Google Drive"),
    drivePlaceholder: text(
      "Example: https://drive.google.com/file/d/.../view",
      "เช่น https://drive.google.com/file/d/.../view"
    ),
    driveHint: text(
      "Use this for larger files or documents that are already managed in Drive.",
      "ใช้สำหรับไฟล์ขนาดใหญ่หรือเอกสารที่จัดการไว้ใน Google Drive แล้ว"
    ),
    preview: text("File preview", "ตัวอย่างไฟล์"),
    previewEmptyTitle: text("No file selected", "ยังไม่ได้เลือกไฟล์"),
    previewEmptyBody: text(
      "Upload a file or paste a Drive link to preview the brochure before saving.",
      "อัปโหลดไฟล์หรือวางลิงก์ Drive เพื่อดูตัวอย่างก่อนบันทึก"
    ),
    save: text("Save item", "บันทึกรายการ"),
    update: text("Save changes", "บันทึกการแก้ไข"),
    reset: text("Clear form", "ล้างข้อมูล"),
    cancelEdit: text("Cancel edit", "ยกเลิกการแก้ไข"),
    editingNote: text("You are editing an existing brochure item.", "คุณกำลังแก้ไขรายการที่บันทึกไว้"),
    newNote: text("New content will be added to the brochure page.", "รายการใหม่จะถูกเพิ่มไปยังหน้าโบรชัวร์"),
    errors: {
      title: text("Please enter a title.", "กรุณากรอกหัวข้อรายการ"),
      displayDate: text("Please choose the display date.", "กรุณาเลือกวันแสดงผล"),
      file: text("Please upload a file or provide a Google Drive link.", "กรุณาอัปโหลดไฟล์หรือใส่ลิงก์ Google Drive"),
    },
  },
  list: {
    title: text("Saved content items", "รายการเนื้อหาที่บันทึกไว้"),
    description: text(
      "Review brochure files and links below, then update or remove anything that should no longer appear on the website.",
      "ตรวจสอบรายการที่เพิ่มเข้ามาแล้ว พร้อมแก้ไขหรือลบได้จากส่วนนี้"
    ),
    pdfDescription: text("PDF brochure ready for the public brochure page.", "โบรชัวร์ PDF สำหรับแสดงบนหน้าเว็บไซต์"),
    imageDescription: text("Image asset prepared for brochure or campaign display.", "ภาพสำหรับใช้ในหน้าโบรชัวร์หรือแคมเปญ"),
  },
};

function normalizeBrochureItems(items) {
  return [...items].sort((a, b) =>
    String(b.display_date || b.date || "").localeCompare(String(a.display_date || a.date || ""))
  );
}

function parseContentDate(value) {
  if (!value) {
    return null;
  }

  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function resolveBrochureStatus(item, content) {
  if (item.offline) {
    return { tone: "draft", label: content.shared.localStatus };
  }

  const date = parseContentDate(item.display_date || item.date || "");
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

function getBrochurePreviewValue(item) {
  const rawFileUrl = String(item.file_url || item.image || "");
  const pdf = isPdfFile(item);

  return {
    isPdf: pdf,
    previewUrl: pdf ? createGoogleDrivePreviewUrl(rawFileUrl) : rawFileUrl,
    openUrl: pdf ? createGoogleDriveOpenUrl(rawFileUrl) : rawFileUrl,
  };
}

export function StaffBrochuresManager() {
  const { language } = useLanguage();
  const content = localize(staffBrochuresContent, language);
  const formRef = useRef(null);

  const [items, setItems] = useState([]);
  const [feedback, setFeedback] = useState({ tone: "neutral", message: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [formValue, setFormValue] = useState(initialFormValue);
  const [previewValue, setPreviewValue] = useState({
    src: "",
    isPdf: false,
  });

  useEffect(() => {
    let isCancelled = false;

    async function loadItems() {
      setIsLoading(true);

      try {
        const nextItems = await fetchBrochures();
        if (!isCancelled) {
          setItems(normalizeBrochureItems(nextItems));
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
    const nextItems = await fetchBrochures();
    setItems(normalizeBrochureItems(nextItems));
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

    if (field === "driveUrl") {
      const trimmedValue = nextValue.trim();

      if (trimmedValue) {
        setPreviewValue({
          src: createGoogleDrivePreviewUrl(trimmedValue),
          isPdf: true,
        });
      } else if (!formValue.file && !editingItem) {
        setPreviewValue({ src: "", isPdf: false });
      }
    }
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
      setPreviewValue({
        src: nextPreview,
        isPdf: String(file.type || "").toLowerCase().includes("pdf"),
      });
      setFeedback({ tone: "info", message: content.shared.fileReady });
    } catch {
      setPreviewValue({ src: "", isPdf: false });
      setFeedback({ tone: "error", message: content.shared.fileFailed });
    }
  };

  const handleReset = () => {
    setEditingItem(null);
    setFormValue(initialFormValue);
    setPreviewValue({ src: "", isPdf: false });
    setFieldErrors({});
    setFeedback({ tone: "neutral", message: "" });
  };

  const handleEdit = (item) => {
    const nextPreview = getBrochurePreviewValue(item);

    setEditingItem(item);
    setFormValue({
      title: item.title || "",
      displayDate: item.display_date || item.date || "",
      driveUrl: String(item.file_url || item.image || "").includes("drive.google.com") ? item.file_url || item.image || "" : "",
      file: null,
    });
    setPreviewValue({
      src: nextPreview.previewUrl,
      isPdf: nextPreview.isPdf,
    });
    setFieldErrors({});
    setFeedback({ tone: "info", message: content.form.editingNote });

    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!formValue.title.trim()) {
      nextErrors.title = content.form.errors.title;
    }

    if (!formValue.displayDate) {
      nextErrors.displayDate = content.form.errors.displayDate;
    }

    if (!formValue.file && !formValue.driveUrl.trim() && !previewValue.src) {
      nextErrors.file = content.form.errors.file;
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
      const result = await saveBrochure({
        id: editingItem?.id,
        currentItem: editingItem,
        title: formValue.title.trim(),
        displayDate: formValue.displayDate,
        file: formValue.file,
        driveUrl: formValue.driveUrl.trim(),
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
      await deleteBrochure(id);
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
      viewHref={getPublicSiteHref(brochureLinkHref)}
      viewLabel={content.shared.openPage}
      activeTab="brochures"
      promotionsLabel={content.shared.promotionsLabel}
      brochuresLabel={content.shared.brochuresLabel}
    >
      <div className="staff-manager-grid">
        <article className="staff-manager-panel staff-manager-panel--form">
          <div className="staff-panel-heading">
            <div>
              <p className="eyebrow">{formModeEyebrow}</p>
              <h3>{formModeTitle}</h3>
              <p className="section-copy">{content.form.description}</p>
            </div>

            <span className="staff-count-pill">{editingItem ? content.form.editingNote : content.form.newNote}</span>
          </div>

          {feedback.message ? <div className={`staff-feedback is-${feedback.tone}`}>{feedback.message}</div> : null}

          <form ref={formRef} className="staff-form-grid" onSubmit={handleSubmit} noValidate>
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
              <small className={fieldErrors.title ? "staff-field-error" : "staff-field-hint"}>
                {fieldErrors.title || content.form.titlePlaceholder}
              </small>
            </label>

            <label className={`staff-field${fieldErrors.displayDate ? " staff-field--error" : ""}`}>
              <span className="staff-label-row">
                <span>{content.form.displayDate}</span>
                <span className="staff-required-mark">{content.shared.requiredMark}</span>
              </span>
              <input type="date" value={formValue.displayDate} onChange={handleFieldChange("displayDate")} />
              <small className={fieldErrors.displayDate ? "staff-field-error" : "staff-field-hint"}>
                {fieldErrors.displayDate || content.form.displayDateHint}
              </small>
            </label>

            <div className={`staff-field staff-field--full${fieldErrors.file ? " staff-field--error" : ""}`}>
              <span className="staff-label-row">
                <span>{content.form.file}</span>
                <span className="staff-required-mark">{content.shared.requiredMark}</span>
              </span>

              <div className={`staff-upload-box${fieldErrors.file ? " is-error" : ""}`}>
                <input
                  id="brochure-file-upload"
                  className="staff-file-input"
                  type="file"
                  accept="image/*,.pdf,application/pdf"
                  onChange={handleFileChange}
                />
                <label htmlFor="brochure-file-upload" className="staff-upload-trigger">
                  <strong>{previewValue.src ? content.form.uploadReplace : content.form.uploadTitle}</strong>
                  <span>{formValue.file?.name || content.form.uploadPlaceholder}</span>
                </label>
              </div>

              <small className={fieldErrors.file ? "staff-field-error" : "staff-field-hint"}>
                {fieldErrors.file || content.form.fileHint}
              </small>
            </div>

            <label className="staff-field staff-field--full">
              <span>{content.form.driveUrl}</span>
              <input
                type="url"
                value={formValue.driveUrl}
                onChange={handleFieldChange("driveUrl")}
                placeholder={content.form.drivePlaceholder}
              />
              <small className="staff-field-hint">{content.form.driveHint}</small>
            </label>

            <div className="staff-field staff-field--full">
              <span>{content.form.preview}</span>
              <div className="staff-preview-frame staff-preview-frame--brochure">
                {previewValue.src ? (
                  previewValue.isPdf ? (
                    <iframe src={previewValue.src} title={content.form.preview} className="staff-brochure-preview" />
                  ) : (
                    <img src={previewValue.src} alt={content.form.preview} className="staff-preview-image" />
                  )
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
              <p className="eyebrow">{content.shared.brochuresLabel}</p>
              <h3>{content.list.title}</h3>
              <p className="section-copy">{content.list.description}</p>
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
              const preview = getBrochurePreviewValue(item);
              const status = resolveBrochureStatus(item, content);
              const pdf = isPdfFile(item);

              return (
                <article key={item.id} className="staff-record-card">
                  <div className="staff-record-thumb">
                    {pdf ? (
                      <div className="staff-record-thumb-pdf">PDF</div>
                    ) : preview.previewUrl ? (
                      <img src={preview.previewUrl} alt={item.title} className="staff-record-thumb-image" />
                    ) : (
                      <div className="staff-record-thumb-placeholder">{content.shared.imageLabel}</div>
                    )}
                  </div>

                  <div className="staff-record-copy">
                    <div className="staff-record-head">
                      <span className="staff-record-kind">{pdf ? content.shared.pdfLabel : content.shared.imageLabel}</span>
                      <span className={`staff-status-chip is-${status.tone}`}>{status.label}</span>
                    </div>

                    <h3>{item.title}</h3>
                    <p className="staff-record-summary">
                      {pdf ? content.list.pdfDescription : content.list.imageDescription}
                    </p>

                    <dl className="staff-record-meta-grid">
                      <div>
                        <dt>{content.shared.displayDateLabel}</dt>
                        <dd>{formatContentDate(item.display_date || item.date || "", language)}</dd>
                      </div>
                      <div>
                        <dt>{content.shared.sourceLabel}</dt>
                        <dd>
                          {String(item.file_url || item.image || "").includes("drive.google.com")
                            ? content.shared.driveLabel
                            : content.shared.uploadedLabel}
                        </dd>
                      </div>
                    </dl>

                    <div className="staff-record-actions">
                      <a
                        href={preview.openUrl || getPublicSiteHref(brochureLinkHref)}
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
