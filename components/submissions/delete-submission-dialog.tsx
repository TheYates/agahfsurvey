"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, 
  Trash2, 
  Clock, 
  User, 
  FileText,
  Database,
  Loader2,
  CheckCircle,
  XCircle
} from "lucide-react";
import { format } from "date-fns";
import { deleteSubmission, getSubmissionForDeletion } from "@/app/actions/submission-actions";

interface DeleteSubmissionDialogProps {
  submissionId: string | null;
  open: boolean;
  onClose: () => void;
  onDeleted: () => void;
}

interface SubmissionDetails {
  id: string;
  submittedAt: string;
  userType: string;
  visitPurpose: string;
  patientType: string;
  wouldRecommend: boolean;
  relatedRecords: {
    ratings: number;
    locations: number;
    concerns: number;
    observations: number;
  };
}

export default function DeleteSubmissionDialog({
  submissionId,
  open,
  onClose,
  onDeleted,
}: DeleteSubmissionDialogProps) {
  const [step, setStep] = useState<"loading" | "confirm" | "verify" | "deleting" | "success" | "error">("loading");
  const [submissionDetails, setSubmissionDetails] = useState<SubmissionDetails | null>(null);
  const [confirmationText, setConfirmationText] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(5);

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (open && submissionId) {
      setStep("loading");
      setConfirmationText("");
      setReason("");
      setError("");
      setCountdown(5);
      fetchSubmissionDetails();
    } else {
      setStep("loading");
      setSubmissionDetails(null);
    }
  }, [open, submissionId]);

  // Countdown timer for the final confirmation
  useEffect(() => {
    if (step === "verify" && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [step, countdown]);

  const fetchSubmissionDetails = async () => {
    if (!submissionId) return;

    try {
      const result = await getSubmissionForDeletion(submissionId);
      if (result.success && result.data) {
        setSubmissionDetails(result.data);
        setStep("confirm");
      } else {
        setError(result.error || "Failed to load submission details");
        setStep("error");
      }
    } catch (err) {
      setError("Failed to load submission details");
      setStep("error");
    }
  };

  const handleInitialConfirm = () => {
    if (!reason.trim() || reason.trim().length < 10) {
      setError("Please provide a detailed reason for deletion (minimum 10 characters)");
      return;
    }
    setError("");
    setStep("verify");
    setCountdown(5);
  };

  const handleFinalDelete = async () => {
    if (!submissionId || !submissionDetails) return;

    if (confirmationText !== "DELETE SUBMISSION") {
      setError("Please type 'DELETE SUBMISSION' exactly as shown");
      return;
    }

    if (countdown > 0) {
      setError(`Please wait ${countdown} more seconds before confirming`);
      return;
    }

    setStep("deleting");
    setError("");

    try {
      const result = await deleteSubmission(submissionId, {
        confirmationText,
        reason: reason.trim(),
      });

      if (result.success) {
        setStep("success");
        setTimeout(() => {
          onDeleted();
          onClose();
        }, 2000);
      } else {
        setError(result.error || "Failed to delete submission");
        setStep("error");
      }
    } catch (err) {
      setError("An unexpected error occurred during deletion");
      setStep("error");
    }
  };

  const totalRelatedRecords = submissionDetails 
    ? Object.values(submissionDetails.relatedRecords).reduce((sum, count) => sum + count, 0)
    : 0;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            Delete Survey Submission
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. All related data will be permanently deleted.
          </DialogDescription>
        </DialogHeader>

        {step === "loading" && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading submission details...</span>
          </div>
        )}

        {step === "error" && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {step === "success" && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Deletion Successful</AlertTitle>
            <AlertDescription className="text-green-700">
              The submission and all related data have been permanently deleted.
            </AlertDescription>
          </Alert>
        )}

        {(step === "confirm" || step === "verify") && submissionDetails && (
          <div className="space-y-6">
            {/* Submission Details */}
            <div className="bg-muted/30 p-4 rounded-lg">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Submission Details
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-muted-foreground">ID</Label>
                  <p className="font-mono text-xs break-all">{submissionDetails.id}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Submitted</Label>
                  <p>{format(new Date(submissionDetails.submittedAt), "MMM dd, yyyy 'at' h:mm a")}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">User Type</Label>
                  <Badge variant="outline">{submissionDetails.userType}</Badge>
                </div>
                <div>
                  <Label className="text-muted-foreground">Visit Purpose</Label>
                  <Badge variant="outline">{submissionDetails.visitPurpose}</Badge>
                </div>
              </div>
            </div>

            {/* Related Data Warning */}
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Data Impact Warning</AlertTitle>
              <AlertDescription>
                <p className="mb-2">This will permanently delete:</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Database className="h-3 w-3" />
                    <span>{submissionDetails.relatedRecords.ratings} ratings</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Database className="h-3 w-3" />
                    <span>{submissionDetails.relatedRecords.locations} location records</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Database className="h-3 w-3" />
                    <span>{submissionDetails.relatedRecords.concerns} concerns</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Database className="h-3 w-3" />
                    <span>{submissionDetails.relatedRecords.observations} observations</span>
                  </div>
                </div>
                <p className="mt-2 font-semibold">
                  Total: {totalRelatedRecords + 1} database records will be deleted
                </p>
              </AlertDescription>
            </Alert>

            {step === "confirm" && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="reason">Reason for Deletion *</Label>
                  <Textarea
                    id="reason"
                    placeholder="Please provide a detailed reason for deleting this submission (e.g., duplicate entry, test data, data quality issue, user request, etc.)"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="mt-1"
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Minimum 10 characters required. This will be logged for audit purposes.
                  </p>
                </div>
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            {step === "verify" && (
              <div className="space-y-4">
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Final Confirmation Required</AlertTitle>
                  <AlertDescription>
                    Type <code className="bg-destructive/20 px-1 rounded">DELETE SUBMISSION</code> exactly to confirm deletion.
                  </AlertDescription>
                </Alert>

                <div>
                  <Label htmlFor="confirmation">Confirmation Text *</Label>
                  <Input
                    id="confirmation"
                    placeholder="Type: DELETE SUBMISSION"
                    value={confirmationText}
                    onChange={(e) => setConfirmationText(e.target.value)}
                    className="mt-1 font-mono"
                  />
                </div>

                <div className="bg-muted/30 p-3 rounded">
                  <p className="text-sm"><strong>Reason:</strong> {reason}</p>
                </div>

                {countdown > 0 && (
                  <Alert>
                    <Clock className="h-4 w-4" />
                    <AlertDescription>
                      Please wait {countdown} seconds before confirming deletion.
                    </AlertDescription>
                  </Alert>
                )}

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </div>
        )}

        {step === "deleting" && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-destructive" />
            <span className="ml-2">Deleting submission and related data...</span>
          </div>
        )}

        <DialogFooter>
          {step === "confirm" && (
            <>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleInitialConfirm}
                disabled={!reason.trim() || reason.trim().length < 10}
              >
                Continue to Final Confirmation
              </Button>
            </>
          )}

          {step === "verify" && (
            <>
              <Button variant="outline" onClick={() => setStep("confirm")}>
                Back
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleFinalDelete}
                disabled={confirmationText !== "DELETE SUBMISSION" || countdown > 0}
              >
                {countdown > 0 ? `Wait ${countdown}s` : "Delete Permanently"}
              </Button>
            </>
          )}

          {(step === "error" || step === "success") && (
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
