import {Schema, model} from 'mongoose'; 

const sessionSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    ipAddress: {
        type: String,
        required: true,
    },
    userAgent: {
        type: String,
        required: true,
    },
    valid: {
        type: Boolean,
        default: true,
    },


}, {timestamps : true});
const sessionModel = model('Session', sessionSchema);
export default sessionModel;