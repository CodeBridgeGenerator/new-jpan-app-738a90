
    module.exports = function (app) {
        const modelName = 'stage2';
        const mongooseClient = app.get('mongooseClient');
        const { Schema } = mongooseClient;
        const schema = new Schema(
          {
            nomborrujukan: { type:  String , required: true },
tajuklatihan: { type:  String , required: true },
status: { type:  String , required: true },
calon: { type: Schema.Types.ObjectId, ref: "users" },
pelulus: { type: Schema.Types.ObjectId, ref: "users" },

            
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