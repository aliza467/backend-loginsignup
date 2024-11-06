import 'dotenv/config'
import express from "express";
import mongoose from "mongoose";
import userModel from "./userSchema.js";
import bcrypt from "bcrypt";
import cors from "cors";

import jwt from "jsonwebtoken"; 
import userVerifyMiddle from "./middlewear/userVerify.js";

const app = express();
const PORT = process.env.PORT || 5055;
const DBURI = process.env.MONGODB_URI;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// MongoDB Connection URI
mongoose.connect(DBURI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB Error", err));

// Signup API
app.post("/api/signup", async (request, response) => {
  console.log("Signup request received");
  const { firstName, lastName, email, password } = request.body;

  if (!firstName || !lastName || !email || !password) {
    return response.status(400).json({ message: "Required fields empty", status: false });
  }

  const emailexist = await userModel.findOne({ email });

  if (emailexist) {
    return response.status(400).json({ message: "Email already exists", status: false });
  }

  const hashpassword = await bcrypt.hash(password, 10);
  const userObj = {
    firstName,
    lastName,
    email,
    password: hashpassword
  };

  const createuser = await userModel.create(userObj);

  return response.statusCode(301).json({
    message: "User created successfully",
    data: createuser,
    status: true
  });
});

// Login API
app.post("/api/login", async (request, response) => {
  const { email, password } = request.body;

  if (!email || !password) {
    return response.status(400).json({ message: "Required fields empty", status: false });
  }

  const emailexist = await userModel.findOne({ email });

  if (!emailexist) {
    return response.status(401).json({ message: "Invalid Email or Password", status: false });
  }

  const comparepass = await bcrypt.compare(password, emailexist.password);

  if (!comparepass) {
    return response.status(401).json({ message: "Invalid Email or Password", status: false });
  }

  var token = jwt.sign({ email: emailexist.email, firstName: emailexist.firstName }, process.env.JWT_SECRET_KEY);

  return response.json({ 
    message: "Login Successful",
    status: true,
    token
  });
});

// Get All Users API (Protected)
app.get('/api/getusers', userVerifyMiddle, async (req, res) => {
  try {
    const users = await userModel.find({});
    res.json({
      message: "All users retrieved successfully",
      status: true,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving users",
      status: false
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`SERVER RUNNING on http://localhost:${PORT}`);
});

// ALL PRODUCTS API

// app.get("/products", (request, response) => {
//   response.send(data);    
// });

// SINGLE PRODUCT API

// app.get("/products/:id", (request, response) => {
//    const singledata=request.params.id
//    const filterData=data.filter((e,i)=>e.id==singledata)
//     response.send(filterData);    
//   });

  //All in one api using query

  // app.get("/products", (request, response) => {

  //   console.log(request.query.id)
  //   if(request.query.id){
  //       const filterData=data.filter((e,i)=>e.id==request.query.id)
  //       response.send(filterData); 
  //       return;

  //   }
  //   response.send(data);    
  // });





//   app.get("/users", (request, response) => {
//   response.send({  
//     name: "faraz",
//     email: "faraz@gmail.com",
//     phone: "031464464351",  
//   });  
// });   


// app.get("/foods", (request, response) => {  
//   response.send("foods data");  
// });


// app.get("/client", (request, response) => {
//   response.send("client data");
// });


// app.get("/", (request, response) => {
//   response.send("server running on /");
// });

// create Server using express


//API METHODS
// CURD 
// Create ---> post
// Read --> get
// update ---> put
// Delete --> delete

// app.get('/getpost',async(request,response)=>{

//   const getData=await postModal.find({_id:"671d013983487e2750f00783"});// empty {} par sara data aayega 

//   response.json({
//     message:"post data get successfully",
//     data:getData
//   })


//   response.send('get post')
// })

// app.post('/createpost',async(request,response)=>{
//  const {title,desc,postId}=request.body

//  if(!title || !desc || !postId){
//   response.json({
//     message:"required fields are missing"
//   })

//   return;
//  }

//  //Data save in db

//  const postObj={
//   title,
//   desc,
//   postId,
//  }

//  const resp= await postModal.create(postObj)

//  response.json({
//   message:"post create successfully",
//   data:resp,
//  })

//  response.send("create post")


// })

// app.put('/updatepost',async(request,response)=>{
//   const {title,desc,postId}=request.body
//   console.log(title,desc,postId)

//   const updatePost= await postModal.findByIdAndUpdate(postId,{title,desc})

//   response.json({
//     message:"post has been updated",
//     data:updatePost
//   })
// })

// app.delete('/deletepost/:id',async(request,response)=>{
//   const params= request.params.id

//   await postModal.findByIdAndDelete(params)

//   response.json({
//     messge:"post has been deleted",
   
//   })
//   response.send('delete post')
// })