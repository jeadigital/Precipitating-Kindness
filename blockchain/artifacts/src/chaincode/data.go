package main

type HouseOwner struct {
	UserID       string `json:"UserID"`
	MobileNumber string `json:"MobileNumber"`
	AadharNumber string `json:"AadharNumber"`
	Password     string `json:"Password"`
	Role         string `json:"Role"`
}

type Participant struct {
	UserID   string `json:"UserID"`
	Password string `json:"Password"`
	Role     string `json:"Role"`
}

type HouseRequest struct {
	HouseRequestID                   string  `json:"HouseRequestID"`
	UserID                           string  `json:"UserID"`
	HouseLocation                    string  `json:"HouseLocation"`
	PropertyID                       string  `json:"PropertyID"`
	HouseNumber                      string  `json:"HouseNumber"`
	DamageDetails                    string  `json:"DamageDetails"`
	HouseRequestAccaptance           bool    `json:"HouseRequestAccaptance"`
	LandSurveyCompleted              bool    `json:"LandSurveyCompleted"`
	LandNeeded                       bool    `json:"LandNeeded"`
	PlanApproved                     bool    `json:"PlanApproved"`
	ApprovedPlanID                   string  `json:"ApprovedPlanID"`
	BidApproved                      bool    `json:"BidApproved"`
	ApprovedBidID                    string  `json:"ApprovedBidID"`
	ApprovedBidConstructionCompany   string  `json:"ApprovedBidConstructionCompany"`
	FundAllocated                    float64 `json:"FundAllocated"`
	BalanceAmountToPay               float64 `json:"BalanceAmountToPay"`
	Status                           string  `json:"Status"`
	Remarks                          string  `json:"Remarks"`
	FirstphaseWorkStatus             bool    `json:"FirstphaseWorkStatus"`
	SecondphaseWorkStatus            bool    `json:"SecondphaseWorkStatus"`
	ThirdphaseWorkStatus             bool    `json:"ThirdphaseWorkStatus"`
	FirstPaymentStatus               bool    `json:"FirstPaymentStatus"`
	SecondPaymentStatus              bool    `json:"SecondPaymentStatus"`
	ThirdPaymentStatus               bool    `json:"ThirdPaymentStatus"`
	FirstphasePayment                float64 `json:"FirstphasePayment"`
	SecondphasePayment               float64 `json:"SecondphasePayment"`
	ThirdphasePayment                float64 `json:"ThirdphasePayment"`
	NumberOfPlanRecieved             int     `json:"NumberOfPlanRecieved"`
	NumberOfBidRecieved              int     `json:"NumberOfBidRecieved"`
	ConstructionCompletedAndVerified bool    `json:"ConstructionCompletedAndVerified"`
	ConstructionApproval             bool    `json:"ConstructionApproval"`
	Phase                            string  `json:"Phase"`
	BidRequestAccaptance             bool    `json:"BidRequestAccaptance"`
	Village                          string  `json:"Village"`
	District                         string  `json:"District"`
	HouseArea                        string  `json:"HouseArea"`
	PlotArea                         string  `json:"PlotArea"`
	MaxConstructionArea              string  `json:"MaxConstructionArea"`
}

type HousePlan struct {
	HouseRequestID   string `json:"HouseRequestID"`
	ArchitectID      string `json:"ArchitectID"`
	HousePlanID      string `json:"HousePlanID"`
	PlanDetails      string `json:"PlanDetails"`
	Approved         bool   `json:"Approved"`
	PlanArea         string `json:"PlanArea"`
	NumberOfBedRooms int    `json:"NumberOfBedRooms"`
}

type BidRequest struct {
	BidRequestID          string  `json:"BidRequestID"`
	BidStatus             string  `json:"BidStatus"`
	HouseRequestID        string  `json:"HouseRequestID"`
	ConstructionCompanyID string  `json:"ConstructionCompanyID"`
	BidAmount             float64 `json:"BidAmount"`
	Amount                float64 `json:"Amount"`
	Status                bool    `json:"Status"`
	AllotedTime           string  `json:"AllotedTime"`
}

type PaymentHistory struct {
	ConstructionCompanyID string  `json:"ConstructionCompanyID"`
	Amount                float64 `json:"Amount"`
	HouseRequestID        string  `json:"HouseRequestID"`
}
