import React from "react";
import { QRCode } from "react-qr-code";
import useIDCardGenerator from "./idGeneratorLogic";
import "./App.css";

function IDCardPage() {
  const {
    idCardRef,
    idCardRefBack,
    formData,
    generated,
    handleChange,
    handleSubmit,
    downloadPDF,
    fullName,
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
                  <img
                    src={formData?.profilePictureUrl || "profilePictureUrl"}
                    alt="profilePictureUrl"
                  />
                </div>
                {/* prototype profile info */}
                <div className="prototype-profile-info">
                  <h2>{formData?.fullName || "John_Doe"}</h2>
                  <p>{formData?.email || "johndoe@gmail.com"}</p>
                  <p>{formData?.profession}</p>
                </div>
              </div>
              {/* 2 */}
              <div className="prototype-card-back">
                {/* logo  */}
                <img src="" alt="logo" className="prototype-logo" />

                {/* prototype profile info */}
                <div className="prototype-profile-info">
                  <h2>Trybe ID:</h2>

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

                {/* Id profile image */}
                <div className="prototype-profile-image">
                  <img
                    src={formData?.profilePictureUrl || "profilePictureUrl"}
                    alt="profilePictureUrl"
                  />
                </div>
                {/* prototype profile info */}
                <div className="prototype-profile-info">
                  <h2>{fullName || "John_Doe"}</h2>
                  <p>{formData?.email || "johndoe@gmail.com"}</p>
                  <p>{formData?.profession}</p>
                </div>
              </div>
              {/* ID card back */}
              <div className="id-card-back" ref={idCardRefBack}>
                {/* logo  */}
                <img src="" alt="logo" className="prototype-logo" />

                {/* prototype profile info */}
                <div className="prototype-profile-info">
                  <h2>Trybe QR:</h2>

                  <div className="qr-scan">
                    <QRCode
                      value={`https://ourdomain.com/profile/${fullName}`}
                      size={150}
                      bgColor="#ffffff"
                      fgColor="#000000"
                    />
                  </div>
                </div>
              </div>
            </div>
            <p className="download-warning">
              Please use your computer to initiate the download.{" "}
            </p>
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

export default IDCardPage;
