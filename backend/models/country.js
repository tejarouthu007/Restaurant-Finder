import mongoose from 'mongoose';

const countrySchema = new mongoose.Schema({
  countryCode: Number,
  country: String,
});

const Country = mongoose.models.Country || mongoose.model('Country', countrySchema);

export default Country;