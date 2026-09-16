/**
 * @typedef {Object} FxServiceConfig
 * @property {string} webhookUrl
 */

/**
 * @typedef {Object} FxConversionRequest
 * @property {string} event
 * @property {string} messageId
 * @property {string} timestamp
 * @property {string} source
 * @property {string} phone
 * @property {string} phoneInternational
 * @property {boolean} dataConsent
 * @property {{
 *   amount: number,
 *   currencyFrom: 'COP' | 'USD',
 *   currencyTo: 'COP' | 'USD',
 *   interests: string[]
 * }} conversion
 */

/**
 * @typedef {Object} FxConversionResponse
 * @property {boolean} ok
 * @property {string} event
 * @property {string} messageId
 * @property {{
 *   amount: number,
 *   currencyFrom: 'COP' | 'USD',
 *   currencyTo: 'COP' | 'USD',
 *   action: 'Buy' | 'Sell',
 *   rate: number,
 *   result: number,
 *   updatedAt: string | null,
 *   quoteMaxInterval: number | null
 * }} conversion
 */

export class FxService {
  /**
   * @param {FxServiceConfig} config
   */
  constructor(config) {
    this.webhookUrl = config.webhookUrl;
  }

  /**
   * @param {FxConversionRequest} payload
   * @returns {Promise<FxConversionResponse>}
   */
  async requestConversion(payload) {
    const response = await fetch(
      this.webhookUrl,
      {
        method: 'POST',

        headers: {
          'Content-Type':
            'application/json'
        },

        body:
          JSON.stringify(payload)
      }
    );

    const contentType =
      response.headers.get(
        'content-type'
      ) || '';

    const responseBody =
      contentType.includes(
        'application/json'
      )
        ? await response.json()
        : {
            raw:
              await response.text()
          };

    if (!response.ok) {
      const error =
        new Error(
          responseBody?.message ||
          responseBody?.error ||
          'FX_REQUEST_FAILED'
        );

      error.status =
        response.status;

      error.response =
        responseBody;

      throw error;
    }

    return responseBody;
  }
}