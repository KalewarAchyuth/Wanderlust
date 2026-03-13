const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,

    image: {
        filename: String,
        url: {
            type: String,
            default: "https://images.pexels.com/photos/1632790/pexels-photo-1632790.jpeg"
        }
    },

    price: Number,
    location: String,
    country: String,
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;