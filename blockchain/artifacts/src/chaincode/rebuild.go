package main

import (
	"encoding/json"
	"strconv"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

func (s *SmartContract) registerUser(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	logger.Info("***" + projectName + "***" + version + "Create new Invoice ***")

	if len(args) != 5 && len(args) != 3 {
		return shim.Error("Incorrect number of arguments. Expecting 29")
	}

	//User Role
	if args[0] == "HouseOwner" {
		houseOwner := HouseOwner{}
		houseOwner.Role = args[0]
		houseOwner.UserID = args[1]
		houseOwner.MobileNumber = args[2]
		houseOwner.AadharNumber = args[3]
		houseOwner.Password = args[4]

		key, err := stub.CreateCompositeKey(prefixUser, []string{args[1]})

		if err != nil {
			return shim.Error(err.Error())
		}
		// Check if the user already exist
		userAsBytes, _ := stub.GetState(key)
		if userAsBytes != nil {
			return shim.Error("User already exist !")
		}
		userAsBytes, err = json.Marshal(houseOwner)
		if err != nil {
			return shim.Error(err.Error())
		}
		err = stub.PutState(key, userAsBytes)
		if err != nil {
			return shim.Error(err.Error())
		}
		return shim.Success([]byte("{\"User\":\"" + args[1] + "\",\"status\":true,\"description\":\"User is successfully Registered\"}"))
	}

	if args[0] == "Planner" || args[0] == "Surveyor" || args[0] == "Architect" || args[0] == "ConstructionCompany" {
		participant := Participant{}
		participant.Role = args[0]
		participant.UserID = args[1]
		participant.Password = args[2]

		key, err := stub.CreateCompositeKey(prefixUser, []string{args[1]})
		if err != nil {
			return shim.Error(err.Error())
		}
		// Check if the user already exist
		userAsBytes, _ := stub.GetState(key)
		if userAsBytes != nil {
			return shim.Error("User already exist !")
		}
		userAsBytes, err = json.Marshal(participant)
		if err != nil {
			return shim.Error(err.Error())
		}
		err = stub.PutState(key, userAsBytes)
		if err != nil {
			return shim.Error(err.Error())
		}
		return shim.Success([]byte("{\"User\":\"" + args[1] + "\",\"status\":true,\"description\":\"User is successfully Registered\"}"))
	}
	return shim.Error("Invalid User Role: User role either HouseOwner,Planner,Surveyor,Architect or ConstructionCompany  ")
	/*
		serializedID, _ := stub.GetCreator()
		logger.Info(string(serializedID))
		orgMSPID := string(serializedID[2:10])
		logger.Info(orgMSPID)
		if orgMSPID != "BuyerMSP"{
			return shim.Error("Access Denied, This user don't have permission to create new house request ")
		}
	*/
}

func (s *SmartContract) authUser(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	logger.Info("***" + projectName + "***" + version + "Auth user ***")
	if len(args) != 3 {
		return shim.Error("Incorrect number of arguments. Expecting 3")
	}
	logger.Info(args[0])
	key, err := stub.CreateCompositeKey(prefixUser, []string{args[0]})
	if err != nil {
		return shim.Error(err.Error())
	}
	userAsBytes, _ := stub.GetState(key)
	if userAsBytes == nil {
		return shim.Error("Invalid user id")
	}
	if args[2] == "HouseOwner" {
		houseOwner := HouseOwner{}
		err = json.Unmarshal(userAsBytes, &houseOwner)
		if houseOwner.Password == args[1] && houseOwner.Role == args[2] {
			jsonResp := "{\"User\":\"" + args[0] + "\",\"success\":true,\"role\":\"" + args[2] + "\",\"message\":\"Login successful\"}"
			return shim.Success([]byte(jsonResp))
		}
		jsonResp := "{\"User\":\"" + args[0] + "\",\"success\":false,\"category\":\"\",\"message\":\"Invalid username or password\"}"
		return shim.Success([]byte(jsonResp))
	}
	if args[2] == "Planner" || args[2] == "Surveyor" || args[2] == "Architect" || args[2] == "ConstructionCompany" {
		participant := Participant{}
		err = json.Unmarshal(userAsBytes, &participant)
		if participant.Password == args[1] && participant.Role == args[2] {
			jsonResp := "{\"User\":\"" + args[0] + "\",\"success\":true,\"role\":\"" + args[2] + "\",\"message\":\"Login successful\"}"
			return shim.Success([]byte(jsonResp))
		}
		jsonResp := "{\"User\":\"" + args[0] + "\",\"success\":false,\"category\":\"\",\"message\":\"Invalid username or password\"}"
		return shim.Success([]byte(jsonResp))
	}

	return shim.Success([]byte("Invalid user role"))
}

func (s *SmartContract) newHouseRequest(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	logger.Info("***" + projectName + "***" + version + "Create new Invoice ***")
	if len(args) != 7 {
		return shim.Error("Incorrect number of arguments. Expecting 7")
	}
	houseRequest := HouseRequest{}
	houseRequest.HouseRequestID = args[0]
	houseRequest.UserID = args[0]
	houseRequest.HouseLocation = args[1]
	houseRequest.DamageDetails = args[2]
	houseRequest.PropertyID = args[3]
	houseRequest.HouseNumber = args[4]
	houseRequest.Village = args[5]
	houseRequest.District = args[6]
	houseRequest.HouseArea = ""
	houseRequest.HouseRequestAccaptance = false
	houseRequest.LandSurveyCompleted = false
	houseRequest.LandNeeded = false
	houseRequest.PlanApproved = false
	houseRequest.ApprovedPlanID = ""
	houseRequest.ConstructionApproval = false
	houseRequest.FundAllocated = 0.00
	houseRequest.BalanceAmountToPay = 0.00
	houseRequest.Status = "New"
	houseRequest.Remarks = ""
	houseRequest.NumberOfPlanRecieved = 0
	houseRequest.NumberOfBidRecieved = 0
	houseRequest.BidApproved = false
	houseRequest.ApprovedBidID = ""
	houseRequest.ApprovedBidConstructionCompany = ""
	houseRequest.ConstructionCompletedAndVerified = false
	houseRequest.FirstphaseWorkStatus = false
	houseRequest.SecondphaseWorkStatus = false
	houseRequest.ThirdphaseWorkStatus = false
	houseRequest.BidRequestAccaptance = false
	houseRequest.MaxConstructionArea = ""
	houseRequest.PlotArea = ""

	key, err := stub.CreateCompositeKey(prefixHouseRequest, []string{args[0]})
	if err != nil {
		return shim.Error(err.Error())
	}
	// Check if the user already exist
	houserequestAsBytes, _ := stub.GetState(key)
	if houserequestAsBytes != nil {
		return shim.Error("House request already exist !")
	}
	houserequestAsBytes, err = json.Marshal(houseRequest)
	if err != nil {
		return shim.Error(err.Error())
	}
	err = stub.PutState(key, houserequestAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success([]byte("{\"User\":\"" + args[0] + "\",\"status\":true,\"description\":\"New house request is successfully Registered\"}"))

}

func (s *SmartContract) getHouseRequestStatus(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	logger.Info("***" + projectName + "***" + version + "Read All house request ***")
	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}
	logger.Info(args)
	key, err := stub.CreateCompositeKey(prefixHouseRequest, []string{args[0]})
	if err != nil {
		return shim.Error(err.Error())
	}
	houseRequestAsBytes, err := stub.GetState(key)
	if houseRequestAsBytes == nil {
		return shim.Error("Invalid house request")
	}
	return shim.Success(houseRequestAsBytes)
}

func (s *SmartContract) getNewHouseRequest(stub shim.ChaincodeStubInterface) pb.Response {
	logger.Info("***" + projectName + "***" + version + "Read new house request ***")
	results := []interface{}{}
	resultsIterator, err := stub.GetStateByPartialCompositeKey(prefixHouseRequest, []string{})
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()
	for resultsIterator.HasNext() {
		kvResult, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}

		houseRequest := HouseRequest{}
		err = json.Unmarshal(kvResult.Value, &houseRequest)
		if err != nil {
			return shim.Error(err.Error())
		}
		if houseRequest.Status == "New" {
			results = append(results, houseRequest)
		}
	}
	houseRequestAsBytes, err := json.Marshal(results)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(houseRequestAsBytes)
}

func (s *SmartContract) acceptOrRejectHouseRequest(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	logger.Info("***" + projectName + "***" + version + "accept Or Reject House Request ***")
	if len(args) != 3 {
		return shim.Error("Incorrect number of arguments. Expecting 3")
	}
	key, err := stub.CreateCompositeKey(prefixHouseRequest, []string{args[0]})
	if err != nil {
		return shim.Error(err.Error())
	}
	houseRequestAsBytes, err := stub.GetState(key)
	if houseRequestAsBytes == nil {
		return shim.Error("Invalid house request")
	}
	houseRequest := HouseRequest{}
	logger.Info("---status----" + houseRequest.Status)

	err = json.Unmarshal(houseRequestAsBytes, &houseRequest)
	if houseRequest.Status == "Accept" || houseRequest.Status == "Reject" {
		return shim.Error("Already accepted or rejected")
	}
	if args[1] == "Accept" {
		houseRequest.HouseRequestAccaptance = true
	}
	houseRequest.Status = args[1]
	houseRequest.Remarks = args[2]

	houseRequestAsBytes, err = json.Marshal(houseRequest)
	if err != nil {
		return shim.Error(err.Error())
	}
	err = stub.PutState(key, houseRequestAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success([]byte("House request updated"))

}

func (s *SmartContract) getAllHouseRequest(stub shim.ChaincodeStubInterface) pb.Response {
	logger.Info("***" + projectName + "***" + version + "Read All house request ***")
	results := []interface{}{}
	resultsIterator, err := stub.GetStateByPartialCompositeKey(prefixHouseRequest, []string{})
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()
	for resultsIterator.HasNext() {
		kvResult, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}

		houseRequest := HouseRequest{}
		err = json.Unmarshal(kvResult.Value, &houseRequest)
		if err != nil {
			return shim.Error(err.Error())
		}
		results = append(results, houseRequest)
	}

	houseRequestAsBytes, err := json.Marshal(results)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(houseRequestAsBytes)
}

func (s *SmartContract) getLandSurveyList(stub shim.ChaincodeStubInterface) pb.Response {
	logger.Info("***" + projectName + "***" + version + "get land survey list ***")
	results := []interface{}{}
	resultsIterator, err := stub.GetStateByPartialCompositeKey(prefixHouseRequest, []string{})
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()
	for resultsIterator.HasNext() {
		kvResult, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}

		houseRequest := HouseRequest{}
		err = json.Unmarshal(kvResult.Value, &houseRequest)
		if err != nil {
			return shim.Error(err.Error())
		}
		if houseRequest.Status == "Accept" && houseRequest.HouseRequestAccaptance == true && houseRequest.LandSurveyCompleted == false {
			results = append(results, houseRequest)
		}
	}
	houseRequestAsBytes, err := json.Marshal(results)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(houseRequestAsBytes)
}

func (s *SmartContract) updateSurveyDetails(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	logger.Info("***" + projectName + "***" + version + "accept Or Reject House Request ***")
	if len(args) != 5 {
		return shim.Error("Incorrect number of arguments. Expecting 5")
	}
	key, err := stub.CreateCompositeKey(prefixHouseRequest, []string{args[0]})
	if err != nil {
		return shim.Error(err.Error())
	}
	houseRequestAsBytes, err := stub.GetState(key)
	if houseRequestAsBytes == nil {
		return shim.Error("Invalid house request")
	}
	houseRequest := HouseRequest{}
	err = json.Unmarshal(houseRequestAsBytes, &houseRequest)
	if houseRequest.Status != "Accept" || houseRequest.HouseRequestAccaptance != true && houseRequest.LandSurveyCompleted != false {
		return shim.Error("Invalid house request, Can not update survey details")
	}
	houseRequest.Status = args[1]
	houseRequest.PlotArea = args[3]
	houseRequest.MaxConstructionArea = args[4]
	houseRequest.LandNeeded, _ = strconv.ParseBool(args[2])
	houseRequest.LandSurveyCompleted = true
	houseRequestAsBytes, err = json.Marshal(houseRequest)
	if err != nil {
		return shim.Error(err.Error())
	}
	err = stub.PutState(key, houseRequestAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success([]byte("Survey details updated"))

}

func (s *SmartContract) getPlanListForPlanner(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	logger.Info("***" + projectName + "***" + version + "paln request ***")
	results := []interface{}{}
	resultsIterator, err := stub.GetStateByPartialCompositeKey(prefixHouseRequest, []string{})
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()
	for resultsIterator.HasNext() {
		kvResult, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}

		houseRequest := HouseRequest{}
		err = json.Unmarshal(kvResult.Value, &houseRequest)
		if err != nil {
			return shim.Error(err.Error())
		}
		if houseRequest.HouseRequestAccaptance == true && houseRequest.LandSurveyCompleted == true && houseRequest.LandNeeded == false && houseRequest.PlanApproved == false {
			results = append(results, houseRequest)
		}
	}
	houseplanRequestAsBytes, err := json.Marshal(results)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(houseplanRequestAsBytes)
}

func (s *SmartContract) getPlanRequest(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	var houserequestidcollection []HouseRequest
	var allHousePlanList []string
	houserequestidcollection = nil
	allHousePlanList = nil

	resultsIterator, err := stub.GetStateByPartialCompositeKey(prefixHousePlan, []string{})
	if err != nil {
		return shim.Error(err.Error())
	}

	defer resultsIterator.Close()
	for resultsIterator.HasNext() {
		kvResult, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}

		housePlan := HousePlan{}
		err = json.Unmarshal(kvResult.Value, &housePlan)
		if err != nil {
			return shim.Error(err.Error())
		}
		if housePlan.ArchitectID == args[0] {
			allHousePlanList = append(allHousePlanList, housePlan.HouseRequestID)
		}
	}

	logger.Info(allHousePlanList)

	//----------------------------------------------------------------------------
	resultsIteratorForHouseRequest, err := stub.GetStateByPartialCompositeKey(prefixHouseRequest, []string{})
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIteratorForHouseRequest.Close()
	for resultsIteratorForHouseRequest.HasNext() {
		kvResult, err := resultsIteratorForHouseRequest.Next()
		if err != nil {
			return shim.Error(err.Error())
		}

		houseRequest := HouseRequest{}
		err = json.Unmarshal(kvResult.Value, &houseRequest)
		if err != nil {
			return shim.Error(err.Error())
		}
		if houseRequest.HouseRequestAccaptance == true && houseRequest.LandSurveyCompleted == true && houseRequest.LandNeeded == false && houseRequest.PlanApproved == false {
			houserequestidcollection = append(houserequestidcollection, houseRequest)
		}

	}
	logger.Info(allHousePlanList)

	//-------------------------------------------------------------------------------
test:
	for i := range allHousePlanList {

		for j := range houserequestidcollection {

			if houserequestidcollection[j].HouseRequestID == allHousePlanList[i] {
				houserequestidcollection = append(houserequestidcollection[:j], houserequestidcollection[j+1:]...)
				goto test
			}
		}
	}
	logger.Info(houserequestidcollection)
	houseRequestAsBytes, err := json.Marshal(houserequestidcollection)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(houseRequestAsBytes)

}

func (s *SmartContract) submitNewHousePlan(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	logger.Info("***" + projectName + "***" + version + "Create new Invoice ***")
	if len(args) != 5 {
		return shim.Error("Incorrect number of arguments. Expecting 5")
	}
	housePlan := HousePlan{}
	housePlan.ArchitectID = args[0]
	housePlan.HouseRequestID = args[1]
	housePlan.HousePlanID = args[1] + args[0]
	housePlan.PlanDetails = args[2]
	housePlan.PlanArea = args[3]
	housePlan.NumberOfBedRooms, _ = strconv.Atoi(args[4])

	key, err := stub.CreateCompositeKey(prefixHousePlan, []string{args[1], args[0]})
	if err != nil {
		return shim.Error(err.Error())
	}
	// Check if the user already exist
	houseplanAsBytes, _ := stub.GetState(key)
	if houseplanAsBytes != nil {
		return shim.Error("House plan already exist !")
	}
	houseplanAsBytes, err = json.Marshal(housePlan)
	if err != nil {
		return shim.Error(err.Error())
	}
	err = stub.PutState(key, houseplanAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	houseRequestkey, err := stub.CreateCompositeKey(prefixHouseRequest, []string{args[1]})
	if err != nil {
		return shim.Error(err.Error())
	}
	houseRequestAsBytes, err := stub.GetState(houseRequestkey)
	if houseRequestAsBytes == nil {
		return shim.Error("Invalid house request")
	}
	houseRequest := HouseRequest{}
	err = json.Unmarshal(houseRequestAsBytes, &houseRequest)

	houseRequest.NumberOfPlanRecieved = houseRequest.NumberOfPlanRecieved + 1
	houseRequestAsBytes, err = json.Marshal(houseRequest)
	if err != nil {
		return shim.Error(err.Error())
	}
	err = stub.PutState(houseRequestkey, houseRequestAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success([]byte("New House plan Successfully submitted"))
}

func (s *SmartContract) getListofHouseRequest(stub shim.ChaincodeStubInterface) pb.Response {
	results := []interface{}{}
	resultsIterator, err := stub.GetStateByPartialCompositeKey(prefixHouseRequest, []string{})
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()
	for resultsIterator.HasNext() {
		kvResult, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}

		houseRequest := HouseRequest{}
		err = json.Unmarshal(kvResult.Value, &houseRequest)
		if err != nil {
			return shim.Error(err.Error())
		}
		if houseRequest.HouseRequestAccaptance == true && houseRequest.LandSurveyCompleted == true && houseRequest.LandNeeded == false && houseRequest.PlanApproved == false && houseRequest.NumberOfPlanRecieved >= 1 {
			results = append(results, houseRequest)
		}
	}

	houseRequestAsBytes, err := json.Marshal(results)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(houseRequestAsBytes)
}

func (s *SmartContract) listOfAllHousePlan(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}
	results := []interface{}{}
	resultsIterator, err := stub.GetStateByPartialCompositeKey(prefixHousePlan, []string{args[0]})
	if err != nil {
		return shim.Error(err.Error())
	}

	defer resultsIterator.Close()
	for resultsIterator.HasNext() {
		kvResult, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}

		housePlan := HousePlan{}
		err = json.Unmarshal(kvResult.Value, &housePlan)
		if err != nil {
			return shim.Error(err.Error())
		}

		results = append(results, housePlan)

	}
	houseplanAsBytes, err := json.Marshal(results)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(houseplanAsBytes)

}

func (s *SmartContract) listAllHousePlan(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	logger.Info("***" + projectName + "***" + version + "paln request ***")
	results := []interface{}{}
	resultsIterator, err := stub.GetStateByPartialCompositeKey(prefixHousePlan, []string{})
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()
	for resultsIterator.HasNext() {
		kvResult, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}

		housePlan := HousePlan{}
		err = json.Unmarshal(kvResult.Value, &housePlan)
		if err != nil {
			return shim.Error(err.Error())
		}
		if housePlan.Approved == false {
			results = append(results, housePlan)
		}
	}
	houseplanAsBytes, err := json.Marshal(results)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(houseplanAsBytes)
}

func (s *SmartContract) approveHousePlan(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	logger.Info("***" + projectName + "***" + version + "accept Or Reject House Request ***")
	if len(args) != 3 {
		return shim.Error("Incorrect number of arguments. Expecting 3")
	}
	key, err := stub.CreateCompositeKey(prefixHouseRequest, []string{args[0]})
	if err != nil {
		return shim.Error(err.Error())
	}
	houseRequestAsBytes, err := stub.GetState(key)
	if houseRequestAsBytes == nil {
		return shim.Error("Invalid house request")
	}
	houseRequest := HouseRequest{}
	err = json.Unmarshal(houseRequestAsBytes, &houseRequest)
	if houseRequest.Status != "SurveyCompleted" || houseRequest.HouseRequestAccaptance == false || houseRequest.LandSurveyCompleted == false || houseRequest.PlanApproved == true {
		return shim.Error("Invalid house request, Can not approve this plan")
	}

	if args[2] == "Accept" {
		houseRequest.Status = "PlanApproved"
		houseRequest.PlanApproved = true
		houseRequest.ApprovedPlanID = args[0] + args[1]
	}
	if args[2] == "Reject" {
		houseRequest.Status = "PlanRejected"
		houseRequest.PlanApproved = false
	}

	houseRequestAsBytes, err = json.Marshal(houseRequest)
	if err != nil {
		return shim.Error(err.Error())
	}
	err = stub.PutState(key, houseRequestAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	key1, err := stub.CreateCompositeKey(prefixHousePlan, []string{args[0], args[1]})
	planAsBytes, err := stub.GetState(key1)
	if planAsBytes == nil {
		return shim.Error("Invalid house plan")
	}
	housePlan := HousePlan{}
	err = json.Unmarshal(planAsBytes, &housePlan)
	housePlan.Approved = true
	planAsBytes, err = json.Marshal(housePlan)
	if err != nil {
		return shim.Error(err.Error())
	}
	err = stub.PutState(key1, planAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success([]byte("Plan Approved"))

}

func (s *SmartContract) listAllPlanApproved(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	logger.Info("*** " + projectName + " *** " + version + " listAllPlanApprovedNotWorking ***")
	//-----------------------------------------------------------------------------
	var houserequestidcollection []string
	var allHousePlanList []HousePlan
	houserequestidcollection = nil
	allHousePlanList = nil

	resultsIterator, err := stub.GetStateByPartialCompositeKey(prefixBid, []string{})
	if err != nil {
		return shim.Error(err.Error())
	}

	defer resultsIterator.Close()
	for resultsIterator.HasNext() {
		kvResult, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}

		bidRequest := BidRequest{}
		err = json.Unmarshal(kvResult.Value, &bidRequest)
		if err != nil {
			return shim.Error(err.Error())
		}
		if bidRequest.ConstructionCompanyID == args[0] {
			houserequestidcollection = append(houserequestidcollection, bidRequest.HouseRequestID)
		}
	}

	logger.Info(houserequestidcollection)

	//----------------------------------------------------------------------------
	resultsIteratorForHousePlan, err := stub.GetStateByPartialCompositeKey(prefixHousePlan, []string{})
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIteratorForHousePlan.Close()
	for resultsIteratorForHousePlan.HasNext() {
		kvResult, err := resultsIteratorForHousePlan.Next()
		if err != nil {
			return shim.Error(err.Error())
		}

		housePlan := HousePlan{}
		err = json.Unmarshal(kvResult.Value, &housePlan)
		if err != nil {
			return shim.Error(err.Error())
		}
		if housePlan.Approved == true {
			allHousePlanList = append(allHousePlanList, housePlan)
		}

	}
	logger.Info(allHousePlanList)

	//-------------------------------------------------------------------------------
test:
	for i := range houserequestidcollection {

		for j := range allHousePlanList {

			if allHousePlanList[j].HouseRequestID == houserequestidcollection[i] {
				allHousePlanList = append(allHousePlanList[:j], allHousePlanList[j+1:]...)
				goto test
			}
		}
	}
	logger.Info(allHousePlanList)
	houseplanAsBytes, err := json.Marshal(allHousePlanList)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(houseplanAsBytes)

}

func (s *SmartContract) submitNewBid(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 4 {
		return shim.Error("Incorrect number of arguments. Expecting 4")
	}
	bidRequest := BidRequest{}
	bidRequest.BidRequestID = args[0]
	bidRequest.AllotedTime = args[3]
	bidRequest.BidStatus = ""
	bidRequest.HouseRequestID = args[1]
	bidRequest.ConstructionCompanyID = args[0]
	bidRequest.BidAmount, _ = strconv.ParseFloat(args[2], 64)
	bidRequest.Status = false

	key, err := stub.CreateCompositeKey(prefixBid, []string{args[0], args[1]})
	if err != nil {
		return shim.Error(err.Error())
	}
	// Check if the user already exist
	bidRequestAsBytes, _ := stub.GetState(key)
	if bidRequestAsBytes != nil {
		return shim.Error("Bid request already exist !")
	}

	//---------------------------------
	key1, err := stub.CreateCompositeKey(prefixHouseRequest, []string{args[1]})
	if err != nil {
		return shim.Error(err.Error())
	}
	houseRequestAsBytes, err := stub.GetState(key1)
	if houseRequestAsBytes == nil {
		return shim.Error("Invalid house request")
	}
	houseRequest := HouseRequest{}

	err = json.Unmarshal(houseRequestAsBytes, &houseRequest)

	//---------------------
	bidRequest.Status = true
	houseRequest.NumberOfBidRecieved = houseRequest.NumberOfBidRecieved + 1

	bidRequestAsBytes, err = json.Marshal(bidRequest)
	if err != nil {
		return shim.Error(err.Error())
	}
	err = stub.PutState(key, bidRequestAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	//----------------------------------------

	houseRequestAsBytes, err = json.Marshal(houseRequest)
	if err != nil {
		return shim.Error(err.Error())
	}
	err = stub.PutState(key1, houseRequestAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	//---------------------------------------
	return shim.Success([]byte("{\"User\":\"" + args[0] + "\",\"status\":true,\"description\":\"New bid request is successfully Registered\"}"))
}

func (s *SmartContract) getAllBidRequest(stub shim.ChaincodeStubInterface) pb.Response {
	results := []interface{}{}
	resultsIterator, err := stub.GetStateByPartialCompositeKey(prefixBid, []string{})
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()
	for resultsIterator.HasNext() {
		kvResult, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}
		bidRequest := BidRequest{}
		err = json.Unmarshal(kvResult.Value, &bidRequest)
		if err != nil {
			return shim.Error(err.Error())
		}
		results = append(results, bidRequest)
	}
	bidRequestAsBytes, err := json.Marshal(results)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(bidRequestAsBytes)

}
func (s *SmartContract) getNewBidRequestForPlanner(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	results := []interface{}{}
	resultsIterator, err := stub.GetStateByPartialCompositeKey(prefixHouseRequest, []string{})
	if err != nil {
		return shim.Error(err.Error())
	}

	defer resultsIterator.Close()
	for resultsIterator.HasNext() {
		kvResult, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}

		houseRequest := HouseRequest{}
		err = json.Unmarshal(kvResult.Value, &houseRequest)
		if err != nil {
			return shim.Error(err.Error())
		}
		if houseRequest.BidApproved == false && houseRequest.NumberOfBidRecieved >= 1 && houseRequest.BidRequestAccaptance == false {
			results = append(results, houseRequest)
		}
	}
	houseRequestAsBytes, err := json.Marshal(results)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(houseRequestAsBytes)
}
func (s *SmartContract) getBidAgainstAHouseRequest(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	results := []interface{}{}
	resultsIterator, err := stub.GetStateByPartialCompositeKey(prefixBid, []string{})
	if err != nil {
		return shim.Error(err.Error())
	}

	defer resultsIterator.Close()
	for resultsIterator.HasNext() {
		kvResult, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}

		bidRequest := BidRequest{}
		err = json.Unmarshal(kvResult.Value, &bidRequest)
		if err != nil {
			return shim.Error(err.Error())
		}
		if bidRequest.HouseRequestID == args[0] {
			results = append(results, bidRequest)
		}
	}
	bidRequestAsBytes, err := json.Marshal(results)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(bidRequestAsBytes)
}

func (s *SmartContract) approveBidRequest(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 3 {
		return shim.Error("Incorrect number of arguments. Expecting 3")
	}
	key, err := stub.CreateCompositeKey(prefixBid, []string{args[0], args[2]})
	if err != nil {
		return shim.Error(err.Error())
	}
	bidRequestAsBytes, _ := stub.GetState(key)
	if bidRequestAsBytes == nil {
		return shim.Error("Invalid bid")
	}
	bidRequest := BidRequest{}
	err = json.Unmarshal(bidRequestAsBytes, &bidRequest)

	logger.Info(bidRequest)
	key1, err1 := stub.CreateCompositeKey(prefixHouseRequest, []string{args[2]})
	if err != nil {
		return shim.Error(err1.Error())
	}
	houseRequestAsBytes, _ := stub.GetState(key1)
	if houseRequestAsBytes == nil {
		return shim.Error("Invalid house request")
	}
	houseRequest := HouseRequest{}
	err1 = json.Unmarshal(houseRequestAsBytes, &houseRequest)
	if bidRequest.BidStatus == "Accept" || bidRequest.BidStatus == "Reject" {
		return shim.Error("Already accepted or rejected")
	}

	if args[1] == "Accept" {
		houseRequest.BidRequestAccaptance = true
		houseRequest.BidApproved = true
		houseRequest.ApprovedBidID = args[0]
		houseRequest.ApprovedBidConstructionCompany = args[0]
		houseRequest.FundAllocated = bidRequest.BidAmount
		houseRequest.BalanceAmountToPay = houseRequest.FundAllocated
	}
	bidRequest.BidStatus = args[1]
	bidRequestAsBytes, err = json.Marshal(bidRequest)
	if err != nil {
		return shim.Error(err.Error())
	}
	err = stub.PutState(key, bidRequestAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}
	houseRequestAsBytes, err1 = json.Marshal(houseRequest)
	if err1 != nil {
		return shim.Error(err1.Error())
	}
	err1 = stub.PutState(key1, houseRequestAsBytes)
	if err1 != nil {
		return shim.Error(err1.Error())
	}
	return shim.Success([]byte("Bid approved"))

}

func (s *SmartContract) getListofApprovedBid(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	results := []interface{}{}
	resultsIterator, err := stub.GetStateByPartialCompositeKey(prefixHouseRequest, []string{})
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()
	for resultsIterator.HasNext() {
		kvResult, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}

		houseRequest := HouseRequest{}
		err = json.Unmarshal(kvResult.Value, &houseRequest)
		if err != nil {
			return shim.Error(err.Error())
		}
		if houseRequest.BidApproved == true && houseRequest.ApprovedBidConstructionCompany == args[0] && houseRequest.ThirdPaymentStatus == false {
			results = append(results, houseRequest)
		}
	}

	houseRequestAsBytes, err := json.Marshal(results)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(houseRequestAsBytes)

}

func (s *SmartContract) getListofApprovedBidForPlanner(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}
	results := []interface{}{}
	resultsIterator, err := stub.GetStateByPartialCompositeKey(prefixBid, []string{})
	if err != nil {
		return shim.Error(err.Error())
	}
	key, err := stub.CreateCompositeKey(prefixHouseRequest, []string{args[0]})
	if err != nil {
		return shim.Error(err.Error())
	}
	houseRequestAsBytes, err := stub.GetState(key)
	if houseRequestAsBytes == nil {
		return shim.Error("Invalid house request")
	}
	houseRequest := HouseRequest{}

	err = json.Unmarshal(houseRequestAsBytes, &houseRequest)
	defer resultsIterator.Close()
	for resultsIterator.HasNext() {
		kvResult, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}
		bidRequest := BidRequest{}
		err = json.Unmarshal(kvResult.Value, &bidRequest)
		if err != nil {
			return shim.Error(err.Error())
		}
		if houseRequest.BidApproved == true && bidRequest.HouseRequestID == args[0] {
			results = append(results, bidRequest)
		}
	}
	bidRequestAsBytes, err := json.Marshal(results)
	if err != nil {
		return shim.Error(err.Error())
	}
	houseRequestAsBytes, err = json.Marshal(houseRequest)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(bidRequestAsBytes)

}

func (s *SmartContract) updateWorkStatus(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}
	key, err := stub.CreateCompositeKey(prefixHouseRequest, []string{args[0]})
	if err != nil {
		return shim.Error(err.Error())
	}
	houseRequestAsBytes, _ := stub.GetState(key)
	if houseRequestAsBytes == nil {
		return shim.Error("Invalid house request")
	}
	houseRequest := HouseRequest{}
	err = json.Unmarshal(houseRequestAsBytes, &houseRequest)

	if args[1] == "First" && houseRequest.FirstphaseWorkStatus == false {
		houseRequest.Phase = args[1]
		houseRequest.FirstphaseWorkStatus = true
		houseRequest.Status = "First Phase completed"
	} else if args[1] == "Second" && houseRequest.FirstphaseWorkStatus == true && houseRequest.FirstPaymentStatus == true && houseRequest.SecondphaseWorkStatus == false {
		houseRequest.Phase = args[1]
		houseRequest.SecondphaseWorkStatus = true
		houseRequest.Status = "Second Phase completed"
	} else if args[1] == "Third" && houseRequest.SecondphaseWorkStatus == true && houseRequest.SecondPaymentStatus == true && houseRequest.ThirdphaseWorkStatus == false {
		houseRequest.Phase = args[1]
		houseRequest.ThirdphaseWorkStatus = true
		houseRequest.Status = "Third Phase Completed"
	} else {
		return shim.Error("Can't update work status, Invalid phase")
	}

	houseRequestAsBytes, err = json.Marshal(houseRequest)
	if err != nil {
		return shim.Error(err.Error())
	}
	err = stub.PutState(key, houseRequestAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success([]byte("successfully completed first phase"))

}
func (s *SmartContract) listofPaymentrequest(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	results := []interface{}{}
	resultsIterator, err := stub.GetStateByPartialCompositeKey(prefixHouseRequest, []string{})
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()
	for resultsIterator.HasNext() {
		kvResult, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}

		houseRequest := HouseRequest{}

		err = json.Unmarshal(kvResult.Value, &houseRequest)
		if err != nil {
			return shim.Error(err.Error())
		}

		if (houseRequest.FirstphaseWorkStatus == true && houseRequest.FirstPaymentStatus == false) || (houseRequest.SecondphaseWorkStatus == true && houseRequest.SecondPaymentStatus == false) || (houseRequest.ThirdphaseWorkStatus == true && houseRequest.ThirdPaymentStatus == false && houseRequest.ConstructionCompletedAndVerified == true) {
			results = append(results, houseRequest)
		}
	}
	houseRequestAsBytes, err := json.Marshal(results)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(houseRequestAsBytes)

}

func (s *SmartContract) Payment(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 4 {
		return shim.Error("Incorrect number of arguments. Expecting 4")
	}
	key, err := stub.CreateCompositeKey(prefixHouseRequest, []string{args[0]})
	if err != nil {
		return shim.Error(err.Error())
	}
	houseRequestAsBytes, _ := stub.GetState(key)
	if houseRequestAsBytes == nil {
		return shim.Error("Invalid house request")
	}
	houseRequest := HouseRequest{}
	err = json.Unmarshal(houseRequestAsBytes, &houseRequest)
	key1, err1 := stub.CreateCompositeKey(prefixBid, []string{args[1], args[0]})
	if err1 != nil {
		return shim.Error(err1.Error())
	}
	bidRequestAsBytes, _ := stub.GetState(key1)
	if bidRequestAsBytes == nil {
		return shim.Error("Invalid bid request")
	}
	bidRequest := BidRequest{}
	err1 = json.Unmarshal(bidRequestAsBytes, &bidRequest)

	//if houseRequest.BalanceAmountToPay < bidRequest.Amount {
	//return shim.Error("Amount should be less than the balance amount to pay.")
	phasePayment, _ := strconv.ParseFloat(args[3], 64)
	if phasePayment > houseRequest.BalanceAmountToPay {
		return shim.Error("First phase payment should be less than balance amount to pay")
	}
	if args[2] == "First" && houseRequest.FirstphaseWorkStatus == true && houseRequest.FirstPaymentStatus == false {
		houseRequest.Phase = args[2]
		houseRequest.FirstphasePayment = phasePayment
		bidRequest.Amount = bidRequest.Amount + phasePayment
		houseRequest.BalanceAmountToPay = houseRequest.BalanceAmountToPay - phasePayment
		houseRequest.FirstPaymentStatus = true
		houseRequest.Status = "First Phase Payment Completed"
	} else if args[2] == "Second" && houseRequest.SecondphaseWorkStatus == true && houseRequest.FirstPaymentStatus == true && houseRequest.SecondPaymentStatus == false {
		houseRequest.Phase = args[2]
		houseRequest.SecondphasePayment = phasePayment
		bidRequest.Amount = bidRequest.Amount + phasePayment
		houseRequest.BalanceAmountToPay = houseRequest.BalanceAmountToPay - phasePayment
		houseRequest.SecondPaymentStatus = true
		houseRequest.Status = "Second Phase Payment Completed"

	} else if args[2] == "Third" && houseRequest.ThirdphaseWorkStatus == true && houseRequest.SecondPaymentStatus == true && houseRequest.ThirdPaymentStatus == false {
		houseRequest.Phase = args[2]

		houseRequest.ThirdphasePayment = phasePayment
		if houseRequest.ThirdphasePayment != houseRequest.BalanceAmountToPay {
			return shim.Error("Third payment should be equal to balance amount")
		}
		bidRequest.Amount = bidRequest.Amount + phasePayment
		houseRequest.BalanceAmountToPay = houseRequest.BalanceAmountToPay - phasePayment
		houseRequest.ThirdPaymentStatus = true

		houseRequest.Status = "Third Phase Payment Completed"

	} else {
		return shim.Error("Unable to pay")
	}

	houseRequestAsBytes, err = json.Marshal(houseRequest)
	if err != nil {
		return shim.Error(err.Error())
	}
	err = stub.PutState(key, houseRequestAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	bidRequestAsBytes, err1 = json.Marshal(bidRequest)
	if err1 != nil {
		return shim.Error(err1.Error())
	}
	err1 = stub.PutState(key1, bidRequestAsBytes)
	if err1 != nil {
		return shim.Error(err1.Error())
	}
	return shim.Success([]byte("Payment Completed"))

}

func (s *SmartContract) UserUpdation(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}
	key, err := stub.CreateCompositeKey(prefixHouseRequest, []string{args[0]})
	if err != nil {
		return shim.Error(err.Error())
	}
	houseRequestAsBytes, err := stub.GetState(key)
	if houseRequestAsBytes == nil {
		return shim.Error("Invalid house request")
	}
	houseRequest := HouseRequest{}
	err = json.Unmarshal(houseRequestAsBytes, &houseRequest)
	if err != nil {
		return shim.Error(err.Error())
	}
	if houseRequest.ThirdphaseWorkStatus == true {

		houseRequest.ConstructionCompletedAndVerified = true
	}

	houseRequestAsBytes, err = json.Marshal(houseRequest)
	if err != nil {
		return shim.Error(err.Error())
	}
	err = stub.PutState(key, houseRequestAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success([]byte("successfully completed House"))

}

func (s *SmartContract) CompletedHouseList(stub shim.ChaincodeStubInterface) pb.Response {
	results := []interface{}{}
	resultsIterator, err := stub.GetStateByPartialCompositeKey(prefixHouseRequest, []string{})
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()
	for resultsIterator.HasNext() {
		kvResult, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}
		houseRequest := HouseRequest{}
		err = json.Unmarshal(kvResult.Value, &houseRequest)
		if err != nil {
			return shim.Error(err.Error())
		}
		if houseRequest.ThirdPaymentStatus == true && houseRequest.ConstructionCompletedAndVerified == true {
			results = append(results, houseRequest)
		}
	}
	houseRequestAsBytes, err := json.Marshal(results)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(houseRequestAsBytes)

}
