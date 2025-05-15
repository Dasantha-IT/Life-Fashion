import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const deliverySchema = new Schema({
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    street:{
        type:String,
        required:true,
    },
    city:{
        type:String,
        required:true,
    },
    state:{
        type:String,
        required:true,
    },
    zipcode:{
        type:Number,
        required:true,
    },
    country:{
        type:String,
        required:true,
    }, 
    phone:{
        type:Number,
        required:true,
    }

});

// module.exports =mongoose.model(
//     "DeliveryModel",
//     deliverySchema
// )

const Delivery = mongoose.models.Delivery || mongoose.model('Delivery', deliverySchema);
export default Delivery;