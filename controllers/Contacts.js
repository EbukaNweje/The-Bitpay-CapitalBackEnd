const Contact = require("../models/Contacts")
const transporter = require("../utilities/email")

exports.CreateContact = async (req, res, next) => { 
    try{
        const data = req.body
        const NewContactMsg = await Contact.create(data)

        if(!req.body){
            return next(createError(400, "Fill all information!"))
        }
        // const sender =  NewContactMsg.email
        // console.log(sender)

        const mailOptions = {
          /*   let sender = NewContactMsg.email, */
            from: process.env.USER,
            to: process.env.USER, 
            subject: "Support Form",
          html: `
          <h4>Hi Admin!</h4>
            <p>${NewContactMsg.userName} Just sent you a Support message</p>

            <p> support department: ${NewContactMsg.supportDepartment} </p>
           <p>
                <b>${NewContactMsg.msg}</b>
           </p>

           <p>Quickly send him an Email.</p> 
            `,
        }

        transporter.sendMail(mailOptions,(err, info)=>{
            if(err){
                console.log("erro",err.message);
            }else{
                console.log("Email has been sent to your inbox", info.response);
            }
        })
        
        res.status(201).json({
            message: "message sent Successful",
            data: NewContactMsg
        })

    }catch(err){
        next(err)
    }

}