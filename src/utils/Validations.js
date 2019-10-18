export const checkPassword = sPassword => {
  if (sPassword) {
    // let regPassword = /^(?=.*\d).{8,}$/;
    let regPassword = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!sPassword.match(regPassword)) {
      // return "Password has to be at least 8 chars long including one small, one capital and one special character";
      return "Min 8 characters with one number and one special character";
    }
    return null;
  }
  return "Required";
};

export const validateName = name => {
  if (name) {
    if (name.toString().length < 3) {
      return "Must be Min 3 Characters";
    }
    return null;
  }
  return "Required";
};

export const validateGrades = grade => {
  if (grade) {
    return null;
  }
  return "Required";
};

export const validateDob = dob => {
  if (dob) {
    return null;
  }
  return "Required";
};

export const required = string => {
  if (string) {
    return null;
  }
  return "Required";
};

export const validateEmail = sEmail => {
  if (sEmail) {
    let reEmail = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
    if (!sEmail.match(reEmail)) {
      return "Must be Valid";
    }
    return null;
  }
  return "Required";
};

export const validateMobile = mobile => {
  if (mobile) {
    if (mobile.length !== 10) {
      return "Mobile no. should be 10 digit";
    }
    return null;
  }
  return "Required";
};

export const validatePassword = (password, confirmPassword) => {
  if (confirmPassword) {
    if (password === confirmPassword) {
      return;
    }
    return "Didn't Match, Try Again.";
  }
  return "Required";
};
