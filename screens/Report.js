import { useContext, useEffect, useState } from "react";
import {
  Button,
  StyleSheet,
  View,
  ScrollView,
  Alert,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { AuthContext } from "../context/authContext";
import { Colors } from "../constants/Colors";
import axios from "axios";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../config/firebase";

// utility
import { pickImages, pickVideos } from "../util/mediaPicker";
import {
  accidentTypes,
  arsonFireTypes,
  crimes,
  hazardList,
  locationOptions,
  murderTypes,
  reportType,
} from "../util/reportData";
import { extractFilename } from "../util/stringFormatter";

// components
import Dropdown from "../components/report/Dropdown";
import TextArea from "../components/report/TextArea";
import DatePicker from "../components/report/DatePicker";
import UploadMedia from "../components/report/UploadMedia";
import Accident from "../components/report/type/Accident";
import Uploads from "../components/report/upload_preview/Uploads";
import CrimeDropdown from "../components/report/CrimeDropdown";
import VideoPreview from "../components/report/VideoPreview";
import InfoTooltip from "../components/report/InfoTooltip";
import ValidationMessage from "../components/authentication/ValidationMessage";
import { ThemeContext } from "../context/themeContext";
import InputField from "../components/report/InputField";

function validateReport(report) {
  const errors = {};

  // Validate date: Ensure it's not empty and is a valid date
  if (!report.date) {
    errors.date = "Date is required.";
  } else if (isNaN(Date.parse(report.date))) {
    errors.date = "Date is invalid.";
  }

  // Validate description: Ensure it's not empty
  if (!report.description || report.description.trim() === "") {
    errors.description = "Description is required.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export default function Report() {
  const authCtx = useContext(AuthContext);
  const { colors } = useContext(ThemeContext);

  const defaultReportDetails = {
    reportType: "Crime",
    type: "robbery",
    photoURL: [],
    videoURL: "",
    description: "",
    location: {
      street: "Akasia",
      barangay: "Pantal",
      municipality: "Dagupan City",
    },
    date: "",
    numberOfCasualties: 0,
    numberOfInjuries: 0,
    injurySeverity: "Minor",
    userId: authCtx.user.uid,
    action_status: "Pending",
  };

  const [reportDetails, setReportDetails] = useState(defaultReportDetails);
  const [errors, setErrors] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [videoPreview, setVideoPreview] = useState([]);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingVideos, setIsUploadingVideos] = useState(false);

  const removeImageHanlder = (indexId) => {
    setImages((prev) => prev.filter((_, index) => index !== indexId));
  };
  const removeVideoHanlder = (indexId) => {
    setVideos((prev) => prev.filter((_, index) => index !== indexId));
    setVideoPreview((prev) => prev.filter((_, index) => index !== indexId));
  };

  const onChangeHandler = (key, value, subKey) => {
    if (key === "location")
      setReportDetails((prevValue) => ({
        ...prevValue,
        [key]: { ...prevValue.location, [subKey]: value },
      }));
    else
      setReportDetails((prevValue) => ({
        ...prevValue,
        [key]: value,
      }));
  };

  const uploadImages = async (images, docRef) => {
    const imageUrls = [];

    await Promise.all(
      images.map(async ({ uri }) => {
        const filename = extractFilename(uri);
        const file = await fetch(uri);
        const blob = await file.blob();

        const storageRef = ref(storage, `reports/${docRef}/images/${filename}`);
        await uploadBytes(storageRef, blob);

        const imageUrl = await getDownloadURL(storageRef);
        imageUrls.push(imageUrl);
      })
    );

    return imageUrls;
  };

  const uploadVideos = async (videos, docRef) => {
    const videoUrls = [];

    await Promise.all(
      videos.map(async ({ uri }) => {
        const filename = extractFilename(uri);
        const file = await fetch(uri);
        const blob = await file.blob();

        const storageRef = ref(storage, `reports/${docRef}/videos/${filename}`);
        await uploadBytes(storageRef, blob);

        const videoUrl = await getDownloadURL(storageRef);
        videoUrls.push(videoUrl);
      })
    );

    return videoUrls[0];
  };

  const submitHandler = async () => {
    setErrors(null);
    setIsSubmitting(true);

    const { isValid, errors } = validateReport(reportDetails);

    if (!isValid) {
      setErrors(errors);
      setIsSubmitting(false);

      return;
    }

    try {
      reportDetails.photoURL = await uploadImages(images, authCtx.user.uid);
      reportDetails.videoURL = await uploadVideos(videos, authCtx.user.uid);
      const { data } = await axios({
        method: "post",
        url: `https://${process.env.EXPO_PUBLIC_API_URL}/api/reports/`,
        data: reportDetails,
        headers: { "Content-Type": "application/json" },
      });
      Alert.alert("Success", "Your report has been submitted");
      console.log(data);
    } catch (error) {
      Alert.alert("Submit failed", error.response.data.error);
    }
    setIsSubmitting(false);
  };

  function reportTypeSubOptions(reportType) {
    switch (reportType) {
      case "Crime":
        return (
          <CrimeDropdown
            label="Crime Type"
            options={crimes}
            onChangeHandler={onChangeHandler}
            keyName="type"
            listen={reportDetails.reportType}
          />
        );
      case "Accident":
        return (
          <CrimeDropdown
            label="Accident Type"
            options={accidentTypes}
            onChangeHandler={onChangeHandler}
            keyName="type"
            listen={reportDetails.reportType}
          />
        );
      case "Hazards":
        return (
          <CrimeDropdown
            label="Hazard Type"
            options={hazardList}
            onChangeHandler={onChangeHandler}
            keyName="type"
            listen={reportDetails.reportType}
          />
        );
      case "Arson/Fire":
        return (
          <CrimeDropdown
            label="Arson/Fire Type"
            options={arsonFireTypes}
            onChangeHandler={onChangeHandler}
            keyName="type"
            listen={reportDetails.reportType}
          />
        );
      case "Others":
        return (
          <InputField
            keyName={"type"}
            label={"Please specify your report."}
            placeholder="Enter your report"
            onChangeHandler={onChangeHandler}
          />
        );
    }
  }

  useEffect(() => {
    if (
      reportDetails.type !== "Murder" &&
      reportDetails.hasOwnProperty("murderType")
    ) {
      const { murderType, ...newObj } = reportDetails;
      setReportDetails(newObj);
    }
  }, [reportDetails.type]);

  useEffect(() => {
    console.log(reportDetails);
  }, [reportDetails]);

  return (
    <ScrollView style={{ paddingTop: 25, backgroundColor: colors.bgPrimary }}>
      <View style={[styles.rootConainer]}>
        <Dropdown
          label="Report Type"
          options={reportType}
          onChangeHandler={onChangeHandler}
          keyName="reportType"
        />
        {reportTypeSubOptions(reportDetails.reportType)}
        {reportDetails.type === "Murder" &&
          reportDetails.reportType === "Crime" && (
            <Dropdown
              label="Murder type"
              options={murderTypes}
              onChangeHandler={onChangeHandler}
              keyName="murderType"
            />
          )}
        <Accident onChangeHandler={onChangeHandler} />
        {/* <TextArea label="Description" onChangeHanlder={onChangeHandler} /> */}
        <View>
          <Dropdown
            label="Barangay"
            options={locationOptions}
            onChangeHandler={onChangeHandler}
            keyName="location"
            subKey="barangay"
          />

          <Dropdown
            label="Street"
            options={[
              "akasia",
              "arellano",
              "centro",
              "gibang",
              "nobley",
              "patalan",
              "sitio buquig",
              "ta ba calero",
            ]}
            onChangeHandler={onChangeHandler}
            keyName="location"
            subKey="street"
          />
        </View>
        <DatePicker setUserInput={setReportDetails} keyName={"date"} />
        <View style={styles.uploadBtn}>
          <InfoTooltip />
          <UploadMedia
            onPressHandler={pickImages.bind(
              this,
              setImages,
              setIsUploadingImage,
              images
            )}
            label={"Upload images"}
            icon={"camera"}
          />
          <UploadMedia
            onPressHandler={pickVideos.bind(
              this,
              setVideos,
              setIsUploadingVideos,
              videos
            )}
            label={"Upload video"}
            icon={"video"}
          />
        </View>
        <Uploads
          files={images}
          onRemove={removeImageHanlder}
          isLoading={isUploadingImage}
          label="images uploaded"
        />
        <Uploads
          files={videoPreview}
          onRemove={removeVideoHanlder}
          isLoading={isUploadingVideos}
          label="videos uploaded"
        />
        <VideoPreview
          videoUri={videos[0]}
          setVideos={setVideos}
          setPreview={setVideoPreview}
          setLoading={setIsUploadingVideos}
        />
        {errors && <ValidationMessage errors={errors} />}
        <View style={{ marginVertical: 12, marginTop: -8 }}>
          <TouchableOpacity
            style={[
              styles.submitBtnContainer,
              { opacity: isSubmitting ? 0.7 : 1 },
            ]}
            onPress={submitHandler}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.submitBtnText}>Submit</Text>
            )}
          </TouchableOpacity>
          {/* <Button
            title={isSubmitting ? "submitting..." : "SUBMIT"}
            disabled={isSubmitting}
            onPress={submitHandler}
          /> */}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  rootConainer: {
    width: "80%",
    alignSelf: "center",
    gap: 12,
    marginBottom: 35,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    color: "white",
    marginBottom: 16,
  },
  uploadBtn: {
    marginVertical: 8,
    gap: 16,
  },
  submitBtnContainer: {
    backgroundColor: Colors.accent400,
    paddingVertical: 8,
    borderRadius: 4,
    marginTop: 20,
  },
  submitBtnText: {
    textAlign: "center",
    color: "white",
  },
});
