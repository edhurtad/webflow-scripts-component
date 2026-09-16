export class FxConverterViewModel {
  constructor() {
    this.amount = 0;
    this.currencyFrom = 'COP';
    this.currencyTo = 'USD';
    this.interests = [];

    this.phone = '';
    this.consent = false;
    this.identified = false;

    this.rate = null;
    this.result = null;

    this.updatedAt = null;
    this.quoteMaxInterval = null;
  }

  /**
   * @param {'COP' | 'USD'} currencyFrom
   * @param {'COP' | 'USD'} currencyTo
   */
  setCurrencies(currencyFrom, currencyTo) {
    this.currencyFrom = currencyFrom;
    this.currencyTo = currencyTo;
  }

  /**
   * @param {number} amount
   */
  setAmount(amount) {
    this.amount = amount;
  }

  /**
   * @param {string[]} interests
   */
  setInterests(interests) {
    this.interests = interests;
  }

  /**
   * @param {string} phone
   * @param {boolean} consent
   */
  setIdentity(phone, consent) {
    this.phone = phone;
    this.consent = consent;
  }

  lockIdentity() {
    this.identified = true;
  }

  /**
   * @param {{
   *   rate: number,
   *   result: number,
   *   updatedAt?: string | null,
   *   quoteMaxInterval?: number | null
   * }} conversion
   */
  setConversionResult(conversion) {
    this.rate = conversion.rate;
    this.result = conversion.result;
    this.updatedAt = conversion.updatedAt ?? null;
    this.quoteMaxInterval =
      conversion.quoteMaxInterval ?? null;
  }

  clearConversionResult() {
    this.rate = null;
    this.result = null;
    this.updatedAt = null;
    this.quoteMaxInterval = null;
  }
}