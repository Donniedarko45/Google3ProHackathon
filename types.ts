export interface NeuroLensResponse {
  detected_task: string;
  friction_point: string;
  solution: string;
  action_output: string;
  reason_map: string;
}

export interface FileData {
  file: File;
  previewUrl?: string;
  base64: string;
  mimeType: string;
}

export enum AppStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
