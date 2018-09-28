

export class UtilService {

    public static url="http://192.168.0.12:4000/api/v1/";

    public static token= sessionStorage.getItem("token");
    public static  User= sessionStorage.getItem("User");
    public static  role= sessionStorage.getItem("role");

  houserequestid:string ="";

  sethouserequestid(id){
    this.houserequestid=id;
  }
  gethouserequestid(){
    return this.houserequestid;
  }
  }
