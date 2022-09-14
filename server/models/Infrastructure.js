const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InfrastructureSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    phone: {
        type: String
    },
    email: {
        type: String
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    images: [
        {
            id: {
                type: String
            },
            name: {
                type: String
            },
            url: {
                type: String
            },
            thumbnail: {
                type: String
            }
        }
    ],
    mapPosition: {
        lat: {
            type: Number,
            required: true
        },
        lng: {
            type: Number,
            required: true
        }
    },
    note: {
        type: String
    },
    createdTime: {
        type: Date,
        default: Date.now
    },
    updatedTime: {
        type: Date,
        default: Date.now
    },
    createdBy: { type: mongoose.Schema.ObjectId, ref: 'users' },
    updatedLastBy: { type: mongoose.Schema.ObjectId, ref: 'users' }
})

module.exports = Infrastructure = mongoose.model('infrastructures', InfrastructureSchema)

