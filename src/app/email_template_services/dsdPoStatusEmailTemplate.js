function dsdPoStatusEmailTemplate(data, toDayDate) {
  const rows = data.map(item => {
    const poDateOnly = toDayDate;
    return `
      <tr>
        <td style="padding: 10px; border: 1px solid #ddd; background-color: #fff;">${poDateOnly}</td>
        <td style="padding: 10px; border: 1px solid #ddd; background-color: #fff;">${item.region_name}</td>
        <td style="padding: 10px; border: 1px solid #ddd; background-color: #fff;">${item.outlet_full_name}</td>
        <td style="padding: 10px; border: 1px solid #ddd; text-align: center; background-color: #fff;">${item.po_generated_count}</td>
        <td style="padding: 10px; border: 1px solid #ddd; text-align: center; background-color: #fff;">${item.po_approval_count}</td>
        <td style="padding: 10px; border: 1px solid #ddd; text-align: center; background-color: #fff;">${item.po_memo_count}</td>
        <td style="padding: 10px; border: 1px solid #ddd; text-align: center; background-color: #fff;">${item.po_iv_count}</td>
        <td style="padding: 10px; border: 1px solid #ddd; text-align: center; background-color: #fff;">${item.po_grn_count}</td>
      </tr>
    `;
  }).join('');


  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>DSD PO Status Report</title>
        <style>
          .table-container {
            margin: 20px 0;
            border: 1px solid #ddd;
            border-radius: 4px;
          }
          
          .data-table {
            width: 100%;
            border-collapse: collapse;
            background-color: #fff;
          }
          
          .data-table thead th {
            padding: 12px 10px;
            border: 1px solid #ddd;
            font-weight: 600;
            color: #495057;
            font-size: 13px;
            background: linear-gradient(to bottom, #f8f9fa 0%, #e9ecef 100%);
          }
          
          .data-table tbody {
            font-size: 13px;
            color: #333;
          }
        </style>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="max-width: 1200px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 15px 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 600;">
              DSD PO Status Report
            </h1>
            <p style="color: #f0f0f0; margin: 5px 0 0 0; font-size: 13px;">
              Generated on ${toDayDate}
            </p>
          </div>

          <!-- Content -->
          <div style="padding: 30px;">
            <p style="color: #333; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0;">
              Dear Team,
            </p>
            <p style="color: #333; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0;">
              Please find below the DSD Purchase Order status report for your reference:
            </p>

            <!-- Table Container with Fixed Header and Scroll -->
            <div class="table-container">
              <table class="data-table">
                <thead>
                  <tr>
                    <th style="text-align: left;">PO Date</th>
                    <th style="text-align: left;">Region Name</th>
                    <th style="text-align: left;">Location</th>
                    <th style="text-align: center;">Generated</th>
                    <th style="text-align: center;">Approved</th>
                    <th style="text-align: center;">Memo</th>
                    <th style="text-align: center;">IV</th>
                    <th style="text-align: center;">GRN</th>
                  </tr>
                </thead>
                <tbody>
                  ${rows}
                </tbody>
              </table>
            </div>

            <p style="color: #666; font-size: 13px; line-height: 1.6; margin: 25px 0 0 0;">
              If you have any questions or require additional information, please don't hesitate to reach out.
            </p>
          </div>

          <!-- Footer -->
          <div style="background-color: #f8f9fa; padding: 20px 30px; border-top: 1px solid #e9ecef;">
            <p style="margin: 0; font-size: 12px; color: #6c757d; text-align: center;">
              This is an auto-generated email from the ERP System. Please do not reply to this email.
            </p>
            <p style="margin: 8px 0 0 0; font-size: 11px; color: #adb5bd; text-align: center;">
              © ${new Date().getFullYear()} Bluekode Solutions. All rights reserved.
            </p>
          </div>

        </div>
      </body>
    </html>
  `;
}

module.exports = { dsdPoStatusEmailTemplate };