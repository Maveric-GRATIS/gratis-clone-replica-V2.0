/**
 * Mux Video API Functions
 * Firebase Cloud Functions for Mux video management
 */

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import Mux from "@mux/mux-node";

// Initialize Mux client
const muxClient = new Mux({
  tokenId: functions.config().mux.token_id,
  tokenSecret: functions.config().mux.token_secret,
});

const Video = (muxClient as any).Video;

/**
 * Verify admin role
 */
async function isAdmin(uid: string): Promise<boolean> {
  const userDoc = await admin.firestore().collection("users").doc(uid).get();
  return userDoc.data()?.role === "admin";
}

/**
 * Create Mux asset from URL
 */
export const createMuxAsset = functions.https.onCall(
  async (data, context) => {
    // Verify authentication
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "User must be authenticated"
      );
    }

    // Verify admin role
    if (!(await isAdmin(context.auth.uid))) {
      throw new functions.https.HttpsError(
        "permission-denied",
        "User must be admin"
      );
    }

    try {
      const { url, metadata, playback_policy } = data;

      // Create Mux asset
      const asset = await Video.Assets.create({
        input: url,
        playback_policy: [playback_policy || "public"],
        mp4_support: "standard",
        master_access: "temporary",
        passthrough: JSON.stringify(metadata),
      });

      return {
        asset_id: asset.id,
        playback_id: asset.playback_ids?.[0]?.id,
        status: asset.status,
      };
    } catch (error) {
      console.error("Error creating Mux asset:", error);
      throw new functions.https.HttpsError("internal", "Failed to create asset");
    }
  }
);

/**
 * Create direct upload URL
 */
export const createMuxDirectUpload = functions.https.onCall(
  async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "User must be authenticated"
      );
    }

    if (!(await isAdmin(context.auth.uid))) {
      throw new functions.https.HttpsError(
        "permission-denied",
        "User must be admin"
      );
    }

    try {
      const { metadata, playback_policy, new_asset_settings } = data;

      const upload = await Video.Uploads.create({
        new_asset_settings: new_asset_settings || {
          playback_policy: [playback_policy || "public"],
          mp4_support: "standard",
        },
        cors_origin: "*",
        passthrough: JSON.stringify(metadata),
      });

      return {
        id: upload.id,
        url: upload.url,
        asset_id: upload.asset_id,
        status: upload.status,
      };
    } catch (error) {
      console.error("Error creating direct upload:", error);
      throw new functions.https.HttpsError(
        "internal",
        "Failed to create direct upload"
      );
    }
  }
);

/**
 * Get Mux asset
 */
export const getMuxAsset = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be authenticated"
    );
  }

  if (!(await isAdmin(context.auth.uid))) {
    throw new functions.https.HttpsError(
      "permission-denied",
      "User must be admin"
    );
  }

  try {
    const { asset_id } = data;
    const asset = await Video.Assets.get(asset_id);

    return {
      id: asset.id,
      status: asset.status,
      duration: asset.duration,
      aspect_ratio: asset.aspect_ratio,
      playback_ids: asset.playback_ids,
      created_at: asset.created_at,
      max_stored_resolution: asset.max_stored_resolution,
      max_stored_frame_rate: asset.max_stored_frame_rate,
      tracks: asset.tracks,
    };
  } catch (error) {
    console.error("Error getting Mux asset:", error);
    throw new functions.https.HttpsError("internal", "Failed to get asset");
  }
});

/**
 * Update Mux asset
 */
export const updateMuxAsset = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be authenticated"
    );
  }

  if (!(await isAdmin(context.auth.uid))) {
    throw new functions.https.HttpsError(
      "permission-denied",
      "User must be admin"
    );
  }

  try {
    const { asset_id, updates } = data;
    const asset = await Video.Assets.update(asset_id, updates);

    return {
      id: asset.id,
      status: asset.status,
    };
  } catch (error) {
    console.error("Error updating Mux asset:", error);
    throw new functions.https.HttpsError("internal", "Failed to update asset");
  }
});

/**
 * Delete Mux asset
 */
export const deleteMuxAsset = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be authenticated"
    );
  }

  if (!(await isAdmin(context.auth.uid))) {
    throw new functions.https.HttpsError(
      "permission-denied",
      "User must be admin"
    );
  }

  try {
    const { asset_id } = data;
    await Video.Assets.del(asset_id);

    return { success: true };
  } catch (error) {
    console.error("Error deleting Mux asset:", error);
    throw new functions.https.HttpsError("internal", "Failed to delete asset");
  }
});

/**
 * Create live stream
 */
export const createMuxLiveStream = functions.https.onCall(
  async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "User must be authenticated"
      );
    }

    if (!(await isAdmin(context.auth.uid))) {
      throw new functions.https.HttpsError(
        "permission-denied",
        "User must be admin"
      );
    }

    try {
      const {
        playback_policy,
        new_asset_settings,
        reconnect_window,
        reduced_latency,
      } = data;

      const stream = await Video.LiveStreams.create({
        playback_policy: [playback_policy || "public"],
        new_asset_settings,
        reconnect_window: reconnect_window || 60,
        reduced_latency: reduced_latency ?? true,
      });

      return {
        id: stream.id,
        stream_key: stream.stream_key,
        playback_ids: stream.playback_ids,
        status: stream.status,
      };
    } catch (error) {
      console.error("Error creating live stream:", error);
      throw new functions.https.HttpsError(
        "internal",
        "Failed to create live stream"
      );
    }
  }
);

/**
 * Get live stream
 */
export const getMuxLiveStream = functions.https.onCall(
  async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "User must be authenticated"
      );
    }

    if (!(await isAdmin(context.auth.uid))) {
      throw new functions.https.HttpsError(
        "permission-denied",
        "User must be admin"
      );
    }

    try {
      const { stream_id } = data;
      const stream = await Video.LiveStreams.get(stream_id);

      return {
        id: stream.id,
        status: stream.status,
        stream_key: stream.stream_key,
        playback_ids: stream.playback_ids,
        reconnect_window: stream.reconnect_window,
        recent_asset_ids: stream.recent_asset_ids,
      };
    } catch (error) {
      console.error("Error getting live stream:", error);
      throw new functions.https.HttpsError(
        "internal",
        "Failed to get live stream"
      );
    }
  }
);

/**
 * Delete live stream
 */
export const deleteMuxLiveStream = functions.https.onCall(
  async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "User must be authenticated"
      );
    }

    if (!(await isAdmin(context.auth.uid))) {
      throw new functions.https.HttpsError(
        "permission-denied",
        "User must be admin"
      );
    }

    try {
      const { stream_id } = data;
      await Video.LiveStreams.del(stream_id);

      return { success: true };
    } catch (error) {
      console.error("Error deleting live stream:", error);
      throw new functions.https.HttpsError(
        "internal",
        "Failed to delete live stream"
      );
    }
  }
);

/**
 * Create asset track (for subtitles/captions)
 */
export const addMuxSubtitles = functions.https.onCall(
  async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "User must be authenticated"
      );
    }

    if (!(await isAdmin(context.auth.uid))) {
      throw new functions.https.HttpsError(
        "permission-denied",
        "User must be admin"
      );
    }

    try {
      const { asset_id, language_code, name, url, closed_captions } = data;

      const track = await Video.Assets.createTrack(asset_id, {
        type: "text",
        text_type: "subtitles",
        language_code,
        name,
        url,
        closed_captions: closed_captions ?? false,
      });

      return {
        id: track.id,
        type: track.type,
        language_code: track.language_code,
      };
    } catch (error) {
      console.error("Error adding subtitles:", error);
      throw new functions.https.HttpsError(
        "internal",
        "Failed to add subtitles"
      );
    }
  }
);

/**
 * Generate signed playback token (for private videos)
 */
export const generateMuxSignedUrl = functions.https.onCall(
  async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "User must be authenticated"
      );
    }

    try {
      const { playback_id, expires_in } = data;

      // Create JWT for signed playback
      const jwt = require("jsonwebtoken");
      const signingKey = functions.config().mux.signing_key;
      const signingKeyId = functions.config().mux.signing_key_id;

      if (!signingKey || !signingKeyId) {
        throw new functions.https.HttpsError(
          "failed-precondition",
          "Mux signing keys not configured"
        );
      }

      const token = jwt.sign(
        {
          sub: playback_id,
          aud: "v",
          exp: Math.floor(Date.now() / 1000) + (expires_in || 3600),
          kid: signingKeyId,
        },
        Buffer.from(signingKey, "base64"),
        { algorithm: "RS256" }
      );

      return {
        signed_url: `https://stream.mux.com/${playback_id}.m3u8?token=${token}`,
        token,
      };
    } catch (error) {
      console.error("Error generating signed URL:", error);
      throw new functions.https.HttpsError(
        "internal",
        "Failed to generate signed URL"
      );
    }
  }
);
