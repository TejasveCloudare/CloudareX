/**Created By Tejasve Gupta on 26-05-2024
 * Reason - Reset new password
 */

import React, { useState } from "react";
import forgotStyle from "./ForgotPassword.module.css";
import {
  sendOtpApi,
  verifyOtpApi,
  updatePasswordApi,
} from "../../Api/services";
import { Link } from "react-router-dom";
// import { useLocation, useNavigate } from "react-router-dom";


const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailErrors, setEmailErrors] = useState([]);
  const [otpErrors, setOtpErrors] = useState([]);
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [confirmPasswordErrors, setConfirmPasswordErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  /**Code Added By Tejasve Gupta on 26-05-2024
   * Reason - To validate email
   */
  function validateEmail(text) {
    const errors = [];
    if (!text) {
      errors.push("Please enter Email");
    } else if (
      !text.match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    ) {
      errors.push(
        "Please enter Email in the correct format (example@gmail.com)"
      );
    }
    return errors;
  }
  /**End of Code Added By Tejasve Gupta on 26-05-2024
   * Reason - To validate email
   */

  /**Code Added By Tejasve Gupta on 26-05-2024
   * Reason - To validate otp
   */

  function validateOtp(text) {
    const errors = [];
    if (!text) {
      errors.push("Please enter OTP");
    } else if (text.length < 4) {
      errors.push("OTP should not be less than 4 digits");
    }
    return errors;
  }
  /**End of Code Added By Tejasve Gupta on 26-05-2024
   * Reason - To validate otp
   */

  /**Code Added By Tejasve Gupta on 26-05-2024
   * Reason - To validate password
   */
  function validatePassword(text) {
    const errors = [];
    if (!text) {
      errors.push("Please enter a new password");
    } else if (text.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }
    return errors;
  }

  function validateConfirmPassword(text) {
    const errors = [];
    if (!text) {
      errors.push("Please confirm your password");
    } else if (text !== newPassword) {
      errors.push("Password and confirm password should be the same");
    }
    return errors;
  }
  /**End of Code Added By Tejasve Gupta on 26-05-2024
   * Reason - To validate password
   */

  /**Code Added By Tejasve Gupta on 26-05-2024
   * Reason - Button to Handle Email Submission for Password resetting
   */
  async function handleEmailSubmit(e) {
    e.preventDefault();
    /**Code commented By Tejasve Gupta on 27-05-2024
     * Reason - Unnecessary Code
     */
    // const formData = new FormData(e.currentTarget);
    /**End of Code commented By Tejasve Gupta on 27-05-2024
     * Reason - Unnecessary Code
     */
    const inputEmail = e.currentTarget.email.value;
    const emailValidationErrors = validateEmail(inputEmail);

    setEmailErrors(emailValidationErrors);
    if (emailValidationErrors.length === 0) {
      try {
        const res = await sendOtpApi({ email: inputEmail });
        if (res.msg) {
          setSuccessMessage(res.msg);
          setEmail(inputEmail);
          setErrorMessage("");
          setStep(2);
        } else {
          setErrorMessage(
            res.error || "Something went wrong! Please try again later."
          );
          setSuccessMessage("");
        }
      } catch (err) {
        setErrorMessage("Something went wrong! Please try again later.");
        setSuccessMessage("");
      }
    }
  }
  /** End of Code Added By Tejasve Gupta on 26-05-2024
   * Reason - Button to Handle Email Submission for Password resetting
   */

  /**Code Added By Tejasve Gupta on 26-05-2024
   * Reason - Button to Handle otp Submission for Password resetting
   */
  async function handleOtpSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const inputOtp = formData.get("otp");
    const otpValidationErrors = validateOtp(inputOtp);

    setOtpErrors(otpValidationErrors);
    if (otpValidationErrors.length === 0) {
      try {
        const res = await verifyOtpApi({ email: email, otp: inputOtp });
        if (res.msg) {
          setSuccessMessage(res.msg);
          setOtp(inputOtp);
          setErrorMessage("");
          setStep(3);
        } else {
          setErrorMessage(res.error || "Invalid OTP. Please try again.");
          setSuccessMessage("");
        }
      } catch (err) {
        setErrorMessage("Something went wrong! Please try again later.");
        setSuccessMessage("");
      }
    }
  }
  /**End of Code Added By Tejasve Gupta on 26-05-2024
   * Reason - Button to Handle otp Submission for Password resetting
   */

  /**Code Added By Tejasve Gupta on 26-05-2024
   * Reason - Button to Handle password Submission for Password resetting
   */
  async function handlePasswordSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const inputPassword = formData.get("newPassword");
    const inputConfirmPassword = formData.get("confirmPassword");
    const passwordValidationErrors = validatePassword(inputPassword);
    const confirmPasswordValidationErrors =
      validateConfirmPassword(inputConfirmPassword);

    setPasswordErrors(passwordValidationErrors);
    setConfirmPasswordErrors(confirmPasswordValidationErrors);

    if (
      passwordValidationErrors.length === 0 &&
      confirmPasswordValidationErrors.length === 0
    ) {
      try {
        const res = await updatePasswordApi({
          email,
          password: inputPassword,
        });
        if (res.msg) {
          setSuccessMessage(res.msg);
          setErrorMessage("");
          setStep(4);
        } else {
          setErrorMessage(
            res.error || "Something went wrong! Please try again later."
          );
          setSuccessMessage("");
        }
      } catch (err) {
        setErrorMessage("Something went wrong! Please try again later.");
        setSuccessMessage("");
      }
    }
  }
  /**End of Code Added By Tejasve Gupta on 26-05-2024
   * Reason - Button to Handle password Submission for Password resetting
   */

  return (
    <div className={forgotStyle.pageFrame}>
      <div className={forgotStyle.coloredBackground}>
        <div className={forgotStyle.loginImage} style={{ color: "#ffe8e8" }}>
          <div className={forgotStyle.imageText}>
            Forgot Password?
            <div className={forgotStyle.imageText2}>
              Don't worry! You can easily reset your password here.
            </div>
          </div>
        </div>
        <div className={forgotStyle.pageContainer}>
          {step === 1 && (
            <form onSubmit={handleEmailSubmit}>
              <div className={forgotStyle.formInputContainer}>
                <div className={forgotStyle.inputLabel}>
                  <span className={forgotStyle.mandatoryField}>* </span>
                  Enter Your Email
                </div>
                <input
                  className={forgotStyle.formInput}
                  type="text"
                  name="email"
                  maxLength={50}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailErrors([]);
                    setErrorMessage("");
                    setSuccessMessage("");
                  }}
                />
                {emailErrors.map((error, index) => (
                  <div key={index} className={forgotStyle.formInputError}>
                    {error}
                  </div>
                ))}
              </div>
              {successMessage && (
                <div className={forgotStyle.formInputSuccess}>
                  {successMessage}
                </div>
              )}
              {errorMessage && (
                <div className={forgotStyle.formInputError}>{errorMessage}</div>
              )}
              <div className={forgotStyle.formButtonContainer}>
                <input
                  type="submit"
                  value="Send OTP"
                  className={forgotStyle.submitButton}
                />
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleOtpSubmit}>
              <div className={forgotStyle.formInputContainer}>
                <div className={forgotStyle.inputLabel}>
                  <span className={forgotStyle.mandatoryField}>* </span>
                  Enter OTP
                </div>
                <input
                  className={forgotStyle.formInput}
                  type="text"
                  name="otp"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value);
                    setOtpErrors([]);
                    setErrorMessage("");
                    setSuccessMessage("");
                  }}
                />
                {otpErrors.map((error, index) => (
                  <div key={index} className={forgotStyle.formInputError}>
                    {error}
                  </div>
                ))}
              </div>
              {successMessage && (
                <div className={forgotStyle.formInputSuccess}>
                  {successMessage}
                </div>
              )}
              {errorMessage && (
                <div className={forgotStyle.formInputError}>{errorMessage}</div>
              )}
              <div className={forgotStyle.formButtonContainer}>
                <input
                  type="submit"
                  value="Verify OTP"
                  className={forgotStyle.submitButton}
                />
              </div>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handlePasswordSubmit}>
              <div className={forgotStyle.formInputContainer}>
                <div className={forgotStyle.inputLabel}>
                  <span className={forgotStyle.mandatoryField}>* </span>
                  Enter New Password
                </div>
                <input
                  className={forgotStyle.formInput}
                  type="password"
                  name="newPassword"
                  maxLength={50}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setPasswordErrors([]);
                    setErrorMessage("");
                    setSuccessMessage("");
                  }}
                />
                <div className={forgotStyle.inputLabel}>
                  <span className={forgotStyle.mandatoryField}>* </span>
                  Confirm New Password
                </div>
                <input
                  className={forgotStyle.formInput}
                  type="password"
                  name="confirmPassword"
                  maxLength={50}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setConfirmPasswordErrors([]);
                    setErrorMessage("");
                    setSuccessMessage("");
                  }}
                />
                {passwordErrors
                  .concat(confirmPasswordErrors)
                  .map((error, index) => (
                    <div key={index} className={forgotStyle.formInputError}>
                      {error}
                    </div>
                  ))}
              </div>
              {successMessage && (
                <div className={forgotStyle.formInputSuccess}>
                  {successMessage}
                </div>
              )}
              {errorMessage && (
                <div className={forgotStyle.formInputError}>{errorMessage}</div>
              )}
              <div className={forgotStyle.formButtonContainer}>
                <input
                  type="submit"
                  value="Reset Password"
                  className={forgotStyle.submitButton}
                />
              </div>
            </form>
          )}

          {step === 4 && (
            <div className={forgotStyle.successMessage}>
              Your password has been reset successfully. You can now log in with
              your new password.
              <div style={{ marginBottom: "10px", marginTop: "10px"}}>
                <Link to="/login" >Move to Login Page</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

/**End of Creation by Tejasve Gupta */
