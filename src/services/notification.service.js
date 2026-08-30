import nodemailer from 'nodemailer';
import { config } from '../config/config.js';

const transporter = config.smtpHost
  ? nodemailer.createTransport({
      host: config.smtpHost,
      port: config.smtpPort,
      secure: config.smtpSecure,
      auth: { user: config.smtpUser, pass: config.smtpPassword },
    })
  : null;

export const notificationService = {
  async sendRegistrationConfirmation(ticket) {
    if (!transporter) {
      console.warn('SMTP no configurado: se omite el email de confirmación.');
      return;
    }
    const recipient = ticket.user.email;
    await transporter.sendMail({
      from: config.mailFrom,
      to: recipient,
      subject: `Inscripción confirmada: ${ticket.event.title}`,
      text: `Tu inscripción al evento "${ticket.event.title}" fue confirmada. Fecha: ${new Date(ticket.event.date).toLocaleString()}.`,
    });
  },
};
