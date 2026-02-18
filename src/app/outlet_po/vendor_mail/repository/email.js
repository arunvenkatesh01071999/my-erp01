const nodemailer = require("nodemailer");
const axios = require("axios");

function emailRepo(fastify) {
  async function sendPOApprovalMail({
    po_no,
    outlet_id,
    company_id = 1,
    wh_id = 1,
    user_id = 1,
    mailData
  }) {

    const knex = fastify.knexMedical;

    let {
      brand_company_email,
      supplier_email,
      outlet_email,
      brand_company_id
    } = mailData || {};

    brand_company_email = Array.isArray(brand_company_email) ? brand_company_email : [];
    supplier_email = Array.isArray(supplier_email) ? supplier_email : [];
    outlet_email = Array.isArray(outlet_email) ? outlet_email : [];

    const toEmail = brand_company_email.length ? brand_company_email : null;
    const ccList = [...supplier_email, ...outlet_email].filter(Boolean);

    console.log('cclist', ccList)
    console.log('toEmail', toEmail)

    if (!toEmail) {
      console.error("❌ Mail NOT sent – No recipient email in brand_company_email");
      return;
    }

    // const toEmail = ["sathya@bluekode.com"];
    // const ccList = ["srini.rpsm@gmail.com", "krishnasamy@bluekode.com", "devanand.s@ibo.com", "aathimoorthy@kpnfarmfresh.com", "syed.bilal@kpnfarmfresh.com", "shiva.shankar@kpnfarmfresh.com", "kumudhavalli@kpnfarmfresh.com"];

    // console.log("TO (hardcoded):", toEmail);
    // console.log("CC (hardcoded):", ccList);

    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: false,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
      },
      tls: {
        rejectUnauthorized: false   // ✅ FIX
      }
    });

    // Fetch names
    const outlet = await knex("outlets")
      .select("fullname", "bankid")
      .where("id", outlet_id)
      .first();

    const brandCompany = await knex("typedesign")
      .select("type_name")
      // .where("id", brand_company_id)
      .where("id", mailData?.brand_company_id)
      .first();

    console.log('brandcompany', brandCompany)

    const outletName = outlet?.fullname || "Unknown Outlet";
    const outletCode = outlet?.bankid || "-";
    const brandCompanyName = brandCompany?.type_name || "Team";

    const pdfUrl = `https://kpnweb-php-api.bluekode.com/api/outlets/auto_po_pdf?company_id=${company_id}&wh_id=${wh_id}&user_id=${user_id}&po_no=${po_no}&outlet_id=${outlet_id}`;

    let pdfBuffer;

    try {
      const pdfResponse = await axios.get(pdfUrl, { responseType: "arraybuffer" });
      pdfBuffer = pdfResponse.data;
    } catch (err) {
      console.error("PDF download failed:", err);
      return;
    }

    // const subject = `Purchase Order – KPN Fresh / ${outletName}`;

    const subject = `Purchase Order – KPN Fresh / ${outletName}`;
    const htmlContent = `
      <p>Dear <strong>${brandCompanyName}</strong>,</p>

      <p>
        Please find attached the Purchase Order generated for 
        <strong>${outletName}</strong> under KPN Fresh.
      </p>

      <p>
        <strong>PO Number:</strong> ${po_no}/ ${outletCode}<br>
        <strong>Outlet:</strong> ${outletName} (Code: ${outletCode})
      </p>

     <p> Kindly review the details and process it at the earliest convenience. For any further clarification, please feel free to get in touch with us. </p>

      <p>
        Regards,<br>
        <strong>KPN Fresh Team</strong>
      </p>
    `;

    const mailOptions = {
      from: `"KPN Fresh" <${process.env.MAIL_FROM_ADDRESS}>`,
      to: toEmail,
      cc: ccList.length ? ccList : undefined,
      subject,
      html: htmlContent,
      attachments: [
        {
          filename: `PO-${po_no}-${outlet_id}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf"
        }
      ]
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log(`✔ Mail sent: ${info.messageId}`);

      await knex("outlet_po_master")
        .where({ po_no, outlet_id })
        .update({
          mail_sent: true,
          mail_sent_at: knex.fn.now()
        });

    } catch (err) {
      console.error("Mail Send Failed:", err);
    }
  }

  async function sendMailForGrn({
    docno,
    outlet_id,
    company_id = 1,
    wh_id = 1,
    user_id = 1,
    mailData
  }) {
    const knex = fastify.knexMedical;

    if (!docno || !outlet_id) {
      console.error("Mail skipped: docno or outlet_id missing");
      return;
    }

    /* ---------------- EMAIL LIST ---------------- */

    const {
      brand_company_email = [],
      supplier_email = [],
      outlet_email = [],
      supplier_id
    } = mailData || {};

    console.log(mailData);

    // const toEmail = Array.isArray(supplier_email) && supplier_email.length
    //   ? supplier_email
    //   : null;

    const toEmail = ["sathya@bluekode.com"];
    const ccList = ["srini.rpsm@gmail.com"];
    // const ccList = [
    //   ...brand_company_email,
    //   ...outlet_email
    // ].filter(Boolean);

    if (!toEmail) {
      console.error("❌ Mail NOT sent – No supplier email");
      return;
    }

    /* ---------------- MAIL TRANSPORT ---------------- */

    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: false,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
      }
    });

    /* ---------------- FETCH DETAILS ---------------- */

    const outlet = await knex("outlets")
      .select("fullname", "bankid")
      .where("id", outlet_id)
      .first();

    const supplier = await knex("supplier")
      .select("supplier_name")
      .where("id", supplier_id)
      .first();

    const outletName = outlet?.fullname || "Unknown Outlet";
    const outletCode = outlet?.bankid || "-";
    const supplierName = supplier?.supplier_name || "Supplier";

    /* ---------------- PDF DOWNLOAD ---------------- */

    const pdfUrl = new URL(
      `https://kpnweb-php-api.bluekode.com/api/outlets/outlet_pdf/grn/${docno}`
    );
    // const pdfUrl = new URL(
    //   `https://testblrapi1.kovaipazhamudir.com/api/outlets/outlet_pdf/grn/${docno}`
    // );

    pdfUrl.search = new URLSearchParams({
      company_id,
      wh_id,
      user_id,
      outlet_id
    }).toString();

    let pdfBuffer;
    try {
      const pdfResponse = await axios.get(pdfUrl, {
        responseType: "arraybuffer"
      });
      pdfBuffer = pdfResponse.data;
    } catch (err) {
      console.error("PDF download failed:", err);
      return;
    }

    /* ---------------- MAIL CONTENT ---------------- */

    const subject = `Outlet GRN – KPN Fresh / ${outletName}`;

    const htmlContent = `
    <p>Dear <strong>${supplierName}</strong>,</p>

    <p>
      This is to inform you that the purchase for 
      <strong>${outletName}</strong> under KPN Fresh has been finalized.
    </p>

    <p>
      <strong>Document Number:</strong> ${docno} / ${outletCode}<br>
      <strong>Outlet:</strong> ${outletName} (Code: ${outletCode})
    </p>

    <p>
      Kindly proceed with the purchase as per the attached document.
      Please review and confirm at your earliest convenience.
    </p>

    <p>
      Regards,<br>
      <strong>KPN Fresh Team</strong>
    </p>
  `;

    /* ---------------- SEND MAIL ---------------- */

    const mailOptions = {
      from: `"KPN Fresh" <${process.env.MAIL_FROM_ADDRESS}>`,
      to: toEmail,
      cc: ccList.length ? ccList : undefined,
      subject,
      html: htmlContent,
      attachments: [
        {
          filename: `GRN-${docno}-${outlet_id}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf"
        }
      ]
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log("✔ Mail sent:", info.messageId);

      await knex("outlet_purchase_master")
        .where({ docno, outlet_id })
        .update({
          mail_sent: true,
          mail_sent_at: knex.fn.now()
        });

    } catch (err) {
      console.error("Mail send failed:", err);
    }
  }


  return { sendPOApprovalMail, sendMailForGrn };
}

module.exports = emailRepo;
