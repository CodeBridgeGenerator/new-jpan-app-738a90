
    module.exports = function (app) {
        const modelName = 'kelulusan';
        const mongooseClient = app.get('mongooseClient');
        const { Schema } = mongooseClient;
        const schema = new Schema(
          {
            namaLatihan: { type: Schema.Types.ObjectId, ref: "latihan" },
pelulus: { type: Schema.Types.ObjectId },
status: { type: String, required: true, unique: false, lowercase: false, uppercase: false, index: false, trim: false },
komen: { type: String, required: true, unique: false, lowercase: false, uppercase: false, index: false, trim: false },

            
            createdBy: { type: Schema.Types.ObjectId, ref: "users", required: true },
            updatedBy: { type: Schema.Types.ObjectId, ref: "users", required: true }
          },
          {
            timestamps: true
        });
      
       
        if (mongooseClient.modelNames().includes(modelName)) {
          mongooseClient.deleteModel(modelName);
        }
        return mongooseClient.model(modelName, schema);
        
      };