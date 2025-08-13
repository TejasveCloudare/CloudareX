import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { linkedinLogin } from "../../Api/services"; // your API wrapper
import { useContext } from "react";
import { GlobalContext } from "../../context/Context";

const LinkedInRedirectHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useContext(GlobalContext);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const code = urlParams.get("code");
    console.log("code---------", code);

    const state = urlParams.get("state");

    if (code) {
      (async () => {
        try {
          const response = await linkedinLogin({
            code,
            redirect_uri: `${window.location.origin}/linkedin`,
          });
          if (response.access && response.refresh) {
            localStorage.setItem("access", response.access);
            localStorage.setItem("refresh", response.refresh);
            setUser(response.user);
            navigate("/");
          } else {
            console.error("LinkedIn response error", response);
            navigate("/login");
          }
        } catch (err) {
          console.error("LinkedIn login failed:", err);
          navigate("/login");
        }
      })();
    } else {
      navigate("/login");
    }
  }, [location, navigate, setUser]);

  return <div>Signing you in with LinkedIn...</div>;
};

export default LinkedInRedirectHandler;
