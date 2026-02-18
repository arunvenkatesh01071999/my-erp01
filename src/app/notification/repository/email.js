const axios = require("axios");
const qs = require("qs");
const nodemailer = require('nodemailer');

function emailRepo(fastify) {
    async function sendEmailNotification(response) {
        // Calculate the sum of all sales breakups
        const totalInvoices = response.reduce((sum, row) => sum + Number(row.total_invoices), 0);
        const totalSales = response.reduce((sum, row) => sum + Number(row.total_sales), 0);
        const totalCash = response.reduce((sum, row) => sum + Number(row.total_cash), 0);
        const totalCard = response.reduce((sum, row) => sum + Number(row.total_card), 0);
        const totalUpi = response.reduce((sum, row) => sum + Number(row.total_upi), 0);
        const totalReturn = response.reduce((sum, row) => sum + Number(row.total_return), 0);
        const totalAvgBills = totalSales / totalInvoices;

        // Helper function to prefix 0 if the number starts with a decimal point
        const formatNumber = (num) => {
            const formatted = Number(num).toFixed(2);
            return formatted[0] === '.' ? '0' + formatted : formatted;
        };

        // Format the current date as Day, DD-MM-YYYY
        const formatDate = (date) => {
            const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const d = new Date(date);
            const day = (`0${d.getDate()}`).slice(-2);
            const month = (`0${d.getMonth() + 1}`).slice(-2);
            const year = d.getFullYear();
            const dayOfWeek = daysOfWeek[d.getDay()];
            return `${dayOfWeek}, ${day}-${month}-${year}`;
        };

        const currentDate = formatDate(new Date());

        // Format the response data as an HTML table
        const htmlTable = `
            <table border="1" cellpadding="5" cellspacing="0">
                <thead style="background-color: #f2f2f2;">
                    <tr>
                        <th colspan="8">${currentDate}</th>
                    <tr>
                    <tr>
                        <th>Outet</th>
                        <th>INVOICES</th>
                        <th>TOTAL SALES</th>
                        <th>CASH SALES</th>
                        <th>CARD SALES</th>
                        <th>UPI SALES</th>
                        <th>SALES RETURN</th>
                        <th>AVG BILLS</th>
                       
                    </tr>
                </thead>
                <tbody>
                    ${response.map(row => `
                        <tr>
                            <td>${row.fullname}(${row.code})</td>
                            <td style="text-align: right;" >${row.total_invoices}</td>
                            <td style="text-align: right;" >${row.total_sales}</td>
                            <td style="text-align: right;" >${row.total_cash}</td>
                            <td style="text-align: right;">${row.total_card}</td>
                            <td style="text-align: right;" >${row.total_upi}</td>
                            <td style="text-align: right;" >${row.total_return}</td>
                            <td style="text-align: right;" >${row.avg_bills}</td>
                           
                        </tr>
                    `).join('')}
                </tbody>
               <tfoot style="background-color: #e0e0e0;">
                    <tr>
                        <td><strong>Totals</strong></td>
                        <td style="text-align: right;" ><strong>${totalInvoices}</strong></td>
                        <td style="text-align: right;" ><strong>${formatNumber(totalSales)}</strong></td>
                        <td style="text-align: right;" ><strong>${formatNumber(totalCash)}</strong></td>
                        <td style="text-align: right;" ><strong>${formatNumber(totalCard)}</strong></td>
                        <td style="text-align: right;" ><strong>${formatNumber(totalUpi)}</strong></td>
                        <td style="text-align: right;" ><strong>${formatNumber(totalReturn)}</strong></td>
                        <td style="text-align: right;" ><strong>${formatNumber(totalAvgBills)}</strong></td> 
                    </tr>
                </tfoot>
            </table>
        `;

        // Create a transporter
        let transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST, // Replace with your SMTP server
            port: process.env.EMAIL_PORT,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_ID, // Replace with your email
                pass: process.env.EMAIL_PASSWORD // Replace with your email password
            }
        });

        // Send mail with defined transport object
        let info = await transporter.sendMail({
            from: `"Cash Close Report" ${process.env.EMAIL_ID}`, // sender address
            to: process.env.RECEIVER_MAIL, // list of receivers
            cc: ['sathish@a1chips.in', 'vignesh@a1chips.in'], // add the new CC email here
            bcc: 'srini.rpsm@gmail.com',
            subject: 'Daily Cash Close Report', // Subject line
            html: htmlTable // html body
        });

        console.log('Message sent: %s', info.messageId);
        return info;
    }

    return {
        sendEmailNotification
    };
}
module.exports = emailRepo;
