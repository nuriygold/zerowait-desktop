export type ConversationStage =
  | "connect"
  | "confirm"
  | "check_status"
  | "coordinate"
  | "done";

export type AssistPanelType =
  | "none"
  | "welcome" // using welcome instead of a missing one, mapping "welcome" to welcome panel
  | "appointment_context_confirm"
  | "wait_time_status"
  | "patient_delay_confirm"
  | "accommodation_options"
  | "request_submitted"
  | "recovery";

export type VoiceState =
  | "idle"
  | "connecting"
  | "listening"
  | "speaking"       // user speaking
  | "processing"
  | "assistant"      // assistant speaking
  | "error";

export interface ZeroWaitDesktopState {
  stage: ConversationStage;
  assistPanel: AssistPanelType;
  voiceState: VoiceState;
  assistantMessage: string | null;
  appointmentContext?: {
    patientName?: string;
    appointmentTime?: string;
    provider?: "Dr. Sanchez";
  };
  timingStatus?: {
    delayMinutes?: number;
    text?: string;
  };
  patientCoordination?: {
    reportedDelay?: number;
    requestType?: string;
    status?: "sent" | "pending";
  };
}
