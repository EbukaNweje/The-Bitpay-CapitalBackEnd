const User = require("../models/User")
const bcrypt = require("bcrypt");
const createError = require("../utilities/error");
const jwt = require("jsonwebtoken")
const {validationResult } = require('express-validator');
const otpGenerator = require('otp-generator');
const transporter = require("../utilities/email")


exports.register = async (req, res, next)=>{
    try{
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()});
      }

      const { email } = req.body;
      User.findOne({ email }, async (err, user) => {
        // console.log(user)
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        if (user) { 
            return next(createError(400, "email already in use"))
        } 
        else if(!user){
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
         const newUser = new User({
            password:hash,
            email: req.body.email,
            fullName:req.body.fullName,
            phoneNumber: req.body.phoneNumber,
            gender: req.body.gender,
            country: req.body.country,
            address: req.body.address,
         })
         const token = jwt.sign({id:newUser._id, isAdmin:newUser.isAdmin}, process.env.JWT, {expiresIn: "15m"})
         newUser.token = token

         const otpCode = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });
         newUser.withdrawCode = otpCode

         await newUser.save()
         
         res.status(201).json({
            message: "User has been created.",
            data: newUser
        })
        }
      })
      
    }catch(err){
        next(err)
    }
}

exports.tradingSession = async (req, res, next) => {
  try{
    const id = req.params.id;
    const userInfo = await User.findById(id);
    console.log(userInfo)
      // const sessionEmail = User.findOne(({ email: req.body.email }))
      if(userInfo.accountBalance > 0){
        let newDay = userInfo.newDay
        const setter = setInterval(() => {
          newDay--;
           userInfo.newDay = newDay;
           userInfo.save();
           console.log(userInfo.newDay);
        },8.64e+7)

        if(userInfo.newDay <= 0){
          clearInterval(setter);
        }else{
          setter
        }
      }
      res.status(201).json({
        message: "checking.",
        data: userInfo,
    })


//       if(sessionEmail.accountBalance > 0){
//         // Set the target date to day 0
//       const targetDate = new Date('2023-11-01 00:00:00').getTime();
//        currentDate = new Date().getTime();
//       const timeDifference = targetDate - currentDate;
  
// //     if (timeDifference <= 0) {
// //         // When the countdown reaches day 0
// //         return 'Countdown: Day 0';
// //     } else {
// //         // Calculate days
// //         const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
// //         return {Countdown: Day ` ${days}`};
// // }
//  }


  }catch(err){
    next(err)
}
}

exports.resendotp = async (req,res,next) => {
  try{
    const otpCode = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });
    const userId = req.params.id

    const NewOtp = await User.findById(userId)
    NewOtp.otp = otpCode
    NewOtp.save()

    const mailOptions ={
      from: process.env.USER,
      to: NewOtp.email, 
      subject: "Verification Code",
    html: `
     <h4 style="font-size:25px;">Hi ${NewOtp.userName} !</h4> 

     <Span>Use the following one-time password (OTP) to sign in to your OKX EXCHANGE TRADE PLATFORM account. <br>
     This OTP will be valid for 15 minutes</span>

     <h1 style="font-size:30px; color: blue;"><b>${NewOtp.otp}</b></h1>

     <p>If you didn't initiate this action or if you think you received this email by mistake, please contact <br>
      okxexchangetrade@gmail.com
     </p>

     <p>Regards, <br>
     OKX EXCHANGE<br>
     okxexchange.org</p>
      `,
  }

  transporter.sendMail(mailOptions,(err, info)=>{
    if(err){
        console.log("erro",err.message);
    }else{
        console.log("Email has been sent to your inbox", info.response);
    }
})
    res.status(200).json({
        status: 'success',
        message: 'Your Verification Code has been sent to your email',
      })

  }catch(err){
    next(err)
  }
}
 
exports.verifySuccessful = async (req, res, next) => {
    try{
      const userid = req.params.id
      console.log(userid)

      const verifyuser = await User.findById({_id:userid})

      if(verifyuser.otp !== req.body.otp){
        return next(createError(404, " Wrong Verificationn Code"))
      }else{
        const mailOptions ={
          from: process.env.USER,
          to: verifyuser.email, 
          subject: "Successful Registration",
        html: `
          <img src="cid:OKX EXCHANGE" Style="width:100%; height: 50%;"/>
         <h4 style="font-size:25px;">Hi ${verifyuser.userName}!</h4> 

         <p>Welcome to OKX EXCHANGE TRADE PLATFORM, your Number 1 online trading platform.</p>

         <p> Your Trading account has been set up successfully with login details: <br>

         Email:  ${verifyuser.email} <br>
         Password: The password you registered with. <br><br>

         You can go ahead and fund your Trade account to start up your Trade immediately. Deposit through Bitcoin.<br> <br>

         For more enquiry kindly contact your account manager or write directly with our live chat support on our platform  <br> or you can send a direct mail to us at okxexchangetrade@gmail.com. <br> <br>

         Thank You for choosing our platform and we wish you a successful trading. <br>

         OKX EXCHANGETRADE TEAM (C)</p>
          `,
          attachments: [{
            filename: 'OKX EXCHANGE.jpg',
            path: __dirname+'/OKX EXCHANGE.jpg',
            cid: 'OKX EXCHANGE' //same cid value as in the html img src
        }]
      }

           const mailOptionsme ={
            from: process.env.USER,
            to: process.env.USER, 
            subject: "Successful Registration",
          html: `
           <p>
              ${verifyuser.userName} <br>
              ${verifyuser.email}  <br>
                Just signed up now on your Platfrom 
           </p>
            `,
        }

      transporter.sendMail(mailOptions,(err, info)=>{
        if(err){
            console.log("erro",err.message);
        }else{
            console.log("Email has been sent to your inbox", info.response);
        }
    })

          transporter.sendMail(mailOptionsme,(err, info)=>{
            if(err){
                console.log("erro",err.message);
            }else{
                console.log("Email has been sent to your inbox", info.response);
            }
        })

    res.status(201).json({
      message: "verify Successful.",
      data: verifyuser
  })
  }

    }catch(err){
      next(err)
    }
}




exports.login = async (req, res, next)=>{
    try{
        const Users = await User.findOne({email: req.body.email})
        if(!Users) return next(createError(404, "User not found!"))

        const isPasswordCorrect = await bcrypt.compare(req.body.password, Users.password)
        if(!isPasswordCorrect) return next(createError(400, "Wrong password or username"))

        const token1 = jwt.sign({id:Users._id, isAdmin:Users.isAdmin}, process.env.JWT, {expiresIn: "1d"})
        Users.token = token1
        await Users.save()

        const {token, password, isAdmin, ...otherDetails} = Users._doc

        //  res.cookie("access_token", token, {
        //     httpOnly: true, 
        //  }).
{/* <h4>Dear ${Users.userName}</h4>
           <p>Welcome back!</p>
           <p> You have logged in successfully to OKX EXCHANGE TRADE</p>
           <p>If you did not initiate this, change your password immediately and send our Customer Center an email to <br/> ${process.env.USER}
           </p>
           <p>Why send this email? We take security very seriously and we want to keep you in the loop of activities on your account.</p> */}
         res.status(200).json({...otherDetails})
    }catch(err){
        next(err)
    }
}

exports.restLink = async (req, res, next) => {
    try{
      const id = req.params.id
      const token = req.params.token
     
    jwt.verify(token, process.env.JWT, async (err) => {
      if (err) {
        return next(createError(403, "Token not valid"));
      }
    });
    const userpaassword = await User.findById(id)
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt)
    userpaassword.password = hash
    userpaassword.save()
    res.status(200).json({
        status: 'success',
        message: 'you have successfuly change your password',
      })
  
    }catch(err){next(err)}
  }


exports.signupEmailSand = async (req, res, next) =>{
  try{
    const email = req.body.email
    
    const UserEmail = await User.findOne({email})
    const mailOptions ={
      from: process.env.USER,
      to: UserEmail.email,
      subject: "Successful Sign Up!",
    html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
  <meta charset="utf-8"> <!-- utf-8 works for most cases -->
  <meta name="viewport" content="width=device-width"> <!-- Forcing initial-scale shouldn't be necessary -->
  <meta http-equiv="X-UA-Compatible" content="IE=edge"> <!-- Use the latest (edge) version of IE rendering engine -->
  <meta name="x-apple-disable-message-reformatting">  <!-- Disable auto-scale in iOS 10 Mail entirely -->
  <title></title> <!-- The title tag shows in email notifications, like Android 4.4. -->
  <link href="https://fonts.googleapis.com/css?family=Lato:300,400,700" rel="stylesheet">
  </head>
  <body style="margin: 0; padding: 0 !important; mso-line-height-rule: exactly; background-color: #f1f1f1;">
  <center style="width: 100%; background-color: #f1f1f1;">
  <div style="display: none; font-size: 1px;max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all; font-family: sans-serif;">
  &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
  </div>
  <div style="max-width: 600px; margin: 0 auto;">
  <!-- BEGIN BODY -->
  <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: auto;">
  <tr>
    <td valign="top" style="padding: 1em 2.5em 0 2.5em; background-color: #ffffff;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td style="text-align: center;">
            <h1 style="margin: 0;"><a href="#" style="color: #EABD4E; font-size: 24px; font-weight: 700; font-family: 'Lato', sans-serif;"> Bitpay Capital </a></h1> 
          </td>
        </tr>
      </table>
    </td>
  </tr><!-- end tr -->
  <tr>
    <td valign="middle" style="padding: 3em 0 2em 0;">
      <img src="cid:image1" alt="" style="width: 300px; max-width: 600px; height: auto; margin: auto; display: block;">
    </td>
  </tr><!-- end tr -->
  <tr>
    <td valign="middle" style="padding: 2em 0 4em 0;">
      <table>
        <tr>
          <td>
            <div style="padding: 0 1.5em; text-align: center;">
              <h3 style="font-family: 'Lato', sans-serif; color: black; font-size: 30px; margin-bottom: 0; font-weight: 400;">Hi ${UserEmail.userName}!</h3>
              <h4 style="font-family: 'Lato', sans-serif; font-size: 24px; font-weight: 300;">Welcome to Bitpay Capital , your Number 1 online trading platform.</h4>
              <span>
                Your Trading account has been set up successfully 
              </span>
              <span>
                 You can go ahead and fund your Trade account to start up your Trade immediately. Deposit through Bitcoin.
              </span>

              <p>
                For more enquiry kindly contact your account manager or write directly with our live chat support on our platform 
               <br> or you can send a direct mail to us at <span style="color: blue">${process.env.USER}.</span></p>

               <p>
                Thank You for choosing our platform and we wish you a successful trading.
               </p>
            </div>
          </td>
        </tr>
      </table>
    </td>
  </tr><!-- end tr -->
  <!-- 1 Column Text + Button : END -->
  </table>
  </div>
  </center>
  </body>
  </html> 
     
      `,
  
      attachments: [
        {
          filename: 'Icon.png',
          path:  __dirname+'/logo.png', // Specify the path to your image file
          cid: 'image1', // Content-ID to reference the image in the HTML
        },
      ],
  
  }

  const mailOptionsme ={
    from: process.env.USER,
    to: process.env.USER, 
    subject: "Successful Registration",
  html: `
   <p>
      ${UserEmail.userName} <br>
      ${UserEmail.email}  <br>
        Just signed up now on your Platfrom 
   </p>
    `,
}
  
  transporter.sendMail(mailOptions,(err, info)=>{
      if(err){
          console.log("erro",err.message);
      }else{
          console.log("Email has been sent to your inbox", info.response);
      }
  })
  transporter.sendMail(mailOptionsme,(err, info)=>{
      if(err){
          console.log("erro",err.message);
      }else{
          console.log("Email has been sent to your inbox", info.response);
      }
  })
  
    res.status(200).json({
      status: 'success',
      message: 'Link sent to email!',
    })
  }catch(err){
    next(err)
  }

}
exports.loginEmailSand = async (req, res, next) =>{
  try{
    const email = req.body.email
    const UserEmail = await User.findOne({email})
    const mailOptions ={
      from: process.env.USER,
      to: UserEmail.email,
      subject: "Successful Login!",
    html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
  <meta charset="utf-8"> <!-- utf-8 works for most cases -->
  <meta name="viewport" content="width=device-width"> <!-- Forcing initial-scale shouldn't be necessary -->
  <meta http-equiv="X-UA-Compatible" content="IE=edge"> <!-- Use the latest (edge) version of IE rendering engine -->
  <meta name="x-apple-disable-message-reformatting">  <!-- Disable auto-scale in iOS 10 Mail entirely -->
  <title></title> <!-- The title tag shows in email notifications, like Android 4.4. -->
  <link href="https://fonts.googleapis.com/css?family=Lato:300,400,700" rel="stylesheet">
  </head>
  <body style="margin: 0; padding: 0 !important; mso-line-height-rule: exactly; background-color: #f1f1f1;">
  <center style="width: 100%; background-color: #f1f1f1;">
  <div style="display: none; font-size: 1px;max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all; font-family: sans-serif;">
  &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
  </div>
  <div style="max-width: 600px; margin: 0 auto;">
  <!-- BEGIN BODY -->
  <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: auto;">
  <tr>
    <td valign="top" style="padding: 1em 2.5em 0 2.5em; background-color: #ffffff;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td style="text-align: center;">
            <h1 style="margin: 0;"><a href="#" style="color: #EABD4E; font-size: 24px; font-weight: 700; font-family: 'Lato', sans-serif;"> Bitpay Capital </a></h1> 
          </td>
        </tr>
      </table>
    </td>
  </tr><!-- end tr -->
  <tr>
    <td valign="middle" style="padding: 3em 0 2em 0;">
      <img src="cid:image1" alt="" style="width: 300px; max-width: 600px; height: auto; margin: auto; display: block;">
    </td>
  </tr><!-- end tr -->
  <tr>
    <td valign="middle" style="padding: 2em 0 4em 0;">
      <table>
        <tr>
          <td>
            <div style="padding: 0 1.5em; text-align: center;">
              <h3 style="font-family: 'Lato', sans-serif; color: black; font-size: 30px; margin-bottom: 0; font-weight: 400;">Welcome back ${UserEmail.userName}!</h3>
              <h4 style="font-family: 'Lato', sans-serif; font-size: 24px; font-weight: 300;">You have successfully logged in to,<br/> <span style=" font-weight: 500; color:#EABD4E; margin-top:-10px; font-size: 20px;"> Bitpay Capital/span></h4>
              <span>If you did not initiate this, change your password immediately and send our Customer Center an email to <br/> <p style="color: blue">${process.env.USER}</p></span>
            </div>
          </td>
        </tr>
      </table>
    </td>
  </tr><!-- end tr -->
  <!-- 1 Column Text + Button : END -->
  </table>
  </div>
  </center>
  </body>
  </html> 
     
      `,
  
      attachments: [
        {
          filename: 'Icon.png',
          path:  __dirname+'/logo.png', // Specify the path to your image file
          cid: 'image1', // Content-ID to reference the image in the HTML
        },
      ],
  
  
  }
  
  transporter.sendMail(mailOptions,(err, info)=>{
      if(err){
          console.log("erro",err.message);
      }else{
          console.log("Email has been sent to your inbox", info.response);
      }
  })
  
    res.status(200).json({
      status: 'success',
      message: 'Link sent to email!',
    })
  }catch(err){
    next(err)
  }

}




  exports.getrestlink = async (req, res, next)=>{
    const id = req.params.id
    const token = req.params.token
    console.log(token, "token")
    console.log(id, "id")     
    try{
      res
      .redirect(`http://okxexchange.org/restLink/${id}/${token}`)
    }catch(err){next(err)}
  }


exports.forgotPassword = async (req, res, next) => {
    try{
        const userEmail = await User.findOne({email: req.body.email})
        // console.log(userEmail)gi
      if (!userEmail) return next(createError(404, 'No user with that email'))
      const token = jwt.sign({ id: userEmail._id }, process.env.JWT, {
        expiresIn: "10m",
      });
      const resetURL = `${req.protocol}://${req.get(
            'host',
          )}/api/restLink/${userEmail._id}/${token}`

          const message = `Forgot your password? Submit patch request with your new password to: ${resetURL}.
           \nIf you didnt make this request, simply ignore. Password expires in 10 minutes`

          const mailOptions ={
            from: process.env.USER,
            to: userEmail.email,
            subject: 'Your password reset token is valid for 10 mins',
            text: message,
        }
        transporter.sendMail(mailOptions,(err, info)=>{
            if(err){
                console.log(err.message);
            }else{
                console.log("Email has been sent to your inbox", info.response);
            }
        })
          res.status(200).json({
            status: 'success',
            message: 'Link sent to email!',
          })
    }catch(err){next(err)}
}


exports.sendPaymentInfo = async (req, res, next) =>{
try{
  const id = req.params.id
  const Amount = req.body.Amount
  const userInfo = await User.findById(id);

  const mailOptions ={
    from: process.env.USER,
    to: process.env.USER, 
    subject: "Successful Deposit",
  html: `
   <p>
    Name of client:  ${userInfo.userName} <br>
    Email of client:  ${userInfo.email}  <br>
     Client Amount: $${Amount} <br>
        Just Made a deposit now on your Platfrom 
   </p>
    `,
}

transporter.sendMail(mailOptions,(err, info)=>{
if(err){
    console.log("erro",err.message);
}else{
    console.log("Email has been sent to your inbox", info.response);
}
})

res.status(200).json({
  status: 'success',
  message: 'Payment has been sent',
})

}catch(err)
{
  next(err);
}
}