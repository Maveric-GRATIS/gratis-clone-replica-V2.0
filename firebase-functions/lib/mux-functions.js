"use strict";
/**
 * Mux Video API Functions
 * Firebase Cloud Functions for Mux video management
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMuxSignedUrl = exports.addMuxSubtitles = exports.deleteMuxLiveStream = exports.getMuxLiveStream = exports.createMuxLiveStream = exports.deleteMuxAsset = exports.updateMuxAsset = exports.getMuxAsset = exports.createMuxDirectUpload = exports.createMuxAsset = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const mux_node_1 = __importDefault(require("@mux/mux-node"));
// Initialize Mux client
const muxClient = new mux_node_1.default({
    tokenId: functions.config().mux.token_id,
    tokenSecret: functions.config().mux.token_secret,
});
const Video = muxClient.Video;
/**
 * Verify admin role
 */
async function isAdmin(uid) {
    var _a;
    const userDoc = await admin.firestore().collection("users").doc(uid).get();
    return ((_a = userDoc.data()) === null || _a === void 0 ? void 0 : _a.role) === "admin";
}
/**
 * Create Mux asset from URL
 */
exports.createMuxAsset = functions.https.onCall(async (data, context) => {
    var _a, _b;
    // Verify authentication
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "User must be authenticated");
    }
    // Verify admin role
    if (!(await isAdmin(context.auth.uid))) {
        throw new functions.https.HttpsError("permission-denied", "User must be admin");
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
            playback_id: (_b = (_a = asset.playback_ids) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.id,
            status: asset.status,
        };
    }
    catch (error) {
        console.error("Error creating Mux asset:", error);
        throw new functions.https.HttpsError("internal", "Failed to create asset");
    }
});
/**
 * Create direct upload URL
 */
exports.createMuxDirectUpload = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "User must be authenticated");
    }
    if (!(await isAdmin(context.auth.uid))) {
        throw new functions.https.HttpsError("permission-denied", "User must be admin");
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
    }
    catch (error) {
        console.error("Error creating direct upload:", error);
        throw new functions.https.HttpsError("internal", "Failed to create direct upload");
    }
});
/**
 * Get Mux asset
 */
exports.getMuxAsset = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "User must be authenticated");
    }
    if (!(await isAdmin(context.auth.uid))) {
        throw new functions.https.HttpsError("permission-denied", "User must be admin");
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
    }
    catch (error) {
        console.error("Error getting Mux asset:", error);
        throw new functions.https.HttpsError("internal", "Failed to get asset");
    }
});
/**
 * Update Mux asset
 */
exports.updateMuxAsset = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "User must be authenticated");
    }
    if (!(await isAdmin(context.auth.uid))) {
        throw new functions.https.HttpsError("permission-denied", "User must be admin");
    }
    try {
        const { asset_id, updates } = data;
        const asset = await Video.Assets.update(asset_id, updates);
        return {
            id: asset.id,
            status: asset.status,
        };
    }
    catch (error) {
        console.error("Error updating Mux asset:", error);
        throw new functions.https.HttpsError("internal", "Failed to update asset");
    }
});
/**
 * Delete Mux asset
 */
exports.deleteMuxAsset = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "User must be authenticated");
    }
    if (!(await isAdmin(context.auth.uid))) {
        throw new functions.https.HttpsError("permission-denied", "User must be admin");
    }
    try {
        const { asset_id } = data;
        await Video.Assets.del(asset_id);
        return { success: true };
    }
    catch (error) {
        console.error("Error deleting Mux asset:", error);
        throw new functions.https.HttpsError("internal", "Failed to delete asset");
    }
});
/**
 * Create live stream
 */
exports.createMuxLiveStream = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "User must be authenticated");
    }
    if (!(await isAdmin(context.auth.uid))) {
        throw new functions.https.HttpsError("permission-denied", "User must be admin");
    }
    try {
        const { playback_policy, new_asset_settings, reconnect_window, reduced_latency, } = data;
        const stream = await Video.LiveStreams.create({
            playback_policy: [playback_policy || "public"],
            new_asset_settings,
            reconnect_window: reconnect_window || 60,
            reduced_latency: reduced_latency !== null && reduced_latency !== void 0 ? reduced_latency : true,
        });
        return {
            id: stream.id,
            stream_key: stream.stream_key,
            playback_ids: stream.playback_ids,
            status: stream.status,
        };
    }
    catch (error) {
        console.error("Error creating live stream:", error);
        throw new functions.https.HttpsError("internal", "Failed to create live stream");
    }
});
/**
 * Get live stream
 */
exports.getMuxLiveStream = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "User must be authenticated");
    }
    if (!(await isAdmin(context.auth.uid))) {
        throw new functions.https.HttpsError("permission-denied", "User must be admin");
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
    }
    catch (error) {
        console.error("Error getting live stream:", error);
        throw new functions.https.HttpsError("internal", "Failed to get live stream");
    }
});
/**
 * Delete live stream
 */
exports.deleteMuxLiveStream = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "User must be authenticated");
    }
    if (!(await isAdmin(context.auth.uid))) {
        throw new functions.https.HttpsError("permission-denied", "User must be admin");
    }
    try {
        const { stream_id } = data;
        await Video.LiveStreams.del(stream_id);
        return { success: true };
    }
    catch (error) {
        console.error("Error deleting live stream:", error);
        throw new functions.https.HttpsError("internal", "Failed to delete live stream");
    }
});
/**
 * Create asset track (for subtitles/captions)
 */
exports.addMuxSubtitles = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "User must be authenticated");
    }
    if (!(await isAdmin(context.auth.uid))) {
        throw new functions.https.HttpsError("permission-denied", "User must be admin");
    }
    try {
        const { asset_id, language_code, name, url, closed_captions } = data;
        const track = await Video.Assets.createTrack(asset_id, {
            type: "text",
            text_type: "subtitles",
            language_code,
            name,
            url,
            closed_captions: closed_captions !== null && closed_captions !== void 0 ? closed_captions : false,
        });
        return {
            id: track.id,
            type: track.type,
            language_code: track.language_code,
        };
    }
    catch (error) {
        console.error("Error adding subtitles:", error);
        throw new functions.https.HttpsError("internal", "Failed to add subtitles");
    }
});
/**
 * Generate signed playback token (for private videos)
 */
exports.generateMuxSignedUrl = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "User must be authenticated");
    }
    try {
        const { playback_id, expires_in } = data;
        // Create JWT for signed playback
        const jwt = require("jsonwebtoken");
        const signingKey = functions.config().mux.signing_key;
        const signingKeyId = functions.config().mux.signing_key_id;
        if (!signingKey || !signingKeyId) {
            throw new functions.https.HttpsError("failed-precondition", "Mux signing keys not configured");
        }
        const token = jwt.sign({
            sub: playback_id,
            aud: "v",
            exp: Math.floor(Date.now() / 1000) + (expires_in || 3600),
            kid: signingKeyId,
        }, Buffer.from(signingKey, "base64"), { algorithm: "RS256" });
        return {
            signed_url: `https://stream.mux.com/${playback_id}.m3u8?token=${token}`,
            token,
        };
    }
    catch (error) {
        console.error("Error generating signed URL:", error);
        throw new functions.https.HttpsError("internal", "Failed to generate signed URL");
    }
});
//# sourceMappingURL=mux-functions.js.map