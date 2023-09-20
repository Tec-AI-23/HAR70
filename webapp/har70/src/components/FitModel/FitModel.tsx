import { FileUploadStatus, FittingStatus } from "@/lib/types";
import styles from "../../app/page.module.css";
import { Button } from "../ui/button";
import { Check, Loader2 } from "lucide-react";

interface FitModelProps {
  handleFitModel: () => void;
  fileUploadStatus: FileUploadStatus;
  fittingStatus: FittingStatus;
}

const FitModel = ({
  handleFitModel,
  fileUploadStatus,
  fittingStatus,
}: FitModelProps) => {
  return (
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
            <span style={{ paddingRight: 4 }}>Fitted</span> <Check size={15} />
          </>
        ) : (
          <>Fit</>
        )}
      </Button>
    </div>
  );
};

export default FitModel;
