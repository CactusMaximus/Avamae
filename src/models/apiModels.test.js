import {
  BaseResult,
  BaseErrorViewModel,
  BannerViewModel,
  BannerItem,
  SubmitContactUsFormCommand,
  AddressDetails,
  ContactUsSubmitResult,
  createBannerViewModel,
  createContactUsCommand,
  createAddressDetails
} from './apiModels';

describe('BaseResult', () => {
  test('creates instance with default values', () => {
    const result = new BaseResult();
    expect(result.Status).toBe('');
    expect(result.Errors).toEqual([]);
  });

  test('creates instance with provided data', () => {
    const data = { Status: '1', Errors: ['error1'] };
    const result = new BaseResult(data);
    expect(result.Status).toBe('1');
    expect(result.Errors).toEqual(['error1']);
  });

  test('isSuccess returns true for status "1"', () => {
    const result = new BaseResult({ Status: '1' });
    expect(result.isSuccess()).toBe(true);
  });

  test('isSuccess returns false for other statuses', () => {
    const result = new BaseResult({ Status: '0' });
    expect(result.isSuccess()).toBe(false);
  });

  test('hasErrors returns true when errors exist', () => {
    const result = new BaseResult({ Errors: ['error1'] });
    expect(result.hasErrors()).toBe(true);
  });

  test('hasErrors returns false when no errors', () => {
    const result = new BaseResult({ Errors: [] });
    expect(result.hasErrors()).toBe(false);
  });
});

describe('BaseErrorViewModel', () => {
  test('creates instance with default values', () => {
    const error = new BaseErrorViewModel();
    expect(error.FieldName).toBe('');
    expect(error.MessageCode).toBe('');
  });

  test('creates instance with provided data', () => {
    const data = { FieldName: 'Email', MessageCode: 'INVALID_EMAIL' };
    const error = new BaseErrorViewModel(data);
    expect(error.FieldName).toBe('Email');
    expect(error.MessageCode).toBe('INVALID_EMAIL');
  });

  test('getUserMessage returns mapped message for known code', () => {
    const error = new BaseErrorViewModel({ MessageCode: 'REQUIRED_FIELD' });
    expect(error.getUserMessage()).toBe('This field is required');
  });

  test('getUserMessage returns code for unknown code', () => {
    const error = new BaseErrorViewModel({ MessageCode: 'UNKNOWN_CODE' });
    expect(error.getUserMessage()).toBe('UNKNOWN_CODE');
  });

  test('getUserMessage returns fallback for empty code', () => {
    const error = new BaseErrorViewModel({ MessageCode: '' });
    expect(error.getUserMessage()).toBe('Validation error');
  });
});

describe('BannerViewModel', () => {
  test('extends BaseResult', () => {
    const banner = new BannerViewModel();
    expect(banner).toBeInstanceOf(BaseResult);
  });

  test('creates BannerItem instances for Details', () => {
    const data = {
      Details: [
        { Title: 'Title 1', Subtitle: 'Subtitle 1', ImageUrl: 'image1.jpg' },
        { Title: 'Title 2', Subtitle: 'Subtitle 2', ImageUrl: 'image2.jpg' }
      ]
    };
    const banner = new BannerViewModel(data);
    expect(banner.Details).toHaveLength(2);
    expect(banner.Details[0]).toBeInstanceOf(BannerItem);
    expect(banner.Details[1]).toBeInstanceOf(BannerItem);
  });
});

describe('BannerItem', () => {
  test('creates instance with default values', () => {
    const item = new BannerItem();
    expect(item.Title).toBe('');
    expect(item.Subtitle).toBe('');
    expect(item.ImageUrl).toBe('');
  });

  test('creates instance with provided data', () => {
    const data = { Title: 'Test Title', Subtitle: 'Test Subtitle', ImageUrl: 'test.jpg' };
    const item = new BannerItem(data);
    expect(item.Title).toBe('Test Title');
    expect(item.Subtitle).toBe('Test Subtitle');
    expect(item.ImageUrl).toBe('test.jpg');
  });

  test('hasValidData returns true for complete data', () => {
    const item = new BannerItem({
      Title: 'Title',
      Subtitle: 'Subtitle',
      ImageUrl: 'image.jpg'
    });
    expect(item.hasValidData()).toBe(true);
  });

  test('hasValidData returns false for incomplete data', () => {
    const item = new BannerItem({ Title: 'Title' });
    expect(item.hasValidData()).toBe(false);
  });
});

describe('SubmitContactUsFormCommand', () => {
  test('creates instance with default values', () => {
    const command = new SubmitContactUsFormCommand();
    expect(command.FullName).toBe('');
    expect(command.EmailAddress).toBe('');
    expect(command.PhoneNumbers).toEqual([]);
    expect(command.Message).toBe('');
    expect(command.bIncludeAddressDetails).toBe(false);
    expect(command.AddressDetails).toBeNull();
  });

  test('creates instance with provided data', () => {
    const data = {
      FullName: 'John Doe',
      EmailAddress: 'john@example.com',
      PhoneNumbers: ['1234567890'],
      Message: 'Hello',
      bIncludeAddressDetails: true,
      AddressDetails: { AddressLine1: '123 Main St' }
    };
    const command = new SubmitContactUsFormCommand(data);
    expect(command.FullName).toBe('John Doe');
    expect(command.EmailAddress).toBe('john@example.com');
    expect(command.PhoneNumbers).toEqual(['1234567890']);
    expect(command.Message).toBe('Hello');
    expect(command.bIncludeAddressDetails).toBe(true);
    expect(command.AddressDetails).toBeInstanceOf(AddressDetails);
  });

  test('toJSON returns correct payload structure', () => {
    const command = new SubmitContactUsFormCommand({
      FullName: 'John Doe',
      EmailAddress: 'john@example.com',
      PhoneNumbers: ['1234567890', ''],
      Message: 'Hello',
      bIncludeAddressDetails: false
    });
    
    const payload = command.toJSON();
    expect(payload.FullName).toBe('John Doe');
    expect(payload.EmailAddress).toBe('john@example.com');
    expect(payload.PhoneNumbers).toEqual(['1234567890']); // Empty phone filtered out
    expect(payload.Message).toBe('Hello');
    expect(payload.bIncludeAddressDetails).toBe(false);
    expect(payload.AddressDetails).toBeUndefined();
  });

  test('toJSON includes AddressDetails when enabled', () => {
    const command = new SubmitContactUsFormCommand({
      bIncludeAddressDetails: true,
      AddressDetails: { AddressLine1: '123 Main St' }
    });
    
    const payload = command.toJSON();
    expect(payload.AddressDetails).toBeDefined();
    expect(payload.AddressDetails.AddressLine1).toBe('123 Main St');
  });

  test('validate returns errors for required fields', () => {
    const command = new SubmitContactUsFormCommand();
    const errors = command.validate();
    
    expect(errors).toHaveLength(3); // FullName, EmailAddress, Message
    expect(errors[0].FieldName).toBe('FullName');
    expect(errors[0].MessageCode).toBe('REQUIRED_FIELD');
  });

  test('validate passes for complete data', () => {
    const command = new SubmitContactUsFormCommand({
      FullName: 'John Doe',
      EmailAddress: 'john@example.com',
      Message: 'Hello'
    });
    
    const errors = command.validate();
    expect(errors).toHaveLength(0);
  });

  test('validate checks email format', () => {
    const command = new SubmitContactUsFormCommand({
      FullName: 'John Doe',
      EmailAddress: 'invalid-email',
      Message: 'Hello'
    });
    
    const errors = command.validate();
    expect(errors).toHaveLength(1);
    expect(errors[0].FieldName).toBe('EmailAddress');
    expect(errors[0].MessageCode).toBe('INVALID_EMAIL');
  });

  test('validate checks message length', () => {
    const longMessage = 'a'.repeat(1001);
    const command = new SubmitContactUsFormCommand({
      FullName: 'John Doe',
      EmailAddress: 'john@example.com',
      Message: longMessage
    });
    
    const errors = command.validate();
    expect(errors).toHaveLength(1);
    expect(errors[0].FieldName).toBe('Message');
    expect(errors[0].MessageCode).toBe('MESSAGE_TOO_LONG');
  });
});

describe('AddressDetails', () => {
  test('creates instance with default values', () => {
    const address = new AddressDetails();
    expect(address.AddressLine1).toBe('');
    expect(address.AddressLine2).toBe('');
    expect(address.CityTown).toBe('');
    expect(address.StateCounty).toBe('');
    expect(address.Postcode).toBe('');
    expect(address.Country).toBe('');
  });

  test('creates instance with provided data', () => {
    const data = {
      AddressLine1: '123 Main St',
      CityTown: 'New York',
      Postcode: '10001'
    };
    const address = new AddressDetails(data);
    expect(address.AddressLine1).toBe('123 Main St');
    expect(address.CityTown).toBe('New York');
    expect(address.Postcode).toBe('10001');
  });

  test('toJSON returns correct structure', () => {
    const address = new AddressDetails({
      AddressLine1: '123 Main St',
      AddressLine2: 'Apt 4B',
      CityTown: 'New York',
      StateCounty: 'NY',
      Postcode: '10001',
      Country: 'USA'
    });
    
    const json = address.toJSON();
    expect(json).toEqual({
      AddressLine1: '123 Main St',
      AddressLine2: 'Apt 4B',
      CityTown: 'New York',
      StateCounty: 'NY',
      Postcode: '10001',
      Country: 'USA'
    });
  });

  test('validate returns errors for required fields', () => {
    const address = new AddressDetails();
    const errors = address.validate();
    
    expect(errors).toHaveLength(5); // AddressLine1, CityTown, StateCounty, Country, Postcode
    expect(errors.some(e => e.FieldName === 'AddressLine1')).toBe(true);
    expect(errors.some(e => e.FieldName === 'CityTown')).toBe(true);
    expect(errors.some(e => e.FieldName === 'StateCounty')).toBe(true);
    expect(errors.some(e => e.FieldName === 'Country')).toBe(true);
    expect(errors.some(e => e.FieldName === 'Postcode')).toBe(true);
  });

  test('validate passes for complete required data', () => {
    const address = new AddressDetails({
      AddressLine1: '123 Main St',
      CityTown: 'New York',
      StateCounty: 'NY',
      Country: 'USA',
      Postcode: '10001'
    });
    
    const errors = address.validate();
    expect(errors).toHaveLength(0);
  });
});

describe('Utility Functions', () => {
  test('createBannerViewModel creates BannerViewModel instance', () => {
    const data = { Status: '1', Details: [] };
    const banner = createBannerViewModel(data);
    expect(banner).toBeInstanceOf(BannerViewModel);
  });

  test('createContactUsCommand creates SubmitContactUsFormCommand instance', () => {
    const data = { FullName: 'John Doe' };
    const command = createContactUsCommand(data);
    expect(command).toBeInstanceOf(SubmitContactUsFormCommand);
  });

  test('createAddressDetails creates AddressDetails instance', () => {
    const data = { AddressLine1: '123 Main St' };
    const address = createAddressDetails(data);
    expect(address).toBeInstanceOf(AddressDetails);
  });
}); 