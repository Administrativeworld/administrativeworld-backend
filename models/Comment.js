import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    text: { 
        type: String,
        required: true 
    },  
    author: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    }, 
    postId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Post', 
        default: null 
    }, 
    videoId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Video', 
        default: null 
    }, 
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }
});


commentSchema.pre('save', function (next) {
    if (!this.postId && !this.videoId) {
        return next(new Error('Comment must be associated with either a post or a video.'));
    }
    next();
});

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;
