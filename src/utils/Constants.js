import cookie from "react-cookies";

export const PUBLIC_AUTH_KEY = cookie.load("PublicAuthKey");
export const LEAD_ID = cookie.load("LeadId");
export const PRIVATE_AUTH_KEY = cookie.load("AuthKey");
export const SERVICE_URL = "https://portalapi-in21.leadsquared.com";
export const ACCESS_KEY = "u$r9bc43e3229bf555d65bbd40d0239152e";
export const SECRET_KEY = "15e36a8c8b511f239fca2218404dcc045087ca4c";
export const ENQUIRY_FORM_ID = "2197ea44-ddd0-11e9-aebf-02b00a4d022c";
export const APPLICATION_FORM_ID = "3c6c587e-df79-11e9-aebf-02b00a4d022c";
export const BRANCHES = [
  { value: "PSBN", label: "Bangalore North" },
  { value: "PSBS", label: "Bangalore South" },
  { value: "PSBE", label: "Bangalore East" },
  { value: "PSMNG", label: "Mangalore" },
  { value: "PSNLO", label: "Nandini Layout" },
  { value: "PSRTN", label: "R.T Nagar" },
  { value: "SPES", label: "ST Paul / Jaynagar" },
];
export const getBranchName = () => {
  let branchName = "";
  if (localStorage.getItem("branchName")) {
    let branch = BRANCHES.find( branch => branch.value === localStorage.getItem("branchName"))
    if(branch){
      branchName = branch.label
    }
  }
  return branchName;
};
