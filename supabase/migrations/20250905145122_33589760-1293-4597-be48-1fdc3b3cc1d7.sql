-- Fix Auth OTP expiry security warning by setting shorter OTP expiry
-- Update auth configuration to set OTP expiry to 10 minutes (600 seconds)
UPDATE auth.config 
SET otp_expiry = 600 
WHERE TRUE;