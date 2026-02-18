const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { OUTLETS } = require("../../../accounts/outlets/commons/constants");
const { SALESMAN, SALESMAN_OUTLET_MAPPING } = require("../../commons");

const fs = require('fs').promises;

function salesManRepo(fastify) {
  async function getSalesMan({ logTrace }) {
    const knex = this;
    const query = knex(SALESMAN.NAME)
      .where(SALESMAN.COLUMNS.IS_ACTIVE, "1")
      .orderBy(SALESMAN.COLUMNS.ID, "DESC");
    logQuery({
      logger: fastify.log,
      query,
      context: "Get SalesMan",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "SalesMan not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response;
  }

  async function getSalesManPaginate({ params, logTrace }) {
    const knex = this;
    const query = knex(SALESMAN.NAME).orderBy(SALESMAN.COLUMNS.ID, "DESC");

    if (params.search) {
      query.where(function () {
        this.where(SALESMAN.COLUMNS.SALESMANNAME, "like", `%${params.search}%`);
      });
    }
    logQuery({
      logger: fastify.log,
      query,
      context: "Get SalesMan",
      logTrace
    });
    const response = await query.paginate({
      pageSize: params.page_size, // Customize as needed
      currentPage: params.current_page // Customize as needed
    });
    if (!response.data.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "SalesMan not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    if (response.meta.pagination.total_pages < params.current_page) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Requested page is beyond the available data",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    return response;
  }
  async function postSalesMan({ params, body, logTrace, userDetails, files }) {
    async function writeFile(filePath, buffer) {
      try {
        await fs.writeFile(filePath, buffer);
        console.log('File written successfully:', filePath);
      } catch (err) {
        console.error('Error writing file:', err);
      }
    }

    const targetFolder = 'uploads/salesman';

    let idProofFilePath, photoFilePath, passBookFilePath;

    if (body.id_proof != null) {
      // Writing id_proof file
      const idProofFileName = body.id_proof.filename;
      idProofFilePath = `${targetFolder}/${idProofFileName}`;
      await writeFile(idProofFilePath, body.id_proof._buf);
    }

    if (body.photo != null) {
      // Writing photo file
      const photoFileName = body.photo.filename;
      photoFilePath = `${targetFolder}/${photoFileName}`;
      await writeFile(photoFilePath, body.photo._buf);
    }

    if (body.passbook != null) {
      // Writing passbookfile
      const passBookFileName = body.passbook.filename;
      passBookFilePath = `${targetFolder}/${passBookFileName}`;
      await writeFile(passBookFilePath, body.passbook._buf);
    }

    const knex = this;
    const query = knex(SALESMAN.NAME).where(
      SALESMAN.COLUMNS.SALESMANNAME,
      body.sales_man_name.value
    );

    const exists_response = await query;

    if (exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "SalesMan Name Already Exists",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const query_insert = await knex(`${SALESMAN.NAME}`).returning("id").insert({
      [SALESMAN.COLUMNS.SALESMANCODE]: body.sales_man_code?.value ?? 0,
      [SALESMAN.COLUMNS.SALESMANNAME]: body.sales_man_name?.value ?? null,
      [SALESMAN.COLUMNS.COMPANY_ID]: body.company_id?.value ?? 0,
      [SALESMAN.COLUMNS.CODE]: body.code?.value ?? 0,
      [SALESMAN.COLUMNS.SHORT_NAME]: body.short_name?.value ?? null,
      [SALESMAN.COLUMNS.MOBILE]: body.mobile?.value ?? 0,
      [SALESMAN.COLUMNS.FATHER_NAME]: body.father_name?.value ?? null,
      [SALESMAN.COLUMNS.MOTHER_NAME]: body.mother_name?.value ?? null,
      [SALESMAN.COLUMNS.DOB]: body.dob?.value ?? 0,
      [SALESMAN.COLUMNS.SEX]: body.sex?.value ?? 0,
      [SALESMAN.COLUMNS.ADD1]: body.add1?.value ?? 0,
      [SALESMAN.COLUMNS.ADD2]: body.add2?.value ?? 0,
      [SALESMAN.COLUMNS.ADD3]: body.add3?.value ?? 0,
      [SALESMAN.COLUMNS.PHOTO]: photoFilePath || null,
      [SALESMAN.COLUMNS.ID_PROOF]: idProofFilePath || null,
      [SALESMAN.COLUMNS.PASSBOOK]: passBookFilePath || null,
      [SALESMAN.COLUMNS.IS_ACTIVE]: body.is_active?.value ?? 0,
      [SALESMAN.COLUMNS.CREATED_BY]: 2
    });

    const response = await query_insert;
    // var salesman_id = query_insert[0].id;

    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_IMPLEMENTED,
        message: "Error while creating SalesMan",
        property: "",
        code: "NOT_IMPLEMENTED"
      });
    }

    // var outlet_id_str = body.outlet_ids.value.split(',');

    // let outlet_id_array = outlet_id_str.map(Number);

    // if (outlet_id_array.length > 0) {

    //   const outlets = outlet_id_array.map(outlet => ({
    //     [SALESMAN_OUTLET_MAPPING.COLUMNS.SALESMAN_ID]: salesman_id,
    //     [SALESMAN_OUTLET_MAPPING.COLUMNS.OUTLET_ID]: outlet,
    //     [SALESMAN_OUTLET_MAPPING.COLUMNS.COMPANY_ID]: body.company_id?.value ?? 0,
    //     [SALESMAN_OUTLET_MAPPING.COLUMNS.IS_ACTIVE]: body.is_active?.value ?? 0,
    //     [SALESMAN_OUTLET_MAPPING.COLUMNS.CREATED_BY]: 2,
    //   }));

    //   const insertSalesmanOutlet = await knex(`${SALESMAN_OUTLET_MAPPING.NAME}`).insert(
    //     outlets
    //   );
    //   if (!insertSalesmanOutlet) {
    //     throw CustomError.create({
    //       httpCode: StatusCodes.NOT_IMPLEMENTED,
    //       message: "Error while creating Salesman Outlet Mapping",
    //       property: "",
    //       code: "NOT_IMPLEMENTED"
    //     });
    //   }
    // }


    return { success: true };
  }

  async function postSalesManOutletMapping({ params, body, logTrace, userDetails, files }) {
    async function writeFile(filePath, buffer) {
      try {
        await fs.writeFile(filePath, buffer);
        console.log('File written successfully:', filePath);
      } catch (err) {
        console.error('Error writing file:', err);
      }
    }

    const targetFolder = 'uploads/salesman';

    let idProofFilePath, photoFilePath, passBookFilePath;

    if (body.id_proof != null) {
      // Writing id_proof file
      const idProofFileName = body.id_proof.filename;
      idProofFilePath = `${targetFolder}/${idProofFileName}`;
      await writeFile(idProofFilePath, body.id_proof._buf);
    }

    if (body.photo != null) {
      // Writing photo file
      const photoFileName = body.photo.filename;
      photoFilePath = `${targetFolder}/${photoFileName}`;
      await writeFile(photoFilePath, body.photo._buf);
    }

    if (body.passbook != null) {
      // Writing passbookfile
      const passBookFileName = body.passbook.filename;
      passBookFilePath = `${targetFolder}/${passBookFileName}`;
      await writeFile(passBookFilePath, body.passbook._buf);
    }

    const knex = this;
    const query = knex(SALESMAN.NAME).where(
      SALESMAN.COLUMNS.SALESMANNAME,
      body.sales_man_name.value
    );

    const exists_response = await query;

    if (exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "SalesMan Name Already Exists",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const query_insert = await knex(`${SALESMAN.NAME}`).returning("id").insert({
      [SALESMAN.COLUMNS.SALESMANCODE]: body.sales_man_code?.value ?? 0,
      [SALESMAN.COLUMNS.SALESMANNAME]: body.sales_man_name?.value ?? null,
      [SALESMAN.COLUMNS.COMPANY_ID]: body.company_id?.value ?? 0,
      [SALESMAN.COLUMNS.CODE]: body.code?.value ?? 0,
      [SALESMAN.COLUMNS.SHORT_NAME]: body.short_name?.value ?? null,
      [SALESMAN.COLUMNS.MOBILE]: body.mobile?.value ?? 0,
      [SALESMAN.COLUMNS.FATHER_NAME]: body.father_name?.value ?? null,
      [SALESMAN.COLUMNS.MOTHER_NAME]: body.mother_name?.value ?? null,
      [SALESMAN.COLUMNS.DOB]: body.dob?.value ?? 0,
      [SALESMAN.COLUMNS.SEX]: body.sex?.value ?? 0,
      [SALESMAN.COLUMNS.ADD1]: body.add1?.value ?? 0,
      [SALESMAN.COLUMNS.ADD2]: body.add2?.value ?? 0,
      [SALESMAN.COLUMNS.ADD3]: body.add3?.value ?? 0,
      [SALESMAN.COLUMNS.PHOTO]: photoFilePath || null,
      [SALESMAN.COLUMNS.ID_PROOF]: idProofFilePath || null,
      [SALESMAN.COLUMNS.PASSBOOK]: passBookFilePath || null,
      [SALESMAN.COLUMNS.IS_ACTIVE]: body.is_active?.value ?? 0,
      [SALESMAN.COLUMNS.CREATED_BY]: 2
    });

    const response = await query_insert;
    var salesman_id = query_insert[0].id;

    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_IMPLEMENTED,
        message: "Error while creating SalesMan",
        property: "",
        code: "NOT_IMPLEMENTED"
      });
    }

    var outlet_id_str = body.outlet_ids.value.split(',');

    let outlet_id_array = outlet_id_str.map(Number);

    if (outlet_id_array.length > 0) {

      const outlets = outlet_id_array.map(outlet => ({
        [SALESMAN_OUTLET_MAPPING.COLUMNS.SALESMAN_ID]: salesman_id,
        [SALESMAN_OUTLET_MAPPING.COLUMNS.OUTLET_ID]: outlet,
        [SALESMAN_OUTLET_MAPPING.COLUMNS.COMPANY_ID]: body.company_id?.value ?? 0,
        [SALESMAN_OUTLET_MAPPING.COLUMNS.IS_ACTIVE]: body.is_active?.value ?? 0,
        [SALESMAN_OUTLET_MAPPING.COLUMNS.CREATED_BY]: 2,
      }));

      const insertSalesmanOutlet = await knex(`${SALESMAN_OUTLET_MAPPING.NAME}`).insert(
        outlets
      );
      if (!insertSalesmanOutlet) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_IMPLEMENTED,
          message: "Error while creating Salesman Outlet Mapping",
          property: "",
          code: "NOT_IMPLEMENTED"
        });
      }
    }


    return { success: true };
  }
  async function putSalesMan({ SalesMan_id, body, logTrace, userDetails }) {
    async function writeFile(filePath, buffer) {
      try {
        await fs.writeFile(filePath, buffer);
        console.log('File written successfully:', filePath);
      } catch (err) {
        console.error('Error writing file:', err);
      }
    }

    const targetFolder = 'uploads/salesman';

    let idProofFilePath, photoFilePath, passBookFilePath;


    if (body.id_proof !== null && body.id_proof !== undefined) {
      if (body.id_proof.filename) {
        let idProofFileName = body.id_proof.filename;
        idProofFilePath = `${targetFolder}/${idProofFileName}`;
        await writeFile(idProofFilePath, body.id_proof._buf);
      } else {
        idProofFilePath = body.id_proof.value;
      }
    }

    if (body.photo !== null && body.photo !== undefined) {
      if (body.photo.filename) {
        let photoFileName = body.photo.filename;
        photoFilePath = `${targetFolder}/${photoFileName}`;
        await writeFile(photoFilePath, body.photo._buf);
      } else {
        photoFilePath = body.photo.value;
      }
    }

    if (body.passbook !== null && body.passbook !== undefined) {
      if (body.passbook.filename) {
        console.log(body.passbook.filename, "string");
        let passbookFileName = body.passbook.filename;
        passBookFilePath = `${targetFolder}/${passbookFileName}`;

        await writeFile(passBookFilePath, body.passbook._buf);
      }
      else {
        passBookFilePath = body.passbook.value;
      }
    }

    const knex = this;
    const query = knex(SALESMAN.NAME).where(SALESMAN.COLUMNS.ID, SalesMan_id);

    const exists_response = await query;
    if (!exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "SalesMan not found to update",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const query_update = await knex(`${SALESMAN.NAME}`)
      .where(`${SALESMAN.COLUMNS.ID}`, SalesMan_id)
      .update({
        [SALESMAN.COLUMNS.SALESMANCODE]: body.sales_man_code?.value ?? 0,
        [SALESMAN.COLUMNS.SALESMANNAME]: body.sales_man_name?.value ?? null,
        [SALESMAN.COLUMNS.COMPANY_ID]: body.company_id?.value ?? 0,
        [SALESMAN.COLUMNS.CODE]: body.code?.value ?? 0,
        [SALESMAN.COLUMNS.SHORT_NAME]: body.short_name?.value ?? null,
        [SALESMAN.COLUMNS.MOBILE]: body.mobile?.value ?? 0,
        [SALESMAN.COLUMNS.FATHER_NAME]: body.father_name?.value ?? null,
        [SALESMAN.COLUMNS.MOTHER_NAME]: body.mother_name?.value ?? null,
        [SALESMAN.COLUMNS.DOB]: body.dob?.value ?? 0,
        [SALESMAN.COLUMNS.SEX]: body.sex?.value ?? 0,
        [SALESMAN.COLUMNS.ADD1]: body.add1?.value ?? 0,
        [SALESMAN.COLUMNS.ADD2]: body.add2?.value ?? 0,
        [SALESMAN.COLUMNS.ADD3]: body.add3?.value ?? 0,
        [SALESMAN.COLUMNS.PHOTO]: photoFilePath,
        [SALESMAN.COLUMNS.ID_PROOF]: idProofFilePath,
        [SALESMAN.COLUMNS.PASSBOOK]: passBookFilePath,
        [SALESMAN.COLUMNS.IS_ACTIVE]: body.is_active?.value ?? 0,
        [SALESMAN.COLUMNS.CREATED_BY]: 2
      });
    const response = await query_update;
    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_IMPLEMENTED,
        message: "Error while updatind SalesMan",
        property: "",
        code: "NOT_IMPLEMENTED"
      });
    }

    // var outlet_id_str = body.outlet_ids.value.split(',');

    // let outlet_id_array = outlet_id_str.map(Number);

    // if (outlet_id_array.length > 0) {
    //   const query_update1 = await knex(`${SALESMAN_OUTLET_MAPPING.NAME}`)
    //     .where(`${SALESMAN_OUTLET_MAPPING.COLUMNS.SALESMAN_ID}`, SalesMan_id)
    //     .where(`${SALESMAN_OUTLET_MAPPING.COLUMNS.COMPANY_ID}`, body.company_id?.value ?? 0)
    //     .update({
    //       [SALESMAN_OUTLET_MAPPING.COLUMNS.IS_ACTIVE]: false,
    //       [SALESMAN_OUTLET_MAPPING.COLUMNS.UPDATED_BY]: 2,
    //       [SALESMAN_OUTLET_MAPPING.COLUMNS.UPDATED_AT]: new Date(),
    //     });
    //   const outlets_logic = await Promise.all(
    //     outlet_id_array.map(async outlet => {
    //       const outlets = {
    //         [SALESMAN_OUTLET_MAPPING.COLUMNS.SALESMAN_ID]: SalesMan_id,
    //         [SALESMAN_OUTLET_MAPPING.COLUMNS.OUTLET_ID]: outlet,
    //         [SALESMAN_OUTLET_MAPPING.COLUMNS.COMPANY_ID]: body.company_id?.value ?? 0,
    //         [SALESMAN_OUTLET_MAPPING.COLUMNS.IS_ACTIVE]: body.is_active?.value ?? 0,
    //         [SALESMAN_OUTLET_MAPPING.COLUMNS.CREATED_BY]: 2,
    //       };
    //       const query_check = knex(SALESMAN_OUTLET_MAPPING.NAME).where(SALESMAN_OUTLET_MAPPING.COLUMNS.SALESMAN_ID, SalesMan_id).where(SALESMAN_OUTLET_MAPPING.COLUMNS.OUTLET_ID, outlet);

    //       const check_response = await query_check;
    //       if (check_response.length > 0) {
    //         const query_update2 = await knex(`${SALESMAN_OUTLET_MAPPING.NAME}`)
    //           .where(`${SALESMAN_OUTLET_MAPPING.COLUMNS.SALESMAN_ID}`, SalesMan_id)
    //           .where(`${SALESMAN_OUTLET_MAPPING.COLUMNS.COMPANY_ID}`, body.company_id?.value ?? 0)
    //           .where(`${SALESMAN_OUTLET_MAPPING.COLUMNS.OUTLET_ID}`, outlet)
    //           .update({
    //             [SALESMAN_OUTLET_MAPPING.COLUMNS.IS_ACTIVE]: true,
    //             [SALESMAN_OUTLET_MAPPING.COLUMNS.UPDATED_BY]: 2,
    //             [SALESMAN_OUTLET_MAPPING.COLUMNS.UPDATED_AT]: new Date(),
    //           });
    //       } else {
    //         await knex(`${SALESMAN_OUTLET_MAPPING.NAME}`)
    //           .insert(outlets);
    //       }
    //     })
    //   );
    // }

    return { success: true };
  }

  async function putSalesManOutletMapping({ SalesMan_id, body, logTrace, userDetails }) {
    async function writeFile(filePath, buffer) {
      try {
        await fs.writeFile(filePath, buffer);
        console.log('File written successfully:', filePath);
      } catch (err) {
        console.error('Error writing file:', err);
      }
    }

    const targetFolder = 'uploads/salesman';

    let idProofFilePath, photoFilePath, passBookFilePath;


    if (body.id_proof !== null && body.id_proof !== undefined) {
      if (body.id_proof.filename) {
        let idProofFileName = body.id_proof.filename;
        idProofFilePath = `${targetFolder}/${idProofFileName}`;
        await writeFile(idProofFilePath, body.id_proof._buf);
      } else {
        idProofFilePath = body.id_proof.value;
      }
    }

    if (body.photo !== null && body.photo !== undefined) {
      if (body.photo.filename) {
        let photoFileName = body.photo.filename;
        photoFilePath = `${targetFolder}/${photoFileName}`;
        await writeFile(photoFilePath, body.photo._buf);
      } else {
        photoFilePath = body.photo.value;
      }
    }

    if (body.passbook !== null && body.passbook !== undefined) {
      if (body.passbook.filename) {
        console.log(body.passbook.filename, "string");
        let passbookFileName = body.passbook.filename;
        passBookFilePath = `${targetFolder}/${passbookFileName}`;

        await writeFile(passBookFilePath, body.passbook._buf);
      }
      else {
        passBookFilePath = body.passbook.value;
      }
    }

    const knex = this;
    const query = knex(SALESMAN.NAME).where(SALESMAN.COLUMNS.ID, SalesMan_id);

    const exists_response = await query;
    if (!exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "SalesMan not found to update",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const query_update = await knex(`${SALESMAN.NAME}`)
      .where(`${SALESMAN.COLUMNS.ID}`, SalesMan_id)
      .update({
        [SALESMAN.COLUMNS.SALESMANCODE]: body.sales_man_code?.value ?? 0,
        [SALESMAN.COLUMNS.SALESMANNAME]: body.sales_man_name?.value ?? null,
        [SALESMAN.COLUMNS.COMPANY_ID]: body.company_id?.value ?? 0,
        [SALESMAN.COLUMNS.CODE]: body.code?.value ?? 0,
        [SALESMAN.COLUMNS.SHORT_NAME]: body.short_name?.value ?? null,
        [SALESMAN.COLUMNS.MOBILE]: body.mobile?.value ?? 0,
        [SALESMAN.COLUMNS.FATHER_NAME]: body.father_name?.value ?? null,
        [SALESMAN.COLUMNS.MOTHER_NAME]: body.mother_name?.value ?? null,
        [SALESMAN.COLUMNS.DOB]: body.dob?.value ?? 0,
        [SALESMAN.COLUMNS.SEX]: body.sex?.value ?? 0,
        [SALESMAN.COLUMNS.ADD1]: body.add1?.value ?? 0,
        [SALESMAN.COLUMNS.ADD2]: body.add2?.value ?? 0,
        [SALESMAN.COLUMNS.ADD3]: body.add3?.value ?? 0,
        [SALESMAN.COLUMNS.PHOTO]: photoFilePath,
        [SALESMAN.COLUMNS.ID_PROOF]: idProofFilePath,
        [SALESMAN.COLUMNS.PASSBOOK]: passBookFilePath,
        [SALESMAN.COLUMNS.IS_ACTIVE]: body.is_active?.value ?? 0,
        [SALESMAN.COLUMNS.CREATED_BY]: 2
      });
    const response = await query_update;
    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_IMPLEMENTED,
        message: "Error while updatind SalesMan",
        property: "",
        code: "NOT_IMPLEMENTED"
      });
    }

    var outlet_id_str = body.outlet_ids.value.split(',');

    let outlet_id_array = outlet_id_str.map(Number);

    if (outlet_id_array.length > 0) {
      const query_update1 = await knex(`${SALESMAN_OUTLET_MAPPING.NAME}`)
        .where(`${SALESMAN_OUTLET_MAPPING.COLUMNS.SALESMAN_ID}`, SalesMan_id)
        .where(`${SALESMAN_OUTLET_MAPPING.COLUMNS.COMPANY_ID}`, body.company_id?.value ?? 0)
        .update({
          [SALESMAN_OUTLET_MAPPING.COLUMNS.IS_ACTIVE]: false,
          [SALESMAN_OUTLET_MAPPING.COLUMNS.UPDATED_BY]: 2,
          [SALESMAN_OUTLET_MAPPING.COLUMNS.UPDATED_AT]: new Date(),
        });
      const outlets_logic = await Promise.all(
        outlet_id_array.map(async outlet => {
          const outlets = {
            [SALESMAN_OUTLET_MAPPING.COLUMNS.SALESMAN_ID]: SalesMan_id,
            [SALESMAN_OUTLET_MAPPING.COLUMNS.OUTLET_ID]: outlet,
            [SALESMAN_OUTLET_MAPPING.COLUMNS.COMPANY_ID]: body.company_id?.value ?? 0,
            [SALESMAN_OUTLET_MAPPING.COLUMNS.IS_ACTIVE]: body.is_active?.value ?? 0,
            [SALESMAN_OUTLET_MAPPING.COLUMNS.CREATED_BY]: 2,
          };
          const query_check = knex(SALESMAN_OUTLET_MAPPING.NAME).where(SALESMAN_OUTLET_MAPPING.COLUMNS.SALESMAN_ID, SalesMan_id).where(SALESMAN_OUTLET_MAPPING.COLUMNS.OUTLET_ID, outlet);

          const check_response = await query_check;
          if (check_response.length > 0) {
            const query_update2 = await knex(`${SALESMAN_OUTLET_MAPPING.NAME}`)
              .where(`${SALESMAN_OUTLET_MAPPING.COLUMNS.SALESMAN_ID}`, SalesMan_id)
              .where(`${SALESMAN_OUTLET_MAPPING.COLUMNS.COMPANY_ID}`, body.company_id?.value ?? 0)
              .where(`${SALESMAN_OUTLET_MAPPING.COLUMNS.OUTLET_ID}`, outlet)
              .update({
                [SALESMAN_OUTLET_MAPPING.COLUMNS.IS_ACTIVE]: true,
                [SALESMAN_OUTLET_MAPPING.COLUMNS.UPDATED_BY]: 2,
                [SALESMAN_OUTLET_MAPPING.COLUMNS.UPDATED_AT]: new Date(),
              });
          } else {
            await knex(`${SALESMAN_OUTLET_MAPPING.NAME}`)
              .insert(outlets);
          }
        })
      );
    }

    return { success: true };
  }

  async function deleteSalesMan({ SalesMan_id, body, logTrace }) {
    const knex = this;
    const query = knex(SALESMAN.NAME).where(SALESMAN.COLUMNS.ID, SalesMan_id);

    const exists_response = await query;

    if (!exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "SalesMan not found to delete",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const query_delete = knex(SALESMAN.NAME)
      .where(SALESMAN.COLUMNS.ID, SalesMan_id)
      .del();
    logQuery({
      logger: fastify.log,
      query,
      context: "delete SalesMan",
      logTrace
    });
    const response = await query_delete;
    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "SalesMan not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return { success: true };
  }
  async function getSalesManInfoByBioCode({ params, logTrace }) {
    const knex = this;
    const query = knex(SALESMAN.NAME).where(
      SALESMAN.COLUMNS.SALESMANCODE,
      params.biocode
    );
    logQuery({
      logger: fastify.log,
      query,
      context: "Get SalesMan Info",
      logTrace
    });
    const response = await query;

    // console.log('response_salesman', response)

    if (!response.length) {
      return [];
    }
    return response[0];
  }
  async function getSalesManInfo({ params, logTrace }) {
    const knex = this;
    const query = knex(SALESMAN.NAME).where(
      SALESMAN.COLUMNS.ID,
      params.SalesMan_id
    );
    logQuery({
      logger: fastify.log,
      query,
      context: "Get SalesMan Info",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "SalesMan not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response[0];
  }

  async function getSalesManInfoOutletMappingOne({ params, logTrace }) {
    const knex = this;

    const query = knex
      .select([
        `${SALESMAN.NAME}.*`,
        `${SALESMAN_OUTLET_MAPPING.NAME}.${SALESMAN_OUTLET_MAPPING.COLUMNS.OUTLET_ID}`
        // `${SALESMAN_OUTLET_MAPPING.NAME}.${SALESMAN_OUTLET_MAPPING.COLUMNS.SALESMAN_ID}`

      ])
      .from(`${SALESMAN.NAME} as ${SALESMAN.NAME}`)
      .leftJoin(
        `${SALESMAN_OUTLET_MAPPING.NAME} as ${SALESMAN_OUTLET_MAPPING.NAME}`,
        `${SALESMAN.NAME}.${SALESMAN.COLUMNS.ID}`,
        `${SALESMAN_OUTLET_MAPPING.NAME}.${SALESMAN_OUTLET_MAPPING.COLUMNS.SALESMAN_ID}`
      )
      .where(
        `${SALESMAN.NAME}.${SALESMAN.COLUMNS.ID}`,
        params.SalesMan_id
      )

    logQuery({
      logger: fastify.log,
      query,
      context: "Get SalesMan",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "SalesMan data not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    const salesMandetails = await Promise.all(
      response.map(async sales => {
        const outlets = await knex
          .select([
            `${OUTLETS.NAME}.*`
          ])
          .from(`${SALESMAN_OUTLET_MAPPING.NAME} as ${SALESMAN_OUTLET_MAPPING.NAME}`)
          .leftJoin(
            `${OUTLETS.NAME} as ${OUTLETS.NAME}`,
            `${SALESMAN_OUTLET_MAPPING.NAME}.${SALESMAN_OUTLET_MAPPING.COLUMNS.OUTLET_ID}`,
            `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
          )
          .where(
            `${SALESMAN_OUTLET_MAPPING.NAME}.${SALESMAN_OUTLET_MAPPING.COLUMNS.SALESMAN_ID}`,
            params.SalesMan_id
          )

        return { ...sales, outlets };
      })
    );

    return salesMandetails[0];

  }
  async function getSalesManOutletMapping({ body, params, logTrace }) {
    const knex = this;
    const query = knex
      .select([
        `${SALESMAN.NAME}.*`,
        `${SALESMAN_OUTLET_MAPPING.NAME}.${SALESMAN_OUTLET_MAPPING.COLUMNS.OUTLET_ID}`,
        `${SALESMAN_OUTLET_MAPPING.NAME}.${SALESMAN_OUTLET_MAPPING.COLUMNS.SALESMAN_ID}`

      ])
      .from(`${SALESMAN.NAME} as ${SALESMAN.NAME}`)
      .leftJoin(
        `${SALESMAN_OUTLET_MAPPING.NAME} as ${SALESMAN_OUTLET_MAPPING.NAME}`,
        `${SALESMAN.NAME}.${SALESMAN.COLUMNS.ID}`,
        `${SALESMAN_OUTLET_MAPPING.NAME}.${SALESMAN_OUTLET_MAPPING.COLUMNS.SALESMAN_ID}`
      )

    logQuery({
      logger: fastify.log,
      query,
      context: "Get SalesMan",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "SalesMan data not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    const salesMandetails = await Promise.all(
      response.map(async sales => {
        const outlets = await knex
          .select([
            `${OUTLETS.NAME}.*`
            // `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`,
            // `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`,
            // `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_SHORT_NAME}`,
            // `${HEADS.NAME}.${HEADS.COLUMNS.CATEOGORY_NAME} as head_name`,
            // `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.TYPE_NAME}`,
            // `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.CATEGORY_NAME}`,
            // `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.SUBCATEGORY_NAME}`
          ])
          .from(`${SALESMAN_OUTLET_MAPPING.NAME} as ${SALESMAN_OUTLET_MAPPING.NAME}`)
          .leftJoin(
            `${OUTLETS.NAME} as ${OUTLETS.NAME}`,
            `${SALESMAN_OUTLET_MAPPING.NAME}.${SALESMAN_OUTLET_MAPPING.COLUMNS.OUTLET_ID}`,
            `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
          )

        return { ...sales, outlets };
      })
    );

    return salesMandetails;
  }

  async function getSalesManInfoOutletMappingOnePaginate({ queryString, params, logTrace }) {
    const knex = this;
    const { status, search } = queryString;

    const subquery = knex
      .distinct(`${SALESMAN.NAME}.${SALESMAN.COLUMNS.ID}`)
      .from(`${SALESMAN.NAME}`)
      .modify(queryBuilder => {
        if (search) {
          queryBuilder.where(SALESMAN.COLUMNS.SALESMANNAME, "ilike", `%${search}%`)
            .orWhere(SALESMAN.COLUMNS.SALESMANCODE, "ilike", `%${search}%`)
            .orWhere(SALESMAN.COLUMNS.MOBILE, "ilike", `%${search}%`)
            .orWhere(SALESMAN.COLUMNS.SEX, "ilike", `%${search}%`)
            .orWhere(SALESMAN.COLUMNS.SHORT_NAME, "ilike", `%${search}%`)
        }
        if (Number(status) && Number(status) == 1) {
          queryBuilder.where(`${SALESMAN.NAME}.${SALESMAN.COLUMNS.IS_ACTIVE}`, true);
        }
        if (Number(status) && Number(status) == 2) {
          queryBuilder.where(`${SALESMAN.NAME}.${SALESMAN.COLUMNS.IS_ACTIVE}`, false);
        }
      })
      .orderBy(SALESMAN.COLUMNS.ID, "DESC");

    const paginatedIds = await subquery.paginate({
      pageSize: params.page_size,
      currentPage: params.current_page
    });

    if (!paginatedIds.data.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "SalesMan not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    if (paginatedIds.meta.pagination.total_pages < params.current_page) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Requested page is beyond the available data",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const query = knex
      .select([
        `${SALESMAN.NAME}.*`,
        `${SALESMAN_OUTLET_MAPPING.NAME}.${SALESMAN_OUTLET_MAPPING.COLUMNS.OUTLET_ID}`
      ])
      .from(`${SALESMAN.NAME} as ${SALESMAN.NAME}`)
      .leftJoin(
        `${SALESMAN_OUTLET_MAPPING.NAME} as ${SALESMAN_OUTLET_MAPPING.NAME}`,
        `${SALESMAN.NAME}.${SALESMAN.COLUMNS.ID}`,
        `${SALESMAN_OUTLET_MAPPING.NAME}.${SALESMAN_OUTLET_MAPPING.COLUMNS.SALESMAN_ID}`
      )
      .whereIn(`${SALESMAN.NAME}.${SALESMAN.COLUMNS.ID}`, paginatedIds.data.map(item => item.id))
      .orderBy(SALESMAN.COLUMNS.ID, "DESC");

    logQuery({
      logger: fastify.log,
      query,
      context: "Get SalesMan",
      logTrace
    });

    const detailedSalesManData = await query;

    const salesMandetails = [];
    const salesManMap = new Map();

    detailedSalesManData.forEach(sales => {
      if (!salesManMap.has(sales.id)) {
        salesManMap.set(sales.id, {
          ...sales,
          outlets: []
        });
      }
      salesManMap.get(sales.id).outlets.push(sales.outlet_id);
    });

    for (const [salesId, salesMan] of salesManMap.entries()) {
      const uniqueOutlets = await knex
        .distinct([`${OUTLETS.NAME}.*`])
        .from(`${SALESMAN_OUTLET_MAPPING.NAME} as ${SALESMAN_OUTLET_MAPPING.NAME}`)
        .leftJoin(
          `${OUTLETS.NAME} as ${OUTLETS.NAME}`,
          `${SALESMAN_OUTLET_MAPPING.NAME}.${SALESMAN_OUTLET_MAPPING.COLUMNS.OUTLET_ID}`,
          `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
        )
        .whereIn(
          `${SALESMAN_OUTLET_MAPPING.NAME}.${SALESMAN_OUTLET_MAPPING.COLUMNS.OUTLET_ID}`,
          salesMan.outlets
        );

      salesMan.outlets = uniqueOutlets;
      salesMandetails.push(salesMan);
    }

    return {
      data: salesMandetails,
      meta: paginatedIds.meta
    };
  }

  async function getSalesManByOutlet({ body, params, logTrace }) {
    const knex = this;
    const query = knex
      .select([
        `${SALESMAN.NAME}.*`,
        `${SALESMAN_OUTLET_MAPPING.NAME}.${SALESMAN_OUTLET_MAPPING.COLUMNS.OUTLET_ID}`,
        `${SALESMAN_OUTLET_MAPPING.NAME}.${SALESMAN_OUTLET_MAPPING.COLUMNS.SALESMAN_ID}`

      ])
      .from(`${SALESMAN.NAME} as ${SALESMAN.NAME}`)
      .leftJoin(
        `${SALESMAN_OUTLET_MAPPING.NAME} as ${SALESMAN_OUTLET_MAPPING.NAME}`,
        `${SALESMAN.NAME}.${SALESMAN.COLUMNS.ID}`,
        `${SALESMAN_OUTLET_MAPPING.NAME}.${SALESMAN_OUTLET_MAPPING.COLUMNS.SALESMAN_ID}`
      )
      .where(`${SALESMAN_OUTLET_MAPPING.NAME}.${SALESMAN_OUTLET_MAPPING.COLUMNS.OUTLET_ID}`, params.outlet_id)

    logQuery({
      logger: fastify.log,
      query,
      context: "Get SalesMan By Outlets",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Outlet wise salesMan data not found",
        property: "",
        code: "NOT_FOUND"
      });
    }



    return response;
  }

  return {
    getSalesMan,
    postSalesMan,
    putSalesMan,
    deleteSalesMan,
    getSalesManInfo,
    getSalesManPaginate,
    postSalesManOutletMapping,
    putSalesManOutletMapping,
    getSalesManOutletMapping,
    getSalesManInfoOutletMappingOne,
    getSalesManInfoOutletMappingOnePaginate,
    getSalesManByOutlet,
    getSalesManInfoByBioCode
  };
}

module.exports = salesManRepo;
