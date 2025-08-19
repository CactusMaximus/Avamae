// API Models based on FrontendAssessment API Schema

// Error message mappings
const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  MESSAGE_TOO_LONG: 'Message must be 1000 characters or less',
  INVALID_PHONE: 'Please enter a valid phone number'
};

// Base Models
export class BaseResult {
  constructor(data = {}) {
    this.Status = data.Status || '';
    this.Errors = data.Errors || [];
  }

  isSuccess() {
    return this.Status === "1";
  }

  hasErrors() {
    return this.Errors && this.Errors.length > 0;
  }
}

export class BaseErrorViewModel {
  constructor(data = {}) {
    this.FieldName = data.FieldName || '';
    this.MessageCode = data.MessageCode || '';
  }

  getUserMessage() {
    return ERROR_MESSAGES[this.MessageCode] || this.MessageCode || 'Validation error';
  }
}

// Home Page Models
export class BannerViewModel extends BaseResult {
  constructor(data = {}) {
    super(data);
    this.Details = (data.Details || []).map(item => new BannerItem(item));
  }
}

export class BannerItem {
  constructor(data = {}) {
    this.Title = data.Title || '';
    this.Subtitle = data.Subtitle || '';
    this.ImageUrl = data.ImageUrl || '';
  }

  hasValidData() {
    return this.Title && this.Subtitle && this.ImageUrl;
  }
}

// Contact Us Models
export class SubmitContactUsFormCommand {
  constructor(data = {}) {
    this.FullName = data.FullName || '';
    this.EmailAddress = data.EmailAddress || '';
    this.PhoneNumbers = data.PhoneNumbers || [];
    this.Message = data.Message || '';
    this.bIncludeAddressDetails = data.bIncludeAddressDetails || false;
    this.AddressDetails = data.AddressDetails ? new AddressDetails(data.AddressDetails) : null;
  }

  toJSON() {
    const payload = {
      FullName: this.FullName,
      EmailAddress: this.EmailAddress,
      PhoneNumbers: this.PhoneNumbers.filter(phone => phone.trim()),
      Message: this.Message,
      bIncludeAddressDetails: this.bIncludeAddressDetails
    };

    if (this.bIncludeAddressDetails && this.AddressDetails) {
      payload.AddressDetails = this.AddressDetails.toJSON();
    }

    return payload;
  }

  validate() {
    const errors = [];

    if (!this.FullName.trim()) {
      errors.push(new BaseErrorViewModel({
        FieldName: 'FullName',
        MessageCode: 'REQUIRED_FIELD'
      }));
    }

    if (!this.EmailAddress.trim()) {
      errors.push(new BaseErrorViewModel({
        FieldName: 'EmailAddress',
        MessageCode: 'REQUIRED_FIELD'
      }));
    } else if (!/\S+@\S+\.\S+/.test(this.EmailAddress)) {
      errors.push(new BaseErrorViewModel({
        FieldName: 'EmailAddress',
        MessageCode: 'INVALID_EMAIL'
      }));
    }

    if (!this.Message.trim()) {
      errors.push(new BaseErrorViewModel({
        FieldName: 'Message',
        MessageCode: 'REQUIRED_FIELD'
      }));
    } else if (this.Message.trim().length > 1000) {
      errors.push(new BaseErrorViewModel({
        FieldName: 'Message',
        MessageCode: 'MESSAGE_TOO_LONG'
      }));
    }

    if (this.bIncludeAddressDetails && this.AddressDetails) {
      const addressErrors = this.AddressDetails.validate();
      errors.push(...addressErrors);
    }

    return errors;
  }
}

export class AddressDetails {
  constructor(data = {}) {
    this.AddressLine1 = data.AddressLine1 || '';
    this.AddressLine2 = data.AddressLine2 || '';
    this.CityTown = data.CityTown || '';
    this.StateCounty = data.StateCounty || '';
    this.Postcode = data.Postcode || '';
    this.Country = data.Country || '';
  }

  toJSON() {
    return {
      AddressLine1: this.AddressLine1,
      AddressLine2: this.AddressLine2,
      CityTown: this.CityTown,
      StateCounty: this.StateCounty,
      Postcode: this.Postcode,
      Country: this.Country
    };
  }

  validate() {
    const errors = [];

    if (!this.AddressLine1.trim()) {
      errors.push(new BaseErrorViewModel({
        FieldName: 'AddressLine1',
        MessageCode: 'REQUIRED_FIELD'
      }));
    }

    if (!this.CityTown.trim()) {
      errors.push(new BaseErrorViewModel({
        FieldName: 'CityTown',
        MessageCode: 'REQUIRED_FIELD'
      }));
    }

    if (!this.StateCounty.trim()) {
      errors.push(new BaseErrorViewModel({
        FieldName: 'StateCounty',
        MessageCode: 'REQUIRED_FIELD'
      }));
    }

    if (!this.Country.trim()) {
      errors.push(new BaseErrorViewModel({
        FieldName: 'Country',
        MessageCode: 'REQUIRED_FIELD'
      }));
    }

    if (!this.Postcode.trim()) {
      errors.push(new BaseErrorViewModel({
        FieldName: 'Postcode',
        MessageCode: 'REQUIRED_FIELD'
      }));
    }

    return errors;
  }
}

// API Response Models
export class ContactUsSubmitResult extends BaseResult {
  constructor(data = {}) {
    super(data);
    // Add any specific fields for contact form submission response
  }
}

// Utility functions
export const createBannerViewModel = (apiData) => {
  return new BannerViewModel(apiData);
};

export const createContactUsCommand = (formData) => {
  return new SubmitContactUsFormCommand(formData);
};

export const createAddressDetails = (addressData) => {
  return new AddressDetails(addressData);
}; 