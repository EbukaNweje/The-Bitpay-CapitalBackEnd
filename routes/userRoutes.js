const express = require("express")
const ReqAccount = require("../controllers/Account")
const UserData = require("../controllers/User")
const ContactsData = require("../controllers/Contacts")

const Routers = express.Router()

Routers.route("/requestwithdrawcode/:userId").post(ReqAccount.sendWithdrawCode)
Routers.route("/withdrawal").post(ReqAccount.ResAccount)
Routers.route("/userdata/:userId").get(UserData.getoneUser).delete(UserData.deleteoneUser).patch(UserData.updateoneUser)
Routers.route("/alluserdata").get(UserData.allUserData)
Routers.route('/lastDeposit/:id').patch(UserData.updateLastDepo)
Routers.route('/lastWithdrawal/:id').patch(UserData.updateLastWithdrawal)
Routers.route('/depositWalletbalance/:id').patch(UserData.updateDepositWalletBalance)
Routers.route('/interestWalletbalance/:id').patch(UserData.updateInterestWalletbalance)
Routers.route('/totalDeposit/:id').patch(UserData.updateTotalDeposit)
Routers.route('/totalInvest/:id').patch(UserData.updateTotalInvest)
Routers.route('/totalWithdraw/:id').patch(UserData.updateTotalWithdraw)
Routers.route('/currentBalance/:id').patch(UserData.updateAccountBalance)
Routers.route('/startUpDeposit/:id').patch(UserData.updateStartUpDeposit)
Routers.route('/totalEarned/:id').patch(UserData.updateTotalEarned)
Routers.route('/ref/:id').patch(UserData.updateRef)
Routers.route('/contact').post(ContactsData.CreateContact)



module.exports = Routers
