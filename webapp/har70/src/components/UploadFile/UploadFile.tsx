import { Check, Loader2, X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Label from "../ui/label";

import styles from "../../app/page.module.css";
import { FileUploadStatus } from "@/lib/types";

interface UploadFileProps {
  handleChangeInputFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: React.MouseEventHandler<HTMLButtonElement>;
  buttonStatus: boolean;
  isLoading: boolean;
  fileUploadStatus: FileUploadStatus;
}

const UploadFile = ({
  handleChangeInputFile,
  buttonStatus,
  handleSubmit,
  fileUploadStatus,
  isLoading,
}: UploadFileProps) => {
  return (
    <>
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
    </>
  );
};

export default UploadFile;
