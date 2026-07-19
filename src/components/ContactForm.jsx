import emailjs from "@emailjs/browser";
import { useState } from "react";
import { emailjsConfig } from "../data/content";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState({ sending: false, message: "", type: "" });

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  async function onSubmit(e) {
    e.preventDefault();
    setStatus({ sending: true, message: "", type: "" });
    try {
      await emailjs.send(emailjsConfig.serviceId, emailjsConfig.templateId, {
        from_name: form.name,
        from_email: form.email,
        message: form.message,
        to_name: emailjsConfig.toName,
      });
      setStatus({
        sending: false,
        message: "TX OK — message sent. I'll get back to you soon.",
        type: "success",
      });
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      console.error("EmailJS error:", err);
      setStatus({
        sending: false,
        message: "TX FAILED — please retry or ping me on WhatsApp.",
        type: "error",
      });
    }
    setTimeout(() => setStatus((s) => ({ ...s, message: "" })), 6000);
  }

  return (
    <form className="contact-form" onSubmit={onSubmit}>
      <div className="contact-form-row">
        <label className="contact-field">
          <span className="contact-label">NAME</span>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={onChange}
            required
            disabled={status.sending}
            placeholder="Jane Doe"
          />
        </label>
        <label className="contact-field">
          <span className="contact-label">EMAIL</span>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
            required
            disabled={status.sending}
            placeholder="jane@company.com"
          />
        </label>
      </div>
      <label className="contact-field">
        <span className="contact-label">MESSAGE</span>
        <textarea
          name="message"
          rows="5"
          value={form.message}
          onChange={onChange}
          required
          disabled={status.sending}
          placeholder="What are we building?"
        />
      </label>

      {status.message && (
        <p className={`contact-status contact-status--${status.type}`} role="status">
          {status.message}
        </p>
      )}

      <button type="submit" className="btn btn--primary" disabled={status.sending}>
        {status.sending ? "TRANSMITTING…" : "SEND TRANSMISSION"}
      </button>
    </form>
  );
}
