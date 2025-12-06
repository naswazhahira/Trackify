/**
 * Fungsi umum untuk melakukan request ke API backend
 * 
 * 
 * @param {string} endpoint - URL endpoint
 * @param {string} method - Metode HTTP: GET, POST, PUT, DELETE
 * @param {Object} data - Data yang dikirim ke server 
 * @returns {Promise<Object>} - Hasil response dari server
 */
async function callApi(endpoint, method = 'GET', data = null) {
    const baseUrl = 'http://localhost:3000'; 
    const url = baseUrl + endpoint;

    const options = {
        method,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(url, options);
        let result;
        try {
            result = await response.json();
        } catch (err) {
            result = {};
        }

        if (!response.ok) {
            throw new Error(result.error || 'Terjadi kesalahan pada server');
        }

        return result;
    } catch (err) {
        console.error('API call error:', err.message);
        throw err;
    }
}
