const axios = require("axios");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errorHandler/CustomError"); // fix import

const axiosClient = axios.create({
    baseURL: process.env.BASE_URL,
    timeout: 30000,
});

// Common Request
async function axiosCall({ method, url, baseURL, data = {}, headers = {} }) {
    try {

        const response = await axiosClient.request({
            method,
            url,
            data,
            headers,
            baseURL: baseURL || axiosClient.defaults.baseURL,
        });

        return {
            success: true,
            data: response.data,
        };

    } catch (error) {

        // If external API returns 400 / 404
        if (error?.response?.status === 400 || error?.response?.status === 404) {
            throw error; // Let Fastify error handler handle it
        }

        // All other errors → return custom error
        throw CustomError.create({
            httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
            message: "Axios Transcation failed.",
            property: "",
            code: "AUTO_PO_GENERATION_FAILED",
        });
    }
}

module.exports = axiosCall;
