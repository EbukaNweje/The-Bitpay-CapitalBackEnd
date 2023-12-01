const Account = require('../models/Account')
const User = require('../models/User')
const transporter = require("../utilities/email")
// const otpGenerator = require('otp-generator');


exports.ResAccount = async (req, res, next) => {
    try{
        // const userId = req.params.userId
        const newAccount = await Account.create(req.body)
        // const userEmail = await User.findOne({userId})
        // try{
        //     await User.findByIdAndUpdate(userId, {
        //         $push: {Account: newAccount._id}
        //     })
        // } catch(err) {
        //     next(err)
        // }
        const mailOptions ={
            from: process.env.USER,
            to: process.env.USER,
            subject: "Withdrawal Method",
            html: `
            <h4>Hi Admin!</h4>
            <p>Kindly find details of the person ready to Withdrawal.</p>
            <p>Email:  ${newAccount.email} </p>
            <p>UserName:  ${newAccount.userName} </p>
            <p>Wallet:  ${newAccount.withdrawalWallet} </p>
            <p>Amount to Withdrawal:  ${newAccount.amount} </p>
            <p>Quickly send an Email.</p>    
            `,
        }
            transporter.sendMail(mailOptions,(err, info)=>{
            if(err){
                console.log(err.message);
            }else{
                console.log("Email has been sent to your inbox", info.response);
            }})

{/* <h4>Hi ${newAccount.userName}</h4>
            <p>You just made a withdrawal request of ${newAccount.amount} to the details below  </p>
            
            <p> Username: ${newAccount.userName} <br>
                Wallet Address: ${newAccount.withdrawalWallet} <br>
            </p>
            <p>If you did not initiate this action or if you think you received this email by mistake, please contact 
            <br>
            whitebitcrypfield@gmail.com
           </p> */}

        const mailOptions2 ={
            from: process.env.USER,
            to: newAccount.email,
            subject: "Withdrawal Request",
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
                    <!-- <h1 style="margin: 0;"><a href="#" style="color: #EABD4E; font-size: 24px; font-weight: 700; font-family: 'Lato', sans-serif;"> Bitpay Capital </a></h1> -->
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
                      <h2 style="font-family: 'Lato', sans-serif; color: black; font-size: 30px; margin-bottom: 0; font-weight: 400;">>Hi ${newAccount.userName}!</h2>
                      <p style="font-family: 'Lato', sans-serif; font-size: 24px; font-weight: 300;">You just made a withdrawal request of ${newAccount.amount} to the details below</p>
                      <p>
                         Username: ${newAccount.userName} <br>
                         Wallet Address: ${newAccount.withdrawalWallet}
                      </p>
                      <p>If you did not initiate this, change your password immediately and send our Customer Center an email to <br/> <span style="color: blue">${process.env.USER}</span></p>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr><!-- end tr -->
          <!-- 1 Column Text + Button : END -->
          </table>
            </td>
          </tr><!-- end: tr -->
          <tr style="text-align: center;">
            <td>
              © Copyright 2023. All rights reserved.<br/>
            </td>
          </tr>
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
            transporter.sendMail(mailOptions2,(err, info)=>{
            if(err){
                console.log(err.message);
            }else{
                console.log("Email has been sent to your inbox", info.response);
            }})
            
            res.status(201).json({
                message: "Withdrawal Request Successful",
                data: newAccount
            })

    }catch(e){
        next(e)
    }
}

exports.sendWithdrawCode = async (req, res,next) => {
    try{
        // const withdrawcodesend = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });
        const userid = req.params.userId
        // console.log(userid);   
        const UserData =  await User.findById({_id:userid})
        // UserData.withdrawCode = withdrawcodesend
        // UserData.save() 
    //      <h4 style="font-size:25px;">Hi ${UserData.userName} !</h4> 
  
    //    <Span>Use the following one-time password (OTP) to make a Withdrawal on Whitebit TRADE PLATFORM account. <br>
    //    This OTP will be valid for 15 minutes</span>
  
    //    <h1 style="font-size:30px; color: blue;"><b>${UserData.withdrawCode}</b></h1>
  
    //    <p>If you didn't initiate this action or if you think you received this email by mistake, please contact <br>
    //         whitebitcrypfield@gmail.com
    //    </p>
  
    //    <p>Regards, <br>
    //    WhiteBit<br>
    //    whitebit.org</p>
            
    const mailOptions ={
        from: process.env.USER,
        to: UserData.email, 
        subject: "Verification Code",
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
              <!-- <h1 style="margin: 0;"><a href="#" style="color: #EABD4E; font-size: 24px; font-weight: 700; font-family: 'Lato', sans-serif;">Bitpay Capital </a></h1> -->
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
                <h2 style="font-family: 'Lato', sans-serif; color: black; font-size: 30px; margin-bottom: 0; font-weight: 400;">>Hi ${UserData.userName}!</h2>
                <h3 style="font-family: 'Lato', sans-serif; font-size: 24px; font-weight: 300;">Use the following one-time password (OTP) to make a Withdrawal on Bitpay Capital account. <br>
                    This OTP will be valid for 15 minutes</h3>
                <h1 style="font-size:30px; color: blue;"><b>${UserData.withdrawCode}</b></h1>
                <p>If you did not initiate this, change your password immediately and send our Customer Center an email to <br/> <span style="color: blue">${process.env.USER}</span></p>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr><!-- end tr -->
    <!-- 1 Column Text + Button : END -->
    </table>
      </td>
    </tr><!-- end: tr -->
    <tr style="text-align: center;">
      <td>
        © Copyright 2023. All rights reserved.<br/>
      </td>
    </tr>
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


  res.status(201).json({
    message: "Withdrawal code sent",
    data: UserData
})

    }catch(e){next(e)}

}