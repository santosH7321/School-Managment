import mongoose, {Document,Model,Schema} from "mongoose";
import bcrypt from "bcryptjs";

const emailRegexPattern: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    avatar:{
        public_id: string;
        url: string;
    },
    role: string;
    isVerified: boolean;
    courses: Array<{courseId: string}>;
    comparePasswords: (passwords: string) => Promise<boolean>;
};


const userSchema: Schema<IUser> = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Please enter your email"],
    },
    email:{
        type: String,
        required: [true, "Please enter your email"],
        validate: {
            validator: function (value:string) {
                return emailRegexPattern.test(value);
            },
            message: "Please enter a valid email address",
        },
        unique: true,
    },
    password:{
        type: String,
        required: [true, "Please enter a password"],
        minlength: [6, "Password must be at least 6 characters"],
        select: false,
    },
    avatar: {
        public_id: String,
        url: String  
    },
    role: {
        type: String,
        default: 'user',
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    courses: [{
        courseId: String,
    }],

}, {timestamps: true});

// hash password before saving

userSchema.pre<IUser>("save", async function(next: Function) {
    if (!this.isModified("password")) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// compare password

userSchema.methods.comparePasswords = async function(enterpasswords: string): Promise<boolean> {
    return await bcrypt.compare(enterpasswords, this.password);
};

const userModel: Model<IUser> = mongoose.model("User", userSchema);
export default userModel;