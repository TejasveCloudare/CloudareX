import { useContext, useEffect, useState } from "react";
import loginStyle from "./Login.module.css";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { googleLogin, getLoginQuotesData } from "../../Api/services";
import { GlobalContext } from "../../context/Context";
import { baseURL } from "../../Api/config";
import { Outlet } from "react-router-dom";

const Login = () => {
  const { setUser } = useContext(GlobalContext);
  const navigate = useNavigate();

  const [data, setData] = useState({ quotes: [], representing_companies: [] });
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch quotes & companies from API
  useEffect(() => {
    const fetchData = async () => {
      const res = await getLoginQuotesData();
      if (res.quotes && res.representing_companies) {
        setData(res);
      }
    };
    fetchData();
  }, []);

  // Auto slider for quotes
  useEffect(() => {
    if (data.quotes.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % data.quotes.length);
      }, 200000);
      return () => clearInterval(interval);
    }
  }, [data.quotes.length]);

  const handlePrev = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + data.quotes.length) % data.quotes.length
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % data.quotes.length);
  };

  const quote = data.quotes[currentIndex] || {};

  // Redirect if already logged in
  // useEffect(() => {
  //   if (localStorage.getItem("access")) {
  //     navigate("/dashboard");
  //   }
  // }, [navigate]);

  const linkedInLogin = () => {
    const clientId = "77c7otz5y1k89e";
    const redirectUri = `${window.location.origin}/linkedin`;
    const scope = "openid profile email w_member_social";
    const state = "some_random_string";
    const responseType = "code";

    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=${responseType}&client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=${encodeURIComponent(scope)}&state=${state}`;

    window.location.href = authUrl;
  };

  return (
    <div className={loginStyle.container}>
      {/* Left Section */}
      <div className={loginStyle.leftSection}>
        <h2>Welcome to CloudareX Talent</h2>
        <p>The fastest hiring network for product and growth in India.</p>
        <p>
          <strong>Hello! 👋 Let’s create your account.</strong>
        </p>

        <div className={loginStyle.loginButtons}>
          <GoogleLogin
            className={loginStyle.GoogleLogin}
            onSuccess={async (credentialResponse) => {
              const decoded = jwtDecode(credentialResponse.credential);
              const googlePayload = {
                email: decoded.email,
                first_name: decoded.given_name,
                last_name: decoded.family_name || "",
                contact_number: "9999999999",
              };

              try {
                const data = await googleLogin(googlePayload);
                if (data.access && data.refresh) {
                  localStorage.setItem("access", data.access);
                  localStorage.setItem("refresh", data.refresh);
                  setUser(data.user);

                  if (data.is_new_user) {
                    // For first-time login
                    navigate("/workspace", {
                      state: { email: data.user.email },
                    });
                  } else {
                    navigate("/dashboard", {
                      state: { email: data.user.email },
                    });
                  }
                }
              } catch (error) {
                console.error("Google login error:", error);
              }
            }}
            onError={() => {
              console.error("Google login failed");
            }}
          />
          <button className={loginStyle.linkedinBtn} onClick={linkedInLogin}>
            Continue with LinkedIn
          </button>
        </div>

        <p className={loginStyle.tos}>
          By continuing, you agree to our Terms of Service and communications
          policy.
        </p>
      </div>

      {/* Right Section */}
      <div className={loginStyle.rightSection}>
        <div className={loginStyle.quoteSection}>
          {quote.text && (
            <>
              <p className={loginStyle.quote}>“{quote.text}”</p>
              <div className={loginStyle.authorRow}>
                <div className={loginStyle.authorDetails}>
                  <strong>{quote.author}</strong>
                  <br />
                  <span>{quote.designation}</span>
                  <br />
                  <div className={loginStyle.companyLogo}>{quote.company}</div>
                  <div className={loginStyle.arrowControls}>
                    <button onClick={handlePrev}>&#8592;</button>
                    <button onClick={handleNext}>&#8594;</button>
                  </div>
                </div>

                <div className={loginStyle.authorImageWrapper}>
                  {quote.image && (
                    <img
                      src={`${baseURL}${quote.image}`}
                      alt={quote.author}
                      className={loginStyle.authorImage}
                    />
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Companies Section */}
        <div className={loginStyle.companiesSection}>
          <p>Top companies hire from CloudareX</p>
          <div className={loginStyle.companyLogos}>
            {data.representing_companies.map((company, index) => (
              <img
                key={index}
                src={`${baseURL}${company.logo}`}
                alt={company.name}
                className={loginStyle.logo}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
