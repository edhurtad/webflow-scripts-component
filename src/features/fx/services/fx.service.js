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
 * @property {string=} event
 * @property {{
 *   rate: number,
 *   result: number,
 *   updatedAt?: string | null,
 *   quoteMaxInterval?: number | null
 * }=} conversion
 */

/**
 * Error generado por una solicitud FX.
 */
export class FxServiceError extends Error {
  /**
   * @param {string} message
   * @param {number} status
   * @param {unknown} response
   */
  constructor(
    message,
    status,
    response
  ) {
    super(message);

    this.name =
      'FxServiceError';

    this.status =
      status;

    this.response =
      response;
  }
}

export class FxService {
  /**
   * @param {FxServiceConfig} config
   */
  constructor(config) {
    this.webhookUrl =
      config.webhookUrl;
  }

  /**
   * @param {FxConversionRequest} payload
   * @returns {Promise<FxConversionResponse>}
   */
  async requestConversion(
    payload
  ) {
    const response =
      await fetch(
        this.webhookUrl,
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json'
          },
          body:
            JSON.stringify(
              payload
            )
        }
      );

    const responseBody =
      await this.parseResponse(
        response
      );

    if (!response.ok) {
      throw new FxServiceError(
        this.getErrorMessage(
          responseBody
        ),
        response.status,
        responseBody
      );
    }

    return /** @type {FxConversionResponse} */ (
      responseBody
    );
  }

  /**
   * @param {Response} response
   * @returns {Promise<unknown>}
   */
  async parseResponse(response) {
    const contentType =
      response.headers.get(
        'content-type'
      ) || '';

    if (
      contentType.includes(
        'application/json'
      )
    ) {
      return response.json();
    }

    return {
      raw:
        await response.text()
    };
  }

  /**
   * @param {unknown} responseBody
   * @returns {string}
   */
  getErrorMessage(
    responseBody
  ) {
    if (
      !responseBody ||
      typeof responseBody !==
        'object'
    ) {
      return 'FX_REQUEST_FAILED';
    }

    const body =
      /** @type {{
       *   message?: unknown,
       *   error?: unknown
       * }} */ (
        responseBody
      );

    if (
      typeof body.message ===
        'string' &&
      body.message
    ) {
      return body.message;
    }

    if (
      typeof body.error ===
        'string' &&
      body.error
    ) {
      return body.error;
    }

    return 'FX_REQUEST_FAILED';
  }
}