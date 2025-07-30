import { ConnectorConfig } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface Album_Key {
  id: UUIDString;
  __typename?: 'Album_Key';
}

export interface ListenEvent_Key {
  id: UUIDString;
  __typename?: 'ListenEvent_Key';
}

export interface PlaylistTrack_Key {
  playlistId: UUIDString;
  trackId: UUIDString;
  __typename?: 'PlaylistTrack_Key';
}

export interface Playlist_Key {
  id: UUIDString;
  __typename?: 'Playlist_Key';
}

export interface Review_Key {
  id: UUIDString;
  __typename?: 'Review_Key';
}

export interface Track_Key {
  id: UUIDString;
  __typename?: 'Track_Key';
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

