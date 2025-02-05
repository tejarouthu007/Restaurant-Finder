import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const restaurantSchema = new mongoose.Schema({
  "Restaurant ID": { type: Number, required: true },
  "Restaurant Name": { type: String, required: true },
  "Country Code": { type: Number, required: true },
  "City": { type: String, required: true },
  "Address": { type: String, required: true },
  "Locality": { type: String, required: true },
  "Longitude": { type: Number, required: true },
  "Latitude": { type: Number, required: true },
  "Cuisines": { type: String, required: true },
  "Average Cost for two": { type: Number, required: true },
  "Currency": { type: String, required: true },
  "Has Table booking": { type: String, required: true },
  "Has Online delivery": { type: String, required: true },
  "Is delivering now": { type: String, required: true },
  "Switch to order menu": { type: String, required: true },
  "Price range": { type: Number, required: true },
  "Aggregate rating": { type: Number, required: true },
  "Rating color": { type: String, required: true },
  "Rating text": { type: String, required: true },
  "Votes": { type: Number, required: true }
});

restaurantSchema.plugin(mongoosePaginate);

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

export default Restaurant;
