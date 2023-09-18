"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Label from "@/components/ui/label";
import { useEffect, useState } from "react";

import styles from "./page.module.css";
import axios from "axios";
import { API_URL } from "@/lib/api";
import { Loader2, Check, X } from "lucide-react";
import {
  InputSensor,
  type InputSensorInterface,
} from "@/components/InputSensor";

const INITIAL_SENSOR_DATA: InputSensorInterface[] = [
  { name: "back_x", value: 0 },
  { name: "back_y", value: 0 },
  { name: "back_z", value: 0 },
  { name: "thigh_x", value: 0 },
  { name: "thigh_y", value: 0 },
  { name: "thigh_z", value: 0 },
];

const ACTIVITY_LABELS: Record<string, string> = {
  Walking: "🚶‍♀️",
  Shuffling: "👣",
  "Stairs (ascending)": "📶👆",
  "Stairs (descending)": "📶👇",
  Standing: "🧍",
  Sitting: "🪑",
  Lying: "🛌",
  "": "",
};

const Home = () => {
  // file uploading
  const [file, setFile] = useState<File>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fileUploadStatus, setFileUploadStatus] = useState<
    "done" | "error" | "undefined"
  >("undefined");
  const [buttonStatus, setButtonStatus] = useState<boolean>(false);

  // fitting
  const [fittingStatus, setFittingStatus] = useState<
    "not_fitted" | "fitting" | "fitted"
  >("not_fitted");

  // predicting
  const [sensorData, setSensorData] =
    useState<InputSensorInterface[]>(INITIAL_SENSOR_DATA);
  const [predictingStatus, setPredictingStatus] = useState<
    "not_predicted" | "predicting" | "predicted"
  >("not_predicted");
  const [prediction, setPrediction] = useState<string>("");

  useEffect(() => {
    if (file !== undefined) {
      setButtonStatus(true);
    } else {
      setButtonStatus(false);
    }
  }, [file]);

  const handleChangeInputFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      if (selectedFile.type === "text/csv") {
        const formData = new FormData();
        formData.append("csvFile", selectedFile);
        setFile(selectedFile);
      }
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file!);
      await axios
        .post(`${API_URL}/dataset`, formData)
        .then(() => {
          setIsLoading(false);
          setFileUploadStatus("done");
        })
        .catch((e) => {
          console.error("Error uploading CSV:", e);
          setFileUploadStatus("error");
        });
      setIsLoading(false);
      setFileUploadStatus("done");
    } catch (error) {
      console.error("Error uploading CSV:", error);
      setFileUploadStatus("error");
    }
  };

  const handleFitModel = async () => {
    setFittingStatus("fitting");
    try {
      await axios.get(`${API_URL}/fit`);
      setFittingStatus("fitted");
    } catch (e) {
      console.error(e);
      setFittingStatus("not_fitted");
    }
  };

  const handleSensorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const field = e.target.name;
    const fieldValue = e.target.value;

    if (/^-?\d*\.?\d*$/.test(fieldValue)) {
      const sensorValue = parseFloat(fieldValue);
      const newSensorValue: InputSensorInterface = {
        name: field,
        value: sensorValue,
      };

      setSensorData((prevData) =>
        prevData.map((sensor) =>
          sensor.name === field ? newSensorValue : sensor
        )
      );
    }
  };

  const handlePredict = async () => {
    const sensorDataObject = {};
    sensorData.forEach((item) => (sensorDataObject[item.name] = item.value));
    setPredictingStatus("predicting");
    await axios
      .post(`${API_URL}/predict`, sensorDataObject)
      .then((res) => setPrediction(res.data.activity));
    setPredictingStatus("predicted");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>HAR 70+ Activity Recognition</h1>
      <div className={styles.inputContainer}>
        <Label htmlFor="file" className={styles.inputLabel}>
          Enter training data as CSV
        </Label>
        <Input
          id="file"
          type="file"
          className="file:text-white file:font-extrabold hover:file:cursor-pointer"
          accept=".csv"
          onChange={(e) => handleChangeInputFile(e)}
        />
      </div>

      <Button
        onClick={handleSubmit}
        disabled={!buttonStatus}
        className={styles.fullButton}
      >
        {isLoading ? (
          <Loader2
            className="mr-2 animate-spin"
            size={25}
            style={{ margin: 0 }}
          />
        ) : fileUploadStatus === "done" ? (
          <Check size={25} />
        ) : fileUploadStatus === "error" ? (
          <X size={25} />
        ) : (
          <>Upload</>
        )}
      </Button>

      <div className={styles.modelContainer}>
        <h2 className={styles.modelTitle}>
          Optimal model:
          <br />
          <span className={styles.model}>
            ExtraTreesClassifier(
            <span className={styles.modelParam}>max_depth=25</span>)
          </span>
        </h2>
        <Button
          onClick={handleFitModel}
          disabled={fileUploadStatus !== "done"}
          className={styles.fullButton}
        >
          {fittingStatus === "not_fitted" ? (
            <>Fit</>
          ) : fittingStatus === "fitting" ? (
            <Loader2
              className="mr-2 animate-spin"
              size={25}
              style={{ margin: 0 }}
            />
          ) : fittingStatus === "fitted" ? (
            <>
              <span style={{ paddingRight: 4 }}>Fitted</span>{" "}
              <Check size={15} />
            </>
          ) : (
            <>Fit</>
          )}
        </Button>
      </div>

      <div className={styles.predictContainer}>
        <h2 className={styles.predictTitle}>Predict</h2>
        <div className={styles.inputSensorsGroup}>
          {sensorData.map((sensor, i) => (
            <InputSensor
              key={`sensor${i}`}
              name={sensor.name}
              value={sensor.value}
              onChange={(e) => handleSensorChange(e)}
            />
          ))}
        </div>
        <Button onClick={handlePredict} className={styles.fullButton}>
          {predictingStatus === "not_predicted" ? (
            <>Predict</>
          ) : predictingStatus === "predicting" ? (
            <Loader2
              className="mr-2 animate-spin"
              size={25}
              style={{ margin: 0 }}
            />
          ) : (
            <>Predict</>
          )}
        </Button>
        {predictingStatus === "predicted" && (
          <p className={styles.prediction}>
            {prediction} {ACTIVITY_LABELS[prediction]}
          </p>
        )}
      </div>
    </div>
  );
};

export default Home;
