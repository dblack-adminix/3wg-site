-- Add ip_address column to vpn_keys table
ALTER TABLE vpn_keys ADD COLUMN IF NOT EXISTS ip_address VARCHAR(15) NOT NULL DEFAULT '10.0.0.2';

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_vpn_keys_server_ip ON vpn_keys(server_id, ip_address);
