export const validateSignupCredentials = (values, setErrors) => {
  const errors = {};
  const phoneNumberRegex = /^09\d{9}$/;
  trimAllValues(values);

  if (!values.firstName.trim()) {
    errors.firstName = "First Name is required";
  }
  if (!values.lastName.trim()) {
    errors.lastName = "Last Name is required";
  }
  if (!values.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Invalid email format";
  }
  if (!values.birthday) {
    errors.birthday = "Birthdate is required";
  }

  if (!values.address.street.trim()) {
    errors.street = "Street/Sitio is required";
  }
  if (!values.address.barangay.trim()) {
    errors.barangay = "Please select your barangay";
  }

  if (!values.sex.trim()) {
    errors.sex = "Please select your sex";
  }

  if (!values.contact_no.trim()) {
    errors.contactNum = "Contact Number is required";
  }
  if (
    !!values.contact_no.trim() &&
    !phoneNumberRegex.test(values.contact_no.trim())
  ) {
    errors.contactNum = "Invalid contact number";
    console.log(phoneNumberRegex.test(values.contact_no.trim()));
  }

  if (!values.password) {
    errors.password = "Password is required";
  } else if (values.password.length < 6) {
    errors.password = "Password must be at least 6 characters long";
  }
  if (!values.confirmPassword) {
    errors.confirmPassword = "Confirm password is required";
  }

  if (
    values.password !== values.confirmPassword &&
    !!values.password &&
    !!values.confirmPassword
  ) {
    errors.passwordNotMatch = "Password do not match";
  }

  const isValid = Object.keys(errors).length === 0;
  if (isValid) {
    setErrors(null);
  } else {
    setErrors(errors);
  }

  return { valid: isValid };
};

function trimAllValues(obj) {
  for (const key in obj) {
    if (typeof obj[key] === "string") {
      obj[key] = obj[key].trim();
    } else if (typeof obj[key] === "object" && obj[key] !== null) {
      trimAllValues(obj[key]); // Recursively trim nested object values
    }
  }
}

export const authError = (errorCode) => {
  switch (errorCode) {
    case "auth/invalid-credential":
      return "Invalid login credential";
    case "auth/invalid-email":
      return "Invalid Email";
    case "auth/missing-password":
      return "Missing password";
    case "auth/email-already-in-use":
      return "Email already in use";
  }
};
