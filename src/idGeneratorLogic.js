// useIDCardGenerator.js
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";

/**
 * Custom hook for handling ID card generation logic
 */
const useIDCardGenerator = () => {
  const idCardRef = useRef();
  const idCardRefBack = useRef();
  const { username, email, rank, profile } = useParams();

  const [generated, setGenerated] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    rank: "",
    profile: "",
    profession: "Software Developer",
    id: "",
  });

  // Load user data from params or localStorage
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      username,
      email,
      rank,
      profile,
    }));

    const storedUser = localStorage.getItem(`trybe_id_${username}`);
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setFormData(parsed);
      setGenerated(true);
    }
  }, [username, email, rank, profile]);

  // Handles profession input change
  const handleChange = (e) => {
    setFormData({ ...formData, profession: e.target.value });
  };

  // Generates a unique ID and saves data to localStorage
  const handleSubmit = (e) => {
    e.preventDefault();
    const generatedId = Math.floor(10000000 + Math.random() * 90000000);
    const newFormData = {
      ...formData,
      id: `0000${generatedId}`,
    };

    setFormData(newFormData);
    setGenerated(true);

    localStorage.setItem(
      `trybe_id_${formData.username}`,
      JSON.stringify(newFormData)
    );
  };

  // Downloads the front and back of the ID card as a PDF
  const downloadPDF = async () => {
    const applyCustomStyles = (cloned, isBack = false) => {
      cloned.style.background = "#000a14";
      cloned.style.color = "#f5f5f5";
      cloned.style.border = "4px solid";
      cloned.style.borderImage = "linear-gradient(135deg, #00f9ff, #ff00e6)";
      cloned.style.borderImageSlice = "1";
      cloned.style.boxShadow = "0 0 10px #00f9ff";
      cloned.style.padding = "30px";
      cloned.style.position = "fixed";
      cloned.style.top = "-9999px";
      cloned.style.left = "-9999px";

      if (isBack) {
        cloned.style.borderTopRightRadius = "2rem";
        cloned.style.borderBottomLeftRadius = "2rem";
      } else {
        cloned.style.borderTopLeftRadius = "2rem";
        cloned.style.borderBottomRightRadius = "2rem";
      }

      const card = cloned.querySelector(".id-card, .id-card-back");
      if (card) card.style.padding = "30px";
    };

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();

    // FRONT
    const frontInput = idCardRef.current;
    if (frontInput) {
      await document.fonts.ready;
      const frontClone = frontInput.cloneNode(true);
      applyCustomStyles(frontClone);
      document.body.appendChild(frontClone);

      const frontCanvas = await html2canvas(frontClone, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
      });

      const frontImg = frontCanvas.toDataURL("image/png");
      const frontHeight = (frontCanvas.height * pdfWidth) / frontCanvas.width;
      pdf.addImage(frontImg, "PNG", 0, 0, pdfWidth, frontHeight);
      document.body.removeChild(frontClone);
    }

    // BACK
    const backInput = idCardRefBack.current;
    if (backInput) {
      await document.fonts.ready;
      const backClone = backInput.cloneNode(true);
      applyCustomStyles(backClone, true);
      document.body.appendChild(backClone);

      const backCanvas = await html2canvas(backClone, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
      });

      const backImg = backCanvas.toDataURL("image/png");
      const backHeight = (backCanvas.height * pdfWidth) / backCanvas.width;

      pdf.addPage();
      pdf.addImage(backImg, "PNG", 0, 0, pdfWidth, backHeight);
      document.body.removeChild(backClone);
    }

    // Save final PDF
    const pdfBlob = pdf.output("blob");
    if (/Mobi|Android/i.test(navigator.userAgent)) {
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Trybe_ID_Card.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => window.open(url, "_blank"), 1000);
    } else {
      saveAs(pdfBlob, "Trybe_ID_Card.pdf");
    }
  };

  return {
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
  };
};

export default useIDCardGenerator;
