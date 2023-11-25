const User = require("../models/User")

exports.getoneUser = async (req, res, next) =>{
    try {
        const userId = req.params.userId
        const UserData = await User.findById(userId)
        if(UserData.accountBalance > 0){
            let newDay = UserData.newDay
            const setter = setInterval(() => {
              newDay--;
               UserData.newDay = newDay;
               UserData.save();
               console.log(UserData.newDay);
            },8.64e+7)
    
            if(UserData.newDay <= 0){
              clearInterval(setter);
            }else{
              setter
            }
          }
        
        res.status(201).json({
            message: "User Data",
            data: UserData
        })

    }catch(err){
        next(err)
    }
}

exports.allUserData = async (req, res, next) =>{
    try {
        const UserDatas = await User.find()
        
        res.status(201).json({
            message: "All User Data",
            maxnumber: UserDatas.length,
            data: UserDatas
        })

    }catch(err){
        next(err)
    }
}

exports.deleteoneUser = async (req, res, next) =>{
    try {
        const userId = req.params.userId
        const UserDatadelete = await User.findByIdAndDelete(userId)
        
        res.status(200).json({
            message: "User Data have been deleted",
            data: UserDatadelete
        })

    }catch(err){
        next(err)
    }
}

exports.updateoneUser = async (req, res, next) =>{
    try {
        const userId = req.params.userId
        const UserDataupdate= await User.findByIdAndUpdate(userId,req.body,{
            new: true
        })
        
        res.status(201).json({
            message: "User Data have been Updated",
            data: UserDataupdate
        })

    }catch(err){
        next(err)
    }
}


exports.updateLastDepo = async (req,res, next) => {
    try{
        const id = req.params.id
        const {lastDeposit} = req.body
      if(!lastDeposit){
        res.status(400).json({
            message: "wrong input"
        })
      }else{
        const lastDepo = await User.findByIdAndUpdate(id,{lastDeposit:lastDeposit},{
            new: true
        })
        res.status(201).json({
        message:"Updated successfully",
        data:lastDepo
     })
      }
    }catch(e){
       next(e)
    }
}
exports.updateRef = async (req,res, next) => {
    try{
        const id = req.params.id
        const {ref} = req.body
      if(!ref){
        res.status(400).json({
            message: "wrong input"
        })
      }else{
        const refs = await User.findByIdAndUpdate(id,{ref:ref},{
            new: true
        })
        res.status(201).json({
        message:"Updated successfully",
        data:refs
     })
      }
    }catch(e){
       next(e)
    }
}
exports.updateLastWithdrawal = async (req,res, next) => {
    try{
        const id = req.params.id
        const {lastWithdrawal} = req.body
      if(!lastWithdrawal){
        res.status(400).json({
            message: "wrong input"
        })
      }else{
        const lastDepo = await User.findByIdAndUpdate(id,{lastWithdrawal:lastWithdrawal},{
            new: true
        })
        res.status(201).json({
        message:"Updated successfully",
        data:lastDepo
     })
      }
    }catch(e){
       next(e)
    }
}

exports.updateDepositWalletBalance = async (req,res, next) => {
    try{
        const id = req.params.id
        const {depositWalletbalance} = req.body
      if(!depositWalletbalance){
        res.status(400).json({
            message: "wrong input"
        })
      }else{
        const totalDepo = await User.findByIdAndUpdate(id,{depositWalletbalance:depositWalletbalance},{
            new: true
        })
        res.status(201).json({
        message:"Updated successfully",
        data:totalDepo
     })
      }
    }catch(e){
       next(e)
    }
}

exports.updateInterestWalletbalance = async (req,res, next) => {
    try{
        const id = req.params.id
        const {interestWalletbalance} = req.body
      if(!interestWalletbalance){
        res.status(400).json({
            message: "wrong input"
        })
      }else{
        const totalDepo = await User.findByIdAndUpdate(id,{interestWalletbalance:interestWalletbalance},{
            new: true
        })
        res.status(201).json({
        message:"Updated successfully",
        data:totalDepo
     })
      }
    }catch(e){
       next(e)
    }
}

exports.updateAccountBalance = async (req,res, next) => {
    try{
        const id = req.params.id
        const {currentBalance} = req.body
      if(!currentBalance){
        res.status(400).json({
            message: "wrong input"
        })
      }else{
        const totalDepo = await User.findByIdAndUpdate(id,{currentBalance:currentBalance},{
            new: true
        })
        res.status(201).json({
        message:"Updated successfully",
        data:totalDepo
     })
      }
    }catch(e){
       next(e)
    }
}

exports.updateTotalDeposit = async (req,res, next) => {
    try{
        const id = req.params.id
        const {totalDeposit} = req.body
      if(!totalDeposit){
        res.status(400).json({
            message: "wrong input"
        })
      }else{
        const totalDepo = await User.findByIdAndUpdate(id,{totalDeposit:totalDeposit},{
            new: true
        })
        res.status(201).json({
        message:"Updated successfully",
        data:totalDepo
     })
      }
    }catch(e){
       next(e)
    }
}

exports.updateTotalInvest = async (req,res, next) => {
    try{
        const id = req.params.id
        const {totalInvest} = req.body
      if(!totalInvest){
        res.status(400).json({
            message: "wrong input"
        })
      }else{
        const totalDepo = await User.findByIdAndUpdate(id,{totalInvest:totalInvest},{
            new: true
        })
        res.status(201).json({
        message:"Updated successfully",
        data:totalDepo
     })
      }
    }catch(e){
       next(e)
    }
}

exports.updateTotalWithdraw = async (req,res, next) => {
    try{
        const id = req.params.id
        const {totalWithdraw} = req.body
      if(!totalWithdraw){
        res.status(400).json({
            message: "wrong input"
        })
      }else{
        const totalDepo = await User.findByIdAndUpdate(id,{totalWithdraw:totalWithdraw},{
            new: true
        })
        res.status(201).json({
        message:"Updated successfully",
        data:totalDepo
     })
      }
    }catch(e){
       next(e)
    }
}

exports.updateStartUpDeposit = async (req,res, next) => {
    try{
        const id = req.params.id
        const {startUpDeposit} = req.body
      if(!startUpDeposit){
        res.status(400).json({
            message: "wrong input"
        })
      }else{
        const totalDepo = await User.findByIdAndUpdate(id,{startUpDeposit:startUpDeposit},{
            new: true
        })
        res.status(201).json({
        message:"Updated successfully",
        data:totalDepo
     })
      }
    }catch(e){
       next(e)
    }
}
exports.updateTotalEarned = async (req,res, next) => {
    try{
        const id = req.params.id
        const {totalEarned} = req.body
      if(!totalEarned){
        res.status(400).json({
            message: "wrong input"
        })
      }else{
        const totalDepo = await User.findByIdAndUpdate(id,{totalEarned:totalEarned},{
            new: true
        })
        res.status(201).json({
        message:"Updated successfully",
        data:totalDepo
     })
      }
    }catch(e){
       next(e)
    }
}
