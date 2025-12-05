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
import {
  AlertTriangle,
  Trash2,
  Clock,
  Loader2,
  CheckCircle,
  XCircle
} from "lucide-react";
import { deleteSubmission } from "@/app/actions/submission-actions";

interface BulkDeleteDialogProps {
  submissionIds: string[];
  open: boolean;
  onClose: () => void;
  onDeleted: () => void;
}

export default function BulkDeleteDialog({
  submissionIds,
  open,
  onClose,
  onDeleted,
}: BulkDeleteDialogProps) {
  const [step, setStep] = useState<"confirm" | "verify" | "deleting" | "success" | "error">("confirm");
  const [confirmationText, setConfirmationText] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(5);
  const [deletedCount, setDeletedCount] = useState(0);
  const [failedCount, setFailedCount] = useState(0);

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (open && submissionIds.length > 0) {
      setStep("confirm");
      setConfirmationText("");
      setReason("");
      setError("");
      setCountdown(5);
      setDeletedCount(0);
      setFailedCount(0);
    }
  }, [open, submissionIds]);

  // Countdown timer for the final confirmation
  useEffect(() => {
    if (step === "verify" && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [step, countdown]);

  const handleInitialConfirm = () => {
    if (!reason.trim() || reason.trim().length < 10) {
      setError("Please provide a detailed reason for deletion (minimum 10 characters)");
      return;
    }
    setError("");
    setStep("verify");
    setCountdown(5);
  };

  const handleBulkDelete = async () => {
    if (confirmationText !== "DELETE SUBMISSIONS") {
      setError("Please type 'DELETE SUBMISSIONS' exactly as shown");
      return;
    }

    if (countdown > 0) {
      setError(`Please wait ${countdown} more seconds before confirming`);
      return;
    }

    setStep("deleting");
    setError("");

    let successCount = 0;
    let errorCount = 0;

    // Delete submissions one by one
    for (const submissionId of submissionIds) {
      try {
        const result = await deleteSubmission(submissionId, {
          confirmationText: "DELETE SUBMISSION",
          reason: reason.trim(),
        });

        if (result.success) {
          successCount++;
        } else {
          errorCount++;
        }

        setDeletedCount(successCount);
        setFailedCount(errorCount);
      } catch (err) {
        errorCount++;
        setFailedCount(errorCount);
      }
    }

    if (errorCount > 0) {
      setError(`${errorCount} submission(s) failed to delete`);
      setStep("error");
    } else {
      setStep("success");
      setTimeout(() => {
        onDeleted();
        onClose();
      }, 2000);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            Delete Multiple Submissions
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. All related data will be permanently deleted.
          </DialogDescription>
        </DialogHeader>

        {step === "error" && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error}
              <p className="mt-2">Successfully deleted: {deletedCount}</p>
              <p>Failed: {failedCount}</p>
            </AlertDescription>
          </Alert>
        )}

        {step === "success" && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Deletion Successful</AlertTitle>
            <AlertDescription className="text-green-700">
              Successfully deleted {deletedCount} submission(s) and all related data.
            </AlertDescription>
          </Alert>
        )}

        {(step === "confirm" || step === "verify") && (
          <div className="space-y-6">
            {/* Deletion Info */}
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>
                <p className="font-semibold">
                  You are about to permanently delete {submissionIds.length} submission(s) and all their related data:
                </p>
                <ul className="list-disc list-inside mt-2 text-sm">
                  <li>All ratings for each submission</li>
                  <li>All location records</li>
                  <li>All concerns and feedback</li>
                  <li>All general observations</li>
                </ul>
                <p className="mt-2 font-semibold text-destructive-foreground">
                  This action cannot be undone!
                </p>
              </AlertDescription>
            </Alert>

            {step === "confirm" && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="reason">Reason for Deletion *</Label>
                  <Textarea
                    id="reason"
                    placeholder="Please provide a detailed reason for deleting these submissions (e.g., duplicate entries, test data, data quality issue, bulk cleanup, etc.)"
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
                    Type <code className="bg-destructive/20 px-1 rounded">DELETE SUBMISSIONS</code> exactly to confirm deletion.
                  </AlertDescription>
                </Alert>

                <div>
                  <Label htmlFor="confirmation">Confirmation Text *</Label>
                  <Input
                    id="confirmation"
                    placeholder="Type: DELETE SUBMISSIONS"
                    value={confirmationText}
                    onChange={(e) => setConfirmationText(e.target.value)}
                    className="mt-1 font-mono"
                  />
                </div>

                <div className="bg-muted/30 p-3 rounded">
                  <p className="text-sm"><strong>Submissions to delete:</strong> {submissionIds.length}</p>
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
          <div className="space-y-4">
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-destructive" />
              <span className="ml-2">Deleting submissions...</span>
            </div>
            <div className="text-center text-sm text-muted-foreground">
              <p>Deleted: {deletedCount} / {submissionIds.length}</p>
              {failedCount > 0 && <p className="text-destructive">Failed: {failedCount}</p>}
            </div>
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
                onClick={handleBulkDelete}
                disabled={confirmationText !== "DELETE SUBMISSIONS" || countdown > 0}
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
