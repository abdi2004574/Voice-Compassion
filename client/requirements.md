## Packages
framer-motion | Smooth animations for page transitions and UI elements
recharts | Visualization for risk levels and activity on the dashboard
date-fns | Formatting dates for chat messages and summaries
lucide-react | Beautiful icons for the UI (already in base, but ensuring)
clsx | Utility for constructing className strings conditionally
tailwind-merge | Utility for merging tailwind classes

## Notes
Integration with Replit Auth is handled via /api/login and /api/logout
Voice upload uses ObjectUploader component and /api/uploads/request-url
Chat uses /api/conversations endpoints
Speech synthesis uses browser's window.speechSynthesis
Speech recognition uses browser's webkitSpeechRecognition or MediaRecorder
