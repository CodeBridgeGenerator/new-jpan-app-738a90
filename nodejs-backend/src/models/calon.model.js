
    module.exports = function (app) {
        const modelName = 'calon';
        const mongooseClient = app.get('mongooseClient');
        const { Schema } = mongooseClient;
        const schema = new Schema(
          {
            name: { type: String, required: true, unique: false, lowercase: false, uppercase: false, index: false, trim: false },
tajukLatihan: { type: String, required: false, unique: false, lowercase: false, uppercase: false, minLength: 2, maxLength: 150, index: true, trim: true },
status: { type: String, required: true, unique: false, lowercase: false, uppercase: false, index: false, trim: false },

            
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