package main

import (
	"fmt"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

const prefixUser = "US"
const prefixHouseRequest = "HR"
const prefixHousePlan = "HP"
const prefixBid = "PB"
const prefixPayment = "PM"

const projectName = "Jeadigital-Rebuild-lives-app"
const version = "v1"

var logger = shim.NewLogger("Jeadigital-Rebuild-lives-app:")

type SmartContract struct {
}

func (s *SmartContract) Init(stub shim.ChaincodeStubInterface) pb.Response {
	logger.Info("*** " + projectName + " *** " + version + " Init ***")
	return shim.Success(nil)
}

func (s *SmartContract) Invoke(stub shim.ChaincodeStubInterface) pb.Response {
	logger.Info("*** " + projectName + " *** " + version + " Invoke ***")
	function, args := stub.GetFunctionAndParameters()
	logger.Info("Function: " + function)
	switch function {
	case "registerUser":
		return s.registerUser(stub, args)
	case "authUser":
		return s.authUser(stub, args)
	case "newHouseRequest":
		return s.newHouseRequest(stub, args)
	case "getHouseRequestStatus":
		return s.getHouseRequestStatus(stub, args)
	case "getNewHouseRequest":
		return s.getNewHouseRequest(stub)
	case "acceptOrRejectHouseRequest":
		return s.acceptOrRejectHouseRequest(stub, args)
	case "getAllHouseRequest":
		return s.getAllHouseRequest(stub)
	case "getLandSurveyList":
		return s.getLandSurveyList(stub)
	case "updateSurveyDetails":
		return s.updateSurveyDetails(stub, args)
	case "getPlanRequest":
		return s.getPlanRequest(stub, args)
	case "getPlanListForPlanner":
		return s.getPlanListForPlanner(stub, args)
	case "submitNewHousePlan":
		return s.submitNewHousePlan(stub, args)
	case "getListofHouseRequest":
		return s.getListofHouseRequest(stub)
	case "listAllHousePlan":
		return s.listAllHousePlan(stub, args)
	case "listOfAllHousePlan":
		return s.listOfAllHousePlan(stub, args)
	case "approveHousePlan":
		return s.approveHousePlan(stub, args)
	case "listAllPlanApproved":
		return s.listAllPlanApproved(stub, args)
	case "submitNewBid":
		return s.submitNewBid(stub, args)
	case "getAllBidRequest":
		return s.getAllBidRequest(stub)
	case "approveBidRequest":
		return s.approveBidRequest(stub, args)
	case "getListofApprovedBid":
		return s.getListofApprovedBid(stub, args)
	case "updateWorkStatus":
		return s.updateWorkStatus(stub, args)
	case "listofPaymentrequest":
		return s.listofPaymentrequest(stub, args)
	case "Payment":
		return s.Payment(stub, args)
	case "CompletedHouseList":
		return s.CompletedHouseList(stub)
	case "UserUpdation":
		return s.UserUpdation(stub, args)
	case "getListofApprovedBidForPlanner":
		return s.getListofApprovedBidForPlanner(stub, args)
	case "getNewBidRequestForPlanner":
		return s.getNewBidRequestForPlanner(stub, args)
	case "getBidAgainstAHouseRequest":
		return s.getBidAgainstAHouseRequest(stub, args)

	default:
		jsonResp := "{\"status\":false,\"description\":\"Invalid Smart Contract function name.\"}"
		return shim.Error(jsonResp)
	}
}

func main() {
	// Create a new Smart Contract
	err := shim.Start(new(SmartContract))
	if err != nil {
		fmt.Printf("Error creating new Smart Contract: %s", err)
	}
}
