const axios = require("axios");
const qs = require("qs");
const nodemailer = require('nodemailer');

function currentSalesEmailRepo(fastify) {
    async function sendCurrentSalesEmailNotification(response) {

        const overallTotals = response.overallTotals;
        const outletSales = response.outletSales;

        // Helper function to prefix 0 if the number starts with a decimal point
        const formatNumber = (num) => {
            const formatted = Number(num).toFixed(2);
            return formatted[0] === '.' ? '0' + formatted : formatted;
        };

        // Format the current date and time as Day, DD-MM-YYYY HH:MM AM/PM
        const formatDate = (date) => {
            const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const d = new Date(date);
            const day = (`0${d.getDate()}`).slice(-2);
            const month = (`0${d.getMonth() + 1}`).slice(-2);
            const year = d.getFullYear();
            let hours = d.getHours();
            const minutes = (`0${d.getMinutes()}`).slice(-2);
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12 || 12; // Convert to 12-hour format and handle midnight as 12
            const dayOfWeek = daysOfWeek[d.getDay()];
            return `${dayOfWeek}, ${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
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
                    ${outletSales.map(row => `
                        <tr>
                            <td>${row.fullname} (${row.code})</td>
                            <td style="text-align: right;">${row.total_invoices}</td>
                            <td style="text-align: right;">${formatNumber(row.total_amount)}</td>
                            <td style="text-align: right;">${formatNumber(row.total_cash_amount)}</td>
                            <td style="text-align: right;">${formatNumber(row.total_card_amount)}</td>
                            <td style="text-align: right;">${formatNumber(row.total_upi_amount)}</td>
                            <td style="text-align: right;">${formatNumber(row.total_return_amount)}</td>
                            <td style="text-align: right;">${formatNumber(row.average_amount)}</td>
                        </tr>
                    `).join('')}
                </tbody>
                  <tfoot style="background-color: #e0e0e0;">
                    <tr>
                        <td><strong>Totals</strong></td>
                        <td style="text-align: right;"><strong>${overallTotals.total_invoices}</strong></td>
                        <td style="text-align: right;"><strong>${formatNumber(overallTotals.total_amount)}</strong></td>
                        <td style="text-align: right;"><strong>${formatNumber(overallTotals.total_cash_amount)}</strong></td>
                        <td style="text-align: right;"><strong>${formatNumber(overallTotals.total_card_amount)}</strong></td>
                        <td style="text-align: right;"><strong>${formatNumber(overallTotals.total_upi_amount)}</strong></td>
                        <td style="text-align: right;"><strong>${formatNumber(overallTotals.total_return_amount)}</strong></td>
                        <td style="text-align: right;"><strong>${formatNumber(overallTotals.total_average)}</strong></td>
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
            from: `"Girlush Sales Report" ${process.env.EMAIL_ID}`, // sender address
            to: process.env.RECEIVER_MAIL, // list of receivers
            cc: ['sathish@a1chips.in', 'vignesh@a1chips.in'], // add the new CC email here
            bcc: 'srini.rpsm@gmail.com',
            subject: 'Girlush Sales Report', // Subject line
            html: htmlTable // html body
        });
        // let info = await transporter.sendMail({
        //     from: `"Girlush Sales Report" ${process.env.EMAIL_ID}`, // sender address
        //     to: 'srini.rpsm@gmail.com', // list of receivers
        //     // cc: ['sathish@a1chips.in', 'vignesh@a1chips.in'], // add the new CC email here
        //     // bcc: 'srini.rpsm@gmail.com',
        //     subject: 'Girlush Sales Report', // Subject line
        //     html: htmlTable // html body
        // });

        console.log('Message sent: %s', info.messageId);
        return info;
    }

    return {
        sendCurrentSalesEmailNotification
    };
}
module.exports = currentSalesEmailRepo;
