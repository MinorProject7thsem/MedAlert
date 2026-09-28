import mongoose from "mongoose";
const { Schema } = mongoose;

const ingredientSchema = new Schema({
  name: { type: String, required: true },
  rationale: { type: String }, // why it's useful/harmful
  quantityLimit: { type: String },
}, { _id: false });

const analysisReportSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },

  ocrResult: {
    productName: String,
    description: String,
    ingredients: [String],
    confidence: Number,
    descriptionInferred: Boolean,
    productNameInferred: Boolean,
    sources: [String],
  },

  userNotes: { type: String },

  usefulIngredients: [ingredientSchema],
  harmfulIngredients: [ingredientSchema],
  consumptionGuidelines: { type: String },
  foodSuggestions: { type: String },
  summary: { type: String, required: false },

//   model: { type: String, default: "gemini-pro" },
  usedWebSearch: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model("AnalysisReport", analysisReportSchema);
