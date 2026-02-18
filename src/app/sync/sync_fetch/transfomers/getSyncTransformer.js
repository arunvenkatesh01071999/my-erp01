function getUnitDetailsTranformer(response) {
    if (!Array.isArray(response) || response.length === 0) {
        return {
            "status": "0",
            "message": response.message
        };
    }

    return {
        status: "1",
        message: response.map(unit => ({
            MUOM_clientid: "1", // Hardcoded as per requirement
            MUOM_id: unit?.id?.toString(), // Fallback to "0" if missing
            MUOM_name: unit?.units_short_name?.toString() // Use "N/A" for missing values
        }))
    };
}


function getBrandDetailsTranformer(response) {
    if (!Array.isArray(response) || response.length === 0) {
        return {
            "status": "0",
            "message": response.message
        };
    }
    return {
        status: "1",
        message: response.map(brand => ({
            br_id: brand?.id?.toString(), // Hardcoded as per requirement
            br_name: brand?.cateogory_name?.toString(), // Fallback to "0" if missing
            active: brand?.is_active ? "1" : "0", // Convert boolean to string "1" or "0"
            br_clientid: "1"
        }))
    };
}

function getBrandCompanyDetailsTranformer(response) {
    if (!Array.isArray(response) || response.length === 0) {
        return {
            "status": "0",
            "message": response.message
        };
    }
    return {
        status: "1",
        message: response.map(brand => ({
            bcid: brand?.id?.toString(), // Hardcoded as per requirement
            bcname: brand?.type_name?.toString(), // Fallback to "0" if missing
            br_clientid: "1"
        }))
    };
}

function getMerchantCategoryDetailsTranformer(response) {
    if (!Array.isArray(response) || response.length === 0) {
        return {
            "status": "0",
            "message": response.message
        };
    }
    return {
        status: "1",
        message: response.map(category => ({
            mcid: category?.id?.toString(), // Hardcoded as per requirement
            mcname: category?.merchant_category_name?.toString(), // Fallback to "0" if missing
            br_clientid: "1"
        }))
    };
}

function getCategoryDetailsTranformer(response) {
    if (!Array.isArray(response) || response.length === 0) {
        return {
            "status": "0",
            "message": response.message
        };
    }
    console.log("response", response)
    return {
        status: "1",
        message: response.map(category => ({
            CM_id: category?.id?.toString(), // Hardcoded as per requirement
            CM_name: category?.category_name?.toString(), // Fallback to "0" if missing
            CM_UID: category?.created_by?.toString() || "1", // Hardcoded as per requirement
            CM_MID: category?.updated_by?.toString() || "1",
            Active: category?.is_active ? "1" : "0",
            CM_Parent: String(category?.CM_Parent),
            OOS: "1"
        }))
    };
}

function getCategoryEditDetailsTranformer(response) {
    if (!Array.isArray(response) || response.length === 0) {
        return {
            "status": "0",
            "message": response.message
        };
    }
    return {
        status: "1",
        message: response.map(category => ({
            clientid: "1",
            locid: category?.outlet_id?.toString(),
            cm_id: category?.id?.toString(),
            cm_name: category?.category_name?.toString(),
            cm_parent: category?.CM_Parent?.toString(),
            status: category?.is_active ? "1" : "0",
        }))
    };
}



function getBrandEditDetailsTranformer(response) {
    if (!Array.isArray(response) || response.length === 0) {
        return {
            "status": "0",
            "message": response.message
        };
    }
    return {
        status: "1",
        message: response.map(brand => ({
            Clientid: "1",
            Locid: brand?.outlet_id?.toString(),
            bid: brand?.brand_id?.toString(),
            bname: brand?.brand_name?.toString(),
            bcid: "0",
            status: brand?.is_active ? "1" : "0",
        }))
    };
}

function getReDetailsTransformer(response) {
    if (!Array.isArray(response) || response.length === 0) {
        return {
            status: "0",
            message: "No rate entry details found"
        };
    }

    return {
        status: "1",
        message: response.map(rate => ({
            trid: rate?.trid,
            prodid: rate?.prodid,
            rate: rate?.rate,
            onlinerate: rate?.onlinerate,
            tr_date: rate?.tr_date?.toString(),
            tr_time: rate?.tr_time?.toString()
        }))
    };
}


function getMerchantCategoryEditDetailsTranformer(response) {
    if (!Array.isArray(response) || response.length === 0) {
        return {
            "status": "0",
            "message": response.message
        };
    }
    return {
        status: "1",
        message: response.map(category => ({
            Clientid: "1",
            Locid: category?.outlet_id?.toString(),
            mcid: category?.category_id?.toString(),
            mcname: category?.category_name?.toString(),
            status: category?.is_active ? "1" : "0",
        }))
    };
}

function getBrandCompanyEditDetailsTranformer(response) {
    if (!Array.isArray(response) || response.length === 0) {
        return {
            "status": "0",
            "message": response.message
        };
    }
    return {
        status: "1",
        message: response.map(brand => ({
            Clientid: "1",
            Locid: brand?.outlet_id?.toString(),
            bcid: brand?.brand_company_id?.toString(),
            bcname: brand?.brand_company_name?.toString(),
            status: brand?.is_active ? "1" : "0"
        }))
    };
}

function getItemBarcodeDetailsTransformer(response) {
    if (!Array.isArray(response) || response.length === 0) {
        return {
            "status": "0",
            "message": response.message
        };
    }
    return {
        status: "1",
        message: response.map(item => {
            return {
                clientid: "1",
                prd_id: item?.product_id?.toString(),
                barcode: item?.barcode1?.toString(),
                Barcode1: item?.barcode2?.toString(),
                Barcode2: item?.barcode3?.toString(),
                Barcode3: item?.barcode4?.toString(),
                Barcode4: " ",
                OIDs: "",
                uid: item?.user_id?.toString() || "1",
                modify_time: item?.edit_time || ""
            };
        })
    };
}

function getItemSettingDetailsTransformer(response) {
    if (!Array.isArray(response) || response.length === 0) {
        return {
            "status": "0",
            "message": response.message
        };
    }
    return {
        status: "1",
        message: response.map(item => {
            return {
                Clientid: "1",
                Locid: item?.outlet_id?.toString() || "1",
                ProdId: item?.product_id?.toString() || "1",
                SActive: item?.sales_active,
                PActive: item?.purchase_active, // Fixed boolean logic,
                Status: item?.status || "0",
                EDate: item?.edate || "",
                Etime: item?.etime || "",
                pmargin: item?.pmargin || "",
                Barcode1: item?.barcode1 || "",
                Barcode2: item?.barcode2 || "",
                Barcode3: item?.barcode3 || "",
                Barcode4: item?.barcode4 || "",
                UID: "1"
            };
        })
    };
}

function getProductMasterDetailsTransformer(response) {
    if (!Array.isArray(response) || response.length === 0) {
        return {
            "status": "0",
            "message": response.message
        };
    }
    return {
        status: "1",
        message: response.map(item => {

            return {
                prd_Clientid: "1",
                prd_id: item?.product_id?.toString() || "1",
                prd_code: item?.product_code?.toString() || "",
                prd_Name: item?.product_name?.toString() || "",
                prd_grp_id: item?.sub_category_id?.toString() || "1",
                prd_uomid: item?.uom_id?.toString() || "1",
                prd_sales_rate: item?.sale_rate?.toString() || "1",
                prd_name_tamil: item?.native_name?.toString() || " ",
                prd_barcode: item?.barcode1?.toString() || " ",
                prd_ExpiryItem: item?.batch_item ? "1" : "0", //clarify  // Fixed boolean logic
                brand: item?.brand_id?.toString() || "1",
                vat: item?.gst?.toString() || "1",
                uid: item?.user_id?.toString() || "1",
                create_time: item?.create_time || "", // Avoid defaulting timestamps to "1"
                web_active: item?.is_active ? "1" : "0",
                web_name: item?.product_name?.toString() || "",
                weighable: item?.wscale ? "1" : "0", // Fixed boolean logic
                outlet_id: item?.outlet_id?.toString() || "",
                pactive: item?.purchase ? "1" : "0", // Fixed boolean logic
                mcid: item?.mc_id?.toString() || "1",
                pitemoutlet: null, //clarify
                hsn: item?.hsn?.toString() || "1",
                Barcode1: item?.barcode2?.toString() || " ",
                Barcode2: item?.barcode3?.toString() || " ",
                Barcode3: item?.barcode4?.toString() || " ",
                Barcode4: " ",
                Cess: item?.cess?.toString() || "1",
                EditTime: item?.EditTime || "", // Avoid defaulting timestamps to "1"
                bcid: item?.bc_id?.toString() || "1",
                Wid: 1, //clarify
                Prd_Type: item?.type_id?.toString() || "1",
                BatchNo: item?.batch_item ? "1" : "0",  // Fixed boolean logic //clarify
            };
        })
    };
}


function getProductMasterEditDetailsTransformer(response) {
    if (!Array.isArray(response) || response.length === 0) {
        return {
            "status": "0",
            "message": response.message
        };
    }
    return {
        status: "1",
        message: response.map(item => {

            return {
                prd_Clientid: "1",
                prd_id: item?.product_id?.toString() || "1",
                prd_code: item?.product_code?.toString() || "",
                prd_Name: item?.product_name?.toString() || "",
                prd_grp_id: item?.sub_category_id?.toString() || "1",
                prd_uomid: item?.uom_id?.toString() || "1",
                mode: item?.mode?.toString() || " ",
                prd_sales_rate: item?.sale_rate?.toString() || "1",
                prd_name_tamil: " ",
                prd_barcode: item?.barcode?.toString() || " ",
                prd_ExpiryItem: item?.batch_item ? "1" : "0", //clarify  // Fixed boolean logic
                brand: item?.brand_id?.toString() || "1",
                vat: item?.gst?.toString() || "1",
                uid: item?.user_id?.toString() || "1",
                create_time: item?.create_time || "", // Avoid defaulting timestamps to "1"
                web_active: item?.is_active ? "1" : "0",
                web_name: item?.product_name?.toString() || "",
                weighable: item?.wscale ? "1" : "0", // Fixed boolean logic
                outlet_id: item?.outlet_id?.toString() || "",
                pactive: item?.purchase ? "1" : "0", // Fixed boolean logic
                mcid: item?.mc_id?.toString() || "1",
                pitemoutlet: null, //clarify
                hsn: item?.hsn?.toString() || "1",
                Barcode1: item?.barcode1?.toString() || " ",
                Barcode2: item?.barcode2?.toString() || " ",
                Barcode3: item?.barcode3?.toString() || " ",
                Barcode4: item?.barcode4?.toString() || " ",
                Cess: item?.cess?.toString() || "1",
                EditTime: item?.EditTime || "", // Avoid defaulting timestamps to "1"
                bcid: item?.bc_id?.toString() || "1",
                Wid: 1, //clarify
                Prd_Type: item?.type_id?.toString() || "1",
                BatchNo: item?.batch_item ? "1" : "0",  // Fixed boolean logic //clarify
            };
        })
    };
}


module.exports = {
    getUnitDetailsTranformer,
    getBrandDetailsTranformer,
    getBrandCompanyDetailsTranformer,
    getMerchantCategoryDetailsTranformer,
    getCategoryDetailsTranformer,
    getCategoryEditDetailsTranformer,
    getBrandEditDetailsTranformer,
    getMerchantCategoryEditDetailsTranformer,
    getBrandCompanyEditDetailsTranformer,
    getItemBarcodeDetailsTransformer,
    getItemSettingDetailsTransformer,
    getProductMasterDetailsTransformer,
    getProductMasterEditDetailsTransformer,
    getReDetailsTransformer
};
