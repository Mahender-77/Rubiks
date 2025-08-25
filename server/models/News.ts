import mongoose, { Schema, Document } from "mongoose";

export interface INews extends Document {
  title: string;
  description: string;
  content: string;
  image: string;
  category: "technology" | "sports" | "politics" | "entertainment" | "business" | "health" | "science" | "world" | "other";
  author: {
    name: string;
    email: string;
  };
  publishedDate: Date;
  isActive: boolean;
  views: number;
  tags: string[];
  source: string;
  readingTime: number; // Virtual field
}

const NewsSchema: Schema<INews> = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxLength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxLength: [1000, 'Description cannot exceed 1000 characters']
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      trim: true
    },
    image: {
      type: String,
      required: [true, 'Image URL is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['technology', 'sports', 'politics', 'entertainment', 'business', 'health', 'science', 'world', 'other'],
        message: 'Category must be one of: technology, sports, politics, entertainment, business, health, science, world, other'
      }
    },
    author: {
      name: {
        type: String,
        required: [true, 'Author name is required'],
        trim: true
      },
      email: {
        type: String,
        trim: true,
        lowercase: true
      }
    },
    publishedDate: {
      type: Date,
      default: Date.now
    },
    isActive: {
      type: Boolean,
      default: true
    },
    views: {
      type: Number,
      default: 0
    },
    tags: [{
      type: String,
      trim: true,
      lowercase: true
    }],
    source: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Create indexes for better query performance
NewsSchema.index({ category: 1, publishedDate: -1 });
NewsSchema.index({ isActive: 1, publishedDate: -1 });
NewsSchema.index({ title: 'text', description: 'text' });

// Virtual for calculating reading time (assuming 200 words per minute)
NewsSchema.virtual('readingTime').get(function() {
  const wordsPerMinute = 200;
  const wordCount = this.content.split(' ').length;
  return Math.ceil(wordCount / wordsPerMinute);
});

// Pre-save middleware to update publishedDate if not set
NewsSchema.pre('save', function(next) {
  if (!this.publishedDate) {
    this.publishedDate = new Date();
  }
  next();
});

export default mongoose.model<INews>("News", NewsSchema);