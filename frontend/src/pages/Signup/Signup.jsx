import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import signupStyle from "./Signup.module.css";
import { FcGoogle } from "react-icons/fc";
import { GlobalContext } from "../../context/Context";

import {
  checkIfMinimumThanMinValue,
  checkIsEmailInvalid,
  checkIsEmpty,
  checkIsNotADigit,
  checkPasswordDontmatch,
} from "../../utils/validations";
import { signup } from "../../Api/services";

const Signup = (props) => {
  const navigate = useNavigate();
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [contactNumberError, setContactNumberError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");

  useEffect(() => {
    if (localStorage.getItem("access")) {
      navigate("/");
    }
  }, []);

  const isValidOnBlur = (input, value) => {
    if (input == "email") {
      if (checkIsEmpty(value)) {
        setEmailError("Please enter email address");
        return false;
      } else {
        if (checkIsEmailInvalid(value)) {
          setEmailError("Please type correct email format");
          return false;
        }
      }
    }
    if (input == "password") {
      if (checkIsEmpty(value)) {
        setPasswordError("Please enter password");
        return false;
      } else {
        if (checkIfMinimumThanMinValue(value, 8)) {
          setPasswordError("Password must contain 8 characters");
        }
      }
    }

    if (input == "first_name") {
      if (checkIsEmpty(value)) {
        setFirstNameError("Please enter First Name");
        return false;
      }
    }
    if (input == "last_name") {
      if (checkIsEmpty(value)) {
        setLastNameError("Please enter Last Name");
        return false;
      }
    }
    if (input == "contact_number") {
      if (checkIsEmpty(value)) {
        setContactNumberError("Please enter Contact Number");
        return false;
      } else {
        if (checkIsNotADigit(value)) {
          setContactNumberError("Please type Contact Number poperly");
          return false;
        }
      }
    }
    if (input === "confirm_password") {
      if (checkIsEmpty(value)) {
        setConfirmPasswordError("Please re-enter password");
        return false;
      } else {
        if (
          checkPasswordDontmatch(
            document.getElementsByName("password")[0].value,
            value
          )
        ) {
          setConfirmPasswordError("Passwords do not match");
          return false;
        }
      }
    }
  };

  const isValidOnSubmit = (data) => {
    if (checkIsEmpty(data.email)) {
      setEmailError("Please enter email address");
      return false;
    } else {
      if (checkIsEmailInvalid(data.email)) {
        setEmailError("Please type correct email format");
        return false;
      }
    }

    if (checkIsEmpty(data.password)) {
      setPasswordError("Please enter password");
      return false;
    } else {
      if (checkIfMinimumThanMinValue(data.password, 8)) {
        setPasswordError("Password must contain 8 characters");
      }
    }

    if (checkIsEmpty(data.first_name)) {
      setFirstNameError("Please enter First Name");
      return false;
    }
    if (checkIsEmpty(data.last_name)) {
      setLastNameError("Please enter Last Name");
      return false;
    }
    if (checkIsEmpty(data.contact_number)) {
      setLastNameError("Please enter ContactNumber");
      return false;
    } else {
      if (checkIsNotADigit(data.contact_number)) {
        setContactNumberError("Please type Contact Number of 10 digits");
        return false;
      }
    }
    if (checkIsEmpty(data.confirm_password)) {
      setConfirmPasswordError("Please re-enter password ");
      return false;
    } else {
      if (checkPasswordDontmatch(data.password, data.confirm_password)) {
        setConfirmPasswordError("Invalid Password Matching");
        return false;
      }
    }

    return true;
  };

  const postSignupDetails = async (e) => {
    const data = {
      email: e.target.email.value,
      password: e.target.password.value,

      confirm_password: e.target.confirm_password.value,
      first_name: e.target.first_name.value,
      last_name: e.target.last_name.value,
      contact_number: e.target.contact_number.value,
    };
    if (isValidOnSubmit(data)) {
      const response = await signup(data);
      if (response.success) {
        navigate("/login");
      } else {
        console.error("Signup failed:", response.error);
      }
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    postSignupDetails(e);
  };

  return (
    <div className={`${signupStyle.pageFrame}`}>
      <div className={`${signupStyle.coloredBackground}`}>
        <div
          className={`${signupStyle.signupImage}`}
          style={{ color: "#ffe8e8" }}
        >
          <div className={`${signupStyle.imageText}`}>
            Create Your Free Account Here
            <div className={`${signupStyle.imageText2}`}>
              Register your account and book hotels instantly with HMS!
            </div>
          </div>
        </div>
        <div className={`${signupStyle.pageContainer}`}>
          <form onSubmit={handleSubmit}>
            <div className={`${signupStyle.formInputContainer}`}>
              <div className={`${signupStyle.inputPair}`}>
                <div className={`${signupStyle.inputLabel}`}>
                  <span className={signupStyle.mandatoryField}>* </span>
                  Email ID
                </div>

                <input
                  className={`${signupStyle.formInput}`}
                  type="text"
                  name="email"
                  maxLength={50}
                  onChange={(e) => setEmailError("")}
                  onBlur={(e) => isValidOnBlur("email", e.target.value)}
                />
              </div>
              <div className={`${signupStyle.formInputError}`}>
                {emailError}
              </div>
            </div>
            <div className={`${signupStyle.formInputContainer}`}>
              <div className={`${signupStyle.inputPair}`}>
                <div className={`${signupStyle.inputLabel}`}>
                  <span className={signupStyle.mandatoryField}>* </span>
                  Create Password
                </div>

                <input
                  className={`${signupStyle.formInput}`}
                  type="password"
                  autoComplete="new-password"
                  name="password"
                  maxLength={12}
                  onChange={(e) => setPasswordError("")}
                  onBlur={(e) => isValidOnBlur("password", e.target.value)}
                />
              </div>
              <div className={`${signupStyle.formInputError}`}>
                {passwordError}
              </div>
            </div>
            <div className={`${signupStyle.formInputContainer}`}>
              <div className={`${signupStyle.inputPair}`}>
                <div className={`${signupStyle.inputLabel}`}>
                  <span className={signupStyle.mandatoryField}>* </span>
                  Re-enter Password
                </div>

                <input
                  className={`${signupStyle.formInput}`}
                  type="password"
                  autoComplete="confirm-password"
                  name="confirm_password"
                  maxLength={12}
                  onChange={(e) => setConfirmPasswordError("")}
                  onBlur={(e) =>
                    isValidOnBlur("confirm_password", e.target.value)
                  }
                />
              </div>
              <div className={`${signupStyle.formInputError}`}>
                {confirmPasswordError}
              </div>
            </div>

            <div className={`${signupStyle.formInputContainer}`}>
              <div className={`${signupStyle.inputPair}`}>
                <div className={`${signupStyle.inputLabel}`}>
                  <span className={signupStyle.mandatoryField}>* </span>
                  First Name
                </div>

                <input
                  className={`${signupStyle.formInput}`}
                  type="text"
                  name="first_name"
                  maxLength={50}
                  onChange={(e) => setFirstNameError("")}
                  onBlur={(e) => isValidOnBlur("first_name", e.target.value)}
                />
              </div>
              <div className={`${signupStyle.formInputError}`}>
                {firstNameError}
              </div>
            </div>

            <div className={`${signupStyle.formInputContainer}`}>
              <div className={`${signupStyle.inputPair}`}>
                <div className={`${signupStyle.inputLabel}`}>
                  <span className={signupStyle.mandatoryField}>* </span>
                  Last Name
                </div>

                <input
                  className={`${signupStyle.formInput}`}
                  type="text"
                  name="last_name"
                  maxLength={50}
                  onChange={(e) => setLastNameError("")}
                  onBlur={(e) => isValidOnBlur("last_name", e.target.value)}
                />
              </div>
              <div className={`${signupStyle.formInputError}`}>
                {lastNameError}
              </div>
            </div>

            <div className={`${signupStyle.formInputContainer}`}>
              <div className={`${signupStyle.inputPair}`}>
                <div className={`${signupStyle.inputLabel}`}>
                  <span className={signupStyle.mandatoryField}>* </span>
                  Contact Number
                </div>

                <input
                  className={`${signupStyle.formInput}`}
                  type="text"
                  name="contact_number"
                  maxLength={10}
                  onChange={(e) => setContactNumberError("")}
                  onBlur={(e) =>
                    isValidOnBlur("contact_number", e.target.value)
                  }
                />
              </div>

              <div className={`${signupStyle.formInputError}`}>
                {contactNumberError}
              </div>
            </div>

            <div className={`${signupStyle.formButtonContainer}`}>
              <input
                className={`${signupStyle.submitButton}`}
                type="submit"
                value={"Signup"}
              />
            </div>
            <div className={`${signupStyle.textButtons}`}>
              <div style={{ marginBottom: "10px", marginTop: "10px" }}>
                <Link to="/login">Click here if Already Registered </Link>
              </div>
              <div
                className={`${signupStyle.googleSignup}`}
                style={{ marginTop: "10px", width: "50%" }}
              >
                <FcGoogle /> Sign-up with Google
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
