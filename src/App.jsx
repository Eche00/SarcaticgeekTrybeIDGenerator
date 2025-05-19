import React from "react";
import { QRCode } from "react-qr-code";
import useIDCardGenerator from "./idGeneratorLogic";
import "./App.css";

function App() {
  const {
    idCardRef,
    idCardRefBack,
    formData,
    generated,
    handleChange,
    handleSubmit,
    downloadPDF,
    username,
    email,
    rank,
    profile,
  } = useIDCardGenerator();

  return (
    <div className="generator-container">
      {!generated ? (
        <div className="generator-subcontainer">
          {/* Form section  */}
          <form className="generator-form">
            {/* 1 */}
            <div className="generator-subform">
              <label>Profession:</label>
              <input
                placeholder="Software Developer"
                required=""
                type="text"
                value={formData.profession}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="generator-button"
              onClick={handleSubmit}>
              Generate
            </button>
          </form>

          {/* ID Demo  */}
          <section className="prototype-container ">
            <div className="prototype-subcontainer">
              {/* 1 */}
              <div className="prototype-card">
                {/* logo  */}
                <img src="" alt="logo" className="prototype-logo" />

                {/* prototype profile image */}
                <div className="prototype-profile-image">
                  <img src={formData?.profile || "Profile"} alt="profile" />
                </div>
                {/* prototype profile info */}
                <div className="prototype-profile-info">
                  <h2>{formData?.username || "John_Doe"}</h2>
                  <p>{formData?.email || "johndoe@gmail.com"}</p>
                  <p>{formData?.profession}</p>
                  <p>Rank: {formData?.rank || "rank"}</p>
                </div>
              </div>
              {/* 2 */}
              <div className="prototype-card-back">
                {/* logo  */}
                <img src="" alt="logo" className="prototype-logo" />

                {/* prototype profile info */}
                <div className="prototype-profile-info">
                  <h2>Trybe ID:</h2>
                  <span>
                    {" "}
                    {formData?.id?.replace(/(\d{4})(?=\d)/g, "$1 ") ||
                      "0000 0000 0000"}
                  </span>
                  <div className="qr-scan-demo">
                    {" "}
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      ) : (
        <div className="generator-subcontainer">
          {/* ID Demo  */}
          <section className="id-container ">
            <div className="id-subcontainer">
              {/* ID card front */}
              <div className="id-card" ref={idCardRef}>
                {/* logo  */}
                <img src="" alt="logo" className="prototype-logo" />

                {/* prototype profile image */}
                <div className="prototype-profile-image">
                  <img src="" alt="logo" />
                </div>
                {/* prototype profile info */}
                <div className="prototype-profile-info">
                  <h2>{formData?.username || "John_Doe"}</h2>
                  <p>{formData?.email || "johndoe@gmail.com"}</p>
                  <p>{formData?.profession}</p>
                  <p>Rank: {formData?.rank || "rank"}</p>
                </div>
              </div>
              {/* ID card back */}
              <div className="id-card-back" ref={idCardRefBack}>
                {/* logo  */}
                <img src="" alt="logo" className="prototype-logo" />

                {/* prototype profile info */}
                <div className="prototype-profile-info">
                  <h2>Trybe ID:</h2>
                  <span>
                    {" "}
                    {formData?.id?.replace(/(\d{4})(?=\d)/g, "$1 ") ||
                      "0000 000 000 0000"}
                  </span>
                  <div className="qr-scan">
                    <QRCode
                      value={`https://ourdomain.com/profile/${username}`}
                      size={150}
                      bgColor="#ffffff"
                      fgColor="#000000"
                    />
                  </div>
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="generator-button"
              onClick={downloadPDF}>
              Download
            </button>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
