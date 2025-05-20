import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./lib/firebase";

const useIDCardGenerator = () => {
  const idCardRef = useRef();
  const idCardRefBack = useRef();
  const { id } = useParams();

  const [generated, setGenerated] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    profilePictureUrl: "",
    profession: "Software Developer",
    id: "",
    isID: false,
  });
  // Load user data from Firestore by id on mount or id change
  useEffect(() => {
    if (!id) return;

    async function fetchUserById() {
      try {
        const userDoc = await getDoc(doc(db, "users", id));
        if (userDoc.exists()) {
          const data = userDoc.data();

          setFormData({
            fullName: data.fullName || "",
            email: data.email || "",
            rank: data.rank || "",
            profilePictureUrl: data.profilePictureUrl || "",
            profession: data.profession || "Software Developer",
            id: id,
            isID: data.isID || false, // include isID in formData
          });

          // check if isID is true
          setGenerated(!!data.isID);
        } else {
          // User not found, reset
          setFormData({
            fullName: "",
            email: "",
            rank: "",
            profilePictureUrl: "",
            profession: "",
            id: "",
            isID: false,
          });
          setGenerated(false);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setGenerated(false);
      }
    }

    fetchUserById();
  }, [id]);

  // Handle profession change
  const handleChange = (e) => {
    setFormData({ ...formData, profession: e.target.value });
  };

  // Generate generating QR scan to get profile && set generated true
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userRef = doc(db, "users", formData.id);
      await updateDoc(userRef, { isID: true });
      setGenerated(true);
    } catch (error) {
      console.error("Error generating ID:", error);
    }
  };

  // Your downloadPDF function stays the same
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
    fullName: formData.fullName,
    email: formData.email,
    rank: formData.rank,
    profilePictureUrl: formData.profilePictureUrl,
  };
};

export default useIDCardGenerator;
