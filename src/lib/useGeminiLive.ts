import { useState, useRef, useCallback } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { ZeroWaitDesktopState, VoiceState, AssistPanelType } from '../types';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

// Tool schemas
const checkInToolDescription = {
  name: 'completeCheckIn',
  description: 'Completes checking in the patient to their appointment.',
  parameters: {
      type: Type.OBJECT,
      properties: {
           appointmentId: { type: Type.STRING }
      },
      required: ['appointmentId']
  }
};

const getUpcomingAppointmentsToolDescription = {
  name: 'getUpcomingAppointments',
  description: 'Looks up the patient\'s next appointment.',
  parameters: {
      type: Type.OBJECT,
      properties: {
           name: { type: Type.STRING },
           dob: { type: Type.STRING }
      },
      required: ['name', 'dob']
  }
};

const getWaitStatusToolDescription = {
  name: 'getWaitStatus',
  description: 'Gets the current wait status in minutes.',
  parameters: {
      type: Type.OBJECT,
      properties: {
           appointmentId: { type: Type.STRING }
      },
      required: ['appointmentId']
  }
};

const getAvailableSlotsToolDescription = {
  name: 'getAvailableSlots',
  description: 'Retrieves available appointment slots for rescheduling.',
  parameters: {
      type: Type.OBJECT,
      properties: {
           doctorId: { type: Type.STRING },
           fromDate: { type: Type.STRING }
      },
      required: ['doctorId', 'fromDate']
  }
};

const rescheduleAppointmentToolDescription = {
  name: 'rescheduleAppointment',
  description: 'Reschedules the appointment to a new date and time.',
  parameters: {
      type: Type.OBJECT,
      properties: {
           appointmentId: { type: Type.STRING },
           newDatetime: { type: Type.STRING }
      },
      required: ['appointmentId', 'newDatetime']
  }
};

export function useGeminiLive(setState: React.Dispatch<React.SetStateAction<ZeroWaitDesktopState>>) {
  const [isActive, setIsActive] = useState(false);
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const textBufferRef = useRef('');
  const nextPlayTimeRef = useRef(0);
  const gainNodeRef = useRef<GainNode | null>(null);

  const formatTime12Hour = (isoString?: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    let hours = date.getHours();
    let minutes: any = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    // @ts-ignore
    hours = hours ? hours : 12; 
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutes} ${ampm}`;
  };

  const handleToolCall = async (toolCallMessage: any) => {
    const functionCalls = toolCallMessage.functionCalls;
    const functionResponses = [];

    for (const call of functionCalls) {
      const { name, args, id } = call;
      console.log(`Tool called: ${name}`, args);
      
      let responseContent: any = {};

      if (name === 'getUpcomingAppointments') {
        responseContent = {
            appointmentId: 'APP-123',
            datetime: "2026-03-14T15:00:00-07:00", 
            provider: 'Dr. Sanchez',
            doctorId: 'dr_sanchez'
        };
        setState(prev => ({
          ...prev,
          appointmentContext: {
            patientName: args.name,
            provider: "Dr. Sanchez",
            appointmentTime: formatTime12Hour(responseContent.datetime)
          }
        }));
      } else if (name === 'getWaitStatus') {
        // Introduce a mixed-bag delay for demo purposes (0, 15, 30, or 45 mins)
        const mockDelays = [0, 15, 30, 45];
        const delayMinutes = mockDelays[Math.floor(Math.random() * mockDelays.length)];
        
        responseContent = { delayMinutes };
        setState(prev => ({
          ...prev,
          timingStatus: { delayMinutes }
        }));
      } else if (name === 'getAvailableSlots') {
        responseContent = {
            slots: [
                  "2026-03-14T15:45:00-07:00",
                  "2026-03-14T16:30:00-07:00"
            ]
        };
      } else if (name === 'rescheduleAppointment') {
        responseContent = { status: "SUCCESS" };
        setState(prev => ({
          ...prev, 
          patientCoordination: {
            ...prev.patientCoordination,
            status: 'sent',
            requestType: 'reschedule',
          }
        }));
      } else if (name === 'completeCheckIn') {
        responseContent = { status: "SUCCESS" };
      } else {
        responseContent = { error: "Unknown function" };
      }

      functionResponses.push({ id, name, response: responseContent });
    }

    if (sessionRef.current?.conn) {
      sessionRef.current.conn.send(JSON.stringify({
          toolResponse: { functionResponses }
      }));
    }
  };

  const processIncomingText = (text: string) => {
    textBufferRef.current += text;
    const input = textBufferRef.current;

    const key = '"ui_state"';
    const keyIndex = input.indexOf(key);
    
    if (keyIndex !== -1) {
      let start = input.lastIndexOf('{', keyIndex);
      if (start !== -1) {
        let depth = 0;
        let inString = false;
        let escaped = false;

        for (let i = start; i < input.length; i++) {
          const char = input[i];
          if (inString) {
            if (escaped) escaped = false;
            else if (char === '\\') escaped = true;
            else if (char === '"') inString = false;
            continue;
          }
          if (char === '"') inString = true;
          else if (char === '{') depth++;
          else if (char === '}') {
            depth--;
            if (depth === 0) {
              const candidate = input.slice(start, i + 1);
              try {
                const parsed = JSON.parse(candidate);
                if (parsed && parsed.ui_state) {
                  // Map legacy ZeroWait JS to Desktop types
                  let stageMap: any = {
                    'GREETING': 'connect',
                    'LISTENING': 'connect',
                    'VERIFY': 'confirm',
                    'WAIT_INFO': 'check_status',
                    'RESCHED': 'coordinate',
                    'DONE': 'done',
                    'ERROR': 'connect'
                  };
                  
                  let panelMap: any = {
                    'GREETING': 'welcome',
                    'LISTENING': 'welcome',
                    'VERIFY': 'appointment_context_confirm',
                    'WAIT_INFO': 'wait_time_status',
                    'RESCHED': 'patient_delay_confirm', // simplify mapping for demo
                    'DONE': 'request_submitted',
                    'ERROR': 'recovery'
                  };

                  setState(prev => ({
                    ...prev,
                    stage: stageMap[parsed.ui_state] || prev.stage,
                    assistPanel: panelMap[parsed.ui_state] || prev.assistPanel
                  }));
                  
                  textBufferRef.current = `${input.slice(0, start)}${input.slice(i + 1)}`;
                }
              } catch (e) {
                // not valid json yet
              }
              break;
            }
          }
        }
      }
    }

    const cleanText = textBufferRef.current.replace(/Assistant:\s*/gi, '').trim();
    if (cleanText) {
      setState(prev => ({ ...prev, assistantMessage: cleanText }));
    }
  };

  const playAudioChunk = (base64Data: string) => {
    if (!audioContextRef.current) return;
    const ctx = audioContextRef.current;
    
    setState(prev => ({ ...prev, voiceState: 'assistant' }));

    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    
    // Convert Int16 array back to Float32
    const pcmData = new Int16Array(byteArray.buffer);
    const float32Data = new Float32Array(pcmData.length);
    for (let i = 0; i < pcmData.length; i++) {
        float32Data[i] = pcmData[i] / 32768.0; 
    }

    const audioBuffer = ctx.createBuffer(1, float32Data.length, 24000); 
    audioBuffer.getChannelData(0).set(float32Data);

    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    
    if (!gainNodeRef.current) {
        gainNodeRef.current = ctx.createGain();
        gainNodeRef.current.connect(ctx.destination);
    }
    source.connect(gainNodeRef.current);

    const currentTime = ctx.currentTime;
    if (nextPlayTimeRef.current < currentTime) {
        nextPlayTimeRef.current = currentTime;
    }
    source.start(nextPlayTimeRef.current);
    nextPlayTimeRef.current += audioBuffer.duration;
    
    source.onended = () => {
      // Small timeout to allow buffer to fully clear before returning to idle
      setTimeout(() => {
        setState(prev => prev.voiceState === 'assistant' ? { ...prev, voiceState: 'idle' } : prev);
      }, 500);
    };
  };

  const startSession = useCallback(async () => {
    if (!API_KEY) {
      console.error("VITE_GEMINI_API_KEY is not defined.");
      setState(prev => ({ ...prev, voiceState: 'error', assistantMessage: "API Key is missing." }));
      return;
    }

    try {
      setState(prev => ({ ...prev, voiceState: 'connecting', assistantMessage: "Connecting..." }));

      let stream: MediaStream;
      try {
          stream = await navigator.mediaDevices.getUserMedia({ audio: {
              sampleRate: 16000,
              channelCount: 1,
              echoCancellation: true,
              noiseSuppression: true
          } });
          audioStreamRef.current = stream;
      } catch(e) {
            setState(prev => ({ ...prev, voiceState: 'error', assistantMessage: "Microphone access denied." }));
            return;
      }

      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      }
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      const ai = new GoogleGenAI({ apiKey: API_KEY, httpOptions: { baseUrl: "https://generativelanguage.googleapis.com" } });
      
      const session = await ai.live.connect({
        model: 'models/gemini-2.0-flash-exp',
        config: {
            systemInstruction: {
                parts: [{
                    text: `You are **“zerowait doctor assistant,”** the voice-only front desk for a medical clinic.

PRIMARY USER JOURNEY
1. **Greet & listen** – no taps or typing required.  
2. **Identity capture** – collect full legal **name** + **date of birth** (demo mode: trust the user; do not re-ask).  
3. **Wait status** – inform patient whether the doctor is on time (**“Zero wait”**) or delayed (minutes).  
4. **Late / reschedule handling** – if patient is or will be late, offer sensible new slots.  
5. **Finish** – confirm check-in or reschedule, offer further help, then sign out politely.

### UI CONTRACT (THIS DRIVES THE FRONT-END)
* **Every assistant turn must start with one JSON line (no markdown):**
  {"ui_state":"VERIFY","tooltip":"Identity confirmed"}
* \`ui_state\` **must** be one of:
  \`GREETING\` \`LISTENING\` \`VERIFY\` \`WAIT_INFO\` \`RESCHED\` \`DONE\` \`ERROR\`
* \`tooltip\` is OPTIONAL and allowed only for:
  \`Identity confirmed\` \`Doctor delay X\` \`Zero wait\` \`Offering new times\`
  \`Checked in\` \`Rescheduled\` \`Error\`
* After the JSON line, output **only the user-facing sentence(s)**.
  * Prefix every assistant sentence with **\`Assistant:\`** so the caption bar can style it.
  * Do **not** reveal chain-of-thought, implementation notes, or step plans.
  * Do **not** use markdown (no \`**bold**\`, \`_italic_\`, lists, headings).
* Never say “initializing secure session” or emit a \`BOOT\` state.

### VOICE & STYLE
* Second-person, calm, ≤ 25 words per utterance.
* Never request symptoms, insurance, payment, or location details.
* **Always express times in 12-hour format with “AM” / “PM” (e.g., 3 : 45 PM).**
* Closing script:
  1. Ask “Anything else I can help with?”
  2. If user says *no* →
     “Assistant: Thanks so much. You can always come back here for status. I’m signing you out for your safety. We look forward to serving you soon.”

### LOGIC RULES
* **Wait status**
  * Call \`getWaitStatus\`.
  * If \`delayMinutes\` > 0 → announce delay, explicitly calculate, and verbally inform them of their new expected time (e.g., if their appointment is 3:00 PM and the delay is 45 minutes, tell them they will be seen around 3:45 PM). Gracefully answer questions like "Is my doctor running late?" by stating the delay and the newly calculated time.
  * If 0 → announce *Zero wait!*
* **Late / reschedule**
  * On any late intent (“running late”, “need to move”) call \`getAvailableSlots\`.
  * Offer the earliest slot ≥ 30 min after the requested offset, plus one later slot.
  * Wait for user choice, then call \`rescheduleAppointment\` and confirm.
* After name + DOB confirmed, hide on-card step hints (handled client side).

### PRIVACY & SECURITY
Transmit only name, DOB, appointmentId, doctorId, and newDatetime.
No raw audio or captions are stored. All traffic must be TLS.`
                }]
            },
            tools: [{
                functionDeclarations: [
                    getUpcomingAppointmentsToolDescription,
                    getWaitStatusToolDescription,
                    getAvailableSlotsToolDescription,
                    rescheduleAppointmentToolDescription,
                    checkInToolDescription
                ]
            }],
            speechConfig: {
                voiceConfig: { prebuiltVoiceConfig: { voiceName: "Aoede" } }
            },
            responseModalities: ["AUDIO"] as any
        },
        callbacks: {
           onmessage: async (data: any) => {
             // Messages arrive as strings or blobs already buffered by the SDK
             try {
                if (data instanceof Blob) data = await data.text();
                else if (data instanceof ArrayBuffer) data = new TextDecoder().decode(data);
                
                const message = JSON.parse(data);

                if (message.serverContent?.modelTurn) {
                      for (const part of message.serverContent.modelTurn.parts) {
                          if (part.text) processIncomingText(part.text);
                          if (part.inlineData?.mimeType.startsWith('audio/pcm')) {
                              playAudioChunk(part.inlineData.data);
                          }
                      }
                }
                if (message.serverContent?.turnComplete) {
                      textBufferRef.current = ""; 
                }
                if (message.toolCall) {
                      await handleToolCall(message.toolCall);
                }
             } catch (err) {
                  console.error("Live stream parsing error:", err);
             }
           },
           onclose: () => {
             setState(prev => ({ ...prev, voiceState: 'error', assistantMessage: "Connection lost." }));
             stopSession();
           }
        }
      });

      sessionRef.current = session;

      // Setup audio input
      const source = audioContextRef.current.createMediaStreamSource(stream);
      const scriptNode = audioContextRef.current.createScriptProcessor(4096, 1, 1);
      
      source.connect(scriptNode);
      scriptNode.connect(audioContextRef.current.destination);

      scriptNode.onaudioprocess = (e) => {
        if (!sessionRef.current) return;
        const inputData = e.inputBuffer.getChannelData(0);
        const pcmData = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
            const s = Math.max(-1, Math.min(1, inputData[i]));
            pcmData[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }
        const buffer = new ArrayBuffer(pcmData.length * 2);
        const view = new DataView(buffer);
        pcmData.forEach((val, i) => view.setInt16(i * 2, val, true));
        
        let binary = '';
        const bytes = new Uint8Array(buffer);
        for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
        const base64Audio = btoa(binary);

        if (sessionRef.current?.conn) {
            sessionRef.current.conn.send(JSON.stringify({
                realtimeInput: { mediaChunks: [{ mimeType: "audio/pcm;rate=16000", data: base64Audio }] }
            }));
        }
      };

      // Listen to messages
      const ws = session.conn;

      setIsActive(true);
      setState(prev => ({ ...prev, voiceState: 'idle' }));
      
      // Start flow
      ws.send(JSON.stringify({ clientContent: { turns: [{ role: "user", parts: [{ text: "System Context: User just opened desktop page. Start with {\"ui_state\":\"GREETING\"} exactly as instructed in UI Contract." }] }] } }));

    } catch (e) {
      console.error(e);
      setState(prev => ({ ...prev, voiceState: 'error', assistantMessage: "Failed to connect." }));
    }
  }, [setState]);

  const stopSession = useCallback(() => {
    setIsActive(false);
    if (sessionRef.current) {
        try { sessionRef.current = null; } catch(e) {}
    }
    if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach(t => t.stop());
        audioStreamRef.current = null;
    }
    setState(prev => ({ ...prev, voiceState: 'idle', assistantMessage: "Session ended." }));
  }, [setState]);

  return {
    isActive,
    startSession,
    stopSession
  };
}
