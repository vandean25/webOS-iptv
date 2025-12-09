export interface XtreamUserInfo {
  username: string;
  password: string;
  message: string;
  auth: number;
  status: string;
  exp_date: string | null;
  is_trial: string;
  active_cons: string;
  created_at: string;
  max_connections: string;
  allowed_output_formats: string[];
}

export interface XtreamServerInfo {
  url: string;
  port: string;
  https_port: string;
  server_protocol: string;
  rtmp_port: string;
  timezone: string;
  timestamp_now: number;
  time_now: string;
  process: boolean;
}

export interface XtreamLoginResponse {
  user_info: XtreamUserInfo;
  server_info: XtreamServerInfo;
}

export interface XtreamCredentials {
  url: string;
  username: string;
  password: string;
}

export interface XtreamCategory {
  category_id: string;
  category_name: string;
  parent_id: number;
}

export interface XtreamStream {
  num: number;
  name: string;
  stream_type: string;
  stream_id: number;
  stream_icon: string;
  epg_channel_id: string;
  added: string;
  category_id: string;
  custom_sid: string;
  tv_archive: number;
  direct_source: string;
  tv_archive_duration: number;
}

export interface XtreamEPGListing {
  id: string;
  epg_id: string;
  title: string;
  lang: string;
  start: string; // timestamp or date string depending on API, usually YYYY-MM-DD HH:mm:ss but encoded
  end: string;
  description: string;
  channel_id: string;
  start_timestamp: string; // Unix timestamp
  stop_timestamp: string;  // Unix timestamp
}

export interface XtreamEPGResponse {
  epg_listings: XtreamEPGListing[];
}
