'use strict';

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: {type: String, required: [true, 'First name is required']},
    
    lastName: {type: String,  required: [true, 'Last name is required']},
   
    emailAddress: {type: String, required: [true, 'Email address is required'],unique: [true, 'Unique email address is required']},
    
    password: {type: String,required: [true, 'Password is required']}
});

const User = mongoose.model('User', UserSchema);

const CourseSchema = new Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref:"User"},
    
    title: {type: String, required: [true, 'Course title is required']},
    
    description: {type: String, required: [true, 'Course description is required']},
    
    estimatedTime: String,
    
    materialsNeeded: String
});

const Course = mongoose.model('Course', CourseSchema);

module.exports = {User, Course};