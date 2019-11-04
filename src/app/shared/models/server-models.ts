export interface MetaPathCombo_server {
  meta: PathMeta_server;
  path: RecordedLocation_server[];
}

export interface PathMeta_server {
  id: number;
  owner_id: number;
  owner_name: string;
  name: string;
  point_count: number;
  first_point_time: string;
  last_point_time: string;
  duration_seconds: number;
}

export interface RecordedLocation_server {
  accuracy: number;
  altitude: number;
  guid: number;
  latitude: number;
  longitude: number;
  pathmeta_id: number;
  speed: number;
  time_gmt: string;
}

export interface NameCheckResponse {
  available: boolean;
}

export interface loginResponse {
  id: number;
  name: string;
  email: string;
  token: string;
}
