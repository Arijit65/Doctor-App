import mongoose from 'mongoose';


const appointmentSchema = new mongoose.Schema({
    user_id: {type:String},
    docId:{type:String,required:true},
    slotDate:{type:String,required:true},
    slotTime:{type:String,required:true},
    userData:{type:Object,required:true},
    docData:{type:Object,required:true},
    amount:{type:Number,required:true},
    cancelled:{type:Boolean,required:false},
    payment:{type:String,required:false},
    inCompleted:{type:Boolean,required:false}
    
})

const appointmentModel = mongoose.models.appointment || mongoose.model('appointment',appointmentSchema);

export default appointmentModel;